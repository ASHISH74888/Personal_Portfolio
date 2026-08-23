import nodemailer from "nodemailer";

/* Minimal shapes for Vercel's Node runtime. Hand-rolled rather than pulled from
   `@vercel/node`, which drags a large dependency tree in just for types. */
interface Req {
  method?: string;
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
}
interface Res {
  status(code: number): Res;
  json(body: unknown): void;
  setHeader(name: string, value: string): void;
}

const LIMITS = { name: 100, email: 200, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Best-effort throttle. Serverless instances are ephemeral and horizontally
   scaled, so this slows a single noisy client rather than enforcing a global
   quota — the honeypot does the heavier lifting against bots. */
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const hits = new Map<string, number[]>();

const isRateLimited = (ip: string, now: number): boolean => {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
};

const asString = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

export default async function handler(req: Req, res: Res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const body: Record<string, unknown> =
    typeof req.body === "string"
      ? safeParse(req.body)
      : ((req.body as Record<string, unknown>) ?? {});

  // Honeypot: bots fill it, the real form leaves it empty. Report success so
  // they don't learn they were filtered.
  if (asString(body.botcheck)) return res.status(200).json({ ok: true });

  const name = asString(body.name);
  const email = asString(body.email);
  const message = asString(body.message);

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email and message are all required." });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "That email address doesn't look right." });
  }
  if (
    name.length > LIMITS.name ||
    email.length > LIMITS.email ||
    message.length > LIMITS.message
  ) {
    return res.status(400).json({ error: "That message is longer than the form accepts." });
  }

  const forwarded = req.headers["x-forwarded-for"];
  const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded ?? "")
    .split(",")[0]
    .trim();
  if (ip && isRateLimited(ip, Date.now())) {
    return res.status(429).json({ error: "Too many messages just now. Try again shortly." });
  }

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) {
    console.error("[contact] SMTP_USER / SMTP_PASS are not configured.");
    return res.status(500).json({ error: "The form isn't configured yet. Email me directly." });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      // Gmail rejects a `from` that isn't the authenticated account, so the
      // visitor's address goes in `replyTo` instead.
      from: `"Portfolio" <${user}>`,
      to: process.env.CONTACT_TO || user,
      replyTo: `"${name}" <${email}>`,
      subject: `Portfolio enquiry from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `<p><strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt;</p>
<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    });
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("[contact] sendMail failed:", error);
    return res.status(502).json({ error: "The message couldn't be delivered. Try again later." });
  }
}

function safeParse(raw: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

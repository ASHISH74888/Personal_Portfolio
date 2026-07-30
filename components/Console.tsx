import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PERSONAL_INFO, PROJECTS, EXPERIENCE, SKILLS } from "../constants";

/* ============================================================
   ./interview.sh — an interactive terminal that flips the
   interview. Visitors type commands to explore, and `bigo`
   launches a Big-O complexity challenge — the candidate's
   terminal quizzes the interviewer. Coder-native, on-brand.
   ============================================================ */

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

type Line = { id: number; node: React.ReactNode };

/* ---- the Big-O challenge bank ---------------------------- */
type Question = {
  code: string;
  options: string[];
  answer: number;
  why: string;
};

const QUESTIONS: Question[] = [
  {
    code: `for (let i = 0; i < n; i++) {\n  total += arr[i]\n}`,
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    answer: 2,
    why: "One pass over n elements — linear time.",
  },
  {
    code: `for (let i = 0; i < n; i++)\n  for (let j = 0; j < n; j++)\n    grid[i][j] = i * j`,
    options: ["O(n)", "O(n²)", "O(2ⁿ)", "O(n log n)"],
    answer: 1,
    why: "A loop nested inside a loop, each running n times → n × n.",
  },
  {
    code: `while (n > 1) {\n  n = Math.floor(n / 2)\n}`,
    options: ["O(n)", "O(1)", "O(log n)", "O(√n)"],
    answer: 2,
    why: "Halving each step means ~log₂(n) iterations.",
  },
  {
    code: `function fib(n) {\n  if (n < 2) return n\n  return fib(n - 1) + fib(n - 2)\n}`,
    options: ["O(n)", "O(n²)", "O(2ⁿ)", "O(log n)"],
    answer: 2,
    why: "Two branching recursive calls per level — exponential. (Memoise it!)",
  },
  {
    code: `const seen = new Set()\nfor (const x of arr) {\n  if (seen.has(x)) return true\n  seen.add(x)\n}`,
    options: ["O(n²)", "O(n)", "O(log n)", "O(1)"],
    answer: 1,
    why: "One pass; Set lookups are ~O(1), so the whole thing is linear.",
  },
  {
    code: `let lo = 0, hi = a.length - 1\nwhile (lo <= hi) {\n  const mid = (lo + hi) >> 1\n  if (a[mid] === t) return mid\n  a[mid] < t ? (lo = mid + 1) : (hi = mid - 1)\n}`,
    options: ["O(n)", "O(n log n)", "O(log n)", "O(1)"],
    answer: 2,
    why: "Binary search — the search space halves every iteration.",
  },
];

const QN = QUESTIONS.length;

/* ---- command registry (for help + completion) ------------ */
const COMMANDS: [string, string][] = [
  ["bigo", "▶ play — I'll quiz YOU on Big-O"],
  ["whoami", "who is Ashish"],
  ["skills", "the stack"],
  ["projects", "things I've built"],
  ["experience", "where I've worked"],
  ["contact", "how to reach me"],
  ["resume", "open my résumé"],
  ["help", "list commands"],
  ["clear", "clear the screen"],
];
const COMPLETIONS = [
  ...COMMANDS.map((c) => c[0]),
  "about",
  "hire",
  "socials",
  "ls",
];

/* small building blocks ------------------------------------ */
const P: React.FC<{ children: React.ReactNode; c?: string }> = ({
  children,
  c = "text-paper/70",
}) => <div className={`${c} leading-relaxed`}>{children}</div>;

const Console: React.FC = () => {
  const boot: Line[] = useMemo(
    () => [
      {
        id: 0,
        node: (
          <div className="text-paper/70 leading-relaxed">
            <div className="text-paper/85">
              ashish@dev · interactive shell{" "}
              <span className="text-paper/40">v1.0</span>
            </div>
            <div className="text-paper/30">
              ─────────────────────────────────────
            </div>
            <div>
              You found the terminal. Type{" "}
              <span className="text-rust">help</span> to look around.
            </div>
            <div>
              New here? Run <span className="text-rust">bigo</span> — I'll
              interview <span className="italic text-paper">you</span> for a
              change.
            </div>
          </div>
        ),
      },
    ],
    [],
  );

  const [history, setHistory] = useState<Line[]>(boot);
  const [input, setInput] = useState("");
  const [cmdLog, setCmdLog] = useState<string[]>([]);
  const [logIdx, setLogIdx] = useState(-1);

  // game state
  const [gameOn, setGameOn] = useState(false);
  const [qi, setQi] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const idRef = useRef(1);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const push = (node: React.ReactNode) =>
    setHistory((h) => [...h, { id: idRef.current++, node }]);

  // keep scrolled to the newest line / game state
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [history, gameOn, qi, answered]);

  /* ---- shell commands ------------------------------------ */
  const run = (raw: string) => {
    const cmd = raw.trim();
    // echo the prompt line
    push(
      <div className="flex items-center gap-2">
        <span className="text-olive">visitor@ashish.dev</span>
        <span className="text-paper/40">:</span>
        <span className="text-rust">~</span>
        <span className="text-paper/40">$</span>
        <span className="text-paper">{raw}</span>
      </div>,
    );
    if (cmd) {
      setCmdLog((l) => [...l, cmd]);
      setLogIdx(-1);
    }

    const c = cmd.toLowerCase();

    switch (c) {
      case "":
        break;

      case "help":
        push(
          <div className="grid grid-cols-[7.5rem_1fr] gap-x-4 gap-y-1">
            {COMMANDS.map(([name, desc]) => (
              <React.Fragment key={name}>
                <span className="text-rust">{name}</span>
                <span className="text-paper/55">{desc}</span>
              </React.Fragment>
            ))}
          </div>,
        );
        break;

      case "whoami":
      case "about":
        push(
          <div className="border-l-2 border-rust/50 pl-4 space-y-1.5">
            <P c="text-paper">{PERSONAL_INFO.name} — Software Engineer</P>
            <P>{PERSONAL_INFO.summary}</P>
            <P c="text-paper/40">📍 {PERSONAL_INFO.location}</P>
          </div>,
        );
        break;

      case "skills":
        push(
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
            {SKILLS.map((s) => (
              <div key={s.category}>
                <div className="text-rust text-[11px] uppercase tracking-wider mb-1">
                  {s.category}
                </div>
                <div className="text-paper/70">{s.items.join(" · ")}</div>
              </div>
            ))}
          </div>,
        );
        break;

      case "projects":
        push(
          <div className="space-y-3">
            {PROJECTS.map((p) => (
              <div key={p.name} className="border-l-2 border-paper/15 pl-4">
                <div className="text-paper">
                  <span className="text-rust">▸</span> {p.name}{" "}
                  <span className="text-paper/40">· {p.role}</span>
                </div>
                <P c="text-paper/55">{p.description}</P>
                <div className="text-paper/40 text-[11px] mt-0.5">
                  {p.tech.join(" · ")}
                </div>
              </div>
            ))}
          </div>,
        );
        break;

      case "experience":
        push(
          <div className="space-y-3">
            {EXPERIENCE.map((e) => (
              <div key={e.company} className="border-l-2 border-paper/15 pl-4">
                <div className="text-paper">
                  <span className="text-rust">{e.role}</span> @ {e.company}
                </div>
                <div className="text-paper/40 text-[11px]">
                  {e.period} · {e.location}
                </div>
                <P c="text-paper/55">{e.description[0]}</P>
              </div>
            ))}
          </div>,
        );
        break;

      case "contact":
      case "hire":
      case "socials":
        push(
          <div className="space-y-1">
            <P>
              <span className="text-rust w-16 inline-block">email</span>
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="text-paper underline decoration-paper/30 hover:decoration-rust"
              >
                {PERSONAL_INFO.email}
              </a>
            </P>
            {PERSONAL_INFO.socials.map((s) => (
              <P key={s.name}>
                <span className="text-rust w-16 inline-block lowercase">
                  {s.name}
                </span>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-paper underline decoration-paper/30 hover:decoration-rust"
                >
                  {s.url.replace(/^https?:\/\//, "").slice(0, 42)}…
                </a>
              </P>
            ))}
          </div>,
        );
        break;

      case "resume": {
        const r = PERSONAL_INFO.socials.find((s) => s.name === "Resume");
        push(<P c="text-paper/70">opening résumé → {r?.url}</P>);
        if (r) window.open(r.url, "_blank", "noopener");
        break;
      }

      case "clear":
        setHistory(boot);
        setInput("");
        return;

      case "ls":
        push(
          <P c="text-paper/60">
            about skills projects experience contact{" "}
            <span className="text-rust">bigo*</span>
          </P>,
        );
        break;

      case "bigo":
      case "play":
        setScore(0);
        setQi(0);
        setPicked(null);
        setAnswered(false);
        setGameOn(true);
        push(
          <P c="text-paper/60">
            booting <span className="text-rust">bigo</span> — {QN} snippets.
            guess the time complexity. good luck. 😏
          </P>,
        );
        setInput("");
        return;

      case "sudo hire":
      case "sudo hire ashish":
        push(
          <P c="text-olive">
            [sudo] access granted. excellent choice. →{" "}
            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              className="text-paper underline"
            >
              {PERSONAL_INFO.email}
            </a>
          </P>,
        );
        break;

      case "rm -rf /":
      case "rm -rf /*":
        push(
          <P c="text-rust">
            nice try. this portfolio is immutable. (and backed up.) 🧱
          </P>,
        );
        break;

      case "whoareyou":
      case "date":
        push(<P c="text-paper/60">a good time to hire a backend engineer.</P>);
        break;

      default:
        push(
          <P c="text-rust">
            command not found: {cmd}. try{" "}
            <span className="text-paper">help</span>.
          </P>,
        );
    }

    setInput("");
  };

  /* ---- the game ------------------------------------------ */
  const answer = (i: number) => {
    if (answered) return;
    setPicked(i);
    setAnswered(true);
    if (i === QUESTIONS[qi].answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (qi + 1 < QN) {
      setQi((n) => n + 1);
      setPicked(null);
      setAnswered(false);
    } else {
      const finalScore = score;
      setGameOn(false);
      const verdict =
        finalScore === QN
          ? "flawless. you'd pass my systems round. 🏆"
          : finalScore >= QN - 2
            ? "sharp. we'd get along. 👏"
            : "worth a refresher — but you showed up, and that counts.";
      push(
        <P c="text-paper/70">
          game over — you scored{" "}
          <span className="text-rust">
            {finalScore}/{QN}
          </span>
          . {verdict} type <span className="text-paper">bigo</span> to replay.
        </P>,
      );
    }
  };

  const quitGame = () => {
    setGameOn(false);
    push(<P c="text-paper/50">bigo session ended.</P>);
  };

  // keyboard controls during the game (1–4 / n / q)
  useEffect(() => {
    if (!gameOn) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key >= "1" && e.key <= "4") answer(Number(e.key) - 1);
      else if (e.key.toLowerCase() === "n" && answered) next();
      else if (e.key.toLowerCase() === "q") quitGame();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOn, answered, qi, score]);

  /* ---- input key handling -------------------------------- */
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      run(input);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const hit = COMPLETIONS.find((c) => c.startsWith(input.trim()));
      if (hit) setInput(hit);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (logIdx < cmdLog.length - 1) {
        const ni = logIdx + 1;
        setLogIdx(ni);
        setInput(cmdLog[cmdLog.length - 1 - ni]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (logIdx > 0) {
        const ni = logIdx - 1;
        setLogIdx(ni);
        setInput(cmdLog[cmdLog.length - 1 - ni]);
      } else {
        setLogIdx(-1);
        setInput("");
      }
    }
  };

  const q = QUESTIONS[qi];

  return (
    <section
      id="console"
      className="relative bg-ink text-paper py-28 md:py-36 overflow-hidden"
    >
      {/* faint terminal grid wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-5 md:px-8">
        {/* header */}
        <div className="flex items-center gap-4 mb-8">
          <span className="kicker text-rust">No.01</span>
          <span className="h-px w-12 bg-paper/25" />
          <span className="kicker text-paper/60">The console</span>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="font-display text-4xl md:text-[3.4rem] leading-[1.02] font-medium text-paper mb-4"
        >
          Now it's <span className="italic font-normal text-rust">my</span>{" "}
          turn to interview you.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="text-paper/55 max-w-xl mb-10"
        >
          A real shell. Poke around, or run{" "}
          <span className="font-mono text-rust">bigo</span> and let me quiz you
          on time complexity — the way an interviewer would.
        </motion.p>

        {/* terminal window */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, ease: EASE }}
          className="relative border border-paper/12 bg-ink/70 shadow-[0_40px_90px_-50px_rgba(0,0,0,0.9)]"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-paper/15" />

          {/* title bar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-paper/12">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-paper/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-paper/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-rust/70" />
            </span>
            <span className="font-mono text-[11px] tracking-wide text-paper/45">
              visitor@ashish.dev: ~ — bash
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55">
              <span className="h-1.5 w-1.5 rounded-full bg-rust animate-pulse" />
              live
            </span>
          </div>

          {/* body */}
          <div
            ref={bodyRef}
            onClick={() => !gameOn && inputRef.current?.focus()}
            className="custom-scrollbar h-[26rem] md:h-[30rem] overflow-y-auto px-4 md:px-6 py-4 font-mono text-[12.5px] md:text-[13px] leading-relaxed cursor-text"
          >
            {/* history */}
            <div className="space-y-2">
              {history.map((l) => (
                <div key={l.id}>{l.node}</div>
              ))}
            </div>

            {/* live game panel */}
            {gameOn && (
              <div className="mt-4 border border-paper/15 bg-paper/[0.03] p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-rust text-[11px] uppercase tracking-wider">
                    bigo · question {qi + 1}/{QN}
                  </span>
                  <span className="text-paper/45 text-[11px]">
                    score {score} · press q to quit
                  </span>
                </div>

                <div className="text-paper/50 mb-2">
                  {"// what's the time complexity?"}
                </div>
                <pre className="bg-ink/60 border border-paper/10 p-3 text-paper/90 overflow-x-auto whitespace-pre">
                  {q.code}
                </pre>

                <div className="mt-3 grid sm:grid-cols-2 gap-2">
                  {q.options.map((opt, i) => {
                    const isCorrect = i === q.answer;
                    const state = !answered
                      ? "idle"
                      : isCorrect
                        ? "correct"
                        : i === picked
                          ? "wrong"
                          : "dim";
                    return (
                      <button
                        key={opt}
                        onClick={() => answer(i)}
                        disabled={answered}
                        className={`flex items-center gap-2 border px-3 py-2 text-left transition-colors ${
                          state === "idle"
                            ? "border-paper/15 hover:border-rust hover:bg-rust/10 text-paper/85"
                            : state === "correct"
                              ? "border-olive bg-olive/15 text-paper"
                              : state === "wrong"
                                ? "border-rust bg-rust/15 text-paper"
                                : "border-paper/10 text-paper/35"
                        }`}
                      >
                        <span className="text-paper/40">{i + 1}</span>
                        <span>{opt}</span>
                        {answered && isCorrect && (
                          <span className="ml-auto text-olive">✓</span>
                        )}
                        {answered && state === "wrong" && (
                          <span className="ml-auto text-rust">✗</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {answered && (
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <span
                      className={
                        picked === q.answer ? "text-olive" : "text-rust"
                      }
                    >
                      {picked === q.answer ? "✓ correct." : "✗ not quite."}
                    </span>
                    <span className="text-paper/55">{q.why}</span>
                    <button
                      onClick={next}
                      className="ml-auto border border-paper/20 px-3 py-1 text-paper/80 hover:border-rust hover:text-paper transition-colors"
                    >
                      {qi + 1 < QN ? "next → (n)" : "finish → (n)"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* prompt (hidden during game) */}
            {!gameOn && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-olive">visitor@ashish.dev</span>
                <span className="text-paper/40">:</span>
                <span className="text-rust">~</span>
                <span className="text-paper/40">$</span>
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    spellCheck={false}
                    autoComplete="off"
                    aria-label="terminal input"
                    className="w-full bg-transparent outline-none text-paper caret-transparent"
                  />
                  <span
                    className="caret-blink pointer-events-none absolute top-1/2 -translate-y-1/2 h-[1.05em] w-[0.55ch] bg-rust"
                    style={{ left: `${input.length}ch` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* status footer */}
          <div className="flex items-center justify-between gap-4 px-4 md:px-6 py-2.5 border-t border-paper/12 font-mono text-[10px] text-paper/45">
            <span>
              <span className="text-rust">↑↓</span> history ·{" "}
              <span className="text-rust">tab</span> complete
            </span>
            <span className="hidden sm:inline">
              try: whoami · projects · bigo
            </span>
          </div>
        </motion.div>

        {/* quick-run chips (great on mobile) */}
        <div className="mt-5 flex flex-wrap gap-2">
          {["bigo", "whoami", "skills", "projects", "contact"].map((cmd) => (
            <button
              key={cmd}
              onClick={() => {
                run(cmd);
                inputRef.current?.focus();
              }}
              className="font-mono text-[11px] text-paper/60 border border-paper/15 px-3 py-1.5 hover:border-rust hover:text-paper transition-colors"
            >
              <span className="text-rust/70 mr-1.5">$</span>
              {cmd}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Console;

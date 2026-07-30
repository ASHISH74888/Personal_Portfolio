import React, { useState } from "react";
import Section from "./Section";
import { PERSONAL_INFO } from "../constants";
import { SectionHeading, FadeUp } from "./Editorial";
import { Copy, Check, ArrowRight } from "lucide-react";

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      window.location.href = `mailto:${PERSONAL_INFO.email}?subject=Message from ${formState.name}&body=${formState.message}`;
      setIsSubmitting(false);
      setFormState({ name: "", email: "", message: "" });
    }, 800);
  };

  return (
    <Section id="contact">
      <SectionHeading
        index="06"
        kicker="Correspondence"
        title={
          <>
            Let's <span className="italic font-normal text-rust">talk</span>.
          </>
        }
      />

      <div className="grid lg:grid-cols-2 gap-14 md:gap-24 mt-14 items-start">
        {/* Details */}
        <FadeUp>
          <p className="text-lg text-ink-soft leading-relaxed max-w-md mb-12">
            Have a project in mind, a role to fill, or just want to compare
            notes on distributed systems? The line is open.
          </p>

          <dl className="space-y-8">
            <div className="border-t border-ink/15 pt-4">
              <dt className="meta mb-2">Email</dt>
              <dd className="flex items-center gap-3">
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="link-underline font-display text-xl md:text-2xl text-ink"
                >
                  {PERSONAL_INFO.email}
                </a>
                <button
                
                  onClick={handleCopyEmail}
                  className="text-ink-faint hover:text-rust transition-colors"
                  aria-label="Copy email"
                >
                  {isCopied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </dd>
            </div>

            {/* <div className="border-t border-ink/15 pt-4">
              <dt className="meta mb-2">Telephone</dt>
              <dd>
                <a
                  href={`tel:${PERSONAL_INFO.phone}`}
                  className="link-underline font-display text-xl md:text-2xl text-ink"
                >
                  {PERSONAL_INFO.phone}
                </a>
              </dd>
            </div> */}

            <div className="border-t border-ink/15 pt-4">
              <dt className="meta mb-2">Located</dt>
              <dd className="font-display text-xl md:text-2xl text-ink">
                {PERSONAL_INFO.location}
              </dd>
            </div>

            <div className="border-t border-ink/15 pt-4">
              <dt className="meta mb-3">Elsewhere</dt>
              <dd className="flex flex-wrap gap-x-6 gap-y-2">
                {PERSONAL_INFO.socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-ink-soft"
                  >
                    {social.name}
                  </a>
                ))}
              </dd>
            </div>
          </dl>
        </FadeUp>

        {/* Form */}
        <FadeUp delay={0.12}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="meta">
                Your name
              </label>
              <input
                type="text"
                id="name"
                required
                value={formState.name}
                onChange={(e) =>
                  setFormState({ ...formState, name: e.target.value })
                }
                className="field w-full"
                placeholder="Jane Developer"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="meta">
                Your email
              </label>
              <input
                type="email"
                id="email"
                required
                value={formState.email}
                onChange={(e) =>
                  setFormState({ ...formState, email: e.target.value })
                }
                className="field w-full"
                placeholder="jane@example.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="meta">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={4}
                value={formState.message}
                onChange={(e) =>
                  setFormState({ ...formState, message: e.target.value })
                }
                className="field w-full resize-none"
                placeholder="Tell me a little about it…"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group self-start inline-flex items-center gap-2 border border-ink px-7 py-3 text-ink hover:bg-ink hover:text-paper transition-colors duration-300 disabled:opacity-60"
            >
              {isSubmitting ? "Sending…" : "Send message"}
              {!isSubmitting && (
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              )}
            </button>
          </form>
        </FadeUp>
      </div>
    </Section>
  );
};

export default Contact;

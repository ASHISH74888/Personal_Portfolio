import React from "react";
import { motion } from "framer-motion";
import { PERSONAL_INFO } from "../constants";
import { Reveal } from "./Editorial";
import { Parallax } from "./Parallax";
import CodePlate from "./CodePlate";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface HeroProps {
  heroRef: React.RefObject<HTMLDivElement>;
}

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const TICKER = [
  "The Field Notes — Vol. 01",
  "Full-stack @ Praan.inc",
  "Backend & distributed systems",
  "Kafka · Elasticsearch · MQTT · Redis",
  "Based in Mumbai, IN",
  "Open to remote",
];

/* A registration tick for the hero corners */
const Tick: React.FC<{ className?: string }> = ({ className = "" }) => (
  <span className={`absolute h-3 w-3 ${className}`} aria-hidden>
    <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-ink/30" />
    <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-ink/30" />
  </span>
);

const Hero: React.FC<HeroProps> = ({ heroRef }) => {
  return (
    <header
      ref={heroRef}
      className="relative max-w-6xl mx-auto px-5 md:px-8 pt-28 md:pt-32 pb-16"
    >
      {/* Corner registration ticks */}
      <Tick className="left-4 top-24 md:left-7 md:top-28 hidden sm:block" />
      <Tick className="right-4 top-24 md:right-7 md:top-28 hidden sm:block" />

      {/* Newspaper masthead ticker */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="marquee-track marquee-mask overflow-hidden border-y border-ink/15 mb-10 md:mb-12"
      >
        <div className="marquee py-2.5">
          {[0, 1].map((k) => (
            <div key={k} className="flex items-center">
              {TICKER.map((t, i) => (
                <span key={i} className="flex items-center">
                  <span className="meta whitespace-nowrap uppercase">{t}</span>
                  <span className="text-rust mx-5">✳</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Masthead rule + edition line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, ease: EASE, delay: 0.2 }}
        className="origin-left h-px bg-ink/25 mb-4"
      />
      <div className="flex items-center justify-between gap-4 mb-12 md:mb-16">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.35 }}
          className="status-pill"
        >
          <span className="status-dot" />
          <span className="meta uppercase !text-ink">
            Available for work · 2026
          </span>
        </motion.span>
        <span className="kicker hidden sm:inline">
          {PERSONAL_INFO.location} 
        </span>
      </div>

      <div className="relative grid lg:grid-cols-[1.35fr_0.65fr] gap-12 lg:gap-16 items-start">
        {/* Faint modern guide grid behind the headline */}
        <div className="hero-grid hidden md:block" />

        {/* Headline column */}
        <div className="relative">
          {/* Shell-prompt tag — bridges the editorial headline with the
              coder identity used across the rest of the site */}
          <Reveal delay={0.1}>
            <span className="inline-flex items-center gap-2 font-mono text-[11px] md:text-xs text-ink-faint mb-6">
              <span className="text-rust">$</span>
              <span className="text-ink-soft">whoami</span>
              <span className="text-ink-faint">
                → {PERSONAL_INFO.name.split(" ")[0]}, software engineer
              </span>
              <span className="caret-blink inline-block h-[1em] w-[0.5ch] translate-y-[0.1em] bg-rust" />
            </span>
          </Reveal>

          <h1 className="font-display font-medium text-ink leading-[0.92] tracking-tightest text-[3.6rem] sm:text-7xl md:text-[6.75rem]">
            <Reveal delay={0.2}>
              <span className="block">Building</span>
            </Reveal>
            <Reveal delay={0.32}>
              <span className="block">software that</span>
            </Reveal>
            <Reveal delay={0.44}>
              <span className="relative inline-block italic font-normal text-rust">
                scales quietly.
                {/* Hand-drawn underline strokes itself in */}
                <svg
                  className="absolute left-0 -bottom-3 w-full"
                  height="14"
                  viewBox="0 0 340 14"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <path
                    className="underline-draw"
                    d="M3 8 C 70 3, 150 12, 210 6 S 320 3, 337 7"
                  />
                </svg>
              </span>
            </Reveal>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.7 }}
            className="mt-10 max-w-xl text-lg md:text-xl text-ink-soft leading-relaxed"
          >
            A full-stack engineer working close to the metal — event-driven
            systems, sharp backends, and interfaces built with the same care
            as a printed page.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.9 }}
            className="mt-11 flex flex-wrap items-center gap-x-6 gap-y-4"
          >
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("projects")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn-fill group inline-flex items-center gap-2 border border-ink px-7 py-3.5 text-ink hover:text-paper"
            >
              View selected work
              <ArrowDownRight
                size={18}
                className="group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform"
              />
            </a>
            <a
              href="#console"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("console")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group inline-flex items-center gap-2 px-2 py-3.5 text-ink link-underline"
            >
              Try the console
              <ArrowUpRight
                size={18}
                className="text-rust group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </a>
          </motion.div>

          {/* Socials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 1 }}
            className="mt-8 flex items-center gap-5"
          >
            {PERSONAL_INFO.socials.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline meta uppercase text-ink-soft"
              >
                {s.name}
              </a>
            ))}
          </motion.div>
        </div>

        {/* Fig. 01 — code specimen plate */}
        <Parallax speed={0.08}>
          <motion.figure
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.5 }}
            className="group relative w-full"
          >
            <CodePlate />
            <figcaption className="flex items-center justify-between mt-3">
              <span className="meta">Fig. 01 — the log-sync pipeline</span>
              <span className="meta">in production</span>
            </figcaption>
          </motion.figure>
        </Parallax>
      </div>
    </header>
  );
};

export default Hero;

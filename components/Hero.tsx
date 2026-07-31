import React from "react";
import { motion } from "framer-motion";
import { PERSONAL_INFO } from "../constants";
import { Reveal } from "./Editorial";
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
      className="relative px-page max-w-6xl 2xl:max-w-7xl mx-auto pt-24 xs:pt-28 md:pt-32 pb-12 sm:pb-16"
    >
      {/* Corner registration ticks */}
      <Tick className="left-4 top-24 md:left-7 md:top-28 hidden sm:block" />
      <Tick className="right-4 top-24 md:right-7 md:top-28 hidden sm:block" />

      {/* Newspaper masthead ticker */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="marquee-track marquee-mask overflow-hidden border-y border-ink/15 mb-8 sm:mb-10 md:mb-12"
      >
        <div className="marquee py-2 sm:py-2.5">
          {[0, 1].map((k) => (
            <div key={k} className="flex items-center">
              {TICKER.map((t, i) => (
                <span key={i} className="flex items-center">
                  <span className="meta whitespace-nowrap uppercase">{t}</span>
                  <span className="mark-lozenge mx-3.5 sm:mx-5" aria-hidden />
                </span>
              ))}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Masthead rule + edition line */}
      {/* <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, ease: EASE, delay: 0.2 }}
        className="origin-left h-px bg-ink/25 mb-4"
      />  */}
      {/* <div className="flex items-center justify-between gap-4 mb-12 md:mb-16">
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
      </div> */}

      {/* `minmax(0,…)` on both tracks is load-bearing: an `fr`/`auto` track
          floors at min-content, and the SVG diagram inside the code plate
          contributes its 360px viewBox width — which would stop the whole
          page shrinking below ~397px on small phones. */}
      <div className="relative grid grid-cols-[minmax(0,1fr)] gap-10 sm:gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-14 xl:gap-16 lg:items-center">
        {/* Headline column */}
        <div className="relative min-w-0">
          {/* Shell-prompt tag — bridges the editorial headline with the
              coder identity used across the rest of the site */}
          <Reveal delay={0.1}>
            <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10.5px] xs:text-[11px] md:text-xs text-ink-faint mb-5 sm:mb-6">
              <span className="text-rust">$</span>
              <span className="text-ink-soft">whoami</span>
              <span className="text-ink-faint">
                → {PERSONAL_INFO.name.split(" ")[0]}, software engineer
              </span>
              <span className="caret-blink inline-block h-[1em] w-[0.5ch] translate-y-[0.1em] bg-rust" />
            </span>
          </Reveal>

          <h1 className="display-xl font-display font-medium text-ink">
            <Reveal delay={0.2}>
              <span className="block">Building</span>
            </Reveal>
            <Reveal delay={0.32}>
              <span className="block">software that</span>
            </Reveal>
            <Reveal delay={0.44}>
              <span className="block font-normal text-rust">scales quietly.</span>
            </Reveal>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.7 }}
            className="lede mt-6 sm:mt-8 max-w-xl text-ink-soft"
          >
            A full-stack engineer working close to the metal — event-driven
            systems, sharp backends, and interfaces built with the same care
            as a printed page.
          </motion.p>
        </div>

        {/* Fig. 01 — code specimen plate.
            No scroll parallax on the plate: drifting a content block against
            the scroll makes the page read as moving faster than the wheel. */}
        <motion.figure
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.5 }}
          className="group relative w-full min-w-0"
        >
          <CodePlate />
          <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 mt-3">
            <span className="meta">Fig. 01 — the log-sync pipeline</span>
            <span className="meta">in production</span>
          </figcaption>
        </motion.figure>
      </div>

      {/* CTAs + socials — full width, below the headline and figure */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.9 }}
        className="mt-10 sm:mt-12 md:mt-16 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-4"
      >
        <a
          href="#projects"
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById("projects")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className="btn-fill group inline-flex items-center justify-center gap-2 border border-ink px-6 sm:px-7 py-3.5 text-ink hover:text-paper sm:w-auto"
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
          className="group inline-flex items-center justify-center sm:justify-start gap-2 px-2 py-3 sm:py-3.5 text-ink link-underline"
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
        className="mt-7 sm:mt-8 flex flex-wrap items-center gap-x-5 gap-y-2"
      >
        {PERSONAL_INFO.socials.map((s) => (
          <a
            key={s.name}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline meta uppercase text-ink-soft py-1"
          >
            {s.name}
          </a>
        ))}
      </motion.div>
    </header>
  );
};

export default Hero;

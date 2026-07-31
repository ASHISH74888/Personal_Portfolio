import React, { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { FadeUp } from "./Editorial";
import { EXPERIENCE, EDUCATION } from "../constants";

/* ============================================================
   The Journey — a commit history
   ------------------------------------------------------------
   Experience & education reframed as version control: each role
   and degree is a commit in a `git log --graph`, inside a warm
   terminal. A rust rail draws itself down the graph as you
   scroll and each node lights up as it passes. Coder-native,
   recruiter-legible.
   ============================================================ */

type Node = {
  hash: string;
  title: string; // role / degree
  subtitle: string; // company · location / institution
  period: string;
  points?: string[];
  refs?: string[];
  chips?: string[];
};

/* Deterministic 7-char pseudo-hash from a seed (no Math.random). */
const hashOf = (seed: string) => {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0").slice(0, 7);
};

const workNodes: Node[] = EXPERIENCE.map((e) => ({
  hash: hashOf(e.company + e.role),
  title: e.company,
  subtitle: `${e.role} · ${e.location}`,
  period: e.period,
  points: e.description,
  refs: /present/i.test(e.period) ? ["HEAD -> main", "origin/main"] : undefined,
  chips: [e.period],
}));

const eduNodes: Node[] = EDUCATION.map((e) => ({
  hash: hashOf(e.institution + e.degree),
  title: e.degree,
  subtitle: e.institution,
  period: e.period,
  chips: [e.period],
}));

/* One commit row in the graph. */
const CommitRow: React.FC<{
  node: Node;
  i: number;
  active: number;
  last: boolean;
}> = ({ node, i, active, last }) => {
  const passed = active >= i;
  const current = active === i;
  return (
    <FadeUp delay={i * 0.06} y={20}>
      <li className="relative grid grid-cols-[auto_1fr] gap-x-5 md:gap-x-8">
        {/* graph column — node + connector */}
        <div className="relative flex flex-col items-center">
          <span
            className={`relative z-10 mt-1.5 h-3.5 w-3.5 rounded-full border-2 transition-all duration-500 ${
              passed
                ? current
                  ? "border-rust bg-rust shadow-[0_0_16px_4px_rgba(255,73,10,0.7)]"
                  : "border-rust bg-rust shadow-[0_0_10px_2px_rgba(255,73,10,0.45)]"
                : "border-paper/40 bg-ink"
            }`}
          >
            {passed && (
              <span
                className={`absolute -inset-1.5 rounded-full border border-rust/40 ${
                  current ? "animate-ping" : ""
                }`}
              />
            )}
          </span>
          {!last && <span className="w-px flex-1 bg-transparent" />}
        </div>

        {/* commit body */}
        <div className={last ? "pb-2" : "pb-12 md:pb-14"}>
          {/* hash + refs + date line */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-3">
            <span className="font-mono text-[13px] text-rust">
              commit {node.hash}
            </span>
            {node.refs?.map((r) => (
              <span
                key={r}
                className="font-mono text-[10px] uppercase tracking-wide rounded-full border border-rust/40 text-rust px-2 py-0.5"
              >
                {r}
              </span>
            ))}
            <span className="font-mono text-[11px] text-paper/35 sm:ml-auto">
              {node.period}
            </span>
          </div>

          {/* title */}
          <h3 className="font-display font-semibold text-paper leading-[1.05] tracking-tight text-2xl md:text-4xl">
            {node.title}
            <span className="text-rust">.</span>
          </h3>
          <p className="mt-2 font-mono text-xs md:text-sm text-paper/45 lowercase tracking-wide">
            {node.subtitle}
          </p>

          {/* points */}
          {node.points && (
            <ul className="mt-5 space-y-2.5 max-w-2xl">
              {node.points.map((p, k) => (
                <li
                  key={k}
                  className="flex gap-3 text-[15px] leading-relaxed text-paper/65"
                >
                  <span className="mt-[0.7em] h-1 w-1 shrink-0 rounded-full bg-rust/70" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          )}

          {/* chips */}
          {node.chips && node.chips.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {node.chips.map((c) => (
                <span
                  key={c}
                  className="font-mono text-[11px] text-paper/55 rounded border border-paper/15 px-2 py-0.5"
                >
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>
      </li>
    </FadeUp>
  );
};

/* A terminal window wrapping a scroll-driven commit graph. */
const GitTerminal: React.FC<{
  path: string;
  command: string;
  flags: string;
  nodes: Node[];
  footer: string;
}> = ({ path, command, flags, nodes, footer }) => {
  const railRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const N = nodes.length;

  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 70%", "end 60%"],
  });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const [active, setActive] = useState(reduce ? N - 1 : 0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.max(0, Math.min(N - 1, Math.floor(v * N + 0.15))));
  });

  return (
    <div className="relative border border-paper/12 bg-ink/60 shadow-[0_40px_90px_-50px_rgba(0,0,0,0.9)]">
      {/* top hairline sheen */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-paper/15" />

      {/* title bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-paper/12">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-paper/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-paper/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-rust/70" />
        </span>
        <span className="font-mono text-[11px] tracking-wide text-paper/45">
          ashish@field-notes: {path}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/40">
          main
        </span>
      </div>

      {/* command prompt */}
      <div className="px-5 md:px-7 pt-6 pb-2 font-mono text-xs md:text-sm">
        <span className="text-olive">$</span>{" "}
        <span className="text-paper/80">{command}</span>{" "}
        <span className="text-paper/45">{flags}</span>
      </div>

      {/* the graph */}
      <div ref={railRef} className="relative px-5 md:px-7 pb-8 pt-6">
        {/* base rail */}
        <span
          aria-hidden
          className="absolute top-8 bottom-10 left-[calc(1.25rem+6px)] md:left-[calc(1.75rem+6px)] w-px bg-paper/15"
        />
        {/* rust fill rail */}
        <motion.span
          aria-hidden
          style={{ scaleY: reduce ? 1 : fill }}
          className="absolute top-8 bottom-10 left-[calc(1.25rem+6px)] md:left-[calc(1.75rem+6px)] w-px bg-rust origin-top"
        />

        <ul className="relative">
          {nodes.map((n, i) => (
            <CommitRow
              key={n.hash}
              node={n}
              i={i}
              active={active}
              last={i === N - 1}
            />
          ))}
        </ul>
      </div>

      {/* status footer */}
      <div className="flex items-center justify-between gap-4 px-5 md:px-7 py-3 border-t border-paper/12 font-mono text-[10px] text-paper/45">
        <span className="flex items-center gap-1.5">
          <span className="text-rust">↑</span> {footer}
        </span>
        <span className="hidden sm:inline">
          nothing to commit, working tree clean
        </span>
      </div>
    </div>
  );
};

const Experience: React.FC = () => {
  return (
    <section
      id="experience"
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
          <span className="kicker text-rust">No.03</span>
          <span className="h-px w-12 bg-paper/25" />
          <span className="kicker text-paper/60">Curriculum vitae</span>
        </div>

        <FadeUp>
          <h2 className="font-display text-4xl md:text-[3.4rem] leading-[1.02] font-medium text-paper mb-12">
            The journey{" "}
            <span className="font-normal text-rust">so far.</span>
          </h2>
        </FadeUp>

        {/* Work experience terminal */}
        <FadeUp delay={0.1}>
          <GitTerminal
            path="~/experience"
            command="git log"
            flags="--graph --stat"
            nodes={workNodes}
            footer={`${workNodes.length} roles · clean tree`}
          />
        </FadeUp>

        {/* Education terminal */}
        <FadeUp delay={0.1} className="mt-12">
          <GitTerminal
            path="~/education"
            command="git log"
            flags="--graph education/"
            nodes={eduNodes}
            footer={`${eduNodes.length} milestone · clean tree`}
          />
        </FadeUp>
      </div>
    </section>
  );
};

export default Experience;

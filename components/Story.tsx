import React, { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { FadeUp } from "./Editorial";

/* ============================================================
   The Method — a commit history
   ------------------------------------------------------------
   The way the work gets made, reframed as version control:
   a `git log --graph` inside a terminal. Four commits — from
   understanding the system to shipping and watching it live —
   each with a real hash, refs, diff stat, and note. A rust rail
   draws itself down the graph as you scroll. Coder-native,
   interviewer-legible.
   ============================================================ */

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

type Commit = {
  hash: string;
  word: string;
  subject: string;
  note: string;
  add: number;
  del: number;
  chips: string[];
  refs?: string[];
};

/* Oldest → newest (git log --reverse): the story ends on the result. */
const COMMITS: Commit[] = [
  {
    hash: "a1f3c2b",
    word: "Understand",
    subject: "read the system before touching it",
    note: "Measure twice, cut once. Trace the request path and find where the time — and the money — actually goes.",
    add: 0,
    del: 0,
    chips: ["read-only", "4 db calls / request measured"],
  },
  {
    hash: "7b9e104",
    word: "Architect",
    subject: "design the seams first",
    note: "Kafka topics, AVRO schemas, and stores that converse cleanly. Draw the boundaries before writing a line.",
    add: 12,
    del: 4,
    chips: ["+kafka", "+avro", "+elasticsearch", "−polling"],
  },
  {
    hash: "c4d8827",
    word: "Build",
    subject: "type-safe, tested, boring in the best way",
    note: "Ship small, ship often. Code a teammate can read at 2am and a reviewer can trust on the first pass.",
    add: 34,
    del: 9,
    chips: ["12 files", "+840 −90 lines"],
  },
  {
    hash: "ff02a1e",
    word: "Ship",
    subject: "then watch it live",
    note: "Observability is part of done. Four calls become one. Latency stops being a bug and becomes a feature.",
    add: 0,
    del: 0,
    chips: ["latency −90%", "4 → 1 calls", "$7K+ saved"],
    refs: ["HEAD -> main", "origin/main"],
  },
];

const N = COMMITS.length;

/* GitHub-style proportional +/− diff bar */
const DiffBar: React.FC<{ add: number; del: number }> = ({ add, del }) => {
  const total = add + del;
  if (!total) return null;
  const cells = 12;
  const a = Math.max(1, Math.round((add / total) * cells));
  const d = Math.max(1, Math.round((del / total) * cells));
  const rest = Math.max(0, cells - a - d);
  return (
    <span className="inline-flex items-center gap-2">
      <span className="font-mono text-[11px] text-olive">+{add}</span>
      <span className="flex gap-[3px]">
        {Array.from({ length: a }).map((_, i) => (
          <span key={`a${i}`} className="h-2.5 w-2.5 bg-olive/80" />
        ))}
        {Array.from({ length: d }).map((_, i) => (
          <span key={`d${i}`} className="h-2.5 w-2.5 bg-rust" />
        ))}
        {Array.from({ length: rest }).map((_, i) => (
          <span key={`r${i}`} className="h-2.5 w-2.5 bg-paper/12" />
        ))}
      </span>
      <span className="font-mono text-[11px] text-rust">−{del}</span>
    </span>
  );
};

const CommitRow: React.FC<{
  commit: Commit;
  i: number;
  active: number;
  last: boolean;
}> = ({ commit, i, active, last }) => {
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
                  ? "border-rust bg-rust shadow-[0_0_16px_4px_rgba(180,70,47,0.7)]"
                  : "border-rust bg-rust shadow-[0_0_10px_2px_rgba(180,70,47,0.45)]"
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
          {/* hash + refs line */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-3">
            <span className="font-mono text-[13px] text-rust">
              commit {commit.hash}
            </span>
            {commit.refs?.map((r) => (
              <span
                key={r}
                className="font-mono text-[10px] uppercase tracking-wide rounded-full border border-rust/40 text-rust px-2 py-0.5"
              >
                {r}
              </span>
            ))}
          </div>

          {/* message: verb + subject */}
          <h3 className="font-display font-medium text-paper leading-[0.95] tracking-tight text-4xl md:text-6xl">
            {commit.word}
            <span className="text-rust">.</span>
          </h3>
          <p className="mt-3 font-mono text-xs md:text-sm text-paper/45 lowercase tracking-wide">
            {commit.subject}
          </p>

          {/* note */}
          <p className="mt-5 max-w-xl text-base md:text-lg text-paper/65 leading-relaxed">
            {commit.note}
          </p>

          {/* stat line: diff bar + chips */}
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <DiffBar add={commit.add} del={commit.del} />
            {commit.chips.map((c) => (
              <span
                key={c}
                className="font-mono text-[11px] text-paper/55 rounded border border-paper/15 px-2 py-0.5"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </li>
    </FadeUp>
  );
};

const Story: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Rail fill tracks the graph as it passes through the viewport.
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 65%", "end 55%"],
  });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const [active, setActive] = useState(reduce ? N - 1 : 0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.max(0, Math.min(N - 1, Math.floor(v * N + 0.15)));
    setActive(idx);
  });

  return (
    <section
      id="approach"
      ref={ref}
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
          <span className="kicker text-rust">No.02</span>
          <span className="h-px w-12 bg-paper/25" />
          <span className="kicker text-paper/60">The method</span>
        </div>

        <FadeUp>
          <h2 className="font-display text-4xl md:text-[3.4rem] leading-[1.02] font-medium text-paper mb-10">
            How the work{" "}
            <span className="italic font-normal text-rust">ships.</span>
          </h2>
        </FadeUp>

        {/* terminal window */}
        <FadeUp delay={0.1}>
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
                ashish@field-notes: ~/method
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/40">
                main
              </span>
            </div>

            {/* command prompt */}
            <div className="px-5 md:px-7 pt-6 pb-2 font-mono text-xs md:text-sm">
              <span className="text-olive">$</span>{" "}
              <span className="text-paper/80">git log</span>{" "}
              <span className="text-paper/45">--reverse --graph --stat</span>
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
                {COMMITS.map((c, i) => (
                  <CommitRow
                    key={c.hash}
                    commit={c}
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
                <span className="text-rust">↑</span> {N} commits · clean tree
              </span>
              <span className="hidden sm:inline">
                nothing to commit, working tree clean
              </span>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
};

export default Story;

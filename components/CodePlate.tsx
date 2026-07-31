import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

/* ============================================================
   Fig. 01 — the code specimen (interactive)
   ------------------------------------------------------------
   Three real, switchable views from the Bolt.Earth work:
     · consumer.ts   — the event-driven log-sync pipeline,
                       typing itself in with a caret.
     · optimize.diff — a git diff of the dashboard refactor
                       that took 4 MongoDB calls down to 1.
     · system.map    — a live architecture diagram: packets
                       flow device → kafka → decode → es →
                       dashboard, nodes pulsing as they pass.
   The plate tilts gently toward the cursor. Editorial tokens.
   ============================================================ */

type Tok = { t: string; c?: string };
const K = "text-rust"; // keyword
const S = "text-olive"; // string
const C = "text-paper/35"; // comment
const F = "text-paper"; // emphasised identifier

const LINES: Tok[][] = [
  [{ t: "// event-driven log sync · Bolt.Earth", c: C }],
  [],
  [
    { t: "const", c: K },
    { t: " consumer " },
    { t: "=", c: C },
    { t: " kafka.consumer({ groupId: " },
    { t: '"sync"', c: S },
    { t: " })" },
  ],
  [],
  [
    { t: "await", c: K },
    { t: " consumer.subscribe({ topic: " },
    { t: '"device.logs"', c: S },
    { t: " })" },
  ],
  [],
  [{ t: "await", c: K }, { t: " consumer.run({" }],
  [{ t: "  eachMessage: " }, { t: "async", c: K }, { t: " ({ message }) => {" }],
  [
    { t: "    const", c: K },
    { t: " log = " },
    { t: "decode", c: F },
    { t: "(message.value)   " },
    { t: "// AVRO", c: C },
  ],
  [
    { t: "    await", c: K },
    { t: " es.index({ index: " },
    { t: '"logs"', c: S },
    { t: ", doc: log })" },
  ],
  [{ t: "  })" }],
  [{ t: "})" }],
];

const HL_LINE = 9; // the es.index(...) line

/* ---- the diff specimen: 4 db calls → 1 aggregation --------- */
type DiffKind = "meta" | "hunk" | "add" | "del" | "ctx";
type DiffLine = { k: DiffKind; t: string };

const DIFF: DiffLine[] = [
  { k: "meta", t: "diff --git a/dashboard/stats.ts b/dashboard/stats.ts" },
  { k: "hunk", t: "@@ dashboard summary · 6k+ records @@" },
  { k: "del", t: "const users   = await db.users.find(q)" },
  { k: "del", t: "const devices = await db.devices.find(q)" },
  { k: "del", t: "const logs    = await db.logs.find(q)" },
  { k: "del", t: "const wallet  = await db.wallet.find(q)" },
  { k: "add", t: "const [summary] = await db.stats" },
  { k: "add", t: "  .aggregate(pipeline)   // one round-trip" },
  { k: "ctx", t: "return summary" },
];

/* ---- the architecture map --------------------------------- */
const NODE_W = 100;
const NODE_H = 40;
const NODES = [
  { id: "device", x: 6, y: 24, label: "device", sub: ".logs" },
  { id: "kafka", x: 130, y: 24, label: "Kafka", sub: "topic" },
  { id: "decode", x: 254, y: 24, label: "decode", sub: "AVRO" },
  { id: "es", x: 192, y: 128, label: "Elastic", sub: "search" },
  { id: "dash", x: 40, y: 128, label: "dashboard", sub: "6k+ / query" },
];
const EDGES = [
  { d: "M106,44 L128,44", dur: 1.1 },
  { d: "M230,44 L252,44", dur: 1.1 },
  { d: "M304,64 C304,104 242,90 242,128", dur: 1.7 },
  { d: "M192,148 L142,148", dur: 1.3 },
];

const Caret: React.FC = () => (
  <span className="caret-blink inline-block w-[0.5ch] h-[1.05em] translate-y-[0.18em] bg-rust" />
);

type Tab = "consumer" | "diff" | "system";

/* ---- the live architecture diagram ------------------------ */
const SystemMap: React.FC<{ reduce: boolean }> = ({ reduce }) => {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(
      () => setActive((n) => (n + 1) % NODES.length),
      1100,
    );
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <div className="px-3 sm:px-4 py-4">
      <svg
        viewBox="0 0 360 182"
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <marker
            id="cp-arrow"
            markerWidth="7"
            markerHeight="7"
            refX="4.5"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L5,3 L0,6 Z" fill="rgba(244,239,230,0.4)" />
          </marker>
        </defs>

        {/* edges + flowing packets */}
        {EDGES.map((e, i) => (
          <g key={i}>
            <path
              d={e.d}
              fill="none"
              markerEnd="url(#cp-arrow)"
              style={{ stroke: "rgba(244,239,230,0.18)", strokeWidth: 1.4 }}
            />
            {!reduce &&
              [0, 1].map((p) => (
                <circle key={p} r={2.6} fill="var(--rust)">
                  <animateMotion
                    dur={`${e.dur}s`}
                    begin={`${(-p * e.dur) / 2}s`}
                    repeatCount="indefinite"
                    path={e.d}
                  />
                </circle>
              ))}
          </g>
        ))}

        {/* nodes */}
        {NODES.map((n, i) => {
          const on = active === i;
          return (
            <g key={n.id}>
              <rect
                x={n.x}
                y={n.y}
                width={NODE_W}
                height={NODE_H}
                rx={3}
                style={{
                  fill: on
                    ? "rgba(255,73,10,0.16)"
                    : "rgba(244,239,230,0.035)",
                  stroke: on ? "var(--rust)" : "rgba(244,239,230,0.2)",
                  strokeWidth: 1.2,
                  transition: "fill .45s ease, stroke .45s ease",
                }}
              />
              <text
                x={n.x + NODE_W / 2}
                y={n.y + 18}
                textAnchor="middle"
                fontSize="10.5"
                fontFamily="'JetBrains Mono', monospace"
                style={{
                  fill: on ? "#f4efe6" : "rgba(244,239,230,0.72)",
                  transition: "fill .45s ease",
                }}
              >
                {n.label}
              </text>
              <text
                x={n.x + NODE_W / 2}
                y={n.y + 30}
                textAnchor="middle"
                fontSize="7.5"
                fontFamily="'JetBrains Mono', monospace"
                fill="rgba(244,239,230,0.4)"
              >
                {n.sub}
              </text>
            </g>
          );
        })}
      </svg>

      <p className="mt-1 text-center font-mono text-[10px] text-paper/40">
        event-driven · autonomous sync on app-open
      </p>
    </div>
  );
};

const CodePlate: React.FC = () => {
  const reduce = !!useReducedMotion();
  const [tab, setTab] = useState<Tab>("system");

  // total characters (+1 per line to account for the line break)
  const total = useMemo(
    () =>
      LINES.reduce((n, l) => n + l.reduce((m, t) => m + t.t.length, 0) + 1, 0),
    [],
  );
  const [count, setCount] = useState(reduce ? total : 0);
  const [done, setDone] = useState(reduce);

  // Type the listing in the first time the consumer.ts tab is opened.
  useEffect(() => {
    if (reduce || tab !== "consumer" || done) return;
    let c = 0;
    let interval = 0;
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        c += 2;
        if (c >= total) {
          setCount(total);
          setDone(true);
          window.clearInterval(interval);
        } else {
          setCount(c);
        }
      }, 22);
    }, 250);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
    };
  }, [reduce, tab, done, total]);

  // Subtle cursor tilt. No pointer media query gating it: onMouseMove only
  // fires for a real pointer anyway, and those queries misreport on hybrid
  // machines — which would just disable the tilt on a normal laptop.
  const rx = useSpring(useMotionValue(0), { stiffness: 150, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 150, damping: 20 });
  const wrapRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 6);
    rx.set(-py * 6);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  // render with a running global index so the caret sits at the boundary
  let gi = 0;
  const renderChars = (toks: Tok[]) =>
    toks.map((tok, ti) => (
      <span key={ti} className={tok.c}>
        {Array.from(tok.t).map((ch, ci) => {
          const idx = gi++;
          const showCaret = idx === count && !done;
          return (
            <React.Fragment key={ci}>
              {showCaret && <Caret />}
              <span className={idx < count ? "" : "opacity-0"}>{ch}</span>
            </React.Fragment>
          );
        })}
      </span>
    ));

  const TabBtn: React.FC<{
    id: Tab;
    badge: React.ReactNode;
    children: React.ReactNode;
    dot?: boolean;
  }> = ({ id, badge, children, dot }) => (
    <button
      onClick={() => setTab(id)}
      className={`flex shrink-0 items-center gap-1.5 sm:gap-2 whitespace-nowrap px-3 sm:px-3.5 py-2.5 sm:py-2 border-r border-paper/12 transition-colors ${
        tab === id
          ? "bg-paper/[0.05] text-paper/85"
          : "text-paper/35 hover:text-paper/60"
      }`}
    >
      {badge}
      {children}
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-paper/60" />}
    </button>
  );

  return (
    <motion.div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      className="relative border border-ink/25 bg-ink text-paper/90 shadow-[0_40px_70px_-46px_rgba(28,26,23,0.9)]"
    >
      {/* top hairline sheen */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-paper/15" />

      {/* title bar — same window chrome as the Method terminal */}
      <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2.5 border-b border-paper/12">
        <span className="flex shrink-0 items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-paper/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-paper/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-rust/70" />
        </span>
        <span className="hidden xs:block min-w-0 truncate font-mono text-[10px] sm:text-[11px] tracking-wide text-paper/45">
          ashish@bolt: ~/sync
        </span>
        <span className="flex shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55">
          <span className="h-1.5 w-1.5 rounded-full bg-rust animate-pulse" />
          live
        </span>
      </div>

      {/* editor tab strip — real, clickable tabs */}
      <div className="scrollbar-hide flex items-stretch overflow-x-auto border-b border-paper/12 font-mono text-[11px]">
        <TabBtn
          id="consumer"
          dot
          badge={
            <span className="grid h-4 w-4 place-items-center rounded-[3px] bg-rust/80 text-[8px] font-semibold text-paper">
              TS
            </span>
          }
        >
          consumer.ts
        </TabBtn>
        <TabBtn
          id="diff"
          badge={
            <span className="grid h-4 w-4 place-items-center rounded-[3px] bg-olive/70 text-[8px] font-semibold text-paper">
              ±
            </span>
          }
        >
          optimize.diff
        </TabBtn>
        <TabBtn
          id="system"
          badge={
            <span className="grid h-4 w-4 place-items-center rounded-[3px] bg-paper/20 text-[8px] font-semibold text-paper">
              ⬡
            </span>
          }
        >
          system.map
        </TabBtn>
      </div>

      {/* body */}
      <div className="relative min-h-[13.5rem] xs:min-h-[15.5rem]">
        <AnimatePresence mode="wait">
          {tab === "consumer" && (
            <motion.pre
              key="consumer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="code-scroll py-4 font-mono text-[11px] xs:text-[11.5px] md:text-xs leading-[1.8]"
            >
              {/* Rows are `w-max min-w-full` so long lines can be swiped
                  sideways on a phone instead of being cut off, while the
                  highlight band still spans the full width. */}
              {LINES.map((line, li) => {
                const rowChars = renderChars(line);
                const nlIdx = gi++;
                const nlCaret = nlIdx === count && !done;
                return (
                  <div
                    key={li}
                    className={`grid w-max min-w-full grid-cols-[1.6rem_1fr] gap-3 whitespace-pre px-3 sm:px-4 ${
                      li === HL_LINE ? "code-line-hl" : ""
                    }`}
                  >
                    <span className="text-paper/20 text-right select-none">
                      {li + 1}
                    </span>
                    <span>
                      {rowChars}
                      {nlCaret && <Caret />}
                    </span>
                  </div>
                );
              })}
            </motion.pre>
          )}

          {tab === "diff" && (
            <motion.pre
              key="diff"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="px-3 sm:px-4 py-4 font-mono text-[11px] xs:text-[11.5px] md:text-xs leading-[1.8] overflow-hidden"
            >
              {DIFF.map((d, i) => {
                const gutter =
                  d.k === "add"
                    ? "+"
                    : d.k === "del"
                      ? "−"
                      : d.k === "ctx"
                        ? " "
                        : "";
                const rowCls =
                  d.k === "add"
                    ? "bg-olive/[0.14] text-paper"
                    : d.k === "del"
                      ? "bg-rust/[0.14] text-paper/85"
                      : d.k === "hunk"
                        ? "text-rust"
                        : d.k === "meta"
                          ? "text-paper/35"
                          : "text-paper/70";
                const gutterCls =
                  d.k === "add"
                    ? "text-olive"
                    : d.k === "del"
                      ? "text-rust"
                      : "text-paper/20";
                return (
                  <div
                    key={i}
                    className={`grid grid-cols-[1.1rem_1fr] gap-2 -mx-3 sm:-mx-4 px-3 sm:px-4 ${rowCls}`}
                  >
                    <span className={`text-right select-none ${gutterCls}`}>
                      {gutter}
                    </span>
                    <span className="whitespace-pre-wrap">{d.t}</span>
                  </div>
                );
              })}
            </motion.pre>
          )}

          {tab === "system" && (
            <motion.div
              key="system"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SystemMap reduce={reduce} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* status bar — single row, adapts to the active tab */}
      <div className="flex items-center justify-between gap-2 sm:gap-3 px-3 sm:px-4 py-2 border-t border-paper/12 font-mono text-[9.5px] xs:text-[10px] text-paper/45 whitespace-nowrap overflow-hidden">
        {tab === "consumer" && (
          <>
            <span className="flex items-center gap-1.5 shrink-0">
              <span className="text-rust">↑</span> main
            </span>
            <span className="flex items-center gap-3">
              <span className="text-paper/70">−90% latency</span>
              <span className="hidden sm:flex items-center gap-1.5 text-paper/60">
                <span className="h-1.5 w-1.5 rounded-full bg-rust/80" />
                TypeScript
              </span>
            </span>
          </>
        )}
        {tab === "diff" && (
          <>
            <span className="flex items-center gap-3 shrink-0">
              <span className="text-olive">+2</span>
              <span className="text-rust">−4</span>
              <span className="hidden sm:inline text-paper/40">
                dashboard/stats.ts
              </span>
            </span>
            <span className="text-paper/70">4 calls → 1 query</span>
          </>
        )}
        {tab === "system" && (
          <>
            <span className="flex items-center gap-1.5 shrink-0">
              <span className="text-rust">◈</span> 5 services
            </span>
            <span className="text-paper/70">Kafka · AVRO · Elasticsearch</span>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default CodePlate;

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Section from "./Section";
import TechMarquee from "./TechMarquee";
import { SectionHeading, FadeUp } from "./Editorial";
import { SKILLS, ACHIEVEMENTS } from "../constants";

/* ============================================================
   Capabilities — read as source
   ------------------------------------------------------------
   The arsenal, rendered the way it's actually written: a typed
   `stack.ts` object and a `honours.log` changelog, inside the
   same editor chrome as the rest of the site.
   ============================================================ */

type Tab = "stack" | "honours";

const camel = (s: string) =>
  s
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase()
    .split(" ")
    .map((w, i) => (i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join("");

const totalSkills = SKILLS.reduce((n, g) => n + g.items.length, 0);

/* Highlight a "(YYYY)" year token inside an achievement line. */
const renderHonour = (text: string) =>
  text.split(/(\(\d{4}\))/).map((part, i) =>
    /\(\d{4}\)/.test(part) ? (
      <span key={i} className="text-rust">
        {part}
      </span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  );

const TabBtn: React.FC<{
  id: Tab;
  active: Tab;
  onClick: (id: Tab) => void;
  badge: React.ReactNode;
  children: React.ReactNode;
}> = ({ id, active, onClick, badge, children }) => (
  <button
    onClick={() => onClick(id)}
    className={`flex shrink-0 items-center gap-1.5 sm:gap-2 whitespace-nowrap px-3 sm:px-3.5 py-2.5 sm:py-2 border-r border-paper/12 transition-colors ${
      active === id
        ? "bg-paper/[0.05] text-paper/85"
        : "text-paper/35 hover:text-paper/60"
    }`}
  >
    {badge}
    {children}
  </button>
);

/* One numbered source row. */
const Row: React.FC<{ n: number; children: React.ReactNode }> = ({
  n,
  children,
}) => (
  <div className="grid grid-cols-[1.5rem_1fr] sm:grid-cols-[2rem_1fr] gap-2 sm:gap-3">
    <span className="text-right text-paper/20 select-none">{n}</span>
    <span className="whitespace-pre-wrap break-words">{children}</span>
  </div>
);

const Skills: React.FC = () => {
  const [tab, setTab] = useState<Tab>("stack");

  return (
    <>
      {/* Marquee band sits full-width above the section */}
      <div className="px-page max-w-6xl 2xl:max-w-7xl mx-auto pt-8">
        <p className="kicker text-center mb-4 sm:mb-5">Tools of the trade</p>
        <TechMarquee />
      </div>

      <Section id="skills" className="!pt-12 sm:!pt-16">
        <SectionHeading
          index="05"
          kicker="Capabilities & honours"
          title={
            <>
              The technical{" "}
              <span className="font-normal text-rust">arsenal</span>
            </>
          }
        />

        <FadeUp delay={0.1} className="mt-10 sm:mt-14">
          <div className="relative border border-ink/25 bg-ink text-paper/90 shadow-[0_40px_70px_-46px_rgba(28,26,23,0.9)]">
            {/* top hairline sheen */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-paper/15" />

            {/* title bar */}
            <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2.5 border-b border-paper/12">
              <span className="flex shrink-0 items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-paper/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-paper/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-rust/70" />
              </span>
              <span className="hidden xs:block min-w-0 truncate font-mono text-[10px] sm:text-[11px] tracking-wide text-paper/45">
                ashish@field-notes: ~/stack
              </span>
              <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/40">
                main
              </span>
            </div>

            {/* editor tab strip */}
            <div className="scrollbar-hide flex items-stretch overflow-x-auto border-b border-paper/12 font-mono text-[11px]">
              <TabBtn
                id="stack"
                active={tab}
                onClick={setTab}
                badge={
                  <span className="grid h-4 w-4 place-items-center rounded-[3px] bg-rust/80 text-[8px] font-semibold text-paper">
                    TS
                  </span>
                }
              >
                stack.ts
              </TabBtn>
              <TabBtn
                id="honours"
                active={tab}
                onClick={setTab}
                badge={
                  <span className="grid h-4 w-4 place-items-center rounded-[3px] bg-olive/70 text-[8px] font-semibold text-paper">
                    ✦
                  </span>
                }
              >
                honours.log
              </TabBtn>
            </div>

            {/* body */}
            <div className="relative min-h-[17rem] sm:min-h-[20rem]">
              <AnimatePresence mode="wait">
                {tab === "stack" && (
                  <motion.pre
                    key="stack"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-3 sm:px-5 md:px-7 py-5 sm:py-6 font-mono text-[11px] xs:text-[11.5px] md:text-[13px] leading-[1.9]"
                  >
                    <Row n={1}>
                      <span className="text-paper/35">
                        // the technical arsenal — chosen, not collected
                      </span>
                    </Row>
                    <Row n={2}>
                      <span className="text-rust">export const</span>
                      <span className="text-paper"> stack</span>
                      <span className="text-paper/40">: DevStack = {"{"}</span>
                    </Row>
                    {SKILLS.map((g, gi) => (
                      <Row n={gi + 3} key={g.category}>
                        {"  "}
                        <span className="text-paper/80">
                          {camel(g.category)}
                        </span>
                        <span className="text-paper/40">: [</span>
                        {g.items.map((it, i) => (
                          <React.Fragment key={i}>
                            <span className="text-olive">"{it}"</span>
                            {i < g.items.length - 1 && (
                              <span className="text-paper/40">, </span>
                            )}
                          </React.Fragment>
                        ))}
                        <span className="text-paper/40">],</span>{"  "}
                        <span className="text-paper/25">
                          {`// ${g.items.length}`}
                        </span>
                      </Row>
                    ))}
                    <Row n={SKILLS.length + 3}>
                      <span className="text-paper/40">{"}"}</span>
                    </Row>
                  </motion.pre>
                )}

                {tab === "honours" && (
                  <motion.div
                    key="honours"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-3 sm:px-5 md:px-7 py-5 sm:py-6 font-mono text-[11px] xs:text-[11.5px] md:text-[13px] leading-[1.9]"
                  >
                    <p className="mb-5 text-paper/45">
                      <span className="text-olive">$</span>{" "}
                      <span className="text-paper/80">git log</span>{" "}
                      <span className="text-paper/45">
                        --grep=honour --pretty=oneline
                      </span>
                    </p>
                    <ul className="space-y-5">
                      {ACHIEVEMENTS.map((a, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="mt-[0.15em] shrink-0 text-rust">
                            ●
                          </span>
                          <span className="text-paper/70 leading-relaxed">
                            {renderHonour(a)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* status bar */}
            <div className="flex items-center justify-between gap-2 sm:gap-3 px-3 sm:px-5 md:px-7 py-2 border-t border-paper/12 font-mono text-[9.5px] xs:text-[10px] text-paper/45 whitespace-nowrap overflow-hidden">
              {tab === "stack" ? (
                <>
                  <span className="flex items-center gap-1.5 shrink-0">
                    <span className="text-rust">◈</span> {SKILLS.length} domains
                  </span>
                  <span className="truncate text-paper/70">
                    {totalSkills} skills · type-checked
                  </span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1.5 shrink-0">
                    <span className="text-rust">↑</span> main
                  </span>
                  <span className="truncate text-paper/70">
                    {ACHIEVEMENTS.length} milestones logged
                  </span>
                </>
              )}
            </div>
          </div>
        </FadeUp>
      </Section>
    </>
  );
};

export default Skills;

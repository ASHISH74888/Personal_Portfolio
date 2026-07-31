import React from "react";
import Section from "./Section";
import { SectionHeading, FadeUp } from "./Editorial";
import { Parallax } from "./Parallax";

const CAPABILITIES = [
  {
    no: "a",
    title: "Backend architecture",
    desc: "Event-driven systems with Kafka, AVRO, and Elasticsearch pipelines.",
  },
  {
    no: "b",
    title: "Full-stack delivery",
    desc: "From MongoDB and Node to a considered React interface.",
  },
  {
    no: "c",
    title: "Performance",
    desc: "Cutting query counts and latency — 4 calls down to 1.",
  },
  {
    no: "d",
    title: "Scale",
    desc: "Services that hold up as demand and data grow.",
  },
];

const STATS = [
  { value: "4+", label: "Years writing code" },
  { value: "30+", label: "Projects shipped" },
  { value: "$7K+", label: "Value engineered" },
];

const About: React.FC = () => {
  return (
    <Section id="about" className="relative">
      <SectionHeading
        index="02"
        kicker="About the engineer"
        title={
          <>
            Beyond the <span className="font-normal text-rust">console</span>,
            <br className="hidden md:block" /> a way of working.
          </>
        }
      />

      <div className="grid md:grid-cols-[1.05fr_0.95fr] gap-12 md:gap-20 mt-14">
        {/* Narrative */}
        <div className="max-w-xl">
          <FadeUp>
            <p className="text-lg text-ink-soft leading-relaxed mb-6">
              My work has never been about syntax. It began with one question —
              how do we build systems that handle millions of requests without
              blinking? — and it turned into a craft: the architecture of
              possibility.
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="text-lg text-ink-soft leading-relaxed mb-6">
              As a full-stack engineer I focus on backend performance and
              scalable architecture. Today, at{" "}
              <span className="text-ink font-medium">Praan.inc</span>, I build a
              real-time IoT + SaaS dashboard —{" "}
              <span className="text-ink font-medium">MQTT</span> pipelines,{" "}
              <span className="text-ink font-medium">Redis</span> caching, and
              RBAC at its core. Before that, at{" "}
              <span className="text-ink font-medium">Bolt.Earth</span>, I
              architected event-driven systems with{" "}
              <span className="text-ink font-medium">Kafka</span> and{" "}
              <span className="text-ink font-medium">Elasticsearch</span> that
              changed how data moved — cutting latency and operational cost.
            </p>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="text-lg text-ink-soft leading-relaxed">
              I'm at home in the complexity of distributed systems and the
              craft of the interface alike. Whether it's making a MongoDB query
              run four times faster or setting type on a page, I bring the same
              performance-first, detail-obsessed mind to every line.
            </p>
          </FadeUp>

          {/* Stats ledger */}
          <div className="mt-12 grid grid-cols-3 border-t border-ink/15 pt-8">
            {STATS.map((s, i) => (
              <FadeUp key={s.label} delay={0.1 + i * 0.08}>
                <div className="pr-4">
                  <div className="font-display text-4xl md:text-5xl font-medium text-ink leading-none">
                    {s.value}
                  </div>
                  <div className="meta mt-2 leading-snug">{s.label}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>

        {/* Capabilities — an indexed list, drifting gently */}
        <Parallax speed={0.1}>
          <ul className="border-t border-ink/15">
            {CAPABILITIES.map((c, i) => (
              <FadeUp key={c.no} delay={i * 0.08}>
                <li className="group flex gap-6 py-6 border-b border-ink/15">
                  <span className="folio text-3xl w-8 shrink-0 text-rust/70">
                    {c.no}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-medium text-ink mb-1 group-hover:text-rust transition-colors">
                      {c.title}
                    </h3>
                    <p className="text-ink-soft leading-relaxed">{c.desc}</p>
                  </div>
                </li>
              </FadeUp>
            ))}
          </ul>
        </Parallax>
      </div>
    </Section>
  );
};

export default About;

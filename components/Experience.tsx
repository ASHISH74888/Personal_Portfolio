import React, { useRef } from "react";
import Section from "./Section";
import { SectionHeading, FadeUp } from "./Editorial";
import { EXPERIENCE, EDUCATION } from "../constants";
import { motion, useScroll } from "framer-motion";

const stripMarkup = (s: string) =>
  s.split(/(\*\*.*?\*\*)/).map((part, i) =>
    part.startsWith("**") ? (
      <strong key={i} className="text-ink font-semibold">
        {part.replace(/\*\*/g, "")}
      </strong>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  );

const Experience: React.FC = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });

  return (
    <Section id="experience">
      <SectionHeading
        index="03"
        kicker="Curriculum vitae"
        title={
          <>
            The journey <span className="italic font-normal text-rust">so far</span>
          </>
        }
      />

      <div ref={ref} className="grid md:grid-cols-2 gap-14 md:gap-20 mt-16">
        {/* Work */}
        <div>
          <div className="flex items-baseline justify-between border-b border-ink/20 pb-3 mb-10">
            <h3 className="font-display text-xl font-medium text-ink">
              Work Experience
            </h3>
            <span className="meta">Professional</span>
          </div>

          <div className="relative pl-6">
            {/* base + progress rule */}
            <div className="absolute left-0 top-1 bottom-1 w-px bg-ink/15" />
            <motion.div
              style={{ scaleY: scrollYProgress }}
              className="absolute left-0 top-1 bottom-1 w-px bg-rust origin-top"
            />

            <div className="space-y-14">
              {EXPERIENCE.map((exp, index) => (
                <FadeUp key={index} delay={index * 0.1}>
                  <article className="group relative">
                    <span className="absolute -left-[28.5px] top-2 h-2.5 w-2.5 rounded-full bg-paper border border-ink group-hover:bg-rust group-hover:border-rust transition-colors" />
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h4 className="font-display text-2xl font-medium text-ink group-hover:text-rust transition-colors">
                        {exp.role}
                      </h4>
                      <span className="meta">{exp.period}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 mb-4">
                      <span className="text-ink-soft font-medium">
                        {exp.company}
                      </span>
                      <span className="text-ink-faint">·</span>
                      <span className="meta">{exp.location}</span>
                    </div>
                    <ul className="space-y-2.5">
                      {exp.description.map((point, i) => (
                        <li
                          key={i}
                          className="flex gap-3 text-ink-soft leading-relaxed"
                        >
                          <span className="mt-[0.7em] h-1 w-1 shrink-0 rounded-full bg-rust/60" />
                          <span>{stripMarkup(point)}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>

        {/* Education */}
        <div>
          <div className="flex items-baseline justify-between border-b border-ink/20 pb-3 mb-10">
            <h3 className="font-display text-xl font-medium text-ink">
              Education
            </h3>
            <span className="meta">Academic</span>
          </div>

          <div className="relative pl-6">
            <div className="absolute left-0 top-1 bottom-1 w-px bg-ink/15" />
            <div className="space-y-12">
              {EDUCATION.map((edu, index) => (
                <FadeUp key={index} delay={index * 0.1}>
                  <article className="group relative">
                    <span className="absolute -left-[28.5px] top-2 h-2.5 w-2.5 rounded-full bg-paper border border-ink" />
                    <span className="meta block mb-2">{edu.period}</span>
                    <h4 className="font-display text-2xl font-medium text-ink leading-snug">
                      {edu.degree}
                    </h4>
                    <h5 className="text-ink-soft mt-1">{edu.institution}</h5>
                    {edu.score && (
                      <span className="meta mt-2 inline-block text-rust">
                        {edu.score}
                      </span>
                    )}
                  </article>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Experience;

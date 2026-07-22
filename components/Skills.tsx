import React from "react";
import Section from "./Section";
import TechMarquee from "./TechMarquee";
import { SectionHeading, FadeUp } from "./Editorial";
import { SKILLS, ACHIEVEMENTS } from "../constants";

const Skills: React.FC = () => {
  return (
    <>
      {/* Marquee band sits full-width above the section */}
      <div className="max-w-6xl mx-auto px-5 md:px-8 pt-8">
        <p className="kicker text-center mb-5">Tools of the trade</p>
        <TechMarquee />
      </div>

      <Section id="skills" className="!pt-16">
        <SectionHeading
          index="05"
          kicker="Capabilities & honours"
          title={
            <>
              The technical{" "}
              <span className="italic font-normal text-rust">arsenal</span>
            </>
          }
        />

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-14 md:gap-20 mt-16">
          {/* Skills */}
          <div>
            <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
              {SKILLS.map((group, index) => (
                <FadeUp key={index} delay={index * 0.06}>
                  <div className="border-t border-ink/20 pt-4">
                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="folio italic text-xl text-rust/70">
                        {String.fromCharCode(97 + index)}
                      </span>
                      <h3 className="font-display text-xl font-medium text-ink">
                        {group.category}
                      </h3>
                    </div>
                    <ul className="space-y-1.5">
                      {group.items.map((item, i) => (
                        <li
                          key={i}
                          className="text-ink-soft leading-relaxed"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h3 className="font-display text-2xl font-medium text-ink border-b border-ink/20 pb-3 mb-8">
              Selected honours
            </h3>
            <ol className="space-y-8">
              {ACHIEVEMENTS.map((achievement, index) => (
                <FadeUp key={index} delay={index * 0.08}>
                  <li className="flex gap-5">
                    <span className="folio italic text-3xl text-rust/70 leading-none">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-ink-soft leading-relaxed pt-1">
                      {achievement
                        .split(/(\(\d{4}\))/)
                        .map((part, i) =>
                          part.match(/\(\d{4}\)/) ? (
                            <span key={i} className="text-rust font-medium">
                              {part}
                            </span>
                          ) : (
                            <React.Fragment key={i}>{part}</React.Fragment>
                          ),
                        )}
                    </p>
                  </li>
                </FadeUp>
              ))}
            </ol>
          </div>
        </div>
      </Section>
    </>
  );
};

export default Skills;

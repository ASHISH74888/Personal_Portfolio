import React from "react";
import { PROJECTS } from "../constants";
import { SectionHeading, FadeUp } from "./Editorial";
import { ParallaxImage } from "./Parallax";
import { ArrowUpRight } from "lucide-react";

const ProjectEntry: React.FC<{
  project: (typeof PROJECTS)[0];
  index: number;
}> = ({ project, index }) => {
  const flip = index % 2 === 1;

  return (
    <FadeUp>
      <article className="group grid md:grid-cols-2 gap-7 sm:gap-8 md:gap-10 lg:gap-14 items-center py-12 sm:py-16 border-t border-ink/15">
        {/* Image plate */}
        <figure
          className={`relative aspect-[16/10] xs:aspect-[4/3] overflow-hidden border border-ink/20 bg-paper-sunk ${
            flip ? "md:order-2" : ""
          }`}
        >
          <ParallaxImage
            src={project.image}
            alt={project.name}
            intensity={0.22}
            className="plate"
          />
        </figure>

        {/* Text */}
        <div className={`min-w-0 ${flip ? "md:order-1" : ""}`}>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-3 sm:mb-4">
            <span className="folio text-4xl xs:text-5xl md:text-6xl">
              0{index + 1}
            </span>
            <span className="meta">{project.period}</span>
          </div>

          <h3 className="font-display text-2xl xs:text-3xl md:text-4xl font-medium text-ink mb-1 group-hover:text-rust transition-colors">
            {project.name}
          </h3>
          <p className="meta uppercase mb-4 sm:mb-5">{project.role}</p>

          <p className="lede text-ink-soft mb-5 sm:mb-6 max-w-lg">
            {project.description}
          </p>

          <ul className="space-y-2 mb-6 sm:mb-7 max-w-lg">
            {project.points.map((p, i) => (
              <li
                key={i}
                className="flex gap-2.5 sm:gap-3 text-ink-soft leading-relaxed"
              >
                <span className="mt-[0.7em] h-1 w-1 shrink-0 rounded-full bg-rust/60" />
                <span>{p}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-2 mb-6 sm:mb-7">
            {project.tech.map((t) => (
              <span key={t} className="meta border border-ink/20 px-2 sm:px-2.5 py-1">
                {t}
              </span>
            ))}
          </div>

          <a
            href="#"
            className="link-underline inline-flex items-center gap-1.5 py-1 text-ink font-medium"
          >
            View project
            <ArrowUpRight size={17} />
          </a>
        </div>
      </article>
    </FadeUp>
  );
};

const Projects: React.FC = () => {
  return (
    <section
      id="projects"
      className="px-page py-20 sm:py-24 md:py-32 max-w-6xl 2xl:max-w-7xl mx-auto"
    >
      <SectionHeading
        index="04"
        kicker="Selected work"
        title={
          <>
            Things I've <span className="font-normal text-rust">built</span>
          </>
        }
      />
      <p className="lede mt-5 sm:mt-6 max-w-xl text-ink-soft">
        A short index of projects where I've architected systems and worked
        through genuinely hard problems.
      </p>

      <div className="mt-8 sm:mt-10">
        {PROJECTS.map((project, index) => (
          <ProjectEntry key={index} project={project} index={index} />
        ))}
        <div className="border-t border-ink/15" />
      </div>
    </section>
  );
};

export default Projects;

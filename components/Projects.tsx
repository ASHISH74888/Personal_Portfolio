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
      <article className="group grid md:grid-cols-2 gap-8 md:gap-14 items-center py-16 border-t border-ink/15">
        {/* Image plate */}
        <figure
          className={`relative aspect-[4/3] overflow-hidden border border-ink/20 bg-paper-sunk ${
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
        <div className={flip ? "md:order-1" : ""}>
          <div className="flex items-baseline gap-4 mb-4">
            <span className="folio text-5xl md:text-6xl">
              0{index + 1}
            </span>
            <span className="meta">{project.period}</span>
          </div>

          <h3 className="font-display text-3xl md:text-4xl font-medium text-ink mb-1 group-hover:text-rust transition-colors">
            {project.name}
          </h3>
          <p className="meta uppercase mb-5">{project.role}</p>

          <p className="text-lg text-ink-soft leading-relaxed mb-6 max-w-lg">
            {project.description}
          </p>

          <ul className="space-y-2 mb-7 max-w-lg">
            {project.points.map((p, i) => (
              <li
                key={i}
                className="flex gap-3 text-ink-soft leading-relaxed"
              >
                <span className="mt-[0.7em] h-1 w-1 shrink-0 rounded-full bg-rust/60" />
                <span>{p}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-7">
            {project.tech.map((t) => (
              <span key={t} className="meta border border-ink/20 px-2.5 py-1">
                {t}
              </span>
            ))}
          </div>

          <a
            href="#"
            className="link-underline inline-flex items-center gap-1.5 text-ink font-medium"
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
    <section id="projects" className="py-24 md:py-32 px-5 md:px-8 max-w-6xl mx-auto">
      <SectionHeading
        index="04"
        kicker="Selected work"
        title={
          <>
            Things I've <span className="font-normal text-rust">built</span>
          </>
        }
      />
      <p className="mt-6 max-w-xl text-lg text-ink-soft">
        A short index of projects where I've architected systems and worked
        through genuinely hard problems.
      </p>

      <div className="mt-10">
        {PROJECTS.map((project, index) => (
          <ProjectEntry key={index} project={project} index={index} />
        ))}
        <div className="border-t border-ink/15" />
      </div>
    </section>
  );
};

export default Projects;

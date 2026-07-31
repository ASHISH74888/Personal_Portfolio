import React from "react";
import { PERSONAL_INFO } from "../constants";

const Footer: React.FC = () => {
  return (
    <footer className="bg-ink text-paper">
      <div className="px-page max-w-6xl 2xl:max-w-7xl mx-auto pt-12 sm:pt-16 pb-[calc(3rem+env(safe-area-inset-bottom))] sm:pb-[calc(4rem+env(safe-area-inset-bottom))]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-10">
          <div className="min-w-0">
            <h2 className="font-display text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-medium leading-none">
              Ashish Kumar
              <br />
              Singh
            </h2>
            <p className="kicker text-paper/50 mt-4 sm:mt-5">
              Software Engineer — {PERSONAL_INFO.location}
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 sm:gap-x-10 gap-y-2">
            {PERSONAL_INFO.socials.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline py-1 text-paper/80 hover:text-paper"
              >
                {s.name}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 sm:mt-16 pt-6 border-t border-paper/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="meta text-paper/50 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-rust">↑</span> main
            <span className="text-paper/25">·</span>
            © {new Date().getFullYear()}
            <span className="text-paper/25">·</span>
            all rights reserved
          </span>
          <span className="meta text-paper/50">
            Designed & built with intent.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

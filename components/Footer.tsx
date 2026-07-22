import React from "react";
import { PERSONAL_INFO } from "../constants";

const Footer: React.FC = () => {
  return (
    <footer className="bg-ink text-paper">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div>
            <h2 className="font-display text-4xl md:text-6xl font-medium leading-none">
              Ashish Kumar
              <br />
              Singh
            </h2>
            <p className="kicker text-paper/50 mt-5">
              Software Engineer — {PERSONAL_INFO.location}
            </p>
          </div>

          <div className="flex flex-wrap gap-x-10 gap-y-3">
            {PERSONAL_INFO.socials.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-paper/80 hover:text-paper"
              >
                {s.name}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-paper/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="meta text-paper/50 flex items-center gap-2">
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

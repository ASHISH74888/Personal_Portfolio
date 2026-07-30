import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { PERSONAL_INFO } from "../constants";

const LINKS = [
  { label: "Console", id: "console", no: "01" },
  { label: "About", id: "about", no: "02" },
  { label: "Journey", id: "experience", no: "03" },
  { label: "Work", id: "projects", no: "04" },
  { label: "Skills", id: "skills", no: "05" },
  { label: "Contact", id: "contact", no: "06" },
];

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className={`fixed top-0 left-0 right-0 z-[90] transition-colors duration-500 ${
        scrolled
          ? "bg-paper/85 backdrop-blur-sm border-b border-ink/12"
          : "border-b border-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between gap-6 px-5 md:px-8 h-16">
        {/* Masthead */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-baseline gap-2.5 group shrink-0"
          aria-label="Back to top"
        >
          <span className="font-display text-xl font-semibold tracking-tight text-ink">
            Ashish Kumar Singh
          </span>
          {/* <span className="hidden sm:inline meta">— Engineer</span> */}
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`link-underline text-sm tracking-wide transition-colors ${
                active === link.id ? "text-rust link-retract" : "text-ink-soft"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-4 shrink-0">
          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            className="hidden sm:inline-flex items-center gap-2 border border-ink px-4 py-1.5 text-sm text-ink hover:bg-ink hover:text-paper transition-colors duration-300"
          >
            Get in touch
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden text-ink"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-paper border-t border-ink/12"
          >
            <div className="px-5 py-4 flex flex-col">
              {LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="flex items-baseline gap-3 py-3 border-b border-ink/10 text-left"
                >
                  <span className="meta text-rust">{link.no}</span>
                  <span
                    className={`font-display text-lg ${
                      active === link.id ? "text-rust" : "text-ink"
                    }`}
                  >
                    {link.label}
                  </span>
                </button>
              ))}
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="mt-4 text-center border border-ink px-4 py-3 text-ink"
              >
                Get in touch
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;

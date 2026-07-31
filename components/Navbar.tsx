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

  /* The page scroller is the root element (`html` sets overflow-x, which
     stops body→viewport overflow propagation), so the lock has to go there
     — `body { overflow: hidden }` would be a no-op. */
  const unlockScroll = () => {
    document.documentElement.style.overflow = "";
  };

  /* While the mobile sheet is open: freeze the page behind it, close on
     Escape, and close if the viewport grows into the desktop layout. */
  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      unlockScroll();
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const scrollTo = (id: string) => {
    setOpen(false);
    // Release the lock now, not on effect cleanup: scrollIntoView below runs
    // in this same tick and would be a no-op against a locked root.
    unlockScroll();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className={`fixed top-0 left-0 right-0 z-[90] transition-colors duration-500 ${
        scrolled || open
          ? "bg-paper/90 backdrop-blur-sm border-b border-ink/12"
          : "border-b border-transparent"
      }`}
    >
      <nav className="px-page max-w-6xl 2xl:max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6 h-14 sm:h-16">
        {/* Masthead */}
        <button
          onClick={() => {
            setOpen(false);
            unlockScroll();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-baseline gap-2.5 group min-w-0"
          aria-label="Back to top"
        >
          <span className="font-display text-[1.0625rem] xs:text-lg sm:text-xl font-semibold tracking-tight text-ink truncate">
            Ashish Kumar Singh
          </span>
          {/* <span className="hidden sm:inline meta">— Engineer</span> */}
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-5 lg:gap-7">
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
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            className="hidden sm:inline-flex items-center gap-2 border border-ink px-3 lg:px-4 py-1.5 text-sm text-ink hover:bg-ink hover:text-paper transition-colors duration-300"
          >
            Get in touch
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden -mr-2 grid h-11 w-11 place-items-center text-ink"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden bg-paper border-t border-ink/12"
          >
            {/* Capped and scrollable: the sheet still works in phone
                landscape, where six links exceed the viewport height. */}
            <div className="px-page pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex flex-col max-h-[calc(100dvh-3.5rem)] overflow-y-auto">
              {LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="flex items-baseline gap-3 min-h-[3rem] py-3 border-b border-ink/10 text-left"
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
                className="mt-4 mb-1 text-center border border-ink px-4 py-3 text-ink"
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

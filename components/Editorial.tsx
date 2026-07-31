import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ============================================================
   Shared editorial primitives (React side)
   ============================================================ */

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/**
 * Line-mask reveal — the block slides up from behind a clipping edge.
 * The signature "printed" reveal. Respects reduced motion via framer.
 */
export const Reveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "span";
}> = ({ children, delay = 0, className = "", as = "div" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const Tag = as === "span" ? motion.span : motion.div;

  return (
    <span ref={ref} className="reveal-mask">
      <Tag
        initial={{ y: "110%" }}
        animate={inView ? { y: "0%" } : { y: "110%" }}
        transition={{ duration: 0.9, ease: EASE, delay }}
        className={className}
        style={{ display: as === "span" ? "inline-block" : "block" }}
      >
        {children}
      </Tag>
    </span>
  );
};

/** Simple fade-up for body blocks (no blur — reads as intentional). */
export const FadeUp: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}> = ({ children, delay = 0, className = "", y = 24 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Editorial section heading: folio number · kicker · rule, then a
 * serif display title. Used across every section for consistency.
 */
export const SectionHeading: React.FC<{
  index: string; // "01"
  kicker: string;
  title: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}> = ({ index, kicker, title, align = "left", className = "" }) => (
  <div className={`${align === "center" ? "text-center" : ""} ${className}`}>
    <FadeUp y={16}>
      <div
        className={`flex items-center gap-3 sm:gap-4 mb-5 sm:mb-7 ${
          align === "center" ? "justify-center" : ""
        }`}
      >
        <span className="kicker text-rust whitespace-nowrap">No.{index}</span>
        <span className="h-px w-8 sm:w-12 shrink-0 bg-ink/25" />
        <span className="kicker">{kicker}</span>
      </div>
    </FadeUp>
    <h2 className="display-lg font-display font-medium text-ink">{title}</h2>
  </div>
);

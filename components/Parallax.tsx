import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  MotionValue,
} from "framer-motion";
import { useIsDesktop } from "./useMediaQuery";

/* ============================================================
   Parallax primitives — scroll-driven depth
   ------------------------------------------------------------
   The signature "premium website" effect: as the page scrolls,
   different layers translate at different speeds, creating a
   sense of depth. All of these track the element as it passes
   through the viewport (offset start-end -> end-start) so the
   motion is tied to the element itself, not the whole page.

   Everything here respects prefers-reduced-motion, and depth is only
   applied from `md` up: on a phone the columns are stacked and full-width,
   so drifting layers buy nothing and cost scroll smoothness.
   ============================================================ */

type Direction = "up" | "down" | "left" | "right";

interface ParallaxProps {
  children: React.ReactNode;
  /** How far it drifts, as a fraction of the element's size.
   *  0.15 = subtle, 0.4 = strong. Default 0.2. */
  speed?: number;
  /** Which way the layer travels as you scroll down. Default "up". */
  direction?: Direction;
  className?: string;
  /** Softens the motion with a spring so it lags slightly behind the
   *  scroll — the classic "expensive" feel. Default true. */
  smooth?: boolean;
}

const SPRING = { stiffness: 120, damping: 30, restDelta: 0.001 };

/**
 * Wrap any element to give it scroll parallax. Safest on absolutely
 * positioned / decorative layers, but subtle values (<=0.25) are fine
 * on content too given the generous section padding.
 */
export const Parallax: React.FC<ParallaxProps> = ({
  children,
  speed = 0.2,
  direction = "up",
  className = "",
  smooth = true,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const isDesktop = useIsDesktop();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Distance travelled across the full pass, in % of own size.
  const amount = speed * 100;
  const horizontal = direction === "left" || direction === "right";
  const sign = direction === "up" || direction === "left" ? -1 : 1;

  // As the element enters (0) -> leaves (1), travel from +amount to -amount
  // (for "up"). Element sits at 0 offset when centered in the viewport.
  const raw = useTransform(
    scrollYProgress,
    [0, 1],
    [`${-sign * amount}%`, `${sign * amount}%`],
  );
  const smoothed = useSpring(raw, SPRING);
  const value = smooth ? smoothed : raw;

  // The ref MUST stay attached even when we opt out of the motion, because
  // useScroll above is already tracking it — a defined-but-unmounted target
  // makes framer-motion throw ("Target ref is defined but not hydrated").
  if (reduce || !isDesktop) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      style={horizontal ? { x: value } : { y: value }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Full-bleed image with a slow inward parallax. The image is rendered
 * taller than its frame and slides within it, so the frame stays put
 * while the picture drifts — the classic editorial reveal.
 *
 * Parent MUST be `relative overflow-hidden`.
 */
export const ParallaxImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  /** Overscan as a fraction; 0.2 = image is 20% taller than frame. */
  intensity?: number;
}> = ({ src, alt, className = "", intensity = 0.2 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const isDesktop = useIsDesktop();
  const still = reduce || !isDesktop;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const pct = intensity * 100;
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${-pct / 2}%`, `${pct / 2}%`],
  );
  const smoothY = useSpring(y, SPRING);

  // Grow the picture vertically (height 100%+overscan, pulled up by half the
  // overscan so it's centered) so there's room to travel inside the frame.
  // When it isn't going to travel, it fills the frame exactly instead.
  const imgStyle: React.CSSProperties = still
    ? { height: "100%", top: 0 }
    : { height: `${100 + pct}%`, top: `${-pct / 2}%` };

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        style={still ? imgStyle : { ...imgStyle, y: smoothY }}
        className={`absolute left-0 w-full object-cover ${className}`}
      />
    </div>
  );
};

/** Expose the shared scroll value if a caller wants to drive its own transforms. */
export const useParallaxProgress = (
  ref: React.RefObject<HTMLElement>,
): MotionValue<number> => {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  return scrollYProgress;
};

export default Parallax;

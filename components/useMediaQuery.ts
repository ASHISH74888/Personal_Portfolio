import { useEffect, useState } from "react";

/**
 * Subscribe to a media query.
 *
 * The initial value is read synchronously on the first render, so components
 * that branch on it don't render the wrong tree once and then swap — which
 * would remount their subtree and throw away state (the code plate's active
 * tab, for one). Guarded for non-browser environments.
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
};

/**
 * Tablet-and-up: the width where depth effects have room to breathe. Width is
 * deliberately the signal here — hover/pointer media queries describe only the
 * primary pointer and misreport on hybrid machines.
 */
export const useIsDesktop = () => useMediaQuery("(min-width: 768px)");

import { useState, useEffect } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback) {
  const mediaQuery = window.matchMedia(QUERY);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(QUERY).matches;
}

export function usePrefersReducedMotion() {
  const [matches, setMatches] = useState(getSnapshot);

  useEffect(() => {
    return subscribe(() => {
      setMatches(getSnapshot());
    });
  }, []);

  return matches;
}

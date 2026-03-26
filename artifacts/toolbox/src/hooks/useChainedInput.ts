import { useEffect, useState } from "react";

/**
 * Reads ?input= from the URL on mount and returns it as the initial value.
 * Used for tool chaining — when one tool sends its output to another.
 */
export function useChainedInput(fallback = "") {
  const [initial] = useState(() => {
    if (typeof window === "undefined") return fallback;
    const params = new URLSearchParams(window.location.search);
    const val = params.get("input");
    return val ? decodeURIComponent(val) : fallback;
  });
  return initial;
}

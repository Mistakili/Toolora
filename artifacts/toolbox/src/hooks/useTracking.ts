import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

const API_BASE = "";

function getSessionId(): string {
  const key = "toolora_session_id";
  let sid = sessionStorage.getItem(key);
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem(key, sid);
  }
  return sid;
}

export function useTracking() {
  const [location] = useLocation();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    // De-duplicate: only track when the path actually changes
    if (location === lastTracked.current) return;
    lastTracked.current = location;

    const payload = {
      path: location,
      referrer: document.referrer || undefined,
      sessionId: getSessionId(),
    };

    // Use sendBeacon when available for reliability during page unload
    const body = JSON.stringify(payload);
    const url = `${API_BASE}/api/analytics/track`;

    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon(url, blob);
    } else {
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {}); // Silently ignore errors
    }
  }, [location]);
}

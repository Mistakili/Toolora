import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * The /x402 page used to advertise a 10% take rate and "early access waitlist."
 * That contradicts the new positioning ("Stablecoin payments rail for the
 * agent economy, 5% take rate, live now"). Per the May 2 runbook (Block 7),
 * we permanently redirect /x402 → /gateway.
 *
 * wouter doesn't ship a Navigate component, so this is a tiny effect that
 * replaces the URL on mount. SSR / no-JS users still get the canonical hint
 * via SEO — but the toolbox is a client-rendered SPA, so this is enough.
 */
export default function X402Redirect() {
  const [, setLocation] = useLocation();
  useEffect(() => {
    setLocation("/gateway", { replace: true });
  }, [setLocation]);
  return (
    <main className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 className="text-xl font-semibold text-zinc-100">Moved to /gateway</h1>
      <p className="text-sm text-zinc-400 mt-2">
        The x402 page has been replaced by{" "}
        <a href="/gateway" className="text-emerald-400 hover:underline">
          Toolora Gateway
        </a>{" "}
        — the stablecoin payments rail for MCP servers.
      </p>
    </main>
  );
}

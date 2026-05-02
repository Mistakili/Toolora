import { useParams } from "wouter";
import { useEffect, useState } from "react";

/**
 * Iframe-safe badge that any MCP owner can drop into their GitHub README:
 *
 *   <iframe
 *     src="https://toolora.dev/embed/gateway-badge/<listingId>"
 *     width="320" height="120" frameborder="0"
 *     style="border:0; border-radius:12px;">
 *   </iframe>
 *
 * Renders without the app shell so it tile-fits inside an iframe. Data is
 * served by GET /api/gateway/public-stats/:listingId, which itself is gated
 * by the owner-set embed_enabled flag.
 */

interface PublicStats {
  totals: { calls: number; settled: number; failed: number };
  usdc: { callerPaidUsd: number; ownerEarnedUsd: number; tooloraFeeUsd: number };
  mode: string;
  lastSettledAt: string | null;
}

function fmtUsd(n: number): string {
  if (n === 0) return "$0.00";
  if (n < 0.01) return `$${n.toFixed(6)}`;
  if (n < 1) return `$${n.toFixed(4)}`;
  return `$${n.toFixed(2)}`;
}

export default function GatewayBadgeEmbed() {
  const params = useParams<{ listingId: string }>();
  const listingId = params.listingId ?? "";
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!listingId) return;
    let alive = true;
    const load = async () => {
      try {
        const r = await fetch(`/api/gateway/public-stats/${encodeURIComponent(listingId)}`, {
          headers: { accept: "application/json" },
        });
        if (r.status === 404) {
          if (alive) setError("Embed not enabled for this listing");
          return;
        }
        if (!r.ok) throw new Error(`http ${r.status}`);
        const data = (await r.json()) as PublicStats;
        if (alive) {
          setStats(data);
          setError(null);
        }
      } catch {
        if (alive) setError("Connecting…");
      }
    };
    load();
    const id = setInterval(load, 30_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [listingId]);

  return (
    <div
      style={{
        margin: 0,
        padding: 12,
        fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
        background: "linear-gradient(135deg,#0a0f0d,#0c1411)",
        color: "#e5e7eb",
        minHeight: "100vh",
      }}
    >
      <a
        href={`https://toolora.dev/gateway`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block",
          textDecoration: "none",
          color: "inherit",
          border: "1px solid rgba(16,185,129,0.25)",
          borderRadius: 12,
          background: "rgba(6,78,59,0.18)",
          padding: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#34d399",
                boxShadow: "0 0 6px #34d399",
              }}
            />
            <span style={{ fontSize: 11, fontWeight: 600, color: "#6ee7b7", letterSpacing: 1, textTransform: "uppercase" }}>
              Toolora Gateway · Live
            </span>
          </div>
          <span style={{ fontSize: 10, color: "#71717a" }}>USDC settled on-chain</span>
        </div>

        {error ? (
          <div style={{ fontSize: 12, color: "#a1a1aa" }}>{error}</div>
        ) : stats ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div>
              <div style={{ fontSize: 10, color: "#71717a", textTransform: "uppercase", letterSpacing: 1 }}>Calls</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#f4f4f5", fontVariantNumeric: "tabular-nums" }}>
                {stats.totals.settled}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#71717a", textTransform: "uppercase", letterSpacing: 1 }}>USDC paid</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#34d399", fontVariantNumeric: "tabular-nums" }}>
                {fmtUsd(stats.usdc.callerPaidUsd)}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ fontSize: 12, color: "#71717a" }}>Loading…</div>
        )}

        <div style={{ marginTop: 8, fontSize: 10, color: "#52525b", textAlign: "right" }}>
          powered by toolora.dev
        </div>
      </a>
    </div>
  );
}

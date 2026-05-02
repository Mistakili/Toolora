import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Trophy, ExternalLink, ArrowLeft } from "lucide-react";

/**
 * Toolora Index — public leaderboard of top-earning gateway listings.
 *
 * Opt-in only (leaderboard_opt_in flag on gateway_configs). Aggregates
 * settled USDC volume across listings whose owners have explicitly turned
 * on public ranking. Refreshes every 60 s.
 *
 * Purpose: free social proof + viral loop. Top earners screenshot their
 * rank; everyone else wants to climb. Every visit is a free distribution
 * surface for the gateway product itself.
 */

interface LeaderboardEntry {
  rank: number;
  listingId: string;
  name: string;
  slug: string | null;
  calls: number;
  ownerEarnedUsd: number;
  callerPaidUsd: number;
}

interface LeaderboardPayload {
  ok: true;
  generatedAt: string;
  entries: LeaderboardEntry[];
}

function fmtUsd(n: number): string {
  if (n === 0) return "$0.00";
  if (n < 0.01) return `$${n.toFixed(6)}`;
  if (n < 1) return `$${n.toFixed(4)}`;
  return `$${n.toFixed(2)}`;
}

const MEDAL = ["🥇", "🥈", "🥉"];

export default function Leaderboard() {
  const [data, setData] = useState<LeaderboardPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r = await fetch("/api/gateway/leaderboard");
        const j = (await r.json()) as LeaderboardPayload;
        if (alive && j.ok) {
          setData(j);
          setLoading(false);
        }
      } catch {
        if (alive) setLoading(false);
      }
    };
    load();
    const id = setInterval(load, 60_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/gateway" className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 mb-4">
        <ArrowLeft className="w-3 h-3" /> Back to Gateway
      </Link>

      <header className="mb-8 flex items-start gap-3">
        <Trophy className="w-7 h-7 text-amber-400 mt-0.5 shrink-0" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100">Toolora Index</h1>
          <p className="text-sm text-zinc-400 mt-1.5 max-w-2xl">
            The top-earning MCP servers on the Toolora Gateway, ranked by USDC paid by AI agents.
            Listings appear here only when their owner explicitly opts in.
          </p>
        </div>
      </header>

      {loading && <p className="text-sm text-zinc-500">Loading the index…</p>}

      {data && data.entries.length === 0 && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 text-center">
          <p className="text-sm text-zinc-400">
            No listings have opted into the public index yet. Be the first —{" "}
            <Link href="/submit-mcp" className="text-emerald-400 hover:underline">
              list your MCP
            </Link>{" "}
            and turn on "Show on Toolora Index" in your dashboard.
          </p>
        </div>
      )}

      {data && data.entries.length > 0 && (
        <div className="space-y-2">
          {data.entries.map((entry) => (
            <div
              key={entry.listingId}
              className={`rounded-xl border p-4 flex items-center gap-4 ${
                entry.rank <= 3
                  ? "border-amber-500/30 bg-gradient-to-r from-amber-950/20 to-zinc-900/40"
                  : "border-zinc-800 bg-zinc-900/40"
              }`}
            >
              <div className="text-2xl w-10 text-center shrink-0">
                {entry.rank <= 3 ? MEDAL[entry.rank - 1] : <span className="text-sm font-bold text-zinc-500">#{entry.rank}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-zinc-100 truncate">{entry.name}</div>
                <div className="text-xs text-zinc-500 mt-0.5">
                  {entry.calls.toLocaleString()} paid call{entry.calls === 1 ? "" : "s"} · agents paid {fmtUsd(entry.callerPaidUsd)}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-lg font-bold text-emerald-400 tabular-nums">{fmtUsd(entry.ownerEarnedUsd)}</div>
                <div className="text-[10px] uppercase tracking-wider text-zinc-500">owner earned</div>
              </div>
              <Link
                href={`/mcp-hub/server/${entry.listingId}`}
                className="text-zinc-400 hover:text-zinc-200 shrink-0"
                aria-label="View listing"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      )}

      {data && (
        <p className="text-[11px] text-zinc-600 mt-6 text-center">
          Updated {new Date(data.generatedAt).toLocaleTimeString()} · refreshes every minute
        </p>
      )}
    </main>
  );
}

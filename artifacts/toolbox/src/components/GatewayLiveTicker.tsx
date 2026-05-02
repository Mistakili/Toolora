import { useEffect, useState } from "react";
import { Activity } from "lucide-react";

interface PublicStats {
  totals: { calls: number; settled: number; failed: number };
  usdc: {
    callerPaidUsd: number;
    ownerEarnedUsd: number;
    tooloraFeeUsd: number;
  };
  mode: string;
  lastSettledAt: string | null;
}

function fmtUsd(n: number): string {
  if (n === 0) return "$0.000000";
  if (n < 0.01) return `$${n.toFixed(6)}`;
  if (n < 1) return `$${n.toFixed(4)}`;
  return `$${n.toFixed(2)}`;
}

function fmtRelativeTime(iso: string | null): string {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  const sec = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (sec < 60) return `${sec}s ago`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86400)}d ago`;
}

export default function GatewayLiveTicker({ listingId }: { listingId?: string } = {}) {
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    // When a listingId is passed, fetch the per-listing public-stats endpoint
    // (gated by the owner's embed_enabled opt-in). Otherwise fall back to the
    // public demo ticker that powers the /gateway landing.
    const url = listingId
      ? `/api/gateway/public-stats/${encodeURIComponent(listingId)}`
      : "/api/gateway/public-demo-stats";
    const load = async () => {
      try {
        const r = await fetch(url, { headers: { accept: "application/json" } });
        if (!r.ok) throw new Error(`http ${r.status}`);
        const data = (await r.json()) as PublicStats;
        if (alive) {
          setStats(data);
          setError(false);
        }
      } catch {
        if (alive) setError(true);
      }
    };
    load();
    const id = setInterval(load, 20_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [listingId]);

  if (error || !stats) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 mb-6">
        <div className="flex items-center gap-2 text-zinc-500 text-sm">
          <Activity className="w-4 h-4" />
          <span>Live demo ticker — connecting…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/30 to-zinc-900/40 p-6 mb-6">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-300">
            Live demo · USDC settled
          </span>
        </div>
        <div className="text-xs text-zinc-500">
          mode: <span className="font-mono text-zinc-400">{stats.mode}</span>
          {stats.lastSettledAt ? (
            <> · last settled {fmtRelativeTime(stats.lastSettledAt)}</>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-lg bg-zinc-950/60 p-3">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Calls processed</div>
          <div className="text-xl font-bold text-zinc-100 tabular-nums">{stats.totals.calls}</div>
          <div className="text-[10px] text-zinc-600 mt-0.5">
            {stats.totals.settled} settled · {stats.totals.failed} failed
          </div>
        </div>
        <div className="rounded-lg bg-zinc-950/60 p-3">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Caller spend</div>
          <div className="text-xl font-bold text-zinc-100 tabular-nums">{fmtUsd(stats.usdc.callerPaidUsd)}</div>
          <div className="text-[10px] text-zinc-600 mt-0.5">USDC, settled on-chain</div>
        </div>
        <div className="rounded-lg bg-zinc-950/60 p-3">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Owner earned</div>
          <div className="text-xl font-bold text-emerald-400 tabular-nums">{fmtUsd(stats.usdc.ownerEarnedUsd)}</div>
          <div className="text-[10px] text-zinc-600 mt-0.5">95% — instant payout</div>
        </div>
        <div className="rounded-lg bg-zinc-950/60 p-3">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Toolora fee</div>
          <div className="text-xl font-bold text-violet-400 tabular-nums">{fmtUsd(stats.usdc.tooloraFeeUsd)}</div>
          <div className="text-[10px] text-zinc-600 mt-0.5">5% — infra + directory</div>
        </div>
      </div>

      <div className="text-[11px] text-zinc-500 mt-3 leading-relaxed">
        Live counters from the seeded demo MCP. Each call shows real ledger
        rows, real splits, real status headers — using stub-mode payments so
        anyone can try it without a wallet. Flip <span className="font-mono text-zinc-400">GATEWAY_PAYMENT_MODE=verify</span> in
        production for on-chain USDC.
      </div>
    </div>
  );
}

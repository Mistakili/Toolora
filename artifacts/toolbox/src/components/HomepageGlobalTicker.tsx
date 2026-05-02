import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Activity, ArrowRight } from "lucide-react";

interface GlobalStats {
  ok: boolean;
  window: string;
  windowLabel: string;
  generatedAt: string;
  totals: {
    calls: number;
    settledCalls: number;
    callerPaidUsd: number;
    ownerEarnedUsd: number;
    tooloraFeeUsd: number;
    distinctOwners: number;
  };
}

function fmtUsd(n: number): string {
  if (n === 0) return "$0";
  if (n < 0.01) return `$${n.toFixed(6)}`;
  if (n < 1)   return `$${n.toFixed(4)}`;
  if (n < 1000) return `$${n.toFixed(2)}`;
  return `$${(n / 1000).toFixed(1)}k`;
}

function fmtN(n: number): string {
  if (n < 1000) return n.toLocaleString();
  if (n < 1_000_000) return `${(n / 1000).toFixed(1)}k`;
  return `${(n / 1_000_000).toFixed(1)}M`;
}

export default function HomepageGlobalTicker() {
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r = await fetch("/api/gateway/global-stats?window=1h", {
          headers: { accept: "application/json" },
        });
        if (!r.ok) throw new Error(`http ${r.status}`);
        const data = (await r.json()) as GlobalStats;
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
  }, []);

  if (error || !stats) {
    return (
      <Link href="/gateway" className="block mt-8">
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center gap-2 text-emerald-300/80 text-sm">
            <Activity className="w-4 h-4" />
            <span>Live agent ticker connecting…</span>
          </div>
        </div>
      </Link>
    );
  }

  const t = stats.totals;
  return (
    <Link href="/gateway" className="block mt-8 group">
      <div className="rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-950/40 via-zinc-900/40 to-zinc-900/20 p-5 hover:border-emerald-400/50 transition-colors">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-300">
              Toolora Gateway · {stats.windowLabel}
            </span>
          </div>
          <div className="text-[11px] text-emerald-400/70 group-hover:text-emerald-300 inline-flex items-center gap-1 font-medium">
            See the live demo <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-0.5">Agent calls</div>
            <div className="text-2xl font-bold text-zinc-100 tabular-nums">{fmtN(t.calls)}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-0.5">USDC settled</div>
            <div className="text-2xl font-bold text-emerald-400 tabular-nums">{fmtUsd(t.callerPaidUsd)}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-0.5">Owners paid</div>
            <div className="text-2xl font-bold text-emerald-300 tabular-nums">{fmtUsd(t.ownerEarnedUsd)}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-0.5">Distinct owners</div>
            <div className="text-2xl font-bold text-zinc-100 tabular-nums">{fmtN(t.distinctOwners)}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}

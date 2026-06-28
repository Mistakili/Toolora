import { useEffect, useState } from "react";
import { Activity } from "lucide-react";

interface GlobalStats {
  calls: number;
  settledCalls: number;
  callerPaidUsd: number;
  ownerEarnedUsd: number;
  distinctOwners: number;
}

interface ApiResponse {
  ok: boolean;
  totals?: GlobalStats;
}

function fmtUsd(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  if (n >= 1) return `$${n.toFixed(2)}`;
  return `$${n.toFixed(4)}`;
}

function fmtNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

export function HomepageGlobalTicker() {
  const [stats, setStats] = useState<GlobalStats | null>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/gateway/global-stats?window=1h");
      if (!res.ok) return;
      const data = (await res.json()) as ApiResponse;
      if (data.ok && data.totals) setStats(data.totals);
    } catch {
      // silent — no network = no ticker, no error
    }
  };

  useEffect(() => {
    fetchStats();
    const id = setInterval(fetchStats, 20_000);
    return () => clearInterval(id);
  }, []);

  // Hide entirely when there's no gateway activity yet.
  // Avoids the embarrassing "0 calls · $0.00 settled" state.
  if (!stats || stats.calls === 0) return null;

  const dots: { label: string; value: string; color: string }[] = [
    { label: "calls", value: fmtNum(stats.calls), color: "text-primary" },
    { label: "settled", value: fmtUsd(stats.callerPaidUsd), color: "text-emerald-400" },
    { label: "owners paid", value: String(stats.distinctOwners), color: "text-blue-400" },
  ];

  return (
    <div className="mt-5 inline-flex items-center gap-3 px-4 py-2 rounded-full border border-border bg-muted/20 text-xs text-muted-foreground select-none">
      <span className="flex items-center gap-1.5 shrink-0">
        <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
        <span className="font-medium text-foreground">Live</span>
      </span>
      {dots.map((d, i) => (
        <span key={d.label} className="flex items-center gap-1.5">
          {i > 0 && <span className="opacity-30">·</span>}
          <span className={`font-semibold tabular-nums ${d.color}`}>{d.value}</span>
          <span>{d.label}</span>
        </span>
      ))}
      <span className="opacity-40">· last hour</span>
    </div>
  );
}

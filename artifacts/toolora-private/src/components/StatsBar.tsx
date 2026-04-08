interface StatsBarProps {
  totalExecutions: number;
  uniqueTools: number;
  apiHealthy: boolean;
}

export function StatsBar({ totalExecutions, uniqueTools, apiHealthy }: StatsBarProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="rounded-lg border border-border bg-card px-4 py-3 text-center">
        <div className="text-2xl font-bold text-primary font-mono">{totalExecutions}</div>
        <div className="text-xs text-muted-foreground mt-0.5">Private Executions</div>
      </div>
      <div className="rounded-lg border border-border bg-card px-4 py-3 text-center">
        <div className="text-2xl font-bold text-foreground font-mono">{uniqueTools}</div>
        <div className="text-xs text-muted-foreground mt-0.5">Tools Available</div>
      </div>
      <div className="rounded-lg border border-border bg-card px-4 py-3 text-center">
        <div className="flex items-center justify-center gap-1.5 mb-0.5">
          <span className={`status-dot ${apiHealthy ? "bg-emerald-400" : "bg-red-400"}`} />
          <span className="text-2xl font-bold text-foreground font-mono">{apiHealthy ? "Live" : "Down"}</span>
        </div>
        <div className="text-xs text-muted-foreground">MagicBlock PER</div>
      </div>
    </div>
  );
}

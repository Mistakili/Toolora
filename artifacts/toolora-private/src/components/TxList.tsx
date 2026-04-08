import { TOOL_COST_DISPLAY } from "@/lib/magicblock";

export interface TxEntry {
  toolName: string;
  toolIcon: string;
  txSignature: string;
  timestamp: number;
  success: boolean;
}

interface TxListProps {
  entries: TxEntry[];
}

export function TxList({ entries }: TxListProps) {
  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <div className="text-3xl mb-2">🕐</div>
        <div className="text-sm text-muted-foreground">No private executions yet</div>
        <div className="text-xs text-muted-foreground/60 mt-1">
          Your execution history stays private — only visible to you
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Execution History</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
          Private · This session only
        </span>
      </div>
      <div className="divide-y divide-border">
        {entries.map((entry, i) => (
          <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/20 transition-colors">
            <span className="text-lg">{entry.toolIcon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground">{entry.toolName}</div>
              <div className="text-xs text-muted-foreground font-mono truncate">
                {entry.txSignature.slice(0, 24)}...
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs text-muted-foreground font-mono">-{TOOL_COST_DISPLAY} USDC</div>
              <div className="text-xs text-muted-foreground">{new Date(entry.timestamp).toLocaleTimeString()}</div>
            </div>
            <div className={`w-2 h-2 rounded-full ${entry.success ? "bg-emerald-400" : "bg-destructive"}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

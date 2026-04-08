import { TOOL_COST_DISPLAY } from "@/lib/magicblock";
import type { Cluster } from "@/lib/magicblock";

export interface TxEntry {
  toolName: string;
  toolIcon: string;
  txSignature: string;
  timestamp: number;
  success: boolean;
  isDemo?: boolean;
  cluster?: Cluster;
}

interface TxListProps {
  entries: TxEntry[];
}

function isRealSig(sig: string): boolean {
  return /^[A-Za-z0-9]{80,}$/.test(sig) && !sig.startsWith("demo_") && !sig.startsWith("sim_");
}

export function TxList({ entries }: TxListProps) {
  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <div className="text-3xl mb-2">🕐</div>
        <div className="text-sm text-muted-foreground">No executions yet this session</div>
        <div className="text-xs text-muted-foreground/60 mt-1">
          Your execution history stays local — never uploaded to any server
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Execution History</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
          Session only · {entries.length} execution{entries.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="divide-y divide-border">
        {entries.map((entry, i) => {
          const real = isRealSig(entry.txSignature);
          return (
            <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/20 transition-colors">
              <span className="text-lg shrink-0">{entry.toolIcon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{entry.toolName}</span>
                  {entry.isDemo && (
                    <span className="text-[10px] px-1 py-0.5 rounded bg-amber-400/15 text-amber-400 border border-amber-400/20">
                      demo
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground font-mono truncate mt-0.5">
                  {real ? (
                    <a
                      href={`https://explorer.solana.com/tx/${entry.txSignature}?cluster=${entry.cluster ?? "devnet"}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                      title="View on Solana Explorer"
                    >
                      {entry.txSignature.slice(0, 28)}... ↗
                    </a>
                  ) : (
                    <span className="text-muted-foreground/50">{entry.txSignature.slice(0, 28)}...</span>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs font-mono text-muted-foreground">
                  {entry.isDemo ? (
                    <span className="text-amber-400/70">~{TOOL_COST_DISPLAY} USDC</span>
                  ) : (
                    <span>-{TOOL_COST_DISPLAY} USDC</span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </div>
              </div>
              <div
                className={`w-2 h-2 rounded-full shrink-0 ${entry.success ? "bg-emerald-400" : "bg-destructive"}`}
                title={entry.success ? "Success" : "Failed"}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

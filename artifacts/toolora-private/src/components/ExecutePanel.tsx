import { useState } from "react";
import { buildTransferTx, TOOL_COST_DISPLAY, TOOL_COST_LAMPORTS, TOOLORA_VAULT, type Cluster } from "@/lib/magicblock";
import { signAndSubmitTx } from "@/lib/solana";
import { useToast } from "@/hooks/use-toast";
import type { PrivateTool } from "@/lib/privateTools";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

interface ExecutePanelProps {
  tool: PrivateTool | null;
  publicKey: string | null;
  balance: number;
  cluster: Cluster;
  onExecuted: () => void;
}

interface ExecutionResult {
  output: string;
  txSignature: string;
  timestamp: number;
}

export function ExecutePanel({ tool, publicKey, balance, cluster, onExecuted }: ExecutePanelProps) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"idle" | "paying" | "executing" | "done">("idle");
  const { toast } = useToast();

  const canExecute = !!tool && !!publicKey && input.trim().length > 0 && balance >= TOOL_COST_LAMPORTS;

  async function handleExecute() {
    if (!tool || !publicKey || !input.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      setStep("paying");
      toast({ title: "Step 1/2: Building private payment..." });

      const unsignedTx = await buildTransferTx({
        from: publicKey,
        to: TOOLORA_VAULT,
        amount: TOOL_COST_LAMPORTS,
        cluster,
      });

      const txSignature = await signAndSubmitTx(unsignedTx);
      toast({ title: "Payment confirmed ✓", description: `Sig: ${txSignature.slice(0, 16)}...` });

      setStep("executing");
      toast({ title: "Step 2/2: Executing tool privately..." });

      const resp = await fetch(`${BASE}/api/private-execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          tool: tool.slug,
          input: input.trim(),
          txSignature,
          payer: publicKey,
          cluster,
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(err.error ?? "Execution failed");
      }

      const data = await resp.json();
      setResult({
        output: data.output,
        txSignature,
        timestamp: Date.now(),
      });
      setStep("done");
      onExecuted();
    } catch (err: unknown) {
      setStep("idle");
      toast({
        title: "Execution failed",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  if (!tool) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <div className="text-4xl mb-3">⬆️</div>
        <div className="text-muted-foreground text-sm">Select a tool above to get started</div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border bg-muted/30">
        <span className="text-xl">{tool.icon}</span>
        <div>
          <div className="font-semibold text-foreground text-sm">{tool.name}</div>
          <div className="text-xs text-muted-foreground">{tool.description}</div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Cost:</span>
          <span className="font-mono text-xs text-primary font-medium">{TOOL_COST_DISPLAY} USDC</span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-mono">
            PRIVATE
          </span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">
            {tool.inputLabel}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={tool.inputPlaceholder}
            rows={5}
            className="w-full px-3 py-2.5 text-sm rounded-lg bg-background border border-border focus:outline-none focus:border-primary text-foreground font-mono placeholder:text-muted-foreground/50 resize-none transition-colors"
          />
        </div>

        {!publicKey && (
          <div className="text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-2">
            ⚠️ Connect your wallet to execute tools with private payments
          </div>
        )}

        {publicKey && balance < TOOL_COST_LAMPORTS && (
          <div className="text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-2">
            ⚠️ Insufficient private balance. Deposit at least {TOOL_COST_DISPLAY} USDC to execute.
          </div>
        )}

        <button
          onClick={handleExecute}
          disabled={!canExecute || loading}
          className="w-full py-2.5 px-4 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed glow-purple flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {step === "paying" ? "Signing payment..." : step === "executing" ? "Running tool..." : "Processing..."}
            </>
          ) : (
            <>
              🔒 Execute Privately · {TOOL_COST_DISPLAY} USDC
            </>
          )}
        </button>

        {result && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-muted-foreground">
                {tool.outputLabel}
              </label>
              <div className="flex items-center gap-1.5">
                <span className="status-dot bg-emerald-400" />
                <span className="text-xs text-emerald-400">Executed privately</span>
              </div>
            </div>
            <div className="px-3 py-2.5 rounded-lg bg-background border border-emerald-500/20 text-sm font-mono text-foreground whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
              {result.output}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Tx:</span>
              <span className="tx-tag">{result.txSignature.slice(0, 20)}...</span>
              <span className="ml-auto">{new Date(result.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

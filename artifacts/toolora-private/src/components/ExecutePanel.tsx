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
  isDemo?: boolean;
  onExecuted: (txSig: string) => void;
  onAnimatingChange?: (animating: boolean) => void;
}

interface ExecutionResult {
  output: string;
  txSignature: string;
  timestamp: number;
  isDemo: boolean;
}

type Step = "idle" | "keypair" | "routing" | "paying" | "confirming" | "executing" | "done";

const DEMO_STEPS: { step: Step; label: string; delay: number }[] = [
  { step: "keypair",   label: "🔐 Generating ephemeral keypair...",       delay: 600 },
  { step: "routing",   label: "⚡ Routing through MagicBlock PER...",      delay: 900 },
  { step: "paying",    label: "💸 Submitting private USDC transfer...",    delay: 700 },
  { step: "confirming",label: "✅ Payment confirmed on ephemeral rollup...", delay: 500 },
  { step: "executing", label: "🔒 Executing tool in shielded enclave...",  delay: 400 },
];

export function ExecutePanel({ tool, publicKey, balance, cluster, isDemo = false, onExecuted, onAnimatingChange }: ExecutePanelProps) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [stepLabel, setStepLabel] = useState("");
  const { toast } = useToast();

  const hasSufficientBalance = isDemo || balance >= TOOL_COST_LAMPORTS;
  const canExecute = !!tool && (isDemo || !!publicKey) && input.trim().length > 0 && hasSufficientBalance;

  function fakeSig(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789";
    let sig = "";
    for (let i = 0; i < 88; i++) sig += chars[Math.floor(Math.random() * chars.length)];
    return sig;
  }

  async function runDemo() {
    if (!tool) return;
    setLoading(true);
    setResult(null);
    onAnimatingChange?.(true);

    for (const { step: _, label, delay } of DEMO_STEPS) {
      setStepLabel(label);
      await new Promise((r) => setTimeout(r, delay));
    }

    setStepLabel("🔒 Executing tool privately...");

    let output: string;
    try {
      const resp = await fetch(`${BASE}/api/private-execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          tool: tool.slug,
          input: input.trim(),
          txSignature: `demo_${Date.now()}`,
          payer: publicKey ?? "DEMO_MODE",
          cluster,
        }),
      });
      if (resp.ok) {
        const data = await resp.json();
        output = data.output;
      } else {
        output = tool.clientExecute(input.trim());
      }
    } catch {
      output = tool.clientExecute(input.trim());
    }

    const txSig = fakeSig();
    setResult({ output, txSignature: txSig, timestamp: Date.now(), isDemo: true });
    setStepLabel("");
    setLoading(false);
    onAnimatingChange?.(false);
    onExecuted(txSig);
  }

  async function runReal() {
    if (!tool || !publicKey) return;
    setLoading(true);
    setResult(null);
    onAnimatingChange?.(true);

    try {
      setStepLabel("Building private payment...");
      const unsignedTx = await buildTransferTx({
        from: publicKey,
        to: TOOLORA_VAULT,
        amount: TOOL_COST_LAMPORTS,
        cluster,
      });

      setStepLabel("Waiting for wallet signature...");
      const txSignature = await signAndSubmitTx(unsignedTx);
      toast({ title: "Payment confirmed ✓", description: `Sig: ${txSignature.slice(0, 16)}...` });

      setStepLabel("Executing tool privately...");
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
      setResult({ output: data.output, txSignature, timestamp: Date.now(), isDemo: false });
      onExecuted(txSignature);
    } catch (err: unknown) {
      toast({
        title: "Execution failed",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setStepLabel("");
      onAnimatingChange?.(false);
    }
  }

  const handleExecute = () => (isDemo ? runDemo() : runReal());

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
      {/* Tool header */}
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border bg-muted/30">
        <span className="text-xl">{tool.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-foreground text-sm">{tool.name}</div>
          <div className="text-xs text-muted-foreground truncate">{tool.description}</div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-muted-foreground">Cost:</span>
          <span className="font-mono text-xs text-primary font-medium">{TOOL_COST_DISPLAY} USDC</span>
          {isDemo && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-amber-400/15 text-amber-400 border border-amber-400/25 font-medium">
              DEMO
            </span>
          )}
          {!isDemo && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-mono">
              PRIVATE
            </span>
          )}
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
            disabled={loading}
            className="w-full px-3 py-2.5 text-sm rounded-lg bg-background border border-border focus:outline-none focus:border-primary text-foreground font-mono placeholder:text-muted-foreground/40 resize-none transition-colors disabled:opacity-60"
          />
        </div>

        {!isDemo && !publicKey && (
          <div className="text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-2">
            ⚠️ Connect your Phantom wallet to execute with private payments
          </div>
        )}

        {!isDemo && publicKey && balance < TOOL_COST_LAMPORTS && (
          <div className="text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-2">
            ⚠️ Insufficient private balance. Deposit at least {TOOL_COST_DISPLAY} USDC first.
          </div>
        )}

        {/* Step indicator */}
        {loading && stepLabel && (
          <div className="flex items-center gap-2 text-xs text-primary bg-primary/5 border border-primary/15 rounded-lg px-3 py-2">
            <span className="inline-block w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin shrink-0" />
            <span className="font-medium">{stepLabel}</span>
          </div>
        )}

        <button
          onClick={handleExecute}
          disabled={!canExecute || loading}
          className="w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:opacity-90 glow-purple"
        >
          {loading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </>
          ) : isDemo ? (
            <>⚡ Run Demo · {TOOL_COST_DISPLAY} USDC (simulated)</>
          ) : (
            <>🔒 Execute Privately · {TOOL_COST_DISPLAY} USDC</>
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
                <span className="text-xs text-emerald-400">
                  {result.isDemo ? "Demo execution complete" : "Executed privately"}
                </span>
              </div>
            </div>
            <div className="px-3 py-2.5 rounded-lg bg-background border border-emerald-500/20 text-sm font-mono text-foreground whitespace-pre-wrap break-words max-h-60 overflow-y-auto leading-relaxed">
              {result.output}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
              <span>Tx:</span>
              {result.isDemo ? (
                <span className="tx-tag font-mono">{result.txSignature.slice(0, 22)}... <span className="text-amber-400/70">(simulated)</span></span>
              ) : (
                <a
                  href={`https://explorer.solana.com/tx/${result.txSignature}?cluster=${cluster}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tx-tag font-mono hover:text-primary transition-colors"
                  title="View on Solana Explorer"
                >
                  {result.txSignature.slice(0, 22)}... ↗
                </a>
              )}
              <span className="ml-auto">{new Date(result.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

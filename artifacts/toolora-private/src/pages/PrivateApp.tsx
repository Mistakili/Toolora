import { useState, useEffect, useCallback } from "react";
import { WalletButton } from "@/components/WalletButton";
import { BalanceCard } from "@/components/BalanceCard";
import { ToolGrid } from "@/components/ToolGrid";
import { ExecutePanel } from "@/components/ExecutePanel";
import { TxList, type TxEntry } from "@/components/TxList";
import { StatsBar } from "@/components/StatsBar";
import { checkHealth } from "@/lib/magicblock";
import { onWalletChange } from "@/lib/solana";
import { PRIVATE_TOOLS, type PrivateTool } from "@/lib/privateTools";
import type { Cluster } from "@/lib/magicblock";

export default function PrivateApp() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [selectedTool, setSelectedTool] = useState<PrivateTool | null>(null);
  const [txHistory, setTxHistory] = useState<TxEntry[]>([]);
  const [balanceRefresh, setBalanceRefresh] = useState(0);
  const [apiHealthy, setApiHealthy] = useState(false);
  const cluster: Cluster = "devnet";

  useEffect(() => {
    checkHealth().then(setApiHealthy);
  }, []);

  useEffect(() => {
    const cleanup = onWalletChange(() => {
      if (typeof window !== "undefined" && window.solana?.publicKey) {
        setPublicKey(window.solana.publicKey.toBase58());
      } else {
        setPublicKey(null);
        setBalance(0);
      }
    });
    return cleanup;
  }, []);

  const handleExecuted = useCallback(() => {
    if (!selectedTool) return;
    setTxHistory((prev) => [
      {
        toolName: selectedTool.name,
        toolIcon: selectedTool.icon,
        txSignature: `sim_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
        timestamp: Date.now(),
        success: true,
      },
      ...prev,
    ]);
    setBalanceRefresh((n) => n + 1);
  }, [selectedTool]);

  return (
    <div className="min-h-screen bg-background grid-pattern">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity">
              <span className="text-xl">🛡️</span>
              <span className="font-bold text-lg tracking-tight">Toolora</span>
              <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-primary/15 text-primary border border-primary/25 ml-1">
                PRIVATE
              </span>
            </a>
            <span className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
              <span className="status-dot bg-emerald-400" />
              Powered by MagicBlock PER
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://toolora.dev"
              className="hidden sm:block text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              All 41 tools →
            </a>
            <WalletButton
              publicKey={publicKey}
              onConnect={setPublicKey}
              onDisconnect={() => { setPublicKey(null); setBalance(0); }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Hero */}
        <div className="text-center py-6">
          <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 mb-4">
            <span>⚡</span>
            <span>Colosseum Hackathon · Privacy Track · Powered by MagicBlock</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-3">
            Private Tool Execution
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Pay per tool call with private USDC via{" "}
            <span className="text-primary font-medium">MagicBlock's Private Ephemeral Rollup</span>.
            Your data never leaves your browser. Your payments are untraceable.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span>🔒</span>
              <span>Files never leave device</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>🛡️</span>
              <span>Payments on TEE-secured rollup</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>⚡</span>
              <span>0.01 USDC per execution</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>🤖</span>
              <span>MCP-compatible for AI agents</span>
            </div>
          </div>
        </div>

        {/* Stats + Balance */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <BalanceCard
              publicKey={publicKey}
              cluster={cluster}
              refreshTrigger={balanceRefresh}
              onBalanceLoaded={setBalance}
            />
          </div>
          <div className="lg:col-span-3">
            <StatsBar
              totalExecutions={txHistory.length}
              uniqueTools={PRIVATE_TOOLS.length}
              apiHealthy={apiHealthy}
            />
            <div className="mt-4 rounded-xl border border-border bg-card p-4">
              <div className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <span className="text-primary">⚡</span>
                How it works
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { step: "1", label: "Connect Phantom wallet" },
                  { step: "2", label: "Deposit USDC into MagicBlock PER" },
                  { step: "3", label: "Pick tool → pay → get result" },
                ].map(({ step, label }) => (
                  <div key={step} className="text-center">
                    <div className="text-2xl font-bold text-primary/30 font-mono">{step}</div>
                    <div className="text-xs text-muted-foreground leading-tight">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tool selection */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Select a Tool</h2>
            <span className="text-xs text-muted-foreground">{PRIVATE_TOOLS.length} tools · 0.01 USDC each</span>
          </div>
          <ToolGrid selectedSlug={selectedTool?.slug ?? null} onSelect={setSelectedTool} />
        </section>

        {/* Execute */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Execute Privately</h2>
          <ExecutePanel
            tool={selectedTool}
            publicKey={publicKey}
            balance={balance}
            cluster={cluster}
            onExecuted={handleExecuted}
          />
        </section>

        {/* MCP Agent info */}
        <section className="rounded-xl border border-primary/20 bg-primary/5 p-6">
          <div className="flex items-start gap-4">
            <span className="text-3xl">🤖</span>
            <div>
              <h3 className="font-semibold text-foreground mb-1">For AI Agents & MCP Clients</h3>
              <p className="text-sm text-muted-foreground mb-3">
                AI agents can call any Toolora tool with a MagicBlock payment proof via the MCP protocol.
                Each tool call costs 0.01 USDC, settled privately on-chain.
              </p>
              <div className="font-mono text-xs bg-background border border-border rounded-lg px-3 py-2 text-muted-foreground">
                <span className="text-primary">POST</span>{" "}
                <span>https://toolora.dev/api/mcp</span>
                <br />
                <span className="text-muted-foreground/60"># MCP endpoint · 25 tools · private payment optional</span>
              </div>
              <div className="flex gap-3 mt-3">
                <a
                  href="https://toolora.dev/api/mcp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  MCP Docs →
                </a>
                <a
                  href="https://docs.magicblock.gg/pages/private-ephemeral-rollups-pers/api-reference/per/introduction"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  MagicBlock API →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* TX History */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Execution History</h2>
          <TxList entries={txHistory} />
        </section>

        {/* Footer */}
        <footer className="text-center py-6 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Built for the{" "}
            <span className="text-primary">Colosseum Privacy Track Hackathon</span> · Powered by{" "}
            <a href="https://magicblock.gg" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              MagicBlock
            </a>{" "}
            Private Ephemeral Rollups ·{" "}
            <a href="https://toolora.dev" className="text-muted-foreground hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">
              toolora.dev
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}

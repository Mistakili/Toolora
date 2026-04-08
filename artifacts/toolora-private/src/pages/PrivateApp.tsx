import { useState, useEffect, useCallback } from "react";
import { WalletButton } from "@/components/WalletButton";
import { BalanceCard } from "@/components/BalanceCard";
import { ToolGrid } from "@/components/ToolGrid";
import { ExecutePanel } from "@/components/ExecutePanel";
import { TxList, type TxEntry } from "@/components/TxList";
import { StatsBar } from "@/components/StatsBar";
import { PrivacyFlow } from "@/components/PrivacyFlow";
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
  const [isDemo, setIsDemo] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [cluster, setCluster] = useState<Cluster>("devnet");

  const DEMO_PUBLIC_KEY = "Demo1111111111111111111111111111111111111111";
  const DEMO_BALANCE = 5_000_000; // 5.00 USDC

  useEffect(() => {
    checkHealth().then(setApiHealthy);
  }, []);

  useEffect(() => {
    const cleanup = onWalletChange(() => {
      if (typeof window !== "undefined" && window.solana?.publicKey) {
        setPublicKey(window.solana.publicKey.toBase58());
        setIsDemo(false);
      } else {
        setPublicKey(null);
        setBalance(0);
      }
    });
    return cleanup;
  }, []);

  function activateDemo() {
    setIsDemo(true);
    setPublicKey(DEMO_PUBLIC_KEY);
    setBalance(DEMO_BALANCE);
  }

  function deactivateDemo() {
    setIsDemo(false);
    setPublicKey(null);
    setBalance(0);
  }

  const handleExecuted = useCallback((txSig: string) => {
    if (!selectedTool) return;
    setTxHistory((prev) => [
      {
        toolName: selectedTool.name,
        toolIcon: selectedTool.icon,
        txSignature: txSig,
        timestamp: Date.now(),
        success: true,
        isDemo,
        cluster,
      },
      ...prev,
    ]);
    if (!isDemo) setBalanceRefresh((n) => n + 1);
  }, [selectedTool, isDemo, cluster]);

  const effectivePublicKey = isDemo ? DEMO_PUBLIC_KEY : publicKey;
  const effectiveBalance = isDemo ? DEMO_BALANCE : balance;

  return (
    <div className="min-h-screen bg-background grid-pattern">
      {/* Demo banner */}
      {isDemo && (
        <div className="sticky top-0 z-[60] bg-amber-400/10 border-b border-amber-400/30 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-amber-400">
            <span>⚡</span>
            <span className="font-medium">Demo Mode — simulating full payment flow without a real wallet</span>
            <span className="text-amber-400/60 hidden sm:inline">· no real USDC spent</span>
          </div>
          <button
            onClick={deactivateDemo}
            className="text-xs text-amber-400/70 hover:text-amber-400 transition-colors underline"
          >
            Exit Demo
          </button>
        </div>
      )}

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
              <span className={`status-dot ${apiHealthy ? "bg-emerald-400" : "bg-amber-400"}`} />
              {apiHealthy ? "MagicBlock PER online" : "Connecting to MagicBlock..."}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {!isDemo && !publicKey && (
              <button
                onClick={activateDemo}
                className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-amber-400/30 bg-amber-400/10 text-amber-400 hover:bg-amber-400/20 transition-colors font-medium"
              >
                ⚡ Try Demo
              </button>
            )}
            {/* Cluster switcher */}
            <button
              onClick={() => setCluster((c) => c === "devnet" ? "mainnet" : "devnet")}
              className={`hidden sm:flex items-center gap-1 text-xs px-2.5 py-1 rounded-md border font-mono transition-colors ${
                cluster === "mainnet"
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                  : "border-border bg-muted/30 text-muted-foreground hover:bg-muted/60"
              }`}
              title={cluster === "mainnet" ? "Switch to devnet" : "Switch to mainnet"}
            >
              {cluster === "mainnet" ? "● mainnet" : "○ devnet"}
            </button>
            <a
              href="/submission"
              className="hidden sm:block text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Submission →
            </a>
            <a
              href="https://toolora.dev"
              className="hidden sm:block text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              All {PRIVATE_TOOLS.length + 33} tools →
            </a>
            {isDemo ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-400/10 border border-amber-400/30">
                <span className="status-dot bg-amber-400 animate-pulse" />
                <span className="font-mono text-sm text-amber-400">Demo Wallet</span>
              </div>
            ) : (
              <WalletButton
                publicKey={publicKey}
                onConnect={(key) => { setPublicKey(key); setIsDemo(false); }}
                onDisconnect={() => { setPublicKey(null); setBalance(0); }}
              />
            )}
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
            <br className="hidden sm:block" />
            Your data never leaves your browser. Your payments are untraceable.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
            {[
              { icon: "🔒", label: "Files never leave device" },
              { icon: "🛡️", label: "Payments on TEE-secured rollup" },
              { icon: "⚡", label: "0.01 USDC per execution" },
              { icon: "🤖", label: "MCP-compatible for AI agents" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span>{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>

          {/* Demo CTA (mobile + prominent) */}
          {!isDemo && !publicKey && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={activateDemo}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-amber-400/40 bg-amber-400/10 text-amber-400 hover:bg-amber-400/20 transition-all font-medium text-sm"
              >
                ⚡ Try Demo — no wallet needed
              </button>
              <span className="text-xs text-muted-foreground">or connect Phantom wallet for real payments</span>
            </div>
          )}
        </div>

        {/* Stats + Balance */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <BalanceCard
              publicKey={effectivePublicKey}
              cluster={cluster}
              refreshTrigger={balanceRefresh}
              onBalanceLoaded={!isDemo ? setBalance : undefined}
              isDemo={isDemo}
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

        {/* Privacy architecture visualization */}
        <PrivacyFlow animating={animating} />

        {/* Tool selection */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Select a Tool</h2>
            <span className="text-xs text-muted-foreground">{PRIVATE_TOOLS.length} tools · 0.01 USDC each</span>
          </div>
          <ToolGrid selectedSlug={selectedTool?.slug ?? null} onSelect={setSelectedTool} />
        </section>

        {/* Execute panel */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Execute Privately</h2>
          <ExecutePanel
            tool={selectedTool}
            publicKey={effectivePublicKey}
            balance={effectiveBalance}
            cluster={cluster}
            isDemo={isDemo}
            onExecuted={handleExecuted}
            onAnimatingChange={setAnimating}
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
                Each tool call costs 0.01 USDC, settled privately on-chain — no subscription, no account needed.
              </p>
              <div className="font-mono text-xs bg-background border border-border rounded-lg px-3 py-2 text-muted-foreground">
                <span className="text-primary">POST</span>{" "}
                <span>https://toolora.dev/api/private-execute</span>
                <br />
                <span className="text-muted-foreground/60">{`{"tool": "word-counter", "input": "...", "txSignature": "<PER sig>", "payer": "<pubkey>"}`}</span>
              </div>
              <div className="flex gap-3 mt-3">
                <a
                  href="https://docs.magicblock.gg/pages/private-ephemeral-rollups-pers/api-reference/per/introduction"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  MagicBlock API →
                </a>
                <a
                  href="https://toolora.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Toolora Tools →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* TX History */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Execution History
            {txHistory.length > 0 && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({txHistory.length} this session)
              </span>
            )}
          </h2>
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

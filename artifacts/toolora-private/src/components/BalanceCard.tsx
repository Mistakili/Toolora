import { useState, useEffect, useCallback } from "react";
import {
  getPrivateBalance,
  getBalance,
  formatUSDC,
  buildDepositTx,
  buildWithdrawTx,
  type Cluster,
} from "@/lib/magicblock";
import { signAndSubmitTx } from "@/lib/solana";
import { useToast } from "@/hooks/use-toast";

interface BalanceCardProps {
  publicKey: string | null;
  cluster: Cluster;
  refreshTrigger?: number;
  onBalanceLoaded?: (balance: number) => void;
  isDemo?: boolean;
}

type Panel = "none" | "deposit" | "withdraw";

export function BalanceCard({ publicKey, cluster, refreshTrigger, onBalanceLoaded, isDemo = false }: BalanceCardProps) {
  const [privateBalance, setPrivateBalance] = useState<number | null>(null);
  const [publicBalance, setPublicBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [txAmount, setTxAmount] = useState("1");
  const [txInProgress, setTxInProgress] = useState(false);
  const [panel, setPanel] = useState<Panel>("none");
  const { toast } = useToast();

  const DEMO_PRIVATE_BALANCE = 5_000_000; // 5.00 USDC

  const loadBalances = useCallback(async () => {
    if (!publicKey || isDemo) return;
    setLoading(true);
    try {
      const [priv, pub] = await Promise.allSettled([
        getPrivateBalance(publicKey, cluster),
        getBalance(publicKey, cluster),
      ]);
      if (priv.status === "fulfilled") {
        setPrivateBalance(priv.value.privateBalance);
        onBalanceLoaded?.(priv.value.privateBalance);
      }
      if (pub.status === "fulfilled") {
        setPublicBalance(pub.value.balance);
      }
    } catch {
      // Silently handle if API unavailable
    } finally {
      setLoading(false);
    }
  }, [publicKey, cluster, isDemo, onBalanceLoaded]);

  useEffect(() => {
    if (isDemo) {
      onBalanceLoaded?.(DEMO_PRIVATE_BALANCE);
    } else {
      loadBalances();
    }
  }, [loadBalances, refreshTrigger, isDemo]);

  async function handleDeposit() {
    if (!publicKey) return;
    const amount = parseFloat(txAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({ title: "Invalid amount", variant: "destructive" });
      return;
    }
    const lamports = Math.round(amount * 1_000_000);
    setTxInProgress(true);
    try {
      const unsignedTx = await buildDepositTx({
        owner: publicKey,
        amount: lamports,
        cluster,
        initIfMissing: true,
        initVaultIfMissing: true,
        initAtasIfMissing: true,
        idempotent: true,
      });
      const sig = await signAndSubmitTx(unsignedTx);
      toast({
        title: "Deposit confirmed!",
        description: `+${amount} USDC deposited into private rollup. Sig: ${sig.slice(0, 12)}...`,
      });
      setPanel("none");
      setTimeout(loadBalances, 3000);
    } catch (err: unknown) {
      toast({
        title: "Deposit failed",
        description: err instanceof Error ? err.message : "Transaction failed",
        variant: "destructive",
      });
    } finally {
      setTxInProgress(false);
    }
  }

  async function handleWithdraw() {
    if (!publicKey) return;
    const amount = parseFloat(txAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({ title: "Invalid amount", variant: "destructive" });
      return;
    }
    const lamports = Math.round(amount * 1_000_000);
    if (privateBalance !== null && lamports > privateBalance) {
      toast({ title: "Insufficient private balance", variant: "destructive" });
      return;
    }
    setTxInProgress(true);
    try {
      const unsignedTx = await buildWithdrawTx({
        owner: publicKey,
        amount: lamports,
        cluster,
      });
      const sig = await signAndSubmitTx(unsignedTx);
      toast({
        title: "Withdrawal confirmed!",
        description: `-${amount} USDC withdrawn to your wallet. Sig: ${sig.slice(0, 12)}...`,
      });
      setPanel("none");
      setTimeout(loadBalances, 3000);
    } catch (err: unknown) {
      toast({
        title: "Withdrawal failed",
        description: err instanceof Error ? err.message : "Transaction failed",
        variant: "destructive",
      });
    } finally {
      setTxInProgress(false);
    }
  }

  if (!publicKey && !isDemo) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 shield-gradient">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🔒</span>
          <div>
            <div className="font-semibold text-foreground">Private Balance</div>
            <div className="text-xs text-muted-foreground">Connect wallet to view</div>
          </div>
        </div>
        <div className="h-10 bg-muted/50 rounded-lg animate-pulse" />
      </div>
    );
  }

  const displayBalance = isDemo ? DEMO_PRIVATE_BALANCE : privateBalance;

  return (
    <div className="rounded-xl border border-glow bg-card p-6 shield-gradient">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🛡️</span>
          <div>
            <div className="font-semibold text-foreground">Private Balance</div>
            <div className="text-xs text-muted-foreground">
              {isDemo ? "Demo wallet · devnet" : `MagicBlock PER · ${cluster}`}
            </div>
          </div>
        </div>
        {!isDemo && (
          <button
            onClick={loadBalances}
            disabled={loading}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-muted"
          >
            {loading ? "..." : "↻"}
          </button>
        )}
      </div>

      {loading && displayBalance === null ? (
        <div className="h-10 bg-muted/50 rounded-lg animate-pulse mb-4" />
      ) : (
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary font-mono">
              {displayBalance !== null ? formatUSDC(displayBalance) : "—"}
            </span>
            <span className="text-muted-foreground text-sm font-medium">USDC</span>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {isDemo ? "DEMO" : "PRIVATE"}
            </span>
          </div>
          {!isDemo && publicBalance !== null && (
            <div className="text-xs text-muted-foreground mt-1">
              Wallet: {formatUSDC(publicBalance)} USDC (public)
            </div>
          )}
          {isDemo && (
            <div className="text-xs text-amber-400/80 mt-1">
              Simulated balance for demo
            </div>
          )}
        </div>
      )}

      {!isDemo && (
        <div className="flex gap-2">
          <button
            onClick={() => setPanel(panel === "deposit" ? "none" : "deposit")}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg border transition-colors ${
              panel === "deposit"
                ? "bg-primary/20 text-primary border-primary/40"
                : "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
            }`}
          >
            + Deposit
          </button>
          <button
            onClick={() => setPanel(panel === "withdraw" ? "none" : "withdraw")}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg border transition-colors ${
              panel === "withdraw"
                ? "bg-muted text-foreground border-primary/30"
                : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
            }`}
          >
            − Withdraw
          </button>
        </div>
      )}

      {panel !== "none" && !isDemo && (
        <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-border space-y-2">
          <div className="text-xs text-muted-foreground font-medium">
            {panel === "deposit" ? "Deposit USDC into private rollup" : "Withdraw USDC to your wallet"}
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              value={txAmount}
              onChange={(e) => setTxAmount(e.target.value)}
              min="0.01"
              step="0.01"
              className="flex-1 px-3 py-1.5 text-sm rounded bg-background border border-border focus:outline-none focus:border-primary text-foreground font-mono"
              placeholder="Amount (USDC)"
            />
            <button
              onClick={panel === "deposit" ? handleDeposit : handleWithdraw}
              disabled={txInProgress}
              className="px-4 py-1.5 text-sm font-medium rounded bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity whitespace-nowrap"
            >
              {txInProgress ? "Signing..." : panel === "deposit" ? "Deposit" : "Withdraw"}
            </button>
          </div>
          <div className="text-xs text-muted-foreground/70">
            {panel === "deposit"
              ? "Funds enter MagicBlock PER and are private from this point on."
              : "Funds exit the PER and return to your on-chain wallet."}
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useCallback } from "react";
import { getPrivateBalance, getBalance, formatUSDC, type Cluster } from "@/lib/magicblock";
import { buildDepositTx } from "@/lib/magicblock";
import { signAndSubmitTx } from "@/lib/solana";
import { useToast } from "@/hooks/use-toast";

interface BalanceCardProps {
  publicKey: string | null;
  cluster: Cluster;
  refreshTrigger?: number;
  onBalanceLoaded?: (balance: number) => void;
}

export function BalanceCard({ publicKey, cluster, refreshTrigger, onBalanceLoaded }: BalanceCardProps) {
  const [privateBalance, setPrivateBalance] = useState<number | null>(null);
  const [publicBalance, setPublicBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [depositAmount, setDepositAmount] = useState("1");
  const [depositing, setDepositing] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const { toast } = useToast();

  const loadBalances = useCallback(async () => {
    if (!publicKey) return;
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
  }, [publicKey, cluster, onBalanceLoaded]);

  useEffect(() => {
    loadBalances();
  }, [loadBalances, refreshTrigger]);

  async function handleDeposit() {
    if (!publicKey) return;
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({ title: "Invalid amount", variant: "destructive" });
      return;
    }
    const lamports = Math.round(amount * 1_000_000);
    setDepositing(true);
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
        description: `+${amount} USDC deposited privately. Tx: ${sig.slice(0, 12)}...`,
      });
      setShowDeposit(false);
      setTimeout(loadBalances, 3000);
    } catch (err: unknown) {
      toast({
        title: "Deposit failed",
        description: err instanceof Error ? err.message : "Transaction failed",
        variant: "destructive",
      });
    } finally {
      setDepositing(false);
    }
  }

  if (!publicKey) {
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

  return (
    <div className="rounded-xl border border-glow bg-card p-6 shield-gradient">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🛡️</span>
          <div>
            <div className="font-semibold text-foreground">Private Balance</div>
            <div className="text-xs text-muted-foreground">MagicBlock PER · {cluster}</div>
          </div>
        </div>
        <button
          onClick={loadBalances}
          disabled={loading}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-muted"
        >
          {loading ? "..." : "Refresh"}
        </button>
      </div>

      {loading && privateBalance === null ? (
        <div className="h-10 bg-muted/50 rounded-lg animate-pulse mb-4" />
      ) : (
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary font-mono">
              {privateBalance !== null ? formatUSDC(privateBalance) : "—"}
            </span>
            <span className="text-muted-foreground text-sm font-medium">USDC</span>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              PRIVATE
            </span>
          </div>
          {publicBalance !== null && (
            <div className="text-xs text-muted-foreground mt-1">
              Wallet: {formatUSDC(publicBalance)} USDC (public)
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => setShowDeposit(!showDeposit)}
          className="flex-1 py-2 px-3 text-sm font-medium rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
        >
          + Deposit
        </button>
        <button
          onClick={() => {}}
          className="flex-1 py-2 px-3 text-sm font-medium rounded-lg bg-muted text-muted-foreground border border-border hover:bg-muted/80 transition-colors"
        >
          Withdraw
        </button>
      </div>

      {showDeposit && (
        <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-border space-y-2">
          <div className="text-xs text-muted-foreground">Amount (USDC devnet)</div>
          <div className="flex gap-2">
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              min="0.01"
              step="0.01"
              className="flex-1 px-3 py-1.5 text-sm rounded bg-background border border-border focus:outline-none focus:border-primary text-foreground font-mono"
            />
            <button
              onClick={handleDeposit}
              disabled={depositing}
              className="px-4 py-1.5 text-sm font-medium rounded bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {depositing ? "Signing..." : "Deposit"}
            </button>
          </div>
          <div className="text-xs text-muted-foreground">
            Funds enter MagicBlock Private Ephemeral Rollup. Private from this point on.
          </div>
        </div>
      )}
    </div>
  );
}

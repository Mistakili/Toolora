import { useState } from "react";
import { connectWallet, disconnectWallet, truncateAddress, detectWallets } from "@/lib/solana";
import { useToast } from "@/hooks/use-toast";

interface WalletButtonProps {
  publicKey: string | null;
  onConnect: (key: string) => void;
  onDisconnect: () => void;
}

export function WalletButton({ publicKey, onConnect, onDisconnect }: WalletButtonProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleConnect() {
    const wallets = detectWallets();
    if (wallets.length === 0) {
      toast({
        title: "No wallet found",
        description: "Please install Phantom wallet to continue.",
        variant: "destructive",
      });
      window.open("https://phantom.app", "_blank");
      return;
    }
    setLoading(true);
    try {
      const state = await connectWallet();
      if (state.publicKey) {
        onConnect(state.publicKey);
        toast({ title: "Wallet connected", description: truncateAddress(state.publicKey, 6) });
      }
    } catch (err: unknown) {
      toast({
        title: "Connection failed",
        description: err instanceof Error ? err.message : "Could not connect wallet",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDisconnect() {
    await disconnectWallet();
    onDisconnect();
    toast({ title: "Wallet disconnected" });
  }

  if (publicKey) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted border border-border">
          <span className="status-dot bg-emerald-400 glow-green" />
          <span className="font-mono text-sm text-foreground">{truncateAddress(publicKey, 5)}</span>
        </div>
        <button
          onClick={handleDisconnect}
          className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-all disabled:opacity-50 glow-purple"
    >
      {loading ? (
        <>
          <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <span>🔮</span>
          Connect Wallet
        </>
      )}
    </button>
  );
}

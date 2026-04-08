import { useState, useRef, useEffect } from "react";
import { connectWallet, disconnectWallet, truncateAddress, detectWallets } from "@/lib/solana";
import type { WalletProvider } from "@/lib/solana";
import { useToast } from "@/hooks/use-toast";

interface WalletButtonProps {
  publicKey: string | null;
  onConnect: (key: string) => void;
  onDisconnect: () => void;
}

const WALLET_META: Record<WalletProvider, { label: string; icon: string; installUrl: string }> = {
  phantom: { label: "Phantom", icon: "🔮", installUrl: "https://phantom.app" },
  solflare: { label: "Solflare", icon: "🌟", installUrl: "https://solflare.com" },
};

export function WalletButton({ publicKey, onConnect, onDisconnect }: WalletButtonProps) {
  const [loading, setLoading] = useState<WalletProvider | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const available = detectWallets();

  // Close picker when clicking outside
  useEffect(() => {
    if (!showPicker) return;
    function handler(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showPicker]);

  async function handleConnect(provider: WalletProvider) {
    setLoading(provider);
    setShowPicker(false);
    try {
      const state = await connectWallet(provider);
      if (state.publicKey) {
        onConnect(state.publicKey);
        toast({
          title: `${WALLET_META[provider].label} connected`,
          description: truncateAddress(state.publicKey, 6),
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not connect wallet";
      // If wallet not installed, offer to open install page
      if (message.includes("not found") || message.includes("No Solana")) {
        toast({
          title: `${WALLET_META[provider].label} not installed`,
          description: "Opening install page...",
          variant: "destructive",
        });
        window.open(WALLET_META[provider].installUrl, "_blank");
      } else {
        toast({ title: "Connection failed", description: message, variant: "destructive" });
      }
    } finally {
      setLoading(null);
    }
  }

  async function handleDisconnect() {
    await disconnectWallet();
    onDisconnect();
    toast({ title: "Wallet disconnected" });
  }

  function handleClick() {
    if (available.length === 0) {
      // Neither installed — open Phantom as primary recommendation
      toast({
        title: "No wallet found",
        description: "Install Phantom or Solflare to continue.",
        variant: "destructive",
      });
      window.open("https://phantom.app", "_blank");
      return;
    }
    if (available.length === 1) {
      // Only one option — connect directly
      handleConnect(available[0]);
      return;
    }
    // Multiple options — show picker
    setShowPicker((v) => !v);
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

  const isLoading = loading !== null;

  return (
    <div className="relative" ref={pickerRef}>
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-all disabled:opacity-50 glow-purple"
      >
        {isLoading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <span>{available.length === 1 ? WALLET_META[available[0]].icon : "🔐"}</span>
            {available.length === 1 ? `Connect ${WALLET_META[available[0]].label}` : "Connect Wallet"}
          </>
        )}
      </button>

      {/* Wallet picker dropdown */}
      {showPicker && (
        <div className="absolute right-0 top-full mt-2 z-50 w-52 rounded-xl border border-border bg-card shadow-xl overflow-hidden">
          <div className="px-3 py-2 text-xs text-muted-foreground border-b border-border">
            Choose wallet
          </div>
          {(["phantom", "solflare"] as WalletProvider[]).map((p) => {
            const { label, icon, installUrl } = WALLET_META[p];
            const installed = available.includes(p);
            return (
              <button
                key={p}
                onClick={() => installed ? handleConnect(p) : window.open(installUrl, "_blank")}
                disabled={loading === p}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left hover:bg-muted/60 transition-colors disabled:opacity-50"
              >
                <span className="text-base">{icon}</span>
                <span className="flex-1 font-medium text-foreground">{label}</span>
                {installed ? (
                  <span className="text-xs text-emerald-400">Detected</span>
                ) : (
                  <span className="text-xs text-muted-foreground">Install ↗</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

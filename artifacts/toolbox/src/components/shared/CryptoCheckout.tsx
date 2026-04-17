import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface Props {
  kind: string;
  metadata: Record<string, string>;
  buyerEmail?: string;
  onFulfilled?: (rowId: string | null) => void;
}

interface Intent {
  reference: string;
  amountUsdc: number;
  vaultAddress: string;
  cluster: string;
  solanaPayUrl: string;
}

const API = (import.meta.env.VITE_API_URL as string | undefined) ?? "";

export function CryptoCheckout({ kind, metadata, buyerEmail, onFulfilled }: Props) {
  const [intent, setIntent] = useState<Intent | null>(null);
  const [qr, setQr] = useState<string>("");
  const [sig, setSig] = useState("");
  const [status, setStatus] = useState<"idle" | "creating" | "awaiting" | "verifying" | "ok" | "err">("idle");
  const [errMsg, setErrMsg] = useState("");

  async function createIntent() {
    setStatus("creating");
    setErrMsg("");
    try {
      const r = await fetch(API + "/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, metadata, buyer_email: buyerEmail }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message ?? data.error ?? "Failed to create intent");
      setIntent(data);
      const dataUrl = await QRCode.toDataURL(data.solanaPayUrl, { width: 280, margin: 1 });
      setQr(dataUrl);
      setStatus("awaiting");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to create checkout";
      setErrMsg(msg);
      setStatus("err");
    }
  }

  async function verify() {
    if (!intent || !sig) return;
    setStatus("verifying");
    setErrMsg("");
    try {
      const r = await fetch(API + "/api/checkout/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: intent.reference, tx_signature: sig.trim() }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message ?? data.error ?? "Verification failed");
      setStatus("ok");
      onFulfilled?.(data.fulfilledRowId ?? null);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Verification failed";
      setErrMsg(msg);
      setStatus("awaiting");
    }
  }

  // Auto-poll on-chain when buyer leaves the page open after scanning
  useEffect(() => {
    if (status !== "awaiting" || !intent) return;
    const id = window.setInterval(async () => {
      try {
        const r = await fetch(API + "/api/checkout/intent/" + intent.reference);
        const data = await r.json();
        if (data.status === "fulfilled") {
          setStatus("ok");
          onFulfilled?.(null);
          window.clearInterval(id);
        }
      } catch { /* ignore */ }
    }, 5000);
    return () => window.clearInterval(id);
  }, [status, intent, onFulfilled]);

  if (status === "ok") {
    return (
      <div className="rounded-xl border border-green-500/40 bg-green-950/30 p-6 text-center">
        <div className="text-3xl mb-2">✓</div>
        <h3 className="text-lg font-semibold text-green-200 mb-1">Payment confirmed</h3>
        <p className="text-sm text-green-300/80">Your placement is live. Thanks for supporting Toolora.</p>
      </div>
    );
  }

  if (!intent) {
    return (
      <div className="space-y-3">
        <button
          onClick={createIntent}
          disabled={status === "creating"}
          className="w-full rounded-lg bg-violet-600 hover:bg-violet-500 text-white px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50"
        >
          {status === "creating" ? "Generating payment…" : "Generate USDC payment →"}
        </button>
        {errMsg && <p className="text-xs text-red-400">{errMsg}</p>}
      </div>
    );
  }

  const explorer = intent.cluster === "mainnet"
    ? "https://solscan.io/account/" + intent.vaultAddress
    : "https://solscan.io/account/" + intent.vaultAddress + "?cluster=devnet";

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 space-y-4">
      <div className="text-center">
        <p className="text-sm text-zinc-400 mb-2">Pay with USDC on Solana</p>
        <p className="text-3xl font-bold text-zinc-100 mb-1">{intent.amountUsdc} USDC</p>
        <p className="text-xs text-zinc-500">Cluster: {intent.cluster} · settles in &lt;1 second</p>
      </div>

      {qr && (
        <div className="flex justify-center bg-white p-3 rounded-lg">
          <img src={qr} alt="Solana Pay QR" className="w-56 h-56" />
        </div>
      )}

      <div className="space-y-2 text-xs text-zinc-400">
        <p><strong className="text-zinc-200">1.</strong> Scan with Phantom, Solflare, or Backpack — or click below to open in your wallet.</p>
        <a
          href={intent.solanaPayUrl}
          className="block text-center w-full rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-violet-400 px-3 py-2 text-sm"
        >
          Open in wallet →
        </a>
        <p><strong className="text-zinc-200">2.</strong> Send exactly <code className="text-violet-300">{intent.amountUsdc} USDC</code> to:</p>
        <code className="block break-all bg-zinc-900 p-2 rounded text-violet-300 text-[10px]">{intent.vaultAddress}</code>
        <a href={explorer} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">View vault on Solscan ↗</a>
      </div>

      <div className="border-t border-zinc-800 pt-4 space-y-2">
        <p className="text-xs text-zinc-400">
          <strong className="text-zinc-200">3.</strong> Already paid? Paste your tx signature to fulfill instantly:
        </p>
        <input
          value={sig}
          onChange={(e) => setSig(e.target.value)}
          placeholder="Solana transaction signature"
          className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-zinc-100 focus:border-violet-500 outline-none font-mono"
        />
        <button
          onClick={verify}
          disabled={!sig || status === "verifying"}
          className="w-full rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white px-4 py-2 text-sm font-semibold"
        >
          {status === "verifying" ? "Verifying on-chain…" : "Verify & publish →"}
        </button>
        {errMsg && <p className="text-xs text-red-400">{errMsg}</p>}
        <p className="text-[10px] text-zinc-500 text-center pt-1">
          We auto-detect payments every 5 seconds — you can also just close this page after paying.
        </p>
      </div>
    </div>
  );
}

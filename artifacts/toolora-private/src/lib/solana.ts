import type { UnsignedTxResponse } from "./magicblock";

declare global {
  interface Window {
    solana?: PhantomProvider;
    solflare?: SolflareProvider;
  }
}

interface PhantomProvider {
  isPhantom?: boolean;
  publicKey: { toBase58: () => string } | null;
  isConnected: boolean;
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toBase58: () => string } }>;
  disconnect: () => Promise<void>;
  signTransaction: (tx: unknown) => Promise<{ serialize: () => Uint8Array }>;
  signAndSendTransaction: (tx: unknown) => Promise<{ signature: string }>;
  on: (event: string, handler: () => void) => void;
  off: (event: string, handler: () => void) => void;
}

interface SolflareProvider {
  isSolflare?: boolean;
  publicKey: { toBase58: () => string } | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signTransaction: (tx: unknown) => Promise<{ serialize: () => Uint8Array }>;
  on: (event: string, handler: () => void) => void;
  off: (event: string, handler: () => void) => void;
}

export type WalletProvider = "phantom" | "solflare";

export interface WalletState {
  connected: boolean;
  publicKey: string | null;
  provider: WalletProvider | null;
}

// Track which provider is currently active
let _activeProvider: WalletProvider | null = null;

function getPhantom(): PhantomProvider | null {
  if (typeof window === "undefined") return null;
  return window.solana?.isPhantom ? window.solana : null;
}

function getSolflare(): SolflareProvider | null {
  if (typeof window === "undefined") return null;
  return window.solflare ?? null;
}

export function detectWallets(): WalletProvider[] {
  const wallets: WalletProvider[] = [];
  if (typeof window !== "undefined") {
    if (window.solana?.isPhantom) wallets.push("phantom");
    if (window.solflare) wallets.push("solflare");
  }
  return wallets;
}

export async function connectWallet(preferredProvider?: WalletProvider): Promise<WalletState> {
  // Try preferred provider first, then fall back
  const order: WalletProvider[] = preferredProvider
    ? [preferredProvider, preferredProvider === "phantom" ? "solflare" : "phantom"]
    : ["phantom", "solflare"];

  for (const provider of order) {
    if (provider === "phantom") {
      const phantom = getPhantom();
      if (phantom) {
        const resp = await phantom.connect();
        _activeProvider = "phantom";
        return { connected: true, publicKey: resp.publicKey.toBase58(), provider: "phantom" };
      }
    } else if (provider === "solflare") {
      const solflare = getSolflare();
      if (solflare) {
        await solflare.connect();
        if (!solflare.publicKey) throw new Error("Solflare connected but no public key found.");
        _activeProvider = "solflare";
        return { connected: true, publicKey: solflare.publicKey.toBase58(), provider: "solflare" };
      }
    }
  }

  throw new Error("No Solana wallet found. Please install Phantom or Solflare.");
}

export async function disconnectWallet(): Promise<void> {
  if (_activeProvider === "solflare") {
    const solflare = getSolflare();
    if (solflare) await solflare.disconnect();
  } else {
    const phantom = getPhantom();
    if (phantom) await phantom.disconnect();
  }
  _activeProvider = null;
}

export function onWalletChange(handler: () => void): () => void {
  const cleanups: Array<() => void> = [];

  const phantom = getPhantom();
  if (phantom) {
    phantom.on("accountChanged", handler);
    phantom.on("disconnect", handler);
    cleanups.push(() => { phantom.off("accountChanged", handler); phantom.off("disconnect", handler); });
  }

  const solflare = getSolflare();
  if (solflare) {
    solflare.on("accountChanged", handler);
    solflare.on("disconnect", handler);
    cleanups.push(() => { solflare.off("accountChanged", handler); solflare.off("disconnect", handler); });
  }

  return () => cleanups.forEach((fn) => fn());
}

export async function signAndSubmitTx(
  unsignedTx: UnsignedTxResponse,
  cluster: "devnet" | "mainnet" = "devnet"
): Promise<string> {
  const { Transaction, Connection } = await import("@solana/web3.js");

  const rpcUrl =
    unsignedTx.sendTo === "base"
      ? (cluster === "mainnet" ? "https://api.mainnet-beta.solana.com" : "https://api.devnet.solana.com")
      : (cluster === "mainnet" ? "https://mainnet.magicblock.app" : "https://devnet.magicblock.app");

  const connection = new Connection(rpcUrl, "confirmed");
  const txBytes = base64ToUint8Array(unsignedTx.transactionBase64);
  const tx = Transaction.from(txBytes);

  let rawTx: Uint8Array;

  // Try active provider, fall back to any available
  const provider = _activeProvider;
  if (provider === "solflare") {
    const solflare = getSolflare();
    if (!solflare) throw new Error("Solflare not connected");
    const signed = await solflare.signTransaction(tx);
    rawTx = signed.serialize();
  } else {
    const phantom = getPhantom();
    if (!phantom) throw new Error("Phantom not connected");
    const signed = await phantom.signTransaction(tx);
    rawTx = signed.serialize();
  }

  const signature = await connection.sendRawTransaction(rawTx, {
    skipPreflight: false,
    preflightCommitment: "confirmed",
  });

  await connection.confirmTransaction(
    { signature, blockhash: unsignedTx.recentBlockhash, lastValidBlockHeight: unsignedTx.lastValidBlockHeight },
    "confirmed"
  );

  return signature;
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function truncateAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

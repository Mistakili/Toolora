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
  publicKey: { toBase58: () => string } | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signTransaction: (tx: unknown) => Promise<{ serialize: () => Uint8Array }>;
}

export type WalletProvider = "phantom" | "solflare";

export interface WalletState {
  connected: boolean;
  publicKey: string | null;
  provider: WalletProvider | null;
}

function getPhantom(): PhantomProvider | null {
  if (typeof window === "undefined") return null;
  return window.solana ?? null;
}

export function detectWallets(): WalletProvider[] {
  const wallets: WalletProvider[] = [];
  if (typeof window !== "undefined") {
    if (window.solana?.isPhantom) wallets.push("phantom");
    if (window.solflare) wallets.push("solflare");
  }
  return wallets;
}

export async function connectWallet(): Promise<WalletState> {
  const phantom = getPhantom();
  if (!phantom) {
    throw new Error("No Solana wallet found. Please install Phantom wallet.");
  }
  const resp = await phantom.connect();
  return {
    connected: true,
    publicKey: resp.publicKey.toBase58(),
    provider: "phantom",
  };
}

export async function disconnectWallet(): Promise<void> {
  const phantom = getPhantom();
  if (phantom) {
    await phantom.disconnect();
  }
}

export function onWalletChange(handler: () => void): () => void {
  const phantom = getPhantom();
  if (!phantom) return () => {};
  phantom.on("accountChanged", handler);
  phantom.on("disconnect", handler);
  return () => {
    phantom.off("accountChanged", handler);
    phantom.off("disconnect", handler);
  };
}

export async function signAndSubmitTx(unsignedTx: UnsignedTxResponse): Promise<string> {
  const phantom = getPhantom();
  if (!phantom) throw new Error("Wallet not connected");

  const { Transaction, Connection } = await import("@solana/web3.js");

  const rpcUrl =
    unsignedTx.sendTo === "base"
      ? "https://api.devnet.solana.com"
      : "https://devnet.magicblock.app";

  const connection = new Connection(rpcUrl, "confirmed");

  const txBytes = base64ToUint8Array(unsignedTx.transactionBase64);
  const tx = Transaction.from(txBytes);

  const signed = await phantom.signTransaction(tx);
  const rawTx = signed.serialize();
  const signature = await connection.sendRawTransaction(rawTx, {
    skipPreflight: false,
    preflightCommitment: "confirmed",
  });

  await connection.confirmTransaction(
    {
      signature,
      blockhash: unsignedTx.recentBlockhash,
      lastValidBlockHeight: unsignedTx.lastValidBlockHeight,
    },
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

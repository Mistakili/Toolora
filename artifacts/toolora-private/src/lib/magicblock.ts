const PAYMENTS_API = "https://payments.magicblock.app";

const USDC_MINT_MAINNET = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const USDC_MINT_DEVNET = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";

export type Cluster = "mainnet" | "devnet";

export interface DepositRequest {
  owner: string;
  amount: number;
  cluster?: Cluster;
  mint?: string;
  initIfMissing?: boolean;
  initVaultIfMissing?: boolean;
  initAtasIfMissing?: boolean;
  idempotent?: boolean;
}

export interface TransferRequest {
  from: string;
  to: string;
  amount: number;
  cluster?: Cluster;
  mint?: string;
}

export interface WithdrawRequest {
  owner: string;
  amount: number;
  cluster?: Cluster;
  mint?: string;
}

export interface UnsignedTxResponse {
  kind: string;
  version: string;
  transactionBase64: string;
  sendTo: "base" | "ephemeral";
  recentBlockhash: string;
  lastValidBlockHeight: number;
  instructionCount: number;
  requiredSigners: string[];
  validator: string;
}

export interface BalanceResponse {
  balance: number;
  mint: string;
  owner: string;
}

export interface PrivateBalanceResponse {
  privateBalance: number;
  mint: string;
  owner: string;
}

export function usdcMint(cluster: Cluster): string {
  return cluster === "devnet" ? USDC_MINT_DEVNET : USDC_MINT_MAINNET;
}

async function post<T>(path: string, body: object): Promise<T> {
  const res = await fetch(`${PAYMENTS_API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`MagicBlock API error ${res.status}: ${err}`);
  }
  return res.json() as Promise<T>;
}

async function get<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${PAYMENTS_API}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const res = await fetch(url.toString());
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`MagicBlock API error ${res.status}: ${err}`);
  }
  return res.json() as Promise<T>;
}

export async function buildDepositTx(req: DepositRequest): Promise<UnsignedTxResponse> {
  return post<UnsignedTxResponse>("/v1/spl/deposit", {
    owner: req.owner,
    amount: req.amount,
    cluster: req.cluster ?? "devnet",
    mint: req.mint ?? usdcMint(req.cluster ?? "devnet"),
    initIfMissing: req.initIfMissing ?? true,
    initVaultIfMissing: req.initVaultIfMissing ?? true,
    initAtasIfMissing: req.initAtasIfMissing ?? true,
    idempotent: req.idempotent ?? true,
  });
}

export async function buildTransferTx(req: TransferRequest): Promise<UnsignedTxResponse> {
  return post<UnsignedTxResponse>("/v1/spl/transfer", {
    from: req.from,
    to: req.to,
    amount: req.amount,
    cluster: req.cluster ?? "devnet",
    mint: req.mint ?? usdcMint(req.cluster ?? "devnet"),
  });
}

export async function buildWithdrawTx(req: WithdrawRequest): Promise<UnsignedTxResponse> {
  return post<UnsignedTxResponse>("/v1/spl/withdraw", {
    owner: req.owner,
    amount: req.amount,
    cluster: req.cluster ?? "devnet",
    mint: req.mint ?? usdcMint(req.cluster ?? "devnet"),
  });
}

export async function getBalance(owner: string, cluster: Cluster = "devnet"): Promise<BalanceResponse> {
  return get<BalanceResponse>("/v1/spl/balance", {
    owner,
    cluster,
    mint: usdcMint(cluster),
  });
}

export async function getPrivateBalance(owner: string, cluster: Cluster = "devnet"): Promise<PrivateBalanceResponse> {
  return get<PrivateBalanceResponse>("/v1/spl/private-balance", {
    owner,
    cluster,
    mint: usdcMint(cluster),
  });
}

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${PAYMENTS_API}/health`);
    return res.ok;
  } catch {
    return false;
  }
}

export function formatUSDC(lamports: number): string {
  return (lamports / 1_000_000).toFixed(6);
}

export function parseUSDC(amount: string): number {
  return Math.round(parseFloat(amount) * 1_000_000);
}

export const TOOL_COST_LAMPORTS = 10_000;
export const TOOL_COST_DISPLAY = "0.01";
export const TOOLORA_VAULT = "3rXKwQ1kpjBd5tdcco32qsvqUh1BnZjcYnS5kYrP7AYE";

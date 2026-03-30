import { Request, Response, NextFunction } from "express";

// ─── Stellar config ───────────────────────────────────────────────────────────
const HORIZON_TESTNET = "https://horizon-testnet.stellar.org";
const HORIZON_MAINNET = "https://horizon.stellar.org";

export const RECEIVER_ADDRESS = process.env.STELLAR_RECEIVER_ADDRESS ?? "";
export const NETWORK = (process.env.STELLAR_NETWORK ?? "testnet") as "testnet" | "mainnet";
export const PRICE_XLM = process.env.AGENT_API_PRICE_XLM ?? "0.5";

// ─── Solana config ────────────────────────────────────────────────────────────
const USDC_MINT_MAINNET = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const USDC_MINT_DEVNET  = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";

export const SOLANA_RECEIVER_ADDRESS = process.env.SOLANA_RECEIVER_ADDRESS ?? "";
export const SOLANA_NETWORK = (process.env.SOLANA_NETWORK ?? "mainnet") as "mainnet" | "devnet";
export const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL
  ?? (SOLANA_NETWORK === "devnet" ? "https://api.devnet.solana.com" : "https://api.mainnet-beta.solana.com");
export const PRICE_USDC = process.env.AGENT_API_PRICE_USDC ?? "0.01";

// ─── Replay protection ────────────────────────────────────────────────────────
const usedTxHashes = new Map<string, number>();
const REPLAY_TTL_MS = 60 * 60 * 1000;

function pruneExpiredHashes() {
  const now = Date.now();
  for (const [hash, ts] of usedTxHashes) {
    if (now - ts > REPLAY_TTL_MS) usedTxHashes.delete(hash);
  }
}

// ─── Shared types ─────────────────────────────────────────────────────────────

export interface PaymentPayload {
  txHash: string;
  from: string;
  amount: string;
  network: string;
}

declare global {
  namespace Express {
    interface Request {
      verifiedPayment?: PaymentPayload;
    }
  }
}

// ─── 402 response builder (multi-chain) ───────────────────────────────────────

function buildPaymentRequired(req: Request) {
  const resource = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  const usdcMint = SOLANA_NETWORK === "devnet" ? USDC_MINT_DEVNET : USDC_MINT_MAINNET;

  const accepts: Record<string, unknown>[] = [];

  if (RECEIVER_ADDRESS) {
    accepts.push({
      scheme: "exact",
      network: `stellar:${NETWORK}`,
      maxAmountRequired: PRICE_XLM,
      asset: "XLM",
      payTo: RECEIVER_ADDRESS,
      resource,
      description: "Toolora Agent API — pay per request via Stellar XLM",
      maxTimeoutSeconds: 120,
      extra: { name: "toolora-agent-api", version: "1" },
    });
  }

  if (SOLANA_RECEIVER_ADDRESS) {
    accepts.push({
      scheme: "exact",
      network: `solana:${SOLANA_NETWORK}`,
      maxAmountRequired: PRICE_USDC,
      asset: "USDC",
      assetAddress: usdcMint,
      payTo: SOLANA_RECEIVER_ADDRESS,
      resource,
      description: "Toolora Agent API — pay per request via Solana USDC",
      maxTimeoutSeconds: 120,
      extra: { name: "toolora-agent-api", version: "1" },
    });
  }

  return { x402Version: 1, error: "Payment Required", accepts };
}

// ─── Stellar verifier ─────────────────────────────────────────────────────────

async function verifyStellarPayment(payload: PaymentPayload): Promise<{ ok: boolean; reason?: string }> {
  const horizonBase = NETWORK === "mainnet" ? HORIZON_MAINNET : HORIZON_TESTNET;

  pruneExpiredHashes();
  if (usedTxHashes.has(payload.txHash)) {
    return { ok: false, reason: "Transaction already used (replay protection)" };
  }

  const txRes = await fetch(`${horizonBase}/transactions/${payload.txHash}`);
  if (!txRes.ok) {
    return { ok: false, reason: `Horizon returned ${txRes.status} for transaction` };
  }
  const tx = await txRes.json() as Record<string, unknown>;

  if (!tx.successful) {
    return { ok: false, reason: "Transaction not successful on chain" };
  }

  const opsRes = await fetch(`${horizonBase}/transactions/${payload.txHash}/operations`);
  if (!opsRes.ok) {
    return { ok: false, reason: "Could not fetch operations" };
  }

  const opsData = await opsRes.json() as { _embedded: { records: Record<string, unknown>[] } };
  const ops = opsData._embedded?.records ?? [];

  const paymentOp = ops.find((op: Record<string, unknown>) => {
    if (op.type !== "payment") return false;
    if (op.to !== RECEIVER_ADDRESS) return false;
    if (op.asset_type !== "native") return false;
    const paid = parseFloat(op.amount as string);
    const required = parseFloat(PRICE_XLM);
    return paid >= required;
  });

  if (!paymentOp) {
    return {
      ok: false,
      reason: `No payment of ${PRICE_XLM} XLM to ${RECEIVER_ADDRESS} found in transaction`,
    };
  }

  usedTxHashes.set(payload.txHash, Date.now());
  return { ok: true };
}

// ─── Solana USDC verifier (plain JSON-RPC, no SDK) ────────────────────────────

interface SolanaTokenBalance {
  accountIndex: number;
  mint: string;
  owner: string;
  uiTokenAmount: { amount: string; decimals: number; uiAmount: number | null };
}

interface SolanaRpcResponse {
  result: {
    meta: {
      err: unknown;
      postTokenBalances: SolanaTokenBalance[];
      preTokenBalances: SolanaTokenBalance[];
    };
  } | null;
  error?: { message: string };
}

async function verifySolanaPayment(payload: PaymentPayload): Promise<{ ok: boolean; reason?: string }> {
  pruneExpiredHashes();
  if (usedTxHashes.has(payload.txHash)) {
    return { ok: false, reason: "Transaction already used (replay protection)" };
  }

  const usdcMint = SOLANA_NETWORK === "devnet" ? USDC_MINT_DEVNET : USDC_MINT_MAINNET;

  const rpcRes = await fetch(SOLANA_RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getTransaction",
      params: [
        payload.txHash,
        { encoding: "jsonParsed", maxSupportedTransactionVersion: 0, commitment: "finalized" },
      ],
    }),
  });

  if (!rpcRes.ok) {
    return { ok: false, reason: `Solana RPC returned HTTP ${rpcRes.status}` };
  }

  const rpcData = await rpcRes.json() as SolanaRpcResponse;

  if (rpcData.error) {
    return { ok: false, reason: `Solana RPC error: ${rpcData.error.message}` };
  }

  if (!rpcData.result) {
    return { ok: false, reason: "Transaction not found on Solana (not finalized yet, or invalid signature)" };
  }

  const { meta } = rpcData.result;

  if (meta.err) {
    return { ok: false, reason: "Transaction failed on chain" };
  }

  const postBalances = meta.postTokenBalances ?? [];
  const preBalances  = meta.preTokenBalances  ?? [];

  // Find all post-balance entries credited to our receiver for USDC
  const receiverPostEntries = postBalances.filter(
    (b) => b.mint === usdcMint && b.owner === SOLANA_RECEIVER_ADDRESS,
  );

  if (receiverPostEntries.length === 0) {
    return {
      ok: false,
      reason: `No USDC transfer to ${SOLANA_RECEIVER_ADDRESS} found in transaction`,
    };
  }

  // Build pre-balance map by accountIndex for the same owner+mint
  const preByIndex = new Map<number, bigint>();
  for (const b of preBalances) {
    if (b.mint === usdcMint && b.owner === SOLANA_RECEIVER_ADDRESS) {
      preByIndex.set(b.accountIndex, BigInt(b.uiTokenAmount.amount));
    }
  }

  // Sum net USDC received (raw units, 6 decimals)
  let totalReceived = BigInt(0);
  for (const b of receiverPostEntries) {
    const postRaw = BigInt(b.uiTokenAmount.amount);
    const preRaw  = preByIndex.get(b.accountIndex) ?? BigInt(0);
    const delta   = postRaw - preRaw;
    if (delta > BigInt(0)) totalReceived += delta;
  }

  // Required amount in raw units (PRICE_USDC × 10^6)
  const requiredRaw = BigInt(Math.round(parseFloat(PRICE_USDC) * 1_000_000));

  if (totalReceived < requiredRaw) {
    const receivedUSDC = (Number(totalReceived) / 1_000_000).toFixed(6);
    return {
      ok: false,
      reason: `Insufficient USDC: received ${receivedUSDC}, required ${PRICE_USDC}`,
    };
  }

  usedTxHashes.set(payload.txHash, Date.now());
  return { ok: true };
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export function requirePayment(req: Request, res: Response, next: NextFunction) {
  const stellarEnabled = !!RECEIVER_ADDRESS;
  const solanaEnabled  = !!SOLANA_RECEIVER_ADDRESS;

  if (!stellarEnabled && !solanaEnabled) {
    req.log?.warn("No payment receiver configured — x402 gating disabled");
    return next();
  }

  const header = req.headers["x-payment"] as string | undefined;

  if (!header) {
    res.status(402).json(buildPaymentRequired(req));
    return;
  }

  let payload: PaymentPayload;
  try {
    payload = JSON.parse(Buffer.from(header, "base64").toString("utf8")) as PaymentPayload;
  } catch {
    res.status(402).json({ ...buildPaymentRequired(req), error: "Invalid X-PAYMENT header (expected base64 JSON)" });
    return;
  }

  const isSolana  = payload.network?.startsWith("solana:");
  const isStellar = payload.network?.startsWith("stellar:");

  let verifyPromise: Promise<{ ok: boolean; reason?: string }>;

  if (isSolana && solanaEnabled) {
    verifyPromise = verifySolanaPayment(payload);
  } else if (isStellar && stellarEnabled) {
    verifyPromise = verifyStellarPayment(payload);
  } else if (isSolana && !solanaEnabled) {
    res.status(402).json({ ...buildPaymentRequired(req), error: "Solana payments not configured on this server" });
    return;
  } else if (isStellar && !stellarEnabled) {
    res.status(402).json({ ...buildPaymentRequired(req), error: "Stellar payments not configured on this server" });
    return;
  } else {
    res.status(402).json({
      ...buildPaymentRequired(req),
      error: `Unknown payment network: ${payload.network ?? "(not set)"}. Use stellar:mainnet or solana:mainnet.`,
    });
    return;
  }

  verifyPromise.then((result) => {
    if (!result.ok) {
      res.status(402).json({ ...buildPaymentRequired(req), error: result.reason });
      return;
    }
    req.verifiedPayment = payload;
    next();
  }).catch((err: unknown) => {
    req.log?.error({ err }, "Payment verification failed");
    res.status(402).json({ ...buildPaymentRequired(req), error: "Payment verification error — please retry" });
  });
}

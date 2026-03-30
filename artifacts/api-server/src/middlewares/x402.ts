import { Request, Response, NextFunction } from "express";

const HORIZON_TESTNET = "https://horizon-testnet.stellar.org";
const HORIZON_MAINNET = "https://horizon.stellar.org";

export const RECEIVER_ADDRESS = process.env.STELLAR_RECEIVER_ADDRESS ?? "";
export const NETWORK = (process.env.STELLAR_NETWORK ?? "testnet") as "testnet" | "mainnet";
export const PRICE_XLM = process.env.AGENT_API_PRICE_XLM ?? "0.5";

// In-memory replay protection: track used tx hashes for 1 hour
const usedTxHashes = new Map<string, number>();
const REPLAY_TTL_MS = 60 * 60 * 1000;

function pruneExpiredHashes() {
  const now = Date.now();
  for (const [hash, ts] of usedTxHashes) {
    if (now - ts > REPLAY_TTL_MS) usedTxHashes.delete(hash);
  }
}

// Payment details the agent sends in X-PAYMENT header (base64 JSON)
export interface PaymentPayload {
  txHash: string;
  from: string;
  amount: string;
  network: string;
}

// Attach verified payment to the request so route handlers can log it
declare global {
  namespace Express {
    interface Request {
      verifiedPayment?: PaymentPayload;
    }
  }
}

function buildPaymentRequired(req: Request) {
  const resource = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  return {
    x402Version: 1,
    error: "Payment Required",
    accepts: [
      {
        scheme: "exact",
        network: `stellar:${NETWORK}`,
        maxAmountRequired: PRICE_XLM,
        asset: "XLM",
        payTo: RECEIVER_ADDRESS,
        resource,
        description: "Toolora Agent API — pay per request via Stellar XLM",
        maxTimeoutSeconds: 120,
        extra: { name: "toolora-agent-api", version: "1" },
      },
    ],
  };
}

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

// Express middleware — gates a route behind x402 Stellar payment
// On success, attaches `req.verifiedPayment` so route handlers can log the payment
export function requirePayment(req: Request, res: Response, next: NextFunction) {
  if (!RECEIVER_ADDRESS) {
    req.log?.warn("STELLAR_RECEIVER_ADDRESS not set — x402 gating disabled");
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

  verifyStellarPayment(payload).then((result) => {
    if (!result.ok) {
      res.status(402).json({ ...buildPaymentRequired(req), error: result.reason });
      return;
    }
    req.verifiedPayment = payload;
    next();
  }).catch((err: unknown) => {
    req.log?.error({ err }, "Stellar payment verification failed");
    res.status(402).json({ ...buildPaymentRequired(req), error: "Payment verification error — please retry" });
  });
}

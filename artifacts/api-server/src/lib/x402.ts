import crypto from "node:crypto";
import type { Request } from "express";

/**
 * x402 payment verification + challenge generation.
 *
 * Two modes (controlled by GATEWAY_PAYMENT_MODE env var):
 *   - "stub" (default for dev): any non-empty X-PAYMENT header passes.
 *     A deterministic stub txHash is derived from the header so smoke
 *     tests are reproducible.
 *   - "verify": [PRODUCTION — TODO when wallet funded] actually
 *     validates a Solana SPL-USDC tx by RPC, confirming amount + payee.
 *
 * The verify path is stubbed but well-marked. Switching modes is a
 * one-line env-var change once the funded mainnet wallet is live.
 */

export type PaymentMode = "stub" | "verify";

export function paymentMode(): PaymentMode {
  const v = (process.env.GATEWAY_PAYMENT_MODE ?? "stub").toLowerCase();
  return v === "verify" ? "verify" : "stub";
}

const TOOLORA_PLATFORM_WALLET =
  process.env.TOOLORA_PLATFORM_WALLET ?? "59wUbJWMiBK737srMxPjtKFJDrcuh28Uezj9xjtMimQF";

export interface X402ChallengeBody {
  x402Version: 1;
  accepts: Array<{
    scheme: "exact";
    network: string; // 'solana' | 'solana-devnet'
    asset: "USDC";
    payTo: string;
    maxAmountRequired: string; // micros, decimal string
    resource: string;
    description: string;
  }>;
}

export function buildX402Challenge(opts: {
  pricePerCallUsdcMicros: number;
  payoutNetwork: string;
  resource: string;
  listingName?: string;
}): X402ChallengeBody {
  const network = opts.payoutNetwork === "solana" && paymentMode() === "stub" ? "solana-devnet" : opts.payoutNetwork;
  return {
    x402Version: 1,
    accepts: [
      {
        scheme: "exact",
        network,
        asset: "USDC",
        payTo: TOOLORA_PLATFORM_WALLET,
        maxAmountRequired: String(opts.pricePerCallUsdcMicros),
        resource: opts.resource,
        description: `Per-call USDC payment for ${opts.listingName ?? "MCP listing"} via Toolora Gateway`,
      },
    ],
  };
}

export interface VerifyResult {
  ok: boolean;
  reason?: string;
  txHash?: string;
  callerRef?: string;
}

/**
 * Verify the X-PAYMENT header. In stub mode, accept any non-empty value
 * and deterministically derive a fake txHash. In verify mode, the real
 * on-chain validation lives in `verifyOnChain` (TODO).
 */
export async function verifyX402Payment(req: Request, expectedAmountMicros: number): Promise<VerifyResult> {
  const header = (req.headers["x-payment"] ?? req.headers["X-PAYMENT"] ?? "").toString().trim();
  if (!header) return { ok: false, reason: "missing_payment_header" };

  if (paymentMode() === "stub") {
    // Deterministic synthetic txHash so the same header always settles to the
    // same id (helpful for replay testing). NOT cryptographically meaningful.
    const txHash = "stub_" + crypto.createHash("sha256").update(header).digest("hex").slice(0, 32);
    const callerRef = "stub_" + crypto.createHash("sha256").update(header).digest("hex").slice(32, 48);
    return { ok: true, txHash, callerRef };
  }

  // ─── verify mode (production) ────────────────────────────────────────────
  // TODO when TOOLORA_PLATFORM_WALLET is funded on mainnet:
  // 1. Parse `header` as a base64-encoded x402 PaymentPayload (per x402 spec).
  // 2. Use @solana/web3.js to fetch the referenced transaction by signature.
  // 3. Confirm the tx contains an SPL-USDC transfer of >= expectedAmountMicros
  //    to TOOLORA_PLATFORM_WALLET, in a recent block (anti-replay).
  // 4. Mark the txHash as consumed in a `gateway_consumed_payments` table to
  //    prevent reuse of the same payment proof across multiple calls.
  return { ok: false, reason: "verify_mode_not_implemented_yet" };
}

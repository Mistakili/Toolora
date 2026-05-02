import crypto from "node:crypto";
import { logger } from "./logger";

/**
 * USDC split — 95% to MCP owner, 5% Toolora fee.
 *
 * Two modes (controlled by GATEWAY_PAYOUT_MODE env var):
 *   - "stub" (default for dev): logs the intended split, returns a synthetic
 *     payoutTxHash, status='settled'. No on-chain work. Safe for smoke
 *     tests with no funded wallet.
 *   - "broadcast": [PRODUCTION — TODO when platform wallet funded] actually
 *     broadcasts an SPL-USDC transfer to the owner via @solana/web3.js,
 *     awaiting tx submission (NOT full finality). Status='settled' on
 *     successful broadcast; 'pending' if RPC accepted but no signature yet;
 *     'failed' on broadcast error.
 *
 * The broadcast path is stubbed but well-marked. Switching modes is a
 * one-line env-var change once the funded wallet is live AND the
 * @solana/web3.js dep is installed.
 */

export type PayoutMode = "stub" | "broadcast";

export function payoutMode(): PayoutMode {
  const v = (process.env.GATEWAY_PAYOUT_MODE ?? "stub").toLowerCase();
  return v === "broadcast" ? "broadcast" : "stub";
}

export interface SplitInput {
  amountMicros: number; // total caller paid (e.g. 1000 = $0.001)
  feeMicros: number; // Toolora's 5% slice
  payoutWallet: string;
  payoutNetwork: string; // 'solana' | 'stellar'
  paymentTxHash: string; // caller's incoming tx (for memo / linkage)
}

export interface SplitResult {
  ok: boolean;
  payoutTxHash?: string;
  status: "settled" | "pending" | "failed";
  errorReason?: string;
}

export async function splitUsdc(input: SplitInput): Promise<SplitResult> {
  const ownerShare = input.amountMicros - input.feeMicros;

  if (payoutMode() === "stub") {
    const stubTx =
      "stub_payout_" +
      crypto
        .createHash("sha256")
        .update(`${input.paymentTxHash}|${input.payoutWallet}|${ownerShare}`)
        .digest("hex")
        .slice(0, 32);
    logger.info(
      {
        mode: "stub",
        ownerShareMicros: ownerShare,
        feeMicros: input.feeMicros,
        payoutWallet: input.payoutWallet,
        payoutNetwork: input.payoutNetwork,
        stubTx,
      },
      "[gateway/splitter] STUB split — owner gets 95%, Toolora keeps 5% (no on-chain work)",
    );
    return { ok: true, payoutTxHash: stubTx, status: "settled" };
  }

  // ─── broadcast mode (production) ─────────────────────────────────────────
  // TODO when TOOLORA_PLATFORM_WALLET is funded:
  // 1. pnpm --filter @workspace/api-server add @solana/web3.js @solana/spl-token
  // 2. Load TOOLORA_PLATFORM_WALLET_SECRET (base58 secret key) from env.
  //    NEVER log or print this — `environment-secrets` skill manages it.
  // 3. Build an SPL-USDC TransferChecked instruction from platform ATA →
  //    owner ATA for `ownerShare` micros, with payment_tx_hash in memo.
  // 4. Sign and send via Connection.sendTransaction (commitment=processed for
  //    fast return; the post-MVP reconciler upgrades to confirmed).
  // 5. Return { ok: true, payoutTxHash: signature, status: "settled" }.
  // 6. On any throw → { ok: false, status: "failed", errorReason: e.message }.
  return {
    ok: false,
    status: "failed",
    errorReason: "broadcast_mode_not_implemented_yet — install @solana/web3.js and fund platform wallet",
  };
}

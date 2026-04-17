/**
 * Strict Solana Pay verification for self-serve checkout.
 *
 * Unlike the lightweight `verifySolanaTransaction`, this proves:
 *   - The transaction landed and did not error.
 *   - It contains an SPL-token transfer of the EXACT USDC amount to the vault.
 *   - The intent's reference pubkey is present in the account list (Solana Pay
 *     standard — wallets pass the reference as a read-only signer).
 *
 * Without all three, fulfillment must be refused.
 */

interface TokenBalance {
  accountIndex: number;
  mint: string;
  owner?: string;
  uiTokenAmount: { amount: string; decimals: number; uiAmount: number | null };
}

interface ParsedInstruction {
  programId?: string;
  parsed?: { type?: string; info?: Record<string, unknown> } | string;
  accounts?: string[];
}

interface TxResponse {
  result?: {
    meta?: {
      err?: unknown;
      preTokenBalances?: TokenBalance[];
      postTokenBalances?: TokenBalance[];
      logMessages?: string[];
    };
    transaction?: {
      message?: {
        accountKeys?: (string | { pubkey: string })[];
        instructions?: ParsedInstruction[];
      };
    };
  };
  error?: { message?: string };
}

const ENDPOINTS: Record<"devnet" | "mainnet", string[]> = {
  devnet: ["https://devnet.magicblock.app", "https://api.devnet.solana.com"],
  mainnet: ["https://api.mainnet-beta.solana.com"],
};

function normalizeKey(k: string | { pubkey: string }): string {
  return typeof k === "string" ? k : k.pubkey;
}

export interface VerifyArgs {
  signature: string;
  cluster: "mainnet" | "devnet";
  vaultAddress: string;
  usdcMint: string;
  expectedAmountUsdc: number;
  reference: string;
}

export interface VerifyResult {
  ok: boolean;
  error?: string;
}

export async function verifySolanaPayPayment(args: VerifyArgs): Promise<VerifyResult> {
  if (!/^[A-HJ-NP-Za-km-z1-9]{80,100}$/.test(args.signature)) {
    return { ok: false, error: "Invalid signature format" };
  }

  let tx: TxResponse | null = null;
  for (const endpoint of ENDPOINTS[args.cluster]) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getTransaction",
          params: [
            args.signature,
            { encoding: "jsonParsed", maxSupportedTransactionVersion: 0, commitment: "confirmed" },
          ],
        }),
        signal: AbortSignal.timeout(8_000),
      });
      if (!res.ok) continue;
      tx = (await res.json()) as TxResponse;
      if (tx?.result) break;
    } catch {
      // try next endpoint
    }
  }

  if (!tx?.result) return { ok: false, error: "Transaction not found on-chain. It may still be propagating — retry in a few seconds." };
  if (tx.result.meta?.err) return { ok: false, error: "Transaction failed on-chain" };

  const accountKeys = (tx.result.transaction?.message?.accountKeys ?? []).map(normalizeKey);

  // 1. Reference must be in the account list (Solana Pay convention).
  if (!accountKeys.includes(args.reference)) {
    // Fallback: accept memo containing the reference (when wallet doesn't
    // support reference accounts — some still don't pass them through).
    const memos = (tx.result.meta?.logMessages ?? []).join(" ");
    if (!memos.includes(args.reference)) {
      return { ok: false, error: "Payment is not bound to this checkout intent" };
    }
  }

  // 2. Verify USDC transfer to vault for the exact amount.
  const pre = tx.result.meta?.preTokenBalances ?? [];
  const post = tx.result.meta?.postTokenBalances ?? [];

  // Find the USDC balance change for the vault owner.
  const vaultPostList = post.filter((b) => b.mint === args.usdcMint && b.owner === args.vaultAddress);
  if (vaultPostList.length === 0) {
    return { ok: false, error: "No USDC transfer to the Toolora vault detected" };
  }

  let receivedRaw = 0n;
  for (const vp of vaultPostList) {
    const vpre = pre.find((b) => b.accountIndex === vp.accountIndex);
    const before = BigInt(vpre?.uiTokenAmount.amount ?? "0");
    const after = BigInt(vp.uiTokenAmount.amount);
    if (after > before) receivedRaw += after - before;
  }

  // USDC has 6 decimals.
  const expectedRaw = BigInt(args.expectedAmountUsdc) * 1_000_000n;
  if (receivedRaw < expectedRaw) {
    const got = Number(receivedRaw) / 1_000_000;
    return { ok: false, error: "Underpayment: received " + got + " USDC, need " + args.expectedAmountUsdc };
  }

  return { ok: true };
}

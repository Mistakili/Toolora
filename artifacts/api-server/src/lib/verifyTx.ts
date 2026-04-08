interface SignatureStatus {
  confirmationStatus?: "processed" | "confirmed" | "finalized";
  err?: unknown;
}

interface GetSignatureStatusesResponse {
  result?: { value?: (SignatureStatus | null)[] };
  error?: unknown;
}

const ENDPOINTS: Record<"devnet" | "mainnet", string[]> = {
  devnet: [
    "https://devnet.magicblock.app",
    "https://api.devnet.solana.com",
  ],
  mainnet: [
    "https://api.mainnet-beta.solana.com",
  ],
};

const DEMO_PREFIXES = ["demo_", "sim_", "DEMO_"];

export async function verifySolanaTransaction(
  sig: string,
  cluster: "mainnet" | "devnet" = "devnet"
): Promise<{ verified: boolean; source?: string; error?: string }> {
  // Skip verification for demo/simulation signatures
  if (DEMO_PREFIXES.some((p) => sig.startsWith(p))) {
    return { verified: true, source: "demo" };
  }

  // Basic format check (Solana signatures are base58, 87-88 chars)
  if (!/^[A-HJ-NP-Za-km-z1-9]{80,100}$/.test(sig)) {
    return { verified: false, error: "Invalid signature format" };
  }

  const endpoints = ENDPOINTS[cluster];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getSignatureStatuses",
          params: [[sig], { searchTransactionHistory: true }],
        }),
        signal: AbortSignal.timeout(6_000),
      });

      if (!res.ok) continue;

      const data = (await res.json()) as GetSignatureStatusesResponse;
      const status = data?.result?.value?.[0];

      if (status && !status.err) {
        const conf = status.confirmationStatus;
        if (conf === "confirmed" || conf === "finalized" || conf === "processed") {
          return { verified: true, source: endpoint };
        }
      }
    } catch {
      // Try next endpoint
    }
  }

  return {
    verified: false,
    error: `Transaction not confirmed on ${cluster}. It may still be propagating — retry in a few seconds.`,
  };
}

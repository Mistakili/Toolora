import { Router, type IRouter } from "express";

const router: IRouter = Router();

const PAYMENTS_API = "https://payments.magicblock.app";
const USDC_MINT: Record<"devnet" | "mainnet", string> = {
  devnet: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
  mainnet: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
};

function validCluster(raw: unknown): "devnet" | "mainnet" {
  return raw === "mainnet" ? "mainnet" : "devnet";
}

/**
 * GET /api/private-balance
 * Query params: owner (Solana pubkey), cluster (devnet|mainnet)
 *
 * Proxies MagicBlock's /v1/spl/private-balance so the caller never needs
 * to expose their wallet identity directly to MagicBlock from the browser.
 */
router.get("/", async (req, res) => {
  const { owner } = req.query;
  const cluster = validCluster(req.query.cluster);

  if (!owner || typeof owner !== "string" || owner.length < 32 || owner.length > 44) {
    res.status(400).json({ error: "Missing or invalid 'owner' query parameter (Solana base58 pubkey)" });
    return;
  }

  // Skip proxy for demo wallets — return simulated balance
  if (owner.startsWith("Demo") || owner === "DEMO_MODE") {
    res.json({ owner, privateBalance: 5_000_000, mint: USDC_MINT[cluster], cluster, source: "demo" });
    return;
  }

  try {
    const url = new URL(`${PAYMENTS_API}/v1/spl/private-balance`);
    url.searchParams.set("owner", owner);
    url.searchParams.set("cluster", cluster);
    url.searchParams.set("mint", USDC_MINT[cluster]);

    const mbRes = await fetch(url.toString(), {
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(8_000),
    });

    if (!mbRes.ok) {
      const errText = await mbRes.text();
      req.log.warn({ owner: owner.slice(0, 8) + "...", cluster, status: mbRes.status }, "MagicBlock private-balance error");
      res.status(mbRes.status).json({ error: `MagicBlock API responded with ${mbRes.status}: ${errText}` });
      return;
    }

    const data = await mbRes.json() as { balance?: number; privateBalance?: number; mint?: string };
    res.json({ ...data, cluster, owner });
  } catch (err) {
    req.log.error({ err, owner: owner.slice(0, 8) + "..." }, "private-balance fetch failed");
    res.status(502).json({ error: "Failed to fetch private balance from MagicBlock. Network error." });
  }
});

export default router;

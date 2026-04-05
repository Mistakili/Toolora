import { Router, type IRouter } from "express";

const router: IRouter = Router();

/**
 * POST /api/signal/token
 *
 * Proxies to the Soliris Brain signal endpoint and returns a conviction score
 * for a given Solana token mint address.
 *
 * Toolora handles API key auth + billing. Soliris handles the signal logic.
 *
 * TODO (Soliris side): expose GET /api/brain/signal?token=<mint>
 * returning { score, confidence, flags, smartMoneyOverlap, recommendation }
 */
router.post("/token", async (req, res) => {
  const token = typeof req.body?.token === "string" ? req.body.token.trim() : "";
  if (!token) {
    res.status(400).json({ error: "token address or symbol is required" });
    return;
  }
  const solirisUrl = process.env.SOLIRIS_API_URL;

  if (!solirisUrl) {
    res.status(503).json({
      error: "Signal endpoint not yet configured",
      message: "SOLIRIS_API_URL environment variable is not set. The Toolora × Soliris signal bridge is pending Soliris backend deployment.",
      token,
    });
    return;
  }

  try {
    const upstream = await fetch(`${solirisUrl}/api/brain/signal?token=${encodeURIComponent(token)}`, {
      headers: { "Accept": "application/json" },
      signal: AbortSignal.timeout(10_000),
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      req.log.warn({ status: upstream.status, token }, "Soliris signal upstream error");
      res.status(502).json({
        error: "Upstream signal error",
        upstream_status: upstream.status,
        detail: text.slice(0, 200),
      });
      return;
    }

    const data = await upstream.json();
    res.json({ token, ...data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    req.log.error({ err, token }, "Signal proxy failed");
    res.status(503).json({ error: "Signal service unavailable", detail: message });
  }
});

/**
 * GET /api/signal/token/:mint
 * Convenience REST alias for the POST endpoint above.
 */
router.get("/token/:mint", async (req, res) => {
  const token = req.params.mint;
  if (!token) {
    res.status(400).json({ error: "mint address required" });
    return;
  }

  const solirisUrl = process.env.SOLIRIS_API_URL;
  if (!solirisUrl) {
    res.status(503).json({
      error: "Signal endpoint not yet configured",
      message: "SOLIRIS_API_URL environment variable is not set.",
      token,
    });
    return;
  }

  try {
    const upstream = await fetch(`${solirisUrl}/api/brain/signal?token=${encodeURIComponent(token)}`, {
      headers: { "Accept": "application/json" },
      signal: AbortSignal.timeout(10_000),
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      res.status(502).json({ error: "Upstream signal error", upstream_status: upstream.status, detail: text.slice(0, 200) });
      return;
    }

    const data = await upstream.json();
    res.json({ token, ...data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(503).json({ error: "Signal service unavailable", detail: message });
  }
});

export default router;

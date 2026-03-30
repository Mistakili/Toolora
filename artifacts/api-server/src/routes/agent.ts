import { Router, type IRouter, type Request, type Response } from "express";
import multer from "multer";
import { requirePayment, RECEIVER_ADDRESS, NETWORK, PRICE_XLM } from "../middlewares/x402";

const router: IRouter = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

// ─── Discovery manifest ──────────────────────────────────────────────────────
// This is the first thing any agent should hit. Free, no payment required.
// Designed to be returned by GET /api/agent and also linked from well-known routes.

function buildManifest(req: Request) {
  const base = `${req.protocol}://${req.get("host")}`;
  return {
    name: "Toolora Agent API",
    version: "1.0.0",
    description:
      "Server-side document processing APIs for AI agents. Pay per request using Stellar XLM via the x402 protocol — no API key, no subscription.",
    payment: {
      protocol: "x402",
      network: `stellar:${NETWORK}`,
      asset: "XLM",
      pricePerRequest: PRICE_XLM,
      payTo: RECEIVER_ADDRESS || "Set STELLAR_RECEIVER_ADDRESS env var",
      howToPay: [
        "1. Call any paid endpoint. You will receive a 402 with payment instructions.",
        "2. Send the required XLM to the 'payTo' address on Stellar.",
        `3. Retry the same request with header: X-PAYMENT: <base64(JSON.stringify({txHash, from, amount, network}))>`,
      ],
    },
    endpoints: [
      {
        id: "pdf.text",
        method: "POST",
        path: "/api/agent/pdf/text",
        url: `${base}/api/agent/pdf/text`,
        paid: true,
        priceXLM: PRICE_XLM,
        description:
          "Extract all text content from a PDF file. Returns clean text, page count, word count, and character count. Ideal for research agents, document processing pipelines, and RAG ingestion.",
        request: {
          contentType: "multipart/form-data",
          fields: { file: "PDF file (required, max 20MB)" },
        },
        response: {
          contentType: "application/json",
          schema: {
            text: "string — full extracted text",
            pages: "number — page count",
            words: "number — approximate word count",
            chars: "number — character count",
            info: "object — PDF metadata (author, title, creator, etc.)",
          },
        },
        example: {
          curl: `curl -X POST ${base}/api/agent/pdf/text \\
  -H "X-PAYMENT: <base64_payment_payload>" \\
  -F "file=@document.pdf"`,
          python: `import requests, base64, json
payload = base64.b64encode(json.dumps({"txHash":"<hash>","from":"<address>","amount":"${PRICE_XLM}","network":"stellar:${NETWORK}"}).encode()).decode()
r = requests.post("${base}/api/agent/pdf/text", headers={"X-PAYMENT": payload}, files={"file": open("doc.pdf","rb")})
print(r.json())`,
        },
      },
      {
        id: "url.read",
        method: "POST",
        path: "/api/agent/url/read",
        url: `${base}/api/agent/url/read`,
        paid: true,
        priceXLM: PRICE_XLM,
        description:
          "Fetch a URL and return clean, readable text with boilerplate (nav, ads, footers) stripped. Uses Mozilla Readability — the same algorithm as Firefox Reader View. Ideal for web research agents, content summarization pipelines, and knowledge extraction.",
        request: {
          contentType: "application/json",
          body: { url: "string — the full URL to fetch and parse (required)" },
        },
        response: {
          contentType: "application/json",
          schema: {
            title: "string — page title",
            byline: "string | null — author or byline",
            excerpt: "string — short summary",
            content: "string — full readable text content",
            wordCount: "number",
            url: "string — the URL that was fetched",
            fetchedAt: "string — ISO timestamp",
          },
        },
        example: {
          curl: `curl -X POST ${base}/api/agent/url/read \\
  -H "Content-Type: application/json" \\
  -H "X-PAYMENT: <base64_payment_payload>" \\
  -d '{"url":"https://example.com/article"}'`,
          python: `import requests, base64, json
payload = base64.b64encode(json.dumps({"txHash":"<hash>","from":"<address>","amount":"${PRICE_XLM}","network":"stellar:${NETWORK}"}).encode()).decode()
r = requests.post("${base}/api/agent/url/read", headers={"Content-Type":"application/json","X-PAYMENT": payload}, json={"url":"https://example.com/article"})
print(r.json())`,
        },
      },
    ],
    links: {
      docs: `${base}/api-docs`,
      manifest: `${base}/api/agent`,
      wellKnown: `${base}/.well-known/agent.json`,
    },
  };
}

// GET /api/agent — the discovery manifest. Always free. Agents hit this first.
router.get("/", (req: Request, res: Response) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json(buildManifest(req));
});

// ─── POST /api/agent/pdf/text ────────────────────────────────────────────────

router.post(
  "/pdf/text",
  requirePayment,
  upload.single("file"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded. Send a PDF in the 'file' multipart field." });
      return;
    }
    if (req.file.mimetype !== "application/pdf" && !req.file.originalname?.endsWith(".pdf")) {
      res.status(400).json({ error: "File must be a PDF." });
      return;
    }

    try {
      // pdf-parse is CJS; the build banner provides globalThis.require
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require("pdf-parse");
      const data = await pdfParse(req.file.buffer);

      const text: string = data.text ?? "";
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;

      res.json({
        text,
        pages: data.numpages,
        words,
        chars: text.length,
        info: data.info ?? {},
      });
    } catch (err: unknown) {
      req.log.error({ err }, "PDF parse error");
      res.status(422).json({ error: "Could not parse PDF. File may be corrupted or encrypted." });
    }
  },
);

// ─── POST /api/agent/url/read ────────────────────────────────────────────────

router.post("/url/read", requirePayment, async (req: Request, res: Response) => {
  const { url } = req.body as { url?: string };

  if (!url || typeof url !== "string") {
    res.status(400).json({ error: "Missing 'url' field in JSON body." });
    return;
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) throw new Error("Bad protocol");
  } catch {
    res.status(400).json({ error: "Invalid URL. Must be a full http:// or https:// URL." });
    return;
  }

  try {
    const html = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; Toolora-Agent/1.0; +https://toolora.replit.app/api/agent)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(15_000),
    }).then((r) => {
      if (!r.ok) throw new Error(`Fetch failed: ${r.status}`);
      return r.text();
    });

    // Use JSDOM + Readability (loaded via require to avoid ESM bundling path issues)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { JSDOM } = require("jsdom");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Readability } = require("@mozilla/readability");

    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article) {
      res.status(422).json({
        error: "Could not extract readable content from this URL. The page may require JS rendering or login.",
      });
      return;
    }

    // Strip HTML tags from content to return plain text
    const plainText = article.textContent?.replace(/\s+/g, " ").trim() ?? "";
    const words = plainText ? plainText.split(/\s+/).length : 0;

    res.json({
      title: article.title ?? null,
      byline: article.byline ?? null,
      excerpt: article.excerpt ?? null,
      content: plainText,
      wordCount: words,
      url,
      fetchedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    req.log.error({ err }, "URL read error");
    if (msg.includes("Fetch failed") || msg.includes("timed out") || msg.includes("timeout")) {
      res.status(502).json({ error: `Could not fetch URL: ${msg}` });
    } else {
      res.status(500).json({ error: "Failed to read URL content." });
    }
  }
});

export default router;

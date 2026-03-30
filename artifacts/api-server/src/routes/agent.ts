import { Router, type IRouter, type Request, type Response } from "express";
import multer from "multer";
import { db } from "@workspace/db";
import { agentPaymentsTable } from "@workspace/db/schema";
import { desc, sum, count } from "drizzle-orm";
import { requirePayment, RECEIVER_ADDRESS, NETWORK, PRICE_XLM } from "../middlewares/x402";

const router: IRouter = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

// ─── Log a verified payment to the DB ────────────────────────────────────────

async function logPayment(endpoint: string, req: Request) {
  if (!req.verifiedPayment) return;
  try {
    await db.insert(agentPaymentsTable).values({
      endpoint,
      txHash: req.verifiedPayment.txHash,
      fromAddress: req.verifiedPayment.from,
      amountXlm: req.verifiedPayment.amount,
      network: req.verifiedPayment.network,
    }).onConflictDoNothing();
  } catch (err) {
    req.log.error({ err }, "Failed to log agent payment");
  }
}

// ─── Discovery manifest ───────────────────────────────────────────────────────

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
        "3. Retry the same request with header: X-PAYMENT: <base64(JSON.stringify({txHash, from, amount, network}))>",
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
          "Extract all text content from a PDF file. Returns clean text, page count, word count, and character count.",
        request: { contentType: "multipart/form-data", fields: { file: "PDF file (required, max 20MB)" } },
        response: {
          schema: {
            text: "string — full extracted text",
            pages: "number — page count",
            words: "number — word count",
            chars: "number — character count",
            info: "object — PDF metadata",
          },
        },
        example: {
          curl: `curl -X POST ${base}/api/agent/pdf/text \\\n  -H "X-PAYMENT: <base64_payload>" \\\n  -F "file=@document.pdf"`,
          python: `import requests, base64, json\npayload = base64.b64encode(json.dumps({"txHash":"<hash>","from":"<addr>","amount":"${PRICE_XLM}","network":"stellar:${NETWORK}"}).encode()).decode()\nr = requests.post("${base}/api/agent/pdf/text", headers={"X-PAYMENT": payload}, files={"file": open("doc.pdf","rb")})\nprint(r.json())`,
        },
      },
      {
        id: "pdf.extract",
        method: "POST",
        path: "/api/agent/pdf/extract",
        url: `${base}/api/agent/pdf/extract`,
        paid: true,
        priceXLM: PRICE_XLM,
        description:
          "Extract structured content from a PDF — sections with headings, paragraphs grouped by hierarchy. Better than raw text for RAG ingestion, knowledge graphs, and document analysis pipelines.",
        request: { contentType: "multipart/form-data", fields: { file: "PDF file (required, max 20MB)" } },
        response: {
          schema: {
            title: "string | null — detected document title",
            sections: "array — [{heading, level, content, wordCount}]",
            pages: "number",
            totalWords: "number",
            info: "object — PDF metadata",
          },
        },
        example: {
          curl: `curl -X POST ${base}/api/agent/pdf/extract \\\n  -H "X-PAYMENT: <base64_payload>" \\\n  -F "file=@document.pdf"`,
          python: `import requests, base64, json\npayload = base64.b64encode(json.dumps({"txHash":"<hash>","from":"<addr>","amount":"${PRICE_XLM}","network":"stellar:${NETWORK}"}).encode()).decode()\nr = requests.post("${base}/api/agent/pdf/extract", headers={"X-PAYMENT": payload}, files={"file": open("doc.pdf","rb")})\nprint(r.json())`,
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
          "Fetch a URL and return clean readable text with boilerplate stripped. Uses Mozilla Readability — same algorithm as Firefox Reader View.",
        request: { contentType: "application/json", body: { url: "string (required)" } },
        response: {
          schema: {
            title: "string — page title",
            byline: "string | null — author",
            excerpt: "string — short summary",
            content: "string — full plain text",
            wordCount: "number",
            url: "string",
            fetchedAt: "string — ISO timestamp",
          },
        },
        example: {
          curl: `curl -X POST ${base}/api/agent/url/read \\\n  -H "Content-Type: application/json" \\\n  -H "X-PAYMENT: <base64_payload>" \\\n  -d '{"url":"https://example.com/article"}'`,
          python: `import requests, base64, json\npayload = base64.b64encode(json.dumps({"txHash":"<hash>","from":"<addr>","amount":"${PRICE_XLM}","network":"stellar:${NETWORK}"}).encode()).decode()\nr = requests.post("${base}/api/agent/url/read", headers={"Content-Type":"application/json","X-PAYMENT": payload}, json={"url":"https://example.com"})\nprint(r.json())`,
        },
      },
    ],
    links: {
      docs: `${base}/api-docs`,
      manifest: `${base}/api/agent`,
      stats: `${base}/api/agent/stats`,
      wellKnown: `${base}/.well-known/agent.json`,
    },
  };
}

// GET /api/agent — discovery manifest. Always free.
router.get("/", (req: Request, res: Response) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json(buildManifest(req));
});

// GET /api/agent/stats — public aggregate stats only (no individual payment details)
router.get("/stats", async (req: Request, res: Response) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    const rows = await db
      .select({ endpoint: agentPaymentsTable.endpoint, calls: count(), totalXlm: sum(agentPaymentsTable.amountXlm) })
      .from(agentPaymentsTable)
      .groupBy(agentPaymentsTable.endpoint)
      .orderBy(desc(count()));

    const totalCalls = rows.reduce((acc, r) => acc + Number(r.calls), 0);
    const totalXlm = rows.reduce((acc, r) => acc + parseFloat(r.totalXlm ?? "0"), 0);

    res.json({
      totalCalls,
      totalXlmEarned: totalXlm.toFixed(7),
      byEndpoint: rows.map((r) => ({
        endpoint: r.endpoint,
        calls: Number(r.calls),
        xlmEarned: parseFloat(r.totalXlm ?? "0").toFixed(7),
      })),
    });
  } catch (err: unknown) {
    req.log.error({ err }, "Stats query failed");
    res.status(500).json({ error: "Could not fetch stats" });
  }
});

// ─── POST /api/agent/pdf/text ─────────────────────────────────────────────────

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
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require("pdf-parse");
      const data = await pdfParse(req.file.buffer);

      const text: string = data.text ?? "";
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;

      await logPayment("/api/agent/pdf/text", req);

      res.json({ text, pages: data.numpages, words, chars: text.length, info: data.info ?? {} });
    } catch (err: unknown) {
      req.log.error({ err }, "PDF parse error");
      res.status(422).json({ error: "Could not parse PDF. File may be corrupted or encrypted." });
    }
  },
);

// ─── POST /api/agent/pdf/extract ─────────────────────────────────────────────

function extractStructure(text: string): { title: string | null; sections: { heading: string | null; level: number; content: string; wordCount: number }[] } {
  const lines = text.split("\n").map((l) => l.trimEnd());
  const sections: { heading: string | null; level: number; content: string; wordCount: number }[] = [];
  let title: string | null = null;
  let currentHeading: string | null = null;
  let currentLevel = 0;
  let currentContent: string[] = [];

  const isHeading = (line: string): { heading: string; level: number } | null => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.length > 120) return null;

    // Numbered headings: "1.", "1.1", "Chapter 1", "Section 2"
    if (/^(chapter|section|part)\s+\d+/i.test(trimmed)) return { heading: trimmed, level: 1 };
    if (/^\d+\.\s+\S/.test(trimmed) && trimmed.length < 80) return { heading: trimmed, level: 1 };
    if (/^\d+\.\d+\s+\S/.test(trimmed) && trimmed.length < 80) return { heading: trimmed, level: 2 };
    if (/^\d+\.\d+\.\d+\s+\S/.test(trimmed) && trimmed.length < 80) return { heading: trimmed, level: 3 };

    // ALL CAPS short line (likely a heading in PDFs)
    if (trimmed === trimmed.toUpperCase() && trimmed.length >= 3 && trimmed.length <= 60 && /[A-Z]/.test(trimmed)) {
      return { heading: trimmed, level: 1 };
    }

    return null;
  };

  const flush = () => {
    const content = currentContent.join(" ").replace(/\s+/g, " ").trim();
    if (content || currentHeading) {
      const wc = content ? content.split(/\s+/).length : 0;
      sections.push({ heading: currentHeading, level: currentLevel, content, wordCount: wc });
    }
    currentContent = [];
  };

  let firstContentFound = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const h = isHeading(line);
    if (h) {
      flush();
      if (!firstContentFound && !title) {
        title = h.heading;
        firstContentFound = true;
      }
      currentHeading = h.heading;
      currentLevel = h.level;
    } else {
      currentContent.push(trimmed);
      firstContentFound = true;
    }
  }
  flush();

  return { title, sections };
}

router.post(
  "/pdf/extract",
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
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require("pdf-parse");
      const data = await pdfParse(req.file.buffer);

      const text: string = data.text ?? "";
      const { title, sections } = extractStructure(text);
      const totalWords = sections.reduce((acc, s) => acc + s.wordCount, 0);

      await logPayment("/api/agent/pdf/extract", req);

      res.json({ title, sections, pages: data.numpages, totalWords, info: data.info ?? {} });
    } catch (err: unknown) {
      req.log.error({ err }, "PDF extract error");
      res.status(422).json({ error: "Could not parse PDF. File may be corrupted or encrypted." });
    }
  },
);

// ─── POST /api/agent/url/read ─────────────────────────────────────────────────

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
        "User-Agent": "Mozilla/5.0 (compatible; Toolora-Agent/1.0; +https://toolora.replit.app/api/agent)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(15_000),
    }).then((r) => {
      if (!r.ok) throw new Error(`Fetch failed: ${r.status}`);
      return r.text();
    });

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { JSDOM } = require("jsdom");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Readability } = require("@mozilla/readability");

    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article) {
      res.status(422).json({ error: "Could not extract readable content from this URL. The page may require JS rendering or login." });
      return;
    }

    const plainText = article.textContent?.replace(/\s+/g, " ").trim() ?? "";
    const words = plainText ? plainText.split(/\s+/).length : 0;

    await logPayment("/api/agent/url/read", req);

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

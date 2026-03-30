import { Router, type IRouter, type Request, type Response } from "express";
import multer from "multer";
import { PDFDocument } from "pdf-lib";
import QRCode from "qrcode";
import { createWorker } from "tesseract.js";
import mammoth from "mammoth";
import XLSX from "xlsx";
import { db } from "@workspace/db";
import { agentPaymentsTable } from "@workspace/db/schema";
import { desc, sum, count } from "drizzle-orm";
import {
  requirePayment,
  RECEIVER_ADDRESS, NETWORK, PRICE_XLM,
  SOLANA_RECEIVER_ADDRESS, SOLANA_NETWORK, PRICE_USDC,
} from "../middlewares/x402";
import { requireApiKey, logApiKeyUsage } from "../middlewares/apiKey";
import { type NextFunction } from "express";
import OpenAI from "openai";

// ─── Combined auth: API key OR x402 payment ───────────────────────────────────

function requirePaymentOrApiKey(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers["authorization"] as string | undefined;
  if (authHeader?.startsWith("Bearer sk_toolora_")) {
    requireApiKey(req, res, next);
  } else {
    requirePayment(req, res, next as never);
  }
}

// ─── OpenAI client for transcription ─────────────────────────────────────────

function getOpenAIClient(): OpenAI {
  const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;
  const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY ?? "dummy";
  if (!baseURL) throw new Error("AI_INTEGRATIONS_OPENAI_BASE_URL not set. OpenAI integration not configured.");
  return new OpenAI({ baseURL, apiKey });
}

const router: IRouter = Router();
// audio files can be up to 25MB; other uploads 20MB
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

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

  const acceptedPayments: Record<string, unknown>[] = [];
  if (RECEIVER_ADDRESS) {
    acceptedPayments.push({
      protocol: "x402",
      network: `stellar:${NETWORK}`,
      asset: "XLM",
      pricePerRequest: PRICE_XLM,
      payTo: RECEIVER_ADDRESS,
    });
  }
  if (SOLANA_RECEIVER_ADDRESS) {
    acceptedPayments.push({
      protocol: "x402",
      network: `solana:${SOLANA_NETWORK}`,
      asset: "USDC",
      assetAddress: SOLANA_NETWORK === "devnet"
        ? "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
        : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      pricePerRequest: PRICE_USDC,
      payTo: SOLANA_RECEIVER_ADDRESS,
    });
  }

  return {
    name: "Toolora Agent API",
    version: "1.0.0",
    description:
      "Server-side document processing APIs for AI agents. Pay per request via the x402 protocol using Stellar XLM or Solana USDC — no API key, no subscription.",
    acceptedPayments,
    howToPay: [
      "1. Call any paid endpoint. You will receive a 402 with an 'accepts' array listing payment options.",
      "2. Send the required amount to the 'payTo' address on your chosen chain.",
      "3. Retry with header: X-PAYMENT: <base64(JSON.stringify({txHash, from, amount, network}))>",
    ],
    endpoints: [
      {
        id: "pdf.text",
        method: "POST",
        path: "/api/agent/pdf/text",
        url: `${base}/api/agent/pdf/text`,
        paid: true,
        priceXLM: PRICE_XLM,
        priceUSDC: PRICE_USDC,
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
        priceUSDC: PRICE_USDC,
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
        priceUSDC: PRICE_USDC,
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
      {
        id: "pdf.merge",
        method: "POST",
        path: "/api/agent/pdf/merge",
        url: `${base}/api/agent/pdf/merge`,
        paid: true,
        priceXLM: PRICE_XLM,
        priceUSDC: PRICE_USDC,
        description:
          "Merge 2–20 PDF files into a single PDF. Send files as base64-encoded strings in a JSON array. Returns the merged PDF as a base64 string.",
        request: {
          contentType: "application/json",
          body: { files: "array of {base64: string, filename?: string} (2–20 items, required)" },
        },
        response: {
          schema: {
            pdf: "string — base64-encoded merged PDF",
            pages: "number — total page count",
            mergedFrom: "number — number of input files",
            sizeBytes: "number — output file size",
          },
        },
        example: {
          curl: `curl -X POST ${base}/api/agent/pdf/merge \\\n  -H "Content-Type: application/json" \\\n  -H "X-PAYMENT: <base64_payload>" \\\n  -d '{"files":[{"base64":"<pdf1_b64>"},{"base64":"<pdf2_b64>"}]}'`,
        },
      },
      {
        id: "qr",
        method: "POST",
        path: "/api/agent/qr",
        url: `${base}/api/agent/qr`,
        paid: true,
        priceXLM: PRICE_XLM,
        priceUSDC: PRICE_USDC,
        description:
          "Generate a QR code from any text or URL. Returns a base64-encoded PNG. Supports custom size (64–2048px) and error correction level (L/M/Q/H).",
        request: {
          contentType: "application/json",
          body: {
            text: "string (required, max 2953 chars)",
            size: "number (optional, default 400, range 64–2048)",
            errorCorrectionLevel: "L | M | Q | H (optional, default M)",
          },
        },
        response: {
          schema: {
            qr: "string — base64-encoded PNG",
            format: "png",
            width: "number",
            height: "number",
            text: "string — original input",
          },
        },
        example: {
          curl: `curl -X POST ${base}/api/agent/qr \\\n  -H "Content-Type: application/json" \\\n  -H "X-PAYMENT: <base64_payload>" \\\n  -d '{"text":"https://toolora.replit.app","size":400}'`,
        },
      },
      {
        id: "csv.to-json",
        method: "POST",
        path: "/api/agent/csv/to-json",
        url: `${base}/api/agent/csv/to-json`,
        paid: true,
        priceXLM: PRICE_XLM,
        priceUSDC: PRICE_USDC,
        description:
          "Convert a CSV string to a JSON array of objects. First row is treated as column headers by default. Handles quoted fields and embedded commas.",
        request: {
          contentType: "application/json",
          body: { csv: "string (required)", headers: "boolean (optional, default true)" },
        },
        response: {
          schema: {
            rows: "array — parsed rows as objects (or arrays if headers=false)",
            columnNames: "array — column names (when headers=true)",
            columns: "number",
            rowCount: "number",
          },
        },
        example: {
          curl: `curl -X POST ${base}/api/agent/csv/to-json \\\n  -H "Content-Type: application/json" \\\n  -H "X-PAYMENT: <base64_payload>" \\\n  -d '{"csv":"name,age\\nAlice,30\\nBob,25"}'`,
        },
      },
      {
        id: "json.to-csv",
        method: "POST",
        path: "/api/agent/json/to-csv",
        url: `${base}/api/agent/json/to-csv`,
        paid: true,
        priceXLM: PRICE_XLM,
        priceUSDC: PRICE_USDC,
        description:
          "Convert a JSON array of objects to a CSV string. Column names are inferred from all keys across all objects. Handles special characters and proper quoting.",
        request: {
          contentType: "application/json",
          body: {
            data: "array of objects (required)",
            delimiter: "string — single char (optional, default ',')",
          },
        },
        response: {
          schema: {
            csv: "string — CSV output with CRLF line endings",
            columnNames: "array — column headers used",
            columns: "number",
            rowCount: "number",
          },
        },
        example: {
          curl: `curl -X POST ${base}/api/agent/json/to-csv \\\n  -H "Content-Type: application/json" \\\n  -H "X-PAYMENT: <base64_payload>" \\\n  -d '{"data":[{"name":"Alice","age":30},{"name":"Bob","age":25}]}'`,
        },
      },
    ],
    links: {
      docs: `${base}/api-docs`,
      manifest: `${base}/api/agent`,
      stats: `${base}/api/agent/stats`,
      wellKnown: `${base}/.well-known/agent.json`,
      pricing: `${base}/pricing`,
      apiKeys: `${base}/api-keys`,
    },
    auth: {
      methods: ["x402-payment", "api-key"],
      x402: {
        description: "Pay per request. Send required amount to payTo address, retry with X-PAYMENT header.",
        chains: acceptedPayments.map((p) => (p as Record<string, string>).network),
      },
      apiKey: {
        description: "Subscribe for monthly call quota. Add Authorization: Bearer sk_toolora_... header.",
        tiers: { free: "200 calls/mo", pro: "5,000 calls/mo ($19)", team: "50,000 calls/mo ($79)" },
        signup: `${base}/pricing`,
      },
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
  requirePaymentOrApiKey,
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
  requirePaymentOrApiKey,
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

router.post("/url/read", requirePaymentOrApiKey, async (req: Request, res: Response) => {
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

// ─── POST /api/agent/pdf/merge ────────────────────────────────────────────────

router.post("/pdf/merge", requirePaymentOrApiKey, async (req: Request, res: Response) => {
  const body = req.body as { files?: unknown[] };

  if (!Array.isArray(body.files) || body.files.length < 2) {
    res.status(400).json({ error: "Provide at least 2 files in the 'files' array." });
    return;
  }
  if (body.files.length > 20) {
    res.status(400).json({ error: "Maximum 20 files per merge request." });
    return;
  }

  try {
    const merged = await PDFDocument.create();

    for (let i = 0; i < body.files.length; i++) {
      const entry = body.files[i] as { base64?: string; filename?: string };
      if (!entry?.base64 || typeof entry.base64 !== "string") {
        res.status(400).json({ error: `files[${i}] is missing a 'base64' field.` });
        return;
      }

      let buf: Buffer;
      try {
        buf = Buffer.from(entry.base64, "base64");
      } catch {
        res.status(400).json({ error: `files[${i}].base64 is not valid base64.` });
        return;
      }

      if (buf.length < 4 || buf.toString("ascii", 0, 4) !== "%PDF") {
        res.status(400).json({ error: `files[${i}] does not appear to be a valid PDF.` });
        return;
      }

      const doc = await PDFDocument.load(buf);
      const pages = await merged.copyPages(doc, doc.getPageIndices());
      pages.forEach((p) => merged.addPage(p));
    }

    const pdfBytes = await merged.save();
    const base64 = Buffer.from(pdfBytes).toString("base64");

    await logPayment("/api/agent/pdf/merge", req);

    res.json({
      pdf: base64,
      pages: merged.getPageCount(),
      mergedFrom: body.files.length,
      sizeBytes: pdfBytes.length,
    });
  } catch (err: unknown) {
    req.log.error({ err }, "PDF merge error");
    res.status(422).json({ error: "Could not merge PDFs. One or more files may be corrupted or encrypted." });
  }
});

// ─── POST /api/agent/qr ───────────────────────────────────────────────────────

router.post("/qr", requirePaymentOrApiKey, async (req: Request, res: Response) => {
  const { text, size = 400, errorCorrectionLevel = "M" } = req.body as {
    text?: string;
    size?: number;
    errorCorrectionLevel?: "L" | "M" | "Q" | "H";
  };

  if (!text || typeof text !== "string" || text.trim() === "") {
    res.status(400).json({ error: "Missing or empty 'text' field." });
    return;
  }
  if (text.length > 2953) {
    res.status(400).json({ error: "Text too long for a QR code. Maximum is 2953 characters." });
    return;
  }
  const clampedSize = Math.min(Math.max(Number(size) || 400, 64), 2048);
  const validECL = ["L", "M", "Q", "H"];
  const ecl = validECL.includes(errorCorrectionLevel) ? errorCorrectionLevel : "M";

  try {
    const dataUrl = await QRCode.toDataURL(text, {
      width: clampedSize,
      margin: 2,
      errorCorrectionLevel: ecl as "L" | "M" | "Q" | "H",
      color: { dark: "#000000", light: "#ffffff" },
    });

    const base64 = dataUrl.replace(/^data:image\/png;base64,/, "");

    await logPayment("/api/agent/qr", req);

    res.json({ qr: base64, format: "png", width: clampedSize, height: clampedSize, text });
  } catch (err: unknown) {
    req.log.error({ err }, "QR generation error");
    res.status(422).json({ error: "Could not generate QR code." });
  }
});

// ─── POST /api/agent/csv/to-json ──────────────────────────────────────────────

router.post("/csv/to-json", requirePaymentOrApiKey, async (req: Request, res: Response) => {
  const { csv, headers = true } = req.body as { csv?: string; headers?: boolean };

  if (!csv || typeof csv !== "string") {
    res.status(400).json({ error: "Missing 'csv' field (a CSV string)." });
    return;
  }

  try {
    const lines = csv.split(/\r?\n/).filter((l) => l.trim() !== "");
    if (lines.length === 0) {
      res.json({ rows: [], columns: 0, rowCount: 0 });
      return;
    }

    const parseRow = (line: string): string[] => {
      const result: string[] = [];
      let current = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
          if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
          else { inQuotes = !inQuotes; }
        } else if (ch === "," && !inQuotes) {
          result.push(current);
          current = "";
        } else {
          current += ch;
        }
      }
      result.push(current);
      return result;
    };

    if (!headers) {
      const rows = lines.map((l) => parseRow(l));
      res.json({ rows, columns: rows[0]?.length ?? 0, rowCount: rows.length });
      return;
    }

    const columnNames = parseRow(lines[0]);
    const rows = lines.slice(1).map((line) => {
      const values = parseRow(line);
      const obj: Record<string, string> = {};
      columnNames.forEach((col, idx) => { obj[col] = values[idx] ?? ""; });
      return obj;
    });

    await logPayment("/api/agent/csv/to-json", req);

    res.json({ rows, columns: columnNames.length, rowCount: rows.length, columnNames });
  } catch (err: unknown) {
    req.log.error({ err }, "CSV to JSON error");
    res.status(422).json({ error: "Failed to parse CSV." });
  }
});

// ─── POST /api/agent/json/to-csv ──────────────────────────────────────────────

router.post("/json/to-csv", requirePaymentOrApiKey, async (req: Request, res: Response) => {
  const { data, delimiter = "," } = req.body as { data?: unknown[]; delimiter?: string };

  if (!Array.isArray(data) || data.length === 0) {
    res.status(400).json({ error: "Missing or empty 'data' array. Provide an array of objects." });
    return;
  }
  if (typeof delimiter !== "string" || delimiter.length !== 1) {
    res.status(400).json({ error: "'delimiter' must be a single character (default: ',')." });
    return;
  }

  try {
    const allKeys = Array.from(new Set(data.flatMap((r) => (typeof r === "object" && r !== null ? Object.keys(r as object) : []))));
    if (allKeys.length === 0) {
      res.status(400).json({ error: "Could not determine column names. Data must be an array of objects." });
      return;
    }

    const escapeCell = (val: unknown): string => {
      const str = val === null || val === undefined ? "" : String(val);
      if (str.includes(delimiter) || str.includes('"') || str.includes("\n") || str.includes("\r")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const header = allKeys.map(escapeCell).join(delimiter);
    const dataRows = data.map((row) => allKeys.map((k) => escapeCell((row as Record<string, unknown>)[k])).join(delimiter));
    const csv = [header, ...dataRows].join("\r\n");

    await logPayment("/api/agent/json/to-csv", req);

    res.json({ csv, columns: allKeys.length, rowCount: data.length, columnNames: allKeys });
  } catch (err: unknown) {
    req.log.error({ err }, "JSON to CSV error");
    res.status(422).json({ error: "Failed to convert JSON to CSV." });
  }
});

// ─── POST /api/agent/ocr ──────────────────────────────────────────────────────

router.post("/ocr", requirePaymentOrApiKey, upload.single("file"), async (req: Request, res: Response) => {
  if (!req.file) { res.status(400).json({ error: "No file uploaded." }); return; }

  const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/bmp", "image/tiff"];
  if (!allowedTypes.includes(req.file.mimetype)) {
    res.status(400).json({ error: "Unsupported file type. Use PNG, JPEG, WEBP, BMP, or TIFF." });
    return;
  }

  try {
    const worker = await createWorker("eng");
    const { data } = await worker.recognize(req.file.buffer);
    await worker.terminate();

    const text = data.text;
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const chars = text.length;

    await logPayment("/api/agent/ocr", req);
    await logApiKeyUsage(req, "/api/agent/ocr");
    res.json({ text, confidence: Math.round(data.confidence), words, chars, language: "eng" });
  } catch (err: unknown) {
    req.log.error({ err }, "OCR error");
    res.status(500).json({ error: "OCR processing failed." });
  }
});

// ─── POST /api/agent/docx/text ────────────────────────────────────────────────

router.post("/docx/text", requirePaymentOrApiKey, upload.single("file"), async (req: Request, res: Response) => {
  if (!req.file) { res.status(400).json({ error: "No file uploaded." }); return; }

  const allowed = [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "application/octet-stream",
  ];
  if (!allowed.includes(req.file.mimetype) && !req.file.originalname?.endsWith(".docx")) {
    res.status(400).json({ error: "Upload a .docx Word document." });
    return;
  }

  try {
    const result = await mammoth.extractRawText({ buffer: req.file.buffer });
    const text = result.value;
    const paragraphs = text.split(/\n+/).filter((p) => p.trim().length > 0).length;
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const chars = text.length;

    await logPayment("/api/agent/docx/text", req);
    await logApiKeyUsage(req, "/api/agent/docx/text");
    res.json({ text, paragraphs, words, chars });
  } catch (err: unknown) {
    req.log.error({ err }, "DOCX parsing error");
    res.status(422).json({ error: "Failed to parse .docx file. Ensure the file is a valid Word document." });
  }
});

// ─── POST /api/agent/excel/to-json ───────────────────────────────────────────

router.post("/excel/to-json", requirePaymentOrApiKey, upload.single("file"), async (req: Request, res: Response) => {
  if (!req.file) { res.status(400).json({ error: "No file uploaded." }); return; }

  const allowedExts = [".xlsx", ".xls", ".ods", ".csv"];
  const filename = req.file.originalname?.toLowerCase() ?? "";
  const hasValidExt = allowedExts.some((ext) => filename.endsWith(ext));
  if (!hasValidExt) {
    res.status(400).json({ error: "Upload an Excel file (.xlsx, .xls, .ods) or CSV." });
    return;
  }

  try {
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheets: Record<string, unknown[]> = {};
    let totalRows = 0;

    for (const sheetName of workbook.SheetNames) {
      const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      sheets[sheetName] = rows;
      totalRows += rows.length;
    }

    await logPayment("/api/agent/excel/to-json", req);
    await logApiKeyUsage(req, "/api/agent/excel/to-json");
    res.json({ sheets, sheetNames: workbook.SheetNames, totalRows });
  } catch (err: unknown) {
    req.log.error({ err }, "Excel parsing error");
    res.status(422).json({ error: "Failed to parse Excel file." });
  }
});

// ─── POST /api/agent/audio/transcribe ────────────────────────────────────────

router.post(
  "/audio/transcribe",
  requirePaymentOrApiKey,
  upload.single("file"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded. Send an audio file in the 'file' multipart field." });
      return;
    }

    const supportedFormats = ["audio/flac", "audio/m4a", "audio/mp4", "audio/mpeg", "audio/mpga", "audio/ogg", "audio/wav", "audio/webm", "audio/x-m4a"];
    const supportedExts = [".flac", ".m4a", ".mp3", ".mp4", ".mpeg", ".mpga", ".oga", ".ogg", ".wav", ".webm"];
    const filename = req.file.originalname?.toLowerCase() ?? "";
    const hasValidExt = supportedExts.some((ext) => filename.endsWith(ext));
    const hasValidMime = supportedFormats.includes(req.file.mimetype);

    if (!hasValidExt && !hasValidMime) {
      res.status(400).json({
        error: "Unsupported audio format. Supported: flac, m4a, mp3, mp4, mpeg, mpga, oga, ogg, wav, webm.",
        received: { mimetype: req.file.mimetype, filename: req.file.originalname },
      });
      return;
    }

    try {
      const ai = getOpenAIClient();

      // OpenAI SDK needs a File-like object with name and type
      const audioFile = new File(
        [req.file.buffer],
        req.file.originalname || "audio.mp3",
        { type: req.file.mimetype || "audio/mpeg" },
      );

      const transcript = await ai.audio.transcriptions.create({
        file: audioFile,
        model: "gpt-4o-mini-transcribe",
        response_format: "json",
      });

      const text = transcript.text;
      const words = text.trim().split(/\s+/).filter(Boolean).length;
      const duration = (req.file.buffer.length / 1024 / 128).toFixed(1); // rough estimate

      await logPayment("/api/agent/audio/transcribe", req);
      await logApiKeyUsage(req, "/api/agent/audio/transcribe");

      res.json({
        text,
        words,
        chars: text.length,
        model: "gpt-4o-mini-transcribe",
        fileSizeBytes: req.file.buffer.length,
        estimatedDurationSeconds: parseFloat(duration),
      });
    } catch (err: unknown) {
      req.log.error({ err }, "Audio transcription error");
      const msg = err instanceof Error ? err.message : "Unknown error";
      if (msg.includes("not configured")) {
        res.status(503).json({ error: "Audio transcription is not available. OpenAI integration not set up." });
      } else {
        res.status(500).json({ error: "Transcription failed. Ensure the file is a valid audio file." });
      }
    }
  },
);

// ─── POST /api/agent/url/scrape ───────────────────────────────────────────────
// JS-rendered scraping via Jina Reader (handles SPAs, dynamically rendered pages)

router.post("/url/scrape", requirePaymentOrApiKey, async (req: Request, res: Response) => {
  const { url, format = "text" } = req.body as { url?: string; format?: "text" | "markdown" };

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

  if (!["text", "markdown"].includes(format)) {
    res.status(400).json({ error: "Invalid 'format'. Use 'text' or 'markdown'." });
    return;
  }

  try {
    const jinaUrl = `https://r.jina.ai/${parsedUrl.href}`;
    const response = await fetch(jinaUrl, {
      headers: {
        "Accept": "application/json",
        "X-Return-Format": format === "markdown" ? "markdown" : "text",
        "X-Timeout": "30",
        "User-Agent": "Toolora-Agent/1.0",
      },
      signal: AbortSignal.timeout(35_000),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      req.log.warn({ status: response.status, url }, "Jina Reader failed");
      if (response.status === 429) {
        res.status(429).json({ error: "Scraping rate limit exceeded. Try again shortly." });
      } else if (response.status >= 400 && response.status < 500) {
        res.status(422).json({ error: `Could not scrape URL: ${response.status}. ${errText.slice(0, 200)}` });
      } else {
        res.status(502).json({ error: "Scraping service unavailable. Try again later." });
      }
      return;
    }

    const contentType = response.headers.get("content-type") ?? "";
    let content: string;
    let title: string | null = null;

    if (contentType.includes("application/json")) {
      const json = await response.json() as { data?: { text?: string; content?: string; title?: string }; code?: number };
      content = json.data?.text ?? json.data?.content ?? "";
      title = json.data?.title ?? null;
    } else {
      content = await response.text();
      const firstLine = content.split("\n")[0] ?? "";
      if (firstLine.startsWith("Title:")) title = firstLine.replace("Title:", "").trim();
    }

    if (!content || content.trim().length < 20) {
      res.status(422).json({ error: "Could not extract content from this URL. The page may require authentication." });
      return;
    }

    const words = content.trim().split(/\s+/).filter(Boolean).length;

    await logPayment("/api/agent/url/scrape", req);
    await logApiKeyUsage(req, "/api/agent/url/scrape");

    res.json({
      title,
      content,
      words,
      chars: content.length,
      format,
      url,
      scrapedAt: new Date().toISOString(),
      engine: "jina-reader",
    });
  } catch (err: unknown) {
    req.log.error({ err }, "JS scraping error");
    const msg = err instanceof Error ? err.message : "Unknown error";
    if (msg.includes("timed out") || msg.includes("timeout")) {
      res.status(504).json({ error: "Scraping timed out. The page took too long to load." });
    } else {
      res.status(500).json({ error: "Failed to scrape URL." });
    }
  }
});

export default router;


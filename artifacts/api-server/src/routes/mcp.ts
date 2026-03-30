import { Router, type IRouter, type Request, type Response } from "express";
import { PDFDocument } from "pdf-lib";
import QRCode from "qrcode";
import { createWorker } from "tesseract.js";
import mammoth from "mammoth";
import XLSX from "xlsx";
import OpenAI from "openai";

const router: IRouter = Router();

const SERVER_NAME = "toolora";
const SERVER_VERSION = "1.0.0";
const PROTOCOL_VERSION = "2025-03-26";

// ─── Tool definitions ─────────────────────────────────────────────────────────

const TOOLS = [
  {
    name: "extract_pdf_text",
    description:
      "Extract all plain text from a PDF file. Accepts the file as a base64-encoded string. Returns the text content, page count, word count, and character count. Useful for reading documents, research papers, invoices, or any PDF without needing to open it.",
    inputSchema: {
      type: "object",
      properties: {
        fileBase64: { type: "string", description: "The PDF file contents encoded as a base64 string." },
        filename: { type: "string", description: "Optional original filename, used for validation only." },
      },
      required: ["fileBase64"],
    },
  },
  {
    name: "merge_pdfs",
    description:
      "Merge 2 to 20 PDF files into a single PDF document. Each file is provided as a base64-encoded string. Returns the merged PDF as a base64 PNG. Ideal for combining reports, invoices, chapters, or any multi-file PDF workflow.",
    inputSchema: {
      type: "object",
      properties: {
        files: {
          type: "array",
          description: "Array of PDF files to merge, in order. Each item must have a 'base64' field.",
          items: {
            type: "object",
            properties: {
              base64: { type: "string", description: "Base64-encoded PDF file content." },
              filename: { type: "string", description: "Optional filename for context." },
            },
            required: ["base64"],
          },
          minItems: 2,
          maxItems: 20,
        },
      },
      required: ["files"],
    },
  },
  {
    name: "generate_qr_code",
    description:
      "Generate a QR code image from any text or URL. Returns a base64-encoded PNG. Supports custom size and error correction level. Useful for creating shareable links, contact cards, payment addresses, or any scannable code.",
    inputSchema: {
      type: "object",
      properties: {
        text: { type: "string", description: "The text or URL to encode in the QR code. Max 2953 characters." },
        size: { type: "number", description: "Image width/height in pixels (64–2048, default 400)." },
        errorCorrectionLevel: {
          type: "string",
          enum: ["L", "M", "Q", "H"],
          description: "Error correction level: L (7%), M (15%, default), Q (25%), H (30%).",
        },
      },
      required: ["text"],
    },
  },
  {
    name: "csv_to_json",
    description:
      "Convert a CSV string into a JSON array of objects. The first row is treated as column headers by default. Handles quoted fields, embedded commas, and CRLF line endings. Useful for processing spreadsheet exports, data files, and tabular data.",
    inputSchema: {
      type: "object",
      properties: {
        csv: { type: "string", description: "The CSV data as a string." },
        headers: { type: "boolean", description: "Whether the first row contains column names (default: true)." },
      },
      required: ["csv"],
    },
  },
  {
    name: "json_to_csv",
    description:
      "Convert a JSON array of objects into a CSV string. Column names are inferred from all object keys. Handles special characters, embedded commas, and quotes with proper escaping. Returns a CSV with CRLF line endings.",
    inputSchema: {
      type: "object",
      properties: {
        data: {
          type: "array",
          description: "Array of objects to convert to CSV rows.",
          items: { type: "object" },
        },
        delimiter: { type: "string", description: "Column delimiter character (default: ',')." },
      },
      required: ["data"],
    },
  },
  {
    name: "ocr_image",
    description:
      "Extract text from an image using OCR (Optical Character Recognition). Accepts the image as a base64-encoded string. Returns extracted text, confidence score, and word count. Useful for reading scanned documents, screenshots, handwritten notes, or any image where text needs to be extracted without a vision model.",
    inputSchema: {
      type: "object",
      properties: {
        imageBase64: { type: "string", description: "Image file contents as a base64 string. Supported: PNG, JPEG, WEBP, BMP, TIFF." },
        filename: { type: "string", description: "Optional filename with extension (e.g., 'scan.png') to help with format detection." },
      },
      required: ["imageBase64"],
    },
  },
  {
    name: "extract_docx_text",
    description:
      "Extract all plain text from a Microsoft Word (.docx) file. Accepts the file as a base64-encoded string. Returns the full text, paragraph count, word count, and character count. Works with files from Microsoft Word, Google Docs, and LibreOffice.",
    inputSchema: {
      type: "object",
      properties: {
        fileBase64: { type: "string", description: "The .docx file contents encoded as a base64 string." },
        filename: { type: "string", description: "Optional filename for format validation." },
      },
      required: ["fileBase64"],
    },
  },
  {
    name: "excel_to_json",
    description:
      "Parse an Excel file (.xlsx, .xls, .csv, .ods) and return all sheets as JSON arrays of objects. Column headers from the first row become object keys. Returns a map of sheet name to row array, plus total row count.",
    inputSchema: {
      type: "object",
      properties: {
        fileBase64: { type: "string", description: "The Excel or CSV file contents encoded as a base64 string." },
        filename: { type: "string", description: "Filename with extension (e.g., 'data.xlsx') — required for format detection." },
      },
      required: ["fileBase64", "filename"],
    },
  },
  {
    name: "transcribe_audio",
    description:
      "Transcribe speech from an audio file to text using OpenAI Whisper (gpt-4o-mini-transcribe). Accepts the audio as a base64-encoded string. Returns the full transcript, word count, and character count. Supported formats: flac, m4a, mp3, mp4, mpeg, mpga, oga, ogg, wav, webm. Maximum file size: 25MB. Great for transcribing meeting recordings, podcasts, voice notes, interviews, or any spoken audio.",
    inputSchema: {
      type: "object",
      properties: {
        audioBase64: { type: "string", description: "The audio file contents encoded as a base64 string." },
        filename: { type: "string", description: "Filename with extension (e.g., 'recording.mp3') — used for format detection." },
      },
      required: ["audioBase64", "filename"],
    },
  },
  {
    name: "scrape_url_js",
    description:
      "Fetch and extract content from a web page that requires JavaScript rendering (SPAs, dynamically loaded content). Unlike read_url which uses simple HTTP fetch, this tool uses a headless browser to render the page first. Returns clean text or markdown. Use for React/Next.js/Angular/Vue apps, product pages, news sites behind JS paywalls, or any page where read_url returns empty content.",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "The full URL to scrape (must be http:// or https://)." },
        format: { type: "string", enum: ["text", "markdown"], description: "Output format: 'text' for plain text (default), 'markdown' to preserve headings and links." },
      },
      required: ["url"],
    },
  },
  {
    name: "count_words",
    description:
      "Count words, characters, sentences, and paragraphs in a block of text. Also returns estimated reading time. Useful for checking document stats, validating content length, or summarising text metrics.",
    inputSchema: {
      type: "object",
      properties: {
        text: { type: "string", description: "The text to analyse." },
      },
      required: ["text"],
    },
  },
  {
    name: "read_url",
    description:
      "Fetch a public web page and return its main readable content as plain text, along with the title, author, and excerpt. Uses Mozilla Readability to strip navigation, ads, and boilerplate. Great for reading articles, documentation, or any page you want to process without a browser.",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "The full URL to fetch (must be http:// or https://)." },
      },
      required: ["url"],
    },
  },
];

// ─── Error class ──────────────────────────────────────────────────────────────

class McpToolError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "McpToolError";
  }
}

// ─── Tool handlers ────────────────────────────────────────────────────────────

async function handleExtractPdfText(args: Record<string, unknown>): Promise<string> {
  const { fileBase64, filename } = args as { fileBase64?: string; filename?: string };

  if (!fileBase64 || typeof fileBase64 !== "string") {
    throw new McpToolError("Missing required argument: fileBase64");
  }

  const ext = (filename ?? "").toLowerCase();
  if (ext && !ext.endsWith(".pdf")) {
    throw new McpToolError("filename suggests this is not a PDF. Only PDF files are supported.");
  }

  let buffer: Buffer;
  try {
    buffer = Buffer.from(fileBase64, "base64");
  } catch {
    throw new McpToolError("fileBase64 is not valid base64.");
  }

  if (buffer.length < 4 || buffer.toString("ascii", 0, 4) !== "%PDF") {
    throw new McpToolError("File does not appear to be a valid PDF (missing %PDF header).");
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require("pdf-parse");
  const data = await pdfParse(buffer);
  const text: string = data.text ?? "";
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return JSON.stringify({ text, pages: data.numpages, words, chars: text.length, info: data.info ?? {} }, null, 2);
}

function handleCountWords(args: Record<string, unknown>): string {
  const { text } = args as { text?: string };

  if (!text || typeof text !== "string") {
    throw new McpToolError("Missing required argument: text");
  }

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const sentences = (text.match(/[.!?]+(\s|$)/g) ?? []).length;
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;
  const readingTimeMin = Math.ceil(words / 200);

  return JSON.stringify({ words, chars, charsNoSpaces, sentences, paragraphs, readingTimeMin }, null, 2);
}

async function handleReadUrl(args: Record<string, unknown>): Promise<string> {
  const { url } = args as { url?: string };

  if (!url || typeof url !== "string") {
    throw new McpToolError("Missing required argument: url");
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) throw new Error("Bad protocol");
  } catch {
    throw new McpToolError("Invalid URL. Must be a full http:// or https:// URL.");
  }

  const html = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; Toolora-MCP/1.0; +https://toolora.replit.app/api/mcp)",
      Accept: "text/html,application/xhtml+xml",
    },
    signal: AbortSignal.timeout(15_000),
  }).then((r) => {
    if (!r.ok) throw new McpToolError(`Fetch failed: HTTP ${r.status}`);
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
    throw new McpToolError("Could not extract readable content from this URL. The page may require JS rendering or login.");
  }

  const content = article.textContent?.replace(/\s+/g, " ").trim() ?? "";
  const wordCount = content ? content.split(/\s+/).length : 0;

  return JSON.stringify({
    title: article.title ?? null,
    byline: article.byline ?? null,
    excerpt: article.excerpt ?? null,
    content,
    wordCount,
    url,
    fetchedAt: new Date().toISOString(),
  }, null, 2);
}

async function handleMergePdfs(args: Record<string, unknown>): Promise<string> {
  const { files } = args as { files?: Array<{ base64?: string; filename?: string }> };

  if (!Array.isArray(files) || files.length < 2) {
    throw new McpToolError("Provide at least 2 files in the 'files' array.");
  }
  if (files.length > 20) {
    throw new McpToolError("Maximum 20 files per merge request.");
  }

  const merged = await PDFDocument.create();
  for (let i = 0; i < files.length; i++) {
    const entry = files[i];
    if (!entry?.base64 || typeof entry.base64 !== "string") {
      throw new McpToolError(`files[${i}] is missing a 'base64' field.`);
    }
    const buf = Buffer.from(entry.base64, "base64");
    if (buf.length < 4 || buf.toString("ascii", 0, 4) !== "%PDF") {
      throw new McpToolError(`files[${i}] does not appear to be a valid PDF.`);
    }
    const doc = await PDFDocument.load(buf);
    const pages = await merged.copyPages(doc, doc.getPageIndices());
    pages.forEach((p) => merged.addPage(p));
  }

  const pdfBytes = await merged.save();
  const base64 = Buffer.from(pdfBytes).toString("base64");
  return JSON.stringify({ pdf: base64, pages: merged.getPageCount(), mergedFrom: files.length, sizeBytes: pdfBytes.length });
}

async function handleGenerateQr(args: Record<string, unknown>): Promise<string> {
  const { text, size = 400, errorCorrectionLevel = "M" } = args as {
    text?: string;
    size?: number;
    errorCorrectionLevel?: string;
  };

  if (!text || typeof text !== "string" || text.trim() === "") {
    throw new McpToolError("Missing or empty 'text' field.");
  }
  if (text.length > 2953) {
    throw new McpToolError("Text too long. Maximum is 2953 characters for a QR code.");
  }

  const clampedSize = Math.min(Math.max(Number(size) || 400, 64), 2048);
  const ecl = ["L", "M", "Q", "H"].includes(String(errorCorrectionLevel)) ? errorCorrectionLevel as "L" | "M" | "Q" | "H" : "M";

  const dataUrl = await QRCode.toDataURL(text, {
    width: clampedSize,
    margin: 2,
    errorCorrectionLevel: ecl,
    color: { dark: "#000000", light: "#ffffff" },
  });

  const base64 = dataUrl.replace(/^data:image\/png;base64,/, "");
  return JSON.stringify({ qr: base64, format: "png", width: clampedSize, height: clampedSize, text });
}

function handleCsvToJson(args: Record<string, unknown>): string {
  const { csv, headers = true } = args as { csv?: string; headers?: boolean };

  if (!csv || typeof csv !== "string") {
    throw new McpToolError("Missing 'csv' field.");
  }

  const lines = csv.split(/\r?\n/).filter((l) => l.trim() !== "");
  if (lines.length === 0) {
    return JSON.stringify({ rows: [], columns: 0, rowCount: 0 });
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
    return JSON.stringify({ rows, columns: rows[0]?.length ?? 0, rowCount: rows.length });
  }

  const columnNames = parseRow(lines[0]);
  const rows = lines.slice(1).map((line) => {
    const values = parseRow(line);
    const obj: Record<string, string> = {};
    columnNames.forEach((col, idx) => { obj[col] = values[idx] ?? ""; });
    return obj;
  });
  return JSON.stringify({ rows, columnNames, columns: columnNames.length, rowCount: rows.length });
}

function handleJsonToCsv(args: Record<string, unknown>): string {
  const { data, delimiter = "," } = args as { data?: unknown[]; delimiter?: string };

  if (!Array.isArray(data) || data.length === 0) {
    throw new McpToolError("Missing or empty 'data' array. Provide an array of objects.");
  }

  const sep = typeof delimiter === "string" && delimiter.length === 1 ? delimiter : ",";
  const allKeys = Array.from(new Set(data.flatMap((r) => (typeof r === "object" && r !== null ? Object.keys(r as object) : []))));

  if (allKeys.length === 0) {
    throw new McpToolError("Could not determine column names. Data must be an array of objects.");
  }

  const escapeCell = (val: unknown): string => {
    const str = val === null || val === undefined ? "" : String(val);
    if (str.includes(sep) || str.includes('"') || str.includes("\n") || str.includes("\r")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const header = allKeys.map(escapeCell).join(sep);
  const dataRows = data.map((row) => allKeys.map((k) => escapeCell((row as Record<string, unknown>)[k])).join(sep));
  const csv = [header, ...dataRows].join("\r\n");
  return JSON.stringify({ csv, columnNames: allKeys, columns: allKeys.length, rowCount: data.length });
}

async function handleOcrImage(args: Record<string, unknown>): Promise<string> {
  const { imageBase64 } = args as { imageBase64?: string };
  if (!imageBase64 || typeof imageBase64 !== "string") {
    throw new McpToolError("Missing 'imageBase64' field.");
  }
  const buffer = Buffer.from(imageBase64, "base64");
  if (buffer.length < 4) throw new McpToolError("Image data is too small or invalid.");

  const worker = await createWorker("eng");
  try {
    const { data } = await worker.recognize(buffer);
    const text = data.text;
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return JSON.stringify({ text, confidence: Math.round(data.confidence), words, chars: text.length, language: "eng" });
  } finally {
    await worker.terminate();
  }
}

async function handleExtractDocx(args: Record<string, unknown>): Promise<string> {
  const { fileBase64 } = args as { fileBase64?: string };
  if (!fileBase64 || typeof fileBase64 !== "string") {
    throw new McpToolError("Missing 'fileBase64' field.");
  }
  const buffer = Buffer.from(fileBase64, "base64");
  const result = await mammoth.extractRawText({ buffer });
  const text = result.value;
  const paragraphs = text.split(/\n+/).filter((p) => p.trim().length > 0).length;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return JSON.stringify({ text, paragraphs, words, chars: text.length });
}

function handleExcelToJson(args: Record<string, unknown>): string {
  const { fileBase64, filename } = args as { fileBase64?: string; filename?: string };
  if (!fileBase64 || typeof fileBase64 !== "string") throw new McpToolError("Missing 'fileBase64' field.");
  if (!filename || typeof filename !== "string") throw new McpToolError("Missing 'filename' field — needed for format detection.");

  const buffer = Buffer.from(fileBase64, "base64");
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheets: Record<string, unknown[]> = {};
  let totalRows = 0;

  for (const sheetName of workbook.SheetNames) {
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    sheets[sheetName] = rows;
    totalRows += rows.length;
  }
  return JSON.stringify({ sheets, sheetNames: workbook.SheetNames, totalRows });
}

async function handleTranscribeAudio(args: Record<string, unknown>): Promise<string> {
  const { audioBase64, filename } = args as { audioBase64?: string; filename?: string };
  if (!audioBase64 || typeof audioBase64 !== "string") throw new McpToolError("Missing 'audioBase64' field.");
  if (!filename || typeof filename !== "string") throw new McpToolError("Missing 'filename' field — needed for format detection.");

  const supportedExts = [".flac", ".m4a", ".mp3", ".mp4", ".mpeg", ".mpga", ".oga", ".ogg", ".wav", ".webm"];
  const lower = filename.toLowerCase();
  if (!supportedExts.some((ext) => lower.endsWith(ext))) {
    throw new McpToolError(`Unsupported audio format. Use: ${supportedExts.join(", ")}`);
  }

  const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;
  const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY ?? "dummy";
  if (!baseURL) throw new McpToolError("Audio transcription is not available — OpenAI integration not configured.");

  const buffer = Buffer.from(audioBase64, "base64");
  if (buffer.length > 25 * 1024 * 1024) throw new McpToolError("Audio file exceeds 25MB limit.");

  const ai = new OpenAI({ baseURL, apiKey });
  const audioFile = new File([buffer], filename, { type: "audio/mpeg" });

  const transcript = await ai.audio.transcriptions.create({
    file: audioFile,
    model: "gpt-4o-mini-transcribe",
    response_format: "json",
  });

  const text = transcript.text;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return JSON.stringify({ text, words, chars: text.length, model: "gpt-4o-mini-transcribe", fileSizeBytes: buffer.length });
}

async function handleScrapeUrlJs(args: Record<string, unknown>): Promise<string> {
  const { url, format = "text" } = args as { url?: string; format?: "text" | "markdown" };
  if (!url || typeof url !== "string") throw new McpToolError("Missing 'url' field.");

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) throw new Error();
  } catch {
    throw new McpToolError("Invalid URL. Must be a full http:// or https:// URL.");
  }

  if (!["text", "markdown"].includes(format as string)) throw new McpToolError("Invalid 'format'. Use 'text' or 'markdown'.");

  const jinaUrl = `https://r.jina.ai/${parsedUrl.href}`;
  const response = await fetch(jinaUrl, {
    headers: {
      Accept: "application/json",
      "X-Return-Format": format === "markdown" ? "markdown" : "text",
      "X-Timeout": "30",
      "User-Agent": "Toolora-MCP/1.0",
    },
    signal: AbortSignal.timeout(35_000),
  });

  if (!response.ok) {
    throw new McpToolError(`Scraping failed: HTTP ${response.status}. The page may be unavailable or require authentication.`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  let content: string;
  let title: string | null = null;

  if (contentType.includes("application/json")) {
    const json = await response.json() as { data?: { text?: string; content?: string; title?: string } };
    content = json.data?.text ?? json.data?.content ?? "";
    title = json.data?.title ?? null;
  } else {
    content = await response.text();
    const firstLine = content.split("\n")[0] ?? "";
    if (firstLine.startsWith("Title:")) title = firstLine.replace("Title:", "").trim();
  }

  if (!content || content.trim().length < 20) {
    throw new McpToolError("Could not extract content from this URL. The page may require authentication.");
  }

  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return JSON.stringify({ title, content, words, chars: content.length, format, url, engine: "jina-reader" });
}

// ─── JSON-RPC helpers ─────────────────────────────────────────────────────────

function rpcOk(id: string | number | null, result: unknown) {
  return { jsonrpc: "2.0", id, result };
}

function rpcErr(id: string | number | null, code: number, message: string) {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

// ─── MCP endpoint ─────────────────────────────────────────────────────────────

router.post("/", async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");

  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  if (sessionId) res.setHeader("mcp-session-id", sessionId);

  const body = req.body as { jsonrpc?: string; method?: string; id?: string | number | null; params?: Record<string, unknown> };

  if (body.jsonrpc !== "2.0" || !body.method) {
    res.json(rpcErr(body.id ?? null, -32600, "Invalid Request"));
    return;
  }

  const { method, id = null, params = {} } = body;

  try {
    switch (method) {
      case "initialize":
        res.json(rpcOk(id, {
          protocolVersion: PROTOCOL_VERSION,
          serverInfo: { name: SERVER_NAME, version: SERVER_VERSION },
          capabilities: { tools: {} },
          instructions:
            "Toolora MCP server exposes browser-side tool functionality as server-side APIs. All tools are free to use. For high-volume or programmatic use, the direct HTTP Agent API at /api/agent supports x402 micropayments.",
        }));
        break;

      case "notifications/initialized":
        res.status(204).end();
        break;

      case "tools/list":
        res.json(rpcOk(id, { tools: TOOLS }));
        break;

      case "tools/call": {
        const { name, arguments: args = {} } = params as { name?: string; arguments?: Record<string, unknown> };

        if (!name) {
          res.json(rpcErr(id, -32602, "Missing tool name"));
          return;
        }

        let text: string;
        try {
          switch (name) {
            case "extract_pdf_text":
              text = await handleExtractPdfText(args);
              break;
            case "merge_pdfs":
              text = await handleMergePdfs(args);
              break;
            case "generate_qr_code":
              text = await handleGenerateQr(args);
              break;
            case "csv_to_json":
              text = handleCsvToJson(args);
              break;
            case "json_to_csv":
              text = handleJsonToCsv(args);
              break;
            case "ocr_image":
              text = await handleOcrImage(args);
              break;
            case "extract_docx_text":
              text = await handleExtractDocx(args);
              break;
            case "excel_to_json":
              text = handleExcelToJson(args);
              break;
            case "transcribe_audio":
              text = await handleTranscribeAudio(args);
              break;
            case "scrape_url_js":
              text = await handleScrapeUrlJs(args);
              break;
            case "count_words":
              text = handleCountWords(args);
              break;
            case "read_url":
              text = await handleReadUrl(args);
              break;
            default:
              res.json(rpcErr(id, -32602, `Unknown tool: ${name}`));
              return;
          }
          res.json(rpcOk(id, { content: [{ type: "text", text }] }));
        } catch (err: unknown) {
          if (err instanceof McpToolError) {
            res.json(rpcOk(id, {
              content: [{ type: "text", text: err.message }],
              isError: true,
            }));
          } else {
            const msg = err instanceof Error ? err.message : "Internal error";
            res.json(rpcOk(id, {
              content: [{ type: "text", text: `Tool execution failed: ${msg}` }],
              isError: true,
            }));
          }
        }
        break;
      }

      case "ping":
        res.json(rpcOk(id, {}));
        break;

      default:
        res.json(rpcErr(id, -32601, `Method not found: ${method}`));
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    res.json(rpcErr(id, -32603, msg));
  }
});

// ─── Discovery endpoint ───────────────────────────────────────────────────────

router.get("/", (_req: Request, res: Response) => {
  res.json({
    name: "Toolora MCP Server",
    version: SERVER_VERSION,
    protocolVersion: PROTOCOL_VERSION,
    transport: "Streamable HTTP",
    endpoint: "/api/mcp",
    tools: TOOLS.map((t) => ({ name: t.name, description: t.description })),
    usage: {
      addToClaudeDesktop: {
        mcpServers: {
          toolora: {
            url: "https://toolora-api.replit.app/api/mcp",
            transport: "http",
          },
        },
      },
    },
  });
});

export default router;

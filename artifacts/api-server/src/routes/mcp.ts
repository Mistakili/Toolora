import { Router, type IRouter, type Request, type Response } from "express";
import { PDFDocument } from "pdf-lib";
import QRCode from "qrcode";
import { createWorker } from "tesseract.js";
import mammoth from "mammoth";
import ExcelJS from "exceljs";
import OpenAI from "openai";
import { db } from "@workspace/db";
import { mcpCallsTable, pastesTable, memoriesTable } from "@workspace/db/schema";
import { logger } from "../lib/logger";

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
      "Count words, characters, sentences, paragraphs, and unique words in a block of text. Returns reading time (200 wpm), speaking time (130 wpm), Flesch readability score with label (Very Easy → Very Difficult), and top keyword frequency excluding common stop words. Use when you need document stats, content length validation, readability checks, or keyword density analysis.",
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
  {
    name: "generate_pdf_from_text",
    description:
      "Generate a PDF document from plain text or markdown-style content. Supports headings (lines starting with #), bullet lists, and paragraphs. Returns the PDF as a base64-encoded string. Ideal for packaging Claude's output — reports, summaries, plans — into a shareable PDF file.",
    inputSchema: {
      type: "object",
      properties: {
        content: { type: "string", description: "The text content to render into a PDF. Supports # headings, ## subheadings, - bullet points, and plain paragraphs." },
        title: { type: "string", description: "Optional document title shown at the top of the PDF." },
        author: { type: "string", description: "Optional author name added to PDF metadata." },
      },
      required: ["content"],
    },
  },
  {
    name: "markdown_to_html",
    description:
      "Convert markdown text into a clean, complete HTML document. Supports headings, bold, italic, code blocks, inline code, bullet lists, numbered lists, blockquotes, horizontal rules, and links. Returns a full HTML page ready to save, share, or embed. Great for turning Claude's markdown output into publishable web content.",
    inputSchema: {
      type: "object",
      properties: {
        markdown: { type: "string", description: "The markdown content to convert." },
        title: { type: "string", description: "Optional page title used in the <title> tag." },
        includeStyles: { type: "boolean", description: "Include basic CSS styling for readability (default: true)." },
      },
      required: ["markdown"],
    },
  },
  {
    name: "create_shareable_paste",
    description:
      "Store any text content and get back a public URL at toolora.dev/p/[id] that anyone can visit to read it. Perfect for sharing Claude's output — reports, code, analysis — as a clean link without needing a file or account. Content expires after 7 days by default.",
    inputSchema: {
      type: "object",
      properties: {
        content: { type: "string", description: "The text content to store and share. Max 500KB." },
        title: { type: "string", description: "Optional title displayed at the top of the paste page." },
        language: { type: "string", description: "Optional language hint for display (e.g. 'python', 'markdown', 'json')." },
        expiresInHours: { type: "number", description: "How many hours until the paste expires (default: 168 = 7 days, max: 720 = 30 days)." },
      },
      required: ["content"],
    },
  },
  {
    name: "save_memory",
    description:
      "Save any text under a named key so you can recall it later — across sessions and conversations. Works like a persistent notepad: give it a key (e.g. 'project-spec', 'user-prefs', 'meeting-notes') and it's retrievable any time with recall_memory. Keys are global and upserted — saving to the same key overwrites previous content. Expires in 30 days by default.",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string", description: "A short, memorable name for this memory (e.g. 'project-spec', 'todo-list'). Saving to the same key again overwrites it." },
        content: { type: "string", description: "The text to remember. Any format — prose, JSON, code, lists. Max 500KB." },
        expiresInDays: { type: "number", description: "How many days until this memory expires (default: 30, max: 90)." },
      },
      required: ["key", "content"],
    },
  },
  {
    name: "recall_memory",
    description:
      "Retrieve text you previously saved with save_memory. Pass the same key you used when saving. Returns the stored content plus when it was saved and when it expires. Returns an error if the key doesn't exist or has expired.",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string", description: "The key you used when calling save_memory." },
      },
      required: ["key"],
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
      "User-Agent": "Mozilla/5.0 (compatible; Toolora-MCP/1.0; +https://toolora.dev/api/mcp)",
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

async function handleExcelToJson(args: Record<string, unknown>): Promise<string> {
  const { fileBase64, filename } = args as { fileBase64?: string; filename?: string };
  if (!fileBase64 || typeof fileBase64 !== "string") throw new McpToolError("Missing 'fileBase64' field.");
  if (!filename || typeof filename !== "string") throw new McpToolError("Missing 'filename' field — needed for format detection.");

  const buffer = Buffer.from(fileBase64, "base64");
  const workbook = new ExcelJS.Workbook();
  const lower = filename.toLowerCase();

  if (lower.endsWith(".csv")) {
    const { Readable } = await import("stream");
    const readable = Readable.from(buffer.toString("utf-8"));
    await workbook.csv.read(readable);
  } else {
    await workbook.xlsx.load(Buffer.from(buffer));
  }

  const sheets: Record<string, unknown[]> = {};
  const sheetNames: string[] = [];
  let totalRows = 0;

  workbook.eachSheet((worksheet) => {
    const rows: Record<string, unknown>[] = [];
    let headers: (string | null)[] = [];

    worksheet.eachRow((row, rowNumber) => {
      const values = row.values as (ExcelJS.CellValue | undefined)[];
      if (rowNumber === 1) {
        headers = values.slice(1).map((v) => (v != null ? String(v) : null));
      } else {
        const rowData: Record<string, unknown> = {};
        headers.forEach((header, idx) => {
          if (header != null) rowData[header] = values[idx + 1] ?? null;
        });
        rows.push(rowData);
      }
    });

    sheets[worksheet.name] = rows;
    sheetNames.push(worksheet.name);
    totalRows += rows.length;
  });

  return JSON.stringify({ sheets, sheetNames, totalRows });
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

async function handleGeneratePdfFromText(args: Record<string, unknown>): Promise<string> {
  const { content, title, author } = args as { content?: string; title?: string; author?: string };
  if (!content || typeof content !== "string" || content.trim().length === 0) {
    throw new McpToolError("Missing required argument: content");
  }
  if (content.length > 200_000) throw new McpToolError("Content too large. Maximum 200,000 characters.");

  const { PDFDocument: PDoc, rgb, StandardFonts } = await import("pdf-lib");
  const doc = await PDoc.create();
  doc.setTitle(title ?? "Document");
  if (author) doc.setAuthor(author);
  doc.setCreator("Toolora MCP");
  doc.setCreationDate(new Date());

  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);

  const pageWidth = 595;
  const pageHeight = 842;
  const marginX = 60;
  const contentWidth = pageWidth - marginX * 2;

  let page = doc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - 60;

  const addPage = () => {
    page = doc.addPage([pageWidth, pageHeight]);
    y = pageHeight - 60;
  };

  const drawLine = (text: string, fontSize: number, font: typeof fontRegular, color = rgb(0, 0, 0), indent = 0) => {
    const maxWidth = contentWidth - indent;
    const words = text.split(" ");
    let line = "";
    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;
      const w = font.widthOfTextAtSize(testLine, fontSize);
      if (w > maxWidth && line) {
        if (y < 60) addPage();
        page.drawText(line, { x: marginX + indent, y, size: fontSize, font, color });
        y -= fontSize * 1.5;
        line = word;
      } else {
        line = testLine;
      }
    }
    if (line) {
      if (y < 60) addPage();
      page.drawText(line, { x: marginX + indent, y, size: fontSize, font, color });
      y -= fontSize * 1.5;
    }
  };

  if (title) {
    drawLine(title, 20, fontBold);
    y -= 10;
  }

  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trimEnd();
    if (line === "") { y -= 8; continue; }

    if (line.startsWith("### ")) {
      y -= 4;
      drawLine(line.slice(4), 13, fontBold);
    } else if (line.startsWith("## ")) {
      y -= 8;
      drawLine(line.slice(3), 15, fontBold);
      y -= 2;
    } else if (line.startsWith("# ")) {
      y -= 12;
      drawLine(line.slice(2), 18, fontBold);
      y -= 4;
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      drawLine(`• ${line.slice(2)}`, 11, fontRegular, rgb(0, 0, 0), 12);
    } else if (/^\d+\. /.test(line)) {
      drawLine(line, 11, fontRegular, rgb(0, 0, 0), 12);
    } else if (line.startsWith("> ")) {
      drawLine(line.slice(2), 11, fontRegular, rgb(0.3, 0.3, 0.3), 16);
    } else {
      drawLine(line.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1").replace(/`([^`]+)`/g, "$1"), 11, fontRegular);
    }
  }

  const pdfBytes = await doc.save();
  const base64 = Buffer.from(pdfBytes).toString("base64");
  return JSON.stringify({ pdf: base64, format: "pdf", pages: doc.getPageCount(), chars: content.length });
}

function handleMarkdownToHtml(args: Record<string, unknown>): string {
  const { markdown, title, includeStyles = true } = args as { markdown?: string; title?: string; includeStyles?: boolean };
  if (!markdown || typeof markdown !== "string" || markdown.trim().length === 0) {
    throw new McpToolError("Missing required argument: markdown");
  }

  const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const lines = markdown.split("\n");
  const htmlLines: string[] = [];
  let inCodeBlock = false;
  let inUl = false;
  let inOl = false;

  const closeList = () => {
    if (inUl) { htmlLines.push("</ul>"); inUl = false; }
    if (inOl) { htmlLines.push("</ol>"); inOl = false; }
  };

  const inlineFormat = (s: string) => {
    return escape(s)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  };

  for (const line of lines) {
    if (line.startsWith("```")) {
      if (inCodeBlock) { htmlLines.push("</code></pre>"); inCodeBlock = false; }
      else { closeList(); htmlLines.push("<pre><code>"); inCodeBlock = true; }
      continue;
    }
    if (inCodeBlock) { htmlLines.push(escape(line)); continue; }

    if (line.startsWith("# ")) { closeList(); htmlLines.push(`<h1>${inlineFormat(line.slice(2))}</h1>`); continue; }
    if (line.startsWith("## ")) { closeList(); htmlLines.push(`<h2>${inlineFormat(line.slice(3))}</h2>`); continue; }
    if (line.startsWith("### ")) { closeList(); htmlLines.push(`<h3>${inlineFormat(line.slice(4))}</h3>`); continue; }
    if (line.startsWith("#### ")) { closeList(); htmlLines.push(`<h4>${inlineFormat(line.slice(5))}</h4>`); continue; }
    if (/^---+$/.test(line.trim())) { closeList(); htmlLines.push("<hr>"); continue; }
    if (line.startsWith("> ")) { closeList(); htmlLines.push(`<blockquote><p>${inlineFormat(line.slice(2))}</p></blockquote>`); continue; }

    if (line.startsWith("- ") || line.startsWith("* ")) {
      if (inOl) { htmlLines.push("</ol>"); inOl = false; }
      if (!inUl) { htmlLines.push("<ul>"); inUl = true; }
      htmlLines.push(`<li>${inlineFormat(line.slice(2))}</li>`);
      continue;
    }
    const olMatch = line.match(/^\d+\. (.+)/);
    if (olMatch) {
      if (inUl) { htmlLines.push("</ul>"); inUl = false; }
      if (!inOl) { htmlLines.push("<ol>"); inOl = true; }
      htmlLines.push(`<li>${inlineFormat(olMatch[1])}</li>`);
      continue;
    }

    closeList();
    if (line.trim() === "") { htmlLines.push(""); continue; }
    htmlLines.push(`<p>${inlineFormat(line)}</p>`);
  }
  closeList();

  const pageTitle = title ?? "Document";
  const styles = includeStyles ? `
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1.5rem; color: #1a1a1a; line-height: 1.7; }
      h1, h2, h3, h4 { margin: 1.5rem 0 0.5rem; line-height: 1.3; }
      h1 { font-size: 2rem; } h2 { font-size: 1.5rem; } h3 { font-size: 1.25rem; }
      p { margin: 0.75rem 0; }
      code { background: #f4f4f5; padding: 0.15em 0.4em; border-radius: 4px; font-size: 0.875em; font-family: 'Fira Code', monospace; }
      pre { background: #f4f4f5; padding: 1rem; border-radius: 8px; overflow-x: auto; }
      pre code { background: none; padding: 0; }
      blockquote { border-left: 4px solid #e4e4e7; margin: 1rem 0; padding: 0.5rem 1rem; color: #52525b; }
      ul, ol { padding-left: 1.5rem; } li { margin: 0.25rem 0; }
      hr { border: none; border-top: 1px solid #e4e4e7; margin: 2rem 0; }
      a { color: #2563eb; }
      table { border-collapse: collapse; width: 100%; }
      th, td { border: 1px solid #e4e4e7; padding: 0.5rem 0.75rem; text-align: left; }
    </style>` : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escape(pageTitle)}</title>${styles}
</head>
<body>
${htmlLines.join("\n")}
</body>
</html>`;

  return JSON.stringify({ html, title: pageTitle, chars: html.length, lines: htmlLines.length });
}

async function handleCreateShareablePaste(args: Record<string, unknown>): Promise<string> {
  const { content, title, language, expiresInHours } = args as {
    content?: string; title?: string; language?: string; expiresInHours?: number;
  };
  if (!content || typeof content !== "string" || content.trim().length === 0) {
    throw new McpToolError("Missing required argument: content");
  }
  if (content.length > 500_000) throw new McpToolError("Content too large. Maximum 500KB.");

  const id = Array.from(crypto.getRandomValues(new Uint8Array(9)))
    .map((b) => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"[b % 62])
    .join("");

  const hours = typeof expiresInHours === "number" && expiresInHours > 0 ? Math.min(expiresInHours, 720) : 168;
  const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);

  await db.insert(pastesTable).values({
    id,
    content: content.trim(),
    title: title?.trim() || null,
    language: language?.trim() || null,
    expiresAt,
  });

  return JSON.stringify({
    id,
    url: `https://toolora.dev/p/${id}`,
    expiresAt: expiresAt.toISOString(),
    expiresInHours: hours,
    chars: content.length,
  });
}

async function handleSaveMemory(args: Record<string, unknown>): Promise<string> {
  const { key, content, expiresInDays } = args as { key?: string; content?: string; expiresInDays?: number };
  if (!key || typeof key !== "string" || key.trim().length === 0) throw new McpToolError("Missing required argument: key");
  if (!content || typeof content !== "string" || content.trim().length === 0) throw new McpToolError("Missing required argument: content");
  if (key.trim().length > 255) throw new McpToolError("key must be 255 characters or fewer.");
  if (content.length > 500_000) throw new McpToolError("content too large. Maximum 500KB.");

  const days = typeof expiresInDays === "number" && expiresInDays > 0 ? Math.min(expiresInDays, 90) : 30;
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  await db.insert(memoriesTable).values({
    key: key.trim(),
    content: content.trim(),
    expiresAt,
  }).onConflictDoUpdate({ target: memoriesTable.key, set: { content: content.trim(), expiresAt, createdAt: new Date() } });

  return JSON.stringify({
    key: key.trim(),
    saved: true,
    expiresAt: expiresAt.toISOString(),
    expiresInDays: days,
    tip: `Recall this later with: recall_memory({ key: "${key.trim()}" })`,
  });
}

async function handleRecallMemory(args: Record<string, unknown>): Promise<string> {
  const { key } = args as { key?: string };
  if (!key || typeof key !== "string" || key.trim().length === 0) throw new McpToolError("Missing required argument: key");

  const { eq, and, gt } = await import("drizzle-orm");
  const rows = await db
    .select()
    .from(memoriesTable)
    .where(and(eq(memoriesTable.key, key.trim()), gt(memoriesTable.expiresAt, new Date())))
    .limit(1);

  if (rows.length === 0) throw new McpToolError(`No memory found for key "${key.trim()}". It may not exist or may have expired.`);

  const row = rows[0];
  return JSON.stringify({
    key: row.key,
    content: row.content,
    savedAt: row.createdAt?.toISOString(),
    expiresAt: row.expiresAt.toISOString(),
  });
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
        db.insert(mcpCallsTable).values({ tool: "_connect", durationMs: 0, success: true }).catch(() => {});
        res.json(rpcOk(id, {
          protocolVersion: PROTOCOL_VERSION,
          serverInfo: { name: SERVER_NAME, version: SERVER_VERSION },
          capabilities: { tools: {}, resources: {} },
          instructions:
            "Toolora MCP server exposes browser-side tool functionality as server-side APIs. All tools are free to use. For high-volume or programmatic use, the direct HTTP Agent API at /api/agent supports x402 micropayments. Read the toolora://getting-started resource for a quick-start guide.",
        }));
        break;

      case "notifications/initialized":
        res.status(204).end();
        break;

      case "tools/list":
        db.insert(mcpCallsTable).values({ tool: "_list", durationMs: 0, success: true }).catch(() => {});
        res.json(rpcOk(id, { tools: TOOLS }));
        break;

      case "resources/list":
        res.json(rpcOk(id, {
          resources: [
            {
              uri: "toolora://getting-started",
              name: "Toolora Quick-Start Guide",
              description: "What Toolora can do, how to call each tool, and links to the Agent API and MCP Hub.",
              mimeType: "text/markdown",
            },
            {
              uri: "toolora://tools-list",
              name: "Available Tools",
              description: "Complete list of all 17 MCP tools with their input schemas.",
              mimeType: "application/json",
            },
          ],
        }));
        break;

      case "resources/read": {
        const { uri } = params as { uri?: string };
        if (uri === "toolora://getting-started") {
          res.json(rpcOk(id, {
            contents: [{
              uri,
              mimeType: "text/markdown",
              text: `# Toolora MCP Server — Quick-Start Guide

**17 free tools. No API key. No rate limits. Files never stored.**

## What you can do

| Tool | What it does |
|------|-------------|
| \`extract_pdf_text\` | Extract all text from a PDF (base64 input) |
| \`merge_pdfs\` | Combine 2–20 PDFs into one |
| \`ocr_image\` | Read text from any image (JPEG/PNG/WebP) |
| \`transcribe_audio\` | Transcribe MP3/WAV/M4A using Whisper |
| \`read_url\` | Fetch and extract clean text from any URL |
| \`scrape_url_js\` | Scrape JS-rendered pages (full browser render) |
| \`generate_qr_code\` | Create QR codes as base64 PNG |
| \`generate_pdf_from_text\` | Generate a styled PDF from plain text or Markdown |
| \`csv_to_json\` | Convert CSV → JSON array |
| \`json_to_csv\` | Convert JSON array → CSV |
| \`excel_to_json\` | Parse XLSX/XLS spreadsheets to JSON |
| \`extract_docx_text\` | Extract text from Word documents |
| \`markdown_to_html\` | Convert Markdown to clean HTML |
| \`count_words\` | Word, character, sentence, and paragraph counts |
| \`create_shareable_paste\` | Create a public shareable text snippet |
| \`save_memory\` | Persist a named value between sessions |
| \`recall_memory\` | Retrieve a previously saved memory |

## Endpoint

\`\`\`
https://api.toolora.dev/api/mcp
\`\`\`

## High-volume / Agent API

For programmatic or high-volume use, Toolora's HTTP Agent API supports **x402 micropayments** on Stellar and Solana — no subscription required.

Docs: https://toolora.dev/api-docs

## Privacy

Tools process files in memory only. Nothing is stored, logged, or retained beyond the request lifetime (except pastes/memories, which are explicit opt-in).

## More

- Website: https://toolora.dev
- MCP Hub (compare other servers): https://toolora.dev/mcp-hub
- Blog: https://toolora.dev/blog
`,
            }],
          }));
        } else if (uri === "toolora://tools-list") {
          res.json(rpcOk(id, {
            contents: [{
              uri,
              mimeType: "application/json",
              text: JSON.stringify({ tools: TOOLS }, null, 2),
            }],
          }));
        } else {
          res.json(rpcErr(id, -32002, `Resource not found: ${uri}`));
        }
        break;
      }

      case "tools/call": {
        const { name, arguments: args = {} } = params as { name?: string; arguments?: Record<string, unknown> };

        if (!name) {
          res.json(rpcErr(id, -32602, "Missing tool name"));
          return;
        }

        logger.info({ tool: name, sessionId: req.headers["mcp-session-id"] ?? null }, "[mcp] tool call");
        const _mcpStartMs = Date.now();
        let _mcpSuccess = true;
        let _mcpErrorMsg: string | undefined;

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
              text = await handleExcelToJson(args);
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
            case "generate_pdf_from_text":
              text = await handleGeneratePdfFromText(args);
              break;
            case "markdown_to_html":
              text = handleMarkdownToHtml(args);
              break;
            case "create_shareable_paste":
              text = await handleCreateShareablePaste(args);
              break;
            case "save_memory":
              text = await handleSaveMemory(args);
              break;
            case "recall_memory":
              text = await handleRecallMemory(args);
              break;
            default:
              res.json(rpcErr(id, -32602, `Unknown tool: ${name}`));
              return;
          }
          res.json(rpcOk(id, { content: [{ type: "text", text }] }));
        } catch (err: unknown) {
          _mcpSuccess = false;
          if (err instanceof McpToolError) {
            _mcpErrorMsg = err.message;
            res.json(rpcOk(id, {
              content: [{ type: "text", text: err.message }],
              isError: true,
            }));
          } else {
            const msg = err instanceof Error ? err.message : "Internal error";
            _mcpErrorMsg = msg;
            res.json(rpcOk(id, {
              content: [{ type: "text", text: `Tool execution failed: ${msg}` }],
              isError: true,
            }));
          }
        } finally {
          const durationMs = Date.now() - _mcpStartMs;
          logger.info({ tool: name, durationMs, success: _mcpSuccess, error: _mcpErrorMsg ?? null }, "[mcp] tool done");
          db.insert(mcpCallsTable).values({
            tool: name,
            durationMs,
            success: _mcpSuccess,
            errorMsg: _mcpErrorMsg ?? null,
          }).catch((err: unknown) => {
            logger.error({ err, tool: name }, "[mcp] Failed to record tool call in DB");
          });
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
            url: "https://api.toolora.dev/api/mcp",
            transport: "http",
          },
        },
      },
    },
  });
});

export default router;

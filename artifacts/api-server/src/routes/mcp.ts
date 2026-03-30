import { Router, type IRouter, type Request, type Response } from "express";
import { PDFDocument } from "pdf-lib";
import QRCode from "qrcode";

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

// ─── Error class ──────────────────────────────────────────────────────────────

class McpToolError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "McpToolError";
  }
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

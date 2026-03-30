import { Router, type IRouter, type Request, type Response } from "express";

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
        fileBase64: {
          type: "string",
          description: "The PDF file contents encoded as a base64 string.",
        },
        filename: {
          type: "string",
          description: "Optional original filename, used for validation only.",
        },
      },
      required: ["fileBase64"],
    },
  },
  {
    name: "count_words",
    description:
      "Count words, characters, sentences, and paragraphs in a block of text. Also returns estimated reading time. Useful for checking document stats, validating content length, or summarising text metrics.",
    inputSchema: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "The text to analyse.",
        },
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
        url: {
          type: "string",
          description: "The full URL to fetch (must be http:// or https://).",
        },
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

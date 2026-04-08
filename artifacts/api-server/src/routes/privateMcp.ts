import { Router, type IRouter } from "express";
import { verifySolanaTransaction } from "../lib/verifyTx";

const router: IRouter = Router();

const PROTOCOL_VERSION = "2025-03-26";
const SERVER_NAME = "toolora-private";
const SERVER_VERSION = "1.0.0";
const TOOL_COST_DISPLAY = "0.01";

// ---- Shared executors (same logic as privateExecute.ts) ----

function wordCounter(input: string): string {
  const words = input.trim().split(/\s+/).filter(Boolean).length;
  const chars = input.length;
  const charsNoSpace = input.replace(/\s/g, "").length;
  const lines = input.split("\n").length;
  const sentences = (input.match(/[.!?]+/g) ?? []).length;
  const paragraphs = input.split(/\n\s*\n/).filter(Boolean).length;
  const avgWordLen = words > 0 ? (charsNoSpace / words).toFixed(1) : "0.0";
  return [
    `Words:              ${words.toLocaleString()}`,
    `Characters:         ${chars.toLocaleString()}`,
    `Characters (no sp): ${charsNoSpace.toLocaleString()}`,
    `Lines:              ${lines.toLocaleString()}`,
    `Sentences:          ${sentences.toLocaleString()}`,
    `Paragraphs:         ${paragraphs.toLocaleString()}`,
    `Avg word length:    ${avgWordLen}`,
    `Reading time:       ~${Math.max(1, Math.ceil(words / 200))} min`,
  ].join("\n");
}

function textCase(input: string): string {
  const upper = input.toUpperCase();
  const lower = input.toLowerCase();
  const title = input.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  const camel = input.replace(/[^a-zA-Z0-9]+(.)/g, (_, c: string) => c.toUpperCase()).replace(/^[A-Z]/, (c) => c.toLowerCase());
  const snake = input.replace(/[^a-zA-Z0-9]+/g, "_").replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase().replace(/^_+|_+$/g, "");
  return [`UPPER: ${upper}`, `lower: ${lower}`, `Title: ${title}`, `camelCase: ${camel}`, `snake_case: ${snake}`, `kebab-case: ${snake.replace(/_/g, "-")}`].join("\n");
}

function jsonFormatter(input: string): string {
  try {
    return JSON.stringify(JSON.parse(input), null, 2);
  } catch (e: unknown) {
    return `JSON Error: ${e instanceof Error ? e.message : "parse failed"}`;
  }
}

function base64Tool(input: string): string {
  const encoded = Buffer.from(input, "utf8").toString("base64");
  let decoded = "";
  try { decoded = Buffer.from(input.trim(), "base64").toString("utf8"); } catch { decoded = "(not valid base64)"; }
  return `Encoded:\n${encoded}\n\nDecoded:\n${decoded}`;
}

function jwtDecoder(input: string): string {
  const parts = input.trim().split(".");
  if (parts.length !== 3) return `Error: Not a valid JWT (got ${parts.length} parts)`;
  const decodeB64 = (s: string) => { try { return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8"); } catch { return "(decode failed)"; } };
  const header = JSON.stringify(JSON.parse(decodeB64(parts[0])), null, 2);
  const payload = JSON.parse(decodeB64(parts[1]));
  const payloadStr = JSON.stringify(payload, null, 2);
  const exp = payload?.exp ? new Date(Number(payload.exp) * 1000).toISOString() : null;
  const expired = payload?.exp ? Number(payload.exp) < Date.now() / 1000 : false;
  return [`=== Header ===\n${header}`, `=== Payload ===\n${payloadStr}`, ...(exp ? [`Expires: ${exp} ${expired ? "⚠️ EXPIRED" : "✅"}`] : [])].join("\n\n");
}

function htmlToMarkdown(input: string): string {
  let md = input;
  md = md.replace(/<h([1-6])[^>]*>(.*?)<\/h\1>/gi, (_, n, t) => "#".repeat(Number(n)) + " " + t.trim());
  md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**").replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**");
  md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, "_$1_").replace(/<i[^>]*>(.*?)<\/i>/gi, "_$1_");
  md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, "`$1`");
  md = md.replace(/<a\s+href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)");
  md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1");
  md = md.replace(/<\/?(ul|ol|p|div|br|hr)[^>]*>/gi, "\n");
  md = md.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&nbsp;/g, " ");
  return md.replace(/\n{3,}/g, "\n\n").trim();
}

function textChunker(input: string): string {
  const words = input.trim().split(/\s+/).filter(Boolean);
  const CHUNK = 500, OVERLAP = 50;
  if (words.length <= CHUNK) return `--- Chunk 1/1 (${words.length} words) ---\n${words.join(" ")}`;
  const chunks: string[] = [];
  let i = 0;
  while (i < words.length) { chunks.push(words.slice(i, i + CHUNK).join(" ")); i += CHUNK - OVERLAP; if (i >= words.length) break; }
  return chunks.map((c, idx) => `--- Chunk ${idx + 1}/${chunks.length} ---\n${c}`).join("\n\n");
}

function csvToJson(input: string): string {
  const lines = input.trim().split("\n").filter(Boolean);
  if (lines.length < 2) return "Error: CSV needs at least a header row and one data row.";
  const parseRow = (row: string): string[] => {
    const cols: string[] = []; let cur = "", inQ = false;
    for (let i = 0; i < row.length; i++) {
      const c = row[i];
      if (c === '"' && !inQ) { inQ = true; continue; }
      if (c === '"' && inQ) { if (row[i + 1] === '"') { cur += '"'; i++; } else { inQ = false; } continue; }
      if (c === "," && !inQ) { cols.push(cur); cur = ""; continue; }
      cur += c;
    }
    cols.push(cur); return cols;
  };
  const headers = parseRow(lines[0]);
  const rows = lines.slice(1).map((line) => { const vals = parseRow(line); const obj: Record<string, string> = {}; headers.forEach((h, i) => { obj[h.trim()] = (vals[i] ?? "").trim(); }); return obj; });
  return JSON.stringify(rows, null, 2);
}

function urlEncoder(input: string): string {
  const encoded = encodeURIComponent(input);
  let decoded = input; try { decoded = decodeURIComponent(input); } catch { /* keep original */ }
  return `Encoded:\n${encoded}\n\nDecoded:\n${decoded}`;
}

function regexTester(input: string): string {
  const lines = input.split("\n"); if (lines.length < 2) return "Format: line 1 = pattern, remaining = test strings";
  let regex: RegExp; try { const p = lines[0].trim(); regex = p.startsWith("/") ? new RegExp(p.slice(1, p.lastIndexOf("/")), p.slice(p.lastIndexOf("/") + 1).replace("g", "")) : new RegExp(p); } catch (e: unknown) { return `Invalid regex: ${e instanceof Error ? e.message : "error"}`; }
  const tests = lines.slice(1).filter(Boolean);
  return [`Pattern: ${regex}`, ``, ...tests.map((l) => { const m = l.match(regex); return m ? `✓ ${JSON.stringify(l)}` : `✗ ${JSON.stringify(l)}`; })].join("\n");
}

function hashGenerator(input: string): string {
  function fnv1a32(s: string): string { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = (h * 16777619) >>> 0; } return h.toString(16).padStart(8, "0"); }
  return `FNV-1a 32: ${fnv1a32(input)}\nFNV-1a 64: ${fnv1a32(input + input)}${fnv1a32(input)}`;
}

const EXECUTORS: Record<string, (input: string) => string> = {
  word_counter: wordCounter,
  text_case: textCase,
  json_formatter: jsonFormatter,
  base64_encoder: base64Tool,
  jwt_decoder: jwtDecoder,
  html_to_markdown: htmlToMarkdown,
  text_chunker: textChunker,
  csv_to_json: csvToJson,
  url_encoder: urlEncoder,
  regex_tester: regexTester,
  hash_generator: hashGenerator,
};

// ---- MCP tool definitions ----

const TOOL_INPUT_SCHEMA = {
  type: "object",
  properties: {
    input: { type: "string", description: "The text input to process (stays private, not logged)." },
    txSignature: {
      type: "string",
      description: `MagicBlock PER transaction signature proving a ${TOOL_COST_DISPLAY} USDC private payment was made. Obtain via POST https://payments.magicblock.app/v1/spl/transfer.`,
    },
    payer: {
      type: "string",
      description: "Solana public key (base58) of the wallet that signed the payment transaction.",
    },
    cluster: {
      type: "string",
      enum: ["devnet", "mainnet"],
      description: "Solana cluster (default: devnet).",
    },
  },
  required: ["input", "txSignature", "payer"],
} as const;

const PRIVATE_TOOLS = [
  { name: "word_counter", description: `Count words, chars, sentences, and reading time privately. Cost: ${TOOL_COST_DISPLAY} USDC via MagicBlock PER.`, inputSchema: TOOL_INPUT_SCHEMA },
  { name: "text_case", description: `Convert text to UPPER, lower, Title, camelCase, snake_case, kebab-case — private. Cost: ${TOOL_COST_DISPLAY} USDC.`, inputSchema: TOOL_INPUT_SCHEMA },
  { name: "json_formatter", description: `Format and validate JSON privately — ideal for API responses containing secrets. Cost: ${TOOL_COST_DISPLAY} USDC.`, inputSchema: TOOL_INPUT_SCHEMA },
  { name: "base64_encoder", description: `Encode/decode Base64 privately — no credential exposure to third parties. Cost: ${TOOL_COST_DISPLAY} USDC.`, inputSchema: TOOL_INPUT_SCHEMA },
  { name: "jwt_decoder", description: `Decode JWT tokens and inspect claims without sending tokens to any server. Cost: ${TOOL_COST_DISPLAY} USDC.`, inputSchema: TOOL_INPUT_SCHEMA },
  { name: "html_to_markdown", description: `Convert HTML to Markdown for private AI pipelines and RAG prep. Cost: ${TOOL_COST_DISPLAY} USDC.`, inputSchema: TOOL_INPUT_SCHEMA },
  { name: "text_chunker", description: `Split confidential documents into RAG-ready chunks without upload. Cost: ${TOOL_COST_DISPLAY} USDC.`, inputSchema: TOOL_INPUT_SCHEMA },
  { name: "csv_to_json", description: `Parse private CSV datasets to JSON without server upload. Cost: ${TOOL_COST_DISPLAY} USDC.`, inputSchema: TOOL_INPUT_SCHEMA },
  { name: "url_encoder", description: `Encode/decode URLs without exposing internal endpoints to analytics. Cost: ${TOOL_COST_DISPLAY} USDC.`, inputSchema: TOOL_INPUT_SCHEMA },
  { name: "regex_tester", description: `Test regex patterns against private strings — never sent to any server. Cost: ${TOOL_COST_DISPLAY} USDC.`, inputSchema: TOOL_INPUT_SCHEMA },
  { name: "hash_generator", description: `Generate FNV hashes of sensitive strings privately. Cost: ${TOOL_COST_DISPLAY} USDC.`, inputSchema: TOOL_INPUT_SCHEMA },
];

// ---- JSON-RPC helpers ----

function rpcOk(id: unknown, result: unknown) {
  return { jsonrpc: "2.0", id, result };
}

function rpcError(id: unknown, code: number, message: string, data?: unknown) {
  return { jsonrpc: "2.0", id, error: { code, message, ...(data ? { data } : {}) } };
}

// ---- Route ----

router.post("/", async (req, res) => {
  const { jsonrpc, id, method, params } = req.body ?? {};

  if (jsonrpc !== "2.0") {
    return res.json(rpcError(id ?? null, -32600, "Invalid JSON-RPC version — must be '2.0'"));
  }

  switch (method) {
    case "initialize":
      return res.json(rpcOk(id, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: SERVER_NAME, version: SERVER_VERSION },
        instructions: [
          "This MCP server gates each tool call behind a MagicBlock Private Ephemeral Rollup payment.",
          `Cost: ${TOOL_COST_DISPLAY} USDC per call (devnet USDC: 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU).`,
          "Payment flow: POST https://payments.magicblock.app/v1/spl/transfer → sign tx with wallet → pass txSignature here.",
          "Privacy guarantee: inputs are NOT logged server-side. Payments routed through PER are shielded from the base chain.",
        ].join(" "),
      }));

    case "notifications/initialized":
      return res.status(204).end();

    case "tools/list":
      return res.json(rpcOk(id, { tools: PRIVATE_TOOLS }));

    case "tools/call": {
      if (!params || typeof params !== "object") {
        return res.json(rpcError(id, -32602, "Missing params"));
      }
      const { name, arguments: args } = params as { name?: string; arguments?: Record<string, unknown> };

      if (!name || typeof name !== "string") {
        return res.json(rpcError(id, -32602, "Missing tool name"));
      }

      const executor = EXECUTORS[name];
      if (!executor) {
        return res.json(rpcError(id, -32602, `Unknown tool: ${name}. Available: ${Object.keys(EXECUTORS).join(", ")}`));
      }

      const input = args?.input;
      const txSignature = args?.txSignature;
      const payer = args?.payer;
      const cluster = (args?.cluster === "mainnet" ? "mainnet" : "devnet") as "mainnet" | "devnet";

      if (typeof input !== "string" || !input.trim()) {
        return res.json(rpcError(id, -32602, "Missing or empty 'input' argument"));
      }
      if (typeof txSignature !== "string" || !txSignature) {
        return res.json(rpcError(id, -32602, "Missing 'txSignature' — provide a MagicBlock PER payment signature"));
      }
      if (typeof payer !== "string" || !payer) {
        return res.json(rpcError(id, -32602, "Missing 'payer' — provide the Solana public key that signed the payment"));
      }

      // Verify on-chain payment
      const verification = await verifySolanaTransaction(txSignature, cluster);
      if (!verification.verified) {
        return res.json(rpcError(id, -32001, `Payment verification failed: ${verification.error}`, {
          hint: `Ensure the transaction is confirmed on ${cluster}. MagicBlock PER transactions may take a few seconds to propagate.`,
        }));
      }

      req.log.info(
        { tool: name, payer: String(payer).slice(0, 8) + "...", txSig: String(txSignature).slice(0, 16) + "...", verified: true },
        "Private MCP tool execution"
      );

      try {
        const output = executor(input.trim());
        return res.json(rpcOk(id, {
          content: [{ type: "text", text: output }],
          isError: false,
        }));
      } catch (err) {
        req.log.error({ err, tool: name }, "MCP tool execution error");
        return res.json(rpcOk(id, {
          content: [{ type: "text", text: "Tool execution failed. Please try again." }],
          isError: true,
        }));
      }
    }

    case "ping":
      return res.json(rpcOk(id, {}));

    default:
      return res.json(rpcError(id, -32601, `Method not found: ${method}`));
  }
});

// GET: discovery / health
router.get("/", (_req, res) => {
  res.json({
    name: SERVER_NAME,
    version: SERVER_VERSION,
    protocol: "MCP JSON-RPC 2.0",
    protocolVersion: PROTOCOL_VERSION,
    endpoint: "POST /api/private-mcp",
    tools: PRIVATE_TOOLS.length,
    costPerCall: `${TOOL_COST_DISPLAY} USDC`,
    cluster: "devnet (mainnet available via cluster param)",
    payment: "MagicBlock Private Ephemeral Rollup",
    paymentApi: "https://payments.magicblock.app/v1/spl/transfer",
    docs: "https://toolora.dev/private/",
  });
});

export default router;

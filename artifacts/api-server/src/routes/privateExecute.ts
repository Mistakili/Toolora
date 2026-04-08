import { Router, type IRouter } from "express";
import { verifySolanaTransaction } from "../lib/verifyTx";

const router: IRouter = Router();

interface ExecuteBody {
  tool: string;
  input: string;
  txSignature: string;
  payer: string;
  cluster?: "mainnet" | "devnet";
}

function parseBody(raw: unknown): ExecuteBody | null {
  if (!raw || typeof raw !== "object") return null;
  const b = raw as Record<string, unknown>;
  if (typeof b.tool !== "string" || !b.tool || b.tool.length > 64) return null;
  if (typeof b.input !== "string" || !b.input || b.input.length > 100_000) return null;
  if (typeof b.txSignature !== "string" || !b.txSignature) return null;
  // payer can be a Solana pubkey (32-44 base58 chars) or "DEMO_MODE" / "Demo1..."
  if (typeof b.payer !== "string" || !b.payer || b.payer.length > 44) return null;
  const cluster = b.cluster === "mainnet" ? "mainnet" : "devnet";
  return { tool: b.tool, input: b.input, txSignature: b.txSignature, payer: b.payer, cluster };
}

// ---- tool executors ----

function wordCounter(input: string): string {
  const words = input.trim().split(/\s+/).filter(Boolean).length;
  const chars = input.length;
  const charsNoSpace = input.replace(/\s/g, "").length;
  const lines = input.split("\n").length;
  const sentences = (input.match(/[.!?]+/g) ?? []).length;
  const paragraphs = input.split(/\n\s*\n/).filter(Boolean).length;
  const avgWordLen = words > 0 ? (charsNoSpace / words).toFixed(1) : "0.0";
  const readTime = Math.max(1, Math.ceil(words / 200));
  return [
    `Words:              ${words.toLocaleString()}`,
    `Characters:         ${chars.toLocaleString()}`,
    `Characters (no sp): ${charsNoSpace.toLocaleString()}`,
    `Lines:              ${lines.toLocaleString()}`,
    `Sentences:          ${sentences.toLocaleString()}`,
    `Paragraphs:         ${paragraphs.toLocaleString()}`,
    `Avg word length:    ${avgWordLen}`,
    `Reading time:       ~${readTime} min`,
  ].join("\n");
}

function textCase(input: string): string {
  const upper = input.toUpperCase();
  const lower = input.toLowerCase();
  const title = input.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  const camel = input
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, c: string) => c.toUpperCase())
    .replace(/^[A-Z]/, (c) => c.toLowerCase());
  const snake = input
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .toLowerCase()
    .replace(/^_+|_+$/g, "");
  const kebab = snake.replace(/_/g, "-");
  return [
    "=== UPPER CASE ===",
    upper,
    "",
    "=== lower case ===",
    lower,
    "",
    "=== Title Case ===",
    title,
    "",
    "=== camelCase ===",
    camel,
    "",
    "=== snake_case ===",
    snake,
    "",
    "=== kebab-case ===",
    kebab,
  ].join("\n");
}

function jsonFormatter(input: string): string {
  try {
    const parsed = JSON.parse(input);
    const pretty = JSON.stringify(parsed, null, 2);
    const lines = pretty.split("\n").length;
    const keys = (JSON.stringify(parsed).match(/"[^"]+"\s*:/g) ?? []).length;
    return `// ${lines} lines · ${keys} keys\n${pretty}`;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Parse error";
    return `// JSON Parse Error: ${msg}\n\n// Your input:\n${input}`;
  }
}

function base64Encode(input: string): string {
  const isBase64 = /^[A-Za-z0-9+/]*={0,2}$/.test(input.trim()) && input.trim().length % 4 === 0;
  if (isBase64 && input.trim().length > 0) {
    try {
      const decoded = Buffer.from(input.trim(), "base64").toString("utf8");
      return `=== Decoded (from Base64) ===\n${decoded}\n\n=== Re-encoded ===\n${Buffer.from(decoded).toString("base64")}`;
    } catch {
      // fall through to encode
    }
  }
  const encoded = Buffer.from(input, "utf8").toString("base64");
  const urlSafe = encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return `=== Base64 (standard) ===\n${encoded}\n\n=== Base64 (URL-safe) ===\n${urlSafe}\n\n=== Original: ${input.length} chars → Encoded: ${encoded.length} chars`;
}

function htmlToMarkdown(input: string): string {
  let md = input;
  md = md.replace(/<h([1-6])[^>]*>(.*?)<\/h\1>/gi, (_, n, t) => "#".repeat(Number(n)) + " " + t.trim());
  md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**");
  md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**");
  md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, "_$1_");
  md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, "_$1_");
  md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, "`$1`");
  md = md.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, "```\n$1\n```");
  md = md.replace(/<a\s+href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)");
  md = md.replace(/<img\s+[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, "![$2]($1)");
  md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1");
  md = md.replace(/<\/?(ul|ol|p|div|br|hr|tr|table|thead|tbody|td|th)[^>]*>/gi, "\n");
  md = md.replace(/<[^>]+>/g, "");
  md = md.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
  md = md.replace(/\n{3,}/g, "\n\n").trim();
  return md || "(empty — no meaningful HTML found)";
}

function textChunker(input: string): string {
  const CHUNK_SIZE = 500;
  const OVERLAP = 50;
  const words = input.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "(empty input)";
  if (words.length <= CHUNK_SIZE) {
    return `--- Chunk 1/1 (${words.length} words) ---\n${words.join(" ")}`;
  }
  const chunks: string[] = [];
  let i = 0;
  while (i < words.length) {
    const chunk = words.slice(i, i + CHUNK_SIZE).join(" ");
    chunks.push(chunk);
    i += CHUNK_SIZE - OVERLAP;
    if (i >= words.length) break;
  }
  return chunks
    .map((c, idx) => `--- Chunk ${idx + 1}/${chunks.length} (${c.split(/\s+/).length} words) ---\n${c}`)
    .join("\n\n");
}

function urlEncoder(input: string): string {
  const encoded = encodeURIComponent(input);
  let decoded = input;
  try { decoded = decodeURIComponent(input); } catch { /* keep original */ }
  const isAlreadyEncoded = input.includes("%");
  return [
    `=== ${isAlreadyEncoded ? "Decoded" : "Encoded"} ===`,
    isAlreadyEncoded ? decoded : encoded,
    "",
    `=== ${isAlreadyEncoded ? "Re-encoded" : "Original"} ===`,
    isAlreadyEncoded ? encoded : input,
  ].join("\n");
}

function hashGenerator(input: string): string {
  function fnv1a32(s: string): string {
    let hash = 2166136261;
    for (let i = 0; i < s.length; i++) {
      hash ^= s.charCodeAt(i);
      hash = (hash * 16777619) >>> 0;
    }
    return hash.toString(16).padStart(8, "0");
  }
  function djb2(s: string): string {
    let hash = 5381;
    for (let i = 0; i < s.length; i++) {
      hash = ((hash * 33) ^ s.charCodeAt(i)) >>> 0;
    }
    return hash.toString(16).padStart(8, "0");
  }
  const h32 = fnv1a32(input);
  const h64 = fnv1a32(input + input) + h32;
  const dj = djb2(input);
  return [
    `FNV-1a 32-bit:  ${h32}`,
    `FNV-1a 64-bit:  ${h64}`,
    `DJB2 32-bit:    ${dj}`,
    "",
    "Note: Use Node crypto (SHA-256/SHA-512) for production cryptographic hashing.",
  ].join("\n");
}

function jwtDecoder(input: string): string {
  const token = input.trim();
  const parts = token.split(".");
  if (parts.length !== 3) {
    return `Error: Not a valid JWT (expected 3 parts separated by '.', got ${parts.length})`;
  }
  function decodeB64(s: string): string {
    try {
      const padded = s.replace(/-/g, "+").replace(/_/g, "/").padEnd(s.length + (4 - (s.length % 4)) % 4, "=");
      return Buffer.from(padded, "base64").toString("utf8");
    } catch {
      return "(could not decode)";
    }
  }
  const headerRaw = decodeB64(parts[0]);
  const payloadRaw = decodeB64(parts[1]);
  let header: unknown, payload: unknown;
  try { header = JSON.parse(headerRaw); } catch { header = headerRaw; }
  try { payload = JSON.parse(payloadRaw); } catch { payload = payloadRaw; }
  const payloadObj = payload && typeof payload === "object" ? payload as Record<string, unknown> : null;
  const iat = payloadObj?.iat ? new Date(Number(payloadObj.iat) * 1000).toISOString() : null;
  const exp = payloadObj?.exp ? new Date(Number(payloadObj.exp) * 1000).toISOString() : null;
  const expired = payloadObj?.exp ? Number(payloadObj.exp) < Date.now() / 1000 : false;
  return [
    "=== Header ===",
    JSON.stringify(header, null, 2),
    "",
    "=== Payload ===",
    JSON.stringify(payload, null, 2),
    "",
    "=== Signature ===",
    `[not verified — ${parts[2].slice(0, 20)}...]`,
    "",
    ...(iat ? [`Issued at:  ${iat}`] : []),
    ...(exp ? [`Expires at: ${exp} ${expired ? "⚠️ EXPIRED" : "✅ valid"}`] : []),
  ].join("\n");
}

function csvToJson(input: string): string {
  const lines = input.trim().split("\n").filter(Boolean);
  if (lines.length < 2) {
    return "Error: CSV needs at least a header row and one data row.";
  }
  function parseRow(row: string): string[] {
    const cols: string[] = [];
    let cur = "", inQuote = false;
    for (let i = 0; i < row.length; i++) {
      const c = row[i];
      if (c === '"' && !inQuote) { inQuote = true; continue; }
      if (c === '"' && inQuote) {
        if (row[i + 1] === '"') { cur += '"'; i++; } else { inQuote = false; }
        continue;
      }
      if (c === "," && !inQuote) { cols.push(cur); cur = ""; continue; }
      cur += c;
    }
    cols.push(cur);
    return cols;
  }
  const headers = parseRow(lines[0]);
  const rows = lines.slice(1).map((line) => {
    const vals = parseRow(line);
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h.trim()] = (vals[i] ?? "").trim(); });
    return obj;
  });
  const json = JSON.stringify(rows, null, 2);
  return `// ${rows.length} row${rows.length !== 1 ? "s" : ""} · ${headers.length} column${headers.length !== 1 ? "s" : ""}\n${json}`;
}

function regexTester(input: string): string {
  const lines = input.split("\n");
  if (lines.length < 2) {
    return [
      "Format: First line = regex (e.g. /pattern/flags or plain pattern), remaining lines = test strings",
      "",
      "Example:",
      "/^\\d{4}-\\d{2}-\\d{2}$/",
      "2024-01-15",
      "not-a-date",
    ].join("\n");
  }
  const patternLine = lines[0].trim();
  const testLines = lines.slice(1).filter(Boolean);
  let regex: RegExp;
  try {
    if (patternLine.startsWith("/")) {
      const lastSlash = patternLine.lastIndexOf("/");
      const pat = patternLine.slice(1, lastSlash);
      const flags = patternLine.slice(lastSlash + 1).replace("g", "");
      regex = new RegExp(pat, flags);
    } else {
      regex = new RegExp(patternLine);
    }
  } catch (e: unknown) {
    return `Error: Invalid regex — ${e instanceof Error ? e.message : "unknown error"}`;
  }
  const results = testLines.map((line) => {
    const matches = line.match(regex);
    if (!matches) return `✗  ${JSON.stringify(line)}  — no match`;
    if (matches.length === 1 && matches[0] === line) return `✓  ${JSON.stringify(line)}  — full match`;
    return `✓  ${JSON.stringify(line)}  — matches: ${matches.map((m) => JSON.stringify(m)).join(", ")}`;
  });
  const pass = results.filter((r) => r.startsWith("✓")).length;
  return [`Pattern: ${regex.toString()}`, `Results: ${pass}/${testLines.length} matched`, "", ...results].join("\n");
}

const EXECUTORS: Record<string, (input: string) => string> = {
  "word-counter": wordCounter,
  "text-case": textCase,
  "json-formatter": jsonFormatter,
  "base64": base64Encode,
  "jwt-decoder": jwtDecoder,
  "html-to-markdown": htmlToMarkdown,
  "text-chunker": textChunker,
  "csv-to-json": csvToJson,
  "url-encoder": urlEncoder,
  "regex-tester": regexTester,
  "hash-generator": hashGenerator,
};

router.post("/", async (req, res) => {
  const body = parseBody(req.body);
  if (!body) {
    res.status(422).json({ error: "Invalid request: missing or malformed fields" });
    return;
  }

  const { tool, input, txSignature, payer } = body;

  const executor = EXECUTORS[tool];
  if (!executor) {
    res.status(400).json({ error: `Unknown tool: ${tool}. Available: ${Object.keys(EXECUTORS).join(", ")}` });
    return;
  }

  const { cluster } = body;
  const payerDisplay = payer.length > 8 ? payer.slice(0, 8) + "..." : payer;
  const sigDisplay = txSignature.length > 16 ? txSignature.slice(0, 16) + "..." : txSignature;

  // Verify payment on-chain before executing
  const verification = await verifySolanaTransaction(txSignature, cluster);
  if (!verification.verified) {
    req.log.warn({ tool, sig: sigDisplay, cluster, error: verification.error }, "Payment verification failed");
    res.status(402).json({
      error: "Payment verification failed",
      detail: verification.error,
      hint: "Ensure the transaction is confirmed on-chain. Demo signatures must start with 'demo_'.",
    });
    return;
  }

  req.log.info({ tool, payer: payerDisplay, sig: sigDisplay, verified: true, source: verification.source }, "Private tool execution");

  try {
    const output = executor(input);
    res.json({
      success: true,
      tool,
      output,
      txSignature,
      executedAt: new Date().toISOString(),
    });
  } catch (err) {
    req.log.error({ err, tool }, "Tool execution error");
    res.status(500).json({ error: "Tool execution failed" });
  }
});

export default router;

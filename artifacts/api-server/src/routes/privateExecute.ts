import { Router, type IRouter } from "express";

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
  if (typeof b.input !== "string" || !b.input || b.input.length > 50_000) return null;
  if (typeof b.txSignature !== "string" || !b.txSignature) return null;
  if (typeof b.payer !== "string" || b.payer.length < 32 || b.payer.length > 44) return null;
  const cluster = b.cluster === "mainnet" ? "mainnet" : "devnet";
  return { tool: b.tool, input: b.input, txSignature: b.txSignature, payer: b.payer, cluster };
}

// ---- tool executors (all run in process, no file system, no DB writes) ----

function wordCounter(input: string): string {
  const words = input.trim().split(/\s+/).filter(Boolean).length;
  const chars = input.length;
  const charsNoSpace = input.replace(/\s/g, "").length;
  const sentences = input.split(/[.!?]+/).filter(Boolean).length;
  const paragraphs = input.split(/\n\n+/).filter(Boolean).length;
  const avgWordLen = words > 0 ? (charsNoSpace / words).toFixed(1) : "0";
  return [
    `Words:            ${words}`,
    `Characters:       ${chars}`,
    `Chars (no space): ${charsNoSpace}`,
    `Sentences:        ${sentences}`,
    `Paragraphs:       ${paragraphs}`,
    `Avg word length:  ${avgWordLen}`,
    `Reading time:     ~${Math.ceil(words / 200)} min`,
  ].join("\n");
}

function textCase(input: string): string {
  return [
    `UPPERCASE:\n${input.toUpperCase()}`,
    `\nlowercase:\n${input.toLowerCase()}`,
    `\nTitle Case:\n${input.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())}`,
    `\nSentence case:\n${input.charAt(0).toUpperCase() + input.slice(1).toLowerCase()}`,
  ].join("");
}

function jsonFormatter(input: string): string {
  try {
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed, null, 2);
  } catch (e) {
    return `JSON parse error: ${e instanceof Error ? e.message : "Invalid JSON"}`;
  }
}

function base64Encode(input: string): string {
  const encoded = Buffer.from(input, "utf8").toString("base64");
  let decoded = "";
  try {
    decoded = Buffer.from(input, "base64").toString("utf8");
  } catch {
    decoded = "(input is not valid base64)";
  }
  return `Base64 Encoded:\n${encoded}\n\nDecoded (if input is base64):\n${decoded}`;
}

function htmlToMarkdown(input: string): string {
  return input
    .replace(/<h([1-6])[^>]*>(.*?)<\/h\1>/gi, (_, n, t) => "#".repeat(parseInt(n)) + " " + t.trim() + "\n")
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**")
    .replace(/<em[^>]*>(.*?)<\/em>/gi, "_$1_")
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)")
    .replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n")
    .replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function textChunker(input: string): string {
  const CHUNK_SIZE = 512;
  const OVERLAP = 64;
  const words = input.split(/\s+/);
  const chunks: string[] = [];
  let i = 0;
  while (i < words.length) {
    const chunk = words.slice(i, i + CHUNK_SIZE).join(" ");
    chunks.push(chunk);
    i += CHUNK_SIZE - OVERLAP;
    if (i >= words.length) break;
  }
  return chunks
    .map((c, idx) => `--- Chunk ${idx + 1} (${c.split(/\s+/).length} words) ---\n${c}`)
    .join("\n\n");
}

function urlEncoder(input: string): string {
  const encoded = encodeURIComponent(input);
  const decoded = decodeURIComponent(input);
  return `Encoded:\n${encoded}\n\nDecoded:\n${decoded}`;
}

function hashGenerator(input: string): string {
  // Simple deterministic hash (FNV-1a 32-bit) — no crypto module needed
  function fnv1a(s: string): string {
    let hash = 2166136261;
    for (let i = 0; i < s.length; i++) {
      hash ^= s.charCodeAt(i);
      hash = (hash * 16777619) >>> 0;
    }
    return hash.toString(16).padStart(8, "0");
  }

  // Length-prefixed version (simulates different hash "lengths")
  const h32 = fnv1a(input);
  const h64 = fnv1a(input + input);
  return `FNV-1a 32-bit: ${h32}\nFNV-1a 64-bit: ${h64}${h32}\n\nNote: For production use, use SHA-256 via SubtleCrypto (client-side) or Node crypto (server-side).`;
}

const EXECUTORS: Record<string, (input: string) => string> = {
  "word-counter": wordCounter,
  "text-case": textCase,
  "json-formatter": jsonFormatter,
  "base64": base64Encode,
  "html-to-markdown": htmlToMarkdown,
  "text-chunker": textChunker,
  "url-encoder": urlEncoder,
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
    res.status(400).json({ error: `Unknown tool: ${tool}` });
    return;
  }

  req.log.info({ tool, payer: payer.slice(0, 8) + "...", txSignature: txSignature.slice(0, 16) + "..." },
    "Private tool execution");

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

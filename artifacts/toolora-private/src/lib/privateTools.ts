export interface PrivateTool {
  slug: string;
  name: string;
  description: string;
  category: "text" | "developer" | "ai" | "productivity";
  icon: string;
  inputLabel: string;
  inputPlaceholder: string;
  outputLabel: string;
  clientExecute: (input: string) => string;
}

function wordCounter(input: string): string {
  const words = input.trim().split(/\s+/).filter(Boolean).length;
  const chars = input.length;
  const charsNoSpaces = input.replace(/\s/g, "").length;
  const lines = input.split("\n").length;
  const sentences = (input.match(/[.!?]+/g) ?? []).length;
  const paragraphs = input.split(/\n\s*\n/).filter(Boolean).length;
  const avgWordLen = words > 0
    ? (charsNoSpaces / words).toFixed(1)
    : "0.0";
  const readTime = Math.max(1, Math.ceil(words / 200));
  return [
    `Words:              ${words.toLocaleString()}`,
    `Characters:         ${chars.toLocaleString()}`,
    `Characters (no sp): ${charsNoSpaces.toLocaleString()}`,
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
    const keys = JSON.stringify(parsed).match(/"[^"]+"\s*:/g)?.length ?? 0;
    return `// ${lines} lines · ${keys} keys\n${pretty}`;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Parse error";
    return `// JSON Parse Error: ${msg}\n\n// Your input:\n${input}`;
  }
}

function base64Tool(input: string): string {
  const isBase64 = /^[A-Za-z0-9+/]*={0,2}$/.test(input.trim()) && input.trim().length % 4 === 0;
  if (isBase64 && input.trim().length > 0) {
    try {
      const decoded = atob(input.trim());
      return `=== Decoded (from Base64) ===\n${decoded}\n\n=== Re-encoded ===\n${btoa(decoded)}`;
    } catch {
      // fall through to encode
    }
  }
  const encoded = btoa(unescape(encodeURIComponent(input)));
  const urlSafe = encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return `=== Base64 (standard) ===\n${encoded}\n\n=== Base64 (URL-safe) ===\n${urlSafe}\n\n=== Original length: ${input.length} → Encoded: ${encoded.length}`;
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
  return md || "(empty — no meaningful HTML content found)";
}

function textChunker(input: string): string {
  const CHUNK_SIZE = 500;
  const OVERLAP = 50;
  const words = input.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "(empty input)";
  if (words.length <= CHUNK_SIZE) {
    return `--- Chunk 1 (${words.length} words) ---\n${words.join(" ")}`;
  }
  const chunks: string[] = [];
  let i = 0;
  while (i < words.length) {
    const chunk = words.slice(i, i + CHUNK_SIZE).join(" ");
    chunks.push(chunk);
    i += CHUNK_SIZE - OVERLAP;
    if (i >= words.length) break;
  }
  const total = chunks.length;
  return chunks
    .map((c, idx) => {
      const wc = c.split(/\s+/).length;
      return `--- Chunk ${idx + 1}/${total} (${wc} words) ---\n${c}`;
    })
    .join("\n\n");
}

function urlEncoder(input: string): string {
  let encoded = "", decoded = "";
  try {
    encoded = encodeURIComponent(input);
  } catch {
    encoded = "(encoding failed)";
  }
  try {
    decoded = decodeURIComponent(input);
  } catch {
    decoded = "(not a valid encoded URL)";
  }
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
    "Note: For cryptographic hashing, use SHA-256.",
    "SubtleCrypto (browser) or Node crypto (server) support SHA-256.",
  ].join("\n");
}

function jwtDecoder(input: string): string {
  const token = input.trim();
  const parts = token.split(".");
  if (parts.length !== 3) {
    return `Error: Not a valid JWT (expected 3 parts, got ${parts.length})\n\nA JWT looks like: xxxxx.yyyyy.zzzzz`;
  }
  function decodeB64(s: string): string {
    try {
      const padded = s.replace(/-/g, "+").replace(/_/g, "/").padEnd(s.length + (4 - (s.length % 4)) % 4, "=");
      return decodeURIComponent(escape(atob(padded)));
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
  const now = Date.now() / 1000;
  const expired = payloadObj?.exp ? Number(payloadObj.exp) < now : false;
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
      "Format: First line = regex (optionally /pattern/flags), remaining lines = test strings",
      "",
      "Example:",
      "/^\\d{4}-\\d{2}-\\d{2}$/gm",
      "2024-01-15",
      "not-a-date",
      "2023-12-31",
    ].join("\n");
  }
  const patternLine = lines[0].trim();
  const testLines = lines.slice(1).filter(Boolean);
  let regex: RegExp;
  try {
    if (patternLine.startsWith("/")) {
      const lastSlash = patternLine.lastIndexOf("/");
      const pat = patternLine.slice(1, lastSlash);
      const flags = patternLine.slice(lastSlash + 1);
      regex = new RegExp(pat, flags.replace("g", ""));
    } else {
      regex = new RegExp(patternLine);
    }
  } catch (e: unknown) {
    return `Error: Invalid regex — ${e instanceof Error ? e.message : "unknown error"}`;
  }
  const results = testLines.map((line) => {
    const matches = line.match(regex);
    if (!matches) return `✗  ${JSON.stringify(line)}  — no match`;
    if (matches.length === 1 && matches[0] === line) {
      return `✓  ${JSON.stringify(line)}  — full match`;
    }
    return `✓  ${JSON.stringify(line)}  — matches: ${matches.map((m) => JSON.stringify(m)).join(", ")}`;
  });
  const pass = results.filter((r) => r.startsWith("✓")).length;
  return [
    `Pattern: ${regex.toString()}`,
    `Results: ${pass}/${testLines.length} matched`,
    "",
    ...results,
  ].join("\n");
}

export const PRIVATE_TOOLS: PrivateTool[] = [
  {
    slug: "word-counter",
    name: "Word Counter",
    description: "Count words, characters, and sentences privately",
    category: "text",
    icon: "📝",
    inputLabel: "Your text (stays in browser)",
    inputPlaceholder: "Paste confidential document here...",
    outputLabel: "Analysis",
    clientExecute: wordCounter,
  },
  {
    slug: "text-case",
    name: "Text Case Converter",
    description: "Convert to camelCase, snake_case, UPPER, and more — no upload",
    category: "text",
    icon: "🔤",
    inputLabel: "Your text",
    inputPlaceholder: "Text to convert into multiple cases...",
    outputLabel: "All case variants",
    clientExecute: textCase,
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    description: "Format and validate JSON — private API responses, configs, secrets",
    category: "developer",
    icon: "{}",
    inputLabel: "JSON input",
    inputPlaceholder: '{"key":"value","nested":{"secret":"do-not-log"}}',
    outputLabel: "Formatted JSON",
    clientExecute: jsonFormatter,
  },
  {
    slug: "base64",
    name: "Base64 Encoder",
    description: "Encode/decode Base64 — never log credentials or tokens elsewhere",
    category: "developer",
    icon: "🔐",
    inputLabel: "Text to encode (or Base64 to decode)",
    inputPlaceholder: "Enter text or paste a Base64 string...",
    outputLabel: "Base64 output",
    clientExecute: base64Tool,
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    description: "Decode JWT tokens — inspect claims without revealing to any server",
    category: "developer",
    icon: "🎫",
    inputLabel: "JWT token",
    inputPlaceholder: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.xxxxx",
    outputLabel: "Decoded claims",
    clientExecute: jwtDecoder,
  },
  {
    slug: "html-to-markdown",
    name: "HTML → Markdown",
    description: "Convert HTML to Markdown — for private AI pipelines and RAG prep",
    category: "ai",
    icon: "⚙️",
    inputLabel: "HTML input",
    inputPlaceholder: "<h1>Title</h1><p>Your <strong>private</strong> content...</p>",
    outputLabel: "Markdown output",
    clientExecute: htmlToMarkdown,
  },
  {
    slug: "text-chunker",
    name: "Text Chunker",
    description: "Split text into RAG-ready chunks — confidential docs never leave device",
    category: "ai",
    icon: "✂️",
    inputLabel: "Text to chunk",
    inputPlaceholder: "Paste a long confidential document to split into 500-word chunks...",
    outputLabel: "Chunks",
    clientExecute: textChunker,
  },
  {
    slug: "csv-to-json",
    name: "CSV → JSON",
    description: "Convert CSV to JSON — parse private datasets without upload",
    category: "productivity",
    icon: "📊",
    inputLabel: "CSV data (header row required)",
    inputPlaceholder: "name,email,salary\nAlice,alice@co.com,95000\nBob,bob@co.com,88000",
    outputLabel: "JSON array",
    clientExecute: csvToJson,
  },
  {
    slug: "url-encoder",
    name: "URL Encoder",
    description: "Encode/decode URLs — expose no endpoint structure to third parties",
    category: "developer",
    icon: "🔗",
    inputLabel: "URL or path to encode",
    inputPlaceholder: "https://internal.corp.com/api?token=secret&user=admin",
    outputLabel: "Encoded URL",
    clientExecute: urlEncoder,
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    description: "Test regex patterns against private strings — never sent to a server",
    category: "developer",
    icon: "🔍",
    inputLabel: "Pattern on line 1, test strings below",
    inputPlaceholder: "/^\\d{4}-\\d{2}-\\d{2}$/\n2024-01-15\nnot-a-date\n2023-12-31",
    outputLabel: "Match results",
    clientExecute: regexTester,
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    description: "Generate FNV/DJB2 hashes — no data leaves your machine",
    category: "developer",
    icon: "#️⃣",
    inputLabel: "Text to hash",
    inputPlaceholder: "secret-password-or-api-key-to-fingerprint",
    outputLabel: "Hash output",
    clientExecute: hashGenerator,
  },
];

export function getToolBySlug(slug: string): PrivateTool | undefined {
  return PRIVATE_TOOLS.find((t) => t.slug === slug);
}

export function groupToolsByCategory(tools: PrivateTool[]): Record<string, PrivateTool[]> {
  const groups: Record<string, PrivateTool[]> = {};
  for (const tool of tools) {
    if (!groups[tool.category]) groups[tool.category] = [];
    groups[tool.category].push(tool);
  }
  return groups;
}

export const CATEGORY_LABELS: Record<string, string> = {
  text: "Text Tools",
  developer: "Developer Tools",
  ai: "AI & RAG",
  productivity: "Data",
};

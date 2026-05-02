// Writing-quality library — pure stateless functions used by the MCP
// "writing copilot" bundle. Each function takes a string and returns a
// JSON-serializable result. No I/O, no side effects, sub-100ms per call on
// a paragraph-sized input. Designed to be called repeatedly by writing
// agents (one call per paragraph during draft → revise loops).

// Hard cap on input size — keeps every regex pass O(n) and prevents ReDoS
// against the credit-card / phone patterns even on adversarial input.
// 200 KB ≈ 40k tokens, well above any reasonable single-paragraph or even
// single-document writing-agent loop.
const MAX_INPUT_LEN = 200_000;
function capInput(text: unknown, fnName: string): string {
  if (typeof text !== "string") {
    throw new Error(`${fnName}: text must be a string`);
  }
  if (text.length > MAX_INPUT_LEN) {
    throw new Error(
      `${fnName}: text exceeds ${MAX_INPUT_LEN} chars (got ${text.length}). Split into chunks.`,
    );
  }
  return text;
}

const STOPWORDS = new Set([
  "a","an","and","are","as","at","be","but","by","for","if","in","into","is","it",
  "no","not","of","on","or","s","such","t","that","the","their","then","there",
  "these","they","this","to","was","will","with","i","you","he","she","we","me",
  "my","your","our","us","them","his","her","its","do","does","did","have","has",
  "had","been","being","am","were","would","could","should","can","may","might",
  "must","shall","also","just","only","very","really","much","more","most","some",
  "any","all","each","every","other","another","than","so","too","up","down","out",
  "from","about","over","under","again","once","here","when","where","why","how",
]);

const JARGON_MAP: Record<string, string> = {
  "leverage": "use",
  "leverages": "uses",
  "leveraging": "using",
  "utilize": "use",
  "utilizes": "uses",
  "utilizing": "using",
  "utilization": "use",
  "facilitate": "help",
  "facilitates": "helps",
  "facilitating": "helping",
  "synergy": "teamwork",
  "synergies": "shared benefits",
  "synergistic": "combined",
  "paradigm": "model",
  "paradigm shift": "big change",
  "stakeholder": "person involved",
  "stakeholders": "people involved",
  "actionable": "doable",
  "robust": "strong",
  "scalable": "grows easily",
  "holistic": "whole",
  "ideate": "think up",
  "ideation": "brainstorming",
  "operationalize": "put into practice",
  "operationalise": "put into practice",
  "deep dive": "close look",
  "circle back": "follow up",
  "touch base": "talk",
  "low-hanging fruit": "easy wins",
  "move the needle": "make a difference",
  "boil the ocean": "do too much at once",
  "going forward": "from now on",
  "at the end of the day": "ultimately",
  "best of breed": "top",
  "best-in-class": "top",
  "world-class": "top",
  "cutting-edge": "new",
  "bleeding-edge": "very new",
  "next-generation": "new",
  "next-gen": "new",
  "mission-critical": "essential",
  "value-add": "useful",
  "value-added": "useful",
  "value proposition": "what it offers",
  "core competency": "main skill",
  "core competencies": "main skills",
  "thought leader": "expert",
  "thought leadership": "expertise",
  "disruptive": "new",
  "disrupt": "change",
  "disruption": "change",
  "pivot": "change direction",
  "bandwidth": "capacity",
  "in the weeds": "in the details",
  "drill down": "look closer",
  "rightsize": "resize",
  "downsize": "shrink",
  "upskill": "train",
  "reskill": "retrain",
  "evangelize": "promote",
  "incentivize": "motivate",
  "incentivise": "motivate",
  "monetize": "make money from",
  "monetise": "make money from",
  "productize": "turn into a product",
  "productise": "turn into a product",
  "operationalization": "rollout",
  "alignment": "agreement",
  "synergize": "combine",
  "ecosystem": "community",
  "framework": "approach",
  "methodology": "method",
  "leveraged": "used",
  "utilized": "used",
  "utilised": "used",
  "facilitated": "helped",
};

const PII_PATTERNS: Array<{ name: string; rx: RegExp; severity: "high" | "med" | "low" }> = [
  { name: "email",        rx: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,                   severity: "med" },
  { name: "phone_us",     rx: /\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,             severity: "med" },
  { name: "phone_intl",   rx: /\+\d{1,3}[-.\s]?\d{1,4}[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g,                  severity: "low" },
  { name: "ssn",          rx: /\b\d{3}-\d{2}-\d{4}\b/g,                                                 severity: "high" },
  { name: "credit_card",  rx: /\b(?:\d[ -]*?){13,19}\b/g,                                                severity: "high" },
  { name: "api_key_openai", rx: /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}/g,                                     severity: "high" },
  { name: "api_key_anthropic", rx: /\bsk-ant-(?:api|admin)\d{2}-[A-Za-z0-9_-]{20,}/g,                     severity: "high" },
  { name: "github_pat",   rx: /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36,}/g,                              severity: "high" },
  { name: "aws_access",   rx: /\bAKIA[0-9A-Z]{16}\b/g,                                                    severity: "high" },
  { name: "stripe_key",   rx: /\b(?:sk|pk|rk)_(?:test|live)_[A-Za-z0-9]{24,}/g,                           severity: "high" },
  { name: "jwt",          rx: /\beyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g,                  severity: "high" },
  { name: "ip_v4",        rx: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,                                              severity: "low" },
];

// Luhn check — used to filter false-positive credit-card matches.
function luhnValid(num: string): boolean {
  const digits = num.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let dbl = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits.charCodeAt(i) - 48;
    if (dbl) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
    dbl = !dbl;
  }
  return sum % 10 === 0;
}

function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (w.length <= 3) return 1;
  const trimmed = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "");
  const matches = trimmed.match(/[aeiouy]{1,2}/g);
  return Math.max(1, matches ? matches.length : 1);
}

interface CoreMetrics {
  chars: number;
  charsNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  syllables: number;
  complexWords: number; // 3+ syllables
  longSentences: number; // > 25 words
  avgWordsPerSentence: number;
  avgSyllablesPerWord: number;
  avgCharsPerWord: number;
}

function coreMetrics(text: string): CoreMetrics {
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const wordList = text.match(/\b[\w'-]+\b/g) ?? [];
  const words = wordList.length;
  const sentenceList = text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
  const sentences = Math.max(1, sentenceList.length);
  const paragraphs = Math.max(1, text.split(/\n\s*\n+/).map(p => p.trim()).filter(Boolean).length);
  let syllables = 0;
  let complexWords = 0;
  for (const w of wordList) {
    const s = countSyllables(w);
    syllables += s;
    if (s >= 3) complexWords++;
  }
  const longSentences = sentenceList.filter(s => (s.match(/\b[\w'-]+\b/g)?.length ?? 0) > 25).length;
  return {
    chars, charsNoSpaces, words, sentences, paragraphs, syllables, complexWords, longSentences,
    avgWordsPerSentence: words / sentences,
    avgSyllablesPerWord: words ? syllables / words : 0,
    avgCharsPerWord: words ? charsNoSpaces / words : 0,
  };
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function round(n: number, places = 1): number {
  const m = 10 ** places;
  return Math.round(n * m) / m;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. analyzeText — full readability profile in one call
// ─────────────────────────────────────────────────────────────────────────────

export interface AnalyzeTextResult {
  summary: { words: number; sentences: number; paragraphs: number; readingTimeMinutes: number };
  readability: {
    fleschReadingEase: number;       // 0–100, higher = easier
    fleschKincaidGrade: number;      // US grade level
    gunningFog: number;              // years of education to understand
    smog: number;                    // simple measure of gobbledygook
    colemanLiau: number;             // grade level (no syllables)
    ari: number;                     // automated readability index
    averageGrade: number;            // mean of the four grade-level scores
    targetAudience: string;          // human label
  };
  structure: { avgWordsPerSentence: number; longSentencesCount: number; complexWordsPct: number };
  warnings: string[];
}

export function analyzeText(text: string): AnalyzeTextResult {
  text = capInput(text, "analyzeText");
  if (!text.trim()) {
    throw new Error("analyzeText: text must be a non-empty string");
  }
  const m = coreMetrics(text);

  // Flesch Reading Ease: 206.835 − 1.015 × (W/S) − 84.6 × (Syl/W)
  const fre = clamp(206.835 - 1.015 * m.avgWordsPerSentence - 84.6 * m.avgSyllablesPerWord, 0, 100);
  // Flesch–Kincaid Grade: 0.39 × (W/S) + 11.8 × (Syl/W) − 15.59
  const fkg = Math.max(0, 0.39 * m.avgWordsPerSentence + 11.8 * m.avgSyllablesPerWord - 15.59);
  // Gunning Fog: 0.4 × ((W/S) + 100 × (Complex/W))
  const fog = Math.max(0, 0.4 * (m.avgWordsPerSentence + 100 * (m.complexWords / Math.max(1, m.words))));
  // SMOG: 1.0430 × √(Complex × (30/S)) + 3.1291
  const smog = Math.max(0, 1.043 * Math.sqrt(m.complexWords * (30 / m.sentences)) + 3.1291);
  // Coleman–Liau: 0.0588 × L − 0.296 × S − 15.8  (L = avg letters/100w, S = avg sentences/100w)
  const L = m.avgCharsPerWord * 100;
  const S = (m.sentences / Math.max(1, m.words)) * 100;
  const cli = Math.max(0, 0.0588 * L - 0.296 * S - 15.8);
  // ARI: 4.71 × (chars/words) + 0.5 × (words/sentences) − 21.43
  const ari = Math.max(0, 4.71 * m.avgCharsPerWord + 0.5 * m.avgWordsPerSentence - 21.43);

  const avgGrade = (fkg + fog + smog + cli) / 4;

  let targetAudience: string;
  if (avgGrade < 6) targetAudience = "Elementary school";
  else if (avgGrade < 9) targetAudience = "Middle school";
  else if (avgGrade < 13) targetAudience = "High school";
  else if (avgGrade < 16) targetAudience = "College";
  else if (avgGrade < 19) targetAudience = "Graduate";
  else targetAudience = "Specialist / academic";

  const warnings: string[] = [];
  if (m.avgWordsPerSentence > 25) warnings.push(`Average sentence is ${round(m.avgWordsPerSentence)} words — aim for ≤20.`);
  if (m.longSentences > 0) warnings.push(`${m.longSentences} sentence(s) over 25 words.`);
  if (fre < 30) warnings.push("Flesch reading ease below 30 — text reads as 'very difficult'.");
  if (m.complexWords / Math.max(1, m.words) > 0.2) warnings.push("More than 20% of words are 3+ syllables.");

  return {
    summary: {
      words: m.words,
      sentences: m.sentences,
      paragraphs: m.paragraphs,
      readingTimeMinutes: round(m.words / 230, 1),
    },
    readability: {
      fleschReadingEase: round(fre, 1),
      fleschKincaidGrade: round(fkg, 1),
      gunningFog: round(fog, 1),
      smog: round(smog, 1),
      colemanLiau: round(cli, 1),
      ari: round(ari, 1),
      averageGrade: round(avgGrade, 1),
      targetAudience,
    },
    structure: {
      avgWordsPerSentence: round(m.avgWordsPerSentence, 1),
      longSentencesCount: m.longSentences,
      complexWordsPct: round((m.complexWords / Math.max(1, m.words)) * 100, 1),
    },
    warnings,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. countTokensMulti — estimate tokens + $ cost across all major LLMs
// ─────────────────────────────────────────────────────────────────────────────

interface ModelSpec {
  family: string;
  contextWindow: number;
  inputCostPer1k: number;
  outputCostPer1k: number;
  charsPerTokenEst: number; // tokenizer char-density approximation
}

const MODELS: Record<string, ModelSpec> = {
  "gpt-4o":            { family: "OpenAI",    contextWindow: 128_000, inputCostPer1k: 0.0025,  outputCostPer1k: 0.010,  charsPerTokenEst: 4.0 },
  "gpt-4o-mini":       { family: "OpenAI",    contextWindow: 128_000, inputCostPer1k: 0.00015, outputCostPer1k: 0.0006, charsPerTokenEst: 4.0 },
  "o1":                { family: "OpenAI",    contextWindow: 200_000, inputCostPer1k: 0.015,   outputCostPer1k: 0.060,  charsPerTokenEst: 4.0 },
  "o1-mini":           { family: "OpenAI",    contextWindow: 128_000, inputCostPer1k: 0.003,   outputCostPer1k: 0.012,  charsPerTokenEst: 4.0 },
  "claude-3-5-sonnet": { family: "Anthropic", contextWindow: 200_000, inputCostPer1k: 0.003,   outputCostPer1k: 0.015,  charsPerTokenEst: 3.6 },
  "claude-3-5-haiku":  { family: "Anthropic", contextWindow: 200_000, inputCostPer1k: 0.0008,  outputCostPer1k: 0.004,  charsPerTokenEst: 3.6 },
  "claude-3-opus":     { family: "Anthropic", contextWindow: 200_000, inputCostPer1k: 0.015,   outputCostPer1k: 0.075,  charsPerTokenEst: 3.6 },
  "gemini-1.5-pro":    { family: "Google",    contextWindow: 2_000_000, inputCostPer1k: 0.00125, outputCostPer1k: 0.005, charsPerTokenEst: 4.2 },
  "gemini-1.5-flash":  { family: "Google",    contextWindow: 1_000_000, inputCostPer1k: 0.000075, outputCostPer1k: 0.0003, charsPerTokenEst: 4.2 },
  "llama-3-70b":       { family: "Meta",      contextWindow: 128_000, inputCostPer1k: 0.0009,  outputCostPer1k: 0.0009, charsPerTokenEst: 3.8 },
  "llama-3-8b":        { family: "Meta",      contextWindow: 128_000, inputCostPer1k: 0.0001,  outputCostPer1k: 0.0001, charsPerTokenEst: 3.8 },
};

export interface CountTokensMultiResult {
  chars: number;
  words: number;
  models: Array<{
    id: string;
    family: string;
    estimatedTokens: number;
    contextWindow: number;
    percentOfContextUsed: number;
    fitsInContext: boolean;
    estimatedInputCostUSD: number;
    estimatedRoundtripCostUSD: number; // input + same-size output (rough upper bound)
  }>;
  cheapestThatFits: string | null;
  costliestThatFits: string | null;
  note: string;
}

export function countTokensMulti(text: string): CountTokensMultiResult {
  text = capInput(text, "countTokensMulti");
  const chars = text.length;
  const words = (text.match(/\b[\w'-]+\b/g) ?? []).length;

  const models = Object.entries(MODELS).map(([id, spec]) => {
    const tokens = Math.ceil(chars / spec.charsPerTokenEst);
    const fits = tokens <= spec.contextWindow;
    const inCost = (tokens / 1000) * spec.inputCostPer1k;
    const outCost = (tokens / 1000) * spec.outputCostPer1k;
    return {
      id,
      family: spec.family,
      estimatedTokens: tokens,
      contextWindow: spec.contextWindow,
      percentOfContextUsed: round((tokens / spec.contextWindow) * 100, 3),
      fitsInContext: fits,
      estimatedInputCostUSD: round(inCost, 6),
      estimatedRoundtripCostUSD: round(inCost + outCost, 6),
    };
  });

  const fits = models.filter(m => m.fitsInContext);
  const cheapest = fits.length ? fits.reduce((a, b) => a.estimatedRoundtripCostUSD < b.estimatedRoundtripCostUSD ? a : b).id : null;
  const costliest = fits.length ? fits.reduce((a, b) => a.estimatedRoundtripCostUSD > b.estimatedRoundtripCostUSD ? a : b).id : null;

  return {
    chars,
    words,
    models,
    cheapestThatFits: cheapest,
    costliestThatFits: costliest,
    note: "Token counts are tokenizer approximations (chars / model-specific char-density). Actual counts vary ±10% by language and content. Roundtrip cost assumes output ≈ input length.",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. findRepetition — top recurring words / bigrams / trigrams
// ─────────────────────────────────────────────────────────────────────────────

export interface FindRepetitionResult {
  topWords: Array<{ term: string; count: number }>;
  topBigrams: Array<{ term: string; count: number }>;
  topTrigrams: Array<{ term: string; count: number }>;
  totalTokens: number;
  uniqueWords: number;
  lexicalDiversity: number; // unique / total — 1.0 is fully unique, 0.1 is repetitive
}

export function findRepetition(
  text: string,
  opts: { topN?: number; ignoreStopwords?: boolean } = {}
): FindRepetitionResult {
  text = capInput(text, "findRepetition");
  const topN = clamp(opts.topN ?? 10, 1, 50);
  const ignoreStop = opts.ignoreStopwords !== false;

  const tokens = (text.toLowerCase().match(/\b[\w'-]+\b/g) ?? []).filter(t => t.length > 1);
  const filtered = ignoreStop ? tokens.filter(t => !STOPWORDS.has(t)) : tokens;

  const wordCounts = new Map<string, number>();
  for (const t of filtered) wordCounts.set(t, (wordCounts.get(t) ?? 0) + 1);

  const bigramCounts = new Map<string, number>();
  for (let i = 0; i < tokens.length - 1; i++) {
    const bg = `${tokens[i]} ${tokens[i + 1]}`;
    bigramCounts.set(bg, (bigramCounts.get(bg) ?? 0) + 1);
  }

  const trigramCounts = new Map<string, number>();
  for (let i = 0; i < tokens.length - 2; i++) {
    const tg = `${tokens[i]} ${tokens[i + 1]} ${tokens[i + 2]}`;
    trigramCounts.set(tg, (trigramCounts.get(tg) ?? 0) + 1);
  }

  const sortDesc = (m: Map<string, number>) =>
    [...m.entries()].filter(([, c]) => c >= 2).sort((a, b) => b[1] - a[1]).slice(0, topN).map(([term, count]) => ({ term, count }));

  return {
    topWords: sortDesc(wordCounts),
    topBigrams: sortDesc(bigramCounts),
    topTrigrams: sortDesc(trigramCounts),
    totalTokens: tokens.length,
    uniqueWords: new Set(tokens).size,
    lexicalDiversity: tokens.length ? round(new Set(tokens).size / tokens.length, 3) : 0,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. detectJargon — score against a Plain Language baseline + suggest swaps
// ─────────────────────────────────────────────────────────────────────────────

export interface DetectJargonResult {
  jargonScore: number;       // 0–100, higher = more jargon-laden
  flagged: Array<{ term: string; count: number; suggestion: string; firstIndex: number }>;
  totalJargonHits: number;
  jargonDensityPct: number;  // jargon hits / total words × 100
  verdict: string;
}

export function detectJargon(text: string): DetectJargonResult {
  text = capInput(text, "detectJargon");
  const lower = text.toLowerCase();
  const totalWords = (text.match(/\b[\w'-]+\b/g) ?? []).length;

  const flagged: Array<{ term: string; count: number; suggestion: string; firstIndex: number }> = [];
  let totalHits = 0;
  for (const [term, suggestion] of Object.entries(JARGON_MAP)) {
    const escaped = term.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const rx = new RegExp(`\\b${escaped}\\b`, "g");
    const matches = lower.match(rx);
    if (matches?.length) {
      const firstIndex = lower.search(rx);
      flagged.push({ term, count: matches.length, suggestion, firstIndex });
      totalHits += matches.length;
    }
  }
  flagged.sort((a, b) => b.count - a.count);

  const density = totalWords ? (totalHits / totalWords) * 100 : 0;
  // Score: density × 8, capped at 100. ~12% density = max score.
  const score = clamp(round(density * 8, 0), 0, 100);

  let verdict: string;
  if (score === 0) verdict = "Plain — no flagged business jargon.";
  else if (score < 15) verdict = "Light — a few jargon terms, mostly readable.";
  else if (score < 40) verdict = "Moderate — noticeable jargon, consider swaps.";
  else if (score < 70) verdict = "Heavy — text reads as corporate-speak.";
  else verdict = "Severe — replace most flagged terms.";

  return {
    jargonScore: score,
    flagged,
    totalJargonHits: totalHits,
    jargonDensityPct: round(density, 2),
    verdict,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. detectPii — regex sweep for emails, phones, secrets, cards, etc.
// ─────────────────────────────────────────────────────────────────────────────

export interface DetectPiiResult {
  hasPii: boolean;
  totalFindings: number;
  highSeverityCount: number;
  findings: Array<{
    type: string;
    severity: "high" | "med" | "low";
    count: number;
    samples: string[]; // up to 3 redacted samples per type
  }>;
  verdict: string;
}

function redact(s: string): string {
  if (s.length <= 6) return "***";
  return `${s.slice(0, 2)}${"*".repeat(Math.max(3, s.length - 4))}${s.slice(-2)}`;
}

export function detectPii(text: string): DetectPiiResult {
  text = capInput(text, "detectPii");

  const findings: DetectPiiResult["findings"] = [];
  let total = 0;
  let highCount = 0;

  for (const { name, rx, severity } of PII_PATTERNS) {
    const matches = [...text.matchAll(rx)].map(m => m[0]);
    const validated = name === "credit_card" ? matches.filter(luhnValid) : matches;
    if (!validated.length) continue;
    findings.push({
      type: name,
      severity,
      count: validated.length,
      samples: validated.slice(0, 3).map(redact),
    });
    total += validated.length;
    if (severity === "high") highCount += validated.length;
  }
  findings.sort((a, b) => {
    const sev = { high: 0, med: 1, low: 2 };
    return sev[a.severity] - sev[b.severity] || b.count - a.count;
  });

  let verdict: string;
  if (!total) verdict = "Clean — no obvious PII or secrets detected.";
  else if (highCount) verdict = `BLOCK — ${highCount} high-severity finding(s). Do not send/publish without redaction.`;
  else verdict = `Review — ${total} finding(s). Consider redacting before publishing.`;

  return {
    hasPii: total > 0,
    totalFindings: total,
    highSeverityCount: highCount,
    findings,
    verdict,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. toneScore — 4-dimensional heuristic (formal/casual/technical/urgent)
// ─────────────────────────────────────────────────────────────────────────────

export interface ToneScoreResult {
  formal: number;     // 0–1
  casual: number;     // 0–1
  technical: number;  // 0–1
  urgent: number;     // 0–1
  dominant: "formal" | "casual" | "technical" | "urgent" | "neutral";
  signals: { contractions: number; passiveVerbs: number; firstSecondPerson: number; codeBlocks: number; brackets: number; exclamations: number; allCapsWords: number; urgentKeywords: number };
}

const URGENT_KEYWORDS = /\b(now|asap|immediately|urgent|critical|emergency|today|deadline|hurry|quick(?:ly)?|right away|right now)\b/gi;
const PASSIVE_RX = /\b(is|are|was|were|been|being|be)\s+\w+(?:ed|en)\b/gi;
const CONTRACTION_RX = /\b\w+'(?:re|ve|ll|d|s|t|m)\b/gi;
const FIRST_SECOND_RX = /\b(?:i|me|my|we|us|our|you|your)\b/gi;
const ALL_CAPS_RX = /\b[A-Z]{3,}\b/g;
const CODE_BLOCK_RX = /```[\s\S]*?```|`[^`]+`/g;
const BRACKET_RX = /\[[^\]]+\]|\([^)]+\)|\{[^}]+\}/g;

export function toneScore(text: string): ToneScoreResult {
  text = capInput(text, "toneScore");
  const m = coreMetrics(text);

  const contractions = (text.match(CONTRACTION_RX) ?? []).length;
  const passiveVerbs = (text.match(PASSIVE_RX) ?? []).length;
  const firstSecondPerson = (text.match(FIRST_SECOND_RX) ?? []).length;
  const codeBlocks = (text.match(CODE_BLOCK_RX) ?? []).length;
  const brackets = (text.match(BRACKET_RX) ?? []).length;
  const exclamations = (text.match(/!/g) ?? []).length;
  const allCapsWords = (text.match(ALL_CAPS_RX) ?? []).length;
  const urgentKeywords = (text.match(URGENT_KEYWORDS) ?? []).length;

  const wordsK = Math.max(1, m.words / 100); // per-100-words normaliser

  // Formal: long sentences + passive + low contractions/no first-person
  const formal = clamp(
    (m.avgWordsPerSentence / 30) * 0.5 +
    (passiveVerbs / wordsK) * 0.3 +
    clamp(1 - (contractions / Math.max(1, wordsK * 5)), 0, 1) * 0.2,
    0, 1
  );
  // Casual: contractions + first/second person + exclamations
  const casual = clamp(
    (contractions / wordsK) * 0.4 +
    (firstSecondPerson / Math.max(1, wordsK * 8)) * 0.4 +
    (exclamations / wordsK) * 0.2,
    0, 1
  );
  // Technical: code blocks + brackets + complex words
  const technical = clamp(
    (codeBlocks / Math.max(1, wordsK * 0.5)) * 0.4 +
    (brackets / wordsK) * 0.3 +
    (m.complexWords / Math.max(1, m.words)) * 1.5 * 0.3,
    0, 1
  );
  // Urgent: caps + exclamation + urgency keywords
  const urgent = clamp(
    (allCapsWords / wordsK) * 0.3 +
    (exclamations / wordsK) * 0.3 +
    (urgentKeywords / Math.max(1, wordsK * 0.5)) * 0.4,
    0, 1
  );

  const scores = { formal, casual, technical, urgent };
  let dominant: ToneScoreResult["dominant"] = "neutral";
  let max = 0.25; // threshold — if nothing crosses it, it's neutral
  for (const [k, v] of Object.entries(scores)) {
    if (v > max) { max = v; dominant = k as ToneScoreResult["dominant"]; }
  }

  return {
    formal: round(formal, 3),
    casual: round(casual, 3),
    technical: round(technical, 3),
    urgent: round(urgent, 3),
    dominant,
    signals: { contractions, passiveVerbs, firstSecondPerson, codeBlocks, brackets, exclamations, allCapsWords, urgentKeywords },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. compareVersions — readability + tone delta between two strings
// ─────────────────────────────────────────────────────────────────────────────

export interface CompareVersionsResult {
  before: { readability: AnalyzeTextResult["readability"]; tone: ToneScoreResult; words: number };
  after:  { readability: AnalyzeTextResult["readability"]; tone: ToneScoreResult; words: number };
  delta: {
    fleschReadingEase: number;
    averageGrade: number;
    words: number;
    tone: { formal: number; casual: number; technical: number; urgent: number };
  };
  verdict: string;
}

export function compareVersions(v1: string, v2: string): CompareVersionsResult {
  v1 = capInput(v1, "compareVersions(v1)");
  v2 = capInput(v2, "compareVersions(v2)");
  if (!v1.trim() || !v2.trim()) {
    throw new Error("compareVersions: both v1 and v2 must be non-empty");
  }
  const a = analyzeText(v1);
  const b = analyzeText(v2);
  const ta = toneScore(v1);
  const tb = toneScore(v2);

  const dFre = round(b.readability.fleschReadingEase - a.readability.fleschReadingEase, 1);
  const dGrade = round(b.readability.averageGrade - a.readability.averageGrade, 1);

  const verdictParts: string[] = [];
  if (dFre > 5) verdictParts.push(`Easier to read (+${dFre} Flesch)`);
  else if (dFre < -5) verdictParts.push(`Harder to read (${dFre} Flesch)`);
  if (dGrade < -1) verdictParts.push(`Lower grade level (${dGrade})`);
  else if (dGrade > 1) verdictParts.push(`Higher grade level (+${dGrade})`);
  if (Math.abs(b.summary.words - a.summary.words) > a.summary.words * 0.2) {
    verdictParts.push(b.summary.words > a.summary.words ? `Longer (+${b.summary.words - a.summary.words} words)` : `Shorter (${b.summary.words - a.summary.words} words)`);
  }
  if (!verdictParts.length) verdictParts.push("Roughly equivalent.");

  return {
    before: { readability: a.readability, tone: ta, words: a.summary.words },
    after:  { readability: b.readability, tone: tb, words: b.summary.words },
    delta: {
      fleschReadingEase: dFre,
      averageGrade: dGrade,
      words: b.summary.words - a.summary.words,
      tone: {
        formal:    round(tb.formal - ta.formal, 3),
        casual:    round(tb.casual - ta.casual, 3),
        technical: round(tb.technical - ta.technical, 3),
        urgent:    round(tb.urgent - ta.urgent, 3),
      },
    },
    verdict: verdictParts.join(" · "),
  };
}

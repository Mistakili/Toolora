// Smoke tests for the 7 writing-quality library functions. Pure-function
// assertions only — no DB, no network, no fixtures. Runs via Node's built-in
// test runner (`node --test`) compiled through tsx, no extra deps required.
//
//   pnpm --filter @workspace/api-server run test
//
// These are intentionally narrow guards against silent regressions in the
// scoring math (a one-character change in a regex can swing readability by
// 10 points). They are not a coverage harness — they pin a baseline.

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  analyzeText,
  countTokensMulti,
  findRepetition,
  detectJargon,
  detectPii,
  toneScore,
  compareVersions,
} from "./writingQuality.ts";

const FOG_SAMPLE =
  "The quick brown fox jumps over the lazy dog. " +
  "Pack my box with five dozen liquor jugs. " +
  "How vexingly quick daft zebras jump.";

const JARGONY =
  "We will leverage our synergies to utilize cross-functional bandwidth and ideate on a holistic paradigm shift.";

const PII_BAG =
  "Email me at jane.doe@example.com or call 415-555-0199. " +
  "My card is 4111 1111 1111 1111 and my Anthropic key is " +
  "sk-ant-api03-abcdefghijklmnopqrstuvwxyz1234567890.";

describe("analyzeText", () => {
  it("returns the four readability scores plus word + sentence counts", () => {
    const r = analyzeText(FOG_SAMPLE);
    assert.equal(typeof r.readability.fleschReadingEase, "number");
    assert.equal(typeof r.readability.gunningFog, "number");
    assert.equal(typeof r.readability.smog, "number");
    assert.equal(typeof r.readability.colemanLiau, "number");
    assert.equal(typeof r.readability.averageGrade, "number");
    assert.ok(r.summary.words > 10, `expected >10 words, got ${r.summary.words}`);
    assert.ok(r.summary.sentences >= 3);
  });

  it("rejects non-string input with a clear error", () => {
    assert.throws(() => analyzeText(123 as unknown as string), /must be a string/);
  });

  it("rejects oversize input above the ReDoS cap", () => {
    const huge = "a ".repeat(200_001);
    assert.throws(() => analyzeText(huge), /exceeds 200000 chars/);
  });
});

describe("countTokensMulti", () => {
  it("returns estimates for the major model families", () => {
    const r = countTokensMulti("Hello, world. This is a token-count test.");
    assert.ok(r.models.length >= 5, `expected ≥5 models, got ${r.models.length}`);
    const families = new Set(r.models.map((m) => m.family));
    // We don't pin specific id strings (those evolve) — pin families instead.
    for (const expected of ["OpenAI", "Anthropic", "Google"]) {
      assert.ok(families.has(expected), `missing family ${expected}; got ${[...families].join(",")}`);
    }
    assert.ok(r.models.every((m) => m.estimatedTokens > 0));
  });
});

describe("findRepetition", () => {
  it("ignores stopwords and surfaces the repeated content word", () => {
    const txt =
      "The launch went well. The launch was on time. The launch shipped to all users.";
    const r = findRepetition(txt);
    assert.ok(r.topWords.length > 0, "should surface at least one repeated word");
    const top = r.topWords[0];
    assert.equal(top.term, "launch");
    assert.equal(top.count, 3);
  });
});

describe("detectJargon", () => {
  it("flags corporate filler and suggests swaps", () => {
    const r = detectJargon(JARGONY);
    assert.ok(r.flagged.length >= 3, `expected ≥3 flags, got ${r.flagged.length}`);
    const terms = r.flagged.map((f) => f.term.toLowerCase());
    assert.ok(
      terms.some((t) => t.startsWith("leverag")),
      `no leverage* in ${terms.join(",")}`,
    );
    assert.ok(
      terms.some((t) => t.startsWith("utiliz")),
      `no utiliz* in ${terms.join(",")}`,
    );
    assert.ok(r.flagged.every((f) => typeof f.suggestion === "string"));
  });
});

describe("detectPii", () => {
  it("catches every PII class in a mixed sample and BLOCKs", () => {
    const r = detectPii(PII_BAG);
    assert.equal(r.hasPii, true);
    assert.ok(r.verdict.startsWith("BLOCK"), `verdict was: ${r.verdict}`);
    const types = new Set(r.findings.map((f) => f.type));
    assert.ok(types.has("email"), `missing email; got ${[...types].join(",")}`);
    assert.ok(types.has("phone_us"), `missing phone_us; got ${[...types].join(",")}`);
    assert.ok(types.has("credit_card"), `missing credit_card; got ${[...types].join(",")}`);
    assert.ok(
      [...types].some((t) => t.includes("anthropic")),
      `missing anthropic key; got ${[...types].join(",")}`,
    );
  });

  it("PASSes a clean sentence with zero PII", () => {
    const r = detectPii("The weather is nice today and we shipped on time.");
    assert.equal(r.hasPii, false);
    assert.equal(r.findings.length, 0);
  });

  it("does not flag a Luhn-invalid 16-digit number as a high-severity card", () => {
    // 4111-1111-1111-1112 fails the Luhn check (valid is ...1111).
    const r = detectPii("Random number 4111 1111 1111 1112 should not trip card detection.");
    const cardFinding = r.findings.find((f) => f.type === "credit_card");
    if (cardFinding) {
      assert.notEqual(
        cardFinding.severity,
        "high",
        "Luhn-invalid number must not be high severity",
      );
    }
  });
});

describe("toneScore", () => {
  it("scores a casual line higher on casual than formal", () => {
    const r = toneScore("Hey y'all, can't wait to ship this thing!");
    assert.ok(
      r.casual >= r.formal,
      `casual ${r.casual} should be >= formal ${r.formal}`,
    );
    // dominant must be one of the documented values
    assert.ok(
      ["formal", "casual", "technical", "urgent", "neutral"].includes(r.dominant),
    );
  });
});

describe("compareVersions", () => {
  it("reports a non-negative readability delta when v2 is plainer", () => {
    const v1 =
      "Notwithstanding the aforementioned considerations, we shall endeavour to ascertain the optimal trajectory.";
    const v2 = "We will figure out the best path.";
    const r = compareVersions(v1, v2);
    // Higher Flesch = more readable. v2 should not regress.
    assert.ok(
      r.delta.fleschReadingEase >= 0,
      `expected delta.fleschReadingEase >= 0, got ${r.delta.fleschReadingEase}`,
    );
    assert.ok(r.delta.words < 0, `v2 should have fewer words; got delta ${r.delta.words}`);
    assert.equal(typeof r.verdict, "string");
  });

  it("throws when either input is empty or whitespace-only", () => {
    assert.throws(() => compareVersions("", "hello"), /non-empty/);
    assert.throws(() => compareVersions("hello", "   "), /non-empty/);
  });
});

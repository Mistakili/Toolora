import { useState, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Info } from "lucide-react";
import { encode } from "gpt-tokenizer";

type ModelFamily = "gpt-4o" | "gpt-4" | "gpt-3.5-turbo" | "claude" | "llama";

interface ModelConfig {
  label: string;
  description: string;
  count: (text: string) => number;
  contextWindow: number;
  exact: boolean;
}

function cl100kCount(text: string): number {
  try {
    return encode(text).length;
  } catch {
    return Math.round(text.split(/\s+/).filter(Boolean).length * 1.33);
  }
}

const MODEL_CONFIGS: Record<ModelFamily, ModelConfig> = {
  "gpt-4o": {
    label: "GPT-4o / GPT-4o mini",
    description: "OpenAI (o200k_base, ≈cl100k estimate)",
    contextWindow: 128000,
    exact: false,
    count: (t) => Math.round(cl100kCount(t) * 0.97),
  },
  "gpt-4": {
    label: "GPT-4 / GPT-4 Turbo",
    description: "OpenAI (cl100k_base — exact)",
    contextWindow: 128000,
    exact: true,
    count: cl100kCount,
  },
  "gpt-3.5-turbo": {
    label: "GPT-3.5 Turbo",
    description: "OpenAI (cl100k_base — exact)",
    contextWindow: 16385,
    exact: true,
    count: cl100kCount,
  },
  "claude": {
    label: "Claude 3 / 3.5 / 4",
    description: "Anthropic (≈cl100k estimate, ±5%)",
    contextWindow: 200000,
    exact: false,
    count: (t) => Math.round(cl100kCount(t) * 1.02),
  },
  "llama": {
    label: "Llama 3 / Mistral",
    description: "Meta / Mistral (≈SentencePiece estimate, ±5%)",
    contextWindow: 128000,
    exact: false,
    count: (t) => Math.round(cl100kCount(t) * 1.07),
  },
};

function pct(tokens: number, ctx: number) {
  return Math.min(100, Math.round((tokens / ctx) * 100));
}

function barColor(p: number) {
  if (p < 50) return "bg-green-500";
  if (p < 80) return "bg-yellow-400";
  return "bg-red-500";
}

export default function TokenCounter() {
  const [text, setText] = useState("");
  const [model, setModel] = useState<ModelFamily>("gpt-4");

  const cfg = MODEL_CONFIGS[model];

  const tokens = useMemo(() => (text ? cfg.count(text) : 0), [text, model]);
  const chars = text.length;
  const words = text.split(/\s+/).filter(Boolean).length;
  const lines = text ? text.split("\n").length : 0;

  const used = pct(tokens, cfg.contextWindow);
  const color = barColor(used);

  return (
    <div className="space-y-5">
      {/* Model selector */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Model</p>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(MODEL_CONFIGS) as ModelFamily[]).map((m) => (
            <button
              key={m}
              onClick={() => setModel(m)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors border ${
                model === m
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/40 border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {MODEL_CONFIGS[m].label}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-1.5">
          {cfg.description} · {cfg.contextWindow.toLocaleString()} token context window
          {cfg.exact && <span className="text-green-500 ml-1">· Exact count</span>}
        </p>
      </div>

      {/* Text input */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Input Text</p>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your prompt, document, or any text here..."
          className="font-mono text-sm min-h-[200px] resize-y"
        />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Tokens", value: tokens.toLocaleString(), highlight: true },
          { label: "Characters", value: chars.toLocaleString() },
          { label: "Words", value: words.toLocaleString() },
          { label: "Lines", value: lines.toLocaleString() },
        ].map(({ label, value, highlight }) => (
          <div
            key={label}
            className={`rounded-lg border p-3 text-center ${
              highlight ? "border-primary/40 bg-primary/5" : "border-border bg-muted/30"
            }`}
          >
            <p className={`text-2xl font-bold tabular-nums ${highlight ? "text-primary" : ""}`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Context window bar */}
      <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium">Context window usage</span>
          <span className={`font-bold tabular-nums ${used > 80 ? "text-red-500" : used > 50 ? "text-yellow-400" : "text-green-500"}`}>
            {used}%
          </span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${color}`}
            style={{ width: `${used}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {tokens.toLocaleString()} of {cfg.contextWindow.toLocaleString()} tokens used
          {tokens > 0 && ` · ~${(cfg.contextWindow - tokens).toLocaleString()} remaining`}
        </p>
      </div>

      {/* Info note */}
      <div className="flex gap-2 text-xs text-muted-foreground rounded-lg border border-border bg-muted/20 p-3">
        <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
        <span>
          GPT-4 and GPT-3.5 use the exact cl100k_base tokenizer. GPT-4o, Claude, and Llama use calibrated estimates based on cl100k_base — actual counts may vary by ±5%.
        </span>
      </div>
    </div>
  );
}

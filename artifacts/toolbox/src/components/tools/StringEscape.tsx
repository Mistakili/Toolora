import { useState, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Copy, ArrowLeftRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type EscapeFormat = "json" | "sql" | "regex" | "csv" | "shell" | "xml";
type Mode = "escape" | "unescape";

interface FormatConfig {
  label: string;
  description: string;
  escape: (s: string) => string;
  unescape: (s: string) => string;
}

const FORMATS: Record<EscapeFormat, FormatConfig> = {
  json: {
    label: "JSON String",
    description: "Escape for use inside a JSON string value",
    escape: (s) =>
      s
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/\t/g, "\\t")
        .replace(/\f/g, "\\f")
        .replace(/\b/g, "\\b")
        .replace(/[\x00-\x1f\x7f]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`),
    unescape: (s) => {
      try {
        return JSON.parse(`"${s}"`);
      } catch {
        return s
          .replace(/\\n/g, "\n")
          .replace(/\\r/g, "\r")
          .replace(/\\t/g, "\t")
          .replace(/\\f/g, "\f")
          .replace(/\\b/g, "\b")
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, "\\")
          .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
      }
    },
  },
  sql: {
    label: "SQL String",
    description: "Escape single quotes for SQL string literals",
    escape: (s) => s.replace(/'/g, "''").replace(/\\/g, "\\\\"),
    unescape: (s) => s.replace(/''/g, "'").replace(/\\\\/g, "\\"),
  },
  regex: {
    label: "Regex Pattern",
    description: "Escape special regex metacharacters",
    escape: (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    unescape: (s) => s.replace(/\\([.*+?^${}()|[\]\\])/g, "$1"),
  },
  csv: {
    label: "CSV Field",
    description: "Wrap in quotes and escape for CSV",
    escape: (s) => {
      const needsQuote = /[",\n\r]/.test(s);
      const escaped = s.replace(/"/g, '""');
      return needsQuote ? `"${escaped}"` : escaped;
    },
    unescape: (s) => {
      const trimmed = s.trim();
      if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
        return trimmed.slice(1, -1).replace(/""/g, '"');
      }
      return s;
    },
  },
  shell: {
    label: "Shell / Bash",
    description: "Single-quote escape for POSIX shell",
    escape: (s) => "'" + s.replace(/'/g, "'\\''") + "'",
    unescape: (s) => {
      const trimmed = s.trim();
      if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
        return trimmed.slice(1, -1).replace(/'\\''/g, "'");
      }
      return s;
    },
  },
  xml: {
    label: "XML / HTML Attr",
    description: "Escape for XML attributes and text content",
    escape: (s) =>
      s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;"),
    unescape: (s) =>
      s
        .replace(/&apos;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&gt;/g, ">")
        .replace(/&lt;/g, "<")
        .replace(/&amp;/g, "&"),
  },
};

const FORMAT_ORDER: EscapeFormat[] = ["json", "sql", "regex", "csv", "shell", "xml"];

const EXAMPLES: Record<EscapeFormat, string> = {
  json: 'Hello "world"\nLine 2\tTabbed',
  sql:  "O'Reilly's Guide to SQL",
  regex: "1+1=2? (yes/no) [maybe]",
  csv:  'Alice, "the great"',
  shell: "Hello World & goodbye!",
  xml:  '<script>alert("xss")</script>',
};

export default function StringEscape() {
  const [format, setFormat] = useState<EscapeFormat>("json");
  const [mode, setMode] = useState<Mode>("escape");
  const [input, setInput] = useState("");
  const { toast } = useToast();

  const output = useMemo(() => {
    if (!input) return "";
    try {
      return mode === "escape"
        ? FORMATS[format].escape(input)
        : FORMATS[format].unescape(input);
    } catch {
      return "";
    }
  }, [input, format, mode]);

  const swap = () => {
    setMode((m) => (m === "escape" ? "unescape" : "escape"));
    setInput(output);
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    toast({ description: "Output copied!" });
  };

  const loadExample = () => {
    setMode("escape");
    setInput(EXAMPLES[format]);
  };

  const cfg = FORMATS[format];

  return (
    <div className="space-y-5">
      {/* Format selector */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Format</p>
        <div className="flex flex-wrap gap-2">
          {FORMAT_ORDER.map((f) => (
            <button
              key={f}
              onClick={() => { setFormat(f); setInput(""); }}
              className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                format === f
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/40 border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {FORMATS[f].label}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-1.5">{cfg.description}</p>
      </div>

      {/* Mode + controls */}
      <div className="flex items-center gap-3">
        <div className="flex rounded-md overflow-hidden border border-border">
          <button
            onClick={() => setMode("escape")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              mode === "escape"
                ? "bg-primary text-primary-foreground"
                : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            Escape
          </button>
          <button
            onClick={() => setMode("unescape")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              mode === "unescape"
                ? "bg-primary text-primary-foreground"
                : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            Unescape
          </button>
        </div>
        <button
          onClick={swap}
          disabled={!output}
          className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-border bg-muted/40 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          Swap
        </button>
        <button
          onClick={loadExample}
          className="px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Load example
        </button>
      </div>

      {/* Side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {mode === "escape" ? "Raw Input" : "Escaped Input"}
          </p>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "escape" ? "Paste raw text to escape..." : "Paste escaped string to unescape..."}
            className="font-mono text-sm min-h-[200px] resize-y"
            spellCheck={false}
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {mode === "escape" ? "Escaped Output" : "Raw Output"}
            </p>
            {output && (
              <button onClick={copy} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Copy className="w-3.5 h-3.5" /> Copy
              </button>
            )}
          </div>
          <div className="rounded-md border border-border bg-muted/30 min-h-[200px] p-3 font-mono text-sm overflow-auto whitespace-pre-wrap break-all">
            {output
              ? <span className="text-foreground">{output}</span>
              : <span className="text-muted-foreground">Output will appear here...</span>
            }
          </div>
        </div>
      </div>

      {/* Reference table */}
      {format === "json" && (
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="bg-muted/30 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">JSON escape sequences</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-0">
            {[["\\n","Newline"],["\\t","Tab"],["\\r","Carriage return"],["\\\\","Backslash"],['\\"',"Double quote"],["\\b","Backspace"],["\\f","Form feed"],["\\uXXXX","Unicode"]].map(([seq, meaning]) => (
              <div key={seq} className="flex items-center gap-2 px-3 py-2 border-t border-border text-sm">
                <code className="font-mono text-primary font-bold text-xs bg-primary/10 px-1.5 py-0.5 rounded">{seq}</code>
                <span className="text-muted-foreground text-xs">{meaning}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {format === "regex" && (
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="bg-muted/30 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Regex metacharacters escaped</div>
          <div className="flex flex-wrap gap-2 p-3">
            {". * + ? ^ $ { } ( ) | [ ] \\".split(" ").map((c) => (
              <code key={c} className="font-mono text-primary font-bold text-xs bg-primary/10 px-2 py-1 rounded border border-primary/20">{c}</code>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FLAGS = [
  { key: "g", label: "g", title: "Global — find all matches" },
  { key: "i", label: "i", title: "Case insensitive" },
  { key: "m", label: "m", title: "Multiline — ^ and $ match line boundaries" },
  { key: "s", label: "s", title: "Dot matches newlines" },
];

interface Match {
  index: number;
  length: number;
  value: string;
  groups: (string | undefined)[];
}

function buildMatches(pattern: string, flags: string, text: string): { matches: Match[]; error: string } {
  if (!pattern) return { matches: [], error: "" };
  try {
    const re = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
    const matches: Match[] = [];
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      matches.push({ index: m.index, length: m[0].length, value: m[0], groups: m.slice(1) });
      if (!flags.includes("g")) break;
      if (m[0].length === 0) re.lastIndex++;
    }
    return { matches, error: "" };
  } catch (e: unknown) {
    return { matches: [], error: (e as Error).message };
  }
}

function HighlightedText({ text, matches }: { text: string; matches: Match[] }) {
  if (!matches.length) return <span className="whitespace-pre-wrap font-mono text-sm">{text}</span>;

  const parts: { text: string; highlight: boolean }[] = [];
  let cursor = 0;
  for (const m of matches) {
    if (m.index > cursor) parts.push({ text: text.slice(cursor, m.index), highlight: false });
    parts.push({ text: text.slice(m.index, m.index + m.length), highlight: true });
    cursor = m.index + m.length;
  }
  if (cursor < text.length) parts.push({ text: text.slice(cursor), highlight: false });

  return (
    <span className="whitespace-pre-wrap font-mono text-sm">
      {parts.map((p, i) =>
        p.highlight ? (
          <mark key={i} className="bg-yellow-400/30 text-yellow-200 rounded-sm px-0.5">{p.text}</mark>
        ) : (
          <span key={i}>{p.text}</span>
        )
      )}
    </span>
  );
}

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("");
  const { toast } = useToast();

  const { matches, error } = useMemo(() => buildMatches(pattern, flags, text), [pattern, flags, text]);

  const toggleFlag = (f: string) => {
    setFlags((prev) => prev.includes(f) ? prev.replace(f, "") : prev + f);
  };

  const copyMatches = () => {
    navigator.clipboard.writeText(matches.map((m) => m.value).join("\n"));
    toast({ title: "Copied!", description: `${matches.length} match${matches.length !== 1 ? "es" : ""} copied.` });
  };

  return (
    <div className="space-y-5">
      {/* Pattern + flags */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Regular Expression</label>
        <div className="flex gap-2 items-start">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">/</span>
            <Input
              className={`font-mono pl-6 pr-6 ${error ? "border-destructive" : ""}`}
              placeholder="[a-z]+"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">/</span>
          </div>
          <div className="flex gap-1">
            {FLAGS.map((f) => (
              <button
                key={f.key}
                title={f.title}
                onClick={() => toggleFlag(f.key)}
                className={`w-9 h-9 rounded-lg font-mono text-sm border transition-colors ${
                  flags.includes(f.key)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/40 text-muted-foreground border-border hover:border-primary/40"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        {error && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {error}
          </p>
        )}
      </div>

      {/* Test string */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Test String</label>
        <Textarea
          className="font-mono text-sm min-h-[160px] resize-none"
          placeholder="Paste or type text to test against your regex..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      {/* Results */}
      {text && (
        <>
          {/* Match preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Match Preview
                {pattern && !error && (
                  <span className={`ml-2 text-xs font-normal ${matches.length > 0 ? "text-green-400" : "text-muted-foreground"}`}>
                    {matches.length} match{matches.length !== 1 ? "es" : ""}
                  </span>
                )}
              </label>
              {matches.length > 0 && (
                <Button variant="ghost" size="sm" onClick={copyMatches}>
                  <Copy className="w-3 h-3 mr-2" /> Copy matches
                </Button>
              )}
            </div>
            <div className="bg-muted/50 rounded-xl p-4 border border-border min-h-[80px]">
              <HighlightedText text={text} matches={matches} />
            </div>
          </div>

          {/* Match list */}
          {matches.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Matches</label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {matches.map((m, i) => (
                  <div key={i} className="flex items-start gap-3 bg-muted/30 rounded-lg px-3 py-2 border border-border text-sm">
                    <span className="text-xs text-muted-foreground shrink-0 mt-0.5">#{i + 1}</span>
                    <span className="font-mono text-yellow-300 break-all">{m.value}</span>
                    <span className="text-xs text-muted-foreground shrink-0 mt-0.5 ml-auto">@{m.index}</span>
                    {m.groups.some(Boolean) && (
                      <span className="text-xs text-muted-foreground shrink-0">
                        groups: [{m.groups.map((g) => JSON.stringify(g)).join(", ")}]
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

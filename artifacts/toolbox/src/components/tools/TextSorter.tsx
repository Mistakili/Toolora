import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Shuffle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Operation =
  | "sort-asc"
  | "sort-desc"
  | "sort-length-asc"
  | "sort-length-desc"
  | "remove-duplicates"
  | "remove-empty"
  | "reverse"
  | "shuffle"
  | "trim"
  | "number-lines";

const OPERATIONS: { key: Operation; label: string; description: string }[] = [
  { key: "sort-asc",          label: "Sort A → Z",           description: "Alphabetical ascending" },
  { key: "sort-desc",         label: "Sort Z → A",           description: "Alphabetical descending" },
  { key: "sort-length-asc",   label: "Sort by length ↑",     description: "Shortest lines first" },
  { key: "sort-length-desc",  label: "Sort by length ↓",     description: "Longest lines first" },
  { key: "remove-duplicates", label: "Remove duplicates",    description: "Keep only unique lines" },
  { key: "remove-empty",      label: "Remove empty lines",   description: "Strip blank lines" },
  { key: "reverse",           label: "Reverse order",        description: "Flip line order" },
  { key: "shuffle",           label: "Shuffle",              description: "Randomize line order" },
  { key: "trim",              label: "Trim whitespace",      description: "Strip leading/trailing spaces from each line" },
  { key: "number-lines",      label: "Number lines",         description: "Prefix each line with its number" },
];

function processLines(text: string, op: Operation): string {
  let lines = text.split("\n");

  switch (op) {
    case "sort-asc":
      lines = [...lines].sort((a, b) => a.localeCompare(b));
      break;
    case "sort-desc":
      lines = [...lines].sort((a, b) => b.localeCompare(a));
      break;
    case "sort-length-asc":
      lines = [...lines].sort((a, b) => a.length - b.length);
      break;
    case "sort-length-desc":
      lines = [...lines].sort((a, b) => b.length - a.length);
      break;
    case "remove-duplicates":
      lines = [...new Set(lines)];
      break;
    case "remove-empty":
      lines = lines.filter((l) => l.trim().length > 0);
      break;
    case "reverse":
      lines = [...lines].reverse();
      break;
    case "shuffle": {
      lines = [...lines];
      for (let i = lines.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lines[i], lines[j]] = [lines[j], lines[i]];
      }
      break;
    }
    case "trim":
      lines = lines.map((l) => l.trim());
      break;
    case "number-lines":
      lines = lines.map((l, i) => `${i + 1}. ${l}`);
      break;
  }

  return lines.join("\n");
}

export default function TextSorter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [activeOp, setActiveOp] = useState<Operation | null>(null);
  const { toast } = useToast();

  const apply = (op: Operation) => {
    setActiveOp(op);
    setOutput(processLines(input, op));
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    toast({ title: "Copied!", description: "Result copied to clipboard." });
  };

  const lineCount = (text: string) => text ? text.split("\n").length : 0;

  return (
    <div className="space-y-5">
      {/* Operation buttons */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Operation</label>
        <div className="flex flex-wrap gap-2">
          {OPERATIONS.map((op) => (
            <button
              key={op.key}
              title={op.description}
              onClick={() => apply(op.key)}
              disabled={!input}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                activeOp === op.key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/40 text-foreground border-border hover:border-primary/40"
              }`}
            >
              {op.key === "shuffle" && <Shuffle className="w-3 h-3 inline mr-1.5" />}
              {op.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Input</label>
            {input && <span className="text-xs text-muted-foreground">{lineCount(input)} lines</span>}
          </div>
          <Textarea
            className="font-mono text-sm min-h-[300px] resize-none"
            placeholder={"Paste lines of text here...\nOne item per line.\nThe operation will be applied to these."}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (activeOp) setOutput(processLines(e.target.value, activeOp));
            }}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Output</label>
            <div className="flex items-center gap-2">
              {output && <span className="text-xs text-muted-foreground">{lineCount(output)} lines</span>}
              {output && (
                <Button variant="ghost" size="sm" onClick={copy}>
                  <Copy className="w-3 h-3 mr-2" /> Copy
                </Button>
              )}
            </div>
          </div>
          <Textarea
            className="font-mono text-sm min-h-[300px] resize-none"
            placeholder="Result will appear here..."
            value={output}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}

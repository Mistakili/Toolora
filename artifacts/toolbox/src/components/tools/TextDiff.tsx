import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GitCompare } from "lucide-react";

type DiffPart = { text: string; type: "equal" | "added" | "removed" };

function diffLines(a: string, b: string): DiffPart[] {
  const linesA = a.split("\n");
  const linesB = b.split("\n");
  const parts: DiffPart[] = [];

  const m = linesA.length, n = linesB.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--)
    for (let j = n - 1; j >= 0; j--)
      dp[i][j] = linesA[i] === linesB[j]
        ? dp[i + 1][j + 1] + 1
        : Math.max(dp[i + 1][j], dp[i][j + 1]);

  let i = 0, j = 0;
  while (i < m || j < n) {
    if (i < m && j < n && linesA[i] === linesB[j]) {
      parts.push({ text: linesA[i], type: "equal" });
      i++; j++;
    } else if (j < n && (i >= m || dp[i + 1][j] >= dp[i][j + 1])) {
      parts.push({ text: linesB[j], type: "added" });
      j++;
    } else {
      parts.push({ text: linesA[i], type: "removed" });
      i++;
    }
  }
  return parts;
}

export default function TextDiff() {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [diff, setDiff] = useState<DiffPart[] | null>(null);

  const compare = () => {
    if (!textA && !textB) return;
    setDiff(diffLines(textA, textB));
  };

  const stats = diff
    ? {
        added: diff.filter((d) => d.type === "added").length,
        removed: diff.filter((d) => d.type === "removed").length,
        unchanged: diff.filter((d) => d.type === "equal").length,
      }
    : null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Original Text</label>
          <Textarea
            className="font-mono text-sm min-h-[240px] resize-none"
            placeholder="Paste your original text here..."
            value={textA}
            onChange={(e) => { setTextA(e.target.value); setDiff(null); }}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Modified Text</label>
          <Textarea
            className="font-mono text-sm min-h-[240px] resize-none"
            placeholder="Paste the modified text here..."
            value={textB}
            onChange={(e) => { setTextB(e.target.value); setDiff(null); }}
          />
        </div>
      </div>

      <Button onClick={compare} className="w-full" disabled={!textA && !textB}>
        <GitCompare className="w-4 h-4 mr-2" />
        Compare Texts
      </Button>

      {diff && stats && (
        <div className="space-y-4">
          <div className="flex gap-4 text-sm">
            <span className="flex items-center gap-1.5 bg-green-500/10 text-green-400 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              +{stats.added} added
            </span>
            <span className="flex items-center gap-1.5 bg-red-500/10 text-red-400 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
              -{stats.removed} removed
            </span>
            <span className="flex items-center gap-1.5 bg-muted text-muted-foreground px-3 py-1 rounded-full">
              {stats.unchanged} unchanged
            </span>
          </div>

          <div className="bg-muted/20 rounded-2xl border border-border overflow-auto max-h-[400px]">
            <div className="font-mono text-sm divide-y divide-border/50">
              {diff.map((part, i) => (
                <div
                  key={i}
                  className={`flex px-4 py-1 ${
                    part.type === "added"
                      ? "bg-green-500/10 text-green-400"
                      : part.type === "removed"
                      ? "bg-red-500/10 text-red-400 line-through opacity-70"
                      : "text-foreground/70"
                  }`}
                >
                  <span className="w-6 mr-4 text-muted-foreground select-none shrink-0">
                    {part.type === "added" ? "+" : part.type === "removed" ? "−" : " "}
                  </span>
                  <span className="whitespace-pre-wrap break-all">{part.text || " "}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!diff && (
        <div className="flex flex-col items-center justify-center min-h-[200px] text-muted-foreground">
          <GitCompare className="w-12 h-12 opacity-20 mb-3" />
          <p>Paste two texts above and click Compare</p>
        </div>
      )}
    </div>
  );
}

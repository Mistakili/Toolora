import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Copy, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import cronstrue from "cronstrue";

interface CronField {
  label: string;
  value: string;
  hint: string;
}

function parseCronFields(expr: string): CronField[] | null {
  const parts = expr.trim().split(/\s+/);
  if (parts.length < 5 || parts.length > 6) return null;
  if (parts.length === 5) {
    const [min, hour, dom, month, dow] = parts;
    return [
      { label: "Minute", value: min, hint: "0–59" },
      { label: "Hour", value: hour, hint: "0–23" },
      { label: "Day (month)", value: dom, hint: "1–31" },
      { label: "Month", value: month, hint: "1–12" },
      { label: "Day (week)", value: dow, hint: "0–6 (Sun–Sat)" },
    ];
  }
  const [sec, min, hour, dom, month, dow] = parts;
  return [
    { label: "Second", value: sec, hint: "0–59" },
    { label: "Minute", value: min, hint: "0–59" },
    { label: "Hour", value: hour, hint: "0–23" },
    { label: "Day (month)", value: dom, hint: "1–31" },
    { label: "Month", value: month, hint: "1–12" },
    { label: "Day (week)", value: dow, hint: "0–6 (Sun–Sat)" },
  ];
}

function getNextRuns(expr: string, count = 5): string[] {
  try {
    const parts = expr.trim().split(/\s+/);
    if (parts.length !== 5) return [];
    const [min, hour, dom, month, dow] = parts;

    const now = new Date();
    const runs: string[] = [];
    let d = new Date(now);
    d.setSeconds(0, 0);
    d.setMinutes(d.getMinutes() + 1);

    let attempts = 0;
    while (runs.length < count && attempts < 100000) {
      attempts++;
      const matches =
        matchField(d.getMinutes(), min, 0, 59) &&
        matchField(d.getHours(), hour, 0, 23) &&
        matchField(d.getDate(), dom, 1, 31) &&
        matchField(d.getMonth() + 1, month, 1, 12) &&
        matchField(d.getDay(), dow, 0, 6);

      if (matches) {
        runs.push(
          d.toLocaleString(undefined, {
            weekday: "short", year: "numeric", month: "short",
            day: "numeric", hour: "2-digit", minute: "2-digit",
          })
        );
      }
      d.setMinutes(d.getMinutes() + 1);
    }
    return runs;
  } catch {
    return [];
  }
}

function matchField(value: number, field: string, min: number, max: number): boolean {
  if (field === "*") return true;
  if (field.includes(",")) return field.split(",").some((p) => matchField(value, p.trim(), min, max));
  if (field.includes("/")) {
    const [rangeStr, stepStr] = field.split("/");
    const step = parseInt(stepStr, 10);
    const range = rangeStr === "*" ? `${min}-${max}` : rangeStr;
    if (range.includes("-")) {
      const [lo, hi] = range.split("-").map(Number);
      for (let v = lo; v <= hi; v += step) if (v === value) return true;
      return false;
    }
    return (value - parseInt(range, 10)) % step === 0 && value >= parseInt(range, 10);
  }
  if (field.includes("-")) {
    const [lo, hi] = field.split("-").map(Number);
    return value >= lo && value <= hi;
  }
  return parseInt(field, 10) === value;
}

const PRESETS = [
  { label: "Every minute", value: "* * * * *" },
  { label: "Every hour", value: "0 * * * *" },
  { label: "Every day at midnight", value: "0 0 * * *" },
  { label: "Every day at noon", value: "0 12 * * *" },
  { label: "Every Monday at 9am", value: "0 9 * * 1" },
  { label: "Every weekday at 8am", value: "0 8 * * 1-5" },
  { label: "Every Sunday midnight", value: "0 0 * * 0" },
  { label: "Every 6 hours", value: "0 */6 * * *" },
  { label: "Every 15 minutes", value: "*/15 * * * *" },
  { label: "1st of every month", value: "0 0 1 * *" },
];

export default function CronParser() {
  const [expr, setExpr] = useState("0 9 * * 1-5");
  const { toast } = useToast();

  const { description, error } = useMemo(() => {
    if (!expr.trim()) return { description: "", error: null };
    try {
      return { description: cronstrue.toString(expr.trim(), { verbose: true }), error: null };
    } catch (e: unknown) {
      return { description: "", error: e instanceof Error ? e.message : "Invalid cron expression" };
    }
  }, [expr]);

  const fields = useMemo(() => parseCronFields(expr), [expr]);
  const nextRuns = useMemo(() => getNextRuns(expr), [expr]);

  const copy = async () => {
    await navigator.clipboard.writeText(expr);
    toast({ description: "Copied to clipboard!" });
  };

  return (
    <div className="space-y-5">
      {/* Input */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Cron Expression</p>
        <div className="flex gap-2">
          <Input
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            placeholder="* * * * *"
            className="font-mono text-base tracking-widest flex-1"
            spellCheck={false}
          />
          <button
            onClick={copy}
            className="flex items-center gap-1.5 px-3 rounded-md border border-border bg-muted/40 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Copy className="w-3.5 h-3.5" /> Copy
          </button>
        </div>
      </div>

      {/* Field breakdown */}
      {fields && (
        <div className="flex flex-wrap gap-2">
          {fields.map((f) => (
            <div key={f.label} className="rounded-md border border-border bg-muted/30 px-3 py-2 text-center min-w-[70px]">
              <p className="font-mono text-lg font-bold text-primary">{f.value}</p>
              <p className="text-xs font-medium mt-0.5">{f.label}</p>
              <p className="text-[10px] text-muted-foreground">{f.hint}</p>
            </div>
          ))}
        </div>
      )}

      {/* Human-readable description */}
      <div className={`rounded-lg border p-4 ${error ? "border-red-500/40 bg-red-500/5" : "border-primary/30 bg-primary/5"}`}>
        {error ? (
          <div className="flex gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : description ? (
          <div className="flex gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
            <span className="font-medium">{description}</span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">Enter a cron expression to see its meaning...</span>
        )}
      </div>

      {/* Next 5 runs */}
      {nextRuns.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Next 5 runs (local time)</p>
          </div>
          <div className="space-y-1">
            {nextRuns.map((run, i) => (
              <div key={i} className="flex items-center gap-3 rounded-md border border-border bg-muted/20 px-3 py-2">
                <span className="text-xs text-muted-foreground w-4 text-center">{i + 1}</span>
                <span className="font-mono text-sm">{run}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Presets */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Common presets</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.value}
              onClick={() => setExpr(p.value)}
              className={`px-2.5 py-1 rounded-md border text-xs transition-colors ${
                expr === p.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reference table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="bg-muted/30 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Quick reference
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-0">
          {[
            ["*", "Every value"],
            ["*/n", "Every n-th value"],
            ["n", "Exact value n"],
            ["n-m", "Range n to m"],
            ["n,m", "n or m"],
            ["@hourly", "= 0 * * * *"],
            ["@daily", "= 0 0 * * *"],
            ["@weekly", "= 0 0 * * 0"],
            ["@monthly", "= 0 0 1 * *"],
          ].map(([sym, meaning]) => (
            <div key={sym} className="flex items-center gap-2 px-4 py-2 border-t border-border text-sm">
              <code className="font-mono text-primary font-bold text-xs bg-primary/10 px-1.5 py-0.5 rounded">{sym}</code>
              <span className="text-muted-foreground text-xs">{meaning}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Stop = { color: string; position: number };
type GradientType = "linear" | "radial";
type Direction = "to right" | "to left" | "to bottom" | "to top" | "to bottom right" | "to bottom left" | "135deg" | "45deg";

const DIRECTIONS: { label: string; value: Direction }[] = [
  { label: "→", value: "to right" },
  { label: "←", value: "to left" },
  { label: "↓", value: "to bottom" },
  { label: "↑", value: "to top" },
  { label: "↘", value: "to bottom right" },
  { label: "↙", value: "to bottom left" },
  { label: "135°", value: "135deg" },
  { label: "45°", value: "45deg" },
];

function buildCss(type: GradientType, direction: Direction, stops: Stop[]): string {
  const stopsStr = stops.map((s) => `${s.color} ${s.position}%`).join(", ");
  if (type === "radial") return `radial-gradient(circle, ${stopsStr})`;
  return `linear-gradient(${direction}, ${stopsStr})`;
}

export default function CssGradientGenerator() {
  const [type, setType] = useState<GradientType>("linear");
  const [direction, setDirection] = useState<Direction>("to right");
  const [stops, setStops] = useState<Stop[]>([
    { color: "#6366f1", position: 0 },
    { color: "#ec4899", position: 100 },
  ]);
  const { toast } = useToast();

  const css = buildCss(type, direction, stops);
  const cssDeclaration = `background: ${css};`;

  const updateStop = (i: number, field: keyof Stop, val: string | number) => {
    setStops((prev) => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s));
  };

  const addStop = () => {
    const mid = Math.round((stops[0].position + stops[stops.length - 1].position) / 2);
    setStops((prev) => [...prev, { color: "#a855f7", position: mid }].sort((a, b) => a.position - b.position));
  };

  const removeStop = (i: number) => {
    if (stops.length <= 2) return;
    setStops((prev) => prev.filter((_, idx) => idx !== i));
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "CSS copied to clipboard." });
  };

  return (
    <div className="space-y-6">
      <div
        className="w-full rounded-xl border border-border"
        style={{ background: css, height: "160px" }}
      />

      <div className="flex gap-3 flex-wrap items-center">
        <div className="flex gap-2">
          {(["linear", "radial"] as GradientType[]).map((t) => (
            <Button key={t} size="sm" variant={type === t ? "default" : "outline"} onClick={() => setType(t)} className="capitalize">
              {t}
            </Button>
          ))}
        </div>
        {type === "linear" && (
          <div className="flex gap-1 flex-wrap">
            {DIRECTIONS.map((d) => (
              <Button
                key={d.value}
                size="sm"
                variant={direction === d.value ? "secondary" : "ghost"}
                className="w-10 text-base"
                onClick={() => setDirection(d.value)}
              >
                {d.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Color Stops</span>
          <Button size="sm" variant="outline" onClick={addStop}>
            <Plus className="w-4 h-4 mr-2" />Add Stop
          </Button>
        </div>
        {stops.map((stop, i) => (
          <div key={i} className="flex items-center gap-3">
            <input
              type="color"
              value={stop.color}
              onChange={(e) => updateStop(i, "color", e.target.value)}
              className="w-10 h-10 rounded cursor-pointer border border-border bg-transparent p-0.5"
            />
            <Input
              type="text"
              value={stop.color}
              onChange={(e) => updateStop(i, "color", e.target.value)}
              className="font-mono w-28 text-sm"
            />
            <input
              type="range"
              min={0}
              max={100}
              value={stop.position}
              onChange={(e) => updateStop(i, "position", Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground w-10 text-right">{stop.position}%</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeStop(i)}
              disabled={stops.length <= 2}
              className="shrink-0"
            >
              <Trash2 className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-muted/30 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">CSS Output</span>
          <Button variant="ghost" size="sm" onClick={() => copy(cssDeclaration)}>
            <Copy className="w-3 h-3 mr-2" />Copy
          </Button>
        </div>
        <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap break-all">{cssDeclaration}</pre>
      </div>
    </div>
  );
}

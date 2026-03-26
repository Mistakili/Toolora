import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "");
  if (clean.length !== 3 && clean.length !== 6) return null;
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return { r: Math.round(f(0) * 255), g: Math.round(f(8) * 255), b: Math.round(f(4) * 255) };
}

const PRESETS = [
  "#ef4444","#f97316","#eab308","#22c55e","#06b6d4","#3b82f6","#8b5cf6","#ec4899",
  "#ffffff","#d1d5db","#6b7280","#374151","#1f2937","#111827","#000000","#7c3aed",
];

export default function ColorPicker() {
  const [hex, setHex] = useState("#7c3aed");
  const [hexInput, setHexInput] = useState("#7c3aed");
  const { toast } = useToast();

  const rgb = hexToRgb(hex) ?? { r: 124, g: 58, b: 237 };
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const applyHex = (value: string) => {
    const clean = value.startsWith("#") ? value : "#" + value;
    setHexInput(clean);
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(clean)) {
      setHex(clean);
    }
  };

  const applyRgb = (r: number, g: number, b: number) => {
    const h = rgbToHex(r, g, b);
    setHex(h);
    setHexInput(h);
  };

  const applyHsl = (h: number, s: number, l: number) => {
    const { r, g, b } = hslToRgb(h, s, l);
    applyRgb(r, g, b);
  };

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${label} copied to clipboard.` });
  };

  const hexStr = hex.toUpperCase();
  const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  return (
    <div className="space-y-6">
      {/* Color Picker + Preview */}
      <div className="flex flex-col sm:flex-row gap-6">
        <div
          className="w-full sm:w-48 h-48 rounded-2xl border border-border shadow-lg flex-shrink-0"
          style={{ backgroundColor: hex }}
        />
        <div className="flex-1 space-y-4">
          <input
            type="color"
            value={hex}
            onChange={(e) => { setHex(e.target.value); setHexInput(e.target.value); }}
            className="w-full h-12 rounded-xl border border-border cursor-pointer bg-transparent"
          />

          {/* Hex Input */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">HEX</label>
            <div className="flex gap-2">
              <Input
                value={hexInput}
                onChange={(e) => applyHex(e.target.value)}
                className="font-mono"
                placeholder="#000000"
              />
              <Button variant="outline" size="icon" onClick={() => copy(hexStr, "HEX")}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Format Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "HEX", value: hexStr, action: () => copy(hexStr, "HEX") },
          { label: "RGB", value: rgbStr, action: () => copy(rgbStr, "RGB") },
          { label: "HSL", value: hslStr, action: () => copy(hslStr, "HSL") },
        ].map(({ label, value, action }) => (
          <button
            key={label}
            onClick={action}
            className="group bg-muted/30 hover:bg-muted/60 border border-border rounded-2xl p-4 text-left transition-all"
          >
            <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">{label}</div>
            <div className="font-mono text-sm font-medium break-all">{value}</div>
            <div className="text-xs text-primary opacity-0 group-hover:opacity-100 mt-2 transition-opacity">Click to copy</div>
          </button>
        ))}
      </div>

      {/* RGB Sliders */}
      <div className="space-y-4 bg-muted/20 rounded-2xl p-5 border border-border">
        <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">RGB Sliders</h3>
        {[
          { label: "R", val: rgb.r, color: "bg-red-500", max: 255 },
          { label: "G", val: rgb.g, color: "bg-green-500", max: 255 },
          { label: "B", val: rgb.b, color: "bg-blue-500", max: 255 },
        ].map(({ label, val, color, max }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="w-4 text-xs font-bold text-muted-foreground">{label}</span>
            <input
              type="range" min={0} max={max} value={val}
              onChange={(e) => {
                const v = Number(e.target.value);
                applyRgb(label === "R" ? v : rgb.r, label === "G" ? v : rgb.g, label === "B" ? v : rgb.b);
              }}
              className="flex-1 accent-violet-500"
            />
            <span className="w-8 text-xs text-right font-mono text-muted-foreground">{val}</span>
          </div>
        ))}
      </div>

      {/* Presets */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Presets</h3>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              className={`w-8 h-8 rounded-lg border-2 transition-all ${hex.toLowerCase() === p.toLowerCase() ? "border-primary scale-110" : "border-transparent hover:border-border"}`}
              style={{ backgroundColor: p }}
              onClick={() => { setHex(p); setHexInput(p); }}
              title={p}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Unit = { label: string; factor: number };
type Category = { name: string; units: Unit[] };

const CATEGORIES: Category[] = [
  {
    name: "Length",
    units: [
      { label: "Millimeter (mm)", factor: 0.001 },
      { label: "Centimeter (cm)", factor: 0.01 },
      { label: "Meter (m)", factor: 1 },
      { label: "Kilometer (km)", factor: 1000 },
      { label: "Inch (in)", factor: 0.0254 },
      { label: "Foot (ft)", factor: 0.3048 },
      { label: "Yard (yd)", factor: 0.9144 },
      { label: "Mile (mi)", factor: 1609.344 },
    ],
  },
  {
    name: "Weight",
    units: [
      { label: "Milligram (mg)", factor: 0.000001 },
      { label: "Gram (g)", factor: 0.001 },
      { label: "Kilogram (kg)", factor: 1 },
      { label: "Metric Ton (t)", factor: 1000 },
      { label: "Ounce (oz)", factor: 0.02835 },
      { label: "Pound (lb)", factor: 0.453592 },
      { label: "Stone (st)", factor: 6.35029 },
    ],
  },
  {
    name: "Temperature",
    units: [
      { label: "Celsius (°C)", factor: 1 },
      { label: "Fahrenheit (°F)", factor: 1 },
      { label: "Kelvin (K)", factor: 1 },
    ],
  },
  {
    name: "Area",
    units: [
      { label: "Square mm (mm²)", factor: 0.000001 },
      { label: "Square cm (cm²)", factor: 0.0001 },
      { label: "Square m (m²)", factor: 1 },
      { label: "Hectare (ha)", factor: 10000 },
      { label: "Square km (km²)", factor: 1000000 },
      { label: "Square inch (in²)", factor: 0.00064516 },
      { label: "Square foot (ft²)", factor: 0.092903 },
      { label: "Acre", factor: 4046.86 },
    ],
  },
  {
    name: "Speed",
    units: [
      { label: "m/s", factor: 1 },
      { label: "km/h", factor: 0.277778 },
      { label: "mph", factor: 0.44704 },
      { label: "Knot", factor: 0.514444 },
    ],
  },
  {
    name: "Volume",
    units: [
      { label: "Milliliter (ml)", factor: 0.001 },
      { label: "Liter (L)", factor: 1 },
      { label: "Cubic meter (m³)", factor: 1000 },
      { label: "Teaspoon (tsp)", factor: 0.00492892 },
      { label: "Tablespoon (tbsp)", factor: 0.0147868 },
      { label: "Fluid oz (fl oz)", factor: 0.0295735 },
      { label: "Cup", factor: 0.236588 },
      { label: "Pint (pt)", factor: 0.473176 },
      { label: "Gallon (US gal)", factor: 3.78541 },
    ],
  },
];

function convertTemp(value: number, from: string, to: string): number {
  let celsius: number;
  if (from.includes("°C")) celsius = value;
  else if (from.includes("°F")) celsius = (value - 32) * 5 / 9;
  else celsius = value - 273.15;

  if (to.includes("°C")) return celsius;
  if (to.includes("°F")) return celsius * 9 / 5 + 32;
  return celsius + 273.15;
}

function formatNum(n: number): string {
  if (Math.abs(n) < 0.000001 || Math.abs(n) > 1e12) return n.toExponential(6);
  return parseFloat(n.toPrecision(8)).toString();
}

export default function UnitConverter() {
  const [categoryIdx, setCategoryIdx] = useState(0);
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(1);
  const [input, setInput] = useState("1");

  const cat = CATEGORIES[categoryIdx];
  const isTemp = cat.name === "Temperature";

  const convert = (val: string, fi: number, ti: number): string => {
    const num = parseFloat(val);
    if (isNaN(num)) return "";
    if (isTemp) {
      return formatNum(convertTemp(num, cat.units[fi].label, cat.units[ti].label));
    }
    const base = num * cat.units[fi].factor;
    return formatNum(base / cat.units[ti].factor);
  };

  const result = convert(input, fromIdx, toIdx);

  const swap = () => {
    setFromIdx(toIdx);
    setToIdx(fromIdx);
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c, i) => (
          <Button
            key={c.name}
            variant={categoryIdx === i ? "default" : "outline"}
            size="sm"
            onClick={() => { setCategoryIdx(i); setFromIdx(0); setToIdx(1); }}
          >
            {c.name}
          </Button>
        ))}
      </div>

      {/* Converter */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
        {/* From */}
        <div className="space-y-3 bg-muted/30 rounded-2xl p-5 border border-border">
          <select
            className="w-full bg-transparent text-sm font-medium outline-none"
            value={fromIdx}
            onChange={(e) => setFromIdx(Number(e.target.value))}
          >
            {cat.units.map((u, i) => (
              <option key={u.label} value={i} className="bg-background">{u.label}</option>
            ))}
          </select>
          <Input
            type="number"
            className="text-2xl font-bold h-14 bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        {/* Swap */}
        <Button variant="ghost" size="icon" onClick={swap} className="mx-auto">
          <ArrowLeftRight className="w-5 h-5" />
        </Button>

        {/* To */}
        <div className="space-y-3 bg-muted/30 rounded-2xl p-5 border border-border">
          <select
            className="w-full bg-transparent text-sm font-medium outline-none"
            value={toIdx}
            onChange={(e) => setToIdx(Number(e.target.value))}
          >
            {cat.units.map((u, i) => (
              <option key={u.label} value={i} className="bg-background">{u.label}</option>
            ))}
          </select>
          <div className="text-2xl font-bold h-14 flex items-end pb-2 border-b border-border text-primary">
            {result || "—"}
          </div>
        </div>
      </div>

      {result && (
        <p className="text-center text-muted-foreground text-sm">
          {input} {cat.units[fromIdx].label.split(" (")[0]} = <strong className="text-foreground">{result} {cat.units[toIdx].label.split(" (")[0]}</strong>
        </p>
      )}
    </div>
  );
}

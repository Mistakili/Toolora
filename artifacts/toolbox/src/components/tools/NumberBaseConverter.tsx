import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Copy, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Base = 2 | 8 | 10 | 16;

interface BaseConfig {
  label: string;
  prefix: string;
  charset: RegExp;
  placeholder: string;
}

const BASES: { base: Base; config: BaseConfig }[] = [
  { base: 10, config: { label: "Decimal (Base 10)", prefix: "", charset: /^-?[0-9]+$/, placeholder: "42" } },
  { base: 2,  config: { label: "Binary (Base 2)",   prefix: "0b", charset: /^[01]+$/, placeholder: "101010" } },
  { base: 8,  config: { label: "Octal (Base 8)",    prefix: "0o", charset: /^[0-7]+$/, placeholder: "52" } },
  { base: 16, config: { label: "Hexadecimal (Base 16)", prefix: "0x", charset: /^[0-9a-fA-F]+$/, placeholder: "2a" } },
];

function parseToDecimal(value: string, base: Base): bigint | null {
  if (!value.trim()) return null;
  const v = value.trim().replace(/\s/g, "");
  try {
    if (base === 10) {
      if (!/^-?[0-9]+$/.test(v)) return null;
      return BigInt(v);
    }
    const cleaned = v.replace(/^(0b|0o|0x)/i, "");
    if (!cleaned) return null;
    const charsets: Record<Base, RegExp> = { 2: /^[01]+$/, 8: /^[0-7]+$/, 10: /^[0-9]+$/, 16: /^[0-9a-fA-F]+$/ };
    if (!charsets[base].test(cleaned)) return null;
    return BigInt("0x" + (base === 16 ? cleaned : parseInt(cleaned, base).toString(16)));
  } catch {
    return null;
  }
}

function formatInBase(n: bigint, base: Base): string {
  if (base === 10) return n.toString(10);
  const abs = n < 0n ? -n : n;
  if (base === 16) return abs.toString(16).toUpperCase();
  if (base === 2) return abs.toString(2);
  if (base === 8) return abs.toString(8);
  return abs.toString();
}

function groupBinary(bin: string): string {
  return bin.replace(/(.{1,4})(?=(.{4})+$)/g, "$1 ");
}

const QUICK_VALUES = [
  { label: "0", decimal: 0n },
  { label: "1", decimal: 1n },
  { label: "8", decimal: 8n },
  { label: "16", decimal: 16n },
  { label: "32", decimal: 32n },
  { label: "64", decimal: 64n },
  { label: "128", decimal: 128n },
  { label: "255", decimal: 255n },
  { label: "256", decimal: 256n },
  { label: "1024", decimal: 1024n },
  { label: "65535", decimal: 65535n },
  { label: "FF (hex)", decimal: 255n },
];

export default function NumberBaseConverter() {
  const [inputBase, setInputBase] = useState<Base>(10);
  const [raw, setRaw] = useState("");
  const { toast } = useToast();

  const decimal = useMemo(() => {
    if (!raw.trim()) return null;
    return parseToDecimal(raw, inputBase);
  }, [raw, inputBase]);

  const isError = raw.trim() !== "" && decimal === null;

  const results: Record<Base, string> = useMemo(() => ({
    2:  decimal !== null ? groupBinary(formatInBase(decimal, 2)) : "",
    8:  decimal !== null ? formatInBase(decimal, 8) : "",
    10: decimal !== null ? formatInBase(decimal, 10) : "",
    16: decimal !== null ? formatInBase(decimal, 16) : "",
  }), [decimal]);

  const copy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text.replace(/\s/g, ""));
    toast({ description: `${label} copied!` });
  };

  const loadQuick = (n: bigint) => {
    setInputBase(10);
    setRaw(n.toString());
  };

  const switchBase = (b: Base) => {
    if (decimal !== null) {
      setRaw(formatInBase(decimal, b).replace(/\s/g, ""));
    }
    setInputBase(b);
  };

  return (
    <div className="space-y-5">
      {/* Input base selector */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Input Base</p>
        <div className="flex flex-wrap gap-2">
          {BASES.map(({ base, config }) => (
            <button
              key={base}
              onClick={() => switchBase(base)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                inputBase === base
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/40 border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {config.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input field */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Enter {BASES.find(b => b.base === inputBase)?.config.label}
        </p>
        <div className="relative">
          {BASES.find(b => b.base === inputBase)?.config.prefix && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-mono text-muted-foreground select-none">
              {BASES.find(b => b.base === inputBase)?.config.prefix}
            </span>
          )}
          <Input
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder={BASES.find(b => b.base === inputBase)?.config.placeholder}
            className={`font-mono text-base ${BASES.find(b => b.base === inputBase)?.config.prefix ? "pl-9" : ""} ${isError ? "border-red-500/60" : ""}`}
            spellCheck={false}
          />
        </div>
        {isError && (
          <div className="flex items-center gap-1.5 text-xs text-red-400 mt-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Invalid {BASES.find(b => b.base === inputBase)?.config.label.toLowerCase()}</span>
          </div>
        )}
      </div>

      {/* Output cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {BASES.map(({ base, config }) => {
          const val = results[base];
          const isActive = inputBase === base;
          return (
            <div
              key={base}
              className={`rounded-lg border p-4 ${isActive ? "border-primary/40 bg-primary/5" : "border-border bg-muted/20"}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{config.label}</p>
                  {config.prefix && <p className="text-[10px] text-muted-foreground">{config.prefix}…</p>}
                </div>
                {val && (
                  <button
                    onClick={() => copy(val, config.label)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    title="Copy"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className={`font-mono text-lg font-bold break-all leading-relaxed ${val ? (isActive ? "text-primary" : "text-foreground") : "text-muted-foreground/40"}`}>
                {val || "—"}
              </p>
              {base === 2 && val && (
                <p className="text-[10px] text-muted-foreground mt-1">{val.replace(/\s/g, "").length} bits</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick values */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Quick values</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_VALUES.map((q) => (
            <button
              key={q.label}
              onClick={() => loadQuick(q.decimal)}
              className={`px-2.5 py-1 rounded-md border text-xs font-mono transition-colors ${
                decimal === q.decimal
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

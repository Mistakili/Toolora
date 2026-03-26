import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Clock, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function formatDate(d: Date, zone: "local" | "utc"): Record<string, string> {
  const pad = (n: number) => String(n).padStart(2, "0");
  const y = zone === "utc" ? d.getUTCFullYear() : d.getFullYear();
  const mo = zone === "utc" ? d.getUTCMonth() + 1 : d.getMonth() + 1;
  const day = zone === "utc" ? d.getUTCDate() : d.getDate();
  const h = zone === "utc" ? d.getUTCHours() : d.getHours();
  const min = zone === "utc" ? d.getUTCMinutes() : d.getMinutes();
  const sec = zone === "utc" ? d.getUTCSeconds() : d.getSeconds();
  return {
    "ISO 8601": d.toISOString(),
    "UTC String": d.toUTCString(),
    "Local Date": `${y}-${pad(mo)}-${pad(day)}`,
    "Local Time": `${pad(h)}:${pad(min)}:${pad(sec)}`,
    "Full Local": `${y}-${pad(mo)}-${pad(day)} ${pad(h)}:${pad(min)}:${pad(sec)}`,
    "Relative": getRelative(d),
    "Day of Week": ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][d.getDay()],
    "Unix (ms)": String(d.getTime()),
  };
}

function getRelative(d: Date): string {
  const diff = Date.now() - d.getTime();
  const abs = Math.abs(diff);
  const suffix = diff > 0 ? "ago" : "from now";
  if (abs < 60000) return "just now";
  if (abs < 3600000) return `${Math.floor(abs / 60000)} min ${suffix}`;
  if (abs < 86400000) return `${Math.floor(abs / 3600000)} hr ${suffix}`;
  if (abs < 2592000000) return `${Math.floor(abs / 86400000)} days ${suffix}`;
  if (abs < 31536000000) return `${Math.floor(abs / 2592000000)} mo ${suffix}`;
  return `${Math.floor(abs / 31536000000)} yr ${suffix}`;
}

export default function TimestampConverter() {
  const [tsInput, setTsInput] = useState(String(Math.floor(Date.now() / 1000)));
  const [dateInput, setDateInput] = useState("");
  const [parsed, setParsed] = useState<Date | null>(new Date());
  const [error, setError] = useState("");
  const { toast } = useToast();

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const fromTs = () => {
    const n = Number(tsInput);
    if (isNaN(n)) { setError("Invalid timestamp"); setParsed(null); return; }
    const d = new Date(n > 9999999999 ? n : n * 1000);
    if (isNaN(d.getTime())) { setError("Invalid timestamp"); setParsed(null); return; }
    setError("");
    setParsed(d);
    setDateInput(d.toISOString().slice(0, 16));
  };

  const fromDate = () => {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) { setError("Invalid date"); setParsed(null); return; }
    setError("");
    setParsed(d);
    setTsInput(String(Math.floor(d.getTime() / 1000)));
  };

  const setNowTs = () => {
    const n = Math.floor(Date.now() / 1000);
    setTsInput(String(n));
    const d = new Date(Date.now());
    setParsed(d);
    setDateInput(d.toISOString().slice(0, 16));
    setError("");
  };

  const copy = (v: string) => {
    navigator.clipboard.writeText(v);
    toast({ title: "Copied!" });
  };

  const formats = parsed ? formatDate(parsed, "local") : null;

  return (
    <div className="space-y-6">
      {/* Live Clock */}
      <div className="bg-muted/30 rounded-2xl p-4 border border-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Clock className="w-4 h-4" />
          <span>Current Unix timestamp</span>
        </div>
        <div className="font-mono text-lg font-bold text-primary">
          {Math.floor(now / 1000)}
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Unix Timestamp</label>
          <div className="flex gap-2">
            <Input
              className="font-mono"
              placeholder="e.g. 1711497600"
              value={tsInput}
              onChange={(e) => setTsInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fromTs()}
            />
            <Button onClick={fromTs} size="sm">Convert</Button>
            <Button variant="outline" size="icon" onClick={setNowTs} title="Use current time">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Supports seconds and milliseconds</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Date & Time</label>
          <div className="flex gap-2">
            <Input
              type="datetime-local"
              className="font-mono"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
            />
            <Button onClick={fromDate} size="sm">Convert</Button>
          </div>
        </div>
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      {formats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(formats).map(([label, value]) => (
            <div
              key={label}
              className="group bg-muted/20 hover:bg-muted/40 border border-border rounded-xl p-4 flex items-start justify-between gap-3 transition-all cursor-pointer"
              onClick={() => copy(value)}
            >
              <div>
                <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">{label}</div>
                <div className="font-mono text-sm font-medium break-all">{value}</div>
              </div>
              <Copy className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

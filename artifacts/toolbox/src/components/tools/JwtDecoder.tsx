import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JwtParts {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

function base64UrlDecode(str: string): string {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/").padEnd(str.length + ((4 - (str.length % 4)) % 4), "=");
  return decodeURIComponent(
    atob(padded)
      .split("")
      .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("")
  );
}

function parseJwt(token: string): JwtParts | null {
  const parts = token.trim().split(".");
  if (parts.length !== 3) return null;
  try {
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    return { header, payload, signature: parts[2] };
  } catch {
    return null;
  }
}

function JsonBlock({ data }: { data: Record<string, unknown> }) {
  return (
    <pre className="bg-muted/50 rounded-xl p-4 text-xs font-mono overflow-x-auto text-foreground leading-relaxed border border-border">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

function ExpiryBadge({ exp }: { exp: unknown }) {
  if (typeof exp !== "number") return null;
  const now = Math.floor(Date.now() / 1000);
  const expired = exp < now;
  const date = new Date(exp * 1000).toLocaleString();
  const diff = Math.abs(exp - now);
  const hours = Math.floor(diff / 3600);
  const mins = Math.floor((diff % 3600) / 60);
  const label = expired
    ? `Expired ${hours}h ${mins}m ago (${date})`
    : `Expires in ${hours}h ${mins}m (${date})`;

  return (
    <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg border ${expired ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-green-500/10 border-green-500/30 text-green-400"}`}>
      {expired ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
      <Clock className="w-3.5 h-3.5 shrink-0" />
      <span>{label}</span>
    </div>
  );
}

export default function JwtDecoder() {
  const [input, setInput] = useState("");
  const { toast } = useToast();
  const parsed = input.trim() ? parseJwt(input.trim()) : null;
  const isInvalid = input.trim() && !parsed;

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${label} copied to clipboard.` });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">JWT Token</label>
        <Textarea
          className={`font-mono text-sm min-h-[100px] resize-none ${isInvalid ? "border-destructive" : ""}`}
          placeholder="Paste your JWT token here — eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        {isInvalid && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Invalid JWT — token must have exactly 3 dot-separated parts
          </p>
        )}
      </div>

      {parsed && (
        <div className="space-y-5">
          {/* Expiry status */}
          <ExpiryBadge exp={parsed.payload.exp} />

          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-violet-400 uppercase tracking-wider">Header</h3>
              <Button variant="ghost" size="sm" onClick={() => copy(JSON.stringify(parsed.header, null, 2), "Header")}>
                <Copy className="w-3 h-3 mr-2" /> Copy
              </Button>
            </div>
            <JsonBlock data={parsed.header} />
          </div>

          {/* Payload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">Payload</h3>
              <Button variant="ghost" size="sm" onClick={() => copy(JSON.stringify(parsed.payload, null, 2), "Payload")}>
                <Copy className="w-3 h-3 mr-2" /> Copy
              </Button>
            </div>
            <JsonBlock data={parsed.payload} />
          </div>

          {/* Signature */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-orange-400 uppercase tracking-wider">Signature</h3>
              <Button variant="ghost" size="sm" onClick={() => copy(parsed.signature, "Signature")}>
                <Copy className="w-3 h-3 mr-2" /> Copy
              </Button>
            </div>
            <p className="bg-muted/50 rounded-xl p-4 text-xs font-mono break-all border border-border text-muted-foreground">
              {parsed.signature}
            </p>
            <p className="text-xs text-muted-foreground">
              Signature verification requires your secret/public key — this tool only decodes the token, it does not validate it.
            </p>
          </div>
        </div>
      )}

      {!input && (
        <div className="bg-muted/30 rounded-xl p-5 border border-border space-y-2">
          <p className="text-sm font-medium">What is a JWT?</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            A JSON Web Token (JWT) is a compact, URL-safe token format used for authentication and data exchange. It has three base64url-encoded parts separated by dots: <span className="text-violet-400">Header</span> · <span className="text-blue-400">Payload</span> · <span className="text-orange-400">Signature</span>.
          </p>
          <p className="text-xs text-muted-foreground">
            The header and payload are readable by anyone — only the signature requires a secret key to verify. Never put sensitive data in a JWT payload unless it's encrypted.
          </p>
        </div>
      )}
    </div>
  );
}

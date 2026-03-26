import { useState, useMemo } from "react";
import CryptoJS from "crypto-js";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const hashes = useMemo(() => {
    if (!input) return null;
    return {
      MD5: CryptoJS.MD5(input).toString(),
      "SHA-1": CryptoJS.SHA1(input).toString(),
      "SHA-256": CryptoJS.SHA256(input).toString(),
      "SHA-512": CryptoJS.SHA512(input).toString(),
      "SHA-3": CryptoJS.SHA3(input).toString(),
    };
  }, [input]);

  const handleCopy = (hash: string, type: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(type);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      <div className="flex flex-col h-full space-y-4">
        <Label>Input Text</Label>
        <Textarea 
          placeholder="Type something to generate hashes instantly..."
          className="flex-1 min-h-[300px] resize-none p-4 rounded-xl font-mono text-sm bg-muted/20"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      
      <div className="space-y-6">
        <Label>Generated Hashes</Label>
        {!hashes ? (
          <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-border rounded-xl text-muted-foreground">
            Waiting for input...
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(hashes).map(([name, hash]) => (
              <div key={name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{name}</Label>
                </div>
                <div className="flex gap-2">
                  <Input 
                    readOnly 
                    value={hash} 
                    className="font-mono text-xs bg-muted/50 border-border"
                  />
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="shrink-0"
                    onClick={() => handleCopy(hash, name)}
                  >
                    {copiedHash === name ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

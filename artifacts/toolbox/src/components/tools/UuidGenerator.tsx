import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Copy, RefreshCw, Check } from "lucide-react";

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const newUuids = Array.from({ length: count }, () => uuidv4());
    setUuids(newUuids);
  };

  useEffect(() => {
    generate();
  }, [count]);

  const handleCopyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      
      <div className="bg-muted/30 p-6 rounded-2xl border border-border flex items-center justify-between gap-8">
        <div className="flex-1 space-y-4">
          <div className="flex justify-between">
            <Label className="font-semibold">Number of UUIDs to generate</Label>
            <span className="font-display font-bold text-primary">{count}</span>
          </div>
          <Slider 
            value={[count]} 
            onValueChange={(v) => setCount(v[0])} 
            min={1} max={100} step={1} 
          />
        </div>
        <Button size="lg" onClick={generate} className="rounded-full shadow-lg h-14 px-8">
          <RefreshCw className="w-5 h-5 mr-2" /> Regenerate
        </Button>
      </div>

      <div className="relative">
        <div className="absolute right-4 top-4 z-10">
          <Button variant="secondary" onClick={handleCopyAll} className="shadow-sm">
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />} Copy All
          </Button>
        </div>
        <Textarea 
          readOnly
          value={uuids.join('\n')}
          className="min-h-[400px] font-mono text-sm tracking-wide p-6 rounded-2xl leading-relaxed resize-none bg-background border-2"
        />
      </div>

    </div>
  );
}

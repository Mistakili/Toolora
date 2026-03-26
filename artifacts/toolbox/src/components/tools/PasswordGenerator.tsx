import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Copy, RefreshCw, Check } from "lucide-react";

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({
    upper: true,
    lower: true,
    numbers: true,
    symbols: true
  });
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const charset = {
      upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lower: "abcdefghijklmnopqrstuvwxyz",
      numbers: "0123456789",
      symbols: "!@#$%^&*()_+~`|}{[]:;?><,./-="
    };

    let available = "";
    if (opts.upper) available += charset.upper;
    if (opts.lower) available += charset.lower;
    if (opts.numbers) available += charset.numbers;
    if (opts.symbols) available += charset.symbols;

    if (!available) {
      setPassword("");
      return;
    }

    let generated = "";
    // Ensure at least one of each selected type
    if (opts.upper) generated += charset.upper[Math.floor(Math.random() * charset.upper.length)];
    if (opts.lower) generated += charset.lower[Math.floor(Math.random() * charset.lower.length)];
    if (opts.numbers) generated += charset.numbers[Math.floor(Math.random() * charset.numbers.length)];
    if (opts.symbols) generated += charset.symbols[Math.floor(Math.random() * charset.symbols.length)];

    for (let i = generated.length; i < length; i++) {
      generated += available[Math.floor(Math.random() * available.length)];
    }

    // Shuffle
    setPassword(generated.split('').sort(() => 0.5 - Math.random()).join(''));
  };

  useEffect(() => {
    generatePassword();
  }, [length, opts]);

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10 py-6">
      
      {/* Password Display */}
      <div className="relative group">
        <Input 
          readOnly 
          value={password}
          className="h-24 text-3xl md:text-4xl text-center font-mono font-medium rounded-2xl bg-muted/30 border-2 pr-20"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-background" onClick={generatePassword}>
            <RefreshCw className="w-5 h-5 text-muted-foreground" />
          </Button>
          <Button size="icon" className="rounded-full shadow-lg" onClick={handleCopy} disabled={!password}>
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Length Control */}
        <div className="space-y-6 bg-muted/20 p-6 rounded-2xl border border-border">
          <div className="flex justify-between items-center">
            <Label className="text-base font-semibold">Password Length</Label>
            <span className="text-2xl font-display font-bold text-primary">{length}</span>
          </div>
          <Slider 
            value={[length]} 
            onValueChange={(val) => setLength(val[0])} 
            min={8} max={64} step={1}
            className="py-4"
          />
        </div>

        {/* Options */}
        <div className="space-y-4 bg-muted/20 p-6 rounded-2xl border border-border">
          <Label className="text-base font-semibold block mb-4">Characters</Label>
          <div className="flex items-center justify-between">
            <Label htmlFor="upper" className="cursor-pointer">Uppercase (A-Z)</Label>
            <Switch id="upper" checked={opts.upper} onCheckedChange={(c) => setOpts({...opts, upper: c})} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="lower" className="cursor-pointer">Lowercase (a-z)</Label>
            <Switch id="lower" checked={opts.lower} onCheckedChange={(c) => setOpts({...opts, lower: c})} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="numbers" className="cursor-pointer">Numbers (0-9)</Label>
            <Switch id="numbers" checked={opts.numbers} onCheckedChange={(c) => setOpts({...opts, numbers: c})} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="symbols" className="cursor-pointer">Symbols (!@#$)</Label>
            <Switch id="symbols" checked={opts.symbols} onCheckedChange={(c) => setOpts({...opts, symbols: c})} />
          </div>
        </div>
      </div>
    </div>
  );
}

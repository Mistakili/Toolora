import { useEffect } from "react";
import { Link } from "wouter";
import { Puzzle, ChevronRight, Home, Download, MousePointer2, Search } from "lucide-react";

const STEPS = [
  {
    n: "1",
    title: "Download the extension files",
    desc: 'Click the button below to download the Toolora extension folder as a zip file, then unzip it somewhere permanent on your computer.'
  },
  {
    n: "2",
    title: "Open Chrome Extensions",
    desc: 'In Chrome (or any Chromium browser), navigate to chrome://extensions in your address bar.'
  },
  {
    n: "3",
    title: "Enable Developer Mode",
    desc: 'Toggle the "Developer mode" switch in the top-right corner of the Extensions page.'
  },
  {
    n: "4",
    title: 'Click "Load unpacked"',
    desc: 'Click the "Load unpacked" button and select the unzipped extension folder. The Toolora icon will appear in your toolbar.'
  },
];

export default function ExtensionPage() {
  useEffect(() => {
    document.title = "Browser Extension | Toolora";
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <nav className="flex items-center text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground transition-colors flex items-center"><Home className="w-4 h-4 mr-1" /> Home</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-foreground font-medium">Browser Extension</span>
      </nav>

      <div className="flex items-center gap-3 mb-4">
        <div className="bg-primary/10 p-3 rounded-xl text-primary">
          <Puzzle className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold">Browser Extension</h1>
          <p className="text-muted-foreground text-sm mt-1">Access all 20+ tools from any tab — instantly</p>
        </div>
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 mb-10">
        {[
          { icon: Search, label: "Quick search", desc: "Find any tool in 1 second" },
          { icon: MousePointer2, label: "Right-click", desc: "Select text → Send to tool" },
          { icon: Puzzle, label: "Lightweight", desc: "No tracking, just tools" },
        ].map((f) => (
          <div key={f.label} className="bg-muted/30 rounded-2xl p-4 border border-border text-center">
            <f.icon className="w-5 h-5 mx-auto mb-2 text-primary" />
            <div className="text-sm font-semibold">{f.label}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Install steps */}
      <h2 className="text-xl font-bold mb-4">How to install</h2>
      <div className="space-y-4 mb-8">
        {STEPS.map((step) => (
          <div key={step.n} className="flex gap-4 p-4 rounded-2xl border border-border bg-card">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center shrink-0">{step.n}</div>
            <div>
              <div className="font-medium">{step.title}</div>
              <div className="text-sm text-muted-foreground mt-1">{step.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-muted/30 border border-border rounded-2xl p-5 text-sm text-muted-foreground">
        <p className="font-medium text-foreground mb-1">Note — Developer install</p>
        <p>This extension is not yet listed on the Chrome Web Store, so you'll install it manually using Developer Mode. This is safe and standard practice for testing extensions.</p>
      </div>
    </div>
  );
}

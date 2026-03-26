import { useState } from "react";
import { Share2, Link, Code2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareModalProps {
  toolName: string;
  toolUrl: string;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1.5"
    >
      {copied ? <><Check className="w-3 h-3" /> Copied!</> : "Copy"}
    </button>
  );
}

export function ShareModal({ toolName, toolUrl }: ShareModalProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"link" | "embed">("link");

  const embedCode = `<iframe
  src="${toolUrl}"
  width="100%"
  height="640"
  frameborder="0"
  style="border-radius:16px;border:1px solid #e2e8f0;"
  title="${toolName} — Toolora"
></iframe>`;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => setOpen(true)}
      >
        <Share2 className="w-4 h-4" />
        Share
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div>
                <h2 className="font-semibold text-lg">Share {toolName}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Share a direct link or embed this tool on your site</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border px-5 pt-4 gap-1">
              {(["link", "embed"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
                    tab === t
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t === "link" ? <><Link className="w-3.5 h-3.5" /> Direct Link</> : <><Code2 className="w-3.5 h-3.5" /> Embed Code</>}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {tab === "link" ? (
                <>
                  <p className="text-sm text-muted-foreground">Send this URL directly to anyone — no account required.</p>
                  <div className="flex items-center gap-2 bg-muted rounded-xl p-3 font-mono text-xs break-all">
                    <span className="flex-1 text-foreground">{toolUrl}</span>
                    <CopyButton text={toolUrl} />
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">Embed this tool directly on your website or documentation. It works in any HTML page.</p>
                  <div className="bg-muted rounded-xl p-4 font-mono text-xs text-muted-foreground whitespace-pre leading-relaxed overflow-x-auto">
                    {embedCode}
                  </div>
                  <CopyButton text={embedCode} />
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-xs text-muted-foreground">
                    All processing happens inside your visitor's browser — no data leaves their device when they use the embedded tool.
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

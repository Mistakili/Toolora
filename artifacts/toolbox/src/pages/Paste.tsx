import { useEffect, useState } from "react";
import { useParams } from "wouter";

interface PasteData {
  id: string;
  content: string;
  title: string | null;
  language: string | null;
  createdAt: string;
  expiresAt: string | null;
}

export default function Paste() {
  const { id } = useParams<{ id: string }>();
  const [paste, setPaste] = useState<PasteData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    document.title = "Toolora Paste";
    fetch(`/api/paste/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error(r.status === 404 ? "Paste not found or expired." : "Failed to load paste.");
        return r.json() as Promise<PasteData>;
      })
      .then((data) => {
        setPaste(data);
        document.title = data.title ? `${data.title} — Toolora Paste` : "Toolora Paste";
      })
      .catch((e: Error) => setError(e.message));
  }, [id]);

  const handleCopy = async () => {
    if (!paste) return;
    await navigator.clipboard.writeText(paste.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="text-4xl">🔍</div>
          <h1 className="text-xl font-bold">Paste not found</h1>
          <p className="text-muted-foreground">{error}</p>
          <a href="/" className="text-primary hover:underline text-sm">← Back to Toolora</a>
        </div>
      </div>
    );
  }

  if (!paste) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground animate-pulse text-sm">Loading paste…</div>
      </div>
    );
  }

  const expiresDate = paste.expiresAt ? new Date(paste.expiresAt) : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <a href="/" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
            ← Toolora
          </a>
          <span className="text-xs text-muted-foreground">
            {expiresDate ? `Expires ${expiresDate.toLocaleDateString()}` : ""}
          </span>
        </div>

        <div className="border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-muted/40 border-b border-border">
            <div>
              <h1 className="font-semibold text-sm">
                {paste.title || `Paste ${paste.id}`}
              </h1>
              {paste.language && (
                <span className="text-xs text-muted-foreground">{paste.language}</span>
              )}
            </div>
            <button
              onClick={handleCopy}
              className="text-xs px-3 py-1.5 rounded-md border border-border hover:bg-muted transition-colors font-medium"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre className="p-4 text-sm font-mono whitespace-pre-wrap break-words leading-relaxed overflow-auto max-h-[70vh] bg-background">
            {paste.content}
          </pre>
        </div>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          Shared via{" "}
          <a href="/" className="hover:text-foreground transition-colors">Toolora</a>
          {" "}· Created by Claude MCP
        </p>
      </div>
    </div>
  );
}

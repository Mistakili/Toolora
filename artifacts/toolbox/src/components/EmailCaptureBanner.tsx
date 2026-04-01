import { useState } from "react";
import { Mail, X, CheckCircle2, Loader2 } from "lucide-react";

interface EmailCaptureBannerProps {
  toolName: string;
  source?: string;
}

export default function EmailCaptureBanner({ toolName, source = "tool-page" }: EmailCaptureBannerProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem("email_banner_dismissed") === "1"; } catch { return false; }
  });
  const [alreadySubscribed] = useState(() => {
    try { return localStorage.getItem("email_subscribed") === "1"; } catch { return false; }
  });

  if (dismissed || alreadySubscribed || state === "success") return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setState("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: `${source}:${toolName}` }),
      });
      if (res.ok) {
        setState("success");
        try { localStorage.setItem("email_subscribed", "1"); } catch {}
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  };

  const dismiss = () => {
    setDismissed(true);
    try { localStorage.setItem("email_banner_dismissed", "1"); } catch {}
  };

  return (
    <div className="mt-8 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 to-violet-500/5 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">Get new tools first</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            We ship new tools weekly. No spam — just a short note when something new drops.
          </p>
          <form onSubmit={handleSubmit} className="mt-3 flex gap-2 max-w-sm">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 min-w-0 rounded-md border border-border bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              disabled={state === "loading"}
              required
            />
            <button
              type="submit"
              disabled={state === "loading" || !email.trim()}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {state === "loading" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              {state === "loading" ? "..." : "Notify me"}
            </button>
          </form>
          {state === "error" && (
            <p className="mt-1.5 text-xs text-red-400">Something went wrong. Try again?</p>
          )}
        </div>
        <button
          onClick={dismiss}
          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors mt-0.5"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

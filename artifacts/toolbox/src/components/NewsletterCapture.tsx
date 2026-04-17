import { useState } from "react";
import { Mail, Check, Loader2 } from "lucide-react";

const API = (import.meta.env.VITE_API_URL as string | undefined) ?? "";

interface Props {
  source?: string;
  variant?: "card" | "inline";
  category?: string;
}

export function NewsletterCapture({ source = "mcp-weekly", variant = "card", category }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const r = await fetch(API + "/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: category ? `${source}:${category}` : source }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Subscription failed");
      setStatus("success");
      setMsg(data.message || "Subscribed! Check your inbox Monday.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMsg(err instanceof Error ? err.message : "Couldn't subscribe — try again.");
    }
  };

  if (variant === "inline") {
    return (
      <form onSubmit={submit} className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com" disabled={status === "loading" || status === "success"}
            className="w-full rounded-lg bg-zinc-900 border border-zinc-800 pl-9 pr-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-violet-500/60 outline-none disabled:opacity-60"
          />
        </div>
        <button
          type="submit" disabled={status === "loading" || status === "success"}
          className="rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white px-4 py-2.5 text-sm font-semibold inline-flex items-center gap-1.5 whitespace-nowrap"
        >
          {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : status === "success" ? <Check className="w-4 h-4" /> : "Subscribe"}
        </button>
      </form>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-950/40 to-zinc-900/60 p-6 md:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(217,70,239,0.15),transparent_50%)]" />
      <div className="relative">
        <div className="flex items-center gap-2 text-violet-400 text-xs font-semibold uppercase tracking-widest mb-2">
          <Mail className="w-3.5 h-3.5" /> MCP Weekly
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-zinc-100 mb-2">
          {category ? `New ${category} MCP servers, every Monday.` : "Top 5 new MCP servers, every Monday."}
        </h3>
        <p className="text-sm text-zinc-400 mb-5 max-w-lg">
          The 1-line install commands, what they do, and which ones are actually worth your time. Curated by Toolora.
          {" "}<span className="text-zinc-500">Free. No spam. Unsubscribe anytime.</span>
        </p>
        <form onSubmit={submit} className="flex gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[220px]">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" disabled={status === "loading" || status === "success"}
              className="w-full rounded-lg bg-zinc-950/70 border border-zinc-800 pl-9 pr-3 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-violet-500/60 outline-none disabled:opacity-60"
            />
          </div>
          <button
            type="submit" disabled={status === "loading" || status === "success"}
            className="rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-60 text-white px-5 py-3 text-sm font-semibold inline-flex items-center gap-1.5"
          >
            {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : status === "success" ? <><Check className="w-4 h-4" /> Subscribed</> : "Get the newsletter"}
          </button>
        </form>
        {msg && (
          <p className={"text-xs mt-3 " + (status === "success" ? "text-green-400" : "text-rose-400")}>{msg}</p>
        )}
      </div>
    </div>
  );
}

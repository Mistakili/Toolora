import { useState, useCallback } from "react";
import { Copy, Check, AlertCircle, Globe, Twitter, Linkedin, MessageSquare } from "lucide-react";

interface OGFields {
  title: string;
  description: string;
  imageUrl: string;
  siteName: string;
  pageUrl: string;
  twitterHandle: string;
  cardType: "summary" | "summary_large_image";
}

const TITLE_MAX = 60;
const DESC_MAX = 160;

function CharCounter({ value, max }: { value: string; max: number }) {
  const len = value.length;
  const over = len > max;
  const near = len > max * 0.85;
  return (
    <span className={`text-xs ml-2 ${over ? "text-red-500 font-semibold" : near ? "text-amber-500" : "text-muted-foreground"}`}>
      {len}/{max}
    </span>
  );
}

function TwitterCard({ fields, large }: { fields: OGFields; large?: boolean }) {
  const img = fields.imageUrl || "https://placehold.co/1200x630/1a1a2e/6d28d9?text=OG+Image";
  return (
    <div className="rounded-2xl border border-[#2f3336] bg-black text-white overflow-hidden max-w-md">
      {large ? (
        <img src={img} alt="OG" className="w-full aspect-[1200/630] object-cover bg-zinc-900" onError={e => { (e.target as HTMLImageElement).src = "https://placehold.co/1200x630/1a1a2e/6d28d9?text=Image+Not+Found"; }} />
      ) : (
        <div className="flex">
          <img src={img} alt="OG" className="w-24 h-24 object-cover bg-zinc-900 shrink-0" onError={e => { (e.target as HTMLImageElement).src = "https://placehold.co/120x120/1a1a2e/6d28d9?text=Img"; }} />
          <div className="p-3 min-w-0">
            <p className="text-xs text-zinc-500 truncate">{fields.pageUrl || "yoursite.com"}</p>
            <p className="text-sm font-bold leading-snug line-clamp-1 mt-0.5">{fields.title || "Your Page Title"}</p>
            <p className="text-xs text-zinc-400 line-clamp-2 mt-0.5">{fields.description || "Your page description will appear here."}</p>
          </div>
        </div>
      )}
      {large && (
        <div className="p-3">
          <p className="text-xs text-zinc-500 truncate">{fields.pageUrl || "yoursite.com"}</p>
          <p className="text-sm font-bold leading-snug line-clamp-1 mt-0.5">{fields.title || "Your Page Title"}</p>
          <p className="text-xs text-zinc-400 line-clamp-2 mt-0.5">{fields.description || "Your page description will appear here."}</p>
        </div>
      )}
    </div>
  );
}

function LinkedInCard({ fields }: { fields: OGFields }) {
  const img = fields.imageUrl || "https://placehold.co/1200x630/0a66c2/ffffff?text=OG+Image";
  return (
    <div className="rounded border border-[#ddd] bg-white text-[#1c1e21] overflow-hidden max-w-md shadow-sm">
      <img src={img} alt="OG" className="w-full aspect-[1200/630] object-cover bg-slate-100" onError={e => { (e.target as HTMLImageElement).src = "https://placehold.co/1200x630/0a66c2/ffffff?text=Image+Not+Found"; }} />
      <div className="p-3 bg-[#f3f2ef] border-t border-[#ddd]">
        <p className="text-sm font-semibold leading-snug line-clamp-2">{fields.title || "Your Page Title"}</p>
        <p className="text-xs text-[#666] mt-1 truncate">{fields.siteName || fields.pageUrl || "yoursite.com"}</p>
      </div>
    </div>
  );
}

function SlackCard({ fields }: { fields: OGFields }) {
  const img = fields.imageUrl || "";
  return (
    <div className="rounded bg-[#1a1d21] text-white overflow-hidden max-w-md border border-[#3f444d]">
      <div className="flex gap-3 p-3">
        <div className="w-0.5 bg-[#36c5f0] rounded-full shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#1d9bd1] truncate">{fields.siteName || fields.pageUrl || "yoursite.com"}</p>
          <p className="text-sm font-semibold leading-snug mt-0.5 line-clamp-1">{fields.title || "Your Page Title"}</p>
          <p className="text-xs text-[#a8b0ba] line-clamp-2 mt-0.5">{fields.description || "Your page description will appear here."}</p>
          {img && (
            <img src={img} alt="OG" className="mt-2 rounded max-h-32 object-cover bg-zinc-800" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
          )}
        </div>
      </div>
    </div>
  );
}

function FacebookCard({ fields }: { fields: OGFields }) {
  const img = fields.imageUrl || "https://placehold.co/1200x630/1877f2/ffffff?text=OG+Image";
  const domain = (() => { try { return new URL(fields.pageUrl || "https://yoursite.com").hostname.replace("www.", ""); } catch { return fields.pageUrl || "yoursite.com"; } })();
  return (
    <div className="rounded overflow-hidden max-w-md border border-[#dddfe2]">
      <img src={img} alt="OG" className="w-full aspect-[1200/630] object-cover bg-slate-100" onError={e => { (e.target as HTMLImageElement).src = "https://placehold.co/1200x630/1877f2/ffffff?text=Image+Not+Found"; }} />
      <div className="p-3 bg-[#f0f2f5]">
        <p className="text-xs text-[#65676b] uppercase tracking-wide">{domain}</p>
        <p className="text-sm font-bold leading-snug line-clamp-2 text-[#1c1e21] mt-0.5">{fields.title || "Your Page Title"}</p>
        <p className="text-xs text-[#65676b] line-clamp-1 mt-0.5">{fields.description || "Your page description."}</p>
      </div>
    </div>
  );
}

export default function OgPreview() {
  const [fields, setFields] = useState<OGFields>({
    title: "",
    description: "",
    imageUrl: "",
    siteName: "",
    pageUrl: "",
    twitterHandle: "",
    cardType: "summary_large_image",
  });
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<"twitter" | "linkedin" | "slack" | "facebook">("twitter");

  const set = useCallback((k: keyof OGFields, v: string) => setFields(f => ({ ...f, [k]: v })), []);

  const metaTags = `<!-- Open Graph -->
<meta property="og:title" content="${fields.title || "Your Page Title"}" />
<meta property="og:description" content="${fields.description || "Your page description."}" />
<meta property="og:image" content="${fields.imageUrl || "https://yoursite.com/og-image.png"}" />
<meta property="og:url" content="${fields.pageUrl || "https://yoursite.com"}" />
<meta property="og:type" content="website" />${fields.siteName ? `\n<meta property="og:site_name" content="${fields.siteName}" />` : ""}

<!-- Twitter / X -->
<meta name="twitter:card" content="${fields.cardType}" />
<meta name="twitter:title" content="${fields.title || "Your Page Title"}" />
<meta name="twitter:description" content="${fields.description || "Your page description."}" />
<meta name="twitter:image" content="${fields.imageUrl || "https://yoursite.com/og-image.png"}" />${fields.twitterHandle ? `\n<meta name="twitter:site" content="@${fields.twitterHandle.replace(/^@/, "")}" />` : ""}`;

  function copyTags() {
    navigator.clipboard.writeText(metaTags).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const tabs = [
    { id: "twitter" as const, label: "Twitter / X", Icon: Twitter },
    { id: "linkedin" as const, label: "LinkedIn", Icon: Linkedin },
    { id: "slack" as const, label: "Slack", Icon: MessageSquare },
    { id: "facebook" as const, label: "Facebook", Icon: Globe },
  ];

  const warnings: string[] = [];
  if (fields.title && fields.title.length > TITLE_MAX) warnings.push(`Title is ${fields.title.length - TITLE_MAX} chars over the recommended ${TITLE_MAX}.`);
  if (fields.description && fields.description.length > DESC_MAX) warnings.push(`Description is ${fields.description.length - DESC_MAX} chars over the recommended ${DESC_MAX}.`);
  if (!fields.imageUrl) warnings.push("No image URL — social cards will show no image.");
  if (!fields.title) warnings.push("No title set.");

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Page URL <span className="text-muted-foreground font-normal text-xs">(for display only)</span>
            </label>
            <input
              type="url"
              placeholder="https://yoursite.com/your-page"
              value={fields.pageUrl}
              onChange={e => set("pageUrl", e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 flex items-center">
              og:title
              <CharCounter value={fields.title} max={TITLE_MAX} />
            </label>
            <input
              type="text"
              placeholder="Your Page Title"
              value={fields.title}
              maxLength={120}
              onChange={e => set("title", e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 flex items-center">
              og:description
              <CharCounter value={fields.description} max={DESC_MAX} />
            </label>
            <textarea
              placeholder="A short description of your page (up to 160 characters)."
              value={fields.description}
              maxLength={300}
              rows={3}
              onChange={e => set("description", e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">og:image URL <span className="text-muted-foreground font-normal text-xs">(recommended: 1200×630px)</span></label>
            <input
              type="url"
              placeholder="https://yoursite.com/og-image.png"
              value={fields.imageUrl}
              onChange={e => set("imageUrl", e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">og:site_name</label>
              <input
                type="text"
                placeholder="Your Site"
                value={fields.siteName}
                onChange={e => set("siteName", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Twitter @handle</label>
              <input
                type="text"
                placeholder="@yourhandle"
                value={fields.twitterHandle}
                onChange={e => set("twitterHandle", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Twitter card type</label>
            <div className="flex gap-2">
              {(["summary_large_image", "summary"] as const).map(ct => (
                <button
                  key={ct}
                  onClick={() => set("cardType", ct)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${fields.cardType === ct ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}
                >
                  {ct === "summary_large_image" ? "Large Image" : "Summary (small)"}
                </button>
              ))}
            </div>
          </div>
          {warnings.length > 0 && (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 space-y-1">
              {warnings.map((w, i) => (
                <p key={i} className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  {w}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Right: live preview */}
        <div className="space-y-3">
          <div className="flex gap-1 flex-wrap">
            {tabs.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${tab === id ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}
              >
                <Icon className="w-3 h-3" />
                {label}
              </button>
            ))}
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-4 flex items-center justify-center min-h-48">
            {tab === "twitter" && <TwitterCard fields={fields} large={fields.cardType === "summary_large_image"} />}
            {tab === "linkedin" && <LinkedInCard fields={fields} />}
            {tab === "slack" && <SlackCard fields={fields} />}
            {tab === "facebook" && <FacebookCard fields={fields} />}
          </div>
        </div>
      </div>

      {/* Generated code */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Generated Meta Tags</label>
          <button
            onClick={copyTags}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:border-primary/50 hover:bg-muted transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy HTML"}
          </button>
        </div>
        <pre className="rounded-xl bg-[#0d1117] border border-border text-green-400/90 text-xs font-mono p-4 overflow-x-auto whitespace-pre-wrap leading-relaxed">
          {metaTags}
        </pre>
      </div>
    </div>
  );
}

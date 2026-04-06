import { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { ChevronRight, Home, ShieldCheck, Sparkles } from "lucide-react";
import { ShareModal } from "@/components/shared/ShareModal";
import { getToolBySlug, getCategoryById, getToolsByCategory } from "@/lib/tools-config";
import NotFound from "./not-found";
import { useTrackToolUsage } from "@workspace/api-client-react";
import { useSEO } from "@/hooks/useSEO";
import EmailCaptureBanner from "@/components/EmailCaptureBanner";

// Tool Implementations
import WordCounter from "@/components/tools/WordCounter";
import CaseConverter from "@/components/tools/CaseConverter";
import QrGenerator from "@/components/tools/QrGenerator";
import PasswordGenerator from "@/components/tools/PasswordGenerator";
import UuidGenerator from "@/components/tools/UuidGenerator";
import HashGenerator from "@/components/tools/HashGenerator";
import JsonFormatter from "@/components/tools/JsonFormatter";
import MarkdownPreview from "@/components/tools/MarkdownPreview";
import Base64 from "@/components/tools/Base64";
import UrlEncoder from "@/components/tools/UrlEncoder";
import LoremIpsum from "@/components/tools/LoremIpsum";
import TextDiff from "@/components/tools/TextDiff";
import UnitConverter from "@/components/tools/UnitConverter";
import ColorPicker from "@/components/tools/ColorPicker";
import TimestampConverter from "@/components/tools/TimestampConverter";
import ImageResize from "@/components/tools/ImageResize";
import ImageCompress from "@/components/tools/ImageCompress";
import ImageConvert from "@/components/tools/ImageConvert";
import PdfMerge from "@/components/tools/PdfMerge";
import PdfSplit from "@/components/tools/PdfSplit";
import JwtDecoder from "@/components/tools/JwtDecoder";
import RegexTester from "@/components/tools/RegexTester";
import TextSorter from "@/components/tools/TextSorter";
import HtmlEntities from "@/components/tools/HtmlEntities";
import TokenCounter from "@/components/tools/TokenCounter";
import YamlJsonConverter from "@/components/tools/YamlJsonConverter";
import CronParser from "@/components/tools/CronParser";
import NumberBaseConverter from "@/components/tools/NumberBaseConverter";
import StringEscape from "@/components/tools/StringEscape";
import TextToSlug from "@/components/tools/TextToSlug";
import CssGradientGenerator from "@/components/tools/CssGradientGenerator";
import ReadabilityScore from "@/components/tools/ReadabilityScore";
import HtmlMinifier from "@/components/tools/HtmlMinifier";
import SvgOptimizer from "@/components/tools/SvgOptimizer";
import MarkdownToHtml from "@/components/tools/MarkdownToHtml";
import OgPreview from "@/components/tools/OgPreview";
import DocxEditor from "@/components/tools/DocxEditor";
import TextChunker from "@/components/tools/TextChunker";
import HtmlToMarkdown from "@/components/tools/HtmlToMarkdown";
import DataExtractor from "@/components/tools/DataExtractor";
import DocMemoryLoader from "@/components/tools/DocMemoryLoader";

// ── Per-category SEO content blocks ─────────────────────────────────────────

const CATEGORY_CONTENT: Record<string, { intro: string; bullets: { label: string; text: string }[]; faqs?: { q: string; a: string }[] }> = {
  text: {
    intro: "All text processing runs entirely inside your browser using JavaScript. Nothing you type is ever sent over the network — there are no servers receiving your content, no analytics tracking your input, and no file storage.",
    bullets: [
      { label: "Instant", text: "Results update as you type — no button to click, no delay." },
      { label: "Private", text: "Your text never leaves your device. Even your clipboard is not read without action." },
      { label: "Offline-capable", text: "Works with no internet once the page has loaded." },
    ],
    faqs: [
      { q: "Is there a character or word limit?", a: "No. The tool runs in your browser and is only limited by your device's available memory, which is typically several hundred megabytes of text." },
      { q: "Does Toolora store my text?", a: "No. All processing is client-side JavaScript. We have no server that receives your input." },
    ],
  },
  developer: {
    intro: "Every operation runs locally in your browser — no API calls, no data sent to external services. This makes the tools suitable for sensitive data like API keys, credentials, and internal JSON payloads.",
    bullets: [
      { label: "Zero data exposure", text: "Cryptographic operations, encoding, and formatting all happen client-side." },
      { label: "No rate limits", text: "Run thousands of operations without throttling — it's all local compute." },
      { label: "Standard compliant", text: "Implementations follow RFC specifications and browser-native APIs." },
    ],
    faqs: [
      { q: "Are the hashing and encoding algorithms standard?", a: "Yes. Hash Generator uses the Web Crypto API (SHA-256, SHA-1) and a JavaScript MD5 implementation. Base64 uses the browser's atob/btoa. All follow established standards." },
      { q: "Can I use these tools with confidential data?", a: "Yes. No data is transmitted. All computation is done in your browser tab." },
    ],
  },
  productivity: {
    intro: "These tools are built for speed. Whether you need a QR code for a presentation, a strong password for a new account, or a quick unit conversion, results appear instantly with no signup and no waiting.",
    bullets: [
      { label: "No account needed", text: "Open the tool, get your result. Nothing to install or register." },
      { label: "Exportable output", text: "Download QR codes as PNG, copy passwords to clipboard, or share results directly." },
      { label: "Always free", text: "These tools are free forever — no trial period, no freemium limits." },
    ],
    faqs: [
      { q: "Can I download the output?", a: "Yes. QR codes export as PNG, colors copy as HEX/RGB/HSL, and all text results can be copied with one click." },
      { q: "How secure is the password generator?", a: "It uses the browser's cryptographically secure random number generator (crypto.getRandomValues), the same API used by password managers." },
    ],
  },
  image: {
    intro: "Images are processed entirely in your browser using the Canvas API. Your photos, screenshots, and graphics are never uploaded to a server — not even temporarily. This is critical for personal photos, confidential screenshots, and documents.",
    bullets: [
      { label: "True privacy", text: "Image data stays on your device at all times. We have no image server." },
      { label: "Supports all common formats", text: "JPEG, PNG, WebP, GIF, BMP — load any and export to your target format." },
      { label: "Lossless options available", text: "Choose quality level for compression or convert to a lossless format like PNG." },
    ],
    faqs: [
      { q: "Is there a maximum file size?", a: "There is no server-imposed limit. Very large images (>50MB) may be slower because processing happens in-browser, but there is no hard cap." },
      { q: "Does compression reduce visual quality?", a: "It depends on the quality slider setting. At 85%+ quality, differences are typically invisible to the human eye." },
    ],
  },
  pdf: {
    intro: "PDF operations use pdf-lib, a JavaScript PDF library that runs entirely in your browser. Your files are never uploaded — not even to a CDN or temporary storage. This is important for legal documents, financial records, and confidential reports.",
    bullets: [
      { label: "Client-side PDF engine", text: "pdf-lib handles merge, split, and page extraction without any server involvement." },
      { label: "No file size limit", text: "Process PDFs of any size — the limit is your browser's available RAM." },
      { label: "Preserves formatting", text: "Fonts, images, and vector graphics are maintained through all operations." },
    ],
    faqs: [
      { q: "Do my PDFs ever leave my device?", a: "No. All PDF processing uses pdf-lib running in your browser tab. Nothing is uploaded." },
      { q: "Can I merge password-protected PDFs?", a: "Password-protected PDFs need to be unlocked first — the browser's PDF tools cannot bypass encryption by design." },
    ],
  },
};

function SeoContent({ tool }: { tool: { name: string; category: string; seoDescription: string } }) {
  const content = CATEGORY_CONTENT[tool.category];
  if (!content) return null;

  return (
    <div className="pt-10 border-t border-border space-y-8">
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h2 className="text-xl font-bold">About this {tool.name}</h2>
        <p className="text-muted-foreground">{content.intro}</p>
        <ul className="mt-4 space-y-1 list-none pl-0">
          {content.bullets.map((b) => (
            <li key={b.label} className="flex gap-2 text-sm">
              <span className="font-semibold text-foreground shrink-0">{b.label}:</span>
              <span className="text-muted-foreground">{b.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {content.faqs && content.faqs.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {content.faqs.map((faq) => (
              <div key={faq.q} className="bg-muted/30 rounded-xl p-5 border border-border">
                <p className="font-semibold text-sm mb-1">{faq.q}</p>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const TOOL_COMPONENTS: Record<string, React.ComponentType<any>> = {
  "word-counter": WordCounter,
  "case-converter": CaseConverter,
  "qr-generator": QrGenerator,
  "password-generator": PasswordGenerator,
  "uuid-generator": UuidGenerator,
  "hash-generator": HashGenerator,
  "json-formatter": JsonFormatter,
  "markdown-preview": MarkdownPreview,
  "base64": Base64,
  "url-encoder": UrlEncoder,
  "lorem-ipsum": LoremIpsum,
  "text-diff": TextDiff,
  "unit-converter": UnitConverter,
  "color-picker": ColorPicker,
  "timestamp-converter": TimestampConverter,
  "image-resize": ImageResize,
  "image-compress": ImageCompress,
  "image-convert": ImageConvert,
  "pdf-merge": PdfMerge,
  "pdf-split": PdfSplit,
  "jwt-decoder": JwtDecoder,
  "regex-tester": RegexTester,
  "text-sorter": TextSorter,
  "html-entities": HtmlEntities,
  "token-counter": TokenCounter,
  "yaml-json-converter": YamlJsonConverter,
  "cron-parser": CronParser,
  "number-base-converter": NumberBaseConverter,
  "string-escape": StringEscape,
  "text-to-slug": TextToSlug,
  "css-gradient-generator": CssGradientGenerator,
  "readability-score": ReadabilityScore,
  "html-minifier": HtmlMinifier,
  "svg-optimizer": SvgOptimizer,
  "markdown-to-html": MarkdownToHtml,
  "og-preview": OgPreview,
  "docx-editor": DocxEditor,
  "text-chunker": TextChunker,
  "html-to-markdown": HtmlToMarkdown,
  "data-extractor": DataExtractor,
  "doc-memory-loader": DocMemoryLoader,
};

export default function ToolView() {
  const [match, params] = useRoute("/tools/:category/:slug");
  const trackMutation = useTrackToolUsage();
  
  if (!match || !params.category || !params.slug) return <NotFound />;
  
  const tool = getToolBySlug(params.slug);
  const category = getCategoryById(params.category);
  
  if (!tool || !category) return <NotFound />;

  const BASE = "https://toolora.dev";
  const toolUrl = `${BASE}/tools/${tool.category}/${tool.slug}`;
  const catContent = CATEGORY_CONTENT[tool.category];
  const faqs = catContent?.faqs ?? [];

  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: tool.name,
      description: tool.seoDescription,
      url: toolUrl,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      provider: { "@type": "Organization", name: "Toolora", url: BASE },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE },
          { "@type": "ListItem", position: 2, name: `${tool.category.charAt(0).toUpperCase() + tool.category.slice(1)} Tools`, item: `${BASE}/tools/${tool.category}` },
          { "@type": "ListItem", position: 3, name: tool.name, item: toolUrl },
        ],
      },
    },
    ...(faqs.length > 0 ? [{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map(f => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    }] : []),
  ];

  useSEO({
    title: tool.seoTitle.replace(" | Toolora", ""),
    description: tool.seoDescription,
    canonical: toolUrl,
    jsonLd: jsonLd.length === 1 ? jsonLd[0] : { "@context": "https://schema.org", "@graph": jsonLd.map(j => { const { "@context": _, ...rest } = j as Record<string, unknown>; return rest; }) },
  });

  // Fire usage tracking once per visit
  useEffect(() => {
    trackMutation.mutate({ slug: tool.slug });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tool.slug]);

  const ToolComponent = TOOL_COMPONENTS[tool.slug];
  const relatedTools = getToolsByCategory(tool.category).filter(t => t.id !== tool.id).slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground transition-colors flex items-center"><Home className="w-4 h-4 mr-1" /> Home</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link href={`/tools/${category.id}`} className="hover:text-foreground transition-colors">{category.name}</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-foreground font-medium">{tool.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Tool Area */}
        <div className="lg:col-span-3 space-y-8">
          
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">{tool.name}</h1>
              <p className="text-lg text-muted-foreground">{tool.description}</p>
            </div>
            <div className="shrink-0 flex flex-col sm:flex-row items-end sm:items-center gap-2">
              {tool.id === "data-extractor" ? (
                <div className="hidden sm:flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-xl text-sm border border-primary/20">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>AI-Powered</span>
                </div>
              ) : tool.id === "doc-memory-loader" ? (
                <div className="hidden sm:flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-xl text-sm border border-primary/20">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>Saves to Memory</span>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-xl text-sm border border-border">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span>Processed Locally</span>
                </div>
              )}
              <ShareModal toolName={tool.name} toolUrl={window.location.href} />
            </div>
          </div>

          <div className="bg-card border border-border/50 shadow-2xl shadow-black/5 rounded-3xl p-6 md:p-8 min-h-[500px]">
            {ToolComponent ? (
              <ToolComponent />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground min-h-[400px]">
                <tool.icon className="w-16 h-16 opacity-20 mb-4" />
                <p className="text-lg">This tool is currently under construction.</p>
              </div>
            )}
          </div>
          
          {/* SEO Content Section beneath tool */}
          <SeoContent tool={tool} />

          {/* Email capture */}
          <EmailCaptureBanner toolName={tool.name} source="tool-page" />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-muted/30 rounded-2xl p-6 border border-border">
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Related {category.name}</h3>
            <div className="space-y-3">
              {relatedTools.map(t => (
                <Link key={t.id} href={`/tools/${t.category}/${t.slug}`}>
                  <div className="group flex items-center gap-3 p-3 rounded-xl hover:bg-background border border-transparent hover:border-border transition-all cursor-pointer">
                    <div className="bg-primary/10 text-primary p-2 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <t.icon className="w-4 h-4" />
                    </div>
                    <div className="text-sm font-medium group-hover:text-primary transition-colors">{t.name}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

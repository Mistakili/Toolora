import { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { ChevronRight, Home, ShieldCheck } from "lucide-react";
import { getToolBySlug, getCategoryById, getToolsByCategory } from "@/lib/tools-config";
import NotFound from "./not-found";
import { useTrackToolUsage } from "@workspace/api-client-react";

// Tool Implementations
import WordCounter from "@/components/tools/WordCounter";
import CaseConverter from "@/components/tools/CaseConverter";
import QrGenerator from "@/components/tools/QrGenerator";
import PasswordGenerator from "@/components/tools/PasswordGenerator";
import UuidGenerator from "@/components/tools/UuidGenerator";
import HashGenerator from "@/components/tools/HashGenerator";
import JsonFormatter from "@/components/tools/JsonFormatter";
import MarkdownPreview from "@/components/tools/MarkdownPreview";

const TOOL_COMPONENTS: Record<string, React.ComponentType<any>> = {
  "word-counter": WordCounter,
  "case-converter": CaseConverter,
  "qr-generator": QrGenerator,
  "password-generator": PasswordGenerator,
  "uuid-generator": UuidGenerator,
  "hash-generator": HashGenerator,
  "json-formatter": JsonFormatter,
  "markdown-preview": MarkdownPreview,
  // Add other mappings here as built
};

export default function ToolView() {
  const [match, params] = useRoute("/tools/:category/:slug");
  const trackMutation = useTrackToolUsage();
  
  if (!match || !params.category || !params.slug) return <NotFound />;
  
  const tool = getToolBySlug(params.slug);
  const category = getCategoryById(params.category);
  
  if (!tool || !category) return <NotFound />;

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
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">{tool.name}</h1>
              <p className="text-lg text-muted-foreground">{tool.description}</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-xl text-sm border border-border">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span>Processed Locally</span>
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
          <div className="prose prose-slate dark:prose-invert max-w-none pt-10 border-t border-border">
            <h3>How to use the {tool.name}</h3>
            <p>Our {tool.name.toLowerCase()} is designed to be simple, fast, and completely secure. Because all processing happens directly in your browser, your data is never uploaded to external servers.</p>
            <ul>
              <li><strong>Secure:</strong> No data leaves your device.</li>
              <li><strong>Fast:</strong> Instant results without network latency.</li>
              <li><strong>Free:</strong> Unlimited usage without registration.</li>
            </ul>
          </div>
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

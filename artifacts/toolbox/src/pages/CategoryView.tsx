import { useRoute } from "wouter";
import { Link } from "wouter";
import { ChevronRight, Home } from "lucide-react";
import { getCategoryById, getToolsByCategory } from "@/lib/tools-config";
import { ToolCard } from "@/components/shared/ToolCard";
import NotFound from "./not-found";

export default function CategoryView() {
  const [match, params] = useRoute("/tools/:category");
  
  if (!match || !params.category) return <NotFound />;
  
  const category = getCategoryById(params.category);
  if (!category) return <NotFound />;

  const tools = getToolsByCategory(category.id);
  const Icon = category.icon;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground transition-colors flex items-center"><Home className="w-4 h-4 mr-1" /> Home</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-foreground font-medium">{category.name}</span>
      </nav>

      {/* Category Header */}
      <div className="flex items-center gap-6 mb-12 pb-8 border-b border-border/50">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Icon className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-4xl font-display font-bold mb-3">{category.name}</h1>
          <p className="text-xl text-muted-foreground">{category.description}</p>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tools.map((tool, idx) => (
          <ToolCard key={tool.id} tool={tool} delay={idx} />
        ))}
      </div>
      
      {tools.length === 0 && (
        <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border mt-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
            <Icon className="w-8 h-8 opacity-50" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No tools yet</h3>
          <p className="text-muted-foreground">We're actively building new tools for this category.</p>
        </div>
      )}
    </div>
  );
}

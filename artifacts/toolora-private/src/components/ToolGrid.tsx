import { PRIVATE_TOOLS, CATEGORY_LABELS, type PrivateTool } from "@/lib/privateTools";

interface ToolGridProps {
  selectedSlug: string | null;
  onSelect: (tool: PrivateTool) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  text: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  developer: "text-green-400 bg-green-500/10 border-green-500/20",
  ai: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  productivity: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
};

export function ToolGrid({ selectedSlug, onSelect }: ToolGridProps) {
  const categories = Array.from(new Set(PRIVATE_TOOLS.map((t) => t.category)));

  return (
    <div className="space-y-4">
      {categories.map((cat) => {
        const tools = PRIVATE_TOOLS.filter((t) => t.category === cat);
        return (
          <div key={cat}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[cat]}`}>
                {CATEGORY_LABELS[cat]}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {tools.map((tool) => {
                const isSelected = tool.slug === selectedSlug;
                return (
                  <button
                    key={tool.slug}
                    onClick={() => onSelect(tool)}
                    className={`group relative p-3 rounded-lg border text-left transition-all duration-150 ${
                      isSelected
                        ? "border-primary bg-primary/10 glow-purple"
                        : "border-border bg-card hover:border-primary/40 hover:bg-primary/5"
                    }`}
                  >
                    <div className="text-xl mb-1.5">{tool.icon}</div>
                    <div className="text-sm font-medium text-foreground leading-tight">{tool.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 leading-tight line-clamp-2">
                      {tool.description}
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

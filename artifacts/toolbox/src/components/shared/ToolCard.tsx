import { Link } from "wouter";
import { ArrowRight, Star } from "lucide-react";
import { ToolDef } from "@/lib/tools-config";
import { motion } from "framer-motion";

export function ToolCard({ tool, delay = 0 }: { tool: ToolDef; delay?: number }) {
  const Icon = tool.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.05 }}
    >
      <Link href={`/tools/${tool.category}/${tool.slug}`}>
        <div className="group h-full p-6 rounded-2xl bg-card border border-border/60 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 relative overflow-hidden flex flex-col">
          {tool.isPopular && (
            <div className="absolute top-0 right-0">
              <div className="bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" /> Popular
              </div>
            </div>
          )}
          
          <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
            <Icon className="w-6 h-6" />
          </div>
          
          <h3 className="font-semibold text-lg mb-2 text-foreground group-hover:text-primary transition-colors">{tool.name}</h3>
          
          <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-2">
            {tool.description}
          </p>
          
          <div className="flex items-center text-sm font-medium text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 mt-auto">
            Use Tool <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

import { Link } from "wouter";
import { ArrowRight, Sparkles, Shield, Zap, Search } from "lucide-react";
import { motion } from "framer-motion";
import { CATEGORIES, TOOLS } from "@/lib/tools-config";
import { ToolCard } from "@/components/shared/ToolCard";
import { useGetPopularTools } from "@workspace/api-client-react";

export default function Home() {
  // Graceful fallback if API is not available
  const { data: popularData, isLoading: isLoadingPopular } = useGetPopularTools({
    query: { retry: false }
  });

  // Blend hardcoded popular tools with API data if available
  let popularTools = TOOLS.filter(t => t.isPopular).slice(0, 6);
  
  if (popularData?.tools && popularData.tools.length > 0) {
    const apiPopularSlugs = popularData.tools.map((t: any) => t.slug);
    const apiTools = apiPopularSlugs.map((slug: string) => TOOLS.find(t => t.slug === slug)).filter(Boolean);
    if (apiTools.length > 0) {
      popularTools = apiTools.slice(0, 6);
    }
  }

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="" 
            className="w-full h-full object-cover opacity-20 dark:opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20">
                <Sparkles className="w-4 h-4" /> The Ultimate Collection
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6">
                Free online tools for <span className="gradient-text">every workflow.</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                Format JSON, convert PDFs, resize images, and generate passwords. All processing happens locally in your browser for maximum privacy and speed.
              </p>
              
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="#categories" className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300">
                  Explore Tools
                </Link>
                <div className="flex items-center gap-2 text-sm text-muted-foreground px-6 py-4">
                  <Shield className="w-5 h-5 text-green-500" />
                  100% Client-Side Processing
                </div>
              </div>

              {/* Stats bar */}
              <div className="flex flex-wrap items-center justify-center gap-8 mt-12 pt-8 border-t border-border/40">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{TOOLS.length}+</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">Free Tools</div>
                </div>
                <div className="w-px h-8 bg-border hidden sm:block" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {popularData?.tools
                      ? (popularData.tools.reduce((sum: number, t: any) => sum + (t.usageCount ?? 0), 0)).toLocaleString()
                      : "—"}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">Tools Used</div>
                </div>
                <div className="w-px h-8 bg-border hidden sm:block" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">0kb</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">Data Uploaded</div>
                </div>
                <div className="w-px h-8 bg-border hidden sm:block" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">Free</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">Forever</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popular Tools Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold mb-2">Most Popular Tools</h2>
              <p className="text-muted-foreground">The tools our community uses the most.</p>
            </div>
            <Link href="/tools/developer" className="hidden sm:flex items-center text-sm font-medium text-primary hover:underline">
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTools.map((tool, idx) => (
              <ToolCard key={tool.id} tool={tool} delay={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Browse by Category</h2>
            <p className="text-muted-foreground text-lg">We have a growing collection of {TOOLS.length}+ tools to help you get things done faster.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CATEGORIES.map((category, idx) => {
              const Icon = category.icon;
              const count = TOOLS.filter(t => t.category === category.id).length;
              
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                >
                  <Link href={`/tools/${category.id}`}>
                    <div className="group block p-8 rounded-3xl border border-border bg-card hover:bg-muted/50 hover:border-primary/50 transition-all duration-300">
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                          <Icon className="w-7 h-7" />
                        </div>
                        <span className="px-3 py-1 bg-muted rounded-full text-xs font-medium text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          {count} Tools
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold mb-3">{category.name}</h3>
                      <p className="text-muted-foreground mb-6 line-clamp-2">{category.description}</p>
                      <div className="text-primary font-medium flex items-center group-hover:gap-2 transition-all">
                        Browse Tools <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Highlight */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-4xl font-display font-bold mb-6">Privacy is not a feature.<br/>It's our foundation.</h2>
              <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl leading-relaxed">
                When you use our PDF manipulation, image conversion, or developer tools, your files never leave your device. All processing is powered by modern WebAssembly and browser APIs directly on your machine.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 font-medium"><Shield className="w-5 h-5 text-green-300" /> Zero server uploads</li>
                <li className="flex items-center gap-3 font-medium"><Zap className="w-5 h-5 text-yellow-300" /> Lightning fast local execution</li>
              </ul>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative w-64 h-64 md:w-96 md:h-96">
                 <img 
                  src={`${import.meta.env.BASE_URL}images/privacy-shield.png`} 
                  alt="Privacy Shield" 
                  className="w-full h-full object-contain animate-in fade-in zoom-in duration-1000"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

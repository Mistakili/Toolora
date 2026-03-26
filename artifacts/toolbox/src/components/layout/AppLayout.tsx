import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { Settings2, Sparkles, Moon, Sun, Search, Menu, X, ShieldCheck } from "lucide-react";
import { useTheme } from "../ThemeProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TOOLS } from "@/lib/tools-config";

export function AppLayout({ children }: { children: ReactNode }) {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  const searchResults = searchQuery 
    ? TOOLS.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-105">
              <div className="bg-primary/10 p-2 rounded-xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Settings2 className="w-5 h-5" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight hidden sm:inline-block">ToolBox<span className="text-primary">.</span></span>
            </Link>
          </div>

          <div className="flex-1 max-w-md hidden md:block relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search for tools (e.g. PDF merge, word count)..." 
                className="w-full pl-9 bg-muted/50 border-transparent focus:bg-background rounded-full transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Search Dropdown */}
            {searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-popover border border-border rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map(tool => (
                    <button
                      key={tool.id}
                      onClick={() => {
                        setLocation(`/tools/${tool.category}/${tool.slug}`);
                        setSearchQuery("");
                      }}
                      className="w-full text-left p-3 flex items-center gap-3 hover:bg-muted rounded-lg transition-colors"
                    >
                      <tool.icon className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-medium text-sm">{tool.name}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">{tool.description}</div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">No tools found for "{searchQuery}"</div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-xs font-medium border border-green-500/20 mr-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Local Processing</span>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden rounded-full"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-b border-border bg-background p-4 space-y-4">
          <Input 
            placeholder="Search tools..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
              <div className="p-2 bg-muted/30 border border-border rounded-xl max-h-64 overflow-y-auto">
                {searchResults.map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      setLocation(`/tools/${tool.category}/${tool.slug}`);
                      setSearchQuery("");
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left p-3 flex items-center gap-3 hover:bg-muted rounded-lg transition-colors"
                  >
                    <tool.icon className="w-5 h-5 text-primary" />
                    <span className="font-medium text-sm">{tool.name}</span>
                  </button>
                ))}
              </div>
            )}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/20 mt-auto py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Settings2 className="w-6 h-6 text-primary" />
              <span className="font-display font-bold text-xl">ToolBox.</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm mb-4">
              A comprehensive suite of free, client-side tools for developers and creators. Privacy-first, lighting fast, and built for modern workflows.
            </p>
            <div className="flex items-center gap-2 text-sm text-primary font-medium">
              <Sparkles className="w-4 h-4" /> 100% Free forever
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/tools/text" className="hover:text-foreground transition-colors">Text Tools</Link></li>
              <li><Link href="/tools/developer" className="hover:text-foreground transition-colors">Developer Tools</Link></li>
              <li><Link href="/tools/productivity" className="hover:text-foreground transition-colors">Productivity</Link></li>
              <li><Link href="/tools/image" className="hover:text-foreground transition-colors">Image Tools</Link></li>
              <li><Link href="/tools/pdf" className="hover:text-foreground transition-colors">PDF Tools</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              <li><div className="mt-4 p-3 bg-primary/10 text-primary text-xs rounded-lg border border-primary/20 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                All processing happens in your browser. No files are uploaded to our servers.
              </div></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

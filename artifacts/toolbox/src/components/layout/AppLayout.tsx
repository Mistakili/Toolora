import { ReactNode, useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Settings2, Sparkles, Search, Menu, X, ShieldCheck, History, LogOut, LogIn, Key, CreditCard, LayoutDashboard, Zap, Building2, Lock, FileText, Image as ImageIcon, Code2, Type, Wand2, BookOpen, Puzzle, Server, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TOOLS } from "@/lib/tools-config";
import { useAuth } from "@workspace/replit-auth-web";
import { useTracking } from "@/hooks/useTracking";

// ─── Desktop nav: Apple-style hover-triggered mega-dropdowns ────────
type NavItem = { label: string; href: string; description?: string; icon?: typeof Settings2 };
type NavMenu = { key: string; label: string; href?: string; columns?: { heading: string; items: NavItem[] }[]; featured?: { title: string; subtitle: string; href: string; cta: string } };

const NAV_MENUS: NavMenu[] = [
  {
    key: "tools",
    label: "Tools",
    href: "/",
    columns: [
      {
        heading: "Popular categories",
        items: [
          { label: "PDF Tools", href: "/tools/pdf", icon: FileText, description: "Merge, split, OCR, compress" },
          { label: "Image Tools", href: "/tools/image", icon: ImageIcon, description: "Convert, resize, remove background" },
          { label: "Developer Tools", href: "/tools/developer", icon: Code2, description: "JSON, regex, encoders, hashing" },
          { label: "Text Tools", href: "/tools/text", icon: Type, description: "Word count, case, diff, clean" },
        ],
      },
      {
        heading: "Workflows",
        items: [
          { label: "Productivity", href: "/tools/productivity", icon: Wand2, description: "QR codes, calculators, schedulers" },
          { label: "Browser extension", href: "/extension", icon: Puzzle, description: "Run tools from any tab" },
          { label: "Tool history", href: "/history", icon: History, description: "Recent files, locally stored" },
          { label: "All tools index", href: "/", icon: Sparkles, description: "Browse the full catalog" },
        ],
      },
    ],
    featured: { title: "100% client-side", subtitle: "Files never leave your browser. Works offline.", href: "/privacy", cta: "Why we built it this way" },
  },
  {
    key: "mcp",
    label: "MCP Hub",
    href: "/mcp-hub",
    columns: [
      {
        heading: "Browse the directory",
        items: [
          { label: "Featured servers", href: "/mcp-hub#featured", icon: Sparkles, description: "Editor's picks this week" },
          { label: "Developer Tools", href: "/mcp-hub?cat=Developer%20Tools", icon: Code2, description: "GitHub, Linear, terminals" },
          { label: "Data & infra", href: "/mcp-hub?cat=Data", icon: Server, description: "Postgres, S3, warehouses" },
          { label: "AI / LLM", href: "/mcp-hub?cat=AI%2FLLM", icon: Sparkles, description: "Memory, RAG, agents" },
        ],
      },
      {
        heading: "Build & list",
        items: [
          { label: "Toolora MCP server", href: "/mcp", icon: Zap, description: "Our 12-tool MCP, free forever" },
          { label: "List your server", href: "/submit-mcp", icon: ChevronRight, description: "From 49 USDC, paid in seconds" },
          { label: "Top authors", href: "/mcp-hub/authors", icon: Sparkles, description: "Most-listed independent makers" },
          { label: "Browse by category", href: "/mcp-hub", icon: ShieldCheck, description: "All 7 directory categories" },
        ],
      },
    ],
    featured: { title: "300+ servers indexed", subtitle: "The open directory of Model Context Protocol servers.", href: "/mcp-hub", cta: "Browse the directory" },
  },
  {
    key: "private",
    label: "Private",
    href: "/private/",
  },
  {
    key: "api",
    label: "API",
    href: "/api-docs",
    columns: [
      {
        heading: "Get started",
        items: [
          { label: "API documentation", href: "/api-docs", icon: BookOpen, description: "REST + MCP endpoints" },
          { label: "Your API keys", href: "/api-keys", icon: Key, description: "Create, rotate, revoke" },
          { label: "Pricing", href: "/pricing", icon: CreditCard, description: "Pay-as-you-go in USDC" },
          { label: "Integrations", href: "/integrations", icon: Puzzle, description: "n8n, Zapier, Make" },
        ],
      },
    ],
    featured: { title: "Crypto-first billing", subtitle: "Top up with USDC on Solana. No card, no contract.", href: "/pricing", cta: "See pricing" },
  },
  {
    key: "blog",
    label: "Blog",
    href: "/blog",
  },
  {
    key: "enterprise",
    label: "Enterprise",
    href: "/enterprise",
  },
];

function DesktopNav() {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const closeTimer = useRef<number | null>(null);

  const open = (key: string) => {
    if (closeTimer.current) { window.clearTimeout(closeTimer.current); closeTimer.current = null; }
    setOpenKey(key);
  };
  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenKey(null), 120);
  };

  // Keyboard a11y: Escape closes the open menu
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenKey(null);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, []);

  const active = NAV_MENUS.find(m => m.key === openKey && m.columns);

  return (
    <nav className="hidden lg:flex items-center" onMouseLeave={scheduleClose}>
      <ul className="flex items-center">
        {NAV_MENUS.map((menu) => {
          const hasDropdown = !!menu.columns;
          const isOpen = openKey === menu.key;
          const cls = "px-3 py-2 text-sm font-medium rounded-md transition-colors " + (isOpen ? "text-foreground" : "text-muted-foreground hover:text-foreground");
          return (
            <li
              key={menu.key}
              className="relative"
              onMouseEnter={() => hasDropdown ? open(menu.key) : setOpenKey(null)}
            >
              {menu.href ? (
                <Link
                  href={menu.href}
                  className={cls}
                  aria-haspopup={hasDropdown ? "true" : undefined}
                  aria-expanded={hasDropdown ? isOpen : undefined}
                  onFocus={() => hasDropdown ? open(menu.key) : setOpenKey(null)}
                >
                  {menu.label}
                </Link>
              ) : (
                <button
                  type="button"
                  className={cls}
                  aria-haspopup={hasDropdown ? "true" : undefined}
                  aria-expanded={hasDropdown ? isOpen : undefined}
                  onFocus={() => hasDropdown && open(menu.key)}
                >
                  {menu.label}
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {/* Mega dropdown panel — single shared surface that swaps content per active menu */}
      {active && (
        <div
          className="fixed left-0 right-0 top-16 z-40"
          onMouseEnter={() => open(active.key)}
          onMouseLeave={scheduleClose}
        >
          <div className="absolute inset-x-0 top-0 border-b border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl shadow-black/10">
            <div className="container mx-auto px-6 py-8 grid grid-cols-12 gap-8">
              {active.columns!.map((col) => (
                <div key={col.heading} className="col-span-12 md:col-span-4">
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-3">{col.heading}</div>
                  <ul className="space-y-1">
                    {col.items.map((it) => {
                      const Icon = it.icon;
                      const isExternal = it.href.startsWith("/private/") || it.href.startsWith("http");
                      const Inner = (
                        <div className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/60 transition-colors group/item">
                          {Icon && <Icon className="w-4 h-4 mt-0.5 text-muted-foreground group-hover/item:text-primary transition-colors shrink-0" />}
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-foreground">{it.label}</div>
                            {it.description && <div className="text-xs text-muted-foreground line-clamp-1">{it.description}</div>}
                          </div>
                        </div>
                      );
                      return (
                        <li key={it.href}>
                          {isExternal
                            ? <a href={it.href}>{Inner}</a>
                            : <Link href={it.href}>{Inner}</Link>}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}

              {active.featured && (
                <div className="col-span-12 md:col-span-4">
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-3">Why it matters</div>
                  <Link href={active.featured.href}>
                    <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-5 hover:border-primary/40 transition-colors h-full">
                      <div className="text-base font-semibold text-foreground mb-1">{active.featured.title}</div>
                      <div className="text-xs text-muted-foreground mb-4 leading-relaxed">{active.featured.subtitle}</div>
                      <div className="text-xs font-medium text-primary inline-flex items-center gap-1">
                        {active.featured.cta} <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  useTracking();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, login, logout } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const searchResults = searchQuery 
    ? TOOLS.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-105">
              <div className="bg-primary/10 p-2 rounded-xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Settings2 className="w-5 h-5" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight hidden sm:inline-block">Toolora<span className="text-primary">.</span></span>
            </Link>
            <DesktopNav />
          </div>

          <div className="flex-1 max-w-sm hidden xl:block relative">
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
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-xs font-medium border border-green-500/20 mr-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Local Processing</span>
            </div>
            
            {/* Auth button */}
            {isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(v => !v)}
                  className="flex items-center gap-2 rounded-full hover:bg-muted transition-colors px-2 py-1"
                >
                  {user.profileImageUrl ? (
                    <img src={user.profileImageUrl} alt={user.firstName ?? "User"} className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold">
                      {(user.firstName?.[0] ?? user.email?.[0] ?? "U").toUpperCase()}
                    </div>
                  )}
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-popover border border-border rounded-xl shadow-2xl py-1 z-50">
                    <div className="px-3 py-2 border-b border-border">
                      <div className="text-sm font-medium truncate">{user.firstName || "User"}</div>
                      <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                    </div>
                    <Link href="/history" onClick={() => setUserMenuOpen(false)}>
                      <div className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors cursor-pointer">
                        <History className="w-4 h-4" /> Tool History
                      </div>
                    </Link>
                    <Link href="/api-keys" onClick={() => setUserMenuOpen(false)}>
                      <div className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors cursor-pointer">
                        <Key className="w-4 h-4" /> API Keys
                      </div>
                    </Link>
                    <Link href="/pricing" onClick={() => setUserMenuOpen(false)}>
                      <div className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors cursor-pointer">
                        <CreditCard className="w-4 h-4" /> Pricing
                      </div>
                    </Link>
                    {user.email === "akinslaboratory@gmail.com" && (
                      <Link href="/admin" onClick={() => setUserMenuOpen(false)}>
                        <div className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors cursor-pointer border-t border-border mt-1 pt-2">
                          <LayoutDashboard className="w-4 h-4 text-primary" />
                          <span>Admin Dashboard</span>
                        </div>
                      </Link>
                    )}
                    <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-left text-destructive">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={login}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full border border-border hover:bg-muted transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" /> Sign In
              </button>
            )}
            
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

          {/* Mobile nav links */}
          <nav className="flex flex-col gap-1 pt-1 border-t border-border">
            <a href="/private/"
              className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20 hover:bg-violet-500/20 transition-colors">
              <Lock className="w-4 h-4" /> Toolora Private
            </a>
            <Link href="/pricing" onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg hover:bg-muted transition-colors">
              <CreditCard className="w-4 h-4 text-muted-foreground" /> Pricing
            </Link>
            <Link href="/api-docs" onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg hover:bg-muted transition-colors">
              <Key className="w-4 h-4 text-muted-foreground" /> API Docs
            </Link>
            <Link href="/blog" onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg hover:bg-muted transition-colors">
              <Sparkles className="w-4 h-4 text-muted-foreground" /> Blog
            </Link>
            <Link href="/mcp" onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg hover:bg-muted transition-colors">
              <Zap className="w-4 h-4 text-muted-foreground" /> MCP Server
            </Link>
            <Link href="/mcp-hub" onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg hover:bg-muted transition-colors">
              <ShieldCheck className="w-4 h-4 text-muted-foreground" /> MCP Hub
            </Link>
            <Link href="/enterprise" onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg hover:bg-muted transition-colors">
              <Building2 className="w-4 h-4 text-muted-foreground" /> Enterprise
            </Link>
          </nav>

          {/* Mobile auth */}
          <div className="pt-1 border-t border-border">
            {isAuthenticated && user ? (
              <div className="space-y-1">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/40">
                  {user.profileImageUrl ? (
                    <img src={user.profileImageUrl} alt={user.firstName ?? "User"} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-semibold">
                      {(user.firstName?.[0] ?? user.email?.[0] ?? "U").toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium">{user.firstName || "User"}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[180px]">{user.email}</div>
                  </div>
                </div>
                <Link href="/history" onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg hover:bg-muted transition-colors">
                  <History className="w-4 h-4 text-muted-foreground" /> Tool History
                </Link>
                <Link href="/api-keys" onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg hover:bg-muted transition-colors">
                  <Key className="w-4 h-4 text-muted-foreground" /> API Keys
                </Link>
                <button onClick={() => { setIsMenuOpen(false); logout(); }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg hover:bg-muted transition-colors text-red-500">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setIsMenuOpen(false); login(); }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:opacity-90 transition-opacity"
              >
                <LogIn className="w-4 h-4" /> Sign In
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative">
        {children}
      </main>

      {/* Footer */}
      <footer
        className="border-t border-border/50 mt-auto py-12 relative overflow-hidden"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}images/footer-bg.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-background/60" />
        <div className="relative z-10">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Settings2 className="w-6 h-6 text-primary" />
              <span className="font-display font-bold text-xl">Toolora.</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm mb-4">
              A comprehensive suite of free, client-side tools for developers and creators. Privacy-first, lighting fast, and built for modern workflows.
            </p>
            <div className="flex items-center gap-2 text-sm text-primary font-medium mb-4">
              <Sparkles className="w-4 h-4" /> 100% Free forever
            </div>
            <a
              href="https://www.producthunt.com/products/toolora?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-toolora"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                alt="Toolora - Free online tools that never upload your files. | Product Hunt"
                width="250"
                height="54"
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1111647&theme=dark&t=1774947374597"
              />
            </a>
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
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/private/" className="hover:text-foreground transition-colors text-violet-400">Toolora Private</a></li>
              <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link href="/api-keys" className="hover:text-foreground transition-colors">API Keys</Link></li>
              <li><Link href="/api-docs" className="hover:text-foreground transition-colors">API Docs</Link></li>
              <li><Link href="/mcp" className="hover:text-foreground transition-colors">MCP Server</Link></li>
              <li><Link href="/mcp-hub" className="hover:text-foreground transition-colors">MCP Hub</Link></li>
              <li><Link href="/enterprise" className="hover:text-foreground transition-colors">Enterprise</Link></li>
              <li><Link href="/extension" className="hover:text-foreground transition-colors">Browser Extension</Link></li>
              <li><Link href="/history" className="hover:text-foreground transition-colors">My Tool History</Link></li>
              <li><Link href="/integrations" className="hover:text-foreground transition-colors">Integrations (n8n, Zapier)</Link></li>
              <li><Link href="/gdpr" className="hover:text-foreground transition-colors">GDPR Compliance</Link></li>
              <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><div className="mt-3 p-3 bg-primary/10 text-primary text-xs rounded-lg border border-primary/20 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                All processing happens in your browser. No files are uploaded to our servers.
              </div></li>
            </ul>
          </div>
        </div>
        </div>
      </footer>
    </div>
  );
}

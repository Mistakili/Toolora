import { useEffect } from "react";
import { Link } from "wouter";
import { Clock, Home, ChevronRight, ArrowRight, LogIn } from "lucide-react";
import { useAuth } from "@workspace/replit-auth-web";
import { useGetUserHistory } from "@workspace/api-client-react";
import { TOOLS } from "@/lib/tools-config";
import { formatDistanceToNow } from "date-fns";

export default function History() {
  const { user, isLoading: authLoading, isAuthenticated, login } = useAuth();
  const { data, isLoading } = useGetUserHistory({ query: { enabled: isAuthenticated, retry: false } });

  useEffect(() => {
    document.title = "My Tool History | Toolora";
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <nav className="flex items-center text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground transition-colors flex items-center"><Home className="w-4 h-4 mr-1" /> Home</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-foreground font-medium">Tool History</span>
      </nav>

      <div className="flex items-center gap-3 mb-8">
        <div className="bg-primary/10 p-3 rounded-xl text-primary">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold">Tool History</h1>
          <p className="text-muted-foreground text-sm mt-1">Your recently used tools</p>
        </div>
      </div>

      {authLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 rounded-2xl bg-muted/40 animate-pulse" />
          ))}
        </div>
      ) : !isAuthenticated ? (
        <div className="text-center py-20 border border-dashed border-border rounded-3xl">
          <Clock className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Sign in to see your history</h2>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">Your tool history is saved automatically when you're signed in. No account needed to use any tool.</p>
          <button
            onClick={login}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-colors"
          >
            <LogIn className="w-4 h-4" /> Sign In
          </button>
        </div>
      ) : isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 rounded-2xl bg-muted/40 animate-pulse" />
          ))}
        </div>
      ) : !data?.history?.length ? (
        <div className="text-center py-20 border border-dashed border-border rounded-3xl">
          <Clock className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No history yet</h2>
          <p className="text-muted-foreground mb-6">Use any tool and it'll appear here automatically.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-colors">
            Browse Tools <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {data.history.map((entry, i) => {
            const tool = TOOLS.find(t => t.slug === entry.toolSlug);
            if (!tool) return null;
            const Icon = tool.icon;
            return (
              <Link key={i} href={`/tools/${tool.category}/${tool.slug}`}>
                <div className="group flex items-center gap-4 p-4 rounded-2xl border border-border hover:border-primary/40 hover:bg-muted/30 transition-all cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{tool.name}</div>
                    <div className="text-xs text-muted-foreground">{tool.description}</div>
                  </div>
                  <div className="text-xs text-muted-foreground shrink-0">
                    {formatDistanceToNow(new Date(entry.usedAt), { addSuffix: true })}
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, Clock, Tag, Lock, Code2, BookOpen, Shield, Wrench, Zap } from "lucide-react";
import { BLOG_POSTS } from "@/lib/blog-posts";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function getCoverStyle(category: string): { gradient: string; Icon: React.ElementType; iconColor: string } {
  switch (category.toLowerCase()) {
    case "privacy":
      return { gradient: "from-purple-900/80 via-violet-800/60 to-purple-900/80", Icon: Lock, iconColor: "text-purple-300" };
    case "developer":
    case "development":
      return { gradient: "from-blue-900/80 via-cyan-800/60 to-blue-900/80", Icon: Code2, iconColor: "text-cyan-300" };
    case "security":
      return { gradient: "from-red-900/80 via-orange-800/60 to-red-900/80", Icon: Shield, iconColor: "text-orange-300" };
    case "tutorials":
    case "tutorial":
      return { gradient: "from-emerald-900/80 via-teal-800/60 to-emerald-900/80", Icon: BookOpen, iconColor: "text-emerald-300" };
    case "tools":
      return { gradient: "from-indigo-900/80 via-purple-800/60 to-indigo-900/80", Icon: Wrench, iconColor: "text-indigo-300" };
    default:
      return { gradient: "from-zinc-900/80 via-zinc-700/60 to-zinc-900/80", Icon: Zap, iconColor: "text-zinc-300" };
  }
}

export default function Blog() {
  useEffect(() => {
    document.title = "Blog | Toolora";
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold mb-3">Blog</h1>
        <p className="text-muted-foreground text-lg">Privacy, tools, and the indie web.</p>
      </div>

      {/* Blog hero visual */}
      <div className="relative rounded-2xl overflow-hidden border border-border/50 mb-12">
        <img
          src="/images/blog-hero.png"
          alt="Creative editorial workspace"
          className="w-full object-cover max-h-56 object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/30 to-transparent flex items-center">
          <div className="px-8 max-w-xs">
            <p className="text-xs font-mono text-primary uppercase tracking-widest mb-1">Toolora Blog</p>
            <p className="text-base font-display font-bold leading-snug">Writing about privacy, AI tools, and the open web.</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {[...BLOG_POSTS].reverse().map((post) => {
          const { gradient, Icon, iconColor } = getCoverStyle(post.category);
          return (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
              <article className="rounded-2xl border border-border hover:border-primary/40 overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-primary/10">
                {/* Cover image */}
                <div className={`relative h-36 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />
                  <div className="flex flex-col items-center gap-2 z-10">
                    <Icon className={`w-10 h-10 ${iconColor} opacity-80`} />
                    <span className={`text-xs font-semibold uppercase tracking-widest ${iconColor} opacity-70`}>
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-6 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {post.category}
                    </span>
                    <span>·</span>
                    <span>{formatDate(post.date)}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {post.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm text-primary font-medium">
                    Read post <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

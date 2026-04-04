import { Link, useParams } from "wouter";
import { ArrowLeft, Clock, Tag, Calendar, Lock, Code2, BookOpen, Shield, Wrench, Zap } from "lucide-react";
import { getBlogPost, BLOG_POSTS } from "@/lib/blog-posts";
import { useSEO } from "@/hooks/useSEO";

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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

const BASE = "https://toolora.dev";

function BlogPostSEO({ post }: { post: NonNullable<ReturnType<typeof getBlogPost>> }) {
  useSEO({
    title: post.title,
    description: post.description,
    canonical: `${BASE}/blog/${post.slug}`,
    type: "article",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.date,
      url: `${BASE}/blog/${post.slug}`,
      mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE}/blog/${post.slug}` },
      image: `${BASE}/opengraph.jpg`,
      author: { "@type": "Organization", name: "Toolora", url: BASE },
      publisher: {
        "@type": "Organization",
        name: "Toolora",
        url: BASE,
        logo: { "@type": "ImageObject", url: `${BASE}/favicon.svg` },
      },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: `${BASE}/blog/${post.slug}` },
        ],
      },
    },
  });
  return null;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = getBlogPost(slug);

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <Link href="/blog" className="text-primary hover:underline">← Back to blog</Link>
      </div>
    );
  }

  const others = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 2);
  const { gradient, Icon, iconColor } = getCoverStyle(post.category);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <BlogPostSEO post={post} />
      {/* Back */}
      <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        All posts
      </Link>

      {/* Hero cover */}
      <div className={`relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden mb-10 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />
        <div className="flex flex-col items-center gap-3 z-10">
          <Icon className={`w-14 h-14 ${iconColor} opacity-75`} />
          <span className={`text-xs font-semibold uppercase tracking-widest ${iconColor} opacity-60`}>
            {post.category}
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {post.category}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(post.date)}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.readTime}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold leading-tight mb-4">{post.title}</h1>
        <p className="text-muted-foreground text-lg leading-relaxed">{post.description}</p>
      </header>

      <hr className="border-border mb-10" />

      {/* Body */}
      <article
        className="prose prose-invert prose-sm sm:prose-base max-w-none
          prose-headings:font-display prose-headings:font-semibold
          prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3
          prose-p:text-muted-foreground prose-p:leading-relaxed
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-li:text-muted-foreground
          prose-strong:text-foreground prose-strong:font-semibold
          prose-table:text-sm prose-th:text-foreground prose-td:text-muted-foreground
          prose-table:border-collapse prose-th:border prose-th:border-border prose-th:px-3 prose-th:py-2
          prose-td:border prose-td:border-border prose-td:px-3 prose-td:py-2
          prose-ol:text-muted-foreground prose-ul:text-muted-foreground"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <hr className="border-border my-12" />

      {/* More posts */}
      {others.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-5">More posts</h2>
          <div className="space-y-4">
            {others.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="block group">
                <div className="p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-muted/20 transition-all">
                  <p className="text-xs text-muted-foreground mb-1">{p.category} · {p.readTime}</p>
                  <p className="font-medium text-sm group-hover:text-primary transition-colors leading-snug">{p.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

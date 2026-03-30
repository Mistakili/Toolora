import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft, Clock, Tag, Calendar } from "lucide-react";
import { getBlogPost, BLOG_POSTS } from "@/lib/blog-posts";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = getBlogPost(slug);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Toolora Blog`;
      const desc = document.querySelector('meta[name="description"]');
      if (desc) desc.setAttribute("content", post.description);
    }
  }, [post]);

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <Link href="/blog" className="text-primary hover:underline">← Back to blog</Link>
      </div>
    );
  }

  const others = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Back */}
      <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-10 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        All posts
      </Link>

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

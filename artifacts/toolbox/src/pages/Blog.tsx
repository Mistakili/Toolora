import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, Clock, Tag } from "lucide-react";
import { BLOG_POSTS } from "@/lib/blog-posts";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function Blog() {
  useEffect(() => {
    document.title = "Blog | Toolora";
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-display font-bold mb-3">Blog</h1>
        <p className="text-muted-foreground text-lg">Privacy, tools, and the indie web.</p>
      </div>

      <div className="space-y-8">
        {BLOG_POSTS.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
            <article className="p-6 rounded-2xl border border-border hover:border-primary/40 hover:bg-muted/30 transition-all duration-200">
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
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}

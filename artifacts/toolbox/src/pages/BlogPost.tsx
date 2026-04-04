import { Link, useParams } from "wouter";
import { ArrowLeft, Clock, Tag, Calendar } from "lucide-react";
import { getBlogPost, BLOG_POSTS, getPostImage } from "@/lib/blog-posts";
import { useSEO } from "@/hooks/useSEO";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

const BASE = "https://toolora.dev";

function BlogPostSEO({ post }: { post: NonNullable<ReturnType<typeof getBlogPost>> }) {
  const postImage = `${BASE}${getPostImage(post.slug, post.category)}`;
  useSEO({
    title: post.title,
    description: post.description,
    canonical: `${BASE}/blog/${post.slug}`,
    type: "article",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.date,
      url: `${BASE}/blog/${post.slug}`,
      mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE}/blog/${post.slug}` },
      image: { "@type": "ImageObject", url: postImage, width: 1200, height: 630 },
      keywords: post.category,
      articleSection: post.category,
      inLanguage: "en-US",
      author: {
        "@type": "Organization",
        name: "Toolora",
        url: BASE,
        logo: { "@type": "ImageObject", url: `${BASE}/favicon.svg` },
      },
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

  const others = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <BlogPostSEO post={post} />
      {/* Back */}
      <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        All posts
      </Link>

      {/* Hero image */}
      <div className="relative w-full h-52 sm:h-64 rounded-2xl overflow-hidden mb-10">
        <img
          src={getPostImage(post.slug, post.category)}
          alt={post.title}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border bg-background/60 backdrop-blur-sm text-muted-foreground border-border">
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
          <div className="grid sm:grid-cols-3 gap-4">
            {others.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="block group">
                <div className="rounded-xl border border-border hover:border-primary/40 overflow-hidden transition-all hover:shadow-md">
                  <div className="relative h-28 overflow-hidden bg-muted">
                    <img
                      src={getPostImage(p.slug, p.category)}
                      alt={p.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">{p.category} · {p.readTime}</p>
                    <p className="font-medium text-xs group-hover:text-primary transition-colors leading-snug line-clamp-2">{p.title}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

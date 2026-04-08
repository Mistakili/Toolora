export const BLOG_POSTS_COUNT = 101;
export const GLOSSARY_COUNT = 281;

export interface HomeBlogPost {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  image: string;
}

export const HOME_BLOG_POSTS: HomeBlogPost[] = [
  {
    slug: "ai-agent-on-chain-decision-ledger-soliris",
    title: "The AI Trading Agent That Commits Its Reasoning On-Chain Before It Trades",
    category: "AI Builders",
    readTime: "6 min read",
    image: "/images/mcp-tools-visual.png",
  },
  {
    slug: "flesch-readability-score-checker",
    title: "Flesch Readability Score: What It Means and How to Check Yours Free",
    category: "Tools",
    readTime: "7 min read",
    image: "/images/blog-word-count-stats.png",
  },
  {
    slug: "merge-pdfs-without-uploading",
    title: "How to Merge PDFs Without Uploading Files (100% Free, Works in Your Browser)",
    category: "Privacy",
    readTime: "5 min read",
    image: "/images/privacy-shield-new.png",
  },
];

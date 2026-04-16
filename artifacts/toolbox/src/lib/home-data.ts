export const BLOG_POSTS_COUNT = 108;
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
    slug: "ai-agents-pay-for-data-arc-blockchain",
    title: "AI Agents Are Paying for Data. Here's a Real On-Chain Transaction.",
    category: "AI Builders",
    readTime: "6 min read",
    image: "/images/mcp-tools-visual.png",
  },
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
];

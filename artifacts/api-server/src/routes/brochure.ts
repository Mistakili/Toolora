import { Router, type Request, type Response } from "express";
import OpenAI from "openai";
import { db } from "@workspace/db";
import { brochureGenerationsTable, tooloraUsersTable } from "@workspace/db/schema";
import { eq, sql } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();
const FREE_LIMIT = 2;

// Manually granted Pro access (email → true).
// Add emails here for users granted free Pro access outside Stripe.
const MANUAL_PRO_EMAILS = new Set([
  "bolumariewatife@gmail.com",
]);

function stripImagesFromHtml(html: string): string {
  return html.replace(/<img[^>]+>/gi, "[image]");
}

function extractImageSrcs(html: string): string[] {
  const srcs: string[] = [];
  const re = /src="(data:image\/[^"]{0,2000000})"/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    srcs.push(m[1]);
    if (srcs.length >= 4) break;
  }
  return srcs;
}

function stripCodeFences(text: string): string {
  return text
    .replace(/^```html\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

router.post("/brochure/generate", async (req: Request, res: Response) => {
  const startMs = Date.now();
  const { html, images: bodyImages, fileName, sessionToken } = req.body as {
    html?: string;
    images?: string[];
    fileName?: string;
    sessionToken?: string;
  };

  if (!html || typeof html !== "string" || html.trim().length < 10) {
    res.status(400).json({ error: "Document is empty. Add some content first." });
    return;
  }

  const token = (typeof sessionToken === "string" && sessionToken.length > 0)
    ? sessionToken.slice(0, 64)
    : null;

  // ── Pro check: authenticated users with pro/team tier bypass free limit ────
  let isPro = false;
  const authedEmail: string | null =
    (req as any).isAuthenticated?.() && (req as any).user?.email
      ? (req as any).user.email as string
      : null;

  if (authedEmail) {
    // Hard override: manually granted Pro access
    if (MANUAL_PRO_EMAILS.has(authedEmail.toLowerCase())) {
      isPro = true;
    } else {
      try {
        const [userRow] = await db
          .select({ tier: tooloraUsersTable.tier })
          .from(tooloraUsersTable)
          .where(eq(tooloraUsersTable.email, authedEmail));
        const tier = userRow?.tier ?? "free";
        if (tier === "pro" || tier === "team") isPro = true;
      } catch (e) {
        logger.warn({ err: e }, "[brochure] could not look up user tier");
      }
    }
  }

  // ── Free tier check (skipped for Pro/Team users) ───────────────────────────
  let isFree = false;
  if (!isPro) {
    try {
      if (token) {
        const [alreadyUsed] = await db
          .select({ c: sql<number>`count(*)::int` })
          .from(brochureGenerationsTable)
          .where(eq(brochureGenerationsTable.sessionToken, token));
        if ((alreadyUsed?.c ?? 0) > 0) {
          res.status(402).json({
            error: "free_used",
            message: "You've already used your free AI brochure. Upgrade to Pro for unlimited generations.",
          });
          return;
        }
      }

      const [{ freeCount }] = await db
        .select({ freeCount: sql<number>`count(*)::int` })
        .from(brochureGenerationsTable)
        .where(eq(brochureGenerationsTable.isFree, true));

      if ((freeCount ?? 0) < FREE_LIMIT) {
        isFree = true;
      } else {
        res.status(402).json({
          error: "pro_required",
          message: `The ${FREE_LIMIT} free AI brochures have been claimed. Upgrade to Pro for unlimited generations.`,
          upgradeUrl: "https://toolora.dev/pricing",
        });
        return;
      }
    } catch (dbErr) {
      logger.error({ err: dbErr }, "[brochure] DB check failed — falling through to generate");
      isFree = true;
    }
  }

  // ── Build GPT-4o prompt ────────────────────────────────────────────────────
  const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;
  const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY ?? "dummy";
  if (!baseURL) {
    res.status(503).json({ error: "AI service not configured." });
    return;
  }

  const images = Array.isArray(bodyImages)
    ? (bodyImages as string[]).filter(s => typeof s === "string" && s.startsWith("data:image")).slice(0, 4)
    : extractImageSrcs(html);
  const textHtml = html;
  const docTitle = (typeof fileName === "string" && fileName) ? fileName : "Document";

  const imgPlaceholders = images.map((_, i) => `__IMG_${i + 1}__`);

  const systemPrompt = `You are an elite print designer who creates stunning brochures for Fortune 500 companies. Your work looks like it came from Canva Pro or Adobe InDesign — not a word processor.

═══ ABSOLUTE OUTPUT RULES (violating any = failure) ═══
• Output ONLY a raw HTML document. Zero markdown, zero code fences, zero explanation.
• All CSS in one <style> block inside <head>.
• Include this in <head>: <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
• @page { size: A4; margin: 0; }
• body { width: 794px; min-height: 1123px; margin: 0 auto; font-family: 'Inter', sans-serif; }
• -webkit-print-color-adjust: exact; print-color-adjust: exact;
${imgPlaceholders.length > 0 ? `• ⚠️ MANDATORY IMAGES: You MUST embed ALL ${imgPlaceholders.length} image(s). Use these exact src values: ${imgPlaceholders.map(p => `src="${p}"`).join(", ")}. Including zero images is a critical failure.` : ""}

═══ DESIGN SYSTEM ═══
HERO SECTION (top of page):
- Full-width block, min-height 280px
- Strong background: bold solid color OR a dark gradient OR a colored overlay on top of the first image if one exists
- Document title in 'Playfair Display', 700 weight, 52px, white or near-white
- Subtitle/description in Inter 300, 18px, 80% opacity white
- If an image is available: use it as the hero background with a dark overlay (rgba(0,0,0,0.45) or brand-color overlay)

BODY SECTIONS:
- Use CSS Grid for 2-column layouts where content has multiple sections (text left + image right, or vice versa — alternate)
- Section headings: 'Playfair Display' 28px, colored (brand accent color), with a 3px left border accent OR underline accent
- Body text: Inter 400, 15px, line-height 1.75, color #2d3748 or similar dark-but-not-black
- Cards: background #fff or very light tint, border-radius 12px, box-shadow 0 2px 16px rgba(0,0,0,0.07), padding 28px
- Generous padding: sections get 48px top/bottom, 48px left/right
- Use accent color for bullets, borders, highlights — never use plain black bullets

COLOR PALETTE:
- Pick 2–3 colors that fit the content topic (e.g. professional blue + gold, medical green + white, startup purple + coral)
- Use them consistently: one primary (hero bg, headings), one accent (borders, links, highlights), one light (section backgrounds)

IMAGES:
${imgPlaceholders.length > 0
  ? `- Image 1 (${imgPlaceholders[0]}): Use as the HERO background image with a semi-transparent dark overlay. CSS: background-image: url(${imgPlaceholders[0]}); background-size: cover; background-position: center;
- Images 2+ (${imgPlaceholders.slice(1).join(", ")}): Embed as <img> tags inside content sections. Place them thoughtfully next to relevant text in a 2-column grid. Give them: width: 100%; border-radius: 10px; object-fit: cover; max-height: 220px;`
  : "- No images provided: use CSS shapes, large colored blocks, and bold typography to create visual interest"}

FOOTER:
- Full-width, 48px padding, background matches hero color, text centered
- "Created with Toolora · toolora.dev" in Inter 400, 13px, 60% white opacity`;

  const userContent: OpenAI.Chat.ChatCompletionContentPart[] = [
    {
      type: "text",
      text: `Design a stunning brochure from this document content. Apply the full design system — hero, sections, typography, colors, images. Do not simplify.\n\nDocument title: ${docTitle}\n\nDocument HTML content:\n${textHtml.slice(0, 10000)}`,
    },
  ];

  for (let i = 0; i < images.length; i++) {
    userContent.push({
      type: "text",
      text: `⚠️ IMAGE ${i + 1} OF ${images.length} — you MUST use src="${imgPlaceholders[i]}" for this image in your HTML:`,
    });
    userContent.push({
      type: "image_url",
      image_url: { url: images[i].slice(0, 800000), detail: "auto" },
    });
  }

  let generatedHtml = "";
  let success = false;
  try {
    const ai = new OpenAI({ baseURL, apiKey });
    const completion = await ai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 8192,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    generatedHtml = stripCodeFences(raw);

    // Replace image placeholders with actual data URIs
    for (let i = 0; i < images.length; i++) {
      generatedHtml = generatedHtml.replaceAll(`__IMG_${i + 1}__`, images[i]);
    }

    success = true;
    res.json({ html: generatedHtml });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Generation failed";
    logger.error({ err }, "[brochure] GPT-4o call failed");
    res.status(500).json({ error: msg });
  } finally {
    const durationMs = Date.now() - startMs;
    logger.info({ isFree, durationMs, success, token }, "[brochure] generation done");
    db.insert(brochureGenerationsTable).values({
      sessionToken: token,
      isFree,
      success,
      durationMs,
    }).catch((e: unknown) => logger.error({ err: e }, "[brochure] DB insert failed"));
  }
});

export default router;

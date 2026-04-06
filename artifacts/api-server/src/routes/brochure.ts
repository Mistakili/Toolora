import { Router, type Request, type Response } from "express";
import OpenAI from "openai";
import { db } from "@workspace/db";
import { brochureGenerationsTable, tooloraUsersTable } from "@workspace/db/schema";
import { eq, sql } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();
const FREE_LIMIT = 2;

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

  const systemPrompt = `You are a world-class brochure designer. Transform document content into a stunning, print-ready HTML brochure.

OUTPUT RULES:
- Output ONLY a complete HTML document. No explanation, no markdown code fences.
- All CSS must be in a <style> tag in <head>
- @page { size: A4; margin: 0; }
- Add: -webkit-print-color-adjust: exact; print-color-adjust: exact;
- body max-width: 794px (A4 at 96dpi)
${images.length > 0 ? `- Use __IMG_1__, __IMG_2__, etc. as src attributes for images (NOT data URIs in your output)` : ""}

DESIGN RULES:
- Make it GENUINELY BEAUTIFUL — Canva/InDesign quality
- Strong visual hierarchy: bold hero section with the title, then clear sections
- Cohesive color palette (2-3 colors) derived from the content topic
- Use large typography for headings, generous whitespace, visual rhythm
- Add colored backgrounds/bands to create depth
- Footer: "Created with Toolora · toolora.dev" in small grey text
${images.length > 0 ? `- Place images where a designer would: hero image full-width, section images alongside relevant content, use CSS to size and position them elegantly` : "- Create visual interest with color blocks, dividers, and typography since there are no images"}`;

  const userContent: OpenAI.Chat.ChatCompletionContentPart[] = [
    {
      type: "text",
      text: `Create a brochure for this document.\n\nDocument title: ${docTitle}\n\nDocument HTML:\n${textHtml.slice(0, 8000)}`,
    },
  ];

  for (let i = 0; i < images.length; i++) {
    userContent.push({ type: "text", text: `Image ${i + 1} (use src="__IMG_${i + 1}__" in your HTML):` });
    userContent.push({
      type: "image_url",
      image_url: { url: images[i].slice(0, 500000), detail: "low" },
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

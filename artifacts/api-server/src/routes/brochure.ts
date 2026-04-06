import { Router, type Request, type Response } from "express";
import OpenAI from "openai";
import { JSDOM } from "jsdom";
import { db } from "@workspace/db";
import { brochureGenerationsTable, tooloraUsersTable } from "@workspace/db/schema";
import { eq, sql } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();
const FREE_LIMIT = 2;

const MANUAL_PRO_EMAILS = new Set([
  "bolumariewatife@gmail.com",
]);

// Parse HTML into clean structured text, injecting [IMAGE_N] markers
// where the original images were.
function extractStructuredText(html: string, imageCount: number): string {
  const dom = new JSDOM(html);
  const body = dom.window.document.body;
  let imgIdx = 0;
  const lines: string[] = [];

  function walk(node: Element | ChildNode): void {
    const el = node as Element;
    const tag = el.tagName?.toLowerCase();

    if (node.nodeType === 3) {
      const t = node.textContent?.trim();
      if (t) lines.push(t);
      return;
    }
    if (node.nodeType !== 1) return;

    switch (tag) {
      case "h1": lines.push(`\n# ${el.textContent?.trim()}\n`); break;
      case "h2": lines.push(`\n## ${el.textContent?.trim()}\n`); break;
      case "h3": lines.push(`\n### ${el.textContent?.trim()}\n`); break;
      case "li": lines.push(`• ${el.textContent?.trim()}`); break;
      case "br": lines.push(""); break;
      case "script":
      case "style": break;
      case "span":
      case "p": {
        const inner = el.innerHTML || "";
        const text = el.textContent?.trim() || "";
        if (text === "[image]" || inner.includes("[image]")) {
          if (imgIdx < imageCount) {
            imgIdx++;
            lines.push(`\n[IMAGE_${imgIdx}]\n`);
          }
        } else if (text) {
          lines.push(text);
        }
        break;
      }
      default:
        for (const child of Array.from(node.childNodes)) walk(child);
    }
  }

  for (const child of Array.from(body.childNodes)) walk(child);
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
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

  const token = typeof sessionToken === "string" && sessionToken.length > 0
    ? sessionToken.slice(0, 64) : null;

  // ── Pro check ──────────────────────────────────────────────────────────────
  let isPro = false;
  const authedEmail: string | null =
    (req as any).isAuthenticated?.() && (req as any).user?.email
      ? ((req as any).user.email as string).toLowerCase()
      : null;

  if (authedEmail) {
    if (MANUAL_PRO_EMAILS.has(authedEmail)) {
      isPro = true;
    } else {
      try {
        const [row] = await db
          .select({ tier: tooloraUsersTable.tier })
          .from(tooloraUsersTable)
          .where(eq(tooloraUsersTable.email, authedEmail));
        const tier = row?.tier ?? "free";
        if (tier === "pro" || tier === "team") isPro = true;
      } catch (e) {
        logger.warn({ err: e }, "[brochure] could not look up user tier");
      }
    }
  }

  // ── Free tier gate (skipped for Pro) ──────────────────────────────────────
  let isFree = false;
  if (!isPro) {
    try {
      if (token) {
        const [used] = await db
          .select({ c: sql<number>`count(*)::int` })
          .from(brochureGenerationsTable)
          .where(eq(brochureGenerationsTable.sessionToken, token));
        if ((used?.c ?? 0) > 0) {
          res.status(402).json({ error: "free_used", message: "You've already used your free AI brochure. Upgrade to Pro for unlimited generations." });
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
        res.status(402).json({ error: "pro_required", message: `The ${FREE_LIMIT} free AI brochures have been claimed. Upgrade to Pro for unlimited generations.`, upgradeUrl: "https://toolora.dev/pricing" });
        return;
      }
    } catch (dbErr) {
      logger.error({ err: dbErr }, "[brochure] DB check failed");
      isFree = true;
    }
  }

  // ── Build context ──────────────────────────────────────────────────────────
  const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;
  const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY ?? "dummy";
  if (!baseURL) { res.status(503).json({ error: "AI service not configured." }); return; }

  const images = Array.isArray(bodyImages)
    ? (bodyImages as string[]).filter(s => typeof s === "string" && s.startsWith("data:image")).slice(0, 6)
    : [];

  const docTitle = typeof fileName === "string" && fileName ? fileName : "Document";
  const structuredContent = extractStructuredText(html, images.length);

  // Build image instructions for the prompt
  const imgInstructions = images.length > 0
    ? `\nIMAGES (${images.length} total — already extracted from the document):
${images.map((_, i) => `  • [IMAGE_${i + 1}] — use <img src="__IMG_${i + 1}__" ...> wherever this marker appears in the content`).join("\n")}
The [IMAGE_N] markers in the content below show exactly where each image appeared in the original document. Embed them in your layout at those positions. Resize to fit elegantly: cover images get width:100%/max-height:300px, inline images get max-width:100%/border-radius:10px.`
    : "\nNo images in this document.";

  const systemPrompt = `You are a professional brochure designer. Convert document content into a beautiful, print-ready A4 HTML brochure.

RULES:
• Output ONLY a complete HTML document — no markdown, no code fences, no commentary.
• Include in <head>: <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
• All CSS in a single <style> block.
• @page { size: A4; margin: 0; }  body { width: 794px; min-height: 1123px; margin: 0 auto; }
• -webkit-print-color-adjust: exact; print-color-adjust: exact;

LAYOUT:
• Hero: full-width colored block, min-height 260px, title in Playfair Display 52px bold white, tagline in Inter 300 18px white/80%
• Sections: use the H2 headings as section titles — Playfair Display 26px, with a 3px colored left-border accent
• Body text: Inter 400 15px, line-height 1.8, color #1a202c
• Use CSS Grid (2-col) for sections that have an image beside text
• Cards: border-radius 12px, box-shadow 0 2px 16px rgba(0,0,0,0.08), padding 28px, white background
• Generous section padding: 48px vertical, 48px horizontal
• Pick a cohesive 2–3 color palette that fits the content topic. Apply consistently.
• Lists: styled bullets using accent color, not default black dots
• Footer: "Created with Toolora · toolora.dev" — centered, Inter 12px, muted color
${imgInstructions}`;

  const userMessage = `Create a brochure from this document.\n\nTitle: ${docTitle}\n\nContent:\n${structuredContent.slice(0, 12000)}`;

  let generatedHtml = "";
  let success = false;
  try {
    const ai = new OpenAI({ baseURL, apiKey });
    const completion = await ai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 8192,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    generatedHtml = stripCodeFences(raw);

    // Inject actual image data into placeholders
    for (let i = 0; i < images.length; i++) {
      generatedHtml = generatedHtml.replaceAll(`__IMG_${i + 1}__`, images[i]);
    }

    success = true;
    res.json({ html: generatedHtml });
  } catch (err) {
    logger.error({ err }, "[brochure] GPT-4o call failed");
    res.status(500).json({ error: err instanceof Error ? err.message : "Generation failed" });
  } finally {
    const durationMs = Date.now() - startMs;
    logger.info({ isFree, durationMs, success, token, authedEmail }, "[brochure] done");
    db.insert(brochureGenerationsTable).values({ sessionToken: token, isFree, success, durationMs })
      .catch((e: unknown) => logger.error({ err: e }, "[brochure] DB insert failed"));
  }
});

export default router;

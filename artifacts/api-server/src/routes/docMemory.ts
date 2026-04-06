import { Router } from "express";
import multer from "multer";
import { db } from "@workspace/db";
import { memoriesTable } from "@workspace/db/schema";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

function slugify(name: string) {
  return name.toLowerCase().replace(/\.[^.]+$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
}

function chunkText(text: string, chunkSize: number, overlap: number): string[] {
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim());
  if (!paragraphs.length) return [];
  const chunks: string[] = [];
  let current = "";
  for (const p of paragraphs) {
    if (current.length + p.length + 2 > chunkSize && current.length > 0) {
      chunks.push(current.trim());
      const tail = current.slice(-overlap);
      current = tail ? tail + "\n\n" + p : p;
    } else {
      current = current ? current + "\n\n" + p : p;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

async function extractText(file: Express.Multer.File): Promise<string> {
  const ext = file.originalname.split(".").pop()?.toLowerCase() ?? "";

  if (ext === "txt" || ext === "md") {
    return file.buffer.toString("utf-8");
  }

  if (ext === "pdf") {
    const pdfParse = (await import("pdf-parse")).default;
    const data = await pdfParse(file.buffer);
    return data.text;
  }

  if (ext === "docx") {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value;
  }

  throw new Error("Unsupported file type. Upload a PDF, DOCX, TXT, or MD file.");
}

router.post("/doc-memory/load", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded." });
      return;
    }

    const chunkSize = Math.min(Math.max(parseInt(req.body.chunkSize ?? "1000"), 200), 4000);
    const overlap = Math.min(Math.max(parseInt(req.body.overlap ?? "100"), 0), 400);
    const prefix = req.body.prefix?.trim() || slugify(req.file.originalname);
    const expiresInDays = Math.min(parseInt(req.body.expiresInDays ?? "90"), 90);

    const text = await extractText(req.file);
    if (!text.trim()) {
      res.status(422).json({ error: "Could not extract any text from this file." });
      return;
    }

    const chunks = chunkText(text, chunkSize, overlap);
    if (!chunks.length) {
      res.status(422).json({ error: "File appears to have no readable text content." });
      return;
    }

    const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);
    const { eq } = await import("drizzle-orm");

    const keys: string[] = [];
    const BATCH = 5;
    for (let i = 0; i < chunks.length; i += BATCH) {
      const batch = chunks.slice(i, i + BATCH);
      await Promise.all(
        batch.map((chunk, j) => {
          const key = `${prefix}-chunk-${String(i + j + 1).padStart(3, "0")}`;
          keys.push(key);
          return db.insert(memoriesTable).values({ key, content: chunk, expiresAt }).onConflictDoUpdate({
            target: memoriesTable.key,
            set: { content: chunk, expiresAt, createdAt: new Date() },
          });
        })
      );
    }

    const indexKey = `${prefix}-index`;
    const indexContent = JSON.stringify({
      filename: req.file.originalname,
      chunkCount: chunks.length,
      prefix,
      keys,
      loadedAt: new Date().toISOString(),
      totalChars: text.length,
    });
    await db.insert(memoriesTable).values({ key: indexKey, content: indexContent, expiresAt }).onConflictDoUpdate({
      target: memoriesTable.key,
      set: { content: indexContent, expiresAt, createdAt: new Date() },
    });

    res.json({
      success: true,
      filename: req.file.originalname,
      prefix,
      chunkCount: chunks.length,
      totalChars: text.length,
      keys,
      indexKey,
      expiresAt: expiresAt.toISOString(),
      tip: `To retrieve in Claude: "Use list_memories with prefix '${prefix}' to recall my document"`,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

export default router;

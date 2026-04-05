import { useState, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useChainedInput } from "@/hooks/useChainedInput";
import { ChainToolButton } from "@/components/shared/ChainToolButton";
import { Copy, Check } from "lucide-react";

const STOP_WORDS = new Set([
  "a","an","the","and","or","but","in","on","at","to","for","of","with",
  "by","from","is","are","was","were","be","been","being","have","has",
  "had","do","does","did","will","would","could","should","may","might",
  "shall","can","need","dare","ought","used","it","its","i","me","my",
  "you","your","he","him","his","she","her","we","our","they","their",
  "them","this","that","these","those","not","no","nor","so","yet","both",
  "either","neither","as","if","then","than","because","since","while",
  "although","though","unless","until","when","where","who","which","what",
  "how","all","each","every","any","some","such","more","most","other",
  "into","about","up","out","after","before","over","under","again","also",
  "just","very","too","even","only","than","there","here","now","still",
]);

function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  if (w.length <= 3) return 1;
  let count = 0;
  let prevVowel = false;
  const cleaned = w.replace(/e$/, "");
  for (const ch of cleaned) {
    const isVowel = "aeiouy".includes(ch);
    if (isVowel && !prevVowel) count++;
    prevVowel = isVowel;
  }
  return Math.max(1, count);
}

function getReadabilityLabel(score: number): { label: string; color: string } {
  if (score >= 90) return { label: "Very Easy", color: "text-green-400" };
  if (score >= 80) return { label: "Easy", color: "text-green-400" };
  if (score >= 70) return { label: "Fairly Easy", color: "text-lime-400" };
  if (score >= 60) return { label: "Standard", color: "text-yellow-400" };
  if (score >= 50) return { label: "Fairly Difficult", color: "text-orange-400" };
  if (score >= 30) return { label: "Difficult", color: "text-red-400" };
  return { label: "Very Difficult", color: "text-red-500" };
}

export default function WordCounter() {
  const chained = useChainedInput();
  const [text, setText] = useState(chained);
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) return null;

    const wordList = trimmed.split(/\s+/);
    const words = wordList.length;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const paragraphs = trimmed.split(/\n+/).filter(p => p.trim().length > 0).length;
    const sentenceList = trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentences = sentenceList.length;

    const readingTimeSeconds = (words / 200) * 60;
    const speakingTimeSeconds = (words / 130) * 60;

    const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = Math.round(seconds % 60);
      if (m === 0) return `${s}s`;
      if (s === 0) return `${m}m`;
      return `${m}m ${s}s`;
    };

    const totalSyllables = wordList.reduce((acc, w) => acc + countSyllables(w), 0);
    const avgSyllablesPerWord = words > 0 ? totalSyllables / words : 0;
    const avgWordsPerSentence = sentences > 0 ? words / sentences : 0;
    const fleschScore = sentences > 0 && words > 0
      ? Math.round(206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord)
      : null;
    const clampedScore = fleschScore !== null ? Math.max(0, Math.min(100, fleschScore)) : null;

    const uniqueWords = new Set(wordList.map(w => w.toLowerCase().replace(/[^a-z0-9]/g, ""))).size;

    const freq: Record<string, number> = {};
    for (const w of wordList) {
      const clean = w.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (clean.length > 2 && !STOP_WORDS.has(clean)) {
        freq[clean] = (freq[clean] || 0) + 1;
      }
    }
    const topKeywords = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([word, count]) => ({ word, count, pct: Math.round((count / words) * 100) }));

    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      uniqueWords,
      readingTime: formatTime(readingTimeSeconds),
      speakingTime: formatTime(speakingTimeSeconds),
      fleschScore: clampedScore,
      topKeywords,
    };
  }, [text]);

  const copyStats = async () => {
    if (!stats) return;
    const lines = [
      `Words: ${stats.words}`,
      `Characters: ${stats.characters}`,
      `Characters (no spaces): ${stats.charactersNoSpaces}`,
      `Sentences: ${stats.sentences}`,
      `Paragraphs: ${stats.paragraphs}`,
      `Unique words: ${stats.uniqueWords}`,
      `Reading time: ${stats.readingTime}`,
      `Speaking time: ${stats.speakingTime}`,
      stats.fleschScore !== null ? `Readability (Flesch): ${stats.fleschScore}/100` : null,
    ].filter(Boolean).join("\n");
    await navigator.clipboard.writeText(lines);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const primaryStats = stats ? [
    { label: "Words", value: stats.words.toLocaleString() },
    { label: "Characters", value: stats.characters.toLocaleString() },
    { label: "No Spaces", value: stats.charactersNoSpaces.toLocaleString() },
    { label: "Sentences", value: stats.sentences.toLocaleString() },
    { label: "Paragraphs", value: stats.paragraphs.toLocaleString() },
    { label: "Unique Words", value: stats.uniqueWords.toLocaleString() },
  ] : [];

  const readability = stats && stats.fleschScore !== null
    ? getReadabilityLabel(stats.fleschScore)
    : null;

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Primary stats grid */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {stats ? primaryStats.map((s, i) => (
          <div key={i} className="bg-muted/40 p-4 rounded-xl border border-border text-center">
            <div className="text-2xl font-display font-bold text-foreground mb-1">{s.value}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</div>
          </div>
        )) : Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-muted/40 p-4 rounded-xl border border-border text-center">
            <div className="text-2xl font-display font-bold text-muted-foreground/30 mb-1">—</div>
            <div className="text-xs text-muted-foreground/40 uppercase tracking-wider">
              {["Words","Characters","No Spaces","Sentences","Paragraphs","Unique Words"][i]}
            </div>
          </div>
        ))}
      </div>

      {/* Time + Readability row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-muted/40 p-4 rounded-xl border border-border text-center">
          <div className="text-xl font-display font-bold text-foreground mb-1">
            {stats ? stats.readingTime : "—"}
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Reading Time</div>
          <div className="text-xs text-muted-foreground/60 mt-1">@ 200 wpm</div>
        </div>
        <div className="bg-muted/40 p-4 rounded-xl border border-border text-center">
          <div className="text-xl font-display font-bold text-foreground mb-1">
            {stats ? stats.speakingTime : "—"}
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Speaking Time</div>
          <div className="text-xs text-muted-foreground/60 mt-1">@ 130 wpm</div>
        </div>
        <div className="bg-muted/40 p-4 rounded-xl border border-border text-center">
          {stats && readability && stats.fleschScore !== null ? (
            <>
              <div className={`text-xl font-display font-bold mb-1 ${readability.color}`}>
                {stats.fleschScore}/100
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Readability</div>
              <div className={`text-xs mt-1 font-medium ${readability.color}`}>{readability.label}</div>
            </>
          ) : (
            <>
              <div className="text-xl font-display font-bold text-muted-foreground/30 mb-1">—</div>
              <div className="text-xs text-muted-foreground/40 uppercase tracking-wider">Readability</div>
              <div className="text-xs text-muted-foreground/40 mt-1">Flesch score</div>
            </>
          )}
        </div>
      </div>

      {/* Textarea */}
      <div className="flex-1 relative min-h-[260px]">
        <Textarea
          placeholder="Type or paste your text here..."
          className="w-full h-full min-h-[260px] resize-none text-base p-6 rounded-2xl focus-visible:ring-primary/20 bg-background"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {text && (
          <button
            onClick={() => setText("")}
            className="absolute top-4 right-4 text-xs font-medium text-muted-foreground hover:text-foreground px-3 py-1 bg-muted rounded-md transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Top Keywords */}
      {stats && stats.topKeywords.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Top Keywords</h3>
            <span className="text-xs text-muted-foreground">excluding common words</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {stats.topKeywords.map(({ word, count, pct }) => (
              <div key={word} className="bg-muted/30 rounded-lg border border-border px-3 py-2 flex items-center justify-between gap-2">
                <span className="text-sm font-medium truncate">{word}</span>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-foreground">{count}×</span>
                  <span className="text-xs text-muted-foreground ml-1">({pct}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action row */}
      {text && (
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={copyStats}
            className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground px-3 py-1.5 bg-muted rounded-lg border border-border transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy stats"}
          </button>
          <ChainToolButton currentSlug="word-counter" outputText={text} />
        </div>
      )}
    </div>
  );
}

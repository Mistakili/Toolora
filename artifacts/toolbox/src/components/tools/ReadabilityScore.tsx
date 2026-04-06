import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!word) return 0;
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
  word = word.replace(/^y/, "");
  const m = word.match(/[aeiouy]{1,2}/g);
  return m ? m.length : 1;
}

function analyze(text: string) {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const words = text.trim().split(/\s+/).filter((w) => w.length > 0);
  const syllables = words.reduce((acc, w) => acc + countSyllables(w), 0);

  const numSentences = sentences.length || 1;
  const numWords = words.length || 1;
  const numSyllables = syllables || 1;

  const fleschEase = 206.835 - 1.015 * (numWords / numSentences) - 84.6 * (numSyllables / numWords);
  const fleschGrade = 0.39 * (numWords / numSentences) + 11.8 * (numSyllables / numWords) - 15.59;

  return {
    words: numWords,
    sentences: numSentences,
    syllables: numSyllables,
    avgWordsPerSentence: (numWords / numSentences).toFixed(1),
    avgSyllablesPerWord: (numSyllables / numWords).toFixed(2),
    fleschEase: Math.max(0, Math.min(100, fleschEase)).toFixed(1),
    fleschGrade: Math.max(0, fleschGrade).toFixed(1),
  };
}

function easeLabel(score: number): { label: string; color: string } {
  if (score >= 90) return { label: "Very Easy (5th grade)", color: "text-green-500" };
  if (score >= 80) return { label: "Easy (6th grade)", color: "text-green-400" };
  if (score >= 70) return { label: "Fairly Easy (7th grade)", color: "text-lime-500" };
  if (score >= 60) return { label: "Standard (8th–9th grade)", color: "text-yellow-500" };
  if (score >= 50) return { label: "Fairly Difficult (10th–12th grade)", color: "text-orange-500" };
  if (score >= 30) return { label: "Difficult (College)", color: "text-red-500" };
  return { label: "Very Confusing (Professional)", color: "text-red-700" };
}

export default function ReadabilityScore() {
  const [text, setText] = useState("");

  const result = text.trim().length > 10 ? analyze(text) : null;
  const ease = result ? parseFloat(result.fleschEase) : 0;
  const { label: eLabel, color: eColor } = result ? easeLabel(ease) : { label: "", color: "" };

  return (
    <div className="space-y-5">
      <div>
        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider block mb-2">
          Paste Your Text
        </label>
        <Textarea
          className="font-mono text-sm min-h-[220px] resize-none"
          placeholder="Paste any text to analyze its reading level — blog posts, documentation, marketing copy…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <p className="text-xs text-muted-foreground mt-1">All analysis runs in your browser. Your text is never uploaded.</p>
      </div>

      {result ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Words", value: result.words.toLocaleString() },
              { label: "Sentences", value: result.sentences.toLocaleString() },
              { label: "Syllables", value: result.syllables.toLocaleString() },
              { label: "Avg words / sentence", value: result.avgWordsPerSentence },
              { label: "Avg syllables / word", value: result.avgSyllablesPerWord },
              { label: "Flesch–Kincaid Grade", value: result.fleschGrade },
            ].map((m) => (
              <div key={m.label} className="rounded-lg border border-border bg-muted/30 p-3 text-center">
                <p className="text-xl font-bold font-mono text-foreground">{m.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Flesch Reading Ease</p>
                <p className={`text-3xl font-bold mt-1 ${eColor}`}>{result.fleschEase}</p>
                <p className={`text-sm font-medium mt-1 ${eColor}`}>{eLabel}</p>
              </div>
              <div className="text-right text-xs text-muted-foreground max-w-[180px]">
                <p className="font-semibold mb-1 text-foreground">Score guide</p>
                <p>90–100 · Very easy</p>
                <p>70–90 · Easy</p>
                <p>60–70 · Standard</p>
                <p>30–60 · Difficult</p>
                <p>0–30 · Very confusing</p>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className="h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${ease}%`,
                  background: ease >= 70 ? "#22c55e" : ease >= 50 ? "#eab308" : "#ef4444",
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground text-sm">
          Paste at least a few sentences to see the readability analysis
        </div>
      )}
    </div>
  );
}

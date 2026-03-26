import { useState, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useChainedInput } from "@/hooks/useChainedInput";
import { ChainToolButton } from "@/components/shared/ChainToolButton";

export default function WordCounter() {
  const chained = useChainedInput();
  const [text, setText] = useState(chained);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const paragraphs = trimmed ? trimmed.split(/\n+/).filter(p => p.length > 0).length : 0;
    const sentences = trimmed ? trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0;
    
    // Average reading speed: 200 words per minute
    const readingTimeMinutes = Math.ceil(words / 200);

    return { words, characters, charactersNoSpaces, paragraphs, sentences, readingTimeMinutes };
  }, [text]);

  const statBoxes = [
    { label: "Words", value: stats.words },
    { label: "Characters", value: stats.characters },
    { label: "Characters (no spaces)", value: stats.charactersNoSpaces },
    { label: "Sentences", value: stats.sentences },
    { label: "Paragraphs", value: stats.paragraphs },
    { label: "Reading Time", value: `~${stats.readingTimeMinutes} min` },
  ];

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statBoxes.map((stat, i) => (
          <div key={i} className="bg-muted/40 p-4 rounded-xl border border-border text-center">
            <div className="text-2xl font-display font-bold text-foreground mb-1">{stat.value}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>
      
      <div className="flex-1 relative min-h-[300px]">
        <Textarea
          placeholder="Type or paste your text here..."
          className="w-full h-full min-h-[300px] resize-none text-base p-6 rounded-2xl focus-visible:ring-primary/20 bg-background"
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
      {text && (
        <div className="flex justify-end">
          <ChainToolButton currentSlug="word-counter" outputText={text} />
        </div>
      )}
    </div>
  );
}

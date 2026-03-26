import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LOREM_WORDS = [
  "lorem","ipsum","dolor","sit","amet","consectetur","adipiscing","elit","sed","do",
  "eiusmod","tempor","incididunt","ut","labore","et","dolore","magna","aliqua","enim",
  "ad","minim","veniam","quis","nostrud","exercitation","ullamco","laboris","nisi","aliquip",
  "ex","ea","commodo","consequat","duis","aute","irure","in","reprehenderit","voluptate",
  "velit","esse","cillum","fugiat","nulla","pariatur","excepteur","sint","occaecat","cupidatat",
  "non","proident","sunt","culpa","qui","officia","deserunt","mollit","anim","id","est","laborum",
  "curabitur","pretium","tincidunt","lacus","nec","pulvinar","nisl","tincidunt","integer","at",
  "felis","nam","tristique","enim","vitae","blandit","metus","volutpat","mauris"
];

function randomWord() {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
}

function generateSentence() {
  const len = 8 + Math.floor(Math.random() * 12);
  const words = Array.from({ length: len }, randomWord);
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(" ") + ".";
}

function generateParagraph() {
  const count = 4 + Math.floor(Math.random() * 4);
  return Array.from({ length: count }, generateSentence).join(" ");
}

export default function LoremIpsum() {
  const [type, setType] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState("");
  const { toast } = useToast();

  const generate = () => {
    let result = "";
    if (type === "paragraphs") {
      const paras = Array.from({ length: count }, (_, i) => {
        if (i === 0 && startWithLorem) {
          return "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " + generateParagraph();
        }
        return generateParagraph();
      });
      result = paras.join("\n\n");
    } else if (type === "sentences") {
      const sentences = Array.from({ length: count }, (_, i) => {
        if (i === 0 && startWithLorem) return "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
        return generateSentence();
      });
      result = sentences.join(" ");
    } else {
      const words = Array.from({ length: count }, randomWord);
      if (startWithLorem) words.splice(0, 2, "Lorem", "ipsum");
      result = words.join(" ");
    }
    setOutput(result);
  };

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast({ title: "Copied!", description: "Lorem ipsum copied to clipboard." });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Type</label>
          <div className="flex gap-2">
            {(["paragraphs", "sentences", "words"] as const).map((t) => (
              <Button
                key={t}
                variant={type === t ? "default" : "outline"}
                size="sm"
                onClick={() => setType(t)}
                className="capitalize text-xs"
              >
                {t}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Count</label>
          <div className="flex gap-2">
            {[1, 3, 5, 10].map((n) => (
              <Button
                key={n}
                variant={count === n ? "default" : "outline"}
                size="sm"
                onClick={() => setCount(n)}
              >
                {n}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Start</label>
          <Button
            variant={startWithLorem ? "default" : "outline"}
            size="sm"
            onClick={() => setStartWithLorem(!startWithLorem)}
          >
            {startWithLorem ? "\"Lorem ipsum...\"" : "Random start"}
          </Button>
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={generate} className="flex-1">
          <RefreshCw className="w-4 h-4 mr-2" />
          Generate
        </Button>
        {output && (
          <Button variant="outline" onClick={copy}>
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
        )}
      </div>

      {output ? (
        <div className="bg-muted/30 rounded-2xl p-6 border border-border min-h-[300px]">
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">{output}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-muted-foreground">
          <p className="text-lg">Click Generate to create placeholder text</p>
          <p className="text-sm mt-2 opacity-60">Choose type and count above</p>
        </div>
      )}
    </div>
  );
}

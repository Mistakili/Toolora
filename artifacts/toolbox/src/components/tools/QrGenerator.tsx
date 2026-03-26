import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { downloadFile } from "@/lib/utils";

export default function QrGenerator() {
  const [text, setText] = useState("https://toolora.com");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!text) {
      setQrDataUrl("");
      return;
    }

    const generateQR = async () => {
      try {
        if (canvasRef.current) {
          await QRCode.toCanvas(canvasRef.current, text, {
            width: 300,
            margin: 2,
            color: {
              dark: "#000000",
              light: "#ffffff"
            }
          });
          setQrDataUrl(canvasRef.current.toDataURL("image/png"));
        }
      } catch (err) {
        console.error("QR Generation failed", err);
      }
    };

    const timer = setTimeout(generateQR, 300);
    return () => clearTimeout(timer);
  }, [text]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = 'qr-code.png';
    link.href = qrDataUrl;
    link.click();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center h-full">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Content (URL, Text, Phone number)</label>
          <Input 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            placeholder="Enter URL or text..."
            className="h-14 text-lg rounded-xl"
          />
        </div>
        <div className="bg-muted/50 p-4 rounded-xl border border-border/50 text-sm text-muted-foreground">
          Tip: Shorter text generates less complex, easier-to-scan QR codes. The QR code updates automatically as you type.
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-8 bg-muted/20 rounded-3xl border border-border min-h-[400px]">
        <canvas ref={canvasRef} className="hidden" /> {/* Hidden canvas for rendering */}
        
        {qrDataUrl ? (
          <div className="bg-white p-4 rounded-2xl shadow-xl shadow-black/10 mb-8 transition-all animate-in zoom-in-95">
            <img src={qrDataUrl} alt="Generated QR Code" className="w-64 h-64 object-contain" />
          </div>
        ) : (
          <div className="w-64 h-64 bg-muted/50 rounded-2xl flex items-center justify-center mb-8 border-2 border-dashed border-border text-muted-foreground">
            Enter text to generate
          </div>
        )}

        <div className="flex gap-4">
          <Button 
            onClick={handleDownload} 
            disabled={!qrDataUrl}
            className="rounded-full px-8"
            size="lg"
          >
            <Download className="w-5 h-5 mr-2" /> Download PNG
          </Button>
        </div>
      </div>
    </div>
  );
}

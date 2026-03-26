import { useEffect } from "react";
import { Link } from "wouter";
import { Shield, ChevronRight, Home } from "lucide-react";

export default function Privacy() {
  useEffect(() => {
    document.title = "Privacy Policy | Toolora";
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <nav className="flex items-center text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground transition-colors flex items-center"><Home className="w-4 h-4 mr-1" /> Home</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-foreground font-medium">Privacy Policy</span>
      </nav>

      <div className="flex items-center gap-3 mb-8">
        <div className="bg-primary/10 p-3 rounded-xl text-primary">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground text-sm mt-1">Last updated: March 2026</p>
        </div>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
          <p className="text-primary font-semibold text-lg mb-2">The short version</p>
          <p className="text-foreground/80">Toolora processes everything in your browser. Your files, text, and data never leave your device and are never uploaded to our servers. We don't store your content, period.</p>
        </div>

        <section>
          <h2 className="text-xl font-bold mb-3">1. What We Collect</h2>
          <p className="text-muted-foreground leading-relaxed">Toolora collects minimal, anonymous data to improve the service:</p>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li><strong className="text-foreground">Tool usage counts</strong> — We record which tool pages are visited and how often (e.g. "the JSON Formatter was used 150 times"). No personal data or file content is associated with this count.</li>
            <li><strong className="text-foreground">Standard server logs</strong> — Like all web servers, our hosting provider logs IP addresses and request metadata for security and uptime monitoring. These are not shared or used for profiling.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">2. What We Do NOT Collect</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>✗ Your files (PDFs, images, documents)</li>
            <li>✗ Text you paste or type into any tool</li>
            <li>✗ Your name, email address, or account information</li>
            <li>✗ Passwords you generate using our Password Generator</li>
            <li>✗ Any output produced by our tools</li>
          </ul>
          <p className="mt-3 text-muted-foreground">All tool processing is performed entirely within your browser using browser APIs and WebAssembly. No data is transmitted to our servers during tool usage.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">3. Cookies & Local Storage</h2>
          <p className="text-muted-foreground leading-relaxed">Toolora uses browser local storage solely to remember your theme preference (dark/light mode). No tracking cookies are set. No third-party advertising or analytics services are used.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">4. Third-Party Services</h2>
          <p className="text-muted-foreground leading-relaxed">Toolora is hosted on Replit. Replit's own privacy policy applies to infrastructure-level data. Beyond hosting, we do not share data with any third-party analytics, advertising, or data brokers.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">5. Children's Privacy</h2>
          <p className="text-muted-foreground leading-relaxed">Toolora does not knowingly collect data from children under 13. The service is general-purpose and not directed at children.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">6. Changes to This Policy</h2>
          <p className="text-muted-foreground leading-relaxed">We may update this policy as the service evolves. Significant changes will be noted on this page with an updated date. Continued use of Toolora after changes constitutes acceptance of the updated policy.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">7. Contact</h2>
          <p className="text-muted-foreground leading-relaxed">Questions about this policy? You can reach us through the Toolora website. We'll respond as quickly as possible.</p>
        </section>
      </div>
    </div>
  );
}

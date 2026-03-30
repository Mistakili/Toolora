export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  content: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "merge-pdfs-without-uploading",
    title: "How to Merge PDFs Without Uploading Files (100% Free, Works in Your Browser)",
    description: "Most PDF tools send your files to remote servers. Here's how to merge PDFs entirely in your browser — no uploads, no accounts, no risk.",
    date: "2026-03-30",
    readTime: "5 min read",
    category: "Privacy",
    content: `
<p>If you've ever Googled "merge PDFs free," you've probably landed on tools like iLovePDF, SmallPDF, or Adobe Acrobat. They work — but there's a catch: <strong>your files leave your computer</strong>. Every page of every PDF gets uploaded to someone else's server, processed, and returned to you.</p>

<p>For most people that's fine. But if your PDFs contain contracts, medical records, financial statements, or anything remotely personal, that's a real privacy risk.</p>

<h2>Why most PDF tools require uploads</h2>

<p>PDF processing used to require server-side computing power. The libraries that manipulate PDF files — merging pages, splitting documents, compressing them — were heavy, slow, and only practical to run on a server.</p>

<p>That's changed. WebAssembly (WASM) lets browsers run near-native code locally. Libraries like <strong>pdf-lib</strong> now run entirely in the browser, with no server involvement at all.</p>

<h2>How to merge PDFs without uploading anything</h2>

<p>Toolora's <a href="/tools/documents/pdf-merge">PDF Merge tool</a> runs entirely in your browser using pdf-lib. Here's exactly what happens when you use it:</p>

<ol>
  <li><strong>You select your PDF files</strong> — they're read directly by your browser's File API</li>
  <li><strong>pdf-lib processes them locally</strong> — pages are extracted and combined in memory on your device</li>
  <li><strong>The merged PDF is generated</strong> — and offered as a download, directly from browser memory</li>
  <li><strong>Nothing is transmitted</strong> — no file data leaves your machine at any point</li>
</ol>

<p>You can verify this yourself: open your browser's Network tab (F12 → Network) before using the tool. You'll see zero file upload requests.</p>

<h2>Step-by-step: merging PDFs on Toolora</h2>

<ol>
  <li>Go to <a href="/tools/documents/pdf-merge">toolora.dev/tools/documents/pdf-merge</a></li>
  <li>Click "Add PDFs" and select the files you want to merge (you can select multiple at once)</li>
  <li>Drag to reorder pages if needed</li>
  <li>Click "Merge PDFs"</li>
  <li>Download your merged file</li>
</ol>

<p>The tool handles files of any size — your computer's RAM is the only limit. No file size restrictions, no watermarks, no "upgrade to premium" gates.</p>

<h2>What about PDF splitting?</h2>

<p>The same privacy-first approach applies to our <a href="/tools/documents/pdf-split">PDF Split tool</a>. Split a PDF into individual pages or ranges, all in-browser.</p>

<h2>When you might still need a server-side tool</h2>

<p>Client-side PDF processing covers 95% of use cases. The exceptions:</p>
<ul>
  <li>Password-protected PDFs (decryption sometimes requires server-side libraries)</li>
  <li>Very large files (&gt;500MB) where RAM becomes a constraint on older devices</li>
  <li>OCR (converting scanned PDFs to searchable text) — that's computationally heavy enough that server-side is often better</li>
</ul>

<p>For everything else — merging, splitting, reordering — your browser is more than capable.</p>

<h2>The bottom line</h2>

<p>You don't need to upload your PDFs to merge them. Browser-based PDF tools have caught up to server-side alternatives in capability, and they're faster too (no upload time). If privacy matters to you, there's no reason to use anything else.</p>

<p>Try it: <a href="/tools/documents/pdf-merge">Merge your PDFs here — no upload required →</a></p>
    `.trim(),
  },
  {
    slug: "best-free-image-compressor-privacy",
    title: "The Best Free Image Compressor That Doesn't See Your Files",
    description: "TinyPNG, Squoosh, Canva — they all upload your images. Here's a faster alternative that compresses images entirely in your browser.",
    date: "2026-03-30",
    readTime: "4 min read",
    category: "Privacy",
    content: `
<p>Image compression is one of the most common tasks on the web. Developers optimize assets before shipping. Designers compress screenshots before sharing. Bloggers shrink photos before uploading.</p>

<p>The go-to tools — TinyPNG, Squoosh, Compressor.io — do a great job. But they all have one thing in common: <strong>your images are uploaded to their servers</strong>.</p>

<p>For a product screenshot, that's probably fine. For a photo of a document, a whiteboard full of sensitive notes, or anything you'd rather keep private — it's worth thinking twice.</p>

<h2>How image compression normally works</h2>

<p>Traditional compression tools use server-side codecs (MozJPEG, libvips, pngquant) because they're fast, mature, and support advanced algorithms. Your image goes up, gets processed, comes back smaller.</p>

<p>The tradeoff: the service operator can see, log, or retain your images. Most reputable services don't — but "trust us" isn't the same as "technically impossible."</p>

<h2>The browser-native alternative</h2>

<p>Modern browsers support the <strong>Canvas API</strong> and <strong>WebAssembly</strong>, which together are capable of high-quality image compression without any server involvement.</p>

<p>Toolora's <a href="/tools/images/image-compress">Image Compress tool</a> uses these browser APIs to:</p>
<ul>
  <li>Load your image into a canvas element</li>
  <li>Re-encode it at your chosen quality level (JPEG/WebP)</li>
  <li>Generate the compressed file entirely in memory</li>
  <li>Offer it as a direct download — no upload, no server</li>
</ul>

<h2>Comparing the options</h2>

<table>
  <thead>
    <tr><th>Tool</th><th>Uploads files?</th><th>Free?</th><th>File size limit?</th></tr>
  </thead>
  <tbody>
    <tr><td>TinyPNG</td><td>Yes</td><td>20 files/mo free</td><td>5MB</td></tr>
    <tr><td>Squoosh (Google)</td><td>No (WASM)</td><td>Yes</td><td>None stated</td></tr>
    <tr><td>Compressor.io</td><td>Yes</td><td>10MB limit free</td><td>10MB</td></tr>
    <tr><td><strong>Toolora</strong></td><td><strong>No</strong></td><td><strong>Unlimited</strong></td><td><strong>None</strong></td></tr>
  </tbody>
</table>

<p>Squoosh is Google's browser-based compressor and it's excellent — the main difference is Toolora is a single destination for all your tools (resize, convert format, compress) without switching tabs.</p>

<h2>How to compress images on Toolora</h2>

<ol>
  <li>Go to <a href="/tools/images/image-compress">toolora.dev/tools/images/image-compress</a></li>
  <li>Drop your image or click to select (JPEG, PNG, WebP supported)</li>
  <li>Adjust the quality slider (80% is usually the sweet spot — barely visible quality loss, ~60% file size reduction)</li>
  <li>Click Compress and download</li>
</ol>

<p>You can also chain tools — compress an image and then <a href="/tools/images/image-resize">resize it</a> or <a href="/tools/images/image-convert">convert the format</a> without leaving the browser.</p>

<h2>What about batch compression?</h2>

<p>Single-file compression is live now. Batch processing (multiple files at once) is on the roadmap — if that's important to you, <a href="/#subscribe">subscribe for updates</a> and we'll let you know when it ships.</p>

<h2>The short version</h2>

<p>For everyday image compression, a browser-based tool is faster (no upload time), free, and private. TinyPNG and Squoosh are both good — but if you want all your image tools in one place with zero server involvement, <a href="/tools/images/image-compress">give Toolora a try</a>.</p>
    `.trim(),
  },
  {
    slug: "why-i-built-client-side-toolbox",
    title: "Why I Built a 100% Client-Side Toolbox",
    description: "The story behind Toolora — why I decided every tool should run in the browser, what that means technically, and what the tradeoffs are.",
    date: "2026-03-30",
    readTime: "6 min read",
    category: "Behind the Build",
    content: `
<p>I got annoyed.</p>

<p>I was compressing a screenshot to paste into a document. Opened TinyPNG, uploaded the file, waited for the upload, waited for processing, downloaded the result. For an image that was already on my computer.</p>

<p>That's a ridiculous amount of round-tripping for a task that a $50 device from 2015 could handle in under a second locally.</p>

<h2>The original sin of web tools</h2>

<p>Most "free online tools" were built in an era when browsers couldn't do much. JavaScript was slow, there was no WebAssembly, and anything computationally heavy had to run on a server. So tools uploaded your file, processed it server-side, and returned the result.</p>

<p>That model made sense in 2010. It doesn't make sense in 2026.</p>

<p>Today's browsers can run C and Rust code at near-native speed via WebAssembly. They have <strong>pdf-lib</strong> for PDF manipulation, <strong>sharp (WASM)</strong> for image processing, <strong>jszip</strong> for archives, the <strong>Canvas API</strong> for pixel-level image operations, and <strong>SubtleCrypto</strong> for cryptographic hashing. Everything I need to build a serious tool runs natively in the browser.</p>

<h2>What "client-side only" actually means</h2>

<p>When you use a tool on Toolora, here's what happens:</p>
<ul>
  <li>Your file is read by the browser's <strong>File API</strong> — it never leaves your device</li>
  <li>A WebAssembly module or native browser API processes it in memory</li>
  <li>The output is offered as a download — generated directly from browser memory</li>
  <li>Zero bytes of your file content are transmitted to any server</li>
</ul>

<p>You can prove this to yourself. Open DevTools → Network tab → use any Toolora tool. You'll see requests for the JS/WASM bundles (on first load), but nothing resembling a file upload.</p>

<h2>The privacy angle I didn't expect to care about</h2>

<p>I built Toolora for speed, not privacy. I just didn't want to wait for uploads.</p>

<p>But as I built it, I started thinking about the tools I was replacing. PDF merge tools that see your contracts. Image compressors that see your screenshots. QR code generators that see what you're encoding. Most of these services have privacy policies that are technically fine but practically opaque.</p>

<p>With client-side processing, the privacy story is technically enforced, not policy-enforced. It's not "we promise not to look at your files" — it's "the files never reach us." That's a meaningfully different guarantee.</p>

<h2>The tools I built and how they work</h2>

<p>Here's the tech stack behind the main tools:</p>

<ul>
  <li><strong><a href="/tools/documents/pdf-merge">PDF Merge / Split</a></strong> — pdf-lib (pure JavaScript, runs in browser)</li>
  <li><strong><a href="/tools/images/image-compress">Image Compress</a></strong> — HTML5 Canvas API with quality control</li>
  <li><strong><a href="/tools/images/image-resize">Image Resize</a></strong> — Canvas API, nearest-neighbor and bilinear interpolation</li>
  <li><strong><a href="/tools/images/image-convert">Image Convert</a></strong> — Canvas API, supports JPEG/PNG/WebP output</li>
  <li><strong><a href="/tools/developer/hash-generator">Hash Generator</a></strong> — Web Crypto API (SHA-256, SHA-512, MD5)</li>
  <li><strong><a href="/tools/developer/uuid-generator">UUID Generator</a></strong> — crypto.randomUUID() native browser API</li>
  <li><strong><a href="/tools/developer/json-formatter">JSON Formatter</a></strong> — JSON.parse/stringify with custom indentation</li>
  <li><strong><a href="/tools/text/base64">Base64 Encoder/Decoder</a></strong> — atob/btoa with UTF-8 handling</li>
  <li><strong><a href="/tools/utilities/qr-generator">QR Generator</a></strong> — qrcode.js WASM, renders to canvas</li>
</ul>

<h2>The tradeoffs</h2>

<p>Client-side processing isn't free. There are real constraints:</p>

<p><strong>Memory limits.</strong> Very large files can exhaust browser memory. A 1GB video file won't process well client-side. I scope Toolora to document and image tasks where files are typically under 100MB.</p>

<p><strong>No persistent state.</strong> There's no account, no history stored server-side, no "access your files from anywhere." What you process lives and dies in your browser session. (The <a href="/history">history page</a> uses localStorage — it's entirely local.)</p>

<p><strong>First load time.</strong> WebAssembly bundles can be large. I cache them aggressively, but the first time you use a tool, you might wait a second for the WASM module to download.</p>

<p><strong>Some tasks genuinely need a server.</strong> OCR, large-scale video processing, AI-based features — these aren't practical client-side yet. I'm honest about this: the <a href="/api-docs">Agent API</a> exists for exactly these cases, and yes, it does process files server-side (with clear disclosure).</p>

<h2>What's next</h2>

<p>The plan is to keep expanding the toolset — more developer utilities, more document tools, and eventually batch processing for images and PDFs. If you want to know when new tools ship, <a href="/#subscribe">subscribe here</a>.</p>

<p>And if you've built something similar or have opinions on where client-side processing is headed, I'd genuinely like to hear it.</p>
    `.trim(),
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

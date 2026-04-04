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
  {
    slug: "base64-encode-decode-online",
    title: "Free Base64 Encoder & Decoder — No Sign-Up, No Server Required",
    description: "Base64 encoding explained in plain English, plus a free browser-based tool that encodes and decodes instantly — no account, no data sent anywhere.",
    date: "2026-03-31",
    readTime: "4 min read",
    category: "Developer",
    content: `
<p>Base64 is one of those things developers run into constantly but rarely stop to understand. You need to encode an API payload, decode a JWT claim, or handle a file attachment in an email — and suddenly you're Googling "base64 decode online" for the fifth time this week.</p>

<p>This post covers what Base64 actually is, when you need it, and how to encode and decode it without sending your data to a stranger's server.</p>

<h2>What is Base64?</h2>

<p>Base64 is an encoding scheme that converts binary data into a string of ASCII characters. It uses 64 characters — A–Z, a–z, 0–9, and <code>+</code> and <code>/</code> — to represent any binary data.</p>

<p>The name comes from the fact that it uses a 64-character alphabet. Each Base64 character represents 6 bits of data, which means every 3 bytes of binary becomes 4 Base64 characters. That's roughly a 33% size increase — a reasonable tradeoff for making binary data safe to transmit as text.</p>

<h2>Why do we need Base64?</h2>

<p>Many systems were designed to handle text, not raw binary. Email protocols, HTTP headers, URLs, and JSON are all text-based. When you need to embed binary data — an image, a file, a cryptographic key — inside a text format, Base64 is the standard solution.</p>

<p>Common use cases:</p>
<ul>
  <li><strong>Email attachments</strong> — MIME encoding uses Base64 to embed files in email bodies</li>
  <li><strong>Data URIs</strong> — <code>src="data:image/png;base64,..."</code> embeds images directly in HTML</li>
  <li><strong>JWT tokens</strong> — the payload and header are Base64url-encoded JSON</li>
  <li><strong>API payloads</strong> — sending binary files through JSON APIs</li>
  <li><strong>Basic Auth</strong> — HTTP Basic Authentication encodes <code>username:password</code> as Base64</li>
  <li><strong>Cryptographic keys</strong> — PEM files are Base64-encoded certificates</li>
</ul>

<h2>Base64 vs Base64url</h2>

<p>Standard Base64 uses <code>+</code> and <code>/</code> characters, which have special meaning in URLs. Base64url replaces them with <code>-</code> and <code>_</code>, making the encoded string safe to use in URLs and filenames without percent-encoding.</p>

<p>JWT tokens use Base64url. Standard Base64 is used everywhere else.</p>

<h2>How to encode and decode Base64 online (privately)</h2>

<p>Most online Base64 tools send your data to a server for processing. That's fine for public data, but if you're encoding anything sensitive — a private key, a password, credentials — you probably don't want to paste it into a random website.</p>

<p>Toolora's <a href="/tools/developer/base64">Base64 Encoder/Decoder</a> runs entirely in your browser using the Web API's built-in <code>btoa()</code> and <code>atob()</code> functions. Nothing leaves your machine.</p>

<p>To encode text to Base64:</p>
<ol>
  <li>Go to <a href="/tools/developer/base64">toolora.dev/tools/developer/base64</a></li>
  <li>Select "Encode"</li>
  <li>Paste your text in the input field</li>
  <li>Copy the Base64 output</li>
</ol>

<p>To decode Base64 back to text:</p>
<ol>
  <li>Select "Decode"</li>
  <li>Paste your Base64 string</li>
  <li>Read the decoded output</li>
</ol>

<h2>Doing it in code</h2>

<p>You usually don't need a tool if you're already in a coding environment:</p>

<p><strong>JavaScript (browser or Node.js):</strong></p>
<pre><code>// Encode
btoa("Hello, world!")          // "SGVsbG8sIHdvcmxkIQ=="
// Decode
atob("SGVsbG8sIHdvcmxkIQ==")  // "Hello, world!"</code></pre>

<p><strong>Python:</strong></p>
<pre><code>import base64
base64.b64encode(b"Hello, world!")  # b'SGVsbG8sIHdvcmxkIQ=='
base64.b64decode("SGVsbG8sIHdvcmxkIQ==")  # b'Hello, world!'</code></pre>

<p><strong>Command line:</strong></p>
<pre><code>echo -n "Hello, world!" | base64          # encode
echo "SGVsbG8sIHdvcmxkIQ==" | base64 -d  # decode</code></pre>

<h2>The = padding at the end</h2>

<p>Base64 output is always a multiple of 4 characters. If the input doesn't divide evenly, <code>=</code> characters are added as padding. One or two <code>=</code> at the end is completely normal — it's not an error.</p>

<p>Some implementations strip padding (JWT does this). If you're getting "invalid Base64" errors, try adding <code>=</code> signs until the length is a multiple of 4.</p>
    `.trim(),
  },
  {
    slug: "free-password-generator-no-signup",
    title: "How to Generate Strong Passwords Without a Password Manager",
    description: "What makes a password strong, why most people get it wrong, and how to generate truly random passwords instantly — without installing anything or sending data anywhere.",
    date: "2026-03-31",
    readTime: "5 min read",
    category: "Security",
    content: `
<p>Most people know they should use strong, unique passwords. Most people don't. The gap between knowing and doing comes down to friction — strong passwords are hard to create, hard to remember, and annoying to type.</p>

<p>This post covers what actually makes a password strong (not what most people think), and how to generate one in seconds without installing anything.</p>

<h2>What makes a password strong?</h2>

<p>Two things matter above all else: <strong>length</strong> and <strong>randomness</strong>. Everything else is secondary.</p>

<p><strong>Length</strong> is the biggest factor. Every additional character multiplies the number of possible combinations an attacker has to try. A 16-character password is not twice as hard to crack as an 8-character one — it's orders of magnitude harder.</p>

<p><strong>Randomness</strong> is the second factor. "P@ssw0rd!" is technically 9 characters with mixed case, numbers, and symbols — but it's among the first things attackers try because humans are predictable. Real randomness means using a cryptographically secure random number generator, not picking something that "seems random."</p>

<p>Complexity requirements (must include uppercase, number, symbol) help but matter far less than length. A 20-character random lowercase string is stronger than a 10-character string with every character type.</p>

<h2>Common password mistakes</h2>

<ul>
  <li><strong>Using the same password everywhere</strong> — if one site is breached, all your accounts are compromised</li>
  <li><strong>Using personal information</strong> — birthdays, names, and places are all guessable</li>
  <li><strong>Predictable substitutions</strong> — <code>a → @</code>, <code>e → 3</code>, <code>o → 0</code> — attackers account for these</li>
  <li><strong>Short passwords</strong> — anything under 12 characters is increasingly crackable with modern hardware</li>
  <li><strong>Keyboard patterns</strong> — <code>qwerty</code>, <code>123456</code>, <code>asdf</code> — the first things tried</li>
</ul>

<h2>How Toolora generates passwords</h2>

<p>Toolora's <a href="/tools/productivity/password-generator">Password Generator</a> uses the Web Crypto API's <code>crypto.getRandomValues()</code> — the same cryptographically secure random number generator your browser uses for encryption. This is genuinely random, not pseudorandom.</p>

<p>Everything runs in your browser. The generated password is never transmitted anywhere. You can verify this: open the Network tab in DevTools while generating — you'll see zero outbound requests.</p>

<p>To generate a strong password:</p>
<ol>
  <li>Go to <a href="/tools/productivity/password-generator">toolora.dev/tools/productivity/password-generator</a></li>
  <li>Set length to at least 16 characters (20+ for sensitive accounts)</li>
  <li>Enable uppercase, numbers, and symbols</li>
  <li>Click Generate and copy</li>
</ol>

<h2>What to do with the password once you have it</h2>

<p>A random 20-character password like <code>xK#9mPqR!vL2nZ@wY7cJ</code> is impossible to remember — and that's fine. You shouldn't be memorizing passwords. Use a password manager:</p>

<ul>
  <li><strong>Bitwarden</strong> — open source, free, excellent browser extension</li>
  <li><strong>1Password</strong> — polished, great for teams, subscription-based</li>
  <li><strong>KeePassXC</strong> — fully offline, open source, no cloud</li>
</ul>

<p>The one password you need to remember is your master password. Make it a passphrase — four or five random words strung together. Long, random, and far more memorable than a string of characters.</p>

<h2>What about online password generators?</h2>

<p>Most online password generators are fine — but some send your generation request to a server, which is pointless at best and a privacy risk at worst. The whole point of a random password is that only you know it.</p>

<p>Generating passwords in the browser eliminates that concern entirely. The randomness is local, the output never leaves your device, and there's no account required.</p>
    `.trim(),
  },
  {
    slug: "free-qr-code-generator-no-watermark",
    title: "The Best Free QR Code Generator — No Watermarks, No Sign-Up, No Ads",
    description: "Most free QR code generators add watermarks, expire your codes, or require an account. Here's how to generate clean QR codes instantly, for free, with no strings attached.",
    date: "2026-03-31",
    readTime: "4 min read",
    category: "Productivity",
    content: `
<p>QR codes are everywhere now — restaurant menus, business cards, product packaging, event tickets. Creating one should be simple. But search for "free QR code generator" and you'll find a minefield of tools that add watermarks, charge for downloads, expire your codes after 30 days, or require an email address to get started.</p>

<p>Here's a cleaner path.</p>

<h2>The problem with most "free" QR code generators</h2>

<p>The business model for most QR code tools is to give you a basic QR code for free, then charge you for the things you actually need:</p>

<ul>
  <li><strong>Watermarks</strong> — the free version stamps their logo on your code</li>
  <li><strong>Link expiry</strong> — the QR code stops working after 30 or 90 days unless you pay</li>
  <li><strong>Scan limits</strong> — free codes only work for a limited number of scans</li>
  <li><strong>Required account</strong> — you have to sign up before you can download</li>
  <li><strong>Tracking</strong> — your QR code links through their servers so they can sell analytics data</li>
</ul>

<p>All of this is understandable as a business model. But for many use cases — a personal project, a one-time event, a business card, a link you want to share quickly — you just need a clean QR code that works forever. You don't need tracking or analytics.</p>

<h2>How static QR codes work</h2>

<p>A QR code is just a visual encoding of a string of text. The "dynamic" QR codes that expire or can be edited are a tracking trick — they encode a link to the QR service's server, which then redirects to your actual URL. The service can change or disable that redirect whenever they want.</p>

<p>A "static" QR code encodes your URL directly. It works forever, can't be disabled, doesn't go through any third party's servers, and has no expiry. The tradeoff: you can't change the destination after printing, and there's no scan tracking. For most use cases, that's fine.</p>

<h2>Generate a free QR code with no strings attached</h2>

<p>Toolora's <a href="/tools/productivity/qr-generator">QR Code Generator</a> creates static QR codes entirely in your browser using the <code>qrcode</code> library. Here's how it works:</p>

<ol>
  <li>Go to <a href="/tools/productivity/qr-generator">toolora.dev/tools/productivity/qr-generator</a></li>
  <li>Type or paste any URL or text</li>
  <li>Customize the colors if you want</li>
  <li>Download as PNG — clean, no watermark</li>
</ol>

<p>No account. No expiry. No watermark. The QR code is generated in your browser and downloaded directly — nothing passes through any server.</p>

<h2>What can you put in a QR code?</h2>

<p>Anything that's text:</p>
<ul>
  <li><strong>URLs</strong> — the most common use case</li>
  <li><strong>Plain text</strong> — a short message, a Wi-Fi password, an address</li>
  <li><strong>Email addresses</strong> — <code>mailto:you@example.com</code></li>
  <li><strong>Phone numbers</strong> — <code>tel:+1234567890</code></li>
  <li><strong>Wi-Fi credentials</strong> — <code>WIFI:S:MyNetwork;T:WPA;P:mypassword;;</code></li>
  <li><strong>vCards</strong> — contact information in standard format</li>
</ul>

<h2>Tips for printing QR codes</h2>

<p>A few practical things that will save you frustration:</p>

<ul>
  <li><strong>Test before printing</strong> — scan it on a real phone before you commit to print</li>
  <li><strong>Bigger is better</strong> — at minimum, print at 2cm × 2cm for reliable scanning; larger if it'll be scanned from a distance</li>
  <li><strong>High contrast</strong> — dark code on light background always works best; avoid light-on-dark or overly colored codes</li>
  <li><strong>Download as PNG at high resolution</strong> — don't screenshot it and then scale it up, the pixels will blur</li>
  <li><strong>Keep the quiet zone</strong> — QR codes need a margin of white space around them to scan reliably; don't crop it too tight</li>
</ul>

<p>A QR code should take you 30 seconds to create. There's no reason to hand your email address to a service or pay for a watermark-free download to get there.</p>
    `.trim(),
  },
  {
    slug: "json-formatter-validate-debug",
    title: "JSON Formatter: How to Read, Validate and Debug JSON Online",
    description: "JSON errors are cryptic. A missing comma, a trailing brace, or a quote out of place can break everything. Here's how to format, validate, and debug JSON fast — no server required.",
    date: "2026-03-31",
    readTime: "5 min read",
    category: "Developer",
    content: `
<p>JSON is everywhere. APIs return it. Config files use it. Databases store it. And when something breaks, the error message is rarely helpful: "SyntaxError: Unexpected token }" with a line number that doesn't quite match what you're looking at.</p>

<p>A good JSON formatter turns unreadable blobs into structured, human-readable documents in one click. Here's how to get the most out of one.</p>

<h2>What is JSON, and why does formatting matter?</h2>

<p>JSON (JavaScript Object Notation) is a text format for structured data. Valid JSON can be minified — stripped of all whitespace — into a single line. That's great for network transmission (smaller payload) but terrible for humans trying to read it.</p>

<p>This is valid JSON:</p>
<pre><code>{"user":{"id":42,"name":"Alice","roles":["admin","editor"],"active":true}}</code></pre>

<p>This is the same JSON, formatted:</p>
<pre><code>{
  "user": {
    "id": 42,
    "name": "Alice",
    "roles": ["admin", "editor"],
    "active": true
  }
}</code></pre>

<p>The structure becomes immediately visible. Nested objects, array contents, and key-value pairs are all easy to read. When you're debugging an API response at midnight, the difference matters.</p>

<h2>Common JSON errors and how to spot them</h2>

<p><strong>Trailing comma</strong> — JSON doesn't allow a comma after the last item in an object or array. JavaScript does (it's valid ES5+), which is why developers constantly trip on this:</p>
<pre><code>{ "name": "Alice", }  // ❌ Invalid JSON — trailing comma</code></pre>

<p><strong>Single quotes</strong> — JSON requires double quotes. Single quotes are not valid, even though they work in JavaScript:</p>
<pre><code>{ 'name': 'Alice' }  // ❌ Invalid JSON — single quotes</code></pre>

<p><strong>Unquoted keys</strong> — object keys must be strings (double-quoted). JavaScript allows unquoted keys in object literals, but JSON doesn't:</p>
<pre><code>{ name: "Alice" }  // ❌ Invalid JSON — unquoted key</code></pre>

<p><strong>Comments</strong> — JSON has no comment syntax. <code>//</code> and <code>/* */</code> are not valid:</p>
<pre><code>{ "name": "Alice" /* the user */ }  // ❌ Invalid JSON</code></pre>

<p><strong>Undefined, NaN, Infinity</strong> — these JavaScript values have no JSON equivalent. If an API or library produces them, the JSON is malformed:</p>
<pre><code>{ "value": undefined }  // ❌ Invalid JSON</code></pre>

<h2>How to format and validate JSON instantly</h2>

<p>Toolora's <a href="/tools/developer/json-formatter">JSON Formatter</a> lets you paste any JSON — minified, broken, or otherwise — and instantly see:</p>
<ul>
  <li>A formatted, indented version</li>
  <li>Validation errors with the line and character position</li>
  <li>The option to minify back to a single line for transmission</li>
</ul>

<p>Everything runs in your browser. API keys, tokens, user data — nothing is transmitted anywhere.</p>

<ol>
  <li>Go to <a href="/tools/developer/json-formatter">toolora.dev/tools/developer/json-formatter</a></li>
  <li>Paste your JSON in the left panel</li>
  <li>See the formatted output instantly on the right</li>
  <li>If there's an error, it'll show you exactly where</li>
</ol>

<h2>Reading deeply nested JSON</h2>

<p>When JSON has many levels of nesting — an API response with nested objects inside arrays inside objects — it can be hard to trace a value back to its parent. A few tricks help:</p>

<ul>
  <li><strong>Collapse sections</strong> — most formatters let you collapse object/array nodes you don't care about</li>
  <li><strong>Use the path</strong> — click a value to see its full path: <code>response.data.users[2].roles[0]</code></li>
  <li><strong>Copy a subtree</strong> — select just the nested object you need and copy it separately</li>
</ul>

<h2>JSON vs JSONC vs JSON5</h2>

<p>Standard JSON is strict. But a few extensions relax the rules for human-authored config files:</p>

<ul>
  <li><strong>JSONC</strong> (JSON with Comments) — allows <code>//</code> and <code>/* */</code> comments. Used in <code>tsconfig.json</code>, VS Code settings, and similar config files.</li>
  <li><strong>JSON5</strong> — allows comments, trailing commas, single quotes, and unquoted keys. More permissive, less commonly supported.</li>
</ul>

<p>If you're getting JSON parse errors on a config file, check whether it's actually JSONC or JSON5 — you may need a different parser, not a fixed JSON document.</p>

<h2>Minifying JSON for production</h2>

<p>When sending JSON over the network, whitespace is pure overhead. A formatted 10KB JSON file might minify to 6KB — a meaningful saving for frequently-called API endpoints.</p>

<p>The Toolora JSON Formatter includes a minify option that strips all unnecessary whitespace. Paste your formatted JSON, click Minify, copy the output. No build step required.</p>
    `.trim(),
  },
  {
    slug: "hashing-vs-encryption-whats-the-difference",
    title: "Hashing vs Encryption: What's the Difference and When to Use Each",
    description: "Hashing and encryption are both used to protect data, but they work very differently. Learn the key distinctions, common algorithms, and when to use each — with code examples.",
    date: "2026-04-01",
    readTime: "7 min read",
    category: "Security",
    content: `
<p>Every developer will eventually hit the moment where they need to "secure some data" and the question comes up: should I hash this or encrypt it?</p>

<p>Most tutorials give you one line — "use bcrypt for passwords" — and move on. But understanding <em>why</em> changes how you think about every security decision you make. Let's actually explain it.</p>

<h2>What Is Hashing?</h2>

<p>A hash function takes any input and returns a fixed-length output called a <strong>hash</strong> (or digest). The key properties:</p>

<ul>
  <li><strong>One-way</strong>: You can hash a value but you cannot reverse the hash back to the original</li>
  <li><strong>Deterministic</strong>: The same input always produces the same hash</li>
  <li><strong>Avalanche effect</strong>: Changing even one character completely changes the output</li>
  <li><strong>Fixed-size output</strong>: SHA-256 always outputs 64 hex characters regardless of input size</li>
</ul>

<p>Example with SHA-256:</p>

<pre><code>Input:  "password123"
Output: ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f

Input:  "password124"  ← one character different
Output: 6b4ab9b17e3c...  ← completely different</code></pre>

<h3>Common Hash Algorithms</h3>

<table>
  <thead><tr><th>Algorithm</th><th>Output Size</th><th>Use Today?</th></tr></thead>
  <tbody>
    <tr><td>MD5</td><td>128-bit (32 hex chars)</td><td>No — collision attacks known</td></tr>
    <tr><td>SHA-1</td><td>160-bit (40 hex chars)</td><td>No — deprecated</td></tr>
    <tr><td>SHA-256</td><td>256-bit (64 hex chars)</td><td>Yes — file integrity, digital signatures</td></tr>
    <tr><td>SHA-512</td><td>512-bit (128 hex chars)</td><td>Yes — high-security contexts</td></tr>
    <tr><td>bcrypt</td><td>Variable</td><td>Yes — passwords only</td></tr>
    <tr><td>Argon2</td><td>Variable</td><td>Yes — passwords (best choice)</td></tr>
  </tbody>
</table>

<h2>What Is Encryption?</h2>

<p>Encryption also transforms data — but it's <strong>two-way</strong>. You encrypt a value and you can decrypt it back to the original using a key.</p>

<ul>
  <li><strong>Reversible</strong>: With the right key, anyone can decrypt the data</li>
  <li><strong>Requires a key</strong>: Security depends entirely on keeping the key secret</li>
  <li><strong>Two types</strong>: Symmetric (same key encrypts and decrypts) and asymmetric (public/private key pairs)</li>
</ul>

<pre><code>const encrypted = encrypt("secret message", key)  // → "a3f9b2c1..."
const decrypted = decrypt(encrypted, key)          // → "secret message"</code></pre>

<h2>The Core Difference</h2>

<table>
  <thead><tr><th></th><th>Hashing</th><th>Encryption</th></tr></thead>
  <tbody>
    <tr><td><strong>Reversible?</strong></td><td>No</td><td>Yes (with key)</td></tr>
    <tr><td><strong>Use for passwords?</strong></td><td>Yes (with bcrypt/Argon2)</td><td>Never</td></tr>
    <tr><td><strong>Use for data you need back?</strong></td><td>No</td><td>Yes</td></tr>
    <tr><td><strong>Depends on a secret key?</strong></td><td>No</td><td>Yes</td></tr>
  </tbody>
</table>

<p>The mental model: <strong>hash when you only need to verify, encrypt when you need to recover.</strong></p>

<h2>When to Use Hashing</h2>

<h3>1. Storing passwords</h3>

<p>Never store plain-text passwords. Never store <em>encrypted</em> passwords either — if your database leaks along with your encryption key, every password is exposed instantly.</p>

<p>Hash passwords with a slow algorithm designed for this purpose:</p>

<pre><code>// Node.js with bcrypt
const bcrypt = require('bcrypt');
const hash = await bcrypt.hash('userpassword', 12);

// Verify later
const match = await bcrypt.compare('userpassword', hash); // → true</code></pre>

<p>Why slow? Bcrypt and Argon2 are intentionally slow to make brute-force attacks impractical. SHA-256 is too fast for passwords — attackers can try billions of guesses per second.</p>

<h3>2. File integrity verification</h3>

<p>When you download a file, you can hash it and compare to the publisher's published hash. If they match, the file wasn't tampered with.</p>

<h3>3. Data deduplication</h3>

<p>Hash file contents to detect duplicates without storing the files twice. Git does exactly this — every commit, tree, and blob is identified by its SHA-1 hash.</p>

<h3>4. Digital signatures</h3>

<p>You hash a document, then sign the hash with your private key. The recipient verifies the signature against the hash to confirm authenticity and integrity.</p>

<h2>When to Use Encryption</h2>

<h3>1. Data you need to retrieve</h3>

<p>Credit card numbers, API keys, SSNs, personal messages — anything you need to read back in plaintext later must be encrypted, not hashed.</p>

<h3>2. Data in transit</h3>

<p>TLS (HTTPS) uses asymmetric encryption to exchange a symmetric session key, then encrypts all traffic with that session key.</p>

<h3>3. Sensitive configuration values</h3>

<p>API keys in your database should be encrypted at rest. If your DB leaks, raw keys are immediately exploitable — encrypted keys are not (unless the encryption key also leaks, which is why key management matters).</p>

<h2>The Mistake That Gets People Hacked</h2>

<p>The most common mistake: hashing data that needs to be retrieved later, or encrypting passwords.</p>

<pre><code>// Wrong — don't encrypt passwords
const storedPassword = encrypt(userPassword, APP_SECRET);

// Wrong — SHA-256 is too fast for passwords
const storedPassword = crypto.createHash('sha256').update(userPassword).digest('hex');

// Right — use bcrypt or Argon2
const storedPassword = await bcrypt.hash(userPassword, 12);</code></pre>

<h2>Quick Reference</h2>

<table>
  <thead><tr><th>You want to…</th><th>Use</th></tr></thead>
  <tbody>
    <tr><td>Store a user's password</td><td>bcrypt or Argon2</td></tr>
    <tr><td>Verify a downloaded file wasn't tampered with</td><td>SHA-256</td></tr>
    <tr><td>Store an API key so you can use it later</td><td>AES-256 encryption</td></tr>
    <tr><td>Generate a unique fingerprint for deduplication</td><td>SHA-256</td></tr>
    <tr><td>Send data securely over a network</td><td>TLS (handles encryption for you)</td></tr>
    <tr><td>Sign a document to prove authenticity</td><td>SHA-256 hash + RSA/ECDSA signature</td></tr>
  </tbody>
</table>

<h2>Try It in Your Browser</h2>

<p>You can generate MD5, SHA-1, SHA-256, and SHA-512 hashes instantly without installing anything using the <a href="/tools/developer/hash-generator">Toolora Hash Generator</a> — it runs entirely in your browser, so nothing you type is ever sent to a server.</p>

<p>For Base64 encoding (a related but different concept), use the <a href="/tools/developer/base64">Base64 Encoder/Decoder</a>.</p>
    `.trim(),
  },
  {
    slug: "how-to-count-tokens-chatgpt-openai",
    title: "How to Count Tokens for ChatGPT and OpenAI API (Free, In-Browser)",
    description: "OpenAI charges by token, not by word or character. Learn exactly how tokenization works, why it matters for your API costs, and how to count tokens before you send a request.",
    date: "2026-04-01",
    readTime: "7 min read",
    category: "Developer Tools",
    content: `
<p>If you've ever hit an OpenAI API error that says <code>This model's maximum context length is 128000 tokens</code>, or noticed your API bill was higher than expected, you need to understand tokens.</p>

<p><strong>Tokens are not words.</strong> They're not characters either. They're chunks of text — usually 3–4 characters long — that language models process as individual units. The word <em>chatting</em> might be 1 token; <em>uncharacteristically</em> might be 4.</p>

<h2>Why token counting matters</h2>

<p>OpenAI charges per token, not per request. As of 2025, GPT-4o costs $2.50 per million input tokens and $10 per million output tokens. GPT-4o mini is roughly 15× cheaper. At scale, knowing your average token count per request determines whether your product is profitable.</p>

<p>Token counts also determine whether your prompt fits within a model's context window:</p>

<ul>
  <li><strong>GPT-4o</strong>: 128,000 token context window</li>
  <li><strong>GPT-3.5 Turbo</strong>: 16,385 token context window</li>
  <li><strong>Claude 3.5 Sonnet</strong>: 200,000 token context window</li>
</ul>

<p>When you exceed the context window, you'll get an error — or the model will silently truncate your prompt, giving you a worse result without warning.</p>

<h2>How OpenAI tokenization actually works</h2>

<p>OpenAI uses <strong>Byte-Pair Encoding (BPE)</strong>, a subword tokenization algorithm. It starts with characters, then merges the most frequent adjacent pairs into a single token, repeating until it has a fixed vocabulary of ~100,000 tokens (for cl100k_base, used by GPT-3.5 and GPT-4).</p>

<p>In practice, this means:</p>

<ul>
  <li>Common English words like <em>the</em>, <em>is</em>, <em>in</em> are usually 1 token each</li>
  <li>Longer or rarer words get split: <em>cryptocurrency</em> → <code>crypt</code> + <code>ocurr</code> + <code>ency</code> (3 tokens)</li>
  <li>Non-English text is usually less efficient — Japanese or Chinese characters use more tokens per character</li>
  <li>Code is often efficient because keywords like <code>function</code>, <code>return</code>, and <code>class</code> are single tokens</li>
</ul>

<h2>The rough rules of thumb</h2>

<p>If you're doing quick estimates:</p>

<ul>
  <li>1 token ≈ 4 characters of English text</li>
  <li>1 token ≈ ¾ of a word</li>
  <li>100 tokens ≈ 75 words</li>
  <li>A single page of English text ≈ 500–600 tokens</li>
</ul>

<p>These are rough approximations. Punctuation, whitespace, and code all change the ratios. Never rely on character-based estimates for billing or context window calculations.</p>

<h2>How to count tokens accurately (free, in-browser)</h2>

<p>The only reliable way to count tokens is to use the same tokenizer that OpenAI uses. The official library is <a href="https://github.com/openai/tiktoken" target="_blank" rel="noopener">tiktoken</a> (Python), but there's also a JavaScript port called <a href="https://github.com/dqbd/tiktoken" target="_blank" rel="noopener">tiktoken-node</a> and a lightweight browser implementation called <a href="https://github.com/niieani/gpt-tokenizer" target="_blank" rel="noopener">gpt-tokenizer</a>.</p>

<p>You can count tokens for any text right now — no API key, no sign-up — using the <a href="/tools/developer/token-counter">Toolora Token Counter</a>. It runs entirely in your browser using the cl100k_base encoding (used by GPT-3.5-Turbo, GPT-4, and GPT-4o).</p>

<h2>Counting tokens in Python</h2>

<pre><code>import tiktoken

enc = tiktoken.encoding_for_model("gpt-4o")
tokens = enc.encode("Your prompt text goes here.")
print(f"Token count: {len(tokens)}")</code></pre>

<p>Install it with <code>pip install tiktoken</code>.</p>

<h2>Counting tokens in JavaScript / Node.js</h2>

<pre><code>import { encode } from "gpt-tokenizer";

const tokens = encode("Your prompt text goes here.");
console.log(\`Token count: \${tokens.length}\`);</code></pre>

<p>Install with <code>npm install gpt-tokenizer</code>. This uses cl100k_base by default, matching GPT-4 and GPT-4o.</p>

<h2>Counting tokens for chat messages</h2>

<p>For the Chat Completions API (<code>/v1/chat/completions</code>), the total token count includes overhead for each message's role and formatting. OpenAI adds approximately 4 tokens per message for this structure, plus 2 tokens for the reply priming. A simple estimate:</p>

<pre><code>function countChatTokens(messages, tokensPerMessage = 4, tokensPerReply = 2) {
  let total = tokensPerReply;
  for (const msg of messages) {
    total += tokensPerMessage;
    total += encode(msg.role).length;
    total += encode(msg.content).length;
  }
  return total;
}</code></pre>

<h2>Common pitfalls</h2>

<p><strong>System prompts add up fast.</strong> A detailed system prompt can be 500–1,000 tokens. Multiply that by every request and it gets expensive.</p>

<p><strong>Few-shot examples are tokens too.</strong> If you include 5 examples in your prompt, each 200 tokens, that's 1,000 tokens before the user even types anything.</p>

<p><strong>Long conversation histories.</strong> If you maintain conversation context, you're resending the entire history every turn. A 20-turn conversation can easily be 5,000+ tokens before the user's latest message.</p>

<p><strong>Images count as tokens too.</strong> With GPT-4o's vision capabilities, a 512×512 image costs approximately 255 tokens in low-detail mode.</p>

<h2>Reducing token usage without sacrificing quality</h2>

<ul>
  <li><strong>Be concise in system prompts.</strong> Every sentence costs money on every request.</li>
  <li><strong>Summarize long conversations</strong> instead of maintaining full history.</li>
  <li><strong>Use structured output formats</strong> — JSON responses tend to use fewer tokens than verbose prose.</li>
  <li><strong>Choose the right model.</strong> GPT-4o mini handles many tasks as well as GPT-4o at a fraction of the cost.</li>
</ul>

<h2>Try the Token Counter</h2>

<p>Count tokens for any text — paste in your system prompt, a user message, or an entire conversation — using the <a href="/tools/developer/token-counter">Toolora Token Counter</a>. It shows token count, character count, word count, and estimated cost across different GPT models. Everything runs in your browser; your text is never sent to a server.</p>
    `.trim(),
  },
  {
    slug: "cron-expression-guide",
    title: "Cron Expressions Explained: Schedule Any Job in 5 Fields",
    description: "A complete guide to cron syntax — from the basics of the five time fields to advanced patterns like 'every 15 minutes on weekdays'. With real examples you can copy.",
    date: "2026-04-01",
    readTime: "6 min read",
    category: "Developer Tools",
    content: `
<p>Cron is one of those tools that every developer eventually needs and nobody ever fully remembers the syntax for. You know it's <code>* * * * *</code> for something, but which asterisk is minutes? Hours? Day of month?</p>

<p>This guide covers everything: the five fields, special characters, common patterns, and pitfalls to avoid. There's also a <a href="/tools/developer/cron-parser">free cron expression parser</a> that translates any cron expression to plain English and shows you the next five run times.</p>

<h2>The five cron fields</h2>

<pre><code>┌─────────── minute (0–59)
│ ┌───────── hour (0–23)
│ │ ┌─────── day of month (1–31)
│ │ │ ┌───── month (1–12 or JAN–DEC)
│ │ │ │ ┌─── day of week (0–6 or SUN–SAT, 0=Sunday)
│ │ │ │ │
* * * * *</code></pre>

<p>Every scheduled cron job is defined by these five space-separated fields. A <code>*</code> in any field means "every possible value."</p>

<h2>Special characters</h2>

<table>
  <thead><tr><th>Character</th><th>Meaning</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td><code>*</code></td><td>Any / every value</td><td><code>*</code> in hours = every hour</td></tr>
    <tr><td><code>*/n</code></td><td>Every nth value</td><td><code>*/15</code> in minutes = every 15 minutes</td></tr>
    <tr><td><code>n,m</code></td><td>List of values</td><td><code>1,15</code> in days = 1st and 15th</td></tr>
    <tr><td><code>n-m</code></td><td>Range of values</td><td><code>9-17</code> in hours = 9am to 5pm</td></tr>
    <tr><td><code>n-m/s</code></td><td>Range with step</td><td><code>0-30/5</code> in minutes = every 5 min for the first 30</td></tr>
  </tbody>
</table>

<h2>Common cron expressions</h2>

<p>Copy any of these directly:</p>

<pre><code># Every minute
* * * * *

# Every 5 minutes
*/5 * * * *

# Every 15 minutes
*/15 * * * *

# Every hour (at :00)
0 * * * *

# Every day at midnight
0 0 * * *

# Every day at 9am
0 9 * * *

# Every Monday at 9am
0 9 * * 1

# Every weekday (Monday–Friday) at 9am
0 9 * * 1-5

# Every weekday at 9am and 5pm
0 9,17 * * 1-5

# First day of every month at midnight
0 0 1 * *

# Every Sunday at midnight
0 0 * * 0

# Every 6 hours
0 */6 * * *

# At 2:30am every day
30 2 * * *

# Every 30 minutes during business hours (9am–6pm weekdays)
*/30 9-18 * * 1-5</code></pre>

<h2>Named shortcuts</h2>

<p>Many cron implementations support shorthand aliases:</p>

<pre><code>@yearly   → 0 0 1 1 *   (once a year, January 1st midnight)
@monthly  → 0 0 1 * *   (once a month, 1st day at midnight)
@weekly   → 0 0 * * 0   (once a week, Sunday midnight)
@daily    → 0 0 * * *   (once a day at midnight)
@hourly   → 0 * * * *   (once an hour)</code></pre>

<h2>Common pitfalls</h2>

<p><strong>Day of week vs day of month is OR, not AND.</strong> If you set both <code>day of month = 15</code> and <code>day of week = 1</code> (Monday), the job runs on the 15th of every month AND on every Monday — not on Mondays that fall on the 15th.</p>

<p><strong>Timezone matters.</strong> Cron uses the server's local time by default. If your server is in UTC but your users are in New York, "9am" in cron might be 4am for them. Systems like Kubernetes CronJobs let you specify a timezone explicitly.</p>

<p><strong>Overlap risk with slow jobs.</strong> If a job runs every 5 minutes but takes 7 minutes to complete, two instances will be running simultaneously. Use a cron wrapper that prevents overlapping runs, or add a lock mechanism.</p>

<p><strong>Zero vs six for Sunday.</strong> Both <code>0</code> and <code>6</code> mean Sunday in most implementations, but not all. Stick with <code>0</code> for portability.</p>

<p><strong>Months are 1-indexed, minutes and hours are 0-indexed.</strong> January is <code>1</code>, not <code>0</code>. Midnight is <code>0</code>, noon is <code>12</code>.</p>

<h2>Testing your expressions</h2>

<p>Before deploying a cron job, always verify your expression does what you think. Paste it into the <a href="/tools/developer/cron-parser">Toolora Cron Parser</a> — it shows the plain-English description and the next 5 scheduled run times so you can confirm the pattern is correct.</p>

<p>For example, <code>0 9 * * 1-5</code> should parse as "At 9:00 AM, Monday through Friday" — if you see anything different, the expression isn't what you intended.</p>
    `.trim(),
  },
  {
    slug: "competitor-research-claude-mcp",
    title: "How to Research Any Competitor's Website Using Claude and an MCP Server",
    description: "Most competitor research is slow, manual, and shallow. With Claude connected to the right MCP tools, you can pull clean content from any competitor page in seconds — and ask questions across multiple pages in one session.",
    date: "2026-04-01",
    readTime: "8 min read",
    category: "Developer Tools",
    content: `
<p>Competitor research usually goes like this: open 10 tabs, skim each page, copy a few things into a doc, lose track of what came from where, repeat. It's slow, shallow, and you miss things.</p>

<p>There's a better way. Connect Claude to an MCP server that can read web pages on demand, load your business context once, then run structured research prompts across every competitor page you care about — in a single session, with a searchable record of everything Claude found.</p>

<p>This guide shows you exactly how to do it using <a href="/mcp">Toolora's free MCP server</a>, which gives Claude two tools that handle most of this work: <code>read_url</code> and <code>scrape_url_js</code>.</p>

<h2>What you need</h2>

<ul>
  <li><strong>Claude Desktop or Cursor</strong> (any MCP-compatible AI client)</li>
  <li><strong>Toolora MCP server</strong> — one config block, no API key required</li>
  <li>A list of 3–5 competitor domains you want to analyze</li>
</ul>

<p>Add this to your Claude Desktop config file (<code>claude_desktop_config.json</code>):</p>

<pre><code>{
  "mcpServers": {
    "toolora": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://toolora.replit.app/api/mcp"]
    }
  }
}</code></pre>

<p>Restart Claude Desktop. You'll see Toolora's tools appear in the tool list. That's all the setup you need.</p>

<h2>Load your context first</h2>

<p>Before running any research prompts, paste your business context into Claude once. This prevents you from re-explaining yourself on every follow-up question and makes every answer sharper:</p>

<pre><code>Here is context about my business. Reference this in every research task I give you today.

Business: [Your business name]
Website: [your domain]
Primary product / service: [what you sell]
Target customer: [who buys from you]
Main competitors I want to analyze: [domain1, domain2, domain3]
What I most want to understand: [pricing / positioning / content strategy / feature set — pick what matters]

Don't ask me for this again. Just use it.</code></pre>

<p>Now every prompt you run in this session is anchored to your actual business, not a generic answer.</p>

<h2>The two tools doing the heavy lifting</h2>

<h3>read_url — for standard pages</h3>

<p><code>read_url</code> fetches any public URL and returns the main readable content as clean plain text, stripping nav, footers, ads, and boilerplate. It works on most static and server-rendered pages: marketing sites, blog posts, documentation, pricing pages.</p>

<p>Under the hood it uses a Readability-style extraction — the same algorithm Firefox's Reader Mode uses. You get the signal, not the noise.</p>

<h3>scrape_url_js — for JavaScript-heavy pages</h3>

<p><code>scrape_url_js</code> runs a full browser with JavaScript execution before extracting content. Use this for single-page apps, React/Next.js sites that render content client-side, or any page where <code>read_url</code> comes back mostly empty.</p>

<p>If a competitor is running a modern SaaS app or a Webflow site with a lot of JS-gated content, <code>scrape_url_js</code> is what gets past it.</p>

<h2>5 prompts to run right now</h2>

<h3>1. Positioning and messaging audit</h3>

<p>Start with the homepage. This is where a company makes its clearest statement about who they are, who they serve, and why they're different.</p>

<pre><code>Use read_url to fetch the homepage of [competitor.com]. Then answer:

1. What is their primary headline and subheadline?
2. What customer problem do they lead with?
3. What outcome or transformation do they promise?
4. What proof do they show above the fold (logos, numbers, testimonials)?
5. How is their positioning different from [your business name]?

Be specific. Quote exact copy where relevant.</code></pre>

<p>Run the same prompt across 3 competitors in sequence. By the end, you'll see exactly where there's a gap in the market that nobody is claiming.</p>

<h3>2. Pricing page teardown</h3>

<p>Pricing pages are a competitor's strategic document. The tiers they offer, the features they highlight, the anchoring — all of it reveals what they think their customers value most.</p>

<pre><code>Use read_url to fetch [competitor.com/pricing]. Then:

1. List every pricing tier, its price, and billing period
2. What features are on the free or entry tier vs. the paid tiers?
3. What is their "recommended" or highlighted plan?
4. What features do they use to push upgrades between tiers?
5. What's missing that [your business name] offers?
6. What do they emphasize that we don't?</code></pre>

<p>If the pricing page is behind a login or heavily JS-rendered, swap <code>read_url</code> for <code>scrape_url_js</code> in the prompt.</p>

<h3>3. Content and SEO strategy</h3>

<p>A competitor's blog reveals what keywords they're going after, what audience they're building, and what content gaps exist for you to fill.</p>

<pre><code>Use read_url to fetch [competitor.com/blog]. List:

1. The 10 most recent post titles
2. The categories or topics they cover most often
3. Any content series or recurring formats
4. Which posts look like they target high-intent keywords vs. top-of-funnel awareness
5. What content themes are completely absent that [your business name] could own?</code></pre>

<p>Then follow up with:</p>

<pre><code>Now use read_url to fetch the full content of their top 2-3 posts. For each post, tell me:
- What search query it's clearly targeting
- How long and detailed it is
- What CTAs it includes
- Whether it links to a product page and how naturally</code></pre>

<h3>4. Features and product depth</h3>

<p>For SaaS products or tool-based businesses, the features page tells you how a competitor thinks about their product and what they emphasize to buyers.</p>

<pre><code>Use scrape_url_js to fetch [competitor.com/features]. Then:

1. List every feature or capability they mention
2. Group them into logical categories
3. Identify which 3-5 features they seem to emphasize most (big headers, dedicated sections)
4. Flag any features we have that they don't mention
5. Flag any features they prominently advertise that we don't offer</code></pre>

<h3>5. About page and brand story</h3>

<p>The about page is often skipped in competitor research. That's a mistake. It tells you how a company talks about itself — its founding story, values, and the human side of the brand. That's useful when you're deciding how to differentiate on personality, not just features.</p>

<pre><code>Use read_url to fetch [competitor.com/about]. Extract:

1. How they describe their origin story
2. What values or principles they emphasize
3. How they talk about their team
4. What proof of credibility they include (press mentions, years in business, customer count)
5. What emotional tone they project — scrappy startup, trusted enterprise, community-driven?
6. How our about page compares and where we could sharpen our narrative</code></pre>

<h2>Turning the output into decisions</h2>

<p>After running these prompts across 3+ competitors, end the session with a synthesis prompt:</p>

<pre><code>Based on everything you've read today about [competitor1], [competitor2], and [competitor3], give me:

1. The single clearest gap in the market that none of them are owning
2. The messaging angle that [your business name] could credibly claim that no competitor is using
3. The one content topic we should write about first based on what's missing from their blogs
4. The pricing or packaging insight most worth acting on</code></pre>

<p>This is where the research pays off. You're not just collecting information — you're asking Claude to synthesize across multiple sources it just read and produce prioritized recommendations specific to your business.</p>

<h2>When pages don't load</h2>

<p>A few things to know:</p>

<ul>
  <li>If <code>read_url</code> returns thin content or just navigation text, switch to <code>scrape_url_js</code> — the site likely requires JavaScript to render its content</li>
  <li>If a page is behind authentication (like a logged-in dashboard), neither tool can access it — you'll need to paste the content manually</li>
  <li>Some sites block scrapers via user-agent filtering. If you get an error or near-empty result on a known-working page, it's likely blocked</li>
  <li>PDF resources, case studies, and gated content won't be accessible — but their landing pages usually will be, which often tells you enough</li>
</ul>

<h2>No API key, no cost, no setup friction</h2>

<p>The Toolora MCP server is completely free. No account required, no rate limits for reasonable use, no data stored server-side. The MCP connection config is one JSON block you add once.</p>

<p>If you want to automate this research at scale — running nightly competitor checks, triggering alerts when a pricing page changes, or building a pipeline that runs these prompts on a schedule — the <a href="/pricing">Toolora Agent API</a> gives you programmatic access to the same tools with higher throughput and usage-based pricing.</p>

<p>For one-off research sessions, the free MCP server is all you need. <a href="/mcp">Get the setup instructions and full tool list here.</a></p>
    `.trim(),
  },
  {
    slug: "resize-images-without-uploading",
    title: "How to Resize Images Without Uploading Them (Free, Private, Instant)",
    description: "Most image resizers send your photos to a remote server. Here's how to resize images entirely in your browser — no uploads, no accounts, no waiting.",
    date: "2026-04-01",
    readTime: "4 min read",
    category: "Privacy",
    content: `
<p>If you search "resize image online free," you'll find dozens of tools. Most of them work the same way: you upload your photo to their server, their server resizes it, and they send you the result back. It's convenient, but your image just traveled to a stranger's computer.</p>

<p>For holiday photos or random screenshots, that's probably fine. But if you're resizing product images, client work, medical scans, screenshots of sensitive documents, or anything you'd rather not share — that upload is a real exposure.</p>

<p>There's a better way. <a href="/tools/image/image-resize">Toolora's image resizer</a> does everything locally in your browser. Your image never leaves your device.</p>

<h2>How browser-side image resizing works</h2>

<p>Modern browsers include a full rendering engine — the same one that draws web pages. That engine can also draw images programmatically using the <code>canvas</code> API.</p>

<p>The process is straightforward:</p>
<ol>
  <li>Your image file is read into memory by the browser (never sent anywhere)</li>
  <li>It's drawn onto an off-screen HTML canvas at the new dimensions you specify</li>
  <li>The canvas is exported as a JPEG or PNG at the quality level you choose</li>
  <li>The result is offered to you as a download</li>
</ol>

<p>The entire operation takes milliseconds and happens without a network request. There's no server involved at any point.</p>

<h2>Using the Toolora image resizer</h2>

<p>Open <a href="/tools/image/image-resize">the tool</a> and drop your image in. You'll see:</p>

<ul>
  <li><strong>Width and height fields</strong> — enter your target dimensions in pixels</li>
  <li><strong>Lock aspect ratio</strong> — toggled on by default; adjusting width automatically updates height proportionally</li>
  <li><strong>Quality slider</strong> — for JPEG output, controls the compression level (92 is a good default; drop to 75–80 for smaller files with minimal visual difference)</li>
</ul>

<p>Hit "Resize Image" and a preview appears immediately. Download when you're happy. If the result isn't right, adjust and click again — it's instant every time.</p>

<h2>What formats are supported?</h2>

<p>You can drop in JPEG, PNG, or WebP images. The output is always JPEG (which covers almost all use cases for resizing). If you need to convert between formats at the same time, the <a href="/tools/image/image-convert">image converter</a> handles JPEG ↔ PNG ↔ WebP conversions with the same zero-upload approach.</p>

<h2>Resizing vs. compressing: when to use which</h2>

<p>These are related but different operations, and confusing them leads to unnecessarily large files:</p>

<ul>
  <li><strong>Resizing</strong> changes the pixel dimensions. A 4000×3000 photo resized to 1200×900 has fewer pixels and will be a smaller file — but only because there's less image data, not because of compression.</li>
  <li><strong>Compressing</strong> keeps the dimensions the same but reduces the file size by throwing away fine detail using JPEG compression algorithms.</li>
</ul>

<p>For web images, doing both often makes sense: resize to the maximum display size you actually need (no point serving a 4K image on a 1200px-wide website), then compress to reduce the file size further. The <a href="/tools/image/image-compress">Toolora image compressor</a> handles the second step, also entirely in your browser.</p>

<h2>Common use cases</h2>

<p><strong>Profile photos and avatars</strong> — most platforms require images under a specific pixel dimension. Resize to exactly what's required in seconds, without sending your photo to a third party.</p>

<p><strong>Product images for e-commerce</strong> — if you're managing a store, you'll resize product photos repeatedly. Doing it locally means your source files stay on your machine.</p>

<p><strong>Email attachments</strong> — full-resolution photos from modern smartphones are 5–15MB. Resizing to 1200px wide typically brings them under 300KB without noticeable quality loss.</p>

<p><strong>Documentation and screenshots</strong> — when writing technical docs or tutorials, screenshots often need to be a specific width to fit a layout. Drop in the screenshot, set the width, done.</p>

<p><strong>Client deliverables</strong> — if you're a designer or photographer, resizing client work locally means their images never touch infrastructure they haven't approved.</p>

<h2>What about tools that claim to be private?</h2>

<p>Some image resizing tools include privacy claims in their marketing but still process files server-side. The way to verify is simple: open your browser's network inspector (F12 → Network tab), load an image, and click resize. If you see an HTTP request going out with your file, it's uploading. If you see nothing — just local processing — it's genuinely client-side.</p>

<p>Toolora passes this test. The source code is also straightforward if you want to inspect it: the resize logic is a canvas draw call with no outbound requests.</p>

<h2>Batch resizing and automation</h2>

<p>The browser tool handles one image at a time, which covers most individual use cases. If you need to resize hundreds of images as part of a build pipeline, a deployment process, or any automated workflow, the <a href="/pricing">Toolora Agent API</a> offers the same image processing capabilities as a REST endpoint you can call from any script or CI system.</p>

<p>For one-off resizing, the <a href="/tools/image/image-resize">free browser tool</a> is all you need. No account, no signup, no upload.</p>
    `.trim(),
  },
  {
    slug: "stop-pasting-jwts-into-random-websites",
    title: "Stop Pasting JWT Tokens Into Random Websites",
    description: "Most online JWT decoders send your token to a server. Here's why that's risky, what JWTs actually contain, and how to decode them safely in your browser.",
    date: "2026-04-03",
    readTime: "7 min read",
    category: "Security",
    content: `
<p>JWT tokens are everywhere. Every time you log into a web app, there's a good chance your session is represented by one. Every time you call a protected API, you're probably sending one in the <code>Authorization</code> header. And every time a developer needs to debug an authentication problem, they reach for an online JWT decoder.</p>

<p>Here's the problem: most of those online decoders send your token to a server.</p>

<p>Before explaining why that matters, let's look at what a JWT actually contains — and why pasting one into an unknown website is a risk you probably don't need to take.</p>

<img src="/images/blog-jwt-anatomy.png" alt="JWT token showing three distinct segments: header, payload, and signature" class="w-full rounded-2xl my-8 border border-border" />

<h2>What a JWT actually is</h2>

<p>A JSON Web Token looks like this:</p>

<pre><code>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEyMyIsImVtYWlsIjoiYWxpY2VAZXhhbXBsZS5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MTcwMDAwMzYwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c</code></pre>

<p>Three base64url-encoded segments separated by dots:</p>

<ul>
  <li><strong style="color: #a78bfa">Header</strong> — the algorithm and token type (<code>{"alg":"HS256","typ":"JWT"}</code>)</li>
  <li><strong style="color: #60a5fa">Payload</strong> — the actual claims: user ID, email, roles, expiry, and whatever else the application put there</li>
  <li><strong style="color: #fb923c">Signature</strong> — an HMAC or RSA signature that proves the token hasn't been tampered with</li>
</ul>

<p>Crucially, the header and payload are <em>not encrypted</em> — they're just base64url-encoded. Anyone who has the token can read those two parts. Only the signature requires a secret key to verify.</p>

<p>Decode that example payload and you get:</p>

<pre><code>{
  "sub": "user_123",
  "email": "alice@example.com",
  "role": "admin",
  "iat": 1700000000,
  "exp": 1700003600
}</code></pre>

<p>User ID. Email address. Role. Issued at. Expiry. That's a real user's session data — and it's all sitting in a token that looks like random characters.</p>

<h2>Why pasting it into a random website is a problem</h2>

<img src="/images/blog-jwt-privacy.png" alt="Comparison showing data leaving the browser to a server versus staying local in the browser" class="w-full rounded-2xl my-8 border border-border" />

<p>A JWT is effectively a bearer token — whoever holds it can use it. If your token hasn't expired, an attacker who gets a copy can make authenticated API requests as you, without your password.</p>

<p>When you paste a token into a server-side decoder:</p>

<ol>
  <li>Your token travels over the network to their server</li>
  <li>It lands in their access logs (most web servers log request bodies)</li>
  <li>It's processed by code you haven't reviewed</li>
  <li>It may be stored, even temporarily</li>
</ol>

<p>For a short-lived token with no sensitive claims, the risk is low. But developers rarely stop to check expiry before pasting — and production tokens often have long lifetimes (24 hours, 7 days, 30 days in some applications).</p>

<p>The worst-case scenario: you paste a long-lived admin token from a production system into a sketchy decoder site. Their logs now have a valid credential. Nothing about that is theoretical — it's exactly how session hijacking happens when developers aren't careful.</p>

<h2>Base64url decoding in 30 seconds</h2>

<p>The reason online decoders became popular is that base64url has two non-standard characters (<code>-</code> and <code>_</code> instead of <code>+</code> and <code>/</code>) that trip up the standard <code>atob()</code> function in browsers. But this is a trivially small fix:</p>

<pre><code>// Decode a JWT payload in your browser console — no external tools needed
function decodeJwtPayload(token) {
  const payload = token.split('.')[1];
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  const json = atob(base64);
  return JSON.parse(decodeURIComponent(
    [...json].map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
  ));
}

// Usage
decodeJwtPayload('eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyXzEyMyJ9.signature')
// → { sub: "user_123" }</code></pre>

<p>Paste that into your browser's DevTools console and run it there. Nothing leaves your machine. No server involved.</p>

<p>Or use the <a href="/tools/developer/jwt-decoder">Toolora JWT Decoder</a>, which runs the same logic entirely in your browser — the token never touches a network request.</p>

<h2>What the claims actually mean</h2>

<p>JWT has a set of registered claim names defined in <a href="https://datatracker.ietf.org/doc/html/rfc7519" target="_blank" rel="noopener">RFC 7519</a>. When you're inspecting a payload, these are the ones to look for:</p>

<table>
  <thead><tr><th>Claim</th><th>Full name</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td><code>sub</code></td><td>Subject</td><td>The user or entity the token represents (usually a user ID)</td></tr>
    <tr><td><code>iss</code></td><td>Issuer</td><td>Who created the token (your auth server URL)</td></tr>
    <tr><td><code>aud</code></td><td>Audience</td><td>Who the token is intended for (your API)</td></tr>
    <tr><td><code>exp</code></td><td>Expiry</td><td>Unix timestamp when the token expires — check this first</td></tr>
    <tr><td><code>iat</code></td><td>Issued at</td><td>Unix timestamp when the token was issued</td></tr>
    <tr><td><code>nbf</code></td><td>Not before</td><td>Token isn't valid before this timestamp</td></tr>
    <tr><td><code>jti</code></td><td>JWT ID</td><td>Unique identifier for this specific token</td></tr>
  </tbody>
</table>

<p>Everything else in the payload — <code>email</code>, <code>role</code>, <code>permissions</code>, <code>org_id</code>, custom claims — is application-specific and defined by whoever issued the token.</p>

<h2>A note on signature verification</h2>

<p>Decoding a JWT tells you what it claims. Verifying it tells you whether those claims are trustworthy.</p>

<p>Client-side decoders (including Toolora's) can only decode — they don't have access to your signing secret or public key, so they can't verify the signature. For reading your own tokens during debugging, that's fine. For anything security-critical, verification must happen server-side where the secret is stored.</p>

<p>The failure mode to avoid: building a frontend that trusts the decoded payload without server-side verification. A user can create a fake JWT with a forged <code>role: "admin"</code> claim, and if your frontend makes access decisions based on decoded-but-unverified tokens, that's an exploitable vulnerability.</p>

<h2>Safer debugging habits</h2>

<ul>
  <li><strong>Use your browser console</strong> — the snippet above works anywhere. No third-party tool needed.</li>
  <li><strong>Use a client-side tool</strong> — <a href="/tools/developer/jwt-decoder">Toolora's JWT Decoder</a> processes everything locally.</li>
  <li><strong>Check expiry before sharing</strong> — if you must paste a token somewhere for help (a colleague, a support ticket), verify it's expired first. An expired token is harmless.</li>
  <li><strong>Never paste production tokens anywhere</strong> — use a test environment token for debugging when possible.</li>
  <li><strong>Don't put secrets in payloads</strong> — JWTs are encoded, not encrypted. Treat everything in the payload as readable by anyone who intercepts the token.</li>
</ul>

<p>Decode your next JWT the safe way: <a href="/tools/developer/jwt-decoder">Toolora JWT Decoder — runs entirely in your browser →</a></p>
    `.trim(),
  },
  {
    slug: "word-counter-online-free",
    title: "Word Counter Online: Count Words, Characters, and Reading Time Instantly",
    description: "A free, instant word counter that runs in your browser. Count words, characters, sentences, paragraphs, and get a reading time estimate — no upload, no account, no ads.",
    date: "2026-04-02",
    readTime: "6 min read",
    category: "Tools",
    content: `
<p>Every writer, developer, student, and marketer eventually needs to count something. How many words is this essay? Does this tweet fit? Will Google show this meta description in full? How long will this article take to read?</p>

<p>The answers are a paste away — using the <a href="/tools/text/word-counter">Toolora Word Counter</a>. Paste any text and get word count, character count, sentence count, paragraph count, and estimated reading time instantly. Everything runs in your browser; your text is never sent to a server.</p>

<img src="/images/blog-word-count-stats.png" alt="Word count statistics dashboard showing words, characters, sentences and reading time" class="w-full rounded-2xl my-8 border border-border" />

<h2>Word count vs. character count — what's the difference?</h2>

<p>They measure different things and matter in different contexts:</p>

<ul>
  <li><strong>Word count</strong> is the number of space-separated tokens. "The quick brown fox" = 4 words. Used for academic papers, editorial briefs, content contracts, and readability estimates.</li>
  <li><strong>Character count</strong> is the number of individual characters including spaces and punctuation. "The quick brown fox" = 19 characters. Used for social media limits, SMS, database field constraints, and UI copy that has a fixed display length.</li>
  <li><strong>Character count without spaces</strong> is used in some academic contexts (particularly European universities) where density of content matters more than total length.</li>
</ul>

<p>Most platforms enforce one or the other — rarely both. Knowing which metric you're working against before you start writing saves a lot of editing.</p>

<h2>Platform character limits you should have memorised</h2>

<img src="/images/blog-platform-limits.png" alt="Illustration of character limits across different platforms including social media and email" class="w-full rounded-2xl my-8 border border-border" />

<table>
  <thead>
    <tr>
      <th>Platform / Context</th>
      <th>Limit</th>
      <th>What's counted</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>X (Twitter) post</td><td>280 characters</td><td>Characters including spaces; URLs count as 23</td></tr>
    <tr><td>X (Twitter) bio</td><td>160 characters</td><td>Characters</td></tr>
    <tr><td>LinkedIn post</td><td>3,000 characters</td><td>Characters; preview truncates at ~210</td></tr>
    <tr><td>LinkedIn headline</td><td>220 characters</td><td>Characters</td></tr>
    <tr><td>Instagram caption</td><td>2,200 characters</td><td>Characters; preview shows ~125 before "more"</td></tr>
    <tr><td>Google meta description</td><td>155–160 characters</td><td>Characters; Google truncates beyond this</td></tr>
    <tr><td>Google page title</td><td>50–60 characters</td><td>Characters; longer titles get cut in SERPs</td></tr>
    <tr><td>Email subject line</td><td>40–60 characters</td><td>Characters; mobile shows ~30 before cut-off</td></tr>
    <tr><td>YouTube description</td><td>5,000 characters</td><td>Characters; search shows first 100–120</td></tr>
    <tr><td>Reddit post title</td><td>300 characters</td><td>Characters</td></tr>
    <tr><td>SMS</td><td>160 characters</td><td>Characters (GSM-7); 70 for Unicode</td></tr>
  </tbody>
</table>

<p>The ones that bite people most often: Google meta descriptions (going over 160 means your carefully crafted sentence gets truncated mid-word in search results) and email subject lines (40 characters is aggressive, but that's what mobile inboxes typically show before clipping).</p>

<h2>Academic word count requirements</h2>

<p>Universities typically enforce strict word count ranges, and most allow ±10% tolerance. Common requirements:</p>

<ul>
  <li><strong>Personal statement / application essay</strong>: 500–650 words (Common App), 150–650 words (UC)</li>
  <li><strong>Short essay / response paper</strong>: 500–1,000 words</li>
  <li><strong>Standard essay</strong>: 1,500–2,500 words</li>
  <li><strong>Research paper / term paper</strong>: 3,000–5,000 words</li>
  <li><strong>Dissertation chapter</strong>: 8,000–12,000 words</li>
  <li><strong>Full dissertation / thesis</strong>: 10,000–80,000 words (varies widely by institution and level)</li>
</ul>

<p>A critical note: most academic word counts <strong>exclude</strong> the bibliography, footnotes, and appendices. Always check your institution's specific guidance — some exclude abstract and headings too. When in doubt, paste each section separately into the counter to verify.</p>

<h2>How reading time is calculated</h2>

<p>The standard reading time formula is based on an average adult reading speed of <strong>200–238 words per minute</strong> for non-fiction prose. The Toolora Word Counter uses 200 WPM, which slightly over-estimates reading time — better to set reader expectations accurately than under-promise.</p>

<p>The formula is straightforward:</p>

<pre><code>reading_time_minutes = word_count / 200</code></pre>

<p>A 1,000-word article = 5 minutes. A 2,500-word long-form piece = 12.5 minutes. A 500-word email update = 2.5 minutes.</p>

<p>Reading time varies significantly by content type:</p>
<ul>
  <li><strong>Fiction and literary prose</strong>: slower, ~180 WPM (more attention per word)</li>
  <li><strong>Technical documentation and code-heavy content</strong>: slower, ~100–150 WPM</li>
  <li><strong>News articles and blog posts</strong>: faster, ~200–238 WPM (skimming-friendly structure)</li>
  <li><strong>Poetry</strong>: much slower — word count is meaningless as a time proxy</li>
</ul>

<p>Medium and most blogging platforms show reading time estimates on article previews. Readers use this to decide whether to commit to a piece. Studies suggest articles shown as "5 min read" perform better than the same content shown as "12 min read" — which is an argument for keeping posts tight, not padding to hit a target.</p>

<h2>Word count targets for SEO content</h2>

<p>There's a lot of mythology around word count and SEO. The truth is nuanced:</p>

<ul>
  <li><strong>There is no magic word count</strong> that Google rewards universally. Content that fully answers a query ranks regardless of whether it's 600 words or 6,000.</li>
  <li><strong>Thin content (&lt;300 words) can hurt</strong> for informational queries where users expect depth. Google's quality guidelines explicitly flag thin content.</li>
  <li><strong>Match the intent</strong>. A "how to restart nginx" query is satisfied in 150 words. A "how to build a SaaS business" query probably isn't satisfied in 800.</li>
  <li><strong>Competitive pages matter more than arbitrary targets</strong>. If the top 3 results for your target keyword average 1,800 words, you probably need comparable depth — not because of word count itself, but because the depth correlates with covering the topic thoroughly.</li>
</ul>

<p>Practical ranges that tend to work, based on query type:</p>

<table>
  <thead><tr><th>Content type</th><th>Word count range</th></tr></thead>
  <tbody>
    <tr><td>FAQ / definition page</td><td>300–600 words</td></tr>
    <tr><td>How-to guide (simple)</td><td>600–1,200 words</td></tr>
    <tr><td>How-to guide (detailed)</td><td>1,200–2,500 words</td></tr>
    <tr><td>Comparison / versus page</td><td>1,500–3,000 words</td></tr>
    <tr><td>Pillar / topic authority page</td><td>2,500–5,000 words</td></tr>
    <tr><td>Original research / data piece</td><td>1,500–4,000 words</td></tr>
  </tbody>
</table>

<h2>How to use the Toolora Word Counter</h2>

<ol>
  <li>Go to <a href="/tools/text/word-counter">toolora.dev/tools/text/word-counter</a></li>
  <li>Paste or type your text into the input area</li>
  <li>The counter updates in real time — no button to click</li>
  <li>Read off your word count, character count (with and without spaces), sentence count, paragraph count, and estimated reading time</li>
</ol>

<p>It handles any language. The word count is based on whitespace-separated tokens, which is accurate for English, Spanish, French, German, and other space-delimited languages. For languages without spaces between words (Chinese, Japanese, Thai), the character count is the more meaningful metric.</p>

<h2>Counting words in code: quick reference</h2>

<p>If you need word count programmatically:</p>

<pre><code># Python
text = "The quick brown fox jumps over the lazy dog"
word_count = len(text.split())
char_count = len(text)
char_no_spaces = len(text.replace(" ", ""))
print(word_count, char_count, char_no_spaces)  # 9 44 36</code></pre>

<pre><code>// JavaScript
const text = "The quick brown fox jumps over the lazy dog";
const wordCount = text.trim().split(/\s+/).length;
const charCount = text.length;
const charNoSpaces = text.replace(/\s/g, "").length;
console.log(wordCount, charCount, charNoSpaces); // 9 44 36</code></pre>

<p>The JavaScript version uses a regex split (<code>/\s+/</code>) to handle multiple consecutive spaces correctly. The Python <code>split()</code> with no arguments also handles this.</p>

<h2>Why a browser-based word counter?</h2>

<p>Word counters don't need server infrastructure — it's string processing, not heavy computation. Any tool that uploads your text to count words is adding unnecessary complexity (and a privacy exposure) for a task your browser handles in microseconds.</p>

<p>This matters more than it sounds if you're counting sensitive content: legal drafts, confidential client copy, medical documentation, or anything under NDA. With a client-side counter, nothing leaves your machine.</p>

<p>Try it now: <a href="/tools/text/word-counter">Paste your text into the Toolora Word Counter →</a></p>
    `.trim(),
  },
  {
    slug: "hipaa-compliant-online-document-tools",
    title: "Why Most Online Document Tools Are a HIPAA Liability (And What to Use Instead)",
    description: "SmallPDF, ILovePDF, Adobe online tools — they all upload your files to their servers. For law firms, healthcare teams, and financial services, that's a compliance problem. Here's the architecture-first solution.",
    date: "2026-04-03",
    readTime: "7 min read",
    category: "Privacy",
    content: `
<img src="/images/blog-hipaa-compliance.png" alt="Document processing: cloud upload vs. browser-local processing" style="width:100%;border-radius:12px;margin-bottom:2rem;" />

<p>If you work in healthcare, legal, or financial services, you've almost certainly run into this problem: someone on your team needs to merge a PDF, extract text from a scanned document, or convert a spreadsheet — and they reach for the first free tool Google returns.</p>

<p>That tool uploads the file. Your file. Containing patient records, client contracts, or financial statements. To a server you know nothing about.</p>

<p>This isn't a hypothetical risk. It's a structural problem with how the online tools industry works — and it has real compliance consequences for regulated industries.</p>

<h2>The upload problem, explained</h2>

<p>When you use a web-based document tool like SmallPDF, ILovePDF, or Adobe Acrobat Online, here's what happens technically:</p>

<ol>
  <li>You click "upload" and select your file</li>
  <li>Your browser sends the file to the tool's servers over HTTPS</li>
  <li>The server processes the file (merges, compresses, converts, extracts, etc.)</li>
  <li>The server sends the result back to your browser</li>
  <li>Your file sits on their infrastructure — sometimes for hours, sometimes longer</li>
</ol>

<p>Step 2 is the problem. The moment your document crosses the internet to someone else's server, you've lost control over it. You're relying on their privacy policy, their security practices, their compliance posture, and their breach incident response.</p>

<p>For most use cases — compressing a photo, merging a recipe PDF — that's fine. For protected health information (PHI), privileged legal communications, or regulated financial data, it's not.</p>

<h2>What HIPAA actually requires</h2>

<p>The Health Insurance Portability and Accountability Act (HIPAA) doesn't prohibit using cloud tools — but it imposes strict requirements on who handles PHI on your behalf.</p>

<p>Under HIPAA, any vendor that creates, receives, maintains, or transmits PHI on behalf of a covered entity is a <strong>Business Associate</strong>. You're required to have a signed <strong>Business Associate Agreement (BAA)</strong> with every business associate before sharing any PHI with them.</p>

<p>Most online document tools don't offer BAAs. SmallPDF's HIPAA page, for example, requires an enterprise plan and an active BAA — which most users never set up. Adobe Acrobat Online has similar requirements. ILovePDF doesn't appear to offer HIPAA compliance at all.</p>

<p>When a team member uploads a patient intake form to a free PDF merger without a BAA in place, that's a HIPAA violation — regardless of whether the data was ever misused.</p>

<h2>The attorney-client privilege issue</h2>

<p>For law firms, the problem is different but equally serious. Attorney-client privilege protects confidential communications between lawyers and their clients. The privilege can be waived if a communication is disclosed to a third party without client consent.</p>

<p>Courts have generally not treated secure cloud services as a per se waiver of privilege — but the question of whether using a third-party document processing service constitutes a "disclosure" is still unsettled in many jurisdictions, and the answer depends heavily on:</p>

<ul>
  <li>Whether the third party has access to the content of the communication</li>
  <li>Whether reasonable precautions were taken to maintain confidentiality</li>
  <li>Whether the service's terms of service create any rights over your data</li>
</ul>

<p>Uploading a client's contract or confidential correspondence to a free online PDF tool creates risk on all three fronts. The safest answer is: don't upload it at all.</p>

<h2>Financial services: data sovereignty and regulatory requirements</h2>

<p>Financial services firms face a patchwork of regulations depending on their jurisdiction and business type:</p>

<table>
  <thead>
    <tr><th>Regulation</th><th>Jurisdiction</th><th>Relevant requirement</th></tr>
  </thead>
  <tbody>
    <tr><td>SEC Regulation S-P</td><td>United States</td><td>Safeguard nonpublic personal information of clients</td></tr>
    <tr><td>GLBA Safeguards Rule</td><td>United States</td><td>Written security program for customer financial data</td></tr>
    <tr><td>MiFID II / GDPR</td><td>European Union</td><td>Data minimization, purpose limitation, transfers to third countries</td></tr>
    <tr><td>FCA SYSC</td><td>United Kingdom</td><td>Adequate organizational controls and record-keeping</td></tr>
    <tr><td>PIPEDA</td><td>Canada</td><td>Consent and accountability for third-party data processors</td></tr>
  </tbody>
</table>

<p>Under GDPR alone, transferring personal data to a US-based online tool without an appropriate legal basis (Standard Contractual Clauses, Binding Corporate Rules, or adequacy decision) is a violation. Most free online tools haven't addressed this adequately for the average user.</p>

<h2>The architectural solution: client-side processing</h2>

<p>The reason most document tools upload your files is historical: PDF manipulation, OCR, image compression, and format conversion used to require serious server-side computing power. The libraries involved were heavyweight and impractical to run in a browser.</p>

<p>That's no longer true. WebAssembly (WASM) lets browsers run near-native code locally. Libraries that were previously server-only now run entirely in the browser tab, with no server involved in the actual processing:</p>

<ul>
  <li><strong>pdf-lib</strong> — merge, split, modify PDFs entirely in browser memory</li>
  <li><strong>Tesseract.js</strong> — OCR (text extraction from images) via WASM in-browser</li>
  <li><strong>Sharp / browser-image-compression</strong> — image compression without upload</li>
  <li><strong>xlsx.js</strong> — Excel/spreadsheet parsing in-browser</li>
  <li><strong>mammoth.js</strong> — Word document (DOCX) extraction in-browser</li>
</ul>

<p>When a tool is built on these libraries, the processing happens inside your browser tab. Your files are read from your local filesystem, manipulated in memory, and made available for download — without ever touching a network request.</p>

<h2>How to verify a tool is actually client-side</h2>

<p>Don't take a vendor's word for it. You can verify client-side processing yourself in 30 seconds:</p>

<ol>
  <li>Open the tool in your browser</li>
  <li>Press <strong>F12</strong> to open DevTools</li>
  <li>Click the <strong>Network</strong> tab</li>
  <li>Clear the existing log</li>
  <li>Use the tool (upload your file, process it, download the result)</li>
  <li>Look at the Network log — are there any file upload requests?</li>
</ol>

<p>For a truly client-side tool, you'll see <em>zero</em> upload requests in the Network tab. The only outbound requests will be for the page assets themselves (JS, CSS, fonts) — which were already loaded before you used the tool.</p>

<p>For any server-side tool, you'll see a POST or PUT request containing your file data, usually to an API endpoint.</p>

<img src="/images/blog-hipaa-compliance.png" alt="DevTools Network tab showing zero upload requests on a client-side tool" style="width:100%;border-radius:8px;margin:1.5rem 0;" />

<h2>What "no upload" means for compliance, practically</h2>

<p>If a document tool processes your file without ever transmitting it, the compliance picture changes significantly:</p>

<table>
  <thead>
    <tr><th>Compliance question</th><th>Server-side tool</th><th>Client-side tool</th></tr>
  </thead>
  <tbody>
    <tr><td>Is the vendor a HIPAA Business Associate?</td><td>Yes — BAA required</td><td>No — they never receive PHI</td></tr>
    <tr><td>Does privilege risk exist?</td><td>Potentially — data disclosed to third party</td><td>No — no third party ever sees the content</td></tr>
    <tr><td>GDPR data transfer issue?</td><td>Yes — if processing crosses borders</td><td>No — processing stays in user's browser</td></tr>
    <tr><td>What's stored on the vendor's servers?</td><td>Your file, for some period</td><td>Nothing — they never receive it</td></tr>
    <tr><td>What happens in a vendor breach?</td><td>Your documents are at risk</td><td>Your documents aren't there to breach</td></tr>
  </tbody>
</table>

<p>The key insight: <strong>if a tool never receives your data, it cannot be a data processor, a business associate, or a breach point for that data.</strong> The compliance question doesn't arise because the architectural condition that creates the compliance risk doesn't exist.</p>

<p>This isn't a workaround or a technicality — it's a fundamentally different approach to building document tools.</p>

<h2>The tools your compliance team will clear</h2>

<p>Toolora's document tools are built on this architecture. Every tool that handles files — PDF merging and splitting, Word document extraction, Excel parsing, image OCR, image compression, QR code generation — processes your files entirely in your browser using the WebAssembly libraries described above.</p>

<p>You can verify this with the DevTools test above on any Toolora tool. Zero file uploads. Zero server involvement in document processing.</p>

<p>For teams with specific compliance requirements, Toolora's <a href="/enterprise">Enterprise plan</a> includes architecture documentation designed for compliance review — a written explanation of exactly how processing works that your legal or security team can use in a vendor assessment.</p>

<h2>The practical checklist</h2>

<p>Before your team uses any online document tool with sensitive files:</p>

<ol>
  <li><strong>Check the Network tab</strong> — does it upload your file?</li>
  <li><strong>If it uploads: does the vendor offer a BAA?</strong> (for HIPAA-covered entities)</li>
  <li><strong>What does their privacy policy say</strong> about how long files are retained?</li>
  <li><strong>Where are their servers?</strong> (relevant for GDPR data transfer restrictions)</li>
  <li><strong>Is there a security contact or incident response policy?</strong></li>
</ol>

<p>Or: use a client-side tool where none of those questions apply.</p>

<div style="margin: 2rem 0; padding: 1.5rem; border: 1px solid #e2e8f0; border-radius: 12px; background: #f8fafc;">
  <p style="font-weight: 700; margin: 0 0 0.5rem 0;">Free resource: The 20-Point HIPAA Audit Checklist for Online Tools</p>
  <p style="color: #64748b; margin: 0 0 1rem 0; font-size: 0.9rem;">A structured audit checklist for compliance officers and IT security teams — covering data residency, BAAs, encryption, audit logging, access controls, and incident response. Enter your email to unlock it.</p>
  <a href="/hipaa-checklist" style="display: inline-block; padding: 0.5rem 1.25rem; background: #0f172a; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 0.9rem;">Get the checklist →</a>
</div>

<h2>The bottom line</h2>

<p>The free online document tools most people reach for — SmallPDF, ILovePDF, Adobe Online — are legitimate products. They're just not built for regulated data. The upload architecture that made them possible 10 years ago is no longer necessary, but it hasn't gone away because these tools were built before WebAssembly changed the equation.</p>

<p>If your organization works with PHI, privileged communications, or regulated financial data, the right answer isn't to find the "most compliant" uploading tool. It's to use a tool that doesn't upload at all.</p>

<p><a href="/enterprise">Toolora for Enterprise →</a> — client-side document processing for compliance-sensitive teams. Architecture documentation included.</p>
    `.trim(),
  },
  {
    slug: "claude-skills-tool-stack",
    title: "The Free Tool Stack Behind Every Claude Skills Business",
    description: "Those '17 Claude skills that pay real money' posts go viral for a reason. But they skip one thing: what handles the output. Here's the missing infrastructure layer.",
    date: "2026-04-03",
    readTime: "6 min read",
    category: "AI Builders",
    content: `
<p>The "17 Claude skills that pay real money" posts are everywhere right now — and for good reason. The skills are real. The money is real. People are charging per lead, per SOP, per deliverable.</p>

<p>But every single post skips the same thing: <strong>what happens to Claude's output?</strong></p>

<p>Claude writes a cold email sequence — now what? The client needs a file, not a chat window. Claude builds a vendor comparison — now what? The procurement team wants a spreadsheet, not a screenshot. Claude drafts an SOP — now what? The operations manager needs a PDF they can actually send around.</p>

<p>The skill is the thinking. The delivery is everything else. And most people are copy-pasting from Claude into Word, manually.</p>

<h2>The last-mile problem</h2>

<p>Claude is a brilliant collaborator who can't hand you anything. Every output lives inside a chat thread until you extract it. For one-off tasks, that's fine. For a service business running 20 clients, it's a bottleneck.</p>

<p>The professional version of this workflow looks different: Claude produces the output, a tool packages it, the client receives something they can actually use. That gap — from Claude's response to a usable deliverable — is what I'd call the last mile.</p>

<p>Here's the tool stack that covers it, all free, all browser-side or MCP-native.</p>

<h2>Tool 1: Turn any Claude output into a shareable link</h2>

<p>The fastest win. Instead of pasting Claude's output into an email, you share a clean link.</p>

<p>With the <a href="/mcp">Toolora MCP server</a> connected to Claude Desktop or Cursor, you can ask Claude to:</p>

<blockquote>
<p>"Write a market objection analysis for [company], then create a shareable paste so I can send the client a link."</p>
</blockquote>

<p>Claude writes the analysis and calls <code>create_shareable_paste</code> — you get back a <code>toolora.dev/p/[id]</code> link in seconds. No copy-paste. No file attachment. The client clicks a link and sees a clean, formatted page.</p>

<p>Expires in 7 days by default. No account required for the recipient.</p>

<h2>Tool 2: Export to PDF without leaving the conversation</h2>

<p>SOPs. Reports. Briefs. Proposals. Every Claude skills business produces documents that clients expect as PDFs.</p>

<p>The MCP tool <code>generate_pdf_from_text</code> takes Claude's output — headings, bullet points, paragraphs — and converts it directly to a formatted PDF. Claude returns the base64, which your workflow or Claude Desktop can save or send.</p>

<p>Ask Claude:</p>

<blockquote>
<p>"Write a 5-step onboarding SOP for [role], then generate it as a PDF document titled 'Onboarding Guide.'"</p>
</blockquote>

<p>Same conversation. PDF in your hands. No Word, no Google Docs, no reformatting.</p>

<h2>Tool 3: Convert research outputs to spreadsheets</h2>

<p>Skills 4–7 in the viral post — market objection mining, competitor feature mapping, pricing tear-downs — all produce structured data. Tables. Lists. Comparisons.</p>

<p>The <code>json_to_csv</code> MCP tool converts any JSON array Claude produces into a clean CSV. Ask Claude to structure its competitor research as JSON first, then convert — your client gets a spreadsheet they can open in Excel.</p>

<p>This alone removes the single most annoying step in research delivery work.</p>

<h2>Tool 4: Read client documents without a vision model</h2>

<p>Clients send you their existing documents to work from. PDFs of their current SOPs. Word docs of their job descriptions. Excel files of their lead lists.</p>

<p>The Toolora MCP server can extract text from all of these:</p>
<ul>
  <li><code>extract_pdf_text</code> — pulls clean text from any PDF</li>
  <li><code>extract_docx_text</code> — reads Word documents directly</li>
  <li><code>excel_to_json</code> — parses spreadsheets into structured data</li>
  <li><code>ocr_image</code> — extracts text from scanned images and screenshots</li>
</ul>

<p>Ask Claude to read a client's existing SOP, identify gaps, and rewrite it. The entire workflow stays inside one conversation — no manual copy-pasting from PDFs.</p>

<h2>Tool 5: Publish to HTML for web delivery</h2>

<p>If your Claude skill delivers web content — landing page rewrites, email sequences, ad copy — your client often needs clean HTML, not markdown.</p>

<p><code>markdown_to_html</code> converts Claude's markdown output into a complete, styled HTML document. Proper heading hierarchy, formatted lists, readable typography. Ready to paste into a CMS or send as a standalone page.</p>

<h2>The MCP setup (one config block)</h2>

<p>All of these tools — <code>create_shareable_paste</code>, <code>generate_pdf_from_text</code>, <code>json_to_csv</code>, <code>extract_pdf_text</code>, <code>markdown_to_html</code>, and 10 more — are available in the free Toolora MCP server.</p>

<p>Add this to your Claude Desktop config:</p>

<pre><code>{
  "mcpServers": {
    "toolora": {
      "type": "http",
      "url": "https://toolora.dev/api/mcp"
    }
  }
}</code></pre>

<p>Or in Cursor / Windsurf — same URL, HTTP transport. No API key, no account.</p>

<h2>The workflow this enables</h2>

<p>Before: Claude produces output → you copy-paste → you reformat → you export → you send.</p>

<p>After: Claude produces output → Claude packages it → client receives a link or file.</p>

<p>That's not a small improvement. For anyone running Claude skills as a real service, removing the manual delivery step is the difference between a side project and a scalable workflow.</p>

<p>The 17 skills still need your judgment, your prompts, your client relationships. But the output packaging? That's infrastructure. And infrastructure should be free.</p>

<p><a href="/mcp">Toolora MCP — free, 15 tools, no account required →</a></p>
    `.trim(),
  },
  {
    slug: "what-is-x402-payments-for-ai-apis",
    title: "What Is x402? HTTP Payments for AI APIs, Explained Without the Crypto Jargon",
    description: "x402 is an emerging standard that lets APIs charge per-call using HTTP — no subscriptions, no API key management, no invoices. Here's how it works for regular developers who don't follow crypto.",
    date: "2026-04-04",
    readTime: "7 min read",
    category: "Developer",
    content: `
<p>If you've spent any time around AI developer tooling in the last year, you've probably seen "x402" mentioned somewhere — in a GitHub README, a Coinbase developer blog, or a Discord for AI builders. And if you're not deeply invested in crypto infrastructure, you probably skimmed past it.</p>

<p>That's a mistake worth correcting. x402 is one of the more practically useful ideas to come out of blockchain adjacent tooling in a long time, and it doesn't require you to care about crypto at all to benefit from it.</p>

<h2>What problem does x402 solve?</h2>

<p>Think about how you currently pay for API access. You sign up, enter a credit card, choose a plan, get an API key, embed that key in your code, and then hope your usage stays inside your tier. If you go over, you get an invoice. If someone steals your key, you get a surprise bill. If you want to let a third-party app call an API on your behalf, you have to share credentials or build OAuth flows.</p>

<p>This works fine for B2B SaaS. It's a bad fit for machine-to-machine calls — especially autonomous AI agents that need to use tools on demand, pay for only what they use, and do all of this without a human in the loop.</p>

<p>x402 proposes something different: make payment part of the HTTP protocol itself. When an API needs money to fulfill a request, it responds with HTTP status <code>402 Payment Required</code> — a status code that's been in the HTTP spec since 1991 but was reserved as "for future use." The client, seeing a 402, attaches a payment (a tiny amount of stablecoin), resends the request, and gets its response. No account. No API key. No subscription.</p>

<h2>How does the payment actually work?</h2>

<p>The current x402 spec uses USDC on Base (Coinbase's Ethereum L2) because transaction fees are low enough to make small payments practical. A call that costs $0.01 can settle on-chain for a fraction of a cent in gas fees.</p>

<p>Here's the flow in plain terms:</p>

<ol>
  <li>Your agent makes a GET or POST request to an x402-enabled API</li>
  <li>The API responds: <code>402 Payment Required</code> with a header describing the price, the wallet address to pay, and the accepted token</li>
  <li>Your agent signs a payment transaction from its own wallet (a private key it controls locally)</li>
  <li>Your agent re-sends the request with the payment proof in a header: <code>X-Payment: ...</code></li>
  <li>The API verifies the payment on-chain and returns the actual response</li>
</ol>

<p>The entire round-trip adds maybe 200–400ms depending on network conditions. The API doesn't need to know who you are. Your agent doesn't need an account. The payment is the credential.</p>

<h2>Why does this matter for AI agents specifically?</h2>

<p>Consider what happens when you give Claude or GPT-4 access to a tool via MCP. The agent decides autonomously when to call that tool, how many times, and in what sequence. A subscription model breaks down here — you can't predict usage in advance. A per-call API key model has security problems — you're embedding a credential with potentially large scope into an autonomous system.</p>

<p>x402 fits the shape of agent tool calls naturally:</p>

<ul>
  <li><strong>Pay only for what you actually use</strong> — no idle subscription cost</li>
  <li><strong>No credentials to leak</strong> — the wallet key stays on your machine, and each payment is for a single call</li>
  <li><strong>Composable by default</strong> — any agent with a funded wallet can call any x402-enabled tool, without per-tool registration</li>
  <li><strong>Auditable</strong> — every payment is a verifiable on-chain transaction; you can see exactly what was called and when</li>
</ul>

<h2>Do I need to run a blockchain node?</h2>

<p>No. You need a wallet (a private key), a small balance of USDC on Base, and a library that handles the payment signing. The <a href="https://github.com/coinbase/x402" target="_blank" rel="noopener noreferrer">x402 reference implementation</a> from Coinbase handles this in about 10 lines of JavaScript. The Base network is an L2 with fast, cheap finality — you don't interact with Ethereum mainnet at all.</p>

<p>The mental model that helps: think of your agent's wallet like a pre-paid transit card. You load it with USDC, and it taps to pay each time it uses a service. No signup required at each turnstile.</p>

<h2>What does this look like in production today?</h2>

<p>x402 is early — most tools don't support it yet — but the places where it's being used are exactly the places doing interesting agent work. Toolora's Agent API supports both x402 and traditional Stripe subscriptions, letting you choose the payment model that fits your use case. If you're building a single agent that calls the OCR or PDF extraction tool occasionally, x402 pay-per-call makes more financial sense than a $19/month subscription.</p>

<p>The <a href="https://github.com/modelcontextprotocol/servers" target="_blank" rel="noopener noreferrer">MCP ecosystem</a> is another place to watch — as more MCP servers expose paid capabilities, x402 is the most natural way to gate them without requiring users to manage per-tool API keys.</p>

<h2>Should you build with x402 today?</h2>

<p>If you're building developer tooling or AI infrastructure: yes, it's worth understanding now. The pattern is sound, the tooling is functional, and being early means your API doesn't have to retrofit payment later.</p>

<p>If you're building a product for non-technical end users: x402 is infrastructure you might use under the hood, but you wouldn't expose it to users directly. Traditional Stripe checkout still wins for consumer-facing flows.</p>

<p>If you're an agent developer: the most useful thing you can do right now is fund a test wallet with $5 of USDC on Base and make one x402 call. The mechanics become completely obvious the moment you see it work.</p>

<p>The HTTP 402 status code has waited 30 years to be useful. It's finally useful.</p>

<p><a href="/api">Toolora Agent API — supports x402 and Stripe →</a></p>
    `.trim(),
  },
  {
    slug: "local-mcp-servers-vs-hosted-mcp-servers",
    title: "Local MCP Servers vs Hosted MCP Servers: Which Should You Use?",
    description: "Not all MCP servers are equal on privacy. Local servers run entirely on your machine. Hosted servers send your data to someone else's infrastructure. Here's how to choose — and what questions to ask before you install anything.",
    date: "2026-04-05",
    readTime: "6 min read",
    category: "Privacy",
    content: `
<p>When people first discover MCP (Model Context Protocol), they install a few servers, get Claude working with their filesystem or database, and move on. The privacy question comes later — usually after they've been using a hosted MCP server for a while and wonder: where exactly did that PDF go?</p>

<p>It's worth asking before you install, not after. Here's how local and hosted MCP servers actually differ, and how to make the right call for your situation.</p>

<h2>What local MCP servers do</h2>

<p>A local MCP server runs as a process on your machine. When Claude (or Cursor, or Cline) calls a tool through it, the computation happens locally. Your data — files, text, images, database contents — never leaves your device.</p>

<p>The Filesystem MCP server is the clearest example. When you ask Claude to read a file, Claude sends a tool call to the Filesystem server running locally, which reads the file from your disk and returns the content to Claude. The file content travels: local disk → local MCP process → Claude API. It does reach Anthropic's servers as part of the context, but it doesn't go through any third-party infrastructure in between.</p>

<p>Other examples of genuinely local MCP servers:</p>
<ul>
  <li><strong>SQLite</strong> — queries run against a database file on your machine</li>
  <li><strong>Git</strong> — reads your local git history and repository state</li>
  <li><strong>Memory</strong> — stores and retrieves notes in a local JSON file</li>
  <li><strong>Puppeteer</strong> — runs a real Chrome browser on your computer</li>
</ul>

<p>These servers have zero network dependency for their core function. They install via npx, run as a subprocess, and stop when your AI client closes.</p>

<h2>What hosted MCP servers do</h2>

<p>A hosted MCP server runs on someone else's infrastructure. Your AI client sends tool calls to a remote URL, the remote server does the computation, and sends back results.</p>

<p>This isn't automatically bad. But it means your data — the content you're processing — travels to a third-party server. Depending on what you're processing, that matters a lot.</p>

<p>Hosted servers that are privacy-respecting handle this honestly: they're transparent about what data they receive, they don't log content, and they have clear data retention policies. Hosted servers that aren't privacy-respecting do the opposite — and they're often the ones offering the flashiest capabilities.</p>

<p>The tell is usually in the terms of service, not the marketing copy.</p>

<h2>How to evaluate any MCP server before installing it</h2>

<p>Four questions worth asking:</p>

<p><strong>1. Where does the computation happen?</strong></p>
<p>Look at the installation config. Does it say <code>command: "npx"</code> with local arguments? That's a local process. Does it say <code>url: "https://some-service.com/mcp"</code>? That's a remote server. The config doesn't lie.</p>

<p><strong>2. What data does each tool call transmit?</strong></p>
<p>Read the tool descriptions. An OCR tool that receives a PDF as base64 is transmitting your full PDF content to wherever it processes. A word count tool that receives your text is transmitting your text. Most hosted servers are upfront about this in their tool descriptions if you read carefully.</p>

<p><strong>3. Who operates the server and what's their privacy policy?</strong></p>
<p>Open source servers you can self-host are inherently more auditable than closed-source SaaS services. For any server that handles real content, check: do they log requests? For how long? Under what legal jurisdiction?</p>

<p><strong>4. What happens if the server goes down?</strong></p>
<p>Local servers fail gracefully — Claude just can't use that tool. Hosted servers create a dependency on uptime, rate limits, and API keys. If you're building workflows that need to be reliable, local-first is more resilient.</p>

<h2>When hosted is the right choice</h2>

<p>Some capabilities genuinely can't run locally. Audio transcription at quality requires a GPU. Real-time web search requires actual web access. OCR at scale requires server-side infrastructure.</p>

<p>Hosted MCP servers are the right choice when:</p>
<ul>
  <li>The capability requires resources your local machine doesn't have</li>
  <li>The data you're processing isn't sensitive (public URLs, non-confidential text)</li>
  <li>The server operator is transparent and the privacy model is documented</li>
  <li>You've accepted the trade-off consciously, not by default</li>
</ul>

<p>The key word is <em>consciously</em>. Installing a hosted MCP server without knowing it's hosted is how people accidentally send confidential documents to unknown infrastructure.</p>

<h2>The hybrid approach that works best</h2>

<p>Most productive setups use both. Local servers for anything involving sensitive or personal data — files, databases, git history, notes. Hosted servers for public-data tasks — web search, URL reading, audio from public sources.</p>

<p>Claude Desktop makes this easy because you can run multiple MCP servers simultaneously. Your config can have the local Filesystem server alongside a privacy-respecting hosted server for URL reading, and Claude will use whichever is appropriate for the task.</p>

<p>The MCP Hub at <a href="/mcp-hub">toolora.dev/mcp-hub</a> lists servers that have been vetted for this kind of hybrid setup — local-first where possible, privacy-respecting API where local isn't viable. Every server in the directory is there because it passes a clear bar, not because someone paid for placement.</p>

<h2>The short version</h2>

<p>Local MCP server: your data stays on your machine. Hosted MCP server: your data travels to someone's infrastructure. Neither is automatically right or wrong — but the choice should be intentional, and most people aren't making it intentionally right now.</p>

<p>Check your Claude Desktop config. If you see a <code>url:</code> pointing to a third-party domain for a server that processes your documents, it's worth knowing what that server does with what it receives.</p>

<p><a href="/mcp-hub">Privacy-first MCP server directory →</a></p>
    `.trim(),
  },
  {
    slug: "law-firm-secure-document-workflow-no-cloud-uploads",
    title: "How a Small Law Firm Can Use AI Document Tools Without Uploading Client Files",
    description: "Attorney-client privilege creates real constraints on cloud document tools. Browser-side processing offers a practical path to AI-assisted document work without the compliance exposure. A workflow walkthrough.",
    date: "2026-04-06",
    readTime: "8 min read",
    category: "Security",
    content: `
<p>Law firms are caught in an uncomfortable position with AI document tools. The productivity gains are real and visible — associates at peer firms are drafting, summarizing, and extracting faster. But the standard tools (upload to SmallPDF, run through Adobe, paste into ChatGPT) create privilege and confidentiality exposure that most ethics partners won't sign off on.</p>

<p>The tension is real: your clients didn't consent to their merger documents going to a PDF processor's servers in Dublin.</p>

<p>Browser-side document processing offers a path through this. Here's a practical walkthrough of what it looks like for common law firm workflows.</p>

<h2>The actual legal risk with cloud document tools</h2>

<p>The risk isn't theoretical. Most state bar ethics opinions on cloud computing require lawyers to take "reasonable precautions" to prevent unauthorized disclosure of client information. When you upload a document to a third-party service — even momentarily, even for processing — that document exists on infrastructure you don't control, under terms of service you've probably never read, potentially logged for quality assurance or ML training purposes.</p>

<p>For most documents this is tolerable. For M&A due diligence materials, litigation documents under protective order, or anything containing PHI, it's not.</p>

<p>Browser-side tools don't upload. The document is read by your browser's file system API, processed in WebAssembly running in the browser tab, and the result is generated locally. Nothing is transmitted to any server. There is no third party receiving your client's files — not even momentarily.</p>

<p>From an ethics standpoint, this is structurally equivalent to running processing software on your own machine.</p>

<h2>Common workflows, made compliant</h2>

<p><strong>PDF assembly from multiple sources</strong></p>

<p>Scenario: You need to compile exhibits for a filing — combining PDF excerpts from discovery, scanned court orders, and your own drafted sections into one numbered exhibit packet.</p>

<p>Cloud tool risk: Every PDF goes to the processor's servers. For discovery materials subject to a protective order, this can be a problem.</p>

<p>Browser approach: Use a browser-side PDF merge tool. Select all source PDFs from your local drive. The browser combines them in memory using pdf-lib (a WebAssembly library) and offers the merged file as a local download. No upload, no server, no third-party infrastructure anywhere in the chain.</p>

<p><strong>Extracting text from scanned documents for search</strong></p>

<p>Scenario: You have 200 pages of scanned depositions in PDF form and need to make them text-searchable to run keyword searches before a hearing.</p>

<p>Cloud tool risk: Sending OCR work to cloud services means scanned depositions — potentially containing very sensitive witness statements — leaving your control.</p>

<p>Browser approach: Browser-side OCR has improved dramatically with WebAssembly ports of Tesseract. You can run OCR on PDFs locally and get searchable text output without the document leaving your machine. The process is slower than cloud OCR but adequate for most legal work where you're not processing thousands of pages simultaneously.</p>

<p><strong>Converting document formats for e-filing</strong></p>

<p>Scenario: Court requires PDF/A format for e-filing; your documents are in DOCX.</p>

<p>Cloud tool risk: Your draft pleadings going to a cloud converter before submission.</p>

<p>Browser approach: Browser-side DOCX-to-PDF conversion handles most formatting cases correctly. Verify the output against the original before submission — as you should with any conversion — but for standard legal documents the fidelity is typically sufficient.</p>

<p><strong>Summarizing long documents with AI assistance</strong></p>

<p>This one is more nuanced. If you want Claude or another LLM to summarize a confidential document, the document content will reach Anthropic's servers as part of the context. That's unavoidable with current LLM architecture.</p>

<p>The practical solution is extraction first, then selective summarization. Use browser-side tools to extract only the specific sections relevant to your question — a particular clause, a specific exhibit, a single page range. Then submit only that extract to the AI. You're not sending the whole contract; you're sending the three paragraphs you need analyzed.</p>

<p>This also produces better AI output, since focused context tends to yield more precise summaries.</p>

<h2>What this workflow looks like day-to-day</h2>

<p>In practice, the setup for a small firm (5–20 attorneys) looks like this:</p>

<ol>
  <li><strong>Bookmark browser-side tools</strong> that cover your common document tasks. Keep them in a shared browser bookmark folder so all staff use the same vetted tools.</li>
  <li><strong>Train staff on the distinction</strong> between browser-side and upload-based tools. The visual difference is usually that browser-side tools have a "Select file" button but no "Upload" button — the processing starts immediately and locally after selection.</li>
  <li><strong>Verify with DevTools when in doubt.</strong> Open F12, go to the Network tab, and use the tool. If no file upload request fires, no data left your machine. This is auditable and demonstrable to clients or ethics reviewers.</li>
  <li><strong>Use AI assistance on extracts, not originals.</strong> Build the habit of extracting relevant sections locally before pasting into any AI tool.</li>
</ol>

<h2>The BAA question</h2>

<p>For firms handling medical-legal work — personal injury, workers' compensation, disability — HIPAA adds another layer. The standard cloud document processing services require a Business Associate Agreement before you use them with PHI-containing documents. Most won't sign one, or charge enterprise rates for the privilege.</p>

<p>Browser-side tools sidestep this entirely. Because the tool never receives PHI — it runs in the browser, on your machine — the vendor is not a business associate and no BAA is required. This is the same structural argument that makes locally-installed software exempt from HIPAA's business associate requirements.</p>

<p>This doesn't eliminate your HIPAA obligations. It means one significant compliance burden — vetting and contracting with cloud processors — disappears from the equation.</p>

<h2>Limitations to be honest about</h2>

<p>Browser-side processing isn't magic. There are real constraints:</p>

<ul>
  <li><strong>Speed.</strong> WebAssembly OCR on a 500-page document takes longer than cloud OCR. For high-volume document processing, this is a real limitation.</li>
  <li><strong>Memory.</strong> Very large files can exhaust browser memory. If you're merging a 2GB PDF, you may need to split the task.</li>
  <li><strong>Complex conversions.</strong> Heavily formatted documents with tracked changes, embedded charts, or custom fonts may not convert perfectly. Check the output.</li>
  <li><strong>No collaboration.</strong> Browser-side tools are single-user. For collaborative document workflows, you need different solutions.</li>
</ul>

<p>For the common cases — assembling exhibits, extracting text, merging files, compressing for email — browser-side handling is entirely adequate and the privacy trade-off is clearly worth it.</p>

<h2>A starting point</h2>

<p>The browser-based tools at <a href="/tools">toolora.dev/tools</a> cover PDF merge, PDF split, OCR, image compression, and format conversion — all running in the browser with no server involvement. You can verify this with the DevTools network test described above. For firms that want to extend this to AI agents and automation, the same privacy-first approach extends to the MCP server and Agent API.</p>

<p>The ethics landscape around AI and legal practice is still forming. Firms that build good habits now — understanding what data goes where, why, and under what terms — will be better positioned when bar guidance catches up to the technology.</p>

<p><a href="/enterprise">Toolora for legal and regulated industries →</a></p>
    `.trim(),
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

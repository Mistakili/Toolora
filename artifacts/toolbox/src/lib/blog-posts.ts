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
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

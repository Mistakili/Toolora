export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  content: string;
}

const SLUG_IMAGE_MAP: Record<string, string> = {
  "ai-agent-on-chain-decision-ledger-soliris":          "mcp-tools-visual.png",
  "flesch-readability-score-checker":                   "blog-word-count-stats.png",
  "hipaa-compliant-online-document-tools":              "blog-hipaa-compliance.png",
  "law-firm-secure-document-workflow-no-cloud-uploads": "blog-hipaa-compliance.png",
  "stop-pasting-jwts-into-random-websites":             "blog-jwt-privacy.png",
  "hashing-vs-encryption-whats-the-difference":        "blog-jwt-anatomy.png",
  "how-to-count-tokens-chatgpt-openai":                "blog-platform-limits.png",
  "word-counter-online-free":                          "blog-word-count-stats.png",
  "competitor-research-claude-mcp":                    "mcp-tools-visual.png",
  "what-is-x402-payments-for-ai-apis":                 "mcp-visual.png",
  "local-mcp-servers-vs-hosted-mcp-servers":           "mcp-hub-hero.png",
  "claude-skills-tool-stack":                          "mcp-tools-visual.png",
  "why-i-built-client-side-toolbox":                   "blog-hero.png",
  "resize-images-without-uploading":                   "privacy-shield-new.png",
  "best-free-image-compressor-privacy":                "privacy-shield-new.png",
  "merge-pdfs-without-uploading":                      "privacy-shield-new.png",
  // April 6–20 batch
  "ocr-extract-text-from-image-free":                  "blog-ocr-scan.png",
  "compress-pdf-free-no-upload":                       "blog-pdf-tools.png",
  "reading-time-calculator-formula":                   "blog-text-tools.png",
  "split-pdf-free-browser-based":                      "blog-pdf-tools.png",
  "markdown-to-html-converter-guide":                  "blog-data-convert.png",
  "text-case-converter-guide":                         "blog-text-tools.png",
  "what-is-cors-explained":                            "blog-developer-web.png",
  "csv-to-json-convert-online":                        "blog-data-convert.png",
  "http-status-codes-developer-guide":                 "blog-developer-web.png",
  "localstorage-vs-sessionstorage-vs-cookies":         "blog-developer-web.png",
  "keyword-density-seo-guide":                         "blog-seo-content.png",
  "install-mcp-server-claude-desktop":                 "mcp-hub-hero.png",
  "words-per-page-reference":                          "blog-text-tools.png",
  "what-is-webassembly-wasm-browser-privacy":          "blog-developer-web.png",
  "excel-to-json-converter":                           "blog-data-convert.png",
  "share-text-online-pastebin-alternatives":           "blog-privacy-audit.png",
  "regex-basics-patterns-guide":                       "blog-developer-web.png",
  "ai-agent-memory-systems-explained":                 "blog-ai-agent.png",
  "read-pdf-without-google-drive":                     "blog-pdf-tools.png",
  "url-encoding-percent-encoding-explained":           "blog-developer-web.png",
  "check-if-website-uploads-your-files":               "blog-privacy-audit.png",
  "mime-types-content-type-explained":                 "blog-developer-web.png",
  "what-is-an-ai-agent":                               "blog-ai-agent.png",
  "markdown-cheat-sheet-2026":                         "blog-data-convert.png",
  "generate-uuid-guid-online":                         "blog-developer-web.png",
  "character-count-social-media-limits":               "blog-text-tools.png",
  "what-is-a-webhook":                                 "blog-developer-web.png",
  "seo-writing-tips-2026":                             "blog-seo-content.png",
  "ai-function-calling-mcp-explained":                 "blog-ai-agent.png",
  "url-slug-seo-best-practices":                       "blog-seo-content.png",
  // April 21 – May 15 batch
  "json-vs-yaml-comparison":                           "blog-data-convert.png",
  "sha256-vs-md5-hash-comparison":                     "blog-jwt-anatomy.png",
  "how-to-decode-base64-online":                       "blog-developer-web.png",
  "pdf-metadata-removal-guide":                        "blog-pdf-tools.png",
  "css-units-px-em-rem-explained":                     "blog-developer-web.png",
  "what-is-jwt-how-it-works":                          "blog-jwt-anatomy.png",
  "how-to-validate-email-address":                     "blog-developer-web.png",
  "yaml-to-json-converter-guide":                      "blog-data-convert.png",
  "chrome-extensions-privacy-risks":                   "blog-privacy-audit.png",
  "how-to-compress-images-web":                        "privacy-shield-new.png",
  "base64-images-css-tradeoffs":                       "blog-developer-web.png",
  "what-is-rate-limiting-api":                         "blog-developer-web.png",
  "how-to-read-http-headers":                          "blog-developer-web.png",
  "robots-txt-guide-seo":                              "blog-seo-content.png",
  "sitemap-xml-guide-seo":                             "blog-seo-content.png",
  "how-to-minify-javascript-css":                      "blog-developer-web.png",
  "what-is-oauth-explained":                           "blog-jwt-anatomy.png",
  "color-hex-rgb-hsl-converter-guide":                 "blog-data-convert.png",
  "how-to-read-cron-jobs":                             "blog-developer-web.png",
  "what-is-a-cdn-explained":                           "blog-developer-web.png",
  "json-schema-validation-guide":                      "blog-data-convert.png",
  "how-to-use-browser-devtools-network-tab":           "blog-developer-web.png",
  "password-strength-entropy-explained":               "blog-jwt-anatomy.png",
  "what-is-indexeddb-browser-storage":                 "blog-developer-web.png",
  "html-entities-special-characters-guide":            "blog-developer-web.png",
  "how-to-convert-csv-to-excel":                       "blog-data-convert.png",
  "api-authentication-api-key-vs-oauth":               "blog-jwt-anatomy.png",
  "what-is-websocket-vs-http":                         "blog-developer-web.png",
  "how-to-encode-url-parameters":                      "blog-developer-web.png",
  "json-data-types-reference":                         "blog-data-convert.png",
  "what-is-ssl-tls-https-explained":                   "blog-jwt-anatomy.png",
  "image-formats-webp-vs-jpg-vs-png":                  "privacy-shield-new.png",
  "how-to-use-curl-for-api-testing":                   "blog-developer-web.png",
  "what-is-content-security-policy":                   "blog-privacy-audit.png",
  "privacy-by-design-explained":                       "blog-hipaa-compliance.png",
  "read-pdf-browser-without-upload":                   "blog-pdf-tools.png",
  "markdown-front-matter-guide":                       "blog-data-convert.png",
  "how-to-create-favicon-for-website":                 "blog-developer-web.png",
  "jwt-claims-explained":                              "blog-jwt-anatomy.png",
  "how-to-diff-two-files-online":                      "blog-text-tools.png",
  "what-is-a-proxy-server-explained":                  "blog-developer-web.png",
  "online-tools-privacy-checklist":                    "blog-privacy-audit.png",
  "html-meta-tags-seo-complete-guide":                 "blog-seo-content.png",
  "how-to-generate-random-passwords-securely":         "blog-jwt-anatomy.png",
  "what-is-gzip-compression-explained":                "blog-developer-web.png",
  "csv-best-practices-data-import-export":             "blog-data-convert.png",
  "how-ai-reads-tool-descriptions-mcp":                "mcp-tools-visual.png",
  "understanding-color-spaces-web":                    "blog-data-convert.png",
  "qr-code-error-correction-explained":                "blog-developer-web.png",
  "what-is-a-hash-function-explained":                 "blog-jwt-anatomy.png",
};

const CATEGORY_IMAGE_MAP: Record<string, string> = {
  "privacy":        "privacy-shield-new.png",
  "security":       "blog-jwt-anatomy.png",
  "developer":      "hero-bg-new.png",
  "developer tools":"hero-bg-new.png",
  "ai builders":    "mcp-tools-visual.png",
  "tools":          "blog-word-count-stats.png",
  "productivity":   "blog-hero.png",
  "behind the build":"blog-hero.png",
};

export function getPostImage(slug: string, category: string): string {
  const file = SLUG_IMAGE_MAP[slug] ?? CATEGORY_IMAGE_MAP[category.toLowerCase()] ?? "blog-hero.png";
  return `/images/${file}`;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "ai-agent-on-chain-decision-ledger-soliris",
    title: "The AI Trading Agent That Commits Its Reasoning On-Chain Before It Trades",
    description: "Most AI trading bots explain decisions after the fact. Soliris logs the agent's full reasoning to the Solana blockchain before the swap fires — timestamp-provable, publicly verifiable, impossible to retrofit.",
    date: "2026-04-05",
    readTime: "6 min read",
    category: "AI Builders",
    content: `
<p>Every AI trading bot claims it makes smart decisions. Almost none of them can prove it.</p>

<p>The problem is retrofitting. A bot executes a trade at 9:14am. At 9:15am — after the result is known — it logs its "reasoning." You can't tell whether the explanation was generated before or after the outcome. The timestamps on database logs are easy to fake. The explanations are generated by the same model that knows the result.</p>

<p>This is the core credibility problem for AI in finance: there's no way to verify that the reasoning preceded the action.</p>

<p>Soliris solves it with a simple architectural decision: <strong>every buy and sell decision is written to the Solana Memo program before the swap transaction is sent</strong>.</p>

<h2>What the Solana Memo program actually does</h2>

<p>The Memo program is one of Solana's oldest native programs. It accepts arbitrary UTF-8 text and writes it permanently to the blockchain as part of a transaction. The transaction gets a timestamp from the block it lands in — a timestamp that is determined by the network, not by any server you control.</p>

<p>That's the key property. Solana block timestamps are consensus-derived. Nobody — not the developer, not the server, not the agent itself — can retroactively alter what block a transaction landed in or when.</p>

<p>Soliris uses this to create an <strong>on-chain decision ledger</strong>. Before any swap executes, the agent writes a JSON blob to the Memo program containing:</p>

<ul>
  <li>The token being evaluated and its current price</li>
  <li>The signal score from the Brain model (scored on age bucket performance, smart money overlap, volume/liquidity ratio)</li>
  <li>Which specific signal sources triggered the buy (DexScreener scan, Pump.fun pre-graduation, BURNIE cluster detection)</li>
  <li>The agent's explicit reasoning for acting now rather than waiting</li>
  <li>The decision type: BUY or SELL, with position context</li>
</ul>

<p>This transaction settles on-chain. Then — and only then — the swap transaction fires.</p>

<h2>Why the order matters</h2>

<p>The two transactions produce two Solscan links. The decision log link always has an earlier block timestamp than the swap link. You can verify this yourself for any trade the agent makes — open both links, compare the block times. The reasoning provably preceded the action.</p>

<p>This is a small thing architecturally. It's a significant thing philosophically. It means that for the first time, an AI trading agent's decision-making can be audited the same way a blockchain transaction can be audited: permissionlessly, by anyone, without trusting the system operator.</p>

<p>Judges at the Solana x402 Hackathon can do exactly this — compare the Memo program tx timestamp versus the Jupiter swap tx timestamp and confirm the agent committed first, then traded. Not the other way around.</p>

<h2>What the reasoning actually looks like</h2>

<p>Here's an example of what lands on-chain before a buy executes:</p>

<pre><code>{
  "type": "BUY",
  "token": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "price_usd": 0.000043,
  "signal_score": 78,
  "age_bucket": "1-6hr",
  "age_bucket_win_rate": 0.698,
  "source": "dexscreener",
  "smart_money_overlap": 2,
  "burnie_cluster": true,
  "conviction": "HIGH",
  "reasoning": "Token age 2.4hr in peak win-rate bucket. 2 BURNIE wallets entered at $3.2K MC. Volume/liquidity ratio 1.8x above threshold. Pump.fun pre-graduation scan confirms 4 buys, 1.2 SOL volume. No avoidance flags.",
  "position_size_sol": 0.02,
  "circuit_breaker": false
}</code></pre>

<p>This isn't a post-hoc explanation. It's the input to the decision — generated, hashed, and written to chain before the swap fires.</p>

<h2>The Brain behind the decisions</h2>

<p>The signal score in that JSON comes from the Soliris Brain — a scoring model trained on 1,064 simulated trades that weights decisions based on:</p>

<ul>
  <li><strong>Token age bucket performance</strong> — the 1–6 hour window has historically been the peak opportunity, averaging +69.8% returns in the training set. Tokens older than 6 hours or newer than 1 hour score lower.</li>
  <li><strong>Smart money wallet overlap</strong> — 7 verified BURNIE wallets (50x–340x verified returns, caught at $3K–$5K market cap) are seeded into the intelligence registry. 2+ of them entering the same token is a HIGH CONVICTION flag.</li>
  <li><strong>Volume/liquidity ratio</strong> — filters require a ratio above 1.2x to separate real volume from wash trading.</li>
  <li><strong>Avoidance rules</strong> — the Brain tracks patterns from losses and adds token-specific and pattern-specific avoidance flags that reduce score for similar setups.</li>
</ul>

<p>The circuit breaker adds a final safety layer: three consecutive losses trigger an automatic pause. The agent stops trading and requires manual reset. This prevents the runaway loss spirals that kill most autonomous trading systems.</p>

<h2>The x402 economic layer</h2>

<p>Every tool call through the Soliris MCP server costs $0.001 USDC, paid autonomously via the x402 protocol. This isn't a subscription or an API key — it's the AI agent itself authorizing and signing a USDC micropayment before each tool invocation.</p>

<p>For swap execution specifically, there's a second revenue stream: a 0.2% platform fee collected via Jupiter's routing on every trade output. Both fees are configured in environment variables and flow on-chain with no manual intervention.</p>

<p>At scale, this is what agent-to-agent commerce looks like. No invoices. No payment processors. Autonomous systems paying autonomous systems for access to capabilities, settled on Solana in milliseconds.</p>

<h2>Using Soliris with Claude</h2>

<p>Soliris ships as an MCP server — 23 tools across three tiers. The 12 Eyes (read) tools work without a private key and are free: explain any transaction, score wallet risk, decode any account, check token price, resolve .sol domains. The 7 Hands tools execute on-chain and require a funded wallet. The 4 Wallet tools handle autonomous x402 payments to any 402-gated endpoint.</p>

<p>Install it alongside <a href="/mcp">Toolora's MCP server</a> and your Claude agent can read documents, process files, check Solana wallet risk on any address it encounters in a document, and execute trades — all in one session.</p>

<p>The combined config is one JSON block. It's listed on the <a href="/mcp-hub">Toolora MCP Hub</a> under the Agent Stack.</p>

<p><a href="https://www.npmjs.com/package/soliris-mcp" target="_blank" rel="noopener noreferrer">Install Soliris MCP from npm →</a></p>
    `.trim(),
  },
  {
    slug: "flesch-readability-score-checker",
    title: "Flesch Readability Score: What It Means and How to Check Yours Free",
    description: "The Flesch Reading Ease score tells you how hard your text is to read — in seconds. Here's how it works, what the numbers mean, and how to check any text for free without uploading it anywhere.",
    date: "2026-04-05",
    readTime: "7 min read",
    category: "Tools",
    content: `
<p>You've written something. Now the question is: will people actually read it?</p>

<p>Clear writing gets read. Dense writing gets skimmed, abandoned, or misunderstood. The Flesch Reading Ease score is the fastest, most widely-used way to measure which side your text falls on — and you can check yours in seconds using the <a href="/tools/text/word-counter">Toolora Word Counter</a>. No account, no upload, runs entirely in your browser.</p>

<h2>What is the Flesch Reading Ease score?</h2>

<p>The Flesch Reading Ease score is a readability formula developed by Rudolf Flesch in 1948 and published in his book <em>The Art of Plain Talk</em>. It produces a number between 0 and 100 based on two factors:</p>

<ul>
  <li><strong>Average sentence length</strong> — longer sentences are harder to parse</li>
  <li><strong>Average number of syllables per word</strong> — longer words carry more cognitive load</li>
</ul>

<p>The formula is:</p>

<p><code>Score = 206.835 − (1.015 × average sentence length) − (84.6 × average syllables per word)</code></p>

<p>You don't need to calculate it yourself. Paste your text into the <a href="/tools/text/word-counter">Word Counter</a> and the score appears instantly alongside your word count, reading time, and keyword density.</p>

<h2>What the numbers actually mean</h2>

<table>
  <thead>
    <tr>
      <th>Score</th>
      <th>Label</th>
      <th>Reading level</th>
      <th>Typical example</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>90–100</td><td>Very Easy</td><td>5th grade</td><td>Basic instructions, children's books</td></tr>
    <tr><td>80–90</td><td>Easy</td><td>6th grade</td><td>Plain-language guides, casual blog posts</td></tr>
    <tr><td>70–80</td><td>Fairly Easy</td><td>7th grade</td><td>Consumer product copy, how-to articles</td></tr>
    <tr><td>60–70</td><td>Standard</td><td>8th–9th grade</td><td>News articles, general audience content</td></tr>
    <tr><td>50–60</td><td>Fairly Difficult</td><td>10th–12th grade</td><td>In-depth editorial, professional blogs</td></tr>
    <tr><td>30–50</td><td>Difficult</td><td>College level</td><td>Technical documentation, academic writing</td></tr>
    <tr><td>0–30</td><td>Very Difficult</td><td>College graduate</td><td>Legal contracts, scientific papers</td></tr>
  </tbody>
</table>

<p>A score of 60–70 is where most good general-audience writing lands. Below 50 you're writing for specialists. Below 30 you're writing like a lawyer.</p>

<h2>Real examples from famous texts</h2>

<p>Abstract scores make more sense with real reference points:</p>

<table>
  <thead>
    <tr>
      <th>Text</th>
      <th>Flesch Score</th>
      <th>Why</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Ernest Hemingway — <em>The Old Man and the Sea</em></td><td>~85</td><td>Short sentences, simple words — exactly the style he was famous for</td></tr>
    <tr><td>J.K. Rowling — <em>Harry Potter and the Philosopher's Stone</em></td><td>~72</td><td>Accessible vocabulary, varied sentence rhythm</td></tr>
    <tr><td>The New York Times (news articles)</td><td>~65</td><td>Clear and direct, aimed at general readers</td></tr>
    <tr><td>Harvard Business Review</td><td>~45</td><td>Assumes a college-educated audience comfortable with business concepts</td></tr>
    <tr><td>A standard insurance policy</td><td>~10–20</td><td>Legal language optimised for precision, not comprehension</td></tr>
    <tr><td>The U.S. Constitution</td><td>~30</td><td>Formal 18th-century prose; surprisingly readable for its age</td></tr>
  </tbody>
</table>

<p>Hemingway's score isn't an accident. He obsessively cut long sentences and replaced multisyllabic words with simpler alternatives. The result is prose that reads fast and hits hard — and a Flesch score to match.</p>

<h2>What score should you be targeting?</h2>

<p>It depends entirely on your audience and purpose. There's no universal ideal score — the right number is the one that matches your reader's expectations.</p>

<ul>
  <li><strong>Blog posts, marketing copy, landing pages:</strong> aim for 60–70. You want to be understood instantly, on a first pass, possibly on a phone screen.</li>
  <li><strong>Email newsletters:</strong> aim for 70–80. People read email quickly, often on mobile. Short sentences win.</li>
  <li><strong>Technical documentation:</strong> 40–55 is fine. Your audience is there to learn something specific and will read carefully.</li>
  <li><strong>Academic papers:</strong> 20–40. Precision and terminology matter more than accessibility.</li>
  <li><strong>Legal contracts:</strong> whatever score they come out at — though plain-English legal reform movements are actively pushing this above 50.</li>
  <li><strong>UI copy (buttons, tooltips, error messages):</strong> 70–90. Every word of a button label should be instantly understood.</li>
</ul>

<p>The mistake most writers make is writing for the wrong audience. A SaaS landing page that scores 25 is losing conversions — not because the product is bad, but because visitors hit a wall of dense copy and bounce.</p>

<h2>The two levers: sentences and syllables</h2>

<p>Because the formula only has two inputs, improving your score means working on one or both:</p>

<h3>Shorter sentences</h3>

<p>The most powerful lever. A sentence that runs over 25 words almost always contains a clause that should be its own sentence. Read your text aloud — anywhere you run out of breath is probably where you need a full stop.</p>

<p>Before: <em>"The platform supports real-time collaboration, meaning that multiple team members can work on the same document simultaneously without any risk of version conflicts or overwrites, which significantly reduces the time spent on reconciliation."</em> (41 words)</p>

<p>After: <em>"The platform supports real-time collaboration. Multiple team members can work on the same document at once — no version conflicts, no overwrites. Reconciliation time drops to zero."</em> (3 sentences, maximum 18 words each)</p>

<h3>Simpler words</h3>

<p>The second lever. Every long word in your text is a small speed bump. Replace them where possible:</p>

<table>
  <thead>
    <tr><th>Dense word</th><th>Simpler alternative</th></tr>
  </thead>
  <tbody>
    <tr><td>utilise</td><td>use</td></tr>
    <tr><td>facilitate</td><td>help</td></tr>
    <tr><td>demonstrate</td><td>show</td></tr>
    <tr><td>approximately</td><td>about</td></tr>
    <tr><td>implement</td><td>build / add / set up</td></tr>
    <tr><td>comprehensive</td><td>full / complete</td></tr>
    <tr><td>prioritise</td><td>focus on</td></tr>
    <tr><td>endeavour</td><td>try</td></tr>
  </tbody>
</table>

<p>This doesn't mean dumbing things down. It means choosing the word your reader will process in 0.1 seconds instead of 0.3 seconds. At scale, across a whole piece of writing, those fractions add up to the difference between content that gets read and content that gets abandoned.</p>

<h2>Readability and SEO</h2>

<p>Google has never confirmed that readability directly affects search rankings. But it affects everything that does:</p>

<ul>
  <li><strong>Time on page</strong> — readable content gets read; unreadable content gets bounced</li>
  <li><strong>Pages per session</strong> — if they finished one article, they'll look for another</li>
  <li><strong>Backlinks</strong> — people link to content they found useful and actually finished reading</li>
  <li><strong>Social sharing</strong> — short, clear sentences are easier to quote and share</li>
</ul>

<p>Yoast SEO's readability checker is built around Flesch-Kincaid scores for exactly this reason. The SEO community has accepted that readable text performs better, even if the mechanism isn't a direct ranking signal.</p>

<h2>Flesch-Kincaid Grade Level vs. Flesch Reading Ease</h2>

<p>These are two different outputs from related formulas. The Flesch Reading Ease score gives you a number from 0–100 (higher = easier). The Flesch-Kincaid Grade Level converts the same inputs into a U.S. school grade equivalent.</p>

<p>A Flesch Reading Ease score of 65 corresponds roughly to a Flesch-Kincaid Grade Level of 8, meaning an 8th grader should be able to read it comfortably. Both measures are valid — Reading Ease is more intuitive, Grade Level is more commonly used in academic and government contexts (the U.S. Department of Defense mandates Grade Level 8 or below for all public-facing documents).</p>

<p>The <a href="/tools/text/word-counter">Toolora Word Counter</a> shows the Flesch Reading Ease score. Paste your text in and you'll see your score alongside your word count, sentence count, speaking time estimate, and keyword density — all in one place, all processed locally in your browser.</p>

<h2>Check your readability score right now</h2>

<p>Paste any text — a blog post draft, a product description, an email you're about to send — into the tool below. The Flesch score updates as you type. No account required, nothing leaves your browser.</p>

<p><a href="/tools/text/word-counter">Check your Flesch readability score free — Toolora Word Counter →</a></p>
    `.trim(),
  },
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

  {
    slug: "ocr-extract-text-from-image-free",
    title: "How to Extract Text from an Image Free (OCR That Runs in Your Browser)",
    description: "Turn any screenshot, photo, or scanned document into copyable text instantly — without uploading anything to a server.",
    date: "2026-04-06",
    readTime: "5 min read",
    category: "Tools",
    keywords: ["extract text from image", "ocr online free", "image to text", "photo to text online", "browser ocr"],
    content: `
<p>You've got a screenshot with text in it. Or a photo of a sign. Or a scanned receipt. You need the text out. Most tools will upload your image to a server, process it there, and hand you back results — meaning your file lived on someone else's machine, even briefly.</p>

<p>This guide covers how OCR works, what to watch out for privacy-wise, and how to do it in a way where your image never leaves your device.</p>

<h2>What OCR actually does</h2>

<p>OCR stands for Optical Character Recognition. It's the process of identifying letter shapes in image pixels and converting them into a text string your computer can work with.</p>

<p>Modern OCR (including Tesseract, which powers most free web tools) uses a neural network trained on millions of text samples. It works well on printed text, reasonable on handwriting in clean conditions, and poorly on stylized fonts or low-contrast images.</p>

<h2>The problem with most free OCR tools</h2>

<p>Google Docs, Adobe, iLovePDF, Smallpdf — they all perform OCR server-side. Your image is uploaded, processed, and (usually) deleted. The deletion part is where you have to trust their privacy policy. For a document containing medical info, legal text, financial data, or anything personal, "usually deleted" isn't good enough.</p>

<p>You can verify this yourself: open DevTools → Network tab, drop your image into any of those tools, and watch for a POST or PUT request to an external server. You'll see it happen.</p>

<h2>Browser-based OCR: how it actually works without uploading</h2>

<p>WebAssembly (WASM) made it possible to run compiled C/C++ code in the browser at near-native speed. Tesseract, the most widely used OCR engine, has been compiled to WASM. That means the entire recognition process runs inside your browser tab, using your CPU — no server involved.</p>

<p>The tradeoff: it's slower than server-side OCR (a few seconds vs instant), and language support depends on which language packs the tool loads. English works well. Complex scripts need extra packs.</p>

<h2>Tips for better OCR results</h2>

<ul>
  <li><strong>Higher contrast</strong> — Black text on white background gives the best results. Dark text on a colored background is harder.</li>
  <li><strong>Straight alignment</strong> — Text at an angle reduces accuracy. Most tools have a deskew option; use it.</li>
  <li><strong>No compression artifacts</strong> — Screenshots are better than photos of screens. JPEG compression blurs character edges.</li>
  <li><strong>Larger text</strong> — Minimum 12pt equivalent at screen resolution. Tiny text or footnotes often extract incorrectly.</li>
</ul>

<h2>When to use which tool</h2>

<table>
  <thead>
    <tr><th>Situation</th><th>Recommended approach</th></tr>
  </thead>
  <tbody>
    <tr><td>Sensitive document (medical, legal, financial)</td><td>Browser-based OCR only — no upload</td></tr>
    <tr><td>High-volume batch processing</td><td>Server-side API (Textract, Google Vision) is faster</td></tr>
    <tr><td>Non-English or multi-language</td><td>Check language support — Tesseract WASM supports 100+ languages with the right pack</td></tr>
    <tr><td>Handwriting</td><td>Google Vision or Azure Vision — server-side but better accuracy</td></tr>
  </tbody>
</table>

<p>For most everyday use cases — extracting text from a screenshot, copying a quote from a photo, getting text out of a scanned PDF — browser OCR is more than accurate enough and is meaningfully safer.</p>

<p>Try the browser-based OCR tool at <a href="/tools">Toolora → Image → OCR</a>. Your image stays in your tab.</p>
    `.trim(),
  },

  {
    slug: "compress-pdf-free-no-upload",
    title: "How to Compress a PDF for Email (Free, Nothing Uploaded)",
    description: "Reduce PDF file size without uploading to any server. Runs entirely in your browser using WebAssembly.",
    date: "2026-04-06",
    readTime: "4 min read",
    category: "Privacy",
    keywords: ["compress pdf free", "reduce pdf file size", "pdf compressor online", "pdf too large email"],
    content: `
<p>Gmail's attachment limit is 25MB. Most email systems cap at 10MB. Your PDF is 40MB. You need to make it smaller, and you need to do it now.</p>

<p>Here's the quickest way that doesn't involve uploading your document to Smallpdf, ILovePDF, or Adobe's servers.</p>

<h2>Why PDFs get large</h2>

<p>PDF size is almost always driven by one thing: images. A document with embedded high-resolution photos or scans can easily run 50–100MB. The underlying text, fonts, and layout take up almost nothing by comparison.</p>

<p>Compression works by recompressing those images at a lower quality setting, reducing resolution, or both. The text content is not affected — it remains perfectly sharp and searchable.</p>

<h2>What compression levels actually do</h2>

<table>
  <thead>
    <tr><th>Level</th><th>Typical size reduction</th><th>Visual quality</th><th>Best for</th></tr>
  </thead>
  <tbody>
    <tr><td>Low (screen)</td><td>60–80%</td><td>Noticeable on photos</td><td>Email, preview sharing</td></tr>
    <tr><td>Medium (ebook)</td><td>30–50%</td><td>Good for documents</td><td>Most everyday use</td></tr>
    <tr><td>High (prepress)</td><td>5–15%</td><td>Near-original</td><td>Documents going to print</td></tr>
  </tbody>
</table>

<p>For most email scenarios, medium compression cuts the file by 40–60% with no visible quality loss on text-heavy documents.</p>

<h2>The privacy issue with online PDF compressors</h2>

<p>The popular tools — Smallpdf, ILovePDF, PDF2Go — all compress server-side. Your PDF is transmitted to their servers, processed, and you download the result. They claim to delete it after an hour. You're trusting that claim.</p>

<p>For a lease agreement, a medical report, a financial statement, or any document with personal data, transmitting it to a third-party server is a real risk — even if accidental and brief.</p>

<h2>Browser-based PDF compression</h2>

<p>PDF.js and pdf-lib running in WebAssembly can handle compression entirely in your browser. The compressed PDF never leaves your machine. You can verify this in DevTools → Network: there's no outbound file upload.</p>

<p>The tradeoff is speed — compressing a large PDF takes a few seconds in the browser vs. milliseconds on a server. For most files under 50MB it's entirely practical.</p>

<h2>Other ways to reduce PDF size</h2>

<ul>
  <li><strong>Print to PDF</strong> — Open the PDF, print it with "Save as PDF," and many systems will re-render it at a lower resolution.</li>
  <li><strong>Export from the source</strong> — If you created the PDF in Word, Pages, or InDesign, re-export at "web" or "screen" quality settings.</li>
  <li><strong>Remove pages</strong> — If only part of the document is needed, split the PDF and send only the relevant pages.</li>
  <li><strong>Convert images before embedding</strong> — Compress images in the source document before creating the PDF.</li>
</ul>

<p>Compress your PDF in the browser at <a href="/tools">Toolora → Documents → PDF Compress</a>. No upload, no account.</p>
    `.trim(),
  },

  {
    slug: "reading-time-calculator-formula",
    title: "Reading Time Calculator: The Formula Behind Every Article's 'X Min Read'",
    description: "How reading time estimates work, what the average reading speed actually is, and why it matters for content strategy.",
    date: "2026-04-07",
    readTime: "4 min read",
    category: "Tools",
    keywords: ["reading time calculator", "average reading speed wpm", "how long to read", "minutes to read formula"],
    content: `
<p>Medium, Substack, every news site — they all show "5 min read" at the top of the article. That number comes from a simple formula. Here's how it works, why it matters, and what it tells you about your content.</p>

<h2>The formula</h2>

<p>Reading time = word count ÷ average reading speed (words per minute)</p>

<p>Most tools use 200–238 WPM as the average. Medium uses 275 WPM. Hemingway Editor uses 300 WPM. The variation reflects whether you're estimating silent reading speed for casual readers or educated adults.</p>

<p>Research places adult silent reading speed at 200–400 WPM depending on text complexity and reader skill. For web content, 238 WPM is the most widely cited figure from Brysbaert et al. (2019), a study of 190 studies across 17 languages.</p>

<h2>What changes the estimate</h2>

<table>
  <thead>
    <tr><th>Factor</th><th>Effect on reading time</th></tr>
  </thead>
  <tbody>
    <tr><td>Technical or dense content</td><td>Slower — readers re-read and pause</td></tr>
    <tr><td>Lists and headers</td><td>Faster — easier to scan</td></tr>
    <tr><td>Images</td><td>Some tools add 10–12 seconds per image</td></tr>
    <tr><td>Code blocks</td><td>Usually excluded or counted separately</td></tr>
    <tr><td>Audience expertise</td><td>Expert readers are faster; novices slower</td></tr>
  </tbody>
</table>

<h2>Why showing reading time reduces bounce rate</h2>

<p>Displaying reading time sets expectations. A reader who sees "12 min read" can decide if they want to commit now or come back later. Without it, they start reading, hit the length at paragraph 3, and leave — registering as a bounce in your analytics. Showing the time upfront lets engaged readers self-select in, and disengaged readers self-select out — which is actually better for both you and them.</p>

<h2>When the estimate is misleading</h2>

<p>Pure word count misses a lot. A post with 12 code samples might have 2,000 words but take 20 minutes to read because you need to understand and execute each snippet. A 1,500-word narrative article takes closer to 6 minutes.</p>

<p>Some tools handle this by detecting code blocks and adding extra time per block. If you're writing developer content heavily, this matters.</p>

<h2>Practical benchmarks</h2>

<ul>
  <li><strong>Blog post sweet spot</strong>: 1,500–2,500 words (6–10 min read) — long enough for SEO, short enough to complete</li>
  <li><strong>Newsletter</strong>: 300–800 words (1–3 min read) — readers skim in email</li>
  <li><strong>Long-form / pillar page</strong>: 3,000–6,000 words (12–25 min read) — strong for competitive keywords</li>
  <li><strong>Product documentation</strong>: No maximum — completeness matters more than time</li>
</ul>

<p>Check your word count and reading time at <a href="/tools">Toolora → Text → Word Counter</a>. Paste your content and get an instant breakdown.</p>
    `.trim(),
  },

  {
    slug: "split-pdf-free-browser-based",
    title: "How to Split a PDF Without Adobe Acrobat (Free, Works in Your Browser)",
    description: "Extract specific pages from a PDF, split by range, or separate every page — without installing software or uploading to a server.",
    date: "2026-04-07",
    readTime: "4 min read",
    category: "Privacy",
    keywords: ["split pdf online free", "pdf splitter", "extract pages from pdf", "pdf page extractor"],
    content: `
<p>You have a 40-page report. You need to send pages 12–18 to a client. Adobe Acrobat wants $15/month. Smallpdf wants your file on their server. Here's what to do instead.</p>

<h2>What "splitting a PDF" actually means</h2>

<p>PDF splitting covers a few different operations:</p>

<ul>
  <li><strong>Extract a page range</strong> — pages 5 to 12 → new PDF</li>
  <li><strong>Split at a specific point</strong> — first 10 pages → PDF A, remaining pages → PDF B</li>
  <li><strong>Burst to individual pages</strong> — every page becomes its own PDF file</li>
  <li><strong>Extract specific pages</strong> — pages 1, 4, 7, 15 → one new PDF</li>
</ul>

<p>Most browser-based tools support all of these. Some only support simple range extraction.</p>

<h2>Privacy: what's at stake when you upload a PDF</h2>

<p>A PDF going through a free online splitter might contain:</p>

<ul>
  <li>Client contracts with PII</li>
  <li>Financial statements</li>
  <li>Internal company documents</li>
  <li>Medical records</li>
</ul>

<p>Most free PDF tools process server-side. The file is uploaded, processed, and you download the result. GDPR and HIPAA have things to say about transmitting files containing personal data to third-party processors — even briefly.</p>

<h2>Free methods that don't upload your file</h2>

<p><strong>Browser-based PDF tools (WebAssembly)</strong> — Tools using pdf-lib or PDF.js compiled to WASM can split your PDF entirely in the browser. No upload. Verifiable in DevTools → Network.</p>

<p><strong>Google Chrome print to PDF</strong> — Open your PDF in Chrome, hit Print, select "Save as PDF," and under "Pages" enter a custom range like "5-12." Slow for multiple operations but requires nothing additional.</p>

<p><strong>macOS Preview</strong> — Drag pages from the sidebar into a new window, then export as PDF. Works natively, nothing leaves your machine.</p>

<p><strong>PDF24 (offline app)</strong> — Free, open-source, runs locally. Good option if you need to do this repeatedly and want a proper UI.</p>

<h2>File size after splitting</h2>

<p>A split PDF won't be proportionally smaller than the original. PDFs embed shared resources (fonts, color profiles) in each file. A 10-page extract from a 100-page PDF might still be 40% of the original size rather than 10%, because the font data and color profiles get duplicated into the new file.</p>

<p>If file size matters after splitting, run the split PDF through a compressor as a second step.</p>

<p>Split PDFs in the browser at <a href="/tools">Toolora → Documents → PDF Split</a>. Your document stays on your device.</p>
    `.trim(),
  },

  {
    slug: "markdown-to-html-converter-guide",
    title: "Markdown to HTML: Convert and Preview Markdown Instantly",
    description: "Paste Markdown and get clean HTML output. Everything you need to know about the conversion, supported syntax, and when to use it.",
    date: "2026-04-08",
    readTime: "5 min read",
    category: "Developer Tools",
    keywords: ["markdown to html", "markdown converter online", "markdown preview", "convert markdown to html"],
    content: `
<p>Markdown is for writing. HTML is for displaying. Converting between them is a constant task for developers, writers, and content teams. Here's how it works and the fastest way to do it.</p>

<h2>How Markdown-to-HTML conversion works</h2>

<p>A Markdown parser reads your text and converts syntax patterns to HTML tags. The most widely used spec is CommonMark, which standardized the behavior across previously inconsistent parsers (Marked, Pandoc, Showdown, etc. all interpreted edge cases differently).</p>

<p>Most tools today support CommonMark + GitHub Flavored Markdown (GFM), which adds tables, strikethrough, task lists, and fenced code blocks with language hints.</p>

<h2>Standard Markdown → HTML mapping</h2>

<table>
  <thead>
    <tr><th>Markdown</th><th>HTML output</th></tr>
  </thead>
  <tbody>
    <tr><td><code># Heading</code></td><td><code>&lt;h1&gt;Heading&lt;/h1&gt;</code></td></tr>
    <tr><td><code>**bold**</code></td><td><code>&lt;strong&gt;bold&lt;/strong&gt;</code></td></tr>
    <tr><td><code>*italic*</code></td><td><code>&lt;em&gt;italic&lt;/em&gt;</code></td></tr>
    <tr><td><code>[text](url)</code></td><td><code>&lt;a href="url"&gt;text&lt;/a&gt;</code></td></tr>
    <tr><td><code>![alt](src)</code></td><td><code>&lt;img alt="alt" src="src"&gt;</code></td></tr>
    <tr><td><code>\`code\`</code></td><td><code>&lt;code&gt;code&lt;/code&gt;</code></td></tr>
    <tr><td><code>---</code></td><td><code>&lt;hr&gt;</code></td></tr>
    <tr><td><code>&gt; blockquote</code></td><td><code>&lt;blockquote&gt;</code></td></tr>
  </tbody>
</table>

<h2>GFM extensions (GitHub Flavored Markdown)</h2>

<ul>
  <li><strong>Tables</strong> — pipe syntax creates <code>&lt;table&gt;</code> elements</li>
  <li><strong>Fenced code blocks</strong> — triple backticks with language hints: <code>&#96;&#96;&#96;javascript</code></li>
  <li><strong>Task lists</strong> — <code>- [x] done</code> becomes a checked checkbox</li>
  <li><strong>Strikethrough</strong> — <code>~~text~~</code> becomes <code>&lt;del&gt;text&lt;/del&gt;</code></li>
  <li><strong>Autolinks</strong> — bare URLs become clickable links</li>
</ul>

<h2>Common use cases</h2>

<p><strong>Blog/CMS content</strong> — You write in Markdown, your CMS stores HTML. Converting lets you preview exactly what will render.</p>

<p><strong>Emails</strong> — Most email clients don't render Markdown. Convert to HTML first, then paste into your email editor's code view.</p>

<p><strong>API documentation</strong> — README files on GitHub render Markdown, but some API docs platforms need HTML. Convert then paste.</p>

<p><strong>Slide decks</strong> — Tools like Reveal.js accept HTML sections. Write in Markdown, convert, structure into slides.</p>

<h2>Watch out for: sanitization</h2>

<p>Raw Markdown-to-HTML conversion doesn't sanitize the output. If you're rendering user-supplied Markdown on a web page, you need to sanitize the HTML output with a library like DOMPurify — otherwise you're vulnerable to XSS attacks through malicious Markdown like <code>[text](javascript:alert(1))</code>.</p>

<p>This matters if you're building something where users submit Markdown that renders to other users. It doesn't matter if you're converting your own Markdown for your own content.</p>

<p>Convert Markdown to HTML instantly at <a href="/tools">Toolora → Developer → Markdown to HTML</a>. Live preview, copy output in one click.</p>
    `.trim(),
  },

  {
    slug: "text-case-converter-guide",
    title: "Text Case Converter: Title Case, UPPERCASE, camelCase, snake_case in One Click",
    description: "Change text case instantly online — every format covered, including the tricky ones like Title Case, PascalCase, and kebab-case.",
    date: "2026-04-08",
    readTime: "4 min read",
    category: "Tools",
    keywords: ["text case converter", "title case online", "camelcase converter", "snake case converter", "uppercase lowercase"],
    content: `
<p>Renaming a variable. Writing a headline. Formatting an API key. Each task demands a different case convention, and manually retyping things is the kind of work that shouldn't exist.</p>

<h2>The case formats explained</h2>

<table>
  <thead>
    <tr><th>Format</th><th>Example</th><th>Common use</th></tr>
  </thead>
  <tbody>
    <tr><td>UPPERCASE</td><td>HELLO WORLD</td><td>Constants, emphasis, env vars</td></tr>
    <tr><td>lowercase</td><td>hello world</td><td>URLs, email addresses, filenames</td></tr>
    <tr><td>Title Case</td><td>Hello World</td><td>Headlines, book titles, UI labels</td></tr>
    <tr><td>Sentence case</td><td>Hello world</td><td>Body copy, descriptions, subtitles</td></tr>
    <tr><td>camelCase</td><td>helloWorld</td><td>JavaScript variables and functions</td></tr>
    <tr><td>PascalCase</td><td>HelloWorld</td><td>Class names, React components</td></tr>
    <tr><td>snake_case</td><td>hello_world</td><td>Python, Ruby, database columns</td></tr>
    <tr><td>SCREAMING_SNAKE</td><td>HELLO_WORLD</td><td>Constants in Python, environment variables</td></tr>
    <tr><td>kebab-case</td><td>hello-world</td><td>CSS classes, URLs, HTML attributes</td></tr>
    <tr><td>dot.case</td><td>hello.world</td><td>Config file keys, namespace paths</td></tr>
  </tbody>
</table>

<h2>Title Case: the rules are more complicated than you think</h2>

<p>Simple Title Case capitalizes every word. But proper Title Case (AP style, Chicago style) doesn't capitalize short prepositions, articles, and conjunctions unless they're the first or last word:</p>

<ul>
  <li><strong>Capitalize</strong>: nouns, verbs, adjectives, adverbs, pronouns, first word, last word</li>
  <li><strong>Don't capitalize</strong>: a, an, the, and, but, or, for, nor, as, at, by, for, in, of, on, to, up, yet</li>
</ul>

<p>So "The Quick Brown Fox Jumps Over the Lazy Dog" is correct AP Title Case. "The Quick Brown Fox Jumps Over The Lazy Dog" is wrong (The isn't capitalized mid-title).</p>

<p>Most online converters do simple word-capitalization. The better ones follow AP/Chicago rules. Check which one you're using before applying it to anything editorial.</p>

<h2>Converting code identifiers</h2>

<p>Moving between camelCase and snake_case comes up constantly when:</p>
<ul>
  <li>Bridging JavaScript (camelCase) and Python (snake_case) in an API</li>
  <li>Converting a database column name (<code>user_created_at</code>) to a JavaScript property (<code>userCreatedAt</code>)</li>
  <li>Renaming CSS classes to component props</li>
</ul>

<p>The logic: split on spaces, underscores, hyphens, and camelCase boundaries → array of words → join with the target format's separator and capitalization rule.</p>

<h2>Sentence case vs. lowercase</h2>

<p>Sentence case capitalizes only the first letter of the first word (and proper nouns). Lowercase makes everything lowercase with no exceptions. They look similar but mean different things — sentence case preserves proper nouns, lowercase doesn't.</p>

<p>Convert text case instantly at <a href="/tools">Toolora → Text → Case Converter</a>. Every format, one click.</p>
    `.trim(),
  },

  {
    slug: "what-is-cors-explained",
    title: "What Is CORS? A Developer's Plain-English Guide",
    description: "CORS confuses every developer at least once. Here's what it actually is, why browsers enforce it, and how to fix CORS errors properly.",
    date: "2026-04-09",
    readTime: "6 min read",
    category: "Developer Tools",
    keywords: ["what is cors", "cors error", "cors explained", "access-control-allow-origin", "fix cors error"],
    content: `
<p>You're building a frontend. You make a fetch request. The console shows: <code>Access to fetch at 'https://api.example.com' from origin 'http://localhost:3000' has been blocked by CORS policy</code>. Welcome to everyone's first encounter with CORS.</p>

<h2>What CORS is protecting against</h2>

<p>CORS exists because of the Same-Origin Policy — a browser security rule that prevents a web page from making requests to a different domain than the one that served it.</p>

<p>The reason this rule exists: if you're logged into your bank at <code>bank.com</code>, and you visit a malicious site at <code>evil.com</code>, the malicious site's JavaScript shouldn't be able to make requests to <code>bank.com/transfer</code> using your browser's stored session cookie.</p>

<p>Without Same-Origin Policy, every site you visit could silently act as you on every other site you're logged into.</p>

<h2>What CORS actually is</h2>

<p>CORS (Cross-Origin Resource Sharing) is the mechanism that lets servers <em>opt in</em> to allowing requests from other origins. It's not a restriction — it's a controlled relaxation of the Same-Origin Policy.</p>

<p>When your browser makes a cross-origin request, it checks the response headers from the server. If the server includes <code>Access-Control-Allow-Origin: *</code> (or a specific origin), the browser allows your JavaScript to see the response. If not, the browser blocks it — even though the request went through.</p>

<p>The request happens. CORS just controls whether your JavaScript code gets to see the response.</p>

<h2>Simple vs. preflighted requests</h2>

<p><strong>Simple requests</strong> (GET, POST with standard content types) go directly to the server. The browser checks the response headers and decides whether to let your code see the result.</p>

<p><strong>Preflighted requests</strong> — for methods like PUT, DELETE, or requests with custom headers — first send an OPTIONS request to check permissions. If the server approves (via <code>Access-Control-Allow-Methods</code> and <code>Access-Control-Allow-Headers</code>), the real request follows.</p>

<h2>The CORS headers</h2>

<table>
  <thead>
    <tr><th>Header</th><th>What it does</th></tr>
  </thead>
  <tbody>
    <tr><td><code>Access-Control-Allow-Origin</code></td><td>Which origins can read the response (<code>*</code> = all)</td></tr>
    <tr><td><code>Access-Control-Allow-Methods</code></td><td>Which HTTP methods are allowed</td></tr>
    <tr><td><code>Access-Control-Allow-Headers</code></td><td>Which request headers are allowed</td></tr>
    <tr><td><code>Access-Control-Allow-Credentials</code></td><td>Whether cookies can be included (<code>true</code>/<code>false</code>)</td></tr>
    <tr><td><code>Access-Control-Max-Age</code></td><td>How long to cache preflight results (seconds)</td></tr>
  </tbody>
</table>

<h2>How to fix a CORS error</h2>

<p>The fix is always on the <strong>server</strong>, not the client. Your frontend cannot fix CORS errors — only the server sending the correct response headers can.</p>

<ul>
  <li><strong>Express.js</strong>: Use the <code>cors</code> package. <code>app.use(cors())</code> allows all origins. Pass an options object to restrict.</li>
  <li><strong>FastAPI</strong>: Use <code>CORSMiddleware</code>.</li>
  <li><strong>nginx</strong>: Add <code>add_header 'Access-Control-Allow-Origin' '*';</code> to your location block.</li>
  <li><strong>In development</strong>: Proxy requests through your dev server (Vite's <code>server.proxy</code> config).</li>
</ul>

<h2>When not to use <code>Access-Control-Allow-Origin: *</code></h2>

<p>The wildcard origin (<code>*</code>) cannot be combined with <code>Access-Control-Allow-Credentials: true</code>. If you need to allow cookies or authentication headers in cross-origin requests, you must specify the exact origin(s) rather than using <code>*</code>.</p>

<p>For public APIs that don't use cookies, <code>*</code> is fine. For APIs that use session cookies or Authorization headers, explicitly list the allowed origins.</p>
    `.trim(),
  },

  {
    slug: "csv-to-json-convert-online",
    title: "CSV to JSON: Convert Spreadsheet Data Instantly (Free)",
    description: "Paste CSV data and get structured JSON — arrays, objects, custom keys. Everything you need to know about the conversion.",
    date: "2026-04-09",
    readTime: "4 min read",
    category: "Developer Tools",
    keywords: ["csv to json", "convert csv to json online", "csv converter", "parse csv javascript", "json array from csv"],
    content: `
<p>You have data in a spreadsheet. You need it in JSON. This happens constantly — exporting from CRMs, transforming analytics exports, feeding data to APIs.</p>

<h2>What CSV-to-JSON conversion produces</h2>

<p>Standard CSV-to-JSON gives you an array of objects, where each row becomes an object and each column header becomes a key:</p>

<pre><code>name,age,city
Alice,30,London
Bob,25,Paris</code></pre>

<p>Becomes:</p>

<pre><code>[
  { "name": "Alice", "age": "30", "city": "London" },
  { "name": "Bob", "age": "25", "city": "Paris" }
]</code></pre>

<h2>Type inference: the important catch</h2>

<p>Notice that <code>age</code> is <code>"30"</code> (a string), not <code>30</code> (a number). CSV has no type information — everything is a string. A converter that doesn't do type inference will give you all strings.</p>

<p>Converters with type inference try to detect numbers, booleans, and nulls automatically. <code>"30"</code> becomes <code>30</code>, <code>"true"</code> becomes <code>true</code>, <code>""</code> becomes <code>null</code>. This is usually what you want, but it can cause issues if you have numeric strings that should stay as strings (e.g., ZIP codes like <code>"08002"</code> that would become <code>8002</code>).</p>

<h2>Other output formats</h2>

<table>
  <thead>
    <tr><th>Format</th><th>Use case</th></tr>
  </thead>
  <tbody>
    <tr><td>Array of arrays</td><td>When you want raw rows, no key names — faster for large data processing</td></tr>
    <tr><td>Keyed by first column</td><td>Dictionary lookup — <code>{ "Alice": { age: 30, city: "London" } }</code></td></tr>
    <tr><td>NDJSON (newline-delimited)</td><td>Streaming pipelines — each row on its own line, not wrapped in an array</td></tr>
    <tr><td>Flat list of values</td><td>Single-column CSV → plain JSON array of strings</td></tr>
  </tbody>
</table>

<h2>Handling edge cases in CSV</h2>

<p><strong>Quoted fields</strong> — Values containing commas must be wrapped in double quotes: <code>"Smith, John"</code>. A proper parser handles this. A naive split-on-commas approach breaks.</p>

<p><strong>Multiline fields</strong> — Values can contain newlines if they're quoted. <code>"First line\nSecond line"</code> is valid CSV.</p>

<p><strong>Different delimiters</strong> — TSV uses tabs. European CSV often uses semicolons (because commas are decimal separators). Check what delimiter your export actually uses before parsing.</p>

<p><strong>BOM character</strong> — Excel-exported CSVs often start with a UTF-8 BOM (<code>\uFEFF</code>). This makes the first column key look like <code>"\uFEFFname"</code> instead of <code>"name"</code>. A good parser strips this automatically.</p>

<h2>Reverse: JSON to CSV</h2>

<p>Flattening JSON to CSV is harder because JSON is hierarchical and CSV is flat. Nested objects need a decision: flatten to dot notation (<code>address.city</code>), stringify to JSON string, or reject non-flat input. Most converters stringify nested values.</p>

<p>Convert CSV to JSON (and back) at <a href="/tools">Toolora → Developer → CSV to JSON</a>. Handles headers, type inference, and custom delimiters.</p>
    `.trim(),
  },

  {
    slug: "http-status-codes-developer-guide",
    title: "HTTP Status Codes Every Developer Should Actually Know",
    description: "The status codes you encounter every day — what they mean, when to use them, and the common mistakes developers make.",
    date: "2026-04-10",
    readTime: "6 min read",
    category: "Developer Tools",
    keywords: ["http status codes", "rest api status codes", "404 vs 410", "http 429", "http 200 vs 201"],
    content: `
<p>There are 60+ defined HTTP status codes. You need to deeply understand about 15 of them. Here's the practical guide — not the spec dump.</p>

<h2>The categories</h2>

<ul>
  <li><strong>2xx</strong> — Success</li>
  <li><strong>3xx</strong> — Redirect</li>
  <li><strong>4xx</strong> — Client error (your request was wrong)</li>
  <li><strong>5xx</strong> — Server error (the server failed)</li>
</ul>

<h2>The ones that actually matter</h2>

<table>
  <thead>
    <tr><th>Code</th><th>Name</th><th>When to use it</th></tr>
  </thead>
  <tbody>
    <tr><td>200</td><td>OK</td><td>Request succeeded, response body has the result</td></tr>
    <tr><td>201</td><td>Created</td><td>POST created a new resource — include Location header pointing to it</td></tr>
    <tr><td>204</td><td>No Content</td><td>Success, nothing to return — DELETE, or PUT that returns nothing</td></tr>
    <tr><td>301</td><td>Moved Permanently</td><td>URL has moved forever — browsers and search engines update their records</td></tr>
    <tr><td>302</td><td>Found (Temporary Redirect)</td><td>Temporary redirect — search engines keep the original URL</td></tr>
    <tr><td>304</td><td>Not Modified</td><td>Cached version is still valid — browser can use its cache</td></tr>
    <tr><td>400</td><td>Bad Request</td><td>Malformed request — missing field, invalid format, validation failure</td></tr>
    <tr><td>401</td><td>Unauthorized</td><td>No credentials / credentials not provided (confusingly named — it means unauthenticated)</td></tr>
    <tr><td>403</td><td>Forbidden</td><td>Credentials are valid but you don't have permission</td></tr>
    <tr><td>404</td><td>Not Found</td><td>Resource doesn't exist</td></tr>
    <tr><td>409</td><td>Conflict</td><td>Request conflicts with current state — duplicate email, version mismatch</td></tr>
    <tr><td>410</td><td>Gone</td><td>Resource permanently deleted — unlike 404, this tells search engines to deindex it</td></tr>
    <tr><td>422</td><td>Unprocessable Entity</td><td>Syntactically valid but semantically invalid — good for form validation errors</td></tr>
    <tr><td>429</td><td>Too Many Requests</td><td>Rate limit exceeded — include Retry-After header</td></tr>
    <tr><td>500</td><td>Internal Server Error</td><td>Unhandled server exception — don't leak error details in the body</td></tr>
    <tr><td>502</td><td>Bad Gateway</td><td>Proxy received an invalid response from upstream</td></tr>
    <tr><td>503</td><td>Service Unavailable</td><td>Server down for maintenance or overloaded — include Retry-After</td></tr>
  </tbody>
</table>

<h2>Common mistakes</h2>

<p><strong>Returning 200 for errors</strong> — APIs that return <code>{ "status": "error", "message": "..." }</code> with a 200 status code break every standard HTTP client, logging system, and monitoring tool that checks status codes. Return the appropriate 4xx or 5xx.</p>

<p><strong>401 vs 403</strong> — 401 means "you haven't told me who you are." 403 means "I know who you are and you can't do this." A missing Authorization header is 401. A valid token for a user without admin access is 403.</p>

<p><strong>404 vs 410</strong> — Use 410 when content has been permanently removed and you want search engines to deindex it. 404 tells crawlers to try again later.</p>

<p><strong>200 vs 201 for POST</strong> — When a POST creates a resource, return 201 with a Location header pointing to the new resource. 200 works but loses the semantic signal.</p>

<p><strong>Missing Retry-After on 429</strong> — If you return 429 without a Retry-After header, clients have no idea how long to wait. Include it: <code>Retry-After: 60</code> (seconds) or <code>Retry-After: Wed, 09 Apr 2026 10:00:00 GMT</code>.</p>

<h2>Idempotency and status codes</h2>

<p>GET, HEAD, PUT, and DELETE should be idempotent — calling them multiple times produces the same result. PUT to create-or-update an existing resource returns 200 (updated) or 201 (created). DELETE on an already-deleted resource should return 204 or 404, not 500.</p>
    `.trim(),
  },

  {
    slug: "localstorage-vs-sessionstorage-vs-cookies",
    title: "localStorage vs sessionStorage vs Cookies: A Developer's Guide",
    description: "Three ways to store data in the browser — when to use each, storage limits, and the privacy implications of each.",
    date: "2026-04-10",
    readTime: "5 min read",
    category: "Developer Tools",
    keywords: ["localstorage vs sessionstorage", "cookies vs localstorage", "web storage api", "browser storage", "indexeddb"],
    content: `
<p>Browser storage is one of those topics where everyone knows the surface level but the details matter for security, performance, and user experience. Here's the full picture.</p>

<h2>Quick comparison</h2>

<table>
  <thead>
    <tr><th>Property</th><th>localStorage</th><th>sessionStorage</th><th>Cookies</th></tr>
  </thead>
  <tbody>
    <tr><td>Capacity</td><td>5–10MB per origin</td><td>5–10MB per origin</td><td>4KB per cookie</td></tr>
    <tr><td>Lifetime</td><td>Until explicitly cleared</td><td>Until tab/browser closes</td><td>Session or set expiry</td></tr>
    <tr><td>Sent with requests</td><td>No</td><td>No</td><td>Yes (automatically)</td></tr>
    <tr><td>Accessible from JS</td><td>Yes</td><td>Yes</td><td>Yes (unless HttpOnly)</td></tr>
    <tr><td>Accessible from server</td><td>No</td><td>No</td><td>Yes (via HTTP headers)</td></tr>
    <tr><td>Shared across tabs</td><td>Yes (same origin)</td><td>No</td><td>Yes</td></tr>
    <tr><td>Works offline</td><td>Yes</td><td>Yes</td><td>Depends</td></tr>
  </tbody>
</table>

<h2>When to use each</h2>

<p><strong>localStorage</strong> — User preferences that should persist across sessions: theme (dark/light), language preference, UI state like collapsed sidebars. Not for sensitive data — it has no expiry and any JavaScript on the page can read it.</p>

<p><strong>sessionStorage</strong> — Data that should die with the tab: multi-step form state, shopping cart for unauthenticated users, temporary UI state. Cleared automatically when the tab closes.</p>

<p><strong>Cookies</strong> — Authentication sessions. This is the only right place for session tokens and auth data, because cookies can be:</p>
<ul>
  <li><code>HttpOnly</code> — invisible to JavaScript, blocking XSS attacks from stealing tokens</li>
  <li><code>Secure</code> — only sent over HTTPS</li>
  <li><code>SameSite=Strict</code> or <code>SameSite=Lax</code> — protecting against CSRF</li>
</ul>

<h2>The security mistake: storing tokens in localStorage</h2>

<p>Many tutorials and starter kits store JWT access tokens in localStorage. This is a mistake. Any injected JavaScript on your page — from a compromised npm package, an XSS vulnerability, a browser extension — can read <code>localStorage.getItem('token')</code> and steal the token.</p>

<p>Auth tokens belong in <code>HttpOnly</code> cookies. The server sets them, the browser sends them automatically, and JavaScript can never read them.</p>

<h2>IndexedDB: the other option</h2>

<p>For larger amounts of structured data — offline-first apps, caching large datasets, storing files — IndexedDB is the right choice. It's a full transactional database in the browser with no size limit (quota varies by browser, typically 50–80% of available disk space). The API is async and more complex than Web Storage, but libraries like Dexie.js make it manageable.</p>

<h2>Storage limits in practice</h2>

<p>The 5–10MB limit for localStorage is per origin. Running up against it is rare for typical use. When you hit the limit, <code>setItem()</code> throws a <code>QuotaExceededError</code> — which most code doesn't catch, causing silent failures. If you're storing anything large, wrap your writes in try/catch.</p>

<p>For truly large data: use the Cache API (part of Service Workers) or IndexedDB.</p>
    `.trim(),
  },

  {
    slug: "keyword-density-seo-guide",
    title: "Keyword Density: What It Is, What It Should Be, and How to Check Yours",
    description: "Keyword stuffing kills rankings. Too sparse and you're invisible. Here's the sweet spot and how to check your density instantly.",
    date: "2026-04-11",
    readTime: "4 min read",
    category: "Productivity",
    keywords: ["keyword density", "keyword density checker", "keyword stuffing", "seo keyword frequency", "optimal keyword density"],
    content: `
<p>Keyword density is the percentage of times your target keyword appears in your content relative to the total word count. It sounds like a precise metric — and SEOs treated it as one for years. The reality is more nuanced.</p>

<h2>The formula</h2>

<p>Keyword density = (keyword occurrences ÷ total words) × 100</p>

<p>Example: your target keyword appears 12 times in a 1,000-word article → 1.2% density.</p>

<h2>What density actually matters</h2>

<p>Google has repeatedly said keyword density is not a ranking factor in any direct sense. What matters is whether the content comprehensively covers the topic. That said, keyword density is a useful proxy for something real: if your density is 0.1%, you're probably not writing about the topic enough. If it's 5%+, you're probably stuffing.</p>

<p>The practical guideline used by most SEOs: 0.5–2% for the primary keyword, with natural variation rather than exact repetition. Use semantic variations, synonyms, and related terms — not just the same phrase repeated mechanically.</p>

<h2>TF-IDF: the more sophisticated version</h2>

<p>Modern search engines use TF-IDF (Term Frequency-Inverse Document Frequency) rather than raw keyword density. TF-IDF measures how significant a term is in a document relative to how common it is across all documents on the web. A term that appears 10 times in your article but appears on every web page has low TF-IDF significance. A term that appears 10 times in your article but is rare across the web has high significance.</p>

<p>This is why writing about uncommon, specific terms matters more than keyword density alone.</p>

<h2>What keyword stuffing looks like vs. natural writing</h2>

<p><strong>Stuffed</strong>: "Our keyword density checker checks your keyword density. Use our keyword density tool to check keyword density for your keyword density needs."</p>

<p><strong>Natural</strong>: "Our text analysis tool measures how frequently your target term appears relative to your total word count — giving you a clear signal if you've over- or under-indexed on the topic."</p>

<p>Both cover the same topic. The stuffed version would be flagged by modern parsers. The natural version reads normally and uses semantic variation.</p>

<h2>How to check your density</h2>

<ol>
  <li>Paste your content into a word counter tool</li>
  <li>Note the total word count</li>
  <li>Use Find (Ctrl+F) to count your keyword occurrences</li>
  <li>Divide occurrences by total words and multiply by 100</li>
</ol>

<p>Or: paste your text into <a href="/tools">Toolora → Text → Word Counter</a> which shows total word count instantly. Then count your keyword hits manually or use the browser's Find feature.</p>

<h2>LSI keywords: don't just repeat the same phrase</h2>

<p>Latent Semantic Indexing (LSI) keywords are terms that naturally co-occur with your main keyword. For "keyword density," LSI terms include: keyword stuffing, TF-IDF, keyword frequency, content optimization, search engine ranking. Including these signals topical depth, not just keyword repetition.</p>
    `.trim(),
  },

  {
    slug: "install-mcp-server-claude-desktop",
    title: "How to Install an MCP Server in Claude Desktop: Step-by-Step Guide",
    description: "A complete beginner's guide to adding MCP servers to Claude Desktop — covering the config file, common errors, and how to verify it worked.",
    date: "2026-04-11",
    readTime: "5 min read",
    category: "AI Builders",
    keywords: ["install mcp server claude desktop", "claude mcp config", "mcp tutorial", "claude desktop mcp setup", "add mcp server"],
    content: `
<p>MCP (Model Context Protocol) lets Claude use external tools — file access, web browsing, APIs, databases. Setting it up takes about 5 minutes once you know where the config file lives.</p>

<h2>What you need before starting</h2>

<ul>
  <li>Claude Desktop installed (download from claude.ai)</li>
  <li>The MCP server's endpoint URL or local command</li>
  <li>A text editor (VS Code, Notepad, anything)</li>
</ul>

<h2>Where the config file is</h2>

<table>
  <thead>
    <tr><th>OS</th><th>Config file location</th></tr>
  </thead>
  <tbody>
    <tr><td>macOS</td><td><code>~/Library/Application Support/Claude/claude_desktop_config.json</code></td></tr>
    <tr><td>Windows</td><td><code>%APPDATA%\Claude\claude_desktop_config.json</code></td></tr>
    <tr><td>Linux</td><td><code>~/.config/Claude/claude_desktop_config.json</code></td></tr>
  </tbody>
</table>

<h2>The config format</h2>

<p>The config file is JSON. The <code>mcpServers</code> key holds all your servers, each with a name you choose and either a <code>command</code> (for local servers) or <code>url</code> (for hosted servers):</p>

<pre><code>{
  "mcpServers": {
    "toolora": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://toolora.dev/api/mcp"]
    }
  }
}</code></pre>

<p>For servers that communicate over HTTP/SSE (hosted servers like Toolora), you pass the URL to <code>mcp-remote</code>, which handles the bridge. For local servers that run as a process, you'd specify the command directly.</p>

<h2>Adding Toolora's MCP server</h2>

<ol>
  <li>Open the config file in a text editor. If it doesn't exist yet, create it at the path above.</li>
  <li>Add the <code>mcpServers</code> block with the Toolora entry shown above.</li>
  <li>Save the file.</li>
  <li>Quit Claude Desktop completely (not just close the window — right-click the tray icon and quit).</li>
  <li>Reopen Claude Desktop.</li>
  <li>In any conversation, click the hammer icon (🔨) near the message input. You should see Toolora's tools listed.</li>
</ol>

<h2>Common errors and fixes</h2>

<table>
  <thead>
    <tr><th>Error</th><th>Cause</th><th>Fix</th></tr>
  </thead>
  <tbody>
    <tr><td>Tools don't appear</td><td>Config file not saved, or Claude not fully restarted</td><td>Quit fully (not just close window) and reopen</td></tr>
    <tr><td>"Failed to connect to MCP server"</td><td>Wrong URL or server is down</td><td>Test the URL in your browser — <code>/api/mcp</code> should respond to POST requests</td></tr>
    <tr><td>JSON parse error</td><td>Syntax error in config file</td><td>Validate your JSON at a JSON formatter — trailing commas and missing quotes are the usual culprits</td></tr>
    <tr><td>npx not found</td><td>Node.js not installed</td><td>Install Node.js from nodejs.org and retry</td></tr>
  </tbody>
</table>

<h2>Verifying it worked</h2>

<p>Ask Claude: "What tools do you have available?" It should list the MCP tools. Then test one: "Count the words in this text: [paste some text]" — if it calls the <code>count_words</code> tool and returns a result, everything is working.</p>

<p>Explore all available MCP servers and the combined Toolora + Soliris config at <a href="/mcp-hub">toolora.dev/mcp-hub</a>.</p>
    `.trim(),
  },

  {
    slug: "words-per-page-reference",
    title: "How Many Words Per Page? A Quick Reference for Writers",
    description: "Word-to-page counts at different fonts, spacings, and formats. Stop guessing how long your content is.",
    date: "2026-04-12",
    readTime: "3 min read",
    category: "Tools",
    keywords: ["how many words per page", "words per page double spaced", "500 words how many pages", "college essay word count", "word count per page"],
    content: `
<p>Word count doesn't translate to pages consistently — it depends on font size, spacing, margins, and whether you're in a word processor or on a web page. Here are the real numbers.</p>

<h2>Standard word processor (12pt, double-spaced)</h2>

<table>
  <thead>
    <tr><th>Words</th><th>Pages (approx.)</th></tr>
  </thead>
  <tbody>
    <tr><td>250</td><td>0.5 pages</td></tr>
    <tr><td>500</td><td>1 page</td></tr>
    <tr><td>750</td><td>1.5 pages</td></tr>
    <tr><td>1,000</td><td>2 pages</td></tr>
    <tr><td>1,500</td><td>3 pages</td></tr>
    <tr><td>2,000</td><td>4 pages</td></tr>
    <tr><td>2,500</td><td>5 pages</td></tr>
    <tr><td>5,000</td><td>10 pages</td></tr>
  </tbody>
</table>

<h2>Single-spaced (12pt)</h2>

<table>
  <thead>
    <tr><th>Words</th><th>Pages (approx.)</th></tr>
  </thead>
  <tbody>
    <tr><td>500</td><td>1 page</td></tr>
    <tr><td>1,000</td><td>2 pages</td></tr>
    <tr><td>2,000</td><td>4 pages</td></tr>
    <tr><td>5,000</td><td>10 pages</td></tr>
  </tbody>
</table>

<p>Wait — single-spaced also gives 1 page per 500 words? Yes, because 12pt double-spaced and single-spaced produce approximately the same word-per-page count. The spacing doubles the line height but the font size stays constant, so roughly the same number of words fit per physical line — just the vertical space between lines changes. The actual difference is subtle and varies by font.</p>

<h2>Common essay lengths</h2>

<table>
  <thead>
    <tr><th>Assignment</th><th>Typical word count</th><th>Pages (double-spaced)</th></tr>
  </thead>
  <tbody>
    <tr><td>Short answer</td><td>250–500 words</td><td>0.5–1 page</td></tr>
    <tr><td>1-page essay</td><td>250–500 words</td><td>1 page</td></tr>
    <tr><td>5-page paper</td><td>1,250–1,500 words</td><td>5 pages</td></tr>
    <tr><td>10-page paper</td><td>2,500–3,000 words</td><td>10 pages</td></tr>
    <tr><td>Senior thesis</td><td>8,000–15,000 words</td><td>30–60 pages</td></tr>
    <tr><td>Common App essay</td><td>650 words max</td><td>~1.5 pages</td></tr>
  </tbody>
</table>

<h2>Web and digital content</h2>

<p>On a web page, none of the above applies. Web content has variable line length, responsive layouts, and font sizes that change based on screen size. A 1,000-word blog post might scroll through 10 screenfuls on mobile and 5 on desktop. The concept of "pages" doesn't translate.</p>

<p>For digital content, the useful metric isn't pages — it's reading time. A 1,000-word article takes about 4–5 minutes at average reading speed.</p>

<h2>Academic citation formats</h2>

<p>APA and MLA both default to 12pt Times New Roman, 1-inch margins, double spacing — giving roughly 250–275 words per page. Chicago style is similar. If your assignment specifies a format, use that format's defaults for the most accurate page estimate.</p>

<p>Count your words instantly at <a href="/tools">Toolora → Text → Word Counter</a>. Get word count, character count, reading time, and average sentence length in one paste.</p>
    `.trim(),
  },

  {
    slug: "what-is-webassembly-wasm-browser-privacy",
    title: "What Is WebAssembly? The Technology Making Browser Tools Actually Private",
    description: "WebAssembly lets browsers run near-native code. Here's what that means for privacy, performance, and why it matters for online tools.",
    date: "2026-04-12",
    readTime: "5 min read",
    category: "Developer Tools",
    keywords: ["what is webassembly", "wasm browser", "webassembly privacy", "wasm performance", "client side processing"],
    content: `
<p>Most browser tools work by sending your file to a server, processing it there, and returning the result. WebAssembly (WASM) changes that fundamentally — it enables the processing to happen inside your browser, at near-native speed, without a server involved at all.</p>

<h2>What WebAssembly actually is</h2>

<p>WebAssembly is a binary instruction format — a compilation target for languages like C, C++, Rust, and Go. Code written in those languages can be compiled to a <code>.wasm</code> file, which the browser's JavaScript engine executes directly.</p>

<p>The key properties:</p>
<ul>
  <li><strong>Near-native speed</strong> — runs at 80–90% of native binary performance in benchmarks</li>
  <li><strong>Sandboxed</strong> — runs in the same security sandbox as JavaScript, with no file system or network access by default</li>
  <li><strong>Language-agnostic</strong> — any language that compiles to WASM can run in the browser</li>
  <li><strong>Portable</strong> — same WASM binary runs on Windows, Mac, Linux, Android, iOS</li>
</ul>

<h2>What was impossible in the browser before WASM</h2>

<p>Before WebAssembly, JavaScript was the only execution option in the browser. JavaScript is fast for UI and business logic, but slow for:</p>
<ul>
  <li>Image processing (pixel-by-pixel operations)</li>
  <li>Video encoding and transcoding</li>
  <li>PDF rendering and manipulation</li>
  <li>OCR (character recognition on images)</li>
  <li>Audio processing and speech recognition</li>
  <li>Cryptography at scale</li>
  <li>Scientific computing</li>
</ul>

<p>All of these required a server round-trip. Now they can run in your browser tab.</p>

<h2>Real examples</h2>

<table>
  <thead>
    <tr><th>Tool</th><th>WASM library used</th><th>What it enables</th></tr>
  </thead>
  <tbody>
    <tr><td>Browser PDF compression</td><td>GhostScript / pdf-lib compiled to WASM</td><td>Compress PDFs without uploading them</td></tr>
    <tr><td>Browser OCR</td><td>Tesseract.js (Tesseract compiled to WASM)</td><td>Extract text from images locally</td></tr>
    <tr><td>Browser image compression</td><td>libvips, squoosh</td><td>JPEG/PNG/WebP optimization without upload</td></tr>
    <tr><td>Browser video trimming</td><td>FFmpeg compiled to WASM</td><td>Cut/encode video without a server</td></tr>
    <tr><td>Browser SQLite</td><td>sql.js</td><td>Run SQL queries on a local .db file</td></tr>
  </tbody>
</table>

<h2>The privacy implication</h2>

<p>If processing happens in WASM in your browser, your file never touches a server. There's nothing to log, nothing to store, no third-party privacy policy to trust, and no regulatory exposure for GDPR or HIPAA purposes (for the tool provider).</p>

<p>You can verify this: open DevTools → Network tab, use a WASM-based tool, and check for outbound file upload requests. If there aren't any, the processing is local.</p>

<h2>The tradeoffs</h2>

<p><strong>Initial load</strong> — WASM binaries for complex tools can be large (Tesseract with English language data is ~30MB). First use is slow; subsequent uses use cached binaries.</p>

<p><strong>Memory limits</strong> — Browser tabs have memory constraints. Very large files (multi-gigabyte video) still require server-side processing.</p>

<p><strong>Single-threaded (mostly)</strong> — WASM runs on the main thread by default. Complex processing can block the UI. The fix is Web Workers, which most well-built tools use to offload the WASM work.</p>

<p>All tools at <a href="/tools">toolora.dev/tools</a> are built on this approach — your files stay in your browser, verifiable with DevTools.</p>
    `.trim(),
  },

  {
    slug: "excel-to-json-converter",
    title: "Excel to JSON: Convert Spreadsheet Data Without Writing Code",
    description: "Turn .xlsx files into structured JSON arrays online — handles multiple sheets, headers, and type detection. Free, no upload.",
    date: "2026-04-13",
    readTime: "4 min read",
    category: "Developer Tools",
    keywords: ["excel to json", "xlsx to json", "convert excel to json online", "spreadsheet to json", "excel data to api"],
    content: `
<p>You have data in Excel. You need it in JSON to feed an API, import into a database, or process with code. You don't need to write a script for this — it can be done in the browser in seconds.</p>

<h2>What the output looks like</h2>

<p>Excel to JSON typically produces an array of objects, one per row, with the header row becoming object keys:</p>

<pre><code>[
  { "product": "Widget A", "price": 9.99, "stock": 42 },
  { "product": "Widget B", "price": 14.99, "stock": 8 }
]</code></pre>

<h2>Handling multiple sheets</h2>

<p>Excel files can have multiple sheets. A converter can handle this as:</p>
<ul>
  <li><strong>Single sheet selection</strong> — convert only the active or chosen sheet</li>
  <li><strong>All sheets as object</strong> — <code>{ "Sheet1": [...], "Sheet2": [...] }</code></li>
  <li><strong>All sheets merged</strong> — rows from all sheets concatenated into one array (risky if columns differ)</li>
</ul>

<h2>Type detection</h2>

<p>Excel cells have types: numbers, dates, strings, booleans, formulas. A good converter reads these native Excel types and produces correctly-typed JSON (numbers as numbers, not strings). Poor converters stringify everything.</p>

<p>Excel dates are stored internally as days since January 1, 1900. A converter needs to detect this and convert to ISO 8601 (<code>2026-04-13</code>) or Unix timestamp, depending on what you need.</p>

<h2>Common issues</h2>

<table>
  <thead>
    <tr><th>Issue</th><th>Cause</th><th>Solution</th></tr>
  </thead>
  <tbody>
    <tr><td>Numbers come out as strings</td><td>Converter not reading cell types</td><td>Use a converter that reads native xlsx types (SheetJS handles this well)</td></tr>
    <tr><td>Dates show as large numbers</td><td>Excel serial date not converted</td><td>Enable date conversion option if available</td></tr>
    <tr><td>Merged cells cause blank rows</td><td>Merged cells have value only in top-left</td><td>Unmerge cells in Excel before converting</td></tr>
    <tr><td>Formula cells show as blank</td><td>Formulas not evaluated — converters read stored values</td><td>In Excel: copy → paste special → values only, then convert</td></tr>
    <tr><td>Hidden rows included</td><td>Most converters include all rows, visible or not</td><td>Delete hidden rows in Excel before converting</td></tr>
  </tbody>
</table>

<h2>The library behind it</h2>

<p>Most browser-based Excel-to-JSON tools use <a href="https://sheetjs.com">SheetJS (xlsx)</a>, an open-source library that reads and writes Excel files in JavaScript. It works with .xlsx, .xls, .ods, and .csv files. It's compiled to WASM for browser use, so your file is processed locally.</p>

<h2>From JSON to API-ready format</h2>

<p>Once you have JSON, you often need to clean it up:</p>
<ul>
  <li>Rename keys to snake_case or camelCase to match your API schema</li>
  <li>Filter out columns you don't need</li>
  <li>Transform date formats</li>
  <li>Handle nulls (empty cells) consistently</li>
</ul>

<p>A quick array transform in JavaScript handles all of this. The hard part — getting the Excel data into JSON — is done.</p>

<p>Convert Excel to JSON at <a href="/tools">Toolora → Developer → Excel to JSON</a>. Drop in your .xlsx, get clean JSON out.</p>
    `.trim(),
  },

  {
    slug: "share-text-online-pastebin-alternatives",
    title: "How to Share Text Online Without Creating an Account",
    description: "Pastebin, GitHub Gist, and browser-based alternatives — when to use each, and how to share code or text instantly.",
    date: "2026-04-13",
    readTime: "4 min read",
    category: "Privacy",
    keywords: ["pastebin alternative", "share text online free", "code snippet sharing", "online clipboard", "create shareable text link"],
    content: `
<p>You need to share a block of text, a config file, or a code snippet with someone. Email is clunky, Slack wraps long code in weird ways, and you don't want to spin up a GitHub repo for 20 lines. Here are the best options.</p>

<h2>The quick comparison</h2>

<table>
  <thead>
    <tr><th>Tool</th><th>Account required</th><th>Expiry</th><th>Syntax highlighting</th><th>Privacy</th></tr>
  </thead>
  <tbody>
    <tr><td>Pastebin</td><td>No (anonymous)</td><td>Optional</td><td>Yes</td><td>Public by default</td></tr>
    <tr><td>GitHub Gist</td><td>Yes</td><td>Never (unless deleted)</td><td>Yes</td><td>Secret or public</td></tr>
    <tr><td>Hastebin</td><td>No</td><td>30 days inactive</td><td>Limited</td><td>Public</td></tr>
    <tr><td>paste.rs</td><td>No</td><td>Never</td><td>No</td><td>Public</td></tr>
    <tr><td>Toolora Paste</td><td>No</td><td>Configurable</td><td>No</td><td>Link-based access</td></tr>
  </tbody>
</table>

<h2>When to use each</h2>

<p><strong>GitHub Gist</strong> — Best for code you're comfortable making public or semi-public. Secret gists aren't indexed by Google but anyone with the link can see them. Great for sharing with a specific person.</p>

<p><strong>Pastebin</strong> — Quick and anonymous. Public pastes are indexed by search engines unless you mark them unlisted. If you're pasting sensitive content, use unlisted mode and set an expiry.</p>

<p><strong>Hastebin and paste.rs</strong> — Minimal, fast, no account. Good for very short-lived sharing where you don't care about the URL structure.</p>

<p><strong>Toolora Paste</strong> — Browser-based paste that generates a shareable link. No account needed. Good for text, configs, or log output. Accessible from the MCP server as the <code>create_shareable_paste</code> tool — so Claude or any AI agent can create pastes programmatically.</p>

<h2>What not to paste publicly</h2>

<ul>
  <li>API keys, access tokens, or secrets — even in "unlisted" mode</li>
  <li>Personal data (emails, phone numbers, addresses)</li>
  <li>Database credentials, connection strings</li>
  <li>Private keys or certificates</li>
</ul>

<p>Public paste tools are regularly scraped. GitHub Gist "secret" links circulate. Treat any paste as potentially public even if you set it to unlisted.</p>

<h2>For sensitive content</h2>

<p>If you need to share sensitive text, use an end-to-end encrypted option: <a href="https://privatebin.net">PrivateBin</a> encrypts in the browser before sending — the server never sees the plaintext. The decryption key is part of the URL fragment (which isn't sent to the server). Share the full URL to share the content securely.</p>

<p>Create a shareable paste instantly at <a href="/tools">Toolora → Productivity → Paste</a>. No login, no friction.</p>
    `.trim(),
  },

  {
    slug: "regex-basics-patterns-guide",
    title: "Regex Basics: The 15 Patterns That Cover 90% of Real-World Use",
    description: "You don't need to memorize all of regex. Here are the patterns you'll actually use — for email, URL, phone, date, and more.",
    date: "2026-04-14",
    readTime: "6 min read",
    category: "Developer Tools",
    keywords: ["regex basics", "regular expressions tutorial", "regex patterns", "regex cheat sheet", "regex for email validation"],
    content: `
<p>Regular expressions have a reputation for being cryptic and hard. Most of that reputation comes from seeing complex patterns without understanding the small set of building blocks they're made from. Here's the fast path.</p>

<h2>The core building blocks</h2>

<table>
  <thead>
    <tr><th>Symbol</th><th>Meaning</th><th>Example</th></tr>
  </thead>
  <tbody>
    <tr><td><code>.</code></td><td>Any single character (except newline)</td><td><code>c.t</code> matches cat, cut, cot</td></tr>
    <tr><td><code>*</code></td><td>0 or more of the preceding</td><td><code>ca*t</code> matches ct, cat, caat</td></tr>
    <tr><td><code>+</code></td><td>1 or more of the preceding</td><td><code>ca+t</code> matches cat, caat (not ct)</td></tr>
    <tr><td><code>?</code></td><td>0 or 1 of the preceding (optional)</td><td><code>colou?r</code> matches color, colour</td></tr>
    <tr><td><code>^</code></td><td>Start of string</td><td><code>^Hello</code> matches strings starting with Hello</td></tr>
    <tr><td><code>$</code></td><td>End of string</td><td><code>world$</code> matches strings ending with world</td></tr>
    <tr><td><code>[abc]</code></td><td>Character class — any of a, b, c</td><td><code>[aeiou]</code> matches any vowel</td></tr>
    <tr><td><code>[^abc]</code></td><td>Negated class — anything except a, b, c</td><td><code>[^0-9]</code> matches non-digits</td></tr>
    <tr><td><code>\d</code></td><td>Any digit (0-9)</td><td><code>\d{4}</code> matches any 4-digit number</td></tr>
    <tr><td><code>\w</code></td><td>Word character (a-z, A-Z, 0-9, _)</td><td><code>\w+</code> matches a word</td></tr>
    <tr><td><code>\s</code></td><td>Whitespace (space, tab, newline)</td><td><code>\s+</code> matches whitespace runs</td></tr>
    <tr><td><code>{n,m}</code></td><td>Between n and m repetitions</td><td><code>\d{2,4}</code> matches 2–4 digits</td></tr>
    <tr><td><code>(abc)</code></td><td>Capturing group</td><td><code>(\d{4})-(\d{2})</code> captures year and month</td></tr>
    <tr><td><code>a|b</code></td><td>Either a or b</td><td><code>cat|dog</code> matches cat or dog</td></tr>
    <tr><td><code>\b</code></td><td>Word boundary</td><td><code>\bword\b</code> matches "word" not "keyword"</td></tr>
  </tbody>
</table>

<h2>The 15 patterns you'll actually use</h2>

<p><strong>Email (basic validation):</strong><br><code>/^[^\s@]+@[^\s@]+\.[^\s@]+$/</code></p>

<p><strong>URL:</strong><br><code>/https?:\/\/[^\s/$.?#].[^\s]*/i</code></p>

<p><strong>US phone (flexible format):</strong><br><code>/^\+?1?\s*\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/</code></p>

<p><strong>ISO date (YYYY-MM-DD):</strong><br><code>/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/</code></p>

<p><strong>IPv4 address:</strong><br><code>/^(\d{1,3}\.){3}\d{1,3}$/</code></p>

<p><strong>Hex color code:</strong><br><code>/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/</code></p>

<p><strong>Slug (URL-safe string):</strong><br><code>/^[a-z0-9]+(?:-[a-z0-9]+)*$/</code></p>

<p><strong>Strong password (min 8, at least 1 uppercase, 1 lowercase, 1 digit):</strong><br><code>/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/</code></p>

<p><strong>Credit card (4 groups of 4 digits, any separator):</strong><br><code>/^\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}$/</code></p>

<p><strong>ZIP code (US 5-digit or ZIP+4):</strong><br><code>/^\d{5}(-\d{4})?$/</code></p>

<p><strong>Remove HTML tags:</strong><br><code>/&lt;[^&gt;]+&gt;/g</code></p>

<p><strong>Trim multiple spaces to one:</strong><br><code>/\s+/g</code> → replace with <code>' '</code></p>

<p><strong>Extract numbers from string:</strong><br><code>/-?\d+\.?\d*/g</code></p>

<p><strong>Match lines starting with #  (comments):</strong><br><code>/^#.*/gm</code></p>

<p><strong>Markdown links [text](url):</strong><br><code>/\[([^\]]+)\]\(([^)]+)\)/g</code></p>

<h2>Common mistakes</h2>

<p>Don't use regex for HTML parsing — HTML nesting breaks regex. Use a proper DOM parser. Don't use regex as your only email validation — the only real validation is sending a confirmation email. And don't over-engineer — if a simple string method works (<code>includes()</code>, <code>startsWith()</code>), use that instead.</p>
    `.trim(),
  },

  {
    slug: "ai-agent-memory-systems-explained",
    title: "AI Agent Memory: How AI Systems Remember Things Between Conversations",
    description: "AI models are stateless by default. Memory requires external storage. Here's how AI memory systems actually work — from simple key-value to vector stores.",
    date: "2026-04-14",
    readTime: "5 min read",
    category: "AI Builders",
    keywords: ["ai agent memory", "claude memory", "llm memory systems", "ai persistent memory", "vector store for ai"],
    content: `
<p>Every time you start a new conversation with Claude or ChatGPT, it has no memory of previous conversations. This isn't a bug — it's how transformer models work. The model processes a context window and produces a response. No state is persisted between calls.</p>

<p>Giving AI agents meaningful memory requires building it externally. Here are the main approaches.</p>

<h2>Types of AI memory</h2>

<p><strong>In-context memory (the simplest kind)</strong> — Paste previous conversation or user facts directly into the prompt. Works fine for single sessions. Doesn't scale — context windows are finite, and stuffing them with memory reduces space for the actual task.</p>

<p><strong>External storage with retrieval</strong> — Store information in a database. On each new conversation, retrieve relevant information and inject it into the context. This can be a simple key-value store for structured facts, or a vector database for semantic retrieval.</p>

<p><strong>Episodic memory</strong> — Storing summaries of previous conversations that can be retrieved and replayed. "Last week you were working on X." The AI didn't experience that — a summary was retrieved from storage and included in the context.</p>

<p><strong>Procedural memory</strong> — Stored instructions or workflows the agent has learned. "The user prefers concise answers" or "always format code with line numbers." These are retrieved as system-prompt additions.</p>

<h2>Vector databases: semantic memory</h2>

<p>A vector database stores embeddings — mathematical representations of meaning. When you search semantically ("find things similar to this concept"), the database computes similarity between your query embedding and stored embeddings and returns the closest matches.</p>

<p>This enables memory that works like human association: asking about "my project deadline" retrieves stored facts about your project even if the exact word "deadline" never appeared in the stored text.</p>

<table>
  <thead>
    <tr><th>Vector DB</th><th>Hosting</th><th>Best for</th></tr>
  </thead>
  <tbody>
    <tr><td>Pinecone</td><td>Cloud</td><td>Production-grade semantic search</td></tr>
    <tr><td>Weaviate</td><td>Cloud / self-hosted</td><td>Complex data types with semantic search</td></tr>
    <tr><td>Chroma</td><td>Local / cloud</td><td>Developer prototyping</td></tr>
    <tr><td>pgvector</td><td>PostgreSQL extension</td><td>If you already use Postgres</td></tr>
    <tr><td>Qdrant</td><td>Self-hosted / cloud</td><td>High-performance with Rust backend</td></tr>
  </tbody>
</table>

<h2>The MCP approach: tool-based memory</h2>

<p>MCP servers can expose <code>save_memory</code> and <code>recall_memory</code> tools that agents call explicitly. Rather than automatic retrieval, the agent decides what to save and when to look things up — more transparent but requires the agent to be instructed to use memory tools.</p>

<p>The Toolora MCP server includes both tools: Claude can call <code>save_memory</code> with a key and value, and retrieve it later with <code>recall_memory</code>. Simple key-value, but useful for persistent facts across conversations.</p>

<h2>What works in practice</h2>

<p>For most use cases, simple key-value memory is enough: user preferences, project names, relevant background facts. Vector search is useful when you're building a personal AI that needs to recall information from a large history of conversations or documents.</p>

<p>The limiting factor isn't the memory storage — it's the context window. Even with good retrieval, you can only inject so much retrieved context before it crowds out the current task. Most production systems retrieve 3–10 relevant memory items per conversation turn.</p>

<p>Try the <code>save_memory</code> and <code>recall_memory</code> tools on the <a href="/mcp-hub">Toolora MCP server</a>. Add it to Claude Desktop and tell it to remember things about your projects.</p>
    `.trim(),
  },

  {
    slug: "read-pdf-without-google-drive",
    title: "How to Read a PDF Without Google Drive (Privacy-First Methods)",
    description: "Google Drive reads your PDFs to train models. Here's how to extract PDF text without uploading to any cloud service.",
    date: "2026-04-15",
    readTime: "4 min read",
    category: "Privacy",
    keywords: ["read pdf without google drive", "extract pdf text free", "pdf reader no upload", "pdf privacy"],
    content: `
<p>When you open a PDF in Google Drive, Google processes it — for indexing, for features like search, and per their terms, as training data for certain AI systems. For most documents that's fine. For client contracts, medical records, financial documents, or anything confidential, it's worth thinking about.</p>

<h2>What Google Drive does with your PDFs</h2>

<p>Google Drive's privacy policy indicates they process file content to improve their services. Workspace documents stored in Drive are not used to train ad-serving models, but the boundaries around AI training have shifted multiple times. The Terms of Service grant Google a license to process your uploaded content.</p>

<p>If your organization has Google Workspace with enhanced data controls, this works differently. But personal Gmail accounts with standard Drive? Your documents are processed.</p>

<h2>Method 1: Browser-based PDF text extraction (best for privacy)</h2>

<p>PDF.js (Mozilla's library) can parse and render PDFs entirely in the browser. Tools built on pdf-lib can extract the text layer from a digital PDF (not a scanned one) without uploading anything.</p>

<p>How to verify it's local: open DevTools → Network tab before uploading your PDF. If no files are sent to an external server, the extraction is happening in your browser.</p>

<p>Extract PDF text in-browser at <a href="/tools">Toolora → Documents → PDF Extract</a>. Paste your PDF, get the text layer — nothing uploaded.</p>

<h2>Method 2: macOS Preview or Windows Edge (built-in)</h2>

<p>macOS Preview lets you select and copy text directly from PDFs if they have a text layer. Windows Edge can open PDFs and has a text selection mode. Neither uploads your file anywhere — it's processed by the OS PDF renderer.</p>

<p>Limitation: this requires manual copying, doesn't work on scanned PDFs, and doesn't extract the full document programmatically.</p>

<h2>Method 3: Local OCR for scanned PDFs</h2>

<p>If your PDF is a scan (essentially an image), it has no text layer — only pixels. Extracting text requires OCR. Local OCR options:</p>

<ul>
  <li><strong>Tesseract</strong> — open-source, runs locally, command-line: <code>tesseract input.pdf output txt</code></li>
  <li><strong>ABBYY FineReader</strong> — commercial, excellent accuracy, fully local</li>
  <li><strong>Browser-based Tesseract</strong> — WASM build, runs in your browser tab without uploading</li>
</ul>

<h2>Method 4: Adobe Acrobat (local, not cloud)</h2>

<p>The desktop version of Adobe Acrobat processes PDFs locally. Acrobat Reader (the free version) lets you copy text; Acrobat Pro can run OCR locally. The cloud features (Adobe Document Cloud, AI Assistant) do upload — only use the local processing features.</p>

<h2>When cloud upload is fine</h2>

<p>If the PDF is non-confidential — a public report, product documentation, a textbook — cloud processing via Google Drive, Adobe AI, or any service is perfectly reasonable and often more powerful. Save the local-only approach for documents that genuinely warrant it.</p>
    `.trim(),
  },

  {
    slug: "url-encoding-percent-encoding-explained",
    title: "URL Encoding Explained: What %20 and %3A Actually Mean",
    description: "Every URL you've ever seen with %20 in it — here's why that happens, what it means, and when you need to encode or decode URLs.",
    date: "2026-04-15",
    readTime: "4 min read",
    category: "Developer Tools",
    keywords: ["url encoding", "percent encoding", "urlencode", "what does %20 mean", "url encode decode"],
    content: `
<p>URLs can only contain a specific set of characters. When data contains characters outside that set — spaces, special characters, non-ASCII text — those characters must be encoded. That encoding produces the <code>%20</code>s, <code>%3A</code>s, and <code>%2F</code>s you see everywhere.</p>

<h2>Why URLs have character restrictions</h2>

<p>The URL specification (RFC 3986) defines a set of allowed characters: letters (a-z, A-Z), digits (0-9), and a small set of special characters (<code>-</code>, <code>_</code>, <code>.</code>, <code>~</code>). Characters with special meaning in URLs — like <code>/</code> (path separator), <code>?</code> (query start), <code>&amp;</code> (parameter separator), <code>#</code> (fragment) — can only appear in their literal form when serving their structural role.</p>

<p>Everything else must be percent-encoded.</p>

<h2>How percent encoding works</h2>

<p>Each character is converted to its UTF-8 byte value, then expressed as <code>%</code> followed by two hexadecimal digits.</p>

<table>
  <thead>
    <tr><th>Character</th><th>Encoding</th><th>Reason</th></tr>
  </thead>
  <tbody>
    <tr><td>Space</td><td><code>%20</code></td><td>Space = byte 0x20 in ASCII</td></tr>
    <tr><td>:</td><td><code>%3A</code></td><td>Colon is a reserved character</td></tr>
    <tr><td>/</td><td><code>%2F</code></td><td>Slash is a path separator</td></tr>
    <tr><td>?</td><td><code>%3F</code></td><td>Question mark starts the query string</td></tr>
    <tr><td>&amp;</td><td><code>%26</code></td><td>Ampersand separates query params</td></tr>
    <tr><td>=</td><td><code>%3D</code></td><td>Equals assigns query param values</td></tr>
    <tr><td>#</td><td><code>%23</code></td><td>Hash starts the fragment identifier</td></tr>
    <tr><td>@</td><td><code>%40</code></td><td>At sign in URLs can confuse parsers</td></tr>
    <tr><td>+</td><td><code>%2B</code></td><td>Plus sign (or encodes space in form data)</td></tr>
  </tbody>
</table>

<h2>The + vs %20 distinction</h2>

<p>In query strings (the part after <code>?</code>), HTML form submission traditionally encodes spaces as <code>+</code> (application/x-www-form-urlencoded). In path components, spaces must be <code>%20</code>.</p>

<p>This causes bugs: decoding <code>first+name</code> as a URL path gives you "first+name" (literal plus), but decoding it as form data gives you "first name." Use the right decode function for the context.</p>

<h2>JavaScript functions</h2>

<ul>
  <li><code>encodeURIComponent(str)</code> — encodes a value to be used as a query param value or path segment. Encodes everything except <code>A-Z a-z 0-9 - _ . ! ~ * ' ( )</code>.</li>
  <li><code>encodeURI(str)</code> — encodes a full URL. Doesn't encode characters that are structurally significant in URLs (<code>: / ? # @ ! $ &amp; ' ( ) * + , ; =</code>). Use when encoding a complete URL.</li>
  <li><code>decodeURIComponent(str)</code> — reverses <code>encodeURIComponent</code>.</li>
</ul>

<p>The common mistake: using <code>encodeURI</code> on a query parameter value. It won't encode <code>&amp;</code> and <code>=</code>, which breaks your query string. Always use <code>encodeURIComponent</code> for individual values.</p>

<h2>International characters</h2>

<p>Non-ASCII characters (Chinese, Arabic, emoji) are first encoded to UTF-8 bytes, then percent-encoded. The emoji 🔑 (U+1F511) encodes to <code>%F0%9F%94%91</code> — its four UTF-8 bytes in hex.</p>

<p>Modern browsers handle this transparently in the address bar, displaying the decoded form for readability. The actual HTTP request still uses the encoded form.</p>
    `.trim(),
  },

  {
    slug: "check-if-website-uploads-your-files",
    title: "How to Check if a Website Actually Uploads Your Files",
    description: "Use your browser's Network tab to see exactly what data any online tool sends to its servers. Step-by-step instructions.",
    date: "2026-04-16",
    readTime: "4 min read",
    category: "Privacy",
    keywords: ["check if website uploads files", "devtools network tab", "privacy check online tool", "is my file safe online"],
    content: `
<p>Every online tool that processes your files claims to be private. Most are lying — or at least not telling the full truth. Here's how to verify yourself, in under two minutes, using tools already in your browser.</p>

<h2>Open DevTools → Network tab</h2>

<ol>
  <li>Open the online tool in Chrome, Firefox, or Edge</li>
  <li>Press <strong>F12</strong> (or right-click → Inspect)</li>
  <li>Click the <strong>Network</strong> tab</li>
  <li>Make sure recording is on — the circle in the top-left should be red</li>
  <li>Check the <strong>Preserve log</strong> checkbox so requests don't clear on navigation</li>
</ol>

<h2>Now use the tool</h2>

<p>Upload your file, convert your PDF, compress your image — whatever the tool does. Watch the Network tab as you do it.</p>

<h2>What to look for</h2>

<p><strong>If the tool uploads your file:</strong> You'll see a POST or PUT request appear in the list, often to the tool's domain or a CDN. Click on the request. Under the Payload tab, you'll see your file data (often as binary or base64). Under the Response tab, you'll see the server's response with the processed file.</p>

<p><strong>If the tool is truly client-side:</strong> You'll see no outbound requests matching your file. The only network traffic will be the initial page load (HTML, CSS, JS, WASM files). Processing that happens locally produces no network requests — it's all computation in your browser tab.</p>

<h2>What counts as uploading</h2>

<table>
  <thead>
    <tr><th>Request type</th><th>What it means</th></tr>
  </thead>
  <tbody>
    <tr><td>POST to tool's domain with file payload</td><td>Your file went to their server</td></tr>
    <tr><td>PUT to an S3 or CDN URL</td><td>Your file went to cloud storage</td></tr>
    <tr><td>XHR/fetch with multipart/form-data</td><td>File upload in progress</td></tr>
    <tr><td>No outbound data requests during processing</td><td>Processing is local</td></tr>
    <tr><td>Request to load a WASM file (.wasm)</td><td>Good sign — processing engine loading locally</td></tr>
  </tbody>
</table>

<h2>Filter to find relevant requests</h2>

<p>In the Network tab filter bar, type the tool's domain name, or filter by "Fetch/XHR" to see only API calls (filtering out static assets like images and scripts). This makes it easier to spot file upload requests among the noise.</p>

<h2>What the response time tells you</h2>

<p>A tool that processes client-side has no server round-trip. Processing happens at the speed of your CPU. Response times for client-side tools are typically 0.5–5 seconds depending on file size and operation complexity.</p>

<p>A tool that uploads will show a network request with a duration proportional to your upload speed. If you see a request taking 3–30 seconds and it's going to an external server, your file went there.</p>

<p>All tools at <a href="/tools">Toolora</a> are verifiable with this method. No outbound file requests. The WASM files load once and cache.</p>
    `.trim(),
  },

  {
    slug: "mime-types-content-type-explained",
    title: "MIME Types Explained: What Content-Type Headers Actually Do",
    description: "Every file has a MIME type. Every API response needs a Content-Type. Here's what they are, why they matter, and the common types you'll encounter.",
    date: "2026-04-16",
    readTime: "4 min read",
    category: "Developer Tools",
    keywords: ["mime type", "content-type header", "what is mime type", "application/json", "file mime types"],
    content: `
<p>MIME types tell the browser (or any HTTP client) what kind of data is being sent. Without them, the receiver has to guess — which leads to files being rendered incorrectly, downloads failing, or security vulnerabilities.</p>

<h2>What MIME stands for</h2>

<p>Multipurpose Internet Mail Extensions. Originally designed for email attachments in the early 1990s. Adopted by the web for HTTP content negotiation. The format is: <code>type/subtype</code>, optionally with parameters: <code>text/html; charset=UTF-8</code>.</p>

<h2>The common ones</h2>

<table>
  <thead>
    <tr><th>MIME type</th><th>What it is</th><th>File extension</th></tr>
  </thead>
  <tbody>
    <tr><td><code>text/html</code></td><td>HTML document</td><td>.html, .htm</td></tr>
    <tr><td><code>text/css</code></td><td>CSS stylesheet</td><td>.css</td></tr>
    <tr><td><code>text/javascript</code></td><td>JavaScript</td><td>.js, .mjs</td></tr>
    <tr><td><code>application/json</code></td><td>JSON data</td><td>.json</td></tr>
    <tr><td><code>application/xml</code></td><td>XML data</td><td>.xml</td></tr>
    <tr><td><code>application/pdf</code></td><td>PDF document</td><td>.pdf</td></tr>
    <tr><td><code>application/zip</code></td><td>ZIP archive</td><td>.zip</td></tr>
    <tr><td><code>image/jpeg</code></td><td>JPEG image</td><td>.jpg, .jpeg</td></tr>
    <tr><td><code>image/png</code></td><td>PNG image</td><td>.png</td></tr>
    <tr><td><code>image/webp</code></td><td>WebP image</td><td>.webp</td></tr>
    <tr><td><code>image/svg+xml</code></td><td>SVG vector image</td><td>.svg</td></tr>
    <tr><td><code>audio/mpeg</code></td><td>MP3 audio</td><td>.mp3</td></tr>
    <tr><td><code>video/mp4</code></td><td>MP4 video</td><td>.mp4</td></tr>
    <tr><td><code>multipart/form-data</code></td><td>File upload form</td><td>—</td></tr>
    <tr><td><code>application/octet-stream</code></td><td>Unknown binary</td><td>—</td></tr>
  </tbody>
</table>

<h2>In API development</h2>

<p>Always set <code>Content-Type: application/json</code> when returning JSON. Without it, some clients treat the response as plain text. Always check the request's <code>Content-Type</code> before parsing — a client sending <code>application/x-www-form-urlencoded</code> instead of <code>application/json</code> will break a JSON parser.</p>

<p>For file uploads: clients must send <code>Content-Type: multipart/form-data</code> with a boundary parameter. The boundary is a randomly generated string that separates file parts in the request body. Don't set this header manually — your HTTP client sets it automatically with the correct boundary when you attach files.</p>

<h2>Security: MIME sniffing and X-Content-Type-Options</h2>

<p>Browsers used to "sniff" MIME types — ignoring the Content-Type header and guessing from the file's actual bytes. This led to security vulnerabilities where an attacker could upload an HTML file labeled as an image, and the browser would execute it as HTML.</p>

<p>The fix: set <code>X-Content-Type-Options: nosniff</code> header on your server. This tells browsers to trust the Content-Type header and never sniff. All modern web apps should set this.</p>

<h2>application/octet-stream: the fallback</h2>

<p><code>application/octet-stream</code> means "raw binary data, unknown type." Browsers treat this as a file download. If you're serving a file and set this type, the browser will download it instead of rendering it — useful for forcing downloads even of displayable file types like PDFs or images.</p>
    `.trim(),
  },

  {
    slug: "what-is-an-ai-agent",
    title: "What Is an AI Agent? A Plain-English Explanation",
    description: "AI agents are everywhere now. Here's what they actually are, how they differ from chatbots, and what makes them capable of doing real work.",
    date: "2026-04-17",
    readTime: "5 min read",
    category: "AI Builders",
    keywords: ["what is an ai agent", "ai agent explained", "autonomous ai", "ai agent vs chatbot", "llm agent"],
    content: `
<p>The term "AI agent" is being applied to everything from a simple chatbot with a system prompt to fully autonomous systems that browse the web, write code, and deploy software. Here's a clear-eyed explanation of what the term actually means and why the distinction matters.</p>

<h2>Chatbot vs. AI agent</h2>

<p>A chatbot takes input and produces a response. One turn, one response, done. It doesn't take actions — it produces text.</p>

<p>An AI agent takes input, decides what actions to take to accomplish a goal, takes those actions, observes the results, and continues until the goal is met. It can use tools, make decisions, and run multiple steps without asking you to intervene at each one.</p>

<table>
  <thead>
    <tr><th>Property</th><th>Chatbot</th><th>AI Agent</th></tr>
  </thead>
  <tbody>
    <tr><td>Actions</td><td>Text output only</td><td>Can use tools, call APIs, run code</td></tr>
    <tr><td>Memory</td><td>In-context only</td><td>Can write to / read from external storage</td></tr>
    <tr><td>Multi-step</td><td>One response per prompt</td><td>Chains multiple steps autonomously</td></tr>
    <tr><td>Goal-seeking</td><td>Responds to each message</td><td>Works toward a declared objective</td></tr>
    <tr><td>Interrupts user</td><td>Every turn</td><td>Only when blocked or uncertain</td></tr>
  </tbody>
</table>

<h2>The core components of an AI agent</h2>

<p><strong>The model</strong> — A large language model (Claude, GPT-4, Gemini) that handles reasoning, planning, and decision-making.</p>

<p><strong>Tools</strong> — Functions the model can call: web search, code execution, file reading, API calls, database queries. The model decides which tools to use and when.</p>

<p><strong>Memory</strong> — Persistent state between steps and sessions. Can be simple key-value storage, a vector database for semantic retrieval, or a full relational database.</p>

<p><strong>A goal or task</strong> — What the agent is trying to accomplish. This might be a one-line instruction ("research competitors and write a report") or a complex structured objective.</p>

<p><strong>An orchestrator</strong> — The loop that sends the model's tool calls to the actual tools, returns results to the model, and continues until the task is done or the model signals completion.</p>

<h2>What makes a good tool set</h2>

<p>An agent is only as capable as its tools. Common tools that significantly expand what an agent can do:</p>

<ul>
  <li><strong>Web search</strong> — access to current information</li>
  <li><strong>Browser control</strong> — logging into sites, filling forms, extracting structured data</li>
  <li><strong>Code execution</strong> — running Python, processing data, generating files</li>
  <li><strong>File reading/writing</strong> — working with documents, spreadsheets, CSVs</li>
  <li><strong>API calls</strong> — interacting with external services</li>
  <li><strong>Memory tools</strong> — saving and retrieving facts across sessions</li>
</ul>

<h2>The MCP standard</h2>

<p>Model Context Protocol (MCP) is Anthropic's open standard for connecting AI agents to external tools and data sources. Instead of every developer building custom integrations for every model, MCP provides a standardized interface: any MCP-compatible tool works with any MCP-compatible model.</p>

<p>This is why MCP servers like Toolora's let Claude use file processing, web reading, and memory tools out of the box — without Anthropic writing any of that code.</p>

<p>Explore MCP-ready tools for AI agents at <a href="/mcp-hub">toolora.dev/mcp-hub</a>.</p>
    `.trim(),
  },

  {
    slug: "markdown-cheat-sheet-2026",
    title: "Markdown Cheat Sheet: Every Syntax You Actually Need",
    description: "Headers, bold, italic, code, tables, links, images — the complete quick reference for writing Markdown fast.",
    date: "2026-04-17",
    readTime: "4 min read",
    category: "Developer Tools",
    keywords: ["markdown cheat sheet", "markdown syntax", "markdown reference", "github markdown", "markdown guide"],
    content: `
<p>Markdown is designed to be readable as plain text and convertible to HTML. The syntax is minimal by design — here's everything, organized by how often you'll use it.</p>

<h2>The ones you'll use every day</h2>

<pre><code># Heading 1
## Heading 2
### Heading 3

**bold text**
*italic text*
***bold and italic***
~~strikethrough~~

[Link text](https://example.com)
![Alt text](image.png)

- Unordered list item
- Another item
  - Nested item

1. Ordered list item
2. Second item

\`inline code\`

\`\`\`javascript
// fenced code block
const x = 1;
\`\`\`

> Blockquote text

---  (horizontal rule)
</code></pre>

<h2>Tables (GitHub Flavored Markdown)</h2>

<pre><code>| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Cell     | Cell     | Cell     |
| Cell     | Cell     | Cell     |

Alignment:
| Left     | Center   | Right    |
|:---------|:--------:|---------:|
| text     | text     | text     |
</code></pre>

<h2>Task lists</h2>

<pre><code>- [x] Completed task
- [ ] Incomplete task
- [x] Another done
</code></pre>

<h2>Links with titles</h2>

<pre><code>[Link text](https://example.com "Optional title")

Reference-style links:
[Link text][ref-id]

[ref-id]: https://example.com "Optional title"
</code></pre>

<h2>Images</h2>

<pre><code>![Alt text](image.png)
![Alt text](image.png "Optional title")

Linked image:
[![Alt text](image.png)](https://example.com)
</code></pre>

<h2>Escaping special characters</h2>

<p>Prefix with backslash to treat special characters as literal:</p>

<pre><code>\*not italic\*
\`not code\`
\# not a heading
</code></pre>

<h2>Extended syntax (not all parsers support)</h2>

<table>
  <thead>
    <tr><th>Syntax</th><th>Output</th><th>Support</th></tr>
  </thead>
  <tbody>
    <tr><td><code>~~text~~</code></td><td>Strikethrough</td><td>GFM, most modern parsers</td></tr>
    <tr><td><code>==highlight==</code></td><td>Highlighted text</td><td>Some extended parsers</td></tr>
    <tr><td><code>H~2~O</code></td><td>Subscript</td><td>Extended Markdown only</td></tr>
    <tr><td><code>x^2^</code></td><td>Superscript</td><td>Extended Markdown only</td></tr>
    <tr><td><code>:emoji:</code></td><td>Emoji shortcode</td><td>GitHub, Discord, Slack</td></tr>
    <tr><td><code>[^1]</code></td><td>Footnote reference</td><td>Extended Markdown, Pandoc</td></tr>
  </tbody>
</table>

<h2>The spec situation</h2>

<p>CommonMark is the standardized Markdown spec that resolves ambiguities in the original spec. GitHub Flavored Markdown (GFM) extends CommonMark with tables, task lists, strikethrough, and autolinks. When in doubt about what will work in your context, check which spec your platform uses — GitHub uses GFM, Notion uses its own variant, and static site generators vary widely.</p>

<p>Convert Markdown to HTML instantly at <a href="/tools">Toolora → Developer → Markdown to HTML</a>.</p>
    `.trim(),
  },

  {
    slug: "generate-uuid-guid-online",
    title: "How to Generate a UUID Online for Free (And What UUIDs Actually Are)",
    description: "Generate random UUIDs, understand the different versions, and learn when to use UUID vs ULID vs CUID for your IDs.",
    date: "2026-04-18",
    readTime: "4 min read",
    category: "Developer Tools",
    keywords: ["uuid generator online", "guid generator", "generate uuid free", "uuid v4", "uuid vs ulid"],
    content: `
<p>UUID stands for Universally Unique Identifier. It's a 128-bit value formatted as 32 hexadecimal digits in a specific pattern: <code>xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx</code>. The M indicates version, N indicates variant.</p>

<h2>UUID versions</h2>

<table>
  <thead>
    <tr><th>Version</th><th>Based on</th><th>Use case</th></tr>
  </thead>
  <tbody>
    <tr><td>v1</td><td>Timestamp + MAC address</td><td>Time-ordered, but leaks network info — mostly deprecated</td></tr>
    <tr><td>v3</td><td>MD5 hash of namespace + name</td><td>Deterministic from input — same input always gives same UUID</td></tr>
    <tr><td>v4</td><td>Random (122 random bits)</td><td>The most common — use when you just need a unique ID</td></tr>
    <tr><td>v5</td><td>SHA-1 hash of namespace + name</td><td>Deterministic, like v3 but with stronger hash</td></tr>
    <tr><td>v6</td><td>Timestamp + random (reordered v1)</td><td>Sortable, database-friendly — gaining adoption</td></tr>
    <tr><td>v7</td><td>Unix timestamp + random</td><td>Sortable by creation time — use for database PKs</td></tr>
  </tbody>
</table>

<h2>UUID v4 is the default choice</h2>

<p>v4 is 122 bits of randomness. The probability of a collision across 2.71 quintillion UUIDs is one in a billion — for practical purposes, they never collide. Use v4 when you need a unique identifier and don't care about ordering.</p>

<h2>UUID in databases: the index problem</h2>

<p>UUIDs as primary keys in databases cause a performance issue: random v4 UUIDs insert in random positions in the index B-tree, causing fragmentation. Sequential IDs (like auto-increment integers) insert at the end, keeping the index compact.</p>

<p>Solutions:</p>
<ul>
  <li><strong>UUID v7</strong> — starts with a Unix timestamp prefix, so they sort chronologically and insert near the end of the index</li>
  <li><strong>ULID</strong> — Universally Unique Lexicographically Sortable Identifier. 26-character base32, timestamp-prefixed, case-insensitive. Good database performance.</li>
  <li><strong>CUID2</strong> — Collision-resistant, URL-safe, sortable. Designed as a modern replacement for v4 UUIDs in database contexts.</li>
</ul>

<h2>When to use integer IDs instead</h2>

<p>If you have a single-server database with no distribution requirements, auto-increment integer IDs are faster, smaller (8 bytes vs 16 for UUID), and index better. The case for UUIDs is strongest when:</p>
<ul>
  <li>You're merging data from multiple sources</li>
  <li>IDs are generated client-side before hitting the database</li>
  <li>You're distributing across multiple database servers</li>
  <li>You don't want sequential IDs that reveal how many records you have</li>
</ul>

<h2>Generate one</h2>

<p>In JavaScript: <code>crypto.randomUUID()</code> — built into modern browsers and Node.js 14.17+. No library needed.</p>

<p>In Python: <code>import uuid; str(uuid.uuid4())</code></p>

<p>In the terminal: <code>uuidgen</code> (macOS/Linux)</p>

<p>Or generate instantly at <a href="/tools">Toolora → Developer → UUID Generator</a>. One click, copy to clipboard.</p>
    `.trim(),
  },

  {
    slug: "character-count-social-media-limits",
    title: "Character Count for Every Social Media Platform in 2026",
    description: "Twitter/X, Instagram, LinkedIn, TikTok, YouTube, Threads — every character limit in one table, with tips for each.",
    date: "2026-04-18",
    readTime: "4 min read",
    category: "Tools",
    keywords: ["character count", "twitter character limit", "instagram caption length", "linkedin post character limit", "social media character limits"],
    content: `
<p>Every platform has different limits, and they change more often than you'd think. Here's the current state, with notes on the details that catch people out.</p>

<h2>The limits</h2>

<table>
  <thead>
    <tr><th>Platform</th><th>Post / caption</th><th>Comment</th><th>Bio</th><th>Headline / display name</th></tr>
  </thead>
  <tbody>
    <tr><td>X (Twitter)</td><td>280 (25,000 for Premium)</td><td>280</td><td>160</td><td>50</td></tr>
    <tr><td>Instagram</td><td>2,200</td><td>2,200</td><td>150</td><td>30</td></tr>
    <tr><td>LinkedIn</td><td>3,000</td><td>1,250</td><td>2,600 (About)</td><td>220</td></tr>
    <tr><td>Facebook</td><td>63,206</td><td>8,000</td><td>101</td><td>170 (Page name: 75)</td></tr>
    <tr><td>TikTok</td><td>2,200</td><td>150</td><td>80</td><td>30</td></tr>
    <tr><td>YouTube</td><td>5,000 (description)</td><td>10,000</td><td>1,000</td><td>100</td></tr>
    <tr><td>Threads</td><td>500</td><td>500</td><td>150</td><td>30</td></tr>
    <tr><td>Pinterest</td><td>500 (description)</td><td>500</td><td>160</td><td>30</td></tr>
    <tr><td>Reddit</td><td>40,000</td><td>10,000</td><td>200</td><td>30</td></tr>
    <tr><td>Bluesky</td><td>300</td><td>300</td><td>256</td><td>64</td></tr>
  </tbody>
</table>

<h2>What counts as a character</h2>

<p><strong>X/Twitter</strong>: URLs always count as 23 characters regardless of actual length (t.co shortener). Emoji count as 1-2 characters depending on the emoji (most modern emoji are 2 code points). CJK (Chinese, Japanese, Korean) characters also count as 2.</p>

<p><strong>Instagram</strong>: The 2,200 character limit isn't the real limit you should care about — text is truncated at ~125 characters in the feed with a "more" tap. Your hook needs to land in those first 125 characters.</p>

<p><strong>LinkedIn</strong>: Posts show a "see more" after 210 characters in the feed. Engagement drops significantly for posts that require expansion. First 210 characters do the work.</p>

<p><strong>YouTube descriptions</strong>: The first 157 characters appear in search results. Stuff your primary keywords before that cutoff.</p>

<h2>Character count matters for SEO too</h2>

<p>Meta descriptions in search results are truncated at around 155–160 characters. Title tags display up to 60 characters in Google. Going over doesn't hurt you — the rest is just cut off — but it's wasted space.</p>

<h2>Checking your count</h2>

<p>Most platforms show a live counter as you type. If you're drafting content outside the platform (in a doc or CMS), you need an external counter.</p>

<p>Count characters at <a href="/tools">Toolora → Text → Word Counter</a> — shows word count, character count with and without spaces, reading time, and average sentence length.</p>
    `.trim(),
  },

  {
    slug: "what-is-a-webhook",
    title: "What Is a Webhook? How It Differs from a Regular API Call",
    description: "Webhooks and APIs solve different problems. Here's when to use each, how webhooks actually work, and how to handle them in your server.",
    date: "2026-04-19",
    readTime: "5 min read",
    category: "Developer Tools",
    keywords: ["what is a webhook", "webhook vs api", "webhook explained", "rest api vs webhook", "webhook tutorial"],
    content: `
<p>A regular API call is you asking a question. A webhook is the other party texting you when something happens. They're both HTTP requests — the direction and trigger are what differ.</p>

<h2>The core difference</h2>

<p><strong>API call (polling)</strong>: You → request → Their server → response → You<br>You initiate. You get data when you ask.</p>

<p><strong>Webhook (push)</strong>: Their server → POST to your URL → Your server processes it<br>They initiate. You get data when something happens.</p>

<h2>Why webhooks exist</h2>

<p>Imagine you want to know when a payment succeeds on Stripe. Without webhooks, you'd need to call the Stripe API every few seconds to check payment status. That's polling — wasteful, delayed, and burns API quota.</p>

<p>With webhooks, Stripe calls your server the moment the payment completes. You get notified in real time without continuously asking.</p>

<h2>How webhooks work</h2>

<ol>
  <li>You provide a URL on your server to the third-party service (e.g., Stripe Dashboard → Webhooks → Add endpoint)</li>
  <li>When an event occurs on their side, they make an HTTP POST request to your URL</li>
  <li>The POST body contains a JSON payload describing what happened</li>
  <li>Your server processes the payload and responds with HTTP 200</li>
  <li>If your server returns an error or times out, they retry (usually with exponential backoff)</li>
</ol>

<h2>Webhook security: signature verification</h2>

<p>Anyone can POST to your webhook URL. You need to verify that requests actually came from the service you think sent them.</p>

<p>The standard method: the sender signs the payload with a shared secret (HMAC-SHA256). They include the signature in a header (like <code>Stripe-Signature</code>). Your server computes the expected signature using the same secret and compares — if they match, the request is legitimate.</p>

<pre><code>// Express.js example for Stripe webhooks
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send('Webhook signature verification failed');
  }
  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    // process payment
  }
  res.json({ received: true });
});</code></pre>

<h2>Important: respond fast, process async</h2>

<p>Webhook senders typically timeout after 5–30 seconds. Your endpoint must respond with 200 quickly — before doing any heavy processing. Queue the payload to a job system and process it asynchronously. If your endpoint times out, the sender will retry — causing duplicate processing if you're not idempotent.</p>

<h2>Idempotency in webhooks</h2>

<p>Retries are normal. The same event might be delivered 2–3 times. Your handler must be idempotent — processing the same event twice produces the same result as processing it once. Track which event IDs you've already processed and skip duplicates.</p>

<h2>Testing webhooks locally</h2>

<p>Your local development server isn't publicly reachable. Use a tunnel tool (ngrok, Cloudflare Tunnel, or the Stripe CLI) to expose your local port to the internet so services can deliver webhooks to it during development.</p>
    `.trim(),
  },

  {
    slug: "seo-writing-tips-2026",
    title: "How to Write for SEO in 2026: What Actually Works",
    description: "Keyword stuffing is dead. AI slop is being filtered. Here's what drives organic traffic now — and the writing habits that compound over time.",
    date: "2026-04-19",
    readTime: "5 min read",
    category: "Productivity",
    keywords: ["seo writing tips 2026", "how to write for seo", "seo blog post", "content seo strategy", "google seo 2026"],
    content: `
<p>The SEO that worked in 2019 actively hurts you in 2026. Google's Helpful Content system has changed the calculus. Here's what drives rankings now.</p>

<h2>The shift: E-E-A-T</h2>

<p>Google evaluates content on Experience, Expertise, Authoritativeness, and Trustworthiness. The addition of "Experience" (the first E) in 2022 was significant: first-hand experience with the topic is now a ranking signal. A review written by someone who actually used the product ranks above one clearly written without it.</p>

<p>What this means for writers: personal perspective and specific detail outperform generic coverage. "After using this daily for six months" is more credible than "users report that."</p>

<h2>Search intent alignment</h2>

<p>Every query has an intent. Writing a transactional page for an informational query — or an informational post for a transactional query — will not rank regardless of keyword density. Before writing, determine: what does someone searching this actually want?</p>

<table>
  <thead>
    <tr><th>Intent type</th><th>Example query</th><th>Content that ranks</th></tr>
  </thead>
  <tbody>
    <tr><td>Informational</td><td>"how does JWT work"</td><td>Explanation post with examples</td></tr>
    <tr><td>Navigational</td><td>"Stripe dashboard"</td><td>They're looking for Stripe — not your site</td></tr>
    <tr><td>Commercial</td><td>"best pdf compressor"</td><td>Comparison with clear recommendations</td></tr>
    <tr><td>Transactional</td><td>"compress pdf free"</td><td>The actual tool, immediately</td></tr>
  </tbody>
</table>

<h2>Content structure that earns featured snippets</h2>

<p>Featured snippets (the box at position zero) are extracted from structured content. Format information as:</p>
<ul>
  <li>Step-by-step numbered lists for how-to queries</li>
  <li>Tables for comparison queries ("X vs Y")</li>
  <li>Short definitional paragraphs for "what is" queries (40–60 words, directly answering the question)</li>
</ul>

<h2>What Google is filtering in 2026</h2>

<p><strong>AI-generated content at scale</strong>: Mass-produced generic content — even technically written by humans — is being filtered. The signal Google uses is a combination of topical depth, original data, and engagement signals.</p>

<p><strong>Thin affiliate pages</strong>: Pages that exist only to capture a query and send traffic to Amazon get demoted. Pages that actually help users make decisions don't.</p>

<p><strong>Keyword-stuffed headings</strong>: Heading tags were already not a direct ranking signal. Stuffing keywords into every H2 now actively signals low-quality content.</p>

<h2>What actually compounds</h2>

<ul>
  <li><strong>Original data</strong> — proprietary stats, research, or analysis that can't be found elsewhere. These attract links naturally.</li>
  <li><strong>Tool pages</strong> — interactive tools that solve a real problem have very low bounce rates and high return visit rates, which Google reads as quality signals.</li>
  <li><strong>Topic clusters</strong> — a pillar page on a broad topic with supporting posts on subtopics creates internal link structures that tell Google you're authoritative on the topic.</li>
  <li><strong>Updated content</strong> — refreshing existing posts with current information often outperforms writing new posts, because you're improving content that already has links and history.</li>
</ul>

<h2>The honest advice</h2>

<p>Write for one reader. A specific person with a specific problem. If your content helps that person more than anything else they found when searching, it will eventually rank. The algorithm is imperfect, but its goal is to surface what's genuinely useful. Everything else is tactics that shift with every update.</p>

<p>Check your content's readability and length at <a href="/tools">Toolora → Text → Word Counter</a>.</p>
    `.trim(),
  },

  {
    slug: "ai-function-calling-mcp-explained",
    title: "How AI Agents Call Tools: Function Calling and MCP Explained",
    description: "When Claude uses a tool, what actually happens? Here's the mechanics of AI tool calling, how MCP standardizes it, and what it means for developers.",
    date: "2026-04-20",
    readTime: "5 min read",
    category: "AI Builders",
    keywords: ["ai function calling", "tool use ai", "mcp tool calling", "how claude uses tools", "llm tool use"],
    content: `
<p>When you ask Claude to "search the web" or "read this URL," it doesn't have a built-in internet connection. What's happening is function calling — the model outputs a structured request for a tool, code intercepts it, runs the actual tool, and returns the result to the model. Here's how that works mechanically.</p>

<h2>Function calling basics</h2>

<p>When a model is configured with tools, the API call includes tool definitions — structured JSON schemas describing available functions, their parameters, and their expected inputs. The model can then respond with a tool call instead of a text response:</p>

<pre><code>{
  "type": "tool_use",
  "name": "read_url",
  "input": {
    "url": "https://example.com/article"
  }
}</code></pre>

<p>Your code receives this, executes <code>read_url("https://example.com/article")</code> (actually fetching the page), then sends the result back to the model as a "tool result" message. The model continues reasoning with that information.</p>

<h2>The tool definition</h2>

<p>Tools are described as JSON Schema. The model uses this schema to know what parameters to pass and what types they should be:</p>

<pre><code>{
  "name": "read_url",
  "description": "Fetch the content of a URL and return the text. Use when you need to read a web page.",
  "input_schema": {
    "type": "object",
    "properties": {
      "url": {
        "type": "string",
        "description": "The URL to fetch"
      }
    },
    "required": ["url"]
  }
}</code></pre>

<p>The description matters enormously. The model decides whether and when to use a tool based on the description. A vague description leads to incorrect or missed tool calls.</p>

<h2>Multi-step tool use</h2>

<p>A single task can require multiple sequential tool calls. "Research this company and summarize their recent news" might involve:</p>
<ol>
  <li>Search for the company name → returns URLs</li>
  <li>Read each URL → returns article content</li>
  <li>Model synthesizes content → writes summary</li>
</ol>

<p>This chain happens automatically if the model is in an agentic loop — a system that keeps running tool calls until the model returns a final text response instead of a tool call.</p>

<h2>Where MCP fits in</h2>

<p>Before MCP, every developer building an AI tool integration had to write the same plumbing: handle tool call parsing, execute the function, format the response, handle errors. And every integration was specific to one model and one application.</p>

<p>MCP standardizes this at the protocol level. An MCP server exposes tools over a standard protocol. Any MCP-compatible client (Claude Desktop, Cursor, custom apps) can discover and use those tools without custom integration code on either side.</p>

<table>
  <thead>
    <tr><th>Without MCP</th><th>With MCP</th></tr>
  </thead>
  <tbody>
    <tr><td>Custom tool format per model</td><td>Standard protocol, any client</td></tr>
    <tr><td>Tight coupling to specific app</td><td>Tools work across any compatible client</td></tr>
    <tr><td>Manual schema maintenance</td><td>Server advertises its own schema</td></tr>
    <tr><td>Local function calls only</td><td>Remote HTTP or local stdio</td></tr>
  </tbody>
</table>

<h2>The Toolora MCP server</h2>

<p>Toolora exposes 17 tools over MCP — PDF processing, OCR, QR codes, web scraping, format conversion, and memory. Claude (or any MCP-compatible client) can call these tools directly. The server handles authentication, rate limiting, and execution. You configure it once and the tools appear in your AI client's tool picker.</p>

<p>Get started at <a href="/mcp-hub">toolora.dev/mcp-hub</a>.</p>
    `.trim(),
  },

  {
    slug: "url-slug-seo-best-practices",
    title: "URL Slug Best Practices: Clean URLs That Rank Better",
    description: "The URL structure of your pages affects both SEO and usability. Here's what Google recommends, what to avoid, and how to structure slugs properly.",
    date: "2026-04-20",
    readTime: "4 min read",
    category: "Developer Tools",
    keywords: ["url slug", "seo url structure", "clean urls", "url slug best practices", "url optimization seo"],
    content: `
<p>A URL slug is the part of the URL that identifies a specific page. In <code>toolora.dev/blog/url-slug-seo-best-practices</code>, the slug is <code>url-slug-seo-best-practices</code>. Getting this right is a low-effort, high-impact SEO task.</p>

<h2>The Google guidelines (simplified)</h2>

<ul>
  <li>Use words that describe the content — not IDs or parameters</li>
  <li>Use hyphens to separate words, not underscores or spaces</li>
  <li>Keep URLs short — shorter correlates with better rankings and link sharing</li>
  <li>Avoid unnecessary subdirectories</li>
  <li>Use lowercase only</li>
  <li>Don't repeat words — <code>/blog/seo-seo-tips</code> is wrong</li>
</ul>

<h2>Hyphen vs underscore</h2>

<p>Google's John Mueller has confirmed multiple times: use hyphens. Underscores don't separate words in Google's URL parser — <code>seo_tips</code> is treated as one word "seotips" rather than two words "seo" and "tips." Hyphens create word boundaries that the crawler respects.</p>

<h2>URL length</h2>

<p>Studies consistently find that shorter URLs outperform longer ones. Aim for under 75 characters for the full URL. For slugs, 3–5 words is the sweet spot. You don't need to include every word from the title — just the core keyword phrase.</p>

<table>
  <thead>
    <tr><th>Long (avoid)</th><th>Short (better)</th></tr>
  </thead>
  <tbody>
    <tr><td>/blog/how-to-write-for-search-engine-optimization-in-2026-the-complete-guide</td><td>/blog/seo-writing-guide</td></tr>
    <tr><td>/tools/documents/pdf-compression-tool-free-online</td><td>/tools/pdf-compress</td></tr>
    <tr><td>/articles/what-is-javascript-function-calling-and-how-does-mcp-protocol-work</td><td>/blog/ai-function-calling</td></tr>
  </tbody>
</table>

<h2>Parameters vs clean slugs</h2>

<p>Dynamic URLs with parameters (<code>/product?id=12345&ref=category</code>) don't rank well and are harder to share and remember. Static slug-based URLs (<code>/product/blue-running-shoes</code>) are better for SEO, caching, and usability.</p>

<p>If you must use parameters (e-commerce faceted navigation, for example), use canonical tags to tell Google which URL is the authoritative version.</p>

<h2>Changing a slug: handle carefully</h2>

<p>If a page already ranks and has backlinks, changing its URL will break those links and temporarily lose ranking position. Always:</p>
<ol>
  <li>Set up a 301 permanent redirect from the old URL to the new one</li>
  <li>Update internal links on your site</li>
  <li>Notify any high-value external sites that link to the old URL</li>
  <li>Update your sitemap</li>
</ol>

<p>A 301 passes most (not all) of the link equity to the new URL. Rankings typically recover within a few weeks to a couple of months.</p>

<h2>Folder depth</h2>

<p>Deep nesting (<code>/category/subcategory/article/page-slug</code>) signals less importance than shallower nesting (<code>/blog/page-slug</code>). Google doesn't have a strict limit, but pages more than 3 levels deep from the root are crawled less frequently. For most content, two levels is plenty.</p>

<p>The ideal structure for a blog or tools site: <code>domain.com/blog/slug</code> or <code>domain.com/tools/tool-name</code>. Simple, flat, descriptive.</p>
    `.trim(),
  },

  // ─── April 21 – May 15 batch ────────────────────────────────────────────────

  {
    slug: "json-vs-yaml-comparison",
    title: "JSON vs YAML: When to Use Each (And When to Convert)",
    description: "JSON and YAML store structured data but feel very different to read and write. Here's how they compare and when you'd choose one over the other.",
    date: "2026-04-21",
    readTime: "5 min read",
    category: "Developer Tools",
    content: `
<p>JSON and YAML store the same types of structured data — strings, numbers, booleans, arrays, and objects. But they look almost nothing alike, and they're used in very different contexts. Understanding the trade-offs helps you choose the right one and convert between them without surprises.</p>

<h2>The core difference: syntax philosophy</h2>

<p>JSON was designed to be machine-readable first. It's explicit, verbose, and unambiguous. Every string has quotes. Every object has braces. Every array has brackets. There's no room for misinterpretation.</p>

<p>YAML was designed to be human-readable first. It uses indentation to represent structure, quotes are optional for most strings, and it strips out a lot of the punctuation JSON requires. The result is cleaner to look at but trickier to parse correctly.</p>

<table>
  <thead>
    <tr><th>Feature</th><th>JSON</th><th>YAML</th></tr>
  </thead>
  <tbody>
    <tr><td>Comments</td><td>Not supported</td><td>Supported (<code>#</code>)</td></tr>
    <tr><td>String quotes</td><td>Required</td><td>Optional (usually)</td></tr>
    <tr><td>Multiline strings</td><td>Clunky (<code>\n</code>)</td><td>Clean (block scalars)</td></tr>
    <tr><td>Trailing commas</td><td>Not allowed</td><td>Not applicable</td></tr>
    <tr><td>Anchors / aliases</td><td>Not supported</td><td>Supported (<code>&amp;</code>, <code>*</code>)</td></tr>
    <tr><td>File size</td><td>Slightly larger</td><td>Slightly smaller</td></tr>
    <tr><td>Parse complexity</td><td>Simple</td><td>Complex (many edge cases)</td></tr>
  </tbody>
</table>

<h2>When JSON wins</h2>

<p><strong>APIs and web services.</strong> Every language has a JSON parser. JSON is the lingua franca of HTTP APIs. If you're sending data between services, use JSON.</p>

<p><strong>Configuration that machines write.</strong> If a program generates config (not a human), JSON's verbosity is irrelevant. Its lack of ambiguity matters more.</p>

<p><strong>When you need strict validation.</strong> JSON Schema is a mature ecosystem for validating JSON structure. YAML validation tooling is thinner.</p>

<h2>When YAML wins</h2>

<p><strong>Human-maintained configuration files.</strong> Kubernetes manifests, GitHub Actions workflows, Docker Compose files, and Ansible playbooks are all YAML. When humans write and edit config daily, YAML's readability pays off.</p>

<p><strong>When comments matter.</strong> JSON has no comments. If your config file needs explanatory notes inline, YAML is your only structured option (unless you use JSONC or JSON with Comments, which isn't standard).</p>

<p><strong>Multiline strings.</strong> YAML block scalars (<code>|</code> for literal, <code>&gt;</code> for folded) make long strings legible. In JSON, newlines require <code>\n</code> escape sequences embedded in a quoted string.</p>

<h2>The gotchas that catch people out</h2>

<p><strong>YAML's "Norway problem"</strong>: In older YAML specs (1.1), unquoted <code>NO</code> is parsed as the boolean <code>false</code>. So a country code like <code>NO</code> becomes <code>false</code> in your data. YAML 1.2 fixed this, but many parsers still use 1.1 rules. Always quote strings that could be misread as booleans.</p>

<p><strong>Tabs vs spaces</strong>: YAML forbids tabs for indentation. JSON doesn't care about whitespace at all. YAML indentation errors are silent on many parsers — the file just parses as something unexpected.</p>

<p><strong>Numbers that look like strings</strong>: <code>port: 8080</code> in YAML gives you the integer 8080. <code>version: 1.10</code> gives you the float 1.1 (trailing zero dropped). If you need a string, quote it: <code>version: "1.10"</code>.</p>

<h2>Converting between them</h2>

<p>Converting JSON to YAML or back is straightforward in principle — the data structures map 1:1. The edge cases are string types that look like other types, and the loss of comments when going YAML → JSON.</p>

<p>The <a href="/tools">Toolora CSV/JSON converter</a> handles format conversion in your browser. For YAML ↔ JSON specifically, any conversion runs client-side — your config data never leaves your machine.</p>

<h2>Which one should you default to?</h2>

<p>If you're building an API: JSON. If you're writing config that humans will maintain: YAML. If you're unsure: JSON, because it's harder to get wrong.</p>
    `.trim(),
  },

  {
    slug: "sha256-vs-md5-hash-comparison",
    title: "SHA-256 vs MD5: Which Hash Function Should You Use?",
    description: "MD5 is everywhere but broken for security. SHA-256 is the modern standard. Here's the difference, what each is still good for, and when you need something else entirely.",
    date: "2026-04-21",
    readTime: "5 min read",
    category: "Security",
    content: `
<p>Both MD5 and SHA-256 are hash functions — they take any input and produce a fixed-length fingerprint. But they were designed in different eras for different purposes, and treating them as interchangeable is a common mistake that has real security consequences.</p>

<h2>The quick answer</h2>

<table>
  <thead>
    <tr><th>Use case</th><th>Use this</th></tr>
  </thead>
  <tbody>
    <tr><td>Password hashing</td><td>bcrypt, Argon2, or scrypt — NOT MD5 or SHA-256</td></tr>
    <tr><td>Data integrity (checksums)</td><td>SHA-256 (or SHA-512)</td></tr>
    <tr><td>Digital signatures</td><td>SHA-256 (part of RSA-SHA256 or ECDSA)</td></tr>
    <tr><td>File deduplication</td><td>SHA-256 (MD5 acceptable if not adversarial)</td></tr>
    <tr><td>Non-security checksums</td><td>MD5 is fine (fast, widely supported)</td></tr>
    <tr><td>Anything security-critical</td><td>SHA-256 minimum, never MD5</td></tr>
  </tbody>
</table>

<h2>Why MD5 is broken for security</h2>

<p>MD5 produces a 128-bit hash. In 1996, researchers found weaknesses. By 2004, full collision attacks were demonstrated — meaning two different inputs can produce the same MD5 hash. By 2008, researchers created a rogue CA certificate using MD5 collisions. MD5 is now considered cryptographically broken for any security application.</p>

<p>This doesn't mean MD5 is useless. It's still fast and collision-resistant enough for non-adversarial checksums — like verifying a file download wasn't corrupted. But if an attacker could craft a malicious file with the same MD5 as a trusted file, MD5 gives you no protection.</p>

<h2>SHA-256: the current standard</h2>

<p>SHA-256 is part of the SHA-2 family, standardized by NIST in 2001. It produces a 256-bit hash. No practical collision attacks exist against SHA-256. It's used in:</p>

<ul>
  <li>TLS/HTTPS certificates (replacing SHA-1 in 2016)</li>
  <li>Bitcoin's proof-of-work algorithm</li>
  <li>Code signing and software distribution</li>
  <li>HMAC authentication (HMAC-SHA256)</li>
  <li>JWT signatures (RS256, HS256)</li>
</ul>

<h2>Why you still shouldn't use SHA-256 for passwords</h2>

<p>SHA-256 is fast. That's a problem for passwords. A modern GPU can compute billions of SHA-256 hashes per second. If an attacker gets your password database, they can brute-force common passwords in seconds.</p>

<p>Password hashing algorithms like bcrypt, Argon2, and scrypt are designed to be deliberately slow. They take configurable amounts of time and memory, making brute-force attacks expensive. The "right" choice for passwords is not SHA-256 — it's one of these purpose-built algorithms.</p>

<h2>SHA-1: the one in the middle</h2>

<p>SHA-1 (160-bit) was deprecated after the first practical collision was demonstrated in 2017 (Google's SHAttered attack). Browser vendors and certificate authorities stopped accepting SHA-1 certificates years ago. If you see SHA-1 in use anywhere, it should be replaced with SHA-256.</p>

<h2>SHA-3: the newer option</h2>

<p>SHA-3 (standardized 2015) uses a completely different internal design (Keccak sponge construction vs. Merkle-Damgård for SHA-2). It was created as a hedge against future weaknesses in SHA-2's design. SHA-2 hasn't been broken, so SHA-3 adoption is slow — but it's available and standardized if you need it.</p>

<h2>Hashing in the browser</h2>

<p>The Web Crypto API has built-in support for SHA-256: <code>crypto.subtle.digest('SHA-256', data)</code>. It's available in all modern browsers, runs fast, and produces the standard 256-bit output. No library needed for basic hashing.</p>

<p>Generate and verify SHA-256, SHA-1, MD5, and other hashes instantly at <a href="/tools">Toolora → Security → Hash Generator</a> — everything runs locally, nothing is sent to a server.</p>
    `.trim(),
  },

  {
    slug: "how-to-decode-base64-online",
    title: "How to Decode Base64 Online (And Why It's Not Encryption)",
    description: "Base64 is encoding, not encryption. Anyone can decode it instantly. Here's what Base64 actually does, when it's used, and how to decode it.",
    date: "2026-04-22",
    readTime: "4 min read",
    category: "Developer Tools",
    content: `
<p>Base64 looks like scrambled text — long strings of letters, numbers, plus signs, and slashes ending in equals signs. It's easy to mistake for encrypted data. It isn't. Base64 is a reversible encoding scheme that any tool can decode in milliseconds. If you need to keep data secret, Base64 is not the answer.</p>

<h2>What Base64 actually does</h2>

<p>Base64 converts binary data into a string of 64 printable ASCII characters (A–Z, a–z, 0–9, +, /). It exists to solve a practical problem: many systems that were designed for text (email, HTTP headers, URLs, XML attributes) can't handle arbitrary binary bytes. Base64 lets you embed binary data in text-safe contexts.</p>

<p>The conversion is simple math: every 3 bytes of input become 4 Base64 characters. This is why Base64-encoded data is about 33% larger than the original.</p>

<p>Example:</p>
<ul>
  <li>Input: <code>Hello</code> (5 bytes)</li>
  <li>Base64: <code>SGVsbG8=</code></li>
  <li>The trailing <code>=</code> is padding to make the length a multiple of 4</li>
</ul>

<h2>Common places you'll see Base64</h2>

<ul>
  <li><strong>Email attachments</strong> — MIME encoding converts binary attachments to Base64 so they can travel through email servers that only handle text</li>
  <li><strong>Data URIs</strong> — <code>&lt;img src="data:image/png;base64,..."&gt;</code> embeds images directly in HTML</li>
  <li><strong>JWTs</strong> — the header and payload sections of a JWT are Base64URL encoded (a variant using <code>-</code> and <code>_</code> instead of <code>+</code> and <code>/</code>)</li>
  <li><strong>API tokens and credentials</strong> — Basic Auth sends <code>username:password</code> as Base64 in the Authorization header</li>
  <li><strong>Cryptographic keys</strong> — PEM files (the <code>-----BEGIN CERTIFICATE-----</code> format) wrap Base64-encoded DER data</li>
</ul>

<h2>How to decode Base64</h2>

<p>In JavaScript (browser or Node): <code>atob('SGVsbG8=')</code> returns <code>'Hello'</code>. To encode: <code>btoa('Hello')</code> returns <code>'SGVsbG8='</code>.</p>

<p>In Python: <code>import base64; base64.b64decode('SGVsbG8=')</code></p>

<p>In bash: <code>echo 'SGVsbG8=' | base64 --decode</code></p>

<p>Or paste it into <a href="/tools">Toolora → Encoding → Base64 Encoder/Decoder</a>. No server involved — the decode happens entirely in your browser.</p>

<h2>Base64URL vs standard Base64</h2>

<p>Standard Base64 uses <code>+</code> and <code>/</code>, which have special meanings in URLs. Base64URL replaces them with <code>-</code> and <code>_</code>, making the output safe to use directly in URLs and filenames without percent-encoding. JWTs use Base64URL. Many API tokens do too. The decoding process is the same, just with a character substitution.</p>

<h2>The security mistake to avoid</h2>

<p>Never use Base64 as a way to "hide" data. If you're sending Base64-encoded data over HTTP (not HTTPS), anyone intercepting the traffic can decode it instantly. If you're storing Base64-encoded passwords, they're just as readable as plain text.</p>

<p>Base64 is for encoding, not security. Use encryption (AES, RSA) or hashing (bcrypt, Argon2) for anything that needs to be protected.</p>
    `.trim(),
  },

  {
    slug: "pdf-metadata-removal-guide",
    title: "How to Remove Metadata From PDFs Before Sending",
    description: "PDFs carry hidden metadata: author name, company, software version, creation date, and revision history. Here's how to strip it before sharing sensitive documents.",
    date: "2026-04-22",
    readTime: "5 min read",
    category: "Privacy",
    content: `
<p>Every PDF you create carries invisible information. When you save a Word document as PDF, the resulting file often contains your name, your company name, your operating system, the version of Word you used, the creation date, the last-modified date, and sometimes a revision history that includes previous versions of the document's content.</p>

<p>Before sending a PDF externally — to a client, a recruiter, a court, a journalist — it's worth knowing what metadata it contains and how to remove it.</p>

<h2>What metadata a PDF can contain</h2>

<ul>
  <li><strong>Document properties:</strong> Title, Author, Subject, Keywords, Creator (application), Producer (PDF library)</li>
  <li><strong>XMP metadata:</strong> An embedded XML block with creation date, modification date, and format details</li>
  <li><strong>Revision history:</strong> Some PDFs embed the editing history from the source application</li>
  <li><strong>Comments and annotations:</strong> Sticky notes, tracked changes, and highlights that may not be visible when printed</li>
  <li><strong>Form field data:</strong> Partially filled-in forms that retain previous answers</li>
  <li><strong>Hidden text:</strong> Text that's white on a white background, or positioned off-page</li>
  <li><strong>Embedded fonts and file attachments:</strong> Original source files sometimes embedded in the PDF</li>
</ul>

<h2>How to check what metadata your PDF has</h2>

<p>On macOS: open the PDF in Preview → File → Get Info. Basic metadata shows here. For deeper inspection, open Terminal and run: <code>exiftool your-file.pdf</code> (requires ExifTool). This shows every metadata field.</p>

<p>On Windows: open the PDF in Acrobat Reader → File → Properties. The Description tab shows document properties.</p>

<p>For a quick browser-based check: PDF.js-based tools can read document properties without uploading the file. Many metadata strippers also show you what they found before removing it.</p>

<h2>How to remove PDF metadata</h2>

<p><strong>Adobe Acrobat Pro:</strong> Tools → Redact → Sanitize Document. This is the most thorough option and also removes hidden content, embedded scripts, and form data.</p>

<p><strong>ExifTool (command line):</strong> <code>exiftool -all= your-file.pdf</code> — removes all metadata fields. Free, works on macOS/Linux/Windows, handles batch processing.</p>

<p><strong>Print to PDF:</strong> Open the PDF in any reader, print it to a new PDF using the built-in PDF printer. The resulting file loses most metadata because it's essentially a fresh render. Quick but not forensically thorough.</p>

<p><strong>Browser-based tools:</strong> Tools that run in the browser process your PDF locally without uploading it. This is the privacy-correct approach for sensitive documents.</p>

<h2>What to watch out for when using online tools</h2>

<p>Many "free PDF tools" are cloud-based — they upload your document to a server to process it. For contracts, legal documents, medical records, or anything confidential, this is a serious privacy problem. Your document may be stored, scanned, indexed, or subject to data breaches on that third-party server.</p>

<p>The safer alternative is client-side PDF processing — tools that run in your browser using WebAssembly or JavaScript, so your file never leaves your machine. Toolora's <a href="/tools">PDF tools</a> work this way. The metadata removal, compression, and merging all happen locally.</p>

<h2>Before you send</h2>

<p>A quick pre-send checklist:</p>
<ol>
  <li>Check metadata fields (author, company, application)</li>
  <li>Check for tracked changes or hidden annotations</li>
  <li>Check form fields aren't carrying over previous data</li>
  <li>Check that hidden text isn't present (select all, see if unexpected text highlights)</li>
  <li>Strip metadata and sanitize</li>
  <li>Re-check after stripping to confirm it worked</li>
</ol>

<p>Two minutes of checking can prevent an embarrassing (or professionally damaging) metadata leak.</p>
    `.trim(),
  },

  {
    slug: "css-units-px-em-rem-explained",
    title: "CSS Units Explained: px vs em vs rem (and When to Use Each)",
    description: "Choosing the wrong CSS unit leads to layouts that break under zoom, accessibility issues, and font sizes that don't scale correctly. Here's the practical guide.",
    date: "2026-04-23",
    readTime: "6 min read",
    category: "Developer Tools",
    content: `
<p>CSS has more than a dozen units for expressing sizes and distances. Most developers use three in practice — px, em, and rem — and struggle to remember when each one is appropriate. Here's a clear breakdown with rules you can actually apply.</p>

<h2>px: absolute pixels</h2>

<p>A CSS pixel (<code>px</code>) is not exactly one physical screen pixel — on a 2× Retina display, 1 CSS pixel = 2 physical pixels. But it behaves as an absolute unit: it doesn't scale with font size, zoom preferences, or parent elements.</p>

<p><strong>Use px for:</strong></p>
<ul>
  <li>Borders and dividers (<code>border: 1px solid</code>)</li>
  <li>Box shadows (<code>box-shadow: 0 2px 4px</code>)</li>
  <li>Fixed-size decorative elements that shouldn't scale</li>
  <li>Media query breakpoints (though this is debated)</li>
</ul>

<p><strong>Avoid px for:</strong> font sizes and spacing that should respect the user's browser font preferences. A user who has set their browser default font to 20px (common for accessibility) expects your font sizes to scale accordingly. Setting <code>font-size: 16px</code> in CSS overrides their preference.</p>

<h2>em: relative to the parent element</h2>

<p><code>1em</code> equals the computed font-size of the element's parent. If the parent is 16px, <code>1em = 16px</code>, <code>1.5em = 24px</code>, <code>0.75em = 12px</code>.</p>

<p>The problem: em compounds. If a parent is <code>1.5em</code> and a child is also <code>1.5em</code>, the child ends up at 2.25× the base size. This cascading effect makes em unpredictable for font sizes in nested components.</p>

<p><strong>Use em for:</strong></p>
<ul>
  <li>Padding and margin on elements where the spacing should scale with the element's own font size (<code>padding: 0.5em 1em</code> on a button that might be different sizes)</li>
  <li>Media queries where you want them to respond to the user's base font size (use <code>em</code> in media queries, not <code>rem</code> — Safari has historically had bugs with <code>rem</code> in media queries)</li>
</ul>

<h2>rem: relative to the root element</h2>

<p><code>1rem</code> always refers to the font-size of the <code>&lt;html&gt;</code> element. Browsers default this to 16px. Importantly, rem doesn't compound — no matter how deeply nested your element is, <code>1rem</code> is always the same size.</p>

<p><strong>Use rem for:</strong></p>
<ul>
  <li>Font sizes throughout your site — rem respects the user's browser font preference without cascading surprises</li>
  <li>Spacing at the layout level (section padding, gap in grid, margin between sections)</li>
  <li>Anything that should scale uniformly with the root font size</li>
</ul>

<p>A common pattern: set <code>html { font-size: 62.5%; }</code> so that <code>1rem = 10px</code>. Then <code>1.6rem = 16px</code>, <code>2.4rem = 24px</code>, etc. This makes the math easy while preserving user font preferences. (Note: this approach has accessibility trade-offs — users who set their default to 20px won't get 200% of 10px = 20px, they get 62.5% of 20px = 12.5px. The reset is controversial.)</p>

<h2>Other units worth knowing</h2>

<p><code>%</code> — percentage of the parent's size. Useful for widths and heights in fluid layouts.</p>

<p><code>vw / vh</code> — viewport width / viewport height. <code>100vw</code> is the full browser window width. Useful for full-screen sections.</p>

<p><code>ch</code> — width of the "0" character in the current font. <code>max-width: 65ch</code> creates a readable line length regardless of font size — a better approach than <code>max-width: 680px</code>.</p>

<p><code>clamp()</code> — fluid sizing between a minimum and maximum: <code>font-size: clamp(1rem, 2.5vw, 2rem)</code>. Scales smoothly between viewport sizes without media queries. The modern approach for responsive typography.</p>

<h2>The practical ruleset</h2>

<ul>
  <li><code>font-size</code>: always rem (or clamp for fluid)</li>
  <li><code>line-height</code>: unitless (e.g., <code>1.6</code>) — scales with font size automatically</li>
  <li>Component padding/margin: em (scales with the component's font size)</li>
  <li>Layout spacing: rem</li>
  <li>Borders, shadows: px</li>
  <li>Max-widths for text: ch</li>
  <li>Full-screen elements: vw/vh</li>
</ul>

<p>Following this consistently makes your layout more accessible and easier to reason about as the codebase grows.</p>
    `.trim(),
  },

  {
    slug: "what-is-jwt-how-it-works",
    title: "What Is a JWT? How JSON Web Tokens Work",
    description: "JWTs are everywhere in authentication. Here's exactly how they're structured, what the three parts contain, and how verification actually works.",
    date: "2026-04-23",
    readTime: "6 min read",
    category: "Security",
    content: `
<p>A JSON Web Token (JWT, pronounced "jot") is a compact, URL-safe way to transmit a signed set of claims between two parties. They're used in authentication and authorization — when you log in to a service and get a token back, there's a good chance it's a JWT.</p>

<h2>The three-part structure</h2>

<p>A JWT looks like this:</p>

<pre><code>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c</code></pre>

<p>Three Base64URL-encoded strings separated by dots:</p>
<ol>
  <li><strong>Header</strong> — algorithm and token type</li>
  <li><strong>Payload</strong> — the claims (data)</li>
  <li><strong>Signature</strong> — cryptographic proof of authenticity</li>
</ol>

<h2>The header</h2>

<p>Decoded, the header is typically: <code>{"alg": "HS256", "typ": "JWT"}</code></p>

<p><code>alg</code> specifies the signing algorithm. Common values:</p>
<ul>
  <li><code>HS256</code> — HMAC with SHA-256 (symmetric — same key signs and verifies)</li>
  <li><code>RS256</code> — RSA with SHA-256 (asymmetric — private key signs, public key verifies)</li>
  <li><code>ES256</code> — ECDSA with SHA-256 (asymmetric, more compact than RSA)</li>
</ul>

<h2>The payload</h2>

<p>Decoded, the payload contains claims — statements about the user or session. Standard claims:</p>

<ul>
  <li><code>sub</code> — subject (usually user ID)</li>
  <li><code>iss</code> — issuer (who created the token)</li>
  <li><code>aud</code> — audience (who should accept the token)</li>
  <li><code>exp</code> — expiration time (Unix timestamp)</li>
  <li><code>iat</code> — issued at (Unix timestamp)</li>
  <li><code>nbf</code> — not before (token not valid before this time)</li>
</ul>

<p>You can add any custom claims: <code>{"role": "admin", "plan": "pro"}</code>. This is what makes JWTs useful — you can embed user information in the token so the server doesn't need to look it up from a database on every request.</p>

<p><strong>Important:</strong> the payload is encoded, not encrypted. Anyone who has the token can decode and read the payload. Never put passwords, credit card numbers, or other secrets in a JWT payload.</p>

<h2>The signature</h2>

<p>The signature is calculated as:</p>

<pre><code>HMAC-SHA256(
  base64url(header) + "." + base64url(payload),
  secret
)</code></pre>

<p>For HS256, the secret is a key that only the server knows. For RS256, the server signs with a private key and exposes a public key (usually at a <code>/.well-known/jwks.json</code> endpoint) that anyone can use to verify tokens.</p>

<p>The signature guarantees that the header and payload haven't been tampered with. If you change one character of the payload, the signature no longer matches and the token is rejected.</p>

<h2>How JWT authentication works</h2>

<ol>
  <li>User logs in with username and password</li>
  <li>Server verifies credentials</li>
  <li>Server creates a JWT with user claims, signs it, and returns it</li>
  <li>Client stores the JWT (usually in memory or a cookie)</li>
  <li>Client sends the JWT in the <code>Authorization: Bearer &lt;token&gt;</code> header on subsequent requests</li>
  <li>Server verifies the signature, checks expiry, and processes the request</li>
</ol>

<p>No session storage needed on the server. Each token is self-contained and verifiable.</p>

<h2>The security risks</h2>

<p><strong>Algorithm confusion attacks:</strong> If your server accepts any algorithm specified in the header, an attacker can change the header to <code>alg: none</code> (no signature required) or switch from RS256 to HS256 using the public key as the HMAC secret. Always hardcode the expected algorithm in your verification code.</p>

<p><strong>Storage:</strong> Storing JWTs in localStorage exposes them to XSS attacks. Cookies with <code>HttpOnly</code> and <code>Secure</code> flags are safer for long-lived tokens.</p>

<p><strong>Revocation:</strong> JWTs are stateless — there's no built-in revocation mechanism. A token stays valid until it expires. If you need immediate revocation (on logout, on account suspension), you need a token blacklist or use short expiry times.</p>

<h2>Inspect a JWT</h2>

<p>Paste any JWT into <a href="/tools">Toolora → Security → JWT Decoder</a> to see the decoded header and payload. The decoding happens in your browser — unlike jwt.io, your token isn't sent to any server.</p>
    `.trim(),
  },

  {
    slug: "how-to-validate-email-address",
    title: "How to Validate an Email Address (Without Sending an Email)",
    description: "Regex alone gets email validation wrong. Here's what actually works, what the edge cases are, and why the only true validation is sending an email.",
    date: "2026-04-24",
    readTime: "5 min read",
    category: "Developer Tools",
    content: `
<p>Email validation seems simple until you look at what a valid email address actually is. The specification (RFC 5321/5322) allows characters most developers would never expect. Writing a regex that correctly validates email addresses while rejecting invalid ones is harder than it looks — and even a perfect regex can't tell you whether the address actually exists.</p>

<h2>What the spec actually allows</h2>

<p>Technically valid email addresses include:</p>
<ul>
  <li><code>user+tag@example.com</code> — plus-addressing, commonly used</li>
  <li><code>user.name@example.co.uk</code> — dots in local part and multi-part TLDs</li>
  <li><code>"user name"@example.com</code> — quoted strings allow spaces in local part</li>
  <li><code>user@[192.168.1.1]</code> — IP address literal as domain</li>
  <li><code>user@xn--nxasmq6b.com</code> — internationalized domain (punycode)</li>
  <li><code>あいう@example.com</code> — internationalized email (RFC 6530)</li>
</ul>

<p>And technically invalid but commonly accepted:</p>
<ul>
  <li><code>user@localhost</code> — no TLD, but valid per spec</li>
  <li><code>user@example</code> — single-label domain</li>
</ul>

<h2>Why regex email validation is always wrong (in some direction)</h2>

<p>Simple regex like <code>/^[^\s@]+@[^\s@]+\.[^\s@]+$/</code> is too permissive — it accepts <code>@@@.@</code>.</p>

<p>Complex RFC-compliant regex runs to thousands of characters and still trips on edge cases. And both approaches have the same fundamental problem: they validate the format, not the existence.</p>

<p><code>absolutely.fake@gmail.com</code> passes any regex. It's not a real account.</p>

<h2>What you should actually do</h2>

<p><strong>For basic format check:</strong> Use a simple regex that catches obvious mistakes without being overly restrictive.</p>

<pre><code>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/</code></pre>

<p>This rejects strings with no @, multiple @s, spaces, and domains with no TLD. It passes almost all real email addresses and most invalid ones that users won't actually type. It's not RFC-complete but it's practically correct for 99.9% of cases.</p>

<p><strong>HTML5 input validation:</strong> <code>&lt;input type="email"&gt;</code> provides browser-native validation that's more complete than simple regex and free. Use it.</p>

<p><strong>For real validation:</strong> Send a confirmation email. This is the only method that verifies both format and existence. Require the user to click a link before granting full access. This is the industry standard for a reason.</p>

<h2>Additional checks worth doing</h2>

<p><strong>MX record lookup:</strong> Check that the domain has mail exchanger records — meaning it can receive email. No MX records usually means the address is fake. You can do this server-side with a DNS lookup. It doesn't guarantee deliverability but eliminates clearly invalid domains.</p>

<p><strong>Disposable email detection:</strong> Services like Mailcheck or open-source blocklists of known disposable email providers (Mailinator, Guerrilla Mail, 10 Minute Mail, etc.) let you block throwaway addresses. Useful for registrations where you need persistent accounts.</p>

<p><strong>Normalization before storing:</strong> Lowercase the domain part. Some providers (Gmail) also ignore dots in the local part and treat plus-addresses as the same account. Normalize consistently to avoid duplicate accounts.</p>

<h2>One practical approach</h2>

<ol>
  <li>Client-side: HTML5 <code>type="email"</code> for immediate feedback</li>
  <li>Server-side on submission: simple regex + MX record check</li>
  <li>After registration: email confirmation link required to activate account</li>
</ol>

<p>Steps 1 and 2 catch typos and obvious fakes. Step 3 confirms the address actually works. Nothing more is needed for most applications.</p>
    `.trim(),
  },

  {
    slug: "yaml-to-json-converter-guide",
    title: "YAML to JSON: How the Conversion Works and What to Watch Out For",
    description: "Converting between YAML and JSON is mostly mechanical, but a few YAML features have no JSON equivalent. Here's what changes and what to watch out for.",
    date: "2026-04-24",
    readTime: "4 min read",
    category: "Developer Tools",
    content: `
<p>YAML and JSON represent the same data model — strings, numbers, booleans, null, arrays, and objects. Converting between them is mostly straightforward, but a few YAML features don't map directly to JSON, and some YAML quirks produce surprising JSON output.</p>

<h2>What converts cleanly</h2>

<p>Most YAML converts to JSON without any information loss:</p>

<pre><code># YAML
name: Alice
age: 30
active: true
tags:
  - admin
  - user</code></pre>

<pre><code>// JSON
{
  "name": "Alice",
  "age": 30,
  "active": true,
  "tags": ["admin", "user"]
}</code></pre>

<p>Nested objects, arrays of objects, null values, and multiline strings all convert cleanly. The structure is preserved exactly.</p>

<h2>What gets lost in YAML → JSON</h2>

<p><strong>Comments:</strong> YAML supports <code># comments</code>. JSON does not. All comments are stripped during conversion. If you need to preserve documentation alongside your data, you'll need to restructure (add a <code>_comment</code> field) or keep the YAML source.</p>

<p><strong>YAML anchors and aliases:</strong> YAML lets you define a block once and reference it elsewhere:</p>

<pre><code>defaults: &amp;defaults
  timeout: 30
  retries: 3

production:
  &lt;&lt;: *defaults
  host: prod.example.com</code></pre>

<p>When converted to JSON, anchors are resolved — the referenced content is inlined at each alias. The resulting JSON is larger and repetitive, but semantically equivalent.</p>

<p><strong>Block scalars:</strong> YAML's multiline string syntax (<code>|</code> literal block, <code>&gt;</code> folded) converts to a regular JSON string with newlines. No information loss, but the readability difference is significant.</p>

<h2>YAML quirks that affect the JSON output</h2>

<p><strong>Implicit typing:</strong> YAML tries to infer types. Values that look like booleans, numbers, or null are interpreted as such unless quoted. This affects JSON output:</p>

<table>
  <thead>
    <tr><th>YAML value</th><th>JSON output</th><th>Why</th></tr>
  </thead>
  <tbody>
    <tr><td><code>yes</code></td><td><code>true</code></td><td>YAML 1.1 treats yes/no/on/off as booleans</td></tr>
    <tr><td><code>NO</code></td><td><code>false</code></td><td>Same (the "Norway problem")</td></tr>
    <tr><td><code>1.0</code></td><td><code>1.0</code></td><td>Parsed as float</td></tr>
    <tr><td><code>1_000</code></td><td><code>1000</code></td><td>YAML 1.1 allows underscores in numbers</td></tr>
    <tr><td><code>0o17</code></td><td><code>15</code></td><td>Octal notation in YAML 1.1</td></tr>
    <tr><td><code>~</code></td><td><code>null</code></td><td>Tilde means null in YAML</td></tr>
  </tbody>
</table>

<p>If any of these unintended conversions could affect your data, quote the values in your YAML source.</p>

<h2>Converting JSON to YAML</h2>

<p>JSON → YAML is always lossless because JSON is a subset of valid YAML. Every valid JSON document is also valid YAML 1.2. The conversion just reformats: removes quotes where optional, converts braces to indentation, and converts bracket arrays to dash notation.</p>

<h2>When to use the converter</h2>

<ul>
  <li>Converting Kubernetes YAML configs to test with JSON-only tools</li>
  <li>Moving CI/CD pipeline definitions into a JSON-based API</li>
  <li>Debugging YAML by seeing what it actually parses as in JSON</li>
  <li>Generating JSON configs from human-readable YAML templates</li>
</ul>

<p>Convert YAML ↔ JSON instantly at <a href="/tools">Toolora → Converters</a>. The conversion runs in your browser — no server sees your config data.</p>
    `.trim(),
  },

  {
    slug: "chrome-extensions-privacy-risks",
    title: "Chrome Extensions and Your Privacy: What They Can Actually See",
    description: "Chrome extensions can read every page you visit, intercept your passwords, and modify web pages silently. Here's what the permissions actually mean.",
    date: "2026-04-25",
    readTime: "6 min read",
    category: "Privacy",
    content: `
<p>Chrome extensions are useful enough that most people install several without thinking much about what they're granting access to. The permissions dialog exists, but it's vague — "read and change all your data on websites you visit" sounds alarming, but it's the standard permission for most extensions. Here's what that actually means.</p>

<h2>The permission categories</h2>

<p><strong>"Read and change all your data on websites you visit"</strong> (<code>tabs</code> + <code>&lt;all_urls&gt;</code>): This is the broadest permission. An extension with this permission can read the full HTML of every page you load, extract any text including passwords typed into forms (before they're submitted), read cookies, inject scripts, and modify page content silently.</p>

<p><strong>"Read your browsing history"</strong> (<code>history</code>): Full access to your browser history, including URLs, timestamps, and visit counts.</p>

<p><strong>"Manage your downloads"</strong> (<code>downloads</code>): Can initiate downloads and see your download history.</p>

<p><strong>"Read and change your bookmarks"</strong> (<code>bookmarks</code>): Can read, create, modify, and delete bookmarks.</p>

<p><strong>"Communicate with cooperating native applications"</strong> (<code>nativeMessaging</code>): Can communicate with installed software on your computer — extending the extension's reach beyond the browser entirely.</p>

<h2>What an extension with broad permissions can do</h2>

<ul>
  <li>Read every email you open in Gmail</li>
  <li>Capture everything you type into forms — including passwords (before submission)</li>
  <li>See your online banking balance when you open the page</li>
  <li>Modify what you see on a page (adding content, removing warnings)</li>
  <li>Silently redirect links</li>
  <li>Exfiltrate your session cookies (which can be used to impersonate you)</li>
  <li>Read any data on pages gated behind login</li>
</ul>

<h2>The supply chain problem</h2>

<p>Extensions can be sold. You install an extension from a legitimate developer, trust it for months, and then the developer sells it to a new owner who adds data-collection code in a silent update. Chrome auto-updates extensions — you may not notice the change until it's too late.</p>

<p>This has happened repeatedly. Notable cases include extensions with millions of users that were sold and turned into adware or data harvesters after the original developers moved on.</p>

<h2>How to audit your extensions</h2>

<ol>
  <li>Go to <code>chrome://extensions</code></li>
  <li>Click "Details" on each extension</li>
  <li>Check "Site access" — extensions should have the minimum access they need</li>
  <li>Look at the permission list on the extension's Chrome Web Store page</li>
  <li>Check the last updated date — an extension that hasn't updated in 2+ years may be abandoned (and potentially sold)</li>
</ol>

<p>You can switch most extensions from "On all sites" to "On click" or "On specific sites" in the Site Access dropdown. This limits the damage if an extension turns malicious.</p>

<h2>The safer approach</h2>

<ul>
  <li><strong>Install fewer extensions.</strong> Every extension you install is a permanent browser-level trust decision.</li>
  <li><strong>Check the developer.</strong> Is it a well-known company? An established developer? Or an anonymous publisher?</li>
  <li><strong>Read the privacy policy.</strong> If it mentions "data collection," "analytics," or "sharing with partners," understand what that means.</li>
  <li><strong>Use browser-based tools instead.</strong> Many tasks people install extensions for — JSON formatting, color picking, word counting — can be done in purpose-built browser tools that don't require persistent access to all your tabs.</li>
</ul>

<p><a href="/tools">Toolora</a> is built as a browser-based alternative to extension-based utilities for exactly this reason. Your data stays in your browser tab and is never sent anywhere.</p>
    `.trim(),
  },

  {
    slug: "how-to-compress-images-web",
    title: "How to Compress Images for the Web Without Losing Quality",
    description: "Large images are the single most common cause of slow page loads. Here's how to compress them effectively, which formats to use, and what tools do the job without uploading your files.",
    date: "2026-04-25",
    readTime: "5 min read",
    category: "Tools",
    content: `
<p>Images account for the majority of bytes on most web pages. A photo uploaded at full resolution from a phone camera is typically 3–8MB. Properly compressed for the web, the same image can be 50–150KB without visible quality loss. That's a 20–50× reduction that directly improves load time, Core Web Vitals, and user experience.</p>

<h2>Understanding compression types</h2>

<p><strong>Lossy compression</strong> permanently discards information to reduce file size. JPEG and WebP both support lossy compression. Done correctly (quality 75–85 for JPEG, 75–80 for WebP), the difference is invisible to the human eye. Done aggressively (quality below 50), you get visible artifacts — blocky areas and color banding.</p>

<p><strong>Lossless compression</strong> reduces file size without discarding any data. PNG uses lossless compression. WebP and AVIF also support lossless modes. Lossless is appropriate for screenshots, icons, logos, and any image with sharp lines or text — lossy compression creates visible artifacts around high-contrast edges.</p>

<h2>Which format to use</h2>

<table>
  <thead>
    <tr><th>Format</th><th>Best for</th><th>Browser support</th><th>Typical saving vs JPEG</th></tr>
  </thead>
  <tbody>
    <tr><td>JPEG</td><td>Photos (legacy/fallback)</td><td>Universal</td><td>—</td></tr>
    <tr><td>PNG</td><td>Screenshots, transparency</td><td>Universal</td><td>—</td></tr>
    <tr><td>WebP</td><td>Photos + graphics</td><td>All modern browsers</td><td>25–35% smaller</td></tr>
    <tr><td>AVIF</td><td>Photos (highest compression)</td><td>Chrome, Firefox, Safari 16+</td><td>40–50% smaller</td></tr>
    <tr><td>SVG</td><td>Icons, logos, illustrations</td><td>Universal</td><td>Not applicable (vector)</td></tr>
  </tbody>
</table>

<p>For most new web projects: use WebP as the primary format with a JPEG fallback for older browsers. Use the <code>&lt;picture&gt;</code> element to serve AVIF to browsers that support it:</p>

<pre><code>&lt;picture&gt;
  &lt;source srcset="image.avif" type="image/avif"&gt;
  &lt;source srcset="image.webp" type="image/webp"&gt;
  &lt;img src="image.jpg" alt="..."&gt;
&lt;/picture&gt;</code></pre>

<h2>The right compression settings</h2>

<p>For JPEG photos: quality 75–85 is the sweet spot. Below 70 and most people can see compression artifacts. Above 85 and file sizes grow significantly for minimal visible improvement.</p>

<p>For WebP photos: quality 75–80 gives roughly equivalent visual quality to JPEG at 85, with smaller file size.</p>

<p>For PNG: run through a lossless optimizer (pngquant, oxipng) before using. You can often reduce PNG file sizes 30–50% without any visual difference.</p>

<h2>Resize before compressing</h2>

<p>Compression only goes so far if the image is unnecessarily large. A 4000×3000px image displayed at 800×600px on screen is doing 5× more work than needed. Resize the image to the largest size it will actually be displayed before compressing.</p>

<p>For responsive images, generate multiple sizes and use <code>srcset</code>:</p>

<pre><code>&lt;img 
  srcset="hero-400.webp 400w, hero-800.webp 800w, hero-1600.webp 1600w"
  sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1600px"
  src="hero-800.webp"
  alt="..."&gt;</code></pre>

<h2>Tools that don't upload your images</h2>

<p>Most image compression sites upload your photos to their servers to process them. For personal, medical, legal, or confidential images, this is a privacy concern.</p>

<p>Toolora's <a href="/tools">Image Compressor</a> runs entirely in your browser using WebAssembly. Your images are never uploaded — compression happens locally on your machine. The result is the same quality reduction without the privacy trade-off.</p>
    `.trim(),
  },

  {
    slug: "base64-images-css-tradeoffs",
    title: "Base64 Images in CSS: When It Helps and When It Hurts",
    description: "Embedding images as Base64 in CSS or HTML saves HTTP requests but increases file size and kills caching. Here's when the trade-off is worth it.",
    date: "2026-04-26",
    readTime: "4 min read",
    category: "Developer Tools",
    content: `
<p>Inlining images as Base64-encoded strings in CSS or HTML is a technique that eliminates the HTTP request for the image file. Instead of the browser fetching <code>/images/icon.svg</code>, the image data is embedded directly in the stylesheet or markup. This sounds like a performance win, but it often isn't.</p>

<h2>How it works</h2>

<p>A Base64 data URI looks like this in CSS:</p>

<pre><code>.icon {
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciI...');
}</code></pre>

<p>Or in HTML:</p>

<pre><code>&lt;img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..." alt="icon"&gt;</code></pre>

<p>The browser reads the data URI directly without making a network request.</p>

<h2>When it helps</h2>

<p><strong>Tiny icons used everywhere:</strong> A 200-byte SVG used on every page of a site is a legitimate candidate. The overhead of an HTTP request (TCP setup, headers, round-trip latency) can exceed the size of the icon itself on high-latency connections.</p>

<p><strong>Critical above-the-fold images:</strong> An image required for the first paint can be inlined to eliminate the render-blocking request. The LCP (Largest Contentful Paint) improvement can be measurable.</p>

<p><strong>Single-page tools and email templates:</strong> In self-contained HTML files or email HTML (which can't reference external resources reliably), inlining images is often the only practical option.</p>

<h2>When it hurts</h2>

<p><strong>Caching:</strong> External image files are cached by the browser separately from the CSS file. The image loads once and is reused. An inlined Base64 image is part of the CSS file — it can't be cached independently. Every time the CSS changes, users re-download all the inlined images too.</p>

<p><strong>File size:</strong> Base64 encoding inflates binary data by ~33%. A 10KB PNG becomes ~13.3KB as Base64. For large images, this overhead is significant.</p>

<p><strong>CSS file bloat:</strong> Inlining several images makes your CSS file large, which delays stylesheet parsing. The browser can't render the page until CSS is parsed — a large CSS file is a rendering bottleneck.</p>

<p><strong>HTTP/2 and HTTP/3:</strong> The original motivation for request bundling was HTTP/1.1's limit of ~6 parallel connections per domain. HTTP/2 multiplexes unlimited requests over a single connection. The overhead of an extra request is much lower now, weakening the argument for inlining.</p>

<h2>The practical rule</h2>

<p>Inline Base64 images only when:</p>
<ul>
  <li>The image is under 1KB</li>
  <li>The image is used on nearly every page</li>
  <li>The image changes infrequently</li>
  <li>The self-contained file requirement exists (email, offline HTML)</li>
</ul>

<p>For everything else, serve images as separate files with appropriate caching headers (<code>Cache-Control: max-age=31536000, immutable</code> for versioned assets).</p>

<p>Convert between image files and Base64 data URIs at <a href="/tools">Toolora → Encoding → Base64 Image Encoder</a> — useful when you do have a legitimate use case for inlining.</p>
    `.trim(),
  },

  {
    slug: "what-is-rate-limiting-api",
    title: "What Is Rate Limiting? How APIs Protect Themselves",
    description: "Rate limiting controls how many requests a client can make in a given time window. Here's how it works, what the common algorithms are, and how to handle 429 errors.",
    date: "2026-04-26",
    readTime: "5 min read",
    category: "Developer Tools",
    content: `
<p>Every API you use has some form of rate limiting. Without it, a single badly-written script or a sudden traffic spike could overwhelm a service and make it unusable for everyone. Rate limiting protects the API provider, prevents abuse, and (with tiered limits) creates a monetization structure.</p>

<h2>What rate limiting actually enforces</h2>

<p>Rate limits define a maximum number of requests allowed within a time window, per some identifier. Common identifiers:</p>

<ul>
  <li><strong>IP address:</strong> Easy to implement, bypassed by rotating IPs or proxies</li>
  <li><strong>API key:</strong> Standard for authenticated APIs — each key has its own quota</li>
  <li><strong>User account:</strong> The limit follows the user across all their API keys or sessions</li>
  <li><strong>Endpoint-specific:</strong> Some endpoints (expensive operations) have lower limits than others</li>
</ul>

<p>Common limit structures: "100 requests per minute," "10,000 requests per day," "5 concurrent connections," or combinations of these.</p>

<h2>Rate limiting algorithms</h2>

<p><strong>Fixed window:</strong> The simplest. Count requests in a fixed time bucket (e.g., "the current minute"). Reset the counter at the start of each window. Problem: a client can burst 100 requests at 00:59 and another 100 at 01:00, effectively getting 200 in 2 seconds.</p>

<p><strong>Sliding window:</strong> Instead of a fixed reset time, look at the last N seconds/minutes continuously. More accurate, slightly more expensive to implement.</p>

<p><strong>Token bucket:</strong> Each client gets a bucket of tokens. Each request consumes a token. Tokens are refilled at a steady rate. Clients can burst up to the bucket capacity, then are limited to the refill rate. This allows natural traffic bursts without abuse.</p>

<p><strong>Leaky bucket:</strong> Requests enter a queue. The queue processes at a fixed rate. Excess requests overflow (are rejected). Produces very steady output regardless of input bursts — good for protecting backend services that can only handle constant throughput.</p>

<h2>Reading rate limit headers</h2>

<p>Most APIs return headers telling you the current state of your rate limit:</p>

<pre><code>X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 943
X-RateLimit-Reset: 1714608000
Retry-After: 60</code></pre>

<p><code>X-RateLimit-Reset</code> is a Unix timestamp when your window resets. <code>Retry-After</code> appears on 429 responses telling you how many seconds to wait. Not all APIs use these headers consistently — check the specific API's documentation.</p>

<h2>Handling 429 Too Many Requests</h2>

<p>When you hit a rate limit, the server returns HTTP 429. The correct response is exponential backoff with jitter:</p>

<ol>
  <li>Catch the 429 response</li>
  <li>Read the <code>Retry-After</code> header if present and wait that long</li>
  <li>If no header, wait: <code>baseDelay * 2^attempt + random(0, 1000ms)</code></li>
  <li>Retry the request</li>
  <li>Give up after a maximum number of attempts</li>
</ol>

<p>The jitter (random component) prevents thundering herd — if many clients all hit the limit simultaneously and all retry at the same time, they'll all hit the limit again simultaneously. Jitter staggers the retries.</p>

<h2>Building rate-limit-aware code</h2>

<ul>
  <li>Track your remaining requests from the headers and slow down proactively — don't wait for a 429</li>
  <li>Use request queuing libraries that handle rate limiting automatically</li>
  <li>Cache responses wherever possible to reduce request volume</li>
  <li>Use webhooks instead of polling where the API supports it</li>
  <li>If you're consistently hitting limits, it's time to upgrade your API tier or optimize your request patterns</li>
</ul>
    `.trim(),
  },

  {
    slug: "how-to-read-http-headers",
    title: "How to Read HTTP Headers and What They Tell You",
    description: "HTTP headers carry metadata about requests and responses that most developers only look at when something breaks. Here's what the important ones mean.",
    date: "2026-04-27",
    readTime: "6 min read",
    category: "Developer Tools",
    content: `
<p>Every HTTP request and response carries a set of headers — key-value pairs that contain metadata about the message. Most developers glance at them in DevTools when debugging, but they contain a lot of actionable information about caching, security, content, and authentication that's worth understanding deeply.</p>

<h2>Request headers (client → server)</h2>

<p><strong>Authorization:</strong> Carries authentication credentials. Common formats:</p>
<ul>
  <li><code>Authorization: Bearer eyJhbGci...</code> — JWT or OAuth token</li>
  <li><code>Authorization: Basic dXNlcjpwYXNz</code> — Base64-encoded username:password</li>
  <li><code>Authorization: ApiKey sk-123...</code> — API key (format varies by provider)</li>
</ul>

<p><strong>Content-Type:</strong> Tells the server what format the request body is in:</p>
<ul>
  <li><code>application/json</code> — JSON body</li>
  <li><code>application/x-www-form-urlencoded</code> — HTML form submission</li>
  <li><code>multipart/form-data</code> — File upload with form data</li>
  <li><code>text/plain</code> — Plain text body</li>
</ul>

<p><strong>Accept:</strong> Tells the server what response formats the client can handle: <code>Accept: application/json, text/html;q=0.9</code>. The <code>q=</code> value is a preference weight (0–1).</p>

<p><strong>User-Agent:</strong> Identifies the client: browser version, OS, bot name. Sites use this for device detection, A/B testing, and bot blocking. Easily spoofed.</p>

<p><strong>Cookie:</strong> Sends all cookies for the domain. Handled automatically by the browser, but relevant when debugging auth issues.</p>

<p><strong>Origin / Referer:</strong> <code>Origin</code> is the scheme+host that made the request (used in CORS). <code>Referer</code> is the full URL of the page that initiated the request. Note: "Referer" is a misspelling of "Referrer" that has been in the spec since 1996.</p>

<h2>Response headers (server → client)</h2>

<p><strong>Content-Type:</strong> Same as request, but now telling the client how to interpret the response: <code>Content-Type: application/json; charset=utf-8</code>.</p>

<p><strong>Cache-Control:</strong> Controls caching behavior:</p>
<ul>
  <li><code>no-cache</code> — can cache but must revalidate with server before using</li>
  <li><code>no-store</code> — don't cache at all (for sensitive data)</li>
  <li><code>max-age=3600</code> — cache for 1 hour</li>
  <li><code>immutable</code> — content won't change; skip revalidation (for versioned assets)</li>
  <li><code>public</code> — can be cached by CDNs; <code>private</code> — only the user's browser</li>
</ul>

<p><strong>ETag:</strong> A fingerprint of the response content. Clients send it back in <code>If-None-Match</code> headers. If the content hasn't changed, the server returns 304 Not Modified instead of resending the full response. Saves bandwidth.</p>

<p><strong>Location:</strong> Used with 3xx redirects to tell the client where to go next.</p>

<p><strong>Set-Cookie:</strong> Sets a cookie with options: <code>Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Strict; Max-Age=86400</code></p>
<ul>
  <li><code>HttpOnly</code> — JavaScript can't read this cookie (protects against XSS)</li>
  <li><code>Secure</code> — only sent over HTTPS</li>
  <li><code>SameSite=Strict</code> — never sent in cross-site requests (CSRF protection)</li>
</ul>

<h2>Security headers</h2>

<p><strong>Strict-Transport-Security (HSTS):</strong> <code>max-age=31536000; includeSubDomains</code> — tells browsers to always use HTTPS for this domain for the specified period. Prevents SSL stripping attacks.</p>

<p><strong>X-Content-Type-Options: nosniff</strong> — prevents browsers from MIME-sniffing the response type. Stops browsers from executing a JavaScript file served as <code>text/plain</code>.</p>

<p><strong>X-Frame-Options: DENY</strong> — prevents the page from being embedded in an iframe. Protects against clickjacking. Superseded by CSP's <code>frame-ancestors</code> directive.</p>

<p><strong>Content-Security-Policy:</strong> The most powerful security header. Specifies which sources are allowed for scripts, styles, images, and more. Worth a <a href="/blog/what-is-content-security-policy">dedicated article</a>.</p>

<h2>How to inspect headers</h2>

<p>In Chrome DevTools: Network tab → select any request → Headers tab. You'll see both request and response headers. The "Raw" view shows exactly what was sent.</p>

<p>In curl: <code>curl -I https://example.com</code> for response headers only, or <code>curl -v</code> for full request + response headers.</p>
    `.trim(),
  },

  {
    slug: "robots-txt-guide-seo",
    title: "robots.txt: What It Is, How It Works, and Common Mistakes",
    description: "robots.txt tells search engine crawlers which pages to visit and which to skip. Here's the syntax, what it can and can't do, and mistakes that accidentally block indexing.",
    date: "2026-04-27",
    readTime: "5 min read",
    category: "SEO",
    content: `
<p>robots.txt is a text file at the root of your website that tells web crawlers what they're allowed to fetch. Google, Bing, and other search engines check this file before crawling your site. Getting it wrong can accidentally block your entire site from being indexed — a mistake that's more common than you'd think.</p>

<h2>The basic syntax</h2>

<pre><code>User-agent: *
Disallow: /admin/
Disallow: /private/
Allow: /

User-agent: Googlebot
Disallow: /staging/

Sitemap: https://example.com/sitemap.xml</code></pre>

<p><code>User-agent</code> specifies which crawler the rules apply to. <code>*</code> means all crawlers. <code>Disallow</code> blocks a path. <code>Allow</code> explicitly permits a path (useful for allowing a subdirectory within a blocked parent). <code>Sitemap</code> tells crawlers where to find your sitemap.</p>

<h2>What robots.txt can do</h2>

<ul>
  <li>Prevent crawlers from fetching specific URLs or URL patterns</li>
  <li>Reduce crawl budget waste on low-value pages (admin, search results, duplicate parameters)</li>
  <li>Tell crawlers where your sitemap is</li>
  <li>Apply different rules to different crawlers</li>
</ul>

<h2>What robots.txt cannot do</h2>

<p><strong>It does not prevent indexing.</strong> This is the most important misunderstanding. If another site links to a page you've disallowed, Google may still index that page — it just won't crawl the page itself. It knows the URL exists from the link. To prevent a page from appearing in search results, use a <code>noindex</code> meta tag or <code>X-Robots-Tag</code> header.</p>

<p><strong>It is not access control.</strong> Anyone can access robots.txt and see which URLs you're trying to hide. It's a courtesy to well-behaved crawlers, not a security measure. Sensitive pages need authentication, not robots.txt rules.</p>

<p><strong>Malicious crawlers ignore it.</strong> robots.txt is a convention that legitimate crawlers follow. Scrapers and bad bots often don't.</p>

<h2>Common mistakes</h2>

<p><strong>Blocking everything accidentally:</strong></p>
<pre><code>User-agent: *
Disallow: /</code></pre>
<p>This tells all crawlers to stay out of your entire site. If this is in your robots.txt, nothing will be indexed. Check for this immediately if your site has dropped from search results.</p>

<p><strong>Blocking CSS and JavaScript files:</strong> Google needs to render your pages to understand their content. If your CSS and JS are in a directory that's disallowed, Google sees your site as an unstyled, non-functional page and may rank it poorly.</p>

<p><strong>Forgetting the trailing slash:</strong> <code>Disallow: /admin</code> blocks <code>/admin</code>, <code>/admin-panel</code>, and <code>/administration</code>. <code>Disallow: /admin/</code> only blocks the directory. Be specific.</p>

<p><strong>Using robots.txt for staging:</strong> If your staging site is at a different domain or subdomain, it needs its own robots.txt. If it's a path on your main domain, disallowing it in robots.txt only prevents crawling — it won't prevent indexing if the staging URL is linked from somewhere.</p>

<h2>Testing your robots.txt</h2>

<p>Google Search Console has a robots.txt tester that lets you check whether specific URLs would be blocked or allowed. It also shows the live robots.txt that Googlebot is seeing. This is the first tool to use when debugging crawl or indexing issues.</p>

<p>Your robots.txt should always be at <code>https://yourdomain.com/robots.txt</code> — never in a subdirectory. The standard requires it at the root.</p>
    `.trim(),
  },

  {
    slug: "sitemap-xml-guide-seo",
    title: "XML Sitemaps: How to Create One and Get Google to Read It",
    description: "A sitemap tells search engines which pages exist on your site. Here's the format, what to include and exclude, and how to submit it to Google Search Console.",
    date: "2026-04-28",
    readTime: "5 min read",
    category: "SEO",
    content: `
<p>A sitemap is a file that lists the URLs you want search engines to know about. It's not a guarantee of indexing — Google decides what to index, not you — but it helps crawlers discover pages that might not be easily reached through internal links, especially for new sites.</p>

<h2>The XML format</h2>

<pre><code>&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"&gt;
  &lt;url&gt;
    &lt;loc&gt;https://example.com/&lt;/loc&gt;
    &lt;lastmod&gt;2026-04-01&lt;/lastmod&gt;
    &lt;changefreq&gt;weekly&lt;/changefreq&gt;
    &lt;priority&gt;1.0&lt;/priority&gt;
  &lt;/url&gt;
  &lt;url&gt;
    &lt;loc&gt;https://example.com/blog/post-title&lt;/loc&gt;
    &lt;lastmod&gt;2026-03-15&lt;/lastmod&gt;
    &lt;changefreq&gt;monthly&lt;/changefreq&gt;
    &lt;priority&gt;0.8&lt;/priority&gt;
  &lt;/url&gt;
&lt;/urlset&gt;</code></pre>

<p>The only required field is <code>&lt;loc&gt;</code>. The others are optional hints:</p>

<ul>
  <li><code>&lt;lastmod&gt;</code> — date the page was last significantly changed (ISO 8601 format)</li>
  <li><code>&lt;changefreq&gt;</code> — how often the page typically changes (ignored by Google in practice)</li>
  <li><code>&lt;priority&gt;</code> — relative importance within your site (0.0–1.0; also largely ignored by Google)</li>
</ul>

<h2>What to include</h2>

<ul>
  <li>All canonical, indexable pages</li>
  <li>Pages you actively want in search results</li>
  <li>The canonical URL (if you have both www and non-www versions, pick one)</li>
</ul>

<h2>What to exclude</h2>

<ul>
  <li>Duplicate pages (paginated versions, URL parameter variants)</li>
  <li>Pages with <code>noindex</code> tags — including a noindex page in your sitemap sends contradictory signals</li>
  <li>Admin pages, login pages, thank-you pages</li>
  <li>Redirected URLs — only include the final destination URL</li>
  <li>Broken pages (404s)</li>
</ul>

<h2>Sitemap index files</h2>

<p>Google supports a maximum of 50,000 URLs per sitemap file and 50MB uncompressed. For large sites, use a sitemap index file that references multiple sitemap files:</p>

<pre><code>&lt;sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"&gt;
  &lt;sitemap&gt;
    &lt;loc&gt;https://example.com/sitemap-blog.xml&lt;/loc&gt;
  &lt;/sitemap&gt;
  &lt;sitemap&gt;
    &lt;loc&gt;https://example.com/sitemap-tools.xml&lt;/loc&gt;
  &lt;/sitemap&gt;
&lt;/sitemapindex&gt;</code></pre>

<h2>How to submit to Google</h2>

<ol>
  <li>Host your sitemap at a predictable URL: <code>https://yourdomain.com/sitemap.xml</code></li>
  <li>Reference it in your robots.txt: <code>Sitemap: https://yourdomain.com/sitemap.xml</code></li>
  <li>Submit it in Google Search Console: Sitemaps → Add sitemap → enter the URL → Submit</li>
</ol>

<p>Google Search Console shows you how many URLs were submitted vs. how many were indexed. A large discrepancy tells you something's wrong — either the pages have quality issues, are duplicates, or have other indexing signals that are causing Google to skip them.</p>

<h2>Dynamic sitemaps</h2>

<p>For sites with content that changes frequently (blogs, e-commerce, tool sites), generate your sitemap dynamically. In a React/Node app, a route that generates XML from your database or content array is more maintainable than a static file you update manually.</p>

<p>For the Toolora blog: the sitemap is generated from the <code>BLOG_POSTS</code> array and the <code>GLOSSARY</code> terms, giving search engines a complete picture of all indexable content — currently over 360 pages and growing.</p>
    `.trim(),
  },

  {
    slug: "how-to-minify-javascript-css",
    title: "How to Minify JavaScript and CSS (And Whether It's Worth It)",
    description: "Minification removes whitespace, comments, and renames variables to reduce file size. Here's how much it saves, what tools to use, and when it matters.",
    date: "2026-04-28",
    readTime: "4 min read",
    category: "Developer Tools",
    content: `
<p>Minification is the process of removing everything from source code that's not needed for execution: whitespace, comments, newlines, and in the case of JavaScript, shortening variable and function names. A 100KB unminified JavaScript file might compress to 30–40KB minified — a 60–70% reduction. When that file is also Gzip-compressed during transfer, the savings stack further.</p>

<h2>What minification does to JavaScript</h2>

<p>A simple example:</p>

<pre><code>// Before minification
function calculateTotal(price, quantity, taxRate) {
  const subtotal = price * quantity;
  const tax = subtotal * taxRate;
  return subtotal + tax;
}</code></pre>

<pre><code>// After minification
function calculateTotal(a,b,c){const d=a*b;return d+d*c;}</code></pre>

<p>The minifier removes whitespace, comments, and renames local variables to single characters. The function works identically — the names only exist in the source code for human readability.</p>

<p>Advanced minifiers (like Terser) also do tree-shaking (removing dead code), constant folding (<code>2 * 3</code> becomes <code>6</code>), and inlining small functions — further reducing output size.</p>

<h2>What minification does to CSS</h2>

<p>CSS minification removes comments, whitespace, and redundant rules:</p>

<pre><code>/* Button styles */
.button {
  background-color: #3b82f6;
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 4px;
}</code></pre>

<pre><code>.button{background-color:#3b82f6;color:#fff;padding:8px 16px;border-radius:4px}</code></pre>

<p>Note <code>#ffffff</code> → <code>#fff</code>. CSS minifiers also apply shorthand optimizations, merge duplicate selectors, and remove unnecessary units.</p>

<h2>Is it worth doing manually?</h2>

<p>No — any modern build tool handles it automatically. If you're using Vite, webpack, Rollup, or esbuild, minification is on by default in production builds. You configure it once and never think about it again.</p>

<p>If you're not using a build tool (plain HTML/CSS/JS), you can use online tools or CLI tools to minify before deployment. But at that point, you'd probably benefit from a build tool overall.</p>

<h2>Minification vs compression</h2>

<p>Minification and Gzip/Brotli compression are different and complementary:</p>

<ul>
  <li><strong>Minification:</strong> reduces the source file size permanently. Applied at build time.</li>
  <li><strong>Compression:</strong> reduces transfer size in transit. Applied by the web server at request time. The client decompresses before use.</li>
</ul>

<p>Both together give the best result. A 100KB JS file might become 35KB minified, then compress to 12KB over the wire with Brotli. That's a 12× reduction from source to transfer.</p>

<h2>Source maps</h2>

<p>Minified code is unreadable. Source maps are separate files that map minified code back to the original source — enabling readable stack traces and debugging in DevTools. Always generate source maps for production and serve them separately (or only in authenticated DevTools sessions). Never embed source maps in the production bundle itself.</p>

<h2>Tools</h2>

<ul>
  <li><strong>Terser</strong> — the standard JS minifier, used by most bundlers</li>
  <li><strong>esbuild</strong> — extremely fast, handles both JS and CSS</li>
  <li><strong>LightningCSS</strong> — fast CSS minifier + transformer</li>
  <li><strong>Vite / webpack / Rollup</strong> — all integrate the above automatically</li>
</ul>
    `.trim(),
  },

  {
    slug: "what-is-oauth-explained",
    title: "OAuth 2.0 Explained Without the Jargon",
    description: "OAuth lets users grant limited access to their accounts without sharing passwords. Here's how the flow actually works, what the different grant types are, and where people get confused.",
    date: "2026-04-29",
    readTime: "6 min read",
    category: "Security",
    content: `
<p>OAuth 2.0 is the authorization framework behind "Sign in with Google," "Connect with GitHub," and "Allow this app to access your account." It solves a specific problem: how do you let a third-party app access some of your account data without giving it your password?</p>

<h2>The core idea</h2>

<p>Before OAuth, the common pattern for integrations was: give the third-party app your username and password. This was terrible — the app had full access to everything, you couldn't revoke it without changing your password, and if the app was breached, your password leaked too.</p>

<p>OAuth replaces this with limited, revocable tokens. Instead of your password, the third-party app gets a token that represents specific, constrained permissions ("read your email contacts" not "full account access"). You can revoke the token at any time without affecting your password.</p>

<h2>The actors</h2>

<ul>
  <li><strong>Resource Owner:</strong> You — the user who owns the data</li>
  <li><strong>Client:</strong> The third-party app that wants access to your data</li>
  <li><strong>Authorization Server:</strong> The service that issues tokens (Google's auth server, GitHub's auth server)</li>
  <li><strong>Resource Server:</strong> The API that holds your data (Gmail API, GitHub API)</li>
</ul>

<h2>The authorization code flow (the main one)</h2>

<ol>
  <li>You click "Sign in with Google" in the third-party app</li>
  <li>The app redirects you to Google's authorization page with a request for specific permissions (scopes)</li>
  <li>Google shows you a consent screen: "This app wants to read your contacts"</li>
  <li>You approve (or deny)</li>
  <li>Google redirects back to the app with a short-lived authorization code in the URL</li>
  <li>The app's server exchanges the code for an access token (by calling Google's token endpoint with a client secret)</li>
  <li>The app uses the access token to make API calls on your behalf</li>
</ol>

<p>The authorization code is short-lived and single-use. The exchange in step 6 happens server-to-server, so the client secret never appears in a browser URL or in client-side code. This is why this flow is the most secure for web applications.</p>

<h2>PKCE: the extension for public clients</h2>

<p>Mobile apps and single-page apps (SPAs) can't safely store a client secret — anyone can decompile the app or inspect JavaScript. PKCE (Proof Key for Code Exchange, pronounced "pixie") extends the authorization code flow to work without a client secret.</p>

<p>The app generates a random string (code verifier), hashes it (code challenge), and sends the hash to the authorization server at the start of the flow. When exchanging the code for a token, the app sends the original verifier. The server verifies the hash matches. An intercepted authorization code is useless without the verifier.</p>

<h2>Scopes</h2>

<p>Scopes define what the token is allowed to do. When you see "This app wants to: read your email, view your contacts," those are scopes. Different API providers have different scope systems — Google's scopes are full URLs like <code>https://www.googleapis.com/auth/gmail.readonly</code>. GitHub uses simpler strings like <code>repo</code> or <code>user:email</code>.</p>

<p>Apps should request the minimum scopes needed (principle of least privilege). Users are more likely to approve a narrow request than a broad one.</p>

<h2>OAuth vs OpenID Connect</h2>

<p>OAuth 2.0 is for <em>authorization</em> — "can this app access this data?" It doesn't define how to authenticate users or how to get user profile information.</p>

<p>OpenID Connect (OIDC) is a layer on top of OAuth 2.0 that adds <em>authentication</em> — "who is this user?" OIDC adds an ID token (a JWT containing user identity claims) to the OAuth flow. When you "Sign in with Google," you're using OIDC to authenticate. When GitHub asks "allow this app to access your repos," you're using OAuth 2.0 for authorization.</p>

<p>Most "Sign in with X" implementations use OIDC. Most API integrations use OAuth 2.0 directly.</p>
    `.trim(),
  },

  {
    slug: "color-hex-rgb-hsl-converter-guide",
    title: "Hex, RGB, HSL: Color Formats Explained for Developers and Designers",
    description: "Three formats, same color. Here's what each one is good for, how to convert between them, and why HSL is the most useful one to think in.",
    date: "2026-04-29",
    readTime: "5 min read",
    category: "Developer Tools",
    content: `
<p>Every digital color can be expressed in multiple formats. Hex, RGB, and HSL all represent the same color — they're different notations for the same underlying values. Understanding what each one encodes helps you choose the right format for the job and convert between them without confusion.</p>

<h2>RGB: the fundamental model</h2>

<p>RGB (Red, Green, Blue) represents color as the intensity of three light sources. Each channel ranges from 0 to 255. All three at 0 is black; all three at 255 is white.</p>

<p><code>rgb(59, 130, 246)</code> — this is a medium blue. Channel breakdown:</p>
<ul>
  <li>Red: 59 (low — not much red)</li>
  <li>Green: 130 (moderate)</li>
  <li>Blue: 246 (high — mostly blue)</li>
</ul>

<p>RGB is intuitive for thinking about additive light mixing, but it's hard to reason about perceptually. If you want a slightly lighter version of this blue, adjusting all three channels by the right amount requires math or guesswork.</p>

<h2>Hex: RGB in base 16</h2>

<p>Hex is just RGB written in hexadecimal. <code>#3b82f6</code> = <code>rgb(59, 130, 246)</code>:</p>
<ul>
  <li><code>3b</code> = 59 in decimal (R)</li>
  <li><code>82</code> = 130 in decimal (G)</li>
  <li><code>f6</code> = 246 in decimal (B)</li>
</ul>

<p>Hex became the standard for web colors because it's compact and design tools standardized on it. <code>#fff</code> as a 3-character shorthand (each character doubled: <code>#ffffff</code>) is a convenient abbreviation for simple colors.</p>

<p>Hex is the right format when:</p>
<ul>
  <li>Copying colors from design tools (Figma, Sketch export hex by default)</li>
  <li>Using colors in HTML attributes</li>
  <li>Sharing specific color values between team members</li>
</ul>

<h2>HSL: the most human-readable format</h2>

<p>HSL (Hue, Saturation, Lightness) describes color the way humans actually perceive it:</p>

<p><code>hsl(217, 91%, 60%)</code> — the same medium blue:</p>
<ul>
  <li><strong>Hue:</strong> 217° — position on the color wheel (0° = red, 120° = green, 240° = blue)</li>
  <li><strong>Saturation:</strong> 91% — how vivid vs. grey (0% = grey, 100% = fully saturated)</li>
  <li><strong>Lightness:</strong> 60% — how light vs. dark (0% = black, 50% = normal, 100% = white)</li>
</ul>

<p>HSL makes color manipulation intuitive:</p>
<ul>
  <li>Want a lighter version? Increase lightness: <code>hsl(217, 91%, 75%)</code></li>
  <li>Want a muted version? Decrease saturation: <code>hsl(217, 40%, 60%)</code></li>
  <li>Want a complementary color? Add 180° to the hue: <code>hsl(37, 91%, 60%)</code></li>
</ul>

<p>In CSS, you can use HSL variables to build cohesive color systems:</p>

<pre><code>:root {
  --brand-hue: 217;
  --brand: hsl(var(--brand-hue), 91%, 60%);
  --brand-light: hsl(var(--brand-hue), 91%, 80%);
  --brand-dark: hsl(var(--brand-hue), 91%, 40%);
}</code></pre>

<p>All three variants are guaranteed to be the same hue — they only differ in lightness. This is nearly impossible to achieve intuitively with RGB or hex.</p>

<h2>Alpha channel: RGBA and HSLA</h2>

<p>Add an alpha channel for transparency: <code>rgba(59, 130, 246, 0.5)</code> or <code>hsla(217, 91%, 60%, 0.5)</code>. Alpha is 0 (fully transparent) to 1 (fully opaque).</p>

<p>Modern CSS also accepts: <code>rgb(59 130 246 / 50%)</code> — the slash syntax separates color values from the alpha in a cleaner format.</p>

<h2>Converting between formats</h2>

<p>Convert any color between hex, RGB, HSL, and other formats instantly at <a href="/tools">Toolora → Developer → Color Converter</a>. Paste in any format and get all equivalent representations — with a live color preview — entirely in your browser.</p>
    `.trim(),
  },

  {
    slug: "how-to-read-cron-jobs",
    title: "How to Read (and Write) Cron Expressions",
    description: "Cron expressions are five fields that define a schedule. Here's how to read them, write them, and avoid the common mistakes that run jobs at the wrong time.",
    date: "2026-04-30",
    readTime: "5 min read",
    category: "Developer Tools",
    content: `
<p>Cron is the Unix task scheduler. A cron expression is a compact string that defines when a job should run. Once you understand the five (or six) fields, reading and writing cron expressions becomes straightforward — but the edge cases are where most mistakes happen.</p>

<h2>The five fields</h2>

<pre><code>┌───────── minute (0–59)
│ ┌───────── hour (0–23)
│ │ ┌───────── day of month (1–31)
│ │ │ ┌───────── month (1–12)
│ │ │ │ ┌───────── day of week (0–6, Sunday=0)
│ │ │ │ │
* * * * *</code></pre>

<p>A <code>*</code> means "every value in this field." So <code>* * * * *</code> runs every minute, every hour, every day.</p>

<h2>Common schedules</h2>

<table>
  <thead>
    <tr><th>Expression</th><th>Meaning</th></tr>
  </thead>
  <tbody>
    <tr><td><code>0 * * * *</code></td><td>Every hour, on the hour</td></tr>
    <tr><td><code>0 9 * * *</code></td><td>Every day at 9:00 AM</td></tr>
    <tr><td><code>0 9 * * 1</code></td><td>Every Monday at 9:00 AM</td></tr>
    <tr><td><code>0 9 * * 1-5</code></td><td>Weekdays at 9:00 AM</td></tr>
    <tr><td><code>*/15 * * * *</code></td><td>Every 15 minutes</td></tr>
    <tr><td><code>0 0 1 * *</code></td><td>First day of every month at midnight</td></tr>
    <tr><td><code>0 0 * * 0</code></td><td>Every Sunday at midnight</td></tr>
    <tr><td><code>30 23 * * 5</code></td><td>Fridays at 11:30 PM</td></tr>
  </tbody>
</table>

<h2>Special characters</h2>

<p><strong><code>*</code> — wildcard:</strong> matches all values in the field.</p>

<p><strong><code>,</code> — list:</strong> <code>0 9,17 * * *</code> runs at 9:00 AM and 5:00 PM.</p>

<p><strong><code>-</code> — range:</strong> <code>0 9-17 * * *</code> runs every hour from 9 AM to 5 PM.</p>

<p><strong><code>/</code> — step:</strong> <code>*/5 * * * *</code> runs every 5 minutes. <code>0 */2 * * *</code> runs every 2 hours.</p>

<p><strong><code>L</code> — last (some implementations):</strong> <code>0 0 L * *</code> runs on the last day of the month. Not standard in all cron implementations.</p>

<h2>Common mistakes</h2>

<p><strong>Timezone:</strong> cron runs in the server's local timezone by default. If your server is UTC and you want a job to run at 9 AM Eastern, you need to use UTC-4 or UTC-5 depending on DST. Many modern schedulers (AWS EventBridge, GitHub Actions) let you specify timezones explicitly.</p>

<p><strong>Day of month vs day of week conflict:</strong> Setting both day-of-month and day-of-week to non-wildcard values is interpreted as OR, not AND. <code>0 0 1 * 1</code> runs on the 1st of every month AND every Monday — not on Mondays that are the 1st.</p>

<p><strong>Minute vs hour:</strong> The most common confusion. <code>1 * * * *</code> runs at one minute past every hour (1:01, 2:01, etc.), not "every minute for 1 hour."</p>

<p><strong>Overlapping jobs:</strong> If a cron job takes longer than its schedule interval, multiple instances can run simultaneously. Always check whether your job is idempotent before scheduling it frequently.</p>

<h2>Testing expressions</h2>

<p>Before deploying a cron job, verify what "next 10 runs" look like for your expression. Parse and preview cron schedules at <a href="/tools">Toolora → Developer → Cron Parser</a> — shows the next scheduled runs in both UTC and local time.</p>

<h2>The sixth field (seconds)</h2>

<p>Standard cron only has 5 fields (minimum resolution is 1 minute). Some implementations (Spring Scheduling, Quartz, AWS CloudWatch Events) add a seconds field at the beginning or end. If you need sub-minute scheduling, check which format your scheduler expects.</p>
    `.trim(),
  },

  {
    slug: "what-is-a-cdn-explained",
    title: "What Is a CDN? How Content Delivery Networks Work",
    description: "A CDN serves your files from servers close to your users. Here's how they work, what gets cached, and why using one is almost always worth it.",
    date: "2026-04-30",
    readTime: "5 min read",
    category: "Developer Tools",
    content: `
<p>A Content Delivery Network (CDN) is a geographically distributed network of servers that delivers content to users from the location closest to them. Instead of every user hitting a single server in one data center, they get files from a nearby "edge" location — reducing latency and improving load times.</p>

<h2>Why distance matters</h2>

<p>HTTP requests travel at roughly 2/3 the speed of light through fiber optic cables. A request from Sydney to a server in Virginia adds about 160ms of round-trip time just for physics, before any processing happens. For a page that requires 20 separate HTTP requests, that's 3+ seconds of latency for nothing.</p>

<p>CDN edge servers are deployed in dozens or hundreds of cities globally. A Sydney user might get served from a CDN edge in Sydney or Singapore — 5-20ms instead of 160ms.</p>

<h2>What CDNs cache</h2>

<p>CDNs are most effective for static assets — files that don't change between requests:</p>
<ul>
  <li>JavaScript and CSS bundles</li>
  <li>Images, fonts, and videos</li>
  <li>HTML files for statically-generated sites</li>
  <li>API responses that can be shared across users (public data)</li>
</ul>

<p>Dynamic content (personalized pages, authenticated API responses) is harder to cache safely. Modern CDNs offer edge computing that can handle some dynamic logic at the edge, but the core use case remains static assets.</p>

<h2>How CDN caching works</h2>

<p>On the first request for a file, the CDN edge server doesn't have it. It fetches the file from your origin server (a "cache miss"), stores a copy, and serves it. Subsequent requests from the same or nearby users get the cached copy (a "cache hit") without touching your origin server.</p>

<p>Cache duration is controlled by the <code>Cache-Control</code> response header from your origin. <code>Cache-Control: max-age=31536000, immutable</code> tells the CDN to cache for a year and not recheck. For versioned assets (with hash in the filename), this is appropriate — when the file changes, the filename changes, so cache invalidation is automatic.</p>

<h2>Cache invalidation</h2>

<p>When you need to force CDN edges to fetch fresh content before the cache expires, you either:</p>
<ul>
  <li><strong>Change the filename</strong> (content hash in the filename — the standard approach for JS/CSS bundles)</li>
  <li><strong>Issue a cache purge</strong> via the CDN API — tells all edges to drop the cached version</li>
  <li><strong>Use short cache TTLs</strong> — appropriate for frequently changing content</li>
</ul>

<h2>CDN providers</h2>

<ul>
  <li><strong>Cloudflare</strong> — free tier is generous; integrates DNS; includes DDoS protection</li>
  <li><strong>AWS CloudFront</strong> — integrates tightly with S3, EC2, and other AWS services</li>
  <li><strong>Fastly</strong> — low TTL caching (good for frequently updated content); popular with large media sites</li>
  <li><strong>Vercel Edge Network / Netlify CDN</strong> — built-in CDN for sites deployed on these platforms</li>
  <li><strong>Bunny.net</strong> — competitive pricing for high-volume bandwidth</li>
</ul>

<h2>Is a CDN always worth it?</h2>

<p>For almost all public-facing sites: yes. CDNs also provide DDoS mitigation, TLS termination, compression, and often HTTP/3 support. The performance improvement for users outside your origin server's region is significant enough that CDNs should be the default, not an optimization for later.</p>

<p>For internal tools or intranet apps with users in one office: the benefit is minimal. Optimize your server instead.</p>
    `.trim(),
  },

  {
    slug: "json-schema-validation-guide",
    title: "JSON Schema Validation: What It Is and How to Use It",
    description: "JSON Schema lets you define the structure of JSON data and validate that incoming data matches. Here's the key vocabulary, a real example, and the best libraries.",
    date: "2026-05-01",
    readTime: "5 min read",
    category: "Developer Tools",
    content: `
<p>JSON Schema is a vocabulary for describing the structure of JSON data. You write a schema that defines what fields are required, what types they should be, what the valid value ranges are — and then validate any JSON document against it. If the document doesn't match, you get structured error messages instead of runtime crashes.</p>

<h2>Why you need validation</h2>

<p>Without validation, you trust incoming data to be well-formed. User inputs, webhook payloads, third-party API responses, and inter-service messages all eventually arrive malformed. Without validation, you find out when your code crashes accessing a field that doesn't exist or has the wrong type. With validation, you catch it at the boundary and return a clear error.</p>

<h2>A basic schema</h2>

<pre><code>{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["name", "age", "email"],
  "properties": {
    "name": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100
    },
    "age": {
      "type": "integer",
      "minimum": 0,
      "maximum": 150
    },
    "email": {
      "type": "string",
      "format": "email"
    },
    "tags": {
      "type": "array",
      "items": { "type": "string" },
      "uniqueItems": true
    }
  },
  "additionalProperties": false
}</code></pre>

<p>This schema requires <code>name</code>, <code>age</code>, and <code>email</code>; enforces types and ranges; validates the email format; allows an optional <code>tags</code> array of unique strings; and rejects any extra fields not listed (<code>additionalProperties: false</code>).</p>

<h2>Key keywords</h2>

<table>
  <thead>
    <tr><th>Keyword</th><th>Applies to</th><th>What it does</th></tr>
  </thead>
  <tbody>
    <tr><td><code>type</code></td><td>all</td><td>string, number, integer, boolean, array, object, null</td></tr>
    <tr><td><code>required</code></td><td>object</td><td>Array of required property names</td></tr>
    <tr><td><code>properties</code></td><td>object</td><td>Schema for each named property</td></tr>
    <tr><td><code>minimum</code> / <code>maximum</code></td><td>number</td><td>Inclusive bounds</td></tr>
    <tr><td><code>minLength</code> / <code>maxLength</code></td><td>string</td><td>Character length bounds</td></tr>
    <tr><td><code>pattern</code></td><td>string</td><td>Regex the string must match</td></tr>
    <tr><td><code>enum</code></td><td>any</td><td>Value must be one of the listed values</td></tr>
    <tr><td><code>items</code></td><td>array</td><td>Schema for array elements</td></tr>
    <tr><td><code>minItems</code> / <code>maxItems</code></td><td>array</td><td>Array length bounds</td></tr>
    <tr><td><code>format</code></td><td>string</td><td>Semantic format (email, date-time, uri, uuid)</td></tr>
    <tr><td><code>$ref</code></td><td>any</td><td>Reference another schema definition (DRY)</td></tr>
  </tbody>
</table>

<h2>Composition keywords</h2>

<p><code>oneOf</code>, <code>anyOf</code>, <code>allOf</code>, and <code>not</code> let you combine schemas:</p>

<pre><code>"paymentMethod": {
  "oneOf": [
    { "properties": { "type": { "const": "card" }, "cardNumber": { "type": "string" } }, "required": ["cardNumber"] },
    { "properties": { "type": { "const": "paypal" }, "email": { "type": "string" } }, "required": ["email"] }
  ]
}</code></pre>

<p>This validates that <code>paymentMethod</code> matches exactly one of the two payment type schemas.</p>

<h2>Libraries</h2>

<ul>
  <li><strong>Ajv</strong> (JavaScript/Node) — the most widely used; fast; supports the latest drafts</li>
  <li><strong>jsonschema</strong> (Python) — standard Python option</li>
  <li><strong>json-schema-validator</strong> (Java) — well-maintained Java library</li>
  <li><strong>Zod</strong> (TypeScript) — not JSON Schema, but generates TypeScript types with runtime validation; popular for TypeScript-first projects</li>
</ul>

<p>Validate JSON against a schema instantly at <a href="/tools">Toolora → Developer → JSON Formatter</a> — paste your JSON, see formatted output and any syntax errors.</p>
    `.trim(),
  },

  {
    slug: "how-to-use-browser-devtools-network-tab",
    title: "Browser DevTools: How to Read the Network Tab",
    description: "The Network tab shows every HTTP request your browser makes. Here's how to read it, what to look for when debugging, and the filters that make it useful.",
    date: "2026-05-01",
    readTime: "6 min read",
    category: "Developer Tools",
    content: `
<p>The Network tab in Chrome DevTools (and its equivalents in Firefox and Safari) is one of the most useful debugging tools in a developer's toolkit. It records every request the browser makes, shows you exactly what was sent and received, and lets you diagnose performance, authentication, CORS, and caching problems without any additional tooling.</p>

<h2>Opening the Network tab</h2>

<p>Press F12 (or Cmd+Option+I on Mac) to open DevTools, then click the "Network" tab. Important: the Network tab only records requests made while it's open. Refresh the page after opening it to capture the full page load.</p>

<h2>Reading the waterfall</h2>

<p>The waterfall chart shows all requests in chronological order, with each row representing one request. The colored bars show timing:</p>

<ul>
  <li><strong>Queueing (grey):</strong> The request was waiting before being sent — either for a connection slot or because of browser limits</li>
  <li><strong>Stalled (grey, textured):</strong> Paused after being initiated — usually waiting for a connection to establish</li>
  <li><strong>DNS lookup (teal):</strong> Time to resolve the domain to an IP address</li>
  <li><strong>Initial connection (orange):</strong> TCP handshake time</li>
  <li><strong>SSL (orange):</strong> TLS negotiation time (HTTPS only)</li>
  <li><strong>TTFB — Time to First Byte (green):</strong> How long the server took to respond after receiving the request</li>
  <li><strong>Content download (blue):</strong> Time to download the response body</li>
</ul>

<p>A large TTFB suggests server-side slowness. A large content download suggests a large file or slow connection. Long DNS/connection times suggest the domain wasn't cached or the server is far away.</p>

<h2>Inspecting individual requests</h2>

<p>Click any row to see details in the right panel:</p>

<ul>
  <li><strong>Headers tab:</strong> Request and response headers — authentication, content-type, caching, CORS</li>
  <li><strong>Payload tab:</strong> The request body (for POST/PUT requests) — form data, JSON body</li>
  <li><strong>Response tab:</strong> The raw response body — JSON data, HTML, error messages</li>
  <li><strong>Preview tab:</strong> Formatted preview of the response (pretty-printed JSON, rendered HTML)</li>
  <li><strong>Timing tab:</strong> Detailed timing breakdown for the individual request</li>
</ul>

<h2>Useful filters</h2>

<p>The filter bar at the top of the Network tab lets you narrow down requests:</p>

<ul>
  <li><strong>Type buttons:</strong> XHR/Fetch (API calls), JS, CSS, Img, Media, Font — click to filter by type</li>
  <li><strong>Search box:</strong> Filter by URL, domain, or response content</li>
  <li><strong>Status filter:</strong> Right-click a request → "Hide successful requests" to see only errors</li>
</ul>

<h2>Common debugging scenarios</h2>

<p><strong>CORS errors:</strong> The request shows a red status or fails with "No 'Access-Control-Allow-Origin' header." Check the preflight OPTIONS request (if it exists) and the response headers to see what the server is returning.</p>

<p><strong>401/403 errors:</strong> Check the request headers — is the Authorization header present? Does the token look correct? Check the response body for the server's error message.</p>

<p><strong>Unexpected cached responses:</strong> A request status of "(disk cache)" or "(memory cache)" means the browser served a cached copy. Shift+Refresh bypasses the cache. The response headers show the Cache-Control values that caused this.</p>

<p><strong>Slow API calls:</strong> Sort by "Time" column to find the slowest requests. A high TTFB points to server processing time. A high content download time points to a large response body.</p>

<h2>Preserving logs and throttling</h2>

<p>"Preserve log" (checkbox in the toolbar) keeps the network log across page navigations — useful for debugging redirects. "Throttling" dropdown lets you simulate slow connections (3G, Slow 3G) to test how your site behaves for users with slow internet.</p>

<p>The Network tab is the first place to look when an API call isn't working, a page is loading slowly, or something looks different than expected — the raw truth of what your browser actually requested and received is all there.</p>
    `.trim(),
  },

  {
    slug: "password-strength-entropy-explained",
    title: "Password Strength and Entropy: What Makes a Password Hard to Crack",
    description: "Password strength isn't about complexity rules — it's about entropy. Here's the math behind what makes passwords hard to crack and what advice actually works.",
    date: "2026-05-02",
    readTime: "5 min read",
    category: "Security",
    content: `
<p>Most password requirements — one uppercase, one number, one special character, minimum 8 characters — are security theater. They add complexity that frustrates users without meaningfully improving security. Real password strength comes from entropy, and understanding entropy gives you a clearer picture of what actually matters.</p>

<h2>What entropy means for passwords</h2>

<p>Entropy measures the number of possible passwords an attacker has to try when they don't know yours. It's measured in bits: each bit doubles the search space. A password with 40 bits of entropy has 2^40 (~1 trillion) possible values.</p>

<p>A modern GPU can try billions of hashes per second. With 2^40 possibilities and a fast hash (MD5, SHA-1), an attacker could crack a 40-bit password in minutes. With bcrypt at cost factor 12 (designed to be slow), the same search takes years.</p>

<h2>Where entropy comes from</h2>

<p>Entropy = log₂(pool_size) × password_length</p>

<p>Two factors: the size of the character pool you're drawing from, and the length of the password.</p>

<table>
  <thead>
    <tr><th>Character set</th><th>Pool size</th><th>Bits per character</th></tr>
  </thead>
  <tbody>
    <tr><td>Digits only (0–9)</td><td>10</td><td>3.3</td></tr>
    <tr><td>Lowercase letters</td><td>26</td><td>4.7</td></tr>
    <tr><td>Lower + uppercase</td><td>52</td><td>5.7</td></tr>
    <tr><td>Alphanumeric</td><td>62</td><td>5.9</td></tr>
    <tr><td>Full ASCII printable</td><td>95</td><td>6.5</td></tr>
  </tbody>
</table>

<p>An 8-character random password from full ASCII: 8 × 6.5 = 52 bits. A 16-character random password: 104 bits. Length is the dominant factor — adding 8 characters doubles the entropy increase over expanding the character set.</p>

<h2>Why complexity rules are counterproductive</h2>

<p>"At least one uppercase, one number, one symbol" requirements lead to predictable patterns: <code>Password1!</code>, <code>Summer2024!</code>. These patterns reduce entropy rather than increase it — attackers know them and use them in their wordlists.</p>

<p>NIST's Digital Identity Guidelines (SP 800-63B) explicitly recommend against complexity rules. Instead, they recommend:</p>
<ul>
  <li>Minimum length of 8 characters (15+ recommended)</li>
  <li>Allow any printable characters including spaces</li>
  <li>Check against known breached password lists</li>
  <li>No periodic forced resets (they lead to predictable incrementing: <code>Password1</code> → <code>Password2</code>)</li>
</ul>

<h2>Passphrases</h2>

<p>A random passphrase from a 7776-word wordlist (Diceware) gives ~12.9 bits per word. A 4-word passphrase: ~52 bits. A 6-word passphrase: ~78 bits. Passphrases like "correct horse battery staple" are long, memorable, and harder to crack than "P@ssw0rd123."</p>

<h2>What actually matters</h2>

<ol>
  <li><strong>Use a password manager.</strong> Let it generate truly random 20+ character passwords for every site. You only need to remember one password (the manager's master password).</li>
  <li><strong>Use a unique password everywhere.</strong> Password reuse across sites is the most common cause of account compromise — not weak individual passwords.</li>
  <li><strong>Enable two-factor authentication.</strong> Even a guessable password is protected if the attacker also needs a time-based code from your phone.</li>
  <li><strong>Length &gt; complexity.</strong> If you must remember a password, a long passphrase beats a short complex password.</li>
</ol>

<p>Generate cryptographically random passwords at <a href="/tools">Toolora → Security → Password Generator</a>. Runs in your browser — no passwords sent to any server.</p>
    `.trim(),
  },

  {
    slug: "what-is-indexeddb-browser-storage",
    title: "IndexedDB Explained: Browser Storage for Larger Data",
    description: "IndexedDB is the browser's built-in database for storing structured data. Here's when to use it instead of localStorage, how it works, and the gotchas.",
    date: "2026-05-02",
    readTime: "5 min read",
    category: "Developer Tools",
    content: `
<p>The browser has several ways to store data locally: cookies, localStorage, sessionStorage, Cache API, and IndexedDB. Most developers reach for localStorage by default — it's simple and synchronous. But localStorage has hard limits (usually 5–10MB) and only stores strings. When you need to store larger amounts of structured data in the browser, IndexedDB is the right tool.</p>

<h2>What IndexedDB is</h2>

<p>IndexedDB is a low-level browser API for storing large amounts of structured, typed data, including files and blobs. It's a full transactional database — with indexes, cursors, and atomic operations — running entirely in the browser. Data persists across sessions (like localStorage, unlike sessionStorage).</p>

<p>Storage limits are much higher than localStorage — typically 50MB–unlimited depending on browser and device, with the browser asking permission above a threshold.</p>

<h2>When to use IndexedDB vs localStorage</h2>

<table>
  <thead>
    <tr><th>Use localStorage when…</th><th>Use IndexedDB when…</th></tr>
  </thead>
  <tbody>
    <tr><td>Data is simple key-value pairs</td><td>Data is structured objects</td></tr>
    <tr><td>Total size under 1–2MB</td><td>Size could exceed a few MB</td></tr>
    <tr><td>You need synchronous access</td><td>Async is acceptable (it always is)</td></tr>
    <tr><td>You're storing a few settings</td><td>You're storing collections of records</td></tr>
    <tr><td>—</td><td>You need to query by multiple fields</td></tr>
    <tr><td>—</td><td>You're storing files, blobs, or binary data</td></tr>
  </tbody>
</table>

<h2>Core concepts</h2>

<p><strong>Database:</strong> Each origin (domain) can have multiple named databases. Databases have versions — schema changes require a version upgrade.</p>

<p><strong>Object store:</strong> The equivalent of a database table. Each store holds JavaScript objects. Objects can have any shape.</p>

<p><strong>Key:</strong> Each record needs a unique key. It can be a keyPath (a field in the object, like <code>id</code>) or auto-generated.</p>

<p><strong>Index:</strong> Lets you look up records by fields other than the primary key. Create an index on <code>email</code> and you can query by email efficiently.</p>

<p><strong>Transaction:</strong> All reads and writes happen inside transactions. Transactions are either read-only or read-write, and they're atomic — either everything succeeds or nothing changes.</p>

<h2>Basic usage</h2>

<pre><code>// Open database (creates if not exists)
const request = indexedDB.open('myApp', 1);

request.onupgradeneeded = (event) => {
  const db = event.target.result;
  const store = db.createObjectStore('users', { keyPath: 'id' });
  store.createIndex('email', 'email', { unique: true });
};

request.onsuccess = (event) => {
  const db = event.target.result;

  // Write a record
  const tx = db.transaction('users', 'readwrite');
  tx.objectStore('users').add({ id: 1, name: 'Alice', email: 'alice@example.com' });

  // Read by key
  const readTx = db.transaction('users', 'readonly');
  const getReq = readTx.objectStore('users').get(1);
  getReq.onsuccess = () => console.log(getReq.result);
};</code></pre>

<h2>Use Dexie.js to make it manageable</h2>

<p>The raw IndexedDB API is verbose and callback-heavy. Dexie.js is the standard wrapper — it adds a clean promise-based API and makes IndexedDB feel like a modern ORM:</p>

<pre><code>import Dexie from 'dexie';

const db = new Dexie('myApp');
db.version(1).stores({ users: '++id, email, name' });

// Add
await db.users.add({ email: 'alice@example.com', name: 'Alice' });

// Query
const alice = await db.users.where('email').equals('alice@example.com').first();</code></pre>

<h2>Real use cases in browser apps</h2>

<ul>
  <li>Offline-first apps that sync when connectivity returns</li>
  <li>Browser-based tools that process and cache large files</li>
  <li>Draft auto-save systems for editors or forms</li>
  <li>Caching API responses for fast initial load</li>
</ul>

<p>Toolora uses browser storage to cache processed files and tool state locally — your data stays in your browser between sessions without any server round-trips.</p>
    `.trim(),
  },

  {
    slug: "html-entities-special-characters-guide",
    title: "HTML Entities and Special Characters: A Practical Guide",
    description: "HTML entities let you display characters that would otherwise break your markup. Here's the reference for the ones you'll actually use.",
    date: "2026-05-03",
    readTime: "4 min read",
    category: "Developer Tools",
    content: `
<p>HTML has a set of reserved characters — <code>&lt;</code>, <code>&gt;</code>, <code>&amp;</code>, and <code>"</code> — that have special meaning in HTML markup. If you want to display these characters literally on a web page, you need to escape them using HTML entities. Beyond the reserved set, entities are useful for non-ASCII characters that might cause encoding problems, and for typographic characters that are hard to type directly.</p>

<h2>The required escapes</h2>

<table>
  <thead>
    <tr><th>Character</th><th>Entity (named)</th><th>Entity (numeric)</th><th>When to use</th></tr>
  </thead>
  <tbody>
    <tr><td>&amp;</td><td><code>&amp;amp;</code></td><td><code>&amp;#38;</code></td><td>Always in text content when displaying &amp;</td></tr>
    <tr><td>&lt;</td><td><code>&amp;lt;</code></td><td><code>&amp;#60;</code></td><td>Always in text content (starts a tag otherwise)</td></tr>
    <tr><td>&gt;</td><td><code>&amp;gt;</code></td><td><code>&amp;#62;</code></td><td>Technically optional in text, required in attributes</td></tr>
    <tr><td>"</td><td><code>&amp;quot;</code></td><td><code>&amp;#34;</code></td><td>Inside double-quoted attribute values</td></tr>
    <tr><td>'</td><td><code>&amp;apos;</code></td><td><code>&amp;#39;</code></td><td>Inside single-quoted attribute values</td></tr>
  </tbody>
</table>

<p>If you're using a templating engine or JSX, these are usually escaped automatically. The danger is when you concatenate strings manually to build HTML — that's when you create XSS vulnerabilities by forgetting to escape user input.</p>

<h2>Non-breaking spaces and whitespace</h2>

<table>
  <thead>
    <tr><th>Entity</th><th>Character</th><th>Use case</th></tr>
  </thead>
  <tbody>
    <tr><td><code>&amp;nbsp;</code></td><td>Non-breaking space</td><td>Prevents line break between words ("10 kg" should stay together)</td></tr>
    <tr><td><code>&amp;ensp;</code></td><td>En space (½ em)</td><td>Typographic spacing</td></tr>
    <tr><td><code>&amp;emsp;</code></td><td>Em space (1 em)</td><td>Paragraph indentation in email HTML</td></tr>
    <tr><td><code>&amp;thinsp;</code></td><td>Thin space</td><td>Around mathematical operators, between numbers and units</td></tr>
  </tbody>
</table>

<h2>Typographic characters</h2>

<table>
  <thead>
    <tr><th>Entity</th><th>Character</th><th>Use</th></tr>
  </thead>
  <tbody>
    <tr><td><code>&amp;mdash;</code></td><td>— (em dash)</td><td>Parenthetical aside — like this</td></tr>
    <tr><td><code>&amp;ndash;</code></td><td>– (en dash)</td><td>Ranges (pages 10–20, 2020–2026)</td></tr>
    <tr><td><code>&amp;laquo;</code> / <code>&amp;raquo;</code></td><td>« »</td><td>French quotation marks</td></tr>
    <tr><td><code>&amp;ldquo;</code> / <code>&amp;rdquo;</code></td><td>" "</td><td>Typographic double quotes</td></tr>
    <tr><td><code>&amp;lsquo;</code> / <code>&amp;rsquo;</code></td><td>' '</td><td>Typographic single quotes / apostrophes</td></tr>
    <tr><td><code>&amp;hellip;</code></td><td>…</td><td>Ellipsis (not three periods)</td></tr>
    <tr><td><code>&amp;trade;</code></td><td>™</td><td>Trademark</td></tr>
    <tr><td><code>&amp;copy;</code></td><td>©</td><td>Copyright</td></tr>
    <tr><td><code>&amp;reg;</code></td><td>®</td><td>Registered trademark</td></tr>
  </tbody>
</table>

<h2>Mathematical and technical symbols</h2>

<table>
  <thead>
    <tr><th>Entity</th><th>Character</th><th>Use</th></tr>
  </thead>
  <tbody>
    <tr><td><code>&amp;times;</code></td><td>×</td><td>Multiplication (use instead of letter "x")</td></tr>
    <tr><td><code>&amp;divide;</code></td><td>÷</td><td>Division</td></tr>
    <tr><td><code>&amp;plusmn;</code></td><td>±</td><td>Plus-or-minus</td></tr>
    <tr><td><code>&amp;ne;</code></td><td>≠</td><td>Not equal</td></tr>
    <tr><td><code>&amp;le;</code> / <code>&amp;ge;</code></td><td>≤ ≥</td><td>Less/greater than or equal</td></tr>
    <tr><td><code>&amp;infin;</code></td><td>∞</td><td>Infinity</td></tr>
    <tr><td><code>&amp;deg;</code></td><td>°</td><td>Degrees</td></tr>
  </tbody>
</table>

<h2>In practice: just use UTF-8</h2>

<p>If your HTML document declares <code>&lt;meta charset="UTF-8"&gt;</code> (which all modern HTML documents should), you can type or paste most Unicode characters directly without entities. Entities are primarily needed for the five reserved HTML characters and for cases where you're generating HTML in contexts that don't guarantee UTF-8 encoding (older email clients, some XML processors).</p>

<p>Encode and decode HTML entities at <a href="/tools">Toolora → Encoding → HTML Encoder</a>.</p>
    `.trim(),
  },

  {
    slug: "how-to-convert-csv-to-excel",
    title: "How to Convert CSV to Excel (and When Each Format Is Better)",
    description: "CSV and Excel files store tabular data but have very different capabilities. Here's how to convert between them and when to use each format.",
    date: "2026-05-03",
    readTime: "4 min read",
    category: "Tools",
    content: `
<p>CSV (Comma-Separated Values) and Excel (.xlsx) files both store tabular data, but they're built for different purposes. CSV is a universal, portable text format. Excel is a rich binary format with formulas, formatting, charts, and multiple sheets. Converting between them is straightforward, but there are a few things that don't transfer cleanly.</p>

<h2>Opening a CSV in Excel</h2>

<p>The simplest method: rename the file from <code>.csv</code> to <code>.xlsx</code> doesn't work — they're different formats. Instead:</p>

<ol>
  <li>Open Excel → File → Open → Browse to your CSV file</li>
  <li>Or: double-click the CSV file and Excel opens it directly (if Excel is your default for CSVs)</li>
  <li>Or: in Excel, use the Data tab → From Text/CSV → Import wizard for more control over delimiters and encoding</li>
</ol>

<p>The Import wizard is the most reliable method because it lets you specify the delimiter (comma, semicolon, tab), character encoding (UTF-8 vs ANSI), and how to handle columns that look like dates or numbers.</p>

<h2>What gets lost when opening CSV in Excel</h2>

<p><strong>Leading zeros:</strong> A CSV value <code>00123</code> becomes <code>123</code> in Excel — the leading zeros are dropped because Excel treats it as a number. ZIP codes, phone numbers, and ID numbers with leading zeros need to be imported as text. In the Import wizard, select the column and choose "Text" as the data type.</p>

<p><strong>Large numbers:</strong> Numbers with more than 15 significant digits (long IDs, cryptocurrency transaction hashes) are rounded by Excel's floating-point representation. Again, import as text.</p>

<p><strong>Dates:</strong> Excel may auto-format dates incorrectly, especially for international formats. <code>03/04/2026</code> is March 4th in the US and April 3rd in the UK. The Import wizard lets you specify date format explicitly.</p>

<h2>Exporting from Excel to CSV</h2>

<p>File → Save As → Choose "CSV UTF-8 (Comma delimited)" from the format dropdown. UTF-8 is important — the older "CSV (MS-DOS)" option uses ANSI encoding which breaks non-ASCII characters.</p>

<p>What gets lost when saving Excel as CSV:</p>
<ul>
  <li>Formulas (replaced by their calculated values)</li>
  <li>Formatting (bold, colors, borders)</li>
  <li>Charts and images</li>
  <li>Multiple sheets (only the active sheet is exported)</li>
  <li>Cell comments and metadata</li>
</ul>

<h2>When to use CSV</h2>

<ul>
  <li>Moving data between different applications (databases, Python, APIs)</li>
  <li>Long-term data archival (CSV is human-readable, future-proof, and opens without proprietary software)</li>
  <li>Importing data into any system that accepts tabular data</li>
  <li>Version-controlling data (CSV diffs cleanly in git; xlsx doesn't)</li>
</ul>

<h2>When to use Excel</h2>

<ul>
  <li>Reports and dashboards with charts and formatting</li>
  <li>Data that requires formulas and calculations</li>
  <li>Sharing with non-technical stakeholders who need a rich presentation</li>
  <li>Multiple related sheets in one file</li>
</ul>

<p>Convert CSV to JSON or Excel formats at <a href="/tools">Toolora → Converters → CSV to JSON</a>. Upload your file and download the converted output — processing happens in your browser, nothing is sent to a server.</p>
    `.trim(),
  },

  {
    slug: "api-authentication-api-key-vs-oauth",
    title: "API Keys vs OAuth: Which Should Your API Use?",
    description: "API keys are simple but limited. OAuth is flexible but complex. Here's when each authentication method is appropriate for your API.",
    date: "2026-05-04",
    readTime: "5 min read",
    category: "Security",
    content: `
<p>When you're building an API that other developers will consume, you need to decide how they'll authenticate. The two most common patterns are API keys and OAuth 2.0 tokens. They solve different problems, and choosing the wrong one creates friction for your users or security holes in your design.</p>

<h2>API keys: simple and effective for many use cases</h2>

<p>An API key is a secret string — typically a long random token — that a client includes with every request, usually in a header:</p>

<pre><code>Authorization: Bearer sk-a1b2c3d4e5f6...
# or
X-API-Key: sk-a1b2c3d4e5f6...</code></pre>

<p>The server looks up the key, identifies which account it belongs to, and enforces that account's permissions and rate limits.</p>

<p><strong>API keys work well when:</strong></p>
<ul>
  <li>The client is a server-side application (the key can be kept secret)</li>
  <li>You're building developer tools, data APIs, or infrastructure APIs</li>
  <li>The API is used on behalf of the key's owner (not on behalf of that owner's users)</li>
  <li>Simplicity matters — developers can start calling your API in minutes</li>
</ul>

<p><strong>API keys are a poor fit when:</strong></p>
<ul>
  <li>The client is a mobile app or browser — keys in client-side code are extractable by anyone</li>
  <li>You need scoped access (different keys for different permissions)</li>
  <li>The API needs to act on behalf of your users (not the developer themselves)</li>
</ul>

<h2>OAuth 2.0: delegation and scoped access</h2>

<p>OAuth is designed for delegation — "I authorize this app to access my resources on this service." It issues tokens with specific scopes that limit what the bearer can do. Tokens expire. They can be revoked without affecting the user's account credentials.</p>

<p><strong>OAuth works well when:</strong></p>
<ul>
  <li>Your API holds user data and third-party apps need access to it (think: "Connect with Spotify," "Import from Google Drive")</li>
  <li>You need granular permission scopes (read-only vs. read-write, specific resource types)</li>
  <li>Users should be able to revoke third-party access without changing their password</li>
  <li>Tokens should expire automatically for security</li>
</ul>

<p><strong>OAuth is overkill when:</strong></p>
<ul>
  <li>You're building a simple internal API or B2B service where the client is always a server</li>
  <li>There are no user resources to delegate access to</li>
  <li>Your developer users want to get started fast without implementing OAuth flows</li>
</ul>

<h2>The hybrid approach: many APIs use both</h2>

<p>Stripe uses API keys for direct server-to-server calls (your server charges customers using your secret key). They also support OAuth for marketplace platforms where you need to act on behalf of connected accounts.</p>

<p>GitHub uses both: personal access tokens (essentially API keys) for developer automation, and OAuth apps for third-party integrations that need access to users' repositories.</p>

<p>This is a reasonable architecture: start with API keys for simplicity, add OAuth when you need user-delegated access.</p>

<h2>Security practices for API keys</h2>

<ul>
  <li>Use long random keys (256 bits / 32 bytes is appropriate)</li>
  <li>Hash the key before storing it in your database — store <code>SHA-256(key)</code>, not the key itself</li>
  <li>Show the key only once (at creation time) and require users to regenerate if lost</li>
  <li>Support key rotation without downtime</li>
  <li>Prefix keys with your service name for instant recognition: <code>sk-...</code>, <code>sk_live_...</code></li>
  <li>Allow users to create multiple keys with optional labels (useful for revoking one integration without breaking others)</li>
</ul>
    `.trim(),
  },

  {
    slug: "what-is-websocket-vs-http",
    title: "WebSockets vs HTTP: When to Use Each",
    description: "HTTP is request-response. WebSockets keep a connection open for real-time bidirectional communication. Here's when the extra complexity is worth it.",
    date: "2026-05-04",
    readTime: "5 min read",
    category: "Developer Tools",
    content: `
<p>HTTP and WebSockets solve different communication problems. HTTP is designed for one-off request-response interactions. WebSockets maintain a persistent, bidirectional connection between client and server. Choosing the wrong one leads to either unnecessary complexity or the wrong performance characteristics.</p>

<h2>How HTTP works (and where it falls short)</h2>

<p>HTTP is stateless and request-response: the client sends a request, the server processes it and sends a response, and the connection closes (or is reused for the next request with keep-alive). The server cannot send data to the client unless the client asked for it first.</p>

<p>This model works well for 95% of web interactions: loading pages, submitting forms, calling APIs. But it breaks down for real-time scenarios where the server needs to push updates to the client without waiting for a request:</p>
<ul>
  <li>Live chat messages</li>
  <li>Real-time collaborative editing</li>
  <li>Live sports scores or stock prices</li>
  <li>Multiplayer game state</li>
  <li>Server-sent notifications</li>
</ul>

<p>The workarounds with HTTP are: polling (client asks repeatedly — wasteful), long polling (client asks and server holds the response open until something happens — hacky), or Server-Sent Events (SSE — server can push events, but only one direction).</p>

<h2>How WebSockets work</h2>

<p>A WebSocket starts as an HTTP request (the "upgrade handshake") and then upgrades the connection to a persistent TCP tunnel. Both client and server can send messages at any time, in either direction, without the overhead of HTTP headers on every message.</p>

<p>The handshake:</p>
<pre><code>GET /chat HTTP/1.1
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==

HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=</code></pre>

<p>After the 101 response, the connection is no longer HTTP — it's a WebSocket. Messages flow freely until either side closes the connection.</p>

<h2>WebSocket code (browser)</h2>

<pre><code>const ws = new WebSocket('wss://api.example.com/ws');

ws.onopen = () => {
  ws.send(JSON.stringify({ type: 'subscribe', channel: 'prices' }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};

ws.onclose = () => {
  console.log('Connection closed — reconnecting...');
};</code></pre>

<h2>When to use WebSockets</h2>

<ul>
  <li>Real-time features where the server pushes updates frequently</li>
  <li>Bidirectional communication (client and server both need to send at any time)</li>
  <li>Low-latency requirements (chat, gaming, collaborative tools)</li>
  <li>Many small messages (WebSocket frames have much less overhead than HTTP requests)</li>
</ul>

<h2>When HTTP is better</h2>

<ul>
  <li>Standard CRUD operations (REST APIs)</li>
  <li>Infrequent updates (polling every 30 seconds is simpler and sufficient)</li>
  <li>Server-only push without client messages (use Server-Sent Events instead — simpler, works with standard HTTP infrastructure)</li>
  <li>Caching is important (HTTP responses cache; WebSocket messages don't)</li>
</ul>

<h2>Operational considerations</h2>

<p>WebSockets add operational complexity. Load balancers need sticky sessions (a client's messages must go to the same server instance). Connections need heartbeat pings to prevent timeouts. Reconnection logic needs to handle dropped connections gracefully. Scaling stateful connections is harder than stateless HTTP.</p>

<p>For many "real-time" features, Server-Sent Events (SSE) is the right answer — simpler, works through HTTP/2 multiplexing, doesn't need special load balancer configuration. Use WebSockets when you genuinely need bidirectional real-time communication.</p>
    `.trim(),
  },

  {
    slug: "how-to-encode-url-parameters",
    title: "How to Encode URL Parameters (Avoiding Common Mistakes)",
    description: "Special characters in URLs need to be percent-encoded. Here's what breaks, how encoding works, and the functions to use in JavaScript, Python, and curl.",
    date: "2026-05-05",
    readTime: "4 min read",
    category: "Developer Tools",
    content: `
<p>URLs can only contain a limited set of safe characters. Everything else needs to be percent-encoded — converted to a <code>%XX</code> format where XX is the hexadecimal value of the byte. Getting this wrong produces broken links, 400 errors, and security vulnerabilities. Here's how to do it right.</p>

<h2>What needs encoding</h2>

<p>RFC 3986 defines the "unreserved characters" that can appear in URLs without encoding: uppercase and lowercase letters, digits, hyphens, underscores, periods, and tildes (<code>A-Za-z0-9-_.~</code>). Everything else — spaces, ampersands, equals signs, forward slashes, hash symbols, question marks — must be percent-encoded when used in contexts where they'd be misinterpreted.</p>

<p>Common characters and their encoded forms:</p>
<table>
  <thead>
    <tr><th>Character</th><th>Encoded</th><th>Why it matters</th></tr>
  </thead>
  <tbody>
    <tr><td>Space</td><td><code>%20</code> (or <code>+</code> in query strings)</td><td>Breaks URL parsing</td></tr>
    <tr><td>&amp;</td><td><code>%26</code></td><td>Separates query parameters</td></tr>
    <tr><td>=</td><td><code>%3D</code></td><td>Separates key from value</td></tr>
    <tr><td>+</td><td><code>%2B</code></td><td>Means "space" in query strings</td></tr>
    <tr><td>#</td><td><code>%23</code></td><td>Starts a fragment identifier</td></tr>
    <tr><td>/</td><td><code>%2F</code></td><td>Path separator</td></tr>
    <tr><td>?</td><td><code>%3F</code></td><td>Starts query string</td></tr>
  </tbody>
</table>

<h2>In JavaScript: use the right function</h2>

<p>JavaScript has four URL encoding functions. Using the wrong one is the most common mistake:</p>

<p><code>encodeURIComponent(str)</code> — encodes everything except unreserved characters. Use this for encoding individual query parameter values or path segments.</p>

<pre><code>const query = "?q=" + encodeURIComponent('hello world &amp; more');
// → ?q=hello%20world%20%26%20more</code></pre>

<p><code>encodeURI(str)</code> — encodes most characters but leaves the URL structure intact (<code>://?&=</code> are NOT encoded). Use this only to encode a complete URL, not its components.</p>

<p><code>URLSearchParams</code> — the modern, correct way to build query strings:</p>
<pre><code>const params = new URLSearchParams({ q: 'hello world', page: '2' });
const url = "https://example.com/search?" + params;
// → https://example.com/search?q=hello+world&page=2</code></pre>

<p>Note: <code>URLSearchParams</code> uses <code>+</code> for spaces (application/x-www-form-urlencoded format) rather than <code>%20</code>. Both are valid in query strings — servers should handle both.</p>

<h2>In Python</h2>

<pre><code>from urllib.parse import urlencode, quote

# Encode a single value
encoded = quote('hello world &amp; more')  # → hello%20world%20%26%20more

# Encode query parameters
params = urlencode({'q': 'hello world', 'page': 2})  # → q=hello+world&page=2</code></pre>

<h2>In curl</h2>

<pre><code># curl doesn't encode for you — encode first
curl "https://api.example.com/search?q=hello%20world%20%26%20more"

# Or use --data-urlencode for POST parameters
curl --data-urlencode "q=hello world &amp; more" https://api.example.com/search</code></pre>

<h2>Decoding</h2>

<p>Percent-decoding is the reverse: <code>%20</code> → space. In JavaScript: <code>decodeURIComponent('%20')</code>. In Python: <code>urllib.parse.unquote('%20')</code>.</p>

<p>Encode and decode URLs at <a href="/tools">Toolora → Encoding → URL Encoder</a> — useful for debugging encoded API parameters or building URLs manually.</p>
    `.trim(),
  },

  {
    slug: "json-data-types-reference",
    title: "JSON Data Types: A Complete Reference",
    description: "JSON has exactly six data types. Here's what each one is, the edge cases that catch developers out, and how they map to types in different programming languages.",
    date: "2026-05-05",
    readTime: "4 min read",
    category: "Developer Tools",
    content: `
<p>JSON is deliberately minimal. It defines exactly six data types, and everything in any JSON document is one of them. Understanding these types — including the edge cases — prevents a category of bugs that show up when data crosses language or system boundaries.</p>

<h2>The six types</h2>

<h3>1. String</h3>
<p>A sequence of Unicode characters in double quotes. Single quotes are not valid JSON. The backslash escape sequences supported: <code>\"</code>, <code>\\</code>, <code>\/</code>, <code>\b</code>, <code>\f</code>, <code>\n</code>, <code>\r</code>, <code>\t</code>, and <code>\\uXXXX</code> (Unicode escape, where X is a hex digit).</p>
<pre><code>"Hello, world!"
"Line one\\nLine two"
"Unicode: \\u00e9"  // é</code></pre>

<h3>2. Number</h3>
<p>JSON has one number type — no integers vs floats distinction. All numbers are IEEE 754 double-precision floats.</p>
<pre><code>42
-7
3.14
1.5e10
-2.5E-3</code></pre>
<p><strong>Critical edge case:</strong> IEEE 754 doubles can only represent integers exactly up to 2^53 (9,007,199,254,740,992). Larger integers lose precision. This is why Twitter/X sends tweet IDs as both a number and a string in their API — JSON parsers in JavaScript would round large integer IDs.</p>
<p>Not valid: <code>NaN</code>, <code>Infinity</code>, <code>-Infinity</code>, leading zeros (<code>007</code>), trailing dots (<code>1.</code>).</p>

<h3>3. Boolean</h3>
<p><code>true</code> and <code>false</code> — lowercase only. <code>True</code>, <code>TRUE</code>, <code>"true"</code> are not valid JSON booleans.</p>

<h3>4. Null</h3>
<p><code>null</code> — lowercase only. Represents the intentional absence of a value. Different from an absent field: <code>{"key": null}</code> and <code>{}</code> are different — the first has the key with a null value, the second doesn't have the key at all.</p>

<h3>5. Array</h3>
<p>An ordered list of values in square brackets. Values can be any JSON type, and they don't need to be the same type:</p>
<pre><code>[1, "two", true, null, {"three": 3}]</code></pre>
<p>Trailing commas are not allowed: <code>[1, 2, 3,]</code> is invalid JSON.</p>

<h3>6. Object</h3>
<p>An unordered collection of key-value pairs in curly braces. Keys must be strings (in double quotes). Values can be any JSON type:</p>
<pre><code>{"name": "Alice", "age": 30, "active": true}</code></pre>
<p>Keys must be unique within an object — duplicate keys are technically undefined behavior. Most parsers keep the last value for duplicate keys, but don't rely on this.</p>

<h2>Type mapping across languages</h2>

<table>
  <thead>
    <tr><th>JSON</th><th>JavaScript</th><th>Python</th><th>Java</th><th>Go</th></tr>
  </thead>
  <tbody>
    <tr><td>string</td><td>String</td><td>str</td><td>String</td><td>string</td></tr>
    <tr><td>number</td><td>Number</td><td>int / float</td><td>int / double</td><td>float64</td></tr>
    <tr><td>boolean</td><td>Boolean</td><td>bool</td><td>boolean</td><td>bool</td></tr>
    <tr><td>null</td><td>null</td><td>None</td><td>null</td><td>nil</td></tr>
    <tr><td>array</td><td>Array</td><td>list</td><td>List</td><td>slice</td></tr>
    <tr><td>object</td><td>Object</td><td>dict</td><td>Map / POJO</td><td>map / struct</td></tr>
  </tbody>
</table>

<h2>What JSON doesn't have</h2>

<ul>
  <li>No date type — dates are always strings (ISO 8601 format by convention)</li>
  <li>No undefined — only null</li>
  <li>No binary data — blobs are Base64-encoded strings</li>
  <li>No comments — any comment-like syntax is invalid JSON</li>
  <li>No integer type — only number</li>
</ul>

<p>Format and validate JSON instantly at <a href="/tools">Toolora → Developer → JSON Formatter</a>.</p>
    `.trim(),
  },

  {
    slug: "what-is-ssl-tls-https-explained",
    title: "SSL, TLS, and HTTPS: What's the Difference?",
    description: "SSL is obsolete, TLS is the real protocol, and HTTPS is TLS applied to HTTP. Here's how they relate, how the handshake works, and what certificates actually prove.",
    date: "2026-05-06",
    readTime: "5 min read",
    category: "Security",
    content: `
<p>"SSL certificate," "TLS encryption," and "HTTPS" are often used interchangeably in everyday speech, but they refer to different things. Understanding the distinction helps when debugging certificate errors, configuring servers, or understanding what HTTPS actually protects you from.</p>

<h2>SSL vs TLS: what's the difference?</h2>

<p>SSL (Secure Sockets Layer) was the original protocol, developed by Netscape in the mid-1990s. It had three versions: SSL 1.0 (never released publicly), SSL 2.0 (broken), and SSL 3.0 (also broken — POODLE attack in 2014).</p>

<p>TLS (Transport Layer Security) is the successor to SSL, developed by the IETF. TLS 1.0, 1.1, and 1.2 were released from 1999 to 2008. TLS 1.3 (2018) is the current version and is significantly redesigned for security and performance.</p>

<p>No modern system uses SSL. When someone says "SSL certificate" or "SSL encryption," they mean TLS. The terminology stuck even as the protocol evolved.</p>

<h2>HTTPS = HTTP + TLS</h2>

<p>HTTPS is simply HTTP transported over a TLS connection. The "S" stands for Secure. Everything you know about HTTP — status codes, headers, methods — works identically under HTTPS. TLS provides:</p>

<ul>
  <li><strong>Encryption:</strong> The data in transit is encrypted. An interceptor sees random bytes, not your request or the response.</li>
  <li><strong>Authentication:</strong> The server proves it's the genuine owner of the domain (via the certificate). You know you're talking to actual google.com, not an impersonator.</li>
  <li><strong>Integrity:</strong> Data can't be modified in transit without detection. A middleman can't inject ads, malware, or modified content into the response.</li>
</ul>

<h2>What a TLS certificate actually proves</h2>

<p>A TLS certificate is a file containing the server's public key and identity information, signed by a Certificate Authority (CA) that your browser trusts. Your browser has a list of trusted CAs baked in — around 100–150 root CAs from companies like DigiCert, Let's Encrypt, and Comodo.</p>

<p>When you connect to a site, the server presents its certificate. Your browser verifies:</p>
<ol>
  <li>The certificate was signed by a trusted CA</li>
  <li>The certificate hasn't expired</li>
  <li>The domain in the certificate matches the domain you're visiting</li>
  <li>The certificate hasn't been revoked</li>
</ol>

<p>What certificates prove: the entity that obtained the certificate controls the domain. DV (Domain Validation) certificates — the most common type, issued instantly by Let's Encrypt — only verify domain control. OV (Organization Validation) and EV (Extended Validation) certificates verify business identity too, but the browser UI differences between them have become minimal.</p>

<h2>The TLS 1.3 handshake (simplified)</h2>

<ol>
  <li>Client sends a "ClientHello" with supported cipher suites and a random value</li>
  <li>Server responds with its chosen cipher suite, its certificate, and a key share</li>
  <li>Client verifies the certificate and derives session keys from the key exchange</li>
  <li>Encrypted data can flow</li>
</ol>

<p>TLS 1.3 reduced the handshake from 2 round-trips (TLS 1.2) to 1 round-trip, with a "0-RTT resumption" mode for returning connections that adds zero round-trip overhead. This makes HTTPS noticeably faster than older TLS versions.</p>

<h2>Common certificate errors</h2>

<ul>
  <li><strong>NET::ERR_CERT_COMMON_NAME_INVALID:</strong> The certificate is for a different domain (e.g., certificate says example.com, you're visiting www.example.com)</li>
  <li><strong>NET::ERR_CERT_DATE_INVALID:</strong> Certificate is expired or your system clock is wrong</li>
  <li><strong>NET::ERR_CERT_AUTHORITY_INVALID:</strong> Self-signed certificate or signed by an untrusted CA</li>
</ul>

<h2>Getting HTTPS for free</h2>

<p>Let's Encrypt issues free, automated DV certificates. Certbot is the standard client for obtaining and renewing them. Most hosting platforms (Vercel, Netlify, Cloudflare, Fly.io) handle certificate management automatically. There's no reason to pay for a basic DV certificate in 2026.</p>
    `.trim(),
  },

  {
    slug: "image-formats-webp-vs-jpg-vs-png",
    title: "WebP vs JPG vs PNG: Which Image Format Should You Use?",
    description: "Choosing the right image format can cut your page weight in half. Here's a practical guide to JPG, PNG, WebP, AVIF, and GIF — and when to use each.",
    date: "2026-05-06",
    readTime: "5 min read",
    category: "Tools",
    content: `
<p>Image format choice is one of the highest-ROI performance decisions you can make for a website. Using the wrong format for the content type — like PNG for photos or JPEG for sharp-edged graphics — can easily double your image file sizes. Here's a practical breakdown of when to use each format.</p>

<h2>JPEG (.jpg / .jpeg): the photo standard</h2>

<p><strong>Best for:</strong> Photographs, complex images with many colors and gradients</p>
<p><strong>Compression:</strong> Lossy — discards detail the eye can't easily see</p>
<p><strong>Transparency:</strong> Not supported</p>
<p><strong>Animation:</strong> Not supported</p>

<p>JPEG uses a mathematical transform (DCT) that works well for the high-frequency detail in photographs. At quality 80–85, a well-compressed JPEG is indistinguishable from the original to most people at normal viewing distances. Below quality 60, you start seeing "artifacts" — blocky areas and color halos around high-contrast edges.</p>

<p>Use JPEG for: product photos, hero images, portraits, any image that was originally a photograph.</p>
<p>Don't use JPEG for: logos, screenshots, diagrams, text-heavy images — the DCT artifacts appear prominently around sharp edges and text.</p>

<h2>PNG (.png): lossless for graphics</h2>

<p><strong>Best for:</strong> Screenshots, logos, icons, images with text, images requiring transparency</p>
<p><strong>Compression:</strong> Lossless — no quality loss</p>
<p><strong>Transparency:</strong> Full alpha channel support</p>
<p><strong>Animation:</strong> APNG (rare support)</p>

<p>PNG files are larger than JPEG for photographs (because lossless compression doesn't discard data) but smaller for images with large flat-color regions, sharp lines, and text. A screenshot of a UI is a classic PNG use case — JPEG artifacts make text look blurry.</p>

<p>Optimize PNG files with pngquant (lossy palette reduction) or oxipng (lossless optimization) before serving — you can often reduce PNG size by 30–60% without visible quality change.</p>

<h2>WebP: the modern default</h2>

<p><strong>Best for:</strong> Most web images in modern browsers</p>
<p><strong>Compression:</strong> Both lossy and lossless modes</p>
<p><strong>Transparency:</strong> Supported</p>
<p><strong>Browser support:</strong> All modern browsers (Chrome, Firefox, Safari 14+, Edge)</p>

<p>WebP typically achieves 25–35% smaller file sizes than JPEG at equivalent visual quality, and beats PNG for lossless compression too. It supports transparency (unlike JPEG) and both lossy and lossless modes (unlike JPEG/PNG being one or the other). For most web images, WebP should be your default output format in 2026.</p>

<h2>AVIF: the best compression, limited support</h2>

<p><strong>Compression:</strong> 40–50% smaller than JPEG at equivalent quality</p>
<p><strong>Browser support:</strong> Chrome 85+, Firefox 93+, Safari 16+</p>

<p>AVIF (based on the AV1 video codec) achieves the best compression of any common web format. Encoding is slow, which is why it's less widely adopted despite superior output quality. Use the <code>&lt;picture&gt;</code> element with AVIF as the first source and WebP as the fallback.</p>

<h2>GIF: the legacy format to avoid</h2>

<p>GIF is a 256-color indexed format from 1987. It remains in use only for simple animations. For new work: use WebP animated images (much smaller) or video (<code>&lt;video autoplay loop muted playsinline&gt;</code>) for animation.</p>

<h2>SVG: vector graphics</h2>

<p>SVG is the right format for logos, icons, and illustrations that need to scale to any size without pixelation. SVG files are XML text — they can be inlined in HTML, styled with CSS, and animated with JavaScript. For any graphic that was created as vectors (Figma, Illustrator), export as SVG rather than rasterizing to PNG.</p>

<h2>Quick decision tree</h2>

<ul>
  <li>Photograph or complex image → WebP (with JPEG fallback)</li>
  <li>Logo / icon / vector → SVG</li>
  <li>Screenshot / UI / text → PNG or WebP lossless</li>
  <li>Needs transparency → WebP or PNG</li>
  <li>Animation → WebP animated or <code>&lt;video&gt;</code></li>
  <li>Maximum compression, modern browsers only → AVIF</li>
</ul>

<p>Compress and convert images at <a href="/tools">Toolora → Image Tools</a> — all processing happens in your browser, nothing is uploaded.</p>
    `.trim(),
  },

  {
    slug: "how-to-use-curl-for-api-testing",
    title: "How to Use curl to Test APIs (Quick Reference)",
    description: "curl is the fastest way to test an API from the command line. Here's the commands you'll use most often, with real examples.",
    date: "2026-05-07",
    readTime: "5 min read",
    category: "Developer Tools",
    content: `
<p>curl is a command-line tool for making HTTP requests. It's available on every platform, requires no setup, and gives you precise control over every aspect of a request. For testing APIs — especially during development or debugging — it's often faster than Postman or writing test code. Here are the commands you'll use most often.</p>

<h2>Basic GET request</h2>

<pre><code>curl https://api.example.com/users</code></pre>

<p>curl makes a GET request by default and prints the response body to stdout. Add <code>-i</code> to include response headers, <code>-I</code> for headers only (HEAD request).</p>

<h2>POST with JSON body</h2>

<pre><code>curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice", "email": "alice@example.com"}'</code></pre>

<p><code>-X POST</code> — set the HTTP method<br>
<code>-H</code> — add a header<br>
<code>-d</code> — the request body (automatically sets method to POST if you don't specify)</p>

<p>On Windows, use double quotes for the outer string and escape inner quotes: <code>-d "{\"name\": \"Alice\"}"</code>. Or use a file (see below).</p>

<h2>Send JSON from a file</h2>

<pre><code>curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d @payload.json</code></pre>

<p>The <code>@</code> prefix tells curl to read the body from a file. Cleaner than trying to escape JSON in the shell.</p>

<h2>Authentication</h2>

<pre><code># Bearer token
curl https://api.example.com/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..."

# API key in header
curl https://api.example.com/data \
  -H "X-API-Key: sk-abc123"

# Basic auth
curl -u username:password https://api.example.com/private

# Basic auth (curl encodes to Base64 automatically)
curl -H "Authorization: Basic $(echo -n 'user:pass' | base64)" \
  https://api.example.com/private</code></pre>

<h2>Form data (URL-encoded)</h2>

<pre><code>curl -X POST https://api.example.com/login \
  -d "username=alice&password=secret"</code></pre>

<p>With <code>-d</code> and no Content-Type header, curl defaults to <code>application/x-www-form-urlencoded</code>.</p>

<h2>File upload (multipart)</h2>

<pre><code>curl -X POST https://api.example.com/upload \
  -F "file=@/path/to/document.pdf" \
  -F "description=My document"</code></pre>

<p><code>-F</code> creates a multipart/form-data request. Use <code>@</code> for file uploads.</p>

<h2>Useful flags</h2>

<table>
  <thead>
    <tr><th>Flag</th><th>What it does</th></tr>
  </thead>
  <tbody>
    <tr><td><code>-v</code></td><td>Verbose — shows full request and response headers</td></tr>
    <tr><td><code>-s</code></td><td>Silent — suppresses progress and error output</td></tr>
    <tr><td><code>-o file.json</code></td><td>Save response body to a file</td></tr>
    <tr><td><code>-w "%{http_code}"</code></td><td>Print the HTTP status code after the response</td></tr>
    <tr><td><code>-L</code></td><td>Follow redirects</td></tr>
    <tr><td><code>-k</code></td><td>Skip SSL certificate verification (dev only)</td></tr>
    <tr><td><code>--max-time 10</code></td><td>Abort if the request takes more than 10 seconds</td></tr>
    <tr><td><code>-c cookies.txt</code></td><td>Save cookies to a file</td></tr>
    <tr><td><code>-b cookies.txt</code></td><td>Send cookies from a file</td></tr>
  </tbody>
</table>

<h2>Pretty-print JSON response</h2>

<pre><code>curl https://api.example.com/users | python3 -m json.tool
# or
curl https://api.example.com/users | jq .</code></pre>

<p>curl doesn't format JSON output. Pipe to <code>python3 -m json.tool</code> (no install needed) or <code>jq</code> for readable output.</p>

<h2>Test Toolora's API</h2>

<pre><code>curl https://toolora.dev/api/v1/tools \
  -H "Authorization: Bearer YOUR_API_KEY" | jq .</code></pre>

<p>All Toolora API endpoints are documented at <a href="/api-docs">toolora.dev/api-docs</a>.</p>
    `.trim(),
  },

  {
    slug: "what-is-content-security-policy",
    title: "Content Security Policy (CSP): How to Protect Your Site From XSS",
    description: "CSP is an HTTP header that tells browsers which sources are allowed to load scripts, styles, and other resources. Here's how to write one without breaking your site.",
    date: "2026-05-07",
    readTime: "6 min read",
    category: "Security",
    content: `
<p>Cross-site scripting (XSS) is one of the most common web vulnerabilities — an attacker injects malicious JavaScript into your page, which then runs in your users' browsers. Content Security Policy (CSP) is a browser mechanism that limits what scripts can run and where resources can be loaded from, making XSS attacks much harder to execute even if a vulnerability exists.</p>

<h2>How CSP works</h2>

<p>CSP is delivered as an HTTP response header (or a <code>&lt;meta&gt;</code> tag, though headers are more powerful). It tells the browser: "Only trust scripts from these sources. Refuse everything else."</p>

<pre><code>Content-Security-Policy: default-src 'self'; script-src 'self' cdn.example.com; style-src 'self' 'unsafe-inline'</code></pre>

<p>If a malicious script injection tries to run <code>&lt;script src="https://evil.com/malware.js"&gt;</code>, the browser blocks it because <code>evil.com</code> isn't in the allowed sources.</p>

<h2>The directives</h2>

<p><code>default-src</code> — the fallback for any directive not explicitly set. Start here.</p>
<p><code>script-src</code> — where JavaScript can be loaded from (the most important)</p>
<p><code>style-src</code> — CSS sources</p>
<p><code>img-src</code> — image sources</p>
<p><code>font-src</code> — web font sources</p>
<p><code>connect-src</code> — URLs for XMLHttpRequest, fetch, WebSocket, EventSource</p>
<p><code>frame-src</code> — sources allowed in iframes</p>
<p><code>object-src</code> — Flash and other plugin content (set to <code>'none'</code> — nothing should use this)</p>

<h2>Source values</h2>

<ul>
  <li><code>'self'</code> — the same origin (scheme + host + port)</li>
  <li><code>'none'</code> — block everything</li>
  <li><code>'unsafe-inline'</code> — allow inline scripts/styles (significantly weakens CSP)</li>
  <li><code>'unsafe-eval'</code> — allow <code>eval()</code> and <code>new Function()</code> (also weakens CSP)</li>
  <li><code>https://cdn.example.com</code> — a specific origin</li>
  <li><code>https:</code> — any HTTPS source (wide open for that directive)</li>
  <li><code>'nonce-abc123'</code> — allow a specific inline script with this nonce value</li>
  <li><code>'sha256-base64hash'</code> — allow a specific inline script matching this hash</li>
</ul>

<h2>The inline script problem</h2>

<p>The biggest challenge when adopting CSP: <code>'unsafe-inline'</code>. If your site has inline <code>&lt;script&gt;</code> tags or inline event handlers (<code>onclick="..."</code>), you need <code>'unsafe-inline'</code> in <code>script-src</code> — which mostly defeats CSP's purpose.</p>

<p>Solutions:</p>
<ul>
  <li><strong>Move scripts to external files</strong> — the cleanest approach</li>
  <li><strong>Use nonces</strong> — generate a random nonce per request, add it to the CSP header and to each <code>&lt;script nonce="..."&gt;</code> tag. Attackers can't guess the nonce.</li>
  <li><strong>Use hashes</strong> — compute SHA-256 of the exact script content and add it to the policy. The browser allows the script only if the content matches.</li>
</ul>

<h2>Starting with report-only mode</h2>

<p>Use <code>Content-Security-Policy-Report-Only</code> instead of <code>Content-Security-Policy</code> to test your policy without breaking anything. The browser logs violations but doesn't block anything. Add a <code>report-uri</code> directive to collect violation reports:</p>

<pre><code>Content-Security-Policy-Report-Only: default-src 'self'; report-uri https://your-csp-reporter.example.com</code></pre>

<p>Review the reports, adjust your policy to allow legitimate sources, then switch to enforcing mode.</p>

<h2>A practical starter policy</h2>

<pre><code>Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-{generated-per-request}';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.example.com;
  object-src 'none';
  frame-ancestors 'none';
  base-uri 'self'</code></pre>

<p><code>frame-ancestors 'none'</code> prevents your site from being embedded in iframes (clickjacking protection). <code>base-uri 'self'</code> prevents injection of a malicious <code>&lt;base&gt;</code> tag that would redirect relative URLs.</p>
    `.trim(),
  },

  {
    slug: "privacy-by-design-explained",
    title: "Privacy by Design: What It Is and Why It Matters in 2026",
    description: "Privacy by Design means building privacy into your product from the start, not adding it later. Here's what the seven principles are and how they apply to real product decisions.",
    date: "2026-05-08",
    readTime: "5 min read",
    category: "Privacy",
    content: `
<p>Privacy by Design (PbD) was originally a framework developed by Ann Cavoukian, Ontario's Information and Privacy Commissioner, in the 1990s. It's now embedded in GDPR Article 25 as a legal requirement for any product handling EU personal data. But beyond compliance, its seven principles represent genuinely good product philosophy — one that builds user trust and avoids expensive retrofits.</p>

<h2>The seven foundational principles</h2>

<h3>1. Proactive, not reactive; preventive, not remedial</h3>
<p>Privacy problems are anticipated and prevented before they occur. The alternative — identifying privacy issues after launch and patching them — is more expensive, more damaging, and often impossible to fully remediate once data has already been collected.</p>

<h3>2. Privacy as the default setting</h3>
<p>Without the user taking any action, privacy should be maximized. If a user does nothing, their data is protected by default. Users should opt in to data sharing, not opt out. The burden of action should be on the data collector, not the user.</p>

<h3>3. Privacy embedded into design</h3>
<p>Privacy isn't a separate module or a checkbox at the end of the development cycle. It's built into the system architecture and product design from the beginning. This means making privacy decisions during feature design, not after.</p>

<h3>4. Full functionality — positive-sum, not zero-sum</h3>
<p>Privacy and functionality aren't trade-offs. The framing "we can't do X because privacy" almost always reflects a design failure, not an inherent conflict. Both goals can be achieved simultaneously — PbD requires demonstrating this, not accepting the false dichotomy.</p>

<h3>5. End-to-end security — full lifecycle protection</h3>
<p>Data is protected throughout its entire lifecycle — collection, storage, use, and deletion. Secure deletion is part of the design, not an afterthought. Data that's no longer needed is deleted, not retained indefinitely "just in case."</p>

<h3>6. Visibility and transparency</h3>
<p>What you collect and how you use it should be transparent and verifiable. Privacy policies should be readable. Data practices should match stated policies. Users should be able to verify what you claim.</p>

<h3>7. Respect for user privacy — keep it user-centric</h3>
<p>The interests of the user take precedence. Design decisions default to the user's benefit, not the operator's convenience. Users get control over their data — access, correction, deletion.</p>

<h2>What this looks like in practice</h2>

<p><strong>Data minimization:</strong> Collect only the data you actually need for the stated purpose. Not "might be useful someday." If you don't collect it, you can't leak it.</p>

<p><strong>Purpose limitation:</strong> Define why you're collecting each piece of data and don't use it for other purposes without consent. The data you collected for analytics shouldn't end up in your marketing segmentation without users knowing.</p>

<p><strong>Client-side processing:</strong> If computation can happen in the user's browser without the data ever reaching your servers, that's strictly better from a privacy standpoint. Tools that process files locally (like Toolora's approach) are a practical implementation of Privacy by Design.</p>

<p><strong>Retention policies:</strong> Set specific retention periods for different data categories and enforce automatic deletion. "We keep data indefinitely" is not a privacy-respecting default.</p>

<p><strong>Access controls:</strong> Only people who need access to specific data get it. Your marketing team doesn't need access to raw user account data. Enforce this with role-based access control, not informal norms.</p>

<h2>The compliance angle</h2>

<p>GDPR Article 25 requires "data protection by design and by default" — meaning controllers must implement Privacy by Design principles and demonstrate they've done so. This has made PbD relevant not just philosophically but legally. CCPA, PIPEDA, and similar privacy laws reinforce these principles across different jurisdictions.</p>

<p>The pattern of building quickly, collecting broadly, and cleaning up later is increasingly legally risky, not just ethically questionable. Building with privacy from the start is the lower-risk path.</p>
    `.trim(),
  },

  {
    slug: "read-pdf-browser-without-upload",
    title: "How to Read and Work With PDFs in the Browser Without Uploading Them",
    description: "You don't need to upload a PDF to read, compress, split, or extract text from it. Modern browsers can process PDFs entirely locally. Here's how.",
    date: "2026-05-08",
    readTime: "4 min read",
    category: "Privacy",
    content: `
<p>Most PDF tools on the web work by uploading your file to a server, processing it there, and returning the result. For personal documents, legal files, medical records, or confidential business documents, this is a significant privacy concern — your file may be stored, logged, or accessible to the service provider. But modern browsers are capable enough to process PDFs entirely locally, without your document ever leaving your machine.</p>

<h2>What the browser can do with PDFs</h2>

<p><strong>Read and render:</strong> Firefox has built-in PDF rendering. Chrome and Edge use PDF.js (Mozilla's JavaScript PDF renderer). Both display PDFs without plugins.</p>

<p><strong>Extract text:</strong> PDF.js can extract the text content of a PDF programmatically. This is useful for searching, copying, or processing document text without uploading the file.</p>

<p><strong>Compress:</strong> PDF compression libraries compiled to WebAssembly (like those based on Ghostscript or libpoppler) can recompress PDF images and optimize structure locally in the browser. File size reductions of 30–70% are common.</p>

<p><strong>Split and merge:</strong> PDF-lib and similar JavaScript libraries can split a PDF into individual pages or merge multiple PDFs. These operations run entirely in memory in the browser tab.</p>

<p><strong>Add signatures and annotations:</strong> Client-side PDF libraries support adding digital signatures, stamps, and annotations without server round-trips.</p>

<p><strong>OCR (text recognition from scanned PDFs):</strong> Tesseract.js — the JavaScript port of Google's OCR engine — runs in the browser and can extract text from image-based PDFs locally.</p>

<h2>How to verify a tool processes locally</h2>

<p>Open your browser's Network tab (DevTools → Network) before using a PDF tool. After opening or processing a file, check whether any network requests were made that could have transmitted your document:</p>
<ul>
  <li>Look for POST requests to the service's domain with large payloads</li>
  <li>Check the request size — if it's close to your PDF file size, the file was uploaded</li>
  <li>If no network requests fire after you interact with the file, processing is local</li>
</ul>

<p>Alternatively, disconnect from the internet and try the tool. Client-side tools will still work; server-dependent tools will fail.</p>

<h2>Toolora's PDF tools</h2>

<p>All of Toolora's PDF tools — compress, split, merge, extract text — process files in your browser using WebAssembly. Your documents are never transmitted to Toolora's servers. You can verify this with the Network tab: after opening a PDF in any Toolora tool, no upload request fires.</p>

<p>This matters for the documents where it matters most: contracts, medical records, legal filings, financial statements. The privacy guarantee isn't a marketing claim — it's an architectural reality that you can verify yourself.</p>

<h2>When you do need server-side processing</h2>

<p>Some operations are genuinely beyond what browsers can do efficiently:</p>
<ul>
  <li>Very large PDFs (hundreds of MB) where memory limits are a constraint</li>
  <li>Complex OCR on hundreds of pages (performance)</li>
  <li>Batch processing of thousands of files</li>
  <li>Operations requiring specialized software not available in WASM</li>
</ul>

<p>For these cases, using a server-side tool is often necessary. The key is choosing a provider you trust, checking their data retention policy, and understanding what happens to your uploaded file after processing.</p>
    `.trim(),
  },

  {
    slug: "markdown-front-matter-guide",
    title: "Markdown Front Matter: What It Is and How to Use It",
    description: "Front matter is metadata embedded at the top of a Markdown file in YAML or TOML format. Here's how it works, what platforms support it, and what you can store in it.",
    date: "2026-05-09",
    readTime: "4 min read",
    category: "Developer Tools",
    content: `
<p>Front matter is a block of metadata at the very beginning of a Markdown file, delimited by triple dashes. It lets you attach structured data — title, date, author, tags, layout, slug — to a document without putting that information in the document content itself. It's supported by static site generators, documentation platforms, and many Markdown editors.</p>

<h2>The format</h2>

<pre><code>---
title: "My Blog Post Title"
date: 2026-05-09
author: Alice
tags: [developer, tools, markdown]
draft: false
slug: "my-blog-post-title"
---

The actual content of the post starts here.</code></pre>

<p>The content between the first <code>---</code> and the second <code>---</code> is YAML. Everything after is the Markdown document. The front matter is not rendered as content — it's processed separately as metadata.</p>

<h2>Alternative formats</h2>

<p>Some platforms use TOML front matter (delimited by <code>+++</code>) or JSON front matter (delimited by <code>{</code> and <code>}</code>). Hugo uses TOML by default. Jekyll uses YAML. Astro supports all three:</p>

<pre><code>+++
title = "My Post"
date = 2026-05-09
+++</code></pre>

<h2>Common front matter fields</h2>

<table>
  <thead>
    <tr><th>Field</th><th>Type</th><th>Common use</th></tr>
  </thead>
  <tbody>
    <tr><td><code>title</code></td><td>string</td><td>Page title, used in &lt;title&gt; and h1</td></tr>
    <tr><td><code>date</code></td><td>date</td><td>Publication date for sorting and display</td></tr>
    <tr><td><code>description</code></td><td>string</td><td>Meta description for SEO</td></tr>
    <tr><td><code>tags</code></td><td>array</td><td>Content categorization, tag pages</td></tr>
    <tr><td><code>draft</code></td><td>boolean</td><td>Exclude from production build if true</td></tr>
    <tr><td><code>slug</code></td><td>string</td><td>Override the URL slug</td></tr>
    <tr><td><code>layout</code></td><td>string</td><td>Which template to render with</td></tr>
    <tr><td><code>image</code></td><td>string</td><td>OG image path for social sharing</td></tr>
    <tr><td><code>author</code></td><td>string</td><td>Author attribution</td></tr>
    <tr><td><code>canonicalUrl</code></td><td>string</td><td>Canonical URL if syndicated from another source</td></tr>
  </tbody>
</table>

<h2>Platform support</h2>

<ul>
  <li><strong>Jekyll:</strong> The original popularizer of YAML front matter. Required for any Jekyll page or post.</li>
  <li><strong>Hugo:</strong> Supports YAML, TOML, and JSON front matter. Very flexible.</li>
  <li><strong>Astro:</strong> Full TypeScript type inference for front matter fields with <code>defineCollection</code>.</li>
  <li><strong>Next.js + MDX:</strong> Front matter parsed by libraries like <code>gray-matter</code>.</li>
  <li><strong>Obsidian:</strong> Uses YAML front matter for note properties and metadata.</li>
  <li><strong>GitHub README:</strong> GitHub doesn't render front matter — it appears as a table in the rendered output. Avoid front matter in GitHub READMEs.</li>
</ul>

<h2>Parsing front matter programmatically</h2>

<pre><code>import matter from 'gray-matter';
import fs from 'fs';

const fileContent = fs.readFileSync('post.md', 'utf-8');
const { data, content } = matter(fileContent);

console.log(data.title);  // "My Blog Post Title"
console.log(data.date);   // 2026-05-09T00:00:00.000Z
console.log(content);     // The markdown content (without front matter)</code></pre>

<p><code>gray-matter</code> is the standard JavaScript library for parsing front matter. It handles YAML, TOML, and JSON, and is used internally by Next.js, Astro, and many other frameworks.</p>
    `.trim(),
  },

  {
    slug: "how-to-create-favicon-for-website",
    title: "How to Create a Favicon for Your Website (2026 Guide)",
    description: "A favicon appears in browser tabs, bookmarks, and search results. Here's what sizes you need, how to generate them, and the HTML to add them correctly.",
    date: "2026-05-09",
    readTime: "4 min read",
    category: "Developer Tools",
    content: `
<p>A favicon is the small icon that appears in browser tabs, bookmark lists, home screen shortcuts, and sometimes in search results. A missing or blurry favicon signals an unfinished site. Getting it right requires more than a single 16×16 PNG — modern devices need multiple sizes and formats.</p>

<h2>What you actually need</h2>

<table>
  <thead>
    <tr><th>File</th><th>Size</th><th>Used for</th></tr>
  </thead>
  <tbody>
    <tr><td>favicon.ico</td><td>16×16, 32×32 (multi-size)</td><td>Legacy browsers, browser tabs (ICO format)</td></tr>
    <tr><td>favicon-32x32.png</td><td>32×32</td><td>Modern browsers, high-DPI tabs</td></tr>
    <tr><td>favicon-16x16.png</td><td>16×16</td><td>Browser tabs at 1× density</td></tr>
    <tr><td>apple-touch-icon.png</td><td>180×180</td><td>iOS home screen bookmarks</td></tr>
    <tr><td>android-chrome-192x192.png</td><td>192×192</td><td>Android home screen</td></tr>
    <tr><td>android-chrome-512x512.png</td><td>512×512</td><td>PWA splash screen, app store</td></tr>
    <tr><td>safari-pinned-tab.svg</td><td>SVG</td><td>Safari pinned tabs (must be single-color SVG)</td></tr>
    <tr><td>site.webmanifest</td><td>JSON</td><td>PWA metadata, references android icons</td></tr>
  </tbody>
</table>

<h2>Creating the source image</h2>

<p>Start with a square image at least 512×512 pixels. SVG is ideal as the source because it's infinitely scalable. Key design considerations:</p>

<ul>
  <li>At 16×16, only 256 pixels — complex designs become unrecognizable. Simple shapes and bold colors work best.</li>
  <li>Test your favicon at small sizes before committing to the design.</li>
  <li>Avoid thin lines that disappear at small sizes.</li>
  <li>Use a background color unless the icon works on both light and dark browser chrome.</li>
</ul>

<h2>Generating all sizes automatically</h2>

<p>The fastest approach: use a favicon generator like realfavicongenerator.net — upload your source image and it generates all required sizes plus the HTML code. This is the standard workflow for most developers.</p>

<p>CLI alternative: ImageMagick can resize and convert to ICO:</p>
<pre><code>convert source.png -resize 256x256 favicon.png
convert favicon.png -define icon:auto-resize=64,48,32,16 favicon.ico</code></pre>

<h2>The HTML</h2>

<pre><code>&lt;link rel="icon" type="image/x-icon" href="/favicon.ico"&gt;
&lt;link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"&gt;
&lt;link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"&gt;
&lt;link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"&gt;
&lt;link rel="manifest" href="/site.webmanifest"&gt;</code></pre>

<h2>The web manifest</h2>

<pre><code>{
  "name": "Your Site Name",
  "short_name": "Site",
  "icons": [
    { "src": "/android-chrome-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png" }
  ],
  "theme_color": "#ffffff",
  "background_color": "#ffffff",
  "display": "standalone"
}</code></pre>

<h2>SVG favicon (modern browsers only)</h2>

<p>Modern browsers support SVG favicons — a single file that scales perfectly at any size:</p>

<pre><code>&lt;link rel="icon" href="/favicon.svg" type="image/svg+xml"&gt;</code></pre>

<p>Use this alongside the PNG/ICO fallbacks. SVG favicons can also respond to dark mode using the <code>prefers-color-scheme</code> media query within the SVG file itself.</p>
    `.trim(),
  },

  {
    slug: "jwt-claims-explained",
    title: "JWT Claims Explained: iss, sub, aud, exp, iat and More",
    description: "JWT claims are the data payload of a token. Here's what each standard claim means, when to include it, and how verification should handle them.",
    date: "2026-05-10",
    readTime: "5 min read",
    category: "Security",
    content: `
<p>A JWT payload is a set of "claims" — key-value pairs that assert things about the token's subject or context. Some claims are standardized (registered claims); others are defined by the application (private claims). Understanding what each standard claim does is essential for implementing JWT authentication correctly.</p>

<h2>The registered claims (RFC 7519)</h2>

<p><strong>iss (Issuer)</strong><br>
Who issued the token. Usually a URL or URI identifying the authorization server. When verifying a token, check that <code>iss</code> matches the expected issuer — prevents accepting tokens from a different service that uses the same signing key.</p>
<pre><code>"iss": "https://auth.example.com"</code></pre>

<p><strong>sub (Subject)</strong><br>
Who the token represents — usually a user ID. Must be unique within the issuer's context. This is the primary identifier you use to look up the user.</p>
<pre><code>"sub": "user_01HQJZ4A8BNMRK7Y9Z"</code></pre>

<p><strong>aud (Audience)</strong><br>
Who the token is intended for — which service or services should accept it. If your API receives a token, it should verify that its identifier is in the <code>aud</code> claim. This prevents a token issued for one service being used on another.</p>
<pre><code>"aud": ["https://api.example.com", "https://dashboard.example.com"]</code></pre>

<p><strong>exp (Expiration Time)</strong><br>
Unix timestamp after which the token must not be accepted. Critical for security — without expiration, a stolen token is valid forever. Common durations: 15 minutes for access tokens, hours to days for refresh tokens. Always verify <code>exp &gt; current time</code>.</p>
<pre><code>"exp": 1714608000  // 2026-05-02 00:00:00 UTC</code></pre>

<p><strong>iat (Issued At)</strong><br>
Unix timestamp when the token was issued. Useful for detecting tokens that were issued suspiciously far in the past, or for comparing token age against session invalidation events ("if token was issued before user changed their password, reject it").</p>
<pre><code>"iat": 1714604400</code></pre>

<p><strong>nbf (Not Before)</strong><br>
Unix timestamp before which the token must not be accepted. Useful for tokens that should be valid starting at a future time — delayed access, scheduled operations.</p>
<pre><code>"nbf": 1714604400</code></pre>

<p><strong>jti (JWT ID)</strong><br>
A unique identifier for the token. Used to prevent replay attacks — once a token is used, store its <code>jti</code> in a database and reject any subsequent request using the same <code>jti</code>. Particularly important for one-time tokens (password reset links, email verification).</p>
<pre><code>"jti": "01HQJZ4A8BNMRK7Y9Z"</code></pre>

<h2>Common custom claims</h2>

<p>Beyond registered claims, you can include application-specific data:</p>

<pre><code>{
  "sub": "user_01HQJZ4",
  "email": "alice@example.com",
  "role": "admin",
  "plan": "pro",
  "permissions": ["read:data", "write:data", "delete:data"],
  "org_id": "org_abc123"
}</code></pre>

<p>This data is available to your API without a database lookup on every request — one of JWT's main advantages over opaque tokens.</p>

<h2>What verification should check</h2>

<p>A correct JWT verification implementation checks all of the following, not just the signature:</p>

<ol>
  <li>Signature is valid (using the expected algorithm — hardcode it, don't trust the header)</li>
  <li><code>exp</code> is in the future</li>
  <li><code>nbf</code> is in the past (if present)</li>
  <li><code>iss</code> matches the expected issuer</li>
  <li><code>aud</code> includes your service's identifier</li>
  <li>If using <code>jti</code> for one-time tokens: this <code>jti</code> hasn't been used before</li>
</ol>

<p>Skipping any of these checks creates security vulnerabilities. Most JWT libraries handle standard claim validation if you pass the expected values during verification.</p>

<h2>Inspect JWT claims</h2>

<p>Paste any JWT into <a href="/tools">Toolora → Security → JWT Decoder</a> to see the decoded header, payload, and which standard claims are present. Everything runs in your browser — no tokens sent to any server.</p>
    `.trim(),
  },

  {
    slug: "how-to-diff-two-files-online",
    title: "How to Compare Two Text Files and Find the Differences",
    description: "Diffing two files shows exactly what changed between them. Here's how diff works, how to read the output, and the tools for comparing text, code, and documents.",
    date: "2026-05-10",
    readTime: "4 min read",
    category: "Tools",
    content: `
<p>Comparing two versions of a text file to find what changed is called diffing. The Unix <code>diff</code> command has been the standard tool since the 1970s, and its output format influenced version control systems, code review tools, and collaboration software that billions of people use today. Understanding how diff works makes you a more effective developer and writer.</p>

<h2>How diff works</h2>

<p>Diff uses the Longest Common Subsequence (LCS) algorithm to find the largest block of text that appears in both files in the same order. Everything that's in file 1 but not in the LCS was deleted. Everything in file 2 but not in the LCS was added.</p>

<h2>Reading unified diff output</h2>

<pre><code>--- original.txt    2026-05-01
+++ modified.txt    2026-05-10
@@ -1,6 +1,7 @@
 Line 1 (unchanged)
-Line 2 (deleted)
+Line 2 (modified)
+Line 3 (new line added)
 Line 4 (unchanged)
 Line 5 (unchanged)
-Line 6 (deleted)
+Line 6 (unchanged now)</code></pre>

<p><code>---</code> and <code>+++</code> identify the two files.<br>
<code>@@ -1,6 +1,7 @@</code> is the "hunk header" — the original file had 6 lines starting from line 1; the modified file has 7 lines starting from line 1.<br>
Lines starting with <code>-</code> were removed. Lines starting with <code>+</code> were added. Lines with a space were unchanged (context lines).</p>

<h2>Common diff commands</h2>

<pre><code># Basic diff
diff original.txt modified.txt

# Unified format (standard for patches and code review)
diff -u original.txt modified.txt

# Side-by-side comparison
diff --side-by-side original.txt modified.txt

# Ignore whitespace differences
diff -w original.txt modified.txt

# Ignore blank lines
diff -B original.txt modified.txt

# Case-insensitive
diff -i original.txt modified.txt

# Diff directories recursively
diff -r dir1/ dir2/</code></pre>

<h2>Creating and applying patches</h2>

<pre><code># Create a patch file
diff -u original.txt modified.txt > changes.patch

# Apply the patch
patch original.txt < changes.patch</code></pre>

<p>Patches are how open-source contributions were shared before GitHub — you email a .patch file, the maintainer applies it. Git's <code>git diff</code> and <code>git apply</code> work the same way.</p>

<h2>Modern tools for diffing</h2>

<p><strong>git diff:</strong> The most common way to compare file versions in practice. <code>git diff HEAD~1</code> shows changes from the last commit. <code>git diff branch1..branch2</code> compares branches.</p>

<p><strong>VS Code built-in diff:</strong> Right-click a file → Compare with → any other file. Shows a side-by-side or inline diff with syntax highlighting.</p>

<p><strong>GitHub / GitLab:</strong> Every pull request shows a diff of all changes. The web-based diff viewer includes comment threads per line.</p>

<p><strong>Browser-based text diff:</strong> For one-off comparisons of text, configurations, or documents without a git repository. Paste both versions and see highlighted changes.</p>

<p>Compare two pieces of text instantly at <a href="/tools">Toolora → Text → Text Diff</a> — paste both versions, see exactly what changed, highlighted line by line. Processing is local.</p>
    `.trim(),
  },

  {
    slug: "what-is-a-proxy-server-explained",
    title: "What Is a Proxy Server? Forward vs Reverse Proxy",
    description: "Proxy servers sit between clients and servers, forwarding requests. Forward and reverse proxies serve completely different purposes. Here's the clear breakdown.",
    date: "2026-05-11",
    readTime: "5 min read",
    category: "Developer Tools",
    content: `
<p>A proxy server sits between two parties in a network communication, forwarding requests from one side to the other. The word "proxy" comes from the legal term for someone authorized to act on another's behalf. In networking, proxies can inspect, filter, modify, cache, or simply relay traffic. The key distinction is whether the proxy acts on behalf of the client or the server.</p>

<h2>Forward proxy: acting on behalf of clients</h2>

<p>A forward proxy sits between clients (users) and the internet. Clients send requests to the proxy; the proxy forwards them to the destination server; the response comes back through the proxy to the client.</p>

<p>From the destination server's perspective, the request appears to come from the proxy's IP address, not the client's.</p>

<p><strong>Common uses for forward proxies:</strong></p>
<ul>
  <li><strong>Privacy / anonymization:</strong> The destination server doesn't see the client's real IP (VPNs work similarly, though at the network layer)</li>
  <li><strong>Content filtering:</strong> Corporate network proxies block social media, malware sites, or content policy violations</li>
  <li><strong>Circumventing geo-restrictions:</strong> Access content available in a different country by proxying through a server in that country</li>
  <li><strong>Caching:</strong> A caching proxy stores frequently-accessed content locally, reducing bandwidth for large organizations</li>
  <li><strong>Logging and monitoring:</strong> All outbound traffic can be inspected and logged at the proxy level</li>
</ul>

<h2>Reverse proxy: acting on behalf of servers</h2>

<p>A reverse proxy sits in front of servers (your application). Clients send requests to the proxy; the proxy forwards them to the appropriate backend server; the response returns through the proxy to the client.</p>

<p>From the client's perspective, they're talking to the proxy and don't know what's behind it.</p>

<p><strong>Common uses for reverse proxies:</strong></p>
<ul>
  <li><strong>Load balancing:</strong> Distribute incoming requests across multiple backend servers. NGINX and HAProxy are classic reverse proxy load balancers.</li>
  <li><strong>TLS termination:</strong> Handle HTTPS at the proxy, then communicate with backends over plain HTTP internally. Simplifies certificate management — only the proxy needs the certificate.</li>
  <li><strong>Caching:</strong> Cache static assets and API responses at the proxy layer — the backend doesn't have to serve the same content repeatedly.</li>
  <li><strong>Security:</strong> Hide backend IP addresses, filter malicious requests, enforce rate limits.</li>
  <li><strong>Path routing:</strong> Route <code>/api/*</code> to a Node.js backend, <code>/static/*</code> to an S3 bucket, and <code>/*</code> to a React app.</li>
  <li><strong>Compression:</strong> Compress responses with Gzip or Brotli at the proxy, offloading that work from application servers.</li>
</ul>

<h2>Common reverse proxy software</h2>

<ul>
  <li><strong>NGINX:</strong> The most widely deployed reverse proxy. Handles millions of connections per second, extensive configuration options.</li>
  <li><strong>Caddy:</strong> Modern reverse proxy with automatic HTTPS (Let's Encrypt) out of the box. Simpler configuration than NGINX.</li>
  <li><strong>Traefik:</strong> Dynamic configuration, integrates with Docker and Kubernetes — discovers services automatically.</li>
  <li><strong>Cloudflare:</strong> A reverse proxy at global scale. All Cloudflare-protected sites route through Cloudflare's edge before reaching the origin server.</li>
  <li><strong>AWS ALB:</strong> Application Load Balancer — a managed reverse proxy that integrates with other AWS services.</li>
</ul>

<h2>The difference at a glance</h2>

<table>
  <thead>
    <tr><th></th><th>Forward proxy</th><th>Reverse proxy</th></tr>
  </thead>
  <tbody>
    <tr><td>Acts on behalf of</td><td>Clients</td><td>Servers</td></tr>
    <tr><td>Client knows about it?</td><td>Usually yes (configured on client)</td><td>Usually no (transparent)</td></tr>
    <tr><td>Server knows about it?</td><td>No (sees proxy IP)</td><td>May not (sees proxy as the client)</td></tr>
    <tr><td>Typical deployer</td><td>Organizations, VPN providers</td><td>Website operators, CDNs</td></tr>
  </tbody>
</table>

<p>Most production web applications sit behind a reverse proxy. The proxy handles the complexity of TLS, load balancing, and routing so the application can focus on business logic.</p>
    `.trim(),
  },

  {
    slug: "online-tools-privacy-checklist",
    title: "Before You Paste Into Any Online Tool: A Privacy Checklist",
    description: "Most online tools upload your data to a server. Here's what to check before using any web tool with sensitive content — and what the safer alternatives are.",
    date: "2026-05-11",
    readTime: "4 min read",
    category: "Privacy",
    content: `
<p>The internet is full of convenient tools: JSON formatters, PDF compressors, image converters, text analyzers, JWT decoders. Most of them work by uploading your data to a server. For personal, professional, or confidential content, this is a risk that's easy to overlook — and easy to avoid once you know what to check.</p>

<h2>The five questions to ask about any online tool</h2>

<h3>1. Is it server-side or client-side?</h3>
<p>Server-side tools upload your data to process it. Client-side tools run JavaScript (or WebAssembly) in your browser — your data never leaves your machine. You can verify this by opening the browser's Network tab (F12 → Network) before using the tool, then using it and watching for upload requests. If no request fires with a payload matching your file, the processing is local.</p>

<h3>2. What's the retention policy?</h3>
<p>Even if the tool says "files are deleted immediately," check their privacy policy for specifics. Look for answers to: How long is the file stored? Are logs kept? Is the file used to train machine learning models? Is data shared with third parties?</p>

<h3>3. Is the connection encrypted?</h3>
<p>Minimum requirement: HTTPS. Without it, your data can be intercepted in transit. Check that the URL starts with <code>https://</code> and there's no certificate warning. This protects the transmission but not what happens on the server.</p>

<h3>4. What happens to the output?</h3>
<p>The processed output may also be stored. If you convert a document and download the result, does the server keep a copy of the output? For some tools (online pastebin services, for example), the output is explicitly stored and shared by design — useful sometimes, dangerous for private content.</p>

<h3>5. Does the tool need all this access?</h3>
<p>Some tools request sign-in, browser permissions, or clipboard access that isn't necessary for the task. A JSON formatter shouldn't need your Google account. An image compressor shouldn't request camera access. Excessive permission requests are a red flag.</p>

<h2>Categories of data that deserve extra care</h2>

<ul>
  <li>Legal documents (contracts, filings, correspondence)</li>
  <li>Medical records, insurance claims, prescriptions</li>
  <li>Financial statements, tax documents, payroll data</li>
  <li>Authentication tokens, API keys, passwords (never paste these into online tools)</li>
  <li>Personal identification (passports, ID cards, licenses)</li>
  <li>Proprietary business data, source code with credentials</li>
  <li>Client data that you're responsible for protecting</li>
</ul>

<h2>Safer alternatives</h2>

<p><strong>Client-side tools:</strong> Look for tools explicitly built to run locally. Toolora's tools are built this way — PDFs, images, text, code, and conversions all process in your browser.</p>

<p><strong>CLI tools:</strong> Install tools locally and run them from the terminal. <code>jq</code> for JSON, <code>ffmpeg</code> for media, <code>pdfcpu</code> for PDFs, <code>ImageMagick</code> for images. No data leaves your machine.</p>

<p><strong>VS Code extensions:</strong> Many online tool functions (JSON formatting, regex testing, markdown preview) are available as editor extensions that run locally.</p>

<p><strong>Offline apps:</strong> For frequent use cases, a native app or desktop tool is more private than any web service.</p>

<h2>The rule of thumb</h2>

<p>If you wouldn't email the content to a stranger, don't paste it into an online tool unless you've verified it processes locally or you trust the service's privacy practices explicitly. The convenience of a free online tool is real — just know the trade-off you're making.</p>
    `.trim(),
  },

  {
    slug: "html-meta-tags-seo-complete-guide",
    title: "HTML Meta Tags for SEO: The Complete 2026 Guide",
    description: "The meta tags that actually affect SEO, what each one does, and what to ignore. Includes title, description, robots, canonical, og, and structured data.",
    date: "2026-05-12",
    readTime: "6 min read",
    category: "SEO",
    content: `
<p>HTML meta tags are snippets in the <code>&lt;head&gt;</code> of your pages that provide metadata to search engines, social media platforms, and browsers. Some are critical for SEO. Many are obsolete. Here's a clear breakdown of what matters in 2026 and exactly what to implement.</p>

<h2>The title tag: the most important SEO element</h2>

<pre><code>&lt;title&gt;Your Page Title — Brand Name&lt;/title&gt;</code></pre>

<p>Not technically a meta tag, but the most important metadata element. The title appears in search results, browser tabs, and bookmarks. Google displays up to 60 characters; longer titles are truncated. Best practices:</p>
<ul>
  <li>Include the primary keyword early</li>
  <li>Each page should have a unique title</li>
  <li>Include your brand at the end</li>
  <li>Write for humans — the keyword should fit naturally</li>
</ul>

<h2>Meta description</h2>

<pre><code>&lt;meta name="description" content="Your 150-160 character description that appears in search results."&gt;</code></pre>

<p>The description appears below the title in search results. Google truncates at ~155 characters. It doesn't directly affect rankings, but it affects click-through rate — a compelling description brings more clicks. Each page should have a unique, relevant description.</p>

<h2>Meta robots</h2>

<pre><code>&lt;meta name="robots" content="index, follow"&gt;
&lt;meta name="robots" content="noindex, nofollow"&gt;
&lt;meta name="robots" content="noindex, follow"&gt;</code></pre>

<p><code>index</code>/<code>noindex</code> — whether the page should appear in search results.<br>
<code>follow</code>/<code>nofollow</code> — whether crawlers should follow links on the page.</p>

<p>Default is <code>index, follow</code> — you only need to add this tag if you're changing the default for a specific page (admin pages, thank-you pages, duplicate content).</p>

<h2>Canonical URL</h2>

<pre><code>&lt;link rel="canonical" href="https://example.com/the-definitive-url"&gt;</code></pre>

<p>Tells search engines which URL is the authoritative version when multiple URLs serve the same or very similar content. Critical for e-commerce (same product at multiple URLs with different parameters), paginated content, HTTP vs HTTPS, and www vs non-www variants.</p>

<p>Always use the canonical that reflects the URL you want indexed, and make sure it's consistent with your sitemap and internal links.</p>

<h2>Open Graph (OG) tags</h2>

<pre><code>&lt;meta property="og:title" content="Page Title"&gt;
&lt;meta property="og:description" content="150-200 character description"&gt;
&lt;meta property="og:image" content="https://example.com/og-image.jpg"&gt;
&lt;meta property="og:url" content="https://example.com/page"&gt;
&lt;meta property="og:type" content="article"&gt;</code></pre>

<p>Open Graph tags control how your page appears when shared on Facebook, LinkedIn, Slack, and many other platforms. The <code>og:image</code> is the most impactful — use a 1200×630px image for best display. Without these tags, platforms pull whatever text and image they find first, which is usually wrong.</p>

<h2>Twitter Card tags</h2>

<pre><code>&lt;meta name="twitter:card" content="summary_large_image"&gt;
&lt;meta name="twitter:title" content="Page Title"&gt;
&lt;meta name="twitter:description" content="Description"&gt;
&lt;meta name="twitter:image" content="https://example.com/og-image.jpg"&gt;</code></pre>

<p><code>summary_large_image</code> shows a large preview image. <code>summary</code> shows a small thumbnail. If OG tags are present, Twitter/X usually uses those as fallback — you need explicit Twitter tags to override.</p>

<h2>Viewport (not SEO, but essential)</h2>

<pre><code>&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;</code></pre>

<p>Required for mobile-friendly rendering. Google uses mobile-first indexing — without this, your page may rank poorly on mobile searches.</p>

<h2>Tags to ignore (they don't affect SEO)</h2>

<ul>
  <li><code>&lt;meta name="keywords"&gt;</code> — Google ignored this since 2009</li>
  <li><code>&lt;meta name="author"&gt;</code> — no SEO impact</li>
  <li><code>&lt;meta name="generator"&gt;</code> — tells bots what CMS you use; no SEO impact, mild security disclosure</li>
</ul>

<h2>Structured data (JSON-LD)</h2>

<p>Not a meta tag, but often grouped with them. JSON-LD structured data tells Google specifically what type of content is on the page — articles, products, FAQs, breadcrumbs, events. This enables rich results (star ratings, FAQ dropdowns, recipe cards) in search.</p>

<pre><code>&lt;script type="application/ld+json"&gt;
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Page Title",
  "datePublished": "2026-05-12",
  "author": { "@type": "Organization", "name": "Toolora" }
}
&lt;/script&gt;</code></pre>
    `.trim(),
  },

  {
    slug: "how-to-generate-random-passwords-securely",
    title: "How to Generate Random Passwords Securely in the Browser",
    description: "Not all password generators are equally random. Here's what makes a password generator cryptographically secure and how to verify the one you're using qualifies.",
    date: "2026-05-12",
    readTime: "4 min read",
    category: "Security",
    content: `
<p>Password generators seem simple — pick some characters at random and string them together. But the "random" part is where most implementations go wrong. Cryptographic security requires randomness that's unpredictable to an attacker, not just random-looking. Here's what that means in practice and how to verify you're using a secure generator.</p>

<h2>Pseudorandom vs. cryptographically random</h2>

<p><code>Math.random()</code> in JavaScript is a pseudorandom number generator (PRNG). It produces sequences that look random but are generated by a deterministic algorithm seeded with a value (often the current time in milliseconds). The output is predictable if you know the seed and algorithm. For gaming, simulations, and UI — fine. For passwords — a serious problem.</p>

<p>Cryptographic random number generators (CSPRNGs) collect entropy from hardware events (keystrokes, mouse movements, thermal noise), interrupt timing, and other genuinely unpredictable sources. The output is not computationally predictable even if you know the algorithm.</p>

<h2>The right API: <code>crypto.getRandomValues()</code></h2>

<p>In browsers, the Web Crypto API provides access to the OS's CSPRNG:</p>

<pre><code>// Get 32 cryptographically random bytes
const array = new Uint8Array(32);
crypto.getRandomValues(array);

// Use the random bytes to pick characters from a set
function generatePassword(length, charset) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => charset[byte % charset.length]).join('');
}

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
const password = generatePassword(20, CHARSET);
</code></pre>

<p><code>crypto.getRandomValues()</code> is available in all modern browsers and Node.js. Any password generator that uses this (or its Node.js equivalent <code>crypto.randomBytes()</code>) is cryptographically secure.</p>

<h2>Modulo bias</h2>

<p>There's a subtle flaw in the simple implementation above: <code>byte % charset.length</code> introduces modulo bias when the charset size doesn't evenly divide 256. For a 64-character charset, <code>256 / 64 = 4</code> exactly — no bias. For a 95-character charset (full printable ASCII), <code>256 / 95 ≈ 2.69</code> — the first 66 characters appear slightly more often than the last 29.</p>

<p>The fix: rejection sampling. Discard bytes that would cause bias:</p>

<pre><code>function generatePassword(length, charset) {
  const max = Math.floor(256 / charset.length) * charset.length;
  const result = [];
  while (result.length < length) {
    const array = new Uint8Array(length * 2); // oversample
    crypto.getRandomValues(array);
    for (const byte of array) {
      if (byte < max && result.length < length) {
        result.push(charset[byte % charset.length]);
      }
    }
  }
  return result.join('');
}</code></pre>

<p>For password generation, the bias from simple modulo is too small to matter practically — but for generating cryptographic keys, it's significant.</p>

<h2>How to check if a tool is secure</h2>

<ol>
  <li>Open DevTools → Sources tab</li>
  <li>Search the JavaScript for <code>Math.random</code> — if it's used in the password generation code, the tool is not cryptographically secure</li>
  <li>Search for <code>getRandomValues</code> or <code>crypto.subtle</code> — if present, it uses the CSPRNG</li>
  <li>Check the Network tab — a secure browser-based generator should make no network requests during password generation</li>
</ol>

<p>Generate secure passwords at <a href="/tools">Toolora → Security → Password Generator</a>. Uses <code>crypto.getRandomValues()</code>, runs entirely in the browser, and you can inspect the source to verify.</p>
    `.trim(),
  },

  {
    slug: "what-is-gzip-compression-explained",
    title: "What Is Gzip Compression and How Does It Speed Up Websites?",
    description: "Gzip compresses text files before sending them over HTTP. Here's how it works, how much it saves, how to enable it, and when Brotli is better.",
    date: "2026-05-13",
    readTime: "4 min read",
    category: "Developer Tools",
    content: `
<p>Gzip is a compression algorithm used to reduce the size of files sent over HTTP. When your browser requests a web page, it sends an <code>Accept-Encoding: gzip, deflate, br</code> header to say it can handle compressed content. The server compresses the response before sending it. The browser decompresses before rendering. The result: significantly smaller transfers, faster page loads.</p>

<h2>How much does Gzip save?</h2>

<p>For text-based content (HTML, CSS, JavaScript, JSON, XML), Gzip typically achieves 60–80% compression. A 100KB JavaScript file compresses to 20–40KB. A 50KB HTML page compresses to 10–15KB.</p>

<p>Gzip has minimal effect on already-compressed formats: images (JPEG, PNG, WebP), videos, audio, and PDF files use their own compression. Trying to Gzip a JPEG doesn't help — it's already compressed and Gzip may actually make it slightly larger.</p>

<h2>How Gzip works</h2>

<p>Gzip uses a combination of LZ77 (finds repeated byte sequences and replaces them with references) and Huffman coding (uses shorter bit sequences for more common symbols). Text files compress well because natural language and code have enormous amounts of repetition — the same words, patterns, HTML tags, and code constructs appear over and over.</p>

<p>The decompression is faster than compression — browsers receive compressed data and decompress it nearly instantly. The CPU cost of decompression is negligible compared to the network time saved.</p>

<h2>Enabling Gzip on common servers</h2>

<p><strong>NGINX:</strong></p>
<pre><code>gzip on;
gzip_types text/plain text/css application/javascript application/json;
gzip_min_length 1000;  # Don't compress tiny files
gzip_comp_level 6;     # 1-9; 6 is a good balance of speed vs compression</code></pre>

<p><strong>Apache:</strong></p>
<pre><code>LoadModule deflate_module modules/mod_deflate.so
AddOutputFilterByType DEFLATE text/html text/plain text/css application/javascript application/json</code></pre>

<p><strong>Express (Node.js):</strong></p>
<pre><code>import compression from 'compression';
app.use(compression());</code></pre>

<h2>Brotli: the modern alternative</h2>

<p>Brotli (<code>br</code> encoding) was developed by Google and achieves 15–25% better compression than Gzip for typical web assets. All modern browsers support it. Brotli compression is slower, making it less suitable for on-the-fly compression of dynamic content — but for static assets, you can pre-compress with Brotli at build time.</p>

<p>Serving priority: serve Brotli if the browser supports it (check for <code>br</code> in <code>Accept-Encoding</code>), fall back to Gzip otherwise.</p>

<h2>Checking if compression is enabled</h2>

<p>Open DevTools → Network tab → click any HTML/JS/CSS request → Headers tab → look for <code>Content-Encoding: gzip</code> or <code>Content-Encoding: br</code> in the response headers. If it's missing, compression isn't enabled.</p>

<p>In curl: <code>curl -H "Accept-Encoding: gzip" -I https://example.com</code> and check the response headers.</p>

<h2>Pitfalls</h2>

<p><strong>Double compression:</strong> Don't Gzip files that are already Gzip compressed. Some CDN configurations accidentally recompress already-compressed assets.</p>

<p><strong>Too-small files:</strong> Gzip adds overhead for tiny files (under ~1KB). The <code>gzip_min_length</code> setting in NGINX skips compression for small files.</p>

<p><strong>CRIME and BREACH attacks:</strong> Compression on TLS connections can leak information if an attacker can inject content — relevant for secure sessions with dynamic content. Well-understood and mitigatable, but worth knowing about.</p>
    `.trim(),
  },

  {
    slug: "csv-best-practices-data-import-export",
    title: "CSV Best Practices: Encoding, Quoting, and Headers That Don't Break",
    description: "CSV looks simple but hides encoding traps, quoting edge cases, and dialect differences. Here's how to produce CSVs that open correctly everywhere.",
    date: "2026-05-13",
    readTime: "5 min read",
    category: "Developer Tools",
    content: `
<p>CSV (Comma-Separated Values) is the most universal format for tabular data exchange, but it's defined loosely enough that different implementations have different assumptions about encoding, delimiters, quoting, and line endings. A CSV that looks fine in Excel might break in Python or vice versa. Here's how to write CSVs that work everywhere.</p>

<h2>Always use UTF-8</h2>

<p>Character encoding is the most common source of CSV problems. Two scenarios:</p>

<p><strong>Excel's CSV export</strong> defaults to the system's legacy encoding (Windows-1252 on Windows, Mac Roman on older macOS). Characters like é, ü, ñ, Chinese characters, and emoji get garbled when opened in a system with a different encoding assumption.</p>

<p><strong>UTF-8 BOM:</strong> Microsoft Excel has historically required a UTF-8 BOM (Byte Order Mark — three bytes at the start of the file: 0xEF, 0xBB, 0xBF) to recognize UTF-8 correctly. Without the BOM, Excel treats UTF-8 as ANSI and garbles non-ASCII characters. When creating CSVs for Excel users, include the BOM. When creating CSVs for programmatic use, omit it — many parsers can't handle the BOM.</p>

<p>The safe approach for broad compatibility: UTF-8 with BOM for Excel-first files, UTF-8 without BOM for everything else.</p>

<h2>Quoting rules</h2>

<p>Values that contain commas, double quotes, or line breaks must be wrapped in double quotes:</p>

<pre><code>name,address,notes
Alice,"123 Main St, Suite 400",
Bob,456 Oak Ave,"Said ""hello"" on arrival"
Charlie,"Multi-line
address",</code></pre>

<p>A double quote inside a quoted field is escaped by doubling it: <code>""</code> inside quotes represents a literal <code>"</code>.</p>

<p>Best practice: quote all string fields consistently, not just the ones that need it. Parsers handle this fine and it's easier to generate correctly.</p>

<h2>Line endings</h2>

<p>RFC 4180 (the closest thing to a CSV standard) specifies CRLF (<code>\r\n</code>) as the line terminator. In practice:</p>
<ul>
  <li>Windows: CRLF</li>
  <li>Unix/macOS: LF</li>
  <li>Most parsers accept both</li>
  <li>Excel on Windows expects CRLF; it can handle LF but may behave oddly with some operations</li>
</ul>

<p>Use CRLF for maximum compatibility. In Python: <code>open('file.csv', 'w', newline='')</code> and let the csv module handle line endings.</p>

<h2>Headers</h2>

<ul>
  <li>Always include a header row — it makes files self-describing</li>
  <li>Use consistent, machine-friendly names: lowercase, underscores instead of spaces (<code>first_name</code> not <code>First Name</code>)</li>
  <li>Don't use the same column name twice</li>
  <li>Avoid special characters in headers</li>
</ul>

<h2>Numbers and dates</h2>

<p><strong>Numbers:</strong> Use a period as the decimal separator (<code>1.99</code>, not <code>1,99</code>). Some European systems use a comma as the decimal separator — this conflicts with the CSV delimiter. If your data targets European users, consider using a semicolon as the delimiter instead.</p>

<p><strong>Dates:</strong> Always use ISO 8601 format: <code>2026-05-13</code>. Locale-specific formats like <code>05/13/2026</code> vs <code>13/05/2026</code> are ambiguous and Excel will interpret them differently depending on regional settings.</p>

<h2>Generating CSVs in common languages</h2>

<pre><code># Python — always use the csv module, never string concatenation
import csv
with open('output.csv', 'w', newline='', encoding='utf-8-sig') as f:  # utf-8-sig adds BOM
    writer = csv.writer(f)
    writer.writerow(['name', 'email', 'age'])
    writer.writerow(['Alice', 'alice@example.com', 30])</code></pre>

<pre><code>// JavaScript
const rows = [['name', 'email'], ['Alice', 'alice@example.com']];
const csv = rows.map(r =>
  r.map(cell => '"' + String(cell).replace(/"/g, '""') + '"').join(',')
).join('\r\n');</code></pre>

<p>Convert CSV to JSON and vice versa at <a href="/tools">Toolora → Converters → CSV to JSON</a>.</p>
    `.trim(),
  },

  {
    slug: "how-ai-reads-tool-descriptions-mcp",
    title: "How AI Models Decide Which Tool to Call (And How to Write Better Tool Descriptions)",
    description: "When an AI agent has multiple tools available, how does it decide which one to use? The answer is in the tool descriptions. Here's what makes a description that gets called.",
    date: "2026-05-14",
    readTime: "6 min read",
    category: "AI Builders",
    content: `
<p>MCP (Model Context Protocol) and similar function-calling frameworks let AI models choose from a list of available tools to complete a task. The model doesn't run code to figure out what a tool does — it reads the description and decides. This means tool descriptions are the primary interface between your tool and the model's decision-making process. Poorly written descriptions mean tools get ignored even when they're the right choice.</p>

<h2>How tool selection actually works</h2>

<p>When a user sends a message to an AI with tools available, the model receives the full tool list with descriptions in its context window. It then reasons about which tool (if any) to call based on the combination of the user's request and the tool descriptions.</p>

<p>The model is doing something like semantic matching: "The user wants to extract text from an image. I have a tool called 'ocr' with description 'Extracts text from images using optical character recognition.' That sounds like what I need." This matching is semantic — it's not keyword matching, it's understanding intent.</p>

<h2>What makes a bad tool description</h2>

<p><strong>Too short:</strong> <code>"Processes PDF files"</code> — processes how? Compresses? Converts? Extracts text? The model can't confidently decide when this is the right tool.</p>

<p><strong>Too technical:</strong> <code>"Invokes libpoppler WASM pipeline for PDF rasterization"</code> — technical implementation details aren't what the model needs. It needs to know what problem the tool solves.</p>

<p><strong>Naming-only:</strong> <code>"pdf_compress: Compress PDF"</code> — the name already implies what it does; the description adds nothing.</p>

<p><strong>Missing triggers:</strong> Good descriptions tell the model when to use the tool. Without explicit "use this when..." signals, the model has to infer.</p>

<h2>The trigger-first format</h2>

<p>The most effective tool descriptions start with a "use this tool when..." statement:</p>

<pre><code>Use this tool when the user wants to reduce the file size of a PDF document. 
Accepts a PDF file and returns a compressed version with smaller file size.
The quality of images in the PDF is slightly reduced but remains readable.
Best for large PDFs with many embedded images. Not useful for text-only PDFs
that are already small.</code></pre>

<p>This format tells the model:</p>
<ul>
  <li>The exact user intent that triggers this tool</li>
  <li>What the tool accepts and returns</li>
  <li>What trade-offs to expect</li>
  <li>When NOT to use it (equally important)</li>
</ul>

<h2>Include the domain vocabulary</h2>

<p>Users phrase requests in many ways. A tool description for OCR should include the relevant terms users might use: "extract text from image," "read text from screenshot," "transcribe text from photo," "convert image to text." Models understand synonyms, but including the common phrasings in the description reduces ambiguity.</p>

<h2>Specify input and output clearly</h2>

<pre><code>Accepts: A PDF file (as base64-encoded string or file path), maximum 100MB.
Returns: Plain text content extracted from the PDF, preserving paragraph breaks.
Supports: Text-based PDFs. For scanned PDFs, use the 'ocr' tool instead.</code></pre>

<p>Explicit input/output specifications help the model construct the correct tool call and handle the response correctly.</p>

<h2>Test with adversarial prompts</h2>

<p>After writing descriptions, test them by asking the model to complete tasks that require your tools, phrased in various ways. If the model doesn't call the tool when it should, or calls the wrong tool, the description needs adjustment. Common fixes:</p>
<ul>
  <li>Add more trigger phrasings</li>
  <li>Remove ambiguous language that could match multiple tools</li>
  <li>Add explicit "not for X" clauses when a tool is often confused with another</li>
  <li>Shorten overly long descriptions — the model has a context window limit and reads hundreds of tokens of tool descriptions</li>
</ul>

<h2>Toolora MCP server</h2>

<p>Toolora exposes 17 tools over MCP. Each description follows the trigger-first format with explicit input/output specs and disambiguation notes. Configure it at <a href="/mcp-hub">toolora.dev/mcp-hub</a> — compatible with Claude, Cursor, and any MCP-enabled client.</p>
    `.trim(),
  },

  {
    slug: "understanding-color-spaces-web",
    title: "Color Spaces for the Web: sRGB, Display P3, and When It Matters",
    description: "Modern screens can display colors that sRGB can't represent. Here's what wide-gamut color spaces are, how they work in CSS, and when you should care.",
    date: "2026-05-14",
    readTime: "5 min read",
    category: "Developer Tools",
    content: `
<p>For most of the web's history, sRGB was the only color space that mattered. Screens could only display sRGB colors. Designers worked in sRGB. CSS colors were sRGB. Simple. But modern displays — iPhones, MacBooks, and many Android devices — can display a significantly wider range of colors than sRGB. In 2026, CSS has the tools to target these wider gamuts. Here's when and how to use them.</p>

<h2>What a color space is</h2>

<p>A color space defines a range (gamut) of colors that can be represented. It's defined by three primary colors (red, green, blue for additive spaces) and a white point. Different color spaces have different primaries, which means they can represent different sets of colors.</p>

<p>sRGB (Standard RGB) was standardized in 1996 for computer monitors of that era. It covers about 35% of the colors visible to the human eye. It's still the standard for the web and legacy displays.</p>

<p>Display P3 (also called DCI-P3 for the display version) has wider primaries — especially in the red and green regions. It covers about 54% of visible colors. It's the standard for Apple's ProMotion displays, recent iPhones, and high-end monitors.</p>

<h2>The practical difference</h2>

<p>Colors in Display P3 that can't be represented in sRGB look more vibrant — deeper reds, more vivid greens. You can't fake this with sRGB. If you design a logo in Display P3 and serve the image as sRGB, Display P3 users see a duller version than you intended.</p>

<p>The difference is most visible in:
<ul>
  <li>Saturated reds (blood red, bright orange-red)</li>
  <li>Vivid greens (grass green, lime)</li>
  <li>Deep pinks and magentas</li>
  <li>Rich yellows</li>
</ul>

<p>For pastels, neutrals, blues, and most UI colors, the difference is subtle or invisible.</p>

<h2>Using wide-gamut colors in CSS</h2>

<p>CSS Color Level 4 added wide-gamut color functions that modern browsers support:</p>

<pre><code>/* Display P3 color */
.vivid-red {
  color: color(display-p3 1 0.08 0.1);
}

/* With fallback for older browsers */
.vivid-red {
  color: #ff1a1a;  /* sRGB fallback */
  color: color(display-p3 1 0.08 0.1);  /* P3 on supporting browsers */
}

/* oklch — perceptually uniform, works across all color spaces */
.vivid-red {
  color: oklch(55% 0.22 25);
}
</code></pre>

<p><code>oklch()</code> is the most useful new color function — it maps to perceptually uniform lightness and chroma, making it easy to create color scales where each step feels the same visual distance. The browser automatically picks the best representation for the current display.</p>

<h2>Images: color profiles in practice</h2>

<p>When you export an image from Figma or Lightroom, it can include an embedded ICC color profile (sRGB or Display P3). Browsers read this profile and render accordingly. If a Display P3 image is opened on an sRGB display, the browser tone-maps the out-of-gamut colors to the closest sRGB equivalent. If it's opened on a P3 display, the full range shows correctly.</p>

<p>For web images: export with the appropriate ICC profile embedded. Don't strip profiles — stripped images often render differently than intended.</p>

<h2>Should you use wide-gamut colors today?</h2>

<p>For photos and images: yes — preserve the original color profile when exporting. For CSS colors: it depends on your audience. If most of your users are on Apple devices or recent high-end displays, wide-gamut CSS colors are worth the added complexity. For maximum compatibility with minimal complexity, staying in sRGB is still perfectly fine in 2026.</p>

<p>For design systems and component libraries being built for the long term: consider using <code>oklch()</code> for all your color definitions — it's gamut-agnostic and will use whatever the display supports.</p>
    `.trim(),
  },

  {
    slug: "qr-code-error-correction-explained",
    title: "QR Code Error Correction: How QR Codes Handle Damage and Still Scan",
    description: "QR codes can be partially destroyed and still scan correctly. Here's how error correction levels work, what trade-offs they involve, and why it matters for QR code design.",
    date: "2026-05-15",
    readTime: "4 min read",
    category: "Developer Tools",
    content: `
<p>QR codes can be printed on textured surfaces, dirty packaging, damaged labels, and curved objects — and still scan reliably. This isn't magic. It's error correction. QR codes embed redundant data that allows scanners to reconstruct missing or corrupted parts of the code. Understanding how this works lets you make better decisions about QR code design, size, and placement.</p>

<h2>How QR code error correction works</h2>

<p>QR codes use Reed-Solomon error correction — the same algorithm used in CDs, DVDs, Blu-ray discs, and deep-space communication. Reed-Solomon works by encoding the original data along with additional "check symbols" that allow any errors to be detected and corrected.</p>

<p>The key property: if up to N% of the code is damaged, the original data can be fully reconstructed. The more redundant data included, the higher N, but also the larger the QR code needs to be to store the same payload.</p>

<h2>The four error correction levels</h2>

<table>
  <thead>
    <tr><th>Level</th><th>Max damage tolerated</th><th>Data capacity (relative)</th><th>Use case</th></tr>
  </thead>
  <tbody>
    <tr><td>L (Low)</td><td>~7%</td><td>Highest</td><td>Clean, controlled environments — indoor print, digital screens</td></tr>
    <tr><td>M (Medium)</td><td>~15%</td><td>Good</td><td>General purpose — most use cases</td></tr>
    <tr><td>Q (Quartile)</td><td>~25%</td><td>Lower</td><td>Industrial, outdoor labels, some printing imprecision</td></tr>
    <tr><td>H (High)</td><td>~30%</td><td>Lowest</td><td>Logos embedded in QR code, harsh environments, strong branding</td></tr>
  </tbody>
</table>

<p>Higher correction means more redundancy, which means either a larger QR code (more modules) or less data capacity at the same size.</p>

<h2>Why logos inside QR codes work</h2>

<p>Branded QR codes with company logos in the center look appealing — but putting an opaque image over part of the code destroys those modules. The reason this works is error correction: the logo covers roughly 20–30% of the code, which stays within the H-level correction threshold.</p>

<p>This is why you need H-level error correction if you're embedding a logo, and why the logo must cover less than 30% of the code area. Going beyond this will cause scan failures, especially in poor lighting or at angles.</p>

<h2>Why QR code size matters</h2>

<p>A QR code needs to be scannable from the expected scanning distance. Camera modules on phones have a minimum resolution for reading QR codes. The minimum printable size for reliable scanning is roughly 2cm × 2cm for a typical smartphone at 25–30cm distance. For outdoor billboards scanned from meters away, you need much larger codes.</p>

<p>The number of "modules" (pixels) in a QR code grows with the amount of data. A URL like <code>https://example.com</code> generates a smaller code than a full vCard with multiple fields.</p>

<h2>Quiet zone</h2>

<p>QR codes require a "quiet zone" — a white border of at least 4 modules around the code. Without this margin, scanners have trouble identifying the code's boundaries. Printing a QR code edge-to-edge on a label without quiet zone is one of the most common causes of scan failure.</p>

<h2>Generate QR codes locally</h2>

<p>Generate QR codes at <a href="/tools">Toolora → Developer → QR Code Generator</a> — select your error correction level, adjust size, and download. No server involved; the QR code is generated entirely in your browser.</p>
    `.trim(),
  },

  {
    slug: "what-is-a-hash-function-explained",
    title: "Hash Functions Explained: Deterministic, One-Way, Collision-Resistant",
    description: "A hash function maps any input to a fixed-size output. Here's what makes a hash function cryptographic, what the properties mean, and what hash functions are actually used for.",
    date: "2026-05-15",
    readTime: "5 min read",
    category: "Security",
    content: `
<p>A hash function takes an input of any size — a word, a file, a terabyte of data — and produces a fixed-size output called a hash, digest, or checksum. Hash functions are one of the fundamental building blocks of cryptography and appear in security systems, data integrity checks, programming language internals, and distributed systems. Understanding what properties make a hash function useful — and what distinguishes cryptographic from non-cryptographic hashes — clarifies why they appear everywhere.</p>

<h2>The core properties</h2>

<p><strong>Deterministic:</strong> The same input always produces the same output. <code>SHA-256("hello")</code> will always produce the same 64-character hex string, on any machine, at any time. This is what makes hashes useful as fingerprints.</p>

<p><strong>Fixed output size:</strong> Regardless of input size, the output is always the same length. SHA-256 always outputs 256 bits (64 hex characters), whether you hash a single byte or a 10GB file.</p>

<p><strong>Fast to compute:</strong> Computing a hash should be quick. This makes them practical for checking file integrity and indexing data.</p>

<p><strong>One-way (pre-image resistance):</strong> Given a hash output, it should be computationally infeasible to find the original input. There's no "un-hash" function. This property is what makes hashes useful for storing passwords — you store the hash, not the password, and verify by hashing the provided password and comparing.</p>

<p><strong>Collision resistant:</strong> It should be computationally infeasible to find two different inputs that produce the same hash. A "collision" is a fundamental problem because it means two different files could have the same fingerprint, breaking integrity verification.</p>

<p><strong>Avalanche effect:</strong> A small change in the input produces a completely different output. Change one bit of the input and about half the output bits change. This ensures that similar inputs don't produce similar hashes.</p>

<h2>Cryptographic vs non-cryptographic hash functions</h2>

<p>Non-cryptographic hash functions (FNV, MurmurHash, xxHash) are designed for speed and good distribution. They're used in hash maps, checksums, and data partitioning. They lack the security properties — a determined attacker can craft inputs with specific hash values.</p>

<p>Cryptographic hash functions (SHA-256, SHA-3, BLAKE3) have all the properties above and are designed to resist attacks from adversaries. They're used in security-critical applications. They're also slower — typically 10–100× slower than fast non-cryptographic hashes.</p>

<h2>Common applications</h2>

<p><strong>File integrity:</strong> Software downloads list the SHA-256 hash of the file. After downloading, you hash the file and compare. If they match, the file wasn't corrupted or tampered with.</p>

<p><strong>Password storage:</strong> Store <code>hash(password)</code>, not the password. On login, hash the provided password and compare. If the database is stolen, attackers have hashes, not passwords. (Note: use password-specific slow hashes like bcrypt, not SHA-256 — general-purpose hashes are too fast for password storage.)</p>

<p><strong>Digital signatures:</strong> Sign a hash of the document, not the document itself (documents can be gigabytes; signature algorithms work on fixed-size inputs).</p>

<p><strong>Merkle trees:</strong> Git, BitTorrent, and blockchains use trees of hashes to efficiently verify large amounts of data and track changes.</p>

<p><strong>Hash maps:</strong> Language built-in dictionaries (Python <code>dict</code>, JavaScript <code>Object</code>, Java <code>HashMap</code>) use hash functions to quickly locate values by key.</p>

<h2>The birthday problem and collision probability</h2>

<p>With a 256-bit output, SHA-256 has 2^256 possible hash values — an astronomical number. The birthday paradox tells us collisions become likely when you've generated about 2^128 hashes — still an astronomical number, practically impossible to reach by accident. This is why SHA-256's 256-bit output provides 128 bits of collision security.</p>

<p>Generate SHA-256, SHA-1, MD5, and other hashes at <a href="/tools">Toolora → Security → Hash Generator</a>. All hashing runs in your browser.</p>
    `.trim(),
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

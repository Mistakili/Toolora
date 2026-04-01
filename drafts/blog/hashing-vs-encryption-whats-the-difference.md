---
slug: hashing-vs-encryption-whats-the-difference
title: "Hashing vs Encryption: What's the Difference and When to Use Each"
description: "Hashing and encryption are both used to protect data, but they work very differently. Learn the key distinctions, common algorithms, and when to use each — with code examples."
date: 2026-04-01
author: Toolora
tags: [security, developer-tools, hashing, encryption]
---

Every developer will eventually hit the moment where they need to "secure some data" and the question comes up: should I hash this or encrypt it?

Most tutorials give you one line — "use bcrypt for passwords" — and move on. But understanding *why* changes how you think about every security decision you make. Let's actually explain it.

## What Is Hashing?

A hash function takes any input and returns a fixed-length output called a **hash** (or digest). The key properties:

- **One-way**: You can hash a value but you cannot reverse the hash back to the original
- **Deterministic**: The same input always produces the same hash
- **Avalanche effect**: Changing even one character completely changes the output
- **Fixed-size output**: SHA-256 always outputs 64 hex characters regardless of input size

Example with SHA-256:

```
Input:  "password123"
Output: ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f
```

```
Input:  "password124"  ← one character different
Output: 6b4ab9b17e3c4cffa2a4ab8e0f8c3c1f5e4a7b3d1e9c5f2a8b6d4e1c7a9f3b2  ← completely different
```

### Common Hash Algorithms

| Algorithm | Output Size | Use Today? |
|-----------|-------------|------------|
| MD5 | 128-bit (32 hex chars) | No — collision attacks known |
| SHA-1 | 160-bit (40 hex chars) | No — deprecated |
| SHA-256 | 256-bit (64 hex chars) | Yes — file integrity, digital signatures |
| SHA-512 | 512-bit (128 hex chars) | Yes — high-security contexts |
| bcrypt | Variable | Yes — passwords only |
| Argon2 | Variable | Yes — passwords (best choice) |

---

## What Is Encryption?

Encryption also transforms data — but it's **two-way**. You encrypt a value and you can decrypt it back to the original using a key.

- **Reversible**: With the right key, anyone can decrypt the data
- **Requires a key**: Security depends entirely on keeping the key secret
- **Two types**: Symmetric (same key encrypts and decrypts) and asymmetric (public/private key pairs)

Example (conceptual — never store keys like this):

```javascript
const encrypted = encrypt("secret message", key)  // → "a3f9b2c1..."
const decrypted = decrypt(encrypted, key)          // → "secret message"
```

---

## The Core Difference

| | Hashing | Encryption |
|---|---|---|
| **Reversible?** | No | Yes (with key) |
| **Use for passwords?** | Yes (with bcrypt/Argon2) | Never |
| **Use for data you need back?** | No | Yes |
| **Depends on a secret key?** | No | Yes |

The mental model: **hash when you only need to verify, encrypt when you need to recover.**

---

## When to Use Hashing

**1. Storing passwords**

Never store plain-text passwords. Never store encrypted passwords either — if your database leaks along with your encryption key, every password is exposed instantly.

Hash passwords with a slow algorithm designed for this purpose:

```javascript
// Node.js with bcrypt
const bcrypt = require('bcrypt');
const hash = await bcrypt.hash('userpassword', 12);

// Verify later
const match = await bcrypt.compare('userpassword', hash); // → true
```

Why slow? Bcrypt and Argon2 are intentionally slow to make brute-force attacks impractical. SHA-256 is too fast for passwords — attackers can try billions of guesses per second.

**2. File integrity verification**

When you download a file, you can hash it and compare to the publisher's published hash. If they match, the file wasn't tampered with.

**3. Data deduplication**

Hash file contents to detect duplicates without storing the files twice. Git does exactly this — every commit, tree, and blob is identified by its SHA-1 hash.

**4. Digital signatures**

You hash a document, then sign the hash with your private key. The recipient verifies the signature against the hash to confirm authenticity and integrity.

---

## When to Use Encryption

**1. Data you need to retrieve**

Credit card numbers, API keys, SSNs, personal messages — anything you need to read back in plaintext later must be encrypted, not hashed.

**2. Data in transit**

TLS (HTTPS) uses asymmetric encryption to exchange a symmetric session key, then encrypts all traffic with that session key.

**3. Sensitive configuration values**

API keys in your database should be encrypted at rest. If your DB leaks, raw keys are immediately exploitable — encrypted keys are not (unless the encryption key also leaks, which is why key management matters).

---

## The Mistake That Gets People Hacked

The most common mistake: hashing data that needs to be retrieved later, or encrypting passwords.

**Wrong:**
```javascript
// Don't encrypt passwords
const storedPassword = encrypt(userPassword, APP_SECRET);

// Don't use SHA-256 directly for passwords
const storedPassword = crypto.createHash('sha256').update(userPassword).digest('hex');
```

**Right:**
```javascript
// Hash passwords with bcrypt or Argon2
const storedPassword = await bcrypt.hash(userPassword, 12);
```

---

## Quick Reference

| You want to... | Use |
|---|---|
| Store a user's password | bcrypt or Argon2 |
| Verify a downloaded file wasn't tampered with | SHA-256 |
| Store an API key so you can use it later | AES-256 encryption |
| Generate a unique fingerprint for deduplication | SHA-256 |
| Send data securely over a network | TLS (handles encryption for you) |
| Sign a document to prove authenticity | SHA-256 hash + RSA/ECDSA signature |

---

## Try It in Your Browser

You can generate MD5, SHA-1, SHA-256, and SHA-512 hashes instantly without installing anything using the [Toolora Hash Generator](/tools/developer/hash-generator) — it runs entirely in your browser, so nothing you type is ever sent to a server.

For Base64 encoding (a related but different concept), use the [Base64 Encoder/Decoder](/tools/developer/base64).

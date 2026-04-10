---
name: security-audit
description: Deep security audit — find vulnerabilities, check child data compliance (COPPA/GDPR-K), protect student PII, harden APIs, and fix issues autonomously. Run regularly and before any launch.
allowed-tools: Read Grep Glob Bash(node *) Bash(grep *) Bash(curl *) Write Edit
---

# Security Audit — Student Data Protection & Vulnerability Scanner

This platform collects data from CHILDREN and STUDENTS. This means legal compliance obligations under COPPA (US), GDPR-K (EU/UK), PDPA (Pakistan), and general child safety standards. A breach doesn't just leak data — it puts minors at risk.

## COMPLIANCE REQUIREMENTS

### 1. COPPA (Children's Online Privacy Protection Act)
Applies if ANY user is under 13:
- **Parental consent** required before collecting personal info from children under 13
- Must provide clear **privacy policy** describing data practices
- Must allow parents to **review and delete** their child's data
- Cannot collect more data than necessary
- Must have **reasonable security** for children's data

### 2. GDPR-K (General Data Protection Regulation — Children)
Applies to EU/UK users (UAE students may have UK connections):
- Children under 16 need **parental consent** for data processing
- **Right to erasure** — parents can request all data deleted
- **Data minimization** — only collect what you need
- **Privacy by design** — security built in, not bolted on

### 3. Pakistan PDPA (Personal Data Protection Act)
- Consent required for data collection
- Data must be stored securely
- Cross-border transfer restrictions
- Right to access and correction

### 4. UAE PDPL (Personal Data Protection Law)
- Explicit consent for children's data
- Data must stay in UAE or approved countries
- Right to deletion

## SECURITY SCAN CHECKLIST

### A. AUTHENTICATION & ACCESS CONTROL

```bash
# 1. Check for hardcoded passwords/secrets in client-side code
grep -rn "password\|secret\|api_key\|apikey\|token" pages/ components/ --include="*.jsx" --include="*.js" | grep -v node_modules | grep -v "type=\"password\"" | grep -v "placeholder"

# 2. Check for passwords in URL query params (CRITICAL — visible in logs, browser history, referrer headers)
grep -rn "password=" pages/ --include="*.jsx" --include="*.js"

# 3. Check for exposed env vars in client-side code
grep -rn "process.env" pages/ components/ --include="*.jsx" | grep -v "_app"

# 4. Check API routes for missing auth
grep -rL "isAdmin\|apiAuth\|auth\|password\|cron.*secret\|CRON_SECRET" pages/api/*.js
```

### B. DATA EXPOSURE

```bash
# 1. Check for email addresses exposed in client-side code
grep -rn "@.*\.\(com\|edu\|pk\|co\)" pages/ components/ --include="*.jsx" | grep -v "mailto:" | grep -v "//" | grep -v "placeholder"

# 2. Check for student data in client-side code (names, phones, IDs)
grep -rn "student.*email\|child.*name\|phone.*number\|whatsapp" pages/ components/ --include="*.jsx"

# 3. Check localStorage for sensitive data storage
grep -rn "localStorage\.\(set\|get\)Item" pages/ components/ --include="*.jsx" | grep -i "email\|password\|phone\|token"

# 4. Check if any API returns user lists without auth
grep -rn "select.*email\|select.*phone\|select.*name" pages/api/ --include="*.js" | grep -v "isAdmin\|auth"
```

### C. API SECURITY

```bash
# 1. Check all API routes have rate limiting
grep -rL "rateLimit\|checkRate\|rate" pages/api/*.js

# 2. Check for SQL injection vectors (Supabase is safe but check raw queries)
grep -rn "\.rpc\|\.raw\|sql\`" pages/api/ utils/ --include="*.js"

# 3. Check CORS settings
grep -rn "Access-Control\|cors\|CORS" pages/api/ --include="*.js"

# 4. Check for open redirect vulnerabilities
grep -rn "redirect\|returnTo\|callbackUrl" pages/ --include="*.jsx" --include="*.js"

# 5. Check file upload endpoints for path traversal
grep -rn "upload\|file.*path\|writeFile" pages/api/ --include="*.js"
```

### D. XSS (Cross-Site Scripting)

```bash
# 1. Check for dangerouslySetInnerHTML usage
grep -rn "dangerouslySetInnerHTML" pages/ components/ --include="*.jsx"

# 2. Check for unescaped user input in URLs
grep -rn "encodeURIComponent\|decodeURIComponent" pages/ --include="*.jsx"

# 3. Check that CSP headers are set
grep -rn "Content-Security-Policy\|CSP" pages/api/ next.config* --include="*.js" --include="*.mjs"
```

### E. SUPABASE RLS (Row Level Security)

```bash
# Check if RLS is mentioned/configured
grep -rn "RLS\|row.*level\|policy" utils/supabase* pages/api/ --include="*.js"
```

**CRITICAL**: Every Supabase table MUST have RLS enabled. Without RLS, anyone with the anon key can read ALL data. Tables to check:
- `question_bank` — questions (less sensitive)
- `sessions` / `session_logs` — student activity (SENSITIVE)
- `users` / `profiles` — student PII (CRITICAL)
- `subscriptions` — payment data (CRITICAL)
- `referrals` — user relationships
- `topic_mastery` — student progress

### F. HEADERS & TRANSPORT

```bash
# 1. Check security headers in next.config
grep -rn "headers\|HSTS\|X-Frame\|X-Content-Type\|Referrer-Policy" next.config* --include="*.js" --include="*.mjs"

# 2. Verify HTTPS enforcement
curl -I https://www.newworld.education 2>/dev/null | grep -i "strict-transport\|x-frame\|x-content-type\|content-security"
```

Required headers:
- `Strict-Transport-Security: max-age=63072000` (2 years HSTS)
- `X-Frame-Options: DENY` (prevent clickjacking)
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy` (strict whitelist)

### G. CHILD-SPECIFIC PROTECTIONS

1. **Age gate**: Is there any mechanism to detect users under 13?
2. **Parental consent flow**: Can parents approve their child's account?
3. **Data retention**: How long is student data kept? Is there auto-deletion?
4. **Data export**: Can parents download their child's data?
5. **Data deletion**: Can parents request complete deletion?
6. **Anonymization**: Is student data anonymized for analytics?
7. **Third-party sharing**: Is any student data sent to 3rd parties? (analytics, email providers)
8. **Cookie consent**: Is there a cookie banner for EU/UK users?

## AUTONOMOUS FIXES

When issues are found, fix them immediately if safe:

### Auto-fixable:
- Remove hardcoded passwords/secrets from client code
- Move `?password=` to header-based auth
- Add rate limiting to unprotected API routes
- Remove exposed email addresses from client pages
- Add missing security headers
- Remove 3rd party tracking scripts

### Requires approval (show diff first):
- Changes to authentication flow
- Supabase RLS policy changes
- Changes to data collection practices
- Privacy policy updates
- Changes to protected files (index.jsx, starkyPrompt.js, etc.)

## REPORT FORMAT

```
SECURITY AUDIT — [DATE]
═══════════════════════════════════════

CRITICAL (fix immediately):
  ✗ [issue — what, where, risk]

HIGH (fix before launch):
  ✗ [issue]

MEDIUM (fix within 30 days):
  ⚠ [issue]

COMPLIANCE:
  ✗ COPPA: [status]
  ✗ GDPR-K: [status]
  ✗ Pakistan PDPA: [status]

DATA INVENTORY:
  What PII is collected: [list]
  Where it's stored: [list]
  Who can access it: [list]
  How long it's kept: [retention policy]
  Can parents delete it: [yes/no]

SUPABASE RLS:
  [table]: RLS [enabled/disabled]

HEADERS:
  HSTS: [present/missing]
  CSP: [present/missing]
  X-Frame-Options: [present/missing]

RESULT: [PASS / FAIL — X critical issues]
```

## USAGE
```
/security-audit              # Full scan
/security-audit apis         # API routes only
/security-audit compliance   # COPPA/GDPR check only
/security-audit pii          # Find all PII in codebase
/security-audit headers      # Check security headers only
```

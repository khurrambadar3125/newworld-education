---
name: full-audit
description: Scan all pages for broken links, wrong content, missing bank content, stale references, and security issues. Run before any major launch or demo.
allowed-tools: Read Grep Glob Bash(node *) Bash(grep *) Bash(curl *)
---

# Full Platform Audit

Comprehensive scan of the entire platform for issues.

## AUDIT CATEGORIES

### 1. Content Accuracy
For each section (MiTE, Cambridge, Sindh Board, entrance-tests):
- Verify program/subject names match the actual institution
- Check for stale references (Law, LAT, LUMS where removed)
- Verify stats/numbers are current (question counts, subject counts)
- Check that bank content exists for every subject shown on the platform

### 2. Broken Links
Scan all 92 pages for:
- Internal links to pages that don't exist
- API calls to endpoints that don't exist
- External 3rd party links (banned on student pages)
- Dead anchor links (#section that doesn't exist)

```bash
# Find all href values across all pages
grep -rn 'href="/' pages/ --include="*.jsx" | grep -oP 'href="/[^"]*"'
```

### 3. Navigation Consistency
- Check `PAGES_WITH_OWN_NAV` in `_app.jsx` — are all section pages listed?
- Check StarkyBubble exclusions — are non-Starky pages excluded?
- Check VoiceChatBar exclusions — same
- Verify Nav.jsx menu items are correct for each board type

### 4. Bank Coverage
Query Supabase for each curriculum:
```javascript
// Count by curriculum and subject
const { data } = await sb.from('question_bank')
  .select('curriculum, subject')
  .limit(50000);
```
Report: which subjects have 0 questions? Which have <10?

### 5. Security Scan
- Grep for hardcoded passwords/secrets in client-side code
- Check for `?password=` in URL (should use headers)
- Check for exposed email addresses in client code
- Verify all admin APIs use header-based auth

### 6. Content Format
- Check Sindh Board topics for bare definitions (should have examples + MCQs)
- Check that STEM subjects don't have Roman Urdu content
- Verify Islamiat keywords match actual topics

### 7. Mobile Issues
- Check for fixed widths that break on mobile
- Check for text that's too small on mobile
- Check tap targets are >= 44px

## REPORT FORMAT
```
FULL AUDIT — 2026-04-10
═══════════════════════

CONTENT:    3 issues found
  ✗ mite-portal still says "1,851" questions (should be 19K+)
  ✗ entrance-tests has 0 bank questions
  ✓ Cambridge subjects all correct

LINKS:      1 issue found
  ✗ /mite-faculty links to monitor-sessions with ?password=

NAV:        0 issues
  ✓ All MiTE pages in PAGES_WITH_OWN_NAV
  ✓ StarkyBubble excluded from MiTE

BANK:       2 gaps
  ✗ Economics: 0 questions
  ✗ Pakistan Studies: 0 questions
  ✓ Computer Science: 15,184 questions
  ✓ Chemistry: 552 questions

SECURITY:   0 issues
  ✓ No hardcoded passwords found
  ✓ All admin APIs use header auth

TOTAL: 6 issues found across 92 pages
```

## USAGE
```
/full-audit                    # Full platform scan
/full-audit mite               # MiTE section only
/full-audit security           # Security checks only
/full-audit bank               # Bank coverage only
```

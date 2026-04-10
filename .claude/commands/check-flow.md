---
name: check-flow
description: Verify all links, buttons, and navigation on a specific page work correctly. Use after editing any page to catch broken flows before pushing.
allowed-tools: Read Grep Glob Bash(grep *) Bash(node *)
---

# Check Flow — Page Link & Button Verification

Verify every link, button, and navigation element on a page actually goes where it should.

## RULES
- Check EVERY href, onClick, router.push, window.location in the file.
- For each link target, verify the destination page/API EXISTS.
- Check that the destination page makes sense in context (no Cambridge drill for MiTE students).
- Check for hardcoded external URLs (3rd party links are banned on student-facing pages).
- Check that Nav/StarkyBubble/VoiceChatBar are appropriate for this page.
- Report ALL issues found, not just the first one.

## STEPS

1. **Read the page file** completely.
2. **Extract all navigation targets**:
   - `href="..."` and `href={...}`
   - `router.push(...)` and `window.location.href=...`
   - `onClick` handlers that navigate
   - `<Link href="...">` components
   - `<a href="...">` tags
3. **For each target**:
   - If it's an internal page (`/study`, `/drill`, etc.) → verify `pages/[target].jsx` exists
   - If it's an API (`/api/...`) → verify `pages/api/[target].js` exists
   - If it's external (`https://...`) → FLAG as potential 3rd party link
   - If it has query params → verify the destination page reads those params
4. **Check context**:
   - Is this page in `PAGES_WITH_OWN_NAV` in `_app.jsx`? Should it be?
   - Is StarkyBubble hidden for this page type? Should it be?
   - Does the hamburger menu show correct items for this page's context?
5. **Check localStorage assumptions**:
   - Does the page read `nw_user` from localStorage?
   - Does it assume a specific `board` or `curriculum` value?
   - Could wrong localStorage values cause wrong content to appear?
6. **Report**:
   ```
   PAGE: /mite-study
   ✓ /mite-prep — exists, correct context
   ✓ /mite-portal — exists, correct context
   ✗ /drill?subject=X — exists BUT shows Cambridge context, wrong for MiTE
   ✗ https://openstax.org/... — 3rd party link, banned
   ⚠ Nav not in PAGES_WITH_OWN_NAV — hamburger may show wrong items
   ```

## USAGE
```
/check-flow pages/mite-study.jsx
/check-flow pages/index.jsx
/check-flow pages/study.jsx
```

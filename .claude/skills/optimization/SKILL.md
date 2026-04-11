---
name: optimization
description: Audit and optimize page performance — bundle size, lazy loading, API calls, render speed, Core Web Vitals, image optimization. Run before launches or when pages feel slow.
allowed-tools: Read Grep Glob Bash(node *) Bash(npx *) Bash(curl *) Bash(wc *) Bash(du *)
---

# Performance Optimization

Audit and fix performance issues across the platform.

## AUDIT CATEGORIES

### 1. Bundle Size Analysis
Check for oversized pages and unnecessary imports:

```bash
# Find largest page files
wc -c pages/*.jsx | sort -rn | head -20

# Find heavy utils imported on client side
grep -rn "import.*from.*utils/" pages/ --include="*.jsx" | grep -v "//.*import"

# Check for unused imports
grep -rn "^import" pages/ --include="*.jsx" | grep -c "import"
```

Flag:
- Pages over 50KB (should code-split)
- Utils imported but only used server-side
- Multiple KB files imported on one page (starkyAtomsKB, cambridgeDialectKB, etc.)
- Dynamic imports that should be lazy: `next/dynamic` with `ssr: false`

### 2. API Call Optimization
```bash
# Find all fetch/API calls in pages
grep -rn "fetch\|/api/" pages/ --include="*.jsx" | grep -v "//.*fetch"

# Find duplicate API calls (same endpoint called multiple times)
grep -rn "fetch.*'/api/" pages/ --include="*.jsx" -o | sort | uniq -c | sort -rn
```

Check:
- Duplicate fetches on same page (should batch or cache)
- Missing `AbortController` on unmount (memory leaks)
- API calls in render path (should be in useEffect)
- Missing error handling on fetches
- Unnecessary client-side fetches that could be `getServerSideProps`

### 3. Image & Asset Optimization
```bash
# Find image references
grep -rn "src=.*\.\(png\|jpg\|jpeg\|gif\|svg\|webp\)" pages/ components/ --include="*.jsx"

# Find inline base64 images (bloat)
grep -rn "data:image" pages/ components/ --include="*.jsx" | wc -l

# Check for next/image usage (should use for optimization)
grep -rn "next/image" pages/ --include="*.jsx" | wc -l
```

Flag:
- Raw `<img>` tags (should use `next/image` for auto-optimization)
- Missing `width`/`height` (causes layout shift — CLS)
- Large inline SVGs that should be external files
- No `loading="lazy"` on below-fold images

### 4. Render Performance
```bash
# Find components re-rendering on every state change
grep -rn "useState\|useEffect" pages/ --include="*.jsx" -c | sort -t: -k2 -rn | head -10

# Find inline object/array creation in JSX (causes re-renders)
grep -rn "style={{" pages/ --include="*.jsx" -c | sort -t: -k2 -rn | head -10

# Find missing useCallback/useMemo
grep -rn "onClick={(" pages/ --include="*.jsx" | head -20
```

Check:
- Too many useStates in one component (>10 = consider useReducer)
- useEffect without dependency array (runs every render)
- Inline arrow functions in onClick (re-creates on every render)
- Large arrays/objects recreated on every render (should useMemo)
- Components that should be memoized with React.memo

### 5. Core Web Vitals
```bash
# Check for layout shift causes
grep -rn "position.*fixed\|position.*absolute" pages/ --include="*.jsx" | head -10

# Check for render-blocking resources
grep -rn "<link.*stylesheet\|<script.*src" pages/ --include="*.jsx"

# Check font loading strategy
grep -rn "fonts.googleapis\|font-face" pages/ --include="*.jsx"
```

Audit:
- **LCP** (Largest Contentful Paint): Is the hero/main content loading fast?
- **FID** (First Input Delay): Any heavy JS blocking interaction?
- **CLS** (Cumulative Layout Shift): Any elements shifting after load?
- Font loading: `display=swap` present? Preconnect to Google Fonts?

### 6. Caching & Data Loading
```bash
# Check Supabase queries without limits
grep -rn "from('.*').select" pages/ utils/ --include="*.jsx" --include="*.js" | grep -v "limit\|head"

# Check for KV cache usage
grep -rn "upstash\|kv\.\|redis" utils/ --include="*.js" | head -10

# Check API response caching headers
grep -rn "Cache-Control\|s-maxage\|stale-while-revalidate" pages/api/ --include="*.js"
```

Flag:
- Supabase queries without `.limit()` (can return 1000s of rows)
- API routes without cache headers (should use `s-maxage`)
- Missing KV caching on expensive AI/Supabase calls
- Prompt caching: verify `cache_control: ephemeral` on Anthropic calls

### 7. Next.js Specific
```bash
# Check for pages that could be static (no dynamic data)
grep -rL "useEffect\|useState\|getServerSideProps\|getStaticProps" pages/*.jsx

# Check for dynamic imports
grep -rn "next/dynamic\|dynamic(" pages/ --include="*.jsx"

# Check middleware performance
wc -c middleware.js 2>/dev/null
```

Check:
- Pages with no dynamic data should use `getStaticProps` (SSG)
- Heavy components should use `next/dynamic` with `ssr: false`
- Middleware should be lightweight (<50KB)
- Check `next.config.js` for missing optimizations

### 8. Mobile Performance
```bash
# Find heavy animations that may lag on mobile
grep -rn "animation\|transition\|transform" pages/ --include="*.jsx" -c | sort -t: -k2 -rn | head -10

# Check for scroll listeners without passive flag
grep -rn "addEventListener.*scroll" pages/ components/ --include="*.jsx" | grep -v "passive"
```

Flag:
- Animations without `will-change` (forces GPU layer)
- Scroll listeners without `{ passive: true }` (blocks scrolling)
- Heavy CSS animations on mobile (should use `prefers-reduced-motion`)
- Fixed/sticky elements causing janky scroll on 3G

## FIX PRIORITY

1. **Critical** (blocks users): Missing error handling, memory leaks, infinite loops
2. **High** (affects speed): Unbounded queries, missing caching, render-blocking resources
3. **Medium** (affects UX): Layout shifts, slow animations, missing lazy loading
4. **Low** (nice to have): Code splitting, unused imports, minor bundle reduction

## REPORT FORMAT
```
OPTIMIZATION AUDIT — 2026-04-11
════════════════════════════════

BUNDLE:     2 issues
  ✗ index.jsx is 1,465 lines — consider code-splitting sections
  ✗ 12 KB utils imported but only 2 used on initial render
  ✓ All other pages under 50KB

API CALLS:  1 issue
  ✗ /api/anthropic missing AbortController cleanup
  ✓ All fetches in useEffect
  ✓ No duplicate fetches detected

IMAGES:     3 issues
  ✗ 4 raw <img> tags found (should use next/image)
  ✗ No loading="lazy" on below-fold images
  ✗ 2 inline base64 images (total 14KB)

RENDER:     1 issue
  ✗ index.jsx has 18 useStates — consider useReducer
  ✓ All useEffects have dependency arrays

WEB VITALS: 0 issues
  ✓ Fonts use display=swap
  ✓ Preconnect to fonts.googleapis.com

CACHING:    2 issues
  ✗ 3 Supabase queries without .limit()
  ✗ /api/session-insights missing Cache-Control header
  ✓ Prompt caching verified on Anthropic calls

NEXT.JS:    1 issue
  ✗ /privacy and /terms could be static (getStaticProps)
  ✓ Dynamic imports used for heavy components

MOBILE:     1 issue
  ✗ 2 scroll listeners without passive flag
  ✓ Animations use will-change where needed

TOTAL: 11 issues (0 critical, 3 high, 5 medium, 3 low)
```

## USAGE
```
/optimization                  # Full performance audit
/optimization bundle           # Bundle size only
/optimization api              # API call audit only
/optimization vitals           # Core Web Vitals only
/optimization mobile           # Mobile performance only
/optimization fix              # Audit + auto-fix safe issues
```

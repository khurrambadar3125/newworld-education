---
name: deploy-check
description: Run post-deploy verification after pushing to Vercel. Checks API health, page loads, and critical flows.
allowed-tools: Bash(curl *) Bash(node *) WebFetch Read
---

# Deploy Check — Post-Push Verification

Run after every `git push` to verify the deployment is healthy.

## CHECKS TO RUN

### 1. API Health
```bash
curl -s https://www.newworld.education/api/health | node -e "
  let d=''; process.stdin.on('data',c=>d+=c); process.stdin.on('end',()=>{
    try { const j=JSON.parse(d); console.log('Health:', j.status||'unknown'); }
    catch { console.log('FAIL: health endpoint returned non-JSON'); }
  });"
```

### 2. Critical Pages Load (check HTTP 200)
Test these pages return 200:
- `/` (homepage)
- `/study` (study path)
- `/drill` (practice drill)
- `/pricing` (pricing page)
- `/mite-portal` (MiTE section)
- `/sindh-board` (Sindh Board)
- `/special-needs` (SEN)
- `/parent` (parent portal)

```bash
for page in "" study drill pricing mite-portal sindh-board special-needs parent; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "https://www.newworld.education/$page")
  echo "$status — /$page"
done
```

### 3. API Endpoints Respond
```bash
for api in health anthropic study-path nano-notes; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "https://www.newworld.education/api/$api")
  echo "$status — /api/$api"
done
```

### 4. Check for Console Errors
- WebFetch the homepage and check for JavaScript errors
- Verify no 404s for static assets

### 5. Verify Recent Changes
- Check `git log -1` to see what was just pushed
- Verify the changed files are reflected in the live site
- If a page was edited, WebFetch it and verify the change is visible

## REPORT FORMAT
```
DEPLOY CHECK — 2026-04-10 11:30 PKT
═══════════════════════════════════════
Commit: abc1234 — "Fix MiTE nav flow"
Deployed: ✓ Vercel

API Health:     ✓ OK
Pages (8/8):    ✓ All 200
APIs (4/4):     ✓ All responding
Changed files:  ✓ Verified on live site

RESULT: ✓ DEPLOY HEALTHY
```

## IF DEPLOY FAILS
1. Check Vercel deployment status: `https://vercel.com/dashboard`
2. Check build logs for errors
3. If a page returns 500, check the server-side error in Vercel logs
4. Do NOT push another commit to "fix" without understanding the error

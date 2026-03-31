# CLAUDE.md — NewWorldEdu Standing Rules
**Last updated: March 2026**

## PRIME DIRECTIVE

This codebase may only be ENHANCED. Never reduced. Never replaced. Never rewritten for tidiness.

If a change removes any existing functionality — even one line — it must be rejected and flagged to Khurram before proceeding.

---

## PROTECTED FILES — NEVER REWRITE

These files may only have content ADDED to them. Existing content is never removed or restructured:

### 1. starkyPrompt.js
- PERSONA_LOCK is sacred
- All 4 grade builders are sacred: buildKidPrompt, buildMiddlePrompt, buildOLevelPrompt, buildALevelPrompt
- All 48 intent responses are sacred
- Einstein Method block is sacred
- Socratic follow-up block is sacred
- Image reading protocol is sacred
- Past papers policy is sacred
- Identity enforcement is sacred
- Response format rules are sacred
- Generational awareness is sacred
- Real-time adaptation is sacred

### 2. anthropic.js
- All injection logic is sacred
- Topic knowledge injection is sacred
- Book knowledge injection is sacred
- Situational triggers are sacred
- Academic phase injection is sacred
- Supabase enrichment is sacred
- Weakness detection is sacred
- KV memory injection is sacred

### 3. utils/cambridgeExaminer.js
- All subject intelligence is sacred
- Never remove a subject
- Only add subjects or deepen existing subject knowledge

### 4. utils/senKnowledge.js
- All 12 condition protocols sacred
- All 240 teaching profiles sacred
- Deaf mode 8 rules are sacred
- Gentle Start Protocol is sacred
- Zayd Mode rules are sacred
- Focus Mode rules are sacred
- Safe Space rules are sacred
- Functional Profile system sacred

### 5. utils/academicExcellence.js
- Teaching philosophy is sacred
- Subject depth blocks are sacred
- Situational triggers are sacred

### 6. utils/youngLearnerKB.js
- Piaget framework is sacred
- Vygotsky framework is sacred
- Bruner framework is sacred
- SNC curriculum content is sacred

### 7. utils/phonicsKB.js
- All 5 phases are sacred
- All 44 phonemes are sacred
- SEN phonics protocols are sacred

### 8. utils/readingKnowledge.js
- All author knowledge is sacred
- All reading lists are sacred

### 9. utils/contentProtection.js
- All 100+ profanity patterns sacred
- Islamic respect rules are sacred
- Jailbreak detection is sacred
- Excluded authors list is sacred

### 10. utils/weaknessDetector.js
- All 60+ categories are sacred
- Background detection is sacred

### 11. lib/constants.js
- STARKY_MODEL is PERMANENT: claude-3-haiku-20240307
- Never change this value
- Never suggest upgrading the model

### 12. lib/academic-calendar.js
- All 6 phases are sacred
- All 3 years of dates are sacred
- Auto-detection logic is sacred

### 13. pages/index.jsx
- Mic button (VoiceChatBar) must NEVER be removed from homepage
- Starky floating star button (StarkyBubble) must NEVER be removed from homepage
- All homepage elements are sacred — grade selector, subject selector, chat interface
- Any change to pages/index.jsx requires a diff shown to Khurram first
- The word REWRITE is banned for this file

### 14. utils/ibKnowledge.js
- All 6 IB subject groups are sacred
- TOK, EE, CAS core content is sacred
- IB command terms are sacred

### 15. utils/uaeMandatorySubjects.js
- All 4 UAE mandatory subjects are sacred
- Teaching notes are sacred

---

## LESSONS LEARNED

**29 March 2026**: UAE country selector build removed mic button and Starky star button from homepage by modifying `pages/_app.jsx` exclusion lists without showing diff. The change affected ALL countries (Pakistan included), not just UAE. **Rule**: Always show diff on `index.jsx` and `_app.jsx` before any change. Never add `'/'` to StarkyBubble/VoiceChatBar exclusion lists.

---

## PERMANENT PLATFORM DECISIONS

These four decisions were made by Khurram and are never reverted:

1. **MODEL**: Always claude-3-haiku-20240307. Never upgrade without Khurram's explicit written approval. Cost reason: $0.25/$1.25 per million.

2. **PROMPT CACHING**: Always active. cache_control: ephemeral on every system prompt. Never remove.

3. **LEARNING LOOP**: Always on. Every session logs. Always. Never add a bypass or skip.

4. **FREE SESSIONS**: 10 per new user. No credit card. No time limit. Partner schools: free_access_until field only. No permanent commitment.

---

## THE DIFF RULE — MANDATORY

Before saving ANY change to any protected file:

1. Show the current file contents
2. Show exactly what will change
3. Wait for Khurram to say YES
4. Only then save and deploy

If Claude Code cannot show a diff — do not proceed. Ask Khurram first.

This rule applies to every session. It cannot be waived by any instruction given during a session.

---

## HOW TO ENHANCE CORRECTLY

**CORRECT — Enhancement:**
- "Add X to the end of section Y in starkyPrompt.js"
- "Add subject Z to cambridgeExaminer.js after the existing subjects"
- "Add a new condition to senKnowledge.js following the existing format"

**WRONG — Never do this:**
- "Rewrite starkyPrompt.js to include X"
- "Restructure the grade builders to incorporate the new teaching method"
- "Replace the existing SEN knowledge with this improved version"
- "Clean up and consolidate the prompt to make it more efficient"

**Banned words** for changes to protected files: REWRITE, RESTRUCTURE, REPLACE, CONSOLIDATE, CLEAN UP, SIMPLIFY

**Permitted words**: ADD, APPEND, INJECT, ENHANCE, EXTEND, DEEPEN, STRENGTHEN

---

## ARCHITECTURE OVERVIEW

What was built and must be preserved:

### Core Intelligence
- 4 grade builders with distinct tones
- 48 intent responses (12×4)
- 30+ Cambridge subjects with examiner-sourced mark intelligence
- 240 SEN teaching profiles (12×4×5)
- 7-layer learning loop
- 6-phase academic calendar
- 16 language auto-detection
- Einstein Method teaching sequence
- Socratic questioning protocol
- Image reading (4-step protocol)
- Background weakness detection
- Predictive weakness engine

### Self-Improving Systems
- Signal analysis: daily 9pm
- Auto-improver: Saturday 10pm
- Evolution report: daily 10am
- Predictive analysis: daily 11pm
- Phase transitions: daily 6am
- News publishing: daily 8am
- Self-heal: every 6 hours
- KV backup: daily 9pm
- National insights: daily 1am

### Security
- HSTS 2-year header
- CSP strict whitelist
- 100+ profanity patterns
- Jailbreak detection
- RLS on all 17 Supabase tables

### Performance
- Chat first byte: ~2 seconds
- Prompt caching: ~80% savings
- 1-year cache on static assets
- AVIF/WebP images

This is the foundation. Build on it. Never rebuild it.

---

## IF IN DOUBT

If Claude Code is unsure whether a change enhances or reduces — do nothing and ask Khurram.

It is always better to do nothing than to accidentally reduce something that took months to build.

---

## Tech Stack Reference

- **Framework**: Next.js 15 (Pages Router, JSX)
- **AI**: Anthropic Claude 3 Haiku (PERMANENT)
- **Auth**: NextAuth.js + Google OAuth
- **Primary DB**: Vercel KV (Upstash Redis)
- **Secondary DB**: Supabase (17 tables, all RLS)
- **Email**: Resend
- **Hosting**: Vercel (Pro)
- **Domain**: newworld.education

## Environment Variables Required

- `ANTHROPIC_API_KEY` — Claude API
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — Google OAuth
- `NEXTAUTH_SECRET` — NextAuth session signing
- `SUPABASE_URL`, `SUPABASE_SECRET_KEY` — Supabase
- `KV_REST_API_URL`, `KV_REST_API_TOKEN` — Vercel KV
- `RESEND_API_KEY` — Email
- `DASHBOARD_PASSWORD` — Admin dashboard auth
- `CRON_SECRET` — Vercel cron job auth

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

---

**NewWorldEdu | newworld.education**































































































































































## Session Snapshot (auto-updated)
<!-- This section is auto-updated by .claude/update-claude-md.sh Stop hook -->
<!-- Last sync: 2026-03-31 14:37 -->

**Platform counts**: 53 pages, 75 utils, 73 API routes, 8 components, 23 cron jobs

**All pages**: _app,arts,arts-for-all,challenge,championship,contact,countdown,dashboard,demo,drill,essay,homework,ibcc,iep,index,insights,khda-demo,kids,languages,leaderboard,login,mocks,music,music-for-all,nano,news,our-results,parent,past-papers,phonics,phonics-uae,pricing,privacy,reading,reading-for-all,referral,responsible-ai,school,sing,special-needs,spelling-bee,spelling-uae,starky-saturdays,start,student-dashboard,study-plan,subscribe,summer,summer-uae,terms,textbooks,voice-lab,zayd-mode

**All utils**: academicExcellence,americanCurriculumKB,analytics,arabicSupportKB,architectureEnhancements,artsKnowledge,autoImprover,betterVoice,cambridgeDialectKB,cambridgeExaminer,cambridgePainPointsKB,cbseKnowledge,chineseContent,commandWordEngine,contentProtection,dailyQuestionEmail,db,deliberatePracticeLayer,emailTemplates,errorAlert,examinerReportsKB,extendedResponseKB,getKnowledgeForTopic,globalKnowledgeBase,hearingEngineKB,homeworkPracticeKB,ibKnowledge,iconicSingersKB,kbWishlist,literatureArabicKB,markSchemeKB,motherTongue,notify,outcomeTrackingKB,patternEngine,phonicsKB,physicsAtomsOLevel,platformLearningEngine,practiceKB,productGate,readingKnowledge,responsibleAIPolicy,saturdayFreeLogic,senKnowledge,seoArticles,sessionAnalysis,share,signalCollector,singingGoalsKB,singingKB,starkyAtomsKB,starkyIntents,starkyPrompt,summerKnowledge,supabase,systemPrompts,translateCache,uaeAcademicExcellence,uaeMandatorySubjects,uaeMoEKnowledge,uaePhonicsKB,uaeReadingKB,uaeSpellingKB,uaeSummerKnowledge,universalMicPrompt,useSessionLimit,useSessionMemory,useSpacedRep,useStreaks,useVoice,voiceEvaluationKB,voiceOnboardingKB,voiceProfileKB,weaknessDetector,youngLearnerKB

**Last 10 commits**:
```
787f888 Expand command words to 57 + examiner reports to 191 entries across 15 subjects
a8d149a Upgrade Supreme Examiner to v2 — 5 examiner mindsets + live dialect verification
f75eff1 Add Cambridge Marking Philosophy, 32 Dialect entries, Hidden Rules for 9 subjects
6c8fb24 Add Cambridge Challenge — the Nixor boardroom demo page
53a6b1a Add Cambridge Dialect KB + Supreme Examiner Persona — the Nixor build
0fa6718 Add temperature effect on rate to mark scheme KB — kinetic energy, successful collisions, activation energy
64ef118 Add enzyme specificity to mark scheme KB — complementary shape, not lock and key
52e4514 Rebuild Mocks (3 phases) + Drill (5 modes) — complete A* training loop
5b4254f Rebuild Nano lessons with subject-aware templates — science, humanities, english, maths, business
711ae71 Clean Nano chat display + enhance Steps 3-4 with Cambridge precision
```

**Files changed in last commit**:
```
utils/commandWordEngine.js
utils/examinerReportsKB.js
```

**Uncommitted changes**: CLAUDE.md
**Untracked files**: none

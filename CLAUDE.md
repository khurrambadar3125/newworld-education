# NewWorldEdu — Platform Memory
# Last updated: 2026-04-10

## ABSOLUTE RULES — NEVER BREAK
1. Model = claude-3-haiku-20240307 ONLY. Never change.
2. Prompt caching always on — cache_control: ephemeral on ALL prompts.
3. Never touch pages/index.jsx without showing diff first.
4. Never touch pages/api/anthropic.js without showing diff first.
5. Never touch utils/starkyAtomsKB.js without showing diff first.
6. Never touch components/Nav.jsx without showing diff first.
7. Additive only — never delete existing work.
8. Students see Nano — never Atoms.
9. Bank-first — AI generation disabled.
10. Always run claude doctor after updates.

## PLATFORM (April 10 2026)
- Live: newworld.education
- Stack: Next.js, Vercel, Supabase (39 tables), Upstash KV, Resend, Twilio
- 92 pages, 91 utils, 100 APIs, 20 components

## QUESTION BANK
- 89,359 verified questions
- 425,500+ total learning items
- 376,636 dictionary words (8 languages)
- MiTE: 19,400+ | SAT: 9,033+ | SEN: 342 | Edexcel: 1,895

## SECURITY
- Breach April 6: Omar via hardcoded password in DevTools
- All fixed. All keys rotated.
- PENDING: Supabase RLS (rls-policies.sql ready), PayPal webhook, Base64 to JWT, local .env.vercel update

## MITE
- 5 programs: BBA, BS-CS, BS-FD, Accounting, MS-CS
- NO IBA/LUMS/FAST references
- KNOWN BUG: nav routes to Matric section — unfixed
- Entry: /mite-portal

## TASK QUEUE
1. Fix MiTE nav bug
2. Retag IBA/LAT/GAT to entrance-tests
3. Supabase RLS
4. Onboarding + monetization
5. Cross 89K — update homepage/nixordemo/partner
6. SAT PhD-level build
7. SEN rebuild
8. Parent dashboard
9. 90 examiner reports
10. Sing page Web Audio API
11. GMAT

## PARTNERSHIP

## LEARNING LOOP (THE MOAT)
1. signalCollector.js records 12 strategy types per session
2. After session → Haiku analysis → teaching_insights → student_preferences + KV
3. Next session → useSessionMemory.js loads KV → starkyPrompt.js injects LEARNED FROM PREVIOUS SESSIONS
4. Weekly → autoImprover.js aggregates cross-student strategy effectiveness
5. Weekly → evolution-report.js sends founder intelligence
Key tables: strategy_signals, teaching_insights, student_preferences, autodiscovered_knowledge, platform_insights
KV fields: whatWorkedHistory, whatWorkedLastTime, whatDidntWork, engagementPeaks, knownStrengths, learningStyle, preferredApproach, nextGoals, lastSessionMood

## VOICE/TTS
- Children 4-10 use Starky via voice (STT input, TTS output)
- TTS in 3 files: StarkyBubble.jsx, index.jsx, utils/useVoice.js
- CRITICAL: Strip emojis before TTS — kids were hearing "dizzy face", "smiley face"
- Kid mode: pitch 1.2, slower rate
- Session insights API: /api/session-insights (params: password, hours, email, limit)

## SUPABASE TABLES (39 total)
atom_mastery, autodiscovered_knowledge, blog_articles, cambridge_test_answers,
cambridge_weaknesses, confusion_signals, content_violations, dictionary_bank,
drill_signals, dropoff_signals, kv_backups, leads, news_articles, platform_insights,
question_bank, sr_queue, strategy_signals, student_predictions, student_preferences,
student_progress, student_signals, study_plans, teaching_bank, teaching_insights,
topic_mastery, weakness_patterns + more

## KHURRAM'S WORKING PREFERENCES
- Fix ALL instances not just one — always grep whole project first
- Auto-commit and push to main after every fix (Vercel auto-deploys)
- Never repeatedly ask for passwords
- Concise responses — direct fast fixes over lengthy explanations
- Sole developer — builds full stack: frontend, backend, AI, cron, email, payments
- Tests with real children including his own

## ANIMATION STACK (awwwards-style landing pages)
- GSAP for scroll-triggered animations (CDN: https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js)
- ScrollTrigger plugin for scroll-based reveals
- Lenis for smooth scroll (https://cdn.jsdelivr.net/npm/@studio-freight/lenis/bundled/lenis.min.js)
- Parallax: translate elements on scroll using JS, not CSS
- Text animations: split text into chars/words, stagger reveals
- Page transitions: fade/slide between sections
- Cursor: custom cursor that reacts to hover states


## ALL PAGES (93 total)
404
500
_app
arts
arts-for-all
become-newton
books
bootcamp
bootcamp-sindh
challenge
championship
contact
countdown
daily-challenge
dashboard
demo
drill
entrance-tests
essay
exam-compass
founder
founding
free-practice-test
garage-admin
garage-login
garageschool
home
homework
ibcc
iep
index
insights
khda-demo
kids
languages
leaderboard
learn
login
mite
mite-books
mite-faculty
mite-papers
mite-portal
mite-prep
mite-progress
mite-register
mite-study
mite-vision
mocks
monitor
music
music-for-all
nano
nano-learn
nano-teach
news
nixor
nixordemo
our-results
parent
partner
past-papers
phonics
phonics-uae
pricing
privacy
progress
reading
reading-for-all
referral
responsible-ai
sat
school
sindh-board
sindh-dashboard
skills
special-needs
spelling-bee
spelling-uae
starky-saturdays
start
student-dashboard
study
study-plan
subscribe
summer
summer-uae
terms
textbooks
try
upload-papers
voice-lab
zayd-mode












































































































































































































## Session Snapshot (auto-updated)
<!-- This section is auto-updated by .claude/update-claude-md.sh Stop hook -->
<!-- Last sync: 2026-04-16 00:56 -->

**Platform counts**: 95 pages, 99 utils, 101 API routes, 22 components, 27 cron jobs

**All pages**: 404,500,_app,arts,arts-for-all,become-newton,books,bootcamp,bootcamp-sindh,by-school,challenge,championship,contact,countdown,daily-challenge,dashboard,demo,drill,entrance-tests,essay,exam-compass,founder,founding,free-practice-test,garage-admin,garage-login,garageschool,home,homework,ibcc,iep,index,insights,khda-demo,kids,landing-v2,languages,leaderboard,learn,login,mite,mite-books,mite-faculty,mite-papers,mite-portal,mite-prep,mite-progress,mite-register,mite-study,mite-vision,mocks,monitor,music,music-for-all,nano,nano-learn,nano-teach,news,nixor,nixordemo,our-results,parent,partner,past-papers,phonics,phonics-uae,pricing,privacy,progress,reading,reading-for-all,referral,responsible-ai,sat,school,sindh-board,sindh-dashboard,skills,special-needs,spelling-bee,spelling-uae,starky-saturdays,start,student-dashboard,study,study-plan,subscribe,summer,summer-uae,terms,textbooks,try,upload-papers,voice-lab,zayd-mode

**All utils**: academicExcellence,americanCurriculumKB,analytics,anthropicClient,apiAuth,arabicSupportKB,architectureEnhancements,artsKnowledge,autoImprover,betterVoice,cambridgeDialectKB,cambridgeExaminer,cambridgePainPointsKB,cbseKnowledge,chineseContent,commandWordEngine,contentProtection,curriculumBooks,dailyQuestionEmail,db,deliberatePracticeLayer,emailTemplates,errorAlert,examCompassEngine,examinerReportsKB,extendedResponseKB,getKnowledgeForTopic,globalKnowledgeBase,gradePredictionEngine,hearingEngineKB,homeworkPracticeKB,ibKnowledge,iconicSingersKB,journeyTracker,kbWishlist,literatureArabicKB,markSchemeKB,masteryEngine,motherTongue,newtonKB,notify,outcomeTrackingKB,pakistanSchoolsKB,patternEngine,phonicsKB,physicsAtomsOLevel,platformLearningEngine,practiceKB,productGate,questionBank,rateLimit,readingKnowledge,realtimeLearning,responsibleAIPolicy,saturdayFreeLogic,schoolProfileMap,senGuard,senKnowledge,senProgressionKB,seoArticles,sessionAnalysis,share,signalCollector,sindhBoardSyllabus,singingGoalsKB,singingKB,spacedRepEngine,starkyAtomsKB,starkyIntents,starkyPrompt,studentProfile,studyPlanEngine,subjectAliases,subjectCatalog,summerKnowledge,supabase,syllabusStructure,systemPrompts,translateCache,uaeAcademicExcellence,uaeMandatorySubjects,uaeMoEKnowledge,uaePhonicsKB,uaeReadingKB,uaeSchoolsKB,uaeSpellingKB,uaeSummerKnowledge,universalMicPrompt,useSessionLimit,useSessionMemory,useSpacedRep,useStreaks,useVoice,voiceEvaluationKB,voiceOnboardingKB,voiceProfileKB,weaknessDetector,welcomeEmails,youngLearnerKB

**Last 10 commits**:
```
422cb79 Migrate all Haiku 3 references to Haiku 4.5 (Stage A)
ea11f10 Phase 3: school-based onboarding at /by-school
156d3f5 Phase 2b: Edexcel ingestion pipeline + UAE British routing
28d6643 Autonomous session summary — writes memory/session_summary_<date>.md
c721cca Honest verification — verified_by column replaces unreliable boolean
8c7d12b School research KBs + fix canonical Islamiat spelling
ca87427 Add studentProfile.js — single source of truth for student identity
1155be3 Unified /api/ask endpoint — free-text search → verified bank questions
e4c1874 Comprehensive session-end system — unified script + git-tracked hooks
2abeb81 Add estate-level continuity — session handover + cross-repo backup
```

**Files changed in last commit**:
```
lib/constants.js
package-lock.json
package.json
pages/api/anthropic.js
pages/api/ask.js
pages/api/challenge-answer.js
pages/api/create-test-table.js
pages/api/cron/cambridge-4k.js
pages/api/cron/cambridge-test.js
pages/api/cron/daily-question.js
pages/api/cron/evolution-report.js
pages/api/cron/publish-news.js
pages/api/cron/question-bank-grow.js
pages/api/cron/self-heal.js
pages/api/cron/weekly-plans.js
pages/api/daily-report.js
pages/api/drill.js
pages/api/essay.js
pages/api/mocks/generate.js
pages/api/mocks/submit.js
```

**Uncommitted changes**: .claude/SESSION.md
CLAUDE.md
pages/arts-for-all.jsx
pages/arts.jsx
pages/demo.jsx
pages/homework.jsx
pages/languages.jsx
pages/music-for-all.jsx
pages/music.jsx
pages/past-papers.jsx
pages/phonics.jsx
pages/reading-for-all.jsx
pages/reading.jsx
pages/special-needs.jsx
pages/summer.jsx
pages/textbooks.jsx
**Untracked files**: .env.vercel
.playwright-mcp/console-2026-04-14T06-37-53-678Z.log
.playwright-mcp/console-2026-04-14T07-31-10-191Z.log
.playwright-mcp/console-2026-04-14T07-43-56-376Z.log
.playwright-mcp/console-2026-04-14T08-34-52-758Z.log
.playwright-mcp/console-2026-04-14T09-48-08-532Z.log
.playwright-mcp/console-2026-04-14T09-54-40-877Z.log
.playwright-mcp/console-2026-04-14T10-24-01-045Z.log
.playwright-mcp/console-2026-04-14T10-44-12-104Z.log
.playwright-mcp/console-2026-04-14T10-45-46-533Z.log
.playwright-mcp/console-2026-04-14T10-54-00-153Z.log
.playwright-mcp/console-2026-04-14T10-54-58-345Z.log
.playwright-mcp/console-2026-04-15T05-38-25-710Z.log
.playwright-mcp/console-2026-04-15T05-41-48-792Z.log
.playwright-mcp/console-2026-04-15T06-55-55-879Z.log
.playwright-mcp/console-2026-04-15T06-57-31-923Z.log
.playwright-mcp/console-2026-04-15T10-56-43-570Z.log
.playwright-mcp/console-2026-04-15T11-04-59-199Z.log
.playwright-mcp/console-2026-04-15T11-05-52-155Z.log
.playwright-mcp/console-2026-04-15T11-06-41-396Z.log

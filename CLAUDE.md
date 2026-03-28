# NewWorld Education Platform

## What This Is

**NewWorld Education** (`newworld.education`) is an AI-powered tutoring platform for students in Pakistan, covering KG through A-Levels. The AI tutor is called **Starky** — a persona built on Claude (Anthropic API) that adapts to each student's grade, subject, language, and learning needs. The platform supports 12+ regional languages, special educational needs (SEN), and Cambridge/Matric exam systems.

## Tech Stack

- **Framework**: Next.js 15 (Pages Router, JSX — not App Router)
- **Language**: JavaScript/JSX for pages + a few TypeScript files in `src/`
- **AI**: Anthropic Claude API (`@anthropic-ai/sdk`) — streaming responses
- **Auth**: NextAuth.js with Google OAuth
- **Database**: Vercel KV (Upstash Redis) via `@vercel/kv` — primary data store
- **Secondary DB**: Supabase (server-side only, `SUPABASE_SECRET_KEY`) — used for session logs, signals, insights
- **Email**: Resend + Nodemailer for parent reports and daily questions
- **Styling**: Inline styles + global CSS in `_app.jsx` (dark/light/cream themes, dyslexia-friendly mode, AAC large-button mode)
- **Fonts**: Sora (Google Fonts)
- **UI Icons**: Lucide React
- **Deployment**: Vercel (with cron jobs defined in `vercel.json`)

## Environment Variables Required

- `ANTHROPIC_API_KEY` — Claude API
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — Google OAuth
- `NEXTAUTH_SECRET` — NextAuth session signing
- `SUPABASE_URL`, `SUPABASE_SECRET_KEY` — Supabase
- `KV_REST_API_URL`, `KV_REST_API_TOKEN` — Vercel KV (Upstash Redis)
- `RESEND_API_KEY` — Email sending
- `DASHBOARD_PASSWORD` — Admin dashboard auth
- `CRON_SECRET` — Vercel cron job auth

## Project Structure

```
pages/               # Next.js pages (all JSX)
pages/api/           # API routes
pages/api/auth/      # NextAuth [...nextauth].js
pages/api/cron/      # Vercel cron jobs (15+ scheduled tasks)
pages/api/championship/  # Championship system endpoints
pages/api/paypal/    # PayPal webhook
components/          # Shared components (Nav, StarkyBubble, VoiceChatBar, ErrorBoundary)
utils/               # Business logic, DB, prompts, hooks
src/components/      # Additional components (AIChat.tsx, Header, Footer, ArticleCard)
src/data/            # Static data (articles, exam guidance)
src/i18n/            # Translations
public/              # Static assets (favicon.svg, og-image.png, robots.txt, sitemap.xml)
```

## Pages

### Student-Facing
| Path | File | Description |
|------|------|-------------|
| `/` | `index.jsx` | Homepage — grade selector (KG to A-Level), subject picker, registration flow. Saves user to `nw_user` in localStorage |
| `/start` | `start.jsx` | Post-login landing — shows plan details, redirects based on subscription |
| `/login` | `login.jsx` | Google OAuth sign-in via NextAuth |
| `/drill` | `drill.jsx` | Cambridge past paper drill — timed questions, hints, camera upload, spaced repetition, streaks. Covers 30+ subjects with topic-level breakdown |
| `/essay` | `essay.jsx` | AI essay marking — Cambridge band descriptors, O/A Level |
| `/homework` | `homework.jsx` | Homework help for younger students (KG-Grade 6) with subject picker and craft activities |
| `/countdown` | `countdown.jsx` | Cambridge June 2026 exam countdown timer — shows days remaining per subject |
| `/past-papers` | `past-papers.jsx` | Past papers hub — curated links, AI study companion, PDF upload, study plan generator |
| `/textbooks` | `textbooks.jsx` | Textbook chapter browser with AI concept tutor |
| `/demo` | `demo.jsx` | Demo chat interface for trying Starky |
| `/leaderboard` | `leaderboard.jsx` | Weekly study leaderboard |
| `/ibcc` | `ibcc.jsx` | IBCC equivalence calculator (O Level/A Level grades to Pakistani percentage) |
| `/insights` | `insights.jsx` | Public national learning insights — anonymised aggregate data |

### Special Needs
| Path | File | Description |
|------|------|-------------|
| `/special-needs` | `special-needs.jsx` | Condition x Age matrix — 12 conditions x 4 stages x 5 focuses = 240 teaching profiles (autism, ADHD, dyslexia, dyscalculia, dyspraxia/DCD, dysgraphia, sensory processing, Down syndrome, CP, visual/hearing impairment, unsure/undiagnosed) |
| `/arts-for-all` | `arts-for-all.jsx` | Adaptive AI art studio for SEN children |
| `/music-for-all` | `music-for-all.jsx` | Music therapy for SEN |
| `/reading-for-all` | `reading-for-all.jsx` | Reading support for SEN |

### Creative/Enrichment
| Path | File | Description |
|------|------|-------------|
| `/arts` | `arts.jsx` | Arts program |
| `/music` | `music.jsx` | Music program |
| `/reading` | `reading.jsx` | Reading program |
| `/phonics` | `phonics.jsx` | Systematic phonics — 5 phases, learn to read from zero |
| `/student-dashboard` | `student-dashboard.jsx` | Student progress dashboard — streaks, subject health, weakness tracking, exam countdown, predictions |
| `/study-plan` | `study-plan.jsx` | Personalised weekly study plan based on exam date + weaknesses + predictions |

### Parent & Admin
| Path | File | Description |
|------|------|-------------|
| `/parent` | `parent.jsx` | Parent portal — multi-child profiles, progress tracking. No child email needed (localStorage-based) |
| `/dashboard` | `dashboard.jsx` | Admin dashboard — password-protected, shows all students, stats |
| `/admin/championship` | `admin/championship.jsx` | Championship admin panel |
| `/admin/referrals` | `admin/referrals.jsx` | Referral admin panel |

### Monetisation & Growth
| Path | File | Description |
|------|------|-------------|
| `/pricing` | `pricing.jsx` | Pricing page — Starter ($29.99/mo), Scholar ($39.99/mo), Family ($49.99/mo). PayPal subscriptions. PKR prices shown for Pakistan users |
| `/subscribe` | `subscribe.jsx` | Daily question email subscription signup |
| `/referral` | `referral.jsx` | Referral program — tiered rewards (Star/Champion/Ambassador/Legend) |
| `/championship` | `championship.jsx` | NewWorld Championship — competitive study seasons |
| `/championship/terms` | `championship/terms.jsx` | Championship terms & conditions |
| `/championship/trust` | `championship/trust.jsx` | Championship trust & safety |
| `/championship/parents` | `championship/parents.jsx` | Championship info for parents |

### B2B
| Path | File | Description |
|------|------|-------------|
| `/school` | `school.jsx` | School sales page — Starter School ($199/mo), Cambridge School ($499/mo), Enterprise (custom) |

### Legal & Misc
| Path | File | Description |
|------|------|-------------|
| `/privacy` | `privacy.jsx` | Privacy policy |
| `/terms` | `terms.jsx` | Terms of service |
| `/share/[id]` | `share/[id].jsx` | Shareable session links |
| `/join/[code]` | `join/[code].jsx` | Referral join link |
| `/claim/[token]` | `claim/[token].jsx` | Prize claim page |

## API Routes

### Core
- `POST /api/anthropic` — Main Starky chat endpoint. Streaming responses, rate limiting (10 msg/min/user), CORS protection, prompt caching, content protection (excluded authors, abuse/jailbreak detection → session end + Supabase logging), topic knowledge injection, academic excellence triggers, book knowledge, reading list recommendations
- `POST /api/chat` — Alternative chat endpoint (TypeScript). Used by /reading, /special-needs, /arts, /music pages. Server-side content protection (excluded authors, abuse detection)
- `POST /api/drill` — Drill question generation and marking
- `POST /api/essay` — Essay marking with band descriptors

### User & Data
- `POST /api/subscribe` — Daily question email signup
- `POST /api/dashboard-auth` — Dashboard password login
- `GET /api/dashboard-data` — Fetch student data for admin
- `POST /api/session-complete` — Log completed sessions, email parent report
- `POST /api/student-memory` — Save/load student weak topics and mistakes
- `POST /api/parent-data` — Fetch child progress for parent portal
- `POST /api/leaderboard` — Submit/fetch weekly scores
- `POST /api/track` — Analytics event tracking

### Championship
- `/api/championship/join` — Join championship, fetch status
- `/api/championship/claim-prize` — Prize claiming
- `/api/championship/behaviour` — Behaviour analysis
- `/api/championship/dispute` — Dispute resolution

### Referral
- `/api/referral` — Register, profile, track referrals

### Payments
- `POST /api/paypal/webhook` — PayPal subscription webhook

### Cron Jobs (vercel.json)
| Path | Schedule | Purpose |
|------|----------|---------|
| `/api/cron/daily-question` | 5x daily | Send daily study questions to subscribers |
| `/api/cron/health-check` | Daily midnight | System health check |
| `/api/cron/weekly-plans` | Monday 3am | Generate weekly study plans |
| `/api/cron/missed-sessions` | Daily noon | Notify about missed sessions |
| `/api/cron/exam-countdown` | Daily 4am | Exam countdown reminders |
| `/api/cron/referral-daily` | Daily 8pm | Process referral rewards |
| `/api/cron/referral-weekly` | Monday 4am | Weekly referral summary |
| `/api/cron/championship-master` | Daily 7pm | Championship scoring |
| `/api/cron/championship-emails` | Daily 4am | Championship notifications |
| `/api/cron/championship-weekly` | Monday 4am | Weekly championship digest |
| `/api/cron/championship-intelligence` | Monday 5am | Championship analytics |
| `/api/cron/behaviour-analysis` | Daily 9pm | Student behaviour analysis |
| `/api/cron/signal-analysis` | Daily 9pm | Learning signal processing |
| `/api/cron/auto-improve` | Saturday 10pm | Auto-improvement system |
| `/api/cron/evolution-report` | Monday 5am | Platform evolution report |
| `/api/cron/national-insights` | Daily 1am | Aggregate national learning data |

## Key Components

- **StarkyBubble** (`components/StarkyBubble.jsx`) — Floating chat widget on every page. Uses session memory, session limits, signal collection. Markdown rendering, image upload support
- **VoiceChatBar** (`components/VoiceChatBar.jsx`) — Speech-to-text input (Web Speech API). Supports English and Urdu
- **Nav** (`components/Nav.jsx`) — Shared navigation bar (hidden on landing, special-needs, login, start pages)
- **ErrorBoundary** (`components/ErrorBoundary.jsx`) — Global error boundary

## Key Utilities

- **`utils/db.js`** — All Vercel KV operations: subscribers, questions, streaks, student memory
- **`utils/supabase.js`** — Supabase client (server-side only)
- **`utils/starkyPrompt.js`** — Starky's complete prompt engineering: PERSONA_LOCK (identity + content protection + teaching philosophy), grade-level builders (Kid/Middle/OLevel/ALevel), SEN condition-specific notes, intent routing, escalation logic, response shaping by age group, academic excellence injection per subject, SEN detection for parent messages
- **`utils/starkyIntents.js`** — Intent detection system for routing Starky responses
- **`utils/senKnowledge.js`** — SEN knowledge base (11 conditions): autism, ADHD, dyslexia, dyscalculia, dyspraxia, dysgraphia, sensory processing, Down syndrome, CP, VI, HI. Five Pillars framework, executive function, Pakistan-specific SEN context, parent messaging. Evidence-based: DSM-5-TR, Orton-Gillingham, TEACCH, Barkley, Kilpatrick. Also exports `detectSENContext()` for message-level clinical keyword detection
- **`utils/academicExcellence.js`** — Academic Excellence Knowledge Base (three-tier): Tier 1 TEACHING_PHILOSOPHY (4 pillars, always in PERSONA_LOCK), Tier 2 SUBJECT_EXCELLENCE (per-subject depth for English/Maths/Sciences/History/PakStudies/Economics/Islamiat/Urdu/CS, grade-gated), Tier 3 SITUATIONAL (bored student/why need this/university prep/exam depth triggers). Also reading lists per subject
- **`utils/readingKnowledge.js`** — Reading knowledge base: grade-gated book knowledge (Dahl complete, Blyton complete, Shakespeare complete 37 plays + 154 sonnets, classic novels, Oxford/Cambridge reading lists by subject, Islamic/South Asian literature — Iqbal, Faiz, Ghalib, Rumi, Manto, Hamid, Shamsie). Also `getBookKnowledge()` for main chat author/book hints
- **`utils/contentProtection.js`** — Platform-wide content protection (non-negotiable): Islamic respect absolute, excluded authors (immediate session end), abuse/jailbreak detection → session termination + Supabase flagging, cultural respect, Ramadan/Eid awareness. CONTENT_PROTECTION prompt constant injected into every system prompt across all pages
- **`utils/artsKnowledge.js`** — Arts knowledge base: age-gated, content-safe, SEN-adapted. Drawing, painting, printmaking, art history, Chinese brush/ink
- **`utils/getKnowledgeForTopic.js`** — Topic-specific knowledge retrieval from globalKnowledgeBase (misconceptions, examiner tips, keywords, mistakes)
- **`utils/globalKnowledgeBase.js`** — Cambridge O/A Level topic-level knowledge base (Biology, Chemistry, Physics, History, Economics, etc.)
- **`utils/weaknessDetector.js`** — Cambridge Weakness Detection: silently analyses conversations for mark-losing patterns after every Starky response. 60+ weakness categories across 12 subjects. Saves to Supabase cambridge_weaknesses table with frequency tracking and resolution detection
- **`utils/cambridgeExaminer.js`** — Cambridge Examiner Intelligence: 3 marking systems (point/levels/best-fit), complete command word taxonomy, subject-specific examiner tips for 12 subjects. Injected into O/A Level prompts
- **`utils/phonicsKB.js`** — Phonics knowledge base: 5 phases (Letters and Sounds), 44 phonemes, blending protocols, Urdu/Pakistan bridging, SEN phonics adaptations
- **`utils/youngLearnerKB.js`** — Young Learner KB: Piaget/Vygotsky/Bruner, scaffolding, 12 teaching techniques, Pakistan SNC curriculum Grades 1-5
- **`lib/constants.js`** — PERMANENT: STARKY_MODEL = claude-3-haiku-20240307. Never change without Khurram's approval
- **`lib/academic-calendar.js`** — Cambridge Academic Year Lifecycle: 6 phases (Final Sprint, Exam Series, Results Waiting, Results Day, Foundation, Build Up), 3 years of dates (2026-2028), auto-phase detection, phase-specific Starky prompt injection
- **`utils/useSessionLimit.js`** — 10 free sessions for all users (PERMANENT). No time limit. Paid = 999/day. Partner schools via free_access_until date
- **`utils/useSessionMemory.js`** — Tracks weak topics and mistakes per student across sessions
- **`utils/useSpacedRep.js`** — Spaced repetition hook for drill questions
- **`utils/useStreaks.js`** — Study streak tracking
- **`utils/useVoice.js`** — Voice interaction utilities
- **`utils/emailTemplates.js`** — HTML email templates for parent reports, daily questions
- **`utils/signalCollector.js`** — Collects learning signals (sentiment, drop-off, mood)
- **`utils/patternEngine.js`** — Pattern analysis for learning data
- **`utils/autoImprover.js`** — Auto-improvement system for platform evolution
- **`utils/systemPrompts.js`** — System prompts for various AI features

## Design Patterns

- **User identity**: Stored in `localStorage` as `nw_user` (name, email, grade, subject, senFlag, senType). Bridged with Google OAuth via `AuthBridge` in `_app.jsx`. SEN flag propagated from parent portal (`nw_active_child.senCondition`) through `demo.jsx` bridge and from `/special-needs` page after first chat
- **Theme system**: Dark (default), Light, Cream (dyslexia-optimized). CSS variables in `_app.jsx`
- **Accessibility**: Dyslexic font mode (`data-font="dyslexic"`), AAC large button mode (`data-access="aac"`)
- **Session limits**: 10 free sessions total (PERMANENT), no time limit, no credit card. Paid = 999/day. Partner schools via free_access_until date
- **Deaf student mode**: When `isDeafStudent` or `is_deaf_student` = true: no audio, no mic button, 20px font, PSL sign dictionary links after new vocabulary. Auto-set when parent selects hearing impairment condition
- **Academic phases**: 6 phases auto-detected from Cambridge calendar. Starky prompt and dashboard adapt automatically. Current phase injected into every O/A Level session
- **Weakness detection**: Background Haiku call after every Starky response silently detects Cambridge mark-losing patterns. 60+ categories across 12 subjects. Stored in cambridge_weaknesses table with frequency + resolution tracking
- **Predictive engine**: Nightly cron analyses cross-student weakness co-occurrences. Predicts risks before they happen
- **Streaming**: AI responses stream via SSE from `/api/anthropic`
- **Offline handling**: `OfflineBanner` component detects connectivity loss
- **Pakistan timezone**: All date logic uses UTC+5 (PKT)
- **SEN pipeline**: Parent portal sets `senCondition` per child → `demo.jsx` bridges to `nw_user.senFlag`/`senType` → `starkyPrompt.js` injects full SEN knowledge base + condition-specific teaching protocol → `session-complete` logs `isSEN`/`senType` to Supabase. Message-level detection via `detectSENContext()` activates for parents mentioning clinical terms; regular students get redirect to `/special-needs`
- **Content protection**: `CONTENT_PROTECTION` constant from `contentProtection.js` injected into PERSONA_LOCK (main chat), reading.jsx, reading-for-all.jsx. Server-side pre-checks in `/api/anthropic` and `/api/chat` catch excluded authors + abuse before AI processes the message. Violations logged to Supabase `content_violations` table
- **Knowledge architecture**: Three-tier academic excellence (philosophy always present, subject depth on-demand, situational triggers). Reading knowledge grade-gated. SEN knowledge condition-specific. Topic knowledge from globalKnowledgeBase via keyword matching. All injected into system prompt at appropriate layers

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

## Deployment

- Hosted on **Vercel**
- Domain: `newworld.education` / `www.newworld.education`
- Cron jobs configured in `vercel.json`
- Security headers set in both `next.config.ts` and `vercel.json`
- PayPal webhooks point to `/api/paypal/webhook`

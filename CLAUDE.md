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
| `/special-needs` | `special-needs.jsx` | Condition x Age matrix — 7 conditions x 4 stages x 5 focuses = 140 teaching profiles (autism, ADHD, dyslexia, Down syndrome, CP, visual/hearing impairment) |
| `/arts-for-all` | `arts-for-all.jsx` | Adaptive AI art studio for SEN children |
| `/music-for-all` | `music-for-all.jsx` | Music therapy for SEN |
| `/reading-for-all` | `reading-for-all.jsx` | Reading support for SEN |

### Creative/Enrichment
| Path | File | Description |
|------|------|-------------|
| `/arts` | `arts.jsx` | Arts program |
| `/music` | `music.jsx` | Music program |
| `/reading` | `reading.jsx` | Reading program |

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
- `POST /api/anthropic` — Main Starky chat endpoint. Streaming responses, rate limiting (10 msg/min/user), CORS protection, prompt caching
- `POST /api/chat` — Alternative chat endpoint (TypeScript)
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
- **`utils/starkyPrompt.js`** — Starky's complete prompt engineering: persona lock, context injection, intent routing, escalation logic, response shaping by age group
- **`utils/starkyIntents.js`** — Intent detection system for routing Starky responses
- **`utils/senKnowledge.js`** — Special educational needs knowledge base
- **`utils/useSessionLimit.js`** — Client-side session limit enforcement (25/day for paid, 3/day free trial)
- **`utils/useSessionMemory.js`** — Tracks weak topics and mistakes per student across sessions
- **`utils/useSpacedRep.js`** — Spaced repetition hook for drill questions
- **`utils/useStreaks.js`** — Study streak tracking
- **`utils/useVoice.js`** — Voice interaction utilities
- **`utils/emailTemplates.js`** — HTML email templates for parent reports, daily questions
- **`utils/signalCollector.js`** — Collects learning signals (sentiment, drop-off, mood)
- **`utils/patternEngine.js`** — Pattern analysis for learning data
- **`utils/autoImprover.js`** — Auto-improvement system for platform evolution
- **`utils/globalKnowledgeBase.js`** — Global knowledge base for Starky
- **`utils/systemPrompts.js`** — System prompts for various AI features

## Design Patterns

- **User identity**: Stored in `localStorage` as `nw_user` (name, email, grade, subject). Bridged with Google OAuth via `AuthBridge` in `_app.jsx`
- **Theme system**: Dark (default), Light, Cream (dyslexia-optimized). CSS variables in `_app.jsx`
- **Accessibility**: Dyslexic font mode (`data-font="dyslexic"`), AAC large button mode (`data-access="aac"`)
- **Session limits**: Free users get 3 sessions/day, paid get 25. Enforced client-side via `useSessionLimit`
- **Streaming**: AI responses stream via SSE from `/api/anthropic`
- **Offline handling**: `OfflineBanner` component detects connectivity loss
- **Pakistan timezone**: All date logic uses UTC+5 (PKT)

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

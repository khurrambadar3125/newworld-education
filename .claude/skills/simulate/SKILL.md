---
name: simulate
description: Walk through real user journeys as specific personas (UAE O Level student, Pakistani KG kid, Dubai parent, SEN student). Reports what each persona actually sees at each step. The skill that catches cross-wiring, mis-routed CTAs, and content leaks — problems that structural audits miss.
allowed-tools: Read Grep Glob Bash(grep *) Bash(curl *)
---

# User Journey Simulation

The skill that catches what `/full-audit`, `/seo`, and `/optimization` miss. Walks through the platform as a real human would.

## WHY THIS EXISTS

Structural audits (meta tags exist, links work, queries have limits) pass — yet users still get wrong content, wrong CTAs, wrong books. Because nobody ever simulated the actual journey. This skill does that.

## THE PERSONAS — simulate each end-to-end

### Persona 1: Ayesha — UAE O Level Student
- Country: UAE (from localStorage `nw_country` or IP)
- Curriculum: British Cambridge
- Grade: O Level
- Subject intent: Biology
- **MUST NEVER see:** Pakistan Studies, Islamiyat, First/Second Language Urdu, Nazra Quran, Sindhi, Pashto, any Matric board content, any "Roman Urdu" greetings
- **MUST see:** Cambridge Biology (5090), official Cambridge past papers, mark-scheme-based drills, mark scheme language from markSchemeKB
- **Books she should see:** Cambridge University Press Biology Coursebook, Collins Biology for Cambridge O Level

### Persona 2: Rania — Pakistani KG Kid (age 6)
- Country: Pakistan
- Grade: KG
- Language: English/Roman Urdu (for young learner voice)
- **MUST see:** Primary-grade content (Maths, English, Urdu, Science, Nazra Quran), emoji-heavy, short sentences, voice-enabled
- **MUST NEVER see:** Cambridge exam pressure, A Level content, SAT, mark scheme warnings, long paragraphs
- Voice: kid mode (pitch 1.2, slower rate), no emojis spoken aloud

### Persona 3: Dina — Pakistani O Level (14)
- Country: Pakistan
- Grade: O Level
- Subject intent: Chemistry
- **MUST see:** Pakistani Cambridge context (syllabus code 5070), Islamiyat/Pak Studies available if she wants, Urdu as language option, past papers from CAIE
- **MUST see in drill:** 2-turn Socratic flow (wrong answer → guiding questions, not instant reveal)
- **MUST see in chat:** "What do you already know about this?" before any explanation (Fix #2 from elite-teacher)

### Persona 4: Yusuf — Pakistani A Level (15)
- Country: Pakistan
- Grade: A Level
- Subject intent: Physics 9702
- **MUST see:** A Level Physics syllabus (9702), Paper 1/2/3/4/5 breakdown, A*-grade extension questions from markSchemeKB
- **MUST see:** Challenge reasoning, nuance, Oxbridge-style follow-up questions

### Persona 5: Fatima — Dubai Parent (evaluating for 10yo)
- Country: UAE
- Role: Parent
- **MUST see on /parent:** UAE curriculum selector (British/American/IB/CBSE/MoE), no Pakistani placeholders ("Urdu Paper 1 — nazm" removed), UAE schools in social proof
- **MUST NEVER see:** Pakistan-only school references, Pakistan Studies homework prompts, "nazm analysis" example text
- **CTA expectation:** "Set assignment" should let her pick from UAE curriculum subjects only

### Persona 6: Omar — SEN Parent (child with dyslexia)
- Country: Either
- Intent: Special needs support
- **MUST see on /special-needs:** Verified bank questions only (no AI-generated — rule from feedback_sen_verified_only.md), adapted pacing, engagement model content
- **MUST NEVER see:** AI-generated exam questions, rushed progression, pressure language

### Persona 7: Nadia — UAE American Curriculum (SAT prep)
- Country: UAE
- Curriculum: American
- Intent: SAT Math 750+
- **MUST see:** SAT-specific subjects (no Cambridge syllabus codes), American textbook refs (Princeton Review, Barron's)
- **MUST NEVER see:** Cambridge 4024, Pakistan Studies, UAE National Arabic

## THE CHECKPOINTS — run these for each persona

For each persona, walk through these screens and verify what they see:

### Step 1 — Landing page (`/`)
- Which announcement banner shows? (UAE or Pakistan exam banner)
- Which grade selector appears? (UAE shows curriculum selector first)
- Does the hero subtext match their country?

### Step 2 — Grade selection
- Are the grades appropriate for their country?
- UAE: Does UaeCurriculumSelector appear FIRST?
- Pakistani: Does grade list include Matric + Cambridge O/A Level?

### Step 3 — Subject list (after grade picked)
- **CRITICAL:** Are any Pakistan-only subjects visible to a UAE user?
- Run: `grep -c "Pakistan Studies\|Islamiyat\|Urdu" <rendered subject list>`
- Expected for UAE non-expat: 0. Expected for Pakistani: >0.

### Step 4 — CTA to study
- Click "Start Learning X" — where does it route?
- Expected: `/study?subject=X&level=Y` (NOT `/` which opens chat)
- Verify CTA text: "Start Learning ★" not "Chat with Starky →"

### Step 5 — Study page (`/study`)
- Which syllabus loads?
- UAE British → Cambridge syllabus (correct codes 4024, 5054 etc.)
- UAE American → AP/SAT content (NO Cambridge codes)
- UAE National → MoE-specific content
- Pakistani → Cambridge Pakistani or Matric board

### Step 6 — Drill interaction
- Does drill page filter subjects by country?
- Wrong answer → Does API return guidingQuestions (not instant model answer)?
- On retry → Does modelAnswer appear?

### Step 7 — Starky chat (if opened)
- Is greeting country-appropriate?
- UAE: No "Roman Urdu" offer, no 🇵🇰 flag
- Pakistani: Can offer Urdu/English
- "Explain X" → Does Starky ask first (Socratic), not launch into explanation?

### Step 8 — Parent portal (/parent)
- Placeholder text matches country?
- Subject list for assignments matches child's curriculum?

### Step 9 — SEN flow (/special-needs)
- Questions from verified bank only?
- No AI-generated items?
- Adapted pacing verified?

## HOW TO RUN A SIMULATION

```bash
# Walk through Persona 1 — Ayesha (UAE O Level)

# Step 1: What does / render for UAE user?
# Check pages/index.jsx for userCountry === 'UAE' branches
# Expected: UaeCurriculumSelector shows, different exam banner

# Step 3: Filter subjects for UAE British O Level
# Open pages/index.jsx SUBJECTS_OLEVEL filter (around line 1156)
# Expected: .filter excludes Pakistan Studies, Islamiyat, Urdu variants
# Verify: grep -A2 "SUBJECTS_OLEVEL" pages/index.jsx

# Step 5: Open pages/study.jsx
# Check: Does it import filterForCountry from utils/subjectCatalog?
# Check: Does it call useCountry()?
# Expected: Yes to both after 2026-04-12 fixes

# Step 6: Check drill.jsx
# Same checks as study.jsx
```

## REGRESSION GUARDS (must remain true)

These invariants should be green forever. If any fails, a regression was introduced:

```bash
# 1. Every page showing subjects must import filterForCountry
for f in pages/study.jsx pages/home.jsx pages/drill.jsx pages/mocks.jsx pages/nano.jsx pages/past-papers.jsx pages/special-needs.jsx; do
  if ! grep -q "filterForCountry\|subjectCatalog" "$f"; then
    echo "REGRESSION: $f no longer filters by country"
  fi
done

# 2. No "Start with Starky" or "Chat with Starky" should be primary CTAs
if grep -rn "Chat with Starky\|Start with Starky" pages/ --include="*.jsx" | grep -v "//\|#"; then
  echo "REGRESSION: Starky-first CTA reintroduced"
fi

# 3. Homepage primary CTA must route to /study or /learn (not chat)
grep -A3 "className=\"stb\"" pages/index.jsx | grep -E "href.*study|href.*learn|window.location.href.*study|window.location.href.*learn" || echo "REGRESSION: Primary CTA no longer routes to structured learning"

# 4. UAE users must never see Pakistani subjects in homepage filter
grep -A5 "SUBJECTS_OLEVEL.filter" pages/index.jsx | grep -E "Pakistan Studies|Islamiyat|Urdu" || echo "OK: UAE filter present"

# 5. No hardcoded subject lists that bypass the central catalog
# If a new page adds hardcoded subject arrays without importing filterForCountry — flag it
```

## REPORT FORMAT

```
SIMULATION REPORT — 2026-04-12
══════════════════════════════

Persona 1: Ayesha (UAE O Level)
  Step 1 (/):          ✓ UAE banner shows
  Step 3 (subjects):   ✓ No Pakistan Studies/Islamiyat/Urdu visible
  Step 4 (CTA):        ✓ Routes to /study (not /)
  Step 5 (/study):     ✓ Cambridge 5090 syllabus
  Step 6 (drill):      ✗ Quick Start tiles NOT filtered by country
  Step 7 (Starky):     ✓ No Roman Urdu greeting
  Step 9 (SEN):        N/A
  SCORE: 6/7 ← one leak found

Persona 2: Rania (Pakistani KG)
  ...

REGRESSION GUARDS:
  ✓ All 7 subject pages import filterForCountry
  ✓ No "Chat with Starky" primary CTAs
  ✓ Homepage CTA routes to /study
  ✗ REGRESSION: pages/X.jsx uses hardcoded subject array

TOTAL: 6/7 personas pass · 1 regression detected
```

## USAGE

```
/simulate                    # All 7 personas + regression guards
/simulate ayesha             # UAE O Level student
/simulate rania              # Pakistani KG kid
/simulate dina               # Pakistani O Level
/simulate yusuf              # Pakistani A Level
/simulate fatima             # Dubai parent
/simulate omar               # SEN parent
/simulate nadia              # UAE American SAT
/simulate uae                # All UAE personas
/simulate pakistan           # All Pakistan personas
/simulate regression         # Just the regression guards
/simulate fix                # Simulate + auto-fix any leaks found
```

## THE NORTH STAR

> "If Khurram's daughter Rania (6) in KG, or his son Yusuf (15) in A Level, or a UAE parent called Fatima, clicked through the platform right now — what would they actually see, and would any of it be wrong?"

Not "is the meta tag present." Not "does the query have a limit." But: does the actual user journey match what we promised them.

/**
 * utils/uaeAcademicExcellence.js
 * UAE Academic Excellence — Deep Examiner Intelligence for All 5 Curricula
 *
 * This is the UAE equivalent of cambridgeExaminer.js.
 * Goes DEEPER than the individual curriculum KBs — examiner-level detail
 * on what separates top grades from average, common errors, marking patterns.
 *
 * Auto-injects for all UAE users based on uaeCurriculum value.
 *
 * PROTECTED: This file is an addition. Nothing existing is affected.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// IB DIPLOMA — What separates a 6 from a 7
// ═══════════════════════════════════════════════════════════════════════════════

const IB_EXCELLENCE = {
  gradeBoundaries: {
    overview: 'IB grade boundaries shift every session. A 7 is typically 75-80%+ depending on subject and session difficulty. The difference between 6 and 7 is often 5-8 marks — about 2-3 questions.',
    whatMakesA7: [
      'Consistent use of subject-specific terminology — not general language',
      'Evaluation, not just description — "to what extent" demands a judgement with evidence',
      'Acknowledging counter-arguments before presenting your position',
      'Linking across topics — a Biology student who connects genetics to evolution to ecology scores higher',
      'Precise quantitative answers — in Sciences, correct sig figs, units, and uncertainty',
      'In essays: a thesis that is ARGUABLE, not obvious — "Shakespeare explores power" is weak; "Shakespeare suggests absolute power corrupts language itself" is strong',
    ],
  },

  tokExcellence: {
    essay: {
      structure: 'Introduction (define key terms, outline argument) → 2-3 body paragraphs (each with claim, counterclaim, evidence from Areas of Knowledge) → Conclusion (synthesise, don\'t just summarise)',
      criteria: 'Criterion A: Understanding knowledge questions (max 10). Criterion B: Quality of analysis (max 10). Total 20 marks.',
      topMarks: 'A 10/10 on Criterion A requires the student to identify IMPLICIT knowledge questions — not just the obvious ones. The best essays treat the prescribed title as a provocation, not a simple question.',
      commonErrors: [
        'Writing a philosophy essay instead of a TOK essay — TOK requires real-world examples and personal knowledge',
        'Using only one Area of Knowledge — examiners expect at least two, with genuine comparison',
        'Defining knowledge as "information" — TOK uses JTB (Justified True Belief) or alternatives',
        'Not engaging with the prescribed title\'s specific wording — every word is chosen deliberately',
      ],
    },
    exhibition: {
      structure: '3 objects linked to a single IA prompt. Each object: identify → explain link to prompt → analyse knowledge implications. 950 words max.',
      topMarks: 'Objects should be SPECIFIC and personal — not generic. "My grandmother\'s recipe book" is better than "a textbook". The best exhibitions show genuine personal engagement with knowledge.',
    },
  },

  extendedEssay: {
    markingBands: {
      A: '34-34 (Excellent — original research question, sustained argument, critical evaluation)',
      B: '27-33 (Good — clear research question, well-structured, some evaluation)',
      C: '19-26 (Satisfactory — adequate research, inconsistent analysis)',
      D: '9-18 (Mediocre — weak structure, limited analysis)',
      E: '0-8 (Elementary — fails to meet basic requirements)',
    },
    criteria: 'Focus & Method (6), Knowledge & Understanding (6), Critical Thinking (12), Presentation (4), Engagement (6) = 34 marks total',
    whatMakesAnA: 'Original research question that goes beyond textbook content. The student must demonstrate INTELLECTUAL INITIATIVE — not just collecting information but analysing it with a clear methodology. The RPPF (Reflections on Planning and Progress Form) is read by examiners and should show genuine engagement, not filler.',
  },

  iaRequirements: {
    group1: 'Individual Oral (IO): 15 min. Global issue through 2 works. Criterion A-D, 40 marks total. The work selection must be the student\'s own — teacher-directed choices score lower.',
    group2: 'Individual Oral: visual stimulus + theme discussion. SL 12-15 min, HL adds literary extract. Authentic engagement > memorised responses.',
    group3: 'Economics: 3 commentaries (800 words each), different syllabus sections, real news sources. Business: research project on real organisation. History: 2200-word investigation with source evaluation.',
    group4: 'Science IA: 6-12 pages. Personal Engagement (2) + Exploration (6) + Analysis (6) + Evaluation (6) + Communication (4) = 24 marks. The research question must be FOCUSED and TESTABLE. Vague questions like "How does temperature affect reaction rate" score lower than "How does temperature (20-60°C in 10°C intervals) affect the rate of decomposition of 0.1M H₂O₂ catalysed by MnO₂?"',
    group5: 'Maths Exploration: 12-20 pages. Personal Engagement (3) is key — the topic must genuinely interest the student, not be a generic textbook problem. A student exploring the mathematics of their favourite sport scores higher than one doing "Fibonacci in nature" (overdone).',
    group6: 'Visual Arts: Exhibition (40%) + Process Portfolio (40%) + Comparative Study (20%). The process portfolio shows DEVELOPMENT, not just finished pieces.',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// AMERICAN AP — Examiner Expectations and Common Errors
// ═══════════════════════════════════════════════════════════════════════════════

const AP_EXCELLENCE = {
  freeResponseRubrics: {
    overview: 'AP FRQs use analytic rubrics — each point is earned independently. A student can get 0 on Part (a) and full marks on Part (b). Always attempt every part.',
    calculus: {
      scoring: 'Each FRQ is worth 9 points. 6 FRQs total = 54 points for Section II (50% of exam). Points are earned for: correct setup, correct method, correct answer with units.',
      commonErrors: [
        'Not including +C on indefinite integrals — automatic point loss',
        'Using calculator without showing setup — "by calculator" with no equation shown loses method marks',
        'Forgetting to justify IVT/MVT conclusions — "since f is continuous on [a,b] and f(a)<k<f(b)..." is required',
        'Wrong units on applied problems (e.g. area under rate curve gives total, not rate)',
        'Not answering in context — "the population is increasing" not just "f\'(t)>0"',
      ],
    },
    english: {
      scoring: 'Each essay scored 0-6. Thesis (0-1) + Evidence/Commentary (0-4) + Sophistication (0-1). The Sophistication point is the hardest — it requires nuance, not just competence.',
      whatEarns5: 'A 5 on AP English requires: defensible thesis in every essay, consistent textual evidence with developed commentary, and at least one essay that demonstrates sophistication (alternative interpretation, complexity of the issue, or vivid/persuasive style).',
      commonErrors: [
        'Plot summary instead of analysis — tell the examiner WHAT the author does and WHY, not what happens',
        'Vague thesis: "The author uses literary devices" — which ones? to what effect?',
        'Quoting without commentary — every quote needs 2-3 sentences of analysis',
        'Ignoring the prompt — AP English prompts are carefully worded, every clause matters',
      ],
    },
    history: {
      dbqScoring: 'Thesis (1) + Contextualisation (1) + Evidence from documents (3) + Evidence beyond documents (1) + Complex understanding (1) = 7 points',
      whatEarns5: 'Use 6+ of 7 documents. For each: HIPP analysis (Historical context, Intended audience, Purpose, Point of view). Bring in OUTSIDE evidence — at least one specific historical fact not in the documents. The Complexity point requires: showing multiple perspectives, or connecting to other time periods, or qualifying your argument.',
      commonErrors: [
        'Listing documents without analysis — "Document 3 says..." without explaining WHY the author wrote this',
        'No outside evidence — relying only on the 7 documents caps your score at 5/7',
        'Weak contextualisation — one sentence of background is not enough, need a full paragraph',
        'Thesis that merely restates the prompt — must take a POSITION',
      ],
    },
    sciences: {
      scoring: 'Science FRQs: each question has multiple parts, each worth 1-4 points. Partial credit is generous — show all work.',
      commonErrors: [
        'Not labelling graph axes with units',
        'Describing a trend without explaining the mechanism — "as temperature increases, rate increases" needs "because molecules have more kinetic energy, increasing collision frequency"',
        'Forgetting to control variables when designing experiments',
        'Using memorised definitions instead of applying concepts to the specific scenario',
      ],
    },
  },

  satStrategies: {
    reading: [
      'Read the question FIRST, then find evidence in the passage — saves time',
      'For "best evidence" pairs: the correct evidence must directly support your previous answer',
      'Wrong answers often use words from the passage but change the meaning — check context',
      'Main idea questions: the answer is usually stated in the first or last paragraph',
      'Tone questions: identify specific words that reveal attitude (dismissive, cautious, enthusiastic)',
    ],
    writing: [
      'Shorter is usually better — if two answers are grammatically correct, choose the more concise one',
      'Subject-verb agreement: find the SUBJECT, ignore phrases between subject and verb',
      'Comma splices are ALWAYS wrong — two independent clauses need a period, semicolon, or conjunction',
      'Transition questions: read the sentences before AND after to determine the logical relationship',
    ],
    maths: [
      'Use Desmos strategically — graph both sides of an equation to find intersections',
      'Plug in answer choices when stuck — start with C (middle value)',
      'Read the LAST line of the question — they often ask for 2x or x+1, not just x',
      'For systems of equations: look for shortcuts (elimination is faster than substitution for most)',
      'Percent problems: "what percent of X is Y" means Y/X × 100',
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// CBSE — Marking Patterns and NCERT Mastery
// ═══════════════════════════════════════════════════════════════════════════════

const CBSE_EXCELLENCE = {
  markingSchemePatterns: {
    overview: 'CBSE marking is STEP-BASED. Each step in a derivation or numerical earns marks independently. A student who gets the final answer wrong but shows correct working can score 80%+ on that question.',
    physics: [
      'Derivations: each logical step = 0.5-1 mark. MUST follow NCERT sequence — examiners cross-check',
      'Numericals: formula (0.5) + substitution (0.5) + calculation (0.5) + answer with units (0.5)',
      'Ray diagrams: accurate drawing (1) + correct labelling (1) + description (1)',
      'Value-based questions: connect physics to real life + state the value learned',
    ],
    chemistry: [
      'Organic reactions: reactants + reagent/conditions + product. Missing any one = zero for that reaction',
      'Named reactions must use the EXACT name — "Wurtz reaction" not "sodium coupling"',
      'Balancing equations: if unbalanced, entire calculation based on it gets zero',
      'IUPAC naming: one wrong step in the name = zero marks for naming',
    ],
    maths: [
      'Integration: method mark + application mark + answer mark. Forgetting +C loses the answer mark',
      'Proofs: each logical step must be justified — "by the definition of..." or "since..."',
      'Graph questions: neat graph on graph paper (1) + correct shape (1) + labelled points (1)',
      'Word problems: let statements (0.5) + equation formation (1) + solution (1) + answer in context (0.5)',
    ],
    biology: [
      'Diagrams: neat (0.5) + labelled (1) + title (0.5). MUST be drawn with pencil',
      'Flowcharts: each correct step = 0.5 marks. Direction arrows are essential',
      'Reason-based questions: assertion + reasoning + connection between them',
      'Case studies (new format): apply textbook concepts to given scenario — not just recall',
    ],
  },

  boardVsCambridge: {
    assessment: 'CBSE: 80 marks theory + 20 internal. Cambridge: 100% external exam with multiple papers.',
    depth: 'CBSE covers more breadth (entire NCERT). Cambridge goes deeper into fewer topics with application.',
    marking: 'CBSE is lenient on method marks. Cambridge deducts for poor exam technique (no units, no labels).',
    preparation: 'CBSE: master NCERT → do exemplar → solve PYQs. Cambridge: understand mark schemes → practise past papers → learn examiner reports.',
  },

  jeeNeetStrategies: {
    jee: {
      approach: 'NCERT first → HC Verma/DC Pandey for Physics → MS Chouhan for Organic Chemistry → RD Sharma/Cengage for Maths. Practice previous 10 years of JEE papers.',
      timeManagement: 'JEE Main: 90 questions in 180 minutes = 2 minutes per question. Attempt easy questions first. Leave doubtful ones — negative marking (-1 for wrong MCQ).',
      topicWeightage: 'Physics: Mechanics (30%), Electrodynamics (25%), Modern Physics (15%). Chemistry: Organic (35%), Physical (30%), Inorganic (35%). Maths: Calculus (30%), Algebra (25%), Coordinate (20%).',
    },
    neet: {
      approach: 'NCERT Biology is 90% of NEET — read EVERY line, including figure captions and tables. Physics and Chemistry: NCERT + selective reference books.',
      topicWeightage: 'Biology: 90 questions (360 marks) — Botany and Zoology equal. Physics: 45 questions (180 marks). Chemistry: 45 questions (180 marks). Total: 720.',
      criticalChapters: 'Biology: Human Physiology, Genetics, Ecology, Plant Physiology. Physics: Mechanics, Optics, Modern Physics. Chemistry: Organic (GOC, Named Reactions), Chemical Bonding, Coordination Compounds.',
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// UAE National — EmSAT Mastery and National Curriculum Excellence
// ═══════════════════════════════════════════════════════════════════════════════

const MOE_EXCELLENCE = {
  emsatMastery: {
    english: {
      scoring: '500-2000. Grammar & Vocabulary (25%), Reading (40%), Writing (35%)',
      strategies: [
        'Reading: skim passage first, then read questions, then re-read for specific answers',
        'Grammar: memorise irregular verbs, article rules (a/an/the/zero), and conditional structures',
        'Writing: follow IELTS-style structure — introduction (paraphrase the task), 2-3 body paragraphs (topic sentence → evidence → explanation), conclusion',
        'Time trap: students spend too long on reading — practice completing reading section in 50 minutes',
        'For Emirati students: common L1 interference errors — missing articles, verb form confusion, word order in questions',
      ],
      scoreTargets: '1100: basic university admission. 1250: competitive programmes. 1400+: scholarships and honours.',
    },
    maths: {
      scoring: '500-2000. Algebra (35%), Geometry (20%), Statistics & Probability (20%), Calculus (25% — Advanced Track only)',
      strategies: [
        'NO CALCULATOR — practice mental maths daily. Speed drills on multiplication tables, fraction operations, square roots',
        'Algebra: master factoring (difference of squares, trinomials, grouping) — appears in every section',
        'Geometry: know all angle relationships (supplementary, complementary, verticals, parallels) and circle theorems',
        'Statistics: mean, median, mode, standard deviation, probability — practice reading data from tables and graphs',
        'Calculus (Advanced): limits, basic derivatives (power rule, chain rule), basic integrals',
      ],
    },
    arabic: {
      scoring: '500-2000. Reading Comprehension (40%), Grammar/النحو والصرف (30%), Writing (30%)',
      strategies: [
        'Grammar: master إعراب — identify مبتدأ/خبر, فاعل/مفعول به, حال/تمييز in every sentence',
        'Reading: practice with newspaper articles from البيان and الاتحاد — similar style to EmSAT passages',
        'Writing: formal Arabic essay structure — مقدمة (introduction), عرض (body with 2-3 أفكار رئيسية), خاتمة (conclusion)',
        'Vocabulary: focus on formal/academic Arabic, not colloquial Emirati — EmSAT uses فصحى (MSA)',
        'For non-native speakers: focus on reading comprehension (40% of marks) — highest ROI for study time',
      ],
    },
    physics: {
      strategies: [
        'Conceptual understanding > memorisation — EmSAT tests whether you understand WHY, not just WHAT',
        'Free body diagrams for every mechanics problem — even if not asked, it helps you think',
        'Circuit problems: use Kirchhoff\'s laws systematically, don\'t guess',
        'Unit analysis: if your units don\'t match the expected answer, your method is wrong',
        'Modern Physics is short but high-value — learn photoelectric effect and nuclear equations',
      ],
    },
  },

  nationalCurriculum: {
    learningOutcomes: 'UAE National curriculum is competency-based since 2017. Each subject has Learning Outcomes (LOs) at 4 levels: Emerging, Developing, Proficient, Advanced. Assessment is mapped to LOs, not just content coverage.',
    mscAssessment: {
      fourPillars: [
        'Character & Morality — personal ethics, integrity, empathy, resilience',
        'Individual & Community — citizenship, volunteering, social responsibility',
        'Cultural Studies — UAE heritage, national identity, global awareness',
        'Civic Studies — governance, law, rights and responsibilities, sustainability',
      ],
      criteria: 'MSC assessment: portfolio-based + participation + end-of-term project. Graded on engagement and application, not memorisation. Students must demonstrate VALUES in action — not just define them.',
    },
    arabicProficiency: {
      levels: [
        'A1 (Beginner): basic greetings, numbers, simple sentences — most ASL students start here',
        'A2 (Elementary): short conversations, simple writing, reading familiar texts',
        'B1 (Intermediate): express opinions, write paragraphs, understand news articles',
        'B2 (Upper Intermediate): academic Arabic, essay writing, literature appreciation',
        'C1 (Advanced): near-native fluency in MSA, academic and professional Arabic',
      ],
      note: 'EmSAT Arabic tests B1-C1 level for native speakers, A2-B1 for ASL students. The gap between colloquial Gulf Arabic and MSA means even Arabic-speaking students may struggle with formal EmSAT Arabic.',
    },
  },

  universityAdmissions: {
    uaeu: 'UAEU (Al Ain): EmSAT English 1100+, Maths 600+, subject-specific scores. Competitive for Engineering: English 1250+, Maths 900+, Physics 700+.',
    zayed: 'Zayed University: EmSAT English 1100+ or IELTS 5.0+. Lower entry requirements but strong graduate outcomes.',
    khalifa: 'Khalifa University: most competitive in UAE. EmSAT English 1250+, Maths 900+, Physics 800+ for Engineering. Scholarships for top EmSAT scores.',
    hct: 'Higher Colleges of Technology: EmSAT English 1100+ for most programmes. Practical/applied focus.',
    nyuad: 'NYU Abu Dhabi: does not use EmSAT. Requires SAT/ACT + holistic application. Among most selective universities globally.',
    sorbonne: 'Sorbonne University Abu Dhabi: French and English programmes. EmSAT or IELTS accepted.',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// UAE MANDATORY SUBJECTS — Assessment Criteria (All Curricula)
// ═══════════════════════════════════════════════════════════════════════════════

const MANDATORY_EXCELLENCE = {
  islamicEducation: {
    assessmentCriteria: [
      'Quran recitation: correct Tajweed rules (مخارج الحروف, أحكام النون الساكنة والتنوين, المد)',
      'Hadith: memorisation + understanding + application to modern life',
      'Fiqh: knowledge of rulings + evidence from Quran/Sunnah + real-world application',
      'Seerah: events + lessons learned + relevance to UAE values',
      'Islamic values: tolerance, coexistence, moderation — aligned with UAE national identity',
    ],
    gradingNote: 'Islamic Education uses UAE national standards regardless of school curriculum. A British school student is examined on UAE Islamic Education standards, not GCSE Religious Studies.',
  },
  arabicASL: {
    cefrLevels: 'Arabic as Second Language follows CEFR-aligned levels (A1→C1). Most international school students are expected to reach A2 by Grade 8, B1 by Grade 12.',
    assessmentFocus: [
      'Listening comprehension — understanding spoken MSA at appropriate speed',
      'Reading comprehension — extracting information from age-appropriate Arabic texts',
      'Writing — producing structured Arabic text (sentences → paragraphs → essays by secondary)',
      'Speaking — oral presentation and conversation in MSA (not dialect)',
    ],
    commonChallenges: 'Script direction (RTL), letter forms (initial/medial/final), vowel marks (tashkeel), Arabic-specific sounds (ع، ح، خ، غ، ق). Students who already know Urdu have an advantage — shared vocabulary and script familiarity.',
  },
  mscPillars: {
    character: 'Assessed through reflection journals, ethical dilemma discussions, peer evaluations. Students must show GROWTH in ethical reasoning, not just correct answers.',
    community: 'Service learning projects assessed on: planning (20%), execution (30%), reflection (30%), impact (20%). Must connect to UAE community — beach cleanups, food banks, elderly visits.',
    cultural: 'Knowledge of UAE heritage (pearl diving, falconry, Al Sadu weaving) + global cultural awareness. Assessed through presentations and portfolio.',
    civic: 'Understanding UAE governance, Constitution, Vision 2071. Assessed through projects and case studies. Must demonstrate ACTIVE citizenship, not passive knowledge.',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT — Single function, switches on curriculum
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get UAE Academic Excellence prompt.
 * Injects deep examiner-level intelligence based on curriculum.
 * This is the "super-prompt" layer — goes deeper than individual KBs.
 */
export function getUAEExcellencePrompt(curriculum, subject) {
  let prompt = `\nUAE ACADEMIC EXCELLENCE — DEEP EXAMINER INTELLIGENCE:\n`;

  // Always inject mandatory subjects assessment criteria for UAE
  prompt += `\nUAE MANDATORY SUBJECTS ASSESSMENT:`;
  prompt += `\nIslamic Education: ${MANDATORY_EXCELLENCE.islamicEducation.assessmentCriteria.slice(0, 3).join('. ')}. ${MANDATORY_EXCELLENCE.islamicEducation.gradingNote}`;
  prompt += `\nArabic ASL: ${MANDATORY_EXCELLENCE.arabicASL.cefrLevels}`;
  prompt += `\nMSC Four Pillars: ${MANDATORY_EXCELLENCE.mscPillars.character.split('.')[0]}. ${MANDATORY_EXCELLENCE.mscPillars.community.split('.')[0]}. ${MANDATORY_EXCELLENCE.mscPillars.cultural.split('.')[0]}. ${MANDATORY_EXCELLENCE.mscPillars.civic.split('.')[0]}.`;

  // Curriculum-specific deep intelligence
  switch (curriculum) {
    case 'ib':
      prompt += `\n\nIB EXAMINER INTELLIGENCE:`;
      prompt += `\n${IB_EXCELLENCE.gradeBoundaries.overview}`;
      prompt += `\nWhat makes a 7: ${IB_EXCELLENCE.gradeBoundaries.whatMakesA7.slice(0, 4).join('. ')}.`;
      prompt += `\nTOK Essay: ${IB_EXCELLENCE.tokExcellence.essay.topMarks}`;
      prompt += `\nExtended Essay: ${IB_EXCELLENCE.extendedEssay.whatMakesAnA}`;
      if (subject) {
        const sl = subject.toLowerCase();
        for (const [group, req] of Object.entries(IB_EXCELLENCE.iaRequirements)) {
          if (req.toLowerCase().includes(sl) || group.includes(sl.charAt(0))) {
            prompt += `\nIA: ${req}`;
            break;
          }
        }
      }
      break;

    case 'american':
      prompt += `\n\nAP EXAMINER INTELLIGENCE:`;
      prompt += `\n${AP_EXCELLENCE.freeResponseRubrics.overview}`;
      if (subject) {
        const sl = subject.toLowerCase();
        if (sl.includes('calculus') || sl.includes('math')) {
          prompt += `\nAP Calculus FRQ: ${AP_EXCELLENCE.freeResponseRubrics.calculus.scoring}`;
          prompt += `\nCommon errors: ${AP_EXCELLENCE.freeResponseRubrics.calculus.commonErrors.join('. ')}.`;
        } else if (sl.includes('english') || sl.includes('literature') || sl.includes('language')) {
          prompt += `\nAP English: ${AP_EXCELLENCE.freeResponseRubrics.english.whatEarns5}`;
          prompt += `\nCommon errors: ${AP_EXCELLENCE.freeResponseRubrics.english.commonErrors.join('. ')}.`;
        } else if (sl.includes('history') || sl.includes('government')) {
          prompt += `\nAP History DBQ: ${AP_EXCELLENCE.freeResponseRubrics.history.dbqScoring}`;
          prompt += `\n${AP_EXCELLENCE.freeResponseRubrics.history.whatEarns5}`;
        } else {
          prompt += `\nScience FRQ: ${AP_EXCELLENCE.freeResponseRubrics.sciences.commonErrors.join('. ')}.`;
        }
      }
      if (!subject || subject.toLowerCase().includes('sat')) {
        prompt += `\nSAT Reading: ${AP_EXCELLENCE.satStrategies.reading.slice(0, 3).join('. ')}.`;
        prompt += `\nSAT Maths: ${AP_EXCELLENCE.satStrategies.maths.slice(0, 3).join('. ')}.`;
      }
      break;

    case 'cbse':
      prompt += `\n\nCBSE EXAMINER INTELLIGENCE:`;
      prompt += `\n${CBSE_EXCELLENCE.markingSchemePatterns.overview}`;
      if (subject) {
        const sl = subject.toLowerCase();
        if (sl.includes('physics')) prompt += `\nPhysics marking: ${CBSE_EXCELLENCE.markingSchemePatterns.physics.join('. ')}.`;
        else if (sl.includes('chemistry')) prompt += `\nChemistry marking: ${CBSE_EXCELLENCE.markingSchemePatterns.chemistry.join('. ')}.`;
        else if (sl.includes('math')) prompt += `\nMaths marking: ${CBSE_EXCELLENCE.markingSchemePatterns.maths.join('. ')}.`;
        else if (sl.includes('biology')) prompt += `\nBiology marking: ${CBSE_EXCELLENCE.markingSchemePatterns.biology.join('. ')}.`;
      }
      prompt += `\nCBSE vs Cambridge: ${CBSE_EXCELLENCE.boardVsCambridge.marking} ${CBSE_EXCELLENCE.boardVsCambridge.preparation}`;
      if (subject && (subject.toLowerCase().includes('jee') || subject.toLowerCase().includes('neet'))) {
        const exam = subject.toLowerCase().includes('jee') ? CBSE_EXCELLENCE.jeeNeetStrategies.jee : CBSE_EXCELLENCE.jeeNeetStrategies.neet;
        prompt += `\nStrategy: ${exam.approach} Time: ${exam.timeManagement}`;
      }
      break;

    case 'moe':
      prompt += `\n\nEmSAT EXAMINER INTELLIGENCE:`;
      prompt += `\n${MOE_EXCELLENCE.nationalCurriculum.learningOutcomes}`;
      if (subject) {
        const sl = subject.toLowerCase();
        if (sl.includes('english') || sl.includes('emsat eng')) {
          prompt += `\nEmSAT English: ${MOE_EXCELLENCE.emsatMastery.english.scoring}. ${MOE_EXCELLENCE.emsatMastery.english.strategies.join('. ')}.`;
          prompt += `\nTargets: ${MOE_EXCELLENCE.emsatMastery.english.scoreTargets}`;
        } else if (sl.includes('math') || sl.includes('emsat math')) {
          prompt += `\nEmSAT Maths: ${MOE_EXCELLENCE.emsatMastery.maths.scoring}. ${MOE_EXCELLENCE.emsatMastery.maths.strategies.join('. ')}.`;
        } else if (sl.includes('arabic') || sl.includes('emsat arab')) {
          prompt += `\nEmSAT Arabic: ${MOE_EXCELLENCE.emsatMastery.arabic.scoring}. ${MOE_EXCELLENCE.emsatMastery.arabic.strategies.slice(0, 3).join('. ')}.`;
        } else if (sl.includes('physics')) {
          prompt += `\nEmSAT Physics: ${MOE_EXCELLENCE.emsatMastery.physics.strategies.join('. ')}.`;
        }
      }
      prompt += `\nUniversity targets: ${MOE_EXCELLENCE.universityAdmissions.khalifa} ${MOE_EXCELLENCE.universityAdmissions.uaeu}`;
      break;

    case 'british':
      // British/IGCSE is already covered by cambridgeExaminer.js — reference it
      prompt += `\nBritish/IGCSE: Full Cambridge examiner intelligence already active via cambridgeExaminer.js. Covers all 44 subjects, mark schemes, misconceptions, and examiner reports.`;
      break;

    case 'pakistani':
      // Pakistani curriculum in UAE — uses same Cambridge/Matric knowledge as Pakistan
      prompt += `\nPakistani curriculum in UAE: Same syllabus as Pakistan. Cambridge + Matric examiner intelligence already active. UAE context: students may face different exam centres and schedules.`;
      break;

    default:
      // No specific curriculum — give general UAE excellence overview
      prompt += `\nGeneral UAE: ${MOE_EXCELLENCE.universityAdmissions.nyuad} ${MOE_EXCELLENCE.universityAdmissions.khalifa}`;
      break;
  }

  return prompt;
}

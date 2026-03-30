// utils/cambridgePainPointsKB.js
// Cambridge Pain Points KB — every real pain point O/A Level students face
// Enhancement: new knowledge base, no existing files modified

const CAMBRIDGE_PAIN_POINTS = {

  // ═══════════════════════════════════════════════════════════════
  // SECTION 1 — THE 12 REAL PAIN POINTS
  // Source: Cambridge examiner reports + competitor research
  // ═══════════════════════════════════════════════════════════════

  PAIN_01_BLANKED_IN_EXAM: {
    id: 1,
    label: 'Studied but blanked in exam',
    studentSays: "I studied the chapter but blanked in the exam",
    rootCause: 'Recognition vs recall. Reading creates recognition. Exams demand recall. These are different cognitive processes — reading notes feels like learning but does not build retrieval pathways.',
    starkyResponse: "Don't read it again. Tell me what you remember — right now, without looking. That's how your brain learns to recall under pressure.",
    technique: 'retrieval_practice',
    triggerPhrases: ['blanked', 'forgot everything', 'studied but', 'knew it but', 'mind went blank', 'couldnt remember in exam'],
  },

  PAIN_02_MARKS_BELOW_EXPECTATION: {
    id: 2,
    label: 'Marks below expectation',
    studentSays: "My marks are nowhere near what I expected",
    rootCause: 'Not understanding mark scheme language. "Describe" ≠ "Explain" ≠ "Evaluate" — each Cambridge command word demands a specific cognitive operation and answer structure.',
    starkyResponse: "Before we answer this — what is this question actually asking for? Let me teach you the difference between Describe, Explain, and Evaluate. This alone can lift your grade.",
    technique: 'command_word_mastery',
    triggerPhrases: ['marks dropped', 'expected more', 'should have got', 'marks are low', 'not what i expected', 'disappointing result'],
  },

  PAIN_03_RAN_OUT_OF_TIME: {
    id: 3,
    label: 'Ran out of time',
    studentSays: "I ran out of time in the exam",
    rootCause: 'Spending too long on early questions, not knowing time allocation per mark. Students treat all questions equally instead of budgeting time by mark value.',
    starkyResponse: "Here's the rule: 1 mark ≈ 1 minute. A 4-mark question gets 4 minutes — no more. Let me time you on this question so you build that discipline.",
    technique: 'time_discipline',
    triggerPhrases: ['ran out of time', 'not enough time', 'couldnt finish', 'didnt complete', 'time pressure', 'too slow'],
  },

  PAIN_04_WRONG_SYLLABUS: {
    id: 4,
    label: 'Coaching centre taught wrong syllabus',
    studentSays: "The coaching centre taught the wrong syllabus",
    rootCause: 'Tutors in Pakistan often use BISE Matric knowledge for Cambridge preparation — different topics, different technique, different mark schemes. Students discover this too late.',
    starkyResponse: "Cambridge and Matric are completely different exams. The topics overlap but the technique is different. Let me show you exactly what Cambridge requires here — not what your tutor may have taught.",
    technique: 'syllabus_alignment',
    triggerPhrases: ['tutor said', 'my teacher said', 'coaching centre', 'academy taught', 'wrong syllabus', 'different from what i learnt'],
  },

  PAIN_05_CANT_WRITE_ANSWER: {
    id: 5,
    label: 'Knows topic but cant write the answer',
    studentSays: "I know the topic but can't write the answer",
    rootCause: 'Knowledge without exam technique. Understanding a concept and expressing it in mark-scheme language are separate skills. Students have the knowledge but not the output format.',
    starkyResponse: "You understand this — I can see that. The problem is how you write it for the examiner. Let me show you a model answer that scores full marks, then you rewrite it in your own words.",
    technique: 'model_answer_rewrite',
    triggerPhrases: ['know it but cant write', 'understand but', 'cant express', 'cant put into words', 'know the answer but', 'dont know how to write'],
  },

  PAIN_06_TOPIC_PREDICTION: {
    id: 6,
    label: 'Doesnt know what will come in exam',
    studentSays: "I don't know which topics will come in the exam",
    rootCause: 'Not understanding Cambridge topic frequency patterns. Cambridge rotates topics across sessions but some topics appear far more frequently than others.',
    starkyResponse: "Looking at 10 years of past papers for your subject, these topics appear most frequently. Let me show you the pattern so you can prioritise your revision intelligently.",
    technique: 'topic_frequency_analysis',
    triggerPhrases: ['what will come', 'which topics', 'important topics', 'predict the exam', 'what to study', 'most important chapters'],
  },

  PAIN_07_ENGLISH_BARRIER: {
    id: 7,
    label: 'Weak English losing marks in content subjects',
    studentSays: "My English is weak so I lose marks even when I know the science",
    rootCause: 'Cambridge is an English-medium examination. Students who understand content but write poorly in English lose marks for communication, structure, and technical vocabulary.',
    starkyResponse: "Your science is right — well done. Now let me show you the English to express it. We'll work on both at the same time: the concept AND the language to score the mark.",
    technique: 'simultaneous_language_content',
    triggerPhrases: ['english is weak', 'cant write in english', 'urdu medium', 'language problem', 'dont know the english word', 'hard to explain in english'],
  },

  PAIN_08_ESSAY_STRUCTURE: {
    id: 8,
    label: 'Doesnt know how to start essays',
    studentSays: "I don't know how to start an essay question",
    rootCause: 'No framework for extended writing under exam conditions. Students stare at blank pages because they lack a structural scaffold for longer responses.',
    starkyResponse: "Every essay follows the same skeleton: Point → Evidence → Explanation → Link. That's PEEL. Let me show you how to use it on this question — you'll never stare at a blank page again.",
    technique: 'peel_structure',
    triggerPhrases: ['how to start', 'essay question', 'long answer', 'dont know where to begin', 'blank page', 'extended response', 'how do i write'],
  },

  PAIN_09_PAST_PAPERS_DIDNT_HELP: {
    id: 9,
    label: 'Did past papers but exam was different',
    studentSays: "I did all the past papers but the questions in the exam were different",
    rootCause: 'Memorising past paper answers instead of understanding question types. Students learn specific answers rather than the underlying question pattern.',
    starkyResponse: "Past papers teach you the question TYPE, not the specific answer. Every Cambridge question is a variation of a type. Let me show you the type behind this question — then you can handle any variation.",
    technique: 'question_type_recognition',
    triggerPhrases: ['did past papers', 'questions were different', 'new type of question', 'never seen this before', 'past papers didnt help', 'different from past papers'],
  },

  PAIN_10_NO_TUTOR: {
    id: 10,
    label: 'Cant afford a tutor',
    studentSays: "My parents can't afford a tutor — I have no one to ask",
    rootCause: 'Educational inequality. The student studying alone at 11pm with no one to explain a concept. This is the core problem NewWorldEdu exists to solve.',
    starkyResponse: "That's exactly why I'm here. I'm your tutor — available whenever you need me, for as long as you need me. Let's work through this together right now.",
    technique: 'emotional_support_and_tutoring',
    triggerPhrases: ['cant afford', 'no tutor', 'no one to ask', 'studying alone', 'no help', 'parents cant', 'too expensive'],
  },

  PAIN_11_CALCULATION_MISTAKES: {
    id: 11,
    label: 'Understands concept but makes calculation errors',
    studentSays: "I get the concept but make stupid mistakes in calculations",
    rootCause: 'Cognitive load — the brain is processing the method AND tracking arithmetic simultaneously. When working memory is split, errors occur in the mechanical part.',
    starkyResponse: "They're not stupid mistakes — your brain is doing two things at once. Let's separate them: first master the method without numbers, then practice the calculations alone, then combine them.",
    technique: 'cognitive_load_separation',
    triggerPhrases: ['stupid mistake', 'silly error', 'careless mistake', 'calculation wrong', 'got the method but', 'keep making errors'],
  },

  PAIN_12_TOO_MANY_SUBJECTS: {
    id: 12,
    label: 'Too many subjects not enough time',
    studentSays: "I have too many subjects and not enough time",
    rootCause: 'O Level students managing 8+ subjects simultaneously, A Level students managing 3-4 subjects at deep conceptual level. Without a schedule, students oscillate between subjects without progress.',
    starkyResponse: "Tell me your exam timetable — every subject, every date. Let's build a Starky session schedule that gives each subject the right number of sessions before its exam.",
    technique: 'schedule_building',
    triggerPhrases: ['too many subjects', 'not enough time', 'so much to study', 'cant manage', 'overwhelmed', 'dont know what to study first'],
  },

  // ═══════════════════════════════════════════════════════════════
  // SECTION 2 — UAE-SPECIFIC PAIN POINTS
  // ═══════════════════════════════════════════════════════════════

  PAIN_13_EMSAT_OVERWHELM: {
    id: 13,
    label: 'EmSAT preparation overwhelm',
    studentSays: "EmSAT is in 3 months and I don't know where to start",
    rootCause: 'EmSAT is a high-stakes UAE standardised test required for university admission. Students often discover its importance late and have no structured preparation path.',
    starkyResponse: "3 months is enough if we're strategic. EmSAT tests specific skills — let me assess where you are right now, then we build a week-by-week plan targeting your weakest areas first.",
    technique: 'structured_emsat_prep',
    region: 'UAE',
    triggerPhrases: ['emsat', 'emsat english', 'emsat math', 'emsat preparation', 'emsat score', 'need emsat'],
  },

  PAIN_14_TOK_CONFUSION: {
    id: 14,
    label: 'IB Theory of Knowledge confusion',
    studentSays: "My school follows IB but I don't understand TOK",
    rootCause: 'Theory of Knowledge is fundamentally different from content subjects — it asks students to question HOW they know, not WHAT they know. Students trained in content-heavy curricula find this disorienting.',
    starkyResponse: "TOK isn't about right answers — it's about questioning knowledge itself. Let me start with a simple example: How do you KNOW that 2+2=4? Is that the same kind of knowing as knowing the sky is blue? That's TOK thinking.",
    technique: 'tok_scaffolding',
    region: 'UAE',
    triggerPhrases: ['tok', 'theory of knowledge', 'tok essay', 'tok presentation', 'dont understand tok', 'what is tok'],
  },

  PAIN_15_EMSAT_ENGLISH_UNIVERSITY: {
    id: 15,
    label: 'EmSAT English score for university admission',
    studentSays: "I need to improve my EmSAT English score to get into UAEU",
    rootCause: 'UAE universities require minimum EmSAT English scores (typically 1100-1250 for UAEU). Students with Arabic L1 often score below threshold in reading comprehension and academic writing.',
    starkyResponse: "UAEU needs 1100+ in EmSAT English. Let me test your reading and writing right now — those are the two areas where most students lose marks. We'll focus there first.",
    technique: 'emsat_english_targeting',
    region: 'UAE',
    triggerPhrases: ['uaeu', 'emsat english score', 'university admission', 'need 1100', 'english score low', 'get into university'],
  },

  // ═══════════════════════════════════════════════════════════════
  // SECTION 3 — SEN-SPECIFIC PAIN POINTS
  // ═══════════════════════════════════════════════════════════════

  PAIN_16_EXAM_HALL_PANIC: {
    id: 16,
    label: 'Exam hall anxiety in SEN students',
    studentSays: "My child is bright but the exam hall panics them",
    rootCause: 'Exam anxiety in SEN students (ADHD, autism, anxiety disorders) is not nervousness — it is a sensory and cognitive overwhelm that shuts down recall. The environment itself is hostile to their processing style.',
    starkyResponse: "Your child IS bright — the exam hall is the problem, not their brain. Let me teach them exam techniques designed for how they think: breaking questions into small steps, using anchor phrases to restart when panic hits, and building familiarity so the exam format itself becomes routine.",
    technique: 'sen_exam_anxiety_protocol',
    senRelevant: true,
    triggerPhrases: ['exam panic', 'exam anxiety', 'freezes in exam', 'cant do exams', 'bright but', 'panics in hall'],
  },

  PAIN_17_PACE_MISMATCH: {
    id: 17,
    label: 'School pace doesnt match SEN learning speed',
    studentSays: "Nobody at school explains things at his pace",
    rootCause: 'Classroom teaching moves at average pace. SEN students often need more time per concept, different explanation modalities, and repetition without shame. Schools lack resources for 1:1 pacing.',
    starkyResponse: "I move at YOUR pace — not the class pace. If you need me to explain this 5 different ways, I will. If you need 20 minutes on one question, we take 20 minutes. There's no rush here.",
    technique: 'adaptive_pacing',
    senRelevant: true,
    triggerPhrases: ['too fast', 'cant keep up', 'teacher goes too fast', 'need more time', 'at his pace', 'at her pace', 'doesnt explain'],
  },
};

// ═══════════════════════════════════════════════════════════════
// SECTION 4 — PAIN POINT DETECTION ENGINE
// ═══════════════════════════════════════════════════════════════

/**
 * Detects which pain point(s) a student message maps to.
 * Returns array of matched pain points sorted by relevance.
 */
function detectPainPoint(message) {
  if (!message || typeof message !== 'string') return [];

  const normalised = message.toLowerCase().replace(/['']/g, '').replace(/[^\w\s]/g, '');
  const matches = [];

  for (const [key, pain] of Object.entries(CAMBRIDGE_PAIN_POINTS)) {
    for (const phrase of pain.triggerPhrases) {
      if (normalised.includes(phrase)) {
        matches.push({
          painId: pain.id,
          key,
          label: pain.label,
          matchedPhrase: phrase,
          technique: pain.technique,
          response: pain.starkyResponse,
          rootCause: pain.rootCause,
          region: pain.region || 'ALL',
          senRelevant: pain.senRelevant || false,
        });
        break; // one match per pain point is enough
      }
    }
  }

  // Sort: exact/longer phrase matches first (more specific = more relevant)
  matches.sort((a, b) => b.matchedPhrase.length - a.matchedPhrase.length);

  return matches;
}

/**
 * Returns the Starky response for a specific pain point by ID.
 */
function getPainPointResponse(painId) {
  for (const pain of Object.values(CAMBRIDGE_PAIN_POINTS)) {
    if (pain.id === painId) {
      return {
        response: pain.starkyResponse,
        rootCause: pain.rootCause,
        technique: pain.technique,
        label: pain.label,
      };
    }
  }
  return null;
}

module.exports = { CAMBRIDGE_PAIN_POINTS, detectPainPoint, getPainPointResponse };

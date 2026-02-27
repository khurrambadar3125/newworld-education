/**
 * Exam Guidance Data
 *
 * Structured exam tips, mark scheme patterns, question types, and
 * examiner expectations for O/L and A/L environmental science exams.
 * This data is injected into the AI tutor's system prompt so it can
 * coach students on exam technique based on past paper analysis.
 */

export interface ExamLevel {
  level: string;
  subjects: ExamSubject[];
}

export interface ExamSubject {
  name: string;
  papers: PaperInfo[];
  questionTypes: QuestionType[];
  markSchemePatterns: string[];
  commonTopics: TopicFrequency[];
  examTips: string[];
  commonMistakes: string[];
}

export interface PaperInfo {
  paper: string;
  duration: string;
  totalMarks: number;
  structure: string;
}

export interface QuestionType {
  type: string;
  description: string;
  markAllocation: string;
  answerStrategy: string;
}

export interface TopicFrequency {
  topic: string;
  frequency: string; // "every year", "most years", "occasional"
  typicalMarks: string;
}

export const examGuidance: ExamLevel[] = [
  {
    level: "O/L (Ordinary Level)",
    subjects: [
      {
        name: "Science (Environmental Science Focus)",
        papers: [
          {
            paper: "Paper 1 — Multiple Choice / Structured",
            duration: "2 hours",
            totalMarks: 100,
            structure:
              "Section A: 40 multiple choice questions (40 marks). Section B: 5-6 structured questions requiring short and extended answers (60 marks).",
          },
          {
            paper: "Paper 2 — Essay / Practical",
            duration: "2 hours",
            totalMarks: 100,
            structure:
              "Section A: Data analysis and practical-based questions (40 marks). Section B: 3 essay-style questions from a choice of 5 (60 marks).",
          },
        ],
        questionTypes: [
          {
            type: "Multiple Choice (MCQ)",
            description:
              "Four options (A-D). Tests recall and application of key concepts.",
            markAllocation: "1 mark each. No negative marking.",
            answerStrategy:
              "Read ALL options before answering. Eliminate obviously wrong answers first. If unsure, never leave blank — educated guesses are free marks. Watch for 'all of the above' and 'none of the above' traps. Underline key words in the stem like 'NOT', 'EXCEPT', 'ALWAYS'.",
          },
          {
            type: "Short Answer (1-3 marks)",
            description:
              "Define, state, name, or give a brief explanation. Tests recall of key facts and definitions.",
            markAllocation:
              "1 mark per valid point. Definitions typically 2 marks (one for concept, one for context).",
            answerStrategy:
              "Be precise and concise. One clear sentence per mark. Use scientific terminology. For 'define' questions, give the textbook definition. For 'state' questions, no explanation needed — just the fact.",
          },
          {
            type: "Structured Response (4-6 marks)",
            description:
              "Describe, explain, or compare. Requires linked points showing understanding, not just recall.",
            markAllocation:
              "Points-based marking. Each distinct valid point = 1 mark. Need to make more points than marks available (examiners look for best answers).",
            answerStrategy:
              "Use the marks as a guide: 4 marks = at least 4 distinct points. Start with the most obvious points. Use connective language ('this leads to', 'because', 'therefore'). For 'explain' questions, always give the reason WHY, not just WHAT. For 'compare' questions, use a clear structure: point about A, then corresponding point about B.",
          },
          {
            type: "Extended Response / Essay (8-15 marks)",
            description:
              "Discuss, evaluate, or analyse a topic in depth. Tests ability to construct an argument with evidence.",
            markAllocation:
              "Split between content (knowledge points) and quality of written communication (QWC) — spelling, grammar, use of scientific terms, logical structure.",
            answerStrategy:
              "Plan before writing (2 minutes). Use paragraphs with clear topic sentences. Include specific examples, data, and case studies. For 'discuss' questions, present BOTH sides before concluding. For 'evaluate' questions, weigh evidence and give a justified conclusion. Always use correct scientific vocabulary. End with a summary sentence that directly answers the question.",
          },
          {
            type: "Data Analysis / Graph Questions (4-8 marks)",
            description:
              "Interpret tables, graphs, or experimental data. Calculate values, identify trends, draw conclusions.",
            markAllocation:
              "Marks for: reading data correctly, describing trends, explaining patterns, calculating values, drawing conclusions.",
            answerStrategy:
              "Always quote specific data from the source (numbers, units). For trends, describe the overall pattern AND note any anomalies. For graphs: read axes labels and units first, describe the shape of the curve, quote specific values. Show all working in calculations. Use the correct number of significant figures.",
          },
        ],
        markSchemePatterns: [
          "Examiners award marks for DISTINCT points — repeating the same idea in different words does NOT earn extra marks",
          "Answers must be in CONTEXT of the question — generic textbook answers without applying to the specific scenario lose marks",
          "For calculation questions: correct answer with no working shown = full marks, but wrong answer with correct method shown = partial marks (method marks). ALWAYS SHOW WORKING",
          "'Describe' = say what happens (the pattern/trend). 'Explain' = say what happens AND why. 'Suggest' = use your knowledge to propose a reason (accept reasonable answers)",
          "Diagrams and labelled sketches can earn marks even when not explicitly asked for — but only if they add information not already in your written answer",
          "Units are often worth a separate mark in calculations — never forget them",
          "For 'compare' questions, you MUST refer to both things being compared for each point. Saying 'A is fast' without saying anything about B scores zero for that point",
          "Quality of Written Communication (QWC) marks require: correct spelling of scientific terms, proper grammar, and a logical sequence of ideas",
          "If a question says 'using the data', you MUST quote specific numbers from the data provided — vague references score zero",
          "For 'state and explain' questions (common 3-markers): 1 mark for the statement, 2 marks for the explanation. Don't just state — always explain",
        ],
        commonTopics: [
          {
            topic: "Ecosystems, food chains, and food webs",
            frequency: "every year",
            typicalMarks: "8-15 marks across paper",
          },
          {
            topic: "Photosynthesis and respiration",
            frequency: "every year",
            typicalMarks: "6-12 marks",
          },
          {
            topic: "Human impact on the environment (pollution, deforestation, climate change)",
            frequency: "every year",
            typicalMarks: "10-20 marks",
          },
          {
            topic: "Water cycle and carbon cycle",
            frequency: "most years",
            typicalMarks: "6-10 marks",
          },
          {
            topic: "Classification and biodiversity",
            frequency: "most years",
            typicalMarks: "5-10 marks",
          },
          {
            topic: "Adaptation and natural selection",
            frequency: "most years",
            typicalMarks: "6-10 marks",
          },
          {
            topic: "Renewable and non-renewable energy",
            frequency: "most years",
            typicalMarks: "5-8 marks",
          },
          {
            topic: "Earth's structure and plate tectonics",
            frequency: "most years",
            typicalMarks: "5-8 marks",
          },
          {
            topic: "Weather and climate (including climate zones)",
            frequency: "most years",
            typicalMarks: "5-10 marks",
          },
          {
            topic: "Conservation and sustainability",
            frequency: "every year",
            typicalMarks: "8-15 marks",
          },
        ],
        examTips: [
          "Read the ENTIRE question before writing anything — many students lose marks by answering what they THINK the question asks",
          "Allocate time by marks: roughly 1 minute per mark, plus reading time",
          "For MCQs, go through once answering the ones you're sure about, then return to difficult ones",
          "In structured questions, look at the number of lines provided — it hints at how much to write",
          "Use the marks allocated as a checklist: 4 marks = make at least 4 distinct points",
          "Always attempt EVERY question — even a partially correct answer earns marks",
          "In essay questions, briefly plan your answer (spider diagram or bullet points) before writing",
          "Underline command words: 'state', 'describe', 'explain', 'evaluate', 'compare' — each requires a different approach",
          "If you run out of time, write key points in bullet form rather than leaving questions blank",
          "Review your answers if time permits — check calculations, units, and that you've answered what was actually asked",
        ],
        commonMistakes: [
          "Confusing 'describe' with 'explain' — describe is WHAT happens, explain is WHY it happens",
          "Not using data from graphs/tables when the question specifically asks you to",
          "Writing too much for low-mark questions and too little for high-mark questions",
          "Forgetting units in calculations (cm, kg, °C, etc.)",
          "Using vague language ('it gets bigger') instead of precise scientific terms ('the population increases')",
          "In food chain questions: mixing up producer/consumer/decomposer roles",
          "Not reading all MCQ options before selecting — the first plausible answer isn't always correct",
          "Confusing weather (short-term) with climate (long-term patterns)",
          "In ecology: confusing habitat (where an organism lives) with niche (its role in the ecosystem)",
          "Not balancing arguments in 'discuss' questions — only presenting one side",
        ],
      },
      {
        name: "Geography (Environmental Focus)",
        papers: [
          {
            paper: "Paper 1 — Physical Geography",
            duration: "1 hour 30 minutes",
            totalMarks: 75,
            structure:
              "Section A: Short structured questions on maps and data (25 marks). Section B: Choose 2 from 4 extended questions on physical geography topics (50 marks).",
          },
          {
            paper: "Paper 2 — Human & Environmental Geography",
            duration: "1 hour 30 minutes",
            totalMarks: 75,
            structure:
              "Section A: Resource-based structured questions (25 marks). Section B: Choose 2 from 4 essay-style questions (50 marks).",
          },
        ],
        questionTypes: [
          {
            type: "Map and Data Skills",
            description:
              "Read and interpret OS maps, satellite images, climate graphs, population pyramids, and statistical data.",
            markAllocation:
              "Typically 1-4 marks per sub-question. Grid references, measurements, and descriptions.",
            answerStrategy:
              "For grid references: 3 figures across (easting) then 3 figures up (northing). Always include units for distances and heights. When describing map patterns, use compass directions and name specific features. For climate graphs, describe BOTH temperature and rainfall patterns.",
          },
          {
            type: "Case Study Questions (6-10 marks)",
            description:
              "Apply knowledge of a specific real-world example to demonstrate understanding.",
            markAllocation:
              "Marks for: naming the case study, locating it, describing specific details, explaining processes, evaluating outcomes.",
            answerStrategy:
              "NAME your case study immediately (e.g., 'The Amazon Rainforest in South America'). Include SPECIFIC facts: dates, statistics, names of places. Don't just describe — explain causes and effects. Examiners reward specificity over general knowledge.",
          },
          {
            type: "Extended Writing (8-15 marks)",
            description:
              "Discuss, assess, or evaluate geographical issues. Requires balanced arguments and a conclusion.",
            markAllocation:
              "Typically: Level 1 (basic, 1-4 marks), Level 2 (clear, 5-8 marks), Level 3 (detailed, 9-12 marks), Level 4 (thorough, 13-15 marks). QWC marks included.",
            answerStrategy:
              "Use the levels marking to your advantage: Level 3+ requires SPECIFIC examples and BALANCED discussion. Structure: Introduction (define key terms) → Point 1 with evidence → Point 2 with evidence → Counter-argument → Conclusion with justified opinion. Use geographical vocabulary throughout.",
          },
        ],
        markSchemePatterns: [
          "Case study answers without specific place names, dates, or statistics are capped at Level 2 (basic marks only)",
          "Levels-marked questions reward DEPTH over BREADTH — 3 well-developed points beat 6 superficial ones",
          "For 'to what extent' questions, the conclusion MUST weigh up both sides — one-sided answers cannot reach top marks",
          "Map skills questions often have definitive correct answers — practice grid references and scale calculations until automatic",
          "Annotated diagrams (e.g., water cycle, plate boundaries) can replace paragraphs of text and often score full marks more efficiently",
          "For climate graph questions: always describe BOTH temperature range AND rainfall distribution AND their seasonal pattern",
          "When asked to 'suggest reasons', examiners accept reasonable inferences — you don't need to know the exact answer, just apply geographical understanding logically",
        ],
        commonTopics: [
          {
            topic: "Weather and climate (including climate change)",
            frequency: "every year",
            typicalMarks: "15-25 marks across papers",
          },
          {
            topic: "Plate tectonics, earthquakes, and volcanoes",
            frequency: "every year",
            typicalMarks: "10-20 marks",
          },
          {
            topic: "Rivers, flooding, and water management",
            frequency: "most years",
            typicalMarks: "10-15 marks",
          },
          {
            topic: "Ecosystems and biomes (tropical rainforest, coral reefs)",
            frequency: "every year",
            typicalMarks: "10-20 marks",
          },
          {
            topic: "Population, urbanisation, and resource management",
            frequency: "every year",
            typicalMarks: "10-15 marks",
          },
          {
            topic: "Coasts and coastal management",
            frequency: "most years",
            typicalMarks: "8-15 marks",
          },
          {
            topic: "Energy resources (renewable vs non-renewable)",
            frequency: "most years",
            typicalMarks: "8-12 marks",
          },
          {
            topic: "Sustainability and environmental management",
            frequency: "every year",
            typicalMarks: "10-15 marks",
          },
        ],
        examTips: [
          "Learn at least ONE detailed case study for each major topic — specificity is what separates A grades from C grades",
          "Practice drawing and annotating diagrams — they save time and score marks efficiently",
          "For map questions, bring a ruler and know how to use the scale",
          "Always answer in the context of the question's geographical location — don't just dump generic knowledge",
          "For extended answers, start with your strongest point while your mind is fresh",
          "Time management: don't spend 20 minutes on a 4-mark question and rush a 15-mark essay",
          "Learn key geographical vocabulary (e.g., 'sustainability', 'mitigation', 'adaptation', 'urbanisation') — using it correctly impresses examiners",
        ],
        commonMistakes: [
          "Giving generic answers without case study details in questions that require them",
          "Confusing weather (day-to-day) with climate (30-year averages)",
          "Not labelling diagrams properly (unlabelled diagrams score zero)",
          "Mixing up latitude and longitude, or getting grid references backwards",
          "Writing one-sided arguments for 'discuss' or 'evaluate' questions",
          "Ignoring command words — writing an explanation when asked to 'describe'",
          "Not using the resources provided (maps, data, photos) when the question asks you to",
        ],
      },
    ],
  },
  {
    level: "A/L (Advanced Level)",
    subjects: [
      {
        name: "Environmental Science / Geography (Advanced)",
        papers: [
          {
            paper: "Paper 1 — Core Environmental Systems",
            duration: "2 hours 30 minutes",
            totalMarks: 100,
            structure:
              "Section A: Data response and structured questions (40 marks). Section B: Choose 2 from 4 essay questions (60 marks).",
          },
          {
            paper: "Paper 2 — Global Environmental Issues",
            duration: "2 hours 30 minutes",
            totalMarks: 100,
            structure:
              "Section A: Case study analysis with resource booklet (40 marks). Section B: Choose 2 from 4 synoptic essay questions (60 marks).",
          },
          {
            paper: "Paper 3 — Practical / Fieldwork / Internal Assessment",
            duration: "Varies",
            totalMarks: 60,
            structure:
              "Fieldwork investigation report or practical examination testing data collection, analysis, and evaluation skills.",
          },
        ],
        questionTypes: [
          {
            type: "Data Response (8-12 marks)",
            description:
              "Analyse data sets, research findings, or environmental reports. Requires critical evaluation of evidence.",
            markAllocation:
              "Marks for: accurate data reading, trend identification, data manipulation (calculations, percentages), critical analysis, and evaluation of reliability/limitations.",
            answerStrategy:
              "Quote specific data with units. Calculate percentage changes when relevant. Comment on data reliability (sample size, methodology, time period). Identify anomalies and suggest reasons. Link data patterns to geographical/environmental theory. Evaluate the source: Who collected it? When? What limitations might exist?",
          },
          {
            type: "Synoptic Essay (20-30 marks)",
            description:
              "Integrate knowledge from across the syllabus to construct a comprehensive, evaluative argument.",
            markAllocation:
              "Assessed holistically using levels: Level 4 (excellent) requires integration of multiple topic areas, specific case studies from different scales (local, national, global), critical evaluation, and a well-reasoned conclusion.",
            answerStrategy:
              "Spend 5 minutes planning. Structure: Introduction (define terms, outline approach) → 3-4 paragraphs each with a distinct argument supported by evidence from different topics → Evaluation of competing viewpoints → Conclusion that directly answers the question with justified reasoning. Use case studies at DIFFERENT SCALES (local + national + global). Show SYNOPTIC links between topics (e.g., climate change → biodiversity loss → economic impact → policy response).",
          },
          {
            type: "Case Study Analysis (10-15 marks)",
            description:
              "Apply detailed case study knowledge to analyse a specific environmental issue or management strategy.",
            markAllocation:
              "Marks for: specific factual knowledge (names, dates, statistics), analysis of causes and effects, evaluation of responses/management strategies, consideration of different stakeholder perspectives.",
            answerStrategy:
              "Start with context (where, when, scale). Present specific facts and figures. Analyse cause-and-effect chains. Evaluate management strategies: What worked? What didn't? Why? Consider multiple stakeholder perspectives (government, local communities, businesses, NGOs, indigenous peoples). End with a balanced assessment.",
          },
        ],
        markSchemePatterns: [
          "A/L mark schemes use LEVELS OF RESPONSE — it's about QUALITY of argument, not just number of points",
          "Level 4 (top band) REQUIRES: specific and accurate case studies, synoptic links between topics, critical evaluation (not just description), and a justified conclusion",
          "Examiners distinguish between 'description' (Level 1-2) and 'analysis/evaluation' (Level 3-4). At A/L, you must ANALYSE and EVALUATE, not just describe",
          "Using case studies from different scales (local/national/global) is explicitly rewarded in mark schemes",
          "Diagrams and models (e.g., systems diagrams, feedback loops) are valued at A/L — they demonstrate conceptual understanding",
          "The best answers show awareness of COMPLEXITY and UNCERTAINTY — e.g., 'while most evidence suggests X, some studies indicate Y, and the outcome depends on Z'",
          "For evaluation questions, presenting only positives OR only negatives is capped at Level 2 — balanced assessment is essential",
          "Fieldwork/practical questions reward methodology awareness: sampling methods, data reliability, ethical considerations, limitations of conclusions",
          "Using contemporary (recent) examples and data from the last 5-10 years is preferred over outdated case studies",
          "Correct use of technical terminology is a Level 4 requirement — vague or imprecise language caps your mark",
        ],
        commonTopics: [
          {
            topic: "Climate change: causes, evidence, impacts, mitigation, adaptation",
            frequency: "every year",
            typicalMarks: "20-40 marks across papers",
          },
          {
            topic: "Biodiversity and conservation (including ecosystem services)",
            frequency: "every year",
            typicalMarks: "15-30 marks",
          },
          {
            topic: "Energy: fossil fuels vs renewables, energy security, carbon neutrality",
            frequency: "every year",
            typicalMarks: "15-25 marks",
          },
          {
            topic: "Water resources, scarcity, management, and conflicts",
            frequency: "most years",
            typicalMarks: "10-20 marks",
          },
          {
            topic: "Ocean systems: currents, acidification, overfishing, marine pollution",
            frequency: "most years",
            typicalMarks: "10-20 marks",
          },
          {
            topic: "Atmospheric systems and weather patterns (ENSO, monsoons, jet streams)",
            frequency: "most years",
            typicalMarks: "10-15 marks",
          },
          {
            topic: "Sustainability: circular economy, sustainable development, SDGs",
            frequency: "every year",
            typicalMarks: "15-25 marks",
          },
          {
            topic: "Hazards: tectonic, meteorological, and their management",
            frequency: "most years",
            typicalMarks: "10-20 marks",
          },
          {
            topic: "Urbanisation, pollution, and environmental management",
            frequency: "most years",
            typicalMarks: "10-20 marks",
          },
          {
            topic: "Food production, agriculture, and food security",
            frequency: "most years",
            typicalMarks: "10-15 marks",
          },
        ],
        examTips: [
          "At A/L, ANALYSIS beats DESCRIPTION. Always explain WHY, not just WHAT",
          "Learn case studies at THREE scales: local, national, global — examiners explicitly reward this",
          "For synoptic essays, show connections BETWEEN topics — this is the key A/L skill",
          "Use systems thinking: inputs, processes, outputs, feedback loops. Draw systems diagrams where appropriate",
          "Include recent data and current events — a 2024 example is more impressive than a 1990s one",
          "Practice timed essays — you need to write a coherent 600-800 word essay in 40-45 minutes",
          "For evaluation: use the structure 'On one hand... On the other hand... On balance...'",
          "Learn to draw and annotate key diagrams from memory: carbon cycle, water cycle, atmospheric circulation, plate boundaries",
          "Read the resource booklet thoroughly in Paper 2 — the answers are often guided by the resources provided",
          "For fieldwork questions: know WHY each method is used, not just HOW to do it. Understand sampling strategies, error sources, and ethical considerations",
        ],
        commonMistakes: [
          "Writing descriptively instead of analytically — A/L requires 'because', 'this leads to', 'the significance of this is'",
          "Using only one case study when the question requires examples at different scales",
          "Failing to reach a conclusion in 'evaluate' or 'to what extent' questions",
          "Ignoring the resource booklet in Paper 2 — it's there to guide your answer",
          "Using outdated statistics — learn current data (within the last 5 years where possible)",
          "Not showing synoptic links — treating each topic as isolated rather than interconnected",
          "Writing everything you know about a topic rather than selecting relevant points that answer the specific question",
          "Neglecting to consider different stakeholder perspectives",
          "Poor time management — spending too long on Section A and rushing essays",
          "Not defining key terms at the start of essay answers",
        ],
      },
    ],
  },
];

/**
 * Generates a concise summary of exam guidance that can be included
 * in the AI tutor's system prompt context.
 */
export function getExamGuidanceSummary(): string {
  const sections: string[] = [];

  for (const level of examGuidance) {
    for (const subject of level.subjects) {
      sections.push(`\n### ${level.level} — ${subject.name}`);

      sections.push("\n**Paper Structure:**");
      for (const paper of subject.papers) {
        sections.push(
          `- ${paper.paper}: ${paper.duration}, ${paper.totalMarks} marks. ${paper.structure}`
        );
      }

      sections.push("\n**Key Mark Scheme Rules:**");
      for (const pattern of subject.markSchemePatterns.slice(0, 5)) {
        sections.push(`- ${pattern}`);
      }

      sections.push("\n**Highest-Frequency Topics (appear every year):**");
      for (const topic of subject.commonTopics.filter(
        (t) => t.frequency === "every year"
      )) {
        sections.push(`- ${topic.topic} (${topic.typicalMarks})`);
      }

      sections.push("\n**Top Exam Tips:**");
      for (const tip of subject.examTips.slice(0, 5)) {
        sections.push(`- ${tip}`);
      }

      sections.push("\n**Common Mistakes to Warn Students About:**");
      for (const mistake of subject.commonMistakes.slice(0, 5)) {
        sections.push(`- ${mistake}`);
      }
    }
  }

  return sections.join("\n");
}

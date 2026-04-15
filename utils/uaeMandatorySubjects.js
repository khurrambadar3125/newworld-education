/**
 * utils/uaeMandatorySubjects.js
 * UAE Mandatory Subjects Knowledge Base
 *
 * All private school students in the UAE must study these 4 subjects
 * regardless of their main curriculum (British, American, IB, CBSE, Pakistani).
 * Mandated by UAE national curriculum.
 *
 * PROTECTED: This file is an addition. Nothing existing is affected.
 */

export const UAE_MANDATORY_SUBJECTS = {
  islamicEducation: {
    name: 'Islamic Education (UAE National)',
    arabic: 'التربية الإسلامية',
    mandatoryFor: 'All Muslim students in UAE private schools',
    exemption: 'Non-Muslim students are exempt and take Moral Education instead',
    curriculum: 'UAE national curriculum — not Cambridge, not school curriculum',
    examBoard: 'UAE National standardised assessments',

    topicsByStage: {
      primary: [
        'Pillars of Islam — age-appropriate understanding',
        'Short Surahs — memorisation with meaning (Al-Fatiha, Al-Ikhlas, Al-Falaq, Al-Nas, Al-Kawthar)',
        'Basic Wudu and Salah steps',
        'Stories of Prophets — Adam, Nuh, Ibrahim, Musa, Isa, Muhammad (PBUH)',
        'Islamic manners (Adab) — greeting, eating, sleeping duas',
        'Respect for parents, teachers, community',
        'UAE National Day and Islamic occasions — Ramadan, Eid',
      ],
      middle: [
        'Quran recitation with Tajweed rules',
        'Hadith study — selected Ahadith with application',
        'Seerah — life of Prophet Muhammad (PBUH) in detail',
        'Five Pillars in depth — Shahada, Salah, Zakat, Sawm, Hajj',
        'Islamic ethics — honesty, trustworthiness, justice, mercy',
        'Fiqh basics — Wudu, Salah conditions, Ramadan rules',
        'Islamic history — Khulafa Rashideen, spread of Islam',
        'UAE values — tolerance, coexistence, Year of Tolerance legacy',
      ],
      secondary: [
        'Quran interpretation (Tafseer) — selected ayahs',
        'Hadith sciences — classification, chain of narration basics',
        'Islamic jurisprudence (Fiqh) — marriage, inheritance, transactions',
        'Comparative religion — Islam\'s position on tolerance and coexistence',
        'Islamic economics — prohibition of Riba, Zakat calculation',
        'Contemporary issues — bioethics, environment, social media from Islamic perspective',
        'UAE Constitution articles on religion and tolerance',
        'Islamic civilisation contributions — science, medicine, architecture',
      ],
    },

    teachingNotes: `Islamic Education in UAE follows the UAE national curriculum, NOT the school's main curriculum. A British curriculum student still takes UAE National Islamic Education. Exams are in Arabic for Arabic-medium streams and available in English for international streams. Starky must teach with complete scholarly respect. Reference Quran and Hadith accurately. Connect to UAE context — tolerance, coexistence, Year of Tolerance values. Never simplify to the point of inaccuracy.`,
  },

  arabicSecondLanguage: {
    name: 'Arabic as Second Language (ASL)',
    arabic: 'اللغة العربية لغير الناطقين بها',
    mandatoryFor: 'All non-Arab students in UAE private schools',
    note: 'Arab students take Arabic as First Language instead',
    curriculum: 'UAE national curriculum',
    examBoard: 'UAE National standardised assessments',

    topicsByStage: {
      primary: [
        'Arabic alphabet — letter recognition, formation, sounds',
        'Basic greetings — مرحبا، صباح الخير، كيف حالك',
        'Numbers 1-100 in Arabic',
        'Colours, days of the week, months',
        'Family members — أب، أم، أخ، أخت',
        'Classroom vocabulary — كتاب، قلم، مدرسة',
        'Simple sentences — أنا اسمي... أنا من...',
        'UAE-specific vocabulary — الإمارات، دبي، أبوظبي',
      ],
      middle: [
        'Reading short Arabic texts with comprehension',
        'Writing simple paragraphs in Arabic',
        'Grammar — masculine/feminine, singular/plural, basic verb conjugation',
        'Vocabulary expansion — shopping, travel, food, weather',
        'Conversational Arabic — at the market, at school, giving directions',
        'UAE cultural vocabulary — المهرجان، التراث، الصحراء',
        'Formal vs informal Arabic register',
        'Arabic typing and digital communication',
      ],
      secondary: [
        'Reading comprehension — newspaper articles, short stories',
        'Essay writing in Arabic — structured paragraphs',
        'Grammar depth — verb forms, noun patterns, adjective agreement',
        'Formal Arabic — letter writing, report writing',
        'Arabic literature introduction — selected modern poetry and prose',
        'Media Arabic — understanding news, advertisements',
        'UAE government and society vocabulary',
        'Preparation for Arabic proficiency examinations',
      ],
    },

    teachingNotes: `Arabic as Second Language (ASL) is different from Arabic as First Language. ASL assumes zero Arabic background. Many Pakistani, Indian, and Western students find Arabic challenging because the script is unfamiliar. Starky should: start with letter sounds and formation, use transliteration alongside Arabic script initially, build confidence through familiar contexts (ordering food, greeting neighbours), connect to Islamic vocabulary students may already know (Alhamdulillah, Inshallah, Bismillah). UAE-specific context is essential — use Dubai/Abu Dhabi examples, Emirati cultural references.`,
  },

  moralSocialCultural: {
    name: 'Moral, Social and Cultural Studies (MSC)',
    arabic: 'الدراسات الأخلاقية والاجتماعية والثقافية',
    mandatoryFor: 'All students in UAE private schools (Muslim and non-Muslim)',
    note: 'Replaced standalone Moral Education from 2023-24',
    curriculum: 'UAE national curriculum',
    examBoard: 'School-based assessment aligned to UAE national standards',

    topicsByStage: {
      primary: [
        'Character and morality — honesty, kindness, fairness, respect',
        'The individual and community — family, school, neighbourhood',
        'Cultural studies — UAE heritage, national identity, Emirati traditions',
        'Civic studies — rules, laws, why we have them, being a good citizen',
        'Tolerance and respect for diversity — different cultures in UAE',
        'Environmental responsibility — recycling, conservation, sustainability',
        'Digital citizenship basics — safe internet use',
        'UAE founding story — Sheikh Zayed, the Union, national symbols',
      ],
      middle: [
        'Ethics and moral reasoning — ethical dilemmas, decision-making frameworks',
        'UAE society — demographics, multiculturalism, community life',
        'UAE government — federal system, rulers, ministries, Expo 2020 legacy',
        'Global citizenship — human rights, UN Sustainable Development Goals',
        'Financial literacy — budgeting, saving, understanding money',
        'Media literacy — identifying misinformation, responsible social media use',
        'Mental health awareness — stress, anxiety, seeking help',
        'UAE Vision 2071 — long-term national goals and student role',
      ],
      secondary: [
        'Applied ethics — workplace ethics, professional conduct',
        'UAE law and governance — Constitution, judicial system, rights and duties',
        'Cultural heritage and identity — Emirati identity in a globalised world',
        'International relations — UAE foreign policy, diplomacy, humanitarian aid',
        'Economic literacy — UAE economy, diversification, knowledge economy',
        'Innovation and entrepreneurship — UAE as a startup hub',
        'Environmental policy — UAE sustainability initiatives, COP28 legacy',
        'Community service — Zayed\'s legacy of giving, volunteering',
      ],
    },

    teachingNotes: `MSC is the UAE's unique values-based subject. It combines moral education, cultural studies, and civic education. NOT the same as Islamiat — MSC is for ALL students regardless of religion. Focus on UAE-specific context: Sheikh Zayed's values (tolerance, generosity, unity), UAE Vision 2071, Expo 2020/2025 legacy. Teach with respect for UAE's multicultural society — 200+ nationalities. Never present UAE values as merely theoretical — connect to real examples (Year of Tolerance, COP28, Mars Mission, humanitarian aid). For Pakistani students in UAE: bridge between Pakistani values and Emirati values — family, respect for elders, hospitality are shared.`,
  },

  socialStudiesUAE: {
    name: 'Social Studies (UAE)',
    arabic: 'الدراسات الاجتماعية',
    mandatoryFor: 'All students in UAE private schools',
    curriculum: 'UAE national curriculum',
    examBoard: 'UAE National standardised assessments',

    topicsByStage: {
      primary: [
        'UAE geography — seven emirates, capital Abu Dhabi, major cities',
        'UAE map skills — locating emirates, neighbouring countries',
        'UAE climate — desert, mountains, coast, oasis',
        'UAE wildlife — Arabian oryx, falcon, camel, marine life',
        'UAE history — pearl diving, Bedouin life, oil discovery',
        'Sheikh Zayed — founding father, his vision and values',
        'UAE national symbols — flag, emblem, national anthem',
        'UAE celebrations — National Day, Flag Day, Commemoration Day',
      ],
      middle: [
        'UAE Federation formation — 2 December 1971',
        'Seven emirates — Abu Dhabi, Dubai, Sharjah, Ajman, UAQ, RAK, Fujairah',
        'UAE economic development — from pearls to oil to diversification',
        'UAE infrastructure — Burj Khalifa, Louvre Abu Dhabi, Expo City',
        'Population and demographics — Emirati nationals and expatriates',
        'UAE in the Gulf region — GCC, regional cooperation',
        'Water and energy — desalination, solar power, nuclear energy',
        'UAE space programme — Mars Mission Hope Probe, astronaut programme',
      ],
      secondary: [
        'UAE political system — federal structure, Supreme Council, cabinet',
        'UAE Constitution — key articles, rights and duties',
        'UAE foreign policy — neutrality, humanitarian aid, Abraham Accords',
        'Economic diversification — tourism, finance, technology, AI strategy',
        'UAE environmental challenges — water scarcity, urban heat, conservation',
        'UAE cultural diplomacy — Louvre Abu Dhabi, cultural agreements',
        'UAE and international organisations — UN, OPEC, GCC',
        'UAE future — Vision 2071, Centennial Plan, Mars 2117',
      ],
    },

    teachingNotes: `Social Studies UAE is distinct from Pakistan Studies. Pakistani students in UAE must learn UAE geography, history, and government — not just Pakistan. Starky must know: all 7 emirates and their rulers, Sheikh Zayed's founding story, 1971 Federation, UAE Vision 2071. Currency is AED (Dirhams), not PKR. Use UAE place names in examples — Deira not Saddar, JBR not Clifton. For A Level students: UAE political system is different from Pakistan's — explain the federal monarchy system clearly. Never compare UAE governance unfavourably with any other system.`,
  },

  moralEducation: {
    name: 'Moral Education (Non-Muslim Students)',
    arabic: 'التربية الأخلاقية',
    mandatoryFor: 'All non-Muslim students in UAE private schools (replaces Islamic Education)',
    note: 'Muslim students take Islamic Education instead',
    curriculum: 'UAE national curriculum',
    examBoard: 'School-based assessment aligned to UAE national standards',

    topicsByStage: {
      primary: [
        'Character and moral values — honesty, kindness, fairness, sharing',
        'Personal and social responsibility — caring for others, respecting differences',
        'Cultural appreciation — understanding that people come from different backgrounds',
        'Civic values — rules, cooperation, being a good community member',
        'Environmental responsibility — caring for nature and animals',
        'UAE national identity — respect for UAE culture and traditions',
        'Digital citizenship — safe and responsible use of technology',
        'Empathy and emotional awareness — understanding feelings of others',
      ],
      middle: [
        'Ethical reasoning — making moral decisions, understanding consequences',
        'Human rights and dignity — universal rights, respecting all people',
        'Global citizenship — interconnected world, responsibility to humanity',
        'Critical thinking about moral dilemmas — no single right answer',
        'Media literacy — identifying bias, responsible social media use',
        'Cultural diversity — appreciating 200+ nationalities in UAE',
        'Conflict resolution — peaceful problem-solving strategies',
        'Community service — volunteering, giving back, Zayed legacy of generosity',
      ],
      secondary: [
        'Applied ethics — workplace ethics, professional integrity, academic honesty',
        'Philosophical foundations of morality — different ethical frameworks',
        'Social justice — equality, equity, inclusion, fighting discrimination',
        'Environmental ethics — sustainability, climate responsibility, COP28 legacy',
        'Bioethics — medical ethics, technology ethics, AI ethics',
        'Global challenges — poverty, migration, peace, UN Sustainable Development Goals',
        'Interfaith dialogue — understanding and respecting all religions and beliefs',
        'Leadership and civic engagement — active citizenship, community impact projects',
      ],
    },

    teachingNotes: `Moral Education is the alternative to Islamic Education for non-Muslim students. It is NOT a lesser subject — it is a full curriculum with its own learning outcomes and assessments. Teach with the same depth and respect as Islamic Education. Focus on universal values: empathy, honesty, justice, responsibility. UAE-specific context is essential — Year of Tolerance, Abrahamic Family House, coexistence of 200+ nationalities. For Christian, Hindu, Buddhist, and other faith backgrounds: acknowledge their values while teaching the universal moral framework. Never present any religion as superior or inferior. Portfolio-based assessment: students demonstrate values through projects, reflections, and community service.`,
  },

  crossCurriculumNote: {
    name: 'Cross-Curriculum Applicability',
    note: 'UAE mandatory subjects apply to ALL private school students regardless of main curriculum — British (IGCSE/A Level), American (AP), IB (Diploma), CBSE, and Pakistani. An IB student still takes UAE national Islamic Education and Arabic. A CBSE student still takes UAE Social Studies. These are ADDITIONAL to the main curriculum requirements, not replacements. IB students may count Arabic B towards Group 2 but still need UAE national Arabic assessments. Assessment is by UAE national standards, not the school curriculum board.',
    mandatoryFor: 'All students in all UAE private schools',
    topicsByStage: { primary: [], middle: [], secondary: [] },
    teachingNotes: 'This is a structural note. UAE mandatory subjects are examined separately from the main curriculum. A student doing Cambridge IGCSE still sits national-curriculum exams for Arabic, Islamic Education, and Social Studies. These appear on the national curriculum report card alongside the main curriculum results.',
  },
};

/**
 * Get UAE mandatory subjects prompt injection.
 * Only injected when user_country = 'UAE'.
 */
export function getUAEMandatoryPrompt(stage) {
  const stageKey = stage === 'primary' || stage === 'early' ? 'primary'
    : stage === 'secondary' || stage === 'sixthform' ? 'secondary'
    : 'middle';

  const subjects = UAE_MANDATORY_SUBJECTS;
  let prompt = `\nUAE MANDATORY SUBJECTS — This student studies these alongside their main curriculum:\n`;

  for (const [key, subj] of Object.entries(subjects)) {
    const topics = subj.topicsByStage[stageKey] || subj.topicsByStage.middle;
    prompt += `\n${subj.name}: ${topics.slice(0, 4).join(', ')}. ${subj.teachingNotes.split('.').slice(0, 2).join('.')}.`;
  }

  prompt += `\n\nIf the student asks about any UAE mandatory subject, teach it with full depth. These are real examined subjects — not optional extras. Use UAE context: AED currency, Dubai/Abu Dhabi examples, Sheikh Zayed values.`;

  return prompt;
}

/**
 * Check if a message is about a UAE mandatory subject.
 */
export function isUAEMandatoryTopic(message) {
  if (!message) return null;
  const lower = message.toLowerCase();
  const triggers = {
    islamicEducation: ['islamic education', 'islamic studies uae', 'تربية إسلامية', 'moe islamic'],
    arabicSecondLanguage: ['arabic language', 'arabic second', 'learn arabic', 'asl arabic', 'عربي', 'arabic class'],
    moralSocialCultural: ['moral education', 'msc', 'moral social', 'social cultural', 'citizenship uae'],
    socialStudiesUAE: ['social studies uae', 'uae history', 'uae geography', 'seven emirates', 'sheikh zayed', 'uae government'],
    moralEducation: ['moral education', 'non-muslim education', 'ethics class', 'تربية أخلاقية', 'moral values class'],
  };

  for (const [key, words] of Object.entries(triggers)) {
    if (words.some(w => lower.includes(w))) {
      return UAE_MANDATORY_SUBJECTS[key];
    }
  }
  return null;
}

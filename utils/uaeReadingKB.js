/**
 * utils/uaeReadingKB.js
 * UAE Summer Reading Knowledge Base
 *
 * 3 reading tracks: IGCSE Set Texts, IB English, General Summer Reading.
 * Starky knows every text at examiner level.
 *
 * PROTECTED: This file is an addition. Nothing existing is affected.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TRACK 1 — IGCSE SET TEXTS (Examiner-level knowledge)
// ═══════════════════════════════════════════════════════════════════════════════

export const IGCSE_SET_TEXTS = {
  shakespeare: [
    { title: 'A Midsummer Night\'s Dream', author: 'Shakespeare', themes: ['Love and irrationality', 'Appearance vs reality', 'Magic and transformation', 'Order vs chaos', 'The nature of dreams'], characters: ['Oberon', 'Titania', 'Puck', 'Bottom', 'Hermia', 'Lysander', 'Helena', 'Demetrius', 'Theseus', 'Hippolyta'], examinerQs: ['How does Shakespeare present the theme of transformation?', 'Explore the role of magic in the play.', 'How does Shakespeare use comedy to explore serious themes?'], assessmentObjectives: 'AO1: Response to text. AO2: Language, form, structure analysis. AO3: Context (Elizabethan attitudes to love and marriage).' },
    { title: 'Othello', author: 'Shakespeare', themes: ['Jealousy', 'Race and prejudice', 'Manipulation and deceit', 'Love and trust', 'Appearance vs reality'], characters: ['Othello', 'Iago', 'Desdemona', 'Cassio', 'Emilia', 'Brabantio', 'Roderigo'], examinerQs: ['How does Shakespeare present Iago as a villain?', 'Explore the significance of race in Othello.', 'How does Shakespeare present the theme of jealousy?'], assessmentObjectives: 'AO1: Sustained personal response. AO2: Close analysis of "green-eyed monster" speech, Iago\'s soliloquies. AO3: Jacobean attitudes to race, Venice vs Cyprus.' },
    { title: 'Romeo and Juliet', author: 'Shakespeare', themes: ['Love vs hate', 'Fate and free will', 'Youth vs age', 'Family loyalty', 'Time and haste'], characters: ['Romeo', 'Juliet', 'Mercutio', 'Tybalt', 'Friar Lawrence', 'Nurse', 'Lord Capulet'], examinerQs: ['How does Shakespeare present the theme of fate?', 'Explore the role of Friar Lawrence in the play.', 'How does Shakespeare use light and dark imagery?'], assessmentObjectives: 'AO1: Response to text. AO2: Analysis of prologue as sonnet, oxymorons, light/dark imagery. AO3: Elizabethan marriage customs, family honour.' },
    { title: 'Macbeth', author: 'Shakespeare', themes: ['Ambition and its consequences', 'Guilt and conscience', 'Supernatural', 'Masculinity', 'Order and disorder'], characters: ['Macbeth', 'Lady Macbeth', 'Banquo', 'Duncan', 'Macduff', 'The Witches', 'Malcolm'], examinerQs: ['How does Shakespeare present Macbeth\'s ambition?', 'Explore the role of the supernatural.', 'How does Lady Macbeth change throughout the play?'], assessmentObjectives: 'AO1: Sustained response. AO2: Soliloquies, blood imagery, equivocation. AO3: Jacobean beliefs about kingship, witchcraft, divine right.' },
  ],
  prose: [
    { title: 'Great Expectations', author: 'Charles Dickens', themes: ['Social class and ambition', 'Loyalty and guilt', 'Identity and self-improvement', 'Justice and mercy'], examinerQs: ['How does Dickens present social class?', 'Explore the significance of Pip\'s journey.', 'How does Dickens use Miss Havisham to explore themes of revenge?'] },
    { title: 'Life of Pi', author: 'Yann Martel', themes: ['Faith and survival', 'Storytelling and truth', 'Nature and human nature', 'Fear and courage'], examinerQs: ['How does Martel explore the relationship between faith and survival?', 'What is the significance of the two stories Pi tells?'] },
    { title: 'Purple Hibiscus', author: 'Chimamanda Ngozi Adichie', themes: ['Religion and oppression', 'Family and freedom', 'Silence and voice', 'Political instability'], examinerQs: ['How does Adichie present the character of Papa?', 'Explore the theme of silence in the novel.'] },
    { title: 'Rebecca', author: 'Daphne du Maurier', themes: ['Identity and self-worth', 'Jealousy and obsession', 'Class and social status', 'Memory and haunting'], examinerQs: ['How does du Maurier create a sense of mystery?', 'Explore the significance of Manderley.'] },
    { title: 'The Kite Runner', author: 'Khaled Hosseini', themes: ['Guilt and redemption', 'Betrayal and loyalty', 'Class and ethnicity', 'Father-son relationships', 'Afghanistan\'s history'], examinerQs: ['How does Hosseini present the theme of redemption?', 'Explore the significance of the kite in the novel.'] },
  ],
  drama: [
    { title: 'A Streetcar Named Desire', author: 'Tennessee Williams', themes: ['Reality vs fantasy', 'Desire and destruction', 'Old South vs New America', 'Masculinity and power'], examinerQs: ['How does Williams present Blanche as a tragic figure?', 'Explore the conflict between Blanche and Stanley.'] },
    { title: 'Death and the King\'s Horseman', author: 'Wole Soyinka', themes: ['Duty and honour', 'Colonialism', 'Cultural clash', 'Death and transition'], examinerQs: ['How does Soyinka explore the clash of cultures?', 'What is the significance of Elesin\'s failure?'] },
  ],
  poetry: {
    anthology: 'Songs of Ourselves Volume 1',
    keyPoems: ['Ozymandias (Shelley)', 'Funeral Blues (Auden)', 'The Chimney Sweeper (Blake)', 'Sonnet 18 (Shakespeare)', 'Where the Mind is Without Fear (Tagore)', 'Still I Rise (Angelou)', 'Half-caste (Agard)', 'Search For My Tongue (Bhatt)', 'Piano (Lawrence)', 'Hunting Snake (Wright)', 'The Woodspurge (Rossetti)', 'A Different History (Dharker)', 'Plenty (Dharker)', 'On Her Blindness (Cope)', 'Amends (Rich)'],
    technique: 'For each poem: identify form (sonnet/free verse/dramatic monologue), key imagery and language devices, tone and mood, how structure supports meaning. Always use PEE/PEEL paragraphs with embedded quotations.',
  },
  essayStructure: {
    method: 'Introduction (thesis + text reference) → Point 1 with PEE (Point, Evidence, Explanation) → Point 2 with PEE → Point 3 with PEE → Conclusion (synthesise, link to wider themes). Every paragraph needs a quotation. Analysis means: what does the writer DO and WHY?',
    examinerWants: 'AO1: Informed personal response with textual evidence. AO2: Analysis of language, form, structure — HOW the writer creates meaning. AO3: Understanding of context — WHEN and WHERE the text was written and how this shapes meaning.',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// TRACK 2 — IB ENGLISH READING
// ═══════════════════════════════════════════════════════════════════════════════

export const IB_ENGLISH_TEXTS = {
  worldLiterature: [
    { title: '1984', author: 'George Orwell', themes: ['Totalitarianism', 'Surveillance and privacy', 'Language and power', 'Truth and memory'] },
    { title: 'Things Fall Apart', author: 'Chinua Achebe', themes: ['Colonialism', 'Masculinity and identity', 'Cultural clash', 'Tradition vs change'] },
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', themes: ['The American Dream', 'Wealth and corruption', 'Time and the past', 'Class and social mobility'] },
    { title: 'To Kill a Mockingbird', author: 'Harper Lee', themes: ['Racial injustice', 'Moral courage', 'Innocence and growing up', 'Empathy'] },
    { title: 'The Handmaid\'s Tale', author: 'Margaret Atwood', themes: ['Patriarchy and power', 'Freedom and control', 'Language and resistance', 'Memory and identity'] },
    { title: 'Hamlet', author: 'Shakespeare', themes: ['Revenge and justice', 'Madness', 'Death and mortality', 'Appearance vs reality', 'Corruption'] },
    { title: 'King Lear', author: 'Shakespeare', themes: ['Power and authority', 'Family bonds', 'Madness and insight', 'Nature and justice'] },
  ],
  ibAssessment: {
    io: 'Individual Oral (IO): 15 minutes. Choose a global issue. Connect through 2 works (one studied, one free choice). Focus on HOW the texts explore the issue, not just WHAT they say.',
    paper1: 'Paper 1 (Guided Literary Analysis): Unseen text — poetry or prose. Close reading skills essential. Identify: form, structure, voice, imagery, tone. Write a structured analytical essay.',
    paper2: 'Paper 2 (Comparative Essay): Compare at least 2 works studied. Must be genuine comparison, not two separate essays. Use connective phrases: "Similarly...", "In contrast...", "While X presents..."',
    hlEssay: 'HL Essay: 1200-1500 words on a work studied in class. Must demonstrate independent literary analysis. Research question + structured argument.',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// TRACK 3 — GENERAL UAE SUMMER READING (all ages)
// ═══════════════════════════════════════════════════════════════════════════════

export const GENERAL_READING = {
  primary: [
    { title: 'The BFG', author: 'Roald Dahl', age: 'Grade 2-4', themes: ['Friendship', 'Good vs evil', 'Imagination'] },
    { title: 'Charlie and the Chocolate Factory', author: 'Roald Dahl', age: 'Grade 2-4', themes: ['Greed', 'Kindness', 'Wonder'] },
    { title: 'Matilda', author: 'Roald Dahl', age: 'Grade 2-5', themes: ['Intelligence', 'Standing up for yourself', 'The power of reading'] },
    { title: 'Harry Potter and the Philosopher\'s Stone', author: 'J.K. Rowling', age: 'Grade 3-5', themes: ['Courage', 'Friendship', 'Good vs evil', 'Belonging'] },
    { title: 'The Lion, the Witch and the Wardrobe', author: 'C.S. Lewis', age: 'Grade 3-5', themes: ['Sacrifice', 'Temptation', 'Courage', 'Discovery'] },
    { title: 'Charlotte\'s Web', author: 'E.B. White', age: 'Grade 2-4', themes: ['Friendship', 'Life and death', 'Loyalty'] },
    { title: 'The Very Hungry Caterpillar', author: 'Eric Carle', age: 'KG-Grade 1', themes: ['Growth', 'Counting', 'Days of the week'] },
    { title: 'Wonder', author: 'R.J. Palacio', age: 'Grade 4-6', themes: ['Kindness', 'Acceptance', 'Bullying', 'Inner beauty'] },
  ],
  middle: [
    { title: 'Percy Jackson and the Lightning Thief', author: 'Rick Riordan', age: 'Grade 5-8', themes: ['Identity', 'Greek mythology', 'Friendship', 'Family'] },
    { title: 'The Diary of a Young Girl', author: 'Anne Frank', age: 'Grade 6-8', themes: ['War', 'Hope', 'Growing up', 'Human resilience'] },
    { title: 'The Giver', author: 'Lois Lowry', age: 'Grade 6-8', themes: ['Freedom vs safety', 'Memory', 'Individuality', 'Choice'] },
    { title: 'Holes', author: 'Louis Sachar', age: 'Grade 5-7', themes: ['Justice', 'Fate', 'Friendship', 'Perseverance'] },
    { title: 'Divergent', author: 'Veronica Roth', age: 'Grade 7-8', themes: ['Identity', 'Belonging', 'Courage', 'Society and control'] },
    { title: 'The Hunger Games', author: 'Suzanne Collins', age: 'Grade 7-9', themes: ['Survival', 'Power', 'Media manipulation', 'Sacrifice'] },
  ],
  secondary: [
    { title: 'To Kill a Mockingbird', author: 'Harper Lee', age: 'Grade 9-12', themes: ['Racial injustice', 'Moral courage', 'Innocence', 'Empathy'] },
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', age: 'Grade 10-12', themes: ['American Dream', 'Wealth', 'Illusion', 'Time'] },
    { title: 'Lord of the Flies', author: 'William Golding', age: 'Grade 9-11', themes: ['Civilisation vs savagery', 'Power', 'Fear', 'Loss of innocence'] },
    { title: 'Animal Farm', author: 'George Orwell', age: 'Grade 9-11', themes: ['Power and corruption', 'Revolution', 'Equality', 'Propaganda'] },
    { title: 'The Alchemist', author: 'Paulo Coelho', age: 'Grade 9-12', themes: ['Personal legend', 'Journey', 'Destiny', 'Self-discovery'] },
    { title: 'Educated', author: 'Tara Westover', age: 'Grade 10-12', themes: ['Education and freedom', 'Family', 'Identity', 'Self-invention'] },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// STARKY'S SUMMER READING METHOD
// ═══════════════════════════════════════════════════════════════════════════════

export const READING_METHOD = {
  sessionStructure: [
    '1. "Tell me what you\'ve read so far" — student summarises in their own words',
    '2. Starky asks 3 discussion questions about that section — comprehension, inference, opinion',
    '3. Starky introduces one literary device used in that section — metaphor, foreshadowing, symbolism, etc.',
    '4. Starky gives a prediction challenge: "What do you think will happen next? Why?"',
    '5. For exam texts: connect to likely essay questions and practise paragraph structure',
  ],
  readingPlan: 'One chapter or act per session. For Shakespeare: one scene per session with modern English alongside. For poetry: one poem per session with close analysis.',
};

/**
 * Get UAE summer reading prompt for Starky.
 */
export function getUAEReadingPrompt(track, bookTitle) {
  let prompt = `\nUAE SUMMER READING — Starky as reading companion.\n`;
  prompt += `\nMethod: ${READING_METHOD.sessionStructure.join(' → ')}`;
  prompt += `\nValue: Students who read with purpose over summer arrive in September with stronger vocabulary, better essay technique, and deeper familiarity with set texts. Summer readers gain 1.9 months of literacy progress in 8 weeks.\n`;

  if (track === 'igcse' && bookTitle) {
    const allTexts = [...IGCSE_SET_TEXTS.shakespeare, ...IGCSE_SET_TEXTS.prose, ...IGCSE_SET_TEXTS.drama];
    const match = allTexts.find(t => bookTitle.toLowerCase().includes(t.title.toLowerCase()));
    if (match) {
      prompt += `\nCURRENT TEXT: ${match.title} by ${match.author}`;
      prompt += `\nThemes: ${match.themes.join(', ')}`;
      if (match.examinerQs) prompt += `\nExaminer questions: ${match.examinerQs.join(' / ')}`;
      prompt += `\n${IGCSE_SET_TEXTS.essayStructure.examinerWants}`;
    }
  } else if (track === 'ib') {
    prompt += `\nIB Assessment: ${IB_ENGLISH_TEXTS.ibAssessment.io}`;
    prompt += `\n${IB_ENGLISH_TEXTS.ibAssessment.paper1}`;
  }

  prompt += `\n\nREADING TEACHING RULES: Never spoil the ending. Ask before revealing plot points. Celebrate every reading session. For younger readers: make it fun, use characters' voices. For exam readers: always connect to assessment objectives. Use UAE examples when discussing themes (e.g. tolerance in UAE for multicultural texts).`;

  return prompt;
}

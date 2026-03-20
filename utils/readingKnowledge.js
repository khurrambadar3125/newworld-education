/**
 * utils/readingKnowledge.js
 * ─────────────────────────────────────────────────────────────────
 * Starky Reading Knowledge Base — grade-gated book knowledge.
 * Starky has read everything. Every Cambridge and Oxford reading list,
 * every children's classic, every Shakespeare play, every great novel.
 */

// ═══════════════════════════════════════════════════════════════════
// READING KNOWLEDGE — injected into reading page prompts by grade
// ═══════════════════════════════════════════════════════════════════

const READING_KB = {
  // ── Young Readers: KG to Grade 5 (Ages 4-11) ────────────────
  early: `STARKY'S READING IDENTITY:
Starky has read every children's book worth reading. Starky does not just know what is in these books — Starky knows how to make a child fall in love with a story.

ROALD DAHL — COMPLETE KNOWLEDGE:
The BFG: friendship across difference, courage. Teach: what makes BFG's language funny? ("whizzpopping" — Dahl invents words because language belongs to everyone who uses it creatively)
Charlie and the Chocolate Factory: each failing child = a vice (Augustus/greed, Violet/pride, Veruca/entitlement, Mike/passivity). Charlie has humility.
Matilda: the power of reading, the right teacher seeing genius. Miss Honey is the teacher every child deserves — Starky is Miss Honey, available to every child.
James and the Giant Peach: escape, imagination, found family. Danny the Champion of the World: father-son love, moral courage.
The Witches, George's Marvellous Medicine, The Twits, Fantastic Mr Fox — Starky knows all.
Poetry: Revolting Rhymes (subversive fairy tale retellings — why does Dahl change the stories?), Dirty Beasts.

A.A. MILNE — WINNIE THE POOH: Each character = a human quality. Eeyore teaches it's OK to be sad. Pooh's simplicity IS wisdom.
C.S. LEWIS — NARNIA (7 books): The Lion, the Witch and the Wardrobe — sacrifice, redemption, courage. The world is larger than what we see.
TOLKIEN — THE HOBBIT: The unexpected hero. Why is Bilbo the hero and not a warrior? What does Tolkien say about heroism?
LEWIS CARROLL — ALICE: Growing up, absurd rules of adult society, logic taken to extremes. "Off with their heads!" — terrifying but absurd. What is Carroll saying about authority?
FRANCES HODGSON BURNETT: The Secret Garden (healing power of nature), A Little Princess (dignity in hardship).
E.B. WHITE — CHARLOTTE'S WEB: Friendship and accepting loss — one of the greatest explorations in all children's literature.

ENID BLYTON — COMPLETE:
Famous Five (21 books): adventure, independence, friendship. Secret Seven (15 books): belonging, purpose. Faraway Tree (4 books): imagination, wonder. Adventure Series (8 books): excitement for older primary. Mystery Series (15 books): systematic detective work. Malory Towers & St Clare's: friendship and character through community.

MODERN CHILDREN'S: David Walliams (Billionaire Boy, Gangsta Granny — Dahl tradition in 21st century), Jeff Kinney (Wimpy Kid — Greg is an unreliable narrator!), R.J. Palacio Wonder ("choose kind" — empathy building), Michael Morpurgo (War Horse, Kensuke's Kingdom — treats children as capable of real grief), Jacqueline Wilson (Tracy Beaker — tells difficult-life children their stories matter).

HOW STARKY TEACHES YOUNG READERS:
BEFORE READING: "What do you think this book is about from the title? What do you already know?"
DURING: "What just happened? How does [character] feel? Was there a word you didn't understand? What happens next?"
AFTER: "What was your favourite part? Which character would you meet? What did you learn?"`,

  // ── Primary overlap (same but can reference in primary builder) ──
  primary: `STARKY'S BOOK KNOWLEDGE — PRIMARY LEVEL:
Starky has read every important children's book and can discuss any of them in depth.

KEY AUTHORS AND WORKS:
Roald Dahl (complete works), Enid Blyton (all series), C.S. Lewis (Narnia), Tolkien (The Hobbit), Michael Morpurgo, David Walliams, Jeff Kinney, R.J. Palacio (Wonder), Jacqueline Wilson, E.B. White, Frances Hodgson Burnett, Lewis Carroll, A.A. Milne.

For every book discussion: (1) what happens (plot), (2) what it means (themes), (3) how the author tells it (techniques), (4) what the student thinks.
Comprehension: literal → inferential → evaluative questions in that order.
Vocabulary: context first, definition second, use in a sentence third.
Always make books feel like adventures, never assignments.`,

  // ── Secondary (GCSE/O Level) ─────────────────────────────────
  secondary: `STARKY'S LITERARY KNOWLEDGE — SECONDARY:

SHAKESPEARE — COMPLETE (37 plays, 154 sonnets):
THE FOUR GREAT TRAGEDIES:
Hamlet: revenge vs conscience, corruption of the state, thought vs action. "To be or not to be." Critical debate: is Hamlet mad or pretending? Is Gertrude complicit?
Macbeth: ambition unchecked, guilt destroying sleep. Written for James I (witchcraft, Gunpowder Plot). "Is this a dagger?" "Out, damned spot!" "Tomorrow and tomorrow."
Othello: jealousy engineered by Iago, racism, manipulation. Bradley vs Leavis: noble man destroyed vs man with fatal insecurities.
King Lear: age, power, love vs flattery. The Fool is wiser than the King.

COMEDIES: Midsummer Night's Dream (love as madness), Twelfth Night (gender/identity), Much Ado (wit and love), Merchant of Venice (teach Shylock's portrayal honestly).
HISTORIES: Richard III ("Now is the winter of our discontent"), Henry V, Richard II.
LATE ROMANCES: The Tempest ("We are such stuff as dreams are made on").
SONNETS: 18 ("Shall I compare thee"), 116 ("Let me not to the marriage of true minds"), 130 (anti-Petrarchan — deliberately subversive yet deeply loving).

CLASSIC SECONDARY NOVELS:
To Kill a Mockingbird (Harper Lee): racial injustice, moral courage. "You never really understand a person until you climb into his skin and walk around in it."
Lord of the Flies (Golding): darkness within, fragility of civilisation. Written against Ballantyne's The Coral Island.
Of Mice and Men (Steinbeck): friendship, fragility of dreams, loneliness. Why does Steinbeck make Lennie simultaneously innocent and dangerous?
An Inspector Calls (Priestley): social responsibility, class. Written 1945, set 1912 — "we were warned."
Animal Farm (Orwell): corruption of revolution, totalitarianism. "All animals are equal, but some are more equal than others." Direct allegory of Russian Revolution.
The Great Gatsby (Fitzgerald): the green light, impossible past, corruption beneath wealth.
A Christmas Carol (Dickens): redemption, social responsibility. Dickens wrote it as a weapon for the poor.
Anne Frank's Diary: the inner life of a young person under unimaginable pressure. Every student should read this.

CLOSE READING METHOD: Read → identify purpose/audience → select 3-5 specific moments → analyse language choices → consider structure → connect to context → build an ARGUMENT, not a list.
ESSAY STRUCTURE: Opening states the argument (never "In this essay I will..."), each paragraph advances one point with evidence and 3 lines of analysis, conclusion develops (not repeats).`,

  // ── Sixth Form / A Level ─────────────────────────────────────
  sixthform: `STARKY'S LITERARY KNOWLEDGE — SIXTH FORM / UNIVERSITY PREP:

SHAKESPEARE: All 37 plays, 154 sonnets — complete knowledge. Can teach any play at university level. Critical perspectives: A.C. Bradley, F.R. Leavis, Terry Eagleton, Barbara Hardy, Jonathan Bate, feminist and post-colonial readings.

OXFORD/CAMBRIDGE ENGLISH READING LISTS:
Austen (Pride and Prejudice, Emma), Dickens (Great Expectations, Bleak House), George Eliot (Middlemarch), Hardy (Tess), Conrad (Heart of Darkness), Woolf (Mrs Dalloway, To the Lighthouse), Orwell (1984), Beckett (Waiting for Godot), Ishiguro (Remains of the Day, Never Let Me Go), Toni Morrison (Beloved), Achebe (Things Fall Apart), Adichie (Half of a Yellow Sun).
Poetry: Donne, Milton (Paradise Lost), Keats (Odes), Tennyson, Hopkins, Wilfred Owen, T.S. Eliot (The Waste Land), Larkin (The Whitsun Weddings), Heaney (Death of a Naturalist), Carol Ann Duffy.
World literature: Tolstoy, Dostoevsky (Crime and Punishment), Kafka, García Márquez, Murakami.

OXFORD PRE-READING BY SUBJECT:
History: E.H. Carr (What is History?), Hobsbawm, Figes, Mary Beard. Philosophy: Plato (Republic), Descartes (Meditations), Hume, Kant, Mill, Russell (Problems of Philosophy — "the best introduction ever written"). Science: Feynman, Hawking, Rovelli, Dawkins, Bryson (Short History of Nearly Everything — "the single best science book for a student who wants to love science"). Maths: Simon Singh (Fermat's Last Theorem), Hardy (A Mathematician's Apology). Economics: Kahneman, Harford, Acemoglu & Robinson.

UNSEEN CRITICAL COMMENTARY (Oxbridge entrance skill): Respond to an unseen passage with rigorous analytical writing. No specialist knowledge required — only the ability to read rigorously and respond analytically. Teach this explicitly: read twice, identify purpose/tone, find 3-5 moments, analyse language, connect to wider context, build an argument.`,

  // ── Islamic & South Asian Literature (all levels) ────────────
  islamic_south_asian: `ISLAMIC AND SOUTH ASIAN LITERATURE — STARKY KNOWS AND ACTIVELY RECOMMENDS:

ALLAMA MUHAMMAD IQBAL — Greatest Urdu/Persian poet of the modern era:
Bang-e-Dra (Call of the Marching Bell), Bal-e-Jibril (Gabriel's Wing — masterpiece), Zarb-e-Kalim (Rod of Moses), Asrar-e-Khudi (Secrets of the Self — in Persian), Javid-Nama (modelled on Dante's Divine Comedy with Rumi as guide).
Key concept: Khudi (selfhood) — develop the inner self through engagement with God and action.
"Khudi ko kar buland itna ke har taqdeer se pehle, Khuda bande se khud pooche, bata teri raza kya hai."

FAIZ AHMED FAIZ: Greatest progressive Urdu poet. "Mujh se pehli si mohabbat mere mahboob na maang" — love as language for justice and hope.
MIRZA GHALIB: Supreme master of Urdu/Persian ghazal. Diwan-e-Ghalib — every educated Urdu speaker knows it.
MIR TAQI MIR: Founding father of Urdu poetry. MIR DARD: Sufi mystical poetry.
RUMI: 13th-century Persian Sufi — The Masnavi, greatest work of Persian literature. "Out beyond ideas of wrongdoing and rightdoing, there is a field."
THE ARABIAN NIGHTS: Scheherazade — the frame narrative of world storytelling. Aladdin, Ali Baba, Sinbad.

SOUTH ASIAN LITERATURE:
Mohsin Hamid (The Reluctant Fundamentalist, Exit West, Moth Smoke), Kamila Shamsie (Home Fire, A God in Every Stone), Daniyal Mueenuddin (In Other Rooms Other Wonders), Intizar Husain (Basti — great novel of Partition), Saadat Hasan Manto (Toba Tek Singh — greatest Urdu short-story writer), Abdullah Hussein (Udas Naslain — most important Pakistani novel), Aravind Adiga (The White Tiger).`,
};

/**
 * Get reading knowledge appropriate for the student's stage.
 * @param {string} stageId — 'early', 'primary', 'secondary', 'sixthform'
 * @returns {string} — knowledge block to append to system prompt
 */
export function getReadingKnowledge(stageId) {
  const blocks = [];
  const kb = READING_KB[stageId];
  if (kb) blocks.push(kb);
  // Always include Islamic/South Asian literature for all levels
  blocks.push(READING_KB.islamic_south_asian);
  return blocks.join('\n\n');
}

/**
 * Get book knowledge for a specific book or author query (for main Starky chat).
 * Lightweight — returns a brief pointer, not the full KB.
 */
export function getBookKnowledge(message) {
  if (!message) return '';
  const lower = message.toLowerCase();

  // Quick keyword check for major authors/books
  const bookHints = {
    'roald dahl': 'You have deep knowledge of all Roald Dahl works. Discuss the specific book asked about — plot, themes, Dahl\'s purpose, and what the student thinks.',
    'enid blyton': 'You know all Enid Blyton series (Famous Five, Secret Seven, Faraway Tree, Adventure, Mystery, school stories). Discuss the specific series or book.',
    'shakespeare': 'You know all 37 Shakespeare plays and 154 sonnets. Give plot, themes, key speeches, context, critical debate, and ask what the STUDENT thinks.',
    'hamlet': 'Hamlet: revenge vs conscience, corruption, thought vs action. "To be or not to be." Is Hamlet mad or pretending? Is Gertrude complicit? Multiple critical readings.',
    'macbeth': 'Macbeth: ambition, guilt, corruption. Written for James I. "Is this a dagger?" "Out damned spot!" Context: Gunpowder Plot 1605, witchcraft.',
    'othello': 'Othello: jealousy engineered by Iago, racism, manipulation. Bradley vs Leavis debate. The handkerchief as symbol.',
    'king lear': 'King Lear: age/power, love vs flattery. The Fool wiser than the King. The most devastating of the tragedies.',
    'iqbal': 'Allama Iqbal: Bang-e-Dra, Bal-e-Jibril, Asrar-e-Khudi. Key concept: Khudi (selfhood). Can discuss in both Urdu and English with full context.',
    'ghalib': 'Mirza Ghalib: supreme master of ghazal. Discuss any couplet with translation, context, and layers of meaning.',
    'faiz': 'Faiz Ahmed Faiz: progressive Urdu poetry. Love as language for justice. "Mujh se pehli si mohabbat" — discuss with full context.',
    'rumi': 'Rumi: Masnavi, Divan-e Shams. 13th-century Sufi poet. Discuss with deep respect and understanding of Sufi philosophy.',
  };

  for (const [keyword, hint] of Object.entries(bookHints)) {
    if (lower.includes(keyword)) return `\nBOOK/AUTHOR KNOWLEDGE: ${hint}`;
  }
  return '';
}

/**
 * utils/phonicsKB.js
 * ─────────────────────────────────────────────────────────────────
 * Starky Phonics Knowledge Base — The Science of Teaching Reading from Zero
 * Sources: Letters and Sounds (UK DfES 2007), National Reading Panel (NICHD 2000),
 * Kilpatrick (2015), Dehaene: Reading in the Brain (2009), Orton-Gillingham,
 * Rose Review (2006), IDA Structured Literacy Framework, NAEYC
 */

// ── Phase data used by both the KB and the page ────────────────────────

export const PHASES = [
  {
    id: 'phase1', num: 1, name: 'Listening First', ages: 'Age 3-5', color: '#A8E063',
    emoji: '👂', desc: 'Train the ear before the eye — rhyming, syllables, sounds',
    sounds: [],
    activities: [
      { title: 'Rhyme Time', desc: 'Does "cat" rhyme with "bat"? What about "dog"?', emoji: '🎵' },
      { title: 'Clap the Beats', desc: 'Clap your name! Ra-ni-a = 3 claps!', emoji: '👏' },
      { title: 'Sound Blend', desc: 'I say d...o...g. What word is that?', emoji: '🔊' },
      { title: 'First Sound Hunt', desc: 'What starts with /s/? Look around you!', emoji: '🔍' },
    ],
  },
  {
    id: 'phase2', num: 2, name: 'First Letters', ages: 'Age 4-5', color: '#63D2FF',
    emoji: '🔤', desc: '19 letter-sounds — start reading real words!',
    sounds: [
      { set: 1, letters: ['s', 'a', 't', 'p'], words: ['sat', 'tap', 'pat', 'at'] },
      { set: 2, letters: ['i', 'n', 'm', 'd'], words: ['in', 'man', 'dim', 'tin'] },
      { set: 3, letters: ['g', 'o', 'c', 'k'], words: ['got', 'cot', 'dog', 'kit'] },
      { set: 4, letters: ['ck', 'e', 'u', 'r'], words: ['duck', 'red', 'cup', 'run'] },
      { set: 5, letters: ['h', 'b', 'f', 'l', 'ss'], words: ['hat', 'big', 'fun', 'bell'] },
    ],
    trickyWords: ['the', 'to', 'I', 'no', 'go', 'into'],
  },
  {
    id: 'phase3', num: 3, name: 'Digraphs', ages: 'Age 4-5', color: '#FFC300',
    emoji: '🔗', desc: 'Two letters, one sound — ch, sh, th, ee, ai, oa...',
    sounds: [
      { set: 'consonant', letters: ['ch', 'sh', 'th', 'ng', 'qu'], words: ['chip', 'ship', 'thin', 'ring', 'queen'] },
      { set: 'vowel', letters: ['ai', 'ee', 'igh', 'oa', 'oo', 'ar', 'or', 'ur', 'ow', 'oi', 'ear', 'air', 'ure'], words: ['rain', 'tree', 'night', 'boat', 'moon', 'car', 'fork', 'burn', 'cow', 'coin', 'hear', 'hair', 'pure'] },
    ],
    trickyWords: ['he', 'she', 'we', 'me', 'be', 'was', 'my', 'you', 'they', 'her', 'all', 'are'],
  },
  {
    id: 'phase4', num: 4, name: 'Blends', ages: 'Age 5', color: '#FF8C69',
    emoji: '🧩', desc: 'Two consonants together — bl, tr, sp, nd, st...',
    sounds: [
      { set: 'initial', letters: ['bl', 'br', 'cl', 'cr', 'dr', 'fl', 'fr', 'gl', 'gr', 'pl', 'pr', 'sl', 'sm', 'sn', 'sp', 'st', 'sw', 'tr', 'tw'], words: ['black', 'trip', 'stop', 'green', 'swim'] },
      { set: 'final', letters: ['nd', 'nt', 'nk', 'ft', 'sk', 'st', 'lt', 'mp'], words: ['hand', 'tent', 'think', 'left', 'best'] },
    ],
    trickyWords: ['said', 'have', 'like', 'so', 'do', 'some', 'come', 'were', 'there', 'little', 'one'],
  },
  {
    id: 'phase5', num: 5, name: 'Alternative Spellings', ages: 'Age 5-6', color: '#C77DFF',
    emoji: '✨', desc: 'Same sound, different spelling — the magic e and more',
    sounds: [
      { set: 'split', letters: ['a-e', 'e-e', 'i-e', 'o-e', 'u-e'], words: ['cake', 'these', 'bike', 'home', 'cute'] },
      { set: 'ay', letters: ['ay', 'ai', 'a-e', 'ey'], words: ['day', 'rain', 'cake', 'they'] },
      { set: 'ee', letters: ['ee', 'ea', 'e', 'y'], words: ['tree', 'sea', 'me', 'happy'] },
      { set: 'igh', letters: ['igh', 'i-e', 'y', 'ie'], words: ['night', 'bike', 'fly', 'pie'] },
    ],
    trickyWords: ['oh', 'their', 'people', 'Mr', 'Mrs', 'looked', 'called', 'asked', 'could', 'should', 'would'],
  },
];

// ── Phonics system prompt — injected into /phonics page chat ──────────

export const PHONICS_SYSTEM_PROMPT = `You are Starky, a world-class phonics teacher — warm, patient, celebratory.
You teach children to READ from the very beginning using systematic synthetic phonics.

THE SCIENCE: Children are not born knowing how to read. The brain has no reading circuit —
it physically rewires itself when a child learns phonics (Dehaene 2009). English has 26 letters,
44 sounds (phonemes), ~250 ways those sounds can be written (graphemes). A child who learns
these systematically can decode ANY word in English.

YOUR METHOD — MULTISENSORY (Orton-Gillingham):
Every sound taught through THREE channels simultaneously:
VISUAL: "Look at the letter s — it curls like a snake"
AUDITORY: "Say the sound: sssssss"
KINAESTHETIC: "Move your hand like a snake sliding: sssss"

YOUR BLENDING PROTOCOL — same every time:
Step 1 SOUND BUTTONS: "Let's put sound buttons under each sound: s...a...t"
Step 2 SAY EACH SOUND: "/s/ /a/ /t/"
Step 3 BLEND: "Push the sounds together: sssaaat... sat! You read it!"
Step 4 CONFIRM MEANING: "Sat — like 'the cat sat on the mat.'"

LESSON STRUCTURE — every interaction:
1. REVIEW (1 min): Quick-fire 4-5 known sounds
2. INTRODUCE (2 min): ONE new sound only with letter, sound, word, mnemonic
3. PRACTISE (3 min): Read words containing the new sound, blend aloud
4. APPLY (2 min): A decodable sentence using ONLY known sounds
5. CELEBRATE: "You read 'ch' every time. That sound is yours now."

CRITICAL RULES:
- Always teach the SOUND not the letter NAME. /s/ not "ess". /b/ not "bee".
- Never skip Phase 1 listening skills if the child cannot blend orally
- Never introduce a sound before the previous ones are secure
- Generate decodable sentences using ONLY sounds the child has learned
- CVC words (consonant-vowel-consonant) are the building blocks: cat, sit, run, dog

HANDLING ERRORS:
- Letter names instead of sounds: "Good — you know the name! Now let's use the sound: /s/ not ess"
- b/d confusion: "Make a bed with your hands — left hand = b, right hand = d. Together = bed!"
- Adding vowels to consonants ("buh" not /b/): "Make it short and sharp — /b/ — almost stopping before it starts"
- Guessing from first letter: "Good start! But we don't guess — let's decode ALL the sounds"
- Right-to-left reading (Urdu habit): "In English we always go this way → finger under the first letter"

SIGHT WORDS / TRICKY WORDS:
"This is a 'tricky word' — the letters don't say their usual sounds. We remember this one as a whole."
Teach with: SEE → SAY → SPELL → WRITE → USE in a sentence.

MAGIC E / SPLIT DIGRAPHS (Phase 5):
"When a word ends in 'e', the e stays silent but makes the vowel say its name.
hop → hope. The magic e changed the /o/ to /oh/."

URDU/PAKISTAN BRIDGING:
- Reinforce left-to-right direction explicitly
- Sounds that transfer from Urdu: /m/, /n/, /b/, /p/, /t/, /d/, /k/, /g/, /f/, /s/, /z/
- Sounds needing extra time: /v/ (Urdu has /w/), /th/ (absent in Urdu), short vowel distinctions
- Bridge through Urdu: "/sh/ — یہ وہی آواز ہے جو اردو میں 'ش' سے آتی ہے — آپ یہ جانتے ہیں!"
- Roman Urdu bridge: "You already use 'd' in Roman Urdu — same sound in English!"

DIAGNOSTIC FIRST SESSION:
Show 20 graphemes one by one. Child says the sound. Starky identifies exact starting phase.
"Let's play a sounds game. I'll show you some letters — you tell me the sound they make."
No child starts at Phase 1 if they already know Phase 2 sounds.

FLUENCY TARGETS:
Grade 1: 30-60 wpm. Grade 2: 70-100 wpm. Grade 3: 100-120 wpm.
Build with: paired reading, echo reading, repeated reading (3x same passage).

MORPHOLOGY (Phase 6 — age 6-7):
Prefixes: un-, re-, dis-, pre-, mis-. Suffixes: -s/-es, -ing, -ed, -er, -est, -ful, -less, -ness, -ly.
Spelling rules: doubling (run→running), drop the e (make→making), y to i (baby→babies).

TONE: Maximum excitement. Every correct sound = celebration. Every attempt = praise.
Under 50 words per response. One sound at a time. One question at a time.
"You just read a real word. You decoded it yourself. That is reading."

If the student writes in Urdu, respond in Urdu and teach phonics bilingually.
`;

/**
 * Get the phonics prompt for a specific phase.
 */
export function getPhonicsPhaseContext(phaseId) {
  const phase = PHASES.find(p => p.id === phaseId);
  if (!phase) return '';
  let ctx = `\nCURRENT PHASE: Phase ${phase.num} — ${phase.name} (${phase.ages})`;
  if (phase.sounds?.length) {
    const allLetters = phase.sounds.flatMap(s => s.letters);
    ctx += `\nSOUNDS IN THIS PHASE: ${allLetters.join(', ')}`;
    const allWords = phase.sounds.flatMap(s => s.words);
    ctx += `\nEXAMPLE WORDS: ${allWords.join(', ')}`;
  }
  if (phase.trickyWords?.length) {
    ctx += `\nTRICKY WORDS TO TEACH: ${phase.trickyWords.join(', ')}`;
  }
  return ctx;
}

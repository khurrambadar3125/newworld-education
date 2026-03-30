/**
 * utils/uaePhonicsKB.js
 * UAE Bilingual Phonics Knowledge Base — Arabic↔English
 *
 * For UAE students learning English phonics (Arabic L1) or
 * Arabic sounds (English L1). Serves both directions.
 *
 * PROTECTED: This file is an addition. Nothing existing is affected.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// ARABIC PHONEMES that don't exist in English
// ═══════════════════════════════════════════════════════════════════════════════

export const ARABIC_UNIQUE_SOUNDS = [
  { letter: 'ع', name: 'Ayn', ipa: 'ʕ', desc: 'Deep throat sound — no English equivalent. Produced by constricting the pharynx. Students must feel the throat squeeze.', uaeWord: 'عين (ayn — eye/spring)', practice: 'Start with "aah" then tighten the throat. Feel the vibration deep in the neck.' },
  { letter: 'غ', name: 'Ghayn', ipa: 'ɣ', desc: 'Like gargling — back of throat vibration. Similar to French "r" in "rouge".', uaeWord: 'غروب (ghuroob — sunset)', practice: 'Gargle without water. That vibration at the back of the throat is Ghayn.' },
  { letter: 'خ', name: 'Khaa', ipa: 'x', desc: 'Like Scottish "loch" or German "Bach". Friction at the back of the mouth.', uaeWord: 'خليج (khaleej — gulf, as in Arabian Gulf)', practice: 'Say "k" but don\'t fully close — let air hiss through. Think "Khalifa" tower.' },
  { letter: 'ح', name: 'Haa', ipa: 'ħ', desc: 'Breathy, whispered "h" from deep in the throat. Stronger than English "h".', uaeWord: 'حب (hubb — love)', practice: 'Breathe out hard like fogging a mirror, but from the throat, not the lips.' },
  { letter: 'ص', name: 'Saad', ipa: 'sˤ', desc: 'Emphatic "s" — tongue pressed down and back, creating a heavier, darker "s" sound.', uaeWord: 'صحراء (sahraa — desert)', practice: 'Say "s" but push your tongue down flat. Your mouth should feel wider, the sound deeper.' },
  { letter: 'ض', name: 'Daad', ipa: 'dˤ', desc: 'Emphatic "d" — the sound unique to Arabic (Arabic is called لغة الضاد). Tongue pressed against upper teeth with emphasis.', uaeWord: 'ضوء (daw\' — light)', practice: 'Say "d" but make it heavy and deep. Press the sides of your tongue against your upper teeth.' },
  { letter: 'ط', name: 'Taa', ipa: 'tˤ', desc: 'Emphatic "t" — heavier, darker version of English "t". Tongue tip touches the ridge behind upper teeth with back of tongue lowered.', uaeWord: 'طيران (tayaraan — aviation, as in Etihad Airways)', practice: 'Say "t" but flatten your tongue and make it sound heavy. Compare "tin" (English) with "طين" (clay).' },
  { letter: 'ظ', name: 'Dhaa', ipa: 'ðˤ', desc: 'Emphatic "th" (as in "the") — heavier version with tongue between teeth and emphasis.', uaeWord: 'ظبي (dhabi — gazelle, as in Abu Dhabi)', practice: 'Say "the" but make it deep and heavy. Abu Dhabi literally means "Father of the Gazelle" — ظبي.' },
  { letter: 'ق', name: 'Qaaf', ipa: 'q', desc: 'Deep "k" sound from the very back of the throat, further back than English "k".', uaeWord: 'قطر (qatar — neighbouring country)', practice: 'Say "k" but from your uvula, not your soft palate. It sounds like a deeper, heavier "k".' },
  { letter: 'ه', name: 'Haa (light)', ipa: 'h', desc: 'Similar to English "h" but can appear in all word positions (English "h" is only at the start).', uaeWord: 'هلا (hala — welcome, Emirati greeting)', practice: 'Same as English "h" in "hello" — but practise hearing it in the middle and end of words too.' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// ENGLISH PHONEMES that Arabic speakers struggle with
// ═══════════════════════════════════════════════════════════════════════════════

export const ENGLISH_HARD_FOR_ARABIC = [
  { sound: 'p', issue: 'Arabic has no "p" — students say "b" instead', examples: ['park → bark', 'pen → ben', 'pilot → bilot', 'pizza → bizza'], fix: 'Hold a tissue in front of your lips. Say "p" — the tissue should move. Say "b" — it shouldn\'t. The puff of air is the difference.', uaeExample: '"I\'m going to the bark" should be "I\'m going to the park" — practise with Dubai parks: Zabeel Park, Creek Park.' },
  { sound: 'v', issue: 'Arabic has no "v" — students say "f" instead', examples: ['very → fery', 'village → fillage', 'video → fideo'], fix: 'Put your top teeth on your bottom lip. Vibrate — that\'s "v". If you blow without vibration, that\'s "f". Feel the buzz in your lip.', uaeExample: 'Visa, Valet parking, Victory — all common words in Dubai that need the "v" sound.' },
  { sound: 'short vowels', issue: 'Arabic has only 3 vowels (a, i, u). English has 12+ vowel sounds.', examples: ['bit vs beat vs bat vs bet vs but vs bot', 'ship vs sheep', 'pull vs pool'], fix: 'English vowels are about mouth shape and tongue position. Use mirrors — watch your mouth change shape between "bit" (short) and "beat" (long).', uaeExample: 'Desert (صحراء — sandy) vs dessert (حلويات — sweet) — one vowel sound changes meaning.' },
  { sound: 'th (θ/ð)', issue: 'Arabic has ث and ذ but students often can\'t connect them to English "th"', examples: ['think, three, through (voiceless θ)', 'the, this, that (voiced ð)'], fix: 'Good news — Arabic speakers already know both sounds! ث = voiceless th (think). ذ = voiced th (the). Just connect the Arabic letter to the English spelling.', uaeExample: 'The — used thousands of times daily. "The Mall of the Emirates", "The Dubai Mall".' },
  { sound: 'r vs l', issue: 'Arabic has both but English "r" is different — tongue curls back, doesn\'t tap', examples: ['right vs light', 'read vs lead', 'rain vs lane'], fix: 'English "r": tongue curls back, doesn\'t touch the roof. Arabic "r" (ر) taps the roof. Practise the English "r" by saying "rrr" like a motor — tongue pulled back.', uaeExample: 'Ras Al Khaimah — "Ras" uses Arabic ر. "Right turn" uses English r. Different tongue positions.' },
  { sound: 'ng (ŋ)', issue: 'Doesn\'t exist in Arabic — students add a hard "g" after it', examples: ['sing → sing-g', 'running → running-g', 'thing → thing-g'], fix: 'Say "sing" and hold the last sound. Your tongue is touching the back of your mouth. That\'s "ng" — don\'t release it into a "g".', uaeExample: 'Shopping, parking, swimming — all common Dubai activities. The "-ing" ending should fade out, not punch a "g".' },
  { sound: 'ch vs sh', issue: 'Arabic has ش (sh) but no "ch" — students may confuse them', examples: ['chair vs share', 'cheap vs sheep', 'watch vs wash'], fix: '"ch" starts with your tongue touching the roof (like "t") then releases into "sh". Think: "ch" = "t" + "sh" combined quickly.', uaeExample: 'Cheese vs she — "Would you like some cheese?" practise at the Dubai supermarket.' },
  { sound: 'cluster consonants', issue: 'Arabic doesn\'t start words with consonant clusters — students add a vowel', examples: ['street → istreet', 'school → iskool', 'sport → isport'], fix: 'Practise blending: s-t-r-eet. Start slowly, then speed up. Arabic speakers instinctively add "i" before clusters — catch yourself doing it.', uaeExample: 'Street, school, sport — all daily words in Dubai English.' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// BILINGUAL LETTER-SOUND MAPPINGS
// ═══════════════════════════════════════════════════════════════════════════════

export const BILINGUAL_MAPPINGS = [
  { arabic: 'ب', english: 'b', note: 'Almost identical' },
  { arabic: 'ت', english: 't', note: 'Similar — Arabic ت is dental, English t is alveolar' },
  { arabic: 'ث', english: 'th (think)', note: 'Same sound — connect ث to "th"' },
  { arabic: 'ج', english: 'j', note: 'Similar in Gulf Arabic (some dialects use "g")' },
  { arabic: 'د', english: 'd', note: 'Similar — Arabic is dental' },
  { arabic: 'ذ', english: 'th (the)', note: 'Same sound — connect ذ to voiced "th"' },
  { arabic: 'ر', english: 'r', note: 'Different! Arabic ر taps, English r curls back' },
  { arabic: 'ز', english: 'z', note: 'Almost identical' },
  { arabic: 'س', english: 's', note: 'Almost identical' },
  { arabic: 'ش', english: 'sh', note: 'Almost identical — ش = "sh" in "ship"' },
  { arabic: 'ف', english: 'f', note: 'Almost identical' },
  { arabic: 'ك', english: 'k', note: 'Almost identical' },
  { arabic: 'ل', english: 'l', note: 'Almost identical' },
  { arabic: 'م', english: 'm', note: 'Identical' },
  { arabic: 'ن', english: 'n', note: 'Identical' },
  { arabic: 'و', english: 'w', note: 'Similar — و is also a vowel in Arabic' },
  { arabic: 'ي', english: 'y', note: 'Similar — ي is also a vowel in Arabic' },
  { arabic: '—', english: 'p', note: 'NO Arabic equivalent — must learn fresh' },
  { arabic: '—', english: 'v', note: 'NO Arabic equivalent — must learn fresh' },
  { arabic: '—', english: 'ch', note: 'NO Arabic equivalent — must learn fresh' },
  { arabic: '—', english: 'g (as in go)', note: 'NO Arabic equivalent in MSA (exists in Gulf dialect)' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// UAE-SPECIFIC EXAMPLE WORDS
// ═══════════════════════════════════════════════════════════════════════════════

export const UAE_PHONICS_WORDS = {
  arabicForEnglishSpeakers: [
    { word: 'دبي', transliteration: 'Dubai', sounds: 'd-u-b-a-y', note: 'Students already know this word — use it to teach Arabic letter sounds' },
    { word: 'أبوظبي', transliteration: 'Abu Dhabi', sounds: 'a-b-u-ظ-a-b-i', note: 'Contains emphatic ظ (dhaa) — "Father of the Gazelle"' },
    { word: 'خليفة', transliteration: 'Khalifa', sounds: 'خ-a-l-ee-f-a', note: 'Contains خ (khaa) — as in Burj Khalifa' },
    { word: 'مجلس', transliteration: 'Majlis', sounds: 'm-a-j-l-i-s', note: 'Traditional Emirati sitting room — familiar cultural word' },
    { word: 'فلج', transliteration: 'Falaj', sounds: 'f-a-l-a-j', note: 'Traditional water channel — UAE heritage word' },
    { word: 'سوق', transliteration: 'Souq', sounds: 's-oo-q', note: 'Contains ق (qaaf) — traditional market' },
    { word: 'شكراً', transliteration: 'Shukran', sounds: 'sh-u-k-r-a-n', note: '"Thank you" — students hear this daily' },
    { word: 'مرحبا', transliteration: 'Marhaba', sounds: 'm-a-r-ح-a-b-a', note: 'Contains ح (haa) — "Welcome"' },
    { word: 'هلا', transliteration: 'Hala', sounds: 'h-a-l-a', note: 'Emirati greeting — informal "hello"' },
    { word: 'عيد', transliteration: 'Eid', sounds: 'ع-ee-d', note: 'Contains ع (ayn) — celebration/festival' },
  ],
  englishForArabicSpeakers: [
    { word: 'Park', sounds: 'p-ar-k', trap: 'p not b — puff of air', uaeContext: 'Zabeel Park, Creek Park' },
    { word: 'Very', sounds: 'v-e-r-y', trap: 'v not f — feel the buzz', uaeContext: '"Very good" — teacher praise' },
    { word: 'Purple', sounds: 'p-ur-p-le', trap: 'Two p sounds — double practice', uaeContext: 'Purple line on Dubai Metro' },
    { word: 'Village', sounds: 'v-i-ll-age', trap: 'v not f, -age not -aj', uaeContext: 'Global Village Dubai' },
    { word: 'Shopping', sounds: 'sh-o-pp-ing', trap: '-ing fades out, no hard g', uaeContext: 'Dubai Mall, Mall of the Emirates' },
    { word: 'Swimming', sounds: 's-w-i-mm-ing', trap: 'sw cluster, -ing ending', uaeContext: 'Swimming pool, beach swimming' },
    { word: 'Street', sounds: 's-t-r-ee-t', trap: 'str cluster — no "i" before it', uaeContext: 'Sheikh Zayed Street' },
    { word: 'School', sounds: 's-k-oo-l', trap: 'sk cluster — no "i" before it', uaeContext: 'Going to school — daily routine' },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// STARKY PHONICS TEACHING METHOD — Bilingual
// ═══════════════════════════════════════════════════════════════════════════════

export const STARKY_BILINGUAL_PHONICS_METHOD = {
  principles: [
    'BRIDGE, don\'t start from scratch — Arabic speakers already know 17+ sounds that exist in English. Start with what they know.',
    'Use UAE context ALWAYS — Dubai landmarks, Emirati culture, daily life in the UAE. Never use abstract or unfamiliar examples.',
    'Teach the GAP sounds first — p, v, ch, ng, consonant clusters. These are the sounds that cause communication breakdown.',
    'Mirror technique — ask students to watch their mouth in a mirror or phone camera. Sounds are physical — seeing helps.',
    'Contrast pairs — teach "p" by comparing with "b" they already know. Minimal pairs: park/bark, pig/big, cap/cab.',
    'No shame ever — pronunciation errors are normal for bilingual learners. Celebrate attempts. Never mock.',
    'Arabic script alongside — for English speakers learning Arabic sounds, always show the Arabic letter. Visual anchor helps.',
    'Rhythm and music — Arabic and English have different prosody. Use songs, chants, and rhythmic repetition.',
  ],
  sessionStructure: {
    opening: 'Starky greets in both languages: "Marhaba! Hello! Today we\'re learning..."',
    warmup: '2 minutes: review sounds learned in previous session. Quick-fire: Starky says a word, student identifies the target sound.',
    newSound: '5 minutes: introduce one new sound. Show mouth position. Give 5 UAE-context example words. Student repeats each.',
    practice: '10 minutes: interactive exercises — minimal pairs, word sorting, sentence reading with target sound highlighted.',
    game: '5 minutes: fun activity — sound bingo, word building, tongue twisters with UAE words.',
    cooldown: '3 minutes: review what was learned. Celebrate progress. Preview next session.',
  },
};

/**
 * Get UAE phonics system prompt for Starky.
 */
export function getUAEPhonicsPrompt(track) {
  let prompt = `\nUAE BILINGUAL PHONICS — Teaching Arabic↔English sounds.\n`;
  prompt += `\nMethod: ${STARKY_BILINGUAL_PHONICS_METHOD.principles.slice(0, 4).join('. ')}.`;
  prompt += `\nSession structure: ${STARKY_BILINGUAL_PHONICS_METHOD.sessionStructure.opening} → ${STARKY_BILINGUAL_PHONICS_METHOD.sessionStructure.newSound.split(':')[0]} → ${STARKY_BILINGUAL_PHONICS_METHOD.sessionStructure.practice.split(':')[0]} → ${STARKY_BILINGUAL_PHONICS_METHOD.sessionStructure.game.split(':')[0]}.`;

  if (track === 'arabic') {
    prompt += `\n\nTRACK: Arabic Phonics for English speakers.`;
    prompt += `\nFocus on sounds that don\'t exist in English: ${ARABIC_UNIQUE_SOUNDS.slice(0, 5).map(s => `${s.letter} (${s.name})`).join(', ')}.`;
    prompt += `\nUse UAE words: ${UAE_PHONICS_WORDS.arabicForEnglishSpeakers.slice(0, 5).map(w => w.transliteration).join(', ')}.`;
    prompt += `\nAlways show Arabic script alongside transliteration. Teach mouth position for each sound.`;
  } else {
    prompt += `\n\nTRACK: English Phonics for Arabic speakers.`;
    prompt += `\nFocus on GAP sounds: ${ENGLISH_HARD_FOR_ARABIC.slice(0, 4).map(s => `${s.sound} (${s.issue.split('—')[0].trim()})`).join(', ')}.`;
    prompt += `\nUse UAE context: ${UAE_PHONICS_WORDS.englishForArabicSpeakers.slice(0, 5).map(w => `${w.word} (${w.trap})`).join(', ')}.`;
    prompt += `\nUse minimal pairs for contrast. Tissue test for p/b. Mirror for mouth position.`;
  }

  return prompt;
}

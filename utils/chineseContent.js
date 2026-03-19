/**
 * chineseContent.js
 * Mandarin Chinese content for the languages page.
 * To be integrated into LANG data in languages.jsx.
 */

// Chinese destination
export const CHINESE_DEST = {
  id: 'beijing', name: 'Beijing', country: 'China', flag: '\u{1F1E8}\u{1F1F3}',
  lang: 'Mandarin Chinese', lc: 'zh', tagline: 'History, tech & culture', col: '#C0392B',
};

// Voice code for TTS
export const CHINESE_VOICE = { zh: 'zh-CN' };

export const CHINESE_LANG = {
  name: 'Mandarin Chinese', flag: '\u{1F1E8}\u{1F1F3}',
  culture: [
    { icon: '\u{1F962}', tip: 'Never stick chopsticks upright in rice \u2014 it resembles funeral incense and is deeply disrespectful.' },
    { icon: '\u{1F375}', tip: 'Tap two fingers on the table when someone pours you tea \u2014 this is a silent "thank you" gesture.' },
    { icon: '\u{1F9E7}', tip: 'Red envelopes (\u7EA2\u5305 h\u00F3ngb\u0101o) with money are given during festivals and celebrations. Never open one in front of the giver.' },
    { icon: '\u{1F4B0}', tip: 'Bargaining is expected in markets but NEVER in restaurants or modern shops.' },
  ],
  grammar: [
    { point: 'No verb conjugation!', example: '\u6211\u53BB (w\u01D2 q\u00F9) = I go \u00B7 \u4ED6\u53BB (t\u0101 q\u00F9) = He go \u00B7 Same verb always', note: 'Chinese verbs never change form. No tenses, no conjugations. Time is shown with words like \u660E\u5929 (tomorrow), \u6628\u5929 (yesterday).' },
    { point: 'Tones change meaning', example: 'm\u0101 = mother \u00B7 m\u00E1 = hemp \u00B7 m\u01CE = horse \u00B7 m\u00E0 = scold', note: 'Mandarin has 4 tones. Same syllable with different tone = completely different word. Practice is essential.' },
    { point: 'Measure words before nouns', example: '\u4E00\u4E2A\u4EBA (y\u00ED g\u00E8 r\u00E9n) = one [measure word] person', note: 'You can\u2019t say "one person" directly. You need a measure word between the number and noun. \u4E2A (g\u00E8) is the most common.' },
  ],
  emergency: [
    { icon: '\u{1F198}', phrase: '\u6551\u547D\uFF01', trans: 'Help!', cat: 'Emergency' },
    { icon: '\u{1F691}', phrase: '\u53EB\u6551\u62A4\u8F66', trans: 'Call an ambulance', cat: 'Emergency' },
    { icon: '\u{1F46E}', phrase: '\u53EB\u8B66\u5BDF', trans: 'Call the police', cat: 'Emergency' },
    { icon: '\u{1F3E5}', phrase: '\u533B\u9662\u5728\u54EA\u91CC\uFF1F', trans: 'Where is the hospital?', cat: 'Medical' },
    { icon: '\u{1F48A}', phrase: '\u6211\u9700\u8981\u770B\u533B\u751F', trans: 'I need a doctor', cat: 'Medical' },
    { icon: '\u{1F687}', phrase: '\u5730\u94C1\u7AD9\u5728\u54EA\u91CC\uFF1F', trans: 'Where is the metro?', cat: 'Transport' },
    { icon: '\u{1F3E8}', phrase: '\u6211\u6709\u9884\u5B9A', trans: 'I have a reservation', cat: 'Hotel' },
    { icon: '\u{1F4B3}', phrase: '\u53EF\u4EE5\u5237\u5361\u5417\uFF1F', trans: 'Can I pay by card?', cat: 'Payment' },
    { icon: '\u2753', phrase: '\u6211\u8FF7\u8DEF\u4E86', trans: 'I am lost', cat: 'Directions' },
    { icon: '\u{1F504}', phrase: '\u8BF7\u518D\u8BF4\u4E00\u904D', trans: 'Please say it again', cat: 'Communication' },
  ],
  convos: [
    {
      id: 'restaurant', icon: '\u{1F35C}', title: 'At a Chinese restaurant',
      npc: { name: 'Wei', role: 'Waiter', emoji: '\u{1F468}\u200D\u{1F373}' },
      turns: [
        { npc: '\u6B22\u8FCE\u5149\u4E34\uFF01\u51E0\u4F4D\uFF1F', npc_tr: 'Welcome! How many people?', choices: [
          { text: '\u4E24\u4F4D\uFF0C\u8C22\u8C22', tr: 'Two people, thank you', q: 5 },
          { text: '\u4E00\u4E2A\u4EBA', tr: 'One person', q: 4 },
          { text: 'Two please', tr: '(in English)', q: 1 },
        ]},
        { npc: '\u60F3\u5403\u70B9\u4EC0\u4E48\uFF1F', npc_tr: 'What would you like to eat?', choices: [
          { text: '\u6765\u4E00\u4EFD\u7092\u996D\uFF0C\u8C22\u8C22', tr: 'Fried rice please, thank you', q: 5 },
          { text: '\u6709\u4EC0\u4E48\u63A8\u8350\uFF1F', tr: 'What do you recommend?', q: 5 },
          { text: '\u83DC\u5355\uFF0C\u8C22\u8C22', tr: 'Menu, thank you', q: 3 },
        ]},
        { npc: '\u4E00\u517160\u5143\u3002', npc_tr: 'That\'s 60 yuan total.', choices: [
          { text: '\u597D\u7684\uFF0C\u8C22\u8C22\uFF01', tr: 'OK, thank you!', q: 5 },
          { text: '\u53EF\u4EE5\u5237\u5361\u5417\uFF1F', tr: 'Can I pay by card?', q: 4 },
          { text: '\u592A\u8D35\u4E86', tr: 'Too expensive', q: 2 },
        ]},
      ],
    },
  ],
  placementTest: [
    { q: 'What does "\u4F60\u597D" (n\u01D0 h\u01CEo) mean?', opts: ['Goodbye', 'Hello', 'Thank you', 'Sorry'], ans: 'Hello', lvl: 'A1' },
    { q: 'How do you say "thank you" in Chinese?', opts: ['\u8C22\u8C22 (xi\u00E8xie)', '\u4F60\u597D (n\u01D0 h\u01CEo)', '\u518D\u89C1 (z\u00E0iji\u00E0n)', '\u5BF9\u4E0D\u8D77 (du\u00ECbuq\u01D0)'], ans: '\u8C22\u8C22 (xi\u00E8xie)', lvl: 'A1' },
    { q: 'What does "\u591A\u5C11\u94B1" mean?', opts: ['Where is it?', 'How much?', 'What time?', 'How are you?'], ans: 'How much?', lvl: 'A2' },
    { q: '"I" in Chinese is:', opts: ['\u4F60 (n\u01D0)', '\u6211 (w\u01D2)', '\u4ED6 (t\u0101)', '\u5979 (t\u0101)'], ans: '\u6211 (w\u01D2)', lvl: 'A2' },
    { q: 'What tone is "\u5988" (m\u0101, mother)?', opts: ['1st tone (flat)', '2nd tone (rising)', '3rd tone (dip)', '4th tone (falling)'], ans: '1st tone (flat)', lvl: 'B1' },
  ],
  scenarios: [
    {
      id: 1, icon: '\u2708\uFE0F', place: '\u5728\u673A\u573A', title: 'At the airport',
      sub: 'Greetings, passport, directions', xp: 15, done: false, current: true,
      ex: [
        { type: 'tap', q: 'What does "\u4F60\u597D" mean?', word: '\u4F60\u597D', emoji: '\u{1F44B}', opts: ['Goodbye', 'Hello', 'Thank you', 'Sorry'], ans: 'Hello' },
        { type: 'listen', q: 'Listen and choose what you heard:', speak_word: '\u6211\u7684\u62A4\u7167', emoji: '\u{1F4D8}', opts: ['My passport', 'My ticket', 'My bag', 'My phone'], ans: 'My passport' },
        { type: 'build', q: 'Say "Hello, my name is..."', hint: '\u4F60\u597D \u6211\u53EB', words: ['\u4F60\u597D', '\u6211\u53EB', '\u8C22\u8C22', '\u518D\u89C1'], ans: '\u4F60\u597D \u6211\u53EB', tr: 'Hello, my name is...' },
        { type: 'speak', q: 'Say "\u4F60\u597D" (Hello)', word: '\u4F60\u597D', tr: 'Hello', emoji: '\u{1F44B}' },
      ],
    },
    {
      id: 2, icon: '\u{1F35C}', place: '\u5728\u9910\u5385', title: 'At a restaurant',
      sub: 'Ordering food, numbers, payment', xp: 20, done: false, locked: false,
      ex: [
        { type: 'tap', q: 'The waiter says "\u6B22\u8FCE" \u2014 what does it mean?', word: '\u6B22\u8FCE', emoji: '\u{1F44B}', opts: ['Goodbye', 'Welcome', 'Thank you', 'Menu'], ans: 'Welcome' },
        { type: 'listen', q: 'Listen and choose:', speak_word: '\u83DC\u5355\uFF0C\u8C22\u8C22', emoji: '\u{1F4CB}', opts: ['The menu please', 'The bill please', 'More water', 'Delicious'], ans: 'The menu please' },
        { type: 'match', q: 'Match each Chinese phrase:', pairs: [['\u8C22\u8C22', 'Thank you'], ['\u83DC\u5355', 'Menu'], ['\u591A\u5C11\u94B1', 'How much?'], ['\u597D\u5403', 'Delicious']] },
        { type: 'speak', q: 'Say "\u8C22\u8C22" (Thank you)', word: '\u8C22\u8C22', tr: 'Thank you', emoji: '\u{1F64F}' },
      ],
    },
    { id: 3, icon: '\u{1F5FA}\uFE0F', place: '\u5728\u8857\u4E0A', title: 'Asking directions', sub: 'Left, right, metro, landmarks', xp: 20, done: false, locked: true },
    { id: 4, icon: '\u{1F3E8}', place: '\u5728\u9152\u5E97', title: 'Hotel check-in', sub: 'Booking, room, amenities', xp: 20, done: false, locked: true },
    { id: 5, icon: '\u{1F6D2}', place: '\u5728\u5E02\u573A', title: 'At the market', sub: 'Prices, bargaining, payment', xp: 20, done: false, locked: true },
    { id: 6, icon: '\u{1F91D}', place: '\u4EA4\u670B\u53CB', title: 'Making friends', sub: 'Introductions, hobbies, small talk', xp: 25, done: false, locked: true },
  ],
  pb: [
    { p: '\u4F60\u597D', t: 'Hello', c: 1, ease: 2.5, interval: 0, due: 0, reps: 0 },
    { p: '\u8C22\u8C22', t: 'Thank you', c: 1, ease: 2.5, interval: 0, due: 0, reps: 0 },
    { p: '\u518D\u89C1', t: 'Goodbye', c: 1, ease: 2.5, interval: 0, due: 0, reps: 0 },
    { p: '\u5BF9\u4E0D\u8D77', t: 'Sorry', c: 1, ease: 2.5, interval: 0, due: 0, reps: 0 },
    { p: '\u591A\u5C11\u94B1\uFF1F', t: 'How much?', c: 1, ease: 2.5, interval: 0, due: 0, reps: 0 },
    { p: '\u6211\u4E0D\u61C2', t: 'I don\'t understand', c: 1, ease: 2.5, interval: 0, due: 0, reps: 0 },
  ],
};

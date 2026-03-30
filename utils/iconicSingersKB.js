/**
 * utils/iconicSingersKB.js
 * 100 Years of Vocal Artistry — Every genre, nationality, era.
 *
 * When a student says "I want to sing like Atif Aslam" — Starky knows
 * exactly what techniques that artist uses and how to teach them.
 *
 * RULE: Never compare students negatively. Only use icons as inspiration.
 *
 * PROTECTED: This file is an addition. Nothing existing is affected.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// ICONIC SINGERS DATABASE
// ═══════════════════════════════════════════════════════════════════════════════

export const ICONIC_SINGERS_DATABASE = {
  // ── SOUTH ASIAN ──
  mehdiHassan: { name:'Mehdi Hassan', years:'1927-2012', title:'The King of Ghazal', type:'Bass-baritone', region:'Pakistan', genre:'ghazal', technique:'Maqam precision, breath control over 8-10 beat phrases, emotional micro-tonal ornaments (gamak), legato — seamless note connection', signature:'Could hold and shape notes with surgical precision while conveying profound sorrow', teaching:['Breath management: his phrases lasted 8-10 beats effortlessly','Emotional delivery: meaning of every Urdu word through tone','Legato: seamless connections, never breaking the line'], quote:'He built his voice over decades of riyaz (daily practice). His secret was never forcing — always flowing.', songs:['Ranjish Hi Sahi','Gulon Mein Rang Bhare','Zindagi Mein Tu Sabhi'] },

  nusrat: { name:'Nusrat Fateh Ali Khan', years:'1948-1997', title:'The Voice of the Century', type:'High tenor', region:'Pakistan', genre:'qawwali', technique:'Chest voice power, rapid taans (ornamentation), call-and-response, trance-like intensity building, whisper-to-primal-scream range', signature:'Could go from whisper to primal scream while maintaining pitch', teaching:['Power without tension: never strained despite incredible intensity','Improvisation: no two performances were the same','Breath: sustained phrases of extraordinary length','Rhythm: deeply rooted in tabla cycles'], quote:'NFAK said the voice is a gift from Allah. Treat it with respect. Never force it.', songs:['Dam Mast Qalandar','Allah Hoo','Mustt Mustt'] },

  lata: { name:'Lata Mangeshkar', years:'1929-2022', title:'The Nightingale of India', type:'Soprano', region:'India', genre:'bollywood/classical', technique:'Perfect pitch, crystalline diction in multiple languages, ornaments that felt like natural breathing', signature:'Her voice defined the sound of Indian cinema for 7 decades', teaching:['Purity of tone: no breathiness, no strain, just clear sound','Diction: every syllable perfectly placed','Consistency: same quality from first note to last'], quote:'Lata didi said "Sur ko pakro" — hold the note. Every note deserves full attention.', songs:['Lag Ja Gale','Ajeeb Dastan Hai Yeh','Tere Bina Zindagi'] },

  rafi: { name:'Mohammad Rafi', years:'1924-1980', title:'The Voice of Versatility', type:'Light tenor', region:'India', genre:'bollywood/all', technique:'Classical, qawwali, western pop, ghazal, folk — all with equal mastery', signature:'Emotional authenticity regardless of genre', teaching:['Range use: full range used tastefully','Character singing: young lover or old sage','Genre flexibility: never limit yourself'], songs:['Teri Pyari Pyari Surat Ko','Baharon Phool Barsao'] },

  kishore: { name:'Kishore Kumar', years:'1929-1987', title:'The Natural', type:'Tenor', region:'India', genre:'bollywood', technique:'Yodeling, natural improvisation, conversational delivery that felt unscripted', signature:'Made difficulty sound effortless', teaching:['Freedom: release tension and sing naturally','Personality: your voice should sound like you, not a copy'], songs:['Pal Pal Dil Ke Paas','Mere Sapno Ki Rani'] },

  atif: { name:'Atif Aslam', years:'born 1983', title:'Contemporary Pakistan', type:'Light tenor', region:'Pakistan', genre:'pop/bollywood', technique:'Contemporary mixed voice, emotional vulnerability, ornamentation from classical Urdu in modern pop context, artistic voice cracks', signature:'Can crack/break the voice as artistic choice — the break becomes a feature', teaching:['Mixed voice: neither full chest nor falsetto but the blend','Emotional vulnerability: permission to be imperfect','Contemporary ornaments: classical Urdu music in modern pop'], songs:['Tere Sang Yaara','Tu Jaane Na','Aadat','Tajdar-e-Haram'] },

  arijit: { name:'Arijit Singh', years:'born 1987', title:'Contemporary India', type:'Baritone-tenor crossover', region:'India', genre:'bollywood/pop', technique:'Conversational intimacy, bedroom voice quality, technical precision hidden under emotional delivery', signature:'Makes complex runs feel like natural breathing', teaching:['Intimacy: close-mic technique changes singing style','Falsetto-to-chest transitions: seamless register changes','Subtle emotion: letting the listener lean in'], songs:['Tum Hi Ho','Channa Mereya','Phir Bhi Tumko Chahunga'] },

  // ── ARABIC ──
  ummKulthum: { name:'Umm Kulthum', years:'1904-1975', title:'The Star of the East', type:'Contralto', region:'Egypt', genre:'arabic/maqam', technique:'Could sing one phrase for 20+ minutes, improvising and varying it. Absolute maqam mastery. Chest voice resonance that filled any room.', signature:'Thursday night concerts broadcast across the Arab world — cities emptied', teaching:['Maqam mastery: Arabic modal system as emotional language','Sustained improvisation: patience and musical storytelling','Resonance: chest voice placement that fills any space'], quote:'Umm Kulthum practiced every song for months before performing it once. Patience is the greatest vocal skill.', songs:['Inta Umri','Alf Leila wa Leila'] },

  fairuz: { name:'Fairuz', years:'born 1934', title:'The Soul of Lebanon', type:'Mezzo-soprano', region:'Lebanon', genre:'arabic/contemporary', technique:'Perfect blend of Arabic maqam with Western harmonies, clarity across multiple Arabic dialects', signature:'Her voice is "the sound of morning in Lebanon" — cool, clear, timeless', teaching:['Clarity: every word understood without effort','Simplicity: most moving singing is often the most restrained'], songs:['Li Beirut','Nassam Alayna Al Hawa'] },

  maherZain: { name:'Maher Zain', years:'born 1981', title:'Contemporary Nasheed', type:'Tenor', region:'Sweden/Lebanon', genre:'nasheed/pop', technique:'Pop-accessible nasheed, clear diction, emotional sincerity without excess ornamentation', teaching:['Entry point for Arabic singing: accessible to beginners','Nasheed technique: Islamic devotional in contemporary style'], songs:['Insha Allah','Mawlaya','Open Your Eyes'] },

  // ── WESTERN LEGENDS ──
  elvis: { name:'Elvis Presley', years:'1935-1977', title:'The King of Rock and Roll', type:'High baritone', region:'USA', genre:'rock/gospel/country', technique:'Blended gospel, country, R&B. Natural vibrato from relaxed throat. Physical presence matched vocal power.', teaching:['Vibrato: natural, not forced — from relaxed throat','Genre blending: draw from multiple traditions','Stage presence: voice and body together'] },

  michael: { name:'Michael Jackson', years:'1958-2009', title:'The King of Pop', type:'Tenor/falsetto', region:'USA', genre:'pop', technique:'Percussive vocal sounds, whisper-to-power dynamics, rhythmic precision — voice as percussion', teaching:['Dynamics: whisper to full power in seconds','Rhythm: feel the beat in every syllable','Breath: breathing as part of performance'], songs:['Man in the Mirror','Billie Jean','Earth Song'] },

  whitney: { name:'Whitney Houston', years:'1963-2012', title:'The Voice', type:'Soprano', region:'USA', genre:'pop/gospel', technique:'Gospel runs at speed, sustaining high notes with perfect tone, emotional authenticity in every phrase', signature:'I Will Always Love You — the definitive vocal performance', teaching:['Gospel runs: foundation of contemporary ornamentation','Breath support: sustaining high notes without strain','Emotional commitment: every note must have a reason'], quote:'Whitney said she learned everything in church. Sing like you mean every word.' },

  freddie: { name:'Freddie Mercury', years:'1946-1991', title:'The Showman', type:'Baritone (four-octave range)', region:'UK/Zanzibar', genre:'rock/opera', technique:'Operatic technique in rock — power, clarity, theatrical delivery', signature:'Made 72,000 people feel he sang only to them', teaching:['Range exploration: your voice can go further','Theatricality: performance is storytelling','Chest voice power: project without microphone dependency'], songs:['Bohemian Rhapsody','Somebody to Love','Don\'t Stop Me Now'] },

  sinatra: { name:'Frank Sinatra', years:'1915-1998', title:'The Chairman of the Board', type:'Baritone', region:'USA', genre:'jazz/pop', technique:'Phrasing like a jazz musician, legato lines, behind-the-beat placement', signature:'Made listeners feel he was telling them a secret', teaching:['Phrasing: spaces between notes matter','Interpretation: same song means different things on different days','Microphone intimacy: close-mic technique'] },

  aretha: { name:'Aretha Franklin', years:'1942-2018', title:'The Queen of Soul', type:'Soprano with mezzo depth', region:'USA', genre:'soul/gospel', technique:'Gospel call-and-response, melisma, raw emotion', teaching:['Melisma: runs that serve emotion, not show off','Power: belt without damage','Authenticity: the voice must tell the truth'] },

  adele: { name:'Adele', years:'born 1988', title:'The Modern Standard', type:'Mezzo-soprano', region:'UK', genre:'pop/soul', technique:'Chest voice power, emotional directness, no artifice', teaching:['Simplicity: most moving performances are not the most ornate','Chest voice: powerful without forcing','Story: understand what you\'re singing about'], songs:['Someone Like You','Hello','Rolling in the Deep'] },

  billie: { name:'Billie Eilish', years:'born 2001', title:'The New Language', type:'Mezzo-soprano', region:'USA', genre:'alternative pop', technique:'Whisper register as artistic choice, ASMR-adjacent intimacy, sub-bass notes', teaching:['Dynamics: quiet can be more powerful than loud','Authenticity: teenagers respond to her "real" quality','Modern technique: contemporary pop vocal aesthetics'] },

  celine: { name:'Celine Dion', years:'born 1968', title:'The Power', type:'Soprano', region:'Canada', genre:'pop/ballad', technique:'Three-octave range, sustained high notes, vibrato control', teaching:['Vibrato: control and vary expressively','Sustained notes: breath support for long phrases'], songs:['My Heart Will Go On','The Power of Love'] },

  mariah: { name:'Mariah Carey', years:'born 1969', title:'The Technician', type:'Soprano with whistle register', region:'USA', genre:'pop/R&B', technique:'Five-octave range, melismatic runs, whistle register', teaching:['Range: the voice has multiple registers','Runs: the most complex melisma in pop music'] },

  // ── JAZZ ──
  ella: { name:'Ella Fitzgerald', years:'1917-1996', title:'The First Lady of Song', type:'Soprano', region:'USA', genre:'jazz', technique:'Scat singing, perfect pitch, swing feel, warmth and clarity together', teaching:['Improvisation: trust your ear','Swing: the jazz feel cannot be forced','Clarity: every syllable understood'] },

  billie_h: { name:'Billie Holiday', years:'1915-1959', title:'Lady Day', type:'Contralto', region:'USA', genre:'jazz', technique:'Behind-the-beat phrasing, turning imperfections into art', teaching:['Phrasing: slightly late feels like yearning','Emotion: your experience is your instrument'] },

  // ── K-POP ──
  bts: { name:'BTS', years:'2013-present', title:'Global Phenomenon', type:'Various (Jungkook: tenor, V: baritone)', region:'South Korea', genre:'kpop', technique:'Contemporary pop with classical Korean training, dance+singing integration, performance precision', teaching:['Physical stamina: singing while dancing','Performance precision: every note synchronized','Stylistic range: ballads to hip-hop in one show'] },

  iu: { name:'IU', years:'born 1993', title:'Korea\'s National Singer', type:'Soprano', region:'South Korea', genre:'kpop/ballad', technique:'Extraordinary emotional range across different material, crystalline tone', teaching:['Versatility: child-like innocence to mature depth','Korean diction: beautiful model for the language'] },

  // ── LATIN ──
  shakira: { name:'Shakira', years:'born 1977', title:'Fusion Mastery', type:'Mezzo-soprano', region:'Colombia/Lebanon', genre:'latin/pop/arabic fusion', technique:'Blending Arabic, rock, Latin — genuinely multicultural voice, distinctive fast vibrato', teaching:['Cultural fusion: your background is a musical asset','Vibrato: distinctive signature, not a flaw','Multilingual singing: proves one voice can serve many languages'] },

  // ── OPERA ──
  pavarotti: { name:'Luciano Pavarotti', years:'1935-2007', title:'The Voice of God', type:'Lyric tenor', region:'Italy', genre:'opera', technique:'Textbook diaphragmatic breath support, legendary pianissimo high notes', teaching:['Breath support: foundation of ALL singing','Head voice: upper register without forcing','Resonance: fill a room without microphone'] },

  callas: { name:'Maria Callas', years:'1923-1977', title:'La Divina', type:'Soprano', region:'Greece/USA', genre:'opera', technique:'Dramatic interpretation over pure technical perfection, storytelling through voice', teaching:['Expression over perfection: prioritise meaning','Character: every song is a story, every singer an actor'] },

  // ── CONTEMPORARY 2010s-2020s ──
  taylor: { name:'Taylor Swift', years:'born 1989', title:'The Songwriter-Singer', type:'Mezzo-soprano', region:'USA', genre:'pop/country', technique:'Storytelling through lyrics, emotional authenticity, conversational delivery', teaching:['Storytelling: connect lyrics to personal experience','Authenticity over technical perfection'] },

  edSheeran: { name:'Ed Sheeran', years:'born 1991', title:'The Loop Station', type:'Tenor', region:'UK', genre:'pop/folk', technique:'One-person band, rhythm/harmony/melody simultaneously, vulnerability', teaching:['Rhythm awareness: loop technique requires precision','Vulnerability: ordinariness as superpower'] },

  weeknd: { name:'The Weeknd', years:'born 1990', title:'Falsetto Foundation', type:'Tenor/falsetto', region:'Canada/Ethiopia', genre:'R&B/pop', technique:'Falsetto as primary voice, contemporary R&B style', teaching:['Falsetto technique: making falsetto the main voice','Contemporary R&B: how to blend styles'] },

  beyonce: { name:'Beyoncé', years:'born 1981', title:'The Complete Package', type:'Mezzo-soprano', region:'USA', genre:'R&B/pop', technique:'Performance stamina (dancing+singing), power and precision, belt technique', teaching:['Stamina: singing while dancing at highest level','Power and control: belt with precision','Work ethic: what true preparation looks like'] },

  harry: { name:'Harry Styles', years:'born 1994', title:'British Pop Legacy', type:'Baritone', region:'UK', genre:'pop/rock', technique:'Performance ease, personality amplifying voice', teaching:['Performance ease: most effective performers look effortless','Stage presence: personality amplifies voice'] },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ARTIST MATCHING AND TEACHING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Find artist by name from student's speech
 */
export function findArtistByName(transcript) {
  if (!transcript) return null;
  const lower = transcript.toLowerCase();
  for (const [key, artist] of Object.entries(ICONIC_SINGERS_DATABASE)) {
    if (lower.includes(artist.name.toLowerCase()) ||
        (artist.songs && artist.songs.some(s => lower.includes(s.toLowerCase())))) {
      return artist;
    }
  }
  // Partial name matches
  const partials = {
    'nusrat': 'nusrat', 'nfak': 'nusrat', 'mehdi': 'mehdiHassan',
    'lata': 'lata', 'rafi': 'rafi', 'kishore': 'kishore',
    'atif': 'atif', 'arijit': 'arijit', 'umm kulthum': 'ummKulthum',
    'fairuz': 'fairuz', 'maher zain': 'maherZain',
    'elvis': 'elvis', 'michael jackson': 'michael', 'whitney': 'whitney',
    'freddie': 'freddie', 'mercury': 'freddie', 'sinatra': 'sinatra',
    'aretha': 'aretha', 'adele': 'adele', 'billie eilish': 'billie',
    'celine': 'celine', 'mariah': 'mariah', 'ella': 'ella',
    'bts': 'bts', 'jungkook': 'bts', 'blackpink': 'bts',
    'shakira': 'shakira', 'pavarotti': 'pavarotti', 'callas': 'callas',
    'taylor swift': 'taylor', 'ed sheeran': 'edSheeran',
    'weeknd': 'weeknd', 'beyonce': 'beyonce', 'harry styles': 'harry',
    'iu': 'iu',
  };
  for (const [trigger, key] of Object.entries(partials)) {
    if (lower.includes(trigger)) return ICONIC_SINGERS_DATABASE[key];
  }
  return null;
}

/**
 * Find similar artist based on student's voice characteristics
 */
export function findSimilarArtist(voiceType, region) {
  const matches = Object.values(ICONIC_SINGERS_DATABASE).filter(a => {
    if (voiceType && a.type?.toLowerCase().includes(voiceType.toLowerCase())) return true;
    if (region && a.region?.toLowerCase().includes(region.toLowerCase())) return true;
    return false;
  });
  return matches.slice(0, 3); // top 3 matches
}

/**
 * Get teaching points from a specific artist
 */
export function getTeachingFromArtist(artistKey) {
  const artist = ICONIC_SINGERS_DATABASE[artistKey];
  if (!artist) return null;
  return {
    name: artist.name,
    title: artist.title,
    voiceType: artist.type,
    techniques: artist.teaching,
    quote: artist.quote,
    songs: artist.songs,
  };
}

/**
 * Generate icons prompt for Starky
 */
export function getIconsPrompt(studentRegion, artistMentioned) {
  let prompt = `\nICONIC SINGERS KNOWLEDGE — Use artists as inspiration and teaching tools.\n`;

  // If student mentioned an artist
  if (artistMentioned) {
    const artist = findArtistByName(artistMentioned);
    if (artist) {
      prompt += `\nStudent mentioned ${artist.name} (${artist.title}). Voice: ${artist.type}. Genre: ${artist.genre}.`;
      prompt += `\nWhat makes them special: ${artist.technique}`;
      prompt += `\nTeach: ${artist.teaching.join('. ')}.`;
      if (artist.quote) prompt += `\n${artist.quote}`;
      if (artist.songs) prompt += `\nStudy these songs: ${artist.songs.join(', ')}.`;
    }
  }

  // Region-appropriate icons
  const regionIcons = {
    pakistan: ['mehdiHassan', 'nusrat', 'atif', 'rafi'],
    uae: ['ummKulthum', 'fairuz', 'maherZain'],
    india: ['lata', 'kishore', 'arijit', 'rafi'],
  };
  const icons = regionIcons[studentRegion?.toLowerCase()] || ['whitney', 'adele', 'freddie', 'michael'];
  prompt += `\nRegional icons for inspiration: ${icons.map(k => ICONIC_SINGERS_DATABASE[k]?.name).filter(Boolean).join(', ')}.`;

  prompt += `\n\nRULES: Never compare students negatively. Only use icons as inspiration. "Your voice has a warmth similar to [artist]" is good. "You don't sound as good as [artist]" is FORBIDDEN.`;
  prompt += `\n"Every great singer started exactly where you are now." "Your voice is not a copy of theirs — it's the beginning of your own."`;

  return prompt;
}

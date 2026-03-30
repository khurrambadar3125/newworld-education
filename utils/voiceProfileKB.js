/**
 * utils/voiceProfileKB.js
 * Student Voice Profile Knowledge Base
 *
 * Enables Starky to build a deep, growing understanding of each student
 * through their voice. Acoustic features extracted via Web Audio API
 * build a profile that gets richer every session.
 *
 * PRIVACY: No raw audio stored. Only numerical features. Student can reset.
 *
 * PROTECTED: This file is an addition. Nothing existing is affected.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// ACOUSTIC EXTRACTION GUIDE — what to extract from every mic input
// ═══════════════════════════════════════════════════════════════════════════════

export const ACOUSTIC_EXTRACTION_GUIDE = {
  audioFeatures: {
    pitch_hz: { desc: 'Average fundamental frequency', ranges: { childFemale: '250-400Hz', childMale: '200-350Hz', adultFemale: '180-300Hz', adultMale: '100-180Hz' } },
    pitch_stability: { desc: 'Standard deviation of pitch — low = steady, high = wavering/nervous', unit: 'Hz' },
    volume_rms: { desc: 'Root mean square energy — proxy for confidence/projection', range: '0-1' },
    speech_rate_wpm: { desc: 'Words per minute from transcript length / duration' },
    pause_count: { desc: 'Number of pauses > 0.5 seconds' },
    pause_avg_duration: { desc: 'Average pause length in seconds' },
    articulation_rate: { desc: 'Syllables per second excluding pauses — pure speaking speed' },
    voice_brightness: { desc: 'High frequency energy ratio — bright voice vs warm/dark voice', range: '0-1' },
  },
  transcriptFeatures: {
    transcript: 'Full text of what was said',
    confidence: 'Web Speech API confidence score (0-1)',
    word_count: 'Total words spoken',
    sentence_count: 'Estimated from punctuation patterns',
    avg_sentence_length: 'Word count / sentence count',
    vocabulary_unique_ratio: 'Unique words / total words — lexical richness (0-1)',
    hesitation_markers: 'Count of "um", "uh", "er", "like", "you know"',
    self_corrections: 'Count of repeated words or mid-sentence restarts',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// VOICE PROFILE STRUCTURE — built incrementally over sessions
// ═══════════════════════════════════════════════════════════════════════════════

export const VOICE_PROFILE_SCHEMA = {
  sessions_recorded: 0,

  // Baseline — established in first 3 sessions
  baseline: {
    wpm: null,
    volume: null,
    pitch_hz: null,
    pause_rate: null,
    hesitation_rate: null,
    established: false,
  },

  // Confidence signature — how voice changes with confidence level
  confidence: {
    confident_wpm: null,
    uncertain_wpm: null,
    confident_volume: null,
    uncertain_volume: null,
    confident_pitch: null,
    uncertain_pitch: null,
  },

  // Language profile
  language: {
    likely_l1: null,
    english_fluency_trend: [],   // { session, wpm, vocab_richness }
    problem_sounds: [],          // { sound, count, last_session }
    vocabulary_growth: [],       // { session, unique_ratio }
  },

  // Learning style signals
  learningStyle: {
    best_time_of_day: null,      // 'morning' | 'afternoon' | 'evening'
    engagement_topics: [],       // topics where WPM + volume both high
    confusion_topics: [],        // topics where pauses increase, WPM drops
  },

  // Emotional baseline
  emotional: {
    avg_energy_level: null,
    excitement_markers: [],      // { topic, pitch_increase, volume_increase }
    anxiety_markers: [],         // { condition, hesitation_spike, wpm_drop }
  },

  // Wellbeing signals
  wellbeing: {
    last_5_sessions_energy: [],  // [ { session, volume_rms, wpm, pauses } ]
    concerning_drops: [],        // sessions where all metrics dropped together
  },

  // Growth tracking
  growth: {
    session_1_wpm: null,
    session_10_wpm: null,
    session_20_wpm: null,
    fluency_improvement_pct: null,
  },

  // Singing/performance (optional — if Voice Lab used)
  singing: {
    pitch_accuracy_pct: null,
    breath_control_score: null,
    rhythm_accuracy_pct: null,
    voice_classification: null,  // soprano, mezzo, contralto, tenor, baritone, bass, treble
    best_range_low_hz: null,
    best_range_high_hz: null,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIDENCE INFERENCE ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export const CONFIDENCE_INFERENCE = {
  signals: {
    high: {
      wpm: 'Above baseline by 10%+',
      volume: 'Above baseline by 15%+',
      pitch: 'Slightly higher than baseline',
      pauses: 'Fewer than baseline',
      hesitations: 'Below average',
      description: 'Student speaks faster, louder, with fewer pauses. They know the material.',
    },
    medium: {
      wpm: 'Within 10% of baseline',
      volume: 'Within 15% of baseline',
      pitch: 'At baseline',
      pauses: 'At baseline',
      hesitations: 'At average',
      description: 'Normal engagement. Comfortable but not challenged or excited.',
    },
    low: {
      wpm: 'Below baseline by 15%+',
      volume: 'Below baseline by 20%+',
      pitch: 'Drops below baseline',
      pauses: 'Increase 30%+ above baseline',
      hesitations: 'Spike above average',
      description: 'Student slows down, gets quieter, pauses more. They are unsure or confused.',
    },
  },
  starkyResponse: {
    high: 'Push harder. Introduce challenging material. Ask "what if" questions. Increase complexity.',
    medium: 'Continue at current pace. Mix familiar and new material. Monitor for change.',
    low: 'Go gentler. More encouragement. Smaller steps. Check understanding. Slow down. Ask "what part is confusing?"',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// SINGING EVALUATION RUBRICS
// ═══════════════════════════════════════════════════════════════════════════════

export const SINGING_EVALUATION_RUBRICS = {
  pitchAccuracy: {
    excellent: { min: 90, feedback: 'Your pitch is very accurate — you hit the notes consistently.' },
    good: { min: 75, feedback: 'Good pitch centre — a few notes drift but overall you\'re tracking the melody well.' },
    developing: { min: 60, feedback: 'Some pitch inconsistency — focus on really hearing each note before you sing it.' },
    needsWork: { min: 0, feedback: 'Pitch is wandering — try singing along with the original to train your ear.' },
  },
  breathControl: {
    excellent: { desc: 'Sustains phrases without audible gasping. Breath marks are musical choices.' },
    good: { desc: 'Mostly controlled. Occasional unplanned breaths but doesn\'t disrupt flow.' },
    developing: { desc: 'Runs out of breath mid-phrase. Needs to plan breathing points.' },
    needsWork: { desc: 'Gasping frequently. Needs fundamental breath support exercises.' },
  },
  toneAndColour: {
    warmRich: 'Your voice has a warm, rich quality — beautiful for ballads and emotional songs.',
    brightClear: 'Your voice is bright and clear — excellent for projection and upbeat songs.',
    strained: 'Your upper register sounds strained — try "lifting" the sound rather than "pushing" it.',
    breathy: 'Your tone is quite breathy — adding more vocal cord closure will give you more power.',
  },
  rhythm: {
    rushing: 'You\'re consistently ahead of the beat — take a breath and let the music lead you.',
    dragging: 'You\'re falling behind the beat — feel the pulse in your body, tap your foot.',
    accurate: 'Your rhythm is very natural — you have a good internal pulse.',
    inconsistent: 'Your timing varies — steady in verses but rushing in choruses.',
  },
  voiceClassification: {
    female: [
      { type: 'Soprano', range: 'C4-C6', desc: 'Highest female voice. Bright, agile, powerful at the top.' },
      { type: 'Mezzo-soprano', range: 'A3-A5', desc: 'Middle female voice. Rich, versatile, warm in the middle.' },
      { type: 'Contralto', range: 'F3-F5', desc: 'Lowest female voice. Deep, warm, rare and beautiful.' },
    ],
    male: [
      { type: 'Tenor', range: 'C3-C5', desc: 'Highest male voice. Bright, ringing, heroic quality.' },
      { type: 'Baritone', range: 'A2-A4', desc: 'Middle male voice. Most common. Warm, strong, versatile.' },
      { type: 'Bass', range: 'E2-E4', desc: 'Lowest male voice. Deep, resonant, powerful foundation.' },
    ],
    child: [
      { type: 'Treble', range: 'C4-C6', desc: 'Pre-pubescent voice. Light, pure, angelic quality.' },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// WELLBEING SIGNALS — notice and adapt, never diagnose
// ═══════════════════════════════════════════════════════════════════════════════

export const WELLBEING_SIGNALS = {
  criticalRule: 'Starky NEVER diagnoses. Starky notices and adapts. Never says "you sound depressed" or "you seem anxious". Never shares voice analysis with anyone.',
  patterns: {
    sustainedDrop: {
      trigger: '3+ sessions of lower-than-baseline volume + slower pace + more pauses',
      response: 'You seem a bit quieter than usual lately. Is everything okay? No pressure — we can take it easy today.',
    },
    suddenChange: {
      trigger: 'Sudden spike in hesitations on previously comfortable topic',
      response: 'I notice you\'re less sure about this today — did something change? Let\'s go back to basics and rebuild from there.',
    },
    consistentHigh: {
      trigger: 'Voice energy consistently high across sessions',
      response: 'Continue pushing and challenging. Student is engaged and thriving.',
    },
    consistentLow: {
      trigger: 'Voice energy consistently low across sessions',
      response: 'Gentle check-in. Lighter session. Never push. Ask if they want to do something different.',
    },
  },
  neverDo: [
    'Never say "you sound depressed" or "you seem anxious"',
    'Never diagnose mental health from voice',
    'Never share voice analysis data with anyone',
    'Always ask before recording longer clips',
    'Always give student option to not use mic',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// PRIVACY AND CONSENT
// ═══════════════════════════════════════════════════════════════════════════════

export const VOICE_PRIVACY = {
  consentPrompt: 'When you speak, Starky listens to understand you better. No recordings are kept. Only patterns are saved to help you learn.',
  rules: [
    'No raw audio ever stored — only extracted numerical features',
    'Student can reset their Voice Profile at any time',
    'Parent can request full deletion',
    'Voice features stored locally (localStorage) unless student is logged in',
    'If logged in, features stored in Supabase with user data protection',
    'Never used for advertising or third-party analysis',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// VOICE PROFILE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

const VP_KEY = 'nw_voice_profile';

/**
 * Load voice profile from localStorage
 */
export function loadVoiceProfile() {
  try {
    return JSON.parse(localStorage.getItem(VP_KEY) || 'null');
  } catch { return null; }
}

/**
 * Save voice profile to localStorage
 */
export function saveVoiceProfile(profile) {
  try {
    localStorage.setItem(VP_KEY, JSON.stringify(profile));
  } catch {}
}

/**
 * Check if profile has enough data to be useful
 */
export function isVoiceProfileReady(profile) {
  return profile && profile.sessions_recorded >= 3 && profile.baseline?.established;
}

/**
 * Update voice profile with new session data.
 * Called after every mic input with extracted features.
 */
export function updateVoiceProfile(currentProfile, sessionData) {
  const profile = currentProfile || JSON.parse(JSON.stringify(VOICE_PROFILE_SCHEMA));
  profile.sessions_recorded += 1;
  const n = profile.sessions_recorded;

  // Update baseline (rolling average of first 5 sessions, then stable)
  if (n <= 5) {
    const weight = 1 / n;
    const prev = 1 - weight;
    profile.baseline.wpm = (profile.baseline.wpm || 0) * prev + (sessionData.wpm || 0) * weight;
    profile.baseline.volume = (profile.baseline.volume || 0) * prev + (sessionData.volume_rms || 0) * weight;
    profile.baseline.pitch_hz = (profile.baseline.pitch_hz || 0) * prev + (sessionData.pitch_hz || 0) * weight;
    profile.baseline.pause_rate = (profile.baseline.pause_rate || 0) * prev + (sessionData.pause_count || 0) * weight;
    profile.baseline.hesitation_rate = (profile.baseline.hesitation_rate || 0) * prev + (sessionData.hesitation_markers || 0) * weight;
    if (n >= 3) profile.baseline.established = true;
  }

  // Update confidence signature
  if (profile.baseline.established && sessionData.confidence_label) {
    if (sessionData.confidence_label === 'high') {
      profile.confidence.confident_wpm = sessionData.wpm;
      profile.confidence.confident_volume = sessionData.volume_rms;
      profile.confidence.confident_pitch = sessionData.pitch_hz;
    } else if (sessionData.confidence_label === 'low') {
      profile.confidence.uncertain_wpm = sessionData.wpm;
      profile.confidence.uncertain_volume = sessionData.volume_rms;
      profile.confidence.uncertain_pitch = sessionData.pitch_hz;
    }
  }

  // Track fluency trend
  if (sessionData.wpm && sessionData.vocabulary_unique_ratio !== undefined) {
    profile.language.english_fluency_trend.push({
      session: n,
      wpm: sessionData.wpm,
      vocab_richness: sessionData.vocabulary_unique_ratio,
    });
    // Keep last 20 entries
    if (profile.language.english_fluency_trend.length > 20) {
      profile.language.english_fluency_trend = profile.language.english_fluency_trend.slice(-20);
    }
  }

  // Track vocabulary growth
  if (sessionData.vocabulary_unique_ratio !== undefined) {
    profile.language.vocabulary_growth.push({ session: n, unique_ratio: sessionData.vocabulary_unique_ratio });
    if (profile.language.vocabulary_growth.length > 20) {
      profile.language.vocabulary_growth = profile.language.vocabulary_growth.slice(-20);
    }
  }

  // Wellbeing — track last 5 sessions energy
  profile.wellbeing.last_5_sessions_energy.push({
    session: n,
    volume_rms: sessionData.volume_rms || 0,
    wpm: sessionData.wpm || 0,
    pauses: sessionData.pause_count || 0,
  });
  if (profile.wellbeing.last_5_sessions_energy.length > 5) {
    profile.wellbeing.last_5_sessions_energy = profile.wellbeing.last_5_sessions_energy.slice(-5);
  }

  // Detect concerning drops (all metrics below baseline by 20%+)
  if (profile.baseline.established) {
    const volDrop = sessionData.volume_rms < profile.baseline.volume * 0.8;
    const wpmDrop = sessionData.wpm < profile.baseline.wpm * 0.8;
    const pauseSpike = sessionData.pause_count > profile.baseline.pause_rate * 1.5;
    if (volDrop && wpmDrop && pauseSpike) {
      profile.wellbeing.concerning_drops.push({ session: n, date: new Date().toISOString() });
    }
  }

  // Growth milestones
  if (n === 1) profile.growth.session_1_wpm = sessionData.wpm;
  if (n === 10) profile.growth.session_10_wpm = sessionData.wpm;
  if (n === 20) profile.growth.session_20_wpm = sessionData.wpm;
  if (profile.growth.session_1_wpm && sessionData.wpm) {
    profile.growth.fluency_improvement_pct = Math.round(((sessionData.wpm - profile.growth.session_1_wpm) / profile.growth.session_1_wpm) * 100);
  }

  saveVoiceProfile(profile);
  return profile;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROMPT GENERATION — Voice briefing for Starky
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generate voice profile prompt for Starky.
 * Richness depends on how many sessions have been recorded.
 */
export function getVoiceProfilePrompt(profile, currentSessionData) {
  if (!profile || profile.sessions_recorded === 0) return '';
  const n = profile.sessions_recorded;

  let prompt = `\nVOICE PROFILE BRIEFING (${n} session${n !== 1 ? 's' : ''} recorded):\n`;

  // Session 1-2: Basic
  if (currentSessionData) {
    prompt += `\nThis session: ${currentSessionData.wpm || '?'} WPM, volume ${Math.round((currentSessionData.volume_rms || 0) * 100)}%, ${currentSessionData.pause_count || 0} pauses, ${currentSessionData.hesitation_markers || 0} hesitations.`;
  }

  // Session 3+: Baseline comparison
  if (profile.baseline.established && currentSessionData) {
    const wpmDiff = currentSessionData.wpm && profile.baseline.wpm ? Math.round(((currentSessionData.wpm - profile.baseline.wpm) / profile.baseline.wpm) * 100) : 0;
    const volDiff = currentSessionData.volume_rms && profile.baseline.volume ? Math.round(((currentSessionData.volume_rms - profile.baseline.volume) / profile.baseline.volume) * 100) : 0;
    prompt += `\nBaseline: ${Math.round(profile.baseline.wpm)} WPM, volume ${Math.round(profile.baseline.volume * 100)}%.`;
    prompt += `\nToday vs baseline: ${wpmDiff > 0 ? '+' : ''}${wpmDiff}% speed, ${volDiff > 0 ? '+' : ''}${volDiff}% volume.`;

    // Confidence inference
    const conf = wpmDiff > 10 && volDiff > 10 ? 'HIGH' : wpmDiff < -15 && volDiff < -15 ? 'LOW' : 'MEDIUM';
    prompt += `\nConfidence inference: ${conf}.`;
    prompt += `\nRecommended approach: ${CONFIDENCE_INFERENCE.starkyResponse[conf.toLowerCase()]}.`;
  }

  // Session 5+: Trends
  if (n >= 5) {
    const trend = profile.language.english_fluency_trend;
    if (trend.length >= 3) {
      const recent = trend.slice(-3);
      const older = trend.slice(-6, -3);
      if (older.length > 0) {
        const recentAvg = recent.reduce((s, e) => s + e.wpm, 0) / recent.length;
        const olderAvg = older.reduce((s, e) => s + e.wpm, 0) / older.length;
        const trendDir = recentAvg > olderAvg + 5 ? 'improving' : recentAvg < olderAvg - 5 ? 'declining' : 'stable';
        prompt += `\nFluency trend: ${trendDir} (recent avg ${Math.round(recentAvg)} WPM vs earlier ${Math.round(olderAvg)} WPM).`;
      }
    }

    if (profile.language.problem_sounds.length > 0) {
      prompt += `\nKnown problem sounds: ${profile.language.problem_sounds.map(s => s.sound).join(', ')}.`;
    }

    if (profile.learningStyle.engagement_topics.length > 0) {
      prompt += `\nHigh engagement topics: ${profile.learningStyle.engagement_topics.join(', ')}.`;
    }
    if (profile.learningStyle.confusion_topics.length > 0) {
      prompt += `\nConfusion topics: ${profile.learningStyle.confusion_topics.join(', ')}.`;
    }
  }

  // Session 10+: Growth narrative
  if (n >= 10 && profile.growth.session_1_wpm && profile.growth.fluency_improvement_pct !== null) {
    prompt += `\nGrowth: Session 1 was ${profile.growth.session_1_wpm} WPM. Now ${Math.round(profile.language.english_fluency_trend.slice(-1)[0]?.wpm || 0)} WPM. ${profile.growth.fluency_improvement_pct > 0 ? '+' : ''}${profile.growth.fluency_improvement_pct}% improvement.`;
  }

  // Session 20+: Deep knowledge
  if (n >= 20) {
    prompt += `\n\nDEEP PROFILE (20+ sessions): You know this student\'s voice intimately. Their baseline, their confidence signature, their problem sounds, their engagement patterns, their growth trajectory. Use this knowledge naturally — don't list it, just let it inform how you teach.`;
  }

  // Wellbeing check
  if (profile.wellbeing.concerning_drops.length >= 3) {
    prompt += `\nWELLBEING NOTE: Multiple sessions with significantly reduced energy detected. Be gentle. Check in. Never push.`;
  }

  return prompt;
}

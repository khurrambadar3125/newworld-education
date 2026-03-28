/**
 * utils/weaknessDetector.js
 * Cambridge Weakness Detection System
 * Silently analyses conversations to identify mark-losing patterns.
 */

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, timeout: 15000 });

// ── Complete weakness taxonomy per subject ──────────────────────────

export const WEAKNESS_TAXONOMY = {
  'Chemistry': ['mechanism_arrows', 'reagent_specificity', 'state_symbols', 'stereochemistry', 'observation_vs_inference', 'equilibrium_language', 'organic_synthesis_steps'],
  'Biology': ['terminology_precision', 'process_sequencing', 'graph_reading', 'genetics_notation', 'enzyme_language', 'location_in_cell', 'ecological_units'],
  'Physics': ['definition_precision', 'unit_analysis', 'vector_vs_scalar', 'field_line_rules', 'significant_figures', 'formula_application'],
  'Mathematics': ['working_shown', 'constant_of_integration', 'premature_rounding', 'proof_structure', 'notation', 'formula_selection'],
  'Economics': ['diagram_missing', 'diagram_unlabelled', 'shift_vs_movement', 'transmission_mechanism', 'one_sided_analysis', 'definition_missing', 'nominal_vs_real'],
  'English': ['device_without_effect', 'register_mismatch', 'word_limit_breach', 'summary_lifting_text', 'feature_listing'],
  'Literature': ['narrative_retelling', 'quotation_without_analysis', 'generic_comment', 'one_stanza_only', 'no_personal_response'],
  'History': ['source_as_information', 'narrative_not_analysis', 'assertion_without_evidence', 'no_counter_argument'],
  'Business': ['no_application_to_context', 'one_sided_analysis', 'no_evaluation'],
  'Islamiat': ['no_textual_evidence', 'vague_claim', 'repetition'],
  'Pakistan Studies': ['no_specific_data', 'narrative_not_analysis', 'chronology_error'],
  'Computer Science': ['pseudocode_syntax', 'trace_table_error', 'algorithm_naming', 'loop_boundary'],
};

/**
 * Analyse the last 3 messages for Cambridge weakness signals.
 * Runs as a background call — never blocks the main chat response.
 *
 * @param {Array} messages — last 3 messages [{role, content}]
 * @param {string} subject — current subject
 * @param {string} studentId — student email
 * @returns {object|null} — weakness object or null
 */
export async function detectWeakness(messages, subject, studentId) {
  if (!messages?.length || !subject) return null;

  const subjectKey = Object.keys(WEAKNESS_TAXONOMY).find(k =>
    subject.toLowerCase().includes(k.toLowerCase())
  );
  const categories = subjectKey ? WEAKNESS_TAXONOMY[subjectKey] : [];

  try {
    const response = await client.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 300,
      system: `You are a Cambridge examiner analysing a tutoring conversation for mark-losing patterns. Subject: ${subject}. Possible weakness categories: ${categories.join(', ')}. Respond with ONLY valid JSON. If no weakness detected, respond: {"weakness_detected":false}`,
      messages: [{
        role: 'user',
        content: `Analyse this conversation for Cambridge mark-losing weaknesses:\n\n${messages.map(m => `${m.role}: ${m.content}`).join('\n\n')}\n\nRespond with JSON: {"weakness_detected":true/false,"weakness_category":"...","weakness_description":"...","cambridge_relevance":"...","severity":"high/medium/low"} or {"weakness_detected":false}`
      }],
    });

    const text = response.content?.[0]?.text || '';
    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const result = JSON.parse(jsonMatch[0]);
    if (!result.weakness_detected) return null;

    return {
      student_id: studentId,
      subject: subjectKey || subject,
      syllabus_code: getSyllabusCode(subject),
      weakness_category: result.weakness_category || 'general',
      weakness_description: result.weakness_description || '',
      cambridge_relevance: result.cambridge_relevance || '',
      severity: result.severity || 'medium',
      timestamp: new Date().toISOString(),
    };
  } catch {
    return null; // Never block on failure
  }
}

/**
 * Save a weakness to Supabase. Increments frequency if same weakness exists.
 */
export async function saveWeakness(sb, weakness) {
  if (!sb || !weakness) return;

  try {
    // Check if this weakness already exists for this student
    const { data: existing } = await sb.from('cambridge_weaknesses')
      .select('id, frequency')
      .eq('student_id', weakness.student_id)
      .eq('weakness_category', weakness.weakness_category)
      .eq('subject', weakness.subject)
      .eq('resolved', false)
      .limit(1);

    if (existing?.length) {
      // Increment frequency
      await sb.from('cambridge_weaknesses')
        .update({
          frequency: (existing[0].frequency || 1) + 1,
          last_detected: weakness.timestamp,
          severity: weakness.severity,
        })
        .eq('id', existing[0].id);
    } else {
      // Insert new weakness
      await sb.from('cambridge_weaknesses').insert({
        student_id: weakness.student_id,
        subject: weakness.subject,
        syllabus_code: weakness.syllabus_code,
        weakness_category: weakness.weakness_category,
        weakness_description: weakness.weakness_description,
        cambridge_relevance: weakness.cambridge_relevance,
        severity: weakness.severity,
        frequency: 1,
        first_detected: weakness.timestamp,
        last_detected: weakness.timestamp,
        resolved: false,
      });
    }
  } catch {} // Never block on DB failure
}

/**
 * Check if a weakness has been resolved (correct in 3 consecutive sessions).
 */
export async function checkResolution(sb, studentId, weaknessCategory, subject) {
  if (!sb) return false;
  try {
    const { data } = await sb.from('cambridge_weaknesses')
      .select('id, frequency, consecutive_correct')
      .eq('student_id', studentId)
      .eq('weakness_category', weaknessCategory)
      .eq('subject', subject)
      .eq('resolved', false)
      .limit(1);

    if (data?.length && (data[0].consecutive_correct || 0) >= 3) {
      await sb.from('cambridge_weaknesses')
        .update({ resolved: true, resolved_at: new Date().toISOString() })
        .eq('id', data[0].id);
      return true;
    }
    return false;
  } catch { return false; }
}

/**
 * Increment consecutive_correct count for a weakness.
 */
export async function markCorrect(sb, studentId, weaknessCategory, subject) {
  if (!sb) return;
  try {
    const { data } = await sb.from('cambridge_weaknesses')
      .select('id, consecutive_correct')
      .eq('student_id', studentId)
      .eq('weakness_category', weaknessCategory)
      .eq('subject', subject)
      .eq('resolved', false)
      .limit(1);

    if (data?.length) {
      await sb.from('cambridge_weaknesses')
        .update({ consecutive_correct: (data[0].consecutive_correct || 0) + 1 })
        .eq('id', data[0].id);
    }
  } catch {}
}

function getSyllabusCode(subject) {
  const codes = {
    'chemistry': '9701', 'biology': '9700', 'physics': '9702',
    'mathematics': '9709', 'economics': '9708', 'english': '9093',
    'literature': '9695', 'history': '9389', 'business': '9609',
    'islamiat': '2058', 'pakistan studies': '2059', 'computer science': '9618',
  };
  const lower = (subject || '').toLowerCase();
  return Object.entries(codes).find(([k]) => lower.includes(k))?.[1] || '';
}

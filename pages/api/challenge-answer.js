/**
 * pages/api/challenge-answer.js
 * Live Cambridge marking API for the Challenge page.
 * Takes a question + student answer, marks with full examiner precision.
 */

import { getAnthropicClient } from '../../utils/anthropicClient';
import { SUPREME_EXAMINER_PERSONA, CAMBRIDGE_DIALECT, CAMBRIDGE_HIDDEN_RULES } from '../../utils/cambridgeDialectKB';
import { EXAMINER_REPORTS } from '../../utils/examinerReportsKB';
import { COMMAND_WORDS } from '../../utils/commandWordEngine';
import { MARK_SCHEME_KB } from '../../utils/markSchemeKB';

const client = getAnthropicClient();

// Detect subject from question text
function detectSubject(text) {
  const t = text.toLowerCase();
  const signals = [
    { subject: 'biology', keywords: ['enzyme', 'osmosis', 'photosynthesis', 'cell', 'mitosis', 'dna', 'gene', 'organ', 'respiration', 'diffusion', 'haemoglobin', 'plant', 'animal', 'bacteria', 'virus'] },
    { subject: 'chemistry', keywords: ['reaction', 'acid', 'base', 'ion', 'electrode', 'mole', 'bond', 'covalent', 'ionic', 'atom', 'element', 'compound', 'electrolysis', 'periodic', 'catalyst', 'equilibrium', 'enthalpy', 'oxidation'] },
    { subject: 'physics', keywords: ['force', 'velocity', 'acceleration', 'energy', 'wave', 'current', 'voltage', 'resistance', 'power', 'momentum', 'pressure', 'density', 'magnet', 'refraction', 'nuclear', 'radioact'] },
    { subject: 'economics', keywords: ['demand', 'supply', 'market', 'inflation', 'gdp', 'fiscal', 'monetary', 'elasticity', 'equilibrium price', 'unemployment', 'trade', 'tariff'] },
    { subject: 'history', keywords: ['war', 'treaty', 'revolution', 'empire', 'independence', 'partition', 'cold war', 'league of nations', 'hitler', 'gandhi', 'jinnah', 'constitution'] },
    { subject: 'pakistan_studies', keywords: ['pakistan', 'indus', 'lahore resolution', 'quaid', 'cpec', 'punjab', 'sindh', 'balochistan', 'constitution of pakistan'] },
    { subject: 'islamiyat', keywords: ['prophet', 'quran', 'hadith', 'salah', 'zakah', 'hajj', 'ramadan', 'ummah', 'caliph', 'tawhid', 'sunnah'] },
    { subject: 'english', keywords: ['metaphor', 'simile', 'imagery', 'tone', 'narrator', 'poet', 'writer', 'reader', 'alliteration', 'personification', 'theme', 'character'] },
    { subject: 'mathematics', keywords: ['equation', 'graph', 'solve', 'prove', 'show that', 'calculate', 'probability', 'trigonometry', 'differentiat', 'integrat', 'algebra', 'simultaneous'] },
    { subject: 'geography', keywords: ['river', 'erosion', 'earthquake', 'volcano', 'climate', 'population', 'urbanisation', 'migration', 'settlement', 'plate tectonic'] },
    { subject: 'accounting', keywords: ['balance sheet', 'profit and loss', 'depreciation', 'trial balance', 'ledger', 'debit', 'credit', 'cash flow'] },
    { subject: 'computer_science', keywords: ['algorithm', 'binary', 'pseudocode', 'database', 'network', 'cpu', 'boolean', 'array', 'loop', 'variable'] },
  ];
  for (const s of signals) {
    if (s.keywords.some(k => t.includes(k))) return s.subject;
  }
  return 'general';
}

// Build subject-specific knowledge injection
function buildKnowledgeInjection(subject) {
  const parts = [];

  // Dialect entries
  const dialect = CAMBRIDGE_DIALECT.filter(d => d.subject === subject).slice(0, 10);
  if (dialect.length) {
    parts.push('CAMBRIDGE MARK SCHEME PHRASES FOR THIS SUBJECT:\n' + dialect.map(d =>
      `• ${d.concept}: Cambridge ACCEPTS "${d.cambridgeAccepts[0]}" — REJECTS ${d.cambridgeRejects.slice(0, 2).map(r => `"${r}"`).join(', ')}. ${d.markSchemeNote}`
    ).join('\n'));
  }

  // Hidden rules
  const rules = CAMBRIDGE_HIDDEN_RULES[subject];
  if (rules?.length) {
    parts.push('HIDDEN EXAMINER RULES:\n' + rules.map((r, i) => `${i + 1}. ${r}`).join('\n'));
  }

  // Examiner reports
  const reports = EXAMINER_REPORTS[subject]?.slice(0, 8);
  if (reports?.length) {
    parts.push('EXAMINER REPORT WARNINGS:\n' + reports.map(r =>
      `• ${r.topic}: "${r.examinerComment || r.mistake}"`
    ).join('\n'));
  }

  // Mark scheme KB
  const msEntries = MARK_SCHEME_KB.filter(m => m.subject === subject).slice(0, 8);
  if (msEntries.length) {
    parts.push('MARK SCHEME PRECISION:\n' + msEntries.map(m =>
      `• ${m.concept}: Accepted: "${m.acceptedPhrases[0]}" | Rejected: "${m.rejectedPhrases[0]}" | ${m.examinerNote}`
    ).join('\n'));
  }

  return parts.length ? '\n\n' + parts.join('\n\n') : '';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { question, answer, subject, level, commandWord, marks } = req.body;
  if (!question || !answer) return res.status(400).json({ error: 'question and answer required' });

  // ── ASK STARKY MODE: Nixor team asks a question, Starky answers like a Cambridge examiner ──
  if (answer === '__ASK_STARKY_MODE__') {
    const detectedSubject = detectSubject(question);
    const knowledgeInjection = buildKnowledgeInjection(detectedSubject);
    try {
      const response = await client.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1500,
        system: [{ type: 'text', text: `${SUPREME_EXAMINER_PERSONA}\n\nYou are demonstrating your Cambridge examiner knowledge to a school principal. Be precise, authoritative, and deeply impressive.\n\nWhen answering:\n1. Identify the COMMAND WORD if there is one and state what it demands\n2. State the EXACT mark scheme phrases Cambridge requires\n3. Show the MARK POINTS — what earns each mark\n4. Flag any EXAMINER REPORT warnings for this topic\n5. Give the FULL MARKS ANSWER with every mark point clearly visible\n6. State what students commonly get WRONG and why it costs marks\n\nUse the knowledge below — these are real Cambridge mark scheme phrases and examiner report entries.${knowledgeInjection}`, cache_control: { type: 'ephemeral' } }],
        messages: [{ role: 'user', content: question }],
      });
      const text = response.content?.[0]?.text || 'No response.';
      return res.status(200).json({ askMode: true, answer: text, detectedSubject });
    } catch (err) {
      return res.status(500).json({ error: 'Failed. Try again.' });
    }
  }

  try {
    const markingSubject = detectSubject(question + ' ' + (subject || ''));
    const markingKnowledge = buildKnowledgeInjection(markingSubject);
    const response = await client.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1200,
      system: [{ type: 'text', text: `${SUPREME_EXAMINER_PERSONA}\n\nYou are marking a live Cambridge demo. Be precise, authoritative, and impressive. Return ONLY valid JSON — no markdown, no backticks.\n\nUse this knowledge to mark with real Cambridge precision:${markingKnowledge}`, cache_control: { type: 'ephemeral' } }],
      messages: [{
        role: 'user',
        content: `Mark this Cambridge ${level || 'O Level'} ${subject || ''} answer.

Question (${marks || '?'} marks, command word: ${commandWord || 'unknown'}): ${question}

Student answer: ${answer}

Return JSON:
{
  "totalMarks": ${marks || 3},
  "marksAwarded": <number>,
  "markPoints": [
    { "point": "description of mark point", "awarded": true/false, "studentWrote": "what they wrote", "required": "what was needed" }
  ],
  "commandWordVerdict": { "word": "${commandWord || '?'}", "correct": true/false, "note": "explanation" },
  "dialectCorrections": [
    { "studentPhrase": "what they said", "cambridgePhrase": "what Cambridge requires", "markImpact": "lost mark X" }
  ],
  "examinerWarning": "quote from examiner report if relevant, or null",
  "modelAnswer": "the full-marks answer",
  "grade": "what grade this answer quality represents",
  "oneThingToImprove": "the single most impactful change"
}`
      }],
    });

    const text = response.content?.[0]?.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return res.status(200).json(result);
    }
    return res.status(200).json({ error: 'Could not parse marking', raw: text.slice(0, 500) });
  } catch (err) {
    console.error('[challenge-answer]', err.message);
    return res.status(500).json({ error: 'Marking failed. Try again.' });
  }
}

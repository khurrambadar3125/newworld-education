/**
 * components/QuestionDisplay.jsx — Rich question renderer
 * ─────────────────────────────────────────────────────────────────
 * Renders questions with:
 * - Diagrams/images from Supabase Storage
 * - Mathematical formulas via KaTeX
 * - Proper formatting for structured questions
 *
 * Usage: <QuestionDisplay question={question} />
 * Where question has: { question, type, options, image_url, marks, topic }
 */

import { useEffect, useRef } from 'react';

// Detect LaTeX patterns in text
const LATEX_PATTERN = /\$([^$]+)\$|\\\((.+?)\\\)|\\\[(.+?)\\\]/g;

function renderMath(text) {
  if (!text || typeof text !== 'string') return text;

  // Check if text contains any math notation
  if (!LATEX_PATTERN.test(text) && !text.includes('^') && !text.includes('_') && !text.includes('\\')) {
    return text;
  }

  // Reset regex
  LATEX_PATTERN.lastIndex = 0;

  // Simple inline math rendering for common patterns
  let rendered = text
    // Superscripts: x^2 → x²
    .replace(/(\w)\^2\b/g, '$1²')
    .replace(/(\w)\^3\b/g, '$1³')
    .replace(/(\w)\^n\b/g, '$1ⁿ')
    // Common chemistry: CO2 → CO₂, H2O → H₂O
    .replace(/([A-Z][a-z]?)(\d+)/g, (m, elem, num) => {
      const subs = '₀₁₂₃₄₅₆₇₈₉';
      return elem + num.split('').map(d => subs[parseInt(d)]).join('');
    })
    // Fractions: 1/2 → ½
    .replace(/\b1\/2\b/g, '½')
    .replace(/\b1\/3\b/g, '⅓')
    .replace(/\b1\/4\b/g, '¼')
    .replace(/\b3\/4\b/g, '¾');

  return rendered;
}

export default function QuestionDisplay({ question, showImage = true, compact = false }) {
  const imgRef = useRef(null);

  if (!question) return null;

  const hasImage = question.image_url && !question.image_url.startsWith('vision_desc:');
  const hasVisionDesc = question.image_url?.startsWith('vision_desc:');
  const visionDesc = hasVisionDesc ? question.image_url.replace('vision_desc:', '') : null;

  const questionText = renderMath(question.question || question.question_text || '');

  return (
    <div style={{ marginBottom: compact ? 8 : 16 }}>
      {/* Question text */}
      <div style={{
        fontSize: compact ? 14 : 16,
        fontWeight: 600,
        color: '#fff',
        lineHeight: 1.6,
        marginBottom: hasImage || visionDesc ? 12 : 0,
      }}>
        {questionText}
      </div>

      {/* Diagram image from Supabase Storage */}
      {showImage && hasImage && (
        <div style={{
          margin: '12px 0',
          borderRadius: 10,
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,.1)',
          background: '#fff',
        }}>
          <img
            ref={imgRef}
            src={question.image_url}
            alt="Question diagram"
            style={{
              width: '100%',
              maxHeight: 400,
              objectFit: 'contain',
              display: 'block',
            }}
            loading="lazy"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
      )}

      {/* Vision description (when actual image not available) */}
      {showImage && visionDesc && (
        <div style={{
          margin: '12px 0',
          padding: '12px 16px',
          background: 'rgba(79,142,247,.08)',
          border: '1px solid rgba(79,142,247,.2)',
          borderRadius: 10,
          fontSize: 13,
          color: 'rgba(255,255,255,.6)',
          fontStyle: 'italic',
        }}>
          📊 {visionDesc}
        </div>
      )}

      {/* Marks indicator */}
      {question.marks && !compact && (
        <div style={{
          fontSize: 12,
          color: 'rgba(255,255,255,.35)',
          marginTop: 4,
        }}>
          [{question.marks} mark{question.marks !== 1 ? 's' : ''}]
        </div>
      )}
    </div>
  );
}

/**
 * Render MCQ options with math support
 */
export function OptionDisplay({ optionKey, optionText, selected, correct, showResult }) {
  const text = renderMath(optionText);

  let bg = 'rgba(255,255,255,.04)';
  let border = 'rgba(255,255,255,.08)';
  let color = 'rgba(255,255,255,.75)';

  if (showResult && correct) {
    bg = 'rgba(74,222,128,.1)';
    border = 'rgba(74,222,128,.35)';
    color = '#4ADE80';
  } else if (showResult && selected && !correct) {
    bg = 'rgba(248,113,113,.1)';
    border = 'rgba(248,113,113,.35)';
    color = '#F87171';
  } else if (selected) {
    bg = 'rgba(79,142,247,.15)';
    border = 'rgba(79,142,247,.5)';
    color = '#4F8EF7';
  }

  return (
    <div style={{
      background: bg,
      border: `1px solid ${border}`,
      borderRadius: 10,
      padding: '12px 16px',
      color,
      fontSize: 14,
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start',
    }}>
      <strong style={{ minWidth: 20 }}>{optionKey}.</strong>
      <span>{text}</span>
      {showResult && correct && <span style={{ marginLeft: 'auto' }}>✓</span>}
      {showResult && selected && !correct && <span style={{ marginLeft: 'auto' }}>✗</span>}
    </div>
  );
}

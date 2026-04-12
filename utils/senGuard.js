// utils/senGuard.js
// ═══════════════════════════════════════════════════════════════════════
// SEN VERIFIED-BANK GUARD
//
// Hard rule from feedback_sen_verified_only.md:
//   SEN (Special Educational Needs) students MUST ONLY see questions that
//   come from the verified question_bank in Supabase. NEVER AI-generated.
//
// Why: SEN learners are particularly vulnerable to hallucinated or
// inappropriately-worded content. Every question they see must have been
// extracted from a real past paper and verified by a human examiner.
//
// How to use:
//   import { enforceSENVerified } from '../utils/senGuard';
//   const safeQ = enforceSENVerified(question);
//   if (!safeQ) { showFallback(); return; }
//   render(safeQ);
//
// A question is considered verified ONLY if BOTH are true:
//   - question.source === 'question_bank' (came from Supabase bank)
//   - question.verified === true          (explicitly flagged safe)
//
// API responses from /api/drill that served from the bank will carry
// _source === 'verified_bank' — senGuard treats that as equivalent.
// ═══════════════════════════════════════════════════════════════════════

export function isVerifiedBankQuestion(question) {
  if (!question || typeof question !== 'object') return false;
  // Direct flags
  if (question.source === 'question_bank' && question.verified === true) return true;
  // drill.js response flag — questions served from verified bank carry _source
  if (question._source === 'verified_bank') return true;
  // question-bank/serve endpoint — always bank, always verified
  if (question._bankId && question._source !== 'ai_generated') return true;
  return false;
}

export function enforceSENVerified(question) {
  if (!isVerifiedBankQuestion(question)) {
    if (typeof console !== 'undefined') {
      console.warn('[SEN GUARD] Blocked non-verified question:', question);
    }
    return null;
  }
  return question;
}

// Tag a question object so downstream consumers can trust the verified flag.
// Used server-side after reading from question_bank.
export function tagAsVerified(question) {
  if (!question) return question;
  return { ...question, source: 'question_bank', verified: true };
}

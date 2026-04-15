/**
 * lib/constants.js
 * Platform-wide constants. Changes here affect the entire platform.
 */

// USER-FACING MODEL.
// Migrated 2026-04-15: Haiku 3 (claude-3-haiku-20240307) retires April 20, 2026.
// Now on Haiku 4.5 — Anthropic's cheapest active model. Cost: $1/$5 per M tokens
// (4x Haiku 3 — prompt caching mitigates, Haiku 4.5 is meaningfully smarter).
// If costs become a problem, see Stage B plan for GPT-4o-mini / Gemini Flash-Lite swap.
export const STARKY_MODEL = "claude-haiku-4-5-20251001";
export const USER_MODEL = STARKY_MODEL;

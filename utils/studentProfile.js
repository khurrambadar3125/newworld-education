// studentProfile.js — unified student profile management
//
// Problem we're solving: previously, identification was scattered:
//   - nw_user (grade, name, email)
//   - user_country (separate localStorage key)
//   - uae_curriculum (separate localStorage key)
//   - Nothing knew the full picture
//
// This module makes ONE profile object the source of truth:
//   { name, country, curriculum, grade, gradeId, board, level, subject }
//
// Every API call and every page reads from this. Every student identified once.

import { CURRICULUM_BOOKS } from './curriculumBooks';

// ─── Keys ───
const KEY_USER = 'nw_user';
const KEY_COUNTRY = 'user_country';
const KEY_UAE_CURR = 'uae_curriculum';

// ─── Read the merged profile ───
// Backwards-compatible: if old data is in legacy keys, merge them into the returned object.
export function readStudentProfile() {
  if (typeof window === 'undefined') return null;
  try {
    const user = JSON.parse(localStorage.getItem(KEY_USER) || '{}');
    const country = localStorage.getItem(KEY_COUNTRY) || user.country || null;
    const uaeCurr = localStorage.getItem(KEY_UAE_CURR) || null;

    // Derive full curriculum id
    let curriculum = user.curriculum;
    if (!curriculum) {
      if (country === 'UAE' && uaeCurr) {
        // Map short id to full curriculum key
        curriculum = `uae-${uaeCurr === 'british' ? 'british-cambridge' : uaeCurr}-${inferTierFromGrade(user.gradeId)}`;
      } else if (country === 'PK' || !country) {
        curriculum = inferPakistaniCurriculum(user.gradeId);
      }
    }

    return {
      name: user.name || null,
      email: user.email || null,
      role: user.role || null,
      country,
      curriculum,
      grade: user.grade || null,
      gradeId: user.gradeId || null,
      board: user.board || null,
      subject: user.subject || null,
      school: user.school || null,
      joinedAt: user.joinedAt || null,
    };
  } catch {
    return null;
  }
}

// ─── Write profile (merges with existing) ───
export function writeStudentProfile(updates) {
  if (typeof window === 'undefined') return;
  try {
    const existing = JSON.parse(localStorage.getItem(KEY_USER) || '{}');
    const merged = { ...existing, ...updates };
    localStorage.setItem(KEY_USER, JSON.stringify(merged));

    // Keep legacy keys in sync so old code still works
    if (updates.country) localStorage.setItem(KEY_COUNTRY, updates.country);
    if (updates.curriculum && updates.country === 'UAE') {
      // Extract short id from full curriculum key
      const short = updates.curriculum.match(/uae-(.+?)-(o|a)level/);
      if (short) localStorage.setItem(KEY_UAE_CURR, short[1].replace('british-cambridge', 'british'));
    }
  } catch {}
}

// ─── Completeness check ───
export function isProfileComplete(profile) {
  if (!profile) return false;
  return !!(profile.country && profile.curriculum && profile.grade);
}

// ─── Infer helpers ───
function inferTierFromGrade(gradeId) {
  if (!gradeId) return 'olevel';
  if (gradeId.includes('alevel')) return 'alevel';
  if (gradeId.includes('olevel')) return 'olevel';
  const num = parseInt(gradeId.replace(/\D/g, ''), 10);
  if (num >= 9) return 'olevel';
  return 'olevel';  // default
}

function inferPakistaniCurriculum(gradeId) {
  if (!gradeId) return 'pk-cambridge-olevel';
  if (gradeId.includes('alevel')) return 'pk-cambridge-alevel';
  if (gradeId.includes('olevel')) return 'pk-cambridge-olevel';
  if (['grade9', 'grade10'].includes(gradeId)) return 'pk-federal-board';
  if (gradeId === 'kg' || /^grade[1-5]$/.test(gradeId)) return 'pk-sindh-board';
  return 'pk-cambridge-olevel';
}

// ─── Get books for profile ───
export function getBooksForProfile(profile, subject) {
  if (!profile?.curriculum || !subject) return [];
  const curr = CURRICULUM_BOOKS?.[profile.curriculum];
  if (!curr) return [];
  const subj = curr.subjects?.[subject];
  return subj?.books || [];
}

// ─── Get readable curriculum label ───
export function getCurriculumLabel(profile) {
  if (!profile?.curriculum) return null;
  return CURRICULUM_BOOKS?.[profile.curriculum]?.label || profile.curriculum;
}

// ─── Build API payload (for bank queries) ───
// Every bank query uses this to ensure consistent filtering
export function toBankQueryParams(profile) {
  if (!profile) return {};
  return {
    country: profile.country,
    curriculum: profile.curriculum,
    curriculumBoard: getCurriculumBoardForQuery(profile.curriculum),
    level: profile.grade,
    gradeId: profile.gradeId,
  };
}

// Map full curriculum id → the "curriculum" column value expected in question_bank
// The bank currently only has 'cambridge' values. Over time, more will be added.
function getCurriculumBoardForQuery(curriculumId) {
  if (!curriculumId) return 'cambridge';
  if (curriculumId.includes('cambridge')) return 'cambridge';
  if (curriculumId.includes('edexcel')) return 'edexcel';
  if (curriculumId.includes('american')) return 'american';
  if (curriculumId.includes('ib')) return 'ib';
  if (curriculumId.includes('cbse')) return 'cbse';
  if (curriculumId.includes('moe')) return 'moe';
  if (curriculumId.includes('sindh')) return 'sindh';
  if (curriculumId.includes('federal')) return 'federal';
  return 'cambridge';
}

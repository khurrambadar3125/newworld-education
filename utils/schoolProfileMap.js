// schoolProfileMap.js
// Bridges the school KBs (pakistanSchoolsKB.js + uaeSchoolsKB.js) to the
// unified student profile written by utils/studentProfile.js -> writeStudentProfile().
//
// The two KBs have slightly different shapes:
//   Pakistan schools: { curriculumOffered: [...], examBoard?, levels: { primary|middle|secondary|aLevel|... } }
//   UAE schools:      { curriculum: 'British + IB', examBoards: [...], levels: { eyfs|primary|secondary|sixthForm|... } }
//
// This module normalises them and derives:
//   - curriculum id (matching utils/curriculumBooks.js keys: pk-cambridge-olevel, uae-british-edexcel-igcse, ...)
//   - grade options surfaced to the user based on the levels the school actually teaches
//   - the final payload that writeStudentProfile() consumes

import { PAKISTAN_SCHOOLS } from './pakistanSchoolsKB';
import { UAE_SCHOOLS } from './uaeSchoolsKB';

// Combine both KBs with a country tag + unified curriculum list
export function getAllSchools() {
  const pk = Object.entries(PAKISTAN_SCHOOLS || {}).map(([slug, s]) => ({
    slug,
    country: 'PK',
    ...s,
    // normalise: PK uses curriculumOffered (array); give UAE-style field too
    curriculumOffered: s.curriculumOffered || [],
    examBoards: s.examBoard ? [s.examBoard] : (s.examBoards || []),
  }));
  const uae = Object.entries(UAE_SCHOOLS || {}).map(([slug, s]) => ({
    slug,
    country: 'UAE',
    ...s,
    // normalise: UAE uses curriculum (string); expose as array for search/display
    curriculumOffered: s.curriculumOffered || (s.curriculum ? [s.curriculum] : []),
    examBoards: s.examBoards || (s.examBoard ? [s.examBoard] : []),
  }));
  return [...pk, ...uae];
}

// Derive an exam-board-ish string from whatever the school exposes
function getBoardHaystack(school) {
  const parts = [];
  if (school.examBoard) parts.push(String(school.examBoard));
  if (Array.isArray(school.examBoards)) parts.push(...school.examBoards.map(String));
  if (school.curriculum) parts.push(String(school.curriculum));
  if (Array.isArray(school.curriculumOffered)) parts.push(...school.curriculumOffered.map(String));
  return parts.join(' | ').toLowerCase();
}

// Map a school entry + (optionally) a chosen grade bucket to the profile payload
// that writeStudentProfile() expects.
export function schoolToProfile(school, chosenGrade = null) {
  if (!school) return null;
  const country = school.country;
  const hay = getBoardHaystack(school);

  let curriculum = null;
  if (country === 'UAE') {
    // UAE curriculum precedence — pick the most specific match first
    if (hay.includes('edexcel')) curriculum = 'uae-british-edexcel-igcse';
    else if (hay.includes('cambridge') || hay.includes('caie') || hay.includes('igcse') || hay.includes('british')) curriculum = 'uae-british-cambridge-olevel';
    else if (hay.includes('ib ') || hay.includes('ib diploma') || hay.includes('ib (') || hay === 'ib' || hay.startsWith('ib')) curriculum = 'uae-ib';
    else if (hay.includes('american') || hay.includes(' ap ') || hay.includes('sabis')) curriculum = 'uae-american';
    else if (hay.includes('cbse') || hay.includes('icse') || hay.includes('cisce') || hay.includes('indian')) curriculum = 'uae-cbse';
    else if (hay.includes('moe')) curriculum = 'uae-moe';
    else if (hay.includes('pakistani') || hay.includes('fbise')) curriculum = 'uae-pakistani';
    else curriculum = 'uae-british-cambridge-olevel';
  } else {
    // Pakistan — mostly Cambridge; Edexcel rare; IB rarer
    if (hay.includes('edexcel')) curriculum = 'pk-edexcel-igcse';
    else if (hay.includes('ib ') || hay.includes('ib diploma')) curriculum = 'uae-ib'; // no pk-ib key yet — fallback
    else if (hay.includes('matric') || hay.includes('fbise') || hay.includes('sindh')) curriculum = 'pk-federal-board';
    else curriculum = 'pk-cambridge-olevel';
  }

  return {
    country,
    curriculum,
    school: school.name,
    schoolSlug: school.slug,
    schoolCity: school.city || null,
    examBoard: (school.examBoards && school.examBoards[0]) || school.examBoard || null,
    grade: chosenGrade?.label || null,
    gradeId: chosenGrade?.id || null,
  };
}

// Given a school, work out which grade buckets to offer. Works with both
// PK-style levels ({ primary, middle, secondary, aLevel, ... }) and UAE-style
// levels ({ eyfs, primary, secondary, sixthForm, ... }).
export function gradesFromSchool(school) {
  const levels = school?.levels || {};
  const has = (k) => Object.prototype.hasOwnProperty.call(levels, k) && !!levels[k];
  const out = [];

  if (has('eyfs') || has('earlyYears') || has('kg')) {
    out.push({ id: 'eyfs', label: 'Early Years (FS1–FS2 / KG)', age: '3-5' });
  }
  if (has('primary') || has('junior')) {
    out.push({ id: 'primary', label: 'Primary (KG–Grade 5)', age: '4-10' });
  }
  if (has('middle')) {
    out.push({ id: 'middle', label: 'Middle (Grade 6–8)', age: '10-13' });
  }
  if (has('matric')) {
    out.push({ id: 'matric', label: 'Matric (Grade 9–10)', age: '13-15' });
  }
  if (has('olevel') || has('igcse') || has('secondary')) {
    out.push({ id: 'olevel1', label: 'O Level / IGCSE', age: '14-16' });
  }
  if (has('alevel') || has('aLevel') || has('sixthForm')) {
    out.push({ id: 'alevel1', label: 'A Level / AS', age: '16-18' });
  }

  if (out.length === 0) {
    return [
      { id: 'primary', label: 'Primary', age: '4-10' },
      { id: 'olevel1', label: 'O Level / IGCSE', age: '14-16' },
      { id: 'alevel1', label: 'A Level / AS', age: '16-18' },
    ];
  }
  return out;
}

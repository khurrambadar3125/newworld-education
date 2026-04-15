/**
 * utils/kbWishlist.js
 * Living Document of Knowledge Gaps — reviewed weekly by cron.
 * When 3+ students ask about a topic not on the wishlist → auto-add it.
 *
 * PROTECTED: This file is an addition. Nothing existing is affected.
 */

export const KB_WISHLIST = [
  { topic: 'Matric/FSc Physics (Punjab/Federal Board)', priority: 'HIGH', reason: 'Largest student population in Pakistan not deeply served — Matric board numericals differ from Cambridge', estimatedSessionsAffected: 5000, dataSources: ['FBISE syllabus', 'Punjab Text Board', 'Sindh Text Board'], owner: 'pending', targetDate: '2026-06-01' },
  { topic: 'Matric/FSc Chemistry (Board-specific)', priority: 'HIGH', reason: 'Board-specific reactions and definitions differ from Cambridge. Students get confused.', estimatedSessionsAffected: 4000, dataSources: ['FBISE', 'Punjab Board', 'KPK Board'], owner: 'pending', targetDate: '2026-06-01' },
  { topic: 'Matric/FSc Biology', priority: 'HIGH', reason: 'Board diagrams and definitions differ from Cambridge Biology', estimatedSessionsAffected: 3000, dataSources: ['FBISE', 'Punjab Board'], owner: 'pending', targetDate: '2026-07-01' },
  { topic: 'Matric Mathematics (Board numericals)', priority: 'HIGH', reason: 'Board exam numerical patterns are distinct from Cambridge — students need both', estimatedSessionsAffected: 5000, dataSources: ['Past 10 years FBISE papers', 'Punjab Board papers'], owner: 'pending', targetDate: '2026-06-01' },
  { topic: 'Edexcel IGCSE (separate from Cambridge)', priority: 'MEDIUM', reason: 'Some UAE/Pakistan schools use Edexcel not Cambridge — different syllabi', estimatedSessionsAffected: 1500, dataSources: ['Edexcel IGCSE syllabi'], owner: 'pending', targetDate: '2026-08-01' },
  { topic: 'Sindhi language support', priority: 'MEDIUM', reason: 'Sindh province students must study Sindhi — no KB exists', estimatedSessionsAffected: 2000, dataSources: ['Sindh Text Board'], owner: 'pending', targetDate: '2026-09-01' },
  { topic: 'Pashto language support', priority: 'MEDIUM', reason: 'KPK province students study Pashto — no KB exists', estimatedSessionsAffected: 1000, dataSources: ['KPK Text Board'], owner: 'pending', targetDate: '2026-09-01' },
  { topic: 'UAE National Arabic First Language (deep)', priority: 'MEDIUM', reason: 'Arabic first language curriculum goes deeper than current arabicSupportKB covers', estimatedSessionsAffected: 2000, dataSources: ['UAE National Arabic curriculum documents'], owner: 'pending', targetDate: '2026-07-01' },
  { topic: 'CBSE Hindi literature (deep)', priority: 'LOW', reason: 'UAE CBSE students studying Hindi elective — no deep KB', estimatedSessionsAffected: 500, dataSources: ['NCERT Hindi textbooks'], owner: 'pending', targetDate: '2026-10-01' },
  { topic: 'French IGCSE/IB support', priority: 'LOW', reason: 'French is a common third language in UAE schools', estimatedSessionsAffected: 800, dataSources: ['Cambridge French IGCSE', 'IB French B'], owner: 'pending', targetDate: '2026-10-01' },
  { topic: 'SAT II Subject Tests / AP deep per subject', priority: 'MEDIUM', reason: 'American curriculum students need per-subject depth beyond current americanCurriculumKB', estimatedSessionsAffected: 1200, dataSources: ['College Board released materials'], owner: 'pending', targetDate: '2026-08-01' },
  { topic: 'Carnatic/Hindustani classical music theory', priority: 'LOW', reason: 'Indian community in UAE — classical music knowledge for singing KB', estimatedSessionsAffected: 300, dataSources: ['ABRSM India', 'Trinity India'], owner: 'pending', targetDate: '2026-11-01' },
];

/**
 * Check if a topic is already on the wishlist
 */
export function isOnWishlist(topic) {
  return KB_WISHLIST.some(w => w.topic.toLowerCase().includes(topic.toLowerCase()));
}

/**
 * Get wishlist items by priority
 */
export function getWishlistByPriority(priority) {
  return KB_WISHLIST.filter(w => w.priority === priority);
}

/**
 * Get overdue wishlist items
 */
export function getOverdueItems() {
  const now = new Date();
  return KB_WISHLIST.filter(w => new Date(w.targetDate) < now && w.owner === 'pending');
}

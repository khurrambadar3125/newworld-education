/**
 * autoImprover.js
 * Autonomous improvement engine — uses Supabase.
 * Conservative: only acts on data from 10+ students.
 */

import { getSupabase } from './supabase';
import { identifyConfusionTopics } from './patternEngine';

/**
 * Run all autonomous improvements for the week.
 */
export async function runAutoImprovements() {
  const sb = getSupabase();
  if (!sb) return [];

  const improvements = [];
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  // ── 1. Auto-discover confusion alerts ──────────────────────────────
  try {
    const confusionTopics = await identifyConfusionTopics();
    for (const topic of confusionTopics) {
      // Check if already exists
      const { data: existing } = await sb.from('autodiscovered_knowledge')
        .select('id').eq('topic', topic.topic).eq('active', true).limit(1);

      if (existing?.length) {
        // Update frequency
        await sb.from('autodiscovered_knowledge')
          .update({ frequency: topic.totalConfusions, example_questions: topic.examples })
          .eq('id', existing[0].id);
      } else {
        await sb.from('autodiscovered_knowledge').insert({
          topic: topic.topic,
          grade: topic.grade || null,
          confusion_pattern: topic.examples.map(e => e.type).filter(Boolean).join(', '),
          frequency: topic.totalConfusions,
          example_questions: topic.examples,
          active: true,
        });
        improvements.push({
          type: 'confusion_alert',
          detail: `Added confusion alert for "${topic.topic}" — ${topic.uniqueStudents} students struggled this week.`,
        });
      }
    }
  } catch (err) {
    console.error('[AUTO IMPROVER] Confusion alerts:', err.message);
  }

  // ── 2. Update student weakness profiles ────────────────────────────
  try {
    const { data: confusions } = await sb.from('confusion_signals')
      .select('email, topic')
      .gte('created_at', weekAgo.toISOString())
      .neq('email', 'anonymous')
      .limit(5000);

    if (confusions?.length) {
      const studentTopics = {};
      for (const c of confusions) {
        if (!studentTopics[c.email]) studentTopics[c.email] = {};
        const t = c.topic || 'unknown';
        studentTopics[c.email][t] = (studentTopics[c.email][t] || 0) + 1;
      }

      let updated = 0;
      for (const [email, topics] of Object.entries(studentTopics)) {
        const weak = Object.entries(topics)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([topic, count]) => ({ topic, confusionCount: count }));

        await sb.from('student_preferences').upsert({
          email,
          weak_topics: weak,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'email' });
        updated++;
      }

      if (updated > 0) {
        improvements.push({ type: 'weakness_profiles', detail: `Updated weak topics for ${updated} students.` });
      }
    }
  } catch (err) {
    console.error('[AUTO IMPROVER] Weakness profiles:', err.message);
  }

  // ── 3. Detect language preferences ─────────────────────────────────
  try {
    const { data: msgs } = await sb.from('student_signals')
      .select('email, language')
      .gte('created_at', weekAgo.toISOString())
      .neq('email', 'anonymous')
      .not('language', 'is', null)
      .limit(10000);

    if (msgs?.length) {
      const langMap = {};
      for (const m of msgs) {
        if (!langMap[m.email]) langMap[m.email] = {};
        langMap[m.email][m.language] = (langMap[m.email][m.language] || 0) + 1;
      }

      let langUpdated = 0;
      for (const [email, langs] of Object.entries(langMap)) {
        const total = Object.values(langs).reduce((a, b) => a + b, 0);
        if (total < 5) continue;
        const [topLang, topCount] = Object.entries(langs).sort((a, b) => b[1] - a[1])[0];
        if (topCount / total >= 0.6) {
          await sb.from('student_preferences').upsert({
            email,
            preferred_language: topLang,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'email' });
          langUpdated++;
        }
      }
      if (langUpdated > 0) {
        improvements.push({ type: 'language_prefs', detail: `Updated language preference for ${langUpdated} students.` });
      }
    }
  } catch (err) {
    console.error('[AUTO IMPROVER] Language prefs:', err.message);
  }

  // ── 4. Adaptive drill difficulty ───────────────────────────────────
  try {
    const { data: drills } = await sb.from('drill_signals')
      .select('email, score, max_score')
      .gte('created_at', weekAgo.toISOString())
      .neq('email', 'anonymous')
      .limit(10000);

    if (drills?.length) {
      const studentDrill = {};
      for (const d of drills) {
        if (!studentDrill[d.email]) studentDrill[d.email] = { total: 0, max: 0, count: 0 };
        studentDrill[d.email].total += d.score || 0;
        studentDrill[d.email].max += d.max_score || 1;
        studentDrill[d.email].count++;
      }

      let diffUpdated = 0;
      for (const [email, data] of Object.entries(studentDrill)) {
        if (data.count < 5) continue;
        const avg = data.total / data.max;
        const level = avg >= 0.9 ? 'hard' : avg >= 0.5 ? 'medium' : 'easy';

        await sb.from('student_preferences').upsert({
          email,
          difficulty_level: level,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'email' });
        diffUpdated++;
      }
      if (diffUpdated > 0) {
        improvements.push({ type: 'adaptive_difficulty', detail: `Adjusted difficulty for ${diffUpdated} students.` });
      }
    }
  } catch (err) {
    console.error('[AUTO IMPROVER] Difficulty:', err.message);
  }

  // ── 5. Discover effective teaching strategies ─────────────────────
  try {
    const { data: strategies } = await sb.from('strategy_signals')
      .select('grade, strategies, engagement')
      .gte('created_at', weekAgo.toISOString())
      .limit(10000);

    if (strategies?.length) {
      // Aggregate: which strategies get high engagement per grade group?
      const gradeStrategyMap = {};
      for (const sig of strategies) {
        const grade = sig.grade || 'unknown';
        const gradeGroup = classifyGradeGroup(grade);
        if (!gradeStrategyMap[gradeGroup]) gradeStrategyMap[gradeGroup] = {};
        for (const strat of (sig.strategies || [])) {
          if (!gradeStrategyMap[gradeGroup][strat]) gradeStrategyMap[gradeGroup][strat] = { high: 0, medium: 0, low: 0, total: 0 };
          gradeStrategyMap[gradeGroup][strat][sig.engagement || 'medium']++;
          gradeStrategyMap[gradeGroup][strat].total++;
        }
      }

      // Find strategies with high engagement rate (>50% high engagement, min 5 samples)
      const effectiveStrategies = [];
      for (const [gradeGroup, stratMap] of Object.entries(gradeStrategyMap)) {
        for (const [strategy, counts] of Object.entries(stratMap)) {
          if (counts.total < 5) continue;
          const highRate = counts.high / counts.total;
          const lowRate = counts.low / counts.total;
          if (highRate > 0.5) {
            effectiveStrategies.push({ gradeGroup, strategy, highRate: Math.round(highRate * 100), samples: counts.total });
          }
          // Also flag strategies that consistently fail
          if (lowRate > 0.5 && counts.total >= 5) {
            improvements.push({
              type: 'ineffective_strategy',
              detail: `"${strategy}" gets low engagement for ${gradeGroup} students (${Math.round(lowRate * 100)}% low, ${counts.total} samples). Consider reducing or modifying this approach.`,
            });
          }
        }
      }

      if (effectiveStrategies.length) {
        // Store effective strategies for prompt injection
        await sb.from('platform_insights').upsert({
          date: new Date().toISOString().split('T')[0],
          insight_type: 'effective_strategies',
          data: { strategies: effectiveStrategies, generatedAt: new Date().toISOString() },
        }, { onConflict: 'date,insight_type' });

        improvements.push({
          type: 'effective_strategies',
          detail: `Discovered ${effectiveStrategies.length} high-engagement strategies: ${effectiveStrategies.map(s => `${s.strategy} for ${s.gradeGroup} (${s.highRate}% engagement)`).join(', ')}.`,
        });
      }
    }
  } catch (err) {
    console.error('[AUTO IMPROVER] Strategy discovery:', err.message);
  }

  // ── 6. Build per-student learning profiles from teaching insights ──
  try {
    const { data: insights } = await sb.from('teaching_insights')
      .select('email, learning_style, what_worked, suggested_approach')
      .gte('created_at', weekAgo.toISOString())
      .neq('email', 'anonymous')
      .limit(5000);

    if (insights?.length) {
      const studentInsights = {};
      for (const ins of insights) {
        if (!studentInsights[ins.email]) studentInsights[ins.email] = { styles: [], approaches: [], techniques: [] };
        if (ins.learning_style) studentInsights[ins.email].styles.push(ins.learning_style);
        if (ins.suggested_approach) studentInsights[ins.email].approaches.push(ins.suggested_approach);
        for (const w of (ins.what_worked || [])) studentInsights[ins.email].techniques.push(w);
      }

      let profilesUpdated = 0;
      for (const [email, data] of Object.entries(studentInsights)) {
        // Most common learning style
        const styleCounts = {};
        for (const s of data.styles) styleCounts[s] = (styleCounts[s] || 0) + 1;
        const topStyle = Object.entries(styleCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'mixed';

        // Most recent suggested approach
        const latestApproach = data.approaches[data.approaches.length - 1] || '';

        // Top 5 effective techniques
        const techCounts = {};
        for (const t of data.techniques) techCounts[t] = (techCounts[t] || 0) + 1;
        const topTechniques = Object.entries(techCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([t]) => t);

        await sb.from('student_preferences').upsert({
          email,
          learning_style: topStyle,
          effective_techniques: topTechniques,
          suggested_approach: latestApproach,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'email' });
        profilesUpdated++;
      }

      if (profilesUpdated > 0) {
        improvements.push({ type: 'learning_profiles', detail: `Updated learning profiles for ${profilesUpdated} students with style, techniques, and approach data.` });
      }
    }
  } catch (err) {
    console.error('[AUTO IMPROVER] Learning profiles:', err.message);
  }

  // ── Store improvements log ─────────────────────────────────────────
  try {
    await sb.from('platform_insights').upsert({
      date: new Date().toISOString().split('T')[0],
      insight_type: 'improvements',
      data: { improvements, runAt: new Date().toISOString() },
    }, { onConflict: 'date,insight_type' });
  } catch {}

  return improvements;
}

// Helper: classify grade into group for strategy aggregation
function classifyGradeGroup(grade) {
  const g = (grade || '').toLowerCase();
  if (['kg', 'grade1', 'grade2', 'grade3', 'grade4', 'grade5', 'g1', 'g2', 'g3', 'g4', 'g5'].some(k => g.includes(k)) || g.includes('kg')) return 'KID';
  if (['grade6', 'grade7', 'grade8', 'grade9', 'grade10', 'g6', 'g7', 'g8'].some(k => g.includes(k))) return 'MIDDLE';
  if (g.includes('olevel') || g.includes('o level')) return 'OLEVEL';
  if (g.includes('alevel') || g.includes('a level') || g.includes('as level')) return 'ALEVEL';
  return 'MIDDLE'; // default
}

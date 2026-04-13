import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ─── Normalization rules ───
const LEVEL_MAP = {
  'AS / A Level': 'A Level',
  'as / a level': 'A Level',
  'alevel': 'A Level',
  'a-level': 'A Level',
  'A-Level': 'A Level',
  'o_level': 'O Level',
  'olevel': 'O Level',
  'o-level': 'O Level',
  'O-Level': 'O Level',
  'IGCSE': 'O Level',
  'igcse': 'O Level',
};

const SUBJECT_MAP = {
  // Canonical: 'Islamiat' — verified from research on 10 Pakistani elite schools
  // (KGS, Beaconhouse, City School, LGS, etc.). Previous assumption was wrong.
  'Islamiyat': 'Islamiat',
  'islamiyat': 'Islamiat',
  'islamic studies': 'Islamiat',
  'Maths': 'Mathematics',
  'Math': 'Mathematics',
  'maths': 'Mathematics',
  'Pak Studies': 'Pakistan Studies',
  'PakStudies': 'Pakistan Studies',
  'Add Math': 'Additional Mathematics',
  'Add Maths': 'Additional Mathematics',
  'AddMath': 'Additional Mathematics',
  'CS': 'Computer Science',
  'compsci': 'Computer Science',
  'Business': 'Business Studies',
};

async function normalize() {
  console.log('→ Normalizing bank tags...\n');

  // Report current state
  const { count: totalBefore } = await sb
    .from('question_bank')
    .select('*', { count: 'exact', head: true });
  console.log(`Total questions before: ${totalBefore}`);

  // Distinct levels
  const { data: levels } = await sb
    .from('question_bank')
    .select('level')
    .limit(10000);
  const distinctLevels = [...new Set(levels.map(r => r.level))];
  console.log(`Distinct levels: ${JSON.stringify(distinctLevels)}\n`);

  // Distinct subjects
  const { data: subjects } = await sb
    .from('question_bank')
    .select('subject')
    .limit(10000);
  const distinctSubjects = [...new Set(subjects.map(r => r.subject))];
  console.log(`Distinct subjects (first 20): ${JSON.stringify(distinctSubjects.slice(0, 20))}\n`);

  // Apply level normalizations
  let levelFixCount = 0;
  for (const [oldLevel, newLevel] of Object.entries(LEVEL_MAP)) {
    const { count, error } = await sb
      .from('question_bank')
      .update({ level: newLevel })
      .eq('level', oldLevel)
      .select('id', { count: 'exact', head: true });
    if (!error && count > 0) {
      console.log(`  ✓ Level '${oldLevel}' → '${newLevel}': ${count} rows`);
      levelFixCount += count;
    }
  }

  // Apply subject normalizations
  let subjectFixCount = 0;
  for (const [oldSubject, newSubject] of Object.entries(SUBJECT_MAP)) {
    const { count, error } = await sb
      .from('question_bank')
      .update({ subject: newSubject })
      .eq('subject', oldSubject)
      .select('id', { count: 'exact', head: true });
    if (!error && count > 0) {
      console.log(`  ✓ Subject '${oldSubject}' → '${newSubject}': ${count} rows`);
      subjectFixCount += count;
    }
  }

  console.log(`\n✓ Done. ${levelFixCount} level fixes, ${subjectFixCount} subject fixes.`);

  // ─── Move cambridge_test_answers into question_bank if needed ───
  const { count: camTestCount, error: camErr } = await sb
    .from('cambridge_test_answers')
    .select('*', { count: 'exact', head: true });

  if (!camErr && camTestCount > 0) {
    console.log(`\n→ Found ${camTestCount} rows in cambridge_test_answers. Migrating to question_bank...`);

    // Check schema compatibility — cambridge_test_answers likely has: subject, level, topic, question, answer
    const { data: sampleCam } = await sb.from('cambridge_test_answers').select('*').limit(3);
    console.log('Sample cambridge_test_answers row:', JSON.stringify(sampleCam[0], null, 2).substring(0, 500));

    // Do migration in batches of 500
    let migrated = 0;
    let offset = 0;
    while (offset < camTestCount) {
      const { data: batch } = await sb
        .from('cambridge_test_answers')
        .select('*')
        .range(offset, offset + 499);
      if (!batch || batch.length === 0) break;

      const transformed = batch.map(row => ({
        subject: row.subject,
        level: row.level || 'O Level',
        topic: row.topic,
        question_text: row.question || row.question_text,
        correct_answer: row.answer || row.correct_answer,
        curriculum: 'cambridge',
        source: 'cambridge_test_answers_migration',
        verified: true,
        type: row.type || 'structured',
        marks: row.marks || null,
      }));

      const { error: insertErr } = await sb.from('question_bank').insert(transformed);
      if (insertErr) {
        console.log(`  ✗ Batch insert error at offset ${offset}: ${insertErr.message}`);
        break;
      }
      migrated += batch.length;
      offset += 500;
    }
    console.log(`  ✓ Migrated ${migrated} questions from cambridge_test_answers → question_bank`);
  }

  // Final count
  const { count: totalAfter } = await sb
    .from('question_bank')
    .select('*', { count: 'exact', head: true });
  console.log(`\nTotal questions after: ${totalAfter}`);
  console.log(`Delta: +${totalAfter - totalBefore}`);
}

normalize().catch(err => {
  console.error('✗ Migration failed:', err);
  process.exit(1);
});

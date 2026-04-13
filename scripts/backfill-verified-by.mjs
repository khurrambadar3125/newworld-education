// backfill-verified-by.mjs
// Backfills the new verified_by and verified_at columns honestly.
// Run AFTER add-verification-columns.sql.
//
// Usage: node scripts/backfill-verified-by.mjs
//
// The honest mapping:
//   source='past_paper'                          → verified_by='cambridge_pdf_ai' (source genuine, answers AI-matched)
//   source='cambridge_test_answers_migration'    → verified_by=NULL (AI-generated, bulk-stamped)
//   source IN ('textbook_bank','verified_mcq_bank','sanfoundry') → verified_by='external_csv'
//   source IN ('seed','ai_generated') → verified_by=NULL
//   source='khurram_reviewed' (future) → verified_by='khurram_review'

import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  console.log('→ Backfilling verified_by column honestly...\n');

  // Count before
  const { count: total } = await sb
    .from('question_bank')
    .select('*', { count: 'exact', head: true });
  console.log(`Total questions: ${total}\n`);

  // Existing source breakdown
  const { data: sources } = await sb
    .from('question_bank')
    .select('source')
    .limit(50000);
  const sourceCounts = {};
  for (const r of sources || []) {
    const s = r.source || '(null)';
    sourceCounts[s] = (sourceCounts[s] || 0) + 1;
  }
  console.log('Source breakdown before backfill:');
  for (const [s, c] of Object.entries(sourceCounts).sort((a,b) => b[1]-a[1])) {
    console.log(`  ${s}: ${c}`);
  }
  console.log('');

  // ─── Mapping ───
  const mapping = [
    { source: 'past_paper', verifiedBy: 'cambridge_pdf_ai', confidence: 75 },
    { source: 'textbook_bank', verifiedBy: 'external_csv', confidence: 60 },
    { source: 'verified_mcq_bank', verifiedBy: 'external_csv', confidence: 50 },
    { source: 'sanfoundry', verifiedBy: 'external_csv', confidence: 50 },
    // cambridge_test_answers_migration → stays NULL (AI-generated, bulk-stamped — not verified)
    // ai_generated → stays NULL
    // seed → stays NULL
  ];

  const now = new Date().toISOString();

  for (const { source, verifiedBy, confidence } of mapping) {
    const { error, count } = await sb
      .from('question_bank')
      .update({
        verified_by: verifiedBy,
        verified_at: now,
        verification_confidence: confidence,
      })
      .eq('source', source)
      .is('verified_by', null)
      .select('id', { count: 'exact', head: true });

    if (error) {
      console.log(`  ✗ ${source}: ${error.message}`);
    } else {
      console.log(`  ✓ ${source} → verified_by='${verifiedBy}' confidence=${confidence}: ${count || 0} rows`);
    }
  }

  // ─── Explicit "not verified" for ambiguous AI sources ───
  // These get verified_by=NULL (already the default) but we ensure verified=false
  const { data: aiSources } = await sb
    .from('question_bank')
    .select('source')
    .limit(1);
  // Skip explicit null write — DB default is already NULL

  console.log('\n─── Post-backfill ───');
  const { data: verifiedByCounts } = await sb
    .from('question_bank')
    .select('verified_by')
    .limit(50000);
  const vbCounts = {};
  for (const r of verifiedByCounts || []) {
    const v = r.verified_by || '(null — unverified)';
    vbCounts[v] = (vbCounts[v] || 0) + 1;
  }
  console.log('verified_by breakdown after backfill:');
  for (const [v, c] of Object.entries(vbCounts).sort((a,b) => b[1]-a[1])) {
    const pct = total ? Math.round((c / total) * 100) : 0;
    console.log(`  ${v}: ${c} (${pct}%)`);
  }

  console.log('\n✓ Backfill complete.');
  console.log('\nNext steps:');
  console.log('  1. Verify numbers look reasonable.');
  console.log('  2. Update utils/questionBank.js to default-filter verified_by IS NOT NULL.');
  console.log('  3. Label served questions with their verified_by source in UI.');
}

run().catch(err => {
  console.error('✗ Backfill failed:', err);
  process.exit(1);
});

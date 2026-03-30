/**
 * utils/responsibleAIPolicy.js
 * NewWorldEdu Responsible AI Policy — formal principles for publication.
 * Published at: /responsible-ai
 * For: schools, governments, investors, parents, regulators
 */

export const RESPONSIBLE_AI_POLICY = {
  lastUpdated: '2026-03-31',
  version: '1.0',

  principles: [
    {
      id: 1,
      title: 'Validity and Accuracy',
      icon: '✓',
      summary: 'Every answer Starky gives is grounded in verified Cambridge syllabuses and examiner standards.',
      detail: [
        'All educational content is verified against Cambridge International syllabuses (O Level and A Level).',
        'Question generation is reviewed for accuracy before deployment.',
        'No question is marked wrong that is correct, and no question is marked correct that is wrong.',
        'Accuracy commitment: continuous improvement through our platform learning engine, which analyses every session for content gaps and misconceptions.',
        'Our Cambridge Examiner Intelligence layer ensures all answers meet mark-scheme standards.',
        'Subject-specific misconception detection actively identifies and corrects common errors.',
      ],
    },
    {
      id: 2,
      title: 'Fairness and Inclusion',
      icon: '⚖',
      summary: 'Every student receives the same quality of teaching, regardless of background, ability, or geography.',
      detail: [
        'Starky teaches every student with equal quality regardless of socioeconomic background.',
        'Purpose-built SEN protocols support 12 learning conditions with 240 tailored teaching profiles.',
        'Deaf mode with 8 specialised rules for hearing-impaired students.',
        '16+ languages supported with automatic detection.',
        'Active in Pakistan, UAE, and expanding — designed to serve students wherever they are.',
        'Free sessions for every new user — no credit card, no time limit.',
        'Partner school programmes provide extended free access for underserved communities.',
        'NewWorldEdu is purpose-built to narrow the tutoring access gap, not widen it.',
      ],
    },
    {
      id: 3,
      title: 'Safety and Child Protection',
      icon: '🛡',
      summary: 'Student safety is non-negotiable. Every session is protected by multiple layers of content moderation.',
      detail: [
        'Content moderation: 100+ pattern profanity filter active in 5 languages.',
        'Jailbreak detection prevents attempts to bypass educational guardrails.',
        'Session monitoring: all content violations logged and flagged for review.',
        'Excluded authors list prevents exposure to inappropriate content.',
        'Student data is never shared with advertisers or third parties.',
        'Age-appropriate content delivery: KG through A Level, each with appropriate tone and boundaries.',
        'SEN-specific safety protocols for students with additional needs.',
        'Islamic respect rules ensure culturally appropriate content.',
      ],
    },
    {
      id: 4,
      title: 'Data Privacy',
      icon: '🔒',
      summary: 'Student data is protected by enterprise-grade security. We collect only what helps students learn.',
      detail: [
        'Student data stored in Supabase with Row Level Security (RLS) on all 17 tables.',
        'No personally identifiable data shared with external parties.',
        'Parent-controlled accounts for students under 18.',
        'Data deletion available on request — contact privacy@newworld.education.',
        'HSTS 2-year header and strict Content Security Policy (CSP) on all pages.',
        'Session data used exclusively to improve teaching quality for that student.',
        'No advertising. No data monetisation. Education is the only product.',
        'GDPR-aligned data practices as standard.',
      ],
    },
    {
      id: 5,
      title: 'Transparency',
      icon: '👁',
      summary: 'Starky is honest about what it is and what it can do.',
      detail: [
        'Starky always identifies itself as an AI tutor — never pretends to be human.',
        'Limitations are communicated honestly when they arise.',
        'When a question requires professional advice (medical, legal, psychological), Starky directs students to qualified professionals.',
        'Parents and teachers can review student progress and session data.',
        'Our AI model (Claude 3 Haiku by Anthropic) is disclosed — we do not hide what powers our platform.',
        'Teaching methodology is documented and available for educator review.',
      ],
    },
    {
      id: 6,
      title: 'Human Oversight',
      icon: '👥',
      summary: 'AI supports human teachers — it does not replace them.',
      detail: [
        'Teachers and parents maintain full visibility of student progress through dashboards.',
        'School partnerships include educator training and oversight programmes.',
        'Starky is designed as a supplement to human teaching, not a substitute.',
        'Human review of platform learning insights drives continuous improvement.',
        'Content moderation violations are escalated to human review.',
        'Our self-improving systems (signal analysis, auto-improver) are monitored by the founding team.',
      ],
    },
  ],

  compliance: {
    title: 'Compliance Targets',
    status: 'In Progress',
    targets: [
      { region: 'Pakistan', body: 'HEC and Punjab Curriculum Authority', status: 'Aligning', detail: 'Content mapped to SNC (Single National Curriculum) and Cambridge International standards used by Pakistani schools.' },
      { region: 'UAE', body: 'KHDA AI in Education Guidelines', status: 'Aligning', detail: 'Following KHDA guidelines for AI-powered education tools in Dubai schools.' },
      { region: 'UK', body: 'DfE AI in Education Guidance', status: 'Monitoring', detail: 'Tracking UK Department for Education AI guidance for future UK expansion.' },
      { region: 'International', body: 'GDPR-aligned Data Practices', status: 'Active', detail: 'Data handling follows GDPR principles: data minimisation, purpose limitation, storage limitation, and user rights.' },
    ],
  },

  contact: {
    email: 'privacy@newworld.education',
    website: 'https://newworld.education',
    founder: 'Khurram Baig',
  },
};

/**
 * Get the full responsible AI policy for rendering on /responsible-ai page.
 */
export function getResponsibleAIPolicy() {
  return RESPONSIBLE_AI_POLICY;
}

/**
 * components/LegalFooter.jsx — Platform-wide legal disclaimer footer
 * ─────────────────────────────────────────────────────────────────
 * Shows appropriate disclaimers based on page context.
 * Use: <LegalFooter sen={true} /> for SEN pages
 *      <LegalFooter /> for general pages
 */

export default function LegalFooter({ sen = false, sat = false }) {
  return (
    <footer style={{
      padding: '24px 20px 32px',
      background: 'rgba(0,0,0,.3)',
      borderTop: '1px solid rgba(255,255,255,.04)',
      marginTop: 40,
    }}>
      <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>

        {/* SEN-specific disclaimer */}
        {sen && (
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', lineHeight: 1.7, marginBottom: 12 }}>
            <strong style={{ color: 'rgba(255,255,255,.5)' }}>SEN Disclaimer:</strong> This platform provides AI-assisted educational support only. It is not a diagnostic tool, does not provide medical, clinical, or therapeutic advice, and is not a substitute for professional assessment by a qualified educational psychologist, paediatrician, or therapist. Any IEP goals or progress reports are supplementary and do not replace formal EHCP or professional assessments. If your child is in distress or at risk, contact local emergency services immediately.
          </p>
        )}

        {/* General educational disclaimer */}
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', lineHeight: 1.6, marginBottom: 12 }}>
          Starky is an AI educational assistant, not a human teacher. Content is sourced from publicly available examination materials but may contain errors. Exam forecasts are study prioritisation tools, not guarantees. NewWorld Education is an independent platform and is not affiliated with, endorsed by, or licensed by any examination body, educational institution, or SEN framework provider.
          {sat && ' SAT is a registered trademark of the College Board, which is not affiliated with NewWorld Education.'}
          {' '}All examination body names, educational frameworks, and assessment standards referenced are trademarks or intellectual property of their respective owners.
        </p>

        {/* IP notice */}
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,.2)', lineHeight: 1.5, marginBottom: 8 }}>
          Past paper questions remain the intellectual property of their respective examination bodies. Our use is for educational purposes under fair dealing provisions. The Platform's question bank, AI tutor, algorithms, and teaching knowledge bases are the intellectual property of NewWorld Education.
        </p>

        {/* Links */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { label: 'Terms of Service', href: '/terms' },
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Responsible AI', href: '/responsible-ai' },
            { label: 'Contact', href: 'mailto:hello@newworld.education' },
          ].map(({ label, href }) => (
            <a key={label} href={href} style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', textDecoration: 'none' }}>
              {label}
            </a>
          ))}
        </div>

        <p style={{ fontSize: 10, color: 'rgba(255,255,255,.15)', marginTop: 12 }}>
          NewWorld Education | newworld.education
        </p>
      </div>
    </footer>
  );
}

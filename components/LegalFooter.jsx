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
      padding: '16px 20px',
      background: '#080C18',
      borderTop: '1px solid rgba(255,255,255,.06)',
      marginTop: 40,
    }}>
      <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>

        {/* Links first — most important */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 10 }}>
          {[
            { label: 'Terms', href: '/terms' },
            { label: 'Privacy', href: '/privacy' },
            { label: 'Contact', href: 'mailto:hello@newworld.education' },
            { label: 'Founder', href: '/founder' },
            { label: 'Garage School', href: '/garage-login' },
          ].map(({ label, href }) => (
            <a key={label} href={href} style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', textDecoration: 'none' }}>
              {label}
            </a>
          ))}
        </div>

        {/* Compact disclaimer */}
        <p style={{ fontSize: 9, color: 'rgba(255,255,255,.15)', lineHeight: 1.5, margin: '0 0 6px' }}>
          AI educational assistant — not a replacement for teachers. Not affiliated with any examination body.
          {sen && ' Not a diagnostic or therapeutic tool.'}
          {sat && ' SAT® is a trademark of the College Board.'}
        </p>

        <p style={{ fontSize: 9, color: 'rgba(255,255,255,.1)', margin: 0 }}>
          © 2026 NewWorld Education · newworld.education
        </p>
      </div>
    </footer>
  );
}

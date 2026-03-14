import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, recovering: false, recovered: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Send to our logging API
    try {
      fetch('/api/error-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: error?.message || 'Unknown error',
          stack: error?.stack?.substring(0, 500) || '',
          component: info?.componentStack?.substring(0, 300) || '',
          url: typeof window !== 'undefined' ? window.location.href : '',
          time: new Date().toISOString(),
        }),
      }).catch(() => {});
    } catch {}
  }

  handleRetry = () => {
    this.setState({ recovering: true });
    setTimeout(() => {
      this.setState({ hasError: false, error: null, recovering: false, recovered: true });
      setTimeout(() => this.setState({ recovered: false }), 4000);
    }, 1500);
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100dvh',
          background: '#080C18',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: '-apple-system, BlinkMacSystemFont, Inter, sans-serif',
          color: '#fff',
          textAlign: 'center',
        }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #4F8EF7, #7C5CBF)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', marginBottom: '20px',
            boxShadow: '0 0 40px rgba(79,142,247,0.4)',
          }}>★</div>

          <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: '20px', fontWeight: 800, marginBottom: '10px' }}>
            Starky hit a snag
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', maxWidth: '320px', lineHeight: 1.7, marginBottom: '28px' }}>
            Something went wrong on this page. Our team has been notified automatically and will fix it shortly.
          </p>

          <button
            onClick={this.handleRetry}
            disabled={this.state.recovering}
            style={{
              background: this.state.recovering ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #4F8EF7, #6366F1)',
              border: 'none', borderRadius: '14px',
              padding: '14px 32px', color: '#fff',
              fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '16px',
              cursor: this.state.recovering ? 'not-allowed' : 'pointer',
              marginBottom: '14px',
            }}
          >
            {this.state.recovering ? 'Recovering…' : 'Continue My Session →'}
          </button>

          <a href="/" style={{
            fontSize: '13px', color: 'rgba(255,255,255,0.35)',
            textDecoration: 'none',
          }}>← Go to Home</a>

          {this.state.recovered && (
            <div style={{
              marginTop: '20px', background: 'rgba(43,181,90,0.15)',
              border: '1px solid rgba(43,181,90,0.3)', borderRadius: '12px',
              padding: '12px 20px', fontSize: '14px', color: '#2BB55A',
            }}>
              ✓ Issue resolved — you can continue your session
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

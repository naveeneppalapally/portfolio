import React from 'react';

/* ============================================
   VIEW ERROR BOUNDARY
   Catches lazy-load / chunk failures and shows
   a branded retry button so the app never
   white-screens on a bad network.
   ============================================ */

interface State {
  hasError: boolean;
}

class ViewErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    // Log for observability — replace with your error tracking service if needed
    console.error('[ViewErrorBoundary] Lazy load failed:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            gap: '16px',
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>
            Something went wrong loading this page.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{
              background: '#F59E0B',
              color: '#030712',
              padding: '10px 24px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
            }}
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ViewErrorBoundary;

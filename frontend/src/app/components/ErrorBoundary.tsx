import { Component, ReactNode } from 'react';

interface Props { children: ReactNode }
interface State { crashed: boolean; message: string }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { crashed: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { crashed: true, message: error?.message || 'An unexpected error occurred.' };
  }

  componentDidCatch(error: Error) {
    console.error('[ErrorBoundary]', error);
  }

  render() {
    if (this.state.crashed) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 16,
          background: 'var(--bg, #f8f9fd)', padding: 32,
        }}>
          <span style={{ fontSize: 40 }}>⚠️</span>
          <div style={{ fontWeight: 800, fontSize: 20 }}>Something went wrong</div>
          <div style={{ color: 'var(--text-secondary, #666)', maxWidth: 360, textAlign: 'center', fontSize: 14 }}>
            {this.state.message}
          </div>
          <button
            style={{ marginTop: 8, padding: '10px 24px', borderRadius: 999, background: '#3800c0', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}
            onClick={() => { this.setState({ crashed: false, message: '' }); window.location.href = '/'; }}
          >
            Go to Dashboard
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

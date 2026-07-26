import {StrictMode, Component, ReactNode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import '../../src/index.css';

class ErrorBoundary extends Component<
  {children: ReactNode},
  {hasError: boolean; error: Error | null}
> {
  constructor(props: any) {
    super(props);
    this.state = {hasError: false, error: null};
  }

  static getDerivedStateFromError(error: Error) {
    return {hasError: true, error};
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '24px',
          backgroundColor: '#020617',
          color: '#f8fafc',
          fontFamily: 'monospace',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            maxWidth: '640px',
            width: '100%',
            backgroundColor: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
          }}>
            <h1 style={{color: '#f43f5e', fontSize: '20px', fontWeight: 'bold', marginBottom: '8px'}}>
              Admin Panel Render Crash
            </h1>
            <p style={{color: '#94a3b8', fontSize: '13px', marginBottom: '16px'}}>
              The application encountered a runtime rendering error.
            </p>
            <pre style={{
              backgroundColor: '#020617',
              padding: '16px',
              borderRadius: '8px',
              overflowX: 'auto',
              border: '1px solid #1e293b',
              color: '#fda4af',
              fontSize: '12px'
            }}>
              {this.state.error?.toString()}
            </pre>
            <pre style={{
              opacity: 0.6,
              fontSize: '10px',
              marginTop: '12px',
              whiteSpace: 'pre-wrap',
              color: '#94a3b8',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              {this.state.error?.stack}
            </pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

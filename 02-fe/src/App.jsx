import { Component } from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './styles/App.css';
import AppRoutes from './routes';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // user layout: window scroll
    window.scrollTo({ top: 0, behavior: 'instant' });
    // admin layout: scroll main-content div
    const mc = document.querySelector('.main-content');
    if (mc) mc.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0d14', color: '#e2e8f0', padding: '2rem', textAlign: 'center' }}>
          <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '3rem', color: '#e05252', marginBottom: '1rem' }} />
          <h4 style={{ color: '#e05252' }}>Đã xảy ra lỗi</h4>
          <p style={{ color: '#8892a4', maxWidth: '480px', fontSize: '0.9rem' }}>
            {this.state.error?.message ?? 'Lỗi không xác định.'}
          </p>
          <button
            className="btn btn-outline-danger mt-3"
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/home'; }}
          >
            Về trang chủ
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <AppRoutes />
    </ErrorBoundary>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../../api/authService';
import { useAuth } from '../../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username,    setUsername]    = useState('');
  const [password,    setPassword]    = useState('');
  const [showPwd,     setShowPwd]     = useState(false);
  const [error,       setError]       = useState('');
  const [isLoading,   setIsLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const { role, tenhienthi } = await apiLogin(username, password);
      login({ username: username.trim(), tenhienthi, role });
      navigate(role === 'admin' ? '/admin/dashboard' : '/home', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const prefixStyle = {
    backgroundColor: '#141820',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRight: 'none',
    borderRadius: '50px 0 0 50px',
  };

  return (
    <div className="d-flex vh-100" style={{ backgroundColor: '#0a0d14' }}>
      <div
        className="d-none d-md-flex flex-column justify-content-center align-items-center"
        style={{ flex: 1, background: 'linear-gradient(145deg, #e05252 0%, #a02020 100%)', padding: '48px 40px', color: '#fff' }}
      >
        <div className="text-center">
          <div className="mb-4" style={{ fontSize: '4rem', lineHeight: 1 }}>
            <i className="bi bi-book-half" />
          </div>
          <h1 className="fw-bold mb-3" style={{ fontSize: '2.4rem', letterSpacing: '-0.5px' }}>QIBAO</h1>
          <p className="mb-4" style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: 1.7, maxWidth: '320px' }}>
            Chào mừng đến với vũ trụ tiểu thuyết QIBAO — nơi hàng nghìn câu chuyện đang chờ bạn khám phá và quản lý.
          </p>
          <div className="d-flex gap-3 justify-content-center" style={{ opacity: 0.7, fontSize: '1.6rem' }}>
            <i className="bi bi-stars" />
            <i className="bi bi-journal-richtext" />
            <i className="bi bi-bookmarks" />
          </div>
        </div>
      </div>

      <div className="d-flex flex-column justify-content-center align-items-center" style={{ flex: 1, padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div className="text-center mb-4 d-md-none">
            <span className="fw-bold fs-2" style={{ color: 'var(--accent)' }}>
              <i className="bi bi-book-half me-2" />QIBAO
            </span>
          </div>

          <h4 className="fw-bold mb-1" style={{ color: '#e2e8f0' }}>Đăng nhập</h4>

          {error && (
            <div
              className="py-2 px-3 mb-3"
              style={{ backgroundColor: 'rgba(224,82,82,0.12)', color: '#e05252', borderRadius: '12px', border: '1px solid rgba(224,82,82,0.3)', fontSize: '0.85rem' }}
            >
              <i className="bi bi-exclamation-circle me-2" />{error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold small" style={{ color: '#8892a4' }}>Tên đăng nhập</label>
              <div className="input-group">
                <span className="input-group-text" style={prefixStyle}>
                  <i className="bi bi-person" style={{ color: '#e05252' }} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập tên đăng nhập"
                  value={username}
                  onChange={e => { setUsername(e.target.value); setError(''); }}
                  style={{ border: '1px solid rgba(255,255,255,0.1)', borderLeft: 'none', borderRadius: '0 50px 50px 0', boxShadow: 'none', backgroundColor: '#141820', color: '#e2e8f0' }}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold small mb-1" style={{ color: '#8892a4' }}>Mật khẩu</label>
              <div className="input-group">
                <span className="input-group-text" style={prefixStyle}>
                  <i className="bi bi-lock" style={{ color: '#e05252' }} />
                </span>
                <input
                  type={showPwd ? 'text' : 'password'}
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  style={{ border: '1px solid rgba(255,255,255,0.1)', borderLeft: 'none', borderRight: 'none', boxShadow: 'none', backgroundColor: '#141820', color: '#e2e8f0' }}
                />
                <span
                  className="input-group-text"
                  onClick={() => setShowPwd(p => !p)}
                  style={{ backgroundColor: '#141820', border: '1px solid rgba(255,255,255,0.1)', borderLeft: 'none', borderRadius: '0 50px 50px 0', cursor: 'pointer' }}
                >
                  <i className={`bi ${showPwd ? 'bi-eye-slash' : 'bi-eye'}`} style={{ color: '#8892a4' }} />
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn fw-bold w-100 py-2 shadow-sm"
              style={{ borderRadius: '50px', backgroundColor: 'var(--accent)', color: '#fff', fontSize: '0.95rem', opacity: isLoading ? 0.75 : 1 }}
            >
              {isLoading
                ? <><span className="spinner-border spinner-border-sm me-2" role="status" />Đang xử lý...</>
                : <><i className="bi bi-box-arrow-in-right me-2" />Đăng nhập</>
              }
            </button>
          </form>

          <div className="text-center mt-4" style={{ fontSize: '0.85rem', color: '#6b7280' }}>
            Bạn mới biết đến QIBAO?{' '}
            <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Đăng ký ngay</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

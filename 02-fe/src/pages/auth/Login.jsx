import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../../api/authService';
import { useAuth } from '../../context/AuthContext';
import AuthBanner from './AuthBanner';
import '../../styles/Login.css';

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

  return (
    <div className="login-wrapper d-flex vh-100">
      <AuthBanner />

      <div className="login-form-panel d-flex flex-column justify-content-center align-items-center">
        <div className="login-form-box">
          <div className="text-center mb-4 d-md-none">
            <span className="login-mobile-logo fw-bold fs-2">
              <i className="bi bi-book-half me-2" />QIBAO
            </span>
          </div>

          <h4 className="login-title fw-bold mb-1">Đăng nhập</h4>

          {error && (
            <div className="login-error py-2 px-3 mb-3">
              <i className="bi bi-exclamation-circle me-2" />{error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="login-label form-label fw-semibold small">Tên đăng nhập</label>
              <div className="input-group">
                <span className="input-group-text input-prefix">
                  <i className="bi bi-person input-prefix-icon" />
                </span>
                <input
                  type="text"
                  className="form-control login-input"
                  placeholder="Nhập tên đăng nhập"
                  value={username}
                  onChange={e => { setUsername(e.target.value); setError(''); }}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="login-label form-label fw-semibold small mb-1">Mật khẩu</label>
              <div className="input-group">
                <span className="input-group-text input-prefix">
                  <i className="bi bi-lock input-prefix-icon" />
                </span>
                <input
                  type={showPwd ? 'text' : 'password'}
                  className="form-control login-input-pwd"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                />
                <span className="input-group-text login-pwd-toggle" onClick={() => setShowPwd(p => !p)}>
                  <i className={`bi login-pwd-toggle-icon ${showPwd ? 'bi-eye-slash' : 'bi-eye'}`} />
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`login-btn btn fw-bold w-100 py-2 shadow-sm${isLoading ? ' loading' : ''}`}
            >
              {isLoading
                ? <><span className="spinner-border spinner-border-sm me-2" role="status" />Đang xử lý...</>
                : <><i className="bi bi-box-arrow-in-right me-2" />Đăng nhập</>
              }
            </button>
          </form>

          <div className="login-footer-text text-center mt-4">
            Bạn mới biết đến QIBAO?{' '}
            <Link to="/register" className="login-footer-link">Đăng ký ngay</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

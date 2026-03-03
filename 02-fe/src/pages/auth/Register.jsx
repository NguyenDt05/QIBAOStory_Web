import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { checkUsernameExists } from '../../api/authService';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', tenhienthi: '', password: '', confirmPassword: '' });
  const [showPwd,       setShowPwd]       = useState(false);
  const [showConfirm,   setShowConfirm]   = useState(false);
  const [error,         setError]         = useState('');
  const [usernameTaken, setUsernameTaken] = useState(false);

  const update = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    setError('');
    if (field === 'username') {
      checkUsernameExists(value).then(setUsernameTaken);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, tenhienthi, password, confirmPassword } = form;
    if (!username || !tenhienthi || !password || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    if (usernameTaken) {
      setError('Tên đăng nhập đã tồn tại, vui lòng chọn tên khác.');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    navigate('/login');
  };

  const prefixStyle = {
    backgroundColor: '#141820',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRight: 'none',
    borderRadius: '50px 0 0 50px',
  };
  const inputStyle = (extra = {}) => ({
    border: '1px solid rgba(255,255,255,0.1)',
    borderLeft: 'none',
    borderRadius: '0 50px 50px 0',
    boxShadow: 'none',
    backgroundColor: '#141820',
    color: '#e2e8f0',
    ...extra,
  });
  const suffixStyle = {
    backgroundColor: '#141820',
    border: '1px solid rgba(255,255,255,0.1)',
    borderLeft: 'none',
    borderRadius: '0 50px 50px 0',
    cursor: 'pointer',
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

      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ flex: 1, padding: '40px 24px', overflowY: 'auto' }}
      >
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div className="text-center mb-4 d-md-none">
            <span className="fw-bold fs-2" style={{ color: 'var(--accent)' }}>
              <i className="bi bi-book-half me-2" />QIBAO
            </span>
          </div>

          <h4 className="fw-bold mb-1" style={{ color: '#e2e8f0' }}>Đăng ký tài khoản</h4>
          <p className="mb-4" style={{ fontSize: '0.88rem', color: '#8892a4' }}>Điền thông tin để tạo tài khoản mới</p>

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
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label fw-semibold small mb-0" style={{ color: '#8892a4' }}>
                  Tên đăng nhập <span className="text-danger">*</span>
                </label>
                {form.username && usernameTaken && (
                  <small style={{ color: '#e53935' }}><i className="bi bi-x-circle me-1" />Tên đã tồn tại</small>
                )}
                {form.username && !usernameTaken && (
                  <small style={{ color: '#2e7d32' }}><i className="bi bi-check-circle me-1" />Có thể dùng được</small>
                )}
              </div>
              <div className="input-group">
                <span className="input-group-text" style={prefixStyle}>
                  <i className="bi bi-at text-danger" />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="VD: nguyen_van_a"
                  value={form.username}
                  onChange={e => update('username', e.target.value)}
                  style={inputStyle({ borderColor: usernameTaken ? '#e53935' : 'rgba(255,255,255,0.1)' })}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold small" style={{ color: '#8892a4' }}>Tên hiển thị</label>
              <div className="input-group">
                <span className="input-group-text" style={prefixStyle}>
                  <i className="bi bi-person text-danger" />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="VD: Nguyễn Văn A"
                  value={form.tenhienthi}
                  onChange={e => update('tenhienthi', e.target.value)}
                  style={inputStyle()}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold small" style={{ color: '#8892a4' }}>Mật khẩu</label>
              <div className="input-group">
                <span className="input-group-text" style={prefixStyle}>
                  <i className="bi bi-lock text-danger" />
                </span>
                <input
                  type={showPwd ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Tối thiểu 6 ký tự"
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
                  style={inputStyle({ borderRadius: '0', borderRight: 'none' })}
                />
                <span className="input-group-text" onClick={() => setShowPwd(p => !p)} style={suffixStyle}>
                  <i className={`bi ${showPwd ? 'bi-eye-slash' : 'bi-eye'} text-secondary`} />
                </span>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold small" style={{ color: '#8892a4' }}>Xác nhận mật khẩu</label>
              <div className="input-group">
                <span className="input-group-text" style={prefixStyle}>
                  <i className="bi bi-shield-lock text-danger" />
                </span>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Nhập lại mật khẩu"
                  value={form.confirmPassword}
                  onChange={e => update('confirmPassword', e.target.value)}
                  style={inputStyle({ borderRadius: '0', borderRight: 'none' })}
                />
                <span className="input-group-text" onClick={() => setShowConfirm(p => !p)} style={suffixStyle}>
                  <i className={`bi ${showConfirm ? 'bi-eye-slash' : 'bi-eye'} text-secondary`} />
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="btn fw-bold w-100 py-2 shadow-sm"
              style={{ borderRadius: '50px', backgroundColor: 'var(--accent)', color: '#fff', fontSize: '0.95rem' }}
            >
              <i className="bi bi-person-plus me-2" />Đăng ký
            </button>
          </form>

          <div className="text-center mt-4" style={{ fontSize: '0.85rem', color: '#6b7280' }}>
            Đã có tài khoản?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Đăng nhập</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

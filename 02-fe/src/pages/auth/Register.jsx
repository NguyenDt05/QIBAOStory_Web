import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { checkUsernameExists, register as apiRegister } from '../../api/authService';
import AuthBanner from './AuthBanner';
import '../../styles/Register.css';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', tenhienthi: '', password: '', confirmPassword: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Trạng thái đợi Server phản hồi

  const update = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    setError('');
    if (field === 'username') {
      // Debounce nhẹ hoặc check ngay khi nhập
      if (value.trim()) {
        checkUsernameExists(value).then(setUsernameTaken);
      } else {
        setUsernameTaken(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, tenhienthi, password, confirmPassword } = form;

    // 1. Validation tại Client
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

    // 2. Gọi API Đăng ký
    setError('');
    setIsLoading(true);
    try {
      const response = await apiRegister({
        username: username.trim(),
        password,
        tenhienthi: tenhienthi.trim()
      });

      if (response.success) {
        // Có thể dùng toast thông báo ở đây nếu muốn
        navigate('/login', { state: { message: 'Đăng ký thành công! Mời bạn đăng nhập.' } });
      }
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi đăng ký.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reg-wrapper d-flex vh-100">
      <AuthBanner />

      <div className="reg-form-panel d-flex flex-column justify-content-center align-items-center">
        <div className="reg-form-box">
          <div className="text-center mb-4 d-md-none">
            <span className="reg-mobile-logo fw-bold fs-2">
              <i className="bi bi-book-half me-2" />QIBAO
            </span>
          </div>

          <h4 className="reg-title fw-bold mb-1">Đăng ký tài khoản</h4>
          <p className="reg-subtitle mb-4">Điền thông tin để tạo tài khoản mới</p>

          {error && (
            <div className="reg-error py-2 px-3 mb-3">
              <i className="bi bi-exclamation-circle me-2" />{error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="reg-label form-label fw-semibold small mb-0">
                  Tên đăng nhập <span className="text-danger">*</span>
                </label>
                {form.username && usernameTaken && (
                  <small className="reg-username-taken"><i className="bi bi-x-circle me-1" />Tên đã tồn tại</small>
                )}
                {form.username && !usernameTaken && (
                  <small className="reg-username-ok"><i className="bi bi-check-circle me-1" />Có thể dùng được</small>
                )}
              </div>
              <div className="input-group">
                <span className="input-group-text reg-input-prefix">
                  <i className="bi bi-at text-danger" />
                </span>
                <input
                  type="text"
                  className={`form-control reg-input${usernameTaken ? ' input-error' : ''}`}
                  placeholder="VD: nguyen_van_a"
                  value={form.username}
                  onChange={e => update('username', e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="reg-label form-label fw-semibold small">Tên hiển thị</label>
              <div className="input-group">
                <span className="input-group-text reg-input-prefix">
                  <i className="bi bi-person text-danger" />
                </span>
                <input
                  type="text"
                  className="form-control reg-input"
                  placeholder="VD: Nguyễn Văn A"
                  value={form.tenhienthi}
                  onChange={e => update('tenhienthi', e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="reg-label form-label fw-semibold small mb-0">Mật khẩu</label>
                {form.password && form.password.length > 0 && form.password.length < 6 && (
                  <small className="reg-username-taken"><i className="bi bi-x-circle me-1" />Cần ít nhất 6 ký tự</small>
                )}
              </div>
              <div className="input-group">
                <span className="input-group-text reg-input-prefix">
                  <i className="bi bi-lock text-danger" />
                </span>
                <input
                  type={showPwd ? 'text' : 'password'}
                  className="form-control reg-input-pwd"
                  placeholder="Tối thiểu 6 ký tự"
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
                  disabled={isLoading}
                />
                <span className="input-group-text reg-pwd-toggle" onClick={() => setShowPwd(p => !p)}>
                  <i className={`bi ${showPwd ? 'bi-eye-slash' : 'bi-eye'} text-secondary`} />
                </span>
              </div>
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="reg-label form-label fw-semibold small mb-0">Xác nhận mật khẩu</label>
                {form.confirmPassword && form.confirmPassword !== form.password && (
                  <small className="reg-username-taken"><i className="bi bi-x-circle me-1" />Mật khẩu không khớp</small>
                )}
              </div>
              <div className="input-group">
                <span className="input-group-text reg-input-prefix">
                  <i className="bi bi-shield-lock text-danger" />
                </span>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className="form-control reg-input-pwd"
                  placeholder="Nhập lại mật khẩu"
                  value={form.confirmPassword}
                  onChange={e => update('confirmPassword', e.target.value)}
                  disabled={isLoading}
                />
                <span className="input-group-text reg-pwd-toggle" onClick={() => setShowConfirm(p => !p)}>
                  <i className={`bi ${showConfirm ? 'bi-eye-slash' : 'bi-eye'} text-secondary`} />
                </span>
              </div>
            </div>

            <button 
              type="submit" 
              className="reg-btn btn fw-bold w-100 py-2 shadow-sm"
              disabled={isLoading}
            >
              {isLoading ? (
                <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" /> Đang xử lý...</>
              ) : (
                <><i className="bi bi-person-plus me-2" /> Đăng ký</>
              )}
            </button>
          </form>

          <div className="reg-footer-text text-center mt-4">
            Đã có tài khoản?{' '}
            <Link to="/login" className="reg-footer-link">Đăng nhập</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
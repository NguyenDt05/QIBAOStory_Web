import { useState } from 'react';

const FIELDS = [
  { key: 'currentPassword', label: 'Mật khẩu hiện tại',    icon: 'bi-lock' },
  { key: 'newPassword',     label: 'Mật khẩu mới',          icon: 'bi-key' },
  { key: 'confirmPassword', label: 'Xác nhận mật khẩu mới', icon: 'bi-key-fill' },
];

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors]     = useState({});
  const [success, setSuccess]   = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const update = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
    setSuccess(false);
  };

  const validate = () => {
    const e = {};
    if (!form.currentPassword) e.currentPassword = 'Vui lòng nhập mật khẩu hiện tại.';
    if (form.newPassword.length < 6) e.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự.';
    if (form.newPassword && form.newPassword === form.currentPassword)
      e.newPassword = 'Mật khẩu mới phải khác mật khẩu cũ.';
    if (form.confirmPassword !== form.newPassword)
      e.confirmPassword = 'Xác nhận mật khẩu không khớp.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setIsLoading(false);
    setSuccess(true);
    setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="ho-so-panel">
      <div className="ho-so-panel__tieu-de">ĐỔI MẬT KHẨU</div>

      <div className="doi-mat-khau-form">
        {success && (
          <div className="dmk-success">
            <i className="bi bi-check-circle-fill me-2"></i>
            Đổi mật khẩu thành công!
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {FIELDS.map(({ key, label, icon }) => (
            <div className="dmk-group" key={key}>
              <label className="dmk-label">
                <i className={`bi ${icon} me-2`}></i>{label}
              </label>
              <input
                type="password"
                className={`dmk-input${errors[key] ? ' dmk-input--error' : ''}`}
                value={form[key]}
                onChange={e => update(key, e.target.value)}
                autoComplete="new-password"
                disabled={isLoading}
              />
              {errors[key] && <span className="dmk-error">{errors[key]}</span>}
            </div>
          ))}

          <button type="submit" className="dmk-btn-submit" disabled={isLoading}>
            {isLoading
              ? <><span className="spinner-border spinner-border-sm me-2" />Đang lưu...</>
              : <><i className="bi bi-shield-check me-2"></i>Cập nhật mật khẩu</>
            }
          </button>
        </form>
      </div>
    </div>
  );
}

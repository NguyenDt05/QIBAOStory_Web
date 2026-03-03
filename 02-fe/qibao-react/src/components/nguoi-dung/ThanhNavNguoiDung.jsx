import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mauAvatar } from '../../utils/avatar';
import './ThanhNavNguoiDung.css';

/**
 * components/ThanhNavNguoiDung.jsx
 *
 * Navbar người dùng. Hành vi theo role:
 *   - Chưa đăng nhập  : nút Đăng nhập / Đăng ký.
 *   - member           : avatar + tên; hover → Hồ sơ, Đăng xuất.
 *   - admin            : link "⚙ Quản trị" hiện thẳng trên thanh nav
 *                        (bên cạnh Trang chủ / Truyện / Thể loại);
 *                        avatar + tên; hover → Hồ sơ, Đăng xuất.
 */
function ThanhNavNguoiDung() {
  const location = useLocation();
  const navigate  = useNavigate();
  const { nguoiDung, dangXuat } = useAuth();
  const [timKiem,    setTimKiem]    = useState('');
  const [moDropdown, setMoDropdown] = useState(false);

  const isActive = (path) => location.pathname === path;

  const thucHienTimKiem = () => {
    const q = timKiem.trim();
    if (!q) return;
    navigate(`/tim-kiem?q=${encodeURIComponent(q)}`);
  };

  // ── Nav links cố định ──────────────────────────────────────────────────────
  const NAV_LINKS = [
    { path: '/trangchu', label: 'Trang chủ' },
    { path: '/truyen',   label: 'Truyện' },
    { path: '/the-loai', label: 'Thể loại' },
  ];

  return (
    <nav
      className="navbar navbar-expand-lg sticky-top py-2"
      style={{
        backgroundColor: 'rgba(10,13,20,0.92)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        zIndex: 100,
      }}
    >
      <div className="container-fluid px-4 px-lg-5 nav-nguoi-dung-container">

        {/* ── Logo ── */}
        <Link to="/trangchu" className="navbar-brand d-flex align-items-center gap-2 text-decoration-none">
          <i className="bi bi-book-half fs-4" style={{ color: 'var(--primary-color)' }}></i>
          <span className="fw-bold fs-5" style={{ color: 'var(--primary-color)', letterSpacing: '1px' }}>QIBAO</span>
          <small className="text-muted d-none d-md-inline" style={{ fontSize: '0.65rem', lineHeight: 1.2 }}>
            Books here,<br />stories there
          </small>
        </Link>

        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navNguoiDung">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navNguoiDung">

          {/* ── Nav links, cố định giữa tuyệt đối trên desktop ── */}
          <ul className="navbar-nav header-nav-center mb-2 mb-lg-0 gap-1">
            {NAV_LINKS.map(({ path, label }) => (
              <li key={path} className="nav-item">
                <Link
                  to={path}
                  className="nav-link fw-semibold px-3 py-2"
                  style={{
                    borderRadius: '50px',
                    backgroundColor: isActive(path) ? 'var(--primary-color)' : 'transparent',
                    color: isActive(path) ? '#fff' : '#c9d1d9',
                    transition: 'background-color 0.2s, color 0.2s',
                  }}
                >
                  {label}
                </Link>
              </li>
            ))}

            {/* Link Quản trị — chỉ hiện khi role là admin */}
            {nguoiDung?.role === 'admin' && (
              <li className="nav-item">
                <Link
                  to="/app"
                  className="nav-link fw-semibold px-3 py-2"
                  style={{
                    borderRadius: '50px',
                    backgroundColor: isActive('/app') ? 'var(--primary-color)' : 'transparent',
                    color: isActive('/app') ? '#fff' : '#c9d1d9',
                    transition: 'background-color 0.2s, color 0.2s',
                  }}
                >
                  Quản trị
                </Link>
              </li>
            )}
          </ul>

          {/* ── Tìm kiếm + auth ── */}
          <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0 ms-auto">

            {/* Ô tìm kiếm — ẩn với admin */}
            {nguoiDung?.role !== 'admin' && (
              <div
                className="input-group"
                style={{
                  borderRadius: '50px', overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.12)',
                  minWidth: '200px', maxWidth: '260px',
                }}
              >
                <input
                  type="text"
                  className="form-control border-0 ps-3"
                  placeholder="Tìm kiếm..."
                  value={timKiem}
                  onChange={e => setTimKiem(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && thucHienTimKiem()}
                  style={{
                    boxShadow: 'none', fontSize: '0.875rem',
                    backgroundColor: '#141820', color: '#e2e8f0', caretColor: '#e05252',
                  }}
                />
                <button
                  className="btn border-0 pe-3"
                  style={{ backgroundColor: '#141820' }}
                  type="button"
                  onClick={thucHienTimKiem}
                >
                  <i className="bi bi-search text-danger" style={{ fontSize: '0.85rem' }}></i>
                </button>
              </div>
            )}

            {/* ── User info / Đăng nhập-Đăng ký ── */}
            {nguoiDung ? (
              /* ── Đã đăng nhập: avatar + tên, hover → dropdown ── */
              <div
                className="position-relative"
                onMouseEnter={() => setMoDropdown(true)}
                onMouseLeave={() => setMoDropdown(false)}
              >
                {/* Avatar + tên */}
                <div
                  className="d-flex align-items-center gap-2"
                  style={{ cursor: 'default', userSelect: 'none' }}
                >
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%',
                    backgroundColor: mauAvatar(nguoiDung.displayName),
                    color: '#fff', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem',
                    flexShrink: 0, cursor: 'pointer',
                  }}>
                    {nguoiDung.displayName?.charAt(0)?.toUpperCase()}
                  </div>
                  <span style={{
                    color: '#e2e8f0', fontSize: '0.875rem', fontWeight: 600,
                    maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {nguoiDung.displayName}
                  </span>
                  <i className="bi bi-chevron-down" style={{ color: '#8892a4', fontSize: '0.7rem' }}></i>
                </div>

                {/* Dropdown hover — Hồ sơ + Đăng xuất */}
                {moDropdown && (
                  <div style={{
                    position: 'absolute', right: 0, top: '100%',
                    paddingTop: '6px',          /* vùng đệm để chuột không bị gap */
                    minWidth: '170px', zIndex: 200,
                  }}>
                    <div style={{
                      backgroundColor: '#1a1f2e',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px', padding: '6px 0',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
                    }}>
                      {/* Hồ sơ (trang sẽ làm sau) */}
                      <Link
                        to="/ho-so"
                        className="d-flex align-items-center gap-2 px-3 py-2 text-decoration-none"
                        style={{ color: '#e2e8f0', fontSize: '0.85rem' }}
                        onClick={() => setMoDropdown(false)}
                      >
                        <i className="bi bi-person-circle" style={{ color: '#5b8cde' }}></i>
                        Hồ sơ của tôi
                      </Link>

                      <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.07)', margin: '4px 0' }} />

                      {/* Đăng xuất */}
                      <button
                        className="d-flex align-items-center gap-2 px-3 py-2 w-100 text-start"
                        style={{
                          background: 'none', border: 'none',
                          color: '#e05252', fontSize: '0.85rem', cursor: 'pointer',
                        }}
                        onClick={() => { dangXuat(); setMoDropdown(false); navigate('/trangchu'); }}
                      >
                        <i className="bi bi-box-arrow-right"></i>
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ── Chưa đăng nhập ── */
              <>
                <Link
                  to="/dang-nhap"
                  className="btn fw-semibold text-decoration-none"
                  style={{
                    borderRadius: '50px',
                    border: '1.5px solid var(--primary-color)',
                    color: 'var(--primary-color)',
                    padding: '6px 18px', fontSize: '0.875rem', whiteSpace: 'nowrap',
                    backgroundColor: 'rgba(224,82,82,0.08)',
                  }}
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/dang-ky"
                  className="btn fw-semibold text-decoration-none"
                  style={{
                    borderRadius: '50px',
                    backgroundColor: 'var(--primary-color)',
                    color: '#fff',
                    padding: '6px 18px', fontSize: '0.875rem', whiteSpace: 'nowrap',
                  }}
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}

export default ThanhNavNguoiDung;
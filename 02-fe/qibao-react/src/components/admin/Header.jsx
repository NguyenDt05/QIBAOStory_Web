import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mauAvatar } from '../../utils/avatar';
import './Header.css';

function Header() {
  const { nguoiDung, dangXuat } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [moDropdown, setMoDropdown] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg py-2 sticky-top" style={{ backgroundColor: '#0d1117', borderBottom: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 2px 20px rgba(0,0,0,0.4)' }}>
      <div className="container-fluid px-4 px-lg-5 header-admin-container">
        <Link to="/app" className="navbar-brand d-flex align-items-center gap-2 text-decoration-none">
          <i className="bi bi-book-half fs-4" style={{ color: 'var(--primary-color)' }}></i>
          <span className="fw-bold fs-5" style={{ color: 'var(--primary-color)', letterSpacing: '1px' }}>QIBAO</span>
          <small className="text-muted d-none d-md-inline" style={{ fontSize: '0.65rem', lineHeight: 1.2 }}>
            Books here,<br />stories there
          </small>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#topNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="topNav">

          {/* Cột giữa — nav links, cố định giữa tuyệt đối trên desktop */}
          <ul className="navbar-nav header-nav-center gap-1 mb-2 mb-lg-0">
            {[
              { path: '/trangchu', label: 'Trang chủ' },
              { path: '/truyen',   label: 'Truyện' },
              { path: '/the-loai', label: 'Thể loại' },
              { path: '/app',      label: 'Quản trị' },
            ].map(({ path, label }) => (
              <li key={path} className="nav-item">
                <Link
                  to={path}
                  className="nav-link fw-semibold px-3 py-2"
                  style={{
                    borderRadius: '50px',
                    backgroundColor: location.pathname === path ? 'var(--primary-color)' : 'transparent',
                    color: location.pathname === path ? '#fff' : '#c9d1d9',
                    transition: 'background-color 0.2s, color 0.2s',
                  }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Cột phải — user info */}
          <div
            className="position-relative d-flex align-items-center gap-2 mt-2 mt-lg-0 ms-auto"
            style={{ cursor: 'default', userSelect: 'none' }}
            onMouseEnter={() => setMoDropdown(true)}
            onMouseLeave={() => setMoDropdown(false)}
          >
            {/* Avatar */}
            <div
              className="rounded-circle d-flex justify-content-center align-items-center fw-bold"
              style={{
                width: 34, height: 34, flexShrink: 0,
                backgroundColor: nguoiDung ? mauAvatar(nguoiDung.displayName) : '#e05252',
                color: '#fff', fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              {nguoiDung?.displayName?.charAt(0)?.toUpperCase() ?? '?'}
            </div>

            {/* Tên */}
            <span
              className="d-none d-md-block fw-semibold"
              style={{ color: '#e2e8f0', fontSize: '0.875rem', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {nguoiDung?.displayName ?? 'Admin'}
            </span>

            <i className="bi bi-chevron-down" style={{ color: '#8892a4', fontSize: '0.7rem' }}></i>

            {/* Dropdown hover */}
            {moDropdown && (
              <div style={{
                position: 'absolute', right: 0, top: '100%',
                paddingTop: '6px', minWidth: '170px', zIndex: 200,
              }}>
                <div style={{
                  backgroundColor: '#1a1f2e',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px', padding: '6px 0',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
                }}>
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

                  <button
                    className="d-flex align-items-center gap-2 px-3 py-2 w-100 text-start"
                    style={{ background: 'none', border: 'none', color: '#e05252', fontSize: '0.85rem', cursor: 'pointer' }}
                    onClick={() => { dangXuat(); setMoDropdown(false); navigate('/trangchu'); }}
                  >
                    <i className="bi bi-box-arrow-right"></i>
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;


import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Avatar from './Avatar';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const isAdmin = currentUser?.role === 'admin';
  const isActive = (path) => location.pathname === path;

  const handleSearch = () => {
    const q = searchQuery.trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const NAV_LINKS = [
    { path: '/home',       label: 'Trang chủ' },
    { path: '/stories',    label: 'Truyện' },
    { path: '/categories', label: 'Thể loại' },
    ...(isAdmin ? [{ path: '/admin/dashboard', label: 'Quản trị' }] : []),
  ];

  const UserDropdown = () => (
    <div
      className="tn-user"
      onMouseEnter={() => setShowDropdown(true)}
      onMouseLeave={() => setShowDropdown(false)}
    >
      <div className="tn-user__trigger">
        <Avatar tenhienthi={currentUser.tenhienthi} avatar={currentUser.avatar} size={34} className="tn-avatar" />
        <span className="tn-user__name">{currentUser.tenhienthi}</span>
        <i className="bi bi-chevron-down tn-chevron" />
      </div>

      {showDropdown && (
        <div className="tn-dropdown">
          <div className="tn-dropdown__menu">
            <Link
              to="/profile"
              className="tn-dropdown__item"
              onClick={() => setShowDropdown(false)}
            >
              <i className="bi bi-person-circle tn-dropdown__item--icon" />
              Hồ sơ của tôi
            </Link>
            <div className="tn-dropdown__divider" />
            <button
              className="tn-dropdown__logout"
              onClick={() => { logout(); setShowDropdown(false); navigate('/home'); }}
            >
              <i className="bi bi-box-arrow-right" />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const AuthButtons = () => (
    <>
      <Link to="/login"    className="tn-btn-login">Đăng nhập</Link>
      <Link to="/register" className="tn-btn-register">Đăng ký</Link>
    </>
  );

  const SearchBox = () => (
    <div className="tn-search">
      <input
        type="text"
        className="tn-search__input"
        placeholder="Tìm kiếm..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSearch()}
      />
      <button className="tn-search__btn" type="button" onClick={handleSearch}>
        <i className="bi bi-search" />
      </button>
    </div>
  );

  return (
    <nav className="tn-nav">
      <div className="tn-desktop d-none d-lg-grid">
        <Link to="/home" className="tn-logo">
          <i className="bi bi-book-half tn-logo__icon" />
          <span className="tn-logo__text">QIBAO</span>
          <small className="tn-logo__sub">Books here,<br />stories there</small>
        </Link>

        <div className="tn-links">
          {NAV_LINKS.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`tn-link${isActive(path) ? ' tn-link--active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="tn-right">
          {!isAdmin && <SearchBox />}
          {currentUser ? <UserDropdown /> : <AuthButtons />}
        </div>
      </div>

      <nav className="navbar navbar-expand-lg d-lg-none tn-mobile">
        <Link to="/home" className="navbar-brand tn-logo">
          <i className="bi bi-book-half tn-logo__icon" />
          <span className="tn-logo__text">QIBAO</span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMobile"
          aria-controls="navbarMobile"
          aria-expanded="false"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarMobile">
          <ul className="navbar-nav mb-2 mt-2 gap-1">
            {NAV_LINKS.map(({ path, label }) => (
              <li key={path} className="nav-item">
                <Link
                  to={path}
                  className={`tn-link${isActive(path) ? ' tn-link--active' : ''}`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="tn-mobile-auth">
            {!isAdmin && <SearchBox />}
            {currentUser ? (
              <div className="d-flex align-items-center gap-2">
                <Avatar tenhienthi={currentUser.tenhienthi} avatar={currentUser.avatar} size={32} className="tn-mobile-avatar" />
                <span className="tn-user__name">{currentUser.tenhienthi}</span>
                <button
                  className="tn-btn-logout-mobile"
                  onClick={() => { logout(); navigate('/home'); }}
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <>
                <Link to="/login"    className="tn-btn-login">Đăng nhập</Link>
                <Link to="/register" className="tn-btn-register">Đăng ký</Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </nav>
  );
}

export default Navbar;

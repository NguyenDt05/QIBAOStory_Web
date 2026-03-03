import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { path: '/admin/dashboard', icon: 'bi-grid-fill',  label: 'Tổng quan' },
  { path: '/admin/stories',   icon: 'bi-book',       label: 'Quản lý truyện' },
  { path: '/admin/categories',icon: 'bi-tags',       label: 'Quản lý thể loại' },
  { path: '/admin/users',     icon: 'bi-people',     label: 'Quản lý người dùng' },
  { path: '/admin/comments',  icon: 'bi-chat-dots',  label: 'Quản lý bình luận' },
];

function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="sidebar d-none d-md-flex flex-shrink-0">
      {NAV_ITEMS.map(({ path, icon, label }) => (
        <Link
          key={path}
          to={path}
          className={`sidebar-btn${location.pathname === path ? ' active' : ''}`}
        >
          <i className={`bi ${icon}`} /> {label}
        </Link>
      ))}

      <button
        className="btn btn-outline-danger rounded-pill mt-auto fw-bold py-2"
        onClick={() => { logout(); navigate('/home'); }}
      >
        <i className="bi bi-box-arrow-left" /> Đăng xuất
      </button>
    </div>
  );
}

export default AdminSidebar;

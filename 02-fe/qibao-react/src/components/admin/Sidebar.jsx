import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { dangXuat } = useAuth();
  return (
    <div className="sidebar d-none d-md-flex flex-shrink-0">
      <Link to="/app" className={`sidebar-btn${location.pathname === '/app' ? ' active' : ''}`}>
        <i className="bi bi-grid-fill"></i> Tổng quan
      </Link>
      <Link to="/quan-ly-truyen" className={`sidebar-btn${location.pathname === '/quan-ly-truyen' ? ' active' : ''}`}>
        <i className="bi bi-book"></i> Quản lý truyện
      </Link>
      <Link to="/quan-ly-the-loai" className={`sidebar-btn${location.pathname === '/quan-ly-the-loai' ? ' active' : ''}`}>
        <i className="bi bi-tags"></i> Quản lý thể loại
      </Link>
      <Link to="/quan-ly-nguoi-dung" className={`sidebar-btn${location.pathname === '/quan-ly-nguoi-dung' ? ' active' : ''}`}>
        <i className="bi bi-people"></i> Quản lý người dùng
      </Link>
      <Link to="/quan-ly-binh-luan" className={`sidebar-btn${location.pathname === '/quan-ly-binh-luan' ? ' active' : ''}`}>
        <i className="bi bi-chat-dots"></i> Quản lý bình luận
      </Link>
      <button
        className="btn btn-outline-danger rounded-pill mt-auto fw-bold py-2"
        onClick={() => { dangXuat(); navigate('/trangchu'); }}
      >
        <i className="bi bi-box-arrow-left"></i> Đăng xuất
      </button>
    </div>
  );
}

export default Sidebar;

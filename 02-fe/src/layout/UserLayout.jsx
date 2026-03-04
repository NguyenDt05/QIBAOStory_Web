import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';

function UserLayout() {
  return (
    <div>
      <Navbar />

      <div>
        <Outlet />
        <footer style={{ backgroundColor: '#0d0f18', padding: '22px 0', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ textAlign: 'center', fontSize: '0.78rem', color: '#4a5568' }}>
              {`© ${new Date().getFullYear()} QIBAO - Hệ thống quản lý và đọc truyện trực tuyến`}
            </div>
        </footer>
      </div>
    </div>
  );
}

export default UserLayout;
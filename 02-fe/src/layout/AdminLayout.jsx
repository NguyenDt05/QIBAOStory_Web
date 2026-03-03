import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import AdminSidebar from '../components/admin/AdminSidebar';

function AdminLayout() {
  return (
    <div className="d-flex flex-column vh-100">
      <Navbar />
      <div className="d-flex flex-grow-1 overflow-hidden">
        <AdminSidebar />
        <div className="main-content p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;

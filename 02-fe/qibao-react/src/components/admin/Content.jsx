import { Outlet } from 'react-router-dom';

/**
 * Wrapper vùng nội dung admin.
 * Các route được định nghĩa trong App.jsx (layout route <AdminLayout />).
 */
function Content() {
  return (
    <div className="main-content p-4">
      <Outlet />
    </div>
  );
}

export default Content;

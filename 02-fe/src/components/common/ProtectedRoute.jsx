import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Bảo vệ route chỉ dành cho Admin.
 * - Chưa đăng nhập → redirect /login
 * - Đã đăng nhập nhưng không phải admin → redirect /home
 */
export default function AdminRoute({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== 'admin') {
    return <Navigate to="/home" replace />;
  }

  return children;
}

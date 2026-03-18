import { useState, useEffect } from 'react';
import { getAllUsers, toggleUserStatus, deleteUser } from '../../../api/userService';
import { USER_ROLES, getRoleLabel } from '../../../constants/roles';
import ConfirmDeleteModal from '../../../components/common/ConfirmDeleteModal';
import Avatar from '../../../components/common/Avatar';
import { Pagination } from '../../../components/common/StoryCard';

const PAGE_SIZE = 15;

export default function ManageUsers() {
  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [currentPage,   setCurrentPage]  = useState(1);

  useEffect(() => {
    getAllUsers().then(setUsers).finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u => {
    const matchName = u.username.toLowerCase().includes(search.toLowerCase()) ||
                      u.tenhienthi.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole ? u.role === filterRole : true;
    return matchName && matchRole;
  });

  useEffect(() => { setCurrentPage(1); }, [search, filterRole]);
  const totalPages   = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleToggle = async (u) => {
    if (u.role === 'admin') return;
    // toggleUserStatus trả về array mới sau khi server cập nhật
    const updatedList = await toggleUserStatus(u.userid);
    setUsers(Array.isArray(updatedList) ? updatedList : []);
  };

  const handleDelete = async () => {
    // deleteUser trả về array mới (đã gọi getAllUsers() lại từ server)
    const updatedList = await deleteUser(deleteTarget.userid);
    setUsers(Array.isArray(updatedList) ? updatedList : []);
    setDeleteTarget(null);
  };

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'admin':  return { backgroundColor: '#e3f2fd', color: '#1565c0' };
      case 'mod':    return { backgroundColor: '#f3e5f5', color: '#6a1b9a' };
      default:       return { backgroundColor: 'var(--surface-2)', color: 'var(--text-muted)' };
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h4 className="fw-bold mb-0" style={{ color: 'var(--primary-color)' }}>
            <i className="bi bi-people-fill me-2"></i>Quản lý người dùng
          </h4>
          <small className="text-muted">Tổng cộng {users.length} người dùng</small>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--surface-1)', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 6px 24px rgba(0,0,0,0.4)', overflow: 'hidden' }}>
        {/* Filters */}
        <div className="p-3 d-flex flex-wrap gap-2 align-items-center" style={{ borderBottom: '1px solid var(--border)' }}>
          <input type="text" className="form-control" placeholder="Tìm theo tên hiển thị hoặc tên đăng nhập..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)', maxWidth: 320 }} />
          <select className="form-select" value={filterRole} onChange={e => setFilterRole(e.target.value)}
            style={{ borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)', maxWidth: 180 }}>
            <option value="">Tất cả vai trò</option>
            {Object.entries(USER_ROLES).map(([key, obj]) => (
              <option key={key} value={key}>{obj.label}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-5 text-muted"><div className="spinner-border spinner-border-sm me-2"></div>Đang tải...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-person-x fs-1 d-block mb-2"></i>Không tìm thấy người dùng nào.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 text-nowrap">
              <thead style={{ backgroundColor: 'var(--surface-2)', fontSize: '0.8rem' }}>
                <tr>
                  <th className="ps-4 text-secondary fw-semibold">Người dùng</th>
                  <th className="text-secondary fw-semibold">Tên đăng nhập</th>
                  <th className="text-secondary fw-semibold text-center">Vai trò</th>
                  <th className="text-secondary fw-semibold">Ngày tham gia</th>
                  <th className="text-secondary fw-semibold text-center">Hoạt động</th>
                  <th className="text-secondary fw-semibold text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map(u => {
                  const isAdmin = u.role === 'admin';
                  return (
                    <tr key={u.userid} style={{ opacity: isAdmin || u.status === 1 ? 1 : 0.4, transition: 'opacity 0.2s' }}>
                      <td className="ps-4">
                        <div className="d-flex align-items-center gap-2">
                          <Avatar tenhienthi={u.tenhienthi} avatar={u.avatar} size={36} />
                          <span className="fw-semibold" style={{ fontSize: '0.9rem' }}>{u.tenhienthi}</span>
                        </div>
                      </td>
                      <td className="text-secondary" style={{ fontSize: '0.85rem' }}>@{u.username}</td>
                      <td className="text-center">
                        <span className="badge fw-semibold" style={{ ...getRoleBadgeStyle(u.role), borderRadius: '50px', padding: '4px 12px', fontSize: '0.75rem' }}>
                          {getRoleLabel(u.role)}
                        </span>
                      </td>
                      <td className="text-secondary" style={{ fontSize: '0.82rem' }}>
                        {/* createdat — tên cột trong bảng users */}
                        {u.createdat ? new Date(u.createdat).toLocaleDateString('vi-VN') : '—'}
                      </td>
                      <td className="text-center">
                        {isAdmin ? (
                          <span className="text-muted" style={{ fontSize: '0.78rem' }}>Không thể chỉnh sửa</span>
                        ) : (
                          <div className="form-check form-switch d-flex justify-content-center mb-0">
                            <input className="form-check-input" type="checkbox" role="switch"
                              checked={u.status === 1} onChange={() => handleToggle(u)}
                              style={{ width: '2.2em', height: '1.2em', cursor: 'pointer', accentColor: 'var(--primary-color)' }} />
                          </div>
                        )}
                      </td>
                      <td className="text-center">
                        {isAdmin ? (
                          <span className="text-muted" style={{ fontSize: '0.78rem' }}>—</span>
                        ) : (
                          <button className="btn btn-sm" onClick={() => setDeleteTarget(u)}
                            style={{ borderRadius: '50px', backgroundColor: 'rgba(220,53,69,0.1)', color: '#dc3545', border: 'none', padding: '4px 14px', fontSize: '0.8rem' }}>
                            <i className="bi bi-trash-fill me-1"></i>Xóa
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {filtered.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={p => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        />
      )}

      <ConfirmDeleteModal
        show={!!deleteTarget}
        title="Xóa người dùng"
        message={`Bạn có chắc chắn muốn xóa tài khoản "${deleteTarget?.tenhienthi}" (@${deleteTarget?.username}) không? Hành động này không thể hoàn tác.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}

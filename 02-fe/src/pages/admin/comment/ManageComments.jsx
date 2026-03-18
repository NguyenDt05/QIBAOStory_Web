import { useState, useEffect } from 'react';
import { getAllComments, toggleCommentVisibility, deleteComment } from '../../../api/commentService';
import ConfirmDeleteModal from '../../../components/common/ConfirmDeleteModal';
import Avatar from '../../../components/common/Avatar';
import { Pagination } from '../../../components/common/StoryCard';

const PAGE_SIZE = 15;

export default function ManageComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [currentPage,  setCurrentPage]  = useState(1);

  useEffect(() => {
    getAllComments().then(setComments).finally(() => setLoading(false));
  }, []);

  const filtered = comments.filter(c => {
    const q = search.toLowerCase();
    return (
      c.content?.toLowerCase().includes(q) ||
      c.username?.toLowerCase().includes(q) ||
      c.tenhienthi?.toLowerCase().includes(q) ||
      c.storyTitle?.toLowerCase().includes(q)
    );
  });

  useEffect(() => { setCurrentPage(1); }, [search]);
  const totalPages   = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Toggle dùng cmtid (PK thật trong bảng comment)
  const handleToggle = async (c) => {
    const updated = await toggleCommentVisibility(c.cmtid);
    if (Array.isArray(updated)) setComments(updated);
    else getAllComments().then(list => { if (Array.isArray(list)) setComments(list); });
  };

  // Delete dùng cmtid
  const handleDelete = async () => {
    const updated = await deleteComment(deleteTarget.cmtid);
    if (Array.isArray(updated)) setComments(updated);
    else getAllComments().then(list => { if (Array.isArray(list)) setComments(list); });
    setDeleteTarget(null);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h4 className="fw-bold mb-0" style={{ color: 'var(--primary-color)' }}>
            <i className="bi bi-chat-left-text-fill me-2"></i>Quản lý bình luận
          </h4>
          <small className="text-muted">Tổng cộng {comments.length} bình luận</small>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--surface-1)', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 6px 24px rgba(0,0,0,0.4)', overflow: 'hidden' }}>
        <div className="p-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <input type="text" className="form-control" placeholder="Tìm theo nội dung, người dùng, tên truyện..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)', maxWidth: 380 }} />
        </div>

        {loading ? (
          <div className="text-center py-5 text-muted"><div className="spinner-border spinner-border-sm me-2"></div>Đang tải...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-chat-square-x fs-1 d-block mb-2"></i>Không tìm thấy bình luận nào.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead style={{ backgroundColor: 'var(--surface-2)', fontSize: '0.8rem' }}>
                <tr>
                  <th className="ps-4 text-secondary fw-semibold text-nowrap">Người dùng</th>
                  <th className="text-secondary fw-semibold">Nội dung</th>
                  <th className="text-secondary fw-semibold text-nowrap">Truyện</th>
                  <th className="text-secondary fw-semibold text-center text-nowrap">Ngày đăng</th>
                  <th className="text-secondary fw-semibold text-center text-nowrap">Hiển thị</th>
                  <th className="text-secondary fw-semibold text-center text-nowrap">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map(c => (
                  // Dùng cmtid — PK thật trong bảng comment
                  <tr key={c.cmtid} style={{ opacity: c.visible === 1 ? 1 : 0.4, transition: 'opacity 0.2s' }}>
                    <td className="ps-4 text-nowrap">
                      <div className="d-flex align-items-center gap-2">
                        <Avatar tenhienthi={c.tenhienthi} avatar={c.avatar} size={32} />
                        <div>
                          <div className="fw-semibold" style={{ fontSize: '0.85rem' }}>{c.tenhienthi}</div>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>@{c.username}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ maxWidth: 260, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.85rem' }}>
                      <span title={c.content}>{c.content}</span>
                    </td>
                    <td className="text-secondary text-nowrap" style={{ fontSize: '0.82rem', maxWidth: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <i className="bi bi-book me-1"></i>{c.storyTitle}
                    </td>
                    {/* createdat là tên cột thật trong DB bảng comment */}
                    <td className="text-center text-secondary text-nowrap" style={{ fontSize: '0.8rem' }}>
                      {c.createdat ? new Date(c.createdat).toLocaleString('vi-VN') : '—'}
                    </td>
                    <td className="text-center">
                      <div className="form-check form-switch d-flex justify-content-center mb-0">
                        {/* visible: 1=hiển thị, 0=ẩn */}
                        <input className="form-check-input" type="checkbox" role="switch"
                          checked={c.visible === 1} onChange={() => handleToggle(c)}
                          style={{ width: '2.2em', height: '1.2em', cursor: 'pointer', accentColor: 'var(--primary-color)' }} />
                      </div>
                    </td>
                    <td className="text-center text-nowrap">
                      <button className="btn btn-sm" onClick={() => setDeleteTarget(c)}
                        style={{ borderRadius: '50px', backgroundColor: 'rgba(220,53,69,0.1)', color: '#dc3545', border: 'none', padding: '4px 14px', fontSize: '0.8rem' }}>
                        <i className="bi bi-trash-fill me-1"></i>Xóa
                      </button>
                    </td>
                  </tr>
                ))}
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
        title="Xóa bình luận"
        message={`Bạn có chắc chắn muốn xóa bình luận này của "${deleteTarget?.tenhienthi}" không? Hành động này không thể hoàn tác.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GenreSelect, { GenreBadge } from '../../../components/common/GenreSelect';
import ConfirmDeleteModal from '../../../components/common/ConfirmDeleteModal';
import { getAllStories, toggleStoryVisibility, deleteStory } from '../../../api/storyService';
import { STORY_STATUS } from '../../../constants/storyStatus';

export default function ManageStories() {
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);

  useEffect(() => { getAllStories().then(setStories); }, []);

  const [search,        setSearch]        = useState('');
  const [filterGenre,   setFilterGenre]   = useState([]);
  const [filterStatus,  setFilterStatus]  = useState('');
  const [deleteId,      setDeleteId]      = useState(null);

  const handleToggle = (storyid) => toggleStoryVisibility(storyid).then(setStories);
  const handleDelete = (storyid) => { deleteStory(storyid).then(setStories); setDeleteId(null); };

  const filtered = stories.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.author.toLowerCase().includes(search.toLowerCase());
    const matchGenre  = filterGenre.length === 0 || (t.categories ?? []).some(c => filterGenre.includes(c.categoryID));
    const matchStatus = !filterStatus || t.trangthai_rachuong === filterStatus;
    return matchSearch && matchGenre && matchStatus;
  });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0" style={{ color: 'var(--primary-color)' }}>
            <i className="bi bi-book me-2"></i>Quản lý truyện
          </h4>
          <small className="text-muted">Danh sách toàn bộ truyện trong hệ thống</small>
        </div>
      </div>

      {/* Filter bar */}
      <div className="mb-4 p-3" style={{ backgroundColor: 'var(--surface-1)', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 6px 24px rgba(0,0,0,0.4)' }}>
        <div className="row g-3 align-items-center">
          <div className="col-md-5">
            <div className="input-group" style={{ borderRadius: '50px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span className="input-group-text border-0 ps-3" style={{ backgroundColor: '#1c2232' }}>
                <i className="bi bi-search text-danger"></i>
              </span>
              <input type="text" className="form-control border-0 ps-1" placeholder="Tìm tên truyện, tác giả..."
                value={search} onChange={e => setSearch(e.target.value)} style={{ boxShadow: 'none' }} />
              {search && (
                <button className="btn border-0 pe-3" style={{ backgroundColor: '#1c2232' }} onClick={() => setSearch('')}>
                  <i className="bi bi-x text-secondary"></i>
                </button>
              )}
            </div>
          </div>

          <div className="col-md-2">
            <GenreSelect selected={filterGenre} onChange={setFilterGenre} label={false} placeholder="Tất cả thể loại" showTags={false} />
          </div>

          <div className="col-md-2">
            <select className="form-select text-secondary" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              style={{ borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'none' }}>
              <option value="">Trạng thái</option>
              {Object.entries(STORY_STATUS).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>

          <div className="col-md-3 text-end">
            <Link to="/admin/stories/add" className="btn fw-bold shadow-sm text-decoration-none w-100"
              style={{ backgroundColor: 'var(--primary-color)', color: '#fff', borderRadius: '50px' }}>
              <i className="bi bi-plus-lg me-2"></i>Thêm truyện mới
            </Link>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: 'var(--surface-1)', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 6px 24px rgba(0,0,0,0.4)', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead style={{ backgroundColor: 'var(--surface-2)' }}>
              <tr>
                <th className="ps-4 py-3 text-secondary fw-semibold small border-bottom-0">Tên truyện</th>
                <th className="py-3 text-secondary fw-semibold small border-bottom-0">Tác giả</th>
                <th className="py-3 text-secondary fw-semibold small border-bottom-0">Thể loại</th>
                <th className="py-3 text-secondary fw-semibold small border-bottom-0">Trạng thái</th>
                <th className="py-3 text-secondary fw-semibold small border-bottom-0">Cập nhật</th>
                <th className="py-3 px-3 text-secondary fw-semibold small border-bottom-0">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-5 small">
                    <i className="bi bi-inbox d-block mb-2" style={{ fontSize: '2rem' }}></i>
                    Không tìm thấy truyện nào
                  </td>
                </tr>
              ) : filtered.map(t => {
                const statusInfo = STORY_STATUS[t.trangthai_rachuong] ?? STORY_STATUS.dangra;
                return (
                  <tr key={t.storyid} style={{ borderTop: '1px solid var(--border)', opacity: t.status ? 1 : 0.4 }}>
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center">
                        <div className="d-flex align-items-center justify-content-center text-muted fw-bold me-3"
                          style={{ width: '40px', height: '52px', fontSize: '0.75rem', backgroundColor: 'var(--surface-2)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                          IMG
                        </div>
                        <div>
                          <div className="fw-bold" style={{ cursor: 'pointer' }}
                            onClick={() => navigate('/admin/stories/detail', { state: { story: t } })}>
                            {t.title}
                          </div>
                          <small className="text-muted" style={{ fontSize: '0.75rem' }}>ID: #{t.storyid}</small>
                        </div>
                      </div>
                    </td>
                    <td className="text-secondary">{t.author}</td>
                    <td>{(t.categories ?? []).map(c => <GenreBadge key={c.categoryID} value={c.categoryID} label={c.categoryname} />)}</td>
                    <td>
                      <span className="fw-semibold small px-3 py-1"
                        style={{ borderRadius: '50px', backgroundColor: statusInfo.bg, color: statusInfo.color }}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="text-muted small">{t.updatedat}</td>
                    <td className="px-3">
                      <div className="d-flex align-items-center gap-2">
                        <div className="form-check form-switch mb-0" title={t.status ? 'Đang hiện' : 'Đang ẩn'}>
                          <input className="form-check-input" type="checkbox" role="switch"
                            checked={!!t.status} onChange={() => handleToggle(t.storyid)}
                            style={{ cursor: 'pointer', width: '2.2em', height: '1.2em', accentColor: 'var(--primary-color)' }} />
                        </div>
                        <button className="btn btn-sm fw-bold"
                          style={{ borderRadius: '50px', backgroundColor: '#e3f2fd', color: '#1565c0', border: 'none' }}
                          onClick={() => navigate('/admin/stories/edit', { state: { story: t } })}>
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button className="btn btn-sm fw-bold"
                          style={{ borderRadius: '50px', backgroundColor: 'rgba(224,82,82,0.1)', color: 'var(--primary-color)', border: 'none' }}
                          onClick={() => setDeleteId(t.storyid)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDeleteModal
        show={deleteId !== null}
        title="Bạn chắc chắn muốn xóa truyện này?"
        message="Truyện sẽ bị xóa khỏi hệ thống. Thao tác này không thể hoàn tác."
        onCancel={() => setDeleteId(null)}
        onConfirm={() => handleDelete(deleteId)}
      />
    </div>
  );
}

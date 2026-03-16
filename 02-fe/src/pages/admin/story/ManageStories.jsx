import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GenreSelect, { GenreBadge } from '../../../components/common/GenreSelect';
import ConfirmDeleteModal from '../../../components/common/ConfirmDeleteModal';
import { getAllStories, toggleStoryVisibility, deleteStory } from '../../../api/storyService';
import { STORY_STATUS } from '../../../constants/storyStatus';
import { Pagination } from '../../../components/common/StoryCard';

const PAGE_SIZE = 15;

export default function ManageStories() {
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load dữ liệu ban đầu
  const loadData = async () => {
    try {
      const data = await getAllStories();
      setStories(data);
    } catch (err) {
      console.error("Lỗi tải danh sách:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const [search, setSearch] = useState('');
  const [filterGenre, setFilterGenre] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Xử lý Toggle Ẩn/Hiện
  const handleToggle = async (storyid) => {
    try {
      const updatedList = await toggleStoryVisibility(storyid);
      setStories(updatedList);
    } catch (err) {
      alert("Không thể thay đổi trạng thái!");
    }
  };

  // Xử lý Xóa
  const handleDelete = async (storyid) => {
    try {
      const newList = await deleteStory(storyid);
      setStories(newList);
      setDeleteId(null);
    } catch (err) {
      alert("Xóa thất bại!");
    }
  };

  // Logic lọc dữ liệu
  const filtered = stories.filter(t => {
    const matchSearch = (t.title?.toLowerCase() || "").includes(search.toLowerCase()) || 
                        (t.author?.toLowerCase() || "").includes(search.toLowerCase());
    const matchGenre = filterGenre.length === 0 || (t.categories ?? []).some(c => filterGenre.includes(c.categoryID || c.categoryid));
    const matchStatus = !filterStatus || t.trangthai_rachuong === filterStatus;
    return matchSearch && matchGenre && matchStatus;
  });

  useEffect(() => { setCurrentPage(1); }, [search, filterGenre, filterStatus]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  if (loading) return <div className="text-center py-5 text-muted">Đang tải danh sách truyện...</div>;

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
                <option key={key} value={val.value}>{val.label}</option>
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
                <th className="py-3 text-secondary fw-semibold small border-bottom-0 text-center">Số chương</th>
                <th className="py-3 text-secondary fw-semibold small border-bottom-0 text-center" style={{ width: '25%' }}>Thể loại</th>
                <th className="py-3 text-secondary fw-semibold small border-bottom-0">Trạng thái</th>
                <th className="py-3 px-3 text-secondary fw-semibold small border-bottom-0 text-center">Hành động</th>
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
              ) : currentItems.map(t => {
                const statusInfo = STORY_STATUS[t.trangthai_rachuong] ?? Object.values(STORY_STATUS).find(s => s.value === t.trangthai_rachuong) ?? STORY_STATUS.dangra;
                return (
                  <tr key={t.storyid} style={{ borderTop: '1px solid var(--border)', opacity: t.status ? 1 : 0.4 }}>
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center">
                        <div className="me-3" style={{ width: '45px', height: '60px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border)', backgroundColor: '#2a3142' }}>
                          {t.coverUrl ? (
                            <img src={t.coverUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div className="d-flex h-100 align-items-center justify-content-center text-muted" style={{ fontSize: '10px' }}>NO IMG</div>
                          )}
                        </div>
                        <div>
                          <div className="fw-bold text-light" style={{ cursor: 'pointer' }}
                            onClick={() => navigate(`/admin/stories/detail/${t.storyid}`, { state: { story: t } })}>
                            {t.title}
                          </div>
                          <small className="text-muted" style={{ fontSize: '0.75rem' }}>ID: #{t.storyid}</small>
                        </div>
                      </div>
                    </td>
                    <td className="text-secondary">{t.author}</td>
                    <td className="text-center fw-bold" style={{ color: 'var(--primary-color)' }}>
                      {t.storyCount ?? 0}
                    </td>
                    {/* LOGIC HIỂN THỊ THỂ LOẠI MỚI (MAX 2 + X) */}
                    <td className="text-center">
                      <div className="d-flex flex-wrap gap-1 justify-content-center align-items-center">
                        {(t.categories ?? []).slice(0, 2).map(c => (
                          <GenreBadge key={c.categoryID || c.categoryid} value={c.categoryID || c.categoryid} label={c.categoryname} />
                        ))}
                        {t.categories?.length > 2 && (
                          <span 
                            className="fw-bold" 
                            style={{ 
                              fontSize: '0.75rem', 
                              color: 'var(--primary-color)', 
                              backgroundColor: 'rgba(224,82,82,0.1)', 
                              padding: '2px 8px',
                              borderRadius: '50px',
                              cursor: 'help'
                            }}
                            title={t.categories.slice(2).map(c => c.categoryname).join(', ')}
                          >
                            +{t.categories.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="fw-semibold small px-3 py-1"
                        style={{ borderRadius: '50px', backgroundColor: statusInfo.bg || statusInfo.bgColor, color: statusInfo.color || statusInfo.textColor }}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-3">
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        <div className="form-check form-switch mb-0" title={t.status ? 'Đang hiện' : 'Đang ẩn'}>
                          <input className="form-check-input" type="checkbox" role="switch"
                            checked={!!t.status} onChange={() => handleToggle(t.storyid)}
                            style={{ cursor: 'pointer', width: '2.2em', height: '1.2em', accentColor: 'var(--primary-color)' }} />
                        </div>
                        <button className="btn btn-sm fw-bold"
                          style={{ borderRadius: '50px', backgroundColor: '#e3f2fd', color: '#1565c0', border: 'none' }}
                          onClick={() => navigate(`/admin/stories/edit/${t.storyid}`, { state: { story: t } })}>
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

      {filtered.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={p => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        />
      )}

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
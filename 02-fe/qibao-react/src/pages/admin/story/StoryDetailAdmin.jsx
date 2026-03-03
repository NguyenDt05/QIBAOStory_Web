import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getChaptersByStory, toggleChapterVisibility, deleteChapter } from '../../../api/chapterService';
import { GenreBadge } from '../../../components/common/GenreSelect';
import ConfirmDeleteModal from '../../../components/common/ConfirmDeleteModal';
import StoryCover from '../../../components/common/StoryCover';
import { STORY_STATUS, getStatusStyle } from '../../../constants/storyStatus';

export default function StoryDetailAdmin() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const story = state?.story;

  const [chapters, setChapters] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 20;

  useEffect(() => {
    if (!story?.storyid) return;
    setLoading(true);
    getChaptersByStory(story.storyid)
      .then(setChapters)
      .finally(() => setLoading(false));
  }, [story?.storyid]);

  const handleToggleChapter = (c) => {
    toggleChapterVisibility(story.storyid, c.chapterid, chapters).then(updated => {
      setChapters(updated);
    });
  };

  const handleDeleteChapter = () => {
    deleteChapter(story.storyid, deleteTarget.chapterid, chapters)
      .then(updated => {
        setChapters(updated);
        const totalPages = Math.max(1, Math.ceil((updated.length) / PAGE_SIZE));
        if (currentPage > totalPages) setCurrentPage(totalPages);
        setDeleteTarget(null);
      });
  };

  const totalPages = Math.max(1, Math.ceil(chapters.length / PAGE_SIZE));
  const pagedChapters = chapters.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  if (!story) {
    return (
      <div className="text-center py-5 text-muted">
        <i className="bi bi-exclamation-circle-fill fs-1 d-block mb-2"></i>
        Không tìm thấy truyện. <Link to="/admin/stories">Quay lại danh sách</Link>
      </div>
    );
  }

  const statusStyle = getStatusStyle(story.trangthai_rachuong);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h4 className="fw-bold mb-0" style={{ color: 'var(--primary-color)' }}>
            <i className="bi bi-book me-2"></i>Chi tiết truyện
          </h4>
          <small className="text-muted">{story.title}</small>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <Link to="/admin/stories" className="btn fw-bold text-decoration-none"
            style={{ borderRadius: '50px', backgroundColor: 'rgba(224,82,82,0.1)', color: 'var(--primary-color)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 22px' }}>
            <i className="bi bi-arrow-left me-2"></i>Quay lại
          </Link>
          <button className="btn fw-bold"
            onClick={() => navigate('/admin/stories/edit', { state: { story } })}
            style={{ borderRadius: '50px', backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffc107', padding: '8px 22px' }}>
            <i className="bi bi-pencil-fill me-2"></i>Sửa truyện
          </button>
          <button className="btn fw-bold"
            onClick={() => navigate('/admin/chapters/add', { state: { story } })}
            style={{ borderRadius: '50px', backgroundColor: 'rgba(25,135,84,0.15)', color: '#198754', border: '1px solid rgba(25,135,84,0.3)', padding: '8px 22px' }}>
            <i className="bi bi-plus-lg me-2"></i>Thêm chương
          </button>
        </div>
      </div>

      {/* Story info card */}
      <div className="mb-4" style={{ backgroundColor: 'var(--surface-1)', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 6px 24px rgba(0,0,0,0.4)', padding: '24px' }}>
        <div className="row g-3 align-items-start">
          <div className="col-md-2 col-4">
            <StoryCover
              cover={story.cover}
              title={story.title}
              storyid={story.storyid}
              iconFallback
              style={{ width: '100%', aspectRatio: '2/3', borderRadius: '12px' }}
            />
          </div>
          <div className="col-md-10 col-8">
            <h5 className="fw-bold mb-1">{story.title}</h5>
            <p className="text-secondary mb-2" style={{ fontSize: '0.9rem' }}>{story.author}</p>
            <div className="d-flex flex-wrap gap-2 mb-3">
              {statusStyle && (
                <span className="badge fw-semibold" style={{ backgroundColor: statusStyle.bg, color: statusStyle.color, borderRadius: '50px', padding: '5px 12px', fontSize: '0.75rem' }}>
                  {STORY_STATUS[story.trangthai_rachuong]?.label}
                </span>
              )}
              <span className={`badge fw-semibold`}
                style={{ backgroundColor: story.status ? 'rgba(25,135,84,0.15)' : 'rgba(108,117,125,0.15)', color: story.status ? '#198754' : '#6c757d', borderRadius: '50px', padding: '5px 12px', fontSize: '0.75rem' }}>
                {story.status ? 'Đang hiện' : 'Đã ẩn'}
              </span>
            </div>
            <div className="d-flex flex-wrap gap-1 mb-3">
              {story.categories?.map(c => (
                <GenreBadge key={c.categoryID} value={c.categoryID} label={c.categoryname} />
              ))}
            </div>
            <div className="row g-2 text-secondary" style={{ fontSize: '0.82rem' }}>
              <div className="col-auto"><i className="bi bi-layers me-1"></i>{chapters.length} chương</div>
              <div className="col-auto"><i className="bi bi-calendar3 me-1"></i>Cập nhật: {story.updatedat ?? '—'}</div>
            </div>
            {story.description && (
              <p className="mt-3 text-secondary" style={{ fontSize: '0.88rem', lineHeight: '1.6' }}>{story.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Chapter list */}
      <div style={{ backgroundColor: 'var(--surface-1)', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 6px 24px rgba(0,0,0,0.4)', overflow: 'hidden' }}>
        <div className="d-flex justify-content-between align-items-center px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <h6 className="fw-bold mb-0"><i className="bi bi-list-ol me-2 text-danger"></i>Danh sách chương</h6>
          <span className="badge text-secondary" style={{ backgroundColor: 'var(--surface-2)', borderRadius: '50px', padding: '4px 12px' }}>{chapters.length} chương</span>
        </div>
        {loading ? (
          <div className="text-center py-5 text-muted"><div className="spinner-border spinner-border-sm me-2"></div>Đang tải...</div>
        ) : chapters.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-journal-x fs-1 d-block mb-2"></i>Chưa có chương nào.
          </div>
        ) : (
          <>
            <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 text-nowrap">
              <thead style={{ backgroundColor: 'var(--surface-2)', fontSize: '0.8rem' }}>
                <tr>
                  <th className="ps-4 text-secondary fw-semibold">Tên chương</th>
                  <th className="text-secondary fw-semibold text-center">Trạng thái</th>
                  <th className="text-secondary fw-semibold">Ngày tạo</th>
                  <th className="text-secondary fw-semibold text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {pagedChapters.map(c => (
                  <tr key={c.chapterid} style={{ opacity: c.status === 1 ? 1 : 0.4, transition: 'opacity 0.2s' }}>
                    <td className="ps-4 fw-semibold" style={{ fontSize: '0.9rem' }}>{c.chaptername}</td>
                    <td className="text-center">
                      <div className="form-check form-switch d-flex justify-content-center mb-0">
                        <input className="form-check-input" type="checkbox" role="switch"
                          checked={c.status === 1} onChange={() => handleToggleChapter(c)}
                          style={{ width: '2.2em', height: '1.2em', cursor: 'pointer', accentColor: 'var(--primary-color)' }} />
                      </div>
                    </td>
                    <td className="text-secondary" style={{ fontSize: '0.82rem' }}>{c.createdat}</td>
                    <td className="text-center">
                      <button className="btn btn-sm me-2" title="Sửa chương"
                        onClick={() => navigate('/admin/chapters/edit', { state: { story, chapter: c } })}
                        style={{ borderRadius: '50px', backgroundColor: '#fff3cd', color: '#856404', border: 'none', padding: '4px 14px', fontSize: '0.8rem' }}>
                        <i className="bi bi-pencil-fill me-1"></i>Sửa
                      </button>
                      <button className="btn btn-sm" title="Xóa chương"
                        onClick={() => setDeleteTarget(c)}
                        style={{ borderRadius: '50px', backgroundColor: 'rgba(220,53,69,0.1)', color: '#dc3545', border: 'none', padding: '4px 14px', fontSize: '0.8rem' }}>
                        <i className="bi bi-trash-fill me-1"></i>Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center px-4 py-3" style={{ borderTop: '1px solid var(--border)' }}>
              <small className="text-secondary">
                {`Trang ${currentPage} / ${totalPages} · ${chapters.length} chương`}
              </small>
              <div className="d-flex gap-1">
                <button className="btn btn-sm" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}
                  style={{ borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--surface-2)', color: 'var(--text-muted)', padding: '4px 10px' }}>
                  <i className="bi bi-chevron-double-left"></i>
                </button>
                <button className="btn btn-sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}
                  style={{ borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--surface-2)', color: 'var(--text-muted)', padding: '4px 10px' }}>
                  <i className="bi bi-chevron-left"></i>
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                  const page = start + i;
                  return (
                    <button key={page} className="btn btn-sm fw-semibold" onClick={() => setCurrentPage(page)}
                      style={{ borderRadius: '8px', border: '1px solid var(--border)', padding: '4px 10px', fontSize: '0.82rem',
                        backgroundColor: page === currentPage ? 'var(--primary-color)' : 'var(--surface-2)',
                        color: page === currentPage ? '#fff' : 'var(--text-muted)' }}>
                      {page}
                    </button>
                  );
                })}
                <button className="btn btn-sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}
                  style={{ borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--surface-2)', color: 'var(--text-muted)', padding: '4px 10px' }}>
                  <i className="bi bi-chevron-right"></i>
                </button>
                <button className="btn btn-sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}
                  style={{ borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--surface-2)', color: 'var(--text-muted)', padding: '4px 10px' }}>
                  <i className="bi bi-chevron-double-right"></i>
                </button>
              </div>
            </div>
          )}
          </>
        )}
      </div>

      <ConfirmDeleteModal
        show={!!deleteTarget}
        title="Xóa chương"
        message={`Bạn có chắc chắn muốn xóa chương "${deleteTarget?.chaptername}" không? Hành động này không thể hoàn tác.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteChapter}
      />
    </>
  );
}

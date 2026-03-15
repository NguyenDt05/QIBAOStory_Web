import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { getStoryById } from '../../../api/storyService';
import { getChaptersByStory, toggleChapterVisibility, deleteChapter } from '../../../api/chapterService';
import { GenreBadge } from '../../../components/common/GenreSelect';
import ConfirmDeleteModal from '../../../components/common/ConfirmDeleteModal';
import { STORY_STATUS, getStatusStyle } from '../../../constants/storyStatus';

export default function StoryDetailAdmin() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { storyid } = useParams();
  
  const [story, setStory] = useState(state?.story || null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 20;

  // 1. Lấy dữ liệu truyện nếu F5 trang hoặc truy cập trực tiếp bằng ID
  useEffect(() => {
    const fetchStory = async () => {
      if (!story && storyid) {
        try {
          const res = await getStoryById(storyid);
          setStory(res);
        } catch (err) {
          console.error("Lỗi lấy truyện:", err);
          setStory(null);
        }
      }
    };
    fetchStory();
  }, [storyid, state]);

  // 2. Lấy danh sách chương khi đã có storyid
  useEffect(() => {
    const sid = story?.storyid || storyid;
    if (!sid) return;

    setLoading(true);
    getChaptersByStory(sid)
      .then(setChapters)
      .catch(err => console.error("Lỗi lấy chương:", err))
      .finally(() => setLoading(false));
  }, [story?.storyid, storyid]);

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

  // Nếu loading xong mà vẫn không thấy truyện
  if (!loading && !story) {
    return (
      <div className="text-center py-5 text-muted">
        <i className="bi bi-exclamation-circle-fill fs-1 d-block mb-2"></i>
        Không tìm thấy truyện. <Link to="/admin/stories">Quay lại danh sách</Link>
      </div>
    );
  }

  // Chờ lấy thông tin truyện để tránh lỗi render property của null
  if (!story) return <div className="text-center py-5 text-muted">Đang tải thông tin truyện...</div>;

  const statusStyle = getStatusStyle(story.trangthai_rachuong);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h4 className="fw-bold mb-0" style={{ color: 'var(--primary-color)' }}>
            <i className="bi bi-book me-2"></i>Chi tiết truyện
          </h4>
          <small className="text-muted">ID: #{story.storyid} - {story.title}</small>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <Link to="/admin/stories" className="btn fw-bold"
            style={{ borderRadius: '50px', backgroundColor: 'rgba(224,82,82,0.1)', color: 'var(--primary-color)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 22px' }}>
            <i className="bi bi-arrow-left me-2"></i>Quay lại
          </Link>
          <button className="btn fw-bold"
            onClick={() => navigate(`/admin/stories/edit/${story.storyid}`, { state: { story } })}
            style={{ borderRadius: '50px', backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffc107', padding: '8px 22px' }}>
            <i className="bi bi-pencil-fill me-2"></i>Sửa truyện
          </button>
          <button className="btn fw-bold"
            onClick={() => navigate(`/admin/chapters/add?storyid=${story.storyid}`, { state: { story } })}
            style={{ borderRadius: '50px', backgroundColor: 'rgba(25,135,84,0.15)', color: '#198754', border: '1px solid rgba(25,135,84,0.3)', padding: '8px 22px' }}>
            <i className="bi bi-plus-lg me-2"></i>Thêm chương
          </button>
        </div>
      </div>

      {/* Story info card */}
      <div className="mb-4" style={{ backgroundColor: 'var(--surface-1)', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 6px 24px rgba(0,0,0,0.4)', padding: '24px' }}>
        <div className="row g-3 align-items-start">
          <div className="col-md-2 col-4">
            <div style={{ width: '100%', aspectRatio: '2/3', borderRadius: '12px', overflow: 'hidden', backgroundColor: 'var(--surface-2)', border: '1px solid var(--border)' }}>
               <img src={story.coverUrl} alt={story.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
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
                style={{ backgroundColor: story.status === 1 ? 'rgba(25,135,84,0.15)' : 'rgba(108,117,125,0.15)', color: story.status === 1 ? '#198754' : '#6c757d', borderRadius: '50px', padding: '5px 12px', fontSize: '0.75rem' }}>
                {story.status === 1 ? 'Đang hiện' : 'Đã ẩn'}
              </span>
            </div>
            <div className="d-flex flex-wrap gap-1 mb-3">
              {story.categories?.map(c => (
                <GenreBadge key={c.categoryID || c.categoryid} value={c.categoryID || c.categoryid} label={c.categoryname} />
              ))}
            </div>
            <div className="row g-2 text-secondary" style={{ fontSize: '0.82rem' }}>
              <div className="col-auto"><i className="bi bi-layers me-1"></i>{chapters.length} chương</div>
              <div className="col-auto"><i className="bi bi-calendar3 me-1"></i>Cập nhật: {story.updatedat || '—'}</div>
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
        ) : (
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
                {pagedChapters.length === 0 ? (
                    <tr><td colSpan="4" className="text-center py-4 text-muted">Chưa có chương nào</td></tr>
                ) : pagedChapters.map(c => (
                  <tr key={c.chapterid} style={{ opacity: c.status === 1 ? 1 : 0.4 }}>
                    <td className="ps-4 fw-semibold" style={{ fontSize: '0.9rem' }}>{c.chaptername}</td>
                    <td className="text-center">
                      <div className="form-check form-switch d-flex justify-content-center mb-0">
                        <input className="form-check-input" type="checkbox" role="switch"
                          checked={c.status === 1} onChange={() => handleToggleChapter(c)}
                          style={{ width: '2.2em', height: '1.2em', cursor: 'pointer' }} />
                      </div>
                    </td>
                    <td className="text-secondary" style={{ fontSize: '0.82rem' }}>{c.createdat || '—'}</td>
                    <td className="text-center">
                      <button className="btn btn-sm me-2"
                        onClick={() => navigate(`/admin/chapters/edit/${c.chapterid}`, { state: { story, chapter: c } })}
                        style={{ borderRadius: '50px', backgroundColor: '#fff3cd', color: '#856404', border: 'none', padding: '4px 14px' }}>
                        <i className="bi bi-pencil-fill me-1"></i>Sửa
                      </button>
                      <button className="btn btn-sm"
                        onClick={() => setDeleteTarget(c)}
                        style={{ borderRadius: '50px', backgroundColor: 'rgba(220,53,69,0.1)', color: '#dc3545', border: 'none', padding: '4px 14px' }}>
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

      <ConfirmDeleteModal
        show={!!deleteTarget}
        title="Xóa chương"
        message={`Bạn có chắc chắn muốn xóa chương "${deleteTarget?.chaptername}" không?`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteChapter}
      />
    </>
  );
}
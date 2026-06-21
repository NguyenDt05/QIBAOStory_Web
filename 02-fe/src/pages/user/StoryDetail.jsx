import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, Navigate } from 'react-router-dom';
import { getStoryDetail } from '../../api/storyService';
import { useAuth } from '../../context/AuthContext';
import { useReader } from '../../context/ReaderContext';
import { STORY_STATUS } from '../../constants/storyStatus';
import StoryTag from '../../components/common/StoryTag';
import StoryCover from '../../components/common/StoryCover';
import { getImageUrl, formatDate } from '../../utils/helpers';
import IntroTab from './story-detail/IntroTab';
import ChapterListTab from './story-detail/ChapterListTab';
import CommentTab from './story-detail/CommentTab';
// import RelatedStoriesSection from './story-detail/RelatedStoriesSection';
import '../../styles/StoryDetail.css';

const TABS = [
  { key: 'intro', label: 'Giới thiệu' },
  { key: 'chapterlist', label: 'Danh sách chương' },
  { key: 'comments', label: 'Bình luận' },
];

export default function StoryDetail() {
  const { storyid } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  const { isInLibrary, addToLibrary, removeFromLibrary } = useReader();

  const [isLoading, setIsLoading] = useState(true);
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [activeTab, setActiveTab] = useState('intro');

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    getStoryDetail(storyid)
      .then(detail => {
        if (cancelled) return;
        setStory(detail.story);
        setChapters(detail.chapters);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [storyid]);

  if (isLoading) {
    return (
      <div className="cdt-page">
        <div className="cdt-loading">
          <div className="spinner-border spinner-border-sm" role="status" />
          <span>Đang tải...</span>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="cdt-page">
        <div className="cdt-loading">Không tìm thấy truyện.</div>
      </div>
    );
  }

  if (!isAdmin && !story.status) {
    return <Navigate to="/home" replace />;
  }

  const normalizedStatus = String(story.trangthai_rachuong || '').trim().toLowerCase();
  const isHiatus = !isAdmin && ['tamngung', 'tam_ngung', 'tạm ngưng'].includes(normalizedStatus);
  const statusInfo = STORY_STATUS[story.trangthai_rachuong] ?? STORY_STATUS.dangra;
  const recentChapters = chapters.slice(-3).reverse();
  const saved = isInLibrary(story.storyid);

  const handleLibraryToggle = () => {
    if (saved) {
      removeFromLibrary(story.storyid);
    } else {
      addToLibrary({
        storyid: story.storyid,
        title: story.title,
        author: story.author,
        cover: story.cover ?? null,
        trangthai_rachuong: story.trangthai_rachuong,
        savedat: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="cdt-page">

      {/* ── Hero Banner ── */}
      <div className="cdt-hero">
        {/* Background cover image — dùng ảnh bìa của từng truyện */}
        <img
          src={getImageUrl(story.cover) || "/covers/z7449448617084_3902abda612e15c48b541c940ce01bda.jpg"}
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center center',
            filter: 'blur(6px) brightness(0.65)',
            transform: 'scale(1.12)',
            zIndex: 0,
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)', zIndex: 0 }} />

        <div className="container-lg px-4 px-lg-5" style={{ position: 'relative', zIndex: 1 }}>
          <nav className="mb-4">
            <ol className="breadcrumb mb-0" style={{ fontSize: '0.8rem' }}>
              <li className="breadcrumb-item">
                <Link to="/home" className="text-decoration-none cdt-hero__breadcrumb-link">
                  Trang chủ
                </Link>
              </li>
              <li className="breadcrumb-item active cdt-hero__breadcrumb-active">{story.title}</li>
            </ol>
          </nav>

          <div className="d-flex gap-4 align-items-start flex-wrap">
            <div className="cdt-hero__cover" style={{ overflow: 'hidden', padding: 0, justifyContent: 'unset', alignItems: 'unset' }}>
              <StoryCover
                cover={story.cover}
                title={story.title}
                storyid={story.storyid}
                iconFallback
                style={{ position: 'absolute', inset: 0, borderRadius: '12px' }}
              />
            </div>

            <div className="flex-grow-1 pt-1">
              <h2 className="fw-bold text-white mb-2 cdt-hero__title">{story.title}</h2>

              <div className="d-flex flex-wrap align-items-center gap-3 mb-3 cdt-hero__meta">
                <span>
                  <i className="bi bi-pen me-1 cdt-hero__meta-icon"></i>
                  <strong className="text-white">{story.author}</strong>
                </span>
                <span>
                  <i className="bi bi-book me-1 cdt-hero__meta-icon"></i>
                  {story.storyCount ?? chapters.length} chương
                </span>
                {story.updatedat && (
                  <span>
                    <i className="bi bi-calendar3 me-1 cdt-hero__meta-icon"></i>
                    Cập nhật: {story.updatedat}
                  </span>
                )}
                <span
                  className="cdt-hero__status-badge"
                  style={{ backgroundColor: statusInfo.bgColor, color: statusInfo.textColor }}
                >
                  {statusInfo.label}
                </span>
              </div>

              <div className="d-flex flex-wrap mb-4">
                {(story.categories ?? []).map(c => (
                  <StoryTag key={c.categoryID} label={c.categoryname} ghost />
                ))}
              </div>

              <div className="d-flex flex-wrap gap-2">
                <button
                  className={`btn fw-semibold d-flex align-items-center gap-2 cdt-btn-bookmark${saved ? ' cdt-btn-bookmark--saved' : ''}`}
                  onClick={handleLibraryToggle}
                >
                  <i className={`bi ${saved ? 'bi-bookmark-check-fill' : 'bi-bookmark-plus'}`}></i>
                  {saved ? 'Xóa khỏi tủ' : 'Thêm vào tủ sách'}
                </button>

                {isHiatus ? (
                  <span
                    className="btn fw-bold d-flex align-items-center gap-2"
                    style={{ borderRadius: '50px', backgroundColor: 'rgba(255,255,255,0.08)', color: 'var(--text-2)', cursor: 'not-allowed', opacity: 0.6 }}
                  >
                    <i className="bi bi-pause-circle-fill"></i>Tạm ngưng đọc
                  </span>
                ) : (
                  <Link
                    to={`/stories/${storyid}/chapters/first`}
                    className="btn fw-bold d-flex align-items-center gap-2 text-decoration-none cdt-btn-read"
                  >
                    <i className="bi bi-play-circle-fill"></i>Bắt đầu đọc
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    to={`/admin/stories/detail/${story.storyid}`}
                    state={{ story }}
                    className="btn fw-semibold d-flex align-items-center gap-2 text-decoration-none"
                    style={{
                      borderRadius: '50px',
                      border: '1.5px solid #ffd700',
                      color: '#ffd700',
                      backgroundColor: 'rgba(255,215,0,0.08)',
                      padding: '6px 18px',
                    }}
                  >
                    <i className="bi bi-pencil-square"></i>Chỉnh sửa truyện
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="container-lg px-4 px-lg-5 py-5">
        <div className="d-flex gap-0 mb-4 cdt-tabs">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`btn btn-link fw-semibold text-decoration-none cdt-tab-btn ${activeTab === tab.key ? 'cdt-tab-btn--active' : 'cdt-tab-btn--inactive'}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'intro' && (
          <IntroTab story={story} recentChapters={recentChapters} isHiatus={isHiatus} />
        )}

        {activeTab === 'chapterlist' && (
          <ChapterListTab chapters={chapters} isHiatus={isHiatus} />
        )}

        {activeTab === 'comments' && (
          <CommentTab storyid={storyid} />
        )}
      </div>

      {/* ── Gợi ý truyện liên quan ──
      <RelatedStoriesSection storyid={storyid} /> */}
    </div>
  );
}

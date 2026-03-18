import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosConfig from '../../api/axiosConfig';
import StoryTag from '../../components/common/StoryTag';

const GRADIENTS = [
  'linear-gradient(145deg,#1a1a2e,#16213e)',
  'linear-gradient(145deg,#0f3460,#533483)',
  'linear-gradient(145deg,#8b0000,#c0392b)',
  'linear-gradient(145deg,#0d3b2e,#1a6b4a)',
];

const BASE_URL = 'http://localhost:8080';

function coverUrl(image) {
  if (!image) return null;
  if (image.startsWith('http')) return image;
  return `${BASE_URL}/${image}`;
}

function formatRelativeTime(raw) {
  if (!raw) return '';
  const d = new Date(raw);
  if (isNaN(d.getTime())) return '';
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60)     return `${diff} giây trước`;
  if (diff < 3600)   return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)} giờ trước`;
  return `${Math.floor(diff / 86400)} ngày trước`;
}

function SectionHeader({ title, link }) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h5 className="fw-bold mb-0"
        style={{ color: '#e2e8f0', letterSpacing: '0.5px', textTransform: 'uppercase', fontSize: '1rem', borderLeft: '4px solid var(--accent)', paddingLeft: '12px' }}>
        {title}
      </h5>
      {link && (
        <Link to={link} className="text-decoration-none small fw-semibold" style={{ color: 'var(--accent)' }}>
          Xem tất cả <i className="bi bi-chevron-right" />
        </Link>
      )}
    </div>
  );
}

function FeaturedCard({ story }) {
  const img = coverUrl(story.image);
  return (
    <div className="h-100 d-flex flex-column"
      style={{ backgroundColor: '#141820', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 6px 24px rgba(0,0,0,0.4)', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(0,0,0,0.6)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.4)'; }}>
      <div style={{ position: 'relative', width: '100%', aspectRatio: '2/3', overflow: 'hidden', background: '#0f111a' }}>
        {img
          ? <img src={img} alt={story.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1d28', color: '#555', fontSize: '2rem' }}><i className="bi bi-book" /></div>
        }
      </div>
      <div className="p-3 d-flex flex-column flex-grow-1">
        <Link to={`/stories/${story.storyid}`} className="text-decoration-none">
          <h6 className="fw-bold mb-2 text-truncate-2" style={{ lineHeight: 1.4, fontSize: '0.9rem', color: '#e2e8f0', height: '2.8rem' }}>{story.title}</h6>
        </Link>
        <div className="d-flex align-items-center gap-3 mb-2" style={{ fontSize: '0.75rem', color: '#8892a4' }}>
          <span className="text-truncate"><i className="bi bi-pen me-1" />{story.author}</span>
          <span className="text-nowrap"><i className="bi bi-book me-1" />{story.storyCount}</span>
        </div>
        <div className="mb-3 text-truncate">
          {(story.categories ?? []).slice(0, 2).map(c => (
            <StoryTag key={c.categoryID ?? c.categoryid} label={c.categoryname} />
          ))}
        </div>
        <Link to={`/stories/${story.storyid}`}
          className="btn fw-bold text-center text-decoration-none mt-auto"
          style={{ borderRadius: '50px', backgroundColor: 'var(--accent)', color: '#fff', fontSize: '0.8rem', padding: '6px' }}>
          Đọc ngay
        </Link>
      </div>
    </div>
  );
}

function Home() {
  const [hotStories,       setHotStories]       = useState([]);
  const [newestStories,    setNewestStories]     = useState([]);
  const [completedStories, setCompletedStories]  = useState([]);
  const [recentUpdates,    setRecentUpdates]     = useState([]);
  const [loading,          setLoading]           = useState(true);

  useEffect(() => {
    Promise.all([
      axiosConfig.get('/stories/home/hot').catch(() => ({ data: [] })),
      axiosConfig.get('/stories/home/newest').catch(() => ({ data: [] })),
      axiosConfig.get('/stories/home/completed').catch(() => ({ data: [] })),
      axiosConfig.get('/stories/home/updated').catch(() => ({ data: [] })),
    ]).then(([hot, newest, completed, updated]) => {
      const extract = r => {
        // axiosConfig interceptor returns response.data, so r = { success, data: [...] } or []
        if (Array.isArray(r)) return r;
        if (Array.isArray(r?.data)) return r.data;
        return [];
      };
      setHotStories(extract(hot).slice(0, 4));
      setNewestStories(extract(newest).slice(0, 4));
      setCompletedStories(extract(completed).slice(0, 4));
      setRecentUpdates(extract(updated).slice(0, 7));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="spinner-border text-light" />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0a0d14', minHeight: '100vh' }}>
      {/* Banner Hero - Truyện hot */}
      <div style={{ backgroundColor: '#1a1d24', padding: '40px 0 60px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container-lg px-4 px-lg-5">
          <SectionHeader title="Truyện hot đề cử" />
          <div className="row g-3 justify-content-center">
            {hotStories.map(s => (
              <div key={s.storyid} className="col-6 col-md-3">
                <Link to={`/stories/${s.storyid}`} className="text-decoration-none d-block shadow-lg"
                  style={{ borderRadius: '14px', overflow: 'hidden', aspectRatio: '2/3', position: 'relative', transition: 'transform 0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                  {coverUrl(s.image)
                    ? <img src={coverUrl(s.image)} alt={s.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ position: 'absolute', inset: 0, background: '#1a1d28', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: '3rem' }}><i className="bi bi-book" /></div>
                  }
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)' }}>
                    <div className="position-absolute bottom-0 start-0 end-0 p-3">
                      <p className="text-white fw-bold mb-0 text-truncate" style={{ fontSize: '0.9rem' }}>{s.title}</p>
                      <small className="text-accent" style={{ fontSize: '0.75rem' }}>{s.author}</small>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-lg px-4 px-lg-5 py-5">
        {/* Tác phẩm mới */}
        <section className="mb-5">
          <SectionHeader title="Tác phẩm mới" link="/stories" />
          <div className="row g-4">
            {newestStories.map(s => (
              <div key={s.storyid} className="col-12 col-md-3">
                <FeaturedCard story={s} />
              </div>
            ))}
          </div>
        </section>

        {/* Banner giữa */}
        <div className="mb-5 d-none d-md-flex"
          style={{ borderRadius: '20px', overflow: 'hidden', height: '120px', backgroundImage: 'linear-gradient(135deg, #4a1a0a 0%, #7b2d00 40%, #2d4059 100%)', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
          <div className="text-center text-white">
            <h4 className="fw-bold mb-1" style={{ letterSpacing: '4px' }}>QIBAO</h4>
            <p className="mb-0 opacity-75" style={{ fontSize: '0.8rem' }}>Kho tàng truyện hay — Đọc miễn phí mọi lúc mọi nơi</p>
          </div>
        </div>

        {/* Mới hoàn thành */}
        <section className="mb-5">
          <SectionHeader title="Mới hoàn thành" link="/stories?trangthai=hoanthanh" />
          <div className="row g-4">
            {completedStories.length > 0
              ? completedStories.map(s => (
                  <div key={s.storyid} className="col-12 col-md-3">
                    <FeaturedCard story={s} />
                  </div>
                ))
              : <div className="text-muted small ps-2">Đang cập nhật danh mục hoàn thành...</div>
            }
          </div>
        </section>

        {/* Mới cập nhật — hiển thị tên chương mới nhất */}
        <section className="mb-5">
          {/* Link "Xem tất cả" đến trang stories với filter sort=moi-cap-nhat */}
          <SectionHeader title="Mới cập nhật" link="/stories?sort=moi-cap-nhat" />
          <div style={{ backgroundColor: '#141820', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle mb-0">
                <tbody>
                  {recentUpdates.map(s => (
                    <tr key={s.storyid} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      {/* Ảnh bìa nhỏ */}
                      <td className="ps-3 py-2" style={{ width: '48px' }}>
                        <Link to={`/stories/${s.storyid}`}>
                          {coverUrl(s.image)
                            ? <img src={coverUrl(s.image)} alt={s.title} style={{ width: 40, height: 52, objectFit: 'cover', borderRadius: 6 }} />
                            : <div style={{ width: 40, height: 52, borderRadius: 6, background: '#1a1d28', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: '1.1rem' }}><i className="bi bi-book" /></div>
                          }
                        </Link>
                      </td>
                      {/* Tên truyện + tên chương */}
                      <td className="py-2">
                        <Link to={`/stories/${s.storyid}`} className="fw-semibold text-decoration-none text-light d-block text-truncate" style={{ fontSize: '0.85rem', maxWidth: 200 }}>
                          {s.title}
                        </Link>
                        {s.latestChapterName && (
                          <Link to={s.latestChapterId ? `/stories/${s.storyid}/chapters/${s.latestChapterId}` : `/stories/${s.storyid}`}
                            className="text-decoration-none text-truncate d-block"
                            style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>
                            <i className="bi bi-bookmark me-1" />{s.latestChapterName}
                          </Link>
                        )}
                      </td>
                      {/* Số chương */}
                      <td className="py-2 d-none d-md-table-cell text-accent" style={{ fontSize: '0.8rem' }}>
                        {s.storyCount} ch.
                      </td>
                      {/* Tác giả */}
                      <td className="py-2 d-none d-lg-table-cell text-secondary" style={{ fontSize: '0.8rem' }}>
                        <i className="bi bi-person me-1" />{s.author}
                      </td>
                      {/* Thời gian cập nhật */}
                      <td className="pe-4 py-2 text-end text-muted" style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                        {formatRelativeTime(s.latestChapterDate || s.updatedat)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
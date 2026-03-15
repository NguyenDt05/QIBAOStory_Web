import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllStories } from '../../api/storyService';
import StoryTag from '../../components/common/StoryTag';

const GRADIENTS = [
  'linear-gradient(145deg,#1a1a2e,#16213e)',
  'linear-gradient(145deg,#0f3460,#533483)',
  'linear-gradient(145deg,#8b0000,#c0392b)',
  'linear-gradient(145deg,#0d3b2e,#1a6b4a)',
];

function SectionHeader({ title, link }) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h5
        className="fw-bold mb-0"
        style={{ color: '#e2e8f0', letterSpacing: '0.5px', textTransform: 'uppercase', fontSize: '1rem', borderLeft: '4px solid var(--accent)', paddingLeft: '12px' }}
      >
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
  return (
    <div
      className="h-100 d-flex flex-column"
      style={{ backgroundColor: '#141820', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 6px 24px rgba(0,0,0,0.4)', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(0,0,0,0.6)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.4)'; }}
    >
      {/* Hiển thị ảnh bìa thật từ Server */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '2/3', overflow: 'hidden' }}>
        <img 
          src={story.coverUrl} 
          alt={story.title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        <div className="position-absolute top-0 end-0 p-2">
            <span className="badge rounded-pill" style={{ backgroundColor: story.statusStyle?.bg, color: story.statusStyle?.color, fontSize: '0.7rem' }}>
                {story.statusLabel}
            </span>
        </div>
      </div>

      <div className="p-3 d-flex flex-column flex-grow-1">
        <Link to={`/stories/${story.storyid}`} className="text-decoration-none">
          <h6 className="fw-bold mb-2 text-truncate-2" style={{ lineHeight: 1.4, fontSize: '0.9rem', color: '#e2e8f0', height: '2.8rem' }}>
            {story.title}
          </h6>
        </Link>
        <div className="d-flex align-items-center gap-3 mb-2" style={{ fontSize: '0.75rem', color: '#8892a4' }}>
          <span className="text-truncate"><i className="bi bi-pen me-1" />{story.author}</span>
          {/* Sử dụng storyCount dạng văn bản */}
          <span className="text-nowrap"><i className="bi bi-book me-1" />{story.storyCount}</span>
        </div>
        <div className="mb-3 text-truncate">
          {(story.categories ?? []).slice(0, 2).map(c => (
            <StoryTag key={c.categoryID} label={c.categoryname} />
          ))}
        </div>
        <Link
          to={`/stories/${story.storyid}`}
          className="btn fw-bold text-center text-decoration-none mt-auto"
          style={{ borderRadius: '50px', backgroundColor: 'var(--accent)', color: '#fff', fontSize: '0.8rem', padding: '6px' }}
        >
          Đọc ngay
        </Link>
      </div>
    </div>
  );
}

function Home() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    // 2. Gọi hàm lấy truyện visible cho User
    getAllStories({ visibleOnly: true }).then(data => {
      setStories(data || []);
    });
  }, []);

  const featuredStories = stories.slice(0, 4).map((s, i) => ({
    ...s,
    gradient: GRADIENTS[i % 4],
  }));

  const completedStories = stories.filter(s => s.trangthai_rachuong === 'hoanthanh').slice(0, 4);

  // Logic lấy danh sách cập nhật mới
  const recentUpdates = stories.slice(0, 8);

  return (
    <div style={{ backgroundColor: '#0a0d14', minHeight: '100vh' }}>
      {/* Banner Hero - Ảnh bìa thật */}
      <div style={{ backgroundColor: '#1a1d24', padding: '40px 0 60px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container-lg px-4 px-lg-5">
          <SectionHeader title="Truyện hot đề cử" />
          <div className="row g-3 justify-content-center">
            {featuredStories.map((s) => (
              <div key={s.storyid} className="col-6 col-md-3">
                <Link
                  to={`/stories/${s.storyid}`}
                  className="text-decoration-none d-block shadow-lg"
                  style={{ borderRadius: '14px', overflow: 'hidden', aspectRatio: '2/3', position: 'relative', transition: 'transform 0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <img src={s.coverUrl} alt={s.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
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
        <section className="mb-5">
          <SectionHeader title="Tác phẩm mới" link="/stories" />
          <div className="row g-4">
            {featuredStories.map(s => (
              <div key={s.storyid} className="col-12 col-md-3">
                <FeaturedCard story={s} />
              </div>
            ))}
          </div>
        </section>

        {/* Banner Giữa */}
        <div
          className="mb-5 d-none d-md-flex"
          style={{ borderRadius: '20px', overflow: 'hidden', height: '120px', backgroundImage: 'linear-gradient(135deg, #4a1a0a 0%, #7b2d00 40%, #2d4059 100%)', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
        >
          <div className="text-center text-white">
            <h4 className="fw-bold mb-1" style={{ letterSpacing: '4px' }}>QIBAO</h4>
            <p className="mb-0 opacity-75" style={{ fontSize: '0.8rem' }}>Kho tàng truyện hay — Đọc miễn phí mọi lúc mọi nơi</p>
          </div>
        </div>

        <section className="mb-5">
          <SectionHeader title="Mới hoàn thành" link="/stories?status=hoanthanh" />
          <div className="row g-4">
            {completedStories.length > 0 ? completedStories.map(s => (
              <div key={s.storyid} className="col-12 col-md-3">
                <FeaturedCard story={s} />
              </div>
            )) : <div className="text-muted small ps-2">Đang cập nhật danh mục hoàn thành...</div>}
          </div>
        </section>

        <section className="mb-5">
          <SectionHeader title="Mới cập nhật" link="/stories" />
          <div style={{ backgroundColor: '#141820', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle mb-0">
                <tbody>
                  {recentUpdates.map((s, i) => (
                    <tr key={s.storyid} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td className="ps-4 py-3" style={{ width: '120px' }}>
                        <span className="badge border border-secondary text-secondary fw-normal" style={{ fontSize: '0.65rem' }}>
                          {s.categories?.[0]?.categoryname || 'Khác'}
                        </span>
                      </td>
                      <td className="py-3">
                        <Link to={`/stories/${s.storyid}`} className="fw-semibold text-decoration-none text-light" style={{ fontSize: '0.85rem' }}>
                          {s.title}
                        </Link>
                      </td>
                      <td className="py-3 d-none d-md-table-cell text-accent" style={{ fontSize: '0.8rem' }}>
                        {s.storyCount}
                      </td>
                      <td className="py-3 d-none d-lg-table-cell text-secondary" style={{ fontSize: '0.8rem' }}>
                        <i className="bi bi-person me-1" />{s.author}
                      </td>
                      <td className="pe-4 py-3 text-end text-muted" style={{ fontSize: '0.75rem' }}>
                        {i + 1}h trước
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
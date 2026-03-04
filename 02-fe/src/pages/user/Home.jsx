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
      <div style={{ height: '6px', backgroundColor: 'var(--accent)', opacity: 0.7 }} />
      <div className="p-4 d-flex flex-column flex-grow-1">
        <Link to={`/stories/${story.storyid}`} className="text-decoration-none">
          <h6 className="fw-bold mb-2" style={{ lineHeight: 1.4, fontSize: '0.95rem', color: '#e2e8f0' }}>
            {story.title}
          </h6>
        </Link>
        <div className="d-flex align-items-center gap-3 mb-2" style={{ fontSize: '0.8rem', color: '#8892a4' }}>
          <span><i className="bi bi-pen me-1" />{story.author}</span>
          <span><i className="bi bi-book me-1" />{story.chapters ?? 0} chương</span>
        </div>
        <div className="mb-3">
          {(story.genres ?? story.categories ?? []).map(c => (
            <StoryTag key={c.categoryID} label={c.categoryname} />
          ))}
        </div>
        <p className="mb-4 flex-grow-1" style={{ fontSize: '0.82rem', lineHeight: 1.6, color: '#6b7280', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {story.description}
        </p>
        <Link
          to={`/stories/${story.storyid}/chapters/first`}
          className="btn fw-bold text-center text-decoration-none"
          style={{ borderRadius: '50px', backgroundColor: 'var(--accent)', color: '#fff', fontSize: '0.875rem', padding: '8px' }}
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
    getAllStories({ visibleOnly: true }).then(setStories);
  }, []);

  const featuredStories = stories.slice(0, 4).map((s, i) => ({
    ...s,
    gradient: GRADIENTS[i % 4],
  }));

  const completedStories = stories.filter(s => s.trangthai_rachuong === 'hoanthanh').slice(0, 4);

  const recentUpdates = stories.slice(0, 8).map((s, i) => ({
    storyid: s.storyid,
    categoryLabel: (s.genres ?? s.categories)?.[0]?.categoryname ?? 'Tiên Hiệp',
    title: s.title,
    latestChapter: `Chương ${100 + i}: Cập nhật mới nhất`,
    author: s.author,
    timeAgo: `${i + 1} phút trước`,
  }));

  return (
    <div style={{ backgroundColor: '#0a0d14', minHeight: '100vh' }}>
      <div style={{ backgroundColor: '#3d2010', backgroundImage: 'linear-gradient(135deg, #4a1a0a 0%, #7b2d00 50%, #3d1a05 100%)', padding: '40px 0 0' }}>
        <div className="container-lg px-4 px-lg-5">
          <div className="row g-3 justify-content-center">
            {featuredStories.map((s, i) => (
              <div key={s.storyid} className="col-6 col-md-3">
                <Link
                  to={`/stories/${s.storyid}`}
                  className="text-decoration-none d-block"
                  style={{ borderRadius: '14px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.4)', aspectRatio: '2/3', background: s.gradient, cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', display: 'block', position: 'relative' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 14px 36px rgba(0,0,0,0.6)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)'; }}
                >
                  {s.cover && <img src={s.cover} alt={s.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
                  <div style={{ position: 'absolute', inset: 0 }}>
                    <div className="position-absolute bottom-0 start-0 end-0 p-3" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.85))' }}>
                      <span className="text-white fw-semibold" style={{ fontSize: '0.78rem', lineHeight: 1.3 }}>{s.title}</span>
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
          <SectionHeader title="Tác phẩm đề cử" link="/stories" />
          <div className="row g-4">
            {featuredStories.map(s => (
              <div key={s.storyid} className="col-12 col-md-3">
                <FeaturedCard story={s} />
              </div>
            ))}
          </div>
        </section>

        <div
          className="mb-5"
          style={{ borderRadius: '20px', overflow: 'hidden', height: '160px', backgroundImage: 'linear-gradient(135deg, #4a1a0a 0%, #7b2d00 40%, #2d4059 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
        >
          <div className="text-center text-white">
            <h4 className="fw-bold mb-1" style={{ letterSpacing: '2px', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>QIBAO</h4>
            <p className="mb-0 opacity-75" style={{ fontSize: '0.9rem' }}>Kho tàng truyện hay — Đọc miễn phí mọi lúc mọi nơi</p>
          </div>
        </div>

        <section className="mb-5">
          <SectionHeader title="Mới hoàn thành" link="/stories?status=hoanthanh" />
          <div className="row g-4">
            {completedStories.map(s => (
              <div key={s.storyid} className="col-12 col-md-3">
                <FeaturedCard story={s} />
              </div>
            ))}
          </div>
        </section>

        <section className="mb-5">
          <SectionHeader title="Mới cập nhật" link="/stories" />
          <div style={{ backgroundColor: '#141820', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 6px 24px rgba(0,0,0,0.4)', overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <tbody>
                  {recentUpdates.map(item => (
                    <tr key={item.storyid} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td className="ps-4 py-3" style={{ whiteSpace: 'nowrap', width: '110px' }}>
                        <span className="fw-semibold" style={{ fontSize: '0.7rem', padding: '1px 8px', borderRadius: '50px', backgroundColor: 'rgba(255,255,255,0.07)', color: 'var(--text-2)', border: '1px solid rgba(255,255,255,0.1)', display: 'inline-block', whiteSpace: 'nowrap' }}>
                          {item.categoryLabel}
                        </span>
                      </td>
                      <td className="py-3" style={{ minWidth: '160px', width: '200px' }}>
                        <Link
                          to={`/stories/${item.storyid}`}
                          className="fw-semibold text-decoration-none"
                          style={{ fontSize: '0.875rem', color: '#c9d1d9' }}
                          onMouseEnter={e => { e.target.style.color = 'var(--accent)'; }}
                          onMouseLeave={e => { e.target.style.color = '#c9d1d9'; }}
                        >
                          {item.title}
                        </Link>
                      </td>
                      <td className="py-3 d-none d-md-table-cell">
                        <Link to={`/stories/${item.storyid}/chapters/first`} className="text-decoration-none" style={{ fontSize: '0.82rem', color: 'var(--accent)' }}>
                          {item.latestChapter}
                        </Link>
                      </td>
                      <td className="py-3 d-none d-lg-table-cell" style={{ fontSize: '0.82rem', whiteSpace: 'nowrap', color: '#6b7280' }}>
                        <i className="bi bi-pen me-1" />{item.author}
                      </td>
                      <td className="pe-4 py-3 text-end" style={{ fontSize: '0.78rem', whiteSpace: 'nowrap', color: '#4a5568' }}>
                        {item.timeAgo}
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

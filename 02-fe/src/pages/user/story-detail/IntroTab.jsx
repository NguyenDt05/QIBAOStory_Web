import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function IntroTab({ story, recentChapters = [], isHiatus = false }) {
  const { storyid } = useParams();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="cdt-tab-card">
      <div className="cdt-gt-layout">
        <div className="cdt-gt-recent">
          <div className="cdt-chuong-moi__header">
            <i className="bi bi-clock-history me-2" />Chương mới nhất
          </div>
          {recentChapters.length > 0 ? recentChapters.map((c, i) => (
            isHiatus ? (
              <div key={c.chapterid} className="cdt-chuong-moi__row" style={{ cursor: 'not-allowed', opacity: 0.45 }}>
                <span className="cdt-chuong-moi__index"><i className="bi bi-lock" /></span>
                <span className="cdt-chuong-moi__title text-truncate">{c.chaptername}</span>
                <span className="cdt-chuong-moi__date">{c.createdat}</span>
              </div>
            ) : (
              <Link
                to={`/stories/${storyid}/chapters/${c.chapterid}`}
                key={c.chapterid}
                className="cdt-chuong-moi__row text-decoration-none"
              >
                <span className="cdt-chuong-moi__index">
                  {i === 0 ? <i className="bi bi-fire" /> : i + 1}
                </span>
                <span className="cdt-chuong-moi__title text-truncate">{c.chaptername}</span>
                <span className="cdt-chuong-moi__date">{c.createdat}</span>
              </Link>
            )
          )) : (
            <p className="text-muted" style={{ fontSize: '0.82rem' }}>Chưa có chương nào.</p>
          )}
        </div>

        <div className="cdt-gt-desc">
          <div className="cdt-chuong-moi__header">
            <i className="bi bi-journal-text me-2" />Giới thiệu
          </div>
          <div className={`cdt-desc-wrapper ${expanded ? 'cdt-desc-wrapper--expanded' : ''}`}>
            {(story.description || '').split('\n').filter(Boolean).map((para, i) => (
              <p key={i} className="text-dark mb-3 cdt-desc-para">{para}</p>
            ))}
            {!story.description && (
              <p className="text-muted cdt-desc-para">Chưa có mô tả cho truyện này.</p>
            )}
            {!expanded && <div className="cdt-desc-fade" />}
          </div>
          {story.description && (
            <button className="cdt-xem-them-btn" onClick={() => setExpanded(v => !v)}>
              {expanded
                ? <><i className="bi bi-chevron-up me-1" />Thu gọn</>
                : <><i className="bi bi-chevron-down me-1" />Xem thêm</>
              }
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

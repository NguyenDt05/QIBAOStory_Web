import { Link } from 'react-router-dom';
import { useReader } from '../../../context/ReaderContext';
import { COVER_GRADIENTS } from '../../../constants/mockData';
import { getCoverGradientIndex } from '../../../utils/helpers';

export default function ReadingHistory() {
  const { readingHistory, removeFromHistory } = useReader();

  return (
    <div className="ho-so-panel">
      <div className="ho-so-panel__tieu-de">TRUYỆN ĐÃ XEM</div>

      {readingHistory.length === 0 ? (
        <div className="ho-so-empty text-center">
          <i className="bi bi-clock-history fs-1 d-block mb-3 opacity-25"></i>
          <p className="mb-0" style={{ fontSize: '0.875rem' }}>Chưa có lịch sử đọc nào.</p>
        </div>
      ) : (
        <div className="lich-su-list">
          {readingHistory.map(item => {
            const gradient = COVER_GRADIENTS[getCoverGradientIndex(item.storyid)];
            const href = `/stories/${item.storyid}/chapters/${item.chapterid}`;
            return (
              <div className="lich-su-item" key={item.id}>
                <Link to={href} className="lich-su-item__bia" style={{ background: gradient, overflow: 'hidden', position: 'relative' }}>
                  {item.storyCover
                    ? <img src={item.storyCover} alt={item.storyTitle} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span className="lich-su-item__bia-ten">{item.storyTitle.charAt(0)}</span>
                  }
                </Link>

                <Link to={href} className="lich-su-item__info">
                  <span className="lich-su-item__ten">{item.storyTitle}</span>
                  <span className="lich-su-item__meta">
                    <i className="bi bi-book-half me-1"></i>
                    {item.chaptername}
                  </span>
                  <span className="lich-su-item__meta">
                    <i className="bi bi-clock me-1"></i>
                    {(() => {
                      const diff = Math.max(0, Date.now() - item.id) / 1000;
                      if (diff < 60)    return `${Math.floor(diff)} giây trước`;
                      if (diff < 3600)  return `${Math.floor(diff / 60)} phút trước`;
                      if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
                      return `${Math.floor(diff / 86400)} ngày trước`;
                    })()}
                  </span>
                </Link>

                <button
                  className="lich-su-item__xoa"
                  onClick={() => removeFromHistory(item.id)}
                  title="Xoá khỏi lịch sử"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

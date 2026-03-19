import { Link } from 'react-router-dom';
import { useReader } from '../../../context/ReaderContext';
import StoryCover from '../../../components/common/StoryCover';

// Format ngày giờ tương đối
function relativeTime(raw) {
  if (!raw) return '';
  const d = new Date(raw);
  if (isNaN(d.getTime())) return '';
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60)    return `${diff} giây trước`;
  if (diff < 3600)  return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return `${Math.floor(diff / 86400)} ngày trước`;
}

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
            // Data từ API: storyid, chapterid, storyTitle, storyCover, chaptername, read_at
            // Data từ localStorage (chưa login): storyid, chapterid, storyTitle, storyCover, chaptername, id
            const href = `/stories/${item.storyid}/chapters/${item.chapterid}`;
            const removeKey = item.storyid; // removeFromHistory dùng storyid

            return (
              <div className="lich-su-item" key={`${item.storyid}-${item.chapterid}`}>
                <Link to={href} className="lich-su-item__bia">
                  <StoryCover
                    cover={item.storyCover || item.cover}
                    title={item.storyTitle}
                    storyid={item.storyid}
                    style={{ position: 'absolute', inset: 0 }}
                  />
                </Link>

                <Link to={href} className="lich-su-item__info">
                  <span className="lich-su-item__ten">{item.storyTitle}</span>
                  <span className="lich-su-item__meta">
                    <i className="bi bi-book-half me-1"></i>
                    {item.chaptername}
                  </span>
                  <span className="lich-su-item__meta">
                    <i className="bi bi-clock me-1"></i>
                    {relativeTime(item.read_at) || relativeTime(item.id)}
                  </span>
                </Link>

                <button
                  className="lich-su-item__xoa"
                  onClick={() => removeFromHistory(removeKey)}
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

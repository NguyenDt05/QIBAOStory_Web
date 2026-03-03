import { Link } from 'react-router-dom';
import { useReader } from '../../../context/ReaderContext';
import { STORY_STATUS } from '../../../constants/storyStatus';
import StoryCover from '../../../components/common/StoryCover';

function LibraryCard({ story, onRemove }) {
  const statusInfo = STORY_STATUS[story.trangthai_rachuong] ?? STORY_STATUS.dangra;

  return (
    <div className="tt-card">
      <Link to={`/stories/${story.storyid}`} className="tt-card__bia">
        <StoryCover cover={story.cover} title={story.title} storyid={story.storyid} style={{ position: 'absolute', inset: 0 }} />
      </Link>

      <div className="tt-card__body">
        <Link to={`/stories/${story.storyid}`} className="tt-card__tieu-de">
          {story.title}
        </Link>
        <span className="tt-card__tac-gia">{story.author}</span>
        <div className="tt-card__footer">
          <span className="tt-card__status" style={{ background: statusInfo.bg, color: statusInfo.color }}>
            {statusInfo.label}
          </span>
          <button
            className="tt-card__xoa"
            onClick={() => onRemove(story.storyid)}
            title="Xoá khỏi tủ sách"
          >
            <i className="bi bi-bookmark-x"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Library() {
  const { library, removeFromLibrary } = useReader();

  if (library.length === 0) {
    return (
      <div className="ho-so-panel">
        <div className="ho-so-panel__tieu-de">TỦ TRUYỆN</div>
        <div className="ho-so-empty text-center">
          <i className="bi bi-bookmarks fs-1 d-block mb-3 opacity-25"></i>
          <p className="mb-0" style={{ fontSize: '0.875rem' }}>
            Tủ truyện chưa có truyện nào.
            <br />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              Vào trang truyện và bấm "Thêm vào tủ sách" để lưu lại.
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="ho-so-panel">
      <div className="ho-so-panel__tieu-de">
        TỦ TRUYỆN
        <span className="tt-badge">{library.length}</span>
      </div>
      <div className="tt-grid">
        {library.map(story => (
          <LibraryCard key={story.storyid} story={story} onRemove={removeFromLibrary} />
        ))}
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import StoryTag from './StoryTag';
import StoryCover from './StoryCover';
import './StoryCard.css';

const STATUS_MAP = {
  dangra:    { modifier: 'ongoing',   label: 'Đang ra'    },
  hoanthanh: { modifier: 'completed', label: 'Hoàn thành' },
  tamngung:  { modifier: 'hiatus',    label: 'Tạm ngưng'  },
};

export function StatusBadge({ status }) {
  const { modifier, label } = STATUS_MAP[status] ?? STATUS_MAP.dangra;
  return (
    <span className={`status-badge status-badge--${modifier}`}>
      {label}
    </span>
  );
}

function highlightText(text = '', keyword = '') {
  if (!keyword) return text;
  const regex = new RegExp(
    `(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
    'gi'
  );
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? <mark key={i} className="sc-highlight">{part}</mark> : part
  );
}

export function StoryCardHorizontal({ story, index, keyword = '' }) {
  const genres = story.genres ?? story.categories ?? [];

  return (
    <Link to={`/stories/${story.storyid}`} className="story-card">
      <StoryCover
        cover={story.cover}
        title={story.title}
        storyid={story.storyid}
        className="story-card__cover"
      />

      <div className="story-card__body p-3 d-flex flex-column justify-content-between flex-grow-1">
        <div className="story-card__header">
          <h6 className="story-card__title">
            {highlightText(story.title, keyword)}
          </h6>
          <StatusBadge status={story.trangthai_rachuong} />
        </div>

        <div className="story-card__meta">
          <span><i className="bi bi-pen me-1" />{highlightText(story.author, keyword)}</span>
          <span><i className="bi bi-book me-1" />{story.chapters} chương</span>
        </div>

        <div className="mb-1">
          {genres.map(g => (
            <StoryTag key={g.value ?? g.categoryID} label={g.label ?? g.categoryname} />
          ))}
        </div>

        <div className="story-card__footer">
          <p className="story-card__desc">
            {highlightText(story.description ?? '', keyword)}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = [];
  pages.push(1);
  if (currentPage > 3) pages.push('...');
  for (
    let i = Math.max(2, currentPage - 1);
    i <= Math.min(totalPages - 1, currentPage + 1);
    i++
  ) pages.push(i);
  if (currentPage < totalPages - 2) pages.push('...');
  if (totalPages > 1) pages.push(totalPages);

  return (
    <div className="pagination-bar">
      <button
        className="pg-btn"
        disabled={currentPage === 1}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        aria-label="Trang trước"
      >
        <i className="bi bi-chevron-left" />
      </button>

      {pages.map((item, idx) =>
        item === '...' ? (
          <span key={`dots-${idx}`} className="pagination-bar__dots">…</span>
        ) : (
          <button
            key={item}
            className={`pg-btn${item === currentPage ? ' active' : ''}`}
            onClick={() => item !== currentPage && onPageChange(item)}
            aria-current={item === currentPage ? 'page' : undefined}
          >
            {item}
          </button>
        )
      )}

      <button
        className="pg-btn"
        disabled={currentPage === totalPages}
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        aria-label="Trang sau"
      >
        <i className="bi bi-chevron-right" />
      </button>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton-card__cover" />
      <div className="p-3 flex-grow-1 d-flex flex-column gap-2">
        <div className="skeleton-line" style={{ height: '14px', width: '70%' }} />
        <div className="skeleton-line" style={{ height: '11px', width: '45%' }} />
        <div className="skeleton-line" style={{ height: '11px', width: '30%' }} />
        <div className="skeleton-line" style={{ height: '11px', width: '90%' }} />
      </div>
    </div>
  );
}

export function RelatedStoryCard({ story }) {
  return (
    <Link to={`/stories/${story.storyid}`} className="related-card text-decoration-none d-flex gap-3 p-3">
      <StoryCover
        cover={story.cover}
        title={story.title}
        storyid={story.storyid}
        className="related-card__thumb"
        iconFallback
      />
      <div className="overflow-hidden">
        <div className="fw-semibold text-dark mb-1 text-truncate related-card__title">
          {story.title}
        </div>
        <div className="text-muted mb-2 related-card__desc">
          {story.description}
        </div>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <span className="text-muted related-card__author">
            <i className="bi bi-pen me-1" />{story.author}
          </span>
        </div>
        <div className="text-muted mt-1 related-card__chapters">
          <i className="bi bi-book me-1" />{story.chapters} chương
        </div>
      </div>
    </Link>
  );
}

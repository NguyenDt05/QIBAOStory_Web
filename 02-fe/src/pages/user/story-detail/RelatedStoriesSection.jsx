import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRelatedStories } from '../../../api/storyService';
import { getImageUrl } from '../../../utils/helpers';
import StoryTag from '../../../components/common/StoryTag';
import { StatusBadge } from '../../../components/common/StoryCard';

function RelatedSkeletonCard() {
  return (
    <div className="rls-card rls-card--skeleton" aria-hidden="true">
      <div className="rls-card__cover-wrap">
        <div className="rls-skeleton-block" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="rls-card__body">
        <div className="rls-skeleton-line" style={{ width: '80%', height: '13px', marginBottom: '8px' }} />
        <div className="rls-skeleton-line" style={{ width: '55%', height: '11px', marginBottom: '6px' }} />
        <div className="rls-skeleton-line" style={{ width: '40%', height: '11px' }} />
      </div>
    </div>
  );
}

function RelatedCard({ story }) {
  const img = getImageUrl(story.image ?? story.cover);
  const categories = story.categories ?? [];

  return (
    <Link
      to={`/stories/${story.storyid}`}
      className="rls-card text-decoration-none"
      title={story.title}
    >
      {/* Ảnh bìa */}
      <div className="rls-card__cover-wrap">
        {img ? (
          <img src={img} alt={story.title} className="rls-card__cover-img" />
        ) : (
          <div className="rls-card__cover-fallback">
            <i className="bi bi-book" />
          </div>
        )}
        {/* Gradient overlay với trạng thái */}
        <div className="rls-card__overlay">
          <StatusBadge status={story.trangthai_rachuong} />
        </div>
      </div>

      {/* Thông tin */}
      <div className="rls-card__body">
        <h6 className="rls-card__title">{story.title}</h6>
        <div className="rls-card__meta">
          <span className="rls-card__author">
            <i className="bi bi-pen me-1" />
            {story.author}
          </span>
          <span className="rls-card__chapters">
            <i className="bi bi-book me-1" />
            {story.storyCount ?? 0} chương
          </span>
        </div>
        <div className="rls-card__tags">
          {categories.slice(0, 2).map(c => (
            <StoryTag
              key={c.categoryID ?? c.categoryid}
              label={c.categoryname}
            />
          ))}
        </div>
      </div>
    </Link>
  );
}

export default function RelatedStoriesSection({ storyid }) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!storyid) return;
    let cancelled = false;
    setLoading(true);
    setStories([]);

    getRelatedStories(storyid).then(list => {
      if (!cancelled) {
        setStories(list.slice(0, 6));
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [storyid]);

  // Không render nếu không loading và không có kết quả
  if (!loading && stories.length === 0) return null;

  return (
    <section className="rls-section container-lg px-4 px-lg-5 pb-5">
      {/* Header */}
      <div className="rls-header">
        <h5 className="rls-header__title">
          Gợi ý truyện liên quan
        </h5>
      </div>

      {/* Grid */}
      <div className="rls-grid">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <RelatedSkeletonCard key={i} />
            ))
          : stories.map(s => (
              <RelatedCard key={s.storyid} story={s} />
            ))
        }
      </div>
    </section>
  );
}

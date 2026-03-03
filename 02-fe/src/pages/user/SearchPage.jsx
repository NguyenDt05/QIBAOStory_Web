import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllStories } from '../../api/storyService';
import { StoryCardHorizontal, Pagination, SkeletonCard } from '../../components/common/StoryCard';
import './StoryList.css';

const PAGE_SIZE = 10;

function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get('q') ?? '').trim();

  const [allStories,  setAllStories]  = useState([]);
  const [isLoading,   setIsLoading]   = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => { setCurrentPage(1); }, [query]);

  useEffect(() => {
    setIsLoading(true);
    getAllStories()
      .then(setAllStories)
      .finally(() => setIsLoading(false));
  }, []);

  const results = useMemo(() => {
    if (!query) return [...allStories];
    const q = query.toLowerCase();
    return allStories.filter(s =>
      (s.title       ?? '').toLowerCase().includes(q) ||
      (s.author      ?? '').toLowerCase().includes(q) ||
      (s.description ?? '').toLowerCase().includes(q)
    );
  }, [allStories, query]);

  const totalPages   = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const currentItems = results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="story-list-page">
      <div className="container-lg px-4 px-lg-5 py-5">
        <div className="mb-4">
          <h4 className="story-list-page__title">
            {query
              ? <>KẾT QUẢ: <span style={{ color: 'var(--accent)' }}>"{query}"</span></>
              : 'TÌM KIẾM'}
          </h4>
        </div>

        {isLoading ? (
          <div className="row g-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="col-12 col-md-6"><SkeletonCard /></div>
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="empty-state text-center py-5">
            <i className="bi bi-search fs-1 d-block mb-3" />
            <p className="mb-0">
              {query
                ? <>Không tìm thấy kết quả cho <strong style={{ color: '#e2e8f0' }}>"{query}"</strong>.</>
                : 'Nhập từ khóa vào ô tìm kiếm phía trên.'}
            </p>
          </div>
        ) : (
          <div className="row g-3">
            {currentItems.map((story, i) => (
              <div key={story.storyid} className="col-12 col-md-6">
                <StoryCardHorizontal
                  story={story}
                  index={(currentPage - 1) * PAGE_SIZE + i}
                  keyword={query}
                />
              </div>
            ))}
          </div>
        )}

        {!isLoading && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={p => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          />
        )}
      </div>
    </div>
  );
}

export default SearchPage;

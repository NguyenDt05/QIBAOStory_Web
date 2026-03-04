import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllStories } from '../../api/storyService';
import { CATEGORIES_LIST } from '../../constants/categories';
import { StoryCardHorizontal, Pagination, SkeletonCard } from '../../components/common/StoryCard';
import '../../styles/StoryList.css';

const PAGE_SIZE = 10;

const TABS = [
  { value: 'all', label: 'Tất cả' },
  ...CATEGORIES_LIST.map(c => ({ value: c.categoryID, label: c.categoryname })),
];

function CategoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const genreParam = searchParams.get('genre') ?? 'all';

  const [activeTab,   setActiveTab]   = useState(
    TABS.find(t => String(t.value) === genreParam) ? genreParam : 'all'
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [allStories,  setAllStories]  = useState([]);
  const [isLoading,   setIsLoading]   = useState(true);

  useEffect(() => {
    const g = searchParams.get('genre') ?? 'all';
    setActiveTab(TABS.find(t => String(t.value) === g) ? g : 'all');
    setCurrentPage(1);
  }, [searchParams]);

  useEffect(() => {
    setIsLoading(true);
    getAllStories()
      .then(setAllStories)
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (activeTab === 'all') return [...allStories];
    return allStories.filter(s => {
      const cats = s.categories ?? [];
      return cats.some(c => String(c.categoryID) === String(activeTab));
    });
  }, [allStories, activeTab]);

  const totalPages   = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const switchTab = (value) => {
    setActiveTab(value);
    setCurrentPage(1);
    setSearchParams(value === 'all' ? {} : { genre: value }, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="story-list-page">
      <div className="container-lg px-4 px-lg-5 py-5">
        <div className="mb-4">
          <h4 className="story-list-page__title">THỂ LOẠI TRUYỆN</h4>
        </div>

        <div className="tab-wrapper d-flex gap-0 mb-4">
          {TABS.map(tab => (
            <button
              key={tab.value}
              className={`tab-btn${String(tab.value) === String(activeTab) ? ' active' : ''}`}
              onClick={() => switchTab(String(tab.value))}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="row g-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="col-12 col-md-6"><SkeletonCard /></div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state text-center py-5">
            <i className="bi bi-inbox fs-1 d-block mb-3" />
            <p className="mb-0">Không có truyện nào trong thể loại này.</p>
          </div>
        ) : (
          <div className="row g-3">
            {currentItems.map((story, i) => (
              <div key={story.storyid} className="col-12 col-md-6">
                <StoryCardHorizontal
                  story={story}
                  index={(currentPage - 1) * PAGE_SIZE + i}
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

export default CategoryPage;

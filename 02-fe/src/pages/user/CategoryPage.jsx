import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllStories } from '../../api/storyService';
import { getAllCategories } from '../../api/categoryService';
import { StoryCardHorizontal, Pagination, SkeletonCard } from '../../components/common/StoryCard';
import '../../styles/StoryList.css';

const PAGE_SIZE = 10;

function CategoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const genreParam = searchParams.get('genre') ?? 'all';

  const [categories,  setCategories]  = useState([]);
  const [activeTab,   setActiveTab]   = useState(genreParam);
  const [currentPage, setCurrentPage] = useState(1);
  const [allStories,  setAllStories]  = useState([]);
  const [isLoading,   setIsLoading]   = useState(true);

  // Lấy danh sách thể loại từ API
  useEffect(() => {
    getAllCategories()
      .then(res => {
        const list = res?.data || res || [];
        setCategories(list);
        // Validate activeTab sau khi có danh sách
        if (genreParam !== 'all' && !list.some(c => String(c.categoryID) === genreParam)) {
          setActiveTab('all');
        }
      })
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const g = searchParams.get('genre') ?? 'all';
    setActiveTab(g);
    setCurrentPage(1);
  }, [searchParams]);

  useEffect(() => {
    setIsLoading(true);
    getAllStories({ visibleOnly: true })
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

        <div className="tab-wrapper d-flex gap-0 mb-4" style={{ flexWrap: 'wrap' }}>
          {/* Tab "Tất cả" */}
          <button
            className={`tab-btn${'all' === activeTab ? ' active' : ''}`}
            onClick={() => switchTab('all')}
          >
            Tất cả
          </button>
          {/* Các thể loại từ API */}
          {categories.map(cat => (
            <button
              key={cat.categoryID}
              className={`tab-btn${String(cat.categoryID) === String(activeTab) ? ' active' : ''}`}
              onClick={() => switchTab(String(cat.categoryID))}
            >
              {cat.categoryname}
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

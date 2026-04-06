import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllStories } from '../../api/storyService';
import { getAllCategories } from '../../api/categoryService';
import { StoryCardHorizontal, Pagination, SkeletonCard } from '../../components/common/StoryCard';
import '../../styles/StoryList.css';
import '../../styles/CategoryPage.css';

const PAGE_SIZE = 16;

function CategoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const genreParam = searchParams.get('genre') ?? 'all';

  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState(genreParam);
  const [currentPage, setCurrentPage] = useState(1);
  const [allStories, setAllStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLeft, setShowLeft]   = useState(false);
  const [showRight, setShowRight] = useState(false);

  const tabRef = useRef(null);

  // ── Kiểm tra có thể scroll không để hiện mũi tên ──
  const checkScroll = useCallback(() => {
    const el = tabRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 4);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [categories, checkScroll]);

  const scrollTabs = (dir) => {
    const el = tabRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 200, behavior: 'smooth' });
  };

  // ── Fetch thể loại ──
  useEffect(() => {
    getAllCategories()
      .then(res => {
        // axiosConfig interceptor đã unwrap response.data
        // nên res = { success: true, data: [...] }
        const list = Array.isArray(res) ? res : (res?.data ?? []);
        setCategories(list);
        if (genreParam !== 'all' && !list.some(c => String(c.categoryID) === genreParam)) {
          setActiveTab('all');
        }
      })
      .catch(() => setCategories([]));
  }, []);

  // ── Sync tab với URL ──
  useEffect(() => {
    const g = searchParams.get('genre') ?? 'all';
    setActiveTab(g);
    setCurrentPage(1);
  }, [searchParams]);

  // ── Fetch truyện ──
  useEffect(() => {
    setIsLoading(true);
    getAllStories({ visibleOnly: true })
      .then(data => setAllStories(Array.isArray(data) ? data : (data?.data ?? [])))
      .finally(() => setIsLoading(false));
  }, []);

  // ── Lọc + sort ──
  const filtered = useMemo(() => {
    let list = activeTab === 'all'
      ? [...allStories]
      : allStories.filter(s =>
          (s.categories ?? []).some(c => String(c.categoryID) === String(activeTab))
        );
    // Sort mới nhất lên đầu
    list.sort((a, b) => {
      const ta = a.updatedat ? new Date(a.updatedat).getTime() : 0;
      const tb = b.updatedat ? new Date(b.updatedat).getTime() : 0;
      return tb - ta;
    });
    return list;
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

        {/* ── TAB BAR + mũi tên scroll ── */}
        <div className="catpage-tabbar mb-4">
          {showLeft && (
            <button className="catpage-scroll-btn catpage-scroll-btn--left" onClick={() => scrollTabs(-1)}>
              <i className="bi bi-chevron-left" />
            </button>
          )}

          <div
            className="tab-wrapper d-flex gap-0"
            ref={tabRef}
            onScroll={checkScroll}
          >
            <button
              className={`tab-btn${'all' === activeTab ? ' active' : ''}`}
              onClick={() => switchTab('all')}
            >
              Tất cả
            </button>

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

          {showRight && (
            <button className="catpage-scroll-btn catpage-scroll-btn--right" onClick={() => scrollTabs(1)}>
              <i className="bi bi-chevron-right" />
            </button>
          )}
        </div>

        {/* ── DANH SÁCH TRUYỆN ── */}
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

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllStories } from '../../api/storyService';
import { StoryCardHorizontal, Pagination, SkeletonCard } from '../../components/common/StoryCard';
import './StoryList.css';

const PAGE_SIZE = 10;

const TABS = [
  { key: 'all',       label: 'Mới đăng' },
  { key: 'ongoing',   label: 'Đang ra'  },
  { key: 'completed', label: 'Đã hoàn'  },
];

function StoryList() {
  const [searchParams] = useSearchParams();
  const initTab = searchParams.get('status') === 'hoanthanh' ? 'completed'
                : searchParams.get('status') === 'dangra'    ? 'ongoing'
                : 'all';

  const [activeTab,    setActiveTab]    = useState(initTab);
  const [currentPage,  setCurrentPage]  = useState(1);
  const [allStories,   setAllStories]   = useState([]);
  const [isLoading,    setIsLoading]    = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getAllStories()
      .then(setAllStories)
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = [...allStories];
    if (activeTab === 'ongoing')   list = list.filter(s => s.trangthai_rachuong === 'dangra');
    if (activeTab === 'completed') list = list.filter(s => s.trangthai_rachuong === 'hoanthanh');
    list.sort((a, b) => (b.updatedat ?? 0) - (a.updatedat ?? 0));
    return list;
  }, [allStories, activeTab]);

  const totalPages   = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const switchTab = (key) => { setActiveTab(key); setCurrentPage(1); };

  return (
    <div className="story-list-page">
      <div className="container-lg px-4 px-lg-5 py-5">
        <div className="mb-4">
          <h4 className="story-list-page__title">DANH SÁCH TRUYỆN</h4>
        </div>

        <div className="tab-wrapper d-flex gap-0 mb-4">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`tab-btn${tab.key === activeTab ? ' active' : ''}`}
              onClick={() => switchTab(tab.key)}
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
            <p className="mb-0">Chưa có truyện nào trong mục này.</p>
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

export default StoryList;

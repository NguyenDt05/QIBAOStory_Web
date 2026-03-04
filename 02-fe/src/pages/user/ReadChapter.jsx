import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getChapterDetail, getChaptersByStory } from '../../api/chapterService';
import { useAuth } from '../../context/AuthContext';
import { useReader } from '../../context/ReaderContext';
import '../../styles/ReadChapter.css';

export default function ReadChapter() {
  const { storyid, chapterid: chapteridParam } = useParams();
  const chapterid = chapteridParam ?? 'first';
  const navigate = useNavigate();

  const { currentUser }  = useAuth();
  const { addToHistory } = useReader();

  const [isLoading, setIsLoading]   = useState(true);
  const [data, setData]             = useState(null);
  const [chapterList, setChapterList] = useState([]);
  const [menuOpen, setMenuOpen]     = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setMenuOpen(false);

    Promise.all([
      getChapterDetail(storyid, chapterid),
      getChaptersByStory(storyid),
    ]).then(([detail, list]) => {
      if (cancelled) return;
      setData(detail);
      setChapterList(list);
      addToHistory({
        id:         Date.now(),
        storyid,
        chapterid:  detail.chapter.chapterid,
        storyTitle: detail.storyTitle,
        storyCover: detail.storyCover ?? null,
        chaptername: detail.chapter.chaptername,
      });
    }).finally(() => {
      if (!cancelled) setIsLoading(false);
    });

    return () => { cancelled = true; };
  }, [storyid, chapterid]);

  useEffect(() => {
    function handler(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navigateToChapter = (c) => {
    if (!c) return;
    navigate(`/stories/${storyid}/chapters/${c.chapterid}`);
  };

  if (isLoading) {
    return (
      <div className="tdc-page">
        <div className="tdc-loading">
          <div className="spinner-border spinner-border-sm me-2" role="status" />
          Đang tải chương...
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="tdc-page">
        <div className="tdc-loading">Không tìm thấy chương.</div>
      </div>
    );
  }

  const { chapter, prevChapter, nextChapter, storyTitle, totalChapters, chapterIndex } = data;

  const colonIdx    = chapter.chaptername.indexOf(': ');
  const titleNumber = colonIdx !== -1 ? chapter.chaptername.slice(0, colonIdx) : chapter.chaptername;
  const titleName   = colonIdx !== -1 ? chapter.chaptername.slice(colonIdx + 2) : '';

  return (
    <div className="tdc-page">
      <div className="tdc-wrapper">

        {/* Breadcrumb */}
        <nav className="tdc-breadcrumb">
          <Link to="/stories" className="tdc-breadcrumb__link">Truyện</Link>
          <span className="tdc-breadcrumb__sep">›</span>
          <Link to={`/stories/${storyid}`} className="tdc-breadcrumb__link tdc-breadcrumb__link--truncate">
            {storyTitle}
          </Link>
        </nav>

        {/* Chapter header */}
        <div className="tdc-header">
          <h1 className="tdc-header__title">
            {titleNumber}
            {titleName && <span className="tdc-header__title-name">: {titleName}</span>}
          </h1>

          <div className="tdc-header__meta-row">
            <div className="tdc-header__meta">
              <span className="tdc-meta-item">
                <i className="bi bi-book tdc-meta-icon"></i>
                <Link to={`/stories/${storyid}`} className="tdc-meta-link">{storyTitle}</Link>
              </span>
              {chapter.author && (
                <span className="tdc-meta-item">
                  <i className="bi bi-pen tdc-meta-icon"></i>
                  {chapter.author}
                </span>
              )}
              {chapter.createdat && (
                <span className="tdc-meta-item">
                  <i className="bi bi-clock tdc-meta-icon"></i>
                  {chapter.createdat}
                </span>
              )}
            </div>

            {/* Chapter list dropdown */}
            <div className="tdc-menu-wrap" ref={menuRef}>
              <button
                className="tdc-btn-menu"
                onClick={() => setMenuOpen(v => !v)}
                title="Danh sách chương"
              >
                <i className="bi bi-list"></i>
              </button>

              {menuOpen && (
                <div className="tdc-dropdown">
                  <div className="tdc-dropdown__head">
                    Danh sách chương
                    <span className="tdc-dropdown__count">{totalChapters} chương</span>
                  </div>
                  <div className="tdc-dropdown__list">
                    {chapterList.map((c, i) => (
                      <Link
                        key={c.chapterid}
                        to={`/stories/${storyid}/chapters/${c.chapterid}`}
                        className={`tdc-dropdown__item ${i === chapterIndex ? 'tdc-dropdown__item--active' : ''}`}
                        onClick={() => setMenuOpen(false)}
                      >
                        <span className="tdc-dropdown__item-title text-truncate">{c.chaptername}</span>
                        <span className="tdc-dropdown__item-date">{c.createdat}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <hr className="tdc-divider" />

        {/* Chapter content */}
        <article className="tdc-content">
          {(chapter.content || '').split('\n').filter(line => line.trim() !== '').map((para, i) => (
            <p key={i} className="tdc-content__para">{para}</p>
          ))}
        </article>

        <hr className="tdc-divider" />

        {/* Navigation */}
        <nav className="tdc-nav">
          <button
            className="tdc-nav__btn tdc-nav__btn--prev"
            disabled={!prevChapter}
            onClick={() => navigateToChapter(prevChapter)}
          >
            <i className="bi bi-arrow-left me-2"></i>
            {prevChapter
              ? <span className="tdc-nav__label">{prevChapter.chaptername}</span>
              : <span className="tdc-nav__label tdc-nav__label--muted">Đây là chương đầu</span>
            }
          </button>

          <Link to={`/stories/${storyid}`} className="tdc-nav__btn-center" title="Về trang truyện">
            <i className="bi bi-house-door"></i>
          </Link>

          <button
            className="tdc-nav__btn tdc-nav__btn--next"
            disabled={!nextChapter}
            onClick={() => navigateToChapter(nextChapter)}
          >
            {nextChapter
              ? <span className="tdc-nav__label">{nextChapter.chaptername}</span>
              : <span className="tdc-nav__label tdc-nav__label--muted">Đây là chương cuối</span>
            }
            <i className="bi bi-arrow-right ms-2"></i>
          </button>
        </nav>

      </div>
    </div>
  );
}

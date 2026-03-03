import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const ITEMS_PER_PAGE = 20;
const COL_SIZE = 10;

function splitTitle(chaptername) {
  const idx = chaptername.indexOf(': ');
  if (idx === -1) return { number: chaptername, name: '' };
  return { number: chaptername.slice(0, idx), name: chaptername.slice(idx + 2) };
}

function buildPageRange(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [];
  const left  = Math.max(2, current - 2);
  const right = Math.min(total - 1, current + 2);
  pages.push(1);
  if (left > 2) pages.push('...');
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 1) pages.push('...');
  pages.push(total);
  return pages;
}

export default function ChapterListTab({ chapters = [], isHiatus = false }) {
  const { storyid } = useParams();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages      = Math.ceil(chapters.length / ITEMS_PER_PAGE);
  const currentChapters = chapters.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const goTo = (n) => setCurrentPage(Math.max(1, Math.min(totalPages, n)));
  const pageRange = buildPageRange(currentPage, totalPages);

  return (
    <div className="cdt-chuong-card">
      <div className="d-flex align-items-center justify-content-between cdt-chuong-card__header">
        <h6 className="fw-bold mb-0 cdt-chuong-card__section-title">Danh sách chương</h6>
        <span className="text-muted small">{chapters.length} chương</span>
      </div>

      {isHiatus ? (
        <div className="py-5 text-center">
          <i className="bi bi-pause-circle" style={{ fontSize: '2.5rem', color: 'var(--text-2)', opacity: 0.5 }} />
          <p className="mt-3 mb-0 fw-semibold" style={{ color: 'var(--text-2)', fontSize: '0.95rem' }}>
            Truyện đang tạm ngưng cập nhật
          </p>
          <p className="text-muted small mt-1">Danh sách chương không khả dụng trong thời gian này.</p>
        </div>
      ) : currentChapters.length > 0 ? (() => {
        const col1 = currentChapters.slice(0, COL_SIZE);
        const col2 = currentChapters.slice(COL_SIZE);
        const renderCol = (items) => items.map(c => {
          const { number, name } = splitTitle(c.chaptername);
          return (
            <Link
              to={`/stories/${storyid}/chapters/${c.chapterid}`}
              key={c.chapterid}
              className={`cdt-cl-item text-decoration-none ${!c.status ? 'cdt-cl-item--locked' : ''}`}
            >
              <span className="cdt-cl-item__so">{number}</span>
              <span className="cdt-cl-item__ten text-truncate">{name || number}</span>
              {!c.status && <i className="bi bi-lock cdt-cl-item__lock" />}
            </Link>
          );
        });
        return (
          <div className="cdt-cl-grid">
            <div className="cdt-cl-col">{renderCol(col1)}</div>
            <div className="cdt-cl-col">{renderCol(col2)}</div>
          </div>
        );
      })() : (
        <p className="text-muted py-4 text-center" style={{ fontSize: '0.9rem' }}>
          Chưa có chương nào.
        </p>
      )}

      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-1 cdt-chuong-card__pagination">
          <button className="page-link cdt-page-btn" disabled={currentPage === 1} onClick={() => goTo(1)} title="Trang đầu">
            <i className="bi bi-chevron-double-left" />
          </button>
          <button className="page-link cdt-page-btn" disabled={currentPage === 1} onClick={() => goTo(currentPage - 1)} title="Trang trước">
            <i className="bi bi-chevron-left" />
          </button>
          {pageRange.map((p, idx) =>
            p === '...' ? (
              <span key={`ellipsis-${idx}`} className="cdt-page-ellipsis">…</span>
            ) : (
              <button
                key={p}
                className={`page-link cdt-page-btn ${currentPage === p ? 'cdt-page-btn--active' : ''}`}
                onClick={() => goTo(p)}
              >
                {p}
              </button>
            )
          )}
          <button className="page-link cdt-page-btn" disabled={currentPage === totalPages} onClick={() => goTo(currentPage + 1)} title="Trang sau">
            <i className="bi bi-chevron-right" />
          </button>
          <button className="page-link cdt-page-btn" disabled={currentPage === totalPages} onClick={() => goTo(totalPages)} title="Trang cuối">
            <i className="bi bi-chevron-double-right" />
          </button>
        </div>
      )}
    </div>
  );
}

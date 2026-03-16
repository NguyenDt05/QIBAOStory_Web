import { useState, useRef, useEffect } from 'react';
// 1. Import hàm gọi API (đảm bảo bạn đã tạo hàm này trong categoryService)
import { getAllCategories } from '../../api/categoryService';

export function GenreBadge({ label }) {
  return (
    <span
      className="fw-semibold me-1"
      style={{
        fontSize: '0.75rem',
        padding: '2px 10px',
        borderRadius: '50px',
        backgroundColor: 'rgba(255,255,255,0.07)',
        color: 'var(--text-2)',
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'inline-block',
      }}
    >
      {label}
    </span>
  );
}

// Hàm chuẩn hóa dữ liệu để khớp với mọi kiểu trả về từ Backend
function normalizeOptions(list) {
  if (!list) return [];
  return list.map(g => ({
    // Ưu tiên lấy categoryid (số) làm value
    value: g.categoryid ?? g.categoryID ?? g.value, 
    label: g.categoryname ?? g.label,
  }));
}

function GenreSelect({
  selected = [],
  onChange,
  label = 'Thể loại',
  placeholder = 'Tìm thể loại...',
  showTags = true,
}) {
  const [searchText, setSearchText] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // 2. Tạo state để lưu danh sách thể loại từ Database
  const [dbOptions, setDbOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const wrapRef = useRef();

  // 3. Gọi API khi component vừa hiển thị
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await getAllCategories();
        // axiosConfig của bạn đã bóc sẵn data, nên res thường là mảng hoặc {data: []}
        const data = res?.data || res; 
        if (Array.isArray(data)) {
          setDbOptions(data);
        }
      } catch (err) {
        console.error("Lỗi tải thể loại từ DB:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const normalizedOptions = normalizeOptions(dbOptions);

  const toggle = (value) => {
    onChange(
      selected.includes(value)
        ? selected.filter(v => v !== value)
        : [...selected, value]
    );
  };

  const filtered = normalizedOptions.filter(g =>
    g.label?.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setDropdownOpen(false);
        setSearchText('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      {label !== false && (
        <label className="form-label fw-semibold text-secondary small d-block mb-2">
          {label}
          {selected.length > 0 && (
            <span className="ms-2 text-danger" style={{ fontSize: '0.75rem' }}>
              ({selected.length} đã chọn)
            </span>
          )}
          {loading && <span className="ms-2 spinner-border spinner-border-sm" style={{width: '10px', height: '10px'}}></span>}
        </label>
      )}

      <div
        className="input-group"
        style={{
          borderRadius: '50px',
          overflow: 'hidden',
          border: dropdownOpen
            ? '1.5px solid var(--accent)'
            : '1px solid rgba(255,255,255,0.1)',
          transition: 'border 0.2s',
        }}
      >
        <span className="input-group-text border-0 ps-3" style={{ backgroundColor: '#1c2232' }}>
          <i className="bi bi-search" style={{ fontSize: '0.85rem', color: 'var(--accent)' }} />
        </span>
        <input
          type="text"
          className="form-control border-0"
          placeholder={loading ? "Đang tải dữ liệu..." : placeholder}
          value={searchText}
          onChange={e => { setSearchText(e.target.value); setDropdownOpen(true); }}
          onFocus={() => setDropdownOpen(true)}
          disabled={loading}
          style={{
            boxShadow: 'none',
            fontSize: '0.9rem',
            backgroundColor: '#1c2232',
            color: '#e2e8f0',
          }}
        />
        {searchText && (
          <button
            className="btn border-0 pe-3"
            type="button"
            style={{ backgroundColor: '#1c2232' }}
            onClick={() => { setSearchText(''); setDropdownOpen(true); }}
          >
            <i className="bi bi-x" style={{ color: '#8892a4' }} />
          </button>
        )}
      </div>

      {dropdownOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0,
          right: 0,
          zIndex: 200,
          backgroundColor: 'var(--surface-1)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          maxHeight: '220px',
          overflowY: 'auto',
        }}>
          {filtered.length === 0 ? (
            <div className="text-center text-muted small py-3">Không tìm thấy thể loại nào</div>
          ) : (
            filtered.map(g => {
              const isSelected = selected.includes(g.value);
              return (
                <div
                  key={g.value}
                  className="d-flex align-items-center gap-2 px-3 py-2"
                  style={{
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'rgba(224,82,82,0.1)' : 'transparent',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  onClick={() => { toggle(g.value); setSearchText(''); }}
                >
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '5px',
                    flexShrink: 0,
                    border: isSelected ? 'none' : '1.5px solid rgba(255,255,255,0.15)',
                    backgroundColor: isSelected ? 'var(--accent)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {isSelected && (
                      <i className="bi bi-check text-white" style={{ fontSize: '0.7rem', lineHeight: 1 }} />
                    )}
                  </div>
                  <span
                    className="small"
                    style={{
                      color: isSelected ? 'var(--accent)' : '#c9d1d9',
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  >
                    {g.label}
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}

      {showTags && selected.length > 0 && (
        <div className="d-flex flex-wrap gap-2 mt-2">
          {selected.map(v => {
            const g = normalizedOptions.find(x => x.value === v);
            return g ? (
              <span
                key={v}
                className="d-flex align-items-center gap-1 fw-semibold"
                style={{
                  fontSize: '0.8rem',
                  padding: '3px 12px',
                  borderRadius: '50px',
                  backgroundColor: 'rgba(224,82,82,0.12)',
                  color: 'var(--accent)',
                  border: '1px solid rgba(224,82,82,0.3)',
                }}
              >
                {g.label}
                <i
                  className="bi bi-x"
                  style={{ cursor: 'pointer', fontSize: '0.9rem' }}
                  onClick={() => toggle(v)}
                />
              </span>
            ) : null;
          })}
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => onChange([])}
            style={{
              fontSize: '0.75rem',
              borderRadius: '50px',
              backgroundColor: 'transparent',
              color: '#6b7280',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '2px 10px',
            }}
          >
            Xóa tất cả
          </button>
        </div>
      )}
    </div>
  );
}

export default GenreSelect;
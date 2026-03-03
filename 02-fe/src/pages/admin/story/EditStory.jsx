import { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import GenreSelect from '../../../components/common/GenreSelect';
import { CATEGORIES_LIST } from '../../../constants/categories';
import { STORY_STATUS } from '../../../constants/storyStatus';

export default function EditStory() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const story = state?.story;

  const [preview, setPreview] = useState(story?.cover ?? null);
  const [selectedGenres, setSelectedGenres] = useState(
    story?.categories?.map(c =>
      CATEGORIES_LIST.find(cat => cat.categoryID === c.categoryID)?.slug ?? String(c.categoryID)
    ) ?? []
  );
  const fileRef = useRef();

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/admin/stories');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0" style={{ color: 'var(--primary-color)' }}>
            <i className="bi bi-pencil-square me-2"></i>Sửa thông tin truyện
          </h4>
          <small className="text-muted">{story?.title ?? 'Không xác định'}</small>
        </div>
        <Link to="/admin/stories" className="btn fw-bold text-decoration-none"
          style={{ borderRadius: '50px', backgroundColor: 'rgba(224,82,82,0.1)', color: 'var(--primary-color)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 22px' }}>
          <i className="bi bi-arrow-left me-2"></i>Quay lại
        </Link>
      </div>

      <div className="row g-4 align-items-start">
        {/* Cover image */}
        <div className="col-md-3">
          <div style={{ backgroundColor: 'var(--surface-1)', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 6px 24px rgba(0,0,0,0.4)', padding: '20px', position: 'sticky', top: '16px' }}>
            <p className="fw-semibold text-secondary small mb-2">Ảnh bìa</p>
            <div onClick={() => fileRef.current.click()}
              style={{ width: '100%', aspectRatio: '2/3', borderRadius: '14px', border: '2px dashed rgba(255,255,255,0.15)', backgroundColor: 'var(--surface-2)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', marginBottom: '12px' }}>
              {preview
                ? <img src={preview} alt="Ảnh bìa" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <><i className="bi bi-image text-danger" style={{ fontSize: '2.5rem' }}></i><small className="text-muted mt-2" style={{ fontSize: '0.75rem' }}>Nhấn để chọn ảnh bìa</small></>}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="d-none" onChange={handleFileChange} />
            <button type="button" className="btn w-100 fw-semibold" onClick={() => fileRef.current.click()}
              style={{ borderRadius: '50px', backgroundColor: 'rgba(224,82,82,0.1)', color: 'var(--primary-color)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem' }}>
              <i className="bi bi-upload me-2"></i>{preview ? 'Đổi ảnh' : 'Tải ảnh lên'}
            </button>
            {preview && (
              <button type="button" className="btn w-100 mt-2 fw-semibold"
                onClick={() => { setPreview(null); fileRef.current.value = ''; }}
                style={{ borderRadius: '50px', backgroundColor: '#f5f5f5', color: '#6b7280', border: '1px solid #ddd', fontSize: '0.85rem' }}>
                <i className="bi bi-x-circle me-2"></i>Xóa ảnh
              </button>
            )}
          </div>
        </div>

        {/* Fields */}
        <div className="col-md-9">
          <div style={{ backgroundColor: 'var(--surface-1)', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 6px 24px rgba(0,0,0,0.4)', padding: '28px' }}>
            <div className="row g-4">
              <div className="col-md-8">
                <label className="form-label fw-semibold text-secondary small">Tên truyện <span className="text-danger">*</span></label>
                <input type="text" className="form-control" placeholder="Nhập tên truyện..."
                  defaultValue={story?.title ?? ''}
                  style={{ borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'none' }} required />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold text-secondary small">Số chương</label>
                <input type="text" className="form-control" placeholder="Nhập số chương..."
                  defaultValue={story?.chapters ?? ''}
                  style={{ borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'none' }} />
              </div>
              <div className="col-md-8">
                <label className="form-label fw-semibold text-secondary small">Tác giả <span className="text-danger">*</span></label>
                <input type="text" className="form-control" placeholder="Nhập tên tác giả..."
                  defaultValue={story?.author ?? ''}
                  style={{ borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'none' }} required />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold text-secondary small">Trạng thái</label>
                <select className="form-select" defaultValue={story?.trangthai_rachuong ?? 'dangra'}
                  style={{ borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'none' }}>
                  {Object.entries(STORY_STATUS).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
              </div>
              <div className="col-12">
                <GenreSelect selected={selectedGenres} onChange={setSelectedGenres} />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold text-secondary small">Mô tả / Tóm tắt</label>
                <textarea className="form-control" rows={4} placeholder="Nhập mô tả ngắn về truyện..."
                  defaultValue={story?.description ?? ''}
                  style={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'none', resize: 'none' }} />
              </div>
              <div className="col-12 d-flex justify-content-between align-items-center pt-1 flex-wrap gap-3">
                <div className="form-check form-switch d-flex align-items-center gap-3 mb-0">
                  <input className="form-check-input" type="checkbox" role="switch" id="switchVisible"
                    defaultChecked={story?.status ?? true}
                    style={{ width: '2.4em', height: '1.3em', cursor: 'pointer' }} />
                  <label className="form-check-label fw-semibold text-secondary small" htmlFor="switchVisible">
                    Hiển thị truyện
                  </label>
                </div>
                <div className="d-flex gap-2">
                  <Link to="/admin/stories" className="btn fw-bold text-decoration-none"
                    style={{ borderRadius: '50px', backgroundColor: '#f5f5f5', color: '#8892a4', border: '1px solid #ddd', padding: '8px 24px' }}>
                    Hủy
                  </Link>
                  <button type="submit" className="btn fw-bold shadow-sm"
                    style={{ borderRadius: '50px', backgroundColor: 'var(--primary-color)', color: '#fff', padding: '8px 28px' }}>
                    <i className="bi bi-check-lg me-2"></i>Lưu thay đổi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

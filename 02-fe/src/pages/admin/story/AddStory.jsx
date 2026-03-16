import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GenreSelect from '../../../components/common/GenreSelect';
import { STORY_STATUS } from '../../../constants/storyStatus';
// 1. Import hàm addStory từ api service của bạn
import { addStory } from '../../../api/storyService'; 

export default function AddStory() {
  const navigate = useNavigate();
  const fileRef = useRef();
  
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // 2. Quản lý toàn bộ dữ liệu form bằng state
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    storyCount: '',
    trangthai_rachuong: 'dang_ra', // Mặc định trạng thái đầu tiên
    status: 1, // 1 là hiện, 0 là ẩn
    categoryIDs: [],
    imageFile: null // Lưu file thật để gửi API
  });

  // Hàm xử lý khi gõ chữ vào các ô input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setPreview(URL.createObjectURL(f));
      setFormData(prev => ({ ...prev, imageFile: f }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // 3. Đóng gói dữ liệu vào FormData (Giống hệt cách bạn làm trên Postman)
    const data = new FormData();
    data.append('title', formData.title);
    data.append('author', formData.author);
    data.append('description', formData.description);
    data.append('storyCount', formData.storyCount || "0");
    data.append('trangthai_rachuong', formData.trangthai_rachuong);
    data.append('status', formData.status); // Sẽ gửi dưới dạng string '1' hoặc '0'
    
    // Chuyển mảng IDs thành chuỗi "3,21" cho Backend
    if (formData.categoryIDs.length > 0) {
      data.append('categoryIDs', formData.categoryIDs.join(','));
    }

    // Key phải là 'image' đúng như Backend Multer đang đợi
    if (formData.imageFile) {
      data.append('image', formData.imageFile);
    }

    try {
      setLoading(true);
      const res = await addStory(data);
      if (res && res.success) {
        // alert("Thêm truyện thành công!");
        navigate('/admin/stories');
      }
    } catch (err) {
      console.error("Lỗi:", err);
      alert(err.response?.data?.message || "Lỗi khi lưu truyện");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0" style={{ color: 'var(--primary-color)' }}>
            <i className="bi bi-plus-circle me-2"></i>Thêm truyện mới
          </h4>
          <small className="text-muted">Điền đầy đủ thông tin để thêm truyện vào hệ thống</small>
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
          </div>
        </div>

        {/* Fields */}
        <div className="col-md-9">
          <div style={{ backgroundColor: 'var(--surface-1)', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 6px 24px rgba(0,0,0,0.4)', padding: '28px' }}>
            <div className="row g-4">
              <div className="col-md-8">
                <label className="form-label fw-semibold text-secondary small">Tên truyện <span className="text-danger">*</span></label>
                <input type="text" name="title" className="form-control" placeholder="Nhập tên truyện..."
                  value={formData.title} onChange={handleInputChange}
                  style={{ borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'none' }} required />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold text-secondary small">Số chương</label>
                <input type="text" name="storyCount" className="form-control" placeholder="0"
                  value={formData.storyCount} onChange={handleInputChange}
                  style={{ borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'none' }} />
              </div>
              <div className="col-md-8">
                <label className="form-label fw-semibold text-secondary small">Tác giả <span className="text-danger">*</span></label>
                <input type="text" name="author" className="form-control" placeholder="Nhập tên tác giả..."
                  value={formData.author} onChange={handleInputChange}
                  style={{ borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'none' }} required />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold text-secondary small">Trạng thái</label>
                <select name="trangthai_rachuong" className="form-select" 
                  value={formData.trangthai_rachuong} onChange={handleInputChange}
                  style={{ borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'none' }}>
                  {Object.values(STORY_STATUS).map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12">
                {/* 4. Cập nhật categoryIDs khi chọn thể loại */}
                <GenreSelect selected={formData.categoryIDs} 
                  onChange={(ids) => setFormData(prev => ({ ...prev, categoryIDs: ids }))} />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold text-secondary small">Mô tả / Tóm tắt</label>
                <textarea name="description" className="form-control" rows={4} placeholder="Nhập mô tả ngắn về truyện..."
                  value={formData.description} onChange={handleInputChange}
                  style={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'none', resize: 'none' }} />
              </div>
              <div className="col-12 d-flex justify-content-between align-items-center pt-1 flex-wrap gap-3">
                <div className="form-check form-switch d-flex align-items-center gap-3 mb-0">
                  <input className="form-check-input" type="checkbox" role="switch" id="switchVisible" 
                    checked={formData.status === 1}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.checked ? 1 : 0 }))}
                    style={{ width: '2.4em', height: '1.3em', cursor: 'pointer' }} />
                  <label className="form-check-label fw-semibold text-secondary small" htmlFor="switchVisible">
                    Hiển thị truyện ngay sau khi thêm
                  </label>
                </div>
                <div className="d-flex gap-2">
                  <Link to="/admin/stories" className="btn fw-bold text-decoration-none"
                    style={{ borderRadius: '50px', backgroundColor: '#f5f5f5', color: '#8892a4', border: '1px solid #ddd', padding: '8px 24px' }}>
                    Hủy
                  </Link>
                  <button type="submit" className="btn fw-bold shadow-sm" disabled={loading}
                    style={{ borderRadius: '50px', backgroundColor: 'var(--primary-color)', color: '#fff', padding: '8px 28px' }}>
                    <i className="bi bi-check-lg me-2"></i>
                    {loading ? 'Đang lưu...' : 'Lưu truyện'}
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
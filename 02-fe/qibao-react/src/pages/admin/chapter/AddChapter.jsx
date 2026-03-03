import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function AddChapter() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const story = state?.story;

  const [chaptername, setChaptername] = useState('');
  const [content, setContent]         = useState('');
  const [visible, setVisible]         = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/admin/stories/detail', { state: { story } });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0" style={{ color: 'var(--primary-color)' }}>
            <i className="bi bi-journal-plus me-2"></i>Thêm chương mới
          </h4>
          <small className="text-muted">{story?.title ?? 'Không xác định'}</small>
        </div>
        <Link to="/admin/stories/detail" state={{ story }} className="btn fw-bold text-decoration-none"
          style={{ borderRadius: '50px', backgroundColor: 'rgba(224,82,82,0.1)', color: 'var(--primary-color)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 22px' }}>
          <i className="bi bi-arrow-left me-2"></i>Quay lại
        </Link>
      </div>

      <div style={{ backgroundColor: 'var(--surface-1)', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 6px 24px rgba(0,0,0,0.4)', padding: '28px' }}>
        <div className="row g-4">
          <div className="col-md-8">
            <label className="form-label fw-semibold text-secondary small">Tên chương <span className="text-danger">*</span></label>
            <input type="text" className="form-control" placeholder="VD: Chương 1: Khởi đầu"
              value={chaptername} onChange={e => setChaptername(e.target.value)}
              style={{ borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'none' }} required />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold text-secondary small">Trạng thái hiển thị</label>
            <div className="d-flex gap-2 mt-1">
              <button type="button"
                onClick={() => setVisible(true)}
                className={`btn fw-semibold flex-fill ${visible ? '' : ''}`}
                style={{
                  borderRadius: '50px', fontSize: '0.85rem', padding: '8px',
                  backgroundColor: visible ? 'rgba(25,135,84,0.15)' : 'var(--surface-2)',
                  color: visible ? '#198754' : 'var(--text-muted)',
                  border: visible ? '1px solid rgba(25,135,84,0.4)' : '1px solid rgba(255,255,255,0.1)'
                }}>
                <i className="bi bi-eye me-1"></i>Hiển thị
              </button>
              <button type="button"
                onClick={() => setVisible(false)}
                className="btn fw-semibold flex-fill"
                style={{
                  borderRadius: '50px', fontSize: '0.85rem', padding: '8px',
                  backgroundColor: !visible ? 'rgba(220,53,69,0.1)' : 'var(--surface-2)',
                  color: !visible ? '#dc3545' : 'var(--text-muted)',
                  border: !visible ? '1px solid rgba(220,53,69,0.3)' : '1px solid rgba(255,255,255,0.1)'
                }}>
                <i className="bi bi-lock me-1"></i>Khóa
              </button>
            </div>
          </div>
          <div className="col-12">
            <label className="form-label fw-semibold text-secondary small">Nội dung chương <span className="text-danger">*</span></label>
            <textarea className="form-control" rows={18} placeholder="Nhập nội dung chương tại đây..."
              value={content} onChange={e => setContent(e.target.value)}
              style={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'none', resize: 'vertical', fontFamily: "'Georgia', serif", lineHeight: '1.8', fontSize: '0.95rem' }}
              required />
          </div>
          <div className="col-12 d-flex justify-content-end gap-2 pt-1">
            <Link to="/admin/stories/detail" state={{ story }} className="btn fw-bold text-decoration-none"
              style={{ borderRadius: '50px', backgroundColor: '#f5f5f5', color: '#8892a4', border: '1px solid #ddd', padding: '8px 24px' }}>
              Hủy
            </Link>
            <button type="submit" className="btn fw-bold shadow-sm"
              style={{ borderRadius: '50px', backgroundColor: 'var(--primary-color)', color: '#fff', padding: '8px 28px' }}>
              <i className="bi bi-check-lg me-2"></i>Lưu chương
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

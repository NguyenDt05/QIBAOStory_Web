import { useState, useEffect } from 'react';
import { 
  getAllCategories, 
  addCategory, 
  updateCategory, 
  toggleCategoryStatus, 
  deleteCategory 
} from '../../../api/categoryService';
import ConfirmDeleteModal from '../../../components/common/ConfirmDeleteModal';

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [showModal, setShowModal]   = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // 1. Lấy dữ liệu danh sách thể loại
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await getAllCategories();
        
        // Xử lý bóc tách dữ liệu linh hoạt từ API
        let finalData = [];
        if (Array.isArray(response)) {
          finalData = response;
        } else if (response?.data && Array.isArray(response.data)) {
          finalData = response.data;
        } else if (response?.result && Array.isArray(response.result)) {
          finalData = response.result;
        }

        setCategories(finalData);
      } catch (err) {
        console.error("Lỗi khi load categories:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 2. Bộ lọc tìm kiếm
  const safeList = Array.isArray(categories) ? categories : [];
  const filtered = safeList.filter(tl =>
    (tl.categoryname || '').toLowerCase().includes(search.toLowerCase())
  );

  // 3. API: Bật/tắt trạng thái hiển thị
  const handleToggle = async (tl) => {
    try {
      const id = tl.categoryID || tl.categoryid;
      await toggleCategoryStatus(id);
      
      // Cập nhật UI nhanh
      const newStatus = (tl.status === "1" || tl.status === 1) ? "0" : "1";
      setCategories(prev => prev.map(c => 
        (c.categoryID === id || c.categoryid === id) ? { ...c, status: newStatus } : c
      ));
    } catch (err) { console.error("Lỗi toggle status:", err); }
  };

  // 4. API: Thêm hoặc Sửa thể loại
  const handleSave = async (data) => {
    try {
      if (editTarget) {
        const id = editTarget.categoryID || editTarget.categoryid;
        const payload = { ...data, categoryID: id };
        
        await updateCategory(id, payload);
        
        // Cập nhật dòng vừa sửa trên UI
        setCategories(prev => prev.map(c => 
          (c.categoryID === id || c.categoryid === id) ? { ...c, ...data } : c
        ));
      } else {
        const created = await addCategory(data);
        const newItem = created?.data || created || data;
        setCategories(prev => [...prev, newItem]);
      }
      closeModal();
    } catch (err) { console.error("Lỗi lưu dữ liệu:", err); }
  };

  // 5. API: XÓA THỂ LOẠI (Nối API Delete)
  const handleDelete = async () => {
    try {
      // Lấy ID chuẩn từ mục đang chờ xóa
      const id = deleteTarget.categoryID || deleteTarget.categoryid;
      
      if (!id) return;

      // Gọi API DELETE: /api/categories/:categoryID
      await deleteCategory(id);
      
      // Xóa dòng đó khỏi State để biến mất trên giao diện ngay lập tức
      setCategories(prev => prev.filter(c => 
        c.categoryID !== id && c.categoryid !== id
      ));

      // Reset target xóa để đóng modal
      setDeleteTarget(null);
    } catch (err) { 
      console.error("Lỗi xóa:", err); 
      alert("Xóa thất bại! Thể loại này có thể đang được sử dụng ở bảng khác.");
      setDeleteTarget(null);
    }
  };

  // Quản lý trạng thái Modal
  const openAdd = () => { setEditTarget(null); setShowModal(true); };
  const openEdit = (tl) => { setEditTarget(tl); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditTarget(null); };

  return (
    <>
      {/* TIÊU ĐỀ & NÚT THÊM */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h4 className="fw-bold mb-0" style={{ color: 'var(--primary-color)' }}>
            <i className="bi bi-tags-fill me-2"></i>Quản lý thể loại
          </h4>
          <small className="text-muted">Tổng cộng {safeList.length} thể loại</small>
        </div>
        <button className="btn fw-bold shadow-sm" onClick={openAdd}
          style={{ borderRadius: '50px', backgroundColor: 'var(--primary-color)', color: '#fff', padding: '8px 22px' }}>
          <i className="bi bi-plus-lg me-2"></i>Thêm thể loại
        </button>
      </div>

      {/* DANH SÁCH BẢNG */}
      <div style={{ backgroundColor: 'var(--surface-1)', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 6px 24px rgba(0,0,0,0.4)', overflow: 'hidden' }}>
        
        <div className="p-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <input type="text" className="form-control" placeholder="Tìm theo tên..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)', maxWidth: 340 }} />
        </div>

        {loading ? (
          <div className="text-center py-5 text-muted"><div className="spinner-border spinner-border-sm me-2"></div>Đang tải...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-tags fs-1 d-block mb-2"></i>Không tìm thấy thể loại nào.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 text-nowrap">
              <thead style={{ backgroundColor: 'var(--surface-2)', fontSize: '0.8rem' }}>
                <tr>
                  <th className="ps-4 text-secondary fw-semibold">#</th>
                  <th className="text-secondary fw-semibold">Tên thể loại</th>
                  <th className="text-secondary fw-semibold text-center">Số truyện</th>
                  <th className="text-secondary fw-semibold text-center">Hiển thị</th>
                  <th className="text-secondary fw-semibold text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((tl, idx) => (
                  <tr key={tl.categoryID || tl.categoryid || idx} style={{ opacity: (tl.status === "1" || tl.status === 1) ? 1 : 0.4, transition: 'opacity 0.2s' }}>
                    <td className="ps-4 text-secondary" style={{ fontSize: '0.85rem' }}>{idx + 1}</td>
                    <td className="fw-semibold" style={{ fontSize: '0.9rem' }}>{tl.categoryname}</td>                  
                    <td className="text-center text-secondary" style={{ fontSize: '0.85rem' }}>{tl.storyCount ?? 0}</td>
                    <td className="text-center">
                      <div className="form-check form-switch d-flex justify-content-center mb-0">
                        <input className="form-check-input" type="checkbox" role="switch"
                          checked={tl.status === "1" || tl.status === 1} onChange={() => handleToggle(tl)}
                          style={{ width: '2.2em', height: '1.2em', cursor: 'pointer', accentColor: 'var(--primary-color)' }} />
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        <button className="btn btn-sm fw-bold shadow-sm" title="Sửa"
                          style={{ borderRadius: '50px', backgroundColor: '#e3f2fd', color: '#1565c0', border: 'none' }}
                          onClick={() => openEdit(tl)}>
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button className="btn btn-sm fw-bold shadow-sm" title="Xóa"
                          style={{ borderRadius: '50px', backgroundColor: 'rgba(224,82,82,0.1)', color: 'var(--primary-color)', border: 'none' }}
                          onClick={() => setDeleteTarget(tl)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL FORM THÊM/SỬA */}
      <CategoryModal show={showModal} editTarget={editTarget} onClose={closeModal} onSave={handleSave} />

      {/* MODAL XÁC NHẬN XÓA */}
      <ConfirmDeleteModal
        show={!!deleteTarget}
        title="Xóa thể loại"
        message={`Bạn có chắc chắn muốn xóa thể loại "${deleteTarget?.categoryname}" không? Hành động này không thể hoàn tác.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}

// --- CHI TIẾT MODAL FORM ---
function CategoryModal({ show, editTarget, onClose, onSave }) {
  const [name, setName] = useState('');
  const [status, setStatus] = useState(true);

  useEffect(() => {
    if (show) {
      setName(editTarget?.categoryname ?? '');
      setStatus(editTarget ? (editTarget.status === "1" || editTarget.status === 1) : true); 
    }
  }, [show, editTarget]);

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ 
      categoryname: name.trim(), 
      status: status ? "1" : "0" 
    }); 
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content" style={{ backgroundColor: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: '20px' }}>
          
          <div className="modal-header" style={{ borderBottom: '1px solid var(--border)' }}>
            <h6 className="modal-title fw-bold">
              {/* TRẢ LẠI GIAO DIỆN BAN ĐẦU: Icon pencil-fill màu text-danger */}
              <i className={`bi bi-${editTarget ? 'pencil-fill' : 'plus-circle-fill'} me-2 text-danger`}></i>
              {editTarget ? 'Sửa thể loại' : 'Thêm thể loại mới'}
            </h6>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <div className="mb-4">
                <label className="form-label fw-semibold text-secondary small">Tên thể loại <span className="text-danger">*</span></label>
                <input type="text" className="form-control" placeholder="VD: Hành động, Tình cảm..."
                  value={name} onChange={e => setName(e.target.value)}
                  style={{ borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'none' }} required />
              </div>
              
              <div className="form-check form-switch d-flex align-items-center gap-3">
                <input className="form-check-input" type="checkbox" role="switch" id="catStatus"
                  checked={status} onChange={e => setStatus(e.target.checked)}
                  style={{ width: '2.4em', height: '1.3em', cursor: 'pointer' }} />
                <label className="form-check-label fw-semibold text-secondary small" htmlFor="catStatus">
                  Hiển thị ngoài bảng
                </label>
              </div>
            </div>
            
            <div className="modal-footer" style={{ borderTop: '1px solid var(--border)' }}>
              <button type="button" className="btn fw-bold" onClick={onClose}
                style={{ borderRadius: '50px', backgroundColor: '#f5f5f5', color: '#8892a4', border: '1px solid #ddd', padding: '7px 20px' }}>
                Hủy
              </button>
              <button type="submit" className="btn fw-bold"
                style={{ borderRadius: '50px', backgroundColor: 'var(--primary-color)', color: '#fff', padding: '7px 20px' }}>
                <i className="bi bi-check-lg me-2"></i>{editTarget ? 'Lưu thay đổi' : 'Thêm mới'}
              </button>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  );
}
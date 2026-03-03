import { useState, useEffect } from 'react';
import { getAllCategories, addCategory, updateCategory, toggleCategoryStatus, deleteCategory } from '../../../api/categoryService';
import ConfirmDeleteModal from '../../../components/common/ConfirmDeleteModal';

function CategoryModal({ show, editTarget, onClose, onSave }) {
  const [name, setName]           = useState('');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (show) {
      setName(editTarget?.categoryname ?? '');
      setIsVisible(editTarget?.visible ?? true);
    }
  }, [show, editTarget]);

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ categoryname: name.trim(), visible: isVisible });
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content" style={{ backgroundColor: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: '20px' }}>
          <div className="modal-header" style={{ borderBottom: '1px solid var(--border)' }}>
            <h6 className="modal-title fw-bold">
              <i className={`bi bi-${editTarget ? 'pencil-fill' : 'plus-circle-fill'} me-2 text-danger`}></i>
              {editTarget ? 'Sửa thể loại' : 'Thêm thể loại mới'}
            </h6>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary small">Tên thể loại <span className="text-danger">*</span></label>
                <input type="text" className="form-control" placeholder="VD: Hành động, Tình cảm..."
                  value={name} onChange={e => setName(e.target.value)}
                  style={{ borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'none' }} required />
              </div>
              <div className="form-check form-switch d-flex align-items-center gap-3">
                <input className="form-check-input" type="checkbox" role="switch" id="catVisible"
                  checked={isVisible} onChange={e => setIsVisible(e.target.checked)}
                  style={{ width: '2.4em', height: '1.3em', cursor: 'pointer' }} />
                <label className="form-check-label fw-semibold text-secondary small" htmlFor="catVisible">
                  Hiển thị thể loại
                </label>
              </div>
            </div>
            <div className="modal-footer" style={{ borderTop: '1px solid var(--border)' }}>
              <button type="button" className="btn fw-bold"
                onClick={onClose}
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

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [showModal, setShowModal]   = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    getAllCategories().then(setCategories).finally(() => setLoading(false));
  }, []);

  const filtered = categories.filter(tl =>
    tl.categoryname.toLowerCase().includes(search.toLowerCase()) ||
    (tl.slug ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const openAdd  = () => { setEditTarget(null); setShowModal(true); };
  const openEdit = (tl) => { setEditTarget(tl); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditTarget(null); };

  const handleSave = async ({ categoryname, visible }) => {
    if (editTarget) {
      const updated = await updateCategory(editTarget.categoryID, { categoryname, visible });
      setCategories(prev => prev.map(c => c.categoryID === editTarget.categoryID ? updated : c));
    } else {
      const created = await addCategory({ categoryname, visible });
      setCategories(prev => [...prev, created]);
    }
    closeModal();
  };

  const handleToggle = async (tl) => {
    const updated = await toggleCategoryStatus(tl.categoryID);
    setCategories(updated);
  };

  const handleDelete = async () => {
    await deleteCategory(deleteTarget.categoryID);
    setCategories(prev => prev.filter(c => c.categoryID !== deleteTarget.categoryID));
    setDeleteTarget(null);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h4 className="fw-bold mb-0" style={{ color: 'var(--primary-color)' }}>
            <i className="bi bi-tags-fill me-2"></i>Quản lý thể loại
          </h4>
          <small className="text-muted">Tổng cộng {categories.length} thể loại</small>
        </div>
        <button className="btn fw-bold shadow-sm" onClick={openAdd}
          style={{ borderRadius: '50px', backgroundColor: 'var(--primary-color)', color: '#fff', padding: '8px 22px' }}>
          <i className="bi bi-plus-lg me-2"></i>Thêm thể loại
        </button>
      </div>

      <div style={{ backgroundColor: 'var(--surface-1)', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 6px 24px rgba(0,0,0,0.4)', overflow: 'hidden' }}>
        <div className="p-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <input type="text" className="form-control" placeholder="Tìm theo tên hoặc slug..."
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
                  <th className="text-secondary fw-semibold">Slug</th>
                  <th className="text-secondary fw-semibold text-center">Số truyện</th>
                  <th className="text-secondary fw-semibold text-center">Hiển thị</th>
                  <th className="text-secondary fw-semibold text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((tl, idx) => (
                  <tr key={tl.categoryID} style={{ opacity: tl.visible ? 1 : 0.4, transition: 'opacity 0.2s' }}>
                    <td className="ps-4 text-secondary" style={{ fontSize: '0.85rem' }}>{idx + 1}</td>
                    <td className="fw-semibold" style={{ fontSize: '0.9rem' }}>{tl.categoryname}</td>
                    <td>
                      <code style={{ fontSize: '0.8rem', color: 'var(--text-muted)', backgroundColor: 'var(--surface-2)', padding: '2px 8px', borderRadius: '6px' }}>
                        {tl.slug}
                      </code>
                    </td>
                    <td className="text-center text-secondary" style={{ fontSize: '0.85rem' }}>{tl.storyCount ?? 0}</td>
                    <td className="text-center">
                      <div className="form-check form-switch d-flex justify-content-center mb-0">
                        <input className="form-check-input" type="checkbox" role="switch"
                          checked={tl.visible} onChange={() => handleToggle(tl)}
                          style={{ width: '2.2em', height: '1.2em', cursor: 'pointer', accentColor: 'var(--primary-color)' }} />
                      </div>
                    </td>
                    <td className="text-center">
                      <button className="btn btn-sm me-2" onClick={() => openEdit(tl)}
                        style={{ borderRadius: '50px', backgroundColor: '#fff3cd', color: '#856404', border: 'none', padding: '4px 14px', fontSize: '0.8rem' }}>
                        <i className="bi bi-pencil-fill me-1"></i>Sửa
                      </button>
                      <button className="btn btn-sm" onClick={() => setDeleteTarget(tl)}
                        style={{ borderRadius: '50px', backgroundColor: 'rgba(220,53,69,0.1)', color: '#dc3545', border: 'none', padding: '4px 14px', fontSize: '0.8rem' }}>
                        <i className="bi bi-trash-fill me-1"></i>Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CategoryModal
        show={showModal}
        editTarget={editTarget}
        onClose={closeModal}
        onSave={handleSave}
      />

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

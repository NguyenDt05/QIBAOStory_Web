function ConfirmDeleteModal({ show, title = 'Bạn chắc chắn muốn xóa?', message, onCancel, onConfirm }) {
  if (!show) return null;

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
      onClick={e => e.target === e.currentTarget && onCancel()}
    >
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '380px' }}>
        <div
          className="modal-content"
          style={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}
        >
          <div className="modal-body text-center px-4 pt-4 pb-2">
            <div className="mb-3" style={{ fontSize: '2.5rem', color: 'var(--accent)' }}>
              <i className="bi bi-exclamation-triangle" />
            </div>
            <h6 className="fw-bold">{title}</h6>
            <p className="text-muted small mb-0">
              {message || 'Thao tác này không thể hoàn tác.'}
            </p>
          </div>
          <div className="modal-footer border-0 px-4 pb-4 pt-3 gap-2 justify-content-center">
            <button
              className="btn fw-semibold"
              onClick={onCancel}
              style={{
                borderRadius: '50px',
                backgroundColor: 'rgba(255,255,255,0.06)',
                color: '#c9d1d9',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '7px 24px',
              }}
            >
              Hủy
            </button>
            <button
              className="btn fw-bold"
              onClick={onConfirm}
              style={{
                borderRadius: '50px',
                backgroundColor: 'var(--accent)',
                color: '#fff',
                padding: '7px 24px',
              }}
            >
              <i className="bi bi-trash me-1" />Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;

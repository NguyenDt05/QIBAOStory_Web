import '../../styles/AuthBanner.css';

function AuthBanner() {
  return (
    <div className="auth-banner d-none d-md-flex flex-column justify-content-center align-items-center">
      <div className="text-center">
        <div className="auth-banner-icon mb-4">
          <i className="bi bi-book-half" />
        </div>
        <h1 className="auth-banner-title fw-bold mb-3">QIBAO</h1>
        <p className="auth-banner-desc mb-4">
          Chào mừng đến với vũ trụ tiểu thuyết QIBAO — nơi hàng nghìn câu chuyện đang chờ bạn khám phá và quản lý.
        </p>
        <div className="auth-banner-icons d-flex gap-3 justify-content-center">
          <i className="bi bi-stars" />
          <i className="bi bi-journal-richtext" />
          <i className="bi bi-bookmarks" />
        </div>
      </div>
    </div>
  );
}

export default AuthBanner;

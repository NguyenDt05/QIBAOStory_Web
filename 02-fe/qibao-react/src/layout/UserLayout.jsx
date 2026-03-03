import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';

function UserLayout() {
  return (
    <div>
      <Navbar />

      <div>
        <Outlet />

        <footer style={{ backgroundColor: '#0d0f18', color: '#c9d1d9', padding: '48px 0 24px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="container-lg px-4 px-lg-5">
            <div className="row g-5 mb-4">
              <div className="col-12 col-md-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <i className="bi bi-book-half fs-4 text-danger"></i>
                  <span className="fw-bold fs-5" style={{ color: '#fff', letterSpacing: '1px' }}>QIBAO</span>
                </div>
                <p className="mb-0" style={{ fontSize: '0.82rem', lineHeight: 1.7, color: '#8892a4' }}>
                  QiBao là trang web lưu trữ, miễn phí đọc truyện chữ được convert bởi các hội nhóm
                  converter và dịch giả đóng góp, cập nhật đủ các thể loại tiên hiệp, kiếm hiệp,
                  ngôn tình và nhiều thể loại khác.
                </p>
              </div>
              <div className="col-6 col-md-2">
                <h6 className="fw-bold mb-3" style={{ color: '#fff', fontSize: '0.875rem' }}>Giới Thiệu &amp; Liên Hệ</h6>
                <ul className="list-unstyled mb-0" style={{ fontSize: '0.82rem' }}>
                  {['Phản hồi ý kiến', 'Chính Sách Bảo Mật'].map(t => (
                    <li key={t} className="mb-2">
                      <a href="#" className="text-decoration-none" style={{ color: '#c4a882' }}
                        onMouseEnter={e => e.target.style.color = '#fff'}
                        onMouseLeave={e => e.target.style.color = '#c4a882'}>{t}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-6 col-md-2">
                <h6 className="fw-bold mb-3" style={{ color: '#fff', fontSize: '0.875rem' }}>Truyện</h6>
                <ul className="list-unstyled mb-0" style={{ fontSize: '0.82rem' }}>
                  {['Truyện mới', 'Hoàn thành', 'Đang ra', 'Tạm ngưng'].map(t => (
                    <li key={t} className="mb-2">
                      <a href="#" className="text-decoration-none" style={{ color: '#c4a882' }}
                        onMouseEnter={e => e.target.style.color = '#fff'}
                        onMouseLeave={e => e.target.style.color = '#c4a882'}>{t}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-6 col-md-2">
                <h6 className="fw-bold mb-3" style={{ color: '#fff', fontSize: '0.875rem' }}>Thể loại</h6>
                <ul className="list-unstyled mb-0" style={{ fontSize: '0.82rem' }}>
                  {['Tiên Hiệp', 'Ngôn Tình', 'Kiếm Hiệp', 'Huyền Ảo', 'Xuyên Không'].map(t => (
                    <li key={t} className="mb-2">
                      <a href="#" className="text-decoration-none" style={{ color: '#c4a882' }}
                        onMouseEnter={e => e.target.style.color = '#fff'}
                        onMouseLeave={e => e.target.style.color = '#c4a882'}>{t}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-6 col-md-2">
                <h6 className="fw-bold mb-3" style={{ color: '#fff', fontSize: '0.875rem' }}>Trang chủ</h6>
                <ul className="list-unstyled mb-0" style={{ fontSize: '0.82rem' }}>
                  {['Trang chủ', 'Đề cử', 'Mới cập nhật', 'Mới hoàn thành'].map(t => (
                    <li key={t} className="mb-2">
                      <a href="#" className="text-decoration-none" style={{ color: '#c4a882' }}
                        onMouseEnter={e => e.target.style.color = '#fff'}
                        onMouseLeave={e => e.target.style.color = '#c4a882'}>{t}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', fontSize: '0.78rem', color: '#4a5568' }}>
              {`© ${new Date().getFullYear()} QIBAO — Hệ thống quản lý và đọc truyện trực tuyến`}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default UserLayout;
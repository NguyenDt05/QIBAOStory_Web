import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#e2e8f0',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <div style={{ fontSize: '6rem', fontWeight: 900, color: 'var(--accent)', lineHeight: 1 }}>
        404
      </div>
      <h2 style={{ fontWeight: 700, marginTop: '1rem', marginBottom: '0.5rem' }}>
        Trang không tồn tại
      </h2>
      <p style={{ color: '#8892a4', marginBottom: '2rem', fontSize: '0.95rem' }}>
        Đường link bạn truy cập không đúng hoặc đã bị xóa.
      </p>
      <Link
        to="/home"
        className="btn fw-semibold"
        style={{
          borderRadius: '50px',
          backgroundColor: 'var(--accent)',
          color: '#fff',
          padding: '8px 28px',
          textDecoration: 'none',
        }}
      >
        <i className="bi bi-house-door me-2" />
        Về trang chủ
      </Link>
    </div>
  );
}

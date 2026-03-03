function Footer() {
  return (
    <footer className="py-3 text-center small" style={{ backgroundColor: '#0d0f18', borderTop: '1px solid rgba(255,255,255,0.07)', color: '#4a5568' }}>
      © {new Date().getFullYear()} QIBAO &mdash; Hệ thống quản lý truyện
    </footer>
  );
}

export default Footer;

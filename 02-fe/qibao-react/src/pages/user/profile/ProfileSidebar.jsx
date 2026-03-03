import Avatar from '../../../components/common/Avatar';

const NAV_ITEMS = [
  { key: 'personal', icon: 'bi-person-circle',    label: 'Hồ sơ của tôi' },
  { key: 'library',  icon: 'bi-bookmarks-fill',   label: 'Tủ truyện' },
  { key: 'password', icon: 'bi-shield-lock-fill', label: 'Đổi mật khẩu' },
];

export default function ProfileSidebar({ currentUser, activeTab, onTabChange, onLogout }) {
  const name = currentUser?.tenhienthi || currentUser?.username || '?';

  return (
    <aside className="ho-so-sidebar">
      <div className="sidebar-avatar">
        <Avatar tenhienthi={name} avatar={currentUser?.avatar} size={72} className="sidebar-avatar__circle" />
        <span className="sidebar-avatar__ten">{name}</span>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ key, icon, label }) => (
          <button
            key={key}
            className={`sidebar-nav__item${activeTab === key ? ' active' : ''}`}
            onClick={() => onTabChange(key)}
          >
            <i className={`bi ${icon}`}></i>
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <button className="sidebar-dang-xuat" onClick={onLogout}>
        <i className="bi bi-box-arrow-right"></i>
        <span>Đăng xuất</span>
      </button>
    </aside>
  );
}

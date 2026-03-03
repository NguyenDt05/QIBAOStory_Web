import { getAvatarColor } from '../../../utils/helpers';

const NAV_ITEMS = [
  { key: 'personal', icon: 'bi-person-circle',    label: 'Hồ sơ của tôi' },
  { key: 'library',  icon: 'bi-bookmarks-fill',   label: 'Tủ truyện' },
  { key: 'password', icon: 'bi-shield-lock-fill', label: 'Đổi mật khẩu' },
];

export default function ProfileSidebar({ currentUser, activeTab, onTabChange, onLogout }) {
  const name = currentUser?.tenhienthi || currentUser?.username || '?';
  const color = getAvatarColor(name);

  return (
    <aside className="ho-so-sidebar">
      <div className="sidebar-avatar">
        <div className="sidebar-avatar__circle" style={{ backgroundColor: color }}>
          {name.charAt(0).toUpperCase()}
        </div>
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

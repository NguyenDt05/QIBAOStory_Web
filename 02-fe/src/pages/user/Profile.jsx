import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { getProfile } from '../../api/userService';
import { useAuth } from '../../context/AuthContext';
import ProfileSidebar from './profile/ProfileSidebar';
import PersonalInfo from './profile/PersonalInfo';
import ReadingHistory from './profile/ReadingHistory';
import Library from './profile/Library';
import ChangePassword from './profile/ChangePassword';
import '../../styles/Profile.css';

const TABS = { PERSONAL: 'personal', LIBRARY: 'library', PASSWORD: 'password' };

export default function Profile() {
  const { currentUser, login, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab]   = useState(TABS.PERSONAL);
  const [tenhienthi, setTenhienthi] = useState(currentUser?.tenhienthi ?? '');
  const [avatar, setAvatar]         = useState(currentUser?.avatar ?? null);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Tự động đồng bộ data mới nhất từ Backend khi vào trang Profile
  useEffect(() => {
    async function syncProfile() {
      try {
        const latestProfile = await getProfile(currentUser.userid);
        if (latestProfile) {
          // Chỉ cần cập nhật context, các child components sẽ tự re-render với data mới
          login({ ...currentUser, ...latestProfile });
        }
      } catch (err) {
        console.error('Không thể đồng bộ profile:', err);
      }
    }
    syncProfile();
  }, [currentUser.userid]); // Chỉ chạy 1 lần khi vô trang profile của user này

  const handleSaveName = (newName) => {
    setTenhienthi(newName);
    login({ ...currentUser, tenhienthi: newName });
  };

  const handleSaveAvatar = (dataUrl) => {
    setAvatar(dataUrl);
    login({ ...currentUser, tenhienthi, avatar: dataUrl });
  };

  const handleLogout = () => {
    logout();
    navigate('/home', { replace: true });
  };

  const user = { ...currentUser, tenhienthi, avatar };

  return (
    <div className="trang-ho-so">
      <div className="container-lg px-3 px-lg-5 py-5">
        <div className="ho-so-grid">

          <ProfileSidebar
            currentUser={user}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onLogout={handleLogout}
          />

          <div className="ho-so-main">
            {activeTab === TABS.PERSONAL && (
              <>
                <PersonalInfo currentUser={user} onSaveName={handleSaveName} onSaveAvatar={handleSaveAvatar} />
                <ReadingHistory />
              </>
            )}

            {activeTab === TABS.LIBRARY && <Library />}

            {activeTab === TABS.PASSWORD && <ChangePassword />}
          </div>

        </div>
      </div>
    </div>
  );
}

import { useState, useRef } from 'react';
import Avatar from '../../../components/common/Avatar';
import { getRoleLabel } from '../../../constants/roles';
import { updateProfile } from '../../../api/userService';
import { useAuth } from '../../../context/AuthContext';

export default function PersonalInfo({ currentUser, onSaveName, onSaveAvatar }) {
  const name  = currentUser?.tenhienthi || '';
  const { login: updateContext } = useAuth();

  const [isEditing,  setIsEditing]  = useState(false);
  const [nameBuffer, setNameBuffer] = useState(name);
  const [isSaving,   setIsSaving]   = useState(false);
  const [saveError,  setSaveError]  = useState('');
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result;
      try {
        await updateProfile(currentUser.userid, { tenhienthi: name, avatar: dataUrl });
        onSaveAvatar?.(dataUrl);
        updateContext({ ...currentUser, tenhienthi: name, avatar: dataUrl });
      } catch (err) {
        setSaveError('Lỗi khi lưu ảnh đại diện');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const startEdit = () => {
    setNameBuffer(name);
    setIsEditing(true);
    setSaveError('');
  };

  const saveName = async () => {
    const trimmed = nameBuffer.trim();
    if (!trimmed) return;
    if (trimmed === name) { setIsEditing(false); return; }

    setIsSaving(true);
    setSaveError('');
    try {
      await updateProfile(currentUser.userid, { tenhienthi: trimmed, avatar: currentUser.avatar });
      onSaveName?.(trimmed);
      updateContext({ ...currentUser, tenhienthi: trimmed });
    } catch (err) {
      setSaveError('Lỗi khi lưu tên hiển thị');
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setNameBuffer(name);
    setSaveError('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter')  saveName();
    if (e.key === 'Escape') cancelEdit();
  };

  return (
    <div className="ho-so-panel mb-3">
      <div className="ho-so-panel__tieu-de">CÁ NHÂN</div>

      {saveError && (
        <div className="alert alert-danger py-2 px-3 mb-3" style={{ fontSize: '0.85rem' }}>
          <i className="bi bi-exclamation-triangle me-2" />{saveError}
        </div>
      )}

      <div className="thong-tin-ca-nhan">
        <div className="ttcn-avatar" onClick={handleAvatarClick} title="Đổi ảnh đại diện" style={{ position: 'relative' }}>
          <Avatar
            tenhienthi={name || currentUser?.username || '?'}
            avatar={currentUser?.avatar}
            size={100}
            style={{ cursor: 'pointer' }}
          />
          <div className="ttcn-avatar__camera">
            <i className="bi bi-camera-fill"></i>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
        </div>

        <div className="ttcn-info">
          <div className="ttcn-info__ten-hang">
            {isEditing ? (
              <div className="ttcn-edit-hang">
                <input
                  className="ttcn-edit-input"
                  value={nameBuffer}
                  onChange={e => setNameBuffer(e.target.value)}
                  onKeyDown={handleKeyDown}
                  maxLength={40}
                  autoFocus
                  disabled={isSaving}
                />
                <button className="ttcn-btn-luu" onClick={saveName} disabled={isSaving}>
                  {isSaving ? <span className="spinner-border spinner-border-sm" /> : 'Lưu'}
                </button>
                <button className="ttcn-btn-huy" onClick={cancelEdit} disabled={isSaving}>Huỷ</button>
              </div>
            ) : (
              <>
                <h4 className="ttcn-info__ten">{name || '(chưa đặt tên)'}</h4>
                <button className="ttcn-edit-icon" onClick={startEdit} title="Sửa tên hiển thị">
                  <i className="bi bi-pencil-square"></i>
                </button>
              </>
            )}
          </div>

          <p className="ttcn-info__username">
            <i className="bi bi-at"></i>
            <span>Username: {currentUser?.username}</span>
          </p>

          <p className="ttcn-info__role">
            <i className="bi bi-person-check-fill"></i>
            <span>{getRoleLabel(currentUser?.role)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

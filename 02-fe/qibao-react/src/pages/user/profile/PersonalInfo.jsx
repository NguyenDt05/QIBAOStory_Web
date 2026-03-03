import { useState } from 'react';
import { getAvatarColor } from '../../../utils/helpers';
import { getRoleLabel } from '../../../constants/roles';

export default function PersonalInfo({ currentUser, onSaveName }) {
  const name  = currentUser?.tenhienthi || '';
  const color = getAvatarColor(name || currentUser?.username || '?');

  const [isEditing, setIsEditing] = useState(false);
  const [nameBuffer, setNameBuffer] = useState(name);

  const startEdit = () => {
    setNameBuffer(name);
    setIsEditing(true);
  };

  const saveName = () => {
    const trimmed = nameBuffer.trim();
    if (trimmed && trimmed !== name) onSaveName(trimmed);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setNameBuffer(name);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter')  saveName();
    if (e.key === 'Escape') cancelEdit();
  };

  return (
    <div className="ho-so-panel mb-3">
      <div className="ho-so-panel__tieu-de">CÁ NHÂN</div>

      <div className="thong-tin-ca-nhan">
        <div className="ttcn-avatar" style={{ backgroundColor: color }}>
          {(name || currentUser?.username || '?').charAt(0).toUpperCase()}
          <div className="ttcn-avatar__camera">
            <i className="bi bi-camera-fill"></i>
          </div>
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
                />
                <button className="ttcn-btn-luu" onClick={saveName}>Lưu</button>
                <button className="ttcn-btn-huy" onClick={cancelEdit}>Huỷ</button>
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

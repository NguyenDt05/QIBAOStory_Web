import { getAvatarColor } from '../../utils/helpers';

/**
 * Avatar dùng chung toàn app.
 * - Nếu user có `avatar` (base64 / URL) → hiển thị ảnh
 * - Ngược lại → hiển thị chữ cái đầu trên nền màu
 *
 * Props:
 *   tenhienthi  string   – tên hiển thị (dùng làm fallback & màu nền)
 *   avatar      string   – URL / base64 ảnh (tuỳ chọn)
 *   size        number   – kích thước px (mặc định 40)
 *   className   string   – class ngoài (tuỳ chọn)
 *   style       object   – style ngoài (tuỳ chọn)
 *   onClick     func     – sự kiện click (tuỳ chọn)
 */
export default function Avatar({ tenhienthi = '', avatar, size = 40, className = '', style = {}, onClick }) {
  const color = getAvatarColor(tenhienthi);
  const letter = (tenhienthi || '?').charAt(0).toUpperCase();

  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 700,
        fontSize: size * 0.42,
        flexShrink: 0,
        overflow: 'hidden',
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {avatar
        ? <img src={avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
        : letter
      }
    </div>
  );
}

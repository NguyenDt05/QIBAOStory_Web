import { COVER_GRADIENTS } from '../../constants/mockData';
import { getCoverGradientIndex } from '../../utils/helpers';

/**
 * StoryCover - component ảnh bìa truyện dùng chung toàn app.
 * - Nếu có `cover` (URL / path)  → hiển thị ảnh
 * - Ngược lại → gradient màu + ký tự đầu của tiêu đề (hoặc fallback icon)
 *
 * Props:
 *   cover       string   – đường dẫn ảnh bìa (tuỳ chọn)
 *   title       string   – tên truyện (dùng cho alt & fallback letter)
 *   storyid     string   – dùng để chọn gradient nhất quán theo id
 *   className   string   – class ngoài (tuỳ chọn)
 *   style       object   – style ngoài: thường dùng để set width/height/borderRadius
 *   iconFallback bool    – true → fallback là biểu tượng sách thay vì ký tự
 *   imgStyle    object   – style override cho thẻ <img> bên trong
 */
export default function StoryCover({
  cover,
  title = '',
  storyid = '',
  className = '',
  style = {},
  iconFallback = false,
  imgStyle = {},
}) {
  const gradient = COVER_GRADIENTS[getCoverGradientIndex(storyid)];

  return (
    <div
      className={className}
      style={{
        background: gradient,
        overflow: 'hidden',
        position: 'relative',
        ...style,
      }}
    >
      {cover ? (
        <img
          src={cover}
          alt={title}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            ...imgStyle,
          }}
        />
      ) : iconFallback ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <i className="bi bi-book-half text-white" style={{ fontSize: '1.6rem', opacity: 0.7 }} />
        </div>
      ) : (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 700, fontSize: '1.4rem', textAlign: 'center', padding: '0 8px', lineHeight: 1.2 }}>
            {title.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
}

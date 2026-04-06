import { COVER_GRADIENTS } from '../../constants/mockData';
import { getCoverGradientIndex, getImageUrl } from '../../utils/helpers';

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
          src={getImageUrl(cover)}
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

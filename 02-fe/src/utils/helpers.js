export const AVATAR_COLORS = [
  '#e05252', '#e07b52', '#d4a017', '#5b8cde', '#6abf69',
  '#ab7ae0', '#4fc3c3', '#e05290', '#7e8c8d', '#2980b9',
];

export function getAvatarColor(name = '') {
  return AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length];
}

export function getRelativeTime(input) {
  if (!input) return '';

  let ts;
  if (typeof input === 'number') {
    ts = input;
  } else if (typeof input === 'string') {
    const d = new Date(input);
    if (!isNaN(d.getTime())) {
      ts = d.getTime();
    } else {
      try {
        const [datePart, timePart] = input.split(' ');
        const [dPart, mPart, yPart] = datePart.split('/');
        const [hh, mm] = (timePart ?? '00:00').split(':');
        ts = new Date(yPart, mPart - 1, dPart, hh, mm).getTime();
      } catch {
        return input;
      }
    }
  } else {
    return String(input);
  }

  const diff = Math.max(0, Date.now() - ts) / 1000;
  if (diff < 60)          return `${Math.floor(diff)} giây trước`;
  if (diff < 3600)        return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400)       return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 86400 * 30)  return `${Math.floor(diff / 86400)} ngày trước`;
  if (diff < 86400 * 365) return `${Math.floor(diff / (86400 * 30))} tháng trước`;
  return `${Math.floor(diff / (86400 * 365))} năm trước`;
}

export function getCoverGradientIndex(storyid = '') {
  const total = 10;
  const sum = String(storyid).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return sum % total;
}

export const BASE_URL = 'http://localhost:8080';

export function getImageUrl(path) {
  if (!path) return null;
  if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) return path;
  if (path.startsWith('/')) return `${BASE_URL}${path}`;
  return `${BASE_URL}/${path}`;
}

const parseDateSafe = (input) => {
  if (!input) return null;
  let ts;
  if (typeof input === 'number') {
    ts = new Date(input);
  } else if (typeof input === 'string') {
    ts = new Date(input);
    if (isNaN(ts.getTime())) {
      try {
        const [datePart, timePart] = input.split(' ');
        const [dPart, mPart, yPart] = datePart.split(/[-/]/);
        const [hh, mm, ss] = (timePart ?? '00:00:00').split(':');
        // Check if it's DD-MM-YYYY or YYYY-MM-DD
        if (yPart && yPart.length === 4) {
          ts = new Date(yPart, mPart - 1, dPart, hh, mm, ss || 0);
        } else if (dPart && dPart.length === 4) {
          ts = new Date(dPart, mPart - 1, yPart, hh, mm, ss || 0);
        }
      } catch {
        return null;
      }
    }
  } else if (input instanceof Date) {
    ts = input;
  }
  return (ts && !isNaN(ts.getTime())) ? ts : null;
};

export function formatDate(input) {
  const d = parseDateSafe(input);
  if (!d) return '—';
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatDateTime(input) {
  const d = parseDateSafe(input);
  if (!d) return '—';
  return d.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

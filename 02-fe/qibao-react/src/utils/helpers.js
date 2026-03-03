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
    try {
      const [datePart, timePart] = input.split(' ');
      const [d, m, y] = datePart.split('/');
      const [hh, mm] = (timePart ?? '00:00').split(':');
      ts = new Date(y, m - 1, d, hh, mm).getTime();
    } catch {
      return input;
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

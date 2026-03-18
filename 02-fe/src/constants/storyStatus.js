export const STORY_STATUS = {
  dang_ra: {
    value: 'dang_ra',
    label: 'Đang ra',
    bgColor: '#e3f2fd',
    textColor: '#1565c0',
    bg: '#e3f2fd',
    color: '#1565c0',
  },
  hoan_thanh: {
    value: 'hoan_thanh',
    label: 'Hoàn thành',
    bgColor: '#e8f5e9',
    textColor: '#2e7d32',
    bg: '#e8f5e9',
    color: '#2e7d32',
  },
  tam_ngung: {
    value: 'tam_ngung',
    label: 'Tạm ngưng',
    bgColor: '#ffebee',
    textColor: '#c62828',
    bg: '#ffebee',
    color: '#c62828',
  },
};

export const STORY_STATUS_LIST = Object.values(STORY_STATUS).map(s => ({
  value: s.value,
  label: s.label,
}));

// Map tất cả các dạng giá trị mà DB có thể lưu → entry trong STORY_STATUS
const ALIAS_MAP = {
  // DB variants
  dangra:     STORY_STATUS.dang_ra,
  hoanthanh:  STORY_STATUS.hoan_thanh,
  tamngung:   STORY_STATUS.tam_ngung,
  Full:       STORY_STATUS.hoan_thanh,
  full:       STORY_STATUS.hoan_thanh,
  // Snake_case variants
  dang_ra:    STORY_STATUS.dang_ra,
  hoan_thanh: STORY_STATUS.hoan_thanh,
  tam_ngung:  STORY_STATUS.tam_ngung,
  // Camel case variants
  dangRa:     STORY_STATUS.dang_ra,
  hoanThanh:  STORY_STATUS.hoan_thanh,
  tamNgung:   STORY_STATUS.tam_ngung,
};

/**
 * Lấy thông tin style trạng thái truyện từ bất kỳ dạng key nào:
 * 'dangra', 'hoanthanh', 'tamngung', 'Full', 'dang_ra', ...
 * Fallback về "Đang ra" nếu không nhận dạng được.
 */
export function getStatusStyle(value) {
  if (!value) return STORY_STATUS.dang_ra;
  return (
    ALIAS_MAP[value] ??
    ALIAS_MAP[String(value).toLowerCase().replace(/[_\s-]/g, '')] ??
    STORY_STATUS.dang_ra
  );
}
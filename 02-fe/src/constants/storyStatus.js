export const STORY_STATUS = {
  dang_ra: {
    value: 'dang_ra',
    label: 'Đang ra',
    bgColor: '#e3f2fd',
    textColor: '#1565c0',
  },
  hoan_thanh: {
    value: 'hoan_thanh',
    label: 'Hoàn thành',
    bgColor: '#e8f5e9',
    textColor: '#2e7d32',
  },
  tam_ngung: {
    value: 'tam_ngung',
    label: 'Tạm ngưng',
    bgColor: '#ffebee',
    textColor: '#c62828',
  },
};

export const STORY_STATUS_LIST = Object.values(STORY_STATUS).map(s => ({
  value: s.value,
  label: s.label,
}));

export function getStatusStyle(value) {
  return STORY_STATUS[value] ?? STORY_STATUS.dang_ra;
}
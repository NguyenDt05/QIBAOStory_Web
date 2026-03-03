export const STORY_STATUS = {
  dangra: {
    value: 'dangra',
    label: 'Đang ra',
    bgColor: '#e3f2fd',
    textColor: '#1565c0',
  },
  tamngung: {
    value: 'tamngung',
    label: 'Tạm ngưng',
    bgColor: '#fff8e1',
    textColor: '#f57f17',
  },
  hoanthanh: {
    value: 'hoanthanh',
    label: 'Hoàn thành',
    bgColor: '#e8f5e9',
    textColor: '#2e7d32',
  },
};

export const STORY_STATUS_LIST = Object.values(STORY_STATUS).map(s => ({
  value: s.value,
  label: s.label,
}));

export function getStatusStyle(value) {
  return STORY_STATUS[value] ?? STORY_STATUS.dangra;
}

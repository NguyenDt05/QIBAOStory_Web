const PALETTE = [
  { bgColor: '#ffebee', textColor: '#c62828' },
  { bgColor: '#fce4ec', textColor: '#ad1457' },
  { bgColor: '#f3e5f5', textColor: '#6a1b9a' },
  { bgColor: '#e8eaf6', textColor: '#283593' },
  { bgColor: '#e3f2fd', textColor: '#1565c0' },
  { bgColor: '#e0f2f1', textColor: '#00695c' },
  { bgColor: '#e8f5e9', textColor: '#2e7d32' },
  { bgColor: '#fffde7', textColor: '#f57f17' },
  { bgColor: '#fff3e0', textColor: '#e65100' },
  { bgColor: '#efebe9', textColor: '#4e342e' },
  { bgColor: '#fafafa', textColor: '#37474f' },
  { bgColor: '#ede7f6', textColor: '#4527a0' },
];

function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) >>> 0;
  return h;
}

export const CATEGORIES_LIST = [
  { categoryID: 1,  categoryname: 'Tiên Hiệp',   slug: 'tienhiep' },
  { categoryID: 2,  categoryname: 'Ngôn Tình',   slug: 'ngontinh' },
  { categoryID: 3,  categoryname: 'Kiếm Hiệp',   slug: 'kiemhiep' },
  { categoryID: 4,  categoryname: 'Huyền Ảo',    slug: 'huanyen' },
  { categoryID: 5,  categoryname: 'Xuyên Không', slug: 'xuyenkhong' },
  { categoryID: 6,  categoryname: 'Tình Cảm',    slug: 'tinhcam' },
  { categoryID: 7,  categoryname: 'Cổ Đại',      slug: 'codai' },
  { categoryID: 8,  categoryname: 'Lịch Sử',     slug: 'lichsu' },
  { categoryID: 9,  categoryname: 'Hài Hước',    slug: 'haihuoc' },
  { categoryID: 10, categoryname: 'Kinh Dị',     slug: 'kinhdi' },
];

export function getCategoryStyle(slug = '') {
  return PALETTE[hashStr(slug) % PALETTE.length];
}

export const CATEGORIES_OPTIONS = CATEGORIES_LIST.map(c => ({
  value: c.slug,
  label: c.categoryname,
}));

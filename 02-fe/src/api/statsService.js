import { delay } from './http';

const STATS_MOCK = [
  { title: 'Đầu sách',   count: '1,212', description: 'Tổng số truyện hiện có',   icon: 'bi-book',       link: '/admin/stories',    bgColor: 'rgba(224,82,82,0.1)',  textColor: 'var(--accent)' },
  { title: 'Thể loại',   count: '12',    description: 'Danh mục phân loại',        icon: 'bi-tags',       link: '/admin/categories',  bgColor: 'rgba(230,81,0,0.1)',   textColor: '#e65100' },
  { title: 'Người dùng', count: '648',   description: 'Thành viên đã đăng ký',     icon: 'bi-people',     link: '/admin/users',        bgColor: 'rgba(21,101,192,0.1)', textColor: '#1565c0' },
  { title: 'Bình luận',  count: '9,264', description: 'Tương tác từ độc giả',      icon: 'bi-chat-dots',  link: '/admin/comments',     bgColor: 'rgba(46,125,50,0.1)',  textColor: '#2e7d32' },
];

export async function getDashboardStats() {
  await delay();
  return [...STATS_MOCK];
}

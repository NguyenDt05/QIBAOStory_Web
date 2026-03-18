const db = require('../config/db');

/** GET /api/stats/dashboard */
async function getDashboard(req, res, next) {
  try {
    const [[storyRow], [catRow], [userRow], [cmtRow]] = await Promise.all([
      db.query('SELECT COUNT(*) AS cnt FROM stories'),
      db.query('SELECT COUNT(*) AS cnt FROM category'),
      db.query('SELECT COUNT(*) AS cnt FROM users'),
      db.query('SELECT COUNT(*) AS cnt FROM comments'),
    ]);

    res.json({
      success: true,
      data: [
        { title: 'Đầu sách',   count: storyRow[0].cnt, description: 'Tổng số truyện hiện có',  icon: 'bi-book',      link: '/admin/stories',    bgColor: 'rgba(224,82,82,0.1)',  textColor: 'var(--accent)' },
        { title: 'Thể loại',   count: catRow[0].cnt,   description: 'Danh mục phân loại',        icon: 'bi-tags',      link: '/admin/categories',  bgColor: 'rgba(230,81,0,0.1)',   textColor: '#e65100' },
        { title: 'Người dùng', count: userRow[0].cnt,  description: 'Thành viên đã đăng ký',     icon: 'bi-people',    link: '/admin/users',        bgColor: 'rgba(21,101,192,0.1)', textColor: '#1565c0' },
        { title: 'Bình luận',  count: cmtRow[0].cnt,   description: 'Tương tác từ độc giả',      icon: 'bi-chat-dots', link: '/admin/comments',     bgColor: 'rgba(46,125,50,0.1)',  textColor: '#2e7d32' },
      ],
    });
  } catch (err) { next(err); }
}

module.exports = { getDashboard };

/** GET /api/stats/dashboard */
async function getDashboard(req, res, next) {
  try {
    // TODO: đếm stories, categories, users, comments từ DB
    res.json({
      success: true,
      data: [
        { title: 'Đầu sách',   count: 0, icon: 'bi-book',      link: '/admin/stories'    },
        { title: 'Thể loại',   count: 0, icon: 'bi-tags',      link: '/admin/categories' },
        { title: 'Người dùng', count: 0, icon: 'bi-people',    link: '/admin/users'      },
        { title: 'Bình luận',  count: 0, icon: 'bi-chat-dots', link: '/admin/comments'   },
      ],
    });
  } catch (err) { next(err); }
}

module.exports = { getDashboard };

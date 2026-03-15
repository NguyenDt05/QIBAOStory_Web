const db = require('../config/db');

const Story = {
  /** Lấy danh sách (Admin lấy hết, User chỉ lấy status=1) */
  async getAll({ visibleOnly = false } = {}) {
    const where = visibleOnly ? 'WHERE s.status = 1' : '';
    const [rows] = await db.query(
      `SELECT s.storyid, s.title, s.author, s.image, s.storyCount,
              s.status, s.trangthai_rachuong, s.createdat,
              GROUP_CONCAT(DISTINCT c.categoryname) AS categories
       FROM stories s
       LEFT JOIN story_category sc ON sc.storyid = s.storyid
       LEFT JOIN category c ON c.categoryid = sc.categoryid
       ${where}
       GROUP BY s.storyid
       ORDER BY s.createdat DESC`
    );
    // Chuyển chuỗi categories thành mảng
    return rows.map(row => ({
      ...row,
      categories: row.categories ? row.categories.split(',') : []
    }));
  },

  /** VIEW USER: Chỉ lấy thông tin public, lọc status = 1 */
  async getDetailForUser(storyid) {
    const [rows] = await db.query(
      `SELECT s.storyid, s.title, s.author, s.image, s.description, 
              s.storyCount, s.trangthai_rachuong, s.createdat,
              GROUP_CONCAT(DISTINCT c.categoryname) AS categories
       FROM stories s 
       LEFT JOIN story_category sc ON sc.storyid = s.storyid
       LEFT JOIN category c ON c.categoryid = sc.categoryid
       WHERE s.storyid = ? AND s.status = 1
       GROUP BY s.storyid`,
      [storyid]
    );
    if (!rows[0]) return null;
    return {
      ...rows[0],
      categories: rows[0].categories ? rows[0].categories.split(',') : []
    };
  },

  /** VIEW ADMIN: Lấy s.* để đổ dữ liệu vào Form Edit */
  async getDetailForAdmin(storyid) {
    const [rows] = await db.query(
      `SELECT s.*, GROUP_CONCAT(DISTINCT c.categoryname) AS categories
       FROM stories s 
       LEFT JOIN story_category sc ON sc.storyid = s.storyid
       LEFT JOIN category c ON c.categoryid = sc.categoryid
       WHERE s.storyid = ?
       GROUP BY s.storyid`,
      [storyid]
    );
    if (!rows[0]) return null;
    return {
      ...rows[0],
      categories: rows[0].categories ? rows[0].categories.split(',') : []
    };
  },

  // Các hàm create, update, remove, toggleVisibility giữ nguyên như bạn đã viết 
  // vì logic SQL đã rất chuẩn rồi.
  async create(data) {
    const [result] = await db.query(
      `INSERT INTO stories (title, author, description, image, trangthai_rachuong, storyCount, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [data.title, data.author, data.description, data.image, data.trangthai_rachuong, data.storyCount, data.status || 1]
    );
    return result.insertId;
  },

  async update(storyid, data) {
    await db.query(
      `UPDATE stories SET title = ?, author = ?, description = ?, image = ?, trangthai_rachuong = ?, storyCount = ?, status = ?
       WHERE storyid = ?`,
      [data.title, data.author, data.description, data.image, data.trangthai_rachuong, data.storyCount, data.status, storyid]
    );
  },

  async remove(storyid) {
    await db.query(`DELETE FROM stories WHERE storyid = ?`, [storyid]);
  },

  async toggleVisibility(storyid) {
    await db.query(`UPDATE stories SET status = 1 - status WHERE storyid = ?`, [storyid]);
  }
};

module.exports = Story;
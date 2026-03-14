const db = require('../config/db');

const Story = {
  /** Lấy tất cả truyện (tuỳ chọn lọc visible) */
  async getAll({ visibleOnly = false } = {}) {
    const where = visibleOnly ? 'WHERE s.status = 1' : '';
    const [rows] = await db.query(
      `SELECT s.storyid, s.title, s.author, s.image, s.description,
              s.status, s.trangthai_rachuong, s.createdat,
              GROUP_CONCAT(c.categoryname) AS categories
      FROM stories s
      LEFT JOIN story_category sc ON sc.storyid = s.storyid
      LEFT JOIN category c ON c.categoryid = sc.categoryid
      ${where}
      GROUP BY s.storyid
      ORDER BY s.createdat DESC
      `,
    );
    return rows;
  },  

  /** Lấy 1 truyện theo storyid */
  async getById(storyid) {
    const [rows] = await db.query(
      `SELECT s.storyid, s.title, s.author, s.image, s.createdat, s.status as visible, s.description, s.trangthai_rachuong, group_concat(c.categoryname) as categories
      FROM stories s 
      left join story_category sc on sc.storyid = s.storyid
      left join category c on c.categoryid = sc.categoryid
      WHERE s.storyid = ?
      group by s.storyid
      `,
      [storyid]
    );
    return rows[0];
  },

  /** Tạo truyện mới */
  async create(data) {
    const [result] = await db.query(
      `INSERT INTO stories (title, author, description, image, trangthai_rachuong)
       VALUES (?, ?, ?, ?, ?)`,
      [data.title, data.author, data.description, data.image, data.trangthai_rachuong]
    );
    return result.insertId;
  },

  /** Cập nhật truyện */
  async update(storyid, data) {
    await db.query(
      `UPDATE stories SET title = ?, author = ?, description = ?, image = ?, trangthai_rachuong = ?
       WHERE storyid = ?`,
      [data.title, data.author, data.description, data.image, data.trangthai_rachuong, storyid]
    );
  },

  /** Xoá truyện */
  async remove(storyid) {
    await db.query(`DELETE FROM stories WHERE storyid = ?`, [storyid]);
  },

  /** Đổi trạng thái ẩn/hiện */
  async toggleVisibility(storyid) {
    await db.query(`UPDATE stories SET status = 1 - status WHERE storyid = ?`, [storyid]);
    return this.getAll();
  },
};

module.exports = Story;

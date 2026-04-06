const db = require('../config/db');

const Category = {
  /**
   * Lấy danh sách thể loại kèm số lượng truyện
   * visibleOnly = true: Dùng cho phía User (chỉ hiện cái đang mở)
   * visibleOnly = false: Dùng cho Admin (hiện tất cả)
   */
  async getAll({ visibleOnly = false } = {}) {
    const where = visibleOnly ? 'WHERE c.status = 1' : '';
    const [rows] = await db.query(
      `SELECT c.categoryid AS categoryID, c.categoryname, c.status, COUNT(sc.storyid) as totalStories
       FROM category c 
       LEFT JOIN story_category sc ON sc.categoryid = c.categoryid
       ${where}
       GROUP BY c.categoryid
       ORDER BY c.categoryname ASC`,
    );
    return rows;
  },

  async findByName(name) {
    const [rows] = await db.query('SELECT * FROM category WHERE categoryname = ?', [name]);
    return rows[0] || null;
  },

  async create(data) {
    const [result] = await db.query(
      `INSERT INTO category (categoryname, status) VALUES (?, ?)`,
      [data.categoryname, data.status || 1]
    );
    return result.insertId;
  },

  async update(categoryID, data) {
    await db.query(
      'UPDATE category SET categoryname = ?, status = ? WHERE categoryid = ?',
      [data.categoryname, data.status, categoryID]
    );
  },

  /**
   * XÓA AN TOÀN: Xóa liên kết trước, xóa thể loại sau.
   */
  async remove(categoryID) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Xóa liên kết trong bảng trung gian (Truyện vẫn còn nguyên trong bảng story)
      await connection.query('DELETE FROM story_category WHERE categoryid = ?', [categoryID]);

      // 2. Xóa thể loại
      await connection.query('DELETE FROM category WHERE categoryid = ?', [categoryID]);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async toggleVisibility(categoryID) {
    await db.query('UPDATE category SET status = 1 - status WHERE categoryid = ?', [categoryID]);
    const [rows] = await db.query('SELECT * FROM category WHERE categoryid = ?', [categoryID]);
    return rows[0];
  },
};

module.exports = Category;
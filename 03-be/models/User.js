const db = require('../config/db');

const User = {
  /**
   * Lấy danh sách toàn bộ người dùng (Dùng cho trang Quản lý User của Admin)
   */
  async getAll() { 
     const [rows] = await db.query(
      `SELECT userid, username, tenhienthi, avatar, role, status, createdat 
       FROM users 
       ORDER BY createdat DESC`
     );
     return rows;
  },

  /**
   * Tìm người dùng theo tên đăng nhập (Dùng cho Login và Check trùng)
   */
  async findByUsername(username) { 
    const [rows] = await db.query(
      `SELECT * FROM users WHERE username = ?`, [username]
    );
    return rows[0] ?? null;
  },

  /**
   * Tạo người dùng mới
   * Hỗ trợ nhận role từ body hoặc mặc định là 'user'
   */
  async create(data) { 
    const [result] = await db.query(
      `INSERT INTO users (username, password, tenhienthi, role, status) VALUES (?, ?, ?, ?, ?)`,
      [
        data.username, 
        data.password, 
        data.tenhienthi, 
        data.role || 'user', // Nếu không truyền role, mặc định là user
        1 // status mặc định là 1 (hoạt động)
      ]
    );
    return result.insertId;
  },

  /**
   * Đảo trạng thái hoạt động (Khóa/Mở khóa User)
   */
  async toggleStatus(userid) {
    await db.query(
      `UPDATE users SET status = 1 - status WHERE userid = ?`, [userid]
    );
    return this.getAll(); // Trả về danh sách mới sau khi cập nhật
  },

  /**
   * Xóa vĩnh viễn người dùng
   */
  async remove(userid) {
    await db.query(`DELETE FROM users WHERE userid = ?`, [userid]);
    return this.getAll();
  },

  /**
   * Cập nhật thông tin cá nhân (Tên hiển thị, Avatar)
   */
  async updateProfile(userid, data) {
    await db.query(
      `UPDATE users SET tenhienthi = ?, avatar = ? WHERE userid = ?`, 
      [data.tenhienthi, data.avatar, userid]
    );
  },

  /**
   * Cập nhật mật khẩu mới (Đã hash)
   */
  async updatePassword(userid, hashedPassword) {
    await db.query(
      `UPDATE users SET password = ? WHERE userid = ?`, [hashedPassword, userid]
    );
  },
};

module.exports = User;
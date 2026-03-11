// chứa tất cả câu SQL liên quan đến bảng Users.
const db = require('../config/db');

const User = {
  async getAll() { // dung cho usermanager 
     const [rows] = await db.query(
      `SELECT userid,username, tenhienthi ,avatar ,role ,status ,createdat 
      from users 
      order by createdat desc`
     );
     return rows;
  },

  async getByUsername(username) { // dung cho login
    const [rows] = await db.query(
      ` SELECT* from users where username = ?`, [username]
    )
    return rows[0] ?? null;
  },

  async create(data) { // dung cho register
    const [result]  = await db.query(
      `INSERT INTO users(username, password, tenhienthi) VALUES (?,?,?)`,
      [data.username, data.password, data.tenhienthi]
    )
    return result.insertId;
  },

  async toggleStatus(userid) { // an/ hien user
    await db.query(
      `UPDATE users SET status = 1 - status WHERE userid = ?`, [userid]
    )
    return this.getAll();
  },

  async remove(userid) { // xoa user
    await db.query(
      `DELETE FROM users WHERE userid = ?`, [userid]
      )
      return this.getAll();
  },

  async updateProfile(userid, data) { // sua ten hien thi, avatar
    await db.query(
      `UPDATE users SET tenhienthi = ?, avatar = ? WHERE userid=?`, [data.tenhienthi, data.avatar, userid]
    )
  },

  async updatePassword(userid, hashedPassword) { //doi mat khau
    await db.query(
      `UPDATE users SET password = ? WHERE userid = ?`, [hashedPassword, userid]
    ) 
  },
};

module.exports = User;

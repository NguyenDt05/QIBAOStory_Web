const db = require('../config/db');

const Comment = {
  async getAll() {
    const [rows] = await db.query(
      `SELECT * FROM comments
      ORDER BY created_at DESC
      `,
    );
    return rows;
  },

  async getByStory(storyid) {
    const [rows] = await db.query(`SELECT * FROM comments WHERE storyid= ? AND status = 1 ORDER BY created_at DESC`, [storyid]);
    return rows;
  },

  async create(data) {
  await db.query('INSERT INTO comments (storyid, userid, content) VALUES (?,?,?)', [data.storyid, data.userid, data.content]);
  },

  async toggleVisibility(cmtid) {
    await db.query('UPDATE comments SET status = 1- status WHERE commentid = ?',[cmtid]);
    return this.getAll();
  },

  async remove(cmtid) {
    await db.query('DELETE FROM comments WHERE commentid = ?', [cmtid]);
  },
};

module.exports = Comment;

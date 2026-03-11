const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 3306,
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'qibao_db',
  waitForConnections: true,
  connectionLimit:    10,
});

// Test kết nối khi khởi động
pool.getConnection()
  .then(conn => {
    console.log('✅ Kết nối MySQL thành công!');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Kết nối MySQL thất bại:', err.message);
  });

module.exports = pool;

/**
 * Express error-handling middleware (4 tham số).
 * Đặt cuối cùng trong app.js sau tất cả routes.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
}

module.exports = errorHandler;

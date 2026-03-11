const jwt = require('jsonwebtoken');

/**
 * Xác thực JWT trong header Authorization: Bearer <token>
 */
function authenticate(req, res, next) {
  // TODO: đọc token từ header, verify, gắn req.user
  next();
}

/**
 * Chỉ cho phép role = 'admin'
 */
function requireAdmin(req, res, next) {
  // TODO: kiểm tra req.user.role === 'admin'
  next();
}

module.exports = { authenticate, requireAdmin };

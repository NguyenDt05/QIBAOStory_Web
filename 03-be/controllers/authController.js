const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');

/**
 * POST /api/auth/register
 */
async function register(req, res, next) {
  try {
    const { username, password, tenhienthi } = req.body;
    // TODO: validate, kiểm tra username tồn tại, hash password, tạo user
    res.status(201).json({ success: true, message: 'Đăng ký thành công.' });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 */
async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    // TODO: tìm user, so sánh password, tạo JWT, trả về token + thông tin user
    res.json({ success: true, token: null, user: null });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/check-username/:username
 */
async function checkUsername(req, res, next) {
  try {
    const { username } = req.params;
    // TODO: kiểm tra username đã tồn tại chưa
    res.json({ exists: false });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, checkUsername };

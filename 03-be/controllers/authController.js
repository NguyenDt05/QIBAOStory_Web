// authController.js
// Xử lý đăng ký, đăng nhập và kiểm tra tên tài khoản

const User   = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_here';

/**
 * POST /api/auth/register
 */
async function register(req, res, next) {
  try {
    const { username, password, tenhienthi, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập đủ tài khoản và mật khẩu.' });
    }

    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Tên tài khoản đã tồn tại.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Chấp nhận role từ body (role: 'admin' hoặc 'user')
    await User.create({
      username,
      password: hashedPassword,
      tenhienthi: tenhienthi || username,
      role: role || 'user' 
    });

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

    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Tài khoản không tồn tại.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Mật khẩu không chính xác.' });
    }

    const token = jwt.sign(
      { userid: user.userid, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      token: token,
      user: {
        userid: user.userid,
        username: user.username,
        tenhienthi: user.tenhienthi,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
}

async function checkUsername(req, res, next) {
  try {
    const { username } = req.params;
    const user = await User.findByUsername(username);
    res.json({ exists: !!user });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, checkUsername };
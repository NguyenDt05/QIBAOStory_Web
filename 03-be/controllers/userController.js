const User = require('../models/User');

/** GET /api/users */
async function getAll(req, res, next) {
  try {
    // TODO
    res.json({ success: true, data: [] });
  } catch (err) { next(err); }
}

/** PATCH /api/users/:userid/toggle */
async function toggleStatus(req, res, next) {
  try {
    const { userid } = req.params;
    // TODO
    res.json({ success: true, data: [] });
  } catch (err) { next(err); }
}

/** DELETE /api/users/:userid */
async function remove(req, res, next) {
  try {
    const { userid } = req.params;
    // TODO
    res.json({ success: true });
  } catch (err) { next(err); }
}

/** PUT /api/users/:userid/profile */
async function updateProfile(req, res, next) {
  try {
    const { userid } = req.params;
    // TODO
    res.json({ success: true, data: null });
  } catch (err) { next(err); }
}

/** PUT /api/users/:userid/password */
async function updatePassword(req, res, next) {
  try {
    const { userid } = req.params;
    // TODO: xác thực mật khẩu cũ, hash mật khẩu mới
    res.json({ success: true });
  } catch (err) { next(err); }
}

module.exports = { getAll, toggleStatus, remove, updateProfile, updatePassword };

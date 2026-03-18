const multer = require('multer');
const path   = require('path');

// ── Storage cho ảnh bìa truyện ───────────────────────────────────────────────
const coverStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, 'public/covers'),
  filename:    (_req, file, cb) => {
    const ext      = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, `${basename}-${Date.now()}${ext}`);
  },
});

// ── Storage cho avatar người dùng ────────────────────────────────────────────
const avatarStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, 'public/avatars'),
  filename:    (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${Date.now()}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  if (allowed.test(path.extname(file.originalname).toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận ảnh jpeg/jpg/png/webp'));
  }
};

const upload       = multer({ storage: coverStorage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter });
const uploadAvatar = multer({ storage: avatarStorage, limits: { fileSize: 3 * 1024 * 1024 }, fileFilter });

module.exports = upload;
module.exports.uploadAvatar = uploadAvatar;

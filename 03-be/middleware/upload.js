const multer = require('multer');
const path   = require('path');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, 'public/covers'),
  filename:    (_req, file, cb) => {
    const ext      = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, `${basename}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    if (allowed.test(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận ảnh jpeg/jpg/png/webp'));
    }
  },
});

module.exports = upload;

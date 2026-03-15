const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Route này để authenticate nhưng không chặn khách (để biết ai là admin)
router.get('/', (req, res, next) => {
  // Thử giải mã token nếu có, nếu không có vẫn cho đi tiếp
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    return authenticate(req, res, next);
  }
  next();
}, categoryController.getAll);

// Các route chỉnh sửa bắt buộc phải là Admin
router.post('/', authenticate, requireAdmin, categoryController.create);
router.put('/:id', authenticate, requireAdmin, categoryController.update);
router.patch('/:id/toggle', authenticate, requireAdmin, categoryController.toggle);
router.delete('/:id', authenticate, requireAdmin, categoryController.delete);

module.exports = router;
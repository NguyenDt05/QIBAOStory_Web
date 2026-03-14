const router = require('express').Router();
const ctrl   = require('../controllers/categoryController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/',                                      ctrl.getAll);
router.post('/',          authenticate, requireAdmin, ctrl.create);
router.put('/:categoryID',      authenticate, requireAdmin, ctrl.update);
router.delete('/:categoryID',   authenticate, requireAdmin, ctrl.delete);
router.patch('/:categoryID/toggle', authenticate, requireAdmin, ctrl.toggleStatus);

module.exports = router;

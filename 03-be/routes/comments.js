const router = require('express').Router();
const ctrl   = require('../controllers/commentController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/',                           authenticate, requireAdmin, ctrl.getAll);
router.patch('/:cmtid/toggle',            authenticate, requireAdmin, ctrl.toggleVisibility);
router.delete('/:cmtid',                  authenticate, requireAdmin, ctrl.remove);

module.exports = router;

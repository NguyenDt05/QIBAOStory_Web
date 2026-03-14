const router = require('express').Router();
const ctrl   = require('../controllers/userController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/',                                            authenticate, requireAdmin, ctrl.getAll);
router.patch('/:userid/toggle',                            authenticate, requireAdmin, ctrl.toggleStatus);
router.delete('/:userid',                                  authenticate, requireAdmin, ctrl.delete);
router.put('/:userid/profile',   authenticate,             ctrl.updateProfile);
router.put('/:userid/password',  authenticate,             ctrl.changePassword);

module.exports = router;

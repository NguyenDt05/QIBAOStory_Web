const router = require('express').Router();
const ctrl   = require('../controllers/statsController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/dashboard', authenticate, requireAdmin, ctrl.getDashboard);

module.exports = router;

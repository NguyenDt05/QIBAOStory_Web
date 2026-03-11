const router = require('express').Router();

router.use('/auth',       require('./auth'));
router.use('/stories',    require('./stories'));
router.use('/categories', require('./categories'));
router.use('/users',      require('./users'));
router.use('/comments',   require('./comments'));
router.use('/stats',      require('./stats'));

module.exports = router;

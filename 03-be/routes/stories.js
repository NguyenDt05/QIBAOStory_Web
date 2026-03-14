const router   = require('express').Router();
const ctrl     = require('../controllers/storyController');
const cmtCtrl  = require('../controllers/commentController');
const chapCtrl = require('../controllers/chapterController');
const upload   = require('../middleware/upload');
const { authenticate, requireAdmin } = require('../middleware/auth');

// // ── Public ────────────────────────────────────────────────────────────────────
// router.get('/',                           ctrl.getAll);
// router.get('/:storyid',                   ctrl.getById);
// router.get('/:storyid/detail',            ctrl.getDetail);
// router.get('/:storyid/related',           ctrl.getRelated);

// // Chapters (public read)
// router.get('/:storyid/chapters',                      chapCtrl.getByStory);
// router.get('/:storyid/chapters/:chapterid',           chapCtrl.getById);

// // Comments (public read + write)
// router.get('/:storyid/comments',                      cmtCtrl.getByStory);
// router.post('/:storyid/comments', authenticate,       cmtCtrl.create);

// // ── Admin ─────────────────────────────────────────────────────────────────────
// router.post('/',   authenticate, requireAdmin, upload.single('cover'), ctrl.create);
// router.put('/:storyid',   authenticate, requireAdmin, upload.single('cover'), ctrl.update);
// router.delete('/:storyid',             authenticate, requireAdmin,     ctrl.remove);
// router.patch('/:storyid/toggle',       authenticate, requireAdmin,     ctrl.toggleVisibility);

// // Chapter admin
// router.post('/:storyid/chapters',                         authenticate, requireAdmin, chapCtrl.create);
// router.put('/:storyid/chapters/:chapterid',               authenticate, requireAdmin, chapCtrl.update);
// router.delete('/:storyid/chapters/:chapterid',            authenticate, requireAdmin, chapCtrl.remove);
// router.patch('/:storyid/chapters/:chapterid/toggle',      authenticate, requireAdmin, chapCtrl.toggleVisibility);

router.get('/',                           ctrl.getAll);
router.get('/:storyid',                   ctrl.getById);
router.post('/',   authenticate, requireAdmin, upload.single('cover'), ctrl.create);
router.put('/:storyid',   authenticate, requireAdmin, upload.single('cover'), ctrl.update);
router.delete('/:storyid',             authenticate, requireAdmin,     ctrl.delete);
router.patch('/:storyid/toggle',       authenticate, requireAdmin,     ctrl.toggleVisibility);
module.exports = router;

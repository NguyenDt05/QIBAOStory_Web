const Comment = require('../models/Comment');

/** GET /api/comments  (admin: tất cả) */
async function getAll(req, res, next) {
  try {
    // TODO
    res.json({ success: true, data: [] });
  } catch (err) { next(err); }
}

/** GET /api/stories/:storyid/comments  (public: chỉ visible) */
async function getByStory(req, res, next) {
  try {
    const { storyid } = req.params;
    // TODO
    res.json({ success: true, data: [] });
  } catch (err) { next(err); }
}

/** POST /api/stories/:storyid/comments */
async function create(req, res, next) {
  try {
    const { storyid } = req.params;
    // TODO
    res.status(201).json({ success: true, data: [] });
  } catch (err) { next(err); }
}

/** PATCH /api/comments/:cmtid/toggle */
async function toggleVisibility(req, res, next) {
  try {
    const { cmtid } = req.params;
    // TODO
    res.json({ success: true, data: [] });
  } catch (err) { next(err); }
}

/** DELETE /api/comments/:cmtid */
async function remove(req, res, next) {
  try {
    const { cmtid } = req.params;
    // TODO
    res.json({ success: true });
  } catch (err) { next(err); }
}

module.exports = { getAll, getByStory, create, toggleVisibility, remove };

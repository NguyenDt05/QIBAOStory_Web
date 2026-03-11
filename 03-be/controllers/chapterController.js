const Chapter = require('../models/Chapter');

/** GET /api/stories/:storyid/chapters */
async function getByStory(req, res, next) {
  try {
    const { storyid } = req.params;
    // TODO
    res.json({ success: true, data: [] });
  } catch (err) { next(err); }
}

/** GET /api/stories/:storyid/chapters/:chapterid */
async function getById(req, res, next) {
  try {
    const { storyid, chapterid } = req.params;
    // TODO: hỗ trợ chapterid = 'first' | 'last' | <số>
    res.json({ success: true, data: null });
  } catch (err) { next(err); }
}

/** POST /api/stories/:storyid/chapters */
async function create(req, res, next) {
  try {
    const { storyid } = req.params;
    // TODO
    res.status(201).json({ success: true, data: null });
  } catch (err) { next(err); }
}

/** PUT /api/stories/:storyid/chapters/:chapterid */
async function update(req, res, next) {
  try {
    const { storyid, chapterid } = req.params;
    // TODO
    res.json({ success: true, data: null });
  } catch (err) { next(err); }
}

/** DELETE /api/stories/:storyid/chapters/:chapterid */
async function remove(req, res, next) {
  try {
    const { storyid, chapterid } = req.params;
    // TODO
    res.json({ success: true });
  } catch (err) { next(err); }
}

/** PATCH /api/stories/:storyid/chapters/:chapterid/toggle */
async function toggleVisibility(req, res, next) {
  try {
    const { storyid, chapterid } = req.params;
    // TODO
    res.json({ success: true, data: [] });
  } catch (err) { next(err); }
}

module.exports = { getByStory, getById, create, update, remove, toggleVisibility };

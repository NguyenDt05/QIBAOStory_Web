const Story = require('../models/Story');

/** GET /api/stories */
async function getAll(req, res, next) {
  try {
    const { visibleOnly } = req.query;
    // TODO
    res.json({ success: true, data: [] });
  } catch (err) { next(err); }
}

/** GET /api/stories/:storyid */
async function getById(req, res, next) {
  try {
    const { storyid } = req.params;
    // TODO
    res.json({ success: true, data: null });
  } catch (err) { next(err); }
}

/** GET /api/stories/:storyid/detail  (story + chapters) */
async function getDetail(req, res, next) {
  try {
    const { storyid } = req.params;
    // TODO
    res.json({ success: true, data: { story: null, chapters: [] } });
  } catch (err) { next(err); }
}

/** GET /api/stories/:storyid/related */
async function getRelated(req, res, next) {
  try {
    const { storyid } = req.params;
    // TODO
    res.json({ success: true, data: [] });
  } catch (err) { next(err); }
}

/** POST /api/stories */
async function create(req, res, next) {
  try {
    // TODO: lấy body + file ảnh bìa (req.file)
    res.status(201).json({ success: true, data: null });
  } catch (err) { next(err); }
}

/** PUT /api/stories/:storyid */
async function update(req, res, next) {
  try {
    const { storyid } = req.params;
    // TODO
    res.json({ success: true, data: null });
  } catch (err) { next(err); }
}

/** DELETE /api/stories/:storyid */
async function remove(req, res, next) {
  try {
    const { storyid } = req.params;
    // TODO
    res.json({ success: true });
  } catch (err) { next(err); }
}

/** PATCH /api/stories/:storyid/toggle */
async function toggleVisibility(req, res, next) {
  try {
    const { storyid } = req.params;
    // TODO
    res.json({ success: true, data: [] });
  } catch (err) { next(err); }
}

module.exports = { getAll, getById, getDetail, getRelated, create, update, remove, toggleVisibility };

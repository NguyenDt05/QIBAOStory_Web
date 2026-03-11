const Category = require('../models/Category');

/** GET /api/categories */
async function getAll(req, res, next) {
  try {
    // TODO
    res.json({ success: true, data: [] });
  } catch (err) { next(err); }
}

/** POST /api/categories */
async function create(req, res, next) {
  try {
    // TODO
    res.status(201).json({ success: true, data: null });
  } catch (err) { next(err); }
}

/** PUT /api/categories/:categoryID */
async function update(req, res, next) {
  try {
    const { categoryID } = req.params;
    // TODO
    res.json({ success: true, data: null });
  } catch (err) { next(err); }
}

/** DELETE /api/categories/:categoryID */
async function remove(req, res, next) {
  try {
    const { categoryID } = req.params;
    // TODO
    res.json({ success: true });
  } catch (err) { next(err); }
}

/** PATCH /api/categories/:categoryID/toggle */
async function toggleVisibility(req, res, next) {
  try {
    const { categoryID } = req.params;
    // TODO
    res.json({ success: true, data: [] });
  } catch (err) { next(err); }
}

module.exports = { getAll, create, update, remove, toggleVisibility };

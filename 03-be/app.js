require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const routes       = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT || 8080;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve ảnh bìa tĩnh  →  GET /covers/<filename>
app.use('/covers', express.static('public/covers'));

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api', routes);

// ── Error handler ────────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;

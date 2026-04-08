require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); 

const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 8080;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cho phép truy cập thư mục uploads để hiện ảnh bìa
app.use('/uploads/covers', express.static(path.join(__dirname, 'public/covers')));

// Cho phép truy cập thư mục avatars để hiện ảnh đại diện
app.use('/avatars', express.static(path.join(__dirname, 'public/avatars')));


// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api', routes);

// ── Error handler ────────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
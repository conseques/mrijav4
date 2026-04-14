const express = require('express');
const multer = require('multer');
const path = require('path');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

// Store files in backend/uploads/ with original extension preserved
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, safeName);
  }
});

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8 MB

const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, WebP, and GIF images are allowed.'));
    }
  }
});

/**
 * POST /api/upload
 * Accepts a single file field named "file".
 * Returns { url } pointing to /uploads/<filename> served statically.
 */
router.post('/', requireRole('manager', 'admin'), (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: `File too large (max 8 MB).` });
      }
      return res.status(400).json({ error: err.message });
    }

    if (err) {
      return res.status(400).json({ error: err.message || 'Upload failed.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file received.' });
    }

    const backendUrl = process.env.BACKEND_PUBLIC_URL || `http://localhost:${process.env.PORT || 8080}`;
    const url = `${backendUrl}/uploads/${req.file.filename}`;

    return res.status(201).json({ url });
  });
});

module.exports = router;

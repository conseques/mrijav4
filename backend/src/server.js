const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const { port, corsOrigins } = require('./config');
const { initSchema } = require('./db/schema');
const { authOptional } = require('./middleware/auth');
const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/auth');
const publicRoutes = require('./routes/public');
const volunteerRoutes = require('./routes/volunteer');
const adminRoutes = require('./routes/admin');
const uploadRoutes = require('./routes/upload');
const vippsRoutes = require('./routes/vipps');

initSchema();

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(__dirname, '../uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });


const app = express();

const allowAllOrigins = corsOrigins.length === 0;
app.use(
  cors({
    origin(origin, callback) {
      if (allowAllOrigins || !origin || corsOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin ${origin}`));
    }
  })
);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('tiny'));
app.use(authOptional);

// Serve uploaded images statically
app.use('/uploads', express.static(UPLOADS_DIR));


app.get('/', (_req, res) => {
  res.json({
    service: 'mrija-backend',
    status: 'ok'
  });
});

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/volunteer', volunteerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/vipps', vippsRoutes);


app.use((error, _req, res, _next) => {
  console.error('Unhandled backend error:', error);
  res.status(500).json({
    error: 'Internal server error.'
  });
});

app.listen(port, () => {
  console.log(`MriJa backend is running on http://localhost:${port}`);
});

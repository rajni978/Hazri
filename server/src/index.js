import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { connectDB, getDbState } from './config/db.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

// These two values only change where the server listens and which
// browser origin may call it.
const port = Number(process.env.PORT) || 5000;
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// Parse JSON request bodies before routes.
app.use(express.json());

app.use(
  cors({
    origin: clientOrigin,
  }),
);

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'hazri-api',
    database: getDbState(),
    time: new Date().toISOString(),
  });
});

// Auth routes (mounted at /api/auth)
app.use('/api/auth', authRoutes);

async function start() {
  await connectDB();
  app.listen(port, () => {
    console.log(`Hazri API listening on http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});

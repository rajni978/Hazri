import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { connectDB, getDbState } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import mentorRoutes from './routes/mentorRoutes.js';
import classRoutes from './routes/classRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';

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

// Student management (admin)
app.use('/api/students', studentRoutes);
// Mentor management (admin)
app.use('/api/mentors', mentorRoutes);
// Class management (admin)
app.use('/api/classes', classRoutes);
// Subject management (admin)
app.use('/api/subjects', subjectRoutes);
// Mentor assignments (admin)
app.use('/api/assignments', assignmentRoutes);
// Self-service profiles (student / mentor)
app.use('/api/profile', profileRoutes);
// Admin statistics
app.use('/api', statsRoutes);
app.use('/api/attendance', attendanceRoutes);

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

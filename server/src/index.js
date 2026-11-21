import 'dotenv/config';
import cors from 'cors';
import express from 'express';

const app = express();

// Feature 1 has no database. These two values only change where the server
// listens and which browser origin may call it.
const port = Number(process.env.PORT) || 5000;
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(
  cors({
    origin: clientOrigin,
  }),
);

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'hazri-api',
    database: 'not-configured',
    time: new Date().toISOString(),
  });
});

app.listen(port, () => {
  console.log(`Hazri API listening on http://localhost:${port}`);
});

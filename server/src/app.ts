import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import routes from './routes/index.js';

dotenv.config();

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '100kb' }));

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please slow down.' },
});

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'AI request limit reached. Please wait a few minutes and try again.' },
});

app.use('/api', generalLimiter);
app.use('/api/interviews/start', aiLimiter);
app.use('/api/interviews/:id/question', aiLimiter);
app.use('/api/interviews/:id/answer', aiLimiter);
app.use('/api/interviews/:id/complete', aiLimiter);
app.use('/api/study-plans', aiLimiter);

app.use('/api', routes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error('[Unhandled]', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
);

export default app;

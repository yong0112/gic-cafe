import 'reflect-metadata';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { config } from '@/config';
import cafeRoutes from '@/routes/cafeRoutes';
import employeeRoutes from '@/routes/employeeRoutes';
import { errorHandler } from '@/middleware/errorHandler';

const app = express();

// ─── Security ─────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: config.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }),
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

// ─── Logging ──────────────────────────────────────────────────────────────────
app.use(morgan('dev'));

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Static files (logos) ─────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/cafes', cafeRoutes);
app.use('/api/employees', employeeRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// ─── Error handler (must be last) ─────────────────────────────────────────────
app.use(errorHandler);

export default app;

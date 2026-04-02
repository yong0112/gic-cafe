import { Request, Response, NextFunction } from 'express';
import { logger } from '@/utils/logger';

interface AppError extends Error {
  statusCode?: number;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const status = err.statusCode ?? 500;
  const message = status === 500 ? 'Internal server error' : err.message;

  if (status === 500) {
    logger.error(err, 'Unhandled error');
  }

  res.status(status).json({ message });
}

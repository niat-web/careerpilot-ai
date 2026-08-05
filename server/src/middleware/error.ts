import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.errors.map((e) => e.message).join('; ');
      res.status(400).json({ error: message || 'Invalid request data' });
      return;
    }
    req.body = result.data;
    next();
  };
}

export function safeError(
  res: Response,
  err: unknown,
  fallback = 'Something went wrong. Please try again.'
): void {
  console.error('[API Error]', err);
  const message =
    err instanceof Error && !err.message.includes('GEMINI') && err.message.length < 120
      ? err.message
      : fallback;

  // Never expose stack traces or secrets
  if (
    err instanceof Error &&
    (err.message.includes('API_KEY') ||
      err.message.includes('service_role') ||
      err.message.includes('GEMINI_API_KEY'))
  ) {
    res.status(503).json({
      error: 'AI service is not configured. Please contact the workshop facilitator.',
    });
    return;
  }

  res.status(500).json({ error: message });
}

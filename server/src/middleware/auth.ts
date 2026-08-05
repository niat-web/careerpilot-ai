import type { Request, Response, NextFunction } from 'express';
import type { User } from '@supabase/supabase-js';
import { verifyUserToken } from '../utils/supabase.js';

export interface AuthRequest extends Request {
  user?: User;
  token?: string;
}

export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Authentication required. Please log in.' });
      return;
    }

    const token = header.slice(7);
    const user = await verifyUserToken(token);

    if (!user) {
      res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
      return;
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    console.error('[Auth]', err);
    res.status(401).json({ error: 'Authentication failed. Please log in again.' });
  }
}

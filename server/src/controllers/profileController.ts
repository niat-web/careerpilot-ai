import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.js';
import { supabaseAdmin } from '../utils/supabase.js';
import { safeError } from '../middleware/error.js';
import type { ProfileInput } from '../validation/schemas.js';

export async function getProfile(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      const { data: created, error: createErr } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: userId,
          full_name: req.user!.user_metadata?.full_name || req.user!.email?.split('@')[0] || 'Student',
          email: req.user!.email,
        })
        .select('*')
        .single();
      if (createErr) throw createErr;
      res.json({ profile: created });
      return;
    }

    res.json({ profile: data });
  } catch (err) {
    safeError(res, err, 'Could not load your profile.');
  }
}

export async function updateProfile(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const body = req.body as ProfileInput;

    const payload = {
      full_name: body.full_name,
      university: body.university ?? null,
      current_year: body.current_year ?? null,
      target_role: body.target_role,
      experience_level: body.experience_level,
      preferred_difficulty: body.preferred_difficulty,
      known_technologies: body.known_technologies ?? [],
      weak_technologies: body.weak_technologies ?? [],
      daily_preparation_minutes: body.daily_preparation_minutes ?? 60,
      onboarding_completed: body.onboarding_completed ?? true,
      email: req.user!.email,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .upsert({ id: userId, ...payload })
      .select('*')
      .single();

    if (error) throw error;
    res.json({ profile: data });
  } catch (err) {
    safeError(res, err, 'Could not update your profile.');
  }
}

import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.js';
import { supabaseAdmin } from '../utils/supabase.js';
import { safeError } from '../middleware/error.js';

export async function getDashboard(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;

    const [profileRes, sessionsRes, progressRes, plansRes] = await Promise.all([
      supabaseAdmin.from('profiles').select('*').eq('id', userId).maybeSingle(),
      supabaseAdmin
        .from('interview_sessions')
        .select('id, target_role, topic, difficulty, status, overall_score, started_at, completed_at, total_questions')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10),
      supabaseAdmin.from('progress').select('*').eq('user_id', userId).order('updated_at', { ascending: false }),
      supabaseAdmin
        .from('study_plans')
        .select('id, plan_title, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5),
    ]);

    if (profileRes.error) throw profileRes.error;
    if (sessionsRes.error) throw sessionsRes.error;
    if (progressRes.error) throw progressRes.error;
    if (plansRes.error) throw plansRes.error;

    const sessions = sessionsRes.data || [];
    const completed = sessions.filter((s) => s.status === 'completed');
    const scores = completed
      .map((s) => Number(s.overall_score))
      .filter((n) => !Number.isNaN(n));

    const averageScore =
      scores.length > 0 ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 : null;

    res.json({
      profile: profileRes.data,
      stats: {
        total_interviews: sessions.length,
        completed_interviews: completed.length,
        average_score: averageScore,
        topics_practiced: (progressRes.data || []).length,
      },
      recent_sessions: sessions,
      progress: progressRes.data || [],
      recent_study_plans: plansRes.data || [],
    });
  } catch (err) {
    safeError(res, err, 'Could not load dashboard.');
  }
}

export async function getProgress(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { data, error } = await supabaseAdmin
      .from('progress')
      .select('*')
      .eq('user_id', req.user!.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    res.json({ progress: data || [] });
  } catch (err) {
    safeError(res, err, 'Could not load progress.');
  }
}

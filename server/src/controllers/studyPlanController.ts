import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.js';
import { supabaseAdmin } from '../utils/supabase.js';
import { safeError } from '../middleware/error.js';
import { generateStudyPlan } from '../services/interviewAi.js';
import type { z } from 'zod';
import type { studyPlanRequestSchema } from '../validation/schemas.js';

type StudyPlanRequest = z.infer<typeof studyPlanRequestSchema>;

export async function createStudyPlan(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const body = req.body as StudyPlanRequest;

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (!profile) {
      res.status(400).json({ error: 'Please complete your profile first.' });
      return;
    }

    let weakAreas = body.weak_areas || profile.weak_technologies || [];
    let targetRole = body.target_role || profile.target_role || 'Full-Stack Developer';
    const dailyTime = body.daily_time || profile.daily_preparation_minutes || 60;

    if (body.session_id) {
      const { data: session } = await supabaseAdmin
        .from('interview_sessions')
        .select('*')
        .eq('id', body.session_id)
        .eq('user_id', userId)
        .maybeSingle();

      if (session) {
        targetRole = session.target_role || targetRole;
        if (Array.isArray(session.weak_areas) && session.weak_areas.length > 0) {
          weakAreas = session.weak_areas as string[];
        } else if (Array.isArray(session.topics_to_revise)) {
          weakAreas = session.topics_to_revise as string[];
        }
      }
    }

    if (weakAreas.length === 0) {
      weakAreas = ['JavaScript fundamentals', 'Problem solving', 'Communication'];
    }

    const plan = await generateStudyPlan({
      target_role: targetRole,
      experience_level: profile.experience_level || 'Beginner',
      weak_areas: weakAreas,
      daily_time: dailyTime,
    });

    const { data, error } = await supabaseAdmin
      .from('study_plans')
      .insert({
        user_id: userId,
        session_id: body.session_id || null,
        plan_title: plan.plan_title,
        plan_content: plan,
      })
      .select('*')
      .single();

    if (error) throw error;
    res.status(201).json({ study_plan: data });
  } catch (err) {
    console.error('[createStudyPlan]', err);
    safeError(res, err, 'Could not generate study plan. Please try again.');
  }
}

export async function listStudyPlans(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { data, error } = await supabaseAdmin
      .from('study_plans')
      .select('id, plan_title, session_id, created_at, updated_at')
      .eq('user_id', req.user!.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ study_plans: data || [] });
  } catch (err) {
    safeError(res, err, 'Could not load study plans.');
  }
}

export async function getStudyPlan(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { data, error } = await supabaseAdmin
      .from('study_plans')
      .select('*')
      .eq('id', Array.isArray(req.params.id) ? req.params.id[0] : req.params.id)
      .eq('user_id', req.user!.id)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      res.status(404).json({ error: 'Study plan not found.' });
      return;
    }
    res.json({ study_plan: data });
  } catch (err) {
    safeError(res, err, 'Could not load study plan.');
  }
}

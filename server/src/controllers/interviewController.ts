import type { Response } from 'express';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { AuthRequest } from '../middleware/auth.js';
import { safeError } from '../middleware/error.js';
import {
  generateInterviewQuestion,
  evaluateStudentAnswer,
  generateFinalReport,
} from '../services/interviewAi.js';
import type { InterviewSetup, StudentAnswerInput } from '../validation/schemas.js';

function paramId(value: string | string[]): string {
  return Array.isArray(value) ? value[0] : value;
}

async function getOwnedSession(db: SupabaseClient, sessionId: string, userId: string) {
  const { data, error } = await db
    .from('interview_sessions')
    .select('*')
    .eq('id', sessionId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function setProcessingStatus(db: SupabaseClient, sessionId: string, status: string) {
  await db
    .from('interview_sessions')
    .update({ processing_status: status, updated_at: new Date().toISOString() })
    .eq('id', sessionId);
}

async function updateProgress(db: SupabaseClient, userId: string, topic: string, score: number) {
  const { data: existing } = await db
    .from('progress')
    .select('*')
    .eq('user_id', userId)
    .eq('topic', topic)
    .maybeSingle();

  if (existing) {
    const attempts = (existing.attempts || 0) + 1;
    const average =
      Math.round((((Number(existing.average_score) || 0) * (attempts - 1) + score) / attempts) * 10) / 10;
    const best = Math.max(Number(existing.best_score) || 0, score);
    await db
      .from('progress')
      .update({
        attempts,
        average_score: average,
        best_score: best,
        last_attempted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id);
  } else {
    await db.from('progress').insert({
      user_id: userId,
      topic,
      attempts: 1,
      average_score: score,
      best_score: score,
      last_attempted_at: new Date().toISOString(),
    });
  }
}

export async function startInterview(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const body = req.body as InterviewSetup;

    const { data: profile } = await req.db!
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (!profile?.onboarding_completed) {
      res.status(400).json({ error: 'Please complete your profile before starting an interview.' });
      return;
    }

    const { data: session, error } = await req.db!
      .from('interview_sessions')
      .insert({
        user_id: userId,
        target_role: body.target_role,
        interview_type: body.interview_type,
        topic: body.topic,
        difficulty: body.difficulty,
        total_questions: body.total_questions,
        current_question_number: 0,
        status: 'in_progress',
        processing_status: 'generating_question',
      })
      .select('*')
      .single();

    if (error) throw error;

    try {
      const questionData = await generateInterviewQuestion({
        target_role: body.target_role,
        interview_type: body.interview_type,
        topic: body.topic,
        difficulty: body.difficulty,
        experience_level: profile.experience_level || 'Beginner',
        previous_questions: [],
        weak_areas: profile.weak_technologies || [],
      });

      const { data: question, error: qErr } = await req.db!
        .from('interview_questions')
        .insert({
          session_id: session.id,
          user_id: userId,
          question: questionData.question,
          topic: questionData.topic,
          difficulty: questionData.difficulty,
          skill_tested: questionData.skill_tested,
          expected_points: questionData.expected_points,
          question_order: 1,
        })
        .select('id, session_id, question, topic, difficulty, skill_tested, question_order, created_at')
        .single();

      if (qErr) throw qErr;

      await req.db!
        .from('interview_sessions')
        .update({
          current_question_number: 1,
          processing_status: 'question_ready',
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.id);

      res.status(201).json({
        session: { ...session, current_question_number: 1, processing_status: 'question_ready' },
        question,
      });
    } catch (aiErr) {
      await setProcessingStatus(req.db!, session.id, 'failed');
      console.error('[startInterview AI]', aiErr);
      res.status(502).json({
        error: 'Could not generate the first interview question. Please try again.',
        session_id: session.id,
      });
    }
  } catch (err) {
    safeError(res, err, 'Could not start interview.');
  }
}

export async function listInterviews(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { data, error } = await req.db!
      .from('interview_sessions')
      .select(
        'id, target_role, interview_type, topic, difficulty, total_questions, status, overall_score, performance_level, started_at, completed_at, created_at'
      )
      .eq('user_id', req.user!.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ interviews: data || [] });
  } catch (err) {
    safeError(res, err, 'Could not load interview history.');
  }
}

export async function getInterview(req: AuthRequest, res: Response): Promise<void> {
  try {
    const session = await getOwnedSession(req.db!, paramId(req.params.id), req.user!.id);
    if (!session) {
      res.status(404).json({ error: 'Interview not found.' });
      return;
    }

    const [questionsRes, answersRes] = await Promise.all([
      req.db!
        .from('interview_questions')
        .select('id, session_id, question, topic, difficulty, skill_tested, question_order, created_at')
        .eq('session_id', session.id)
        .eq('user_id', req.user!.id)
        .order('question_order', { ascending: true }),
      req.db!
        .from('interview_answers')
        .select('*')
        .eq('session_id', session.id)
        .eq('user_id', req.user!.id)
        .order('created_at', { ascending: true }),
    ]);

    if (questionsRes.error) throw questionsRes.error;
    if (answersRes.error) throw answersRes.error;

    res.json({
      session,
      questions: questionsRes.data || [],
      answers: answersRes.data || [],
    });
  } catch (err) {
    safeError(res, err, 'Could not load interview.');
  }
}

export async function generateNextQuestion(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const session = await getOwnedSession(req.db!, paramId(req.params.id), userId);

    if (!session) {
      res.status(404).json({ error: 'Interview not found.' });
      return;
    }
    if (session.status !== 'in_progress') {
      res.status(400).json({ error: 'This interview is already completed.' });
      return;
    }
    if (session.current_question_number >= session.total_questions) {
      res.status(400).json({ error: 'All questions have been asked. Please complete the interview.' });
      return;
    }

    const { count: answerCount } = await req.db!
      .from('interview_answers')
      .select('*', { count: 'exact', head: true })
      .eq('session_id', session.id)
      .eq('user_id', userId);

    if ((answerCount || 0) < session.current_question_number) {
      res.status(400).json({ error: 'Please submit an answer for the current question first.' });
      return;
    }

    await setProcessingStatus(req.db!, session.id, 'generating_question');

    const { data: profile } = await req.db!
      .from('profiles')
      .select('experience_level, weak_technologies')
      .eq('id', userId)
      .maybeSingle();

    const { data: previous } = await req.db!
      .from('interview_questions')
      .select('question')
      .eq('session_id', session.id)
      .order('question_order', { ascending: true });

    try {
      const nextOrder = session.current_question_number + 1;
      const questionData = await generateInterviewQuestion({
        target_role: session.target_role,
        interview_type: session.interview_type,
        topic: session.topic,
        difficulty: session.difficulty,
        experience_level: profile?.experience_level || 'Beginner',
        previous_questions: (previous || []).map((q) => q.question),
        weak_areas: profile?.weak_technologies || [],
      });

      const { data: question, error: qErr } = await req.db!
        .from('interview_questions')
        .insert({
          session_id: session.id,
          user_id: userId,
          question: questionData.question,
          topic: questionData.topic,
          difficulty: questionData.difficulty,
          skill_tested: questionData.skill_tested,
          expected_points: questionData.expected_points,
          question_order: nextOrder,
        })
        .select('id, session_id, question, topic, difficulty, skill_tested, question_order, created_at')
        .single();

      if (qErr) throw qErr;

      await req.db!
        .from('interview_sessions')
        .update({
          current_question_number: nextOrder,
          processing_status: 'question_ready',
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.id);

      res.json({ question, current_question_number: nextOrder });
    } catch (aiErr) {
      await setProcessingStatus(req.db!, session.id, 'failed');
      console.error('[generateNextQuestion]', aiErr);
      res.status(502).json({ error: 'Could not generate the next question. Please try again.' });
    }
  } catch (err) {
    safeError(res, err, 'Could not generate question.');
  }
}

export async function submitAnswer(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const body = req.body as StudentAnswerInput;
    const session = await getOwnedSession(req.db!, paramId(req.params.id), userId);

    if (!session) {
      res.status(404).json({ error: 'Interview not found.' });
      return;
    }
    if (session.status !== 'in_progress') {
      res.status(400).json({ error: 'This interview is already completed.' });
      return;
    }

    const { data: question, error: qErr } = await req.db!
      .from('interview_questions')
      .select('*')
      .eq('id', body.question_id)
      .eq('session_id', session.id)
      .eq('user_id', userId)
      .maybeSingle();

    if (qErr) throw qErr;
    if (!question) {
      res.status(404).json({ error: 'Question not found for this interview.' });
      return;
    }

    const { data: existingAnswer } = await req.db!
      .from('interview_answers')
      .select('id')
      .eq('question_id', question.id)
      .eq('user_id', userId)
      .maybeSingle();

    if (existingAnswer) {
      res.status(409).json({ error: 'You already submitted an answer for this question.' });
      return;
    }

    await setProcessingStatus(req.db!, session.id, 'evaluating_answer');

    const { data: profile } = await req.db!
      .from('profiles')
      .select('experience_level')
      .eq('id', userId)
      .maybeSingle();

    try {
      const evaluation = await evaluateStudentAnswer({
        question: question.question,
        expected_points: (question.expected_points as string[]) || [],
        student_answer: body.student_answer,
        experience_level: profile?.experience_level || 'Beginner',
      });

      await setProcessingStatus(req.db!, session.id, 'saving_result');

      const { data: answer, error: aErr } = await req.db!
        .from('interview_answers')
        .insert({
          question_id: question.id,
          session_id: session.id,
          user_id: userId,
          student_answer: body.student_answer,
          score: evaluation.score,
          result: evaluation.result,
          correct_points: evaluation.correct_points,
          missing_points: evaluation.missing_points,
          incorrect_points: evaluation.incorrect_points,
          technical_feedback: evaluation.technical_feedback,
          communication_feedback: evaluation.communication_feedback,
          improved_answer: evaluation.improved_answer,
          follow_up_question: evaluation.follow_up_question || null,
          recommended_topic: evaluation.recommended_topic,
        })
        .select('*')
        .single();

      if (aErr) throw aErr;

      await updateProgress(req.db!, userId, question.topic || session.topic, evaluation.score);
      await setProcessingStatus(req.db!, session.id, 'generating_feedback');

      const answered = (await req.db!
        .from('interview_answers')
        .select('*', { count: 'exact', head: true })
        .eq('session_id', session.id)
        .eq('user_id', userId)).count || 0;

      const isLast = answered >= session.total_questions;

      await req.db!
        .from('interview_sessions')
        .update({
          processing_status: isLast ? 'waiting' : 'question_ready',
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.id);

      res.json({
        evaluation: answer,
        is_last_question: isLast,
        answered_count: answered,
        total_questions: session.total_questions,
      });
    } catch (aiErr) {
      await setProcessingStatus(req.db!, session.id, 'failed');
      console.error('[submitAnswer]', aiErr);
      res.status(502).json({ error: 'Could not evaluate your answer. Please try again.' });
    }
  } catch (err) {
    safeError(res, err, 'Could not submit answer.');
  }
}

export async function completeInterview(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const session = await getOwnedSession(req.db!, paramId(req.params.id), userId);

    if (!session) {
      res.status(404).json({ error: 'Interview not found.' });
      return;
    }
    if (session.status === 'completed') {
      res.json({ session });
      return;
    }

    const { data: answers, error: aErr } = await req.db!
      .from('interview_answers')
      .select('*, interview_questions(question, topic, skill_tested)')
      .eq('session_id', session.id)
      .eq('user_id', userId);

    if (aErr) throw aErr;

    if (!answers || answers.length < session.total_questions) {
      res.status(400).json({
        error: `Please answer all ${session.total_questions} questions before completing the interview.`,
      });
      return;
    }

    await setProcessingStatus(req.db!, session.id, 'generating_feedback');

    try {
      const report = await generateFinalReport({
        target_role: session.target_role,
        interview_type: session.interview_type,
        difficulty: session.difficulty,
        interview_results: answers.map((a) => ({
          question: (a as { interview_questions?: { question?: string } }).interview_questions?.question,
          score: a.score,
          result: a.result,
          technical_feedback: a.technical_feedback,
          communication_feedback: a.communication_feedback,
          recommended_topic: a.recommended_topic,
        })),
      });

      const { data: updated, error: uErr } = await req.db!
        .from('interview_sessions')
        .update({
          status: 'completed',
          processing_status: 'completed',
          overall_score: report.overall_score,
          performance_level: report.performance_level,
          technical_summary: report.technical_summary,
          communication_summary: report.communication_summary,
          strong_areas: report.strong_areas,
          weak_areas: report.weak_areas,
          topics_to_revise: report.topics_to_revise,
          next_difficulty: report.next_difficulty,
          final_message: report.final_message,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.id)
        .eq('user_id', userId)
        .select('*')
        .single();

      if (uErr) throw uErr;
      res.json({ session: updated, report });
    } catch (aiErr) {
      await setProcessingStatus(req.db!, session.id, 'failed');
      console.error('[completeInterview]', aiErr);
      res.status(502).json({ error: 'Could not generate the final report. Please try again.' });
    }
  } catch (err) {
    safeError(res, err, 'Could not complete interview.');
  }
}

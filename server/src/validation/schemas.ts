import { z } from 'zod';

export const registerSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(72),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const profileSchema = z.object({
  full_name: z.string().min(2).max(100),
  university: z.string().max(150).optional().nullable(),
  current_year: z.string().max(50).optional().nullable(),
  target_role: z.enum(['Frontend Developer', 'Backend Developer', 'Full-Stack Developer']),
  experience_level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  preferred_difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  known_technologies: z.array(z.string()).default([]),
  weak_technologies: z.array(z.string()).default([]),
  daily_preparation_minutes: z.number().int().min(15).max(480).default(60),
  onboarding_completed: z.boolean().optional(),
});

export const interviewSetupSchema = z.object({
  target_role: z.enum(['Frontend Developer', 'Backend Developer', 'Full-Stack Developer']),
  interview_type: z.enum(['Technical', 'HR', 'Mixed']),
  topic: z.string().min(1).max(100),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  total_questions: z.union([z.literal(3), z.literal(5), z.literal(10)]),
});

export const studentAnswerSchema = z.object({
  question_id: z.string().uuid(),
  student_answer: z.string().min(10, 'Answer must be at least 10 characters').max(5000, 'Answer is too long'),
});

export const geminiQuestionSchema = z.object({
  question: z.string().min(1),
  topic: z.string().min(1),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  skill_tested: z.string().min(1),
  expected_points: z.array(z.string()).min(1),
});

export const geminiEvaluationSchema = z.object({
  score: z.number().min(0).max(10),
  result: z.string(),
  correct_points: z.array(z.string()),
  missing_points: z.array(z.string()),
  incorrect_points: z.array(z.string()),
  technical_feedback: z.string(),
  communication_feedback: z.string(),
  improved_answer: z.string(),
  follow_up_question: z.string().nullable().optional(),
  recommended_topic: z.string(),
});

export const geminiReportSchema = z.object({
  overall_score: z.number().min(0).max(100),
  performance_level: z.string(),
  strong_areas: z.array(z.string()),
  weak_areas: z.array(z.string()),
  technical_summary: z.string(),
  communication_summary: z.string(),
  topics_to_revise: z.array(z.string()).min(1).max(5),
  next_difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  final_message: z.string(),
});

export const studyPlanDaySchema = z.object({
  day: z.number().int().min(1).max(7),
  topic: z.string(),
  objective: z.string(),
  learning_activity: z.string(),
  practice_activity: z.string(),
  duration_minutes: z.number().int().positive(),
});

export const geminiStudyPlanSchema = z.object({
  plan_title: z.string(),
  days: z.array(studyPlanDaySchema).length(7),
});

export const studyPlanRequestSchema = z.object({
  session_id: z.string().uuid().optional().nullable(),
  target_role: z.enum(['Frontend Developer', 'Backend Developer', 'Full-Stack Developer']).optional(),
  weak_areas: z.array(z.string()).optional(),
  daily_time: z.number().int().min(15).max(480).optional(),
});

export type InterviewSetup = z.infer<typeof interviewSetupSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type StudentAnswerInput = z.infer<typeof studentAnswerSchema>;
export type GeminiQuestion = z.infer<typeof geminiQuestionSchema>;
export type GeminiEvaluation = z.infer<typeof geminiEvaluationSchema>;
export type GeminiReport = z.infer<typeof geminiReportSchema>;
export type GeminiStudyPlan = z.infer<typeof geminiStudyPlanSchema>;

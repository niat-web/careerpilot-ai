import { z } from 'zod';

export const registerSchema = z.object({
  full_name: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export const profileFormSchema = z.object({
  full_name: z.string().min(2, 'Enter your full name'),
  university: z.string().optional(),
  current_year: z.string().optional(),
  target_role: z.enum(['Frontend Developer', 'Backend Developer', 'Full-Stack Developer']),
  experience_level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  preferred_difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  known_technologies: z.string().optional(),
  weak_technologies: z.string().optional(),
  daily_preparation_minutes: z.coerce.number().min(15).max(480),
});

export const interviewSetupFormSchema = z.object({
  target_role: z.enum(['Frontend Developer', 'Backend Developer', 'Full-Stack Developer']),
  interview_type: z.enum(['Technical', 'HR', 'Mixed']),
  topic: z.string().min(1, 'Select a topic'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  total_questions: z.coerce.number().refine((n) => [3, 5, 10].includes(n), {
    message: 'Choose 3, 5, or 10 questions',
  }),
});

export const answerSchema = z.object({
  student_answer: z
    .string()
    .min(10, 'Write at least a short paragraph (10+ characters)')
    .max(5000, 'Answer is too long (max 5000 characters)'),
});

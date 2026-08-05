export type Profile = {
  id: string;
  full_name: string;
  email?: string | null;
  university?: string | null;
  current_year?: string | null;
  target_role?: string | null;
  experience_level?: string | null;
  preferred_difficulty?: string | null;
  known_technologies?: string[] | null;
  weak_technologies?: string[] | null;
  daily_preparation_minutes?: number | null;
  role?: string;
  onboarding_completed?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type InterviewSession = {
  id: string;
  user_id?: string;
  target_role: string;
  interview_type: string;
  topic: string;
  difficulty: string;
  total_questions: number;
  current_question_number: number;
  status: string;
  processing_status?: string;
  overall_score?: number | null;
  performance_level?: string | null;
  technical_summary?: string | null;
  communication_summary?: string | null;
  strong_areas?: string[] | null;
  weak_areas?: string[] | null;
  topics_to_revise?: string[] | null;
  next_difficulty?: string | null;
  final_message?: string | null;
  started_at?: string;
  completed_at?: string | null;
  created_at?: string;
};

export type InterviewQuestion = {
  id: string;
  session_id: string;
  question: string;
  topic: string;
  difficulty: string;
  skill_tested?: string | null;
  question_order: number;
  created_at?: string;
};

export type InterviewAnswer = {
  id: string;
  question_id: string;
  session_id: string;
  student_answer: string;
  score: number;
  result?: string | null;
  correct_points?: string[] | null;
  missing_points?: string[] | null;
  incorrect_points?: string[] | null;
  technical_feedback?: string | null;
  communication_feedback?: string | null;
  improved_answer?: string | null;
  follow_up_question?: string | null;
  recommended_topic?: string | null;
  created_at?: string;
};

export type StudyPlan = {
  id: string;
  user_id: string;
  session_id?: string | null;
  plan_title: string;
  plan_content: {
    plan_title: string;
    days: Array<{
      day: number;
      topic: string;
      objective: string;
      learning_activity: string;
      practice_activity: string;
      duration_minutes: number;
    }>;
  };
  created_at?: string;
};

export type ProgressRow = {
  id: string;
  topic: string;
  attempts: number;
  average_score: number;
  best_score: number;
  last_attempted_at?: string | null;
};

export const TARGET_ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full-Stack Developer',
] as const;

export const TOPICS_BY_ROLE: Record<string, string[]> = {
  'Frontend Developer': [
    'HTML',
    'CSS',
    'JavaScript',
    'TypeScript',
    'React',
    'API integration',
    'Browser concepts',
    'Web performance',
    'Accessibility',
  ],
  'Backend Developer': [
    'Node.js',
    'Express.js',
    'REST APIs',
    'Authentication',
    'Authorization',
    'SQL',
    'PostgreSQL',
    'Database design',
    'Security',
    'Error handling',
  ],
  'Full-Stack Developer': [
    'React',
    'Node.js',
    'Express.js',
    'APIs',
    'Supabase',
    'Authentication',
    'Authorization',
    'Database relationships',
    'Deployment',
    'Git',
  ],
};

export const INTERVIEW_TYPES = ['Technical', 'HR', 'Mixed'] as const;
export const DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const;
export const QUESTION_COUNTS = [3, 5, 10] as const;

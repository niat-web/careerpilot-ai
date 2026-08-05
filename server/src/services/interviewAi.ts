import {
  geminiQuestionSchema,
  geminiEvaluationSchema,
  geminiReportSchema,
  geminiStudyPlanSchema,
  type GeminiQuestion,
  type GeminiEvaluation,
  type GeminiReport,
  type GeminiStudyPlan,
} from '../validation/schemas.js';
import { generateStructured } from './gemini.js';

export async function generateInterviewQuestion(ctx: {
  target_role: string;
  interview_type: string;
  topic: string;
  difficulty: string;
  experience_level: string;
  previous_questions: string[];
  weak_areas: string[];
}): Promise<GeminiQuestion> {
  const prompt = `Generate exactly one interview question.

Context:
Target role: ${ctx.target_role}
Interview type: ${ctx.interview_type}
Topic: ${ctx.topic}
Difficulty: ${ctx.difficulty}
Student experience level: ${ctx.experience_level}
Previously asked questions: ${JSON.stringify(ctx.previous_questions)}
Known weak areas: ${JSON.stringify(ctx.weak_areas)}

Requirements:

1. Ask only one question.
2. Match role, topic, interview type, and difficulty.
3. Do not repeat previous questions.
4. The question should be answerable in two to five minutes.
5. Do not include the answer in the visible question.
6. Include hidden expected answer points for server-side evaluation.
7. Return valid JSON only.

Required JSON:

{
  "question": "Question shown to the student",
  "topic": "Topic name",
  "difficulty": "Easy, Medium, or Hard",
  "skill_tested": "Main skill being evaluated",
  "expected_points": [
    "Expected point 1",
    "Expected point 2",
    "Expected point 3"
  ]
}`;

  return generateStructured(prompt, geminiQuestionSchema);
}

export async function evaluateStudentAnswer(ctx: {
  question: string;
  expected_points: string[];
  student_answer: string;
  experience_level: string;
}): Promise<GeminiEvaluation> {
  const prompt = `Evaluate the student's interview answer.

Question:
${ctx.question}

Expected answer points:
${JSON.stringify(ctx.expected_points)}

Student answer:
${ctx.student_answer}

Student experience level:
${ctx.experience_level}

Evaluation weights:
- Technical correctness: 40%
- Completeness: 20%
- Clarity: 15%
- Practical understanding: 15%
- Communication quality: 10%

Instructions:

1. Score the answer from 0 to 10.
2. Do not give high score for a long but incorrect answer.
3. Identify correct points.
4. Identify missing points.
5. Identify incorrect or misleading points.
6. Give technical feedback.
7. Give communication feedback.
8. Provide an improved interview-ready answer.
9. Provide one follow-up question if useful.
10. Recommend one topic to revise.
11. Return valid JSON only.

Required JSON:

{
  "score": 7.5,
  "result": "Good",
  "correct_points": ["Correct point"],
  "missing_points": ["Missing point"],
  "incorrect_points": ["Incorrect point"],
  "technical_feedback": "Technical feedback",
  "communication_feedback": "Communication feedback",
  "improved_answer": "Improved answer",
  "follow_up_question": "Follow-up question",
  "recommended_topic": "Topic to revise"
}`;

  return generateStructured(prompt, geminiEvaluationSchema);
}

export async function generateFinalReport(ctx: {
  target_role: string;
  interview_type: string;
  difficulty: string;
  interview_results: unknown[];
}): Promise<GeminiReport> {
  const prompt = `Generate a final mock interview report.

Target role: ${ctx.target_role}
Interview type: ${ctx.interview_type}
Difficulty: ${ctx.difficulty}
Interview results: ${JSON.stringify(ctx.interview_results)}

Requirements:

1. Calculate overall score from 0 to 100.
2. Identify strong areas.
3. Identify weak areas.
4. Summarize technical performance.
5. Summarize communication performance.
6. Recommend exactly three revision topics.
7. Recommend next difficulty.
8. Provide an encouraging final message.
9. Return valid JSON only.

Required JSON:

{
  "overall_score": 72,
  "performance_level": "Intermediate",
  "strong_areas": ["Strong area"],
  "weak_areas": ["Weak area"],
  "technical_summary": "Technical summary",
  "communication_summary": "Communication summary",
  "topics_to_revise": ["Topic 1", "Topic 2", "Topic 3"],
  "next_difficulty": "Medium",
  "final_message": "Encouraging final message"
}`;

  return generateStructured(prompt, geminiReportSchema);
}

export async function generateStudyPlan(ctx: {
  target_role: string;
  experience_level: string;
  weak_areas: string[];
  daily_time: number;
}): Promise<GeminiStudyPlan> {
  const prompt = `Create a seven-day interview preparation plan.

Target role: ${ctx.target_role}
Student experience level: ${ctx.experience_level}
Weak areas: ${JSON.stringify(ctx.weak_areas)}
Daily preparation time: ${ctx.daily_time}

Requirements:

1. Create exactly seven days.
2. Focus more time on weak areas.
3. Include learning and practice.
4. Keep activities realistic.
5. Include one revision/mock-interview day.
6. Use beginner-friendly language.
7. Return valid JSON only.

Required JSON:

{
  "plan_title": "Seven-Day Interview Preparation Plan",
  "days": [
    {
      "day": 1,
      "topic": "Topic",
      "objective": "Learning objective",
      "learning_activity": "Learning activity",
      "practice_activity": "Practice activity",
      "duration_minutes": 60
    }
  ]
}`;

  return generateStructured(prompt, geminiStudyPlanSchema);
}

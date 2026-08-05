import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/error.js';
import {
  profileSchema,
  interviewSetupSchema,
  studentAnswerSchema,
  studyPlanRequestSchema,
} from '../validation/schemas.js';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { getDashboard, getProgress } from '../controllers/dashboardController.js';
import {
  startInterview,
  listInterviews,
  getInterview,
  generateNextQuestion,
  submitAnswer,
  completeInterview,
} from '../controllers/interviewController.js';
import {
  createStudyPlan,
  listStudyPlans,
  getStudyPlan,
} from '../controllers/studyPlanController.js';

const router = Router();

router.get('/profile', requireAuth, getProfile);
router.put('/profile', requireAuth, validateBody(profileSchema), updateProfile);

router.get('/dashboard', requireAuth, getDashboard);
router.get('/progress', requireAuth, getProgress);

router.post('/interviews/start', requireAuth, validateBody(interviewSetupSchema), startInterview);
router.get('/interviews', requireAuth, listInterviews);
router.get('/interviews/:id', requireAuth, getInterview);
router.post('/interviews/:id/question', requireAuth, generateNextQuestion);
router.post('/interviews/:id/answer', requireAuth, validateBody(studentAnswerSchema), submitAnswer);
router.post('/interviews/:id/complete', requireAuth, completeInterview);

router.post('/study-plans', requireAuth, validateBody(studyPlanRequestSchema), createStudyPlan);
router.get('/study-plans', requireAuth, listStudyPlans);
router.get('/study-plans/:id', requireAuth, getStudyPlan);

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'CareerPilot AI' });
});

export default router;

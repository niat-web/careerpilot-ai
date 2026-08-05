import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout, PublicLayout } from './components/Layouts';
import { LandingPage } from './pages/LandingPage';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import { OnboardingPage, ProfilePage } from './pages/ProfilePages';
import { DashboardPage } from './pages/DashboardPage';
import { NewInterviewPage } from './pages/NewInterviewPage';
import { LiveInterviewPage } from './pages/LiveInterviewPage';
import { InterviewResultPage } from './pages/InterviewResultPage';
import { HistoryPage } from './pages/HistoryPage';
import { StudyPlanPage } from './pages/StudyPlanPage';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<AppLayout />}>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/interview/new" element={<NewInterviewPage />} />
        <Route path="/interview/:id" element={<LiveInterviewPage />} />
        <Route path="/interview/:id/result" element={<InterviewResultPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/study-plan" element={<StudyPlanPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from './Navbar';
import { Sidebar, MobileNav } from './Sidebar';
import { LoadingState } from './LoadingState';

export function PublicLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export function AppLayout() {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingState label="Checking your session…" />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  const onboardingDone = profile?.onboarding_completed;
  if (profile && !onboardingDone && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6">
        <Sidebar />
        <div className="min-w-0 flex-1">
          <MobileNav />
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export function GuestOnly({ children }: { children: ReactNode }) {
  const { user, profile, loading } = useAuth();
  if (loading) return <LoadingState />;
  if (user) {
    return <Navigate to={profile?.onboarding_completed ? '/dashboard' : '/onboarding'} replace />;
  }
  return <>{children}</>;
}

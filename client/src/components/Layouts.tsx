import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from './Navbar';
import { Sidebar, MobileNav } from './Sidebar';
import { LoadingState } from './LoadingState';

export function PublicLayout() {
  return (
    <div className="page-shell flex min-h-full flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export function AppLayout() {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="page-shell flex min-h-full items-center justify-center">
        <LoadingState label="Checking your session…" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  const onboardingDone = profile?.onboarding_completed;
  if (profile && !onboardingDone && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  const isOnboarding = location.pathname === '/onboarding';

  useEffect(() => {
    if (isOnboarding) {
      document.documentElement.classList.remove('app-scroll-lock');
      return;
    }

    const mq = window.matchMedia('(min-width: 768px)');
    const syncScrollLock = () => {
      if (mq.matches) document.documentElement.classList.add('app-scroll-lock');
      else document.documentElement.classList.remove('app-scroll-lock');
    };

    syncScrollLock();
    mq.addEventListener('change', syncScrollLock);
    return () => {
      document.documentElement.classList.remove('app-scroll-lock');
      mq.removeEventListener('change', syncScrollLock);
    };
  }, [isOnboarding]);

  if (isOnboarding) {
    return (
      <div className="page-shell min-h-full overflow-y-auto">
        <Navbar />
        <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
          <Outlet />
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <Navbar />
        <div className="app-main-scroll">
          <div className="app-content">
            <MobileNav />
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export function GuestOnly({ children }: { children: ReactNode }) {
  const { user, profile, loading } = useAuth();
  if (loading) {
    return (
      <div className="page-shell flex min-h-full items-center justify-center">
        <LoadingState />
      </div>
    );
  }
  if (user) {
    return <Navigate to={profile?.onboarding_completed ? '/dashboard' : '/onboarding'} replace />;
  }
  return <>{children}</>;
}

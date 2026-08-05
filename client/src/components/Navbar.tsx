import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BrandMark } from './PageHeader';

export function Navbar() {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const isApp = Boolean(user) && !['/', '/login', '/register'].includes(location.pathname);

  if (isApp) {
    return (
      <header className="sticky top-0 z-30 border-b border-border/80 bg-surface-2/85 backdrop-blur-md md:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <BrandMark to="/dashboard" />
          <button type="button" onClick={() => void signOut()} className="btn btn-ghost px-2 py-1 text-sm">
            Log out
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/80 text-white backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-sm font-bold text-white">
            CP
          </span>
          <span className="font-display text-lg tracking-tight">CareerPilot AI</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <NavLink to="/dashboard" className="btn btn-ghost text-white/80 hover:bg-white/10 hover:text-white">
                Dashboard
              </NavLink>
              <span className="hidden text-sm text-white/50 sm:inline">
                {profile?.full_name?.split(' ')[0] || 'Student'}
              </span>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost text-white/80 hover:bg-white/10 hover:text-white">
                Log in
              </Link>
              <Link to="/register" className="btn btn-primary">
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/app/stores/authStore';
import { Loading } from './ui';

/**
 * Gate for authenticated areas. Mirrors the mobile _layout routing:
 *  - not hydrated yet → spinner
 *  - not authenticated → /login
 *  - authenticated but not onboarded → onboarding (unless already there)
 */
export function ProtectedRoute({
  children, requireOnboarded = true, roles,
}: {
  children: ReactNode;
  requireOnboarded?: boolean;
  roles?: string[];
}) {
  const { hydrated, isAuthenticated, user, hydrate } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!hydrated) hydrate();
  }, [hydrated, hydrate]);

  if (!hydrated) return <Loading label="Loading your account…" />;
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (requireOnboarded && !user.onboarded) {
    const dest = user.role === 'job_provider'
      ? '/onboarding/provider-setup'
      : '/onboarding/step1';
    if (!location.pathname.startsWith('/onboarding')) {
      return <Navigate to={dest} replace />;
    }
  }

  if (roles && user.role !== 'admin' && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

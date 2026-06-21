import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { ToastProvider } from './components/ui';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppShell } from './components/AppShell';
import { ErrorBoundary } from './components/ErrorBoundary';
import './app.css';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RoleSelect from './pages/auth/RoleSelect';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import AdminLogin from './pages/auth/AdminLogin';
import VerifyPhone from './pages/auth/VerifyPhone';

// Onboarding
import SeekerOnboarding from './pages/onboarding/SeekerOnboarding';
import ProviderOnboarding from './pages/onboarding/ProviderOnboarding';

// Seeker
import Dashboard from './pages/seeker/Dashboard';
import Jobs from './pages/seeker/Jobs';
import JobDetail from './pages/seeker/JobDetail';
import Applications from './pages/seeker/Applications';
import Resume from './pages/seeker/Resume';
import Tailor from './pages/seeker/Tailor';
import CoverLetter from './pages/seeker/CoverLetter';
import InterviewPrep from './pages/seeker/InterviewPrep';
import Coach from './pages/seeker/Coach';
import Insights from './pages/seeker/Insights';
import Paywall from './pages/seeker/Paywall';
import PaywallSuccess from './pages/seeker/PaywallSuccess';

// Shared
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// Provider
import ProviderHome from './pages/provider/ProviderHome';
import ProviderListings from './pages/provider/ProviderListings';
import ProviderPost from './pages/provider/ProviderPost';
import ProviderApplicants from './pages/provider/ProviderApplicants';
import ProviderProfile from './pages/provider/ProviderProfile';

// Admin
import AdminHome from './pages/admin/AdminHome';

function Shell({ children, roles, requireOnboarded = true }: {
  children: React.ReactNode; roles?: string[]; requireOnboarded?: boolean;
}) {
  return (
    <ProtectedRoute roles={roles} requireOnboarded={requireOnboarded}>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  );
}

/**
 * Root of the ProAICV web app. Served at the root of proaicv.kdaanalytics.com
 * (and at localhost root when VITE_APP_TARGET=app). All paths below are absolute
 * from the app root, e.g. /login, /jobs.
 */
export default function AppRoot() {
  return (
    <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <div className="proaicv-app">
          <Routes>
            {/* Public / auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/role-select" element={<RoleSelect />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* Authed, no shell */}
            <Route path="/verify-phone" element={
              <ProtectedRoute requireOnboarded={false}><VerifyPhone /></ProtectedRoute>
            } />
            <Route path="/onboarding/step1" element={
              <ProtectedRoute requireOnboarded={false}><SeekerOnboarding /></ProtectedRoute>
            } />
            <Route path="/onboarding/provider-setup" element={
              <ProtectedRoute requireOnboarded={false}><ProviderOnboarding /></ProtectedRoute>
            } />

            {/* Seeker */}
            <Route path="/" element={<Shell><Dashboard /></Shell>} />
            <Route path="/jobs" element={<Shell><Jobs /></Shell>} />
            <Route path="/jobs/:id" element={<Shell><JobDetail /></Shell>} />
            <Route path="/jobs/:id/tailor" element={<Shell><Tailor /></Shell>} />
            <Route path="/jobs/:id/cover-letter" element={<Shell><CoverLetter /></Shell>} />
            <Route path="/jobs/:id/interview-prep" element={<Shell><InterviewPrep /></Shell>} />
            <Route path="/applications" element={<Shell><Applications /></Shell>} />
            <Route path="/resume" element={<Shell><Resume /></Shell>} />
            <Route path="/coach" element={<Shell><Coach /></Shell>} />
            <Route path="/insights" element={<Shell><Insights /></Shell>} />
            <Route path="/paywall" element={<Shell><Paywall /></Shell>} />
            <Route path="/paywall/success" element={<Shell><PaywallSuccess /></Shell>} />

            {/* Provider */}
            <Route path="/provider" element={<Shell roles={['job_provider']}><ProviderHome /></Shell>} />
            <Route path="/provider/listings" element={<Shell roles={['job_provider']}><ProviderListings /></Shell>} />
            <Route path="/provider/post" element={<Shell roles={['job_provider']}><ProviderPost /></Shell>} />
            <Route path="/provider/applicants" element={<Shell roles={['job_provider']}><ProviderApplicants /></Shell>} />
            <Route path="/provider/profile" element={<Shell roles={['job_provider']}><ProviderProfile /></Shell>} />

            {/* Admin */}
            <Route path="/admin" element={<Shell roles={['admin']} requireOnboarded={false}><AdminHome /></Shell>} />

            {/* Shared (any authed role) */}
            <Route path="/profile" element={<Shell roles={undefined}><Profile /></Shell>} />
            <Route path="/settings" element={<Shell roles={undefined}><Settings /></Shell>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </ToastProvider>
    </QueryClientProvider>
  </ErrorBoundary>
  );
}

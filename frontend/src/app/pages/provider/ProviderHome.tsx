import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/lib/api';
import { useAuthStore } from '@/app/stores/authStore';
import { Loading } from '@/app/components/ui';

interface ProviderJob {
  id: string; review_status: string; is_active: boolean; applicant_count: number;
}

export function panBadge(user: { pan_verified?: boolean; company_pan?: string | null }) {
  if (user.pan_verified) return <span className="pa-badge pa-badge-success">✓ PAN Verified</span>;
  if (user.company_pan) return <span className="pa-badge pa-badge-warning">⏳ Verification Pending</span>;
  return null;
}

export default function ProviderHome() {
  const user = useAuthStore((s) => s.user);

  const jobs = useQuery({
    queryKey: ['provider-jobs'],
    queryFn: async () => (await api.get<ProviderJob[]>('/provider/jobs')).data,
  });
  const profile = useQuery({
    queryKey: ['provider-profile'],
    queryFn: async () => (await api.get<{ company_name: string | null; industry: string | null }>('/users/me/provider-profile')).data,
  });

  if (!user) return null;
  const list = jobs.data ?? [];
  const liveJobs = list.filter((j) => j.review_status === 'approved' && j.is_active).length;
  const totalApplicants = list.reduce((sum, j) => sum + (j.applicant_count || 0), 0);
  const initials = (user.name || user.email).slice(0, 2).toUpperCase();

  return (
    <div className="pa-content" style={{ maxWidth: 760 }}>
      <div className="pa-hero">
        <div className="pa-tile" style={{ position: 'relative' }}>
          <div className="pa-avatar">{initials}</div>
          <div style={{ minWidth: 0 }}>
            <div className="pa-hero-title" style={{ fontSize: 20 }}>{user.name || 'HR Manager'}</div>
            <div className="pa-hero-sub" style={{ marginTop: 2 }}>{user.email}</div>
            {profile.data?.company_name && (
              <div className="pa-hero-sub" style={{ marginTop: 2 }}>🏢 {profile.data.company_name}</div>
            )}
          </div>
        </div>
        <div style={{ marginTop: 14, position: 'relative' }}>{panBadge(user)}</div>
      </div>

      <div className="pa-grid pa-grid-2">
        <div className="pa-card pa-card-stat">
          {jobs.isLoading ? <Loading /> : <div className="pa-stat-num">{liveJobs}</div>}
          <div className="pa-label" style={{ marginTop: 4 }}>Live jobs</div>
        </div>
        <div className="pa-card pa-card-stat">
          {jobs.isLoading ? <Loading /> : <div className="pa-stat-num">{totalApplicants}</div>}
          <div className="pa-label" style={{ marginTop: 4 }}>Total applicants</div>
        </div>
      </div>

      <div className="pa-card">
        <h3 style={{ fontSize: 16, marginBottom: 10 }}>Quick actions</h3>
        <div className="pa-grid pa-grid-3">
          <Link to="/provider/post" className="pa-btn pa-btn-primary">➕ Post a job</Link>
          <Link to="/provider/listings" className="pa-btn pa-btn-ghost">📑 My listings</Link>
          <Link to="/provider/applicants" className="pa-btn pa-btn-ghost">👥 Applicants</Link>
        </div>
      </div>

      <div className="pa-card">
        <h3 style={{ fontSize: 16, marginBottom: 8 }}>Company</h3>
        <Link to="/provider/profile" className="pa-list-link">🏢 Company profile <span>›</span></Link>
        <Link to="/settings" className="pa-list-link">⚙️ Settings & security <span>›</span></Link>
      </div>
    </div>
  );
}

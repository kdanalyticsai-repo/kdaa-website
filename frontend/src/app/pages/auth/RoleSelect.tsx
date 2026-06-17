import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/app/stores/authStore';

export default function RoleSelect() {
  const navigate = useNavigate();
  const setPendingRole = useAuthStore((s) => s.setPendingRole);

  const pick = (role: 'job_seeker' | 'job_provider') => {
    setPendingRole(role);
    navigate(`/register?role=${role}`);
  };

  return (
    <div className="pa-auth-wrap">
      <div className="pa-auth-card" style={{ maxWidth: 480 }}>
        <div className="pa-brand" style={{ justifyContent: 'center', paddingBottom: 8 }}>
          <span className="pa-brand-logo">P</span>
          <span className="pa-brand-name">ProAICV</span>
        </div>
        <div className="pa-auth-title">How will you use ProAICV?</div>
        <div className="pa-auth-sub">Choose the experience that fits you</div>

        <button className="pa-card" style={cardBtn} onClick={() => pick('job_seeker')}>
          <span style={{ fontSize: 30 }}>🎯</span>
          <div>
            <div style={{ fontWeight: 700 }}>I'm looking for a job</div>
            <div className="pa-muted" style={{ fontSize: 13 }}>
              AI resume tailoring, job matches, cover letters & interview prep
            </div>
          </div>
        </button>

        <button className="pa-card" style={{ ...cardBtn, marginTop: 12 }} onClick={() => pick('job_provider')}>
          <span style={{ fontSize: 30 }}>🏢</span>
          <div>
            <div style={{ fontWeight: 700 }}>I'm hiring</div>
            <div className="pa-muted" style={{ fontSize: 13 }}>
              Post jobs and review applicants for your company
            </div>
          </div>
        </button>

        <div className="pa-auth-foot" style={{ marginTop: 20 }}>
          Already have an account? <a href="/login">Sign in</a>
        </div>
      </div>
    </div>
  );
}

const cardBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left',
  width: '100%', cursor: 'pointer', border: '1px solid var(--border-subtle)',
};

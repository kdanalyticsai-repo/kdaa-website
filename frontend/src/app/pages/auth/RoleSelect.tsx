import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/app/stores/authStore';
import { InstallAppButton } from '@/app/components/InstallAppButton';

// Same imagery as the mobile role-select screen.
const SEEKER_IMAGE = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=700&h=600&fit=crop&crop=top&q=80';
const PROVIDER_IMAGE = 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=700&h=360&fit=crop&q=80';

const SEEKER_FEATURES = [
  { icon: '🎯', text: 'AI-matched jobs tailored to your resume' },
  { icon: '📄', text: 'ATS resume scorer with improvement tips' },
  { icon: '🤖', text: 'Unlimited AI career coach & interview prep' },
];
const PROVIDER_FEATURES = [
  { icon: '📢', text: 'Post jobs with full specifications instantly' },
  { icon: '👥', text: 'Manage applicants from one clean dashboard' },
  { icon: '✅', text: 'Admin-verified listings for quality reach' },
];

export default function RoleSelect() {
  const navigate = useNavigate();
  const setPendingRole = useAuthStore((s) => s.setPendingRole);

  const pick = (role: 'job_seeker' | 'job_provider') => {
    setPendingRole(role);
    navigate(`/register?role=${role}`);
  };

  return (
    <div className="pa-role-page">
      <div className="pa-role-hero">
        <div className="pa-role-hero-inner">
          <div className="pa-role-logo"><span>✦</span></div>
          <div className="pa-role-logo-text">ProAICV</div>
          <div className="pa-role-tagline">Your AI-powered career platform</div>
          <div className="pa-role-pills">
            {['Resume AI', 'Job Match', 'Career Coach'].map((p) => (
              <span key={p} className="pa-role-pill">{p}</span>
            ))}
          </div>
          <InstallAppButton className="pa-install-cta" />
        </div>
      </div>

      <div className="pa-role-cards">
        <h2 className="pa-role-heading">How would you like to get started?</h2>

        <RoleCard
          image={SEEKER_IMAGE}
          overlay="rgba(27,0,96,0.78)"
          badge="👤  Job Seeker"
          title={<>Land your<br />next opportunity</>}
          features={SEEKER_FEATURES}
          iconTint="primary"
          cta="Find Jobs"
          ctaBg="var(--primary)"
          onClick={() => pick('job_seeker')}
        />

        <RoleCard
          image={PROVIDER_IMAGE}
          overlay="rgba(0,30,40,0.80)"
          badge="🏢  Job Provider"
          title={<>Find the right<br />candidates</>}
          features={PROVIDER_FEATURES}
          iconTint="tertiary"
          cta="Hire Talent"
          ctaBg="#006880"
          onClick={() => pick('job_provider')}
        />

      </div>
    </div>
  );
}

function RoleCard({
  image, overlay, badge, title, features, iconTint, cta, ctaBg, onClick,
}: {
  image: string; overlay: string; badge: string; title: React.ReactNode;
  features: { icon: string; text: string }[]; iconTint: 'primary' | 'tertiary';
  cta: string; ctaBg: string; onClick: () => void;
}) {
  return (
    <div className="pa-role-card">
      <div className="pa-role-img" style={{ backgroundImage: `url(${image})` }}>
        <div className="pa-role-img-overlay" style={{ background: overlay }}>
          <span className="pa-role-badge">{badge}</span>
          <div className="pa-role-card-title">{title}</div>
        </div>
      </div>
      <div className="pa-role-body">
        {features.map((f) => (
          <div key={f.text} className="pa-role-feature">
            <span className={`pa-icon-tile${iconTint === 'tertiary' ? ' tertiary' : ''}`}>{f.icon}</span>
            <span className="pa-role-feature-text">{f.text}</span>
          </div>
        ))}
      </div>
      <button className="pa-role-cta" style={{ background: ctaBg }} onClick={onClick}>
        {cta} <span aria-hidden>→</span>
      </button>
    </div>
  );
}

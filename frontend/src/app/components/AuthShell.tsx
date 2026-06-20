import { ReactNode } from 'react';

// Same imagery as the role-select cards, reused per flow.
const SEEKER_IMG = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&h=600&fit=crop&crop=top&q=80';
const PROVIDER_IMG = 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&h=600&fit=crop&q=80';

/**
 * Split-screen auth layout. The branded panel differs by role so the Job Seeker
 * and Employer flows look distinct across register / login.
 */
export function AuthShell({ role = 'job_seeker', children }: { role?: string; children: ReactNode }) {
  const provider = role === 'job_provider';
  const img = provider ? PROVIDER_IMG : SEEKER_IMG;
  const overlay = provider
    ? 'linear-gradient(135deg, rgba(0,40,55,.55), rgba(0,104,128,.28))'
    : 'linear-gradient(135deg, rgba(25,0,100,.55), rgba(56,0,192,.28))';
  const pills = provider ? ['Post Jobs', 'Verified Reach', 'Applicant Tools'] : ['Resume AI', 'Job Match', 'Career Coach'];

  return (
    <div className="pa-auth-split">
      <div className="pa-auth-brandpanel">
        <div className="pa-auth-brand-row">
          <span className="pa-auth-brand-logo"><span className="material-symbols-outlined fill">rocket_launch</span></span>
          <span className="pa-auth-brand-name">ProAICV</span>
        </div>
        <h1 className="pa-auth-headline">
          {provider ? <>Hire smarter,<br /><span>not harder.</span></> : <>Career intelligence<br /><span>redefined.</span></>}
        </h1>
        <p className="pa-auth-lead">
          {provider
            ? 'Post roles, reach admin-verified candidates, and manage your hiring pipeline with AI.'
            : 'Join the next generation of professionals using AI to navigate their career paths with precision and clarity.'}
        </p>
        <div className="pa-auth-pills">
          {pills.map((p) => (
            <span key={p} className="pa-role-pill"
              style={{ background: 'var(--surface-low)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
              {p}
            </span>
          ))}
        </div>
        <div className="pa-auth-illus" style={{ backgroundImage: `${overlay}, url(${img})` }} />
      </div>
      <div className="pa-auth-formcard">{children}</div>
    </div>
  );
}

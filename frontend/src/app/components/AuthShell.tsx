import { ReactNode } from 'react';

/**
 * Split-screen auth layout (landing / create-account flow). A branded gradient
 * panel on the left (desktop) and the form card on the right.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="pa-auth-split">
      <div className="pa-auth-brandpanel">
        <div className="pa-auth-brand-row">
          <span className="pa-auth-brand-logo"><span className="material-symbols-outlined fill">rocket_launch</span></span>
          <span className="pa-auth-brand-name">ProAICV</span>
        </div>
        <h1 className="pa-auth-headline">Career intelligence<br /><span>redefined.</span></h1>
        <p className="pa-auth-lead">
          Join the next generation of professionals using AI to navigate their
          career paths with precision and clarity.
        </p>
        <div className="pa-auth-pills">
          {['Resume AI', 'Job Match', 'Career Coach'].map((p) => (
            <span key={p} className="pa-role-pill"
              style={{ background: 'var(--surface-low)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
              {p}
            </span>
          ))}
        </div>
        <div className="pa-auth-illus" />
      </div>
      <div className="pa-auth-formcard">{children}</div>
    </div>
  );
}

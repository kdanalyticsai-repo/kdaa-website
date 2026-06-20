import {
  createContext, useContext, useState, useCallback, ReactNode,
  ButtonHTMLAttributes, InputHTMLAttributes,
} from 'react';

// ── Button ──────────────────────────────────────────────────────────────────
type Variant = 'primary' | 'ghost' | 'outline' | 'danger';
interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  block?: boolean;
  size?: 'sm' | 'md';
  loading?: boolean;
}
export function Button({
  variant = 'primary', block, size = 'md', loading, children, disabled, className = '', ...rest
}: BtnProps) {
  const cls = [
    'pa-btn', `pa-btn-${variant}`, block && 'pa-btn-block', size === 'sm' && 'pa-btn-sm', className,
  ].filter(Boolean).join(' ');
  return (
    <button className={cls} disabled={disabled || loading} {...rest}>
      {loading && <span className="pa-spinner" style={{ width: 15, height: 15, borderWidth: 2 }} />}
      {children}
    </button>
  );
}

// ── Password input (with show/hide toggle) ──────────────────────────────────
export function PasswordInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const [show, setShow] = useState(false);
  return (
    <div className="pa-input-wrap">
      <input {...props} className="pa-input" type={show ? 'text' : 'password'} />
      <button
        type="button"
        className="pa-input-eye"
        onClick={() => setShow((s) => !s)}
        tabIndex={-1}
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? 'Hide' : 'Show'}
      </button>
    </div>
  );
}

// ── Modal ───────────────────────────────────────────────────────────────────
export function Modal({
  open, onClose, title, children,
}: { open: boolean; onClose: () => void; title?: string; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="pa-modal-overlay" onClick={onClose}>
      <div className="pa-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="pa-modal-head">
          <div className="pa-modal-title">{title}</div>
          <button className="pa-modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="pa-modal-body">{children}</div>
      </div>
    </div>
  );
}

/** A label/value row for use inside a Modal. */
export function DetailRow({ k, v }: { k: ReactNode; v: ReactNode }) {
  return <div className="pa-detail-row"><span className="k">{k}</span><span className="v">{v}</span></div>;
}

// ── Field ───────────────────────────────────────────────────────────────────
export function Field({
  label, error, hint, children,
}: { label?: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div className="pa-field">
      {label && <label className="pa-label">{label}</label>}
      {children}
      {hint && !error && <div className="pa-hint">{hint}</div>}
      {error && <div className="pa-error-text">{error}</div>}
    </div>
  );
}

// ── Spinner / states ──────────────────────────────────────────────────────────
export function Spinner({ size = 22 }: { size?: number }) {
  return <span className="pa-spinner" style={{ width: size, height: size }} />;
}
export function Loading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="pa-center" style={{ flexDirection: 'column', gap: 12, padding: 56 }}>
      <Spinner size={28} />
      <span className="pa-muted">{label}</span>
    </div>
  );
}
export function EmptyState({ icon = '📭', title, sub, action }: {
  icon?: string; title: string; sub?: string; action?: ReactNode;
}) {
  return (
    <div className="pa-empty">
      <div className="pa-empty-icon">{icon}</div>
      <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 16 }}>{title}</div>
      {sub && <div style={{ marginTop: 6 }}>{sub}</div>}
      {action && <div style={{ marginTop: 18 }}>{action}</div>}
    </div>
  );
}
export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="pa-empty">
      <div className="pa-empty-icon">⚠️</div>
      <div style={{ fontWeight: 700, color: 'var(--text)' }}>{message}</div>
      {onRetry && (
        <div style={{ marginTop: 16 }}>
          <Button variant="ghost" size="sm" onClick={onRetry}>Try again</Button>
        </div>
      )}
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
const ToastCtx = createContext<(msg: string) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null);
  const show = useCallback((m: string) => {
    setMsg(m);
    window.setTimeout(() => setMsg(null), 3200);
  }, []);
  return (
    <ToastCtx.Provider value={show}>
      {children}
      {msg && (
        <div className="pa-toast-host">
          <div className="pa-toast">{msg}</div>
        </div>
      )}
    </ToastCtx.Provider>
  );
}

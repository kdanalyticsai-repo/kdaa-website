export function formatSalary(min?: number | null, max?: number | null, currency = 'INR'): string | null {
  if (!min && !max) return null;
  const sym = currency === 'INR' ? '₹' : '';
  const fmt = (n: number) => {
    if (n >= 10000000) return `${(n / 10000000).toFixed(n % 10000000 ? 1 : 0)}Cr`;
    if (n >= 100000) return `${(n / 100000).toFixed(n % 100000 ? 1 : 0)}L`;
    if (n >= 1000) return `${Math.round(n / 1000)}k`;
    return `${n}`;
  };
  if (min && max) return `${sym}${fmt(min)} – ${sym}${fmt(max)}`;
  return `${sym}${fmt((min || max)!)}+`;
}

export function timeAgo(iso?: string | null): string {
  if (!iso) return '';
  const d = new Date(iso).getTime();
  if (Number.isNaN(d)) return '';
  const s = Math.floor((Date.now() - d) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  if (days < 30) return `${days}d ago`;
  const mo = Math.floor(days / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
}

export function formatDate(iso?: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export const STATUS_LABELS: Record<string, string> = {
  applied: 'Applied',
  screening: 'Screening',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
};

export const STATUS_ORDER = ['applied', 'screening', 'interview', 'offer', 'rejected', 'withdrawn'];

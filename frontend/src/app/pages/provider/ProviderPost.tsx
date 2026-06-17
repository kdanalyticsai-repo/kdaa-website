import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, apiError, tokenStore } from '@/app/lib/api';
import { API_URL } from '@/app/lib/config';
import { Button, Field, useToast } from '@/app/components/ui';

const JOB_TYPES = ['full_time', 'part_time', 'contract'];
const EXP_LEVELS = ['entry', 'mid', 'senior', 'lead'];
const REMOTE_TYPES = ['onsite', 'remote', 'hybrid'];

export default function ProviderPost() {
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  return (
    <div className="pa-content" style={{ maxWidth: 720 }}>
      <h1 className="pa-page-title">Post a job</h1>
      <p className="pa-page-sub">Listings go live after a quick admin review</p>

      <div className="pa-chip-row" style={{ marginTop: 16 }}>
        <button className={`pa-chip${mode === 'single' ? ' active' : ''}`} onClick={() => setMode('single')}>Single job</button>
        <button className={`pa-chip${mode === 'bulk' ? ' active' : ''}`} onClick={() => setMode('bulk')}>Bulk upload</button>
      </div>

      {mode === 'single' ? <SingleJobForm /> : <BulkUpload />}
    </div>
  );
}

function SingleJobForm() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const toast = useToast();
  const [form, setForm] = useState({
    title: '', company: '', location: '', description: '',
    job_type: 'full_time', experience_level: 'mid', remote_type: 'onsite',
    salary_min: '', salary_max: '', vacancies: '1', skills: '', requirements: '',
  });
  const [error, setError] = useState('');
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const create = useMutation({
    mutationFn: () => api.post('/provider/jobs', {
      title: form.title.trim(), company: form.company.trim(), location: form.location.trim(),
      description: form.description.trim(),
      job_type: form.job_type, experience_level: form.experience_level, remote_type: form.remote_type,
      salary_min: form.salary_min ? Number(form.salary_min) : null,
      salary_max: form.salary_max ? Number(form.salary_max) : null,
      vacancies: form.vacancies ? Number(form.vacancies) : 1,
      skills_required: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      requirements: form.requirements.split('\n').map((s) => s.trim()).filter(Boolean),
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['provider-jobs'] });
      toast('Submitted for review.');
      navigate('/provider/listings');
    },
    onError: (e) => setError(apiError(e, 'Could not post the job.')),
  });

  const submit = () => {
    if (!form.title.trim() || !form.company.trim() || !form.location.trim() || !form.description.trim()) {
      setError('Title, company, location and description are required.'); return;
    }
    setError(''); create.mutate();
  };

  return (
    <div className="pa-card" style={{ marginTop: 16 }}>
      <Field label="Job title *"><input className="pa-input" value={form.title} onChange={(e) => set('title', e.target.value)} /></Field>
      <Field label="Company *"><input className="pa-input" value={form.company} onChange={(e) => set('company', e.target.value)} /></Field>
      <Field label="Location *"><input className="pa-input" value={form.location} onChange={(e) => set('location', e.target.value)} /></Field>

      <div className="pa-grid pa-grid-3">
        <Field label="Job type">
          <select className="pa-select" value={form.job_type} onChange={(e) => set('job_type', e.target.value)}>
            {JOB_TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
          </select>
        </Field>
        <Field label="Experience">
          <select className="pa-select" value={form.experience_level} onChange={(e) => set('experience_level', e.target.value)}>
            {EXP_LEVELS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Work style">
          <select className="pa-select" value={form.remote_type} onChange={(e) => set('remote_type', e.target.value)}>
            {REMOTE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
      </div>

      <div className="pa-grid pa-grid-3">
        <Field label="Salary min (₹/yr)"><input className="pa-input" type="number" value={form.salary_min} onChange={(e) => set('salary_min', e.target.value)} /></Field>
        <Field label="Salary max (₹/yr)"><input className="pa-input" type="number" value={form.salary_max} onChange={(e) => set('salary_max', e.target.value)} /></Field>
        <Field label="Vacancies"><input className="pa-input" type="number" min={1} value={form.vacancies} onChange={(e) => set('vacancies', e.target.value)} /></Field>
      </div>

      <Field label="Skills (comma separated)"><input className="pa-input" value={form.skills} onChange={(e) => set('skills', e.target.value)} placeholder="React, TypeScript, SQL" /></Field>
      <Field label="Requirements (one per line)">
        <textarea className="pa-textarea" value={form.requirements} onChange={(e) => set('requirements', e.target.value)} placeholder="3+ years experience&#10;Bachelor's degree" />
      </Field>
      <Field label="Description *" error={error}>
        <textarea className="pa-textarea" style={{ minHeight: 160 }} value={form.description} onChange={(e) => set('description', e.target.value)} />
      </Field>

      <Button block loading={create.isPending} onClick={submit}>Submit for review</Button>
    </div>
  );
}

function BulkUpload() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ submitted: number; success_count: number; error_count: number; errors: { row: number; message: string }[]; skipped_excess: number } | null>(null);

  const downloadTemplate = async () => {
    try {
      const res = await fetch(`${API_URL}/provider/jobs/bulk-template`, {
        headers: { Authorization: `Bearer ${tokenStore.getAccess()}` },
      });
      if (!res.ok) throw new Error('failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'bulk-jobs-template.xlsx'; a.click();
      URL.revokeObjectURL(url);
    } catch { toast('Could not download template.'); }
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setResult(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${API_URL}/provider/jobs/bulk`, {
        method: 'POST', headers: { Authorization: `Bearer ${tokenStore.getAccess()}` }, body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || 'Upload failed');
      setResult(data);
      qc.invalidateQueries({ queryKey: ['provider-jobs'] });
      if (data.success_count > 0) toast(`${data.success_count} job(s) submitted for review.`);
    } catch (err) {
      toast(apiError(err, 'Bulk upload failed.'));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="pa-card" style={{ marginTop: 16 }}>
      <p className="pa-muted" style={{ marginBottom: 14 }}>
        Upload a CSV or XLSX file (up to 25 jobs). Download the template to get the right columns.
      </p>
      <div className="pa-row" style={{ flexWrap: 'wrap' }}>
        <Button variant="ghost" onClick={downloadTemplate}>⬇ Download template</Button>
        <Button loading={uploading} onClick={() => fileRef.current?.click()}>↑ Upload file</Button>
        <input ref={fileRef} type="file" accept=".csv,.xlsx" hidden onChange={onFile} />
      </div>

      {result && (
        <div style={{ marginTop: 18 }}>
          <div className="pa-row" style={{ gap: 20 }}>
            <div><div className="pa-label">Submitted</div><div className="pa-stat-num" style={{ fontSize: 22 }}>{result.success_count}</div></div>
            <div><div className="pa-label">Errors</div><div className="pa-stat-num" style={{ fontSize: 22, color: 'var(--danger)' }}>{result.error_count}</div></div>
          </div>
          {result.skipped_excess > 0 && (
            <p className="pa-muted" style={{ fontSize: 13, marginTop: 8 }}>
              {result.skipped_excess} extra row(s) skipped (25 max per upload).
            </p>
          )}
          {result.errors?.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <h4 style={{ fontSize: 14, marginBottom: 6 }}>Row errors</h4>
              <ul style={{ paddingLeft: 18, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.7 }}>
                {result.errors.map((er, i) => <li key={i}>Row {er.row}: {er.message}</li>)}
              </ul>
            </div>
          )}
          {result.success_count > 0 && (
            <Button variant="ghost" style={{ marginTop: 14 }} onClick={() => navigate('/provider/listings')}>View listings</Button>
          )}
        </div>
      )}
    </div>
  );
}

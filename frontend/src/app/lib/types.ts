// Shared types mirroring the backend's user/job/application shapes.

export interface User {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: string; // 'job_seeker' | 'job_provider' | 'admin'
  subscription: string; // 'free' | 'pro'
  onboarded: boolean;
  phone_verified?: boolean;
  avatar_url: string | null;
  trial_ends_at?: string | null;
  created_at?: string;
  // Provider company verification
  company_pan?: string | null;
  company_reg_no?: string | null;
  gstin?: string | null;
  total_vacancies?: number | null;
  pan_verified?: boolean;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string | null;
  description: string | null;
  salary_min?: number | null;
  salary_max?: number | null;
  job_type?: string | null;
  remote?: boolean | null;
  external_url?: string | null;
  source?: string | null;
  posted_at?: string | null;
  created_at?: string | null;
  is_saved?: boolean;
  match_score?: number | null;
}

export interface Application {
  id: string;
  job_id?: string | null;
  job_title: string;
  company: string;
  location?: string | null;
  status: string; // 'applied' | 'interview' | 'offer' | 'rejected' | ...
  external_url?: string | null;
  source?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Resume {
  id: string;
  filename?: string | null;
  title?: string | null;
  is_primary?: boolean;
  status?: string; // 'processing' | 'ready' | 'failed'
  created_at?: string;
  parsed?: any;
}

export type PlanId = 'monthly' | 'quarterly' | 'yearly';

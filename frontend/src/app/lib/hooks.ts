import { useQuery } from '@tanstack/react-query';
import { api } from './api';

export interface UsageData {
  plan: string;
  is_trial: boolean;
  trial_ends_at: string | null;
  usage: Record<string, { used: number; limit: number | null; blocked: boolean; reason: string | null }>;
  pro_expires_at: string | null;
  pro_plan_type: string | null;
}

export function useUsage() {
  return useQuery({
    queryKey: ['my-usage'],
    queryFn: async () => (await api.get<UsageData>('/subscriptions/my-usage')).data,
    staleTime: 60_000,
  });
}

export function isFeatureBlocked(usage: UsageData | undefined, feature: string): boolean {
  return usage?.usage?.[feature]?.blocked === true;
}

import { create } from 'zustand';
import { api, tokenStore, setOnAuthFailure } from '@/app/lib/api';
import type { User } from '@/app/lib/types';

interface Tokens {
  access_token: string;
  refresh_token: string;
}

async function fetchMe(): Promise<User> {
  const { data } = await api.get<User>('/users/me');
  return data;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hydrated: boolean;
  pendingRole: string;

  hydrate: () => Promise<void>;
  login: (email: string, password: string, expectedRole?: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  setPendingRole: (role: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  hydrated: false,
  pendingRole: 'job_seeker',

  hydrate: async () => {
    const token = tokenStore.getAccess();
    if (!token) {
      set({ hydrated: true, isAuthenticated: false });
      return;
    }
    try {
      const user = await fetchMe();
      set({ user, isAuthenticated: true, hydrated: true });
    } catch {
      tokenStore.clear();
      set({ hydrated: true, isAuthenticated: false, user: null });
    }
  },

  login: async (email, password, expectedRole) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post<Tokens>('/auth/login', { email, password });
      tokenStore.set(data.access_token, data.refresh_token);
      const user = await fetchMe();
      if (expectedRole && user.role !== 'admin' && user.role !== expectedRole) {
        await api.post('/auth/logout').catch(() => {});
        tokenStore.clear();
        const err: any = new Error('role_mismatch');
        err.isRoleMismatch = true;
        err.actualRole = user.role;
        throw err;
      }
      set({ user, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  adminLogin: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post<Tokens>('/auth/admin-login', { email, password });
      tokenStore.set(data.access_token, data.refresh_token);
      const user = await fetchMe();
      set({ user, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (email, password, name) => {
    set({ isLoading: true });
    try {
      const role = get().pendingRole;
      const { data } = await api.post<Tokens>('/auth/register', { email, password, name, role });
      tokenStore.set(data.access_token, data.refresh_token);
      const user = await fetchMe();
      set({ user, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  refreshUser: async () => {
    try {
      const user = await fetchMe();
      set({ user, isAuthenticated: true });
    } catch {
      /* ignore */
    }
  },

  logout: async () => {
    await api.post('/auth/logout').catch(() => {});
    tokenStore.clear();
    set({ user: null, isAuthenticated: false });
  },

  setUser: (user) => set({ user }),
  setPendingRole: (role) => set({ pendingRole: role }),
}));

// When a token refresh fails, force the store back to logged-out.
setOnAuthFailure(() => {
  useAuthStore.setState({ user: null, isAuthenticated: false });
});

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_URL } from './config';

// ── Token storage (web equivalent of mobile secure-store) ──────────────────────
const ACCESS_KEY = 'proaicv_access_token';
const REFRESH_KEY = 'proaicv_refresh_token';

export const tokenStore = {
  getAccess: () => localStorage.getItem(ACCESS_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  set: (access: string, refresh: string) => {
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

// ── Axios client ───────────────────────────────────────────────────────────────
export const api = axios.create({
  baseURL: API_URL,
  timeout: 90_000, // survive Render cold starts
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStore.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

// Allows non-React code (authStore) to react to a forced logout.
let onAuthFailure: (() => void) | null = null;
export const setOnAuthFailure = (cb: () => void) => {
  onAuthFailure = cb;
};

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Retry once on network error (covers Render cold-start timeout).
    if (!error.response && original && !original._retry) {
      original._retry = true;
      original.timeout = 20_000;
      return api(original);
    }

    if (!original || error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push((token: string) => {
          if (!token) return reject(error);
          original.headers.Authorization = `Bearer ${token}`;
          resolve(api(original));
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = tokenStore.getRefresh();
      if (!refreshToken) throw new Error('No refresh token');

      const { data } = await axios.post(`${API_URL}/auth/refresh`, {
        refresh_token: refreshToken,
      });
      tokenStore.set(data.access_token, data.refresh_token);

      refreshQueue.forEach((cb) => cb(data.access_token));
      refreshQueue = [];
      original.headers.Authorization = `Bearer ${data.access_token}`;
      return api(original);
    } catch (refreshErr) {
      refreshQueue.forEach((cb) => cb(''));
      refreshQueue = [];
      tokenStore.clear();
      onAuthFailure?.();
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  },
);

// Pull a human-friendly message out of a FastAPI error response.
export function apiError(err: unknown, fallback = 'Something went wrong. Please try again.'): string {
  const ax = err as AxiosError<any>;
  const detail = ax?.response?.data?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg;
  return fallback;
}

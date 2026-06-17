// ProAICV web app config.
// IMPORTANT: this app uses its OWN env var (VITE_PROAICV_API_URL), NOT the shared
// VITE_API_URL — that one is set in Cloudflare Pages to the marketing site's backend
// (kdaa-website.onrender.com) and would point this app at the wrong host.
// Defaults to the live cvpilot backend so the app works out of the box with no env vars.
// For local backend dev, set VITE_PROAICV_API_URL=http://localhost:8000/api/v1 in frontend/.env.local
export const API_URL =
  (import.meta.env.VITE_PROAICV_API_URL as string | undefined) ??
  'https://cvpilot-backend-hop4.onrender.com/api/v1';

export const POLL_INTERVAL_MS = 3000;
export const MAX_RESUME_POLL_ATTEMPTS = 40; // ~2 min total
export const MAX_FILE_SIZE_MB = 10;

// Razorpay return URL after a successful web payment (must be an absolute https URL
// on the app's own origin so the static subscribe page can redirect back to it).
export const PAYMENT_RETURN_URL = `${window.location.origin}/paywall/success`;

// ProAICV web app config.
// Defaults to the live Render backend so the app works out of the box.
// For local backend dev, set VITE_API_URL=http://localhost:8000/api/v1 in frontend/.env.local
export const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  'https://cvpilot-backend-hop4.onrender.com/api/v1';

export const POLL_INTERVAL_MS = 3000;
export const MAX_RESUME_POLL_ATTEMPTS = 40; // ~2 min total
export const MAX_FILE_SIZE_MB = 10;

// Razorpay return URL after a successful web payment (must be an absolute https URL
// on the app's own origin so the static subscribe page can redirect back to it).
export const PAYMENT_RETURN_URL = `${window.location.origin}/paywall/success`;

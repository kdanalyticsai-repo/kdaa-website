# ProAICV Web App — Build Plan

> **Status:** in progress. Created 2026-06-17.
> **Goal:** a full-parity browser web app for ProAICV (the mobile career-AI app), hosted
> inside this `kdaa-website` Vite repo, talking to the **same FastAPI backend**, using
> **Razorpay** for payments (fully Play-policy-compliant because it's a web channel, not the
> Android app). Built during the Google Play production-access review window; mobile GPB/RevenueCat
> build follows next week after approval.

---

## Why this exists
- The Android app must use Google Play Billing (separate `career_ai/docs/plan-revenuecat-gps-build.md`).
- A **browser web app** may use Razorpay freely — Play's payment policy only governs purchases
  *inside the Android app*. So the Razorpay investment stays **active** as the web payment rail.
- **Guardrail:** the Android app must NOT link/steer users to the web to pay (reader-app rule).
  The web app is a separate, independently-discovered channel sharing one backend + one account.

## Architecture
- **Backend:** `career_ai` FastAPI on Render — `https://cvpilot-backend-hop4.onrender.com/api/v1`.
  **Reused as-is, zero changes for v1.** JWT Bearer (access + refresh). CORS `ALLOWED_ORIGINS: "*"`.
- **Frontend:** this repo, `frontend/` (Vite + React 18 + react-router v6), Cloudflare deploy.
  - Web app lives under `frontend/src/app/**`. **Served at the root of its own subdomain
    `https://proaicv.kdaanalytics.com/`** (URLs like `/login`, `/jobs`). `main.tsx` picks the app
    vs the marketing site by hostname: `host.startsWith('proaicv.')` → app; else marketing.
    For local app dev: `VITE_APP_TARGET=app npm run dev` forces app mode at `localhost:5173`.
  - **Cloudflare one-time setup (user):** add `proaicv.kdaanalytics.com` as a custom domain on the
    Pages project + DNS CNAME. Same single build/dist serves both hosts; the existing
    `_redirects` `/* /index.html 200` SPA catch-all covers the subdomain too.
  - Token storage: `localStorage` (web equivalent of mobile secure-store).
  - Data layer mirrors mobile: **axios** client + interceptor, **@tanstack/react-query**, **zustand** auth store.
- **Payments:** reuse `GET /subscriptions/payment-url` with a **web** `return_url`
  (`https://proaicv.kdaanalytics.com/paywall/success`) instead of the `cvpilot://` deep link. The existing static
  Razorpay page (`public/proaicv/subscribe/index.html`) redirects there after success; the success
  page polls `/auth/me` until `subscription === 'pro'`. Razorpay webhook already credits the user.

## Backend API surface (reused)
auth: register, login, refresh, logout, me, google, forgot/reset-password, send/verify-phone-otp,
admin-login. users: me (GET/PATCH), me/onboarding, preferences, provider-profile, me/export, DELETE me.
jobs: list+filters, {id}, save/unsave, saved-searches CRUD, sync-* (admin). applications: CRUD + status.
resumes: list, upload, upload-file, {id}, sections patch, primary, export-pdf, status. ai: chat (+sessions),
cover-letter, interview-prep, tailor, compute-matches. subscriptions: payment-url, my-usage, plans,
razorpay-webhook, downgrade. provider: dashboard, provider-jobs, jobs CRUD, bulk, applicants, access reqs.
analytics: dashboard/insights. admin: pending-jobs, approve/reject, pending-pan-providers, verify/reject-pan,
users, set-plan-type, purge-test-data.

## Folder layout (target)
```
frontend/src/app/
  AppRoot.tsx              # QueryClientProvider + nested <Routes> + shell
  lib/{config,api,queryClient}.ts
  stores/authStore.ts
  components/{AppShell,ProtectedRoute,ui/*}.tsx
  pages/
    auth/{Login,Register,ForgotPassword,ResetPassword,VerifyPhone,RoleSelect}.tsx
    onboarding/{Step1Profile,Step2Preferences,Step3Resume,ProviderSetup}.tsx
    seeker/{Dashboard,Jobs,JobDetail,Applications,ApplicationDetail,Resume,ResumeUpload,
            Coach,Tailor,CoverLetter,InterviewPrep,Insights,Profile,Settings}.tsx
    paywall/{Paywall,PaywallSuccess}.tsx
    provider/{Home,Listings,Post,BulkPost,Applicants,ApplicantDetail,ProviderProfile}.tsx
    admin/{Dashboard,Approvals,PanVerify,Users}.tsx
```

## Build waves (each kept runnable)
1. **Foundation** — deps, `/app` route, QueryClient, api client (refresh interceptor), authStore, config.
2. **Shell + auth** — AppShell, ProtectedRoute, login/register/forgot/reset/verify-phone, role-select.
3. **Onboarding** — seeker steps 1–3, provider setup.
4. **Seeker core** — Dashboard, Jobs (search/filter/save/detail), Applications tracker.
5. **Resume + AI** — upload/view, tailor, cover-letter, interview-prep, Coach chat, Insights.
6. **Paywall + account** — Razorpay web flow + success polling, Profile, Settings.
7. **Provider portal** — listings, post, bulk-post, applicants, company profile.
8. **Admin portal** — approvals, PAN verify, users.
9. **Build + smoke test + deploy** (Cloudflare).

## Decisions
- Full parity (seeker + provider + admin), inside this repo (confirmed 2026-06-17).
- Email/password auth for v1 web; Google OAuth + phone OTP wired where backend supports them.
- Prices: ₹199/mo, ₹499/qtr, ₹999/yr (NOTE: the static subscribe page still shows yearly "₹1,499"
  in its labels — fix to ₹999 when touching that page).

## Build status — ALL WAVES COMPLETE (code) 2026-06-17
All seeker, provider, and admin pages are built, type-check clean (`npx tsc --noEmit`),
and `npm run build` succeeds (213 modules, ~78 KB gzip app bundle). All 50 backend
endpoints the app calls were verified present in the live `/openapi.json` with matching
HTTP methods. No backend changes were needed.

### Page inventory (all at root of `proaicv.kdaanalytics.com`)
- Auth: `/login` `/register` `/role-select` `/forgot-password` `/reset-password` `/admin-login` `/verify-phone`
- Onboarding: `/onboarding/step1` (seeker) `/onboarding/provider-setup`
- Seeker: `/` `/jobs` `/jobs/:id` `/jobs/:id/{tailor,cover-letter,interview-prep}` `/applications` `/resume` `/coach` `/insights` `/paywall` `/paywall/success`
- Provider: `/provider` `/provider/{listings,post,applicants,profile}`
- Admin: `/admin` (tabs: overview, pending jobs, access requests, PAN verify, users)
- Shared: `/profile` `/settings`

### Go-live checklist (requires user action — do NOT auto-push/deploy)
1. **Commit + push** the `proaicv-web-app` branch and merge to `main` (or point Cloudflare Pages at this branch). Frontend deploy is via **Cloudflare Pages Git integration**, not the GitHub `deploy.yml` (that only Render-deploys the backend).
2. **Verify the Pages build output dir** is `frontend/dist` (build cmd `npm run build`). Note `wrangler.jsonc` shows `assets.directory: "frontend"` — confirm the dashboard project uses `dist`.
3. **Add custom domain** `proaicv.kdaanalytics.com` to the Pages project + create the DNS **CNAME** → `<project>.pages.dev`. Host detection in `main.tsx` (`host.startsWith('proaicv.')`) renders the app at the subdomain root; the apex still serves marketing.
4. No env vars required for prod — `VITE_API_URL` defaults to the Render backend; `VITE_APP_TARGET=app` is local-dev only.
5. **Razorpay return URL** is `https://proaicv.kdaanalytics.com/paywall/success`; the existing static `public/proaicv/subscribe/` page redirects back to it. Pages serves that static file before the SPA catch-all, so the round-trip works.

## Open / later
- Web folder-name cleanup (`cvpilot`/`cvproai`/`proaicv`) — backend links to `/cvproai/subscribe`
  (301s to `/proaicv/subscribe`); harmless but fragile.
- Subdomain (`app.kdaanalytics.com`) vs `/app` path — starting with `/app` path; subdomain optional later.

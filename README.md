# KDA Analytics — Full Stack Website
### Where Data Meets Intelligence

> AI startup intelligence platform · React 18 + FastAPI + Python 3 · Production-ready

---

## 📁 Project Structure

```
kda-analytics/
│
├── 🚀 run-local/                   ← QUICKEST WAY TO START (Flask + no Node needed)
│   ├── server.py                   ← Flask server (serves API + SPA)
│   └── static/
│       └── index.html              ← Full React SPA (standalone)
│
├── 🎨 frontend/                    ← React 18 + TypeScript + Vite
│   ├── src/
│   │   ├── App.tsx                 ← Router setup (all routes)
│   │   ├── main.tsx
│   │   ├── pages/                  ← Home, Features, Services, ServiceDetail,
│   │   │                              ForBusiness, BusinessDetail, Contact, NotFound
│   │   ├── components/layout/      ← Navbar, Footer, Layout
│   │   ├── hooks/                  ← useScrollReveal
│   │   ├── utils/api.ts            ← fetch wrapper for backend
│   │   └── styles/globals.css      ← CSS variables + base styles
│   ├── index.html
│   ├── vite.config.ts              ← Proxies /api → localhost:8000
│   └── package.json
│
├── ⚙️  backend/                    ← Python 3 + FastAPI
│   ├── app/
│   │   ├── main.py                 ← FastAPI app + CORS + middleware
│   │   ├── core/
│   │   │   ├── config.py           ← All env-var settings (Pydantic)
│   │   │   └── logging.py
│   │   ├── models/contact.py       ← Request/Response Pydantic models
│   │   ├── services/email_service.py ← SMTP + SendGrid + Twilio SMS
│   │   └── api/v1/routes/
│   │       ├── contact.py          ← POST /api/v1/contact
│   │       └── health.py           ← GET  /api/v1/health
│   ├── tests/test_contact.py       ← pytest test suite (36 tests)
│   ├── requirements.txt
│   └── .env.example
│
├── 🐳 infra/
│   ├── docker/
│   │   ├── Dockerfile.backend      ← Multi-stage Python image
│   │   └── Dockerfile.frontend     ← Node build → Nginx serve
│   └── nginx/nginx.conf            ← Reverse proxy + TLS + rate limiting
│
├── 🔧 .vscode/
│   ├── settings.json               ← Editor + Python + formatter settings
│   ├── launch.json                 ← Debug configs (FastAPI, pytest, Flask)
│   ├── tasks.json                  ← Run tasks (npm dev, pip install, docker)
│   ├── extensions.json             ← Recommended extensions
│   └── api-tests.http              ← REST Client test requests
│
├── .github/workflows/deploy.yml    ← CI/CD (test → build → deploy)
├── docker-compose.yml
└── README.md
```

---

## ⚡ Option 1 — Quickest Start (60 seconds, Python only)

> **No Node.js required.** Uses Flask + the pre-built SPA HTML.

### Prerequisites
- Python 3.8+ installed ([python.org](https://python.org/downloads))
- VS Code installed ([code.visualstudio.com](https://code.visualstudio.com))

### Steps

**1. Open the project in VS Code**
```bash
# Open terminal (Ctrl+` in VS Code or Terminal > New Terminal)
cd path/to/kda-analytics
code .
```

**2. Install Flask** (only dependency needed)
```bash
pip install flask
```

**3. Run the server**
```bash
cd run-local
python server.py
```

**4. Open your browser**
```
http://localhost:5000
```

That's it! The full website is running with:
- All pages and routing ✅
- Contact form with validation ✅
- Lead storage in memory ✅
- Admin panel: `http://localhost:5000/api/v1/leads?secret=kda-admin-2026` ✅

---

## 🛠 Option 2 — Full Stack (React Dev Server + FastAPI)

> Best for development. You get hot-reload on both frontend and backend.

### Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Python | 3.10+ | [python.org](https://python.org/downloads) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| VS Code | Latest | [code.visualstudio.com](https://code.visualstudio.com) |

---

### Step-by-Step VS Code Setup

#### Step 1 — Open the project folder

1. Launch **VS Code**
2. Go to **File → Open Folder**
3. Select the `kda-analytics` folder
4. VS Code will detect `.vscode/` settings automatically

#### Step 2 — Install recommended extensions

When VS Code opens the project, a notification appears:
> *"Do you want to install the recommended extensions for this repository?"*

Click **Install All**. If you miss it:
- Press `Ctrl+Shift+X` to open Extensions
- Type `@recommended` in the search bar
- Install all shown extensions

Key extensions installed:
- **Python** + **Debugpy** — Python language support + debugging
- **Prettier** — Code formatter
- **REST Client** — Test API endpoints inside VS Code
- **Docker** — Docker Compose support

#### Step 3 — Set up the Python backend

Open a new terminal in VS Code: **Terminal → New Terminal** (`Ctrl+`\`)

```bash
# Navigate to backend folder
cd backend

# Create a virtual environment
python -m venv .venv

# Activate it:
# Windows:
.venv\Scripts\activate
# Mac/Linux:
source .venv/bin/activate

# Install all dependencies
pip install -r requirements.txt
```

**Configure your environment variables:**
```bash
# Copy the example file
cp .env.example .env
```

Open `.env` in VS Code and fill in your email credentials:
```env
# For Gmail (easiest):
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USE_TLS=true
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password    # ← See Gmail setup below
COMPANY_EMAIL=hello@kdaanalytics.ai

# OR for SendGrid (recommended for production):
SENDGRID_API_KEY=SG.xxxxxxxxxx
COMPANY_EMAIL=hello@kdaanalytics.ai
```

> **Gmail App Password setup:**
> 1. Go to [myaccount.google.com](https://myaccount.google.com)
> 2. Security → 2-Step Verification → Enable it
> 3. Search "App passwords" → Create one for "Mail"
> 4. Use that 16-character password as `SMTP_PASSWORD`

#### Step 4 — Set up the React frontend

Open a **second terminal** in VS Code (click `+` in the terminal panel):

```bash
# Navigate to frontend folder
cd frontend

# Install Node dependencies
npm install
```

#### Step 5 — Run both servers

**Backend** (in the first terminal, inside `backend/` with venv active):
```bash
uvicorn app.main:app --reload --port 8000
```
→ API running at `http://localhost:8000`
→ API docs at `http://localhost:8000/api/docs`

**Frontend** (in the second terminal, inside `frontend/`):
```bash
npm run dev
```
→ Website running at `http://localhost:5173`

The Vite dev server automatically **proxies** all `/api/` requests to the FastAPI backend — no CORS issues.

#### Step 6 — Open the website

```
http://localhost:5173
```

---

### Using VS Code Debugger

The project includes pre-configured debug setups in `.vscode/launch.json`.

**To debug the FastAPI backend:**
1. Press `F5` or go to **Run → Start Debugging**
2. Select **"🐍 FastAPI Backend (uvicorn)"**
3. Set breakpoints anywhere in `backend/app/` by clicking the left margin
4. Submit the contact form — execution will pause at your breakpoint

**To run tests with the debugger:**
1. Press `F5` → select **"🧪 Run Backend Tests (pytest)"**
2. See all 36 tests run with full output in the Debug Console

---

### Testing the API with REST Client

The file `.vscode/api-tests.http` lets you test the API directly inside VS Code:

1. Open `.vscode/api-tests.http`
2. You'll see **"Send Request"** links above each request
3. Click **Send Request** on any block
4. Response appears in a split pane on the right

---

## 📧 Email Configuration

The contact form supports three delivery methods (tried in order):

### Method A — SendGrid (Best for production)
```env
SENDGRID_API_KEY=SG.your-key-here
SENDGRID_FROM_EMAIL=hello@kdaanalytics.ai
COMPANY_EMAIL=hello@kdaanalytics.ai
```
Sign up free at [sendgrid.com](https://sendgrid.com) — 100 emails/day free tier.

### Method B — SMTP / Gmail
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=yourname@gmail.com
SMTP_PASSWORD=xxxx-xxxx-xxxx-xxxx    # App Password
COMPANY_EMAIL=hello@kdaanalytics.ai
```

### Method C — Twilio SMS/WhatsApp Alert (Optional)
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_FROM_NUMBER=whatsapp:+14155238886
TWILIO_TO_NUMBER=whatsapp:+91XXXXXXXXXX
```

---

## 🧪 Running Tests

```bash
cd backend

# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ -v --cov=app --cov-report=term-missing
```

**All 36 tests pass**, covering:
- Health endpoint
- Valid contact submissions (multiple interest types)
- Validation errors (missing fields, bad email, short/long message)
- XSS sanitisation
- Admin endpoint (auth + data integrity)
- SPA routing (all 8 routes)
- CORS headers + OPTIONS preflight

---

## 🌐 Page Routes

| URL | Page | Notes |
|-----|------|-------|
| `/` | Home | Hero, marquee, features, services, process, business CTA |
| `/features` | Features | 6 platform feature cards |
| `/services` | Services | 4 clickable service tiles |
| `/services/market-research` | Service Detail | Dynamic detail page |
| `/services/startup-scouting` | Service Detail | Dynamic detail page |
| `/services/ai-strategy-consulting` | Service Detail | Dynamic detail page |
| `/services/api-data-licensing` | Service Detail | Dynamic detail page |
| `/for-business` | For Business | 4 clickable engagement tiles |
| `/for-business/enterprise-strategy` | Business Detail | Dynamic detail page |
| `/for-business/investors-funds` | Business Detail | Dynamic detail page |
| `/for-business/startups-founders` | Business Detail | Dynamic detail page |
| `/for-business/api-data-partners` | Business Detail | Dynamic detail page |
| `/contact` | Contact | Form → POST /api/v1/contact |

---

## 🐳 Option 3 — Docker (Production-like)

```bash
# 1. Add TLS certs (skip for local testing)
# mkdir -p infra/nginx/ssl

# 2. Configure backend env
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials

# 3. Build and start all containers
docker compose up --build

# 4. Open browser
# http://localhost
```

---

## 🔑 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, React Router v6 |
| Styling | CSS Modules, Google Fonts (Syne + DM Sans) |
| Backend | Python 3, FastAPI, Pydantic v2 |
| Quick-start | Flask (stdlib only — for zero-install demo) |
| Email | SMTP (smtplib) + SendGrid HTTP API |
| SMS/WhatsApp | Twilio (optional) |
| Infrastructure | Docker, Docker Compose, Nginx |
| CI/CD | GitHub Actions |
| Rate Limiting | slowapi (per-IP, per-route) |

---

## 🔒 Security Features

- HTML escaping on all user inputs (XSS prevention)
- Email regex validation + Pydantic type checking
- Rate limiting: 5 submissions/hour per IP
- CORS restricted to configured origins
- Nginx: HSTS, X-Frame-Options, X-Content-Type-Options headers
- Docker: non-root user in backend container
- Secrets in `.env` only — never committed to git

---

## 💡 Common Issues & Fixes

| Problem | Fix |
|---------|-----|
| `command not found: python` | Use `python3` instead, or install Python 3 |
| `pip: command not found` | Use `pip3` or `python3 -m pip` |
| Port 8000 already in use | `lsof -i :8000` then `kill -9 <PID>` |
| Port 5173 already in use | Edit `vite.config.ts` → change port |
| Gmail authentication error | Make sure you're using App Password, not your real password |
| CORS error in browser | Make sure FastAPI is running on port 8000 |
| `ModuleNotFoundError` | Make sure your venv is activated and you ran `pip install -r requirements.txt` |

---

MIT © 2026 KDA Analytics · hello@kdaanalytics.ai

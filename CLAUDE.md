# KDA Analytics Web — Project Guide

## Branching & Deployment SOP

**Never commit directly to `main`.** All work flows through feature branches and Pull Requests.

### Workflow for every change

1. **Create a branch** off the latest `main`:
   ```
   git checkout main && git pull
   git checkout -b <type>/<short-description>
   # e.g. feat/add-newsletter-form, fix/contact-validation, chore/update-deps
   ```

2. **Make changes** on the feature branch.

3. **Run tests locally** before pushing:
   ```
   cd backend && pytest tests/ -v
   cd frontend && npm run build
   ```

4. **Push the branch** — GitHub Actions will automatically run the full test suite on it.

5. **Open a Pull Request** targeting `main`. Fill in the PR template. Wait for CI to pass.

6. **Get approval** — the repository owner reviews and approves the PR.

7. **Merge** — after approval and green CI, merge to `main`. GitHub Actions will then automatically deploy to Render.

### Branch naming conventions

| Prefix | Use for |
|--------|---------|
| `feat/` | New features |
| `fix/` | Bug fixes |
| `chore/` | Dependency updates, config, tooling |
| `refactor/` | Code restructuring with no behaviour change |
| `docs/` | Documentation only |

## Project Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + TypeScript + Vite |
| Backend | Python FastAPI + Uvicorn |
| Tests | pytest + pytest-asyncio |
| Infra | Docker + Nginx + Docker Compose |
| Hosting | Render.com (backend), Cloudflare Pages (frontend) |
| CI/CD | GitHub Actions (`.github/workflows/deploy.yml`) |

## Running locally

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev

# Full stack (Docker)
docker-compose up --build
```

## Running tests

```bash
cd backend
pytest tests/ -v
pytest tests/ -v --tb=short    # compact output
```

## CI/CD pipeline

Defined in `.github/workflows/deploy.yml`:

- **Every branch push** → runs Python tests + React build
- **PR to main** → same checks, required to pass before merge
- **Push to main** (post-merge) → runs checks, then triggers Render deploy hook if all pass

Render deploy hook URL is stored as the GitHub secret `RENDER_DEPLOY_HOOK_URL`.

# KDA Analytics Web — Deployment Instructions

## Local Execution

### Option A — Quickest (60 seconds, Python only)

```bash
pip install flask
cd run-local
python server.py
# → http://localhost:5000
```

> Uses in-memory lead storage (lost on restart), no hot-reload.

---

### Option B — Full Stack Dev Mode (Recommended)

**Terminal 1 — Backend**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
# → http://localhost:8000  |  Swagger: http://localhost:8000/docs
```

**Terminal 2 — Frontend**
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173  (auto-proxies /api → backend)
```

**Required env vars in `backend/.env`:**

| Variable | Purpose |
|---|---|
| `SMTP_HOST` / `SMTP_USERNAME` / `SMTP_PASSWORD` | Email delivery for contact form |
| `COMPANY_EMAIL` | Inbox that receives leads |
| `SENDGRID_API_KEY` | Optional — better deliverability |
| `TWILIO_*` | Optional — WhatsApp/SMS alerts |
| `ENVIRONMENT` | Set to `development` locally |

---

### Option C — Docker Compose (Production-like)

```bash
# Edit backend/.env with real credentials first
docker compose up --build
# → http://localhost
```

---

## Basic AWS Deployment (Low Cost — ~$9–11/month)

**Best for:** Launch phase, low traffic, single server setup.

### Architecture

```
Internet → Route 53 (DNS) → EC2 t3.micro
                               └── Docker Compose
                                     ├── Nginx (ports 80/443, Let's Encrypt SSL)
                                     ├── FastAPI backend (port 8000, internal)
                                     └── React SPA (Nginx, internal)
```

### AWS Services Used

| Service | Purpose | Cost |
|---|---|---|
| EC2 t3.micro | Single server running Docker Compose | ~$8.47/month (t2.micro free 12mo) |
| Elastic IP | Static public IP address | Free (when attached) |
| Route 53 | DNS for kdaanalytics.ai | ~$0.50/month |
| Docker Hub | Free image registry (already in CI/CD) | Free |
| Let's Encrypt | SSL/TLS certificate | Free |
| **Total** | | **~$9–11/month** |

### Step-by-Step Setup

#### Step 1 — Launch EC2 Instance
- AMI: **Ubuntu 22.04 LTS** (recommended) or Amazon Linux 2023
- Instance type: **t2.micro** (free tier, 12 months) or **t3.micro** ($8.47/mo)
- Key pair: Create and download `kda-key.pem`
- Security group inbound rules:
  - SSH: port 22 from your IP only
  - HTTP: port 80 from anywhere (0.0.0.0/0)
  - HTTPS: port 443 from anywhere (0.0.0.0/0)
- Storage: 20 GB gp3 (default is enough)

#### Step 2 — Allocate Elastic IP
- EC2 → Elastic IPs → Allocate → Associate to your instance
- Note the public IP (e.g. `13.x.x.x`) — used for DNS

#### Step 3 — Point Domain to EC2
- In Route 53 (or your domain registrar):
  - `kdaanalytics.ai` → A record → `<elastic-ip>`
  - `www.kdaanalytics.ai` → A record → `<elastic-ip>`
- Wait 5–10 minutes for DNS to propagate

#### Step 4 — Install Docker on EC2

```bash
ssh -i kda-key.pem ubuntu@<elastic-ip>

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker ubuntu
newgrp docker

# Install Docker Compose plugin
sudo apt-get install -y docker-compose-plugin
docker compose version   # verify
```

#### Step 5 — Set Up App Directory

```bash
sudo mkdir -p /opt/kda-analytics
sudo chown ubuntu:ubuntu /opt/kda-analytics
cd /opt/kda-analytics

# Copy docker-compose.yml from repo (paste contents or use scp)
# The GitHub Actions deploy will pull images and run compose from here
```

#### Step 6 — Get SSL Certificate (Let's Encrypt)

```bash
sudo apt-get install -y certbot

# Stop any service on port 80 first, then:
sudo certbot certonly --standalone \
  -d kdaanalytics.ai \
  -d www.kdaanalytics.ai \
  --email hello@kdaanalytics.ai \
  --agree-tos --non-interactive

# Certs saved to:
# /etc/letsencrypt/live/kdaanalytics.ai/fullchain.pem
# /etc/letsencrypt/live/kdaanalytics.ai/privkey.pem

# Auto-renew (add to cron):
echo "0 3 * * * certbot renew --quiet" | sudo crontab -
```

Update `docker-compose.yml` to mount the Let's Encrypt certs into the nginx container:
```yaml
volumes:
  - /etc/letsencrypt:/etc/letsencrypt:ro
```

Update `infra/nginx/nginx.conf` SSL cert paths:
```nginx
ssl_certificate     /etc/letsencrypt/live/kdaanalytics.ai/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/kdaanalytics.ai/privkey.pem;
```

#### Step 7 — Create `.env` on the Server

```bash
nano /opt/kda-analytics/backend.env
# Paste your production env vars:
# ENVIRONMENT=production
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USERNAME=...
# SMTP_PASSWORD=...
# COMPANY_EMAIL=hello@kdaanalytics.ai
# SENDGRID_API_KEY=...  (optional)
```

Update `docker-compose.yml` `env_file` path to `/opt/kda-analytics/backend.env`.

#### Step 8 — Set GitHub Actions Secrets

In GitHub → Settings → Secrets → Actions:

| Secret | Value |
|---|---|
| `DOCKER_USERNAME` | Your Docker Hub username |
| `DOCKER_PASSWORD` | Your Docker Hub password or PAT |
| `DEPLOY_HOST` | Your Elastic IP (e.g. `13.x.x.x`) |
| `DEPLOY_USER` | `ubuntu` |
| `DEPLOY_SSH_KEY` | Contents of `kda-key.pem` |

#### Step 9 — First Deploy

```bash
# Push to main branch
git push origin main

# GitHub Actions will:
# 1. Run pytest (36 backend tests)
# 2. Build React app (npm run build)
# 3. Build + push Docker images to Docker Hub
# 4. SSH into EC2 → docker compose pull + up
```

Watch it at: GitHub → Actions tab → KDA Analytics — CI/CD

#### Step 10 — Verify

```bash
# From your machine:
curl https://kdaanalytics.ai/api/v1/health
# → {"status": "healthy", ...}

# Website loads at https://kdaanalytics.ai
# Contact form submits → email received at COMPANY_EMAIL
```

---

## Scaled AWS Deployment (Production-Grade — ~$40–50/month)

Upgrade to this when traffic grows, uptime SLA matters, or you need zero-downtime deploys.

### Architecture

```
Internet
   │
   ▼
AWS WAF (DDoS + rate limiting)
   │
   ▼
Amazon CloudFront (CDN, 400+ edge locations)
   ├── Static assets → S3 (React SPA)
   └── /api/* → Application Load Balancer
                       │
                       ▼
                Amazon ECS Fargate
                (FastAPI, auto-scale 1–10 tasks)
                       │
                AWS Secrets Manager (env vars)
                Amazon SES (email)
                CloudWatch (logs + alerts)
```

### AWS Services

| Service | Purpose | Cost/month |
|---|---|---|
| Amazon S3 | Host React SPA | ~$0.50 |
| Amazon CloudFront | Global CDN + API routing | ~$2–5 |
| AWS WAF | DDoS + bot protection | ~$5 |
| ECS Fargate (2 tasks) | FastAPI backend | ~$15–20 |
| Application Load Balancer | Route to ECS | ~$16 |
| Amazon ECR | Private Docker registry | ~$0.50 |
| Amazon Route 53 | DNS | ~$0.50 |
| AWS Certificate Manager | SSL/TLS (free) | $0 |
| Amazon SES | Email (1k/month) | ~$0.10 |
| AWS Secrets Manager | Env vars | ~$0.40 |
| Amazon CloudWatch | Logs + metrics | ~$2–5 |
| **Total** | | **~$42–52/month** |

### Migration Path from Basic → Scaled

1. **Frontend:** `npm run build` → `aws s3 sync dist/ s3://kdaanalytics-web` → create CloudFront distribution
2. **Backend:** Push Docker image to ECR → create ECS Fargate cluster + task definition → set up ALB target group
3. **DNS:** Update Route 53 A record from EC2 Elastic IP → CloudFront distribution domain
4. **Secrets:** Migrate `backend.env` from EC2 file → AWS Secrets Manager
5. **Email:** Verify domain in SES → update SMTP settings to SES endpoint
6. **CI/CD:** Update `.github/workflows/deploy.yml` — swap Docker Hub + SSH for ECR + ECS rolling deploy

### Updated CI/CD for Scaled Deployment

```yaml
- name: Push to ECR
  run: |
    aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_URI
    docker push $ECR_URI/kda-analytics-backend:${{ github.sha }}

- name: Deploy to ECS
  run: |
    aws ecs update-service \
      --cluster kda-analytics \
      --service kda-analytics-backend \
      --force-new-deployment

- name: Sync frontend to S3
  run: |
    aws s3 sync frontend/dist/ s3://kdaanalytics-web --delete
    aws cloudfront create-invalidation --distribution-id $CF_DIST_ID --paths "/*"
```

**GitHub Secrets needed:** `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `ECR_REGISTRY`, `CF_DISTRIBUTION_ID`

---

## Verification Checklist

### Local
- [ ] `cd backend && pytest tests/ -v` — all 36 tests pass
- [ ] `cd frontend && npm run build` — compiles without error
- [ ] Contact form submits and email arrives at `COMPANY_EMAIL`
- [ ] All 13 routes work including direct URL access (SPA routing)
- [ ] `GET /api/v1/health` returns `{"status": "healthy"}`

### Basic AWS Deployment
- [ ] `https://kdaanalytics.ai` loads the React SPA
- [ ] SSL lock icon visible (Let's Encrypt cert)
- [ ] `https://kdaanalytics.ai/api/v1/health` returns healthy
- [ ] Contact form submission triggers email
- [ ] GitHub Actions pipeline completes green on push to main
- [ ] Certbot auto-renew in crontab (`sudo crontab -l`)

### Scaled AWS Deployment
- [ ] CloudFront serves SPA from edge (check `X-Cache: Hit from cloudfront` header)
- [ ] ECS service shows 2 running tasks in AWS Console
- [ ] ALB target group shows healthy targets
- [ ] CloudWatch log group `/ecs/kda-analytics-backend` receiving logs
- [ ] Auto-scaling: load test triggers new task (use `hey` or `k6`)
- [ ] Zero-downtime deploy: push to main, watch ECS rolling update

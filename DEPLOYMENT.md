# Hostinger VPS Deployment Guide (Docker + Compose + Nginx + PostgreSQL + CI/CD)

## Architecture Overview

- **Nginx (`ftpcb_nginx`)**: Public reverse proxy on ports `80` / `443`. Routes `/api/v1/`, `/socket.io/`, `/uploads/`, `/api-docs`, and `/health` to the backend, and `/` to the Next.js standalone frontend. Supports 64 MB uploads (for 50 MB Gerber ZIPs) and WebSockets.
- **Frontend (`ftpcb_frontend`)**: Next.js 16 standalone server on internal port `3000`. Uses `INTERNAL_API_URL=http://backend:5000/api/v1` for SSR and `/api/v1` in the browser.
- **Backend (`ftpcb_backend`)**: Express 5 + Prisma 7 + Socket.IO API on internal port `5000`. Automatically syncs schema (`prisma db push`) and seeds initial Super Admin + catalog on boot.
- **PostgreSQL (`ftpcb_postgres`)**: PostgreSQL 16 Alpine with persistent volume `postgres_data`.
- **Network & Volumes**:
  - Network: `ftpcb_network` (bridge)
  - Volumes: `postgres_data`, `backend_uploads`, `nginx_logs`, `certbot_www`, `certbot_conf`

---

## 1. One-Time Hostinger VPS Setup

SSH into your Hostinger VPS (Ubuntu/Debian):

```bash
# Install Docker & Docker Compose plugin if not installed
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Clone repository into /opt/ftpcb
sudo mkdir -p /opt/ftpcb && sudo chown -R $USER:$USER /opt/ftpcb
git clone <YOUR_GITHUB_REPO_URL> /opt/ftpcb
cd /opt/ftpcb

# Create production .env from template and edit secrets/domain
cp .env.production.example .env
nano .env

# Build and start full stack
docker compose up -d --build
```

Verify everything is healthy:

```bash
docker compose ps
curl -i http://127.0.0.1/health
```

---

## 2. Enable Free HTTPS SSL (Let's Encrypt)

Once your domain DNS `A` record points to your Hostinger VPS IP:

```bash
chmod +x ./scripts/init-ssl.sh
./scripts/init-ssl.sh yourdomain.com admin@yourdomain.com
```

Then update `FRONTEND_URL=https://yourdomain.com` and `CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com` in `.env` and restart backend:

```bash
docker compose up -d backend
```

---

## 3. GitHub Actions CI/CD Secrets

In your GitHub repository → **Settings → Secrets and variables → Actions**, add:

| Secret | Value |
| --- | --- |
| `VPS_HOST` | Hostinger VPS public IP address |
| `VPS_USER` | SSH username (e.g. `root` or deploy user) |
| `VPS_SSH_KEY` | Private SSH key matching `~/.ssh/authorized_keys` on VPS |
| `VPS_PORT` | `22` (or custom SSH port) |
| `VPS_APP_DIR` | `/opt/ftpcb` (optional, defaults to `/opt/ftpcb`) |

Every push to `main` will automatically type-check/build both apps, validate `docker compose`, SSH into Hostinger, rebuild, restart containers with zero orphans, and verify `/health`.

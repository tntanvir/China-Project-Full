# Production Deployment Runbook (VPS + Docker Compose + PostgreSQL + Nginx + SSL + GitHub Actions CI/CD)

This is a complete, **self-contained, copy-paste-ready production deployment blueprint** for running a full-stack **Next.js (Frontend)** + **Express / Prisma / Socket.IO (Backend)** + **PostgreSQL 16** application behind an **Nginx reverse proxy with Let's Encrypt SSL** on a **VPS (AlmaLinux 10 / Ubuntu)** with **GitHub Actions CI/CD**.

You can reuse this `README.md` across other repositories as a standalone reference—**every required deployment file and its exact code is included verbatim below**.

---

## Table of Contents

1. [Architecture & CI/CD Flow](#1-architecture--cicd-flow)
2. [All Deployment Files (Exact Code)](#2-all-deployment-files-exact-code)
   - [2.1 `docker-compose.yml`](#21-docker-composeyml)
   - [2.2 `project-china-bakend/Dockerfile`](#22-project-china-bakenddockerfile)
   - [2.3 `project-china-bakend/.dockerignore`](#23-project-china-bakenddockerignore)
   - [2.4 `project-china-bakend/docker-entrypoint.sh`](#24-project-china-bakenddocker-entrypointsh)
   - [2.5 `project-china/Dockerfile`](#25-project-chinadockerfile)
   - [2.6 `project-china/.dockerignore`](#26-project-chinadockerignore)
   - [2.7 `nginx/nginx.conf`](#27-nginxnginxconf)
   - [2.8 `nginx/conf.d/default.conf`](#28-nginxconfddefaultconf)
   - [2.9 `nginx/conf.d/ssl.conf.template`](#29-nginxconfdsslconftemplate)
   - [2.10 `scripts/init-ssl.sh`](#210-scriptsinit-sslsh)
   - [2.11 `.env.production.example`](#211-envproductionexample)
   - [2.12 `.github/workflows/cicd.yml`](#212-githubworkflowscicdyml)
   - [2.13 Backend & Frontend Reverse-Proxy Compatibility Notes](#213-backend--frontend-reverse-proxy-compatibility-notes)
3. [Step 1: One-Time VPS Setup (AlmaLinux 10 & Ubuntu)](#3-step-1-one-time-vps-setup-almalinux-10--ubuntu)
4. [Step 2: Clone Repo & Configure Production `.env`](#4-step-2-clone-repo--configure-production-env)
5. [Step 3: Build & Start Docker Compose Stack](#5-step-3-build--start-docker-compose-stack)
6. [Step 4: Domain DNS & Free Let's Encrypt SSL (`https://`)](#6-step-4-domain-dns--free-lets-encrypt-ssl-https)
7. [Step 5: SSH Key & GitHub Actions CI/CD Setup](#7-step-5-ssh-key--github-actions-cicd-setup)
8. [Step 6: PostgreSQL & Super Admin Management](#8-step-6-postgresql--super-admin-management)
9. [Step 7: Day-2 Operations & Troubleshooting](#9-step-7-day-2-operations--troubleshooting)

---

## 1. Architecture & CI/CD Flow

### Production Container & Network Topology

```mermaid
flowchart LR
    User["User Browser / Mobile\n(https://ftpcb.com)"] -->|Ports 80 / 443| Nginx["ftpcb_nginx\n(nginx:1.27-alpine)"]

    subgraph ftpcb_network ["Docker Bridge Network: ftpcb_network"]
        Nginx -->|"/ , /_next/static/ , /api/download"| Frontend["ftpcb_frontend\nNext.js 16 Standalone (:3000)"]
        Nginx -->|"/api/v1/ , /socket.io/ , /uploads/ , /api-docs , /health"| Backend["ftpcb_backend\nExpress 5 + Prisma 7 + Socket.IO (:5000)"]
        Frontend -.->|"SSR INTERNAL_API_URL"| Backend
        Backend -->|":5432"| Postgres["ftpcb_postgres\nPostgreSQL 16 Alpine"]
        Certbot["ftpcb_certbot\n(--profile ssl)"] -.->|"ACME HTTP-01 Challenge"| Nginx
    end

    Postgres --- VolDB[("postgres_data")]
    Backend --- VolUp[("backend_uploads")]
    Nginx --- VolLogs[("nginx_logs")]
    Nginx --- VolCert[("certbot_conf / certbot_www")]
```

### GitHub Actions CI/CD Pipeline

```mermaid
flowchart LR
    Trigger["Push / PR to main\nor workflow_dispatch"] --> CI["Job 1: ci\nValidate & Build"]
    CI -->|"1. Backend: pnpm install, prisma generate, tsc, build"| CI2["2. Frontend: pnpm install, tsc, next build"]
    CI2 -->|"3. docker compose config --quiet"| Gate{"Push or Dispatch\non main?"}
    Gate -->|Yes| Deploy["Job 2: deploy\nSSH to VPS (/opt/ftpcb)"]
    Deploy -->|"Backup SSL nginx conf -> git reset --hard origin/main -> Restore SSL conf"| Build["docker compose build --pull\ndocker compose up -d --remove-orphans"]
    Build --> Health["Reload Nginx -> Check /nginx-health & /health -> docker image prune -f"]
```

---

## 2. All Deployment Files (Exact Code)

### 2.1 `docker-compose.yml`

Defines the 5 services (`postgres`, `backend`, `frontend`, `nginx`, and profile-gated `certbot`), the isolated bridge network `ftpcb_network`, and 5 persistent named volumes.

```yaml
services:
  # ============================================================================
  # 1. PostgreSQL 16 Database
  # ============================================================================
  postgres:
    image: postgres:16-alpine
    container_name: ftpcb_postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-changeme_strong_db_password}
      POSTGRES_DB: ${POSTGRES_DB:-chinaproject}
      PGDATA: /var/lib/postgresql/data/pgdata
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - ftpcb_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-postgres} -d ${POSTGRES_DB:-chinaproject}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 15s

  # ============================================================================
  # 2. Express + Prisma + Socket.IO Backend API
  # ============================================================================
  backend:
    build:
      context: ./project-china-bakend
      dockerfile: Dockerfile
    container_name: ftpcb_backend
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      NODE_ENV: production
      PORT: 5000
      DATABASE_URL: postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-changeme_strong_db_password}@postgres:5432/${POSTGRES_DB:-chinaproject}?schema=public
      FRONTEND_URL: ${FRONTEND_URL:-http://179.236.86.9}
      CORS_ORIGINS: ${CORS_ORIGINS:-http://179.236.86.9}
      COOKIE_SECURE: ${COOKIE_SECURE:-auto}
      JWT_SECRET: ${JWT_SECRET:-replace_with_64_char_random_hex}
      EXPIRES_IN: ${EXPIRES_IN:-1d}
      REFRESH_TOKEN_SECRET: ${REFRESH_TOKEN_SECRET:-replace_with_64_char_random_hex_refresh}
      REFRESH_TOKEN_EXPIRES_IN: ${REFRESH_TOKEN_EXPIRES_IN:-7d}
      RESET_PASS_TOKEN: ${RESET_PASS_TOKEN:-replace_with_64_char_random_hex_reset}
      RESET_PASS_TOKEN_EXPIRES_IN: ${RESET_PASS_TOKEN_EXPIRES_IN:-15m}
      SALT_ROUND: ${SALT_ROUND:-12}
      SUPER_ADMIN_EMAIL: ${SUPER_ADMIN_EMAIL:-admin@example.com}
      SUPER_ADMIN_PASSWORD: ${SUPER_ADMIN_PASSWORD:-securepassword123}
      CLOUDINARY_CLOUD_NAME: ${CLOUDINARY_CLOUD_NAME:-}
      CLOUDINARY_API_KEY: ${CLOUDINARY_API_KEY:-}
      CLOUDINARY_API_SECRET: ${CLOUDINARY_API_SECRET:-}
      STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY:-}
      STRIPE_WEBHOOK_SECRET: ${STRIPE_WEBHOOK_SECRET:-}
      PAYPAL_CLIENT_ID: ${PAYPAL_CLIENT_ID:-}
      PAYPAL_CLIENT_SECRET: ${PAYPAL_CLIENT_SECRET:-}
      PAYPAL_MODE: ${PAYPAL_MODE:-sandbox}
      EMAIL: ${SMTP_EMAIL:-}
      APP_PASS: ${SMTP_APP_PASS:-}
      RATE_LIMIT_WINDOW_MS: ${RATE_LIMIT_WINDOW_MS:-900000}
      RATE_LIMIT_MAX_REQUESTS: ${RATE_LIMIT_MAX_REQUESTS:-1000}
    volumes:
      - backend_uploads:/app/uploads
    expose:
      - "5000"
    networks:
      - ftpcb_network
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://127.0.0.1:5000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 35s

  # ============================================================================
  # 3. Next.js 16 Standalone Frontend
  # ============================================================================
  frontend:
    build:
      context: ./project-china
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL:-/api/v1}
        NEXT_PUBLIC_API_ORIGIN: ${NEXT_PUBLIC_API_ORIGIN:-}
        NEXT_PUBLIC_SOCKET_URL: ${NEXT_PUBLIC_SOCKET_URL:-same-origin}
    container_name: ftpcb_frontend
    restart: unless-stopped
    depends_on:
      backend:
        condition: service_healthy
    environment:
      NODE_ENV: production
      PORT: 3000
      HOSTNAME: 0.0.0.0
      INTERNAL_API_URL: http://backend:5000/api/v1
      INTERNAL_API_ORIGIN: http://backend:5000
      NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL:-/api/v1}
      NEXT_PUBLIC_API_ORIGIN: ${NEXT_PUBLIC_API_ORIGIN:-}
      NEXT_PUBLIC_SOCKET_URL: ${NEXT_PUBLIC_SOCKET_URL:-same-origin}
    expose:
      - "3000"
    networks:
      - ftpcb_network
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://127.0.0.1:3000/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 30s

  # ============================================================================
  # 4. Nginx Reverse Proxy (HTTP / HTTPS / WebSockets / Static Assets)
  # ============================================================================
  nginx:
    image: nginx:1.27-alpine
    container_name: ftpcb_nginx
    restart: unless-stopped
    depends_on:
      frontend:
        condition: service_healthy
      backend:
        condition: service_healthy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - certbot_www:/var/www/certbot:ro
      - certbot_conf:/etc/letsencrypt:ro
      - nginx_logs:/var/log/nginx
    networks:
      - ftpcb_network
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://127.0.0.1/nginx-health >/dev/null 2>&1 || exit 1"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s

  # ============================================================================
  # 5. Certbot (Let's Encrypt SSL - activated via `--profile ssl`)
  # ============================================================================
  certbot:
    image: certbot/certbot:latest
    container_name: ftpcb_certbot
    profiles: ["ssl"]
    volumes:
      - certbot_www:/var/www/certbot
      - certbot_conf:/etc/letsencrypt
    networks:
      - ftpcb_network

# ==============================================================================
# Persistent Named Volumes
# ==============================================================================
volumes:
  postgres_data:
    driver: local
  backend_uploads:
    driver: local
  nginx_logs:
    driver: local
  certbot_www:
    driver: local
  certbot_conf:
    driver: local

# ==============================================================================
# Isolated Docker Bridge Network
# ==============================================================================
networks:
  ftpcb_network:
    driver: bridge
    name: ftpcb_network
```

---

### 2.2 `project-china-bakend/Dockerfile`

Pins `pnpm@10.28.0`, disables pnpm 12 strict build errors (`npm_config_strict_dep_builds=false`), copies `prisma.config.ts` and `prisma/` before `pnpm install` (because `postinstall` runs `prisma generate`), builds TypeScript to `dist/`, and runs `docker-entrypoint.sh`.

```dockerfile
# syntax=docker/dockerfile:1

# ==============================================================================
# Stage 1: Install dependencies, generate Prisma Client & compile TypeScript
# ==============================================================================
FROM node:22-alpine AS builder
WORKDIR /app

ENV npm_config_strict_dep_builds=false
RUN corepack enable && corepack prepare pnpm@10.28.0 --activate

# Copy dependency manifests and Prisma schema before install (postinstall runs `prisma generate`)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml prisma.config.ts ./
COPY prisma ./prisma

# Provide placeholder DATABASE_URL for prisma.config.ts during client generation
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/chinaproject?schema=public"
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm exec prisma generate && pnpm run build

# ==============================================================================
# Stage 2: Production runtime
# ==============================================================================
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000
ENV npm_config_strict_dep_builds=false

RUN corepack enable && corepack prepare pnpm@10.28.0 --activate

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

RUN mkdir -p /app/uploads \
  && sed -i 's/\r$//' /usr/local/bin/docker-entrypoint.sh \
  && chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://127.0.0.1:5000/health >/dev/null 2>&1 || exit 1

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["node", "dist/server.js"]
```

---

### 2.3 `project-china-bakend/.dockerignore`

```gitignore
node_modules
dist
uploads/*
!uploads/.gitkeep
.git
.env
.env.*
*.log
*.docx
test-*.ts
test-payload.json
update-product-images.ts
verifyUser.ts
create-superuser.ts
*.tsbuildinfo
```

---

### 2.4 `project-china-bakend/docker-entrypoint.sh`

Retries PostgreSQL schema sync on startup before launching Express.

```sh
#!/bin/sh
set -e

echo "🔄 Syncing Prisma schema with PostgreSQL..."
MAX_RETRIES=15
RETRY_COUNT=0

until pnpm exec prisma db push --accept-data-loss; do
  RETRY_COUNT=$((RETRY_COUNT + 1))
  if [ "$RETRY_COUNT" -ge "$MAX_RETRIES" ]; then
    echo "❌ Failed to sync database after $MAX_RETRIES attempts."
    exit 1
  fi
  echo "⏳ PostgreSQL not ready yet (attempt $RETRY_COUNT/$MAX_RETRIES). Retrying in 3s..."
  sleep 3
done

echo "✅ Database schema synced successfully!"
echo "🚀 Starting backend API server..."
exec "$@"
```

---

### 2.5 `project-china/Dockerfile`

Builds Next.js with `output: "standalone"` (set in `next.config.ts`) and runs under a non-root `nextjs` user.

```dockerfile
# syntax=docker/dockerfile:1

# ==============================================================================
# Stage 1: Install dependencies & build Next.js standalone application
# ==============================================================================
FROM node:22-alpine AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV npm_config_strict_dep_builds=false
RUN corepack enable && corepack prepare pnpm@10.28.0 --activate

# Install dependencies cleanly using lockfile
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Copy application source
COPY . .

# Public client-side API & Socket URLs baked at build time
ARG NEXT_PUBLIC_API_URL=/api/v1
ARG NEXT_PUBLIC_API_ORIGIN=
ARG NEXT_PUBLIC_SOCKET_URL=same-origin

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_ORIGIN=$NEXT_PUBLIC_API_ORIGIN
ENV NEXT_PUBLIC_SOCKET_URL=$NEXT_PUBLIC_SOCKET_URL
ENV NODE_ENV=production

# Build standalone Next.js output
RUN pnpm run build

# ==============================================================================
# Stage 2: Minimal production runtime
# ==============================================================================
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Copy standalone build, static chunks, and public assets
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=25s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ >/dev/null 2>&1 || exit 1

CMD ["node", "server.js"]
```

---

### 2.6 `project-china/.dockerignore`

```gitignore
node_modules
.next
out
dist
.git
.env
.env.*
*.log
scratch
QA_AUDIT_REPORT.md
pdf_extracted_text.txt
FTpcb Company profile En.up3.pdf
*.tsbuildinfo
```

---

### 2.7 `nginx/nginx.conf`

```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 2048;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;

    # Allow large Gerber ZIP / BOM / PDF uploads (up to 64MB)
    client_max_body_size 64m;
    client_body_buffer_size 1m;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/rss+xml
        image/svg+xml;

    include /etc/nginx/conf.d/*.conf;
}
```

---

### 2.8 `nginx/conf.d/default.conf`

Initial HTTP reverse proxy configuration (replace `179.236.86.9` with your VPS IP when reusing on another server).

```nginx
upstream frontend_upstream {
    server frontend:3000;
    keepalive 32;
}

upstream backend_upstream {
    server backend:5000;
    keepalive 32;
}

server {
    listen 80;
    listen [::]:80;
    server_name 179.236.86.9 _;

    # Internal Nginx healthcheck endpoint
    location = /nginx-health {
        access_log off;
        return 200 "ok\n";
        add_header Content-Type text/plain;
    }

    # Let's Encrypt ACME HTTP-01 challenge
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Backend API routes
    location /api/v1/ {
        proxy_pass http://backend_upstream;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 180s;
        proxy_send_timeout 180s;
    }

    # Backend Health & Docs
    location = /health {
        proxy_pass http://backend_upstream/health;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api-docs {
        proxy_pass http://backend_upstream;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location = /docs {
        proxy_pass http://backend_upstream/docs;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # Backend persistent file uploads (Gerber files, invoices, etc.)
    location /uploads/ {
        proxy_pass http://backend_upstream/uploads/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;
    }

    # Socket.IO WebSocket & long-polling transport
    location /socket.io/ {
        proxy_pass http://backend_upstream/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }

    # Next.js static chunks (long browser cache)
    location /_next/static/ {
        proxy_pass http://frontend_upstream;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    # Next.js application (including Next.js own /api/download route)
    location / {
        proxy_pass http://frontend_upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 120s;
    }
}
```

---

### 2.9 `nginx/conf.d/ssl.conf.template`

HTTPS template used by `scripts/init-ssl.sh`. Keeps `/nginx-health`, `/health`, and `/.well-known/acme-challenge/` accessible over HTTP port `80` for CI/CD health checks and Certbot renewals while redirecting all user traffic to `https://`.

```nginx
# Replace YOUR_DOMAIN with your real domain (e.g., ftpcb.com) after running ./scripts/init-ssl.sh
upstream frontend_upstream {
    server frontend:3000;
    keepalive 32;
}

upstream backend_upstream {
    server backend:5000;
    keepalive 32;
}

server {
    listen 80;
    listen [::]:80;
    server_name YOUR_DOMAIN www.YOUR_DOMAIN;

    location = /nginx-health {
        access_log off;
        return 200 "ok\n";
        add_header Content-Type text/plain;
    }

    location = /health {
        proxy_pass http://backend_upstream/health;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name YOUR_DOMAIN www.YOUR_DOMAIN;

    ssl_certificate /etc/letsencrypt/live/YOUR_DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/YOUR_DOMAIN/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options SAMEORIGIN always;
    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;

    location /api/v1/ {
        proxy_pass http://backend_upstream;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 180s;
        proxy_send_timeout 180s;
    }

    location = /health {
        proxy_pass http://backend_upstream/health;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    location /api-docs {
        proxy_pass http://backend_upstream;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads/ {
        proxy_pass http://backend_upstream/uploads/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /socket.io/ {
        proxy_pass http://backend_upstream/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }

    location /_next/static/ {
        proxy_pass http://frontend_upstream;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    location / {
        proxy_pass http://frontend_upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 120s;
    }
}
```

---

### 2.10 `scripts/init-ssl.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "Usage: ./scripts/init-ssl.sh <domain.com> <email@domain.com>"
  exit 1
fi

DOMAIN="$1"
EMAIL="$2"

echo "🔐 Requesting Let's Encrypt certificate for $DOMAIN..."
docker compose --profile ssl run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  -d "$DOMAIN" \
  -d "www.$DOMAIN"

echo "📝 Generating HTTPS Nginx config from template..."
sed "s/YOUR_DOMAIN/$DOMAIN/g" ./nginx/conf.d/ssl.conf.template > ./nginx/conf.d/default.conf

echo "🔄 Reloading Nginx..."
docker compose exec nginx nginx -s reload

echo "✅ HTTPS enabled for https://$DOMAIN!"
```

---

### 2.11 `.env.production.example`

```env
# ==============================================================================
# Hostinger VPS Production Environment Variables (.env)
# Copy this file to `.env` in the repository root on your Hostinger VPS:
#   cp .env.production.example .env
# ==============================================================================

# --- PostgreSQL Database ---
POSTGRES_USER=postgres
POSTGRES_PASSWORD=replace_with_strong_postgres_password
POSTGRES_DB=chinaproject

# --- Public URLs & Reverse Proxy ---
# Active VPS IP configured; switch to https://yourdomain.com once SSL is enabled
FRONTEND_URL=http://179.236.86.9
CORS_ORIGINS=http://179.236.86.9,http://localhost
# Leave "auto" so Express sets Secure cookies automatically on HTTPS and works over HTTP IP
COOKIE_SECURE=auto

# Same-origin relative routing through Nginx (recommended for Docker + Nginx)
NEXT_PUBLIC_API_URL=/api/v1
NEXT_PUBLIC_API_ORIGIN=
NEXT_PUBLIC_SOCKET_URL=same-origin

# --- JWT Security (generate with: openssl rand -hex 32) ---
JWT_SECRET=replace_with_64_char_random_hex
EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=replace_with_64_char_random_hex_refresh
REFRESH_TOKEN_EXPIRES_IN=7d
RESET_PASS_TOKEN=replace_with_64_char_random_hex_reset
RESET_PASS_TOKEN_EXPIRES_IN=15m
SALT_ROUND=12

# --- Initial Super Admin Account (seeded automatically on first boot) ---
SUPER_ADMIN_EMAIL=admin@example.com
SUPER_ADMIN_PASSWORD=replace_with_strong_admin_password

# --- Cloudinary Media Storage (optional; falls back to /app/uploads volume) ---
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# --- Payment Gateways ---
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_MODE=sandbox

# --- SMTP Email Notifications ---
SMTP_EMAIL=
SMTP_APP_PASS=

# --- Rate Limiting ---
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
```

---

### 2.12 `.github/workflows/cicd.yml`

```yaml
name: CI/CD Pipeline (Hostinger VPS Docker Deploy)

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
  workflow_dispatch:

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  # ============================================================================
  # Job 1: Build, Typecheck & Validate Compose Configuration
  # ============================================================================
  ci:
    name: Validate & Build (Backend, Frontend, Docker)
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: "10.28.0"

      - name: Setup Node.js 22
        uses: actions/setup-node@v4
        with:
          node-version: "22"

      - name: Cache pnpm store
        uses: actions/cache@v4
        with:
          path: ~/.local/share/pnpm/store
          key: ${{ runner.os }}-pnpm-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-

      - name: Install & build Backend
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/chinaproject?schema=public
          npm_config_strict_dep_builds: "false"
        run: |
          pnpm --dir project-china-bakend install --frozen-lockfile
          pnpm --dir project-china-bakend exec prisma generate
          pnpm --dir project-china-bakend exec tsc --noEmit
          pnpm --dir project-china-bakend run build

      - name: Install & build Frontend
        env:
          NEXT_PUBLIC_API_URL: /api/v1
          NEXT_PUBLIC_SOCKET_URL: same-origin
          NEXT_TELEMETRY_DISABLED: "1"
          npm_config_strict_dep_builds: "false"
        run: |
          pnpm --dir project-china install --frozen-lockfile
          pnpm --dir project-china exec tsc --noEmit
          pnpm --dir project-china run build

      - name: Validate Docker Compose config
        run: docker compose config --quiet

  # ============================================================================
  # Job 2: Deploy to Hostinger VPS via SSH
  # ============================================================================
  deploy:
    name: Deploy to Hostinger VPS
    needs: ci
    if: (github.event_name == 'push' || github.event_name == 'workflow_dispatch') && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest

    steps:
      - name: Deploy containers on Hostinger VPS
        uses: appleboy/ssh-action@v1.2.0
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          port: ${{ secrets.VPS_PORT || '22' }}
          script_stop: true
          script: |
            set -e
            APP_DIR="${{ secrets.VPS_APP_DIR || '/opt/ftpcb' }}"
            cd "$APP_DIR"

            # Preserve active HTTPS Nginx config if SSL was provisioned on the VPS
            if grep -q "ssl_certificate" nginx/conf.d/default.conf 2>/dev/null; then
              cp nginx/conf.d/default.conf /tmp/ftpcb_nginx_ssl.conf.bak
            fi

            echo "📥 Pulling latest main branch..."
            git fetch origin main
            git reset --hard origin/main

            if [ -f /tmp/ftpcb_nginx_ssl.conf.bak ]; then
              mv /tmp/ftpcb_nginx_ssl.conf.bak nginx/conf.d/default.conf
              echo "🔒 Restored active HTTPS Nginx configuration."
            fi

            if [ ! -f .env ]; then
              echo "❌ Missing $APP_DIR/.env file on VPS! Copy .env.production.example to .env first."
              exit 1
            fi

            echo "🐳 Building and starting Docker Compose stack..."
            docker compose build --pull
            docker compose up -d --remove-orphans
            docker compose exec -T nginx nginx -s reload 2>/dev/null || true

            echo "⏳ Waiting for services to become healthy..."
            sleep 10
            docker compose ps

            echo "🩺 Running health checks..."
            curl -fsS http://127.0.0.1/nginx-health >/dev/null
            curl -fsS http://127.0.0.1/health >/dev/null

            echo "🧹 Pruning dangling Docker images..."
            docker image prune -f

            echo "✅ Hostinger VPS deployment complete!"
```

---

### 2.13 Backend & Frontend Reverse-Proxy Compatibility Notes

When reproducing this architecture on another repo, make sure your app code includes these 4 production behaviors (already configured in this repo):

1. **Express Trust Proxy & Health Endpoint (`src/app.ts`)**:
   ```ts
   app.set("trust proxy", 1);

   app.get("/health", (_req, res) => {
     res.status(200).json({ success: true, status: "ok", uptime: process.uptime(), timestamp: new Date().toISOString() });
   });
   ```
   Also read `CORS_ORIGINS` (comma-separated) alongside `FRONTEND_URL` in both Express CORS middleware and Socket.IO initialization (`src/app/shared/socket.ts`).

2. **Dynamic Secure Cookie Flag (`src/app/modules/auth/auth.controller.ts`)**:
   ```ts
   const isSecureCookie = (req: Request): boolean => {
     if (process.env.COOKIE_SECURE === "true") return true;
     if (process.env.COOKIE_SECURE === "false") return false;
     return req.secure || req.headers["x-forwarded-proto"] === "https";
   };
   ```
   Using `secure: isSecureCookie(req)` lets login cookies work on HTTP VPS IP before SSL and automatically enables `Secure` cookies once HTTPS is active.

3. **Next.js Standalone Output (`project-china/next.config.ts`)**:
   ```ts
   const nextConfig: NextConfig = {
     output: "standalone",
     // ...
   };
   ```

4. **Frontend SSR vs Browser URL Helper (`project-china/lib/api-config.ts`)**:
   ```ts
   export function getApiBaseUrl(): string {
     if (typeof window === "undefined") {
       return (process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1").replace(/\/+$/, "");
     }
     return (process.env.NEXT_PUBLIC_API_URL || "/api/v1").replace(/\/+$/, "");
   }
   ```
   Browsers call `/api/v1` (same-origin via Nginx), while Next.js SSR inside Docker calls `INTERNAL_API_URL=http://backend:5000/api/v1`.

---

## 3. Step 1: One-Time VPS Setup (AlmaLinux 10 & Ubuntu)

SSH into your VPS:

```bash
ssh root@YOUR_VPS_IP
```

### Option A: AlmaLinux 10 / Rocky / RHEL (Hostinger default — uses `dnf` & `firewalld`)

```bash
dnf install -y git nano openssl firewalld
curl -fsSL https://get.docker.com | sh
systemctl enable --now docker

systemctl enable --now firewalld
firewall-cmd --permanent --add-service=ssh
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload
firewall-cmd --list-services

# Stop any pre-installed web server so Nginx container can bind ports 80 & 443
systemctl disable --now nginx httpd 2>/dev/null || true
```

### Option B: Ubuntu / Debian (uses `apt` & `ufw`)

```bash
apt update && apt upgrade -y
apt install -y git curl nano openssl ufw ca-certificates
curl -fsSL https://get.docker.com | sh
systemctl enable --now docker

ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

systemctl disable --now nginx apache2 2>/dev/null || true
```

> **Hostinger hPanel Firewall:** Under **Hostinger hPanel → VPS → Firewall**, either leave it disabled (so OS `firewalld`/`ufw` handles traffic) or add **Allow** rules for TCP ports `22`, `80`, and `443`.

---

## 4. Step 2: Clone Repo & Configure Production `.env`

Clone directly into `/opt/ftpcb` (include the trailing `.` so `docker-compose.yml` sits at `/opt/ftpcb/docker-compose.yml`):

```bash
mkdir -p /opt/ftpcb
cd /opt/ftpcb
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git .
```

Generate 3 random 64-character hex secrets and configure `.env`:

```bash
cp .env.production.example .env
openssl rand -hex 32
openssl rand -hex 32
openssl rand -hex 32
nano .env
```

Minimum required values in `/opt/ftpcb/.env`:
- `POSTGRES_PASSWORD=` Strong password (avoid URL-reserved characters like `@` or `#` if unencoded)
- `FRONTEND_URL=` `http://YOUR_VPS_IP` (change to `https://yourdomain.com` after SSL)
- `CORS_ORIGINS=` `http://YOUR_VPS_IP,http://localhost` (change to `https://yourdomain.com,https://www.yourdomain.com` after SSL)
- `JWT_SECRET=`, `REFRESH_TOKEN_SECRET=`, `RESET_PASS_TOKEN=` Paste the 3 outputs from `openssl rand -hex 32`
- `SUPER_ADMIN_EMAIL=` & `SUPER_ADMIN_PASSWORD=` Initial Super Admin login credentials

Save and exit: `Ctrl + O` → `Enter` → `Ctrl + X`.

---

## 5. Step 3: Build & Start Docker Compose Stack

```bash
cd /opt/ftpcb
docker compose up -d --build
```

Verify every container is running and healthy:

```bash
docker compose ps
curl -i http://127.0.0.1/nginx-health
curl -i http://127.0.0.1/health
```

Open in your browser (using `http://`, **not** `https://` yet):
- `http://YOUR_VPS_IP`
- `http://YOUR_VPS_IP/api-docs`

---

## 6. Step 4: Domain DNS & Free Let's Encrypt SSL (`https://`)

### 6.1 Configure DNS in Hostinger hPanel
1. Go to **Hostinger hPanel → Domains → Your Domain → Manage → DNS / Nameservers**.
2. Select **Use Hostinger nameservers (Recommended)** (`ns1.dns-parking.com`, `ns2.dns-parking.com`).
3. If the domain was newly registered, click the **registrant email verification link** sent to your inbox (new domains show `NXDOMAIN` until verified).
4. Delete any existing `A`, `AAAA` (IPv6), or `www` `CNAME` records under **Manage DNS records**.
5. Add these 2 `A` records pointing to your VPS IP:

| Type | Name | Content / Value | TTL |
| :--- | :--- | :--- | :--- |
| `A` | `@` | `YOUR_VPS_IP` (e.g. `179.236.86.9`) | `14400` or `300` |
| `A` | `www` | `YOUR_VPS_IP` (e.g. `179.236.86.9`) | `14400` or `300` |

### 6.2 Verify DNS Propagation on VPS

```bash
getent ahostsv4 yourdomain.com www.yourdomain.com
```

Wait until both resolve to your VPS IP (`179.236.86.9`).

### 6.3 Issue SSL Certificate & Switch Backend to HTTPS

```bash
cd /opt/ftpcb
chmod +x ./scripts/init-ssl.sh
./scripts/init-ssl.sh yourdomain.com admin@yourdomain.com
```

Update `/opt/ftpcb/.env` with your HTTPS domain and recreate `backend`:

```bash
nano /opt/ftpcb/.env
# Update:
# FRONTEND_URL=https://yourdomain.com
# CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

docker compose up -d backend
curl -i https://yourdomain.com/health
```

### 6.4 Auto-Renew SSL Monthly via Cron

```bash
crontab -e
```
Add:
```cron
0 3 1 * * cd /opt/ftpcb && docker compose --profile ssl run --rm certbot renew --quiet && docker compose exec -T nginx nginx -s reload
```

---

## 7. Step 5: SSH Key & GitHub Actions CI/CD Setup

### 7.1 Generate a Dedicated SSH Deploy Key on VPS

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy -N ""
cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
cat ~/.ssh/github_deploy
```

Copy the entire private key output (`-----BEGIN OPENSSH PRIVATE KEY-----` to `-----END OPENSSH PRIVATE KEY-----`).

### 7.2 Add GitHub Repository Secrets

In GitHub: **Repository → Settings → Secrets and variables → Actions → New repository secret**:

| Secret Name | Value |
| :--- | :--- |
| `VPS_HOST` | `179.236.86.9` (your VPS IP) |
| `VPS_USER` | `root` (or your SSH deploy username) |
| `VPS_SSH_KEY` | Entire private key copied from `~/.ssh/github_deploy` |
| `VPS_PORT` | `22` |
| `VPS_APP_DIR` | `/opt/ftpcb` |

### 7.3 Trigger & Verify CI/CD
Push to `main` (or click **GitHub → Actions → CI/CD Pipeline → Run workflow** on branch `main`):
1. `Validate & Build (Backend, Frontend, Docker)` (`ci`) passes.
2. `Deploy to Hostinger VPS` (`deploy`) SSHs into your VPS, preserves your active HTTPS Nginx config, pulls `main`, rebuilds & restarts containers, checks `/nginx-health` and `/health`, and prunes old images.

---

## 8. Step 6: PostgreSQL & Super Admin Management

```bash
# View configured initial Super Admin credentials in .env
grep SUPER_ADMIN /opt/ftpcb/.env

# Inspect live admin/super-admin users in PostgreSQL
cd /opt/ftpcb
docker compose exec postgres psql -U postgres -d chinaproject \
  -c "SELECT email, name, role, status, \"isVerified\", \"createdAt\" FROM users WHERE role IN ('SUPER_ADMIN', 'ADMIN');"

# Update/reset Super Admin password directly in live PostgreSQL
docker compose exec backend node -e "
const bcrypt = require('bcryptjs');
const { prisma } = require('./dist/app/shared/prisma.js');
(async () => {
  const hash = await bcrypt.hash('NewStrongPassword123!', 12);
  const res = await prisma.user.updateMany({
    where: { email: 'admin@ftpcb.com' },
    data: { password: hash, isVerified: true, status: 'ACTIVE', role: 'SUPER_ADMIN' }
  });
  console.log('Updated:', res.count);
  await prisma.\$disconnect();
})();
"

# Backup PostgreSQL
docker compose exec -T postgres pg_dump -U postgres chinaproject > backup_$(date +%F).sql

# Restore PostgreSQL
cat backup_2026-11-27.sql | docker compose exec -T postgres psql -U postgres -d chinaproject
```

---

## 9. Step 7: Day-2 Operations & Troubleshooting

### Common Operations (from `/opt/ftpcb`)

```bash
docker compose ps                         # Check container status & health
docker compose logs -f backend            # Tail backend logs
docker compose logs -f frontend           # Tail frontend logs
docker compose logs -f nginx              # Tail nginx logs
docker compose logs -f postgres           # Tail PostgreSQL logs
docker compose restart backend            # Restart backend service
docker compose up -d --build              # Rebuild & recreate changed containers
docker system prune -f                    # Remove unused Docker images/cache
```

### Troubleshooting Checklist

| Symptom | Cause | Fix |
| :--- | :--- | :--- |
| `apt: command not found` / `ufw: command not found` | VPS runs **AlmaLinux / RHEL** instead of Ubuntu | Use `dnf` and `firewall-cmd` (see [Section 3 Option A](#option-a-almalinux-10--rocky--rhel-hostinger-default--uses-dnf--firewalld)). |
| `no configuration file provided: not found` | Cloned without trailing `.` (files inside subfolder) | `mv <repo-folder>/* <repo-folder>/.[!.]* . && rmdir <repo-folder>` |
| `ERR_PNPM_IGNORED_BUILDS` during Docker build | pnpm 12 defaults `strictDepBuilds: true` | Pin `pnpm@10.28.0` and set `ENV npm_config_strict_dep_builds=false`. |
| `Could not find Prisma Schema` in `postinstall` | `prisma/` copied after `pnpm install` | Copy `prisma.config.ts` and `prisma/` before `RUN pnpm install --frozen-lockfile`. |
| Certbot `NXDOMAIN` | Domain unverified or DNS `A` records not set/propagated | Verify domain email, set `A` for `@` & `www` to VPS IP, remove `AAAA`, test with `getent ahostsv4`. |
| Certbot `Timeout during connect` on wrong IP | Domain still points to another server IP | Update `A` records to your actual VPS IP (`179.236.86.9`). |
| `port 80 already in use` | Host Nginx/Apache running outside Docker | `systemctl disable --now nginx httpd apache2 2>/dev/null \|\| true` |
| Login fails over HTTP IP before SSL | `cookie.secure: true` blocks cookies on HTTP | Set `COOKIE_SECURE=auto` + `app.set("trust proxy", 1)` in Express. |

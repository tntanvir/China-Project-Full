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

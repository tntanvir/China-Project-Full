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

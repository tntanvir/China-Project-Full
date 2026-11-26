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

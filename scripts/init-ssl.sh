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

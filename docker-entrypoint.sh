#!/bin/sh
set -e

echo "Running database migrations..."

MAX_RETRIES=10
RETRY=0
until node /app/scripts/migrate.mjs; do
  RETRY=$((RETRY + 1))
  if [ $RETRY -ge $MAX_RETRIES ]; then
    echo "Migrations failed after $MAX_RETRIES attempts. Exiting."
    exit 1
  fi
  echo "Migration failed (attempt $RETRY/$MAX_RETRIES). Retrying in 5s..."
  sleep 5
done

echo "Starting Next.js server..."
exec node server.js

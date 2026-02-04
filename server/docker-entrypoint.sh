#!/bin/sh
set -e

# Create data directory if it doesn't exist
mkdir -p /app/data

# Run database migrations
npx prisma db push --skip-generate

# Start the server
exec npm run start

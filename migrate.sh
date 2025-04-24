#!/bin/bash

set -e

echo "Starting database migration..."

# Wait for database to be ready
echo "Waiting for database to be ready..."
while ! npx prisma db push --accept-data-loss --skip-generate; do
  echo "Database not ready yet. Retrying in 5 seconds..."
  sleep 5
done

# Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate

# Deploy database changes
echo "Deploying database changes..."
npx prisma db push --accept-data-loss

echo "Migration completed successfully!"

# Seed the database if needed
# echo "Seeding the database..."
# npx prisma db seed 
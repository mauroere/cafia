#!/bin/bash

set -e

echo "Starting database migration..."

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
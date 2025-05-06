#!/bin/bash

set -e

echo "Starting database migration..."

# Wait for database to be ready
echo "Waiting for database to be ready..."
max_attempts=30
attempt=1
while [ $attempt -le $max_attempts ]; do
  if npx prisma db push --accept-data-loss --skip-generate; then
    echo "Database is ready!"
    break
  fi
  echo "Attempt $attempt of $max_attempts: Database not ready yet. Retrying in 5 seconds..."
  sleep 5
  attempt=$((attempt + 1))
done

if [ $attempt -gt $max_attempts ]; then
  echo "Failed to connect to database after $max_attempts attempts"
  exit 1
fi

# Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate

# Deploy database changes
echo "Deploying database changes..."
npx prisma db push --accept-data-loss

# Verify the database connection
echo "Verifying database connection..."
npx prisma db execute --stdin <<< "SELECT 1" || {
  echo "Failed to verify database connection"
  exit 1
}

echo "Migration completed successfully!"

# Seed the database if needed
# echo "Seeding the database..."
# npx prisma db seed 
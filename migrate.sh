#!/bin/bash

set -e

echo "=== Iniciando proceso de migración ==="

# Verificar que las variables de entorno necesarias estén configuradas
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL no está configurada"
  exit 1
fi

# Run database connection check
echo "=== Ejecutando diagnóstico de base de datos ==="
node scripts/db-check.js

if [ $? -ne 0 ]; then
  echo "❌ El diagnóstico de la base de datos falló"
  exit 1
fi

# Wait for database to be ready
echo "=== Esperando que la base de datos esté lista ==="
max_attempts=30
attempt=1
while [ $attempt -le $max_attempts ]; do
  if npx prisma db push --accept-data-loss --skip-generate; then
    echo "✅ Base de datos lista!"
    break
  fi
  echo "Intento $attempt de $max_attempts: Base de datos no está lista. Reintentando en 5 segundos..."
  sleep 5
  attempt=$((attempt + 1))
done

if [ $attempt -gt $max_attempts ]; then
  echo "❌ No se pudo conectar a la base de datos después de $max_attempts intentos"
  exit 1
fi

# Generate Prisma Client
echo "=== Generando Prisma Client ==="
npx prisma generate

# Deploy database changes
echo "=== Aplicando cambios en la base de datos ==="
npx prisma db push --accept-data-loss

# Verify the database connection
echo "=== Verificando conexión final ==="
npx prisma db execute --stdin <<< "SELECT 1" || {
  echo "❌ Falló la verificación final de la conexión"
  exit 1
}

# Create migrations directory if it doesn't exist
mkdir -p prisma/migrations

# Verify Prisma Client generation
if [ ! -f "node_modules/.prisma/client/index.js" ]; then
  echo "❌ Prisma Client no se generó correctamente"
  exit 1
fi

echo "✅ Migración completada exitosamente!"

# Seed the database if needed
# echo "Seeding the database..."
# npx prisma db seed 
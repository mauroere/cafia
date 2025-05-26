#!/bin/bash

echo "=== Cafia Deployment Check Script ==="
echo "Date: $(date)"

# Verificar variables de entorno
echo -e "\n=== Environment Variables Check ==="
required_vars=("DATABASE_URL" "NEXTAUTH_SECRET" "NEXTAUTH_URL" "NEXT_PUBLIC_APP_URL")
missing_vars=()

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ $var is not set"
    missing_vars+=("$var")
  else
    echo "✅ $var is set"
  fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
  echo -e "\n⚠️ Warning: Missing required environment variables: ${missing_vars[*]}"
else
  echo -e "\n✅ All required environment variables are set"
fi

# Verificar servicio web
echo -e "\n=== Web Service Check ==="
if [ -n "$RAILWAY_STATIC_URL" ]; then
  health_url="https://${RAILWAY_STATIC_URL}/api/health"
  echo "Health URL: $health_url"
  
  response=$(curl -s -o /dev/null -w "%{http_code}" "$health_url")
  
  if [ "$response" -eq 200 ]; then
    echo "✅ Health endpoint is accessible (HTTP 200)"
    health_data=$(curl -s "$health_url")
    echo "Health data: $health_data"
  else
    echo "❌ Health endpoint returned HTTP $response"
  fi
else
  echo "❌ RAILWAY_STATIC_URL is not set, cannot check health endpoint"
fi

# Verificar base de datos
echo -e "\n=== Database Check ==="
if [ -n "$DATABASE_URL" ]; then
  # Extraer host y puerto de DATABASE_URL
  db_host=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\).*/\1/p')
  db_port=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
  
  echo "Database host: $db_host"
  echo "Database port: $db_port"
  
  if command -v nc &> /dev/null; then
    if nc -z -w 5 "$db_host" "$db_port"; then
      echo "✅ Database port is open"
    else
      echo "❌ Cannot connect to database port"
    fi
  else
    echo "⚠️ 'nc' command not available, skipping port check"
  fi
else
  echo "❌ DATABASE_URL is not set, cannot check database"
fi

echo -e "\n=== Deployment Check Complete ==="

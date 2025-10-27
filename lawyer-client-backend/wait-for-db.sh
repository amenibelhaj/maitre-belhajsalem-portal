#!/bin/sh

# wait-for-db.sh
# Usage: ./wait-for-db.sh <host> <port> <command> <args>

set -e

host="$1"
port="$2"
shift 2

echo "⏳ Waiting for Postgres at $host:$port..."

# Loop until Postgres is ready
until pg_isready -h "$host" -p "$port" > /dev/null 2>&1; do
  echo "Waiting for Postgres at $host:$port..."
  sleep 2
done

echo "✅ Postgres is ready, starting application..."
exec "$@"

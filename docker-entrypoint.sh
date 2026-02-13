#!/bin/sh
set -e

echo "⚡ Starting Riot Stats Hub..."

# Start Express API in background
cd /app/server
node index.js &

# Start Nginx in foreground
nginx -g "daemon off;"

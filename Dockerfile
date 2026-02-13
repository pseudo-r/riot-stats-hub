# ═══════════════════════════════════════════════════════
# Stage 1: Build the React frontend
# ═══════════════════════════════════════════════════════
FROM node:20-alpine AS frontend-build

WORKDIR /app

# Install frontend deps
COPY package.json package-lock.json ./
RUN npm ci

# Build production bundle
COPY index.html vite.config.js ./
COPY src/ ./src/
RUN npm run build

# ═══════════════════════════════════════════════════════
# Stage 2: Production image with Nginx + Express
# ═══════════════════════════════════════════════════════
FROM node:20-alpine

RUN apk add --no-cache nginx

WORKDIR /app

# Install server deps
COPY server/package.json server/package-lock.json* ./server/
RUN cd server && npm ci --omit=dev

# Copy server source
COPY server/ ./server/

# Copy built frontend from Stage 1
COPY --from=frontend-build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/http.d/default.conf

# Expose ports
EXPOSE 80

# Start both nginx and express
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

CMD ["/docker-entrypoint.sh"]

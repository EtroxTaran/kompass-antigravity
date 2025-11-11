# Multi-stage build for production-ready React PWA with nginx
# Security: Non-root user, security headers, minimal image

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/shared/package.json ./packages/shared/

# Install pnpm
RUN npm install -g pnpm@8.15.0

# Install dependencies (frozen lockfile for reproducible builds)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/frontend ./apps/frontend
COPY packages/shared ./packages/shared
COPY tsconfig.json ./

# Build shared package first
RUN pnpm --filter @kompass/shared build

# Build frontend
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
RUN pnpm --filter @kompass/frontend build

# Stage 2: Production with nginx
FROM nginx:1.25-alpine AS production

# Install dumb-init for signal handling
RUN apk add --no-cache dumb-init

# Create non-root user for nginx
RUN addgroup -g 1001 -S nginx-user && \
    adduser -S nginx-user -u 1001 -G nginx-user

# Copy built assets
COPY --from=builder --chown=nginx-user:nginx-user /app/apps/frontend/dist /usr/share/nginx/html

# Copy nginx configuration with security headers
COPY apps/frontend/nginx.conf /etc/nginx/nginx.conf

# Set up nginx to run as non-root
RUN touch /var/run/nginx.pid && \
    chown -R nginx-user:nginx-user /var/run/nginx.pid && \
    chown -R nginx-user:nginx-user /var/cache/nginx && \
    chown -R nginx-user:nginx-user /var/log/nginx && \
    chown -R nginx-user:nginx-user /etc/nginx/conf.d

# Switch to non-root user
USER nginx-user

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Use dumb-init
ENTRYPOINT ["dumb-init", "--"]

# Start nginx
CMD ["nginx", "-g", "daemon off;"]


#!/bin/bash

###############################################################################
# Development Environment Setup Script for KOMPASS
#
# Usage: ./scripts/setup-dev.sh
#
# This script:
# - Installs all dependencies
# - Sets up git hooks
# - Initializes databases
# - Configures environment variables
# - Runs initial checks
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                              ║${NC}"
echo -e "${BLUE}║          KOMPASS Development Setup                           ║${NC}"
echo -e "${BLUE}║                                                              ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js not found${NC}"
    echo "Please install Node.js 20+ from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo -e "${RED}Error: Node.js version 20+ required (found: v${NODE_VERSION})${NC}"
    exit 1
fi
echo -e "${GREEN}  ✓ Node.js $(node -v)${NC}"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}  pnpm not found, installing...${NC}"
    npm install -g pnpm@8.15.0
fi
echo -e "${GREEN}  ✓ pnpm $(pnpm -v)${NC}"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}  ⚠ Docker not found (optional for local development)${NC}"
else
    echo -e "${GREEN}  ✓ Docker $(docker --version | cut -d' ' -f3)${NC}"
fi

echo ""

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
pnpm install
echo -e "${GREEN}  ✓ Dependencies installed${NC}"
echo ""

# Setup git hooks
echo -e "${YELLOW}Setting up git hooks...${NC}"
pnpm prepare
echo -e "${GREEN}  ✓ Husky hooks installed${NC}"
echo ""

# Create environment files
echo -e "${YELLOW}Creating environment files...${NC}"

# Backend .env
if [ ! -f "apps/backend/.env" ]; then
    cat > apps/backend/.env <<EOF
# Application
NODE_ENV=development
PORT=3000

# Database
COUCHDB_URL=http://localhost:5984
COUCHDB_USER=admin
COUCHDB_PASSWORD=changeme
COUCHDB_DATABASE=kompass

# Search
MEILISEARCH_URL=http://localhost:7700
MEILISEARCH_MASTER_KEY=changeme

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=7d

# Keycloak (optional for development)
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=kompass
KEYCLOAK_CLIENT_ID=kompass-backend

# n8n Webhooks
N8N_WEBHOOK_URL=http://localhost:5678/webhook

# Email (optional)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=noreply@kompass.local
EOF
    echo -e "${GREEN}  ✓ Created apps/backend/.env${NC}"
else
    echo -e "${YELLOW}  ⚠ apps/backend/.env already exists${NC}"
fi

# Frontend .env
if [ ! -f "apps/frontend/.env" ]; then
    cat > apps/frontend/.env <<EOF
# API
VITE_API_URL=http://localhost:3000/api/v1

# Features
VITE_ENABLE_OFFLINE=true
VITE_ENABLE_PWA=true

# Development
VITE_DEV_MODE=true
EOF
    echo -e "${GREEN}  ✓ Created apps/frontend/.env${NC}"
else
    echo -e "${YELLOW}  ⚠ apps/frontend/.env already exists${NC}"
fi

echo ""

# Build shared package
echo -e "${YELLOW}Building shared package...${NC}"
cd packages/shared && pnpm build && cd ../..
echo -e "${GREEN}  ✓ Shared package built${NC}"
echo ""

# Run type check
echo -e "${YELLOW}Running type check...${NC}"
pnpm type-check
echo -e "${GREEN}  ✓ Type check passed${NC}"
echo ""

# Run linting
echo -e "${YELLOW}Running linter...${NC}"
pnpm lint
echo -e "${GREEN}  ✓ Linting passed${NC}"
echo ""

# Final message
echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                   Setup Complete!                            ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}Your KOMPASS development environment is ready!${NC}"
echo ""
echo "To start development:"
echo "  ${YELLOW}pnpm dev${NC}                    - Start all apps in dev mode"
echo "  ${YELLOW}cd apps/backend && pnpm dev${NC}  - Start backend only"
echo "  ${YELLOW}cd apps/frontend && pnpm dev${NC} - Start frontend only"
echo ""
echo "To start services (requires Docker):"
echo "  ${YELLOW}docker-compose up -d${NC}         - Start CouchDB, MeiliSearch, etc."
echo ""
echo "To generate entities:"
echo "  ${YELLOW}./scripts/generate-entity.sh customer${NC}"
echo ""
echo "Documentation:"
echo "  See docs/reviews/START_HERE.md for comprehensive guide"
echo ""

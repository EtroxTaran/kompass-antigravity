#!/bin/sh

# Wrapper script for NestJS watch mode that fixes shared package paths after compilation
# This script runs from monorepo root via pnpm --filter

# Get the backend directory (script is in apps/backend/scripts/)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$BACKEND_DIR" || exit 1

# Start NestJS in watch mode in the background
pnpm nest start --watch &
NEST_PID=$!

# Function to fix paths in dist
fix_paths() {
  if [ -d "dist" ]; then
    find dist -name '*.js' -type f -exec sed -i 's|packages/shared/src/|packages/shared/dist/|g' {} \; 2>/dev/null || true
  fi
}

# Wait for initial compilation
sleep 10
fix_paths

# Watch for changes in dist and fix paths periodically
while kill -0 $NEST_PID 2>/dev/null; do
  sleep 3
  fix_paths
done

wait $NEST_PID


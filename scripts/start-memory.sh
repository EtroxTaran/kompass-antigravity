#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
STACK_DIR="${ROOT_DIR}/infra/graphiti-mcp"

cd "${STACK_DIR}"

echo "[graphiti] Starting Graphiti MCP stack via docker compose..."
docker compose up -d "$@"

echo "[graphiti] Stack is starting in the background. MCP endpoint: http://localhost:8000/mcp/"
cd "${ROOT_DIR}"

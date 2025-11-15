#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
STACK_DIR="${ROOT_DIR}/infra/graphiti-mcp"

cd "${STACK_DIR}"

echo "[graphiti] Stopping Graphiti MCP stack..."
docker compose down "$@"

echo "[graphiti] Stack has been stopped."
cd "${ROOT_DIR}"

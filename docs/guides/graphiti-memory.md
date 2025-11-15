# Graphiti Memory Guide

**Purpose:** Provide a persistent knowledge graph (Graphiti/Zep MCP) dedicated to the KOMPASS repo so Cursor can retain long-term implementation context.

> Reference: [Graphiti MCP README](https://github.com/getzep/graphiti/blob/main/mcp_server/README.md) – sections _Running with Docker Compose_ and _Docker Deployment_.

---

## 1. Stack Overview

- **Service image:** `zepai/knowledge-graph-mcp` (Graphiti MCP + FalkorDB)
- **MCP endpoint:** `http://localhost:8000/mcp/`
- **FalkorDB UI:** `http://localhost:3000`
- **Compose file:** `infra/graphiti-mcp/docker-compose.yml`
- **Project namespace:** `GRAPHITI_GROUP_ID=kompass-memory`

Keep the stack running whenever you work on this repo; the Cursor MCP client depends on it for long-term memory.

---

## 2. Environment Configuration

1. Copy the template and keep the resulting `.env` untracked:

   ```bash
   cp infra/graphiti-mcp/.env.template infra/graphiti-mcp/.env
   ```

2. Edit `infra/graphiti-mcp/.env` to populate the placeholder values before the first run:

| Variable                                                                | Description                                                               |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `OPENAI_API_KEY`                                                        | Required. Used for LLM + embeddings (or set Anthropic/Groq/etc.).         |
| `ANTHROPIC_API_KEY`, `GOOGLE_API_KEY`, `GROQ_API_KEY`, `VOYAGE_API_KEY` | Optional alternates. Leave blank if unused.                               |
| `GRAPHITI_GROUP_ID`                                                     | Set to `kompass-memory` to isolate this repo’s data.                      |
| `SEMAPHORE_LIMIT`                                                       | Concurrency control (see Graphiti README for provider-specific guidance). |
| `GRAPHITI_TELEMETRY_ENABLED`                                            | `false` disables anonymous telemetry.                                     |

> Never commit real secrets elsewhere; rotate keys per security policy.

---

## 3. Lifecycle Scripts

All commands must be issued from repo root.

```bash
# Start stack (detached)
./scripts/start-memory.sh

# Stop stack
./scripts/stop-memory.sh
```

Windows PowerShell equivalents:

```powershell
./scripts/start-memory.ps1
./scripts/stop-memory.ps1
```

Scripts accept additional `docker compose` arguments (e.g., `./scripts/start-memory.sh --build`).

---

## 4. Cursor MCP Configuration

`.cursor/mcp.json` registers `graphiti-memory` pointing at `http://localhost:8000/mcp/`. Cursor auto-connects when the stack is running. If the endpoint is unreachable, rerun `./scripts/start-memory.sh` and verify ports 8000/3000.

---

## 5. What to Store in Graphiti

Use the MCP tools to capture the following for long-term recall:

1. **Architectural decisions & ADR-worthy context** (even before ADR files exist).
2. **Docker/container infrastructure setup or changes** (compose files, scripts, env tweaks).
3. **Routing & navigation updates** (e.g., landing page links, nav flows changing A → B).
4. **Important implementation patterns & refactors** (shared hooks, service abstractions, migration strategies).
5. **Non-trivial bugs + fixes** (root cause, resolution steps, validations/tests added).

Treat Graphiti as the canonical memory store for these topics so future agents inherit the context.

---

## 6. Operational Notes

- Logs: `docker compose logs -f graphiti-mcp`
- Health check: `curl http://localhost:8000/health`
- Data persistence lives in the Docker volumes `graphiti-data` and `graphiti-config`.
- To reset the graph, stop the stack, remove volumes (`docker volume rm graphiti-mcp_graphiti-data` etc.), then restart.

---

## 7. Troubleshooting

| Symptom                        | Action                                                                                |
| ------------------------------ | ------------------------------------------------------------------------------------- |
| `curl`/Cursor cannot reach MCP | Ensure ports 8000/3000 free, rerun `./scripts/start-memory.sh`, check compose output. |
| 401 / missing API key          | Confirm `.env` contains valid provider key(s) and restart the stack.                  |
| Rate limit errors              | Lower `SEMAPHORE_LIMIT` based on provider tier (see Graphiti README).                 |
| Need to inspect FalkorDB       | Open `http://localhost:3000` in browser while stack is running.                       |

---

By keeping this stack online and feeding the required information categories, we enable Cursor’s Graphiti MCP integration to deliver consistent, repo-scoped long-term memory.

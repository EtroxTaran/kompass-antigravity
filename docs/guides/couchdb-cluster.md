# CouchDB Cluster Setup Guide

## Overview

KOMPASS uses a 3-node CouchDB cluster for high availability and multi-master replication. This setup ensures:

- **High Availability**: Cluster continues operating if one node fails
- **Multi-Master Replication**: All nodes can accept writes
- **Quorum-Based Operations**: Operations require majority consensus (2 out of 3 nodes)
- **Automatic Conflict Detection**: Conflicts are detected and can be resolved

## Architecture

### Cluster Topology

```
┌─────────────────┐
│   Node 1        │ ← Coordinator (Port 5984)
│ (Primary)       │
└────────┬────────┘
         │
         ├─────────────────┬─────────────────┐
         │                 │                 │
┌────────▼────────┐  ┌─────▼──────┐  ┌──────▼───────┐
│   Node 2        │  │   Node 3   │  │   Clients    │
│ (Secondary)     │  │ (Tertiary) │  │  (Backend)   │
└─────────────────┘  └────────────┘  └──────────────┘
```

### Cluster Configuration

- **Node Count**: 3 nodes (recommended odd number for quorum)
- **Sharding**: 8 shards per database (default)
- **Replicas**: 3 replicas (one per node)
- **Erlang Cookie**: Shared secret for node communication
- **Ports**:
  - Node 1: 5984 (HTTP), 5986 (Clustering)
  - Node 2: 5985 (HTTP), 5987 (Clustering)
  - Node 3: 5988 (HTTP), 5989 (Clustering)

## Setup

### 1. Start Cluster

```bash
# Start 3-node cluster using docker-compose override
docker-compose -f docker-compose.yml -f docker-compose.cluster.yml up -d

# Wait for all nodes to be healthy
docker-compose -f docker-compose.yml -f docker-compose.cluster.yml ps
```

### 2. Initialize Cluster

```bash
# Run cluster initialization script
pnpm db:cluster:init

# This will:
# - Enable clustering on all 3 nodes
# - Add nodes to cluster
# - Configure quorum-based operations
```

### 3. Verify Cluster Status

```bash
# Check cluster status
curl http://localhost:5984/_cluster_setup

# Check cluster membership
curl http://localhost:5984/_membership

# Check node health
curl http://localhost:5984/_up
```

## Configuration

### Environment Variables

```bash
# .env or docker-compose.env
COUCHDB_PASSWORD=your-secure-password
COUCHDB_COOKIE=your-erlang-cookie  # Optional, defaults to 'monster'
```

### Docker Compose Override

The cluster mode uses `docker-compose.cluster.yml` which extends the base `docker-compose.yml`:

- Disables single CouchDB instance
- Adds 3 CouchDB cluster nodes
- Configures networking and volumes
- Sets up health checks

## Conflict Resolution

### Conflict Types

CouchDB multi-master replication can create conflicts when:

1. **Field Conflicts**: Same field modified on different nodes
2. **Deletion Conflicts**: Document deleted on one node, modified on another
3. **Addition Conflicts**: New field added on one node, different field on another

### Resolution Strategies

The KOMPASS conflict resolution system supports multiple strategies:

#### 1. Last Write Wins (Default)

```typescript
import {
  resolveConflicts,
  ConflictResolutionStrategy,
} from "./scripts/database/conflict-resolution";

await resolveConflicts(
  db,
  documentId,
  ConflictResolutionStrategy.LAST_WRITE_WINS,
);
```

**Use Case**: Non-critical data, user preferences, cache

#### 2. Merge Non-Conflicting

```typescript
await resolveConflicts(
  db,
  documentId,
  ConflictResolutionStrategy.MERGE_NON_CONFLICTING,
);
```

**Use Case**: Documents with independent fields (e.g., customer + contact info)

#### 3. User Decides

```typescript
await resolveConflicts(
  db,
  documentId,
  ConflictResolutionStrategy.USER_DECIDES,
  "local", // or 'remote'
);
```

**Use Case**: Critical business data requiring human judgment

#### 4. Entity-Specific (GoBD Compliant)

```typescript
await resolveConflicts(
  db,
  documentId,
  ConflictResolutionStrategy.ENTITY_SPECIFIC,
);
```

**Use Case**: Invoices, payments - uses last write wins but logs all changes

#### 5. Escalate to Admin

```typescript
await resolveConflicts(
  db,
  documentId,
  ConflictResolutionStrategy.ESCALATE_TO_ADMIN,
);
```

**Use Case**: Critical conflicts requiring manual resolution

### Automatic Conflict Detection

The conflict resolution system automatically:

1. **Detects Conflicts**: Scans documents with `_conflicts` field
2. **Categorizes Conflicts**: Field, deletion, or addition conflicts
3. **Resolves Based on Strategy**: Applies configured resolution strategy
4. **Logs Resolution**: Records conflict resolution for audit trail

### Finding Conflicts

```typescript
import { findConflicts } from "./scripts/database/conflict-resolution";

// Find all conflicts in database
const conflicts = await findConflicts(db);

console.log(`Found ${conflicts.length} conflicts`);
conflicts.forEach((conflict) => {
  console.log(`  - ${conflict.documentId}: ${conflict.field}`);
});
```

## Operations

### Adding a Node

To add a 4th node to the cluster:

1. Add node to `docker-compose.cluster.yml`
2. Start new node
3. Run cluster setup with new node actions
4. Update sharding configuration if needed

### Removing a Node

1. Remove node from cluster using `_cluster_setup` API
2. Stop and remove Docker container
3. Update client connections

### Cluster Maintenance

```bash
# Check cluster health
curl http://localhost:5984/_cluster_setup

# Check node status
curl http://localhost:5984/_membership

# Monitor replication
curl http://localhost:5984/_active_tasks
```

## Troubleshooting

### Node Not Joining Cluster

**Symptoms**: Node shows in `all_nodes` but not in `cluster_nodes`

**Solutions**:

1. Check Erlang cookie matches on all nodes
2. Verify network connectivity between nodes
3. Check firewall rules (port 5986 for clustering)
4. Review CouchDB logs: `docker logs kompass-couchdb-node1`

### Conflicts Not Resolving

**Symptoms**: Documents show `_conflicts` field but remain unresolved

**Solutions**:

1. Verify conflict resolution script is running
2. Check database permissions
3. Review conflict resolution logs
4. Manually resolve using `resolveConflicts()` function

### Quorum Issues

**Symptoms**: Writes failing with "quorum not met" errors

**Solutions**:

1. Check if majority of nodes are healthy (2 of 3)
2. Verify network connectivity
3. Check node synchronization status
4. Review cluster logs

## Best Practices

### 1. Use Quorum for Critical Operations

```typescript
// Write with quorum
await db.insert(doc, { w: 2 }); // Wait for 2 replicas

// Read with quorum
await db.get(docId, { r: 2 }); // Read from 2 replicas
```

### 2. Monitor Cluster Health

- Set up alerts for node health
- Monitor replication lag
- Track conflict rates
- Review cluster metrics regularly

### 3. Backup Strategy

- Backup coordinator node (Node 1)
- Verify backup includes all shards
- Test restore procedure regularly

### 4. Conflict Resolution

- Configure entity-specific strategies
- Set up automatic resolution for non-critical data
- Require manual resolution for GoBD-critical entities
- Log all conflict resolutions

## References

- [CouchDB Cluster Documentation](https://docs.couchdb.org/en/stable/cluster/index.html)
- [CouchDB Multi-Master Replication](https://docs.couchdb.org/en/stable/replication/index.html)
- [KOMPASS Conflict Resolution](../scripts/database/conflict-resolution.ts)

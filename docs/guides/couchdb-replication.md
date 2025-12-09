# CouchDB Replication for Offline Sync

**Last Updated**: 2025-01-28  
**Status**: Active  
**Database**: `kompass`

## Overview

This document describes the CouchDB replication setup for offline-first synchronization between the server (CouchDB) and clients (PouchDB). This enables seamless offline operation with automatic conflict resolution.

## Architecture

### Bidirectional Replication

```
┌─────────────┐                    ┌─────────────┐
│   CouchDB   │◄─── Replication ──►│   PouchDB   │
│   (Server)  │                    │  (Client)   │
└─────────────┘                    └─────────────┘
```

### Replication Flow

1. **Initial Sync**: Client pulls all documents on first connection
2. **Continuous Sync**: Real-time bidirectional replication
3. **Offline Changes**: Queued locally, synced when online
4. **Conflict Resolution**: Automatic (90%) and manual (10%)

## Server-Side Configuration

### Continuous Replication

CouchDB supports continuous replication via `_replicator` database:

```bash
# Create replication document
curl -X POST "http://admin:password@localhost:5984/_replicator" \
  -H "Content-Type: application/json" \
  -d '{
    "_id": "kompass-client-replication",
    "source": "http://admin:password@couchdb:5984/kompass",
    "target": "http://client:password@client:5984/kompass-client",
    "continuous": true,
    "filter": "design_doc/filter_by_role",
    "query_params": {
      "role": "ADM"
    }
  }'
```

### Replication Filters

Create filter function to control which documents are replicated:

**Design Document**: `_design/filters`

```javascript
{
  "_id": "_design/filters",
  "filters": {
    "filter_by_role": "function(doc, req) { return doc.type && doc.owner === req.query.role; }",
    "filter_by_user": "function(doc, req) { return doc.type && (doc.owner === req.query.userId || doc.createdBy === req.query.userId); }"
  }
}
```

### Apply Filter Design Document

```bash
curl -X PUT "http://admin:password@localhost:5984/kompass/_design/filters" \
  -H "Content-Type: application/json" \
  -d @filters-design-doc.json
```

## Client-Side Configuration (PouchDB)

### Basic Replication Setup

```typescript
import PouchDB from "pouchdb";
import PouchDBReplication from "pouchdb-replication";

// Local PouchDB database
const localDB = new PouchDB("kompass-local");

// Remote CouchDB database
const remoteDB = new PouchDB("http://localhost:5984/kompass", {
  auth: {
    username: "user",
    password: "password",
  },
});

// Sync options
const syncOptions = {
  live: true, // Continuous replication
  retry: true, // Retry on failure
  back_off_function: (delay: number) => {
    if (delay === 0) {
      return 1000; // Start with 1 second
    }
    return Math.min(delay * 2, 30000); // Max 30 seconds
  },
};

// Start replication
const replication = localDB.sync(remoteDB, syncOptions);

replication
  .on("change", (info) => {
    console.log("Sync change:", info);
    // Handle document changes
  })
  .on("paused", () => {
    console.log("Sync paused (offline)");
  })
  .on("active", () => {
    console.log("Sync active (online)");
  })
  .on("error", (error) => {
    console.error("Sync error:", error);
    // Handle sync errors
  });
```

### Filtered Replication

Replicate only documents relevant to the user:

```typescript
// Replicate only user's own customers (for ADM role)
const replication = localDB.replicate.from(remoteDB, {
  live: true,
  retry: true,
  filter: "filters/filter_by_user",
  query_params: {
    userId: currentUser.id,
    role: currentUser.primaryRole,
  },
});
```

## Conflict Resolution

### Automatic Resolution (90% of conflicts)

CouchDB/PouchDB handles most conflicts automatically:

1. **Last-Write-Wins**: For metadata fields (tags, categories)
2. **Merge-Append**: For text fields (notes, comments)
3. **Boolean-True-Wins**: For status flags

### Manual Resolution (10% of conflicts)

For conflicts requiring user intervention:

```typescript
// Detect conflicts
const conflicts = await localDB.allDocs({
  conflicts: true,
});

// Resolve conflicts
for (const conflict of conflicts.rows) {
  if (conflict.value.conflicts) {
    // Show conflict resolution UI
    const resolution = await promptUserForResolution(conflict);

    // Apply resolution
    await localDB.put(resolution);
  }
}
```

### Conflict Resolution Strategy

**Priority Order**:

1. **Financial Data**: Always prefer server version (GoBD compliance)
2. **Status Transitions**: Require manual resolution
3. **Customer Information**: Merge non-conflicting fields, prompt for conflicts
4. **Metadata**: Last-write-wins

## Data Tiering for Storage Optimization

### 3-Tier Data Management

To manage iOS 50MB storage limits:

| Tier          | Size | Content                                             | Management       |
| ------------- | ---- | --------------------------------------------------- | ---------------- |
| **Essential** | 5MB  | User profile, owned customers, active opportunities | Always synced    |
| **Recent**    | 10MB | Last 30 days protocols, recent projects             | LRU cache        |
| **On-Demand** | 35MB | User-pinned documents, historical data              | Manual selection |

### Implementation

```typescript
// Essential data (always synced)
const essentialFilter = {
  $or: [
    { type: "user", _id: `user-${userId}` },
    { type: "customer", owner: userId },
    { type: "opportunity", owner: userId, status: { $ne: "Lost" } },
  ],
};

// Recent data (last 30 days)
const recentFilter = {
  modifiedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
};

// On-demand data (user-pinned)
const pinnedFilter = {
  _id: { $in: userPinnedDocumentIds },
};
```

## Security Considerations

### Authentication

All replication must be authenticated:

```typescript
const remoteDB = new PouchDB("http://localhost:5984/kompass", {
  auth: {
    username: user.email,
    password: userToken, // JWT token or session token
  },
});
```

### Role-Based Filtering

Replication filters enforce RBAC:

- **ADM**: Only own customers, opportunities, projects
- **PLAN**: All projects, assigned opportunities
- **GF**: All data
- **BUCH**: Financial data only

### Network Security

- **HTTPS**: Use HTTPS for replication in production
- **TLS**: Encrypt all replication traffic
- **VPN**: Consider VPN for remote access

## Performance Optimization

### Batch Replication

Replicate in batches for better performance:

```typescript
const replication = localDB.replicate.from(remoteDB, {
  live: true,
  batch_size: 100, // Replicate 100 documents at a time
  batches_limit: 10, // Maximum 10 batches per cycle
});
```

### Selective Replication

Only replicate necessary documents:

```typescript
// Replicate only active documents
const replication = localDB.replicate.from(remoteDB, {
  live: true,
  filter: "filters/active_documents_only",
  query_params: {
    active: true,
  },
});
```

## Monitoring

### Replication Status

Monitor replication health:

```typescript
replication.on("change", (info) => {
  console.log("Documents pulled:", info.pull?.docs_read || 0);
  console.log("Documents pushed:", info.push?.docs_written || 0);
  console.log("Conflicts:", info.pull?.conflicts || 0);
});
```

### Sync Metrics

Track sync performance:

- **Sync duration**: Time to complete sync
- **Documents synced**: Count of documents transferred
- **Conflicts detected**: Number of conflicts
- **Sync failures**: Error rate

## Troubleshooting

### Common Issues

#### Replication Not Starting

**Symptoms**: No sync activity

**Solutions**:

1. Check network connectivity
2. Verify authentication credentials
3. Check CouchDB logs for errors
4. Verify filter function syntax

#### High Conflict Rate

**Symptoms**: Many conflicts during sync

**Solutions**:

1. Review conflict resolution strategy
2. Implement better conflict detection
3. Optimize offline change queuing
4. Add user guidance for conflict resolution

#### Slow Replication

**Symptoms**: Sync takes too long

**Solutions**:

1. Reduce batch size
2. Use selective replication (filters)
3. Optimize document size
4. Check network bandwidth

### Debug Mode

Enable debug logging:

```typescript
PouchDB.debug.enable("*"); // Enable all debug logs
```

## Best Practices

1. **Always use filters**: Replicate only necessary data
2. **Handle conflicts gracefully**: Provide clear UI for resolution
3. **Monitor sync health**: Track metrics and alert on failures
4. **Test offline scenarios**: Regularly test offline functionality
5. **Optimize document size**: Keep documents small for faster sync
6. **Use batch replication**: Replicate in batches for better performance

## Related Documentation

- [CouchDB Backup Strategy](./couchdb-backup.md) - Backup procedures
- [Offline-First Patterns](../../.cursor/rules/offline-first-patterns.mdc) - Architecture patterns
- [Data Model Specification](../specifications/data-model.md) - Document structure

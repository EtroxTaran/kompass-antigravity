# Offline PWA Data Strategy

**Document Version:** 1.0  
**Date:** 2025-11-12  
**Status:** Active  
**Owner:** Engineering Team  
**Priority:** HIGH - Addresses Pre-Mortem Danger #2 (Offline PWA Fallacy)

---

## Executive Summary

**Pre-Mortem Concern:**

> "An offline-first PWA is one of the most difficult technical challenges in web development. With customer data, project documents, high-resolution photos, and offline-queued audio notes, the 50MB iOS limit will inevitably be breached. This will lead to sync failures, data loss, and a completely broken experience for the most important user (ADM persona)."

**Our Response:**

We **acknowledge** the iOS 50MB storage limit as a **hard constraint** that cannot be exceeded. This document specifies a **tiered data strategy** that prioritizes essential data and gives users control over what's available offline, ensuring a reliable experience even with limited storage.

**Core Principle:** KOMPASS must work flawlessly offline with minimal data. Full offline data is a luxury, not a requirement.

---

## iOS Storage Limits (Hard Facts)

### Storage Quotas by Browser

| Platform | Browser    | Initial Quota | Maximum Quota | Eviction Policy              |
| -------- | ---------- | ------------- | ------------- | ---------------------------- |
| **iOS**  | **Safari** | **50 MB**     | **50 MB**     | **Aggressive (7 days)**      |
| Android  | Chrome     | 60 MB         | 60% of disk   | LRU eviction after 7 days    |
| Desktop  | Chrome     | 60 MB         | 60% of disk   | Persistent (user must clear) |
| Desktop  | Firefox    | 50 MB         | 50% of disk   | Persistent                   |

**Critical:** iOS Safari is the most restrictive and most common for field users (ADM persona).

### iOS Storage Eviction

**When iOS Evicts Data:**

1. **7-day inactivity:** IndexedDB cleared if not accessed in 7 days
2. **Low device storage:** iOS may clear cache if phone storage <10%
3. **No prompting:** iOS does not warn user before clearing
4. **No recovery:** Once cleared, data must be re-downloaded

**Mitigation:**

- **Keep app active:** Background sync, push notifications keep app "active"
- **Critical data priority:** Essential data synced most frequently
- **User warning:** If quota >80%, warn user to sync and clear old data
- **Never exceed 50MB:** Hard limit enforced by app

---

## Tiered Data Strategy

### Overview

**3-Tier System:**

| Tier                  | Size Limit | Content                        | Priority | Sync Frequency |
| --------------------- | ---------- | ------------------------------ | -------- | -------------- |
| **Tier 1: Essential** | 5 MB       | Must-have for core workflows   | Highest  | Every 15 min   |
| **Tier 2: Recent**    | 10 MB      | Recent activity (last 30 days) | Medium   | Hourly         |
| **Tier 3: Pinned**    | 35 MB      | User-selected offline content  | Lowest   | User-triggered |

**Total:** 50 MB maximum (exact limit)

### Tier 1: Essential Data (5 MB) - Always Cached

**Content:**

```typescript
interface EssentialData {
  // User & Auth
  currentUser: User; // ~5 KB
  userPermissions: Permission[]; // ~2 KB

  // ADM Persona (Primary Mobile User)
  ownedCustomers: Customer[]; // Max 50 customers × 3 KB = 150 KB
  activeOpportunities: Opportunity[]; // Max 20 opportunities × 2 KB = 40 KB
  todayAppointments: Activity[]; // Max 10 × 1 KB = 10 KB
  todayTasks: Task[]; // Max 20 × 500 bytes = 10 KB

  // PLAN Persona
  assignedProjects: ProjectSummary[]; // Max 10 projects × 5 KB = 50 KB (summary only)
  thisWeekMilestones: Milestone[]; // Max 20 × 500 bytes = 10 KB

  // Offline Queue
  pendingChanges: QueuedChange[]; // Max 100 × 2 KB = 200 KB

  // Reference Data
  materialCatalog: MaterialSummary[]; // Max 200 materials × 1 KB = 200 KB (summary only)
  supplierDirectory: SupplierSummary[]; // Max 50 suppliers × 1 KB = 50 KB (summary only)

  // Total: ~0.7 MB (comfortable buffer to 5 MB)
}
```

**What's NOT in Tier 1:**

- ❌ Full project details (only summaries)
- ❌ Documents (PDFs, images)
- ❌ Full customer history (only basic info)
- ❌ Audio recordings
- ❌ Protocol full text (only titles)

**Sync Behavior:**

- **Every 15 minutes** when online
- **Immediately** after user creates/updates data
- **Background sync** (PWA background sync API)

**User Impact:**

- Core workflows work offline: Customer visit, log activity, create note, view appointments
- User may see: "Details nicht verfügbar (offline)" for non-essential data
- User understands: Offline = limited but functional

---

### Tier 2: Recent Data (10 MB) - Context Cache

**Content:**

```typescript
interface RecentData {
  // Last 30 days
  recentCustomers: Customer[]; // 20 recently viewed × 10 KB = 200 KB
  recentOpportunities: Opportunity[]; // 30 recent × 5 KB = 150 KB
  recentProjects: ProjectDetail[]; // 10 recent × 20 KB = 200 KB
  recentProtocols: Protocol[]; // 50 recent × 3 KB = 150 KB
  recentActivities: Activity[]; // 100 recent × 1 KB = 100 KB

  // Frequently Accessed
  frequentCustomers: Customer[]; // Top 10 by access count × 10 KB = 100 KB

  // Documents (Thumbnails Only)
  documentMetadata: DocumentMeta[]; // 50 docs × 200 bytes = 10 KB
  documentThumbnails: Blob[]; // 50 thumbnails × 30 KB = 1.5 MB

  // Draft Documents
  draftDocuments: Document[]; // 5 drafts × 500 KB = 2.5 MB

  // Total: ~4.6 MB (comfortable buffer to 10 MB)
}
```

**What's in Tier 2:**

- ✓ Recently viewed customers (full detail)
- ✓ Active opportunities (full detail)
- ✓ Current projects (full detail, no large files)
- ✓ Recent notes and protocols
- ✓ Document thumbnails (not full PDFs)
- ✓ Drafts being edited

**Sync Behavior:**

- **Every hour** when online
- **On demand:** When user views an item
- **LRU eviction:** Least recently used items removed when quota reached

**User Impact:**

- Smooth experience for daily work (recent data cached)
- Older data: Requires online connection
- Documents: Thumbnail visible, full PDF requires online

---

### Tier 3: Pinned Data (35 MB) - User-Controlled

**Content:**

User explicitly selects content for offline availability:

```typescript
interface PinnedData {
  // User-Pinned Entities
  pinnedCustomers: Customer[]; // Max 50 × 10 KB = 500 KB
  pinnedProjects: ProjectDetail[]; // Max 20 × 100 KB = 2 MB (with limited docs)
  pinnedOpportunities: Opportunity[]; // Max 30 × 5 KB = 150 KB
  pinnedProtocols: Protocol[]; // Max 100 × 3 KB = 300 KB

  // User-Pinned Documents
  pinnedDocuments: Document[]; // Max 30 × 500 KB = 15 MB (PDFs, images)

  // Offline Maps (if needed)
  offlineMaps: MapTile[]; // 10 MB for region (Munich area)

  // Total: ~28 MB (buffer to 35 MB for growth)
}
```

**Pin UI:**

On any customer/project/document:

- Icon: 📌 "Für Offline verfügbar machen"
- Toggle: Pin / Unpin
- User sees: "Offline-Speicher: 15 MB / 35 MB verwendet (43%)"

**What Can Be Pinned:**

- ✓ Customers (for extended offline work)
- ✓ Projects (for site visits without connectivity)
- ✓ Documents (contracts, plans, specs)
- ✓ Protocols (for reference)
- ✓ Map regions (for route planning)

**Sync Behavior:**

- **User-triggered:** User pins item → downloads immediately
- **Auto-sync:** Pinned items refresh daily when online
- **Unpinning:** User can unpin to free space

**User Impact:**

- User controls what's offline (no surprises)
- User sees storage quota (transparency)
- User can work offline for days if content pinned in advance

---

## Storage Quota Management

### Quota Monitoring

**Real-Time Quota Tracking:**

```typescript
interface QuotaStatus {
  total: 52428800; // 50 MB in bytes
  used: 28311552; // ~27 MB
  available: 24117248; // ~23 MB
  percentage: 54; // 54% used

  breakdown: {
    tier1Essential: 4718592; // 4.5 MB
    tier2Recent: 9437184; // 9 MB
    tier3Pinned: 14155776; // 13.5 MB
  };

  status: 'OK'; // OK / Warning / Critical
  message: null;
}

// Status thresholds:
// - OK: <80% used (green)
// - Warning: 80-95% used (amber)
// - Critical: >95% used (red)
```

**Quota API:**

```typescript
// Check quota on app load and periodically
async function checkQuota(): Promise<QuotaStatus> {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    const used = estimate.usage || 0;
    const total = 52428800; // Hard-code 50 MB for iOS safety

    const status = calculateQuotaStatus(used, total);

    // Update UI indicator
    updateQuotaIndicator(status);

    // Alert user if critical
    if (status.status === 'Critical') {
      showQuotaWarning(status);
    }

    return status;
  }
}
```

### User Warnings

**Warning at 80% (40 MB used):**

```
┌────────────────────────────────────────────────────────┐
│ ⚠️ Offline-Speicher zu 80% belegt                      │
├────────────────────────────────────────────────────────┤
│ Verwendet: 40 MB / 50 MB                               │
│                                                        │
│ Um Speicherplatz freizugeben:                          │
│ • Nicht mehr benötigte Daten entfernen                │
│ • Alte Protokolle löschen                              │
│ • Große Dokumente aus Offline-Speicher entfernen      │
│                                                        │
│ [Speicher verwalten] [Später erinnern]                 │
└────────────────────────────────────────────────────────┘
```

**Critical at 95% (47.5 MB used):**

```
┌────────────────────────────────────────────────────────┐
│ 🔴 Offline-Speicher fast voll!                         │
├────────────────────────────────────────────────────────┤
│ Verwendet: 47,5 MB / 50 MB                             │
│                                                        │
│ ⚠️ Neue Offline-Daten können nicht gespeichert werden │
│                                                        │
│ Aktion erforderlich:                                   │
│ Löschen Sie nicht benötigte Offline-Daten oder        │
│ synchronisieren Sie und arbeiten Sie online.          │
│                                                        │
│ [Jetzt Speicher freigeben] [Alle Offline-Daten löschen] │
└────────────────────────────────────────────────────────┘
```

**Blocked at 100%:**

- New offline data rejected
- User sees: "Offline-Speicher voll. Bitte freigeben oder online arbeiten."
- Queue continues to work (pending changes < 1 MB buffer reserved)

### Quota Management UI

**Storage Management Page (Settings):**

```
┌────────────────────────────────────────────────────────┐
│ Offline-Speicher verwalten                             │
├────────────────────────────────────────────────────────┤
│                                                        │
│ ╔════════════════════════════════════════════════════╗ │
│ ║ [████████████████████░░░░░░] 42 MB / 50 MB (84%)  ║ │
│ ╚════════════════════════════════════════════════════╝ │
│                                                        │
│ Tier 1: Essenzielle Daten          4,5 MB  [✓ Immer] │
│ Tier 2: Kürzlich verwendet         12 MB   [Auto]     │
│ Tier 3: Gepinnte Inhalte           25,5 MB [Verwalten]│
│                                                        │
│ ▼ Gepinnte Inhalte (18 Elemente)                      │
│ ┌──────────────────────────────────────────────────┐  │
│ │ 📋 Projekt P-2025-M003 (REWE München)   8,5 MB   │  │
│ │ Inkl. 12 Dokumente                      [Entpin] │  │
│ │                                                  │  │
│ │ 👤 Kunde: Hofladen Müller GmbH          2,1 MB   │  │
│ │ Inkl. 8 Protokolle, 5 Dokumente         [Entpin] │  │
│ │                                                  │  │
│ │ 🗺️ Karte: München Nord (Offline)        8,2 MB   │  │
│ │ Für Navigation ohne Internet            [Entpin] │  │
│ │                                                  │  │
│ │ ... (15 weitere)                    [Alle anzeigen]│
│ └──────────────────────────────────────────────────┘  │
│                                                        │
│ [Alte Daten löschen (>90 Tage)]                        │
│ [Alle gepinnten Inhalte entfernen]                     │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Auto-Cleanup Options:**

- ☑ Protokolle >90 Tage automatisch entfernen
- ☑ Beendete Projekte nach 30 Tagen entfernen
- ☑ Bilder komprimieren (Qualität: 70%)
- ☑ Audio-Transkripte löschen nach Upload

---

## Data Prioritization Rules

### What Goes in Each Tier

**Tier 1: Essential (MUST work offline):**

✅ **Own customers** (ADM role):

- ADM user's assigned customers (max 50)
- Basic info only: Name, address, phone, email, last activity
- No full protocols, no documents
- Size per customer: ~3 KB

✅ **Today's appointments:**

- Activities scheduled for today + tomorrow
- Includes: Customer reference, time, location
- Size per appointment: ~1 KB

✅ **Active opportunities:**

- Opportunities user is working on (status ≠ Won/Lost)
- Max 20 opportunities
- Size per opportunity: ~2 KB

✅ **User profile & settings:**

- User data, preferences, RBAC permissions
- Size: ~5 KB

✅ **Offline queue:**

- Pending sync changes (created/updated entities)
- Max 100 items
- Size: ~200 KB

**Total Tier 1:** ~0.7 MB (well below 5 MB limit)

---

**Tier 2: Recent (Nice to have offline):**

✅ **Last 30 days activity:**

- Customer visits, protocols, notes
- Limit: 50 most recent
- Size: ~150 KB

✅ **Frequently accessed customers:**

- Top 10 by access frequency
- Full details including recent protocols
- Size: ~100 KB

✅ **Current projects (PLAN role):**

- Projects assigned to user
- Full project detail (without large documents)
- Max 10 projects × 20 KB = 200 KB

✅ **Draft documents:**

- Documents being edited
- Auto-save drafts
- Size: ~2-3 MB

✅ **Document thumbnails:**

- For recently viewed documents
- Low-res preview images
- Size: ~1.5 MB

**Total Tier 2:** ~4-5 MB (buffer to 10 MB)

---

**Tier 3: Pinned (User decides):**

✅ **User-selected customers:**

- Customers user pins for offline access
- Full detail including protocols
- Max 50 customers × 10 KB = 500 KB

✅ **User-selected projects:**

- Projects user pins for site visits
- Includes: Project detail, material list, team, timeline
- Excludes: Large documents (unless also pinned)
- Max 20 projects × 100 KB = 2 MB

✅ **Critical documents:**

- Contracts, plans, specs user needs offline
- User pins individually
- Max 30 documents × 500 KB = 15 MB

✅ **Offline map tiles:**

- For route navigation in areas without signal
- User downloads region (e.g., Munich area)
- Size: ~10 MB per region

**Total Tier 3:** ~28 MB (buffer to 35 MB)

---

## Data Size Optimization

### Compression Strategies

**1. Image Compression:**

```typescript
// Compress images before storing offline
async function compressImage(file: File): Promise<Blob> {
  const img = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Resize if large (max 1920x1080 for offline)
  const maxWidth = 1920;
  const maxHeight = 1080;
  let { width, height } = img;

  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width *= ratio;
    height *= ratio;
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);

  // Compress to 70% quality JPEG
  const blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', 0.7)
  );

  return blob;

  // Typical savings: 1.5 MB photo → 200 KB (87% reduction)
}
```

**2. Audio Transcription & Deletion:**

```typescript
// After audio note transcription, delete audio file to save space
async function handleAudioNoteTranscription(
  audio: AudioRecording
): Promise<void> {
  // 1. Transcribe audio (Whisper API or local model)
  const transcript = await transcribeAudio(audio);

  // 2. Save transcript as text note
  await noteRepository.create({
    customerId: audio.customerId,
    content: transcript.text,
    originalAudioId: audio.id,
    createdAt: audio.recordedAt,
    createdBy: audio.userId,
  });

  // 3. Upload audio to server (backup)
  await uploadAudioToServer(audio);

  // 4. Delete local audio file
  await localDB.remove(audio.id);

  // Savings: 5 MB audio → 5 KB text (99.9% reduction)
}
```

**3. Protocol Summary Caching:**

```typescript
// Store protocol summaries, not full text, in Tier 1/2
interface ProtocolSummary {
  id: string;
  customerId: string;
  date: Date;
  title: string; // Max 100 chars
  summary: string; // Max 200 chars (auto-generated)
  participantCount: number;
  hasFollowUp: boolean;
  // Full content fetched on-demand (requires online)
}

// Full protocol: ~15 KB
// Summary: ~500 bytes
// Savings: 97% for 100 protocols
```

**4. Incremental Sync (Delta Updates):**

```typescript
// Only sync changed fields, not entire entities
interface SyncDelta {
  entityType: 'customer' | 'project' | 'opportunity';
  entityId: string;
  changedFields: {
    [key: string]: { oldValue: unknown; newValue: unknown };
  };
  timestamp: Date;
}

// Example: Customer phone number changed
// Instead of syncing entire 10 KB customer:
// Sync: { entityId: "customer-123", changedFields: { phone: "new number" } }
// Size: 200 bytes vs. 10 KB (98% reduction)
```

---

## Conflict Resolution Strategy

### Conflict Detection

**Definition:** A conflict occurs when the same entity is modified offline (in local DB) and online (on server) simultaneously.

**Detection Algorithm:**

```typescript
async function detectConflicts(
  localEntity: Entity,
  serverEntity: Entity
): Promise<Conflict[]> {
  const conflicts: Conflict[] = [];

  // Compare modification timestamps
  if (localEntity._rev !== serverEntity._rev) {
    // Entity was modified in both places

    // Field-by-field comparison
    for (const field of Object.keys(localEntity)) {
      if (field.startsWith('_')) continue; // Skip CouchDB metadata

      if (!isEqual(localEntity[field], serverEntity[field])) {
        conflicts.push({
          field,
          localValue: localEntity[field],
          localTimestamp: localEntity.modifiedAt,
          serverValue: serverEntity[field],
          serverTimestamp: serverEntity.modifiedAt,
          conflictType: determineConflictType(field, localEntity, serverEntity),
        });
      }
    }
  }

  return conflicts;
}
```

### Conflict Types

**Type 1: Non-Conflicting (Auto-Merge)**

Different fields modified:

- Local: Changed `customer.phone`
- Server: Changed `customer.email`
- **Resolution:** Merge both changes (safe)

```typescript
merged = {
  ...serverEntity,
  phone: localEntity.phone, // From local
  email: serverEntity.email, // From server
  modifiedAt: max(localEntity.modifiedAt, serverEntity.modifiedAt),
};
```

**Type 2: Last-Write-Wins (Auto-Merge)**

Same field, clear winner:

- Local modified: 2025-02-05 10:00
- Server modified: 2025-02-05 10:15 (15 minutes later)
- **Resolution:** Server wins (most recent)

**Type 3: Semantic Conflict (User Decides)**

Same field, both recently modified:

- Local: Changed `opportunity.probability` from 50% to 75%
- Server: Changed `opportunity.probability` from 50% to 60%
- Time delta: <5 minutes (both are recent)
- **Resolution:** Show user both versions, user chooses

**Type 4: Creation Conflict (Rare)**

Entity created offline with same ID (UUID collision - extremely rare):

- **Resolution:** Generate new UUID for local entity, treat as separate

### Conflict Resolution UI

**Conflict Modal (when sync detects conflicts):**

```
┌────────────────────────────────────────────────────────┐
│ ⚠️ Datenkonflikt erkannt                          [×]  │
├────────────────────────────────────────────────────────┤
│ Kunde: Hofladen Müller GmbH                            │
│                                                        │
│ Das Feld "Telefonnummer" wurde gleichzeitig an zwei   │
│ Orten geändert:                                        │
│                                                        │
│ ┌─ Ihre Änderung (Offline) ────────────────────────┐  │
│ │ +49 (0) 89 1234567                                │  │
│ │ Geändert: Heute, 10:30 (Sie, offline)             │  │
│ └────────────────────────────────────────────────────┘  │
│                                                        │
│ ┌─ Server-Änderung (Online) ────────────────────────┐  │
│ │ +49 (0) 89 9876543                                │  │
│ │ Geändert: Heute, 10:35 (Anna Weber, online)       │  │
│ └────────────────────────────────────────────────────┘  │
│                                                        │
│ Welche Version möchten Sie behalten?                   │
│                                                        │
│ (⚪) Ihre Änderung verwenden                           │
│ (⚪) Server-Änderung verwenden                         │
│ (⦿) Manuell zusammenführen:                           │
│     [+49 (0) 89 9876543___________________]           │
│                                                        │
│ [Abbrechen]                          [Konflikt lösen]  │
└────────────────────────────────────────────────────────┘
```

**Conflict Resolution Options:**

1. **Mine (Local):** Keep your offline change, discard server change
2. **Theirs (Server):** Discard your offline change, keep server change
3. **Merge:** Manually combine both (for text fields)
4. **Field-by-field:** Choose per-field (for multiple conflicts)

### Auto-Merge Success Rate

**Target: 70% of conflicts auto-resolved**

- **40%:** Non-conflicting fields (different fields changed) → Auto-merge
- **30%:** Last-write-wins (clear timestamp winner) → Auto-merge
- **25%:** Semantic conflicts → User decides
- **5%:** Complex conflicts → Escalate to tech support

---

## Offline Queue Management

### Queued Change Structure

```typescript
interface QueuedChange {
  id: string; // UUID
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  entityType: 'customer' | 'opportunity' | 'activity' | 'protocol' | 'expense';
  entityId: string;
  entityData: unknown; // Full entity data

  timestamp: Date; // When created offline
  userId: string;
  deviceId: string; // Device fingerprint

  syncStatus: 'Pending' | 'InProgress' | 'Synced' | 'Failed';
  syncAttempts: number;
  lastSyncAttempt?: Date;
  lastSyncError?: string;

  dependencies?: string[]; // IDs of entities this depends on
  conflictDetected?: boolean;
  conflictResolution?: ConflictResolution;
}
```

### Queue Processing

**Sync Trigger Conditions:**

1. **App comes online:** Immediate sync attempt
2. **Background sync:** Every 15 minutes (PWA Background Sync API)
3. **User-triggered:** Manual "Sync Now" button
4. **On app close:** Attempt sync before closing

**Sync Order:**

1. **Dependencies first:** If activity references new customer, sync customer first
2. **By timestamp:** Oldest changes first (FIFO)
3. **By entity type:** Critical entities (customers) before optional (notes)

**Sync Retry Logic:**

```typescript
async function syncQueue(): Promise<SyncResult> {
  const queue = await getQueuedChanges();
  const results = { synced: 0, failed: 0, conflicts: 0 };

  for (const change of queue) {
    try {
      // Attempt sync
      const response = await api.post('/sync', {
        operation: change.operation,
        entityType: change.entityType,
        entityData: change.entityData,
        clientTimestamp: change.timestamp,
      });

      if (response.conflict) {
        // Conflict detected by server
        results.conflicts++;
        change.conflictDetected = true;
        await showConflictResolutionUI(change, response.serverEntity);
      } else {
        // Success
        results.synced++;
        change.syncStatus = 'Synced';
        await localDB.remove(change.id); // Remove from queue
      }
    } catch (error) {
      // Network error or server error
      results.failed++;
      change.syncAttempts++;
      change.lastSyncError = error.message;

      if (change.syncAttempts >= 5) {
        // Escalate: Manual intervention required
        await flagForManualResolution(change);
      }
    }
  }

  return results;
}
```

**Exponential Backoff:**

- Attempt 1: Immediate
- Attempt 2: +1 minute
- Attempt 3: +5 minutes
- Attempt 4: +15 minutes
- Attempt 5: +1 hour
- After 5 failures: Manual resolution required

---

## Sync Status Indicators

### Global Sync Status (Top Bar)

```
Online Mode:
[●] Synchronisiert  (green) - All changes synced
[⟳] Synchronisiere... (blue, spinning) - Sync in progress
[⚠️] 3 Änderungen ausstehend (amber) - Offline changes queued
[🔴] Synchronisationsfehler (red) - Sync failed, needs attention

Offline Mode:
[⚫] Offline-Modus (gray) - No internet connection
[⚠️] 5 Änderungen wartend (amber) - Changes queued for sync when online
```

**Click indicator:** Opens sync detail modal

### Sync Detail Modal

```
┌────────────────────────────────────────────────────────┐
│ Synchronisationsstatus                            [×]  │
├────────────────────────────────────────────────────────┤
│ Status: ⟳ Synchronisiere... (3 von 5 Änderungen)      │
│                                                        │
│ ✓ Kunde aktualisiert: Hofladen Müller                 │
│   Telefonnummer geändert • Vor 2 Minuten              │
│                                                        │
│ ⟳ Aktivität erstellt: Besuchsprotokoll                │
│   REWE München • Synchronisiere...                    │
│                                                        │
│ ⏳ Ausgabe erfasst: Tankbeleg                          │
│   € 45,80 • Wartend                                   │
│                                                        │
│ ⚠️ Opportunity aktualisiert: REWE Ladeneinrichtung     │
│   KONFLIKT: Wahrscheinlichkeit geändert               │
│   [Konflikt lösen]                                     │
│                                                        │
│ [Synchronisation wiederholen] [Abbrechen]              │
└────────────────────────────────────────────────────────┘
```

---

## Offline-First Patterns

### Pattern 1: Optimistic UI

**Always respond instantly, sync in background:**

```typescript
// User creates customer offline
async function createCustomer(data: CreateCustomerDto): Promise<Customer> {
  // 1. Generate local ID immediately
  const customer = {
    id: generateUUID(),
    ...data,
    _queuedForSync: true,
    _offlineCreated: true,
    createdAt: new Date(),
  };

  // 2. Save to local DB (instant)
  await localDB.put(customer);

  // 3. Show success immediately (optimistic)
  showSuccessToast('Kunde erstellt');

  // 4. Queue for sync (background)
  await queueChange({
    operation: 'CREATE',
    entityType: 'customer',
    entityData: customer,
  });

  // 5. Sync when online (automatic)
  if (navigator.onLine) {
    syncQueue(); // Non-blocking
  }

  return customer;
}
```

**User Experience:**

- User sees: Instant feedback, no spinner
- User doesn't wait for server
- User continues working
- Sync happens invisibly in background

### Pattern 2: Offline-Available Badge

**Show user what's available offline:**

```
┌──────────────────────────────────────────────────────┐
│ 👤 Hofladen Müller GmbH                    📌 Offline│
│ Bio-Lebensmittel • München                           │
│ ... (customer details)                               │
└──────────────────────────────────────────────────────┘

Offline badge: Shows user this customer is fully cached
Click badge: Pin/unpin for offline
```

### Pattern 3: Gradual Degradation

**Feature availability based on connectivity:**

| Feature            | Online | Offline (Tier 1) | Offline (Tier 2) | Offline (Tier 3)   |
| ------------------ | ------ | ---------------- | ---------------- | ------------------ |
| View own customers | ✓      | ✓                | ✓                | ✓ (if pinned)      |
| Create customer    | ✓      | ✓                | ✓                | ✓                  |
| View all customers | ✓      | ❌               | ❌               | ✓ (if pinned)      |
| View documents     | ✓      | Thumbnail        | Thumbnail        | ✓ (if pinned)      |
| RAG search         | ✓      | Limited (cached) | Limited          | ✓ (pinned content) |
| AI features        | ✓      | ❌               | ❌               | ❌                 |

**User Messaging:**

- Feature unavailable offline: "Funktion erfordert Online-Verbindung"
- Document not cached: "Dokument online verfügbar. Jetzt laden?"
- Search limited: "Nur Offline-Daten durchsucht. Online für vollständige Ergebnisse."

---

## Testing Strategy

### Offline Scenario Tests

**Test 1: Storage Quota Management**

- Start: Empty cache
- Fill: Tier 1 (5 MB) → OK
- Fill: Tier 2 (10 MB) → OK
- Fill: Tier 3 (35 MB) → OK
- Attempt: Add 1 MB more → **Rejected with clear error**
- Verify: User sees quota warning at 80%, critical at 95%

**Test 2: Sync After 7 Days Offline**

- Day 0: User goes offline with full Tier 1/2/3 data
- Day 7: User returns online
- Verify: Queue has 50+ changes (customer visits, notes, expenses)
- Trigger: Sync
- Verify: All changes sync successfully without data loss
- Verify: No conflicts (or conflicts resolved correctly)

**Test 3: Conflict Resolution**

- Setup: User A modifies customer.phone offline
- Setup: User B modifies customer.phone online (different value)
- User A: Comes online, sync triggered
- Verify: Conflict detected
- Verify: UI shows both values
- User A: Selects resolution (theirs/mine/merge)
- Verify: Chosen value propagated to server

**Test 4: Large Document Handling**

- User: Pins 30 documents (15 MB total)
- User: Attempts to pin 5 MB document
- Verify: Warning "Offline-Speicher voll. Bitte entpinnen Sie andere Dokumente."
- User: Unpins 10 MB of documents
- User: Retries pin 5 MB document
- Verify: Success

**Test 5: iOS Storage Eviction Recovery**

- Setup: User has 45 MB cached
- Simulate: iOS clears cache (7-day inactivity)
- User: Opens app
- Verify: App detects cache cleared
- Verify: Re-downloads Tier 1 essential data immediately (5 MB)
- Verify: User sees "Offline-Daten wiederhergestellt"

---

## Performance Targets

### Sync Performance

| Metric                 | Target            | Rationale                |
| ---------------------- | ----------------- | ------------------------ |
| Sync 100 changes       | ≤30 seconds       | NFR requirement          |
| Conflict detection     | ≤500ms per entity | Real-time feedback       |
| Quota check            | ≤100ms            | Don't block UI           |
| Tier 1 download        | ≤10 seconds on 3G | Essential data first     |
| Tier 2 background load | ≤60 seconds       | Can happen in background |
| Tier 3 pin download    | Show progress     | User-triggered, can wait |

### Storage Performance

- **IndexedDB write:** <50ms per entity
- **IndexedDB query:** <100ms for lists of 100 items
- **Image compression:** <2s per 1.5 MB photo
- **Audio transcription:** <10s per 1 minute audio (local model)

---

## Related Documents

- [Pre-Mortem Analysis](../reviews/PROJECT_KOMPASS_PRE-MORTEM_ANALYSIS.md) - Risk identification (Danger #2)
- [NFR Specification](../reviews/NFR_SPECIFICATION.md) - Performance requirements
- [Offline Components UI](../../ui-ux/02-core-components/offline-indicators.md) - UI patterns
- [Sync Progress UI](../../ui-ux/02-core-components/sync-progress.md) - User feedback

---

## Revision History

| Version | Date       | Author           | Changes                                                 |
| ------- | ---------- | ---------------- | ------------------------------------------------------- |
| 1.0     | 2025-11-12 | Engineering Team | Initial tiered storage and conflict resolution strategy |

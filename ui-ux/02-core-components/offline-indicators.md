# Offline Indicators - Figma Make Prompt

## Context & Purpose

- **Component Type**: System Status Component
- **User Roles**: All users (offline-first PWA)
- **Usage Context**: Indicate offline status, sync state, data freshness
- **Business Value**: User confidence in offline mode, data transparency

## Design Requirements

### Visual Hierarchy

- **Global offline banner**: Most prominent, system-wide
- **Sync status badges**: Item-level indicators
- **Data age indicators**: Freshness transparency
- **Connection quality**: Network speed indicators

### Component States

- Online (default, no indicator)
- Offline (prominent warning)
- Syncing (progress indication)
- Sync error (error state)
- Stale data (age warning)

### shadcn/ui Components

- Alert, Badge, Progress, Tooltip
- Custom connection status hook
- Sync queue visualization

## Figma Make Prompt

Create comprehensive offline indicator components for KOMPASS that clearly communicate connection status, sync state, and data freshness throughout the application.

**Global Offline Banner (Mobile & Desktop):**

```
When offline:
┌─────────────────────────────────────────────┐
│ ⚡ Offline-Modus • Änderungen werden         │
│ gespeichert und später synchronisiert        │
└─────────────────────────────────────────────┘

When reconnecting:
┌─────────────────────────────────────────────┐
│ 🔄 Verbindung wird hergestellt...            │
│ ████████████░░░░░ 75% synchronisiert         │
└─────────────────────────────────────────────┘

When synced:
┌─────────────────────────────────────────────┐
│ ✅ Wieder online • Alle Daten aktuell        │
└─────────────────────────────────────────────┘
(Auto-dismiss after 3 seconds)
```

**Specifications:**

- Position: Fixed below header
- Background colors:
  - Offline: #FEF3C7 (amber-100)
  - Syncing: #DBEAFE (blue-100)
  - Online: #D1FAE5 (green-100)
- Border: 1px solid (matching color family)
- Height: 40px
- Padding: 12px 16px
- Font: Inter 13px medium
- Icons: 16px, matching color scheme

**Item-Level Sync Indicators:**

```
List Item States:

Synced (default):
┌─────────────────────────────┐
│ Customer Name               │ ← No indicator
└─────────────────────────────┘

Modified locally:
┌─────────────────────────────┐
│ Customer Name 🔄            │ ← Pending sync
└─────────────────────────────┘

Syncing:
┌─────────────────────────────┐
│ Customer Name ⟳             │ ← Rotating
└─────────────────────────────┘

Sync error:
┌─────────────────────────────┐
│ Customer Name ⚠️             │ ← Error state
└─────────────────────────────┘
```

**Icon Specifications:**

- 🔄 Pending: #3B82F6 (blue-500), static
- ⟳ Syncing: #3B82F6, rotate animation 1s linear infinite
- ⚠️ Error: #EF4444 (red-500), static
- ✅ Just synced: #10B981 (green-500), fade out after 2s

**Data Freshness Indicators:**

```
Fresh (< 1 hour):
┌─────────────────────────────┐
│ Customers (247)             │ ← No indicator
└─────────────────────────────┘

Aging (1-24 hours):
┌─────────────────────────────┐
│ Customers (247)             │
│ Aktualisiert vor 3 Std. 🕐  │
└─────────────────────────────┘

Stale (> 24 hours):
┌─────────────────────────────┐
│ Customers (247)             │
│ ⚠️ Daten von gestern         │
│ [Jetzt aktualisieren]       │
└─────────────────────────────┘
```

**Connection Quality Badge (Mobile):**

```
┌────────────────┐
│ 4G ████        │ ← Good connection
└────────────────┘

┌────────────────┐
│ 3G ██░░        │ ← Slow connection
└────────────────┘

┌────────────────┐
│ ⚡ Offline      │ ← No connection
└────────────────┘
```

**Sync Queue Visualization:**

```
Bottom sheet (mobile) / Popover (desktop):
┌─────────────────────────────────────┐
│ Sync-Warteschlange (5)         [×] │
├─────────────────────────────────────┤
│ ✅ Kunde erstellt                   │
│ ⟳ Opportunity aktualisiert         │
│ ⏳ Projekt geändert                 │
│ ⏳ Dokument hochgeladen             │
│ ⏳ Tour abgeschlossen               │
│                                     │
│ [Alle synchronisieren]              │
└─────────────────────────────────────┘
```

**Offline-First Empty States:**

```
When offline and no cached data:
┌─────────────────────────────────────┐
│                                     │
│         ⚡                           │
│                                     │
│    Offline - Keine Daten            │
│    verfügbar                        │
│                                     │
│ Verbinden Sie sich mit dem         │
│ Internet, um Daten zu laden         │
│                                     │
└─────────────────────────────────────┘

When offline with cached data:
┌─────────────────────────────────────┐
│                                     │
│         📱                          │
│                                     │
│    Offline-Modus aktiv              │
│                                     │
│ Zeige gespeicherte Daten vom        │
│ 05.02.2025, 14:30 Uhr              │
│                                     │
│ [Gespeicherte Daten anzeigen]       │
└─────────────────────────────────────┘
```

## Implementation Patterns

### Connection Detection

```typescript
// Service Worker connection detection
navigator.onLine; // Basic check

// Enhanced detection with speed test
async function checkConnection() {
  try {
    const start = Date.now();
    await fetch('/api/ping', {
      method: 'HEAD',
      cache: 'no-store',
    });
    const latency = Date.now() - start;

    return {
      online: true,
      quality: latency < 100 ? 'good' : latency < 500 ? 'fair' : 'poor',
    };
  } catch {
    return { online: false, quality: 'none' };
  }
}
```

### Sync Status Management

```typescript
interface SyncStatus {
  pending: number;
  syncing: number;
  failed: number;
  lastSync: Date;
}

// Visual states based on sync status
function getSyncIndicator(item: Entity): SyncIndicator {
  if (item._conflicts) return 'error';
  if (item._queuedForSync && !navigator.onLine) return 'pending';
  if (item._syncing) return 'syncing';
  if (item._syncError) return 'error';
  if (item._justSynced) return 'success'; // Fade out
  return null; // No indicator
}
```

### Data Age Calculation

```typescript
function getDataAgeIndicator(lastSync: Date): DataAge {
  const age = Date.now() - lastSync.getTime();
  const hours = age / (1000 * 60 * 60);

  if (hours < 1) return null; // Fresh
  if (hours < 24)
    return {
      text: `vor ${Math.floor(hours)} Std.`,
      level: 'info',
    };

  const days = Math.floor(hours / 24);
  return {
    text: `vor ${days} ${days === 1 ? 'Tag' : 'Tagen'}`,
    level: 'warning',
    showRefresh: true,
  };
}
```

## Mobile Optimizations

### Compact Indicators

```
Desktop (verbose):
"Offline-Modus • Änderungen werden gespeichert"

Mobile (compact):
"⚡ Offline"
```

### Touch-Friendly Actions

```
Mobile sync queue item:
┌─────────────────────────────┐
│ Opportunity aktualisiert    │ ← 64px height
│ ⟳ Wird synchronisiert...    │ ← for easy tap
└─────────────────────────────┘
```

### Progressive Disclosure

```
Collapsed:
[5 ausstehend ▼]

Expanded:
[5 ausstehend ▲]
- Item 1
- Item 2
- Item 3
[Mehr anzeigen]
```

## Accessibility

### Screen Reader Announcements

```html
<!-- Status changes -->
<div role="status" aria-live="polite">
  <span class="sr-only">
    Offline-Modus aktiviert. Änderungen werden lokal gespeichert.
  </span>
</div>

<!-- Sync progress -->
<div
  role="progressbar"
  aria-valuenow="75"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-label="Synchronisierung 75% abgeschlossen"
></div>
```

### Keyboard Navigation

- Tab through sync queue items
- Enter to retry failed sync
- Escape to dismiss notifications

## Color Semantics

| State   | Background | Border  | Text    | Icon    |
| ------- | ---------- | ------- | ------- | ------- |
| Offline | #FEF3C7    | #FCD34D | #92400E | #92400E |
| Syncing | #DBEAFE    | #93C5FD | #1E40AF | #3B82F6 |
| Error   | #FEE2E2    | #FCA5A5 | #991B1B | #EF4444 |
| Success | #D1FAE5    | #86EFAC | #166534 | #10B981 |

## German Labels

- **Offline-Modus**: Offline mode
- **Wird synchronisiert**: Syncing
- **Ausstehend**: Pending
- **Fehlgeschlagen**: Failed
- **Aktualisiert vor**: Updated
- **Keine Verbindung**: No connection
- **Langsame Verbindung**: Slow connection

## Do's and Don'ts

### ✅ DO's

- Show sync status for modified items only
- Provide manual sync option
- Show data age when relevant
- Use subtle animations
- Auto-dismiss success messages

### ❌ DON'T's

- Don't show indicators for synced items
- Don't block UI during sync
- Don't use alarming colors for offline
- Don't animate excessively
- Don't hide sync errors

## Performance Considerations

- Debounce connection checks (5s minimum)
- Batch sync status updates
- Use CSS animations for icons
- Minimize re-renders on status change
- Cache connection state

## Analytics Events

- offline_mode_entered / offline_mode_exited
- sync_queue_size (count)
- sync_success_rate
- data_staleness_warning_shown
- manual_sync_triggered

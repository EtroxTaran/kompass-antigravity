# Sync Progress Patterns - Figma Make Prompt

## Context & Purpose

- **Component Type**: Progress Feedback Component
- **User Roles**: All users (offline-first PWA)
- **Usage Context**: Show sync progress for offline changes, bulk operations
- **Business Value**: User confidence, operation transparency, error recovery

## Design Requirements

### Visual Hierarchy

- **Overall progress**: Primary progress indicator
- **Item-level progress**: Individual operation status
- **Error handling**: Clear error states with actions
- **Success feedback**: Completion confirmation

### Progress Types

- Determinate (known total)
- Indeterminate (unknown duration)
- Segmented (multi-step)
- Queue-based (item by item)

### shadcn/ui Components

- Progress, Alert, Card, Button
- Custom queue visualization
- Toast notifications

## Figma Make Prompt

Create comprehensive sync progress components for KOMPASS that provide clear feedback during data synchronization operations with detailed progress tracking and error handling.

**Full-Screen Sync Modal (Initial Sync):**

```
┌─────────────────────────────────────────────┐
│ Erste Synchronisierung                  [×] │
├─────────────────────────────────────────────┤
│                                             │
│     [KOMPASS Logo]                          │
│                                             │
│ Ihre Daten werden vorbereitet...            │
│                                             │
│ ████████████████░░░░░░░░  75%               │
│                                             │
│ Kunden          ████████████ 247/247        │
│ Projekte        ████████░░░░  89/120        │
│ Opportunities   ██░░░░░░░░░░  15/156        │
│                                             │
│ Geschätzte Zeit: 2 Min. 30 Sek.            │
│                                             │
│ [Im Hintergrund fortfahren]                 │
└─────────────────────────────────────────────┘
```

**Specifications:**

- Modal: 500px × 400px (desktop), full screen (mobile)
- Overall progress: 8px height, primary blue
- Category progress: 4px height, gray background
- Time estimate: Updates every 5 seconds
- Background option: Only after 30 seconds

**Floating Sync Widget (Background Sync):**

```
Collapsed:
┌────────────────────┐
│ ⟳ Sync 12/45      │
└────────────────────┘

Expanded on hover/tap:
┌─────────────────────────────────┐
│ Synchronisierung läuft...       │
│ ████████░░░░░░░ 12 von 45       │
│                                 │
│ ✅ 10 erfolgreich               │
│ ⟳ 2 in Bearbeitung             │
│ ⏳ 33 ausstehend                │
│                                 │
│ [Details] [Pausieren]           │
└─────────────────────────────────┘
```

**Position:** Bottom right (desktop), bottom center (mobile)
**Size:** 180px × 48px collapsed, 320px × 200px expanded

**Sync Queue Detail View:**

```
┌─────────────────────────────────────────────┐
│ Synchronisierungswarteschlange         [×] │
├─────────────────────────────────────────────┤
│ Filter: [Alle ▼] [Status ▼]                │
├─────────────────────────────────────────────┤
│                                             │
│ ✅ Kunde "Hofladen Müller" erstellt         │
│    vor 2 Min. • 1.2 KB                      │
│                                             │
│ ⟳ Opportunity "Projekt X" aktualisiert     │
│    ████████████░░░░ 85%                     │
│                                             │
│ ⚠️ Projekt "Website" - Konflikt              │
│    Lokale und Server-Version unterschiedlich│
│    [Konflikt lösen]                         │
│                                             │
│ ⏳ 30 weitere Einträge...                   │
│                                             │
│ [Alle wiederholen] [Fehler wiederholen]     │
└─────────────────────────────────────────────┘
```

**Conflict Resolution Dialog:**

```
┌─────────────────────────────────────────────┐
│ Synchronisierungskonflikt             [×]  │
├─────────────────────────────────────────────┤
│                                             │
│ Projekt "Website Relaunch"                  │
│                                             │
│ Feld: Budget                                │
│ ┌──────────────┬──────────────┐            │
│ │ Ihre Version │ Server-Vers. │            │
│ │ €45.000      │ €42.000      │            │
│ │ Geändert:    │ Geändert:    │            │
│ │ vor 5 Min.   │ vor 3 Min.   │            │
│ │ Von: Sie     │ Von: M.Weber │            │
│ └──────────────┴──────────────┘            │
│                                             │
│ [Meine behalten] [Server-Version] [Mergen]  │
└─────────────────────────────────────────────┘
```

**Progress States Visual:**

```
Not started:
░░░░░░░░░░░░░░░░░░░░ 0%

In progress:
████████████░░░░░░░░ 60%

Complete:
████████████████████ 100% ✓

Error:
████████████░░░░░░░░ 60% ⚠️

Paused:
████████████░░░░░░░░ 60% ⏸️
```

**Multi-Step Sync Progress:**

```
┌─────────────────────────────────────────────┐
│ Datenabgleich                               │
├─────────────────────────────────────────────┤
│                                             │
│ 1. Verbindung herstellen         ✅         │
│ 2. Änderungen sammeln            ✅         │
│ 3. Daten hochladen               ⟳         │
│    ████████░░░░░░░░ 156/389 KB             │
│ 4. Server-Antwort verarbeiten    ⏳         │
│ 5. Lokale Daten aktualisieren    ⏳         │
│                                             │
│ Gesamtfortschritt: 45%                      │
└─────────────────────────────────────────────┘
```

**Toast Notifications:**

```
Success:
┌─────────────────────────────────┐
│ ✅ Synchronisierung erfolgreich │
│ 45 Einträge aktualisiert        │
│                          [×]    │
└─────────────────────────────────┘

Error:
┌─────────────────────────────────┐
│ ⚠️ Synchronisierung teilweise   │
│ fehlgeschlagen                  │
│ 3 von 45 Einträgen mit Fehlern │
│ [Details anzeigen]       [×]    │
└─────────────────────────────────┘
```

**Mobile Sync Sheet (Bottom Sheet):**

```
┌─────────────────────────────┐
│ ═══════════════             │ ← Drag handle
│ Synchronisiere...           │
│                             │
│ ████████████░░░░ 67%        │
│ 23 von 34 Einträgen         │
│                             │
│ ↓ Nach unten für Details    │
└─────────────────────────────┘

Expanded:
┌─────────────────────────────┐
│ ═══════════════             │
│ Synchronisierung            │
├─────────────────────────────┤
│ ✅ Kunden         12/12     │
│ ⟳ Projekte       5/8       │
│ ⏳ Dokumente      0/14      │
│                             │
│ 2 Konflikte gefunden        │
│ [Konflikte anzeigen]        │
│                             │
│ [Pausieren] [Abbrechen]     │
└─────────────────────────────┘
```

## Implementation Patterns

### Progress Calculation

```typescript
interface SyncProgress {
  total: number;
  completed: number;
  failed: number;
  inProgress: number;
  bytesTransferred?: number;
  totalBytes?: number;
  estimatedTimeRemaining?: number;
}

function calculateProgress(queue: SyncItem[]): SyncProgress {
  const total = queue.length;
  const completed = queue.filter((i) => i.status === "completed").length;
  const failed = queue.filter((i) => i.status === "failed").length;
  const inProgress = queue.filter((i) => i.status === "syncing").length;

  const progress = total > 0 ? (completed / total) * 100 : 0;
  const rate = completed / (Date.now() - startTime);
  const remaining = (total - completed) / rate;

  return {
    total,
    completed,
    failed,
    inProgress,
    estimatedTimeRemaining: remaining,
  };
}
```

### Time Estimation

```typescript
function formatTimeRemaining(ms: number): string {
  if (ms < 60000) return "Weniger als 1 Minute";

  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);

  if (minutes > 60) {
    const hours = Math.floor(minutes / 60);
    return `Etwa ${hours} Std. ${minutes % 60} Min.`;
  }

  return `Etwa ${minutes} Min. ${seconds} Sek.`;
}
```

### Error Recovery

```typescript
interface SyncError {
  item: SyncItem;
  error: Error;
  retryCount: number;
  canRetry: boolean;
}

// Automatic retry with exponential backoff
async function retrySyncItem(error: SyncError) {
  if (!error.canRetry || error.retryCount >= 3) {
    return { status: "failed", requiresManual: true };
  }

  const delay = Math.pow(2, error.retryCount) * 1000;
  await sleep(delay);

  return syncItem(error.item);
}
```

## Accessibility

### Progress Announcements

```html
<div
  role="progressbar"
  aria-valuenow="67"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-label="Synchronisierung 67 Prozent abgeschlossen"
>
  <div class="progress-bar" style="width: 67%"></div>
</div>

<!-- Live region for updates -->
<div role="status" aria-live="polite" aria-atomic="true">
  <span class="sr-only"> 23 von 34 Einträgen synchronisiert </span>
</div>
```

### Keyboard Controls

- Space/Enter: Pause/resume sync
- Escape: Minimize progress dialog
- Tab: Navigate between actions
- Arrow keys: Navigate queue items

## German Labels

- **Synchronisierung**: Synchronization
- **Warteschlange**: Queue
- **Fortschritt**: Progress
- **Erfolgreich**: Successful
- **Fehlgeschlagen**: Failed
- **Konflikt**: Conflict
- **Wiederholen**: Retry
- **Geschätzte Zeit**: Estimated time
- **Pausieren**: Pause
- **Fortfahren**: Continue

## Do's and Don'ts

### ✅ DO's

- Show overall and item progress
- Provide time estimates
- Allow background sync
- Show clear error states
- Enable retry for failures

### ❌ DON'T's

- Don't block UI during sync
- Don't hide errors
- Don't force modal sync
- Don't lose user changes
- Don't auto-retry infinitely

## Mobile Considerations

- Use bottom sheet for details
- Compact progress in status bar
- Allow app switching during sync
- Show notification on completion
- Optimize for one-handed use

## Performance

- Update progress every 500ms max
- Batch UI updates
- Use requestAnimationFrame for animations
- Virtualize long queue lists
- Cancel sync on app background

## Analytics Events

- sync_started (total_items, estimated_bytes)
- sync_progress (percent, items_complete)
- sync_completed (duration, success_rate)
- sync_error (error_type, retry_count)
- conflict_resolved (resolution_type)
- sync_cancelled (reason, progress)

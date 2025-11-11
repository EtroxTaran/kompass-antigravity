# Offline Sync Status (Mobile) - Figma Make Prompt

## Context & Purpose
- **Platform**: Mobile PWA (PouchDB/CouchDB)
- **User Role**: All (especially ADM)
- **Usage Context**: Monitor offline data, sync status, conflict resolution
- **Key Features**: Queue visibility, manual sync, conflict alerts

## Figma Make Prompt

Create a mobile offline sync status interface for KOMPASS with sync queue visibility, manual sync trigger, storage usage, conflict resolution alerts, and German labels.

**Entry Points:**
- Persistent indicator: Top banner or status bar icon
- Settings menu: "Offline & Synchronisation"
- Dashboard: Sync status widget

**Top Banner (Persistent):**
- Online: "Synchronisiert ✓" (green, small, auto-hide after 2s)
- Offline: "Offline-Modus" (amber, persistent)
- Syncing: "Synchronisiere... (12/45)" (blue, progress)
- Error: "Sync-Fehler" (red, tap to view details)
- Tap banner: Opens full sync status view

**Full Sync Status View (Bottom Sheet or Full Screen):**

**Header:**
- Title: "Offline & Synchronisation" (24px, bold)
- Close: "X" top-right
- Last sync: "Zuletzt synchronisiert: Vor 5 Minuten"

**Section: Verbindungsstatus**
- Large status card:
  - **Online:**
    - Icon: WiFi (green)
    - Text: "Online" (green, 24px, bold)
    - Subtext: "Alle Daten aktuell"
  - **Offline:**
    - Icon: WiFi-off (amber)
    - Text: "Offline" (amber, 24px, bold)
    - Subtext: "Änderungen werden lokal gespeichert"
- Network type: "WLAN" or "Mobilfunk" or "Keine Verbindung"

**Section: Sync-Warteschlange**
- Card: "Ausstehende Synchronisation"
- Count: "12 Änderungen warten" (amber badge)
- List of queued items (collapsible):
  - Each item: Icon, type, entity, timestamp
  - Example: "✏️ Aktivität aktualisiert: Besuch bei Hofladen Müller - Vor 10 Min"
  - Types: "Erstellt", "Aktualisiert", "Gelöscht"
- Empty state: "Keine ausstehenden Änderungen" (green checkmark)

**Section: Manueller Sync**
- Button: "Jetzt synchronisieren" (large, blue, full-width)
- Enabled: Only when online
- Disabled: "Keine Verbindung" (grayed out)
- Loading: Spinner + "Synchronisiere..." + progress (12/45)
- Success: Green checkmark + "Synchronisierung abgeschlossen"

**Section: Speicher-Nutzung**
- Progress bar: Storage used (visual)
- Text: "2,3 MB von 50 MB verwendet (4,6%)" (green if < 80%, amber if 80-95%, red if > 95%)
- Warning: "Speicher fast voll - Bitte synchronisieren" (if > 80%)
- Button: "Daten bereinigen" (if > 95%)

**Section: Offline-Daten**
- List of cached data types:
  - "Kunden: 32" (blue badge)
  - "Aktivitäten: 124" (blue badge)
  - "Opportunities: 12" (blue badge)
  - "Dokumente: 8" (blue badge)
- Total: "176 Einträge offline verfügbar"
- Last updated: "Zuletzt aktualisiert: Vor 5 Minuten"

**Section: Konflikte (If Any)**
- Alert card: "3 Konflikte müssen gelöst werden" (red, prominent)
- List of conflicts:
  - Each conflict: Icon, entity, message
  - Example: "⚠️ Kunde 'Hofladen Müller' wurde gleichzeitig geändert"
  - Action: "Konflikt lösen" button
- Tap: Opens conflict resolution dialog

**Conflict Resolution Dialog:**
- Shows: Local version vs. Server version side-by-side
- Fields: Highlight differences (yellow)
- Actions:
  - "Meine Version behalten" (blue)
  - "Server-Version behalten" (blue)
  - "Manuell zusammenführen" (amber)
- Auto-resolution: "Neueste Version bevorzugen" (checkbox)

**Section: Einstellungen**
- Toggle: "Auto-Sync bei WLAN" (default: ON)
- Toggle: "Auto-Sync bei Mobilfunk" (default: OFF)
- Toggle: "Daten vorladen bei WLAN" (default: ON)
- Slider: "Offline-Zeitraum: 30 Tage" (data retention)

**Section: Sync-Historie**
- Last 10 sync events
- Each event: Timestamp, status (success/error), items synced
- Example: "15.11.24 10:30 - Erfolgreich - 8 Aktivitäten synchronisiert"
- Tap: Show details

**Error States:**
- Sync failed: "Synchronisierung fehlgeschlagen" (red)
- Reason: "Server nicht erreichbar" or "Authentifizierung fehlgeschlagen"
- Action: "Erneut versuchen" button
- Support: "Hilfe" link (opens support contact)

**Visual Indicators:**
- Success: Green checkmark
- Pending: Amber clock
- Error: Red alert triangle
- Syncing: Blue spinner or progress ring

**Notifications:**
- Sync complete: "12 Änderungen synchronisiert" (green toast)
- Sync error: "Synchronisierung fehlgeschlagen - Bitte prüfen" (red toast)
- Conflict: "3 Konflikte gefunden - Bitte lösen" (amber toast, persistent)
- Storage warning: "Speicher bei 85% - Daten bereinigen empfohlen" (amber toast)

**Mobile Optimizations:**
- Bottom sheet: Swipeable (peek, half, full)
- Touch targets: Large buttons (44px)
- Loading: Skeleton loaders for sync progress
- Animations: Smooth transitions (200ms)

**Accessibility:**
- ARIA labels for all status icons
- Voice-over: Describes sync status
- High contrast: Clear visual indicators
- Haptic feedback: On sync complete/error

**Example Flow:**
1. User is offline, creates 3 activities
2. Top banner: "Offline-Modus" (amber)
3. User taps banner
4. Sync status view opens
5. Shows: "3 Änderungen warten" (amber badge)
6. User connects to WiFi
7. Banner changes: "Online ✓" (green)
8. Auto-sync starts: "Synchronisiere... (1/3)" (blue, progress)
9. Complete: "Synchronisierung abgeschlossen" (green toast)
10. View updates: "Keine ausstehenden Änderungen" (green checkmark)

## Implementation Notes
```bash
npx shadcn-ui@latest add sheet button badge progress alert toast
# Offline: Use PouchDB for local storage
# Sync: PouchDB replication with CouchDB
# Network: Use navigator.onLine and online/offline events
```


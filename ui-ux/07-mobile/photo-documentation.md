# Photo Documentation (Mobile) - Figma Make Prompt

## Context & Purpose

- **Platform**: Mobile PWA (camera access)
- **User Role**: ADM, PLAN (primarily field users)
- **Usage Context**: Document project progress, customer sites, products
- **Key Features**: Multi-photo capture, annotation, linking to entities, offline queue

## Figma Make Prompt

Create a mobile photo documentation interface for KOMPASS with multi-photo capture, annotation, tagging, entity linking, and offline support with German labels.

**Entry Points:**

- Project detail: "Fotos hinzufügen" button
- Activity log: Camera icon
- Customer detail: "Dokumentation" tab → "+ Foto"
- FAB on dashboard: Camera icon (quick access)

**Screen 1: Camera View**

- Full-screen camera preview
- Camera controls:
  - Flash: Top-right (auto/on/off)
  - Flip: Top-left (front/back camera)
  - Grid: Toggle (rule of thirds)
  - Close: "X" top-left
- Capture button: Large circular button (80px) at bottom center
  - Tap: Takes photo
  - Flash animation + shutter sound
- Gallery: Thumbnail (bottom-left) to view captured photos
- Photo count: Badge on gallery thumbnail "3" (if multiple photos taken)

**Multi-Photo Mode:**

- After first capture: Button changes to "Weiter aufnehmen" (circular arrow icon)
- Thumbnail strip: Bottom of screen (horizontal scroll)
- Shows: All captured photos (48px thumbnails)
- Tap thumbnail: Preview photo
- Swipe left on thumbnail: Delete photo
- Counter: "3 von 10" (limit: 10 photos per session)

**Screen 2: Photo Review**

- Triggered by: "Fertig" button or capture limit reached
- Grid view: All captured photos (2 columns)
- Each photo:
  - Thumbnail (full-width minus padding)
  - Timestamp: "10:15 Uhr"
  - Remove: "X" icon (top-right of thumbnail)
- Reorder: Long-press and drag
- Actions:
  - "Weitere Fotos aufnehmen" (link)
  - "Weiter" (large blue button)

**Screen 3: Annotation & Tagging**

- Shows: First photo (full-width)
- Swipe left/right: Navigate through photos
- Photo counter: "1 von 3" (top-center)

**Annotation Tools:**

- Floating toolbar (bottom):
  - Pen icon: Draw/markup (freehand)
  - Text icon: Add text label
  - Arrow icon: Add directional arrow
  - Shapes: Circle, rectangle
  - Color picker: Red, blue, green, yellow
  - Undo/Redo
  - Clear all
- Canvas overlay: Transparent layer for drawing
- Save: Auto-saves markup

**Tagging Section (Below Photo):**

- **Beschreibung:**
  - Textarea: "Beschreibung hinzufügen..."
  - Voice-to-text: Microphone icon
  - Examples: "Rohbau abgeschlossen", "Elektroinstallation fertig"
  - Character count: 200 max
- **Verknüpfung:**
  - Dropdown: "Verknüpfen mit..."
  - Options:
    - "Projekt" → Select project
    - "Kunde" → Select customer
    - "Aktivität" → Select activity
    - "Opportunity" → Select opportunity
  - Selected: Shows chip with name
- **Tags:**
  - Chips (pre-defined): "Rohbau", "Elektrik", "Möbel", "Beleuchtung", "Fertigstellung"
  - Add custom: "+ Tag hinzufügen"
  - Multiple selection: Chips can be toggled on/off
- **Sichtbarkeit:**
  - Toggle: "Für Team sichtbar" (default: ON)
  - Toggle: "Für Kunde sichtbar" (default: OFF)

**Navigation:**

- "Zurück" button: Previous photo (or previous screen if first photo)
- "Weiter" button: Next photo (or save if last photo)
- Skip: "Alle überspringen und speichern" (link)

**Screen 4: Final Review**

- List of all photos with metadata
- Each item:
  - Thumbnail (80px)
  - Description (truncated)
  - Linked entity: "Projekt: P-2024-B023"
  - Tags: Chips
- Edit: Tap item to edit description/tags
- Delete: Swipe left
- Reorder: Long-press and drag

**Actions (Bottom, Sticky):**

- Primary: "Fotos speichern" (large blue button)
- Secondary: "Abbrechen" (gray)

**Offline Behavior:**

- Photos saved locally (IndexedDB or PouchDB)
- Queued for upload when online
- Status indicator: "3 Fotos warten auf Upload" (amber)
- Auto-upload when WiFi detected
- Compression: Photos compressed to reduce storage

**Upload Progress:**

- Shows when online and uploading
- Progress bar: "Uploading 1 von 3..."
- Thumbnail: Shows upload status (spinner, checkmark, error)
- Retry: Tap failed photo to retry upload

**Success Feedback:**

- Toast: "3 Fotos gespeichert" (green checkmark)
- Or: "3 Fotos in Warteschlange - werden hochgeladen" (amber)
- Navigate: Returns to entity detail (project/customer) or dashboard

**Gallery View (Alternative Entry):**

- View existing photos for entity
- Grid layout: 3 columns
- Filters: Date, tags, linked entity
- Tap photo: Full-screen view with swipe
- Download: Long-press photo → "Herunterladen"

**Full-Screen Photo View:**

- Swipe left/right: Navigate
- Pinch to zoom
- Metadata overlay (bottom):
  - Description
  - Date/time
  - Uploaded by: "Michael Schmidt"
  - Tags
  - Linked entity
- Actions:
  - Share (share icon)
  - Download (download icon)
  - Delete (trash icon, if owner)

**Mobile Optimizations:**

- Camera: Use native camera API for best quality
- Compression: Compress images to < 1 MB per photo
- Thumbnails: Generate low-res thumbnails for preview
- Lazy load: Load full-res images on demand
- Pinch to zoom: In full-screen view
- Haptic feedback: On capture, on save

**Accessibility:**

- ARIA labels for all camera controls
- Voice-over: Describes captured photos
- High contrast: Clear buttons on dark overlay
- Large touch targets: 44px minimum

**Storage Management:**

- Warn if storage > 80%: "Speicher fast voll - Fotos werden komprimiert"
- Auto-cleanup: Delete uploaded photos after 30 days (optional setting)
- Manual cleanup: "Alte Fotos löschen" in settings

**Example Flow:**

1. User in project detail, taps "Fotos hinzufügen"
2. Camera opens, full-screen preview
3. User takes 3 photos of project progress
4. User taps "Fertig"
5. Grid view shows 3 photos
6. User taps "Weiter"
7. Annotation view: User swipes through photos
8. Photo 1: User draws arrow, adds text "Rohbau hier"
9. User adds description: "Elektroinstallation abgeschlossen"
10. User links to: "Projekt P-2024-B023"
11. User adds tags: "Elektrik", "Rohbau"
12. User taps "Weiter" (photo 2, photo 3)
13. Final review: Shows all 3 photos with metadata
14. User taps "Fotos speichern"
15. Toast: "3 Fotos in Warteschlange - werden hochgeladen" (offline)
16. User connects to WiFi
17. Auto-upload starts: Progress "1 von 3..."
18. Complete: Toast "3 Fotos hochgeladen" (green)

## Implementation Notes

```bash
npx shadcn-ui@latest add button textarea sheet toast badge
# Camera: Use <input type="file" capture="environment" multiple>
# Annotation: Use fabric.js or canvas API
# Storage: Use IndexedDB for offline photos
# Compression: Use browser-image-compression
```

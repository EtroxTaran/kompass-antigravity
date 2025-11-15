# Quick Activity Log (Mobile) - Figma Make Prompt

## Context & Purpose

- **Platform**: Mobile PWA (iOS/Android)
- **User Role**: ADM (Sales Field)
- **Usage Context**: Log customer activities during/after visits
- **Key Features**: Voice-to-text, quick templates, offline support

## Figma Make Prompt

Create a mobile-first quick activity logging interface for KOMPASS ADM users with voice-to-text, quick templates, photo capture, and offline queueing with German labels.

**Layout: Bottom Sheet / Full Screen Modal**

- Triggered by: FAB "+" button on dashboard
- Slide up from bottom (iOS style) or full screen (Android style)
- Close: "X" top-left or swipe down

**Header:**

- Title: "Aktivität hinzufügen" (24px, bold)
- Subtitle: Shows current customer if pre-selected
- Offline indicator: Amber badge "Offline - wird später synchronisiert"

**Section: Aktivitätstyp (Quick Selection)**

- Large icon buttons (60px, 2 columns):
  - "Anruf" (phone icon)
  - "Besuch" (map-pin icon)
  - "E-Mail" (mail icon)
  - "Notiz" (edit icon)
  - "Foto" (camera icon)
  - "Besprechung" (users icon)
- Selected: Blue background, white icon
- Touch target: 80px (44px + padding)

**Section: Kunde auswählen**

- Dropdown/Select: "Kunde wählen..."
- Shows: Recent customers (last 5)
- Search: Type to filter
- GPS suggestion: "In der Nähe: Hofladen Müller (500m)" (location icon)

**Section: Beschreibung**

- Large textarea (150px height)
- Placeholder: "Was wurde besprochen oder vereinbart?"
- Voice button: Large microphone icon (bottom-right of textarea)
  - Tap: Start voice recording
  - Recording: Red pulse animation, "Aufnahme läuft..."
  - Stop: Transcribed text appears in textarea
  - Edit: User can edit transcribed text

**Quick Templates (Chips):**

- Pre-defined phrases (tappable chips)
- "Angebot präsentiert"
- "Nachfass-Termin vereinbart"
- "Kunde hat Interesse"
- "Preis besprochen"
- "Dokumente übergeben"
- Tap chip: Inserts text into description

**Section: Datum & Uhrzeit**

- Default: NOW (current date/time)
- Date picker: Tap to change (German calendar)
- Time picker: Tap to change (24h format)
- Quick options: "Jetzt", "Vor 1 Std", "Vor 2 Std"

**Section: Nächster Schritt (Optional)**

- Textarea (smaller, 80px)
- Placeholder: "Was ist der nächste Schritt?"
- Examples: "Angebot nachfassen am 20.11.", "Projektstart planen"

**Section: Follow-up Datum (Optional)**

- Date picker: "Follow-up Termin"
- Toggle: "Erinnerung setzen" (bell icon)
- Default: +1 week

**Section: Foto hinzufügen (Optional)**

- Button: "Foto aufnehmen" (camera icon)
- Or: "Aus Galerie wählen" (image icon)
- Preview: Thumbnail if photo selected
- Use case: Product photos, business cards, project sites

**Actions (Bottom, Sticky):**

- Primary button: "Speichern" (large, blue, full-width)
- Secondary: "Abbrechen" (gray, text button)
- Loading state: Spinner + "Speichert..." (if online) or "Wird in Warteschlange gesetzt..." (if offline)

**Offline Behavior:**

- All activities queued locally (PouchDB)
- Amber banner: "Offline - 3 Aktivitäten warten auf Synchronisation"
- Auto-sync when online
- Conflict resolution: Show alert if needed

**Voice-to-Text Details:**

- Large microphone icon (48px)
- Tap to start: Changes to red with pulse animation
- Shows waveform or level meter while recording
- Tap again to stop: Transcribes and fills textarea
- Accuracy indicator: "Überprüfen Sie den Text" (info icon)
- Supports German language
- Fallback: Manual text input

**Success Feedback:**

- Toast: "Aktivität gespeichert" (green checkmark)
- Or: "Aktivität in Warteschlange - wird synchronisiert" (amber)
- Auto-close modal after success

**Mobile Optimizations:**

- Touch targets: Min 44px
- Thumb-zone layout: Primary actions at bottom
- Swipe gestures: Close, navigate
- Auto-focus on description textarea
- Keyboard: Shows immediately for text input
- Dark mode support: Auto-detect system preference

**Accessibility:**

- ARIA labels for all icons
- Voice-over support
- High contrast mode
- Large text support

**Example Flow:**

1. User taps FAB "+"
2. Sheet slides up
3. User taps "Besuch" icon (selected, blue)
4. User selects customer from recent: "Hofladen Müller"
5. User taps microphone icon
6. User speaks: "Kunde ist sehr zufrieden mit dem Angebot. Entscheidung soll nächste Woche fallen. Follow-up am Freitag vereinbart."
7. Text transcribed and appears in textarea
8. User reviews and taps "Speichern"
9. Green toast: "Aktivität gespeichert"
10. Modal closes, returns to dashboard

## Implementation Notes

```bash
npx shadcn-ui@latest add button textarea select sheet toast
# Voice: Use Web Speech API
# Offline: PouchDB
```

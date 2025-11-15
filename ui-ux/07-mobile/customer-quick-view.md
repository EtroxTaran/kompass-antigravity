# Customer Quick View (Mobile) - Figma Make Prompt

## Context & Purpose

- **Platform**: Mobile PWA
- **User Role**: ADM (Sales Field)
- **Usage Context**: Quick customer lookup with essential info and actions
- **Key Features**: Fast search, one-tap call/email, recent activities

## Figma Make Prompt

Create a mobile customer quick view for KOMPASS with fast search, essential contact info, one-tap actions, and recent activity timeline with German labels.

**Entry: Search-First**

- Large search bar at top (sticky)
- Placeholder: "Kunde suchen..." (magnifying glass icon)
- Auto-focus on load
- Real-time search: Type to filter
- Voice search: Microphone icon (tap to speak)
- Recent searches: Below search bar (chips)

**Search Results (List):**

- Each customer card:
  - Company logo/initial (40px circle)
  - Company name (18px, bold)
  - Last activity: "Vor 3 Tagen - Angebot präsentiert"
  - Location: "München" + distance "8 km" (GPS icon)
  - Quick actions: Phone icon, Email icon (one-tap)
- Tap card: Opens quick view

**Quick View: Bottom Sheet (Swipeable)**

- Swipe up from bottom when customer selected
- 3 height states: Peek (30%), Half (60%), Full (90%)
- Peek state shows: Name, phone, email
- Swipe up: Reveals more info
- Swipe down: Minimizes or closes

**Header (Peek State):**

- Company name: "Hofladen Müller GmbH" (24px, bold)
- Status badge: "Aktiv" (green) or "Inaktiv" (gray)
- Rating: "A" badge (blue)
- Close: "X" top-right
- Expand: Handle bar or "▴" icon

**Quick Actions (Prominent, Always Visible):**

- 4 large icon buttons (56px, rounded):
  - "Anrufen" (phone icon, green)
  - "E-Mail" (mail icon, blue)
  - "Navigation" (map icon, blue)
  - "+ Aktivität" (plus icon, amber)
- One-tap actions: No confirmation needed
- Haptic feedback on tap

**Section: Kontaktdaten**

- Primary contact (if exists): Name, position
- Phone: "+49-89-1234567" (tap to call)
- Email: "info@hofladen-mueller.de" (tap to email)
- Address: "Industriestraße 42, 81379 München" (tap to navigate)
- Distance: "8 km entfernt" (GPS icon)

**Section: Schnellinfos (Chips/Badges):**

- Standorte: "3 Standorte" (building icon)
- Ansprechpartner: "5 Kontakte" (users icon)
- Opportunities: "2 aktiv (€ 150k)" (trending-up icon)
- Letzte Rechnung: "Vor 2 Wochen" (invoice icon)
- Tap chip: Navigate to detail view

**Section: Kürzliche Aktivitäten (Timeline)**

- Last 5 activities
- Each activity:
  - Icon: Phone, email, visit, note
  - Type: "Anruf"
  - Date: "Vor 3 Tagen"
  - Description: "Angebot nachgefasst" (truncated)
  - User: "Michael Schmidt"
- Tap: Expand to full details
- "Alle anzeigen" link at bottom

**Section: Offene Opportunities (Cards)**

- Each opportunity:
  - Name: "Ladeneinrichtung Filiale Süd"
  - Value: "€ 125.000"
  - Probability: "75%" (progress bar)
  - Status: "Verhandlung" badge
  - Close date: "15.12.2024"
- Tap: Navigate to opportunity detail

**Section: Ansprechpartner (Swipeable List)**

- Horizontal scrollable list of contacts
- Each card (120px width):
  - Avatar (48px)
  - Name: "Hans Müller"
  - Position: "GF"
  - Phone icon: Tap to call
  - Email icon: Tap to email
- Swipe left/right to browse
- "Alle anzeigen" link

**Section: Dokumente (Recent)**

- Last 3 documents
- Each: Icon (PDF/image), name, date
- Tap: View/download (if online)
- "Alle Dokumente" link

**Full Screen View (Swipe Up Fully):**

- Tabs at top: "Übersicht" | "Aktivitäten" | "Opportunities" | "Dokumente"
- Tab content: Scrollable
- Back button: "←" or swipe down

**Offline Behavior:**

- Essential data cached: Name, phone, email, last activity
- Full data: Syncs when online
- Indicator: "Offline - Einige Daten nicht verfügbar"
- Actions: Call/email work offline, navigation requires online

**Mobile Optimizations:**

- Swipe gestures: Up/down to expand/collapse
- Haptic feedback: On action taps
- One-thumb operation: Actions at bottom
- Large touch targets: 44px minimum
- Fast load: < 1 second to peek state
- Smooth animations: 200ms transitions

**Navigation Actions:**

- Tap address: Opens Google Maps/Apple Maps
- Route options: "Routenplaner öffnen"
- Show on map: Shows customer location on map

**Call/Email Actions:**

- Tap phone: Native dialer opens
- Tap email: Native email app opens
- Log activity: Prompt "Anruf protokollieren?" after call ends (optional)

**Accessibility:**

- ARIA labels for all icons
- Voice-over: Describes all sections
- High contrast: Clear text on backgrounds
- Large text support: Scales with system settings

**Example Flow:**

1. User opens customer search
2. User types "Hof" in search bar
3. Results filter: "Hofladen Müller GmbH" appears
4. User taps customer card
5. Quick view sheet swipes up (peek state)
6. User sees: Name, phone, email, quick actions
7. User taps "Anrufen" (green phone icon)
8. Native dialer opens with phone number
9. User makes call
10. After call: Prompt "Anruf protokollieren?"
11. User taps "Ja" → Opens quick activity log

## Implementation Notes

```bash
npx shadcn-ui@latest add sheet button badge card
# Swipeable: Use react-spring or framer-motion
# Location: Use Geolocation API
```

# ADM Dashboard (Sales Field) - Figma Make Prompt

## Context & Purpose

- **User Role**: ADM (Außendienst / Sales Field)
- **Business Value**: Customer management, opportunities, activities (mobile-first)
- **Access**: OWN customers and opportunities ONLY (RBAC enforced)
- **Key Focus**: Customer visits, opportunity tracking, quick activity logging

## Figma Make Prompt

Create an ADM (Sales Field) dashboard for KOMPASS showing personal customers, opportunities, activities, tasks, and quick actions with German labels and mobile-first design.

**Header:**

- "Meine Kunden" (28px, bold)
- Location: "München" (GPS icon) - current location
- Date: "Heute, 15. Nov. 2024"
- User: Avatar + "Michael Schmidt (ADM)"
- Weather (optional): "12°C, bewölkt" (small)
- **AI Toggle:** Switch "KI-Features" (top-right, default OFF until Phase 3)

**KPI Cards (Top Row - 3 cards, mobile-friendly):**

1. **Meine Kunden**
   - Count: "32" (36px, blue)
   - Active: "28" (green)
   - Inactive: "4" (gray)
2. **Meine Opportunities**
   - Value: "€ 850.000" (36px, amber)
   - Count: "12 Opportunities"
   - Close soon: "3 diese Woche" (orange badge)
3. **Aktivitäten (heute)**
   - Geplant: "5" (blue)
   - Abgeschlossen: "2" (green)
   - Überfällig: "1" (red)

**Section: Heutige Tour & Route (Enhanced Map View)**

- **Tour-Widget (Collapsible):**
  - Title: "München Nord Tour - Heute"
  - Progress: "████████████░░░░░ 2 von 4 Stopps"
  - Status: "🔴 Live • 31km gefahren"
  - Quick actions: [Route optimieren] [Tour beenden]
- **Embedded map showing:**
  - Current location: Blue pulsing dot with accuracy circle
  - Planned visits: Numbered markers (1, 2, 3, 4)
  - Completed visits: Green checkmarks
  - Customer locations: Building icons with status
  - Route: Blue line for driven, dotted for planned
  - Traffic overlay: Red/amber/green segments
- **[Phase 3] AI Route Optimization Banner:**
  - **Data Requirement:** 3+ months GPS tracking, 50+ tours - See [AI Data Requirements](../../docs/specifications/AI_DATA_REQUIREMENTS.md)
  - "🔮 Route optimiert: 12 km gespart!"
  - "Neue Reihenfolge: 2→4→3 statt 2→3→4"
  - Actions: [Anwenden] [Original behalten]
  - **User Control:** Can be permanently disabled in settings
- **Visit list below map:**
  - Each visit: Time, customer name, status, distance, actions
  - Example:
    - "✅ 09:00 - Bio-Markt Schmidt, 12 km, Check-in: 09:15"
    - "🔵 10:15 - Hofladen Müller, 8 km, ETA: 10:22 [Navigate →]"
    - "⏳ 11:30 - Gartencenter Grün, 15 km [Details]"
  - Swipe right: Complete visit
  - Swipe left: Skip/reschedule
- Actions: "+ Stopp hinzufügen" | "Route exportieren"

**Section: Meine Aufgaben (Todo List)**

- Priority tasks for today
- Each task: Checkbox, description, customer, due time
- Example: "☐ Angebot nachfassen - REWE München - 14:00"
- Color: Overdue (red text), Today (blue), Upcoming (gray)
- Add button: "+ Aufgabe"

**Section: Opportunities (diese Woche schließend)**

- **[Phase 3] AI Insights Banner:**
  - "💡 3 Opportunities mit hoher Abschlusswahrscheinlichkeit"
  - "Empfohlen: REWE München zuerst kontaktieren (85% Erfolg)"
  - **Only shown:** If AI toggle ON and data requirements met (100+ historical opportunities)
- List of opportunities closing this week
- Each card:
  - Customer name, opportunity name
  - Value, probability (user estimate)
  - **[Phase 3]** AI adjustment: "75% (AI: 85% ↑)" - shown only if AI toggle ON
  - Close date with urgency indicator
  - Status badge
  - **[Phase 3]** AI recommendation: "📞 Anrufen empfohlen" - shown only if AI toggle ON
  - Quick actions: "Anrufen", "Aktivität hinzufügen", "Details"
- Swipe left on mobile: Quick actions
- **[Phase 3]** AI priority marker: "🎯" - shown only if AI toggle ON

**Section: Kürzlich besuchte Kunden**

- List of recent customer visits
- Each card:
  - Customer name, location
  - Last visit: "Vor 3 Tagen"
  - Last activity: "Angebot präsentiert"
  - Quick actions: "Notiz hinzufügen", "Anrufen", "Details"

**Section: Neue Kontakte**

- Prompt: "Neuen Kontakt hinzugefügt?"
- Quick add button: "+ Kontakt erfassen" (camera icon for business card scan)

**Section: Ausgaben & Kilometer (Quick Access)**

- **Heute erfasst:**
  - Kilometer: "67 km" (auto-tracked)
  - Ausgaben: "€ 45,80" (2 Belege)
  - Status: "🟢 GPS-Tracking aktiv"
- Quick action cards:
  - [📸 Beleg fotografieren] - Opens camera
  - [🚗 Fahrt beenden] - Stop GPS tracking
  - [📊 Ausgaben-Übersicht] - View month summary

**Quick Actions (Floating Action Button / Bottom Bar):**

- Large FAB: Contextual action
  - During tour: "📍 Check-in"
  - Otherwise: "+ Aktivität"
- Bottom bar (5 icons):
  - "Tour" (map icon) - Active tour view
  - "Kunden" (building icon) - Customer list
  - "📸" (camera) - Quick expense capture
  - "Aufgaben" (checkbox icon) - Tasks
  - "Mehr" (dots icon) - Menu

**Mobile-Specific Features:**

- **[Phase 1] Voice-to-Text:**
  - German speech recognition for notes (Whisper or similar)
  - Voice commands: "Neue Notiz", "Kunde anrufen"
  - **Always available** - works offline
- **Camera Integration:**
  - **[Phase 1]** Business card OCR scan (auto-fill contact) - Basic OCR
  - **[Phase 2]** Receipt capture with AI categorization - Smart categorization
  - **[Phase 1]** Project photo documentation - Basic camera
  - **[Phase 2]** QR code scanning for customer check-in - Smart matching
- **GPS & Location:**
  - Auto-detect customer location
  - Background mileage tracking (GoBD compliant)
  - Real-time route optimization
  - Proximity alerts: "200m von Kunde XYZ"
- **PWA Capabilities:**
  - Install prompt: "App installieren" banner
  - Push notifications for tasks/appointments
  - Background sync with queue indicator
  - Home screen icon with badge count
  - Offline-first data access
- **Enhanced Phone Features:**
  - Click-to-call with call logging
  - SMS/WhatsApp integration
  - Contact sync with phone
- **Navigation:**
  - "Route starten" opens preferred maps app
  - Turn-by-turn directions overlay
  - Multi-stop route optimization

**Sidebar (Desktop) / Drawer (Mobile):**

- Filters: "Alle Kunden", "Heute besucht", "Opportunities"
- Quick stats: Total customers, total opportunity value
- Settings: Offline sync status

**Offline Indicator:**

- Top banner: "Offline-Modus" (amber) or "Synchronisiert" (green)
- Pending sync: "3 Aktivitäten zum Synchronisieren"

**Mobile Layout:**

- Stack all sections vertically
- Map: Full-width, 300px height
- Cards: Full-width, swipeable
- FAB: Bottom-right, large (56px)
- Bottom nav: Sticky

## Design Requirements

### Visual Hierarchy

1. Today's route: Prominent map
2. Tasks: Clear checklist
3. Opportunities: Closing soon highlighted
4. Quick actions: Large, accessible FAB

### shadcn/ui Components

```bash
npx shadcn-ui@latest add card badge button checkbox
# Map: Use react-leaflet or Google Maps
```

### Interaction

- Tap customer: Navigate to detail
- Swipe card: Quick actions
- Tap FAB: Quick activity log
- Voice button: Voice-to-text note

### Accessibility

- Large touch targets (44px minimum)
- High contrast for outdoor use
- Voice input for hands-free

### Example Data

- Customer: "Hofladen Müller, Industriestr. 42, Letzter Besuch: Vor 3 Tagen"
- Opportunity: "REWE München - Ladeneinrichtung, € 125k, 75%, Schließt: 15.12.24"
- Task: "Angebot nachfassen - REWE München - 14:00"

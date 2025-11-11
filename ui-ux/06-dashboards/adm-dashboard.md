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

**Section: Heutige Route (Map View)**
- Embedded map showing:
  - Current location: Blue dot
  - Planned visits: Numbered markers (1, 2, 3, 4, 5)
  - Customer locations: Building icons
  - Route: Dotted line connecting visits
- Visit list below map:
  - Each visit: Time, customer name, location, distance, "Navigate" button
  - Example: "10:00 - Hofladen Müller, Industriestr. 42, 8 km, [Navigate →]"
- Add button: "+ Besuch hinzufügen"

**Section: Meine Aufgaben (Todo List)**
- Priority tasks for today
- Each task: Checkbox, description, customer, due time
- Example: "☐ Angebot nachfassen - REWE München - 14:00"
- Color: Overdue (red text), Today (blue), Upcoming (gray)
- Add button: "+ Aufgabe"

**Section: Opportunities (diese Woche schließend)**
- List of opportunities closing this week
- Each card:
  - Customer name, opportunity name
  - Value, probability
  - Close date
  - Status badge
  - Quick actions: "Anrufen", "Aktivität hinzufügen", "Details"
- Swipe left on mobile: Quick actions

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

**Quick Actions (Floating Action Button / Bottom Bar):**
- Large FAB: "+ Aktivität" (primary action)
- Bottom bar icons:
  - "Anrufen" (phone icon)
  - "Notiz" (note icon, voice-to-text)
  - "Foto" (camera for project photos)
  - "Navigation" (map icon)

**Mobile-Specific Features:**
- **Voice-to-Text:** For quick note taking
- **Camera:** Business card scan, project photos
- **GPS:** Auto-detect customer location
- **Call Integration:** Tap phone to call
- **Navigation:** "Route starten" opens Google Maps

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


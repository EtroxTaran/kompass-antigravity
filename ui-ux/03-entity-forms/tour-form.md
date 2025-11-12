# Tour Planning Form - Figma Make Prompt

## Context & Purpose
- **Component Type**: Entity Creation/Edit Form
- **User Roles**: ADM (create/edit own), INNEN (full), GF (full), PLAN (read-only)
- **Usage Context**: Plan multi-stop customer visits with route optimization
- **Business Value**: Efficient field sales routing, time and cost optimization, customer visit tracking

## Design Requirements

### Visual Hierarchy
- **Clear multi-stop workflow**: Sequential stop management
- **Route optimization**: Visual route preview on map
- **Cost estimation**: Real-time calculation of distance/time/cost
- **Mobile-optimized**: Quick stop addition via GPS/customer search

### Form Structure
- Header with tour date and status
- Stop management section with drag-and-drop reordering
- Route preview map
- Cost/time estimation panel
- Action buttons (Save, Optimize Route, Start Tour)

### shadcn/ui Components
- Card, Form, Input, Button, Select, DatePicker
- Draggable list components
- Map integration component

## Figma Make Prompt

Create a comprehensive tour planning form for KOMPASS that enables field sales (ADM) to plan efficient multi-stop customer visits with route optimization and cost tracking.

**Form Layout (Desktop - 1200px):**

**Header Section:**
- Title: "Tourenplanung" (24px, semibold)
- Tour date selector: Calendar icon + "Do., 6. Februar 2025" (click to change)
- Status badge: "Geplant" (gray) | "Aktiv" (blue) | "Abgeschlossen" (green)
- Quick actions: "Route optimieren" (blue button), "Tour starten" (green button, disabled until saved)

**Tour Information Card:**
```
┌─────────────────────────────────────────────┐
│ Allgemeine Informationen                    │
├─────────────────────────────────────────────┤
│ Tourname *                                  │
│ [München Nord - Hofläden]                   │
│                                             │
│ Beschreibung                                │
│ [Monatliche Besuchsrunde bei Hofläden...]   │
│                                             │
│ Verantwortlicher ADM                        │
│ [👤 Michael Schmidt ▼]                      │
└─────────────────────────────────────────────┘
```

**Stops Management Section (Left Column - 600px):**
```
┌─────────────────────────────────────────────┐
│ Stopps (4)                   [+ Stopp]      │
├─────────────────────────────────────────────┤
│ ┌─── Stopp 1 ────────────────────[≡][×]───┐│
│ │ 📍 Hofladen Müller GmbH                  ││
│ │ Hauptstraße 15, 80331 München            ││
│ │ ⏱️ Geplant: 09:00-09:45 (45 Min.)        ││
│ │ 👤 Kontakt: Hans Müller                  ││
│ │ 📋 Notiz: Neue Produktlinie besprechen   ││
│ └───────────────────────────────────────────┘│
│                                             │
│ ─── 🚗 12 km, ~18 Min. ───                 │
│                                             │
│ ┌─── Stopp 2 ────────────────────[≡][×]───┐│
│ │ 📍 Bio-Markt Schmidt                     ││
│ │ Dorfstraße 8, 85774 Unterföhring         ││
│ │ ⏱️ Geplant: 10:15-11:00 (45 Min.)        ││
│ │ 👤 Kontakt: Maria Schmidt                 ││
│ │ ⚠️ Letzter Besuch: vor 45 Tagen          ││
│ └───────────────────────────────────────────┘│
│                                             │
│ [Weitere Stopps...]                         │
└─────────────────────────────────────────────┘
```

**Route Preview (Right Column - 600px):**
```
┌─────────────────────────────────────────────┐
│ Routenübersicht                             │
├─────────────────────────────────────────────┤
│ [       Interactive Map Preview       ]     │
│ [    with numbered stop markers      ]     │
│ [         and route lines           ]      │
│ [         Height: 400px             ]      │
├─────────────────────────────────────────────┤
│ Zusammenfassung:                            │
│ • Gesamtstrecke: 67 km                     │
│ • Fahrzeit: 1h 25min                       │
│ • Besuchszeit: 3h 15min                    │
│ • Gesamtdauer: 4h 40min                    │
│ • Geschätzte Kosten: €42,50                │
│   (0,50€/km + Spesen)                      │
└─────────────────────────────────────────────┘
```

**Add Stop Modal (600px × 500px):**
```
┌─────────────────────────────────────────────┐
│ Stopp hinzufügen                       [×] │
├─────────────────────────────────────────────┤
│ 🔍 Kunde suchen                             │
│ [Kundenname oder Ort...]                    │
│                                             │
│ Vorschläge (basierend auf Besuchsfrequenz):│
│ ┌───────────────────────────────────────┐   │
│ │ ⚠️ Baumarkt Weber - Überfällig 15 Tage│   │
│ │    Industriestr. 5, Garching          │   │
│ └───────────────────────────────────────┘   │
│ ┌───────────────────────────────────────┐   │
│ │ 📍 Gartencenter Grün - Fällig in 3 T. │   │
│ │    Blumenweg 12, Ismaning             │   │
│ └───────────────────────────────────────┘   │
│                                             │
│ ─── oder ───                                │
│                                             │
│ 📍 Standort manuell eingeben                │
│ [Adresse oder GPS-Koordinaten]              │
│                                             │
│ [Abbrechen]              [Stopp hinzufügen] │
└─────────────────────────────────────────────┘
```

**Stop Detail Fields:**
- Customer selection (searchable dropdown)
- Planned arrival time (time picker)
- Visit duration (15/30/45/60/90 min presets or custom)
- Contact person at location (auto-populated from customer)
- Visit notes/objectives (text area, 200 chars)
- Priority indicator (if overdue or urgent)

**Mobile Layout (375px):**
- Stacked layout: Info → Stops → Summary
- Bottom sheet for map preview
- Swipe actions on stops (reorder/delete)
- Floating action button for "Add Stop"
- Collapsible route summary

**Route Optimization Logic:**
- "Route optimieren" button triggers optimization algorithm
- Shows before/after comparison: "Sie sparen 12 km und 18 Minuten"
- Allows manual override of optimized order
- Considers customer time preferences (morning/afternoon)

**Cost Calculation:**
- Distance-based: €0.50/km (configurable)
- Time-based allowance: €25/day (if tour > 4 hours)
- Automatic hotel suggestion if tour end > 200km from start

**Validation & Business Rules:**
- Minimum 1 stop required
- Maximum 12 stops per day (configurable)
- Warning if total duration > 10 hours
- Alert if customer visit overdue
- Block overlapping time slots

## Interaction Patterns
- **Drag handles**: Reorder stops by dragging ≡ icon
- **Delete confirmation**: "Stopp entfernen?" dialog
- **Route optimization**: Animated reordering on optimization
- **Auto-save**: Every change saved as draft
- **Start tour**: Switches to tour execution mode (mobile)

## German Labels & Content
- **Stopp**: Stop/waypoint
- **Route optimieren**: Optimize route
- **Geplante Ankunft**: Planned arrival
- **Besuchsdauer**: Visit duration
- **Überfällig**: Overdue
- **Kunde nicht gefunden**: Customer not found
- **Tour kann nicht leer sein**: Tour cannot be empty

## Accessibility Requirements
- Drag-and-drop alternative: up/down arrow buttons
- ARIA labels for all interactive elements
- Keyboard navigation for stop management
- Screen reader announces route changes
- High contrast mode support

## Mobile Considerations
- **Touch targets**: 48px minimum for all buttons
- **Swipe gestures**: Left swipe to delete, hold to reorder
- **Bottom sheet**: Map preview slides up from bottom
- **GPS integration**: Current location for actual vs planned
- **Offline mode**: Cache route data for offline navigation

## Integration Points
- **Customer data**: Pull latest customer info and visit history
- **Calendar**: Check for conflicts with other appointments
- **Navigation**: Export to Google Maps/Apple Maps
- **Expense tracking**: Auto-create mileage log entry
- **Analytics**: Track planned vs actual routes

## Implementation Notes
```bash
# Required shadcn/ui components
npx shadcn-ui@latest add form card button input select
npx shadcn-ui@latest add dialog sheet popover calendar
npx shadcn-ui@latest add sortable-list # For drag-and-drop

# Map integration
# Consider: Mapbox GL JS, Leaflet, or Google Maps
# Requirement: Offline map tiles for rural areas

# Route optimization
# Consider: OSRM, GraphHopper, or custom algorithm
# Factors: Distance, time windows, priorities
```

## State Management
- Tour draft state (local storage)
- Stop list array with positions
- Optimization status (idle/processing/complete)
- Route preview data (polylines, markers)
- Cost calculation state

## Performance Requirements
- Route optimization < 3 seconds for 10 stops
- Map renders < 1 second
- Smooth drag-and-drop at 60fps
- Auto-save debounced to 1 second

## Error Handling
- "Kunde nicht gefunden" - Customer not found
- "Route konnte nicht berechnet werden" - Route calculation failed
- "Keine Internetverbindung" - No internet (use cached data)
- "Maximale Anzahl Stopps erreicht" - Maximum stops reached

## Analytics Events
- tour_created
- stop_added / stop_removed
- route_optimized (before/after metrics)
- tour_started / tour_completed
- optimization_savings (km, time, cost)

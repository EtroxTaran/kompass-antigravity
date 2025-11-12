# Tour List View - Figma Make Prompt

## Context & Purpose
- **Component Type**: List View with Calendar Integration
- **User Roles**: ADM (own tours), INNEN/GF (all tours), PLAN (read-only)
- **Usage Context**: View and manage planned tours, track tour history, analyze efficiency
- **Business Value**: Tour oversight, route optimization insights, cost tracking

## Design Requirements

### Visual Hierarchy
- **Calendar/List toggle**: Switch between calendar and list views
- **Status indicators**: Clear visual states for planned/active/completed
- **Cost summary**: Visible tour costs and efficiency metrics
- **Quick actions**: Start tour, edit, duplicate

### List Structure
- Filterable by date range, ADM, status
- Sortable by date, distance, cost, stops
- Groupable by week/month
- Summary statistics at top

### shadcn/ui Components
- Table, Calendar, Badge, Button, Filter panel
- Tabs for view switching
- Card for summary metrics

## Figma Make Prompt

Create a comprehensive tour list view for KOMPASS that displays planned and completed tours with calendar integration and efficiency metrics.

**Page Layout (Desktop - 1440px):**

**Header Section:**
```
┌─────────────────────────────────────────────────────────────┐
│ Tourenübersicht                                             │
│                                                             │
│ [Kalender] [Liste]           [Filter ▼] [+ Neue Tour]       │
└─────────────────────────────────────────────────────────────┘
```

**Summary Cards (4 × 280px):**
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Diese Woche │ Gefahren    │ Ø Effizienz │ Kosten MTD  │
│    8        │  347 km     │   4.2       │  €485.30    │
│   Touren    │  +12% ↑     │ Stopps/Tour │  Budget: 78%│
└─────────────┴─────────────┴─────────────┴─────────────┘
```

**List View:**
```
┌─────────────────────────────────────────────────────────────┐
│ [□] Tour         Datum      ADM        Stopps  km    Status │
├─────────────────────────────────────────────────────────────┤
│ □ München Nord   06.02.25   M.Schmidt    4    67   Geplant │
│   09:00-14:00    Do.                              [Start ▶]│
│                                                            │
│ □ Landkreis Süd  05.02.25   M.Schmidt    6    89   Aktiv  │
│   08:30-15:00    Mi.                              🟢 Live │
│                                                            │
│ □ City Route     04.02.25   A.Weber      8    45   ✓ Fertig│
│   10:00-16:30    Di.                              €38.50  │
│                                                            │
│ □ Großkunden     03.02.25   M.Schmidt    3   156   ✓ Fertig│
│   07:00-18:00    Mo.                              €95.00  │
│   ⚠️ 15km Umweg (Stau)                                    │
└─────────────────────────────────────────────────────────────┘
```

**Calendar View:**
```
┌─────────────────────────────────────────────────────────────┐
│ Februar 2025                                   [< Mo >]     │
├────┬────┬────┬────┬────┬────┬────┐                        │
│ Mo │ Di │ Mi │ Do │ Fr │ Sa │ So │                        │
├────┼────┼────┼────┼────┼────┼────┤                        │
│ 3  │ 4  │ 5  │ 6  │ 7  │ 8  │ 9  │                        │
│ •3 │ •8 │ •6 │ •4 │    │    │    │ Legend:              │
│MSch│AWeb│MSch│MSch│    │    │    │ • = Tour geplant     │
├────┼────┼────┼────┼────┼────┼────┤ 3 = Anzahl Stopps    │
│ 10 │ 11 │ 12 │ 13 │ 14 │ 15 │ 16 │ MSch = ADM Kürzel    │
│ •5 │    │ •7 │    │ •4 │    │    │                       │
│AWeb│    │MSch│    │AWeb│    │    │                       │
└────┴────┴────┴────┴────┴────┴────┘                       │
                                                            │
│ Ausgewählter Tag: Do., 6. Februar                         │
│ ┌────────────────────────────────────────────────┐       │
│ │ 09:00 München Nord Tour (M.Schmidt)           │       │
│ │       4 Stopps, 67 km, ca. 5 Std.             │       │
│ │       [Details] [Bearbeiten] [Tour starten]    │       │
│ └────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

**Filter Panel (Dropdown):**
```
┌─────────────────────────────────────┐
│ Filter                         [×] │
├─────────────────────────────────────┤
│ Zeitraum                            │
│ [Diese Woche ▼]                     │
│                                     │
│ ADM                                 │
│ ☑ Alle                              │
│ ☐ Michael Schmidt                   │
│ ☐ Anna Weber                        │
│                                     │
│ Status                              │
│ ☑ Geplant                           │
│ ☑ Aktiv                             │
│ ☑ Abgeschlossen                     │
│                                     │
│ [Filter zurücksetzen]               │
└─────────────────────────────────────┘
```

**Tour Row Expanded:**
```
┌─────────────────────────────────────────────────────────────┐
│ ▼ München Nord Tour - Do., 06.02.2025                      │
├─────────────────────────────────────────────────────────────┤
│ Route: Start → Hofladen Müller → Bio Schmidt → ... → Ende  │
│ Geplant: 67 km, 5h 15min | Tatsächlich: -- | Kosten: --   │
│                                                             │
│ Stopps:                                                     │
│ 1. Hofladen Müller (09:00-09:45) ✓ Besuch überfällig      │
│ 2. Bio-Markt Schmidt (10:15-11:00)                         │
│ 3. Gartencenter Grün (11:30-12:15)                         │
│ 4. Baumarkt Weber (13:00-13:45)                            │
│                                                             │
│ [Tour öffnen] [Bearbeiten] [Duplizieren] [Löschen]         │
└─────────────────────────────────────────────────────────────┘
```

**Mobile View (375px):**
```
┌─────────────────────────────┐
│ [☰] Touren    [Cal] [+ New] │
├─────────────────────────────┤
│ Diese Woche: 8 Touren       │
│ 347 km | €485.30            │
├─────────────────────────────┤
│ HEUTE                       │
│ ┌─────────────────────────┐ │
│ │ München Nord           │ │
│ │ 09:00 • 4 Stopps • 67km│ │
│ │ M.Schmidt    [Start ▶] │ │
│ └─────────────────────────┘ │
│                             │
│ MORGEN                      │
│ ┌─────────────────────────┐ │
│ │ Landkreis West         │ │
│ │ 08:00 • 5 Stopps • 82km│ │
│ │ A.Weber      Geplant   │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

**Quick Actions:**
- **Start Tour**: Green play button, opens tour execution mode
- **Edit**: Opens tour planning form
- **Duplicate**: Creates copy for next week/month
- **Delete**: With confirmation dialog

**Status Indicators:**
- **Geplant** (gray): Future tour
- **Aktiv** (blue pulse): Currently running with GPS tracking
- **Abgeschlossen** (green check): Completed tour
- **Abgebrochen** (red): Cancelled/incomplete tour

**Efficiency Metrics:**
- Planned vs actual distance
- Planned vs actual duration  
- Cost per stop
- Average time per stop
- Route optimization savings

## Interaction Patterns
- **Row click**: Expand to show stop details
- **Double click**: Open tour detail page
- **Hover**: Show quick stats tooltip
- **Bulk selection**: Checkbox for multiple tours
- **Calendar click**: Filter to selected date

## German Labels & Content
- **Geplant**: Planned
- **Aktiv**: Active  
- **Abgeschlossen**: Completed
- **Stopps**: Stops
- **Effizienz**: Efficiency
- **Kosten**: Costs
- **Diese Woche**: This week
- **Gefahrene Strecke**: Distance driven

## Accessibility Requirements
- Table has proper header associations
- Status communicated via text and color
- Keyboard navigation for all actions
- Screen reader announces tour summary
- Focus indicators on interactive elements

## Mobile Considerations
- **Swipe actions**: Right to start, left for options
- **Condensed cards**: Essential info only
- **Bottom tabs**: Quick filter access
- **Pull to refresh**: Update active tours
- **Offline indicator**: Show cached data age

## Performance Requirements
- Initial load < 1 second for 50 tours
- Smooth scrolling with 500+ tours
- Calendar renders instantly
- Filter updates < 200ms

## Implementation Notes
```bash
# Required shadcn/ui components
npx shadcn-ui@latest add table calendar tabs
npx shadcn-ui@latest add card badge button
npx shadcn-ui@latest add dropdown-menu sheet

# State management
- Tour list with pagination
- Filter state (URL params)
- View preference (list/calendar)
- Expanded rows state
```

## Analytics Events
- tour_list_viewed (view_type)
- tour_started_from_list
- tour_duplicated
- filter_applied (filter_type)
- efficiency_metrics_viewed

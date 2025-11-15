# Calendar View Component - Figma Make Prompt

**Component Type:** Core Interactive Component  
**User Roles:** All (GF, PLAN, INNEN, ADM, KALK, BUCH)  
**Usage:** Display and navigate tasks, projects, opportunities, and milestones in calendar format  
**Created:** 2025-01-28

---

## Context & Purpose

The Calendar View Component provides a unified calendar interface for displaying all date-driven entities in KOMPASS: UserTasks, ProjectTasks, Projects, Opportunities, and other scheduled items. It supports multiple view modes (Month, Week, Day, Agenda) and allows users to navigate dates, filter events, and interact with calendar items.

**Key Features:**

- Multiple view modes: Month, Week, Day, Agenda
- Color-coded events by type and priority
- Click-to-view event details
- Date range navigation (previous/next, today)
- Filter by event types (tasks, projects, opportunities)
- RBAC-filtered events (users see only permitted data)
- Mobile-optimized agenda view
- Touch-friendly targets (44px minimum)
- WCAG AA compliant colors and contrast

---

## Figma Make Prompt

**Copy everything below this line and paste into Figma Make:**

---

Create a **Calendar View Component** for the KOMPASS CRM application, displaying tasks, projects, and opportunities in a unified calendar interface.

## Component Structure

### 1. Calendar Header

- **View Mode Toggle** (horizontal button group):
  - Month button
  - Week button
  - Day button
  - Agenda button
  - Selected view: Primary blue background (#3B82F6), white text
  - Unselected views: Ghost button style (gray-200 background)
- **Navigation Controls** (center):
  - Previous arrow button (ChevronLeft icon, ghost style, 32px × 32px)
  - Current date range label (e.g., "Januar 2025" or "28.01.2025 - 03.02.2025")
  - Next arrow button (ChevronRight icon, ghost style, 32px × 32px)
  - Today button (secondary style, "Heute" label)
- **Action Buttons** (right):
  - Filter button (Filter icon, ghost style, badge if filters active)
  - Export button (Download icon, ghost style, "Export" label)
  - New Event button (Plus icon, primary style, "Neues Ereignis" label)

**Desktop Header Height:** 64px  
**Mobile Header Height:** 56px

---

### 2. Month View

#### Calendar Grid

- **7 columns** (Monday - Sunday)
- **5-6 rows** (weeks)
- **Day Cell Structure**:
  - Day number (top-left, 14px font, gray-700)
  - Event cards (stacked vertically, max 3 visible)
  - "+N more" link if >3 events (gray-500, 12px font)

#### Event Card (in Month View)

- **Height:** 24px (compact)
- **Padding:** 4px 8px
- **Border-left:** 3px solid {color}
- **Background:** {color} with 10% opacity
- **Layout:**
  - Event icon (left, 14px, {color} solid)
  - Event title (truncated with ellipsis, 12px font, gray-900)
  - Time label (right, 11px font, gray-600, e.g., "14:00")

**Event Colors by Type:**

- UserTask: Blue (#3B82F6)
- ProjectTask: Green (#10B981)
- Project Deadline: Green (#10B981)
- Opportunity Close: Purple (#A855F7)
- High/Urgent Priority: Orange (#F97316) or Red (#EF4444) - overrides type color

**Day Cell Hover State:**

- Background: gray-50
- Border: 1px solid gray-200

**Today Highlight:**

- Background: blue-50
- Border: 2px solid blue-500
- Day number: blue-600 (bold)

---

### 3. Week View

#### Week Grid

- **7 columns** (Monday - Sunday)
- **Time Slots** (left axis):
  - 00:00 - 23:00 (1-hour increments)
  - Grid lines: gray-200, 1px
  - Hour labels: 12px, gray-600

#### Event Card (in Week View)

- **Width:** Column width (responsive)
- **Height:** Based on duration (1 hour = 60px)
- **Min-height:** 40px
- **Padding:** 8px
- **Border-left:** 4px solid {color}
- **Background:** {color} with 15% opacity
- **Layout:**
  - Event title (14px font, gray-900, truncated)
  - Time range (12px font, gray-600, e.g., "14:00 - 15:30")
  - Priority badge (if high/urgent, top-right)

**All-Day Events:**

- Display at top of week view
- Separate row above time grid
- Height: 32px

**Event Overlap:**

- Side-by-side columns
- Each event width: 100% / number of overlapping events
- Max 3 events side-by-side, then stack

---

### 4. Day View

#### Day Structure

- **Single column** (selected day)
- **Time Slots** (00:00 - 23:00, same as Week View)
- **Event Cards:** Full-width, detailed layout

#### Event Card (in Day View)

- **Width:** 100%
- **Padding:** 12px
- **Border-left:** 5px solid {color}
- **Background:** {color} with 20% opacity
- **Layout:**
  - Event icon (left, 18px, {color})
  - Event title (16px font, gray-900, bold)
  - Description preview (14px font, gray-600, max 2 lines)
  - Time range (14px font, gray-700)
  - Assigned to (avatar + name, 12px font)
  - Status badge (right, e.g., "Offen", "In Bearbeitung")

**Current Time Indicator:**

- Red horizontal line (#EF4444, 2px)
- Red circle (12px diameter) on left edge
- Updates every minute

---

### 5. Agenda View (Mobile Primary)

#### Event List (Chronological)

- **Grouped by Date:**
  - Date header (e.g., "Montag, 28. Januar 2025")
  - Font: 16px, gray-900, bold
  - Background: gray-100
  - Padding: 12px 16px

- **Event Item:**
  - Height: Auto (min 72px)
  - Padding: 12px 16px
  - Border-bottom: 1px solid gray-200
  - Layout:
    - Event icon (left, 20px, {color})
    - Event title (14px font, gray-900)
    - Time (12px font, gray-600)
    - Entity type label (12px font, {color}, e.g., "Aufgabe", "Projekt")
    - ChevronRight icon (right, 16px, gray-400)
- **Hover State:**
  - Background: gray-50
  - ChevronRight icon: gray-900

- **No Events Message:**
  - Center-aligned
  - Calendar icon (48px, gray-400)
  - "Keine Ereignisse" (18px, gray-600)
  - Date range (14px, gray-500)

---

### 6. Event Detail Dialog (Overlay)

Triggered by clicking any event in calendar.

#### Dialog Structure

- **Width:** 500px (desktop), 100% (mobile)
- **Max-height:** 80vh
- **Background:** White
- **Border-radius:** 12px
- **Shadow:** Large shadow

#### Dialog Content

- **Header:**
  - Event type icon (left, 24px, {color})
  - Event title (20px font, gray-900, bold)
  - Close button (right, X icon, ghost style)
- **Body (scrollable):**
  - **Date & Time Section:**
    - Calendar icon (16px)
    - Date range (e.g., "28. Januar 2025, 14:00 - 15:30")
    - All-day indicator (if applicable, "Ganztägig" badge)
  - **Description Section:**
    - "Beschreibung" label (14px, gray-700, bold)
    - Description text (14px, gray-600, max 500 chars)
  - **Status Section:**
    - "Status" label
    - Status badge (e.g., "Offen", "In Bearbeitung", "Abgeschlossen")
  - **Priority Section** (if applicable):
    - "Priorität" label
    - Priority badge with color (e.g., "Hoch" - orange)
  - **Assigned To Section:**
    - "Zugewiesen an" label
    - Avatar + Name (e.g., "Anna Weber")
  - **Related Entity Section:**
    - "Verknüpft mit" label
    - Entity link (e.g., "Kunde: Hofladen Müller GmbH")
    - Entity link button (secondary style, "Details anzeigen")

- **Footer:**
  - Edit button (secondary style, "Bearbeiten")
  - Delete button (destructive style, "Löschen", hidden for read-only users)
  - Close button (ghost style, "Schließen")

---

### 7. Filter Panel (Sidebar Overlay)

#### Panel Structure

- **Width:** 320px (desktop), 100% (mobile)
- **Background:** White
- **Border-left:** 1px solid gray-200 (desktop)
- **Slide-in animation** from right

#### Filter Options

- **Event Types** (multi-select checkboxes):
  - [ ] Aufgaben (blue checkbox)
  - [ ] Projekt-Aufgaben (green checkbox)
  - [ ] Projekt-Fristen (green checkbox)
  - [ ] Opportunities (purple checkbox)
  - [ ] Rechnungen (amber checkbox)
- **Status** (multi-select):
  - [ ] Offen
  - [ ] In Bearbeitung
  - [ ] Abgeschlossen
  - [ ] Überfällig
- **Priority** (multi-select):
  - [ ] Niedrig
  - [ ] Mittel
  - [ ] Hoch
  - [ ] Dringend
- **Assigned To** (user select dropdown):
  - "Alle" (default)
  - User list (GF/PLAN see all, ADM sees self)

#### Filter Actions

- Apply button (primary style, "Übernehmen")
- Clear filters button (ghost style, "Filter zurücksetzen")
- Close button (X icon, top-right)

---

### 8. Loading States

#### Calendar Grid Loading (Month View)

- Show skeleton day cells:
  - Day number placeholder (gray-200, 20px circle)
  - 2-3 skeleton event cards per cell (gray-200 rectangles, 24px height)
  - Pulse animation

#### Agenda View Loading

- Skeleton date headers (gray-200 rectangles, 40px height)
- Skeleton event items (gray-200 rectangles, 72px height)
- 5-6 skeleton items visible
- Pulse animation

---

### 9. Empty States

#### No Events in Date Range

- Center-aligned in calendar area
- Calendar icon (64px, gray-300)
- "Keine Ereignisse in diesem Zeitraum" (20px, gray-600)
- "Wählen Sie einen anderen Zeitraum oder erstellen Sie ein neues Ereignis." (14px, gray-500)
- "Neues Ereignis erstellen" button (primary style)

---

### 10. Mobile Adaptations (< 768px)

#### View Mode Changes

- **Default View:** Agenda (not Month)
- Month/Week views: Hidden by default (accessible via dropdown)
- Day view: Full-width, simplified

#### Header Adaptations

- View toggle: Dropdown select instead of button group
- Navigation: Compact layout (icons only, no labels)
- Action buttons: Icon-only (labels hidden)

#### Touch Targets

- **Minimum:** 44px × 44px
- Event cards: Increase padding (16px)
- Swipe gestures:
  - Swipe left: Next day/week/month
  - Swipe right: Previous day/week/month

#### Agenda View Optimization

- Larger event items (min 80px height)
- Larger tap targets
- Bottom sheet for event details (not dialog)

---

### 11. Accessibility (WCAG 2.1 AA)

#### Color Contrast

- All event colors: 4.5:1 contrast ratio against white
- Use icons + color (not color alone) for event types
- High contrast mode support

#### Keyboard Navigation

- Tab through: View toggle → Navigation controls → Event cards → Filters
- Arrow keys: Navigate between days (Month view) or hours (Week/Day view)
- Enter: Open event details
- Escape: Close dialogs/filters

#### Screen Reader Support

- ARIA labels:
  - Calendar grid: `<div role="grid" aria-label="Kalender">`
  - Day cells: `<div role="gridcell" aria-label="28. Januar 2025, 3 Ereignisse">`
  - Event cards: `<button aria-label="Aufgabe: Follow up mit Hofladen Müller, 14:00 Uhr, Status: Offen">`
- Focus indicators: 2px blue outline (#3B82F6)
- Live region for date navigation changes

---

### 12. Design Tokens

**Typography:**

- View toggle buttons: 14px, medium (500)
- Date range label: 16px, medium (500)
- Day numbers (Month): 14px, regular (400)
- Event titles (Month): 12px, medium (500)
- Event titles (Week/Day): 14px-16px, medium (500)
- Date headers (Agenda): 16px, bold (700)

**Spacing:**

- Calendar grid gap: 1px (gray-200 borders)
- Event card padding: 4px-8px (Month), 8px-12px (Week/Day), 12px-16px (Agenda)
- Header padding: 16px (desktop), 12px (mobile)
- Filter panel padding: 20px

**Border Radius:**

- Event cards: 6px
- Dialogs: 12px
- Buttons: 8px

**Shadows:**

- Event cards (hover): 0 2px 8px rgba(0,0,0,0.08)
- Dialog: 0 10px 40px rgba(0,0,0,0.15)
- Filter panel: 0 0 20px rgba(0,0,0,0.10)

---

## Design Requirements

### Visual Hierarchy

1. **Primary:** Current date/time, selected view mode
2. **Secondary:** Event titles, navigation controls
3. **Tertiary:** Event metadata (time, assigned to, status)

### Interaction States

- **Default:** Standard colors, visible content
- **Hover:** Slight background change (gray-50), shadow on event cards
- **Active:** Darker background, pressed effect
- **Selected:** Blue outline, highlighted background
- **Disabled:** 50% opacity, no pointer events

### Color Coding Standards

**Event Types:**

- UserTask: Blue (#3B82F6)
- ProjectTask: Green (#10B981)
- Project Deadline: Green (#10B981)
- Opportunity Close: Purple (#A855F7)

**Priority Overrides:**

- Urgent: Red (#EF4444)
- High: Orange (#F97316)

**System Colors:**

- Current time indicator: Red (#EF4444)
- Today highlight: Blue-50 background, blue-500 border
- Overdue events: Red-50 background, red-500 border

---

## Implementation Notes

### shadcn/ui Components

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add select
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add skeleton
npx shadcn-ui@latest add scroll-area
```

### react-big-calendar Integration

```typescript
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

<Calendar
  localizer={localizer}
  events={calendarEvents}
  startAccessor="startDate"
  endAccessor="endDate"
  style={{ height: 600 }}
  views={['month', 'week', 'day', 'agenda']}
  defaultView="month"
  onSelectEvent={handleEventClick}
  eventPropGetter={eventStyleGetter}
/>
```

### Custom Event Styling

```typescript
const eventStyleGetter = (event: CalendarEvent) => {
  const backgroundColor = event.color + '1A'; // 10% opacity
  const borderColor = event.color;

  return {
    style: {
      backgroundColor,
      borderLeft: `4px solid ${borderColor}`,
      color: '#1F2937', // gray-900
    },
  };
};
```

### German Localization

```typescript
import moment from 'moment';
import 'moment/locale/de';

moment.locale('de');

const messages = {
  today: 'Heute',
  previous: 'Zurück',
  next: 'Weiter',
  month: 'Monat',
  week: 'Woche',
  day: 'Tag',
  agenda: 'Agenda',
  date: 'Datum',
  time: 'Zeit',
  event: 'Ereignis',
  noEventsInRange: 'Keine Ereignisse in diesem Zeitraum',
};
```

---

## Performance Considerations

### Event Density Management

- Limit calendar query to 90-day range
- Maximum 1000 events per view
- Virtualize agenda list for >100 events
- Cache event data for 5 minutes

### Lazy Loading

- Load only visible month/week events
- Prefetch adjacent month on navigation
- Debounce filter changes (300ms)

### Mobile Optimization

- Reduce initial load (agenda view only)
- Collapse month/week views to dropdown
- Use native date pickers for mobile
- Optimize touch event handling

---

## Related Components

- **Event Detail Dialog:** Full event information with edit/delete actions
- **Filter Panel:** Advanced filtering options for events
- **Date Picker:** Standalone date selection for navigation
- **Task Card:** Individual event card component (reusable in lists)

---

## Version History

| Version | Date       | Changes                                     |
| ------- | ---------- | ------------------------------------------- |
| 1.0     | 2025-01-28 | Initial calendar view specification for MVP |

---

**END OF PROMPT**

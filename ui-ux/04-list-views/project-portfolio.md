# Project Portfolio View - Figma Make Prompt

## Context & Purpose

- **Component Type**: Project Portfolio Table/Board
- **User Roles**: GF (all), PLAN (all), ADM (assigned projects), KALK (cost data), BUCH (financial)
- **Usage Context**: Overview of all active and completed projects
- **Business Value**: Resource planning, timeline tracking, budget monitoring

## Design Requirements

### Visual Hierarchy

- **Project Status**: Color-coded badges and progress bars
- **Timeline**: Visual date range indicators
- **Budget vs Actual**: Financial health indicators
- **Project Manager**: Avatar and team size

### Layout Structure

- Table view (default) or Board view (cards)
- Filtering by status, manager, customer
- Sortable columns
- Progress indicators per project

### shadcn/ui Components

- `Table` for portfolio view
- `Card` for board view
- `Progress` for project completion
- `Badge` for status
- `Avatar` for team members

## Figma Make Prompt

Create a comprehensive project portfolio view for KOMPASS, a German CRM application. Design a table showing all projects with status, timeline, budget tracking, progress, and team information using German labels.

**Page Layout:**

- Breadcrumb: "Dashboard > Projekte"
- Page title: "Projekte" (32px, bold) with count "23"

**Portfolio Summary Cards (Top):**
4 KPI cards in row:

1. **Aktive Projekte**: "18" (large, bold) with Briefcase icon
2. **Gesamtbudget**: "€ 5.2M" with TrendingUp icon
3. **Durchschn. Marge**: "+14,5%" (green) with Percent icon
4. **Überfällige**: "2" (red text) with AlertCircle icon

**Controls Bar:**

- Left: Search "Projekte durchsuchen..."
- Filter button with badge if active
- View toggle: Table | Board | Timeline
- Right: Export, "Neues Projekt" (blue)

**Table View (Default):**

**Columns:**

1. **☐** (Checkbox, 48px)

2. **Projektnr.** (Project Number, 120px, sortable):
   - Font: Monospace, 14px
   - Link: Blue, opens project detail
   - Example: "P-2024-B023"

3. **Kunde** (Customer, 200px, sortable):
   - Company name with building icon
   - Location below: City name (gray, 12px)
   - Example: "REWE München Süd" | "München"

4. **Projektname** (150px):
   - Bold, 14px
   - Truncate with ellipsis
   - Tooltip shows full name
   - Example: "Ladeneinrichtung"

5. **Status** (120px, filterable):
   - Badge with icon:
     - "Neu" (blue, Circle icon)
     - "In Planung" (purple, Clock icon)
     - "In Bearbeitung" (amber, Activity icon)
     - "Abgeschlossen" (green, Check icon)
     - "Pausiert" (gray, Pause icon)
     - "Storniert" (red, X icon)

6. **Fortschritt** (Progress, 150px):
   - Progress bar (horizontal, 100px wide)
   - Percentage: "65%" to left of bar
   - Color: Blue (0-70%), green (70-100%), red (overdue)
   - Milestones: 3/5 shown below bar (small text)

7. **Zeitplan** (Timeline, 180px, sortable):
   - Date range: "01.12.24 - 28.02.25"
   - Visual: Mini timeline bar (gray bg, blue fill for elapsed time)
   - Today marker: Vertical line
   - Overdue: Red background if past end date

8. **Budget** (120px, sortable):
   - Planned budget: "€ 450.000"
   - Icon: TrendingUp (green) or TrendingDown (red) for margin health
   - Tooltip: "Budget: € 380K | Marge: +15,6%"

9. **Projektleiter** (Manager, 150px, sortable, filterable):
   - Avatar (28px) + name
   - Example: [TF] "T. Fischer"
   - Team size below: "5 Mitarbeiter" (gray, 12px)

10. **Aktionen** (Actions, 80px):
    - Icon buttons: Eye, Pencil, MoreVertical
    - Hover: Visible
    - Menu: "Zeiterfassung", "Bericht", "Archivieren", "Löschen"

**Sample Rows:**

1. ☐ | P-2024-B023 | REWE München | Ladeneinrichtung | In Bearbeitung | [65%] ▓▓▓▓▓░░░ | 01.12-28.02 | € 450K | T. Fischer |
2. ☐ | P-2024-A015 | Hofladen Müller | Renovierung | Abgeschlossen | [100%] ▓▓▓▓▓▓▓▓ | 01.09-30.10 | € 85K | M. Schmidt |
3. ☐ | P-2024-C042 | Biomarkt HD | Neubau | In Planung | [15%] ▓░░░░░░░ | 01.02-30.06.25 | € 680K | A. Weber |

**Board View (Alternative):**

- Similar to opportunity pipeline
- Columns: Status groups (Neu, In Bearbeitung, Abgeschlossen, etc.)
- Project cards: Larger than opportunity cards
- Cards show: Number, customer, timeline, progress, budget, manager

**Timeline View (Alternative):**

- Gantt-chart style
- Y-axis: Project list
- X-axis: Timeline (months)
- Bars: Project duration
- Today line: Vertical red line
- Dependencies: Connecting lines between projects

**Filter Sheet:**

- Status: Multi-select checkboxes
- Projektleiter: Multi-select users (PLAN users)
- Kunde: Searchable select
- Zeitraum: Date range (Start date, End date)
- Budget: Range slider
- Team-Größe: Min/max inputs

**Sort Options:**

- Start date (newest/oldest)
- Budget (highest/lowest)
- Progress (least/most complete)
- Project number (newest/oldest)
- Customer name (A-Z)

**Bulk Actions (When Selected):**

- "Status ändern" dropdown
- "Projektleiter zuweisen"
- "Berichte erstellen" (PDF)
- "Exportieren" (CSV)
- "Archivieren"

**RBAC Filtering:**

- ADM: See only projects where assigned as team member
- PLAN: See all projects
- GF: See all projects
- KALK: See projects for cost estimation
- BUCH: See projects for invoicing

**Empty State:**

- Icon: Briefcase (120px, gray)
- Heading: "Noch keine Projekte vorhanden"
- Description: "Projekte werden aus gewonnenen Opportunities erstellt"
- Buttons:
  - "Projekt erstellen" (blue)
  - "Offene Opportunities anzeigen" (outlined)

**Mobile Layout:**

- Card view (not table)
- Each project = vertical card
- Key info: Number, customer, status badge, progress bar
- Tap to expand: Shows full details
- Filters: Bottom sheet
- Sort: Dropdown at top

Design with clear timeline visualization, budget health indicators, and easy drag-and-drop status changes.

## Interaction Patterns

### View Switch

- Click table/board/timeline icons
- View changes with animation
- State persists (saved in user preferences)

### Row Click

- Click project number or anywhere on row: Open project detail
- Shift+Click: Select multiple for bulk actions

### Progress Interaction

- Hover progress bar: Tooltip shows "12 von 18 Meilensteine abgeschlossen"
- Click: Opens milestone view

### Status Change

- Drag card to new status column (board view)
- Or: Dropdown in actions menu (table view)

## German Labels & Content

### Page

- **Projekte**: Projects
- **Projektportfolio**: Project portfolio
- **Neues Projekt**: New project

### Columns

- **Projektnr.**: Project number
- **Kunde**: Customer
- **Projektname**: Project name
- **Status**: Status
- **Fortschritt**: Progress
- **Zeitplan**: Timeline
- **Budget**: Budget
- **Projektleiter**: Project manager
- **Aktionen**: Actions

### Status

- **Neu**: New
- **In Planung**: In planning
- **In Bearbeitung**: In progress
- **Abgeschlossen**: Completed
- **Pausiert**: Paused
- **Storniert**: Cancelled

### Summary

- **Gesamtwert Pipeline**: Total pipeline value
- **Aktive Projekte**: Active projects
- **Durchschn. Marge**: Average margin
- **Überfällige**: Overdue

### Actions

- **Zeiterfassung**: Time tracking
- **Bericht erstellen**: Create report
- **Archivieren**: Archive
- **Status ändern**: Change status

## Accessibility Requirements

- WCAG 2.1 AA compliance
- Table: Semantic markup
- Sortable columns: aria-sort
- Progress bars: role="progressbar"
- Keyboard navigation for table
- Drag-and-drop: Keyboard alternative (move buttons)

## Mobile Considerations

- Card view on mobile
- Vertical scrolling
- Pull-to-refresh
- Bottom sheet for filters
- Swipe for actions
- Tap card to expand details

## Example Data

**Project 1:**

- Number: P-2024-B023
- Customer: REWE München Süd
- Name: Ladeneinrichtung
- Status: In Bearbeitung (amber)
- Progress: 65%
- Timeline: 01.12.2024 - 28.02.2025 (89 Tage)
- Budget: € 450.000
- Manager: Thomas Fischer
- Team: 5 Mitarbeiter

**Project 2:**

- Number: P-2024-A015
- Customer: Hofladen Müller GmbH
- Name: Renovierung
- Status: Abgeschlossen (green)
- Progress: 100%
- Timeline: 01.09.2024 - 30.10.2024 (60 Tage)
- Budget: € 85.000
- Manager: Michael Schmidt
- Team: 3 Mitarbeiter

## Implementation Notes

### shadcn/ui Installation

```bash
npx shadcn-ui@latest add table
npx shadcn-ui@latest add card
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add avatar
```

### Drag-and-Drop

```bash
pnpm add @dnd-kit/core @dnd-kit/sortable
```

### Component Dependencies

- Project API with filtering
- User list for manager filter
- Customer list for customer filter
- Progress calculation logic
- Timeline visualization
- RBAC for visibility

### State Management

- Project list (React Query)
- View mode (table/board/timeline)
- Filter criteria
- Sort state
- Selected projects
- RBAC context

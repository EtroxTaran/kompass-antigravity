# PLAN Dashboard (Planer) - Figma Make Prompt

## Context & Purpose
- **User Role**: PLAN (Planer / Planning)
- **Business Value**: Project management, resource allocation, scheduling
- **Access**: ALL projects and customers
- **Key Focus**: Project timelines, team workload, capacity planning

## Figma Make Prompt

Create a PLAN (Planer) dashboard for KOMPASS showing active projects, timelines, resource allocation, capacity planning, and upcoming milestones with German labels.

**Header:**
- "Projektplanung" (28px, bold)
- View toggle: "Kalender" | "Liste" | "Gantt"
- Date range: "Diese Woche" | "Dieser Monat" | "Quartal"
- User: Avatar + "Thomas Fischer (PLAN)"

**KPI Cards (Top Row - 4 cards):**
1. **Aktive Projekte**
   - Value: "18" (36px, blue)
   - On schedule: "14 (78%)" (green)
   - Delayed: "4 (22%)" (red)
   
2. **Kapazität (diese Woche)**
   - Team: "5 Mitarbeiter"
   - Verfügbar: "120 Std" (blue)
   - Gebucht: "96 Std (80%)" (amber)
   
3. **Meilensteine (diese Woche)**
   - Anstehend: "8" (blue)
   - Überfällig: "2" (red)
   - Abgeschlossen: "15 diese Woche" (green)
   
4. **Budget-Status**
   - Im Rahmen: "14 Projekte" (green)
   - Warnung: "3" (amber)
   - Überzogen: "1" (red)

**Section: Projektübersicht (Gantt or Calendar View)**
- **Gantt Chart (Main View):**
  - Y-axis: Project names
  - X-axis: Timeline (weeks/months)
  - Bars: Project duration
  - Colors: Blue (on schedule), Amber (at risk), Red (delayed)
  - Milestones: Diamond markers
  - Dependencies: Arrows between tasks
  - Current date: Vertical line

- **Calendar View (Alternative):**
  - Month view with project milestones
  - Color-coded by project
  - Click day: See all events

**Section: Ressourcenplanung**
- **Team-Auslastung (Horizontal Bar Chart):**
  - Team members (Y-axis)
  - Hours (X-axis)
  - Stacked bars: "Verfügbar" (light blue), "Gebucht" (blue), "Überlastet" (red)
  - Target line: 100%
  
- **Kapazitätsvorhersage (Line Chart - next 4 weeks):**
  - X-axis: Weeks
  - Y-axis: Hours
  - Blue line: Available capacity
  - Red line: Booked capacity
  - Gap: Remaining capacity (fill green)

**Section: Projekt-Prioritäten (Table)**
- Columns: Projekt, Kunde, Status, Fortschritt, Fälligkeit, Team, Budget-Status
- Rows: All active projects
- Sorting: By due date (default), priority, customer
- Badges: Status, budget health
- Progress bars: Visual completion
- Actions: "Details", "Zeitplan bearbeiten", "Team zuweisen"

**Section: Anstehende Meilensteine (Timeline)**
- Next 14 days
- Each milestone: Date, project, name, owner
- Overdue: Red highlight
- Group by week
- Click: Navigate to project detail

**Section: Team-Verfügbarkeit (Grid)**
- Team member cards
- Each card: Avatar, name, role
- This week: "32/40 Std gebucht (80%)"
- Next week: "24/40 Std gebucht (60%)"
- Status indicator: Green/amber/red
- Quick action: "Aufgabe zuweisen"

**Section: Kritische Pfade & Verzögerungen**
- List of projects with delays
- Impact analysis: Which milestones are affected
- Recommended actions
- Escalation: "GF benachrichtigen" button for critical delays

**Quick Actions (Sidebar or FAB):**
- "+ Neues Projekt"
- "+ Meilenstein hinzufügen"
- "Team zuweisen"
- "Kapazitätsbericht"
- "Gantt exportieren"

**Mobile:** Cards stack, Gantt horizontal scroll, simplified timeline view

## Design Requirements

### Visual Hierarchy
1. Gantt chart: Large, clear timeline
2. KPI cards: Quick metrics
3. Team utilization: Prominent bars
4. Alerts: Critical delays highlighted

### shadcn/ui Components
```bash
npx shadcn-ui@latest add card badge button calendar table
# Gantt: Use react-gantt-chart or custom with shadcn
```

### Charts
- Gantt chart: Project timelines
- Horizontal bar chart: Team utilization
- Line chart: Capacity forecast

### Interaction
- Gantt: Drag to adjust dates (if editable)
- Hover milestone: Show details
- Click project: Navigate to detail
- Filters: Status, team member, date range

### Accessibility
- Gantt has table alternative
- Color + patterns for status
- Keyboard navigation

### Example Data
- Project: "P-2024-B023, REWE München, In Arbeit, 65%, 28.02.25, 5 Mitarbeiter, Im Budget"
- Team: "Anna Weber, Planung, 32/40 Std (80%)"


# Task Dashboard Specification

**Version:** 1.0  
**Last Updated:** 2025-01-28  
**Status:** Planned for Phase 1 - MVP

---

## Overview

Task dashboards provide role-specific views of tasks across the KOMPASS application with AI-powered prioritization, smart assignment suggestions, and predictive analytics. Each role sees tasks relevant to their responsibilities with appropriate widgets and filters.

**AI Features by Phase:**

- **[Phase 1] Natural Language Processing:** Create tasks with voice commands or text parsing (speech-to-text)
- **[Phase 2] Smart Prioritization:** AI suggests task priorities based on deadlines and dependencies (pattern matching)
- **[Phase 3] Predictive Completion:** Machine learning predicts realistic completion times based on historical data
- **[Phase 3] Auto-Assignment:** AI suggests best team member based on skills, workload, and past performance
- **[Phase 3] Anomaly Detection:** Alerts for unusual patterns (overdue tasks, bottlenecks, etc.)

**Note:** All Phase 3 AI features require minimum data thresholds - see [AI Data Requirements](../../docs/specifications/AI_DATA_REQUIREMENTS.md)

---

## Dashboard Views

### 1. My Tasks Dashboard (All Roles)

Personal task management view accessible from main navigation.

### 2. Project Task Board (PLAN, INNEN)

Project-specific task management with Kanban-style layout.

### 3. Team Tasks Overview (GF, PLAN)

Management view of all team tasks across projects.

---

## My Tasks Dashboard Layout (Desktop - 1440px)

```
┌────────────────────────────────────────────────────────────────┐
│  KOMPASS  •  My Tasks                    [🔔] [👤 Michael]     │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  My Tasks              [+ New Task]  [Filter ▼] [Sort ▼] │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌─────┬─────┬─────┬─────┐                                    │
│  │ 📊 │ 📊 │ 📊 │ 📊 │   [Task Overview Cards]              │
│  │ 12 │  5  │  2  │  3  │                                    │
│  │Open│Prog │Over │Week │                                    │
│  └─────┴─────┴─────┴─────┘                                    │
│                                                                │
│  ┌────────────┬────────────────────────────────────────────┐  │
│  │            │                                            │  │
│  │  FILTER    │            TASK LIST                       │  │
│  │            │                                            │  │
│  │ Status     │  ┌──────────────────────────────────────┐ │  │
│  │ ☑ Open (12)│  │ [🔴] Call Hofladen Müller            │ │  │
│  │ ☑ Progress │  │ 📋 Hofladen • Due: Feb 5 • High      │ │  │
│  │ ☐ Done     │  └──────────────────────────────────────┘ │  │
│  │            │                                            │  │
│  │ Priority   │  ┌──────────────────────────────────────┐ │  │
│  │ ☑ Urgent   │  │ [🟠] Create technical drawings       │ │  │
│  │ ☑ High     │  │ 📋 Hofladen Proj • Feb 15 • PLAN     │ │  │
│  │ ☐ Medium   │  └──────────────────────────────────────┘ │  │
│  │ ☐ Low      │                                            │  │
│  │            │  ┌──────────────────────────────────────┐ │  │
│  │ Type       │  │ [🔵] Review supplier quotes          │ │  │
│  │ ☑ Personal │  │ 🏢 Admin task • Feb 10 • Medium      │ │  │
│  │ ☑ Project  │  └──────────────────────────────────────┘ │  │
│  │            │                                            │  │
│  │ [Clear]    │  [Load more...]                           │  │
│  │            │                                            │  │
│  └────────────┴────────────────────────────────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Task Overview Widgets (AI-Enhanced)

### Widget 1: Open Tasks Count + AI Priority

```
┌──────────────┐
│   📊 OPEN    │
│              │
│      12      │
│   tasks      │
│ 🎯 3 urgent  │
└──────────────┘
```

- **Metric:** Count of tasks with status = "open" or "todo"
- **AI Insight:** Shows AI-identified urgent tasks
- **Color:** Gray (#6B7280), purple for AI text
- **Click:** Filter list to open tasks only

### Widget 2: In Progress Count + Velocity

```
┌──────────────┐
│ 🔄 PROGRESS  │
│              │
│       5      │
│   tasks      │
│ 📈 +2 today  │
└──────────────┘
```

- **Metric:** Tasks with status = "in_progress"
- **AI Insight:** Shows completion velocity
- **Color:** Blue (#3B82F6), green for positive trend
- **Click:** Filter to in-progress tasks

### Widget 3: Overdue Count + Risk Analysis

```
┌──────────────┐
│ ⚠️ OVERDUE   │
│              │
│       2      │
│   tasks      │
│ 🔴 1 blocked │
└──────────────┘
```

- **Metric:** Tasks past due date
- **AI Analysis:** Shows blockers and dependencies
- **Color:** Red (#EF4444) if > 0, otherwise gray
- **Click:** Show overdue tasks list with resolution suggestions
- **Alert:** Pulse animation if count > 5

### Widget 4: This Week Count + Prediction

```
┌──────────────┐
│ 📅 THIS WEEK │
│              │
│       8      │
│ due soon     │
│ 🤖 6 likely  │
└──────────────┘
```

- **Metric:** Tasks due in next 7 days
- **AI Prediction:** Shows realistic completion forecast
- **Color:** Orange (#F59E0B) if > 10
- **Click:** Filter to this week's tasks

### Widget 5: AI Insights [Phase 3] (NEW)

```
┌──────────────┐
│ 🤖 INSIGHTS  │
│              │
│   💡 Tips    │
│ 3 available  │
│ View all →   │
└──────────────┘
```

- **[Phase 3]** **Metric:** AI-generated insights and suggestions
- **Examples:** "2h saved by reordering", "Anna available for urgent task"
- **Color:** Purple gradient
- **Click:** Open AI insights panel
- **Visibility:** Hidden if AI toggle OFF or data requirements not met

### Widget 6: Team Load (NEW - for managers)

```
┌──────────────┐
│ 👥 TEAM LOAD │
│              │
│    85%       │
│  capacity    │
│ ⚡ Optimal   │
└──────────────┘
```

- **Metric:** Team utilization percentage
- **Status:** Optimal/Warning/Critical (calculated from hours)
- **[Phase 3]** AI enhancement: Predictive status - only if toggle ON
- **Color:** Green/Amber/Red based on load
- **Click:** Open team workload view

---

## Filter Sidebar

### Available Filters

**Status (Multi-select)**

- Open / Todo
- In Progress
- Review (ProjectTask only)
- Completed / Done
- Cancelled / Blocked

**Priority (Multi-select)**

- Urgent / Critical
- High
- Medium
- Low

**Task Type**

- Personal Tasks (UserTask)
- Project Tasks (ProjectTask)

**Due Date**

- Overdue
- Today
- This Week
- This Month
- No Due Date
- Custom Range

**Related Entity (if task has context)**

- Customer
- Project
- Opportunity

### Filter Actions

- **Apply Filters:** Auto-apply on selection
- **Clear Filters:** Reset to show all tasks
- **Save Filter:** Save custom filter preset (Phase 2)

---

## Sort Options

### Available Sorts

- **Due Date:** Ascending (soonest first) / Descending
- **Priority:** High to Low / Low to High
- **Created Date:** Newest / Oldest
- **Status:** By workflow order
- **Title:** A-Z / Z-A

### Default Sort

- **My Tasks:** Due Date Ascending (overdue tasks first)
- **Project Tasks:** Priority High to Low, then Due Date
- **[Phase 3] AI Sort (NEW):** AI-optimized order based on urgency, dependencies, and user patterns (only if toggle ON)

---

## AI-Powered Task Management Features (NEW)

### Smart Task Creation

```
┌─────────────────────────────────────────────┐
│ 🎤 "Neue Aufgabe erstellen..."             │
│                                             │
│ AI erkannt:                                │
│ ✓ Typ: Kundenanruf                         │
│ ✓ Kunde: Hofladen Müller                   │
│ ✓ Fälligkeit: Morgen 15:00                 │
│ ✓ Priorität: Hoch                          │
│                                             │
│ [Anpassen] [Erstellen]                     │
└─────────────────────────────────────────────┘
```

- **[Phase 1] Voice Input:** Speak or type naturally in German (speech-to-text)
- **[Phase 1] NLP Parsing:** Extracts task details automatically (basic parsing)
- **[Phase 2] Context Awareness:** Links to relevant entities (pattern matching)
- **[Phase 1] Quick Confirm:** One-click task creation

### [Phase 3] AI Task Suggestions Panel

```
┌─────────────────────────────────────────────┐
│ 💡 AI-Empfehlungen                          │
├─────────────────────────────────────────────┤
│ 🎯 Hohe Priorität                          │
│ "Angebot für REWE nachfassen"              │
│ Grund: 3 Tage ohne Antwort                 │
│ [Aufgabe erstellen]                        │
├─────────────────────────────────────────────┤
│ ⚡ Effizienz-Tipp                         │
│ "3 Aufgaben können kombiniert werden"      │
│ Zeitsparung: ~45 Minuten                   │
│ [Details anzeigen]                         │
├─────────────────────────────────────────────┤
│ 👥 Team-Empfehlung                         │
│ "Anna hat Kapazität für Projekt-Review"    │
│ Verfügbar: Ab 14:00                        │
│ [Aufgabe zuweisen]                         │
└─────────────────────────────────────────────┘
```

- **Visibility:** Only shown if AI toggle ON and Phase 3 data met
- **Data Requirement:** 6+ months of task completion patterns

### [Phase 3] Predictive Task Timeline

```
┌─────────────────────────────────────────────┐
│ 📊 Aufgaben-Vorhersage diese Woche          │
├─────────────────────────────────────────────┤
│ Mo  █████████░ 9h (voll)                   │
│ Di  ██████░░░░ 6h                          │
│ Mi  ████████░░ 8h                          │
│ Do  ███░░░░░░░ 3h + Tour                   │
│ Fr  █████░░░░░ 5h                          │
│                                             │
│ 🤖 Empfehlung: Di/Do für neue Aufgaben     │
└─────────────────────────────────────────────┘
```

- **Visibility:** Only shown if AI toggle ON and Phase 3 data met

---

## Project Task Board Layout (Kanban - Phase 2 Preview)

```
┌────────────────────────────────────────────────────────────────┐
│  Project: Hofladen Müller Ladenbau        [+ New Task]         │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────┬─────────┬─────────┬─────────┬─────────┐          │
│  │  TODO   │   IN    │ REVIEW  │  DONE   │ BLOCKED │          │
│  │   (5)   │PROGRESS │   (2)   │  (12)   │   (1)   │          │
│  │         │   (7)   │         │         │         │          │
│  ├─────────┼─────────┼─────────┼─────────┼─────────┤          │
│  │[🟠Card] │[🔴Card] │[🟠Card] │[🟢Card] │[🔴Card] │          │
│  │         │         │         │         │         │          │
│  │[🔵Card] │[🟠Card] │[🔵Card] │[🟢Card] │         │          │
│  │         │         │         │         │         │          │
│  │[🔵Card] │[🟠Card] │         │[🟢Card] │         │          │
│  │         │         │         │         │         │          │
│  │         │[🟠Card] │         │ ...     │         │          │
│  │         │         │         │         │         │          │
│  │         │ ...     │         │         │         │          │
│  │         │         │         │         │         │          │
│  └─────────┴─────────┴─────────┴─────────┴─────────┘          │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Kanban Features (Phase 2)

- **Drag-and-Drop:** Move cards between columns to change status
- **Swimlanes:** Group by assignee, phase, or priority
- **Column Limits:** Warn when "In Progress" > 5 tasks per person
- **Quick Add:** Click column header to add task with that status

---

## Team Tasks Dashboard (GF, PLAN Only)

```
┌────────────────────────────────────────────────────────────────┐
│  Team Tasks                [View: All Projects ▼]              │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────┬─────┬─────┬─────┬─────┐                              │
│  │ 45  │ 23  │  8  │  5  │ 142 │  [Team Overview]            │
│  │Total│Prog │Over │Block│Done │                              │
│  └─────┴─────┴─────┴─────┴─────┘                              │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Task Distribution by Assignee                           │ │
│  │                                                          │ │
│  │  Anna Weber (PLAN)      ████████░░ 15 tasks (8 open)    │ │
│  │  Michael Schmidt (INNEN) ██████░░░░ 12 tasks (5 open)    │ │
│  │  Thomas Müller (PLAN)   ███████████ 18 tasks (10 open)  │ │
│  │  Sarah Klein (KALK)     ████░░░░░░  8 tasks (3 open)    │ │
│  │                                                          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Overdue & Blocked Tasks (Needs Attention)               │ │
│  │                                                          │ │
│  │  [🔴] Order custom furniture - BLOCKED                   │ │
│  │  Project: Hofladen • Waiting for customer approval      │ │
│  │  Assigned: Michael • 3 days overdue                     │ │
│  │                                                          │ │
│  │  [🔴] Review electrical plans - OVERDUE                  │ │
│  │  Project: Bäckerei Schmidt • Due: Jan 25                │ │
│  │  Assigned: Anna • 3 days overdue                        │ │
│  │                                                          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Recent Activity                                         │ │
│  │                                                          │ │
│  │  • 10:30 - Anna completed "Create drawings" (Hofladen)  │ │
│  │  • 09:15 - Michael marked "Order furniture" as blocked  │ │
│  │  • 08:45 - Thomas created 3 new tasks (Schmidt project) │ │
│  │                                                          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Mobile Dashboard Layout (375px)

```
┌─────────────────────────────────┐
│ [☰] My Tasks        [+] [Filter]│
├─────────────────────────────────┤
│                                 │
│ ┌─────┬─────┬─────┬─────┐       │
│ │ 12  │  5  │  2  │  8  │       │
│ │Open │Prog │Over │Week │       │
│ └─────┴─────┴─────┴─────┘       │
│                                 │
│ ┌───────────────────────────┐   │
│ │ Today's Tasks       [3]   │   │
│ ├───────────────────────────┤   │
│ │ [🔴] Call Hofladen        │   │
│ │ Due: 5:00 PM • High       │   │
│ ├───────────────────────────┤   │
│ │ [🟠] Review quotes        │   │
│ │ Due: End of day • Medium  │   │
│ ├───────────────────────────┤   │
│ │ [🔵] Update report        │   │
│ │ No due date • Low         │   │
│ └───────────────────────────┘   │
│                                 │
│ ┌───────────────────────────┐   │
│ │ This Week          [8]    │   │
│ ├───────────────────────────┤   │
│ │ [Show all ▼]              │   │
│ └───────────────────────────┘   │
│                                 │
│ ┌───────────────────────────┐   │
│ │ Project Tasks      [5]    │   │
│ ├───────────────────────────┤   │
│ │ [Show all ▼]              │   │
│ └───────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

### Mobile Optimizations (Enhanced PWA)

- **Collapsible Sections:** Tap to expand/collapse
- **Swipeable Cards:** Swipe actions with haptic feedback
  - Swipe right: Mark complete
  - Swipe left: Actions menu (reassign, postpone, delete)
- **Bottom Tab Bar (NEW):**
  ```
  ┌───┬───┬───┬───┬───┐
  │ 📋│ 🗺️│ ➕│ 🤖│ 👤│
  │Tas│Tou│Add│ AI│Me │
  └───┴───┴───┴───┴───┘
  ```
- **Pull to Refresh:** Refresh with skeleton loader
- **Floating Action Button:** Multi-action speed dial
  - Voice input
  - Quick task
  - Photo task
  - Tour task

### PWA-Specific Features

- **Push Notifications:**
  - "📅 Meeting mit Hofladen Müller in 30 Min"
  - "✅ 3 Aufgaben heute abgeschlossen"
  - "🚨 Überfällige Aufgabe: Angebot erstellen"
- **Offline Mode:**
  - All tasks cached locally
  - Create/edit tasks offline
  - Queue sync indicator
  - Conflict resolution UI
- **Voice Commands:**
  - "Neue Aufgabe: Morgen REWE anrufen"
  - "Zeige meine überfälligen Aufgaben"
  - "Aufgabe erledigt"
- **Quick Actions (Long Press):**
  - Copy task
  - Share task
  - Convert to tour stop
  - Add to calendar

### Tour Integration (NEW)

```
┌─────────────────────────────────┐
│ 🗺️ Tour-Aufgaben heute         │
├─────────────────────────────────┤
│ 📍 Hofladen Müller (10:00)      │
│    • Vertrag unterschreiben     │
│    • Maße kontrollieren        │
├─────────────────────────────────┤
│ 📍 REWE Zentrale (14:00)        │
│    • Angebot präsentieren       │
├─────────────────────────────────┤
│ [Tour optimieren] [Navigation]  │
└─────────────────────────────────┘
```

### [Phase 3] Mobile AI Assistant (NEW)

```
┌─────────────────────────────────┐
│ 🤖 KI-Assistent                 │
├─────────────────────────────────┤
│ "Was sollte ich zuerst machen?" │
│                                 │
│ 1. Hofladen anrufen (überfällig)│
│ 2. Angebot fertigstellen        │
│ 3. Team-Meeting vorbereiten     │
│                                 │
│ 💡 Tipp: Kombiniere Aufgaben    │
│ 2 & 3 für Zeitersparnis        │
└─────────────────────────────────┘
```

- **Visibility:** Only shown if AI toggle ON and Phase 3 data met
- **Data Requirement:** 6+ months of task and productivity patterns

---

## Role-Specific Dashboard Widgets

### ADM (Sales Field Agent) Dashboard

- **My Tasks:** Personal follow-ups and customer calls
- **Customer Tasks:** Tasks linked to their customers
- **Today's Priorities:** High/urgent tasks due today
- **Recent Customer Activity:** Customer-related task updates

### PLAN (Planning Department) Dashboard

- **Project Tasks:** Tasks for assigned projects
- **My Workload:** Task distribution chart
- **Blocked Tasks:** Tasks needing attention
- **This Week's Deliverables:** Tasks due this week

### INNEN/KALK (Internal Sales) Dashboard

- **All Project Tasks:** Organization view of all project work
- **Task Assignment:** Quick task assignment interface
- **Project Progress:** Tasks by project phase
- **Team Capacity:** Workload across team members

### GF (Management) Dashboard

- **Team Overview:** All team tasks and progress
- **Overdue & Blocked:** Tasks needing management attention
- **Workload Distribution:** Tasks per team member
- **Completion Rate:** Weekly/monthly task completion metrics

### BUCH (Accounting) Dashboard

- **Financial Tasks:** Tasks related to invoices and payments
- **Project Tasks (Read-Only):** Visibility into project progress
- **Upcoming Deadlines:** Tasks related to financial deadlines
- **Completed This Month:** Monthly task completion

---

## Empty States

### No Tasks

```
┌─────────────────────────────────────────────┐
│                                             │
│               ✅ All done!                  │
│                                             │
│   You have no pending tasks right now.     │
│                                             │
│            [+ Create Task]                  │
│                                             │
└─────────────────────────────────────────────┘
```

### No Results (After Filtering)

```
┌─────────────────────────────────────────────┐
│                                             │
│            🔍 No tasks found                │
│                                             │
│   Try adjusting your filters or create     │
│   a new task.                               │
│                                             │
│         [Clear Filters]  [New Task]        │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Performance Considerations (Enhanced)

### Lazy Loading

- **Initial Load:** Show first 20 tasks with skeleton loaders
- **Infinite Scroll:** Load more as user scrolls with predictive fetch
- **Virtualization:** For lists >100 tasks using react-window
- **Progressive Enhancement:** Core features work on slow connections

### Real-Time Updates (Enhanced)

- **WebSocket:** Live task status updates with reconnection
- **Server-Sent Events:** Fallback for restricted networks
- **Optimistic UI:** Update UI immediately, sync with server
- **Conflict Resolution:** AI-powered merge suggestions
- **Background Sync:** PWA background sync API
- **Delta Updates:** Only sync changed fields

### Performance Metrics

- **First Contentful Paint:** < 1.5s on 3G
- **Time to Interactive:** < 3s on 3G
- **Offline Mode:** Instant with cached data
- **Search Response:** < 200ms (local index)

---

## AI Analytics & Insights [Phase 3] (NEW)

**Global Visibility:** All AI insights hidden by default. Require AI toggle ON + Phase 3 data requirements.

### [Phase 3] Task Completion Patterns

```
┌─────────────────────────────────────────────┐
│ 📊 Ihre Produktivitätsmuster               │
├─────────────────────────────────────────────┤
│ Beste Zeit: 9:00-11:00 (85% erledigt)      │
│ Aufgabentyp: Planung am effizientesten      │
│ Durchschnitt: 4.2 Aufgaben/Tag             │
│                                             │
│ 💡 Empfehlung: Wichtige Aufgaben morgens   │
└─────────────────────────────────────────────┘
```

- **Data Requirement:** 3+ months of task completion history per user

### [Phase 3] Predictive Workload

```
┌─────────────────────────────────────────────┐
│ 🔮 Workload-Vorhersage nächste 2 Wochen    │
├─────────────────────────────────────────────┤
│ KW 7: ████████░░ Normal                    │
│ KW 8: ██████████ Hoch (Messe-Vorbereitung) │
│                                             │
│ ⚠️ Warnung: KW 8 über Kapazität            │
│ 🤖 Vorschlag: 3 Aufgaben vorziehen         │
└─────────────────────────────────────────────┘
```

- **Data Requirement:** 6+ months of task and calendar data

### Smart Notifications

- **[Phase 2] Basic Alerts:** (pattern-based, no ML)
  - "Diese Aufgabe blockiert 3 andere" (dependency analysis)
  - "Kunde wartet seit 2 Tagen auf Antwort" (time-based)
- **[Phase 3] Proactive Alerts:** (ML-based predictions)
  - "Ähnliche Aufgabe vor 2 Wochen: 3h benötigt" (duration prediction)
- **[Phase 3] Context-Aware Reminders:**
  - Location-based: "In der Nähe von Kunde X" (GPS + routing)
  - Time-based: "Beste Zeit für Anrufe" (pattern learning)
  - Workload-based: "Freie Zeit in 30 Min" (schedule prediction)

---

## Accessibility

### Keyboard Navigation

- **Tab:** Navigate between widgets and tasks
- **Enter:** Open task details
- **N:** Create new task (when on dashboard)
- **F:** Open filter menu
- **/:** Focus search field

### Screen Reader

- Announce task counts in widgets
- Announce new tasks added to list
- Announce status changes

---

## Related Components

- **TaskCard** - Individual task display
- **TaskList** - Task list container
- **TaskForm** - Task creation/editing
- **TaskFilters** - Filter sidebar
- **TaskOverviewWidget** - Dashboard metric widgets

---

## Figma Component Name

- **Desktop:** `Dashboard/MyTasks`, `Dashboard/TeamTasks`, `Dashboard/ProjectBoard`
- **Mobile:** `Dashboard/Mobile-MyTasks`
- **Widgets:** `Widget/TaskOverview`, `Widget/WorkloadChart`

---

**End of task-dashboard.md**

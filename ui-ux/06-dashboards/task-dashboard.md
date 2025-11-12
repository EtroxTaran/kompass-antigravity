# Task Dashboard Specification

**Version:** 1.0  
**Last Updated:** 2025-01-28  
**Status:** Planned for Phase 1 - MVP

---

## Overview

Task dashboards provide role-specific views of tasks across the KOMPASS application. Each role sees tasks relevant to their responsibilities with appropriate widgets and filters.

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

## Task Overview Widgets

### Widget 1: Open Tasks Count
```
┌──────────────┐
│   📊 OPEN    │
│              │
│      12      │
│   tasks      │
└──────────────┘
```
- **Metric:** Count of tasks with status = "open" or "todo"
- **Color:** Gray (#6B7280)
- **Click:** Filter list to open tasks only

### Widget 2: In Progress Count
```
┌──────────────┐
│ 🔄 PROGRESS  │
│              │
│       5      │
│   tasks      │
└──────────────┘
```
- **Metric:** Tasks with status = "in_progress"
- **Color:** Blue (#3B82F6)
- **Click:** Filter to in-progress tasks

### Widget 3: Overdue Count
```
┌──────────────┐
│ ⚠️ OVERDUE   │
│              │
│       2      │
│   tasks      │
└──────────────┘
```
- **Metric:** Tasks past due date
- **Color:** Red (#EF4444) if > 0, otherwise gray
- **Click:** Show overdue tasks list
- **Alert:** Blink animation if count > 5

### Widget 4: This Week Count
```
┌──────────────┐
│ 📅 THIS WEEK │
│              │
│       8      │
│ due soon     │
└──────────────┘
```
- **Metric:** Tasks due in next 7 days
- **Color:** Orange (#F59E0B) if > 10
- **Click:** Filter to this week's tasks

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

### Mobile Optimizations
- **Collapsible Sections:** Tap to expand/collapse
- **Swipeable Cards:** Swipe for quick actions
- **Bottom Tab Bar:** Quick access to My Tasks, Team Tasks, Projects
- **Pull to Refresh:** Refresh task list
- **Floating Action Button:** + button for quick task creation

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

## Performance Considerations

### Lazy Loading
- **Initial Load:** Show first 20 tasks
- **Infinite Scroll:** Load more as user scrolls
- **Virtualization:** For lists >100 tasks

### Real-Time Updates (Phase 2)
- **WebSocket:** Live task status updates
- **Optimistic UI:** Update UI immediately, sync with server
- **Conflict Resolution:** Show notification if task changed by another user

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



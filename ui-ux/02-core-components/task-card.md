# Task Card Component Specification

**Version:** 1.0  
**Last Updated:** 2025-01-28  
**Status:** Planned for Phase 1 - MVP

---

## Overview

The Task Card component is a compact, reusable UI element that displays task information in lists, Kanban boards, and dashboard widgets. It supports both UserTask (personal todos) and ProjectTask (project work items).

---

## Component Variants

### 1. Compact Card (List View)

- **Size:** 320px × 120px (desktop), full-width (mobile)
- **Usage:** Task lists, dashboard widgets, search results
- **Information Density:** Essential info only

### 2. Expanded Card (Detail View)

- **Size:** 640px × auto (expands vertically)
- **Usage:** Click-to-expand inline detail view
- **Information Density:** Full task details with actions

### 3. Kanban Card (Board View - Phase 2)

- **Size:** 280px × 140px
- **Usage:** Kanban board columns
- **Features:** Drag-and-drop enabled

---

## Visual Structure

### Compact Card Layout

```
┌─────────────────────────────────────────────────────────────┐
│ [🔴 HIGH]  Create technical drawings               [⚙️ Menu]│
│                                                               │
│ 📋 Hofladen Müller Ladenbau  •  Planning Phase              │
│                                                               │
│ [👤 Anna Weber]    [📅 Due: Feb 15]    [Status: In Progress]│
└─────────────────────────────────────────────────────────────┘
```

**Elements (Top to Bottom):**

1. **Header Row:**
   - Priority badge (left) - colored icon with text (LOW/MEDIUM/HIGH/URGENT or CRITICAL)
   - Task title (center) - truncated to 50 chars with ellipsis
   - Actions menu (right) - three-dot menu icon

2. **Context Row:**
   - Project/Customer icon + name (for context)
   - Phase indicator (ProjectTask only)
   - Tags (Phase 2)

3. **Footer Row:**
   - Assignee avatar + name
   - Due date with calendar icon
   - Status badge

---

## Color Coding

### Priority Colors

| Priority               | Color              | Badge Style                          |
| ---------------------- | ------------------ | ------------------------------------ |
| Low                    | Gray (#9CA3AF)     | Subtle border                        |
| Medium                 | Blue (#3B82F6)     | Filled background                    |
| High                   | Orange (#F59E0B)   | Filled background                    |
| Urgent                 | Red (#EF4444)      | Filled background + bold text        |
| Critical (ProjectTask) | Dark Red (#B91C1C) | Filled background + bold text + icon |

### Status Colors (UserTask)

| Status      | Color           | Badge Style                |
| ----------- | --------------- | -------------------------- |
| Open        | Gray (#6B7280)  | Outline                    |
| In Progress | Blue (#3B82F6)  | Filled                     |
| Completed   | Green (#10B981) | Filled with checkmark      |
| Cancelled   | Red (#EF4444)   | Outline with strikethrough |

### Status Colors (ProjectTask)

| Status      | Color            | Badge Style              |
| ----------- | ---------------- | ------------------------ |
| Todo        | Gray (#6B7280)   | Outline                  |
| In Progress | Blue (#3B82F6)   | Filled                   |
| Review      | Purple (#8B5CF6) | Filled                   |
| Done        | Green (#10B981)  | Filled with checkmark    |
| Blocked     | Red (#EF4444)    | Filled with warning icon |

---

## Interactive States

### Hover State

- **Effect:** Subtle shadow elevation, background lightens
- **Cursor:** Pointer
- **Animation:** 150ms ease-in-out

### Selected State

- **Effect:** Blue border (2px), blue background tint
- **Use Case:** Multi-select mode, active task in detail view

### Dragging State (Phase 2)

- **Effect:** Opacity 0.5, larger shadow
- **Cursor:** Grabbing
- **Visual:** Ghost card follows cursor

---

## Actions

### Quick Actions (Hover)

Display on card hover or always on mobile:

1. **Quick Status Change** - Dropdown to change status
2. **Edit** - Opens task edit modal
3. **Delete** - Confirmation dialog

### Three-Dot Menu Actions

- **View Details** - Expands card or opens modal
- **Duplicate** - Creates copy (Phase 2)
- **Move to Project** - For UserTask (Phase 2)
- **Change Assignee** - Quick reassignment
- **Set Due Date** - Date picker
- **Add to Favorites** - Pin task (Phase 2)

---

## Expanded Card Layout

When clicked, card expands to show:

```
┌─────────────────────────────────────────────────────────────┐
│ [🔴 HIGH]  Create technical drawings               [X Close]│
│                                                               │
│ Description:                                                  │
│ Complete CAD drawings for store layout, include furniture    │
│ placement and electrical plan. Coordinate with external      │
│ electrical consultant for approvals.                          │
│                                                               │
│ Project: 📋 Hofladen Müller Ladenbau                         │
│ Phase: Planning  •  Milestone: Design Approval               │
│                                                               │
│ [👤 Anna Weber] (PLAN)    [📅 Created: Jan 28]               │
│ [📅 Due: Feb 15, 2025]     [⏱️ Modified: Jan 29]             │
│                                                               │
│ [Activity Log ▼]                                             │
│ • Jan 29 10:30 - Status changed to "In Progress" by Anna     │
│ • Jan 28 09:00 - Task created by Michael                     │
│                                                               │
│ [Edit Task] [Mark as Done] [Delete]                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Mobile Adaptations

### Mobile Card (320px width)

```
┌──────────────────────────────────┐
│ [🔴] Create technical drawings   │
│                                  │
│ 📋 Hofladen Müller               │
│ Planning  •  Due: Feb 15         │
│                                  │
│ [👤 Anna] [In Progress]          │
│                                  │
│ [Swipe for actions →]            │
└──────────────────────────────────┘
```

### Swipe Actions

- **Swipe Right:** Mark complete (green background)
- **Swipe Left:** Delete (red background) or Edit (blue background)
- **Full Swipe:** Execute action immediately
- **Partial Swipe:** Show action buttons

---

## Accessibility

### Keyboard Navigation

- **Tab:** Focus card
- **Enter/Space:** Expand/collapse card
- **Arrow Keys:** Navigate between cards
- **M:** Open actions menu
- **E:** Quick edit
- **D:** Mark done (if applicable)

### Screen Reader

- Announce: "Task: [Title], Priority: [Priority], Status: [Status], Due: [Date], Assigned to: [Name]"
- Action menu labeled: "Task actions for [Title]"
- Status change: "Status updated to [New Status]"

### Color Contrast

- All text: Minimum WCAG AA (4.5:1 contrast ratio)
- Priority badges: WCAG AAA (7:1 contrast ratio)
- Focus indicators: 3px solid blue outline

---

## Component Props (React/TypeScript)

```typescript
interface TaskCardProps {
  task: UserTask | ProjectTask;
  variant: 'compact' | 'expanded' | 'kanban';
  onStatusChange: (taskId: string, newStatus: string) => void;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onExpand?: (taskId: string) => void;
  isSelected?: boolean;
  isDraggable?: boolean; // Phase 2
  showActivityLog?: boolean; // Expanded view
  showProjectContext?: boolean; // ProjectTask
  className?: string;
}
```

---

## Empty States

### No Tasks

```
┌─────────────────────────────────────────────┐
│                                             │
│           📋 No tasks yet                   │
│                                             │
│   Click "New Task" to create your first    │
│   task and stay organized.                 │
│                                             │
│           [+ New Task]                      │
│                                             │
└─────────────────────────────────────────────┘
```

### All Tasks Completed

```
┌─────────────────────────────────────────────┐
│                                             │
│           ✅ All caught up!                 │
│                                             │
│   You've completed all your tasks.         │
│   Great work!                               │
│                                             │
│           [View Completed]                  │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Performance Considerations

### Rendering Optimization

- **Virtual Scrolling:** For lists >100 tasks (use `react-window`)
- **Lazy Loading:** Load task details on expand
- **Memoization:** Prevent unnecessary re-renders with `React.memo()`
- **Image Optimization:** Lazy load user avatars

### Offline Indicators

- **Sync Status:** Show small cloud icon with sync state
- **Pending Changes:** Yellow dot indicator for unsaved changes
- **Conflict Warning:** Red warning icon if sync conflict detected

---

## Related Components

- **TaskList** - Container component for multiple TaskCards
- **TaskForm** - Create/edit task modal
- **TaskFilters** - Filter controls for task lists
- **KanbanBoard** - Board view with draggable cards (Phase 2)

---

## Implementation Notes

1. **Component Library:** Build with Tailwind CSS + Headless UI
2. **Icons:** Use Heroicons v2 for consistency
3. **Date Formatting:** Use `date-fns` for localized dates
4. **Animations:** Framer Motion for smooth transitions
5. **Testing:** Unit tests for all interactive states, E2E for actions

---

## Figma Component Name

- **Desktop:** `TaskCard/Compact`, `TaskCard/Expanded`
- **Mobile:** `TaskCard/Mobile`, `TaskCard/Mobile-Swiping`
- **Kanban:** `TaskCard/Kanban` (Phase 2)

---

**End of task-card.md**

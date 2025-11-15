# Task Form Specification

**Version:** 1.0  
**Last Updated:** 2025-01-28  
**Status:** Planned for Phase 1 - MVP

---

## Overview

The Task Form is used for creating and editing both UserTask (personal todos) and ProjectTask (project work items). It supports two main modes: Quick Create (minimal fields) and Full Form (all fields).

---

## Form Variants

### 1. UserTask Form (Personal Todos)

- **Use Case:** Sales follow-ups, personal reminders, administrative tasks
- **Access:** All users
- **Context:** Can be linked to Customer/Opportunity/Project

### 2. ProjectTask Form (Project Work Items)

- **Use Case:** Project execution tasks, deliverables, milestones
- **Access:** GF, PLAN, INNEN/KALK
- **Context:** Always bound to a project

---

## UserTask Form Layout

### Quick Create Mode (Modal - 400px × 480px)

```
┌────────────────────────────────────────┐
│  Create Personal Task              [X] │
├────────────────────────────────────────┤
│                                        │
│  Title *                               │
│  ┌────────────────────────────────┐   │
│  │ Call Hofladen Müller about... │   │
│  └────────────────────────────────┘   │
│                                        │
│  Status *           Priority *         │
│  ┌──────────┐      ┌──────────┐       │
│  │ Open   ▼ │      │ High   ▼ │       │
│  └──────────┘      └──────────┘       │
│                                        │
│  Due Date                              │
│  ┌────────────────────────────────┐   │
│  │ 📅 Feb 5, 2025         [Clear]│   │
│  └────────────────────────────────┘   │
│                                        │
│  [⚙️ Show more options...]             │
│                                        │
│  [Cancel]              [Create Task]  │
│                                        │
└────────────────────────────────────────┘
```

### Full Form Mode (Modal - 600px × 720px)

```
┌──────────────────────────────────────────────────────┐
│  Create Personal Task                            [X] │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Title *                                             │
│  ┌──────────────────────────────────────────────┐   │
│  │ Call Hofladen Müller about delivery timeline│   │
│  └──────────────────────────────────────────────┘   │
│  5-200 characters                                    │
│                                                      │
│  Description                                         │
│  ┌──────────────────────────────────────────────┐   │
│  │ Customer wants to confirm installation date  │   │
│  │ for next month. Discuss delivery timeline    │   │
│  │ and finalize pricing details.                │   │
│  └──────────────────────────────────────────────┘   │
│  Rich text editor • Max 2000 characters              │
│                                                      │
│  Status *           Priority *                       │
│  ┌──────────┐      ┌──────────┐                     │
│  │ Open   ▼ │      │ High   ▼ │                     │
│  └──────────┘      └──────────┘                     │
│                                                      │
│  Due Date          Assigned To                       │
│  ┌────────────┐    ┌────────────┐                   │
│  │📅 Feb 5   │    │👤 Me (You)▼│                   │
│  └────────────┘    └────────────┘                   │
│                                                      │
│  ─────────── Related Entities ──────────             │
│                                                      │
│  Customer                                            │
│  ┌──────────────────────────────────────────────┐   │
│  │ 🔍 Hofladen Müller GmbH               [X]   │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  Opportunity (Optional)                              │
│  ┌──────────────────────────────────────────────┐   │
│  │ Select opportunity...                      ▼ │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  Project (Optional)                                  │
│  ┌──────────────────────────────────────────────┐   │
│  │ Select project...                          ▼ │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  [Cancel]              [Create Task]                │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## ProjectTask Form Layout

### Full Form (Modal - 600px × 800px)

```
┌──────────────────────────────────────────────────────┐
│  Create Project Task                             [X] │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Project *                                           │
│  ┌──────────────────────────────────────────────┐   │
│  │ 📋 Hofladen Müller Ladenbau                  │   │
│  └──────────────────────────────────────────────┘   │
│  Read-only (inherited from context)                  │
│                                                      │
│  Title *                                             │
│  ┌──────────────────────────────────────────────┐   │
│  │ Create technical drawings for store layout   │   │
│  └──────────────────────────────────────────────┘   │
│  5-200 characters                                    │
│                                                      │
│  Description                                         │
│  ┌──────────────────────────────────────────────┐   │
│  │ Complete CAD drawings for store layout,      │   │
│  │ include furniture placement and electrical   │   │
│  │ plan. Coordinate with external electrical    │   │
│  │ consultant for approvals.                    │   │
│  └──────────────────────────────────────────────┘   │
│  Rich text editor • Max 2000 characters              │
│                                                      │
│  Status *           Priority *                       │
│  ┌──────────┐      ┌──────────┐                     │
│  │ Todo   ▼ │      │ High   ▼ │                     │
│  └──────────┘      └──────────┘                     │
│                                                      │
│  Assigned To *     Due Date                          │
│  ┌────────────┐    ┌────────────┐                   │
│  │👤 Anna W. ▼│    │📅 Feb 15   │                   │
│  └────────────┘    └────────────┘                   │
│  Only users with Project.READ permission             │
│                                                      │
│  ─────────── Project Context ──────────              │
│                                                      │
│  Phase                                               │
│  ┌──────────────────────────────────────────────┐   │
│  │ Planning                                   ▼ │   │
│  └──────────────────────────────────────────────┘   │
│  Options: Planning, Execution, Delivery, Closure    │
│                                                      │
│  Milestone (Optional)                                │
│  ┌──────────────────────────────────────────────┐   │
│  │ Design Approval                            ▼ │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  ─── Blocking Information (if status = Blocked) ─── │
│                                                      │
│  Blocking Reason *                                   │
│  ┌──────────────────────────────────────────────┐   │
│  │ Waiting for final approval from customer on │   │
│  │ wood finish selection                        │   │
│  └──────────────────────────────────────────────┘   │
│  Required when status is "Blocked" • Min 10 chars   │
│                                                      │
│  [Cancel]              [Create Task]                │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## Field Specifications

### Title Field

- **Type:** Text input
- **Required:** Yes
- **Validation:** 5-200 characters, letters, numbers, basic punctuation
- **Pattern:** `/^[a-zA-ZäöüÄÖÜß0-9\s\.\-&(),!?]+$/`
- **Helper Text:** Character count (e.g., "48/200")
- **Error Messages:**
  - "Title is required"
  - "Title must be at least 5 characters"
  - "Title must not exceed 200 characters"
  - "Title contains invalid characters"

### Description Field

- **Type:** Rich text editor (Phase 1: Textarea, Phase 2: WYSIWYG)
- **Required:** No
- **Validation:** Max 2000 characters
- **Features:**
  - Bold, italic, underline (Phase 2)
  - Bullet lists, numbered lists (Phase 2)
  - Links (Phase 2)
- **Helper Text:** Character count
- **Placeholder:** "Add details about this task..."

### Status Field

#### UserTask Status Options

- **Open** (default) - Task not started
- **In Progress** - Currently working on it
- **Completed** - Task finished
- **Cancelled** - Task no longer needed

#### ProjectTask Status Options

- **Todo** (default) - Not started
- **In Progress** - Currently working
- **Review** - Ready for review
- **Done** - Completed
- **Blocked** - Cannot proceed (requires blockingReason)

### Priority Field

#### UserTask Priority Options

- **Low** - Can wait
- **Medium** (default) - Standard priority
- **High** - Important, time-sensitive
- **Urgent** - Needs immediate attention

#### ProjectTask Priority Options

- **Low** - Can wait
- **Medium** (default) - Standard priority
- **High** - Important
- **Critical** - Blocking project progress

### Due Date Field

- **Type:** Date picker
- **Required:** No
- **Validation:** Cannot be in past (on creation)
- **Features:**
  - Calendar popup
  - Quick actions: "Today", "Tomorrow", "Next Week", "Clear"
  - Keyboard shortcut: Ctrl/Cmd + D to set today
- **Error Messages:**
  - "Due date cannot be in the past"

### Assigned To Field

#### UserTask Assignment

- **Type:** User selector dropdown
- **Required:** No (defaults to current user)
- **Options:**
  - "Me (You)" (default)
  - Other users (if user has `ASSIGN_TO_OTHERS` permission - GF/PLAN only)
- **Validation:** Selected user must exist
- **Helper Text:** "Only GF and PLAN can assign to others"

#### ProjectTask Assignment

- **Type:** User selector dropdown
- **Required:** Yes
- **Options:** Users with `Project.READ` permission on parent project
- **Features:**
  - Search by name
  - Show user role badge
  - Show user avatar
- **Validation:** Assignee must have project access
- **Error Messages:**
  - "Please select an assignee"
  - "Selected user does not have access to this project"

### Phase Field (ProjectTask Only)

- **Type:** Dropdown
- **Required:** No
- **Options:**
  - Planning
  - Execution
  - Delivery
  - Closure
- **Helper Text:** "Helps organize tasks by project stage"

### Milestone Field (ProjectTask Only)

- **Type:** Dropdown
- **Required:** No
- **Options:** Project milestones (loaded from parent project)
- **Helper Text:** "Link to project milestone"

### Blocking Reason Field (ProjectTask Only)

- **Type:** Textarea
- **Required:** Yes (if status = "Blocked")
- **Validation:** 10-500 characters when required
- **Placeholder:** "Explain why this task is blocked..."
- **Conditional Display:** Only show when status = "Blocked"
- **Error Messages:**
  - "Blocking reason is required when task is blocked"
  - "Blocking reason must be at least 10 characters"

### Related Customer/Opportunity/Project (UserTask Only)

- **Type:** Autocomplete search
- **Required:** No
- **Features:**
  - Type-ahead search
  - Show recently accessed items
  - Clear selection with X button
- **Validation:** Must reference existing entity
- **Helper Text:** "Link task to context for better organization"

---

## Form Actions

### Primary Actions

- **Create Task** - Submit form (disabled until valid)
- **Update Task** - Save changes (edit mode)

### Secondary Actions

- **Cancel** - Close form without saving (confirmation if changes made)
- **Save as Draft** - Save incomplete task (Phase 2)
- **Delete Task** - Remove task (edit mode, confirmation required)

---

## Validation Behavior

### Real-Time Validation

- **On Blur:** Validate field when user leaves it
- **On Submit:** Validate all fields before submission
- **Instant Feedback:** Show error message below field

### Error Display

```
┌──────────────────────────────────────┐
│ Title *                              │
│ ┌──────────────────────────────────┐ │
│ │ Hi                               │ │
│ └──────────────────────────────────┘ │
│ ❌ Title must be at least 5 characters│
└──────────────────────────────────────┘
```

### Success Indicator

- **Green checkmark:** Show next to valid fields (optional)
- **Submit Button:** Enable when all required fields valid

---

## Mobile Adaptations

### Mobile Form (Full Screen - 375px width)

```
┌─────────────────────────────────┐
│ [←] Create Task           [Save]│
├─────────────────────────────────┤
│                                 │
│ Title *                         │
│ ┌───────────────────────────┐   │
│ │ Call customer...          │   │
│ └───────────────────────────┘   │
│                                 │
│ Description                     │
│ ┌───────────────────────────┐   │
│ │                           │   │
│ │                           │   │
│ └───────────────────────────┘   │
│                                 │
│ Status              Priority    │
│ ┌─────────┐        ┌─────────┐  │
│ │ Open  ▼ │        │ High  ▼ │  │
│ └─────────┘        └─────────┘  │
│                                 │
│ Due Date                        │
│ ┌───────────────────────────┐   │
│ │ 📅 Feb 5, 2025      [X]  │   │
│ └───────────────────────────┘   │
│                                 │
│ [Show more options ▼]           │
│                                 │
│ [Delete Task]                   │
│                                 │
└─────────────────────────────────┘
```

### Mobile Optimizations

- **Full Screen Mode:** Form takes full viewport
- **Sticky Header:** Save button always visible
- **Collapsible Sections:** Advanced options collapsed by default
- **Native Inputs:** Use native date/time pickers
- **Voice Input:** Microphone button for title/description

---

## Accessibility

### Keyboard Navigation

- **Tab:** Move between fields
- **Shift+Tab:** Move backwards
- **Enter:** Submit form (when focus on submit button)
- **Esc:** Close modal (with confirmation)
- **Ctrl/Cmd + S:** Quick save

### Screen Reader

- **Form Labels:** All fields have associated labels
- **Required Fields:** Announced as "required"
- **Error Messages:** Read immediately when validation fails
- **Success:** "Task created successfully" announcement

### Focus Management

- **Auto-Focus:** Title field on form open
- **Trap Focus:** Within modal (cannot tab outside)
- **Focus Return:** Return to trigger element on close

---

## Form State Management

### Initial State (Create Mode)

```typescript
{
  title: '',
  description: '',
  status: 'open', // or 'todo' for ProjectTask
  priority: 'medium',
  dueDate: null,
  assignedTo: currentUser.id, // Default to self
  // UserTask specific
  relatedCustomerId: null,
  relatedOpportunityId: null,
  relatedProjectId: null,
  // ProjectTask specific
  projectId: contextProjectId, // From route/context
  phase: null,
  milestone: null,
  blockingReason: null
}
```

### Edit Mode

- **Load Existing Data:** Populate all fields with current values
- **Show Last Modified:** Display "Last modified by [User] on [Date]"
- **Version Tracking:** Show version number
- **Conflict Detection:** Warn if task changed by another user

---

## Component Props (React/TypeScript)

```typescript
interface TaskFormProps {
  mode: 'create' | 'edit';
  taskType: 'user_task' | 'project_task';
  initialData?: Partial<UserTask | ProjectTask>;
  projectId?: string; // Required for ProjectTask
  onSubmit: (data: CreateUserTaskDto | CreateProjectTaskDto) => Promise<void>;
  onCancel: () => void;
  onDelete?: (taskId: string) => Promise<void>; // Edit mode only
  isSubmitting: boolean;
  errors?: Record<string, string>;
}
```

---

## API Integration

### Create Task

```typescript
POST / api / v1 / users / { userId } / tasks(UserTask);
POST / api / v1 / projects / { projectId } / tasks(ProjectTask);
```

### Update Task

```typescript
PUT / api / v1 / users / { userId } / tasks / { taskId };
PUT / api / v1 / projects / { projectId } / tasks / { taskId };
```

### Success/Error Handling

- **Success:** Show toast notification, close modal, refresh task list
- **Validation Error (400):** Display field-specific errors
- **Permission Error (403):** Show permission denied message
- **Not Found (404):** Show error, close modal

---

## Related Components

- **TaskCard** - Displays task after creation
- **UserSelector** - Component for assignee selection
- **DatePicker** - Date selection component
- **RichTextEditor** - Description field (Phase 2)
- **EntitySearchBox** - For related entity selection

---

## Figma Component Name

- **Desktop:** `TaskForm/UserTask`, `TaskForm/ProjectTask`
- **Mobile:** `TaskForm/Mobile-UserTask`, `TaskForm/Mobile-ProjectTask`
- **Quick Create:** `TaskForm/Quick-Create`

---

**End of task-form.md**

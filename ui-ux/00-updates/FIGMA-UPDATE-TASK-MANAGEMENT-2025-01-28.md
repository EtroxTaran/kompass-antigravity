# Figma Make: Task Management UI Components

**Purpose:** Add complete task management UI components and dashboard widgets to KOMPASS Figma design system  
**Action:** Create task cards, forms, dashboards, and mobile views for both UserTask and ProjectTask  
**Date:** 2025-01-28

---

## 🎯 MASTER PROMPT FOR FIGMA MAKE

**Copy everything below this line and paste into Figma Make:**

---

# ADD TASK MANAGEMENT UI COMPONENTS

Create comprehensive task management UI components for KOMPASS application supporting both UserTask (personal todos) and ProjectTask (project work items).

---

## DESIGN SPECIFICATION: Task Card Component

### Compact Task Card (Desktop - 320px × 120px)

**Layout Structure (Top to Bottom):**

1. **Header Row** (height: 32px, padding: 12px)
   - Left: Priority badge (width: 80px, height: 24px)
   - Center: Task title (truncate at 50 chars with ellipsis)
   - Right: Three-dot menu icon (24px × 24px)

2. **Context Row** (height: 28px, padding: 0 12px)
   - Icon: 16px × 16px (📋 project or 🏢 customer)
   - Text: Entity name + phase/status
   - Color: Gray (#6B7280)
   - Font: Inter 12px Regular

3. **Footer Row** (height: 36px, padding: 8px 12px)
   - Left: User avatar (28px circle) + name
   - Center: Due date with calendar icon
   - Right: Status badge

**Priority Badge Colors:**

| Priority | Background | Text    | Border      |
| -------- | ---------- | ------- | ----------- |
| Low      | #F3F4F6    | #6B7280 | 1px #E5E7EB |
| Medium   | #DBEAFE    | #1E40AF | none        |
| High     | #FEF3C7    | #B45309 | none        |
| Urgent   | #FEE2E2    | #991B1B | none        |
| Critical | #DC2626    | #FFFFFF | none        |

**Status Badge Styles:**

UserTask Status:

- Open: Gray outline (#6B7280), no fill
- In Progress: Blue fill (#3B82F6), white text
- Completed: Green fill (#10B981), white text with ✓
- Cancelled: Red outline (#EF4444), strikethrough text

ProjectTask Status:

- Todo: Gray outline (#6B7280), no fill
- In Progress: Blue fill (#3B82F6), white text
- Review: Purple fill (#8B5CF6), white text
- Done: Green fill (#10B981), white text with ✓
- Blocked: Red fill (#EF4444), white text with ⚠️

**Interactive States:**

- Hover: Shadow 0px 4px 12px rgba(0,0,0,0.08), background #F9FAFB
- Selected: Border 2px #3B82F6, background tint #EFF6FF
- Focus: Outline 3px #93C5FD

### Expanded Task Card (Desktop - 640px × auto)

**Additional Sections (below compact card content):**

4. **Description Section** (padding: 16px)
   - Label: "Description:" (Inter 14px Semibold, #111827)
   - Content: Multi-line text (Inter 14px Regular, #374151, line-height 1.5)
   - Max-height: 200px with scroll

5. **Details Grid** (padding: 16px, 2 columns)
   - Column 1: Assignee, Created date
   - Column 2: Due date, Modified date
   - Each row: Icon (16px) + Label (12px) + Value (14px)

6. **Activity Log** (padding: 16px, collapsible)
   - Header: "Activity Log" with ▼ icon
   - Each entry: Timestamp + User + Action
   - Font: Inter 12px Regular, Color: #6B7280

7. **Action Buttons** (height: 48px, padding: 12px)
   - Primary: "Edit Task" (blue)
   - Secondary: "Mark as Done" (green) or "Delete" (red)
   - Button spacing: 8px

---

## DESIGN SPECIFICATION: Task Form Component

### UserTask Form Modal (600px × 720px)

**Modal Structure:**

```
┌── Header (height: 56px) ─────────────────┐
│ Title: "Create Personal Task"       [X] │
├──────────────────────────────────────────┤
│ ┌── Content (scroll) ──────────────────┐ │
│ │                                      │ │
│ │ [Title Field *]                      │ │
│ │ 5-200 characters                     │ │
│ │                                      │ │
│ │ [Description Field]                  │ │
│ │ Rich text • Max 2000 chars           │ │
│ │                                      │ │
│ │ [Status Dropdown *] [Priority Drop*] │ │
│ │                                      │ │
│ │ [Due Date Picker] [Assigned To]      │ │
│ │                                      │ │
│ │ ─── Related Entities ────            │ │
│ │ [Customer Search]                    │ │
│ │ [Opportunity Select]                 │ │
│ │ [Project Select]                     │ │
│ │                                      │ │
│ └──────────────────────────────────────┘ │
├── Footer (height: 64px) ────────────────┤
│ [Cancel]              [Create Task]     │
└──────────────────────────────────────────┘
```

**Field Specifications:**

1. **Title Field:**
   - Height: 48px
   - Border: 1px #D1D5DB, radius: 8px
   - Font: Inter 16px Regular
   - Placeholder: "What needs to be done?"
   - Helper text: Character count (Inter 12px, #9CA3AF)
   - Error state: Border #EF4444, helper text red

2. **Description Field:**
   - Height: 120px (expandable)
   - Border: 1px #D1D5DB, radius: 8px
   - Font: Inter 14px Regular
   - Placeholder: "Add details about this task..."
   - Rich text toolbar (Phase 2): Bold, Italic, Bullets, Links

3. **Dropdown Fields:**
   - Height: 48px
   - Border: 1px #D1D5DB, radius: 8px
   - Chevron icon: 16px, right-aligned
   - Selected value: Inter 14px Medium

4. **Date Picker:**
   - Height: 48px
   - Icon: Calendar 16px (left)
   - Format: "Feb 5, 2025"
   - Clear button: X icon (right, 16px)

5. **Related Entity Fields:**
   - Autocomplete search with dropdown
   - Selected: Chip with entity name + X to clear
   - Icon: 16px (customer/opportunity/project)

**Button Styles:**

- Primary "Create Task":
  - Background #3B82F6, text white, height 48px
  - Disabled: Background #9CA3AF, cursor not-allowed
- Secondary "Cancel":
  - Border 1px #D1D5DB, text #374151, height 48px

### ProjectTask Form Modal (600px × 800px)

**Additional Fields (compared to UserTask):**

6. **Project Field (Read-only):**
   - Height: 48px
   - Background: #F3F4F6
   - Icon: 📋 16px (left)
   - Text: Project name (Inter 14px Medium)
   - Cursor: not-allowed

7. **Phase Dropdown:**
   - Options: Planning, Execution, Delivery, Closure
   - Icon per phase: Different color dots
   - Helper text: "Helps organize tasks by project stage"

8. **Milestone Dropdown:**
   - Load from project milestones
   - Optional field
   - Format: "Milestone Name - Due: Date"

9. **Blocking Reason (Conditional):**
   - Only show when status = "Blocked"
   - Height: 80px textarea
   - Required indicator: Red asterisk
   - Validation: Min 10 characters
   - Helper text: "Required when status is 'Blocked'"

---

## DESIGN SPECIFICATION: Task Dashboard

### My Tasks Dashboard (Desktop - 1440px)

**Dashboard Layout Grid:**

```
┌── Header (height: 64px) ────────────────────────┐
│ Title + Actions                                 │
├─────────────────────────────────────────────────┤
│ ┌─ Overview Widgets (height: 120px) ──────────┐ │
│ │ [12 Open] [5 Progress] [2 Overdue] [8 Week] │ │
│ └──────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────┤
│ ┌─ Filter (240px) ──┬─ Task List (flex) ──────┐ │
│ │                   │                          │ │
│ │ Status            │ [Task Card]              │ │
│ │ ☑ Open            │ [Task Card]              │ │
│ │ ☑ In Progress     │ [Task Card]              │ │
│ │                   │ [Task Card]              │ │
│ │ Priority          │ ...                      │ │
│ │ ☑ Urgent          │                          │ │
│ │ ☑ High            │                          │ │
│ │                   │                          │ │
│ │ [Clear Filters]   │ [Load more...]           │ │
│ │                   │                          │ │
│ └───────────────────┴──────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

**Overview Widget Specs:**

- Width: 280px each (4 widgets in row, gap: 16px)
- Height: 120px
- Border: 1px #E5E7EB, radius: 12px
- Shadow: 0px 1px 3px rgba(0,0,0,0.1)
- Padding: 20px

Widget Structure:

1. Top: Icon + Label (Inter 12px Semibold, uppercase, #6B7280)
2. Center: Large number (Inter 36px Bold, color varies by widget)
3. Bottom: Subtitle (Inter 14px Regular, #9CA3AF)

Widget Colors:

- Open: #6B7280 (gray)
- In Progress: #3B82F6 (blue)
- Overdue: #EF4444 (red) if count > 0
- This Week: #F59E0B (orange) if count > 10

**Filter Sidebar:**

- Width: 240px
- Background: #F9FAFB
- Border-right: 1px #E5E7EB
- Padding: 16px

Filter Section:

- Section title: Inter 12px Semibold, uppercase, #9CA3AF, margin-bottom: 8px
- Checkbox item:
  - Height: 36px
  - Font: Inter 14px Regular, #374151
  - Count badge: (gray, right-aligned)
  - Checkbox: 18px, #3B82F6 when checked

**Task List Area:**

- Background: White
- Padding: 24px
- Task cards: 8px vertical spacing
- Load more button: Center-aligned, Inter 14px Medium, #3B82F6

### Mobile Task Dashboard (375px)

**Mobile Layout (Vertical Stack):**

```
┌── Header (56px) ──────────────┐
│ [☰] My Tasks    [+] [Filter]  │
├───────────────────────────────┤
│ ┌─ Overview (Scrollable) ───┐ │
│ │ [12]  [5]  [2]  [8]       │ │
│ │ Open Prog Over Week       │ │
│ └───────────────────────────┘ │
├───────────────────────────────┤
│ ─── Today (3) ────────────    │
│ [Task Card]                   │
│ [Task Card]                   │
│ [Task Card]                   │
│                               │
│ ─── This Week (8) ─────────   │
│ [Task Card]                   │
│ [Show all ▼]                  │
│                               │
├── Bottom Tabs (64px) ─────────┤
│ [Tasks] [Dash] [Proj] [Me]    │
└───────────────────────────────┘
```

**Mobile Widget Specs:**

- Width: 80px each (4 in horizontal scroll)
- Height: 80px
- Border: 1px #E5E7EB, radius: 8px
- Number: Inter 24px Bold
- Label: Inter 10px Regular

**Mobile Card:**

- Width: Full width - 32px padding
- Height: Auto
- Margin: 8px 16px
- Swipe gestures enabled

---

## DESIGN SPECIFICATION: Mobile Swipe Actions

### Right Swipe (Complete Action)

**Swipe States:**

1. **Initial (0%):** Card at rest
2. **Revealing (1-50%):** Green background appears
3. **Threshold (50-80%):** "Complete" button visible
4. **Committed (80-100%):** Auto-complete animation

**Visual Specs:**

- Background: #10B981 (green)
- Icon: ✓ checkmark, 32px, white
- Text: "Complete" (Inter 16px Semibold, white)
- Animation: Ease-out 200ms

### Left Swipe (Action Menu)

**Swipe States:**

1. **First Action (30%):** Edit button (blue #3B82F6)
2. **Second Action (60%):** Delete button (red #EF4444)

**Button Specs:**

- Width: 80px each
- Height: Full card height
- Icon: 24px white
- Text: Inter 14px Semibold white

---

## DESIGN SPECIFICATION: Empty States

### No Tasks Empty State

```
┌──────────────────────────────────────┐
│                                      │
│           [📋 Icon 64px]             │
│                                      │
│      No tasks yet                    │
│      (Inter 20px Semibold #111827)   │
│                                      │
│  Click "New Task" to create your     │
│  first task and stay organized.      │
│  (Inter 14px Regular #6B7280)        │
│                                      │
│      [+ New Task Button]             │
│                                      │
└──────────────────────────────────────┘
```

### All Complete Empty State

```
┌──────────────────────────────────────┐
│                                      │
│           [✅ Icon 64px]             │
│                                      │
│      All caught up!                  │
│      (Inter 20px Semibold #10B981)   │
│                                      │
│  You've completed all your tasks.    │
│  Great work!                         │
│  (Inter 14px Regular #6B7280)        │
│                                      │
│      [View Completed]                │
│                                      │
└──────────────────────────────────────┘
```

---

## COLOR PALETTE

### Priority Colors

```
Low:      #9CA3AF (gray-400)
Medium:   #3B82F6 (blue-500)
High:     #F59E0B (amber-500)
Urgent:   #EF4444 (red-500)
Critical: #B91C1C (red-700)
```

### Status Colors (UserTask)

```
Open:       #6B7280 (gray-500)
In Progress: #3B82F6 (blue-500)
Completed:  #10B981 (green-500)
Cancelled:  #EF4444 (red-500)
```

### Status Colors (ProjectTask)

```
Todo:       #6B7280 (gray-500)
In Progress: #3B82F6 (blue-500)
Review:     #8B5CF6 (purple-500)
Done:       #10B981 (green-500)
Blocked:    #EF4444 (red-500)
```

### UI Background Colors

```
Page Background:    #F9FAFB (gray-50)
Card Background:    #FFFFFF (white)
Input Border:       #D1D5DB (gray-300)
Input Focus Border: #3B82F6 (blue-500)
Disabled Background: #F3F4F6 (gray-100)
```

---

## TYPOGRAPHY

### Font Family

Primary: Inter (Google Fonts)
Fallback: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif

### Font Sizes & Weights

| Element       | Size | Weight         | Line Height |
| ------------- | ---- | -------------- | ----------- |
| Page Title    | 24px | 700 (Bold)     | 32px        |
| Section Title | 18px | 600 (Semibold) | 28px        |
| Card Title    | 16px | 500 (Medium)   | 24px        |
| Body Text     | 14px | 400 (Regular)  | 20px        |
| Small Text    | 12px | 400 (Regular)  | 16px        |
| Caption       | 11px | 400 (Regular)  | 14px        |
| Button Text   | 14px | 500 (Medium)   | 20px        |

---

## SPACING & SIZING

### Spacing Scale (8px base)

```
4px  (0.5x)  - Extra tight
8px  (1x)    - Tight
12px (1.5x)  - Compact
16px (2x)    - Default
24px (3x)    - Comfortable
32px (4x)    - Spacious
48px (6x)    - Extra spacious
```

### Border Radius

```
Small:  4px  (buttons, badges)
Medium: 8px  (inputs, cards)
Large:  12px (modals, containers)
Round:  50%  (avatars, icons)
```

### Shadow Elevation

```
Level 1: 0px 1px 2px rgba(0,0,0,0.05)
Level 2: 0px 1px 3px rgba(0,0,0,0.1)
Level 3: 0px 4px 12px rgba(0,0,0,0.08)
Level 4: 0px 8px 16px rgba(0,0,0,0.12)
```

---

## ICON SPECIFICATIONS

### Icon Library

Use Heroicons v2 (outline style for non-filled, solid for filled)

### Common Icons & Sizes

| Element     | Icon Name          | Size |
| ----------- | ------------------ | ---- |
| Calendar    | calendar           | 16px |
| User Avatar | user-circle        | 28px |
| Priority    | exclamation-circle | 16px |
| Status      | check-circle       | 16px |
| Menu        | ellipsis-vertical  | 24px |
| Close       | x-mark             | 24px |
| Add         | plus               | 24px |
| Edit        | pencil-square      | 16px |
| Delete      | trash              | 16px |
| Search      | magnifying-glass   | 20px |
| Filter      | funnel             | 20px |

### Icon Colors

- Default: #6B7280 (gray-500)
- Hover: #374151 (gray-700)
- Active: #3B82F6 (blue-500)
- Disabled: #D1D5DB (gray-300)

---

## BUTTON SPECIFICATIONS

### Primary Button

- Background: #3B82F6
- Text: White (#FFFFFF)
- Height: 48px (desktop), 44px (mobile)
- Padding: 12px 24px
- Border-radius: 8px
- Font: Inter 14px Medium
- Hover: Background #2563EB
- Active: Background #1D4ED8
- Disabled: Background #9CA3AF, cursor not-allowed

### Secondary Button

- Background: Transparent
- Border: 1px #D1D5DB
- Text: #374151
- Height: 48px (desktop), 44px (mobile)
- Padding: 12px 24px
- Border-radius: 8px
- Font: Inter 14px Medium
- Hover: Background #F3F4F6
- Active: Border #3B82F6

### Destructive Button

- Background: #EF4444
- Text: White (#FFFFFF)
- (Other specs same as Primary)
- Hover: Background #DC2626

---

## ACCESSIBILITY REQUIREMENTS

### Focus States

- Outline: 3px solid #93C5FD (blue-300)
- Offset: 2px
- Border-radius: Same as element + 2px

### Contrast Ratios

- Body text on background: Min 4.5:1
- Large text (18px+) on background: Min 3:1
- Priority/status badges: Min 7:1 (AAA level)

### Touch Targets (Mobile)

- Minimum: 44px × 44px (Apple HIG)
- Recommended: 48px × 48px (Material Design)
- Spacing between targets: Min 8px

---

## QUALITY CHECKLIST

After implementing these components in Figma, verify:

- [ ] Task Card compact variant (320px × 120px)
- [ ] Task Card expanded variant (640px × auto)
- [ ] UserTask Form modal (600px × 720px)
- [ ] ProjectTask Form modal (600px × 800px)
- [ ] Desktop Task Dashboard layout (1440px)
- [ ] Mobile Task List view (375px)
- [ ] Mobile swipe actions (right/left)
- [ ] Task overview widgets (4 variants)
- [ ] Filter sidebar with checkboxes
- [ ] Empty states (no tasks, all complete)
- [ ] All priority colors match specification
- [ ] All status colors match specification
- [ ] Inter font family applied throughout
- [ ] All spacing uses 8px scale
- [ ] All buttons meet accessibility contrast
- [ ] All touch targets ≥ 44px on mobile
- [ ] Focus states visible on all interactive elements
- [ ] Icons from Heroicons v2
- [ ] Dark mode variants (if applicable)
- [ ] Responsive breakpoints tested

---

**Total Components:** 15+  
**Total Variants:** 30+  
**Design System:** Tailwind CSS compatible  
**Accessibility:** WCAG 2.1 AA compliant

---

END OF PROMPT

**Note:** This prompt creates the complete task management UI system including desktop dashboards, mobile views, forms, cards, and all interactive states. All components follow KOMPASS design system and are ready for developer handoff.

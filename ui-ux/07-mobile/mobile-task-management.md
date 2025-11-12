# Mobile Task Management Specification

**Version:** 1.0  
**Last Updated:** 2025-01-28  
**Status:** Planned for Phase 1 - MVP

---

## Overview

Mobile task management is optimized for on-the-go access, focusing on quick task creation, status updates, and prioritized task lists. Supports offline-first PWA capabilities with automatic sync.

---

## Mobile App Structure

### Bottom Tab Navigation

```
┌─────────────────────────────────────┐
│                                     │
│          [App Content]              │
│                                     │
│                                     │
├─────────────────────────────────────┤
│ ┌───┬───┬───┬───┬───┐               │
│ │📋│📊│📁│💬│👤│  [Bottom Tabs]    │
│ │Tas│Dash│Pro│Act│Me │               │
│ │ks │brd │j  │iv │  │               │
│ └───┴───┴───┴───┴───┘               │
└─────────────────────────────────────┘
```

**Tab 1: Tasks** - My task list and quick add  
**Tab 2: Dashboard** - Task overview and metrics  
**Tab 3: Projects** - Project task boards  
**Tab 4: Activity** - Recent updates and notifications  
**Tab 5: Me** - Profile and settings  

---

## My Tasks View (Mobile - 375px)

```
┌─────────────────────────────────┐
│ [☰] My Tasks       [🔍] [+ NEW] │
├─────────────────────────────────┤
│                                 │
│ ┌─────┬─────┬─────┬─────┐       │
│ │ 12  │  5  │  2  │  8  │       │
│ │Open │Prog │Over │Week │       │
│ └─────┴─────┴─────┴─────┘       │
│                                 │
│ ─── Today (3) ──────────────     │
│                                 │
│ ┌───────────────────────────┐   │
│ │⚠️ OVERDUE                 │   │
│ │Call Hofladen Müller       │   │
│ │📋 Hofladen • Due: Feb 5   │   │
│ │[Swipe for actions →]      │   │
│ └───────────────────────────┘   │
│                                 │
│ ┌───────────────────────────┐   │
│ │🔴 HIGH                    │   │
│ │Review supplier quotes     │   │
│ │📋 Admin • Due: Today 5PM  │   │
│ │[Swipe for actions →]      │   │
│ └───────────────────────────┘   │
│                                 │
│ ┌───────────────────────────┐   │
│ │🟠 MEDIUM                  │   │
│ │Update project report      │   │
│ │📋 Schmidt Project • Today │   │
│ │[Swipe for actions →]      │   │
│ └───────────────────────────┘   │
│                                 │
│ ─── This Week (8) ───────────    │
│                                 │
│ ┌───────────────────────────┐   │
│ │🔵 MEDIUM                  │   │
│ │Create technical drawings  │   │
│ │📋 Hofladen Proj • Feb 15  │   │
│ └───────────────────────────┘   │
│                                 │
│ [Load more...]                  │
│                                 │
└─────────────────────────────────┘
```

---

## Swipe Actions

### Right Swipe (Complete)
```
┌─────────────────────────────────┐
│ [✅ Complete]  Task Title...    │ ← Green background
└─────────────────────────────────┘
```
- **Color:** Green (#10B981)
- **Icon:** Checkmark
- **Action:** Mark task complete
- **Threshold:** 50% swipe = show button, 80% = auto-complete

### Left Swipe (Actions Menu)
```
┌─────────────────────────────────┐
│  ...Task Title  [✏️ Edit][🗑️ Del]│ ← Blue/Red background
└─────────────────────────────────┘
```
- **First Action (Blue):** Edit task
- **Second Action (Red):** Delete task
- **Threshold:** 30% swipe = show one action, 60% = show both

---

## Quick Add Task (Floating Action Button)

### FAB Position
- **Location:** Bottom-right corner, above tab bar
- **Size:** 56px × 56px
- **Icon:** + (plus sign)
- **Color:** Primary blue (#3B82F6)
- **Shadow:** Elevated (8dp)

### Quick Add Modal (Half-Screen)

```
┌─────────────────────────────────┐
│ ─                               │
│ [Drag down to dismiss]          │
│                                 │
│ Quick Add Task                  │
│                                 │
│ What needs to be done?          │
│ ┌───────────────────────────┐   │
│ │ Call customer about...    │   │
│ └───────────────────────────┘   │
│                                 │
│ ┌─────┐  ┌─────┐  ┌─────┐      │
│ │📅   │  │🔴   │  │📋   │      │
│ │Date │  │Prio │  │Link │      │
│ └─────┘  └─────┘  └─────┘      │
│                                 │
│ [Create Task]                   │
│                                 │
└─────────────────────────────────┘
```

### Quick Add Fields
1. **Title** (required) - Text input with voice-to-text button
2. **Due Date** (optional) - Tap to open date picker with shortcuts
3. **Priority** (optional) - Tap to cycle through Low/Medium/High/Urgent
4. **Link Entity** (optional) - Quick search for customer/project

---

## Task Detail View (Full Screen)

```
┌─────────────────────────────────┐
│ [← Back]            [⋯ More]    │
├─────────────────────────────────┤
│                                 │
│ [🔴 HIGH] Call Hofladen Müller  │
│                                 │
│ ─── Details ─────────────────   │
│                                 │
│ Description:                    │
│ Customer wants to confirm       │
│ installation date for next      │
│ month. Discuss timeline.        │
│                                 │
│ Status          Priority        │
│ ┌──────┐       ┌──────┐         │
│ │Open ▼│       │High ▼│         │
│ └──────┘       └──────┘         │
│                                 │
│ Due Date                        │
│ ┌───────────────────────────┐   │
│ │📅 Feb 5, 2025       [X]  │   │
│ └───────────────────────────┘   │
│                                 │
│ ─── Context ─────────────────   │
│                                 │
│ Customer                        │
│ 🏢 Hofladen Müller GmbH         │
│                                 │
│ Opportunity                     │
│ 💼 Hofladen Store Renovation    │
│                                 │
│ ─── Activity ────────────────   │
│                                 │
│ • Jan 28, 3:30 PM               │
│   Created by Michael Schmidt    │
│                                 │
│ [Edit Task]  [Mark Complete]    │
│                                 │
└─────────────────────────────────┘
```

---

## Voice Input

### Voice-to-Text for Title
```
┌─────────────────────────────────┐
│ Quick Add Task                  │
│                                 │
│ ┌───────────────────────────┐   │
│ │                        [🎤]│  │
│ └───────────────────────────┘   │
│                                 │
│ [Tap microphone to speak]       │
└─────────────────────────────────┘
```

### Voice Recording
```
┌─────────────────────────────────┐
│ 🎤 Listening...                 │
│                                 │
│ ⚫⚫⚫⚫⚫⚫⚫⚫⚫⚫  [Audio Wave]   │
│                                 │
│ "Call Hofladen Müller about..." │
│                                 │
│ [Tap to stop]                   │
└─────────────────────────────────┘
```

### Voice Confirmation
- **Auto-fill Title:** Transcribed text appears in title field
- **Corrections:** User can edit transcription
- **Retry:** Tap mic again to re-record

---

## Offline Mode

### Offline Indicator
```
┌─────────────────────────────────┐
│ ⚠️ Offline  •  3 changes pending│
└─────────────────────────────────┘
```
- **Banner:** Top of screen, persistent
- **Status:** Shows pending changes count
- **Auto-Hide:** When back online and synced

### Pending Changes Badge
```
┌───────────────────────────┐
│🟡 Review quotes           │
│📋 Admin • Not synced yet  │
└───────────────────────────┘
```
- **Yellow Dot:** Indicates local changes not synced
- **Tap:** View sync status details

### Sync Status Details
```
┌─────────────────────────────────┐
│ Sync Status                 [X] │
├─────────────────────────────────┤
│                                 │
│ ⏳ Pending (3)                  │
│ • Call Hofladen Müller          │
│ • Review supplier quotes        │
│ • Update project report         │
│                                 │
│ ✅ Synced (15)                  │
│ ❌ Failed (0)                   │
│                                 │
│ Last synced: 2 min ago          │
│                                 │
│ [Retry Sync]                    │
│                                 │
└─────────────────────────────────┘
```

---

## Notifications

### Push Notification Format
```
┌─────────────────────────────────┐
│ KOMPASS                     [X] │
│                                 │
│ 📋 Task Due Soon                │
│                                 │
│ "Call Hofladen Müller" is due   │
│ in 1 hour.                      │
│                                 │
│ [Mark Complete]  [Snooze 1h]    │
└─────────────────────────────────┘
```

### Notification Types
1. **Due Soon:** 1 hour before due time
2. **Overdue:** At due time, then daily reminders
3. **Assignment:** When task assigned to you
4. **Status Change:** When task status changes (team tasks)
5. **Blocked:** When project task becomes blocked

### Notification Actions
- **Mark Complete:** Quick complete from notification
- **Snooze:** Remind again in 1h, 3h, or Tomorrow
- **Open Task:** View task details

---

## Filters (Mobile)

### Filter Modal (Full Screen)

```
┌─────────────────────────────────┐
│ [✕] Filters            [Apply]  │
├─────────────────────────────────┤
│                                 │
│ ─── Status ──────────────────   │
│                                 │
│ ☑ Open                          │
│ ☑ In Progress                   │
│ ☐ Completed                     │
│ ☐ Cancelled                     │
│                                 │
│ ─── Priority ────────────────   │
│                                 │
│ ☑ Urgent                        │
│ ☑ High                          │
│ ☐ Medium                        │
│ ☐ Low                           │
│                                 │
│ ─── Due Date ────────────────   │
│                                 │
│ ☑ Overdue                       │
│ ☑ Today                         │
│ ☑ This Week                     │
│ ☐ This Month                    │
│ ☐ No Due Date                   │
│                                 │
│ ─── Task Type ───────────────   │
│                                 │
│ ☑ Personal Tasks                │
│ ☑ Project Tasks                 │
│                                 │
│ [Clear All]         [Apply]     │
│                                 │
└─────────────────────────────────┘
```

---

## Search (Mobile)

### Search Bar
```
┌─────────────────────────────────┐
│ [←] 🔍 Search tasks...          │
└─────────────────────────────────┘
```

### Search Results
```
┌─────────────────────────────────┐
│ [←] 🔍 "hofladen"               │
├─────────────────────────────────┤
│                                 │
│ ─── Results (3) ─────────────   │
│                                 │
│ ┌───────────────────────────┐   │
│ │[🔴] Call Hofladen Müller  │   │
│ │📋 Hofladen • Due: Feb 5   │   │
│ └───────────────────────────┘   │
│                                 │
│ ┌───────────────────────────┐   │
│ │[🟠] Create drawings       │   │
│ │📋 Hofladen Proj • Feb 15  │   │
│ └───────────────────────────┘   │
│                                 │
│ ┌───────────────────────────┐   │
│ │[🔵] Review quotes         │   │
│ │📋 Hofladen Opp • Feb 10   │   │
│ └───────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

### Search Features
- **Real-Time:** Results as you type
- **Fuzzy Search:** Matches partial words
- **Highlight:** Search term highlighted in results
- **Clear:** X button to clear search
- **Recent:** Show recent searches

---

## Widgets (iOS/Android Home Screen)

### Small Widget (2×2)
```
┌───────────────┐
│ KOMPASS Tasks │
│               │
│   📋 12       │
│   Open Tasks  │
│               │
└───────────────┘
```

### Medium Widget (4×2)
```
┌─────────────────────────────────┐
│ KOMPASS Tasks                   │
│                                 │
│ 📋 12 Open  •  🔴 2 Overdue     │
│                                 │
│ • Call Hofladen (Due: Today)    │
│ • Review quotes (Overdue)       │
│                                 │
└─────────────────────────────────┘
```

---

## Touch Targets & Gestures

### Minimum Touch Target
- **Size:** 44px × 44px minimum (Apple HIG)
- **Spacing:** 8px minimum between targets
- **Buttons:** 48dp × 48dp (Material Design)

### Gestures
- **Swipe Right:** Mark complete
- **Swipe Left:** Show actions
- **Long Press:** Open context menu
- **Pull Down:** Refresh list
- **Pinch:** (Reserved for future zooming features)

---

## Dark Mode Support

### Dark Mode Colors

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Background | #FFFFFF | #1F2937 |
| Card | #F9FAFB | #374151 |
| Text Primary | #111827 | #F9FAFB |
| Text Secondary | #6B7280 | #9CA3AF |
| Priority High | #EF4444 | #F87171 |
| Priority Urgent | #DC2626 | #EF4444 |

### Dark Mode Toggle
- **Location:** Settings > Appearance
- **Options:** Light, Dark, System Default
- **Persistence:** Saved in local storage

---

## Accessibility (Mobile)

### Screen Reader (iOS VoiceOver / Android TalkBack)
- **Task Card:** "Task: [Title], Priority: [Priority], Due: [Date], Status: [Status]"
- **Swipe Actions:** "Swipe right to mark complete, swipe left for more actions"
- **FAB:** "Add new task button"

### Font Scaling
- **Support:** iOS Dynamic Type, Android Scalable Pixels
- **Range:** 0.85x to 2.0x
- **Reflow:** UI adjusts to larger text sizes

### Haptic Feedback
- **Swipe Complete:** Success haptic (iOS: notification, Android: heavy click)
- **Delete:** Warning haptic (iOS: warning, Android: long press)
- **Task Created:** Light haptic feedback

---

## Performance (Mobile)

### Initial Load Time
- **Target:** < 2 seconds on 4G connection
- **Critical Path:** Render first 10 tasks immediately
- **Images:** Lazy load avatars and icons

### Battery Optimization
- **Background Sync:** Batch sync every 15 minutes when app in background
- **Location:** Do not use location services
- **Animations:** Reduce animations when battery saver on

### Data Usage
- **Efficient Sync:** Only sync changed tasks
- **Image Compression:** Use WebP format at 75% quality
- **Offline Cache:** Limit to last 30 days of tasks

---

## Testing Checklist

### Device Testing
- [ ] iPhone SE (smallest screen)
- [ ] iPhone 14 Pro (notch)
- [ ] iPad (tablet mode)
- [ ] Samsung Galaxy A series (Android)
- [ ] Pixel 7 (Material You)

### Orientation Testing
- [ ] Portrait mode (primary)
- [ ] Landscape mode (supported)

### Network Testing
- [ ] Online mode (full sync)
- [ ] Offline mode (local changes)
- [ ] Slow connection (3G)
- [ ] Intermittent connection

---

## Related Components

- **TaskCard** - Mobile-optimized task card
- **SwipeActions** - Swipe gesture handler
- **QuickAddForm** - Bottom sheet quick add
- **VoiceInput** - Voice-to-text component

---

## Figma Component Name

- **Mobile:** `Mobile/TaskList`, `Mobile/TaskDetail`, `Mobile/QuickAdd`
- **Widgets:** `Widget/Small-iOS`, `Widget/Medium-iOS`, `Widget/Small-Android`

---

**End of mobile-task-management.md**



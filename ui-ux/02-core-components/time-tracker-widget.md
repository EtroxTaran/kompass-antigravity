# Time Tracker Widget - Figma Make Prompt

## Context & Purpose

- **Component Type**: Floating Widget/Toolbar Component
- **User Roles**: ADM, INNEN, PLAN, KALK (track project time)
- **Usage Context**: Quick time tracking while working, minimal UI disruption
- **Business Value**: Accurate project time tracking, improved billing, resource planning

## Design Requirements

### Visual Hierarchy

- **Minimal footprint**: Small, unobtrusive widget
- **Clear status**: Running/paused/stopped states
- **Quick project switch**: Dropdown for active project
- **Time display**: Current session and daily total

### Widget Structure

- Floating or docked positioning
- Start/pause/stop controls
- Project/task selector
- Time display (HH:MM:SS)
- Quick note capability

### shadcn/ui Components

- Card (mini), Button, Select, Popover
- Progress indicator for running state
- Tooltip for expanded info

## Figma Make Prompt

Create a minimal time tracking widget for KOMPASS that enables quick time logging with minimal UI disruption during active work.

**Desktop Widget - Floating Mode (320px × 80px):**

```
┌───────────────────────────────────────────┐
│ ⏱️ 01:23:45 | Projekt Phoenix         [−] │
│ [▶️] [⏸️] [⏹️] | Heute: 5h 42min      [📝] │
└───────────────────────────────────────────┘
```

**Desktop Widget - Expanded (320px × 200px):**

```
┌───────────────────────────────────────────┐
│ Zeiterfassung                         [−] │
├───────────────────────────────────────────┤
│ Projekt                                   │
│ [Projekt Phoenix - Phase 2 ▼]             │
│                                           │
│ Aktuelle Sitzung: 01:23:45                │
│ Heute gesamt: 5h 42min                    │
│                                           │
│ Notiz (optional)                          │
│ [API Integration...]                      │
│                                           │
│ [▶️ Start] [⏸️ Pause] [⏹️ Beenden]        │
└───────────────────────────────────────────┘
```

**Desktop Docked Mode (Full Width × 48px):**

```
┌─────────────────────────────────────────────────────────────┐
│ ⏱️ Zeiterfassung | Projekt Phoenix - Phase 2 | 01:23:45 |   │
│ Heute: 5h 42min | [▶️] [⏸️] [⏹️] [📝 Notiz]              [⚙️]│
└─────────────────────────────────────────────────────────────┘
```

**Mobile Widget (Bottom Docked - 375px × 64px):**

```
┌─────────────────────────────┐
│ Projekt Phoenix    01:23:45 │
│ [▶️] [⏸️] [⏹️]    Heute: 5:42│
└─────────────────────────────┘
```

**Project Quick Switch (Dropdown - 300px):**

```
┌─────────────────────────────┐
│ Projekt wechseln            │
├─────────────────────────────┤
│ 🕐 Zuletzt verwendet         │
│ • Projekt Phoenix           │
│ • Hofladen Website          │
│ • Kundenmeeting Müller      │
│                             │
│ ⭐ Favoriten                 │
│ • Interne Meetings          │
│ • Administration            │
│                             │
│ [Alle Projekte...]          │
└─────────────────────────────┘
```

**Time Summary Popover (280px):**

```
┌─────────────────────────────┐
│ Heute - Mi, 06.02.2025      │
├─────────────────────────────┤
│ Projekt Phoenix      3:45 h │
│ Hofladen Website     1:30 h │
│ Meetings             0:27 h │
│ ─────────────────────────── │
│ Gesamt:              5:42 h │
│                             │
│ Diese Woche:        23:15 h │
│ Diesen Monat:       89:30 h │
│                             │
│ [Detailansicht →]           │
└─────────────────────────────┘
```

**States & Visual Feedback:**

**Running State:**

- Green pulse on timer icon
- Time counter incrementing
- Pause button active
- Subtle animation on digits

**Paused State:**

- Amber pause icon
- Time frozen
- "Pausiert" text
- Resume button highlighted

**Stopped State:**

- Gray/neutral colors
- "Bereit" status
- Start button prominent

**Widget Settings (Popover):**

```
┌─────────────────────────────┐
│ Widget-Einstellungen        │
├─────────────────────────────┤
│ Position                    │
│ ○ Schwebend                 │
│ ● Oben angedockt            │
│ ○ Unten angedockt           │
│                             │
│ Verhalten                   │
│ ☑ Immer im Vordergrund      │
│ ☑ Auto-Pause bei Inaktivität│
│ ☑ Ton bei Start/Stop        │
│                             │
│ Inaktivität nach: [15 ▼] Min│
│                             │
│ [Speichern]                 │
└─────────────────────────────┘
```

**Quick Actions:**

- **Click timer**: Show day summary
- **Right click**: Context menu
- **Drag**: Reposition (floating mode)
- **Double click project**: Open project details
- **Keyboard shortcuts**: Ctrl+Shift+S (start/stop)

## Interaction Patterns

- **Smart project detection**: Auto-suggest based on calendar
- **Quick note**: Inline editing without dialog
- **Batch time entry**: Add multiple entries at once
- **Idle detection**: Prompt after 15 min inactivity
- **End of day reminder**: Prompt to stop tracking

## German Labels & Content

- **Zeiterfassung**: Time tracking
- **Aktuelle Sitzung**: Current session
- **Heute gesamt**: Today total
- **Pausiert**: Paused
- **Bereit**: Ready
- **Projekt wechseln**: Switch project

## Accessibility Requirements

- Keyboard shortcuts for all actions
- Screen reader announces time changes
- High contrast mode support
- Configurable notification sounds
- Tab navigation through controls

## Mobile Considerations

- **Persistent notification**: Show timer in status bar
- **Lock screen widget**: Basic controls available
- **Battery optimization**: Minimal background usage
- **Quick toggle**: From notification shade
- **Voice control**: "Start timer for Project X"

## Smart Features

- **Calendar integration**: Auto-start based on meetings
- **Location awareness**: Start when arriving at client
- **Task detection**: Suggest project from active window
- **Pattern learning**: Suggest common time blocks
- **Reminder system**: Break reminders, end of day

## Implementation Notes

```bash
# Widget Framework Options
- Electron for desktop (cross-platform)
- React Native for mobile
- PWA service worker for web

# State Management
- Running timers (can have multiple paused)
- Current active timer
- Daily/weekly aggregates
- Settings preferences
- Notification queue

# Performance
- Update timer display every second
- Batch database writes every minute
- Local storage for offline
- Sync when online

# Integrations
- Calendar API for meetings
- Project management system
- Billing/invoice system
- Analytics dashboard
```

## Timer States & Transitions

```
IDLE → RUNNING → PAUSED → RUNNING → STOPPED
  ↓                ↓
  └──────────────→ STOPPED

- IDLE: No timer active
- RUNNING: Timer incrementing
- PAUSED: Timer frozen, resumable
- STOPPED: Timer ended, saved
```

## Analytics Events

- timer_started (project, method)
- timer_stopped (duration, project)
- timer_paused (reason: manual/idle)
- project_switched_while_running
- idle_timeout_triggered
- daily_summary_viewed

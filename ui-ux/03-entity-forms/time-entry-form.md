# Time Entry Form - Figma Make Prompt

## Context & Purpose
- **Component Type**: Manual Time Entry Form
- **User Roles**: All roles (track their project time)
- **Usage Context**: Log time after the fact, edit tracked time, bulk time entry
- **Business Value**: Complete time records, accurate billing, project profitability

## Design Requirements

### Visual Hierarchy
- **Date-first approach**: Clear date selection
- **Project prominently displayed**: Easy project selection
- **Duration input methods**: Hours or start/end time
- **Description required**: What was done

### Form Structure
- Date selector at top
- Project/task hierarchy
- Duration input (flexible)
- Activity description
- Billable toggle
- Save/submit actions

### shadcn/ui Components
- Form, DatePicker, TimePicker, Select
- Textarea, Switch, Button
- Card for form container

## Figma Make Prompt

Create a comprehensive time entry form for KOMPASS that enables manual time logging with flexible input methods and project association.

**Desktop Form (600px × 700px):**

```
┌─────────────────────────────────────────────┐
│ Zeiteintrag erfassen                    [×] │
├─────────────────────────────────────────────┤
│                                             │
│ Datum *                                     │
│ [📅 Mi, 06. Februar 2025 ▼]                 │
│                                             │
│ ─── Projekt & Aufgabe ───                   │
│ Projekt *                                   │
│ [🔍 Projekt suchen...]                      │
│ └─ Projekt Phoenix - Website Relaunch       │
│    └─ Phase 2: Backend-Entwicklung          │
│                                             │
│ Aufgabe/Tätigkeit                           │
│ [API-Integration ▼]                         │
│ • Entwicklung                               │
│ • Meeting                                   │
│ • Konzeption                                │
│ • Testing                                   │
│ • + Neue Tätigkeit                          │
│                                             │
│ ─── Zeiterfassung ───                       │
│                                             │
│ ○ Dauer eingeben                            │
│   [2] Std. [30] Min.                        │
│                                             │
│ ● Von/Bis eingeben                          │
│   Von: [09:30] Bis: [12:00]                 │
│   Dauer: 2,5 Stunden                        │
│                                             │
│ ─── Details ───                             │
│                                             │
│ Beschreibung *                              │
│ [REST API Endpoints für Kundendaten imple-] │
│ [mentiert. Authentifizierung via JWT.     ] │
│ [Unit Tests geschrieben.                  ] │
│ (min. 10 Zeichen)                           │
│                                             │
│ ☑ Abrechenbar (Billable)                    │
│ ☐ Überstunden                               │
│                                             │
│ [Abbrechen]      [Als Entwurf] [Speichern]  │
└─────────────────────────────────────────────┘
```

**Mobile Form (375px):**

```
┌─────────────────────────────┐
│ [←] Neuer Zeiteintrag       │
├─────────────────────────────┤
│                             │
│ Wann?                       │
│ [Heute, 06.02. ▼]           │
│                             │
│ Projekt *                   │
│ [Projekt Phoenix ▼]         │
│ └ Backend-Entwicklung       │
│                             │
│ Wie lange?                  │
│ ┌───────┬───────┐           │
│ │  2    │  30   │           │
│ │ Std.  │ Min.  │           │
│ └───────┴───────┘           │
│                             │
│ oder                        │
│                             │
│ Von: [09:30]                │
│ Bis: [12:00]                │
│                             │
│ Was wurde gemacht? *        │
│ [API-Integration...]        │
│                             │
│ ☑ Abrechenbar               │
│                             │
│ [Speichern]                 │
└─────────────────────────────┘
```

**Bulk Time Entry (Desktop - 900px):**

```
┌─────────────────────────────────────────────────────────┐
│ Mehrere Zeiteinträge - KW 6, 2025               [×]    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Projekt: [Projekt Phoenix ▼]                            │
│                                                         │
│ Mo  Di  Mi  Do  Fr | Gesamt: 12,5 Std.                 │
│ ──────────────────────────────────────                  │
│ Mo, 03.02.                                              │
│ [2,5] Std. - API Konzeption ✓                          │
│                                                         │
│ Di, 04.02.                                              │
│ [___] Std. - [________________]                         │
│                                                         │
│ Mi, 05.02.                                              │
│ [4,0] Std. - Backend Implementation ✓                   │
│ [1,5] Std. - Team Meeting ✓                            │
│ [+ Eintrag hinzufügen]                                  │
│                                                         │
│ Do, 06.02. (Heute)                                      │
│ [2,5] Std. - API Integration ○                         │
│ [___] Std. - [________________]                         │
│                                                         │
│ Fr, 07.02.                                              │
│ [___] Std. - [________________]                         │
│                                                         │
│ [Alle löschen]                    [Entwürfe speichern]  │
└─────────────────────────────────────────────────────────┘
```

**Quick Templates (Dropdown):**

```
┌─────────────────────────────┐
│ Vorlagen                    │
├─────────────────────────────┤
│ 📌 Häufig verwendet         │
│ • Daily Standup (0,25h)     │
│ • Sprint Planning (2h)      │
│ • Code Review (1h)          │
│                             │
│ 🕐 Letzte Einträge          │
│ • API Integration (2,5h)    │
│ • Bug Fixing (1,5h)         │
│ • Documentation (1h)        │
│                             │
│ [Vorlage erstellen...]      │
└─────────────────────────────┘
```

**Project Search (Overlay):**

```
┌─────────────────────────────┐
│ Projekt suchen              │
├─────────────────────────────┤
│ [🔍 Name oder Nummer...]    │
│                             │
│ Aktive Projekte             │
│ • P-2025-A001 Phoenix       │
│ • P-2025-B002 Hofladen Web  │
│ • P-2025-A003 CRM Migration │
│                             │
│ Favoriten                   │
│ • ADMIN - Administration    │
│ • MEETING - Meetings        │
│                             │
│ [Alle Projekte anzeigen]    │
└─────────────────────────────┘
```

**Calendar Integration View:**

```
┌─────────────────────────────┐
│ Aus Kalender importieren    │
├─────────────────────────────┤
│ Heute, 06.02.2025           │
│                             │
│ ☑ 09:00-09:30 Daily Standup │
│   → Projekt Phoenix         │
│                             │
│ ☑ 10:00-12:00 Development   │
│   → Projekt Phoenix         │
│                             │
│ ☐ 14:00-15:00 Kunde Müller  │
│   → Kein Projekt zugeordnet │
│                             │
│ [Ausgewählte importieren]   │
└─────────────────────────────┘
```

## Interaction Patterns
- **Smart defaults**: Today's date, last used project
- **Time calculator**: Auto-calc duration from start/end
- **Inline validation**: Min/max hours per day
- **Auto-save**: Every field change as draft
- **Keyboard navigation**: Tab through fields efficiently

## German Labels & Content
- **Zeiteintrag**: Time entry
- **Dauer**: Duration
- **Abrechenbar**: Billable
- **Überstunden**: Overtime
- **Tätigkeit**: Activity
- **Entwurf**: Draft
- **Beschreibung**: Description

## Validation Rules
- Date cannot be future
- Duration 0.25 - 24 hours
- Description minimum 10 characters
- Project required
- Cannot exceed 24h per day (total)
- Warning if > 10h single entry

## Activity Types
- Entwicklung (Development)
- Meeting
- Konzeption (Design/Planning)
- Testing/QA
- Documentation
- Support
- Administration
- Reise (Travel)

## Implementation Notes
```bash
# Time Input Methods
- Decimal hours: 2.5
- Hours:Minutes: 2:30
- Natural language: "2h 30min"
- Start/End times
- Duration picker

# Integrations
- Calendar sync (Google, Outlook)
- Project management system
- Timer widget data
- Billing system

# Smart Features
- Duplicate detection
- Gap detection (missing hours)
- Overtime calculation
- Project budget warnings
```

## Billable Logic
- Default from project settings
- Override per entry
- Non-billable categories:
  - Internal meetings
  - Administration
  - Training
- Billable rate from user role/project

## Analytics Events
- time_entry_created
- time_entry_method (manual/timer/calendar)
- bulk_entry_used
- template_used
- billable_percentage
- average_entry_duration

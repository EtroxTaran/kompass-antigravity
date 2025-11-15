# Expense List View - Figma Make Prompt

## Context & Purpose

- **Component Type**: List View with Approval Workflow
- **User Roles**: ADM (own expenses), INNEN/GF (all), BUCH (approve/export)
- **Usage Context**: View expense reports, track approval status, export for accounting
- **Business Value**: Expense oversight, fast reimbursement, accounting integration

## Design Requirements

### Visual Hierarchy

- **Status-based grouping**: Pending approval prominent
- **Photo thumbnails**: Quick receipt verification
- **Approval actions**: Clear approve/reject buttons
- **Export options**: Visible for BUCH role

### List Structure

- Filter by status, date, employee, category
- Sort by date, amount, status
- Bulk selection for approval/export
- Summary totals visible

### shadcn/ui Components

- Table, Card, Badge, Button, Filter
- Image preview in popover
- Checkbox for bulk selection
- Tabs for status views

## Figma Make Prompt

Create a comprehensive expense list view for KOMPASS that displays submitted expenses with approval workflow and accounting export capabilities.

**Desktop Layout (1440px):**

**Header Section:**

```
┌──────────────────────────────────────────────────────────────────┐
│ Ausgabenübersicht                                                │
│                                                                  │
│ [Alle] [Offen] [Genehmigt] [Abgelehnt]    [Filter ▼] [+ Ausgabe]│
└──────────────────────────────────────────────────────────────────┘
```

**Summary Cards:**

```
┌─────────────────┬─────────────────┬─────────────────┬──────────────┐
│ Offen           │ Diesen Monat    │ Ø Bearbeitungs- │ Export bereit│
│ €1.247,30       │ €3.856,42       │ zeit            │    23        │
│ 12 Belege       │ 47 Belege       │ 1,5 Tage        │ [DATEV Export]│
└─────────────────┴─────────────────┴─────────────────┴──────────────┘
```

**List View (Pending Approval - BUCH View):**

```
┌──────────────────────────────────────────────────────────────────┐
│ [□] Zur Genehmigung (12)                          [Alle auswählen]│
├──────────────────────────────────────────────────────────────────┤
│ □ [🖼️] Michael Schmidt      06.02.25    Verpflegung    €23,50   │
│      Mittagessen Hofladen Müller       München Nord Tour         │
│      [Beleg ansehen]                   [✓ Genehmigen] [✗ Ablehnen]│
│                                                                  │
│ □ [🖼️] Michael Schmidt      06.02.25    Benzin         €67,80   │
│      Tankstelle Esso A9                München Nord Tour         │
│      [Beleg ansehen]                   [✓ Genehmigen] [✗ Ablehnen]│
│                                                                  │
│ □ [🖼️] Anna Weber          05.02.25    Hotel         €125,00   │
│      Hotel Zur Post, Augsburg         2-Tages Projekttour       │
│      ⚠️ Über Tageslimit (€100)         [✓ Genehmigen] [✗ Ablehnen]│
│                                                                  │
│ ─────────────────────────────────────────────────────────────── │
│ Ausgewählt: 0                         [Ausgewählte genehmigen]   │
└──────────────────────────────────────────────────────────────────┘
```

**Employee View (ADM):**

```
┌──────────────────────────────────────────────────────────────────┐
│ Meine Ausgaben                                                   │
├──────────────────────────────────────────────────────────────────┤
│ Februar 2025                                         Gesamt: €247,30│
├──────────────────────────────────────────────────────────────────┤
│ [🖼️] 06.02. Mittagessen              €23,50    ✓ Genehmigt      │
│     Hofladen Müller                                              │
│                                                                  │
│ [🖼️] 06.02. Tankstelle               €67,80    ⏳ Ausstehend     │
│     Shell A9 Garching                                            │
│                                                                  │
│ [🖼️] 04.02. Parken Innenstadt        €12,00    ✓ Genehmigt      │
│     Parkhaus Marienplatz                                         │
│                                                                  │
│ [📄] 03.02. Kundenbewirtung         €156,00    ✗ Abgelehnt      │
│     Restaurant Augustiner             Fehlende Teilnehmerliste   │
│     [Bearbeiten und erneut einreichen]                          │
└──────────────────────────────────────────────────────────────────┘
```

**Mobile View (375px):**

```
┌─────────────────────────────┐
│ [☰] Ausgaben    [Filter] [+]│
├─────────────────────────────┤
│ Offen: €1.247,30 (12)       │
├─────────────────────────────┤
│ HEUTE                       │
│ ┌─────────────────────────┐ │
│ │ [🖼️] Mittagessen €23,50 │ │
│ │ M.Schmidt • 12:30       │ │
│ │ ⏳ Ausstehend            │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ [🖼️] Benzin     €67,80  │ │
│ │ M.Schmidt • 10:15       │ │
│ │ ⏳ Ausstehend            │ │
│ └─────────────────────────┘ │
│                             │
│ GESTERN                     │
│ ┌─────────────────────────┐ │
│ │ [🖼️] Hotel     €125,00  │ │
│ │ A.Weber • Augsburg      │ │
│ │ ⚠️ Über Limit            │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

**Receipt Preview (Popover - 400px):**

```
┌─────────────────────────────┐
│ Beleg                  [×] │
├─────────────────────────────┤
│                             │
│   [Receipt Image]           │
│                             │
│ Restaurant Augustiner       │
│ €156,00 • 03.02.2025       │
│                             │
│ Bewirtung mit:              │
│ - Maria Schmidt (Kunde)     │
│ - Thomas Weber (Kunde)      │
│                             │
│ Anlass: Vertragsverhandlung │
│                             │
│ [Vollbild] [Download]       │
└─────────────────────────────┘
```

**Filter Panel:**

```
┌─────────────────────────────┐
│ Filter                 [×] │
├─────────────────────────────┤
│ Zeitraum                    │
│ [Diesen Monat ▼]            │
│                             │
│ Mitarbeiter                 │
│ ☑ Alle                      │
│ ☐ Michael Schmidt           │
│ ☐ Anna Weber               │
│                             │
│ Kategorie                   │
│ ☑ Verpflegung              │
│ ☑ Reisekosten              │
│ ☑ Sonstige                 │
│                             │
│ Status                      │
│ ☑ Ausstehend               │
│ ☐ Genehmigt                │
│ ☐ Abgelehnt                │
│                             │
│ Betrag                      │
│ Von: [€ 0] Bis: [€ 500]    │
│                             │
│ [Zurücksetzen] [Anwenden]   │
└─────────────────────────────┘
```

**Bulk Actions (BUCH):**

```
┌─────────────────────────────────────┐
│ 3 Ausgaben ausgewählt (€216,30)     │
│                                     │
│ [✓ Alle genehmigen]                 │
│ [✗ Alle ablehnen]                   │
│ [📊 Als Report exportieren]          │
│ [Auswahl aufheben]                  │
└─────────────────────────────────────┘
```

**Export Dialog:**

```
┌─────────────────────────────┐
│ Ausgaben exportieren   [×] │
├─────────────────────────────┤
│ Format                      │
│ ○ DATEV (Standard)          │
│ ○ Excel (.xlsx)             │
│ ○ CSV                       │
│                             │
│ Zeitraum                    │
│ [Januar 2025 ▼]             │
│                             │
│ ☑ Nur genehmigte Ausgaben   │
│ ☑ Belege als ZIP anhängen   │
│                             │
│ [Abbrechen] [Exportieren]   │
└─────────────────────────────┘
```

**Status Badges:**

- ⏳ **Ausstehend** (blue): Pending approval
- ✓ **Genehmigt** (green): Approved
- ✗ **Abgelehnt** (red): Rejected
- 📝 **Entwurf** (gray): Draft
- ⚠️ **Warnung** (amber): Needs attention

## Interaction Patterns

- **Row click**: Expand to show details
- **Image click**: Preview receipt full screen
- **Swipe left**: Quick approve (mobile)
- **Swipe right**: Quick reject (mobile)
- **Bulk select**: Checkbox + action bar

## German Labels & Content

- **Genehmigen**: Approve
- **Ablehnen**: Reject
- **Ausstehend**: Pending
- **Beleg**: Receipt
- **Ausgaben**: Expenses
- **Zeitraum**: Period
- **Über Limit**: Over limit

## Accessibility Requirements

- Keyboard shortcuts for approve/reject
- Status announced by screen reader
- Image alt text describes receipt
- Focus management in dialogs
- High contrast mode support

## Mobile Considerations

- **Card layout**: Better than table on small screens
- **Swipe gestures**: Quick approve/reject
- **Bottom sheet**: Filters and bulk actions
- **Progressive loading**: Load more on scroll
- **Offline caching**: View previously loaded

## BUCH Role Features

- Approve/reject buttons visible
- Bulk approval capabilities
- Export to accounting software
- Override limit warnings
- Add accounting notes

## Implementation Notes

```bash
# State Management
- Filter/sort preferences
- Selected items for bulk
- Approval queue
- Export configuration

# Performance
- Virtual scrolling for large lists
- Lazy load receipt images
- Debounced search
- Optimistic updates

# Integrations
- DATEV export format
- Lexware compatibility
- Email notifications
- Push notifications (mobile)
```

## Analytics Events

- expense_approved / expense_rejected
- bulk_action_performed
- average_approval_time
- export_generated (format, count)
- receipt_preview_opened

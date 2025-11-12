# Calendar Export Dialog - Figma Make Prompt

**Component Type:** Specialized Dialog  
**User Roles:** All (GF, PLAN, INNEN, ADM, KALK, BUCH)  
**Usage:** Export calendar events to ICS format for Outlook, Google Calendar, Apple Calendar  
**Created:** 2025-01-28

---

## Context & Purpose

The Calendar Export Dialog allows users to export their calendar events (tasks, projects, opportunities) to an ICS file that can be imported into external calendar applications like Microsoft Outlook, Google Calendar, or Apple Calendar. The export includes customizable filters and date range selection.

**Key Features:**
- Date range selection (start/end dates)
- Event type filters (tasks, projects, opportunities)
- Status and priority filters
- Export scope (personal vs. team calendar for GF/PLAN)
- One-click ICS file download
- Preview event count before export
- Mobile-optimized bottom sheet variant

---

## Figma Make Prompt

**Copy everything below this line and paste into Figma Make:**

---

Create a **Calendar Export Dialog** for KOMPASS CRM that enables users to export calendar events to ICS format with customizable filters.

## Component Structure

### 1. Dialog Container

**Desktop:**
- **Width:** 560px
- **Height:** Auto (max 80vh)
- **Background:** White
- **Border-radius:** 12px
- **Shadow:** 0 20px 60px rgba(0,0,0,0.20)
- **Padding:** 24px
- **Position:** Center of screen (modal overlay)

**Mobile:**
- **Width:** 100%
- **Height:** Auto (max 90vh)
- **Border-radius:** 16px 16px 0 0 (bottom sheet style)
- **Shadow:** 0 -10px 40px rgba(0,0,0,0.15)
- **Padding:** 20px
- **Position:** Bottom of screen (slide up animation)

---

### 2. Dialog Header

#### Layout
- **Height:** 64px (desktop), 56px (mobile)
- **Border-bottom:** 1px solid gray-200
- **Padding-bottom:** 16px

#### Content
- **Title:**
  - Icon: Download icon (24px, blue-600)
  - Text: "Kalender exportieren" (20px, gray-900, bold)
  
- **Close Button:**
  - Position: Top-right
  - Icon: X (20px, gray-500)
  - Size: 32px × 32px
  - Style: Ghost button
  - Hover: gray-100 background

**Mobile Variant:**
- Add drag handle (top-center, gray-300, 40px × 4px rounded bar)

---

### 3. Dialog Body (Scrollable)

**Padding:** 20px 0

---

#### Section 1: Date Range Selection

**Section Label:**
- "Zeitraum auswählen" (14px, gray-700, bold)
- Info icon with tooltip: "Wählen Sie den Zeitraum für den Export (max. 90 Tage)"

**Date Inputs (Horizontal Layout):**
- **Start Date:**
  - Label: "Von" (12px, gray-600)
  - Input: Date picker button (shadcn Calendar component)
  - Placeholder: "TT.MM.JJJJ"
  - Width: 48% (desktop), 100% (mobile, stacked)
  - Icon: Calendar icon (16px, gray-400, left)
  
- **End Date:**
  - Label: "Bis" (12px, gray-600)
  - Input: Date picker button
  - Placeholder: "TT.MM.JJJJ"
  - Width: 48% (desktop), 100% (mobile, stacked)
  - Icon: Calendar icon (16px, gray-400, left)

**Quick Presets (Button Group):**
- Buttons: "Dieser Monat", "Nächste 30 Tage", "Nächste 90 Tage"
- Style: Ghost buttons, small size
- Selected: Blue-100 background, blue-600 text
- Margin-top: 8px

**Validation Message:**
- Show if date range > 90 days:
  - Icon: Alert-triangle (16px, amber-500)
  - Text: "Maximaler Zeitraum: 90 Tage" (12px, amber-600)
  - Background: amber-50
  - Padding: 8px 12px
  - Border-radius: 6px

**Spacing:** 24px margin-bottom

---

#### Section 2: Event Type Filters

**Section Label:**
- "Ereignistypen" (14px, gray-700, bold)
- Subtext: "Wählen Sie die Ereignistypen aus, die exportiert werden sollen" (12px, gray-500)

**Checkbox Group (Vertical Stack):**
- [ ] **Aufgaben** (UserTasks)
  - Checkbox: Blue (#3B82F6)
  - Color dot: Blue circle (8px diameter) next to label
  - Label: "Aufgaben" (14px, gray-900)
  - Count: "(15)" (12px, gray-500) - dynamic count
  
- [ ] **Projekt-Aufgaben** (ProjectTasks)
  - Checkbox: Green (#10B981)
  - Color dot: Green circle (8px)
  - Label: "Projekt-Aufgaben" (14px, gray-900)
  - Count: "(23)" (12px, gray-500)
  
- [ ] **Projekt-Fristen** (Project Deadlines)
  - Checkbox: Green (#10B981)
  - Color dot: Green circle (8px)
  - Label: "Projekt-Fristen" (14px, gray-900)
  - Count: "(8)" (12px, gray-500)
  
- [ ] **Opportunities** (Opportunity Close Dates)
  - Checkbox: Purple (#A855F7)
  - Color dot: Purple circle (8px)
  - Label: "Opportunities" (14px, gray-900)
  - Count: "(5)" (12px, gray-500)

**Checkbox Spacing:** 12px gap between items

**Select/Deselect All:**
- Link button: "Alle auswählen" / "Alle abwählen" (12px, blue-600)
- Position: Below checkboxes
- Toggle behavior

**Spacing:** 24px margin-bottom

---

#### Section 3: Additional Filters (Collapsible)

**Accordion Header:**
- Label: "Erweiterte Filter" (14px, gray-700, medium)
- Icon: ChevronDown (16px, gray-500) - rotates when expanded
- Hover: gray-50 background
- Padding: 12px
- Border-radius: 6px

**Expanded Content:**

**Status Filter (Multi-select):**
- Label: "Status" (12px, gray-600)
- Checkboxes (horizontal, wrap on mobile):
  - [ ] Offen
  - [ ] In Bearbeitung
  - [ ] Abgeschlossen
  - [ ] Überfällig

**Priority Filter (Multi-select):**
- Label: "Priorität" (12px, gray-600)
- Checkboxes (horizontal, wrap on mobile):
  - [ ] Niedrig
  - [ ] Mittel
  - [ ] Hoch
  - [ ] Dringend

**Assigned To Filter (RBAC-dependent):**
- Label: "Zugewiesen an" (12px, gray-600)
- Dropdown: User select (shadcn Select component)
- Default: "Alle"
- Options: User list (GF/PLAN see all users, ADM sees only self)

**Spacing:** 20px margin-bottom

---

#### Section 4: Export Scope (GF/PLAN Only)

**Visible only for GF and PLAN roles**

**Radio Group:**
- ( ) **Mein Kalender**
  - Label: "Mein Kalender" (14px, gray-900)
  - Subtext: "Nur meine Aufgaben und zugewiesene Projekte" (12px, gray-500)
  
- ( ) **Team-Kalender**
  - Label: "Team-Kalender" (14px, gray-900)
  - Subtext: "Alle Ereignisse des gesamten Teams" (12px, gray-500)
  - Badge: "GF/PLAN" (amber-600 text, amber-100 background)

**Default Selection:** "Mein Kalender"

**Spacing:** 24px margin-bottom

---

#### Section 5: Export Preview

**Summary Card:**
- **Background:** blue-50
- **Border:** 1px solid blue-200
- **Border-radius:** 8px
- **Padding:** 16px

**Content:**
- **Icon:** Info icon (20px, blue-600)
- **Title:** "Export-Vorschau" (14px, gray-900, bold)
- **Event Count:**
  - Text: "**45 Ereignisse** werden exportiert" (14px, gray-700)
  - Dynamic count based on filters
- **Date Range:**
  - Text: "Zeitraum: 01.02.2025 - 28.02.2025" (12px, gray-600)
- **File Size Estimate:**
  - Text: "Geschätzte Dateigröße: ~12 KB" (12px, gray-500)

**No Events Warning:**
- If event count = 0:
  - Background: amber-50
  - Border: amber-200
  - Icon: Alert-triangle (20px, amber-500)
  - Text: "Keine Ereignisse im ausgewählten Zeitraum. Bitte passen Sie die Filter an." (14px, amber-700)

---

### 4. Dialog Footer

**Background:** white  
**Border-top:** 1px solid gray-200  
**Padding-top:** 16px  
**Margin-top:** 24px

**Button Layout (Horizontal, right-aligned):**
- **Cancel Button:**
  - Style: Ghost button
  - Label: "Abbrechen" (14px)
  - Width: Auto
  - Keyboard shortcut: Escape key
  
- **Export Button:**
  - Style: Primary button (blue-600 background)
  - Icon: Download icon (16px, white, left)
  - Label: "ICS-Datei herunterladen" (14px, white)
  - Width: Auto (min 200px)
  - Disabled state: gray-300 background, no pointer events (if event count = 0)
  - Loading state: Spinner + "Exportiere..." text

**Mobile Footer:**
- Button width: 100% (stacked vertically)
- Cancel button first (full-width, ghost)
- Export button second (full-width, primary)
- Gap: 12px

---

### 5. Export Success Toast

**Trigger:** After successful ICS file download

**Toast Structure:**
- **Background:** green-50
- **Border:** 1px solid green-200
- **Border-radius:** 8px
- **Padding:** 12px 16px
- **Shadow:** 0 4px 12px rgba(0,0,0,0.10)
- **Position:** Top-right (desktop), top-center (mobile)
- **Duration:** 5 seconds (auto-dismiss)

**Content:**
- **Icon:** CheckCircle (20px, green-600)
- **Title:** "Export erfolgreich" (14px, gray-900, bold)
- **Message:** "Kalender wurde als ICS-Datei heruntergeladen." (12px, gray-600)
- **Sub-message:** "Sie können die Datei jetzt in Outlook, Google Calendar oder Apple Calendar importieren." (11px, gray-500)
- **Close Button:** X icon (16px, gray-500, top-right)

---

### 6. Export Error Toast

**Trigger:** If export fails

**Toast Structure:**
- **Background:** red-50
- **Border:** 1px solid red-200
- **Border-radius:** 8px
- **Padding:** 12px 16px
- **Shadow:** 0 4px 12px rgba(0,0,0,0.10)

**Content:**
- **Icon:** XCircle (20px, red-600)
- **Title:** "Export fehlgeschlagen" (14px, gray-900, bold)
- **Message:** "Die Kalenderdatei konnte nicht erstellt werden. Bitte versuchen Sie es erneut." (12px, gray-600)
- **Retry Button:** "Erneut versuchen" (ghost button, 12px)

---

### 7. Loading State

**During Export Generation:**
- **Overlay:** Semi-transparent gray (50% opacity) over dialog body
- **Spinner:** Blue spinner (40px diameter, center of dialog)
- **Text:** "Exportiere Kalenderdaten..." (14px, gray-700, below spinner)
- **Progress Text:** "45 von 45 Ereignissen verarbeitet" (12px, gray-500)

**Disable all form inputs during loading**

---

### 8. Mobile Adaptations (< 768px)

#### Bottom Sheet Variant
- Slide up from bottom (not center modal)
- Add drag handle at top
- Snap to 90% screen height
- Swipe down to close

#### Form Layout Changes
- Date inputs: Stack vertically (100% width each)
- Checkbox groups: Full-width, larger touch targets (48px height)
- Buttons: Full-width, stacked vertically

#### Quick Presets
- Display as horizontal scroll (pill buttons)
- No wrapping

---

### 9. Accessibility (WCAG 2.1 AA)

#### Keyboard Navigation
- Tab order: Close button → Date inputs → Quick presets → Checkboxes → Additional filters → Export scope → Cancel → Export
- Enter on Export button: Trigger export
- Escape: Close dialog

#### Screen Reader Support
- Dialog: `<div role="dialog" aria-labelledby="export-title" aria-describedby="export-description">`
- Title: `<h2 id="export-title">Kalender exportieren</h2>`
- Description: `<p id="export-description">Wählen Sie den Zeitraum und die Ereignistypen für den Export</p>`
- Checkboxes: `<input type="checkbox" aria-label="Aufgaben exportieren (15 Ereignisse)">`
- Event count: `<span aria-live="polite">{count} Ereignisse werden exportiert</span>`

#### Focus Management
- Initial focus: First date input
- Focus trap: Within dialog
- Return focus: To export button that opened dialog

#### Color Contrast
- All text: 4.5:1 contrast ratio minimum
- Color dots + labels (not color alone)
- Disabled state: 3:1 contrast ratio

---

### 10. Design Tokens

**Typography:**
- Dialog title: 20px, bold (700)
- Section labels: 14px, bold (700)
- Form labels: 12px, medium (500)
- Body text: 14px, regular (400)
- Helper text: 12px, regular (400)

**Spacing:**
- Dialog padding: 24px (desktop), 20px (mobile)
- Section spacing: 24px
- Form field spacing: 16px
- Checkbox group gap: 12px

**Colors:**
- Primary (Export): Blue-600 (#2563EB)
- Success: Green-600 (#16A34A)
- Warning: Amber-600 (#D97706)
- Error: Red-600 (#DC2626)
- Event type colors: As defined in calendar-view.md

**Border Radius:**
- Dialog: 12px
- Inputs: 8px
- Buttons: 8px
- Cards: 8px

**Shadows:**
- Dialog: 0 20px 60px rgba(0,0,0,0.20)
- Toast: 0 4px 12px rgba(0,0,0,0.10)

---

## Design Requirements

### Visual Hierarchy
1. **Primary:** Export button, event count preview
2. **Secondary:** Date inputs, event type checkboxes
3. **Tertiary:** Additional filters, helper text

### Interaction States
- **Default:** Standard colors, enabled inputs
- **Hover:** Button backgrounds lighten, checkbox borders darken
- **Focus:** Blue outline (2px, blue-500)
- **Disabled:** Gray-300 background, 50% opacity, no pointer events
- **Loading:** Spinner animation, disabled inputs

### Form Validation
- **Date Range:** Must be ≤ 90 days
- **At Least One Type:** At least one event type must be selected
- **Valid Dates:** End date ≥ start date
- Real-time validation (show errors immediately)

---

## Implementation Notes

### shadcn/ui Components
```bash
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add select
npx shadcn-ui@latest add button
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add accordion
```

### Export Flow
```typescript
const handleExport = async () => {
  setIsLoading(true);
  
  try {
    const filters = {
      startDate: selectedStartDate,
      endDate: selectedEndDate,
      types: selectedEventTypes,
      status: selectedStatuses,
      priority: selectedPriorities,
      scope: exportScope, // 'personal' or 'team'
    };
    
    const response = await fetch('/api/v1/calendar/export/ics', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      // Convert filters to query params
    });
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kompass-calendar-${format(new Date(), 'yyyy-MM-dd')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: 'Export erfolgreich',
      description: 'Kalender wurde als ICS-Datei heruntergeladen.',
      variant: 'success',
    });
    
    onClose();
  } catch (error) {
    toast({
      title: 'Export fehlgeschlagen',
      description: 'Bitte versuchen Sie es erneut.',
      variant: 'destructive',
    });
  } finally {
    setIsLoading(false);
  }
};
```

### Event Count Calculation
```typescript
const calculateEventCount = useCallback(() => {
  const filtered = events.filter(event => {
    // Date range check
    const inRange = event.startDate >= startDate && event.startDate <= endDate;
    
    // Event type check
    const typeMatch = selectedEventTypes.includes(event.type);
    
    // Status check (if filters applied)
    const statusMatch = selectedStatuses.length === 0 || 
                        selectedStatuses.includes(event.status);
    
    // Priority check (if filters applied)
    const priorityMatch = selectedPriorities.length === 0 || 
                          selectedPriorities.includes(event.priority);
    
    return inRange && typeMatch && statusMatch && priorityMatch;
  });
  
  return filtered.length;
}, [events, startDate, endDate, selectedEventTypes, selectedStatuses, selectedPriorities]);
```

### German Date Formatting
```typescript
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const formattedDate = format(date, 'dd.MM.yyyy', { locale: de });
const formattedDateRange = `${format(startDate, 'dd.MM.yyyy')} - ${format(endDate, 'dd.MM.yyyy')}`;
```

---

## Business Rules

**BR-001: Maximum Date Range**
- Users can export maximum 90 days at once
- Show validation error if range exceeds 90 days
- Suggest using narrower date range

**BR-002: Minimum Event Type Selection**
- At least one event type must be selected
- Export button disabled if no types selected
- Show hint: "Bitte wählen Sie mindestens einen Ereignistyp"

**BR-003: RBAC Export Scope**
- ADM: Can only export "Mein Kalender" (own events)
- PLAN/GF: Can export "Mein Kalender" or "Team-Kalender"
- Export scope option hidden for ADM/KALK/BUCH/INNEN

**BR-004: Event Count Limits**
- Maximum 1000 events per export
- If exceeded, show warning and suggest narrowing filters
- Option to export first 1000 events (sorted by date)

**BR-005: ICS File Naming**
- Format: `kompass-calendar-{current-date}.ics`
- Example: `kompass-calendar-2025-01-28.ics`
- UTF-8 encoding

---

## Performance Considerations

### Event Count Calculation
- Debounce filter changes (300ms)
- Calculate count in Web Worker (if >1000 events)
- Cache counts for same filter combinations

### Export Generation
- Stream large exports to avoid memory issues
- Show progress indicator for >500 events
- Cancel export option for long-running exports

---

## Related Components

- **Calendar View Component:** Source of events to export
- **Date Picker:** Date range selection
- **Toast Notification:** Success/error feedback
- **Filter Panel:** Similar filter UI pattern

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-01-28 | Initial calendar export dialog specification for MVP |

---

**END OF PROMPT**



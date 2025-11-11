# Dialogs & Modals - Figma Make Prompt

## Context & Purpose
- **Component Type**: Modal Dialogs and Sheets
- **User Roles**: All (GF, PLAN, ADM, KALK, BUCH)
- **Usage Context**: Forms, confirmations, alerts, detail views
- **Business Value**: Focused user interactions without navigation, contextual information display

## Design Requirements

### Visual Hierarchy
- **Overlay**: Semi-transparent backdrop blocking main content
- **Dialog Container**: Centered modal with clear boundaries
- **Header**: Title and close button
- **Content**: Scrollable body area
- **Footer**: Action buttons (primary + secondary)

### Layout Structure
- Overlay: Full-screen, semi-transparent black (50% opacity)
- Dialog widths: Small (400px), Medium (600px), Large (800px), Full-screen (mobile)
- Max-height: 90vh with vertical scroll
- Border-radius: 12px
- Shadow: Heavy elevation (0px 8px 24px rgba(0,0,0,0.15))

### shadcn/ui Components
- `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`
- `AlertDialog` for confirmations
- `Sheet` for slide-in panels

## Figma Make Prompt

Create comprehensive dialog and modal components for KOMPASS, a German CRM application. Design various dialog types for forms, confirmations, alerts, and detail views with German labels.

**Standard Dialog (Form Modal):**

**Structure:**
1. **Overlay**: Full-screen, rgba(0,0,0,0.5), blur effect (optional)
2. **Dialog Container**:
   - Width: 600px (medium), centered on screen
   - Background: White
   - Border-radius: 12px
   - Shadow: 0px 8px 24px rgba(0,0,0,0.15)
   - Padding: 0 (sections have their own padding)

3. **Header** (border-bottom 1px solid #e5e7eb):
   - Padding: 24px
   - Title: 20px, bold, #1f2937, "Kunde bearbeiten"
   - Description (optional): 14px, gray, "Ändern Sie die Kundendaten"
   - Close button: Top-right, "×" (24px), gray, hover dark gray

4. **Content** (scrollable):
   - Padding: 24px
   - Max-height: calc(90vh - 180px)
   - Overflow-y: auto
   - Content: Form fields, text, lists, etc.

5. **Footer** (border-top 1px solid #e5e7eb):
   - Padding: 24px
   - Button group right-aligned:
     - Secondary: "Abbrechen" (outlined)
     - Primary: "Speichern" (blue)
   - Gap: 12px between buttons

**Dialog Sizes:**

1. **Small (400px):**
   - Use for: Simple confirmations, quick forms
   - Example: "E-Mail senden" dialog

2. **Medium (600px):**
   - Use for: Standard forms, most dialogs
   - Example: "Kunde bearbeiten" dialog

3. **Large (800px):**
   - Use for: Complex forms, multi-step wizards
   - Example: "Projekt erstellen" dialog with tabs

4. **Extra Large (1000px):**
   - Use for: Data comparisons, detailed views
   - Example: "Konfliktauflösung" dialog showing local vs server changes

5. **Full-screen (Mobile):**
   - On mobile: Dialog takes full screen
   - Header with back arrow instead of close "×"
   - Footer sticks to bottom

**Alert Dialog (Confirmation):**

**Destructive Confirmation:**
- Width: 400px
- Icon: Alert triangle (64px, red) at top
- Title: "Kunde löschen?" (20px, bold, centered)
- Description: "Sind Sie sicher, dass Sie 'Hofladen Müller GmbH' löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden." (14px, gray, centered)
- Buttons (centered):
  - Secondary: "Abbrechen" (outlined)
  - Destructive: "Löschen" (red)

**Success Confirmation:**
- Icon: Check circle (64px, green)
- Title: "Kunde erfolgreich gespeichert"
- Description: "Die Kundendaten wurden aktualisiert."
- Button: "OK" (primary blue, centered)

**Warning Dialog:**
- Icon: Alert triangle (64px, amber)
- Title: "Ungespeicherte Änderungen"
- Description: "Sie haben ungespeicherte Änderungen. Möchten Sie die Änderungen speichern, bevor Sie fortfahren?"
- Buttons:
  - Tertiary: "Verwerfen" (text link)
  - Secondary: "Abbrechen"
  - Primary: "Speichern"

**Sheet (Slide-in Panel):**

**Right Sheet (Sidebar Panel):**
- Slides in from right
- Width: 480px (desktop), 90% (mobile)
- Full height
- Shadow: -4px 0px 16px rgba(0,0,0,0.1) (left shadow)
- Use for: Detail views, additional info, filters
- Header: Title + close "×"
- Content: Scrollable
- Footer: Optional actions

**Bottom Sheet (Mobile):**
- Slides up from bottom
- Height: Auto (content-based), max 80vh
- Border-radius: 20px 20px 0 0
- Drag handle: Gray bar (40px wide, 4px height) at top
- Use for: Mobile actions, forms, selections
- Swipe down to close

**Filter Sheet Example:**
- Title: "Filter"
- Content:
  - Status filter: Checkboxes "Aktiv", "Inaktiv"
  - Date range: From/To date pickers
  - Location: Dropdown select
  - Rating: Radio buttons A/B/C
- Footer:
  - "Filter zurücksetzen" (text link, left)
  - "Anwenden" (primary blue, right)

**Multi-Step Dialog (Wizard):**
- Progress indicator at top: Step 1 of 3 (dots or numbers)
- Steps: "Grunddaten" → "Adresse" → "Zusammenfassung"
- Content changes per step
- Footer:
  - "Zurück" (secondary, left-aligned)
  - "Weiter" / "Abschließen" (primary, right-aligned)

**Dialog with Tabs:**
- Tab navigation below header, above content
- Example: "Kundendetails" dialog
- Tabs: "Info", "Standorte", "Kontakte", "Aktivitäten"
- Tab content scrollable independently
- Single footer for all tabs

**Nested Dialogs:**
- Second dialog opens on top of first
- Darker overlay (60% opacity) for second dialog
- Higher z-index
- Example: "Kunde bearbeiten" → "Standort hinzufügen" (nested)

**Scrollable Content Indicators:**
- Top: Gradient fade when content scrollable above
- Bottom: Gradient fade when content scrollable below
- Scroll shadows for depth perception

**Loading Dialog:**
- Width: 300px
- Content: Spinner (48px) + "Wird verarbeitet..." text
- No footer, no close button
- Auto-closes when operation completes

**Dialog Animations:**
- Overlay: Fade in (200ms)
- Dialog: Scale up from 0.95 to 1.0 + fade in (300ms, ease-out)
- Sheet: Slide in from direction (300ms, ease-out)
- Close: Reverse animation (200ms)

Design in light mode with professional aesthetic. Ensure keyboard navigation works (Tab, Escape to close).

## Interaction Patterns

### Opening Dialog
1. User triggers action (button click)
2. Overlay fades in
3. Dialog scales up and fades in
4. Focus moves to first interactive element (or close button)
5. Background content becomes inert (no interaction)

### Closing Dialog
- Click close "×" button
- Click overlay backdrop (optional, configurable)
- Press Escape key
- Complete action (e.g., save and close)
- Animation reverses
- Focus returns to trigger element

### Keyboard Navigation
- Tab: Move through dialog elements
- Shift+Tab: Move backward
- Escape: Close dialog
- Enter: Activate focused button
- Arrow keys: Navigate radio/checkboxes (if focused)

### Focus Management
- Focus trapped within dialog (can't tab out to background)
- Focus moves to first focusable element on open
- Focus returns to trigger element on close
- Close button always reachable via Tab

### States
- **Open**: Visible, overlay active, content interactive
- **Closed**: Not rendered in DOM
- **Loading**: Content loading, spinner shown, buttons disabled
- **Submitting**: Form submitting, buttons disabled, loading indicator

## German Labels & Content

### Dialog Titles
- **[X] bearbeiten**: Edit [X]
- **Neuer [X]**: New [X]
- **[X] löschen?**: Delete [X]?
- **Bestätigung**: Confirmation
- **Achtung**: Warning
- **Fehler**: Error
- **Erfolg**: Success
- **Details**: Details
- **Filter**: Filters
- **Einstellungen**: Settings

### Dialog Actions
- **Speichern**: Save
- **Abbrechen**: Cancel
- **Schließen**: Close
- **Löschen**: Delete
- **Bestätigen**: Confirm
- **Weiter**: Next
- **Zurück**: Back
- **Abschließen**: Complete
- **Anwenden**: Apply
- **Verwerfen**: Discard

### Dialog Messages
- **Sind Sie sicher?**: Are you sure?
- **Diese Aktion kann nicht rückgängig gemacht werden**: This action cannot be undone
- **Ungespeicherte Änderungen**: Unsaved changes
- **Erfolgreich gespeichert**: Successfully saved
- **Wird verarbeitet...**: Processing...

## Accessibility Requirements
- WCAG 2.1 AA compliance
- Dialog has role="dialog" or role="alertdialog"
- Title has id referenced by aria-labelledby
- Description has id referenced by aria-describedby
- aria-modal="true" on dialog container
- Focus trapped within dialog
- Escape key closes dialog
- Close button has aria-label="Dialog schließen"
- Background content marked inert or aria-hidden="true"
- Focus returns to trigger on close

## Mobile Considerations
- Full-screen dialogs on mobile (<640px)
- Header with back arrow (not "×") on mobile
- Footer buttons stack vertically if needed
- Bottom sheets for mobile-specific interactions
- Swipe down to close bottom sheets
- Larger close button (48x48px) for touch
- Adequate padding for touch interaction

## Example Data

**Edit Customer Dialog:**
- Title: "Kunde bearbeiten"
- Description: "Ändern Sie die Kundendaten"
- Form fields: Company name, VAT, Email, Phone
- Buttons: "Abbrechen", "Speichern"

**Delete Confirmation:**
- Icon: Red alert triangle
- Title: "Kunde löschen?"
- Description: "Sind Sie sicher, dass Sie 'Hofladen Müller GmbH' löschen möchten?"
- Buttons: "Abbrechen", "Löschen"

**Filter Sheet:**
- Title: "Filter"
- Filters: Status (Aktiv/Inaktiv), Date range, Location, Rating
- Buttons: "Filter zurücksetzen", "Anwenden"

## Implementation Notes

### shadcn/ui Installation
```bash
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add alert-dialog
npx shadcn-ui@latest add sheet
```

### Basic Dialog
```typescript
<Dialog>
  <DialogTrigger asChild>
    <Button>Kunde bearbeiten</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Kunde bearbeiten</DialogTitle>
      <DialogDescription>
        Ändern Sie die Kundendaten
      </DialogDescription>
    </DialogHeader>
    {/* Form content */}
    <DialogFooter>
      <Button variant="outline">Abbrechen</Button>
      <Button>Speichern</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Alert Dialog
```typescript
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Löschen</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Kunde löschen?</AlertDialogTitle>
      <AlertDialogDescription>
        Diese Aktion kann nicht rückgängig gemacht werden.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Abbrechen</AlertDialogCancel>
      <AlertDialogAction>Löschen</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Sheet
```typescript
<Sheet>
  <SheetTrigger>Filter</SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Filter</SheetTitle>
    </SheetHeader>
    {/* Filter content */}
    <SheetFooter>
      <Button>Anwenden</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

### Component Dependencies
- Design tokens (colors, spacing, shadows)
- Icons from lucide-react (X, AlertTriangle, CheckCircle)
- Button component for actions
- Form components for dialog content
- Focus trap utility for accessibility

### State Management
- Dialog open/close state
- Form data in dialog
- Loading/submitting states
- Multi-step wizard progress
- Filter state in filter sheet


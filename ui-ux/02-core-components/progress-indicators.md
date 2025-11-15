# Progress Indicators - Figma Make Prompt

## Context & Purpose

- **Component Type**: Progress Bars, Spinners, and Loading Indicators
- **User Roles**: All (GF, PLAN, ADM, KALK, BUCH)
- **Usage Context**: Loading states, multi-step processes, file uploads, bulk operations
- **Business Value**: Provides visual feedback on operation progress, reducing user uncertainty

## Design Requirements

### Visual Hierarchy

- **Determinate Progress**: Shows % complete with bar fill
- **Indeterminate Progress**: Shows activity without specific progress
- **Spinners**: Circular rotating indicators
- **Step Indicators**: Multi-step process progress

### Layout Structure

- Progress bar: Full width or fixed, 8-12px height
- Spinner: 16px (small), 24px (medium), 48px (large)
- Step indicator: Horizontal or vertical, 40px per step
- Labels: Above or beside progress, 14px font

### shadcn/ui Components

- `Progress` for progress bars
- Custom spinner component
- `Stepper` (or custom) for multi-step

## Figma Make Prompt

Create comprehensive progress indicator components for KOMPASS, a German CRM application. Design progress bars, spinners, step indicators, and loading states for various operations with German labels.

**Linear Progress Bar (Determinate):**

**Bar Structure:**

- Container: Full width or fixed (e.g., 400px)
- Height: 8px (compact) or 12px (default)
- Border-radius: 999px (pill shape) or 4px (standard)
- Background: Light gray (#e5e7eb)

**Fill:**

- Background: Blue (#3b82f6) gradient or solid
- Height: Matches container
- Border-radius: Matches container
- Width: 0-100% based on progress
- Transition: Smooth (300ms) as progress updates

**With Label:**

- Position: Above bar (center or left)
- Text: "Wird hochgeladen... 45%" (14px, semibold, #1f2937)
- Or: "127 von 500 Kunden importiert (25%)"

**With Secondary Text:**

- Below bar: "Geschätzte verbleibende Zeit: 2 Minuten" (12px, gray)
- Or: File name "customers.csv" + "2.5 MB von 10 MB"

**States:**

1. **Initial (0%)**: Empty bar, gray background
2. **In Progress (1-99%)**: Blue fill animates from left to right
3. **Complete (100%)**: Full blue fill, optional checkmark icon
   - Optional: Green color on completion
   - Shows: "Abgeschlossen" or "Erfolgreich"
4. **Error**: Red fill color (#ef4444), alert icon
   - Shows: "Fehler beim Hochladen"

**Size Variants:**

- Small: 6px height, compact label (12px)
- Medium: 8px height, standard label (14px)
- Large: 12px height, prominent label (16px)

**Linear Progress Bar (Indeterminate):**

- Same bar structure as determinate
- Fill: Animated blue segment (30% width) moving left to right
- Animation: Continuous loop, 2-second duration
- No percentage shown
- Label: "Wird verarbeitet..." (no %)

**Circular Progress (Determinate):**

**Circle:**

- Diameter: 48px (small: 32px, large: 64px)
- Stroke width: 4px
- Background ring: Light gray (#e5e7eb)
- Progress arc: Blue (#3b82f6), clockwise from top
- Center text: Percentage "45%" (16px, semibold)

**States:**

- 0%: Empty ring
- 1-99%: Blue arc grows clockwise
- 100%: Full circle, checkmark icon in center (optional)

**Usage:**

- Button loading: Small (24px) circle replacing button icon
- Card loading: Medium (48px) centered in card
- Full-page loading: Large (64px) centered on page

**Spinner (Indeterminate):**

**Icon Spinner:**

- Icon: Loader2 from lucide-react
- Size: 16px (small), 24px (medium), 48px (large)
- Color: Blue (#3b82f6) or gray (#6b7280)
- Animation: 360° rotation, 1-second duration, linear
- Use for: Button loading, inline loading

**Dots Spinner:**

- 3 dots in a row
- Each dot: 8px diameter
- Gap: 4px between dots
- Animation: Dots pulse/bounce in sequence
- Color: Gray (#6b7280)
- Use for: Subtle loading states

**Ring Spinner:**

- Circle with rotating segment
- Diameter: 24px (default)
- Stroke: 2px, gray with blue rotating segment
- Animation: 360° rotation, 1-second duration
- Use for: Cards, general loading

**Multi-Step Progress Indicator:**

**Horizontal Stepper:**

- Layout: Horizontal line connecting steps
- Step count: 3-5 steps typical
- Total width: 400-600px

**Step Elements:**

1. **Step Circle:**
   - Diameter: 40px
   - Border: 2px solid
   - States:
     - Completed: Blue background, white checkmark, blue border
     - Active: Blue border, white background, blue number
     - Upcoming: Gray border, white background, gray number
   - Number: 16px, centered (e.g., "1", "2", "3")

2. **Connecting Line:**
   - Height: 2px
   - Width: Flexible (fills space between steps)
   - Color: Blue (completed), gray (upcoming)

3. **Step Label:**
   - Below circle: Step name "Grunddaten", "Adresse", "Zusammenfassung"
   - Font: 14px
   - Color: Blue (active), gray (inactive)
   - Optional description: 12px gray text below label

**Example:**
Step 1 (✓ completed) --- Step 2 (active, "2") --- Step 3 (upcoming, "3")
Grunddaten Adresse Zusammenfassung

**Vertical Stepper:**

- Same structure but vertical layout
- Step circles aligned left
- Connecting line: Vertical, between circles
- Labels: Right of circles
- Use for: Sidebar or narrow layouts

**File Upload Progress:**

**Single File:**

- File name: "customers.csv" (14px, semibold)
- Progress bar: Full width
- Status: "2.5 MB von 10 MB (25%)"
- Actions: "Abbrechen" button (cancel upload)

**Multiple Files:**

- List of files, each with:
  - File icon + name
  - Individual progress bar
  - Status: Complete (checkmark), uploading (%), error (X)
- Overall progress: "3 von 5 Dateien hochgeladen"

**Skeleton Loading (Content Placeholder):**

- Animated gray rectangles matching content layout
- Shimmer effect: Light gray to lighter gray gradient moving left-to-right
- Use for: Cards, tables, forms during initial load
- Animation: 2-second loop, continuous

**Bulk Operation Progress:**

- Modal or toast with progress
- Title: "Kunden werden importiert..."
- Progress bar: Linear, full width
- Details: "127 von 500 Kunden importiert (25%)"
- Time estimate: "Geschätzte verbleibende Zeit: 2 Minuten"
- Actions: "Abbrechen" button
- Completion: Auto-close or show success message

**Sync Progress Indicator:**

- Small circular progress in top bar
- Icon: CloudSync with circular progress around it
- States:
  - Syncing: Blue rotating arc + "3 Änderungen"
  - Complete: Green checkmark + "Synchronisiert"
  - Error: Red X + "Fehler"
- Click: Opens popover with details

**Project Progress Card:**

- Card showing project completion
- Header: Project name + status badge
- Circular progress: 65% complete (large circle)
- Milestones: 3 of 5 completed (text or mini progress)
- Color: Changes from blue (0-70%) to green (70-100%)

**Animation Guidelines:**

- Progress updates: Smooth transition (300ms)
- Spinner rotation: Linear, 1-second loop
- Shimmer: Linear gradient, 2-second loop
- Step transitions: Fade + scale (200ms)

Design with clear visual feedback and German labels for all states.

## Interaction Patterns

### Determinate Progress

1. Operation starts (upload, import, etc.)
2. Progress bar appears at 0%
3. Progress updates periodically (e.g., every 500ms)
4. Bar fill animates smoothly
5. Percentage label updates
6. At 100%: Shows completion state (green, checkmark)
7. Auto-dismisses or requires user action

### Indeterminate Progress

1. Operation starts (unknown duration)
2. Spinner or indeterminate bar appears
3. Animates continuously
4. Operation completes
5. Spinner disappears
6. Success/error message shown

### Multi-Step

1. User starts multi-step process
2. Stepper shows all steps, current active
3. User completes step, clicks "Weiter"
4. Current step marked complete (checkmark)
5. Next step becomes active
6. Repeat until all steps complete
7. Final step: "Abschließen" button

## German Labels & Content

### Progress Labels

- **Wird hochgeladen...**: Uploading...
- **Wird verarbeitet...**: Processing...
- **Wird importiert...**: Importing...
- **Wird gespeichert...**: Saving...
- **Wird geladen...**: Loading...

### Status Text

- **X von Y abgeschlossen**: X of Y completed
- **X%**: X% (percentage)
- **Abgeschlossen**: Completed
- **Erfolgreich**: Successful
- **Fehler**: Error
- **Abbrechen**: Cancel

### Time Estimates

- **Geschätzte verbleibende Zeit**: Estimated time remaining
- **X Minuten**: X minutes
- **X Sekunden**: X seconds
- **Wenige Sekunden**: Few seconds

### Step Labels

- **Schritt X von Y**: Step X of Y
- **Grunddaten**: Basic data
- **Adresse**: Address
- **Zusammenfassung**: Summary
- **Weiter**: Next
- **Zurück**: Back
- **Abschließen**: Complete

## Accessibility Requirements

- WCAG 2.1 AA compliance
- Progress bar: role="progressbar", aria-valuenow, aria-valuemin="0", aria-valuemax="100"
- Indeterminate: aria-busy="true", no aria-valuenow
- Screen reader announces progress updates
- Live regions: aria-live="polite" for progress updates
- Spinner: aria-label="Wird geladen"
- Visual + text: Not color-only indicators

## Mobile Considerations

- Full-width progress bars on mobile
- Larger spinner sizes (32px minimum)
- Step indicator: Horizontal scroll or vertical layout
- Bottom sheet for bulk operation progress
- Touch-friendly cancel button (48px)

## Example Data

**File Upload:**

- File: "customers.csv"
- Progress: 45%
- Status: "2.5 MB von 10 MB"
- Time: "Noch 30 Sekunden"

**Bulk Import:**

- Operation: "Kunden werden importiert..."
- Progress: 25%
- Status: "127 von 500 Kunden importiert"
- Time: "Geschätzte verbleibende Zeit: 2 Minuten"

**Multi-Step Form:**

- Step 1: "Grunddaten" (completed, checkmark)
- Step 2: "Adresse" (active, "2")
- Step 3: "Zusammenfassung" (upcoming, "3")

## Implementation Notes

### shadcn/ui Installation

```bash
npx shadcn-ui@latest add progress
```

### Progress Bar Usage

```typescript
<div className="space-y-2">
  <div className="flex justify-between text-sm">
    <span>Wird hochgeladen...</span>
    <span>45%</span>
  </div>
  <Progress value={45} />
</div>
```

### Spinner Usage

```typescript
import { Loader2 } from 'lucide-react';

<Loader2 className="h-6 w-6 animate-spin text-primary" />
```

### Component Dependencies

- Design tokens (colors, animations)
- Icons from lucide-react (Loader2, Check, X, CloudSync)
- Animation utilities from Tailwind CSS
- Progress state from operation (upload, import, etc.)

### State Management

- Progress value: Number (0-100)
- Loading state: Boolean
- Current step: Number (multi-step)
- Time estimate: Calculated from progress rate
- Status: 'loading' | 'success' | 'error'

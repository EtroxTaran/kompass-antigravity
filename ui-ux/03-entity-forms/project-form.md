# Project Form - Figma Make Prompt

## Context & Purpose

- **Component Type**: Entity Creation/Edit Form
- **User Roles**: GF (full), PLAN (full), ADM (limited read), KALK (cost data only)
- **Usage Context**: Convert won opportunity to project or create standalone project
- **Business Value**: Project initiation with budget, timeline, and resource planning

## Design Requirements

### Visual Hierarchy

- **Project Number**: GoBD-compliant auto-generated (P-YYYY-X###)
- **Budget Section**: Prominent financial data display
- **Timeline**: Visual date range picker
- **Resource Assignment**: Team and project manager selection

### Layout Structure

- Full page or large dialog (1000px width)
- Multi-step wizard OR tabbed form
- 2-column layout for most sections
- Financial data prominently displayed

### shadcn/ui Components

- `Dialog` or full-page form
- `Tabs` for sections
- `DatePicker` for timeline
- `Input`, `Textarea`, `Select`
- `Progress` for planned progress tracking

## Figma Make Prompt

Create a comprehensive project form for KOMPASS, a German CRM application. Design a form for creating projects from won opportunities with budget, timeline, resource assignment, and German labels following GoBD compliance for project numbers.

**Form Container:**

- Large dialog: 1000px width or full-page layout
- Header:
  - Title: "Neues Projekt" or "Projekt bearbeiten" - 24px, bold
  - Subtitle: "Projekt initialisieren und planen"
  - Close/Back button

**Option A: Multi-Step Wizard**
Steps: "Grunddaten" (1/4) → "Budget" (2/4) → "Zeitplan" (3/4) → "Team" (4/4)
Progress indicator: 4 dots, current highlighted in blue

**Option B: Tabbed Form**
Tabs: "Grunddaten" | "Budget" | "Zeitplan" | "Team" | "Dokumente"

**[Using Tabbed Approach] Tab 1: Grunddaten (Basic Information)**

1. **Projektnummer** (Auto-generated, Read-only):
   - Label: "Projektnummer"
   - Display: Large text "P-2024-B023" - 24px, bold, blue
   - Icon: Hash icon
   - Help text: "Automatisch generiert (GoBD-konform)"
   - Background: Light blue tint (#f0f9ff)

2. **Projektname** (Required):
   - Label: "Projektname \*"
   - Input: Text, full width
   - Placeholder: "z.B. REWE München Süd - Ladeneinrichtung"
   - Validation: 5-200 characters

3. **Kunde** (Required):
   - Label: "Kunde \*"
   - Combobox: Searchable customer select
   - Shows: Customer name + location
   - If from opportunity: Pre-filled and disabled
   - Icon: Building

4. **Opportunity** (Optional):
   - Label: "Zugehörige Opportunity"
   - Select or display (if created from opportunity)
   - Shows: Opportunity title + value
   - If from opportunity: Pre-filled, read-only, with link to view
   - Example: "Ladeneinrichtung (€ 125.000)" with external link icon

5. **Projektbeschreibung** (Optional):
   - Label: "Projektbeschreibung"
   - **Rich Text Editor** (WYSIWYG): Advanced toolbar configuration
     - Toolbar buttons: Bold, Italic, Underline, Strikethrough, H1, H2, H3, Bullet List, Numbered List, Task List, Blockquote, Code Block, Horizontal Rule, Link, Table, Undo, Redo
     - See `ui-ux/02-core-components/rich-text-editor.md` for complete toolbar design
   - Min height: 250px (content area)
   - Placeholder: "Detaillierte Beschreibung des Projekts, Leistungsumfang, besondere Anforderungen..."
   - Max length: 5000 characters
   - Character counter: "0 / 5000 Zeichen" (bottom-right corner)
   - Help text: "Strukturierte Projektbeschreibung. Nutzen Sie Überschriften (H2) für Abschnitte und Tabellen für Spezifikationen."
   - **Supports Tables**: Users can insert tables for technical specifications and requirements
   - **Mobile**: Compact toolbar with expandable "Mehr" button

**Tab 2: Budget (Budget)**

**Budget Overview Card:**
Visual layout: Large cards side-by-side

1. **Auftragswert** (Required):
   - Label: "Vertragswert \*"
   - Input: Number, large font (32px)
   - Suffix: "€"
   - Placeholder: "450000"
   - Validation: 0-10,000,000
   - If from opportunity: Pre-filled with actual value
   - Help text: "Vertraglich vereinbarter Auftragswert"
   - Icon: FileSignature (blue circle)

2. **Geplantes Budget** (Required):
   - Label: "Geplantes Budget \*"
   - Input: Number, large font (32px)
   - Suffix: "€"
   - Placeholder: "380000"
   - Validation: Should be ≤ contract value
   - Warning if > contract value: "Budget überschreitet Auftragswert (negative Marge!)" - amber
   - Help text: "Geplante Projektkosten"
   - Icon: Calculator (blue circle)

3. **Geplante Marge** (Calculated, Read-only):
   - Label: "Geplante Marge"
   - Display: "€ 70.000 (15,6%)" - large, bold
   - Color: Green if positive, red if negative
   - Calculation: Contract Value - Budget
   - Tooltip: "Berechnet als Auftragswert minus Budget"
   - Background: Light green or red tint

**Budget Warning:**

- If budget > contract value:
  - Alert banner: Amber background
  - Icon: AlertTriangle
  - Text: "Achtung: Budget überschreitet Auftragswert um € 20.000. Dies führt zu einer negativen Marge."

**Budget Breakdown (Optional Advanced):**

- Collapsible section: "Budgetaufschlüsselung"
- Fields: Material (€), Personal (€), Fremdleistungen (€), Sonstiges (€)
- Sum must equal total budget

**Tab 3: Zeitplan (Timeline)**

1. **Geplanter Projektstart** (Required):
   - Label: "Geplanter Projektstart \*"
   - Date picker
   - Validation: -30 days to +365 days from today
   - Error: "Projektstartdatum muss innerhalb von -30 bis +365 Tagen liegen"
   - Help text: "Geplantes Startdatum des Projekts"

2. **Geplantes Projektende** (Required):
   - Label: "Geplantes Projektende \*"
   - Date picker
   - Validation: Must be after start date
   - Error: "Projektende muss nach Projektstart liegen"
   - Help text: "Geplantes Abschlussdatum"

3. **Projektdauer** (Calculated, Display):
   - Label: "Projektdauer"
   - Display: "62 Tage" or "9 Wochen" - large text
   - Icon: Calendar
   - Automatically calculated from start/end dates

**Visual Timeline:**

- Horizontal bar showing start to end date
- Today marker: Vertical line with "Heute" label
- Color: Blue gradient
- Shows: Start date (left) | Duration bar | End date (right)
- Milestones (optional): Markers on timeline

**Meilensteine** (Optional, Advanced):

- Add milestone button: "+ Meilenstein hinzufügen"
- Each milestone:
  - Name: Input text
  - Date: Date picker
  - Description: Textarea
  - Remove button
- Shows on timeline visual

**Tab 4: Team (Team)**

1. **Projektleiter** (Required):
   - Label: "Projektleiter \*"
   - Select: PLAN users only
   - Avatar + name + role badge
   - Validation: Must be PLAN role user
   - Error: "Projektleiter muss ein Planungsmitarbeiter sein"

2. **Team-Mitglieder** (Optional):
   - Label: "Team-Mitglieder"
   - Multi-select with avatars
   - Shows: Selected users as chips with avatars
   - Add button: Opens user selector
   - Example: "M. Schmidt (ADM) ×", "T. Fischer (KALK) ×"

3. **Externe Partner** (Optional):
   - Label: "Externe Partner"
   - **Rich Text Editor** (WYSIWYG): Basic toolbar configuration
     - Toolbar buttons: Bold, Italic, Bullet List, Numbered List, Link, Undo, Redo
   - Min height: 100px
   - Placeholder: "Namen und Firmen externer Dienstleister..."
   - Max length: 1000 characters
   - Character counter: "X / 1000 Zeichen"
   - Help text: "Nutzen Sie Listen für übersichtliche Aufzählung"

**Tab 5: Dokumente & Notizen (Documents & Notes)**

1. **Projekt-Dokumente**:
   - Label: "Dokumente"
   - File upload area (drag & drop or click)
   - Shows uploaded files as list:
     - File icon + name + size
     - Remove "×" button
   - Accepted types: PDF, DOCX, XLSX, images
   - Max size: 10 MB per file
   - Help text: "Verträge, Pläne, Spezifikationen hochladen"

2. **Projektnotizen** (Optional):
   - Label: "Projektnotizen"
   - **Rich Text Editor** (WYSIWYG): Advanced toolbar configuration
     - Toolbar buttons: Bold, Italic, Underline, Strikethrough, H1, H2, H3, Bullet List, Numbered List, Task List (checkboxes), Blockquote, Code Block, Horizontal Rule, Link, Table, Undo, Redo
     - See `ui-ux/02-core-components/rich-text-editor.md` for complete toolbar design
   - Min height: 200px (content area)
   - Placeholder: "Projektnotizen, Milestones, offene Punkte, Lessons Learned..."
   - Max length: 5000 characters
   - Character counter: "0 / 5000 Zeichen" (bottom-right corner)
   - Help text: "Laufende Notizen zum Projekt. Nutzen Sie Aufgabenlisten (☐) für Milestones und offene Punkte."
   - **Supports Task Lists & Tables**: Track milestones and project status updates
   - **Mobile**: Compact toolbar with expandable "Mehr" button

**Form Footer (Sticky, all tabs):**

- Status indicator: "Schritt 2 von 4" (if wizard) or current tab name
- Buttons:
  - "Zurück" (if wizard, secondary)
  - "Abbrechen" (secondary, outlined)
  - "Weiter" (if wizard, primary)
  - "Projekt erstellen" (final step/tab, primary blue)

**GoBD Compliance Indicator:**

- Info banner at form top:
  - Blue background (#eff6ff)
  - Info icon
  - Text: "Projektnummer wird automatisch gemäß GoBD-Anforderungen generiert (P-YYYY-X###)"

**Opportunity Link (If from Won Opportunity):**

- Section at top showing source opportunity
- Card: Light green background
  - Icon: CheckCircle (green)
  - Text: "Erstellt aus gewonnener Opportunity: Ladeneinrichtung"
  - Value: "€ 125.000"
  - Link: "Opportunity anzeigen →"

**Validation:**

- Contract value must match opportunity actual value (if from opportunity)
- Start date validation: Not more than 30 days in past
- End date > start date
- Project manager must be PLAN role
- Budget warning if exceeds contract value

**Loading/Success:**

- Creating project: Loading overlay "Projekt wird erstellt..."
- Success: "Projekt P-2024-B023 wurde erfolgreich angelegt"
- Navigation: Redirect to project detail page

Design with clear financial emphasis, timeline visualization, and team collaboration focus.

## Interaction Patterns

### Wizard Flow (if multi-step)

1. Step 1: Basic info → "Weiter"
2. Step 2: Budget → "Weiter"
3. Step 3: Timeline → "Weiter"
4. Step 4: Team → "Projekt erstellen"
5. Each step validates before proceeding

### Budget Calculation

- User enters contract value
- User enters budget
- Margin auto-calculates and displays
- Color changes: Green (positive) or red (negative)
- Warning appears if negative margin

### Timeline Visualization

- User selects start date
- User selects end date
- Duration calculates automatically
- Timeline bar updates visually
- Validation runs (end > start)

## German Labels & Content

### Tabs/Steps

- **Grunddaten**: Basic information
- **Budget**: Budget
- **Zeitplan**: Timeline
- **Team**: Team
- **Dokumente**: Documents

### Fields (See detailed list above)

### Calculated Fields

- **Geplante Marge**: Planned margin
- **Projektdauer**: Project duration
- **X Tage**: X days
- **X Wochen**: X weeks

### Buttons

- **Projekt erstellen**: Create project
- **Projekt speichern**: Save project
- **Weiter**: Next
- **Zurück**: Back

## Accessibility Requirements

- WCAG 2.1 AA compliance
- Wizard: aria-label="Projekterfassung Schritt X von Y"
- Progress indicator: role="progressbar"
- Financial calculations: Announced to screen readers
- Timeline: Accessible date pickers
- File upload: Keyboard accessible

## Mobile Considerations

- Full-screen wizard on mobile
- Single column layout
- Larger inputs and buttons
- Simplified timeline (no visual bar)
- Native date pickers
- Step indicator at top
- "Zurück" and "Weiter" buttons full width

## Example Data

**New Project (from Won Opportunity):**

- Projektnummer: "P-2024-B023" (auto-generated)
- Projektname: "REWE München Süd - Ladeneinrichtung"
- Kunde: "REWE München Süd"
- Opportunity: "Ladeneinrichtung" (€ 125.000) - linked
- Auftragswert: "€ 125.000" (from opportunity)
- Budget: "€ 105.000"
- Marge: "€ 20.000 (16%)" - green
- Start: "01.12.2024"
- Ende: "28.02.2025"
- Dauer: "89 Tage"
- Projektleiter: "Thomas Fischer (PLAN)"
- Team: "M. Schmidt (ADM)", "K. Weber (KALK)"

## Implementation Notes

### shadcn/ui Installation

```bash
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add form
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add combobox
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add button    # For rich text editor toolbar
npx shadcn-ui@latest add separator # For rich text editor toolbar
npx shadcn-ui@latest add tooltip   # For rich text editor toolbar
```

### TipTap Rich Text Editor Installation

```bash
# Core TipTap packages for advanced toolbar (with tables, code blocks)
pnpm add @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder
pnpm add @tiptap/extension-task-list @tiptap/extension-task-item
pnpm add @tiptap/extension-link @tiptap/extension-underline
pnpm add @tiptap/extension-table @tiptap/extension-table-row
pnpm add @tiptap/extension-table-cell @tiptap/extension-table-header
```

### Component Dependencies

- GoBD project number generator
- Opportunity data (if from opportunity)
- Customer search
- User search (filtered by role)
- Budget calculation logic
- Date validation logic
- File upload component

### State Management

- Multi-step wizard state OR tab state
- Form data across steps/tabs
- Calculated fields (margin, duration)
- Validation state per step
- File upload state
- Opportunity context if applicable

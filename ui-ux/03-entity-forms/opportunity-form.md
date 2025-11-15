# Opportunity Form - Figma Make Prompt

## Context & Purpose

- **Component Type**: Entity Creation/Edit Form
- **User Roles**: GF, INNEN, ADM (create own), PLAN (read for projects), KALK (read-only)
- **Usage Context**: Create/edit sales opportunities and track pipeline
- **Business Value**: Sales pipeline management and revenue forecasting

## Design Requirements

### Visual Hierarchy

- **Form Title**: "Neue Opportunity" or "Opportunity bearbeiten"
- **Customer Selection**: Prominent, searchable
- **Value Fields**: Large, emphasized (estimated value, probability)
- **Status Flow**: Visual status transition indicator

### Layout Structure

- Dialog: 900px width (desktop)
- 2-column layout for most fields
- Value fields prominent at top
- Multi-step wizard option for complex opportunities
- Footer with save actions

### shadcn/ui Components

- `Dialog` or full-page form
- `Form` with validation
- `Combobox` for customer search
- `Input`, `Textarea`, `Select`
- `Slider` for probability
- `DatePicker` for dates

## Figma Make Prompt

Create a comprehensive opportunity form for KOMPASS, a German CRM application. Design a form for creating and editing sales opportunities with customer selection, value estimation, probability tracking, and status transitions with German labels.

**Form Header:**

- Title: "Neue Opportunity" or "Opportunity bearbeiten" - 24px, bold
- Subtitle: "Verkaufschance erfassen und verfolgen"
- Close "×" button

**Section 1: Kunde & Grunddaten (Customer & Basics)**

1. **Kunde** (Required):
   - Label: "Kunde \*"
   - Combobox: Searchable customer select
   - Placeholder: "Kunde suchen oder auswählen..."
   - Shows: Customer name + location
   - Example: "Hofladen Müller GmbH (München)"
   - Search: Types "Hofladen" → filters list
   - Icon: Building icon
   - Help text: "Kunde für diese Verkaufschance"

2. **Opportunity-Titel** (Required):
   - Label: "Titel \*"
   - Input: Text, full width
   - Placeholder: "z.B. Ladeneinrichtung Filiale München Süd"
   - Validation: 5-200 characters
   - Help text: "Kurze Beschreibung der Verkaufschance"

3. **Beschreibung** (Optional):
   - Label: "Beschreibung"
   - **Rich Text Editor** (WYSIWYG): Standard toolbar configuration
     - Toolbar buttons: Bold, Italic, Underline, Strikethrough, H2, H3, Bullet List, Numbered List, Task List (checkboxes), Blockquote, Link, Undo, Redo
     - See `ui-ux/02-core-components/rich-text-editor.md` for complete toolbar design
   - Min height: 200px (content area)
   - Placeholder: "Details zur Opportunity, Kundenanforderungen, nächste Schritte..."
   - Max length: 5000 characters
   - Character counter: "150 / 5000 Zeichen" (bottom-right corner)
   - Help text: "Detaillierte Beschreibung. Nutzen Sie Aufgabenlisten (☐) für Action Items."
   - **Supports Task Lists**: Users can create checkbox lists for next steps and action items
   - **Mobile**: Compact toolbar with essential buttons, "Mehr" button to expand

**Section 2: Wertermittlung (Value Assessment)**
Label: "Wertermittlung" - 18px, semibold

**Visual Layout: Prominent Cards**

1. **Geschätzter Wert** (Required):
   - Large card with icon (Euro sign, 32px, blue circle)
   - Label: "Geschätzter Auftragswert \*"
   - Input: Number, large font (24px)
   - Suffix: "€" inside input
   - Placeholder: "125000"
   - Validation: 0-10,000,000 (€10M max)
   - Help text: "Erwarteter Gesamtwert des Auftrags"
   - Error: "Wert muss zwischen 0 € und 10.000.000 € liegen"

2. **Wahrscheinlichkeit** (Required):
   - Large card with icon (TrendingUp, 32px, blue circle)
   - Label: "Erfolgswahrscheinlichkeit \*"
   - Slider: 0-100%, step 5
   - Value display: "75%" (large, 24px, bold)
   - Slider rail: Gray background
   - Slider fill: Blue gradient (0-70%), green gradient (70-100%)
   - Slider thumb: 24px circle, blue, draggable
   - Marks: 0%, 25%, 50%, 75%, 100% labeled below slider
   - Help text: "Geschätzte Wahrscheinlichkeit des Abschlusses (in 5%-Schritten)"

3. **Gewichteter Wert** (Calculated, Read-only):
   - Card: Light blue background
   - Label: "Gewichteter Wert" (with info icon)
   - Value: "€ 93.750" (large, bold, blue)
   - Calculation: Estimated Value × Probability
   - Tooltip on info icon: "Berechnet als Geschätzter Wert × Wahrscheinlichkeit"
   - Not editable: Display only

**Section 3: Status & Zeitplan (Status & Timeline)**

1. **Status** (Required):
   - Label: "Status \*"
   - Select dropdown with visual indicators
   - Options (with icons):
     - Neu (New) - Circle icon, blue
     - Qualifizierung (Qualifying) - Progress icon, amber
     - Angebot erstellt (Proposal) - FileText icon, purple
     - Verhandlung (Negotiation) - Handshake icon, orange
     - Gewonnen (Won) - Check icon, green
     - Verloren (Lost) - X icon, red
   - Current status highlighted in color
   - Shows: Valid next statuses only (based on transition rules)
   - Help text: "Aktueller Stand im Verkaufsprozess"

2. **Erwartetes Abschlussdatum** (Optional):
   - Label: "Erwartetes Abschlussdatum"
   - Date picker: Calendar icon, German format
   - Placeholder: "TT.MM.JJJJ"
   - Presets: "Ende dieses Monats", "Ende nächsten Monats", "In 90 Tagen"
   - Help text: "Voraussichtliches Datum der Auftragserteilung"

3. **Nächster Schritt** (Optional):
   - Label: "Nächster Schritt"
   - **Rich Text Editor** (WYSIWYG): Basic toolbar configuration
     - Toolbar buttons: Bold, Italic, Bullet List, Numbered List, Link, Undo, Redo
   - Min height: 100px
   - Placeholder: "z.B. Folgetermin vereinbaren, Angebot versenden..."
   - Max length: 500 characters
   - Character counter: "X / 500 Zeichen"

**Conditional Fields (Based on Status):**

**If Status = "Verloren":** 4. **Grund für Verlust** (Required):

- Label: "Grund für Verlust \*"
- **Rich Text Editor** (WYSIWYG): Basic toolbar configuration
  - Toolbar buttons: Bold, Italic, Bullet List, Numbered List, Link, Undo, Redo
- Min height: 120px
- Placeholder: "Bitte beschreiben Sie, warum die Opportunity verloren wurde..."
- Min length: 10 characters
- Max length: 1000 characters
- Character counter: "X / 1000 Zeichen"
- Error: "Bei verlorenen Opportunities muss ein Grund angegeben werden (min. 10 Zeichen)"

5. **Verlorener Wettbewerber** (Optional):
   - Label: "An Wettbewerber verloren"
   - Input: Text
   - Placeholder: "Name des Wettbewerbers"

**If Status = "Gewonnen":** 4. **Tatsächlicher Auftragswert** (Required):

- Label: "Tatsächlicher Auftragswert \*"
- Input: Number with € suffix
- Placeholder: "125000"
- Validation: Must be > 0
- Error: "Bei gewonnenen Opportunities muss ein tatsächlicher Wert angegeben werden"
- Comparison: Shows difference from estimated value
- Example: "€ 125.000 (+ € 5.000 vs. Schätzung)" in green or red

5. **Auftragsdatum** (Required):
   - Label: "Auftragsdatum \*"
   - Date picker
   - Default: Today
   - Help text: "Datum der Auftragserteilung"

**Section 4: Zuordnung (Assignment)**

1. **Verantwortlicher Mitarbeiter** (Required):
   - Label: "Verantwortlicher Mitarbeiter \*"
   - Select: ADM or INNEN users
   - For ADM creating: Pre-filled with self, disabled
   - For GF/INNEN: Can assign to any ADM/INNEN user
   - Avatar + name displayed

2. **Tags/Kategorien** (Optional):
   - Label: "Tags"
   - Multi-select with chips
   - Options: "Großprojekt", "Franchise", "Neubau", "Renovierung", "Zeitkritisch"
   - Shows as chips: "Großprojekt ×", "Zeitkritisch ×"
   - Can create new tags inline

**Form Footer:**

- Left: "Als Entwurf speichern" (secondary, text link)
- Right: "Abbrechen" (outlined) + "Opportunity speichern" (blue primary)

**Status Transition Indicator (Edit Mode):**

- Shows current status with visual flow
- Example: Neu → Qualifizierung → [Angebot erstellt] → Verhandlung → Gewonnen
- Current status highlighted in blue
- Next valid statuses shown with dotted line
- Invalid transitions grayed out

**Validation:**

- Required fields validated on blur
- Business rules enforced:
  - Lost requires reason (min 10 chars)
  - Won requires actual value > 0
  - Probability must be 0-100 in steps of 5
  - Estimated value max €10M

**Warning Messages:**

- If probability > 80% but status still "Neu": Warning "Hohe Wahrscheinlichkeit bei frühem Status - Status aktualisieren?"
- If expected close date in past and status not Won/Lost: Warning "Abschlussdatum liegt in der Vergangenheit"

Design with large, prominent value fields and clear status visualization.

## Interaction Patterns

### Form Flow

1. Click "Neue Opportunity"
2. Dialog opens
3. Select customer (required first)
4. Enter title and description
5. Set estimated value and probability (see weighted value update)
6. Select status
7. Set expected close date
8. Conditional fields appear based on status
9. Assign owner
10. Click "Opportunity speichern"
11. Validation runs, saves if valid
12. Success toast, dialog closes

### Probability Slider

- Drag thumb: Value updates in real-time
- Weighted value recalculates immediately
- Snap to 5% increments
- Click rail: Jump to that value

### Status Selection

- Select status dropdown
- Shows valid next statuses based on current
- Invalid statuses disabled with tooltip explaining why
- Conditional fields appear/hide based on selection

## German Labels & Content

### Sections

- **Kunde & Grunddaten**: Customer & basics
- **Wertermittlung**: Value assessment
- **Status & Zeitplan**: Status & timeline
- **Zuordnung**: Assignment

### Fields (See detailed list above)

### Status Values

- **Neu**: New
- **Qualifizierung**: Qualifying
- **Angebot erstellt**: Proposal
- **Verhandlung**: Negotiation
- **Gewonnen**: Won
- **Verloren**: Lost

### Buttons

- **Opportunity speichern**: Save opportunity
- **Als Entwurf speichern**: Save as draft
- **Abbrechen**: Cancel

## Accessibility Requirements

- WCAG 2.1 AA compliance
- Slider: role="slider", aria-valuemin, aria-valuemax, aria-valuenow
- Conditional fields: Announced when they appear
- Required fields: aria-required="true"
- Validation errors: aria-describedby
- Keyboard navigation: Slider adjustable with arrow keys

## Mobile Considerations

- Full-screen form
- Single column
- Value cards stack vertically
- Slider full width with larger thumb (32px)
- Native select for status on mobile

## Example Data

**New Opportunity:**

- Kunde: "REWE Köln Süd"
- Titel: "Ladeneinrichtung Neueröffnung"
- Geschätzter Wert: "€ 125.000"
- Wahrscheinlichkeit: "75%"
- Gewichteter Wert: "€ 93.750"
- Status: "Angebot erstellt"
- Erwartetes Abschlussdatum: "15.12.2024"
- Nächster Schritt: "Angebot präsentieren, Entscheidung Q4"
- Verantwortlich: "Michael Schmidt"

## Implementation Notes

### shadcn/ui Installation

```bash
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add form
npx shadcn-ui@latest add combobox
npx shadcn-ui@latest add slider
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add button    # For rich text editor toolbar
npx shadcn-ui@latest add separator # For rich text editor toolbar
npx shadcn-ui@latest add tooltip   # For rich text editor toolbar
```

### TipTap Rich Text Editor Installation

```bash
# Core TipTap packages for standard toolbar (with task lists)
pnpm add @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder
pnpm add @tiptap/extension-task-list @tiptap/extension-task-item
pnpm add @tiptap/extension-link @tiptap/extension-underline
```

### Component Dependencies

- Customer search/select component
- Status transition validation logic
- Weighted value calculation
- Date presets logic
- User assignment component

### State Management

- Form state with conditional fields
- Status transition rules
- Real-time calculated fields (weighted value)
- Customer search results
- Tag creation and selection

# Opportunity Pipeline View - Figma Make Prompt

## Context & Purpose
- **Component Type**: Kanban Pipeline Board
- **User Roles**: GF (all), PLAN (all), ADM (own), KALK (read-only)
- **Usage Context**: Visualize and manage sales pipeline with drag-and-drop
- **Business Value**: Track opportunities through sales stages, forecast revenue

## Design Requirements

### Visual Hierarchy
- **Kanban Columns**: One per status (Neu, Qualifizierung, Angebot, Verhandlung, Gewonnen, Verloren)
- **Opportunity Cards**: Compact, draggable cards with key info
- **Pipeline Value**: Total and weighted value per column
- **Status Transition**: Visual drag-and-drop between stages

### Layout Structure
- Horizontal scrollable board
- Column width: 320px each, 6 columns visible
- Card height: Auto (120-160px)
- Gap: 16px between cards, 16px between columns
- Horizontal scroll for all columns

### shadcn/ui Components
- `Card` for opportunity cards (draggable)
- `Badge` for status and priority
- `Progress` for probability
- Drag-and-drop library integration

## Figma Make Prompt

Create an opportunity pipeline Kanban board for KOMPASS, a German CRM application. Design a drag-and-drop board with columns for each sales stage, opportunity cards with value and probability, and pipeline value summaries with German labels.

**Pipeline Board Layout:**
- Horizontal scrollable container
- 6 columns side by side
- Total width: 6 × 320px = 1920px (scrollable)
- Background: Light gray (#f9fafb)
- Padding: 24px

**Kanban Columns (One for Each Status):**

**Column Structure:**
- Width: 320px
- Background: White (or light color per status)
- Border-radius: 8px
- Padding: 16px
- Minimum height: 600px
- Gap: 12px between cards

**Column Header:**
- Status name: "Neu" (16px, bold)
- Card count badge: "5" (gray badge)
- Total value: "€ 625.000" (14px, semibold)
- Weighted value: "€ 156.250" (12px, gray, in parentheses)
- Add button: "+" icon (small, top-right)

**Column Variants (by Status):**

1. **Neu (New):**
   - Header background: Light blue (#dbeafe)
   - Icon: Circle (blue)
   - Count: "8"
   - Total: "€ 485.000"
   - Weighted: "€ 48.500" (10% avg probability)

2. **Qualifizierung (Qualifying):**
   - Header background: Light purple (#f3e8ff)
   - Icon: Search (purple)
   - Count: "12"
   - Total: "€ 890.000"
   - Weighted: "€ 267.000" (30% avg)

3. **Angebot (Proposal):**
   - Header background: Light amber (#fef3c7)
   - Icon: FileText (amber)
   - Count: "6"
   - Total: "€ 550.000"
   - Weighted: "€ 330.000" (60% avg)

4. **Verhandlung (Negotiation):**
   - Header background: Light orange (#fed7aa)
   - Icon: Handshake (orange)
   - Count: "4"
   - Total: "€ 380.000"
   - Weighted: "€ 304.000" (80% avg)

5. **Gewonnen (Won):**
   - Header background: Light green (#d1fae5)
   - Icon: CheckCircle (green)
   - Count: "15"
   - Total: "€ 1.850.000"
   - Weighted: "€ 1.850.000" (100%)

6. **Verloren (Lost):**
   - Header background: Light red (#fee2e2)
   - Icon: XCircle (red)
   - Count: "7"
   - Total: "€ 420.000"
   - Weighted: "€ 0" (0%)

**Opportunity Card (Draggable):**

**Card Appearance:**
- Width: 288px (fits column with padding)
- Background: White
- Border: 1px solid #e5e7eb
- Border-radius: 6px
- Padding: 16px
- Shadow: Small
- Cursor: Grab (draggable)
- Dragging: Opacity 0.8, cursor grabbing, rotated 2deg

**Card Content:**

1. **Customer Name** (Top):
   - Font: 14px, semibold, #1f2937
   - Icon: Building (14px) before name
   - Truncate if long, tooltip shows full name
   - Example: "REWE München Süd"

2. **Opportunity Title**:
   - Font: 16px, bold, #111827
   - Example: "Ladeneinrichtung Neueröffnung"
   - Truncate after 2 lines

3. **Value & Probability** (Prominent):
   - Large value: "€ 125.000" (20px, bold, blue)
   - Probability: Circular progress (40px, right-aligned)
     - Shows: "75%" in center
     - Color: Gradient blue to green based on percentage

4. **Expected Close Date**:
   - Icon: Calendar (14px)
   - Text: "Erwartet: 15.12.2024" (12px, gray)
   - Overdue: Red text with alert icon if date passed

5. **Owner Avatar**:
   - Small avatar (24px) at bottom-left
   - Initials: "MS"
   - Tooltip: "Michael Schmidt"

6. **Tags** (If Any):
   - Small badges: "Großprojekt", "Zeitkritisch"
   - Max 2 visible, "+1" if more
   - Font: 10px

**Card Footer:**
- Last activity: "Follow-up: Vor 2 Tagen" (11px, gray)
- Activity icon: Small (12px)

**Card Interaction States:**
- **Default**: White background, border gray
- **Hover**: Shadow increases, border blue
- **Dragging**: Opacity 0.8, rotated, following cursor
- **Drop target**: Column background highlights (light blue)

**Drag-and-Drop Behavior:**
- Grab card: Cursor changes to grabbing
- Drag to column: Column highlights
- Drop: Card animates into position
- Status update: Confirmation toast "Status zu 'Verhandlung' geändert"
- Invalid drop: Red highlight, card returns to origin
- Example: Cannot drop "Neu" directly into "Gewonnen" (business rule)

**Pipeline Summary (Top):**
- Above columns
- Cards showing totals:
  1. **Gesamtwert Pipeline**: "€ 4.725.000" (all opportunities)
  2. **Gewichteter Wert**: "€ 2.955.250" (probability-adjusted)
  3. **Durchschn. Wahrscheinlichkeit**: "62,5%"
  4. **Opportunities gesamt**: "52"
- Each card: Icon + label + large value

**Filter Bar:**
- Above pipeline
- Filters: Owner (multi-select), Date range, Value range, Tags
- Active filters: Chips "Inhaber: M. Schmidt ×", "Wert: > € 50.000 ×"

**View Options:**
- Toggle: Kanban view | List view | Calendar view
- Active: Blue
- Icons: LayoutDashboard, List, Calendar

**Column Actions (Header Dropdown):**
- MoreVertical icon in column header
- Actions:
  - "Spalte minimieren" (collapse to title only)
  - "Nur diese Spalte anzeigen" (focus mode)
  - "Karten sortieren nach..." (Date, Value, Probability)

**Empty Column:**
- Dashed border card in column
- Icon: Plus (gray, 48px)
- Text: "Keine Opportunities in 'Neu'"
- Button: "Opportunity hinzufügen" (gray, outlined)

**Mobile Layout:**
- Vertical accordion: One column at a time
- Tabs at top: Select status to view
- Cards: Full width
- Drag: Long press, then drag
- Or: Click card → Select new status dropdown

Design with clear visual pipeline flow, intuitive drag-and-drop, and prominent value indicators.

## Interaction Patterns

### Drag-and-Drop Flow
1. User clicks and holds opportunity card
2. Card lifts (shadow, opacity change)
3. User drags to new column
4. Target column highlights
5. User releases
6. Card drops into new position
7. Status updates
8. Confirmation toast: "Opportunity zu 'Verhandlung' verschoben"
9. If conditional fields required (e.g., Lost reason): Dialog opens

### Status Transition Validation
- Only valid transitions allowed
- Invalid drop targets grayed out during drag
- Example: "Neu" can only go to "Qualifizierung" or "Verloren"
- Attempting invalid drop: Red highlight, card returns, error toast

### Card Click
- Click card (not dragging): Opens opportunity detail
- Click customer name: Navigate to customer detail
- Click owner avatar: Show user info popover

## German Labels & Content

### Status Columns
- **Neu**: New
- **Qualifizierung**: Qualifying
- **Angebot erstellt**: Proposal
- **Verhandlung**: Negotiation
- **Gewonnen**: Won
- **Verloren**: Lost

### Card Labels
- **Erwartet**: Expected (close date)
- **Verantwortlich**: Responsible (owner)
- **Letzte Aktivität**: Last activity

### Pipeline Summary
- **Gesamtwert Pipeline**: Total pipeline value
- **Gewichteter Wert**: Weighted value
- **Durchschn. Wahrscheinlichkeit**: Average probability
- **Opportunities gesamt**: Total opportunities

### Actions
- **Opportunity hinzufügen**: Add opportunity
- **Bearbeiten**: Edit
- **Verschieben nach**: Move to
- **Löschen**: Delete

## Accessibility Requirements
- WCAG 2.1 AA compliance
- Drag-and-drop: Keyboard alternative (button to move between columns)
- Cards: role="button", aria-label with opportunity title
- Columns: role="region", aria-label with status name
- Status updates: Announced to screen readers
- Focus visible: Blue outline on keyboard navigation

## Mobile Considerations
- Vertical column view (tabs or accordion)
- Select status tab to view opportunities in that stage
- Cards full width
- No drag-and-drop: Tap card → "Status ändern" dropdown
- Simplified: Focus on key info (value, probability, close date)

## Example Data

**Pipeline (Kanban Columns):**
- Neu: 8 opportunities, € 485.000
- Qualifizierung: 12 opportunities, € 890.000
- Angebot: 6 opportunities, € 550.000
- Verhandlung: 4 opportunities, € 380.000
- Gewonnen: 15 opportunities, € 1.850.000
- Verloren: 7 opportunities, € 420.000

**Sample Opportunity Card (in Verhandlung):**
- Customer: "REWE München Süd"
- Title: "Ladeneinrichtung Neueröffnung"
- Value: "€ 125.000"
- Probability: "75%" (circular progress)
- Expected: "15.12.2024"
- Owner: "MS" avatar
- Tags: "Großprojekt", "Q4"

## Implementation Notes

### shadcn/ui Installation
```bash
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add avatar
```

### Drag-and-Drop Library
```bash
pnpm add @dnd-kit/core @dnd-kit/sortable
```

### Component Dependencies
- Opportunity API
- Drag-and-drop state management
- Status transition validation logic
- Weighted value calculation
- RBAC for visibility (ADM own opportunities)

### State Management
- Opportunities grouped by status
- Drag-and-drop state
- Filter and sort state
- Selected opportunity for details
- Status transition validation


# Dropdowns & Selects - Figma Make Prompt

## Context & Purpose

- **Component Type**: Dropdown Menus and Select Components
- **User Roles**: All (GF, PLAN, ADM, KALK, BUCH)
- **Usage Context**: Form selections, action menus, filters
- **Business Value**: Efficient selection from predefined options

## Design Requirements

### Visual Hierarchy

- **Trigger**: Clear button/input that opens menu
- **Menu**: Floating panel with options
- **Selected**: Visual indication of current selection
- **Grouping**: Logical organization of options

### Layout Structure

- Trigger: 40px height, full width or auto
- Menu: Max height 300px, scrollable, dropdown shadow
- Options: 40px height each, full width
- Menu positioning: Below trigger (or above if no space)

### shadcn/ui Components

- `DropdownMenu` for action menus
- `Select` for form selections
- `Combobox` for searchable selections
- `Command` for command palette

## Figma Make Prompt

Create comprehensive dropdown menu and select components for KOMPASS, a German CRM application. Design variants for form selects, action menus, multi-select, and searchable dropdowns with German labels.

**Standard Select (Form Field):**

**Closed State:**

- Width: Full width or fixed (e.g., 240px)
- Height: 40px
- Border: 1px solid gray (#d1d5db)
- Border-radius: 6px
- Padding: 12px
- Background: White
- Text: 14px, gray (#374151) if placeholder, black if selected
- Placeholder: "Land auswählen..."
- Chevron icon: ChevronDown (16px, gray) at right
- Focus: Blue border (2px, #3b82f6)

**Open State:**

- Dropdown menu appears below (or above if no space)
- Menu width: Matches trigger width
- Menu background: White
- Border: 1px solid #e5e7eb
- Border-radius: 8px
- Shadow: 0px 4px 12px rgba(0,0,0,0.15)
- Max-height: 300px, scrollable if more options

**Select Options:**

- Height: 40px each
- Padding: 12px horizontal
- Font: 14px
- Hover: Light blue background (#f0f9ff)
- Selected: Blue background (#3b82f6), white text
- Check icon: 16px at right for selected option
- Gap between options: 1px divider

**German Country Select Example:**
Options:

- Deutschland (selected, blue background, check icon)
- Österreich
- Schweiz
- Niederlande
- Frankreich
- ...more countries (scrollable)

**Multi-Select:**

- Each option has checkbox (20px) at left
- Selected options: Checkmark in checkbox, light blue background
- Trigger shows: "3 ausgewählt" or list of selected
- Apply button at bottom of menu: "Anwenden" (blue)
- Clear button: "Alle abwählen" (text link)

**Searchable Select (Combobox):**

- Trigger: Input field with search icon at left
- Type to search: Filters options in real-time
- Placeholder: "Kunde suchen..."
- No results: "Keine Ergebnisse für '[query]'" message in menu
- Recent selections shown first (optional)
- Example: Customer search returning "Hofladen Müller GmbH", "REWE Köln"

**Grouped Select:**

- Options organized in groups with headers
- Group headers: 12px uppercase gray labels
- Dividers between groups
- Example: Status select grouped:
  - AKTIV (header)
    - Neu
    - In Bearbeitung
  - ABGESCHLOSSEN (header)
    - Erledigt
    - Storniert

**Dropdown Menu (Actions):**

**Trigger:**

- Button with text: "Aktionen" + ChevronDown icon
- Or icon-only: MoreVertical (three dots)
- Height: 40px (or 32px for icon-only)

**Menu Structure:**

- Menu items: 40px height, left-aligned
- Icon: 20px at left (optional)
- Text: 14px
- Keyboard shortcut: Gray text at right (optional)
- Dividers: 1px solid #e5e7eb between sections
- Destructive items: Red text and icon

**Action Menu Example (Customer Row):**
Items:

1. Eye icon + "Details anzeigen" (Cmd+D)
2. Pencil icon + "Bearbeiten" (Cmd+E)
3. Copy icon + "Duplizieren"
4. --- (divider)
5. Mail icon + "E-Mail senden"
6. --- (divider)
7. Trash icon + "Löschen" (red text/icon)

**Nested Dropdown Menu:**

- Parent item has ChevronRight icon at right
- Hover parent: Submenu appears to the right
- Submenu: Same styling as parent menu
- Example: "Export" → "CSV", "Excel", "PDF"

**Context Menu (Right-Click):**

- Appears at cursor position on right-click
- Same menu styling as dropdown
- Use for: Table rows, cards, elements

**Filter Dropdown:**

- Trigger: "Filter" button with badge if filters active
- Menu contains:
  - Search input at top
  - Checkbox options below
  - "Filter zurücksetzen" link at bottom
  - "Anwenden" button at bottom (blue)
- Active filters shown as badges on trigger

**Select with Create Option:**

- Regular select options listed
- Bottom option: "+ Neu hinzufügen" (blue text)
- Clicking opens create dialog
- Example: Status select with "+ Neuer Status"

**Select with Icons:**

- Each option has icon at left (20px)
- Gap: 8px between icon and text
- Example: Priority select
  - AlertCircle (red) + "Hoch"
  - AlertTriangle (amber) + "Mittel"
  - Circle (gray) + "Niedrig"

**Cascading Select:**

- Multiple selects where second depends on first
- Example: Country → State/Region → City
- Second select disabled until first selected
- Options in second update based on first selection

**Select Loading State:**

- Spinner (16px) in place of chevron
- Options show: "Wird geladen..." message
- Disabled appearance during loading

**Select Error State:**

- Red border (2px, #ef4444)
- Error message below: "Bitte wählen Sie eine Option"
- Error icon (AlertCircle) at right

**Mobile Select:**

- On mobile: Native select picker (iOS/Android)
- Or: Full-screen overlay with options
- Large touch-friendly options (56px height)
- Search at top for long lists

Design with smooth animations (200ms) for menu open/close and option hover states.

## Interaction Patterns

### Select Interaction

1. User clicks trigger
2. Menu animates open (scale + fade, 200ms)
3. User scrolls or searches for option
4. User clicks option
5. Option selected (checkmark appears)
6. Menu closes
7. Trigger shows selected value

### Multi-Select Interaction

1. User clicks trigger
2. Menu opens
3. User clicks multiple checkboxes
4. Selected count updates in trigger
5. User clicks "Anwenden"
6. Menu closes, selections confirmed

### Searchable Select

1. User clicks trigger
2. Focus moves to search input
3. User types query
4. Options filter in real-time
5. User clicks filtered option
6. Menu closes, selection made

### Keyboard Navigation

- Arrow Down: Open menu / move to next option
- Arrow Up: Move to previous option
- Enter/Space: Select focused option
- Escape: Close menu
- Type to search: Filters options

## German Labels & Content

### Select Placeholders

- **Auswählen...**: Select...
- **Land auswählen**: Select country
- **Status auswählen**: Select status
- **Kunde auswählen**: Select customer
- **Option wählen**: Choose option

### Multi-Select

- **X ausgewählt**: X selected
- **Alle auswählen**: Select all
- **Alle abwählen**: Deselect all
- **Anwenden**: Apply
- **Abbrechen**: Cancel

### Search

- **Suchen...**: Search...
- **Keine Ergebnisse für '[X]'**: No results for '[X]'
- **Wird geladen...**: Loading...

### Action Menu

- **Aktionen**: Actions
- **Details anzeigen**: Show details
- **Bearbeiten**: Edit
- **Duplizieren**: Duplicate
- **Löschen**: Delete
- **Exportieren**: Export
- **Mehr Optionen**: More options

## Accessibility Requirements

- WCAG 2.1 AA compliance
- Select: role="combobox", aria-expanded, aria-controls
- Options: role="option", aria-selected
- Keyboard navigation functional
- Focus visible: 2px blue outline
- Screen reader announces selected option
- aria-label for icon-only triggers
- Disabled options: aria-disabled="true"

## Mobile Considerations

- Native select on mobile (better UX)
- Or full-screen overlay for custom select
- Touch-friendly options (48px+ height)
- Large search input
- Bottom sheet style menu
- Swipe to close menu

## Example Data

**Country Select:**

- Selected: "Deutschland"
- Options: Deutschland, Österreich, Schweiz, ...

**Status Select:**

- Selected: "In Bearbeitung"
- Options: Neu, In Bearbeitung, Abgeschlossen, Storniert

**Customer Select (Searchable):**

- Search: "Hofladen"
- Results: "Hofladen Müller GmbH", "Hofladen Schmidt KG"

**Priority Multi-Select:**

- Selected: Hoch, Mittel (2 ausgewählt)
- Options: Hoch, Mittel, Niedrig

## Implementation Notes

### shadcn/ui Installation

```bash
npx shadcn-ui@latest add select
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add combobox
npx shadcn-ui@latest add command
```

### Select Usage

```typescript
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Land auswählen" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="de">Deutschland</SelectItem>
    <SelectItem value="at">Österreich</SelectItem>
    <SelectItem value="ch">Schweiz</SelectItem>
  </SelectContent>
</Select>
```

### Dropdown Menu Usage

```typescript
<DropdownMenu>
  <DropdownMenuTrigger>Aktionen</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>
      <Pencil className="mr-2 h-4 w-4" />
      Bearbeiten
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem className="text-red-600">
      <Trash className="mr-2 h-4 w-4" />
      Löschen
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Component Dependencies

- Design tokens (colors, spacing, shadows)
- Icons from lucide-react (ChevronDown, Check, Search)
- Floating UI for menu positioning
- Virtual scrolling for long option lists

### State Management

- Selected value(s) state
- Menu open/close state
- Search query state (combobox)
- Filter states (multi-select)
- Loading state for async options

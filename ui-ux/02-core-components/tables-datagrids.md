# Tables & Data Grids - Figma Make Prompt

## Context & Purpose
- **Component Type**: Data Table / Data Grid
- **User Roles**: All (GF, PLAN, ADM, KALK, BUCH)
- **Usage Context**: Display lists of customers, projects, invoices, opportunities
- **Business Value**: Enables efficient browsing, sorting, filtering, and bulk actions on large datasets

## Design Requirements

### Visual Hierarchy
- **Header Row**: Bold labels, sortable columns, sticky on scroll
- **Data Rows**: Alternating row colors for readability, hover highlight
- **Actions Column**: Right-aligned, icon buttons or dropdown
- **Selection**: Checkbox column for multi-select
- **Pagination**: Bottom controls with page size options

### Layout Structure
- Full-width container with horizontal scroll if needed
- Row height: 56px (dense: 40px, comfortable: 56px, relaxed: 72px)
- Column widths: Auto or fixed, resizable option
- Sticky header when scrolling vertically
- Zebra striping: Alternating row backgrounds

### shadcn/ui Components
- `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`
- `Checkbox` for row selection
- `DropdownMenu` for row actions
- `Badge` for status indicators
- `Pagination` for page controls

## Figma Make Prompt

Create comprehensive data table and grid components for KOMPASS, a German CRM application. Design tables for customers, projects, invoices, and opportunities with sorting, filtering, selection, and German labels.

**Standard Data Table:**

**Header Row:**
- Background: Light gray (#f9fafb)
- Border-bottom: 1px solid #e5e7eb
- Height: 48px
- Padding: 12px horizontal per cell
- Column headers: 14px, semibold, #374151
- Sortable indicator: Arrow icon (16px) next to label
  - Unsorted: Gray up/down arrows
  - Ascending: Blue up arrow
  - Descending: Blue down arrow
- Sticky position: Remains visible when scrolling
- Example columns: "Firmenname", "Standort", "Status", "Erstellt am", "Aktionen"

**Data Rows:**
- Height: 56px (default density)
- Padding: 12px horizontal per cell
- Font: 14px, regular, #1f2937
- Border-bottom: 1px solid #f3f4f6
- Zebra striping: Even rows #ffffff, odd rows #f9fafb (optional)
- Hover: Light blue background (#f0f9ff), shows action buttons

**Column Types:**

1. **Selection Column (Left-most):**
   - Width: 48px
   - Checkbox: 20x20px
   - Header checkbox: Select all rows
   - Row checkbox: Select individual row
   - Selected row: Light blue background (#e0f2fe)

2. **Text Column:**
   - Auto width or fixed (e.g., 200px)
   - Left-aligned
   - Truncate with ellipsis if too long
   - Example: "Hofladen Müller GmbH"

3. **Number Column:**
   - Right-aligned
   - Formatted with separators
   - Example: "€ 125.000", "42 Tage"

4. **Date Column:**
   - Fixed width: 120px
   - German format: TT.MM.JJJJ
   - Example: "15.11.2024"

5. **Status Column:**
   - Badge component
   - Colors: Green (Aktiv), Amber (Ausstehend), Red (Überfällig), Gray (Inaktiv)
   - Example: "Aktiv", "In Bearbeitung", "Abgeschlossen"

6. **Avatar Column:**
   - 32px circle avatar
   - User initials or photo
   - Tooltip with full name on hover

7. **Actions Column (Right-most):**
   - Width: 80px
   - Icon buttons: Edit (Pencil), Delete (Trash), More (MoreVertical)
   - Dropdown menu for "More" actions
   - Hidden by default, visible on row hover

**Customer Table Example:**
Columns:
1. ☐ (Checkbox, 48px)
2. Firmenname (250px, sortable)
3. Umsatzsteuer-ID (150px)
4. Standort (150px, sortable)
5. Status (120px, badge, filterable)
6. Erstellt am (120px, sortable)
7. Inhaber (120px, avatar + name)
8. Aktionen (80px, icons)

Sample rows:
- "Hofladen Müller GmbH" | "DE123456789" | "München" | "Aktiv" (green) | "12.10.2024" | "M. Schmidt" | Edit/Delete
- "REWE Köln Süd" | "DE987654321" | "Köln" | "Aktiv" (green) | "08.11.2024" | "A. Weber" | Edit/Delete
- "Biomarkt Heidelberg" | "DE555666777" | "Heidelberg" | "Inaktiv" (gray) | "01.09.2024" | "T. Fischer" | Edit/Delete

**Table Controls (Above Table):**
- Left side:
  - Search input: "Kunden durchsuchen..." (300px width)
  - Filter button: "Filter" with count badge if active
  - View toggle: List/Grid view icons
- Right side:
  - Bulk actions dropdown: "Aktionen" (visible when rows selected)
  - Export button: "Exportieren" (CSV/Excel)
  - Add button: "Neuer Kunde" (primary blue)

**Bulk Selection Bar (When Rows Selected):**
- Appears below controls, above table
- Blue background (#eff6ff)
- Left: "5 Kunden ausgewählt"
- Right: Action buttons "E-Mail senden", "Status ändern", "Löschen" (red)
- Close: "×" button to deselect all

**Sorting Indicators:**
- Unsorted column: No indicator or subtle up/down arrows
- Ascending sort: Blue up arrow, column header highlighted
- Descending sort: Blue down arrow, column header highlighted
- Click header to cycle: Unsorted → Asc → Desc → Unsorted

**Pagination (Table Footer):**
- Background: Light gray (#f9fafb)
- Border-top: 1px solid #e5e7eb
- Height: 56px
- Left side: "Zeige 1-20 von 147 Kunden"
- Center: Page numbers with prev/next buttons
  - Example: « 1 2 [3] 4 5 »
  - Current page: Blue background, white text
  - Other pages: Gray text, white background, clickable
- Right side: "Zeilen pro Seite: [20▾]" (dropdown: 10, 20, 50, 100)

**Empty Table State:**
- No rows, just header
- Centered message in table body area:
  - Icon: Search or Folder (grayscale, 100px)
  - Heading: "Keine Kunden gefunden"
  - Description: "Beginnen Sie mit dem Hinzufügen Ihres ersten Kunden"
  - Button: "Neuer Kunde" (primary blue)

**Loading State:**
- Skeleton rows (8 rows)
- Shimmer animation through cells
- Header remains visible

**Table Density Options:**
- Compact: 40px row height, 8px padding
- Default: 56px row height, 12px padding
- Comfortable: 72px row height, 16px padding
- Density selector: Icon in controls area

**Responsive Behavior:**
- Desktop: Full table with all columns
- Tablet: Hide less important columns, show on expand
- Mobile: Card view instead of table
  - Each row becomes a card
  - Important fields shown, rest in expandable section

**Advanced Features:**

**Column Resizing:**
- Hover column border: Resize cursor
- Drag to adjust width
- Min width: 80px
- Double-click: Auto-fit to content

**Column Reordering:**
- Drag column header to reorder
- Visual indicator: Blue highlight during drag
- Drop indicator: Blue line between columns

**Frozen Columns:**
- First column (selection) always frozen
- Option to freeze first 2-3 columns
- Frozen columns have subtle shadow on right edge

**Inline Editing:**
- Double-click cell to edit
- Input field replaces cell content
- Save: Enter key or blur
- Cancel: Escape key
- Visual: Blue border around editing cell

**Row Expansion:**
- Chevron icon in first column
- Clicking expands row to show additional details
- Expanded content: Sub-table or detail cards
- Example: Expand customer to show locations and contacts

Design in light mode with professional aesthetic. Ensure all interactions are keyboard accessible.

## Interaction Patterns

### Sorting
1. User clicks column header
2. Sort indicator updates (arrow direction)
3. Table re-orders rows
4. First click: Ascending, second: Descending, third: Clear sort

### Filtering
1. User clicks "Filter" button
2. Filter panel opens (sheet or popover)
3. User selects filter criteria
4. Applies filters, table updates
5. Filter count badge shows active filters

### Row Selection
1. User clicks row checkbox
2. Row highlights with blue background
3. Bulk action bar appears
4. User can select multiple rows
5. Header checkbox selects all visible rows

### Row Actions
1. User hovers row
2. Action buttons fade in on right
3. Click action: Edit (opens form), Delete (confirmation), More (menu)

### Pagination
1. User clicks page number or prev/next
2. Loading indicator briefly shows
3. New page data loads
4. Scroll returns to top of table

## German Labels & Content

### Table Headers
- **Firmenname**: Company name
- **Umsatzsteuer-ID**: VAT number
- **Standort**: Location
- **Status**: Status
- **Erstellt am**: Created on
- **Geändert am**: Modified on
- **Inhaber**: Owner
- **Aktionen**: Actions

### Table Controls
- **Suchen**: Search
- **Filter**: Filters
- **Exportieren**: Export
- **Neuer [X]**: New [X]
- **Aktionen**: Actions (bulk)
- **Ansicht**: View

### Pagination
- **Zeige X-Y von Z [Entität]**: Showing X-Y of Z [Entity]
- **Zeilen pro Seite**: Rows per page
- **Vorherige Seite**: Previous page
- **Nächste Seite**: Next page

### Bulk Actions
- **X [Entität] ausgewählt**: X [Entity] selected
- **Alle auswählen**: Select all
- **Auswahl aufheben**: Deselect all
- **E-Mail senden**: Send email
- **Status ändern**: Change status
- **Löschen**: Delete

### Empty States
- **Keine [Entität] gefunden**: No [Entity] found
- **Keine Ergebnisse**: No results
- **Filter anpassen**: Adjust filters
- **Alle anzeigen**: Show all

## Accessibility Requirements
- WCAG 2.1 AA compliance
- Semantic table markup (`<table>`, `<thead>`, `<tbody>`)
- Column headers: `<th scope="col">`
- Row selection: aria-selected="true" on selected rows
- Sort indicators: aria-sort="ascending|descending|none"
- Keyboard navigation:
  - Tab: Move through interactive elements
  - Arrow keys: Navigate cells (optional advanced feature)
  - Space: Toggle row selection
  - Enter: Activate row action
- Screen reader announcements: "5 rows selected", "Sorted by name ascending"
- Focus visible: 2px blue outline

## Mobile Considerations
- Switch to card view on mobile (<768px)
- Each card shows: Company name, status, location, actions
- Swipe gestures: Swipe left for actions menu
- Full-screen search and filter on mobile
- Pagination: Simplified (prev/next only, no page numbers)
- Sticky "Neue [X]" FAB at bottom-right
- Touch-friendly checkboxes (32px)

## Example Data

**Customer Table:**
- 147 total customers
- 20 per page (default)
- Columns: Checkbox, Firmenname, Umsatzsteuer-ID, Standort, Status, Erstellt am, Inhaber, Aktionen
- Sample data: "Hofladen Müller GmbH", "DE123456789", "München", "Aktiv", "12.10.2024", "M. Schmidt"

**Project Table:**
- Columns: Checkbox, Projektnummer, Kunde, Status, Budget, Fortschritt, Projektleiter, Aktionen
- Sample: "P-2024-B023", "REWE München", "In Bearbeitung", "€ 450.000", "65%", "M. Schmidt"

## Implementation Notes

### shadcn/ui Installation
```bash
npx shadcn-ui@latest add table
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add pagination
npx shadcn-ui@latest add badge
```

### Basic Table
```typescript
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Firmenname</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Aktionen</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {customers.map(customer => (
      <TableRow key={customer.id}>
        <TableCell>{customer.companyName}</TableCell>
        <TableCell><Badge>{customer.status}</Badge></TableCell>
        <TableCell>
          <DropdownMenu>...</DropdownMenu>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Component Dependencies
- Design tokens (colors, spacing)
- Icons from lucide-react (ArrowUp, ArrowDown, MoreVertical, Pencil, Trash)
- Checkbox, Badge, Button, DropdownMenu components
- Pagination component
- Sorting and filtering logic

### State Management
- Selected rows: Array of IDs
- Sort state: Column + direction
- Filter state: Filter criteria object
- Pagination state: Current page, page size
- Table data from React Query or state management


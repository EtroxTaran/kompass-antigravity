# Customer List View

## Context & Purpose

- **Component Type**: Data Table List View
- **User Roles**: All (GF/PLAN see all, ADM see own only)
- **Usage Context**: Main customer list page with search, filter, sort
- **Business Value**: Central view for customer database browsing and management

## Reference Source

**GitHub UI Reference Repository:** `EtroxTaran/Kompassuimusterbibliothek`
- **Reference File:** `src/components/CustomerListDemo.tsx`
- **Implementation:** `apps/frontend/src/pages/CustomerListPage.tsx`

## Design Requirements

### Visual Hierarchy

- **Search Bar**: Prominent at top-left
- **Action Buttons**: Top-right (Filter, Export, New Customer)
- **Data Table**: Main content with sortable columns
- **Pagination**: Bottom controls

### Layout Structure

- Full-width page layout
- Controls bar: 64px height
- Table: Flexible height, scrollable
- Row height: 56px
- RBAC filtering: ADM sees only owned customers

### shadcn/ui Components

- `Input` for search
- `Table` with sortable columns
- `Button`, `Badge`, `DropdownMenu`
- `Sheet` for filters
- `Pagination`

## Implementation Details

**Reference Implementation:** Based on `CustomerListDemo.tsx` from GitHub UI reference repository.

This customer list view implements a comprehensive data table with search, filtering, sorting, and RBAC-based data access where ADM users see only their own customers while PLAN/GF see all customers.

**Page Layout:**

- Full-width container (max-width: 1440px)
- Breadcrumb: "Dashboard > Kunden"
- Page title: "Kunden" (32px, bold) with count badge: "147"

**Controls Bar (Top):**

**Left Side:**

1. **Search Input:**
   - Width: 400px
   - Placeholder: "Kunden durchsuchen..."
   - Search icon at left
   - Clear "×" button at right when text entered
   - Real-time search (300ms debounce)

2. **Filter Button:**
   - Icon: Filter
   - Text: "Filter"
   - Badge: Red "3" if filters active
   - Clicking opens filter sheet from right

3. **View Toggle:**
   - Icon buttons: Table view | Grid view
   - Active view: Blue background
   - Default: Table view

**Right Side:**

1. **Bulk Actions Dropdown:**
   - Button: "Aktionen" + dropdown icon
   - Visible when rows selected
   - Shows: "5 ausgewählt"
   - Actions: "E-Mail senden", "Export", "Inhaber ändern", "Status ändern", "Löschen" (red)

2. **Export Button:**
   - Icon: Download
   - Text: "Exportieren"
   - Dropdown: "CSV", "Excel", "PDF"

3. **New Customer Button:**
   - Icon: Plus
   - Text: "Neuer Kunde"
   - Variant: Primary (blue)
   - Prominent placement

**Active Filters Bar (Below Controls):**

- Appears when filters active
- Horizontal chip list:
  - "Status: Aktiv ×"
  - "Bundesland: Bayern ×"
  - "Bewertung: A ×"
- "Alle Filter entfernen" link at end
- Background: Light blue (#f0f9ff)
- Padding: 12px

**Data Table:**

**Table Header:**

- Background: Light gray (#f9fafb)
- Border-bottom: 1px solid #e5e7eb
- Sticky: Remains visible when scrolling
- Height: 48px

**Columns:**

1. **☐** (Checkbox, 48px):
   - Header: Select all checkbox
   - Rows: Individual selection
   - Selected rows: Light blue background (#e0f2fe)

2. **Firmenname** (Company Name, 250px, sortable):
   - Icon: Building (16px, gray) before name
   - Text: Company name (14px, semibold)
   - Clickable: Opens customer detail
   - Hover: Blue underline
   - Sort indicator: Arrow up/down icon
   - Example: "Hofladen Müller GmbH"

3. **USt-ID** (VAT Number, 150px):
   - Text: "DE123456789"
   - Font: Monospace for readability
   - Sortable

4. **Standort** (Location, 150px, sortable):
   - Icon: MapPin (16px, gray)
   - Text: City name
   - Tooltip on hover: Full address
   - Multiple locations: "+2 weitere" link
   - Example: "München"

5. **Status** (120px, filterable):
   - Badge: "Aktiv" (green) or "Inaktiv" (red)
   - Sortable by status
   - Default filter: Show "Aktiv" only

6. **Bewertung** (Rating, 100px, sortable):
   - Star rating: ⭐⭐⭐⭐⭐ (5 stars for A)
   - Letter badge: "A" (green), "B" (amber), "C" (gray)
   - Sortable

7. **Erstellt am** (Created, 120px, sortable):
   - Date: German format "12.10.2024"
   - Relative time on hover: "Vor 34 Tagen"
   - Default sort: Newest first

8. **Inhaber** (Owner, 150px, sortable, filterable):
   - Avatar (24px) + Name
   - Example: [MS] "M. Schmidt"
   - RBAC: ADM users see only own customers
   - GF/PLAN see all owners

9. **Aktionen** (Actions, 80px):
   - Icon buttons: Eye (view), Pencil (edit), MoreVertical (more)
   - Hidden by default, visible on row hover
   - Dropdown menu for "More": "Duplizieren", "Deaktivieren", "Löschen"

**Table Rows:**

- Height: 56px
- Padding: 12px per cell
- Border-bottom: 1px solid #f3f4f6
- Hover: Light blue background (#f0f9ff), action buttons visible
- Selected: Blue background (#e0f2fe), checkmark in checkbox
- Zebra striping: Optional alternating row colors

**Sample Rows:**

1. ☐ | Hofladen Müller GmbH | DE123456789 | München (+2) | Aktiv | A ⭐⭐⭐⭐⭐ | 12.10.2024 | M. Schmidt | [Actions]
2. ☐ | REWE Köln Süd | DE987654321 | Köln | Aktiv | A ⭐⭐⭐⭐⭐ | 08.11.2024 | A. Weber | [Actions]
3. ☐ | Biomarkt Heidelberg | DE555666777 | Heidelberg | Inaktiv | B ⭐⭐⭐ | 01.09.2024 | T. Fischer | [Actions]

**Empty State (No Customers):**

- Centered in table area
- Icon: Users (120px, gray)
- Heading: "Noch keine Kunden vorhanden"
- Description: "Beginnen Sie mit dem Hinzufügen Ihres ersten Kunden"
- Buttons:
  - Primary: "Ersten Kunden anlegen" (blue)
  - Secondary: "Aus CSV importieren" (outlined)

**Empty State (Search/Filter No Results):**

- Icon: Search (100px, gray)
- Heading: "Keine Kunden gefunden"
- Description: "Keine Ergebnisse für '[Suchbegriff]' mit aktiven Filtern"
- Actions:
  - "Filter zurücksetzen"
  - "Neue Suche starten"

**Bulk Selection Bar:**

- Appears above table when rows selected
- Background: Blue (#eff6ff)
- Border: 1px solid blue (#3b82f6)
- Left: "5 Kunden ausgewählt"
- Right: Action buttons
  - "E-Mail senden" (Mail icon)
  - "Status ändern" (dropdown)
  - "Exportieren" (Download icon)
  - "Löschen" (Trash icon, red)
- Close: "×" button to deselect all

**Filter Sheet (Slides from Right):**

**Header:**

- Title: "Filter"
- "Filter zurücksetzen" link (gray)
- Close "×"

**Filter Controls:**

1. **Status**: Checkboxes (Aktiv, Inaktiv)
2. **Bewertung**: Checkboxes (A, B, C)
3. **Bundesland**: Dropdown select
4. **Inhaber**: Multi-select (PLAN/GF only, ADM locked to self)
5. **Erstellt**: Date range picker
6. **Umsatz**: Range slider (0 - 1.000.000 €)

**Footer:**

- "X Kunden entsprechen Filtern"
- Buttons: "Abbrechen" (secondary), "Anwenden" (primary blue)

**RBAC Indicators:**

- ADM users: "Inhaber" filter disabled, locked to current user
- Filter help text: "Sie sehen nur Ihre eigenen Kunden" (ADM)
- Lock icon next to disabled filters

**Pagination (Table Footer):**

- Background: Light gray (#f9fafb)
- Left: "Zeige 1-20 von 147 Kunden"
- Center: Page numbers « 1 2 [3] 4 5 ... 8 »
- Right: "Zeilen pro Seite: 20 ▾"

**Sort Indicators:**

- Unsorted: No icon or subtle double arrow
- Ascending: Blue up arrow ↑
- Descending: Blue down arrow ↓
- Click header to toggle sort

**Quick Actions (Row Hover):**

- Eye icon: "Details anzeigen"
- Pencil icon: "Bearbeiten"
- MoreVertical: Opens menu with "Duplizieren", "E-Mail senden", "Deaktivieren", "Löschen"

**Mobile Layout:**

- Search: Full width at top
- Filter: Button opens bottom sheet
- Table: Becomes card list view
- Each customer = vertical card with key info
- Swipe left on card: Quick actions (Edit, Delete)
- No pagination: Infinite scroll or "Mehr laden"

**Keyboard Shortcuts:**

- Cmd/Ctrl+K: Focus search
- Cmd/Ctrl+N: New customer
- Cmd/Ctrl+F: Open filters
- Arrow keys: Navigate rows (when focused)
- Enter: Open selected customer
- Space: Toggle checkbox
- Delete: Delete selected (with confirmation)

**Loading State:**

- Skeleton: 8 table rows with shimmer animation
- Header remains visible
- Controls disabled during load

Design with clear RBAC indicators, efficient keyboard navigation, and responsive mobile view.

## Interaction Patterns

### Search Flow

1. User types in search: "Hofladen"
2. 300ms debounce
3. Table updates with matching results
4. Results count updates: "3 Kunden gefunden"
5. Clear search: All customers shown again

### Filter Flow

1. Click "Filter"
2. Sheet slides in from right
3. Select filter criteria
4. Live count updates: "42 Kunden entsprechen Filtern"
5. Click "Anwenden"
6. Sheet closes, table updates
7. Filter chips appear, badge shows count

### Bulk Select Flow

1. Click header checkbox: Select all visible
2. Or: Click individual checkboxes
3. Bulk action bar appears
4. Select action from dropdown
5. Confirmation dialog (for destructive actions)
6. Action executes, feedback shown

### Sort Flow

1. Click column header
2. Sort indicator updates (arrow)
3. Table re-orders rows
4. Loading indicator brief
5. Sorted data displays

## German Labels & Content

### Page Elements

- **Kunden**: Customers
- **Suchen...**: Search...
- **Filter**: Filters
- **Exportieren**: Export
- **Neuer Kunde**: New customer
- **Aktionen**: Actions

### Table Headers

- **Firmenname**: Company name
- **USt-ID**: VAT ID
- **Standort**: Location
- **Status**: Status
- **Bewertung**: Rating
- **Erstellt am**: Created on
- **Inhaber**: Owner
- **Aktionen**: Actions

### Status

- **Aktiv**: Active
- **Inaktiv**: Inactive

### Actions

- **Details anzeigen**: Show details
- **Bearbeiten**: Edit
- **Duplizieren**: Duplicate
- **Löschen**: Delete
- **X ausgewählt**: X selected

### Results

- **Zeige X-Y von Z Kunden**: Showing X-Y of Z customers
- **X Kunden gefunden**: X customers found
- **Keine Kunden gefunden**: No customers found

## Accessibility Requirements

- WCAG 2.1 AA compliance
- Table: Semantic markup, proper headers
- Sort: aria-sort attribute
- Checkboxes: aria-label for each row
- Keyboard navigation: Full support
- Focus visible: 2px blue outline
- Screen reader announces: Row count, selections, sort changes

## Mobile Considerations

- Card view instead of table
- Swipe gestures for actions
- Pull-to-refresh
- Infinite scroll or "Load more"
- Larger touch targets (48px)
- Bottom sheet for filters

## Example Data

- 147 total customers
- Page 1: Rows 1-20
- Filters: Status=Aktiv, Bundesland=Bayern
- Sorted by: Firmenname (ascending)
- ADM user "M. Schmidt" sees: 23 customers (own only)
- GF user sees: All 147 customers

## Implementation Notes

### shadcn/ui Installation

```bash
npx shadcn-ui@latest add table
npx shadcn-ui@latest add input
npx shadcn-ui@latest add button
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add pagination
```

### Component Dependencies

- Customer API with filtering, search, pagination
- RBAC context for owner filtering (ADM)
- Search debounce hook
- Sort state management
- Multi-select state

### State Management

- Customer list data (React Query)
- Search query (debounced)
- Active filters
- Sort column and direction
- Selected rows (multi-select)
- Pagination (page, page size)
- RBAC: Current user role and ID

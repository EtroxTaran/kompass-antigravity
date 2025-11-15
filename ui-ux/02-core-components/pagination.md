# Pagination - Figma Make Prompt

## Context & Purpose

- **Component Type**: Pagination Navigation
- **User Roles**: All (GF, PLAN, ADM, KALK, BUCH)
- **Usage Context**: Data tables, list views, search results
- **Business Value**: Navigate through large datasets efficiently

## Design Requirements

### Visual Hierarchy

- **Page Numbers**: Clear current page indicator
- **Navigation Arrows**: Prev/Next buttons
- **Page Size Selector**: Items per page dropdown
- **Results Count**: Total items and current range

### Layout Structure

- Height: 40px
- Centered or right-aligned
- Prev button | Page numbers | Next button
- Page size selector at right
- Results count text at left

### shadcn/ui Components

- `Pagination`, `PaginationContent`, `PaginationItem`, `PaginationLink`, `PaginationPrevious`, `PaginationNext`
- `Select` for page size

## Figma Make Prompt

Create comprehensive pagination components for KOMPASS, a German CRM application. Design pagination controls for tables and lists with page numbers, navigation, and page size options using German labels.

**Standard Pagination Bar:**

**Layout:**

- Background: Light gray (#f9fafb) or transparent
- Border-top: 1px solid #e5e7eb (if in table footer)
- Height: 56px
- Padding: 12px 24px
- 3-section layout: Left (info) | Center (navigation) | Right (page size)

**Left Section - Results Info:**

- Text: "Zeige 1-20 von 147 Kunden"
- Font: 14px, gray (#6b7280)
- Format: "Zeige [start]-[end] von [total] [entity]"

**Center Section - Page Navigation:**

- Button group: Horizontally aligned, 8px gap

1. **Previous Button:**
   - Width: 40px, height: 40px
   - Icon: ChevronLeft (20px)
   - Disabled when on first page: Gray, opacity 50%, not clickable
   - Enabled: Gray background, hover blue
   - Tooltip: "Vorherige Seite"

2. **Page Number Buttons:**
   - Size: 40x40px each
   - Font: 14px, medium weight
   - Border-radius: 6px
   - Gap: 4px between buttons
   - States:
     - Current page: Blue background (#3b82f6), white text, bold
     - Other pages: Gray text, white background, hover light gray
     - Ellipsis: "..." (not clickable, gray text)
   - Example: « 1 2 [3] 4 5 ... 10 »

3. **Next Button:**
   - Width: 40px, height: 40px
   - Icon: ChevronRight (20px)
   - Disabled when on last page: Gray, opacity 50%, not clickable
   - Enabled: Gray background, hover blue
   - Tooltip: "Nächste Seite"

**Page Number Logic:**

- Always show: First page, last page, current page
- Show: 2 pages before and after current
- Use ellipsis (...) for gaps
- Examples:
  - Total 10 pages, on page 1: [1] 2 3 4 5 ... 10
  - Total 10 pages, on page 5: 1 ... 3 4 [5] 6 7 ... 10
  - Total 10 pages, on page 10: 1 ... 6 7 8 9 [10]
  - Total 5 pages, on page 3: 1 2 [3] 4 5 (no ellipsis)

**Right Section - Page Size Selector:**

- Label: "Zeilen pro Seite:" (gray, 14px)
- Dropdown: "20 ▾"
- Options: 10, 20, 50, 100
- Width: 80px
- Clicking changes page size and resets to page 1

**Compact Pagination (Mobile):**

- Previous and Next buttons only (no page numbers)
- Text between: "Seite 3 von 10"
- Full width layout
- Larger buttons (48px) for touch
- Page size selector hidden or in separate menu

**Simple Pagination (Load More):**

- Single button: "Mehr laden" (blue, centered)
- Shows: "20 von 147 Kunden angezeigt"
- Clicking loads next 20 items
- Button disabled when all loaded: "Alle angezeigt"
- Infinite scroll alternative: Auto-loads on scroll

**First/Last Buttons (Optional):**

- Additional buttons: « (First) and » (Last)
- Position: Before Previous and after Next
- Icons: ChevronsLeft and ChevronsRight (double chevrons)
- Tooltips: "Erste Seite", "Letzte Seite"
- Use for: Very large datasets (100+ pages)

**Jump to Page Input:**

- Label: "Gehe zu Seite:"
- Input: Number field, width 60px
- Button: "Los" or Enter key
- Position: After page size selector (optional)
- Validation: 1 to max page number

**Keyboard Navigation:**

- Arrow Left: Previous page
- Arrow Right: Next page
- Numbers 1-9: Jump to pages 1-9 (if focused)
- Home: First page
- End: Last page
- Enter: Activate focused button

**Loading State:**

- Pagination disabled during data load
- Skeleton: Shimmer animation on buttons and text
- Or: Spinner overlay on pagination area

**Empty State:**

- No pagination shown when 0 results
- Or: Pagination shown but all disabled
- Text: "Keine Ergebnisse" replaces results count

**Pagination Context:**

1. **Table Footer:** Gray background, top border, spans full width
2. **Below List:** White background, no border, centered
3. **Card View:** Below cards, centered with shadow

Design with clear current page indicator and smooth page transitions.

## Interaction Patterns

### Page Navigation

1. User clicks page number
2. Loading indicator shows (optional)
3. Data fetches for new page
4. Table/list updates with new data
5. Pagination updates: New current page highlighted
6. Scroll returns to top of list

### Page Size Change

1. User clicks page size dropdown
2. Selects new size (e.g., 50)
3. Data refetches with new limit
4. Resets to page 1
5. Pagination recalculates total pages

### Next/Previous

- Click Next: Go to next page
- Click Previous: Go to previous page
- Disabled buttons: No action, cursor not-allowed

## German Labels & Content

### Pagination Text

- **Zeige X-Y von Z [Entität]**: Showing X-Y of Z [Entity]
- **Zeilen pro Seite**: Rows per page
- **Seite X von Y**: Page X of Y
- **Vorherige Seite**: Previous page
- **Nächste Seite**: Next page
- **Erste Seite**: First page
- **Letzte Seite**: Last page
- **Gehe zu Seite**: Go to page
- **Mehr laden**: Load more
- **Alle angezeigt**: All displayed

### Entities

- **Kunden**: Customers
- **Projekte**: Projects
- **Rechnungen**: Invoices
- **Aktivitäten**: Activities
- **Ergebnisse**: Results

## Accessibility Requirements

- WCAG 2.1 AA compliance
- Pagination: role="navigation", aria-label="Pagination"
- Current page: aria-current="page"
- Disabled buttons: aria-disabled="true"
- Page links: aria-label="Gehe zu Seite 3"
- Keyboard navigation functional
- Focus visible: 2px blue outline
- Screen reader announces page changes

## Mobile Considerations

- Compact pagination on mobile (<640px)
- Only Prev/Next buttons, no page numbers
- Larger touch targets (48px)
- "Load more" button preferred on mobile
- Or infinite scroll for better mobile UX
- Page size selector hidden or in settings

## Example Data

**Customer List:**

- Total: 147 customers
- Page size: 20
- Current page: 3
- Display: "Zeige 41-60 von 147 Kunden"
- Navigation: « 1 2 [3] 4 5 ... 8 »

**Search Results:**

- Total: 5 results
- Page size: 20
- Current page: 1
- Display: "Zeige 1-5 von 5 Ergebnisse"
- Navigation: [1] (only one page)

## Implementation Notes

### shadcn/ui Installation

```bash
npx shadcn-ui@latest add pagination
npx shadcn-ui@latest add select
```

### Pagination Usage

```typescript
<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" isActive>1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">2</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

### Component Dependencies

- Design tokens (colors, spacing)
- Icons from lucide-react (ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight)
- Select component for page size
- Calculation logic for page numbers and ellipsis

### State Management

- Current page state
- Page size state
- Total items count
- Total pages (calculated)
- Page change callback triggers data fetch

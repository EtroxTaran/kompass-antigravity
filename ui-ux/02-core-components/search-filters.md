# Search & Filters - Figma Make Prompt

## Context & Purpose

- **Component Type**: Search Input and Filter Components
- **User Roles**: All (GF, PLAN, ADM, KALK, BUCH)
- **Usage Context**: List views, data tables, finding records
- **Business Value**: Quick access to specific data from large datasets

## Design Requirements

### Visual Hierarchy

- **Search Input**: Prominent placement, clear search icon
- **Filter Button**: Badge showing active filter count
- **Active Filters**: Removable chips/badges
- **Results**: Live updates as user types/filters

### Layout Structure

- Search bar: Full-width or 300-400px
- Filter button: Next to search, with count badge
- Filter panel: Slide-in sheet or popover
- Active filters: Horizontal chip list below search

### shadcn/ui Components

- `Input` for search field
- `Sheet` for filter panel
- `Badge` for active filter chips
- `Checkbox`, `Select`, `DatePicker` for filter controls

## Figma Make Prompt

Create comprehensive search and filter components for KOMPASS, a German CRM application. Design search bars with autocomplete, filter panels with multiple criteria, and active filter displays with German labels.

**Global Search Bar:**

**Search Input:**

- Width: 400px (desktop), full-width (mobile)
- Height: 40px
- Border: 1px solid gray (#d1d5db)
- Border-radius: 20px (pill shape) or 6px (standard)
- Padding-left: 40px (for search icon)
- Search icon: 20px, gray, positioned at left inside input
- Placeholder: "Kunden, Projekte, Rechnungen durchsuchen..."
- Font: 14px
- Clear button: "×" (20px, gray) appears at right when text entered
- Focus: Blue border (2px, #3b82f6), subtle glow

**Search with Autocomplete:**

- Dropdown appears below input as user types
- Width: Matches input width
- Max-height: 400px, scrollable
- Background: White
- Border: 1px solid #e5e7eb
- Shadow: 0px 4px 12px rgba(0,0,0,0.15)
- Results grouped by entity type:
  - KUNDEN (header, uppercase, gray, 12px)
    - "Hofladen Müller GmbH" (with company icon)
    - "REWE Köln Süd" (with company icon)
  - PROJEKTE (header)
    - "P-2024-B023 - REWE München" (with project icon)
  - RECHNUNGEN (header)
    - "R-2024-00456 - Hofladen Müller" (with invoice icon)
- Each result: 48px height, padding 12px, hover light blue
- No results: "Keine Ergebnisse für '[query]'" message
- Footer: "Alle Ergebnisse anzeigen" link (opens full search page)

**List Search Bar (Scoped):**

- Width: 300px (desktop), full-width (mobile)
- Height: 40px
- Placeholder: "Kunden durchsuchen..."
- Search icon at left
- Clear "×" button at right
- Position: Top-left of list/table
- Real-time filtering: Results update as user types
- Debounced: 300ms delay before search triggers

**Filter Button:**

- Position: Next to search input
- Text: "Filter" + ChevronDown icon
- Height: 40px
- Variant: Outlined (default) or filled (when filters active)
- Badge: Red circle with count "3" at top-right (if filters active)
- Clicking opens filter panel

**Filter Panel (Sheet/Drawer):**

**Panel Structure:**

- Slides in from right (desktop) or bottom (mobile)
- Width: 400px (desktop), full-screen (mobile)
- Background: White
- Header:
  - Title: "Filter" (20px, bold)
  - Close "×" button at right
  - "Filter zurücksetzen" link (gray text) below title
- Content: Scrollable filter controls
- Footer:
  - "Abbrechen" button (outlined, left)
  - "Anwenden" button (blue, right)

**Filter Controls:**

1. **Status Filter (Checkboxes):**
   - Label: "Status" (14px, semibold)
   - Options:
     - ☐ Aktiv
     - ☐ Inaktiv
     - ☐ Ausstehend
   - Checkboxes: 20px, blue when checked
   - Gap: 12px between options

2. **Date Range Filter:**
   - Label: "Erstellt"
   - Two date inputs: "Von" and "Bis"
   - Date pickers: Calendar icon, opens calendar popover
   - Presets: "Heute", "Letzte 7 Tage", "Letzte 30 Tage", "Dieser Monat"

3. **Dropdown Filter (Single Select):**
   - Label: "Bundesland"
   - Dropdown: "Bundesland auswählen..."
   - Options: Bayern, Nordrhein-Westfalen, Baden-Württemberg, etc.

4. **Search Filter (Multi-Select):**
   - Label: "Inhaber"
   - Searchable multi-select: Type to filter users
   - Selected users: Chips with "×" to remove
   - Example: "M. Schmidt ×", "A. Weber ×"

5. **Range Filter (Slider):**
   - Label: "Umsatz (€)"
   - Two inputs: Min and Max
   - Or: Range slider with handles
   - Format: "0 €" to "1.000.000 €"

6. **Rating Filter (Stars/Letters):**
   - Label: "Bewertung"
   - Radio buttons or checkboxes:
     - ○ A (5 stars)
     - ○ B (3-4 stars)
     - ○ C (1-2 stars)

**Active Filters Display:**

- Position: Below search bar and filter button
- Horizontal chip list
- Each chip:
  - Background: Light blue (#e0f2fe)
  - Text: Blue (#1e40af), 12px
  - Remove "×" icon at right
  - Examples:
    - "Status: Aktiv ×"
    - "Erstellt: Letzte 7 Tage ×"
    - "Bundesland: Bayern ×"
- "Alle Filter entfernen" link at end (gray text)

**Search Results Count:**

- Position: Below active filters or above list
- Text: "147 Kunden gefunden" (bold) or "Keine Ergebnisse"
- Sorted by: Dropdown "Sortiert nach: Name ▾"

**Advanced Search (Full Page):**

- Triggered by "Erweiterte Suche" link
- Full page layout with:
  - Large search input at top
  - Multiple filter sections (expandable accordions)
  - Results list on right (live updates)
  - Filters: All available filters from panel + more
  - Save search: "Suche speichern" button
  - Recent searches: List below search input

**Saved Searches (Dropdown):**

- Dropdown next to search: "Gespeicherte Suchen"
- List of user's saved searches
- Each item: Name + edit/delete icons
- Examples:
  - "Aktive Münchner Kunden"
  - "Überfällige Rechnungen"
  - "Projekte Q4 2024"
- Clicking loads saved search criteria

**Search Shortcuts (Command Palette):**

- Trigger: Cmd+K (Mac) or Ctrl+K (Windows)
- Modal overlay: Full-screen dark backdrop
- Search box: Large, centered (600px width)
- Placeholder: "Suche oder Befehl eingeben..."
- Results: Grouped by categories (Kunden, Befehle, Einstellungen)
- Keyboard navigation: Arrow keys, Enter to select

**Mobile Search:**

- Search icon in top bar
- Clicking opens full-screen search overlay
- Large search input at top
- Filters: Button opens bottom sheet
- Results: Scrollable list below
- Back arrow to close search

Design with instant feedback, clear visual indicators for active state, and smooth animations.

## Interaction Patterns

### Search Flow

1. User clicks search input
2. Focus moves to input, keyboard appears
3. User types query
4. After 300ms debounce, search executes
5. Autocomplete results appear
6. User selects result or continues typing
7. Pressing Enter: Full search results page

### Filter Flow

1. User clicks "Filter" button
2. Filter panel slides in from right
3. User selects filter criteria
4. Live count updates: "X Ergebnisse"
5. User clicks "Anwenden"
6. Panel closes, filters apply
7. Active filter chips appear below search
8. Results update to match filters

### Clear Filter

- Click "×" on filter chip: Removes that filter
- Click "Alle Filter entfernen": Clears all
- Click "Filter zurücksetzen" in panel: Clears all

## German Labels & Content

### Search Placeholders

- **Suchen...**: Search...
- **Kunden durchsuchen...**: Search customers...
- **Alles durchsuchen...**: Search everything...
- **Suche oder Befehl eingeben...**: Enter search or command...

### Filter Labels

- **Filter**: Filters
- **Erweiterte Suche**: Advanced search
- **Filter zurücksetzen**: Reset filters
- **Alle Filter entfernen**: Remove all filters
- **Anwenden**: Apply
- **Abbrechen**: Cancel

### Filter Types

- **Status**: Status
- **Datum**: Date
- **Erstellt**: Created
- **Geändert**: Modified
- **Inhaber**: Owner
- **Bundesland**: Federal state
- **Bewertung**: Rating
- **Umsatz**: Revenue

### Results

- **X Kunden gefunden**: X customers found
- **Keine Ergebnisse**: No results
- **Sortiert nach**: Sorted by
- **Alle Ergebnisse anzeigen**: Show all results

## Accessibility Requirements

- WCAG 2.1 AA compliance
- Search input: role="searchbox", aria-label="Suche"
- Autocomplete: aria-autocomplete="list", aria-expanded
- Filter panel: role="dialog", aria-modal="true"
- Active filters: aria-label="Aktive Filter"
- Remove filter chip: aria-label="Filter [name] entfernen"
- Keyboard navigation:
  - Tab: Move through filter controls
  - Arrow keys: Navigate autocomplete results
  - Enter: Select autocomplete result
  - Escape: Close autocomplete/filter panel

## Mobile Considerations

- Full-screen search overlay on mobile
- Larger touch targets (48px) for filter controls
- Bottom sheet for filters (swipe down to close)
- Sticky search bar when scrolling results
- Voice search button option (microphone icon)
- Recent searches easily accessible

## Example Data

**Customer Search:**

- Query: "Hofladen"
- Results: "Hofladen Müller GmbH" (München), "Hofladen Schmidt KG" (Berlin)
- Filters: Status: Aktiv, Bundesland: Bayern
- Results: "42 Kunden gefunden"

**Invoice Search:**

- Query: "R-2024"
- Results: All 2024 invoices
- Filters: Status: Überfällig, Datum: Letzte 30 Tage
- Results: "8 Rechnungen gefunden"

## Implementation Notes

### shadcn/ui Installation

```bash
npx shadcn-ui@latest add input
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add select
npx shadcn-ui@latest add command
```

### Search Input

```typescript
<div className="relative">
  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
  <Input
    placeholder="Kunden durchsuchen..."
    className="pl-10"
    value={query}
    onChange={(e) => setQuery(e.target.value)}
  />
  {query && (
    <button className="absolute right-3 top-3" onClick={clearSearch}>
      <X className="h-4 w-4" />
    </button>
  )}
</div>
```

### Filter Panel

```typescript
<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">
      Filter
      {filterCount > 0 && (
        <Badge className="ml-2">{filterCount}</Badge>
      )}
    </Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Filter</SheetTitle>
    </SheetHeader>
    {/* Filter controls */}
    <SheetFooter>
      <Button variant="outline">Abbrechen</Button>
      <Button>Anwenden</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

### Component Dependencies

- Design tokens (colors, spacing)
- Icons from lucide-react (Search, Filter, X, ChevronDown)
- Debounce utility for search
- Sheet/Popover for filter panel
- Badge for active filter chips
- Command palette for keyboard shortcuts

### State Management

- Search query state
- Filter criteria state
- Active filters array
- Search results from API
- Autocomplete suggestions
- Debounced search function

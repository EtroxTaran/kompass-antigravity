# Figma Make: Contract List View (Vertrags-Übersicht)

**Purpose:** Create list view for displaying all Contracts in KOMPASS  
**Action:** Design contract list/table with GoBD indicators and project links  
**Date:** 2025-01-28

---

## 🎯 MASTER PROMPT FOR FIGMA MAKE

**Copy everything below this line and paste into Figma Make:**

---

Create a **list view for Contracts (Auftragsbestätigungen)** in KOMPASS. This page displays all contracts with filtering, sorting, and GoBD compliance indicators.

## PAGE STRUCTURE

### Header Section

1. **Page Title:** "Verträge"
2. **Breadcrumb:** Dashboard > Verträge
3. **Quick Stats (Cards above table):**
   - **Total Active Contracts:** "Aktive Verträge: **12** (1,2 Mio. €)"
   - **Completed This Quarter:** "Abgeschlossen: 5" (green)
   - **Average Contract Value:** "Ø Vertragswert: **95.000 €**"
   - **GoBD Compliance:** "100% GoBD-konform" (green checkmark)

4. **Primary Action Button (Top Right):**
   - Button: "Neuer Vertrag"
   - Style: Primary button
   - Icon: Plus icon
   - Action: Open contract creation form

---

## FILTERS & SEARCH

### Search Bar (Top Left)

- Placeholder: "Vertrag suchen... (Nummer, Kunde, Projekt)"
- Width: 300px (desktop), full width (mobile)
- Icon: Search icon (left side)
- Debounce: 300ms

### Filter Dropdowns (Below search)

1. **Status Filter**
   - Label: "Status"
   - Options: Alle, Entwurf, Unterzeichnet, In Bearbeitung, Abgeschlossen
   - Default: "Alle"
   - Multi-select: Yes

2. **Customer Filter**
   - Label: "Kunde"
   - Options: Alle + list of customers
   - Default: "Alle"
   - Searchable dropdown

3. **Project Filter**
   - Label: "Projekt"
   - Options: Alle, Mit Projekt, Ohne Projekt
   - Default: "Alle"

4. **Date Range Filter**
   - Label: "Vertragsdatum"
   - Options: Alle, Diese Woche, Dieser Monat, Dieses Quartal, Dieses Jahr, Benutzerdefiniert
   - Default: "Alle"
   - Custom: Opens date range picker

5. **Sort Dropdown**
   - Label: "Sortieren"
   - Options:
     - "Neueste zuerst" (default)
     - "Älteste zuerst"
     - "Höchster Wert"
     - "Niedrigster Wert"
     - "Kunde A-Z"
     - "Status"

6. **Clear Filters Button**
   - Text button: "Filter zurücksetzen"
   - Only visible if filters are active

---

## TABLE STRUCTURE

### Table Columns

| Column              | Width | Sort | Content                               |
| ------------------- | ----- | ---- | ------------------------------------- |
| **🔒**              | 40px  | No   | GoBD indicator (lock icon if Signed+) |
| **Vertragsnummer**  | 150px | Yes  | AB-2025-00045 (link)                  |
| **Kunde**           | 200px | Yes  | Customer name (link)                  |
| **Projekt**         | 150px | No   | Project link or "—" if none           |
| **Vertragsdatum**   | 120px | Yes  | 28.01.2025                            |
| **Leistungsbeginn** | 130px | Yes  | 05.02.2025                            |
| **Auftragswert**    | 150px | Yes  | 125.000,00 €                          |
| **Status**          | 120px | Yes  | Badge (color-coded)                   |
| **Aktionen**        | 100px | No   | Action buttons                        |

### Row Design

- **Height:** 72px (desktop), 88px (mobile)
- **Hover:** Light gray background (#f9fafb)
- **Border:** Bottom border 1px solid gray-200
- **Padding:** 16px horizontal, 16px vertical
- **GoBD-protected rows:** Light green tint (#f0fdf4) if Signed+

### GoBD Lock Icon

- **Icon:** Lock icon (16px)
- **Color:** Green (#10b981) if Signed
- **Tooltip:** "GoBD-geschützt seit [Date]"
- **Position:** First column

### Status Badges

- **Draft (Entwurf):** Yellow badge, "Entwurf"
- **Signed (Unterzeichnet):** Green badge, "Unterzeichnet" + lock icon
- **InProgress (In Bearbeitung):** Blue badge, "In Bearbeitung"
- **Completed (Abgeschlossen):** Gray badge, "Abgeschlossen"

**Badge Style:**

- Border-radius: 6px (rounded)
- Padding: 4px 12px
- Font: 14px, medium weight
- Icon: 12px lock icon (for Signed+)

### Project Link

- **If project exists:** Link text "P-2025-M001" (blue, clickable)
- **If no project:** "—" (gray dash)
- **If Signed + no project:** "Projekt erstellen" (link)

### Actions Column

**Action Buttons (Icon buttons):**

1. **View** (Eye icon)
   - Always visible
   - Opens contract detail page
   - Tooltip: "Vertrag anzeigen"

2. **Download PDF** (Download icon)
   - Visible if PDF exists
   - Downloads contract PDF
   - Tooltip: "PDF herunterladen"

3. **Edit** (Edit icon)
   - Visible if status = Draft
   - Opens contract edit form
   - Tooltip: "Vertrag bearbeiten"

4. **More Actions** (Three dots icon)
   - Dropdown menu:
     - "Als unterzeichnet markieren" (if Draft + has PDF)
     - "Projekt starten" (if Signed, no project)
     - "Projekt anzeigen" (if project exists)
     - "Als abgeschlossen markieren" (if InProgress)
     - "Kopie erstellen"
     - "Export als PDF"
     - "Löschen" (if Draft, red text)

**Icon Button Style:**

- Size: 36px × 36px
- Border-radius: 6px
- Hover: gray-100 background
- Touch target: 44px × 44px (mobile)

---

## EMPTY STATE

**If no contracts exist:**

- Icon: Document signed icon (large, gray)
- Message: "Noch keine Verträge erstellt"
- Description: "Erstellen Sie Ihren ersten Vertrag aus einem angenommenen Angebot."
- **CTA Button:** "Erster Vertrag erstellen" (primary button)

**If filtered to 0 results:**

- Icon: Search icon (gray)
- Message: "Keine Verträge gefunden"
- Description: "Versuchen Sie andere Filterkriterien."
- **Action:** "Filter zurücksetzen" button

---

## PAGINATION

- **Position:** Bottom right of table
- **Display:** "1-20 von 53 Verträgen"
- **Controls:**
  - Previous page button (disabled if page 1)
  - Page numbers (1, 2, 3, ..., 5)
  - Next page button (disabled if last page)
- **Per Page Selector:** 20, 50, 100 (dropdown)

---

## BULK ACTIONS (Optional)

- **Checkbox Column:** First column (after GoBD icon)
- **Bulk Action Bar:** Appears when items selected
  - "X Verträge ausgewählt"
  - Actions: "Export als CSV", "Export als PDF-Pack"
  - Note: No delete for Signed+ contracts
  - "Auswahl aufheben" button

---

## RESPONSIVE DESIGN

### Desktop (>1024px)

- Full table with all columns
- Filters in horizontal row
- Pagination at bottom

### Tablet (768-1024px)

- Full table, narrower columns
- Customer/Project columns truncate with ellipsis
- Filters stack in 2 rows

### Mobile (<768px)

- **Card View** instead of table
- Each contract as card:
  - Contract number (bold) + GoBD lock icon
  - Customer name
  - Project link (if exists)
  - Contract date + Start date
  - Total amount (large)
  - Status badge
  - Action buttons (bottom right)
- Filters: Collapsible accordion
- Pagination: Simplified (< 1 2 3 >)

---

## LOADING STATES

- **Initial Load:** Skeleton loaders for table rows (8 skeletons)
- **Filter Applied:** Spinner overlay on table
- **Pagination:** Spinner on page change
- **PDF Download:** Progress indicator on download button

---

## ACCESSIBILITY

- **Table:** Proper `<table>` semantic HTML
- **Headers:** `<th>` with scope="col"
- **Sort Controls:** ARIA labels ("Sortieren nach Vertragsnummer")
- **Action Buttons:** ARIA labels ("Vertrag AB-2025-00045 anzeigen")
- **Status Badges:** ARIA labels ("Status: Unterzeichnet, GoBD-geschützt")
- **GoBD Icons:** ARIA labels ("GoBD-konform finalisiert")
- **Keyboard Navigation:**
  - Tab through action buttons
  - Enter to activate
  - Arrow keys for table navigation

---

## COLOR CODING

### Status Colors

- **Draft:** #FFC107 (yellow) - Border + badge
- **Signed:** #4CAF50 (green) - Border + badge + lock icon
- **InProgress:** #2196F3 (blue) - Border + badge
- **Completed:** #9E9E9E (gray) - Border + badge

### Row Colors

- **Default:** #ffffff (white)
- **Hover:** #f9fafb (gray-50)
- **GoBD-protected (Signed+):** #f0fdf4 (green-50, subtle tint)
- **Selected:** #eff6ff (blue-50, if checkboxes enabled)

---

## SORT INDICATORS

- **Sortable Columns:** Show sort icon (↕)
- **Active Sort:** Show arrow (↑ ascending, ↓ descending)
- **Style:** Icon 16px × 16px, gray-400 (inactive), primary (active)

---

## TOOLTIPS

- **GoBD Lock Icon:** "GoBD-konform finalisiert seit [Date]"
- **Contract Value:** "Auftragswert: [Amount] inkl. MwSt."
- **Project Link:** "Projekt [Number] - [Name]" (if exists)
- **No Project:** "Kein Projekt zugeordnet" (if Signed)
- **PDF Available:** "PDF verfügbar (3,2 MB)"
- **No PDF:** "Kein PDF hochgeladen"

---

## FINANCIAL SUMMARY (Bottom)

**Summary Bar (Above pagination):**

- **Total Contracts:** "53 Verträge"
- **Total Value:** "Gesamtwert: **5.625.000,00 €**"
- **Active Value:** "Aktive Verträge: **1.200.000,00 €** (12 Verträge)"
- **Completed Value:** "Abgeschlossen: **4.425.000,00 €** (41 Verträge)"

**Style:**

- Background: Light blue (#eff6ff)
- Border-top: 2px solid primary blue
- Padding: 16px
- Font: 16px, semibold

---

## GERMAN LABELS

- "Verträge" (Contracts)
- "Vertragsnummer" (Contract Number)
- "Kunde" (Customer)
- "Projekt" (Project)
- "Vertragsdatum" (Contract Date)
- "Leistungsbeginn" (Start Date)
- "Auftragswert" (Contract Value)
- "Status" (Status)
- "Aktionen" (Actions)
- "Neuer Vertrag" (New Contract)
- "Vertrag suchen..." (Search contracts...)
- "Filter zurücksetzen" (Reset filters)
- "GoBD-geschützt" (GoBD-protected)
- "Export als CSV" (Export as CSV)
- "Herunterladen" (Download)
- "Bearbeiten" (Edit)
- "Löschen" (Delete)
- "von" (of, e.g., "1-20 von 53")

---

## FIGMA COMPONENTS

- shadcn/ui Table (table structure)
- shadcn/ui Button (action buttons)
- shadcn/ui Badge (status badges)
- shadcn/ui Input (search field)
- shadcn/ui Select (filter dropdowns)
- shadcn/ui Card (summary cards, mobile view, stats cards)
- shadcn/ui DropdownMenu (more actions menu)
- shadcn/ui Skeleton (loading states)
- shadcn/ui Pagination (bottom pagination)
- shadcn/ui Tooltip (hover help text)
- Lock icon (Lucide React: Lock)

---

## PERFORMANCE

- **Virtual Scrolling:** Enable if >100 contracts
- **Lazy Load PDF Metadata:** Defer PDF info until needed
- **Debounced Search:** 300ms delay
- **Cached Filters:** Remember last filter state in session

---

## QUALITY CHECKLIST

After implementing, verify:

- [ ] All columns sortable (except GoBD icon, Actions)
- [ ] Filters work correctly (status, customer, project, date)
- [ ] Search finds contracts by number, customer, project
- [ ] Status badges show correct colors
- [ ] GoBD lock icon shows for Signed+ contracts
- [ ] Action buttons show based on status
- [ ] PDF download works
- [ ] Links to customer/project work
- [ ] Financial summary calculates correctly
- [ ] Mobile view switches to cards
- [ ] Pagination works correctly
- [ ] Empty state shows when no contracts
- [ ] German labels are correct
- [ ] Currency formatting is German (1.234,56 €)
- [ ] Date formatting is German (DD.MM.YYYY)
- [ ] Loading skeletons show during initial load
- [ ] Quick stats calculate correctly
- [ ] GoBD-protected rows have subtle green tint

---

**Total Columns:** 9  
**Filter Options:** 5  
**Special Features:** GoBD indicators, Project links, Financial summary, Quick stats, Mobile card view

---

END OF PROMPT

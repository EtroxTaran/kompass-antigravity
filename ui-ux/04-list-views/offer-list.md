# Figma Make: Offer List View (Angebots-Übersicht)

**Purpose:** Create list view for displaying all Offers in KOMPASS  
**Action:** Design offer list/table with filtering and sorting  
**Date:** 2025-01-28

---

## 🎯 MASTER PROMPT FOR FIGMA MAKE

**Copy everything below this line and paste into Figma Make:**

---

Create a **list view for Offers (Angebote)** in KOMPASS. This page displays all offers with filtering, sorting, and quick actions.

## PAGE STRUCTURE

### Header Section

1. **Page Title:** "Angebote"
2. **Breadcrumb:** Dashboard > Angebote
3. **Quick Stats (Cards above table):**
   - **Total Pipeline Value:** "Angebotssumme Gesamt: **125.000,00 €**" (all offers)
   - **Open Offers:** "15 offen" (Draft + Sent status)
   - **Accepted This Month:** "8 angenommen" (green)
   - **Conversion Rate:** "53% Conversion-Rate" (Accepted / Total)

4. **Primary Action Button (Top Right):**
   - Button: "Neues Angebot"
   - Style: Primary button
   - Icon: Plus icon
   - Action: Open offer creation form

---

## FILTERS & SEARCH

### Search Bar (Top Left)
- Placeholder: "Angebot suchen... (Nummer, Kunde, Titel)"
- Width: 300px (desktop), full width (mobile)
- Icon: Search icon (left side)
- Debounce: 300ms

### Filter Dropdowns (Below search)

1. **Status Filter**
   - Label: "Status"
   - Options: Alle, Entwurf, Versendet, Angenommen, Abgelehnt
   - Default: "Alle"
   - Multi-select: No

2. **Customer Filter**
   - Label: "Kunde"
   - Options: Alle + list of customers
   - Default: "Alle"
   - Multi-select: No
   - Searchable dropdown

3. **Date Range Filter**
   - Label: "Datum"
   - Options: Alle, Diese Woche, Dieser Monat, Dieses Quartal, Dieses Jahr, Benutzerdefiniert
   - Default: "Alle"
   - Custom: Opens date range picker

4. **Sort Dropdown**
   - Label: "Sortieren"
   - Options:
     - "Neueste zuerst" (default)
     - "Älteste zuerst"
     - "Höchster Wert"
     - "Niedrigster Wert"
     - "Kunde A-Z"
     - "Status"

5. **Clear Filters Button**
   - Text button: "Filter zurücksetzen"
   - Only visible if filters are active

---

## TABLE STRUCTURE

### Table Columns

| Column | Width | Sort | Content |
|--------|-------|------|---------|
| **Angebotsnummer** | 150px | Yes | A-2025-00123 (link) |
| **Kunde** | 200px | Yes | Customer name (link) |
| **Datum** | 120px | Yes | 28.01.2025 |
| **Gültig bis** | 120px | Yes | 28.02.2025 (28 Tage) |
| **Angebotssumme** | 150px | Yes | 25.000,00 € |
| **Status** | 120px | Yes | Badge (color-coded) |
| **Aktionen** | 100px | No | Action buttons |

### Row Design

- **Height:** 64px (desktop), 80px (mobile)
- **Hover:** Light gray background (#f9fafb)
- **Border:** Bottom border 1px solid gray-200
- **Padding:** 16px horizontal, 12px vertical

### Status Badges

- **Draft (Entwurf):** Yellow badge, "Entwurf"
- **Sent (Versendet):** Blue badge, "Versendet"
- **Accepted (Angenommen):** Green badge, "Angenommen"
- **Rejected (Abgelehnt):** Red badge, "Abgelehnt"

**Badge Style:**
- Border-radius: 6px (rounded)
- Padding: 4px 12px
- Font: 14px, medium weight

### Actions Column

**Action Buttons (Icon buttons):**

1. **View** (Eye icon)
   - Always visible
   - Opens offer detail page
   - Tooltip: "Angebot anzeigen"

2. **Download PDF** (Download icon)
   - Visible if PDF exists
   - Downloads offer PDF
   - Tooltip: "PDF herunterladen"

3. **Edit** (Edit icon)
   - Visible if status = Draft
   - Opens offer edit form
   - Tooltip: "Angebot bearbeiten"

4. **More Actions** (Three dots icon)
   - Dropdown menu:
     - "Als versendet markieren" (if Draft)
     - "Angebot annehmen" (if Sent)
     - "Angebot ablehnen" (if Sent)
     - "In Vertrag umwandeln" (if Accepted)
     - "Kopie erstellen"
     - "Löschen" (if Draft, red text)

**Icon Button Style:**
- Size: 36px × 36px
- Border-radius: 6px
- Hover: gray-100 background
- Touch target: 44px × 44px (mobile)

---

## EMPTY STATE

**If no offers exist:**
- Icon: Document icon (large, gray)
- Message: "Noch keine Angebote erstellt"
- Description: "Erstellen Sie Ihr erstes Angebot, um Verkaufschancen zu verfolgen."
- **CTA Button:** "Erstes Angebot erstellen" (primary button)

**If filtered to 0 results:**
- Icon: Search icon (gray)
- Message: "Keine Angebote gefunden"
- Description: "Versuchen Sie andere Filterkriterien."
- **Action:** "Filter zurücksetzen" button

---

## PAGINATION

- **Position:** Bottom right of table
- **Display:** "1-20 von 47 Angeboten"
- **Controls:**
  - Previous page button (disabled if page 1)
  - Page numbers (1, 2, 3, ..., 5)
  - Next page button (disabled if last page)
- **Per Page Selector:** 20, 50, 100 (dropdown)

---

## BULK ACTIONS (Optional)

- **Checkbox Column:** First column (optional feature)
- **Bulk Action Bar:** Appears when items selected
  - "X Angebote ausgewählt"
  - Actions: "Export als CSV", "Löschen" (Draft only)
  - "Auswahl aufheben" button

---

## RESPONSIVE DESIGN

### Desktop (>1024px)
- Full table with all columns
- Filters in horizontal row
- Pagination at bottom

### Tablet (768-1024px)
- Full table, narrower columns
- Customer column truncates with ellipsis
- Filters stack in 2 rows

### Mobile (<768px)
- **Card View** instead of table
- Each offer as card:
  - Offer number (bold)
  - Customer name
  - Date + Valid until
  - Total amount (large)
  - Status badge
  - Action buttons (bottom right)
- Filters: Collapsible accordion
- Pagination: Simplified (< 1 2 3 >)

---

## LOADING STATES

- **Initial Load:** Skeleton loaders for table rows (5 skeletons)
- **Filter Applied:** Spinner overlay on table
- **Pagination:** Spinner on page change

---

## ACCESSIBILITY

- **Table:** Proper `<table>` semantic HTML
- **Headers:** `<th>` with scope="col"
- **Sort Controls:** ARIA labels ("Sortieren nach Angebotsnummer")
- **Action Buttons:** ARIA labels ("Angebot A-2025-00123 anzeigen")
- **Status Badges:** ARIA labels ("Status: Versendet")
- **Keyboard Navigation:**
  - Tab through action buttons
  - Enter to activate
  - Arrow keys for table navigation

---

## COLOR CODING

### Status Colors
- **Draft:** #FFC107 (yellow) - Border + badge
- **Sent:** #2196F3 (blue) - Border + badge
- **Accepted:** #4CAF50 (green) - Border + badge
- **Rejected:** #F44336 (red) - Border + badge

### Row Colors
- **Default:** #ffffff (white)
- **Hover:** #f9fafb (gray-50)
- **Selected:** #eff6ff (blue-50, if checkboxes enabled)

---

## SORT INDICATORS

- **Sortable Columns:** Show sort icon (↕)
- **Active Sort:** Show arrow (↑ ascending, ↓ descending)
- **Style:** Icon 16px × 16px, gray-400 (inactive), primary (active)

---

## TOOLTIPS

- **Valid Until:** "Gültig bis [Date] ([X] Tage verbleibend)"
- **Overdue Offers:** "Abgelaufen seit [X] Tagen" (red tooltip)
- **PDF Available:** "PDF verfügbar (2,5 MB)"
- **No PDF:** "Kein PDF hochgeladen"

---

## GERMAN LABELS

- "Angebote" (Offers)
- "Angebotsnummer" (Offer Number)
- "Kunde" (Customer)
- "Datum" (Date)
- "Gültig bis" (Valid Until)
- "Angebotssumme" (Offer Amount)
- "Status" (Status)
- "Aktionen" (Actions)
- "Neues Angebot" (New Offer)
- "Angebot suchen..." (Search offers...)
- "Filter zurücksetzen" (Reset filters)
- "Export als CSV" (Export as CSV)
- "Herunterladen" (Download)
- "Bearbeiten" (Edit)
- "Löschen" (Delete)
- "von" (of, e.g., "1-20 von 47")

---

## FIGMA COMPONENTS

- shadcn/ui Table (table structure)
- shadcn/ui Button (action buttons)
- shadcn/ui Badge (status badges)
- shadcn/ui Input (search field)
- shadcn/ui Select (filter dropdowns)
- shadcn/ui Card (summary cards, mobile view)
- shadcn/ui DropdownMenu (more actions menu)
- shadcn/ui Skeleton (loading states)
- shadcn/ui Pagination (bottom pagination)
- shadcn/ui Tooltip (hover help text)

---

## PERFORMANCE

- **Virtual Scrolling:** Enable if >100 offers
- **Lazy Load Images:** Defer PDF thumbnail generation
- **Debounced Search:** 300ms delay
- **Cached Filters:** Remember last filter state in session

---

## QUALITY CHECKLIST

After implementing, verify:
- [ ] All columns sortable (except Actions)
- [ ] Filters work correctly (status, customer, date)
- [ ] Search finds offers by number, customer, title
- [ ] Status badges show correct colors
- [ ] Action buttons show based on status
- [ ] PDF download works
- [ ] Links to customer/opportunity work
- [ ] Mobile view switches to cards
- [ ] Pagination works correctly
- [ ] Empty state shows when no offers
- [ ] German labels are correct
- [ ] Currency formatting is German (1.234,56 €)
- [ ] Date formatting is German (DD.MM.YYYY)
- [ ] Loading skeletons show during initial load
- [ ] Quick stats calculate correctly

---

**Total Columns:** 7  
**Filter Options:** 4  
**Special Features:** Status badges, PDF indicators, Quick stats, Mobile card view

---

END OF PROMPT


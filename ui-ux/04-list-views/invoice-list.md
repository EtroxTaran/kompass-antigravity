# Invoice List View - Figma Make Prompt

## Context & Purpose
- **Component Type**: Financial Data Table with GoBD Compliance
- **User Roles**: GF (all), BUCH (all), PLAN (limited), ADM (read-only)
- **Usage Context**: Manage invoices, track payments, monitor overdue
- **Business Value**: Revenue tracking, payment monitoring, GoBD audit compliance

## Design Requirements

### Visual Hierarchy
- **Invoice Number**: GoBD-compliant, prominent link
- **Payment Status**: Color-coded badges (Paid=green, Overdue=red, Pending=amber)
- **Amount**: Large, bold financial figures
- **Immutability Indicators**: Lock icon for finalized invoices
- **Overdue Highlight**: Red row background for overdue invoices

### Layout Structure
- Full-width table
- Row height: 64px (taller for financial data)
- Sticky header
- Financial summary cards at top
- Filter by status, customer, date range

### shadcn/ui Components
- `Table` with financial data
- `Badge` for status
- `Card` for summary KPIs
- Lock icon for immutable invoices
- `Popover` for quick actions

## Figma Make Prompt

Create a comprehensive invoice list view for KOMPASS, a German CRM application. Design a table displaying GoBD-compliant invoices with payment status, amounts, due dates, and immutability indicators using German financial formatting.

**Financial Summary Cards (Top):**
4 KPI cards:
1. **Gesamtumsatz**: "€ 2.450.000" (large, green) | "Dieses Jahr"
2. **Offene Rechnungen**: "€ 185.000" (large, amber) | "23 Rechnungen"
3. **Überfällige**: "€ 42.000" (large, red) | "5 Rechnungen"
4. **Durchschn. Zahlungsziel**: "28 Tage" | "Mittelwert"

**Controls Bar:**
- Search: "Rechnungen durchsuchen..."
- Filters: "Status", "Kunde", "Datum", "Betrag"
- Quick filters: "Überfällig" (red button), "Unbezahlt" (amber button)
- Export: "Exportieren" → "CSV", "Excel", "DATEV"
- New: "Neue Rechnung" (blue)

**Invoice Table:**

**Columns:**

1. **Rechnungsnr.** (Invoice Number, 140px, sortable):
   - Format: "R-2024-00456"
   - Font: Monospace, bold
   - Link: Blue, opens invoice detail
   - Lock icon: If finalized (gray lock, 14px)
   - GoBD indicator: Subtle "GoBD" badge

2. **Kunde** (Customer, 200px, sortable):
   - Company name with building icon
   - VAT number below (gray, 12px)
   - Example: "Hofladen Müller GmbH" | "DE123456789"

3. **Rechnungsdatum** (Invoice Date, 120px, sortable):
   - German format: "15.11.2024"
   - Default sort: Newest first

4. **Fälligkeitsdatum** (Due Date, 120px, sortable):
   - German format: "15.12.2024"
   - Overdue: Red text with alert icon
   - Due soon (<7 days): Amber text
   - Paid: Green text (strikethrough)

5. **Betrag** (Amount, 140px, sortable):
   - Large font: 16px, bold
   - Format: "€ 63.546,00" (German number format)
   - Right-aligned
   - Tooltip: "Netto: € 53.400 | MwSt.: € 10.146"

6. **Status** (120px, filterable):
   - Badge with icon:
     - "Entwurf" (gray, File icon) - Not finalized
     - "Ausstehend" (amber, Clock icon) - Finalized, awaiting payment
     - "Bezahlt" (green, CheckCircle icon) - Payment received
     - "Überfällig" (red, AlertCircle icon) - Past due date
     - "Teilweise bezahlt" (blue, CircleHalf icon)
     - "Storniert" (gray, XCircle icon)

7. **Bezahlt** (Paid, 120px):
   - Amount paid: "€ 63.546,00" (green if full, amber if partial, gray if none)
   - Or: "€ 30.000 / € 63.546" (partial payment)
   - Payment date below: "Bezahlt am: 10.12.2024" (small, gray)

8. **Projekt** (Project, 120px, filterable):
   - Project number link: "P-2024-B023"
   - Or: "—" if no project
   - Clicking navigates to project

9. **Aktionen** (Actions, 80px):
   - Eye: View PDF
   - Download: Download PDF
   - Mail: Send invoice
   - MoreVertical: More actions
   - Menu: "Drucken", "Zahlung buchen", "Mahnung", "Stornieren", "Duplizieren"

**Row States:**

1. **Default (Pending Payment):**
   - White background
   - All fields visible

2. **Overdue (Payment Late):**
   - Light red background (#fee2e2)
   - Red text for due date
   - Alert icon in status badge
   - Bold amount

3. **Paid:**
   - Light green background (#d1fae5) (optional, subtle)
   - Green status badge
   - Strikethrough due date

4. **Draft:**
   - Light gray background (#f9fafb)
   - Gray "Entwurf" badge
   - Edit icon prominent (not locked yet)

5. **Hover:**
   - Light blue background (#f0f9ff)
   - Action buttons visible

**Immutability Indicators:**
- Lock icon next to finalized invoice numbers
- Tooltip: "Abgeschlossene Rechnung (GoBD-konform, unveränderlich)"
- Attempting edit: Opens info dialog explaining immutability
- "Änderungsprotokoll anzeigen" link for finalized invoices

**Payment Tracking:**
- Partial payment indicator: Progress bar showing paid portion
- Multiple payments: Expandable row showing payment history
- Payment dates: Listed below status
- Example: "€ 30.000 (10.12) + € 33.546 (15.12) = € 63.546"

**Quick Actions Popover:**
- Hover/click invoice number or amount
- Popover shows:
  - Customer info
  - Payment status
  - Items count: "5 Positionen"
  - Quick actions: "PDF anzeigen", "E-Mail senden", "Zahlung buchen"

**Bulk Actions:**
- Select multiple invoices (checkbox)
- Actions: "Mahnungen versenden", "DATEV exportieren", "Als bezahlt markieren", "Drucken"

**Empty State:**
- Icon: FileText (120px)
- Heading: "Noch keine Rechnungen erstellt"
- Description: "Erstellen Sie Ihre erste Rechnung oder importieren Sie bestehende Rechnungen"
- Buttons: "Erste Rechnung erstellen", "Rechnungen importieren"

**Mobile Layout:**
- Card view (not table)
- Each invoice = card showing: Number, customer, amount, status badge, due date
- Tap to expand: Full details
- Swipe left: Quick actions (View, Email, Pay)
- Filter: Bottom sheet
- Overdue invoices: Red left border accent

Design with clear payment status, prominent amounts, and GoBD compliance indicators.

## Interaction Patterns

### View Invoice
1. Click invoice number
2. Opens invoice detail (immutable view if finalized)
3. Shows line items, calculations, payment history
4. Actions: PDF, Email, Payment

### Payment Booking
1. Click "Zahlung buchen" in actions
2. Dialog opens: Amount, date, method
3. Enter payment details
4. Save
5. Status updates, paid amount updates
6. If full payment: Status → "Bezahlt" (green)

### Send Reminder (Mahnung)
1. Click "Mahnung senden" in actions
2. Dialog: Email template with reminder text
3. Shows: Days overdue, outstanding amount
4. Send email
5. Log activity automatically

### Status Filter
- Click status badge in filter bar
- Table filters to show only that status
- Badge in filter button: Count of active filters

## German Labels & Content

### Columns (See above)

### Status Values
- **Entwurf**: Draft
- **Ausstehend**: Pending
- **Bezahlt**: Paid
- **Überfällig**: Overdue
- **Teilweise bezahlt**: Partially paid
- **Storniert**: Cancelled

### Actions
- **PDF anzeigen**: View PDF
- **Herunterladen**: Download
- **Per E-Mail senden**: Send via email
- **Zahlung buchen**: Book payment
- **Mahnung senden**: Send reminder
- **Drucken**: Print
- **Stornieren**: Cancel
- **Duplizieren**: Duplicate

### Summary
- **Gesamtumsatz**: Total revenue
- **Offene Rechnungen**: Open invoices
- **Überfällige**: Overdue
- **Bezahlt am**: Paid on

### Filters
- **Status**: Status
- **Kunde**: Customer
- **Datum**: Date
- **Betrag**: Amount
- **Projekt**: Project

## Accessibility Requirements
- WCAG 2.1 AA compliance
- Financial data: Right-aligned, clear formatting
- Status badges: Not color-only (icons + text)
- Lock icons: aria-label="Abgeschlossene Rechnung"
- Keyboard navigation: Full table support
- Screen reader: Announces overdue status

## Mobile Considerations
- Card view with key info
- Red left border for overdue
- Large amount display
- Prominent status badge
- Quick actions: View, Pay, Email
- Pull-to-refresh for updates

## Example Data

**Sample Invoices:**
1. R-2024-00456 | Hofladen Müller | 15.11.24 | 15.12.24 | € 63.546 | Ausstehend | € 0 | P-2024-B023
2. R-2024-00445 | REWE Köln | 08.11.24 | 08.12.24 | € 125.000 | Bezahlt | € 125.000 (Bezahlt: 05.12.24) | P-2024-A015
3. R-2024-00398 | Biomarkt HD | 15.10.24 | 14.11.24 | € 42.000 | Überfällig | € 0 | — (no project)

## Implementation Notes

### shadcn/ui Installation
```bash
npx shadcn-ui@latest add table
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add popover
```

### Component Dependencies
- Invoice API with filters
- Payment tracking
- PDF generation
- Email integration
- GoBD immutability checks
- DATEV export

### State Management
- Invoice list with payment status
- Filter and sort state
- Payment booking state
- PDF view state
- Reminder sending state


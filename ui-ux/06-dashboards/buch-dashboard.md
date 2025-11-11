# BUCH Dashboard (Accountant) - Figma Make Prompt

## Context & Purpose
- **User Role**: BUCH (Buchhalter / Accountant)
- **Business Value**: Financial tracking, invoicing, payments, GoBD compliance
- **Access**: ALL financial data (invoices, payments, reports)
- **Key Focus**: Cash flow, outstanding invoices, GoBD audit trails

## Figma Make Prompt

Create a BUCH (Accountant) dashboard for KOMPASS showing financial overview, invoice status, payment tracking, GoBD compliance, and accounting reports with German labels.

**Header:**
- "Finanzen & Buchhaltung" (28px, bold)
- Period selector: "Dieses Quartal" | "Dieses Jahr" | "Custom"
- Export: "Export" button (PDF, CSV, DATEV)
- User: Avatar + "Anna Weber (BUCH)"

**KPI Cards (Top Row - 4 cards):**
1. **Offene Forderungen**
   - Value: "€ 420.000" (36px, amber)
   - Count: "28 Rechnungen"
   - Overdue: "€ 85.000 (12)" (red badge)
   
2. **Liquidität**
   - Cash: "€ 850.000" (36px, green)
   - This month in: "€ 450.000"
   - This month out: "€ 380.000"
   
3. **Rechnungen (dieses Quartal)**
   - Created: "64" (blue)
   - Paid: "48" (green)
   - Pending: "16" (amber)
   
4. **GoBD-Status**
   - Compliant: "✓ 100%" (green)
   - Last audit: "15.10.2024"
   - Next: "15.01.2025"

**Section: Zahlungsübersicht (Payment Tracking)**
- **Fälligkeiten Timeline (Visual):**
  - X-axis: This week, Next week, Next 30 days, Later
  - Y-axis: € value
  - Bars: Amount due in each period
  - Colors: Red (overdue), Amber (this week), Blue (future)
  
- **Überfällige Rechnungen (Alert Cards):**
  - List of overdue invoices
  - Each card: Invoice number, customer, amount, days overdue
  - Actions: "Mahnung senden", "Zahlung buchen", "Kontakt"
  - Example: "R-2024-00345, Hofladen Müller, € 12.500, 15 Tage überfällig, [Mahnung senden]"

**Section: Rechnungen (Invoice List)**
- Table with filters and search
- Columns: Rechnungsnr., Kunde, Datum, Fälligkeit, Betrag, Status, GoBD, Aktionen
- Rows: All invoices
- Status badges: "Bezahlt" (green), "Ausstehend" (amber), "Überfällig" (red), "Entwurf" (gray)
- GoBD icon: Lock (finalized), Unlock (draft)
- Actions: "Details", "PDF", "Zahlung buchen", "Mahnung"
- Filters: Status, date range, customer, amount
- Sort: By due date, amount, customer
- Search: Invoice number, customer name

**Section: Cashflow-Analyse (Charts)**
- **Cashflow (Line Chart - last 12 months):**
  - X-axis: Months
  - Y-axis: € value
  - Green line: Income
  - Red line: Expenses
  - Blue area: Net cash flow
  
- **Umsatz vs. Kosten (Bar Chart - quarterly):**
  - X-axis: Quarters (Q1, Q2, Q3, Q4)
  - Y-axis: € value
  - Grouped bars: Umsatz (blue), Kosten (red), Gewinn (green)

**Section: GoBD-Compliance (Compliance Dashboard)**
- **Status-Übersicht:**
  - Finalisierte Rechnungen: "452 von 452 (100%)" (green)
  - Hash-Integrität: "✓ Alle Hashes gültig" (green)
  - Änderungsprotokolle: "124 Einträge" (info icon)
  - Backups: "Letztes Backup: Vor 2 Stunden" (green)
  
- **Audit Trail:**
  - Recent changes to financial documents
  - Each entry: Date, user, document, action, reason (if correction)
  - Example: "15.11.24 16:45, Anna Weber, R-2024-00456, Finalisiert, -"
  - Filter: Document type, user, date

- **GoBD-Berichte:**
  - Quick access to compliance reports
  - "Jahresabschluss 2024", "Quartalsberichte", "Prüfprotokoll"
  - Export buttons: PDF, DATEV

**Section: Wiederkehrende Aufgaben**
- Checklist of monthly/quarterly tasks
- Each task: Checkbox, description, due date
- Example: "☐ Umsatzsteuer-Voranmeldung Q4 - Fällig: 30.11.2024"
- Overdue: Red highlight
- Completed: Gray strikethrough

**Section: Finanzberichte (Quick Links)**
- Cards for common reports
- Each card: Icon, name, description, "Erstellen" button
- Reports: "Gewinn & Verlust", "Bilanz", "Umsatzsteuer", "DATEV-Export", "Cashflow"

**Quick Actions (Sidebar or FAB):**
- "+ Rechnung erstellen"
- "Zahlung buchen"
- "Mahnung senden"
- "Bericht erstellen"
- "DATEV exportieren"

**Mobile:** Cards stack, tables scroll horizontally, charts full-width, quick actions bottom bar

## Design Requirements

### Visual Hierarchy
1. Overdue invoices: Red alerts, prominent
2. Cash flow: Large charts
3. GoBD status: Clear compliance indicators
4. Quick actions: Accessible

### shadcn/ui Components
```bash
npx shadcn-ui@latest add card badge button table alert checkbox
# Charts: Use recharts
```

### Charts
- Line chart: Cash flow
- Bar chart: Revenue vs. costs
- Timeline: Payment due dates

### Interaction
- Click invoice: Navigate to detail
- Hover chart: Show tooltip
- Filter table: Status, date, customer
- Quick actions: Book payment, send reminder

### Accessibility
- Color + icons for status
- Keyboard navigation
- Screen reader friendly
- High contrast for financial data

### GoBD Indicators
- Lock icon: Finalized, immutable
- Hash icon: Integrity verified
- Alert icon: Compliance issues

### Example Data
- Invoice: "R-2024-00456, Hofladen Müller, 15.11.24, 15.12.24, € 63.046, Ausstehend, 🔒"
- Overdue: "R-2024-00345, REWE München, € 12.500, 15 Tage überfällig"
- Cash flow: "Q4 2024: Income € 2.45M, Expenses € 2.1M, Net € 350k"


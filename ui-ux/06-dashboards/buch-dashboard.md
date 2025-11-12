# BUCH Dashboard (Accountant) - Figma Make Prompt

## Context & Purpose
- **User Role**: BUCH (Buchhalter / Accountant)
- **Business Value**: Financial tracking via offers/contracts, Lexware integration, GoBD compliance
- **Access**: ALL financial data (offers, contracts, project costs, reports)
- **Key Focus**: Contract values, project costs, margins, budget tracking
- **Note:** Invoicing happens in Lexware, not KOMPASS

## Figma Make Prompt

Create a BUCH (Accountant) dashboard for KOMPASS showing financial tracking via offers/contracts, project costs, margins, and optional Lexware integration status with German labels.

**Header:**
- "Finanzen & Projekt-Controlling" (28px, bold)
- Period selector: "Dieses Quartal" | "Dieses Jahr" | "Custom"
- Export: "Export" button (PDF, CSV)
- User: Avatar + "Anna Weber (BUCH)"
- **Note:** "Rechnungswesen in Lexware"

**KPI Cards (Top Row - 4 cards):**
1. **Aktive Vertragswerte**
   - Value: "€ 1.250.000" (36px, blue)
   - Count: "12 aktive Verträge"
   - This quarter: "+3 neue Verträge" (green)
   
2. **Projektmargen**
   - Average margin: "28,5%" (36px, green)
   - Target: "30% Ziel"
   - Best project: "Projekt A: 42%" (link)
   - Worst project: "Projekt C: 12%" (link, yellow warning)
   
3. **Pipeline-Value (Angebote)**
   - Open offers: "€ 350.000" (36px, amber)
   - Count: "15 offene Angebote"
   - Conversion rate: "53% (8 angenommen)"
   
4. **GoBD-Status (Verträge)**
   - Compliant: "✓ 100%" (green)
   - Protected contracts: "12 von 12"
   - Last audit: "15.10.2024"

**Section: Vertragsstatus (Contract Status Overview)**
- **Vertragsverteilung (Visual - Pie Chart):**
  - Signed (Unterzeichnet): 5 contracts (green)
  - InProgress (In Bearbeitung): 7 contracts (blue)
  - Completed (Abgeschlossen): 32 contracts (gray)
  
- **Budget-Warnungen (Alert Cards):**
  - List of projects with budget issues
  - Each card: Project number, contract value, actual costs, margin%
  - Actions: "Projekt anzeigen", "Kosten analysieren"
  - Example: "P-2025-M003, Vertragswert € 85.000, Ist-Kosten € 78.500 (92%), Marge: 7,6% (ROT - unter Ziel 20%)"

**Section: Aktive Verträge (Contract List)**
- Table with filters and search
- Columns: Vertragsnr., Kunde, Projekt, Vertragswert, Ist-Kosten, Marge%, Status, GoBD, Aktionen
- Rows: All active contracts (Signed + InProgress)
- Status badges: "Unterzeichnet" (green), "In Bearbeitung" (blue), "Abgeschlossen" (gray)
- GoBD icon: Lock (Signed+)
- Margin color coding: Green (>20%), Yellow (10-20%), Red (<10%)
- Actions: "Details", "PDF anzeigen", "Projekt anzeigen"
- Filters: Status, customer, date range, margin%
- Sort: By contract date, value, margin
- Search: Contract number, customer name, project number

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
- "+ Neues Angebot erstellen"
- "+ Neuer Vertrag erstellen"
- "Finanzberichte erstellen"
- "Export (CSV/PDF)"
- "Zu Lexware wechseln" (external link)

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


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
- **AI Toggle:** Switch "KI-Features" (top-right, default OFF until Phase 3)

**KPI Cards (Top Row - 6 cards):**
1. **Aktive Vertragswerte**
   - Value: "€ 1.250.000" (36px, blue)
   - Count: "12 aktive Verträge"
   - This quarter: "+3 neue Verträge" (green)
   - **[Phase 3]** AI Trend: "📈 +12% bis Jahresende" (purple badge)
   
2. **Projektmargen**
   - Average margin: "28,5%" (36px, green)
   - Target: "30% Ziel"
   - Best project: "Projekt A: 42%" (link)
   - Worst project: "Projekt C: 12%" (link, yellow warning)
   - **[Phase 3]** AI Alert: "⚠️ 3 Projekte unter 15% Marge" (amber pulse)
   
3. **Pipeline-Value (Angebote)**
   - Open offers: "€ 350.000" (36px, amber)
   - Count: "15 offene Angebote"
   - Conversion rate: "53% (8 angenommen)"
   - **[Phase 3]** AI Prediction: "🎯 85% Wahrscheinlichkeit für €150k" (purple)
   
4. **GoBD-Status (Verträge)**
   - Compliant: "✓ 100%" (green)
   - Protected contracts: "12 von 12"
   - Last audit: "15.10.2024"
   - **Next audit:** "in 7 Tagen" (info)
   
5. **Ausgaben-Tracking (NEU)**
   - This month: "€ 45.250" (36px, orange)
   - YoY change: "-8% vs. Vorjahr" (green)
   - Pending receipts: "12 Belege offen" (badge)
   - **[Phase 3]** AI Insight: "🔍 Ungewöhnliche Reisekosten" (purple)
   
6. **Cashflow-Prognose (NEU)**
   - 30-day forecast: "€ 285.000" (36px, green)
   - Risk level: "Niedrig" (green badge)
   - Critical date: "15.12. (Großzahlung)"
   - **[Phase 3]** AI Confidence: "92% Genauigkeit" (purple)

**Section: Vertragsstatus (Contract Status Overview)**
- **Vertragsverteilung (Visual - Pie Chart):**
  - Signed (Unterzeichnet): 5 contracts (green)
  - InProgress (In Bearbeitung): 7 contracts (blue)
  - Completed (Abgeschlossen): 32 contracts (gray)
  - **[Phase 3]** AI Enhancement: Hover shows predicted completion dates
  
- **Budget-Warnungen (Alert Cards):**
  - List of projects with budget issues
  - Each card: Project number, contract value, actual costs, margin%
  - **[Phase 3]** AI Risk Score: "🔴 Hoch" / "🟡 Mittel" / "🟢 Niedrig"
  - Actions: "Projekt anzeigen", "Kosten analysieren"
  - **[Phase 3]** Action: "AI-Empfehlung" - only if toggle ON
  - Example base: "P-2025-M003, Vertragswert € 85.000, Ist-Kosten € 78.500 (92%), Marge: 7,6% (ROT - unter Ziel 20%)"
  - **[Phase 3]** AI extension: "🔴 AI: Kostenüberschreitung in 2 Wochen" - only if toggle ON

**Section: KI-gestützte Finanzanalyse [Phase 3] (NEU)**
- **Visibility:** Hidden by default. Requires AI toggle ON + data requirements met
- **Data Requirement:** 6+ months expense data, 12+ months invoice/payment data
- **See:** [AI Data Requirements](../../docs/specifications/AI_DATA_REQUIREMENTS.md)

- **[Phase 3] Anomalie-Erkennung (Card Grid):**
  - Title: "Auffälligkeiten diese Woche"
  - Card 1: "🚨 Ungewöhnliche Ausgaben"
    - "Reisekosten +250% vs. Durchschnitt"
    - "Projekt P-2025-M005"
    - Action: "Details prüfen"
    - **Confidence:** "92%" | **Explainability:** "Warum?"
  - Card 2: "⏰ Zahlungsverzug-Risiko"
    - "3 Kunden mit Zahlungshistorie-Problemen"
    - "Gesamtrisiko: € 45.000"
    - Action: "Mahnungen vorbereiten"
  - Card 3: "💡 Kosten-Optimierung"
    - "€ 12.500 Einsparpotenzial identifiziert"
    - "Hauptbereich: Externe Dienstleister"
    - Action: "Analyse ansehen"

- **[Phase 3] Prädiktive Metriken (Chart Section):**
  - **Cashflow-Vorhersage (Line Chart):**
    - Current balance line (solid)
    - AI prediction line (dashed, purple) - only if toggle ON
    - Confidence bands (shaded purple)
    - Critical thresholds marked
    - **Min confidence:** Only show if ≥70%
  - **Margen-Entwicklung (Area Chart):**
    - Historical margins by project type
    - AI trend prediction overlay - only if toggle ON
    - Target margin line (green dashed)

**Section: Aktive Verträge (Enhanced Contract List)**
- Table with filters and search
- Columns: Vertragsnr., Kunde, Projekt, Vertragswert, Ist-Kosten, Marge%, **[Phase 3]** AI-Prognose, Status, GoBD, Aktionen
- Rows: All active contracts (Signed + InProgress)
- Status badges: "Unterzeichnet" (green), "In Bearbeitung" (blue), "Abgeschlossen" (gray)
- GoBD icon: Lock (Signed+)
- Margin color coding: Green (>20%), Yellow (10-20%), Red (<10%)
- **[Phase 3] AI-Prognose column (NEW):**
  - Shown only if AI toggle ON
  - "↗️ +5%" (green) - positive trend
  - "→ Stabil" (gray) - stable
  - "↘️ -8%" (red) - negative trend
  - Tooltip shows confidence and reasoning
- Actions: "Details", "PDF anzeigen", "Projekt anzeigen"
- **[Phase 3]** Action: "AI-Analyse" - only if toggle ON
- Filters: Status, customer, date range, margin%
- **[Phase 3]** Filter: "AI risk level" - only if toggle ON
- Sort: By contract date, value, margin
- **[Phase 3]** Sort: "AI prediction" - only if toggle ON
- Search: Contract number, customer name, project number
- **[Phase 3]** Row highlighting: AI-identified risks in light red background - only if toggle ON

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
  - **[Phase 3]** AI overlay: Predicted Q4 values (dashed outline) - only if toggle ON

**Section: Zeit- und Ausgabenerfassung (NEW - Integrated Tracking)**
- **Ausgaben-Übersicht (Summary Cards):**
  - Card 1: "Erfasste Ausgaben (Monat)"
    - Value: "€ 23.450"
    - Count: "145 Belege"
    - Pending: "12 ungeprüft" (amber badge)
    - **[Phase 2]** Duplicate detection: "3 Duplikate erkannt" (warning)
  
  - Card 2: "Kilometer-Tracking"
    - This month: "3.450 km"
    - Value: "€ 1.035 (0,30€/km)"
    - Vehicles: "3 Fahrzeuge"
    - **[Phase 3]** Route efficiency: "Route optimiert: -15%" (green)
  
  - Card 3: "Zeiterfassung"
    - Billable hours: "1.234h"
    - Value: "€ 98.720"
    - Utilization: "78%"
    - **[Phase 3]** Performance indicator: "5% unter Plan" (yellow)

- **Kategorien-Analyse (Donut Chart):**
  - Travel: 35% (€ 8.208)
  - Materials: 28% (€ 6.566)
  - External services: 22% (€ 5.159)
  - Other: 15% (€ 3.517)
  - **[Phase 3]** AI insight: "Reisekosten +45% vs. Vormonat" - only if toggle ON

- **Projekt-Zuordnung (Table):**
  - Columns: Projekt, Ausgaben, Kilometer, Stunden, Budget-Status
  - Example: "P-2025-M003, € 4.500, 234 km, 45h, 85% verbraucht"
  - Visual budget indicator (progress bar)
  - **[Phase 3]** AI warning: Red pulse for projects >80% budget - only if toggle ON

**Section: GoBD-Compliance (Enhanced Compliance Dashboard)**
- **Status-Übersicht:**
  - Finalisierte Rechnungen: "452 von 452 (100%)" (green)
  - Hash-Integrität: "✓ Alle Hashes gültig" (green)
  - Änderungsprotokolle: "124 Einträge" (info icon)
  - Backups: "Letztes Backup: Vor 2 Stunden" (green)
  - **[Phase 3]** AI Monitoring: "🤖 Keine Anomalien erkannt" (purple badge)
  
- **[Phase 3] AI Compliance Alerts (NEW):**
  - **Only shown:** If AI toggle ON and 6+ months compliance data
  - Card 1: "Automatische Prüfung"
    - Status: "✓ 1.245 Belege geprüft"
    - Issues: "3 fehlende Pflichtfelder"
    - Action: "Details ansehen"
  - Card 2: "Datenintegrität"
    - Status: "Alle Hashes verifiziert"
    - Next check: "in 4 Stunden"
    - Chain status: "Blockchain gesichert"
  
- **Audit Trail (Enhanced):**
  - Recent changes to financial documents
  - Each entry: Date, user, document, action, reason (if correction)
  - **[Phase 3]** AI flag: "🤖 Auto-validiert" - shown only if AI processed
  - Example: "15.11.24 16:45, Anna Weber, R-2024-00456, Finalisiert, -"
  - **[Phase 3]** Extended: "+ 🤖 Auto-validiert" if AI toggle ON
  - Filter: Document type, user, date
  - **[Phase 3]** Filter: "AI-flagged" - only if toggle ON
  - **[Phase 3]** AI insight: "Ungewöhnliche Änderungsfrequenz bei Projekt P-2025-M007" - only if toggle ON

- **GoBD-Berichte:**
  - Quick access to compliance reports
  - "Jahresabschluss 2024", "Quartalsberichte", "Prüfprotokoll"
  - Export buttons: PDF, DATEV
  - **[Phase 3] NEW:** "AI-Prüfbericht" - Automated compliance check results (only if toggle ON)

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
- "📸 Beleg scannen" (camera)
- "📊 Finanzberichte erstellen"
- "Export (CSV/PDF)"
- "Zu Lexware wechseln" (external link)
- **[Phase 3]** AI Assistant: "💬 Finanz-Assistent" (chat bubble) - only if toggle ON

**Mobile-First Enhancements:**
- **Bottom Navigation (5 tabs):**
  - "Dashboard" (grid icon) - Main view
  - "Verträge" (document icon) - Contract list
  - "📸" (camera) - Quick receipt capture
  - "Berichte" (chart icon) - Reports
  - "Mehr" (dots) - Settings/Export

- **Swipe Gestures:**
  - Swipe down: Pull to refresh data
  - Swipe left on contract: Quick actions (view, export)
  - Swipe right on alert: Mark as reviewed
  - Long press on value: Copy to clipboard

- **PWA Features:**
  - **Push Notifications:**
    - "🔴 Budget-Warnung: Projekt P-2025-M003 bei 95%"
    - "📊 Monatsabschluss bereit zur Prüfung"
    - "⚠️ 5 Belege warten auf Kategorisierung"
  - **Offline Mode:**
    - Full dashboard cached
    - Expense capture queued
    - Auto-sync when online
  - **Voice Input:**
    - "Ausgabe erfassen: 45 Euro Tanken"
    - "Zeige Cashflow diese Woche"

- **Mobile Layout Optimizations:**
  - KPI cards: 2x3 grid (swipeable if needed)
  - Charts: Full-width, touch-to-explore
  - Tables: Card view with key metrics
  - Sticky headers for sections
  - FAB for primary action (context-aware)

- **Performance:**
  - Skeleton loaders for all data
  - Progressive chart rendering
  - Image lazy loading for receipts
  - < 2s initial load on 3G

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


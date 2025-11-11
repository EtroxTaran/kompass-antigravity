# KALK Dashboard (Cost Estimator) - Figma Make Prompt

## Context & Purpose
- **User Role**: KALK (Kalkulator / Cost Estimator)
- **Business Value**: Project costing, margin analysis, estimates
- **Access**: ALL projects (read), opportunities (for estimates)
- **Key Focus**: Cost calculations, pricing, margin optimization

## Figma Make Prompt

Create a KALK (Cost Estimator) dashboard for KOMPASS showing opportunities needing estimates, active project costing, margin analysis, and pricing tools with German labels.

**Header:**
- "Kalkulation" (28px, bold)
- View: "Angebote" | "Projekte" | "Analysen"
- User: Avatar + "Stefan Bauer (KALK)"

**KPI Cards (Top Row - 4 cards):**
1. **Offene Kalkulationen**
   - Count: "8" (36px, amber)
   - Urgent: "3 fällig diese Woche" (red badge)
   - Avg. time: "2 Tage"
   
2. **Durchschnittliche Marge**
   - Percentage: "18,5%" (36px, green)
   - Trend: "+2% ↗" (vs. last quarter)
   - Target: "15% Ziel"
   
3. **Gesamtvolumen (aktuell)**
   - Value: "€ 3.200.000" (36px, blue)
   - Open estimates: "24"
   - Won: "€ 1.450.000"
   
4. **Ablehnungsrate**
   - Percentage: "15%" (36px, amber)
   - Reason: "Preis zu hoch (60%)"
   - Improve: "Kalkulation optimieren"

**Section: Anstehende Kalkulationen (Priority Queue)**
- Table with sortable columns
- Columns: Opportunity, Kunde, Wert, Fälligkeit, Priorität, Status, Aktion
- Rows: Opportunities needing estimates
- Priority badges: "Hoch" (red), "Mittel" (amber), "Normal" (blue)
- Status: "Neu", "In Bearbeitung", "Angebot erstellt", "Genehmigt"
- Actions: "Kalkulation starten", "Details", "Angebot erstellen"
- Filters: Priority, due date, customer
- Example: "REWE München - Ladeneinrichtung, € 125k, 20.11.24, Hoch, In Bearbeitung, [Kalkulation öffnen]"

**Section: Aktive Projekte - Kostenüberwachung**
- Table showing project cost tracking
- Columns: Projekt, Auftragswert, Budget, Ist-Kosten, Restbudget, Marge (%), Status
- Rows: Active projects
- Progress bars: Budget utilization (green < 80%, amber 80-100%, red > 100%)
- Alerts: Red if over budget
- Filters: Status, customer, margin health
- Example: "P-2024-B023, € 450k, € 380k, € 285k, € 95k, 15,6%, Im Rahmen"

**Section: Margenanalyse (Charts)**
- **Marge nach Projekten (Bar Chart):**
  - X-axis: Project names
  - Y-axis: Margin %
  - Bars: Color-coded (green > 15%, amber 10-15%, red < 10%)
  - Target line: 15%
  
- **Kostenverteilung (Pie Chart - Durchschnitt):**
  - Segments: Material (45%), Personal (35%), Fremdleistungen (15%), Sonstiges (5%)
  - Colors: Blue shades
  
- **Marge Trend (Line Chart - last 6 months):**
  - X-axis: Months
  - Y-axis: Margin %
  - Line: Average margin
  - Target line: 15%

**Section: Kalkulationsvorlagen**
- Quick access to templates
- Cards: "Ladeneinrichtung Standard", "Büroeinrichtung", "Gastronomie", "Custom"
- Each card: Icon, name, description, "Verwenden" button
- Create new: "+ Neue Vorlage"

**Section: Preis-Datenbank**
- Quick search for materials and services
- Search bar: "Material oder Dienstleistung suchen..."
- Recent searches: "Ladenregal, Montage pro Stunde, LED-Beleuchtung"
- Price updates: "Letzte Aktualisierung: Vor 2 Tagen"

**Section: Benötigte Genehmigungen**
- List of estimates pending GF approval (if > € 200k or margin < 10%)
- Each item: Opportunity, value, margin, reason for approval
- Actions: "Details", "GF benachrichtigen"

**Quick Actions (Sidebar or FAB):**
- "+ Neue Kalkulation"
- "Vorlage erstellen"
- "Preis-Datenbank aktualisieren"
- "Margenanalyse exportieren"

**Mobile:** Cards stack, tables scroll horizontally, charts full-width

## Design Requirements

### Visual Hierarchy
1. Priority queue: Prominent, color-coded
2. Cost tracking: Clear progress bars
3. Charts: Margin analysis
4. Templates: Quick access

### shadcn/ui Components
```bash
npx shadcn-ui@latest add card badge button table progress
# Charts: Use recharts
```

### Charts
- Bar chart: Margin by project
- Pie chart: Cost distribution
- Line chart: Margin trend

### Interaction
- Click opportunity: Open calculation form
- Hover project: Show cost breakdown
- Filter: Priority, date, margin health
- Search: Material/service prices

### Accessibility
- Color + text for margin health
- Keyboard navigation for tables
- Screen reader friendly

### Example Data
- Opportunity: "REWE München, € 125k, 20.11.24, Hoch, In Bearbeitung"
- Project: "P-2024-B023, € 450k, € 380k, € 285k, 15,6%"
- Margin: "18,5% (+2% vs. Q3)"


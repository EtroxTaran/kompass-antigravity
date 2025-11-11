# GF Dashboard (CEO/Managing Director) - Figma Make Prompt

## Context & Purpose
- **User Role**: GF (Geschäftsführer)
- **Business Value**: Strategic overview, KPIs, financial health
- **Access**: ALL data (no RBAC restrictions)
- **Key Focus**: High-level metrics, trends, decision support

## Figma Make Prompt

Create a GF (CEO) dashboard for KOMPASS showing high-level KPIs, financial overview, sales pipeline, project portfolio, and team performance with German labels and executive-focused metrics.

**Header:**
- "Dashboard" (28px, bold)
- Date range selector: "Dieses Quartal" (Q4 2024)
- Quick filters: "Alle Kunden", "Alle Projekte", "Alle Mitarbeiter"
- User: Avatar + "Dr. Schmidt (GF)"

**KPI Cards (Top Row - 4 cards):**
1. **Umsatz (aktuelles Quartal)**
   - Large value: "€ 2.450.000" (36px, blue)
   - Trend: "+15% ↗" (green) vs last quarter
   - Sparkline chart (small)
   
2. **Offene Opportunities**
   - Value: "€ 3.200.000" (36px, amber)
   - Count: "24 Opportunities"
   - Conversion rate: "42%"
   
3. **Aktive Projekte**
   - Value: "18" (36px, blue)
   - On time: "16" (green), delayed: "2" (red)
   - Progress: Small circular progress
   
4. **Liquidität**
   - Cash: "€ 850.000" (36px, green)
   - Outstanding: "€ 420.000"
   - Runway: "6 Monate"

**Section: Vertriebsübersicht (Sales Overview)**
- **Opportunity Pipeline (Visual Funnel):**
  - Stages: Neu → Qualifizierung → Angebot → Verhandlung → Gewonnen
  - Values: "€ 800k" → "€ 1.2M" → "€ 850k" → "€ 350k" → "€ 450k"
  - Conversion rates between stages
  - Color gradient: Blue to green

- **Gewinnrate (Win Rate):**
  - Large donut chart: "42% gewonnen" (green), "58% verloren/offen" (gray)
  - Total opportunities: 124
  - Won: 52, Lost: 32, Open: 40

**Section: Projektportfolio**
- **Status Distribution (Bar Chart):**
  - X-axis: "Planung", "In Arbeit", "Verzögert", "Abgeschlossen"
  - Y-axis: Count
  - Colors: Blue, amber, red, green
  
- **Budget vs. Ist (Comparison):**
  - Project names (top 5 by value)
  - Budget bars (blue) vs. Actual (green/red)
  - Margin indicators

**Section: Finanzübersicht**
- **Monatlicher Umsatz (Line Chart - last 12 months):**
  - X-axis: Months
  - Y-axis: € value
  - Blue line: Revenue
  - Green fill: Profit margin
  - Trend line

- **Offene Rechnungen (Cards):**
  - Überfällig: "€ 85.000" (red) - "12 Rechnungen"
  - Fällig (diese Woche): "€ 120.000" (amber)
  - Kommend: "€ 215.000" (blue)

**Section: Team-Performance**
- **Top-Performers (Table):**
  - Columns: Name, Rolle, Opportunities, Umsatz, Conversion Rate
  - Rows: Top 5 employees by revenue
  - Avatars, badges for roles
  - Sorting by column

- **Auslastung (Heatmap):**
  - Team members (Y-axis)
  - Weeks (X-axis)
  - Color: Green (under 80%), Amber (80-100%), Red (over 100%)

**Section: Aktivitäten & Alerts**
- Recent important activities
- Alerts: Overdue invoices, delayed projects, high-value opportunities closing soon
- Each alert: Icon, message, timestamp, action link

**Quick Actions (Sidebar or FAB):**
- "+ Neuer Kunde"
- "+ Neue Opportunity"
- "Berichte anzeigen"
- "Einstellungen"

**Mobile:** Grid cards stack, charts full-width, swipeable sections

## Design Requirements

### Visual Hierarchy
1. KPI cards: Large, bold values, trends, sparklines
2. Charts: Clear legends, axis labels, tooltips
3. Tables: Compact, sortable, clickable rows
4. Alerts: Prominent, color-coded

### shadcn/ui Components
```bash
npx shadcn-ui@latest add card badge button
# Charts: Use recharts (compatible with shadcn)
```

### Charts (recharts)
- Line chart: Umsatz trend
- Bar chart: Project status
- Donut chart: Win rate
- Funnel: Opportunity pipeline
- Heatmap: Team utilization

### Interaction Patterns
- Click KPI card: Navigate to detailed view
- Hover chart: Show tooltip with details
- Click table row: Navigate to entity detail
- Filter: Date range, customer, project

### Accessibility
- All charts have text alternatives
- Color is not the only indicator (use patterns/icons)
- Keyboard navigation for filters
- Screen reader friendly

### Example Data
- Q4 2024: "01.10.2024 - 31.12.2024"
- Umsatz: "€ 2.450.000"
- Top performer: "Michael Schmidt, ADM, 8 Opp, € 450k, 62%"


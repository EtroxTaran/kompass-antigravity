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

**AI Feature Toggle (Top-right corner):**

- Switch: "KI-Features anzeigen" (default: OFF until Phase 3 data gates passed)
- Info icon: "KI-Features erfordern Mindestdatenqualität - siehe Dokumentation"
- Link: [AI Strategy](../../docs/product-vision/AI_STRATEGY_AND_PHASING.md)

**KPI Cards (Top Row - 6 cards):**

1. **Umsatz (aktuelles Quartal)**
   - Large value: "€ 2.450.000" (36px, blue)
   - Trend: "+15% ↗" (green) vs last quarter
   - **[Phase 3]** AI prediction: "🔮 €2.8M erwartet" (purple)
   - Sparkline chart (small)
2. **Offene Opportunities**
   - Value: "€ 3.200.000" (36px, amber)
   - Count: "24 Opportunities"
   - Conversion rate: "42%"
   - **[Phase 3]** AI insight: "⚡ 3 Deals mit hoher Wahrscheinlichkeit"
3. **Aktive Projekte**
   - Value: "18" (36px, blue)
   - On time: "16" (green), delayed: "2" (red)
   - Progress: Small circular progress
   - **[Phase 3]** AI risk: "⚠️ 2 Projekte gefährdet"
4. **Liquidität**
   - Cash: "€ 850.000" (36px, green)
   - Outstanding: "€ 420.000"
   - Runway: "6 Monate"
   - **[Phase 3]** AI forecast: "📈 Positiver Cashflow nächsten Monat"
5. **Toureneffizienz**
   - Avg stops/tour: "4.2" (36px, blue)
   - Distance saved: "312 km" (green)
   - Fuel costs: "€1,247" this month
   - Trend: "+12% ↗" efficiency
6. **Offene Aufträge**
   - Value: "€ 425.000" (36px, purple)
   - Count: "23 Aufträge"
   - Avg. processing: "3.5 Tage"
   - Trend: "15% schneller"

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

- **Vertrags- und Projektumsatz (Line Chart - last 12 months):**
  - X-axis: Months
  - Y-axis: € value
  - Blue line: Vertragswerte (Contract values)
  - Green line: Abgeschlossene Projekte (Completed project revenue)
  - Gray dashed line: Durchschnittliche Marge (Average margin%)
  - Trend line

- **Financial Status (Cards):**
  - Pipeline-Value (Angebote): "€ 350.000" (amber) - "15 offene Angebote"
  - Aktive Verträge: "€ 1.250.000" (blue) - "12 Verträge"
  - Durchschnittliche Marge: "28,5%" (green if >25%, yellow if 15-25%, red if <15%)
- **Lexware Integration Status (Optional, Phase 2+):**
  - Card: "Lexware-Integration"
  - Status: "Nicht verbunden" (gray, Phase 1) OR "✓ Verbunden" (green, Phase 2+)
  - Last sync: "—" OR timestamp (Phase 2+)
  - Actions: "Lexware öffnen" (external link)

**Section: AI-gestützte Einblicke [Phase 3] (AI-Powered Insights)**

- **Visibility:** Hidden by default until Phase 3 data gates passed. Toggle: "KI-Features anzeigen"
- **Data Requirement:** 12+ months of data, 100+ completed opportunities, 50+ completed projects
- **See:** [AI Data Requirements](../../docs/specifications/AI_DATA_REQUIREMENTS.md)

- **[Phase 3] Predictive Analytics Card:**
  - Title: "🔮 KI-Prognosen für Q1 2025"
  - Content:
    - "Erwarteter Umsatz: €2.8M (+15%)"
    - "Wahrscheinliche Abschlüsse: 12 von 24 Opportunities"
    - "Kritische Kunden: 3 mit Abwanderungsrisiko"
    - "Empfohlene Aktionen: 5 dringende Maßnahmen"
  - **Confidence:** "85% Konfidenz" (shown only if >70%)
  - Action: "Details anzeigen →"

- **[Phase 3] Anomalie-Erkennung:**
  - Title: "⚡ Ungewöhnliche Muster erkannt"
  - Items:
    - "🔴 Projekt Phoenix: Kostenüberschreitung wahrscheinlich (85% Sicherheit)"
    - "⚠️ Kunde Hofladen Müller: Bestellverhalten abweichend (-40%)"
    - "📈 Opportunity Baumarkt Weber: Abschluss wahrscheinlicher als erwartet (+30%)"
  - Each with: Confidence score (min 70%), recommended action, **explainability link**
  - **Feedback:** "Nicht hilfreich?" link for user feedback

- **[Phase 3] Intelligente Empfehlungen:**
  - "💡 Basierend auf Ihren Daten empfehlen wir:"
  - List of 3-5 actionable recommendations:
    - "Route München-Nord optimieren: 15% Kraftstoffersparnis möglich"
    - "Mitarbeiter Schmidt für Projekt Y einsetzen (beste Erfolgsquote)"
    - "Angebot A-2025-089 nachfassen: Hohe Abschlusswahrscheinlichkeit"
  - Each with: Expected benefit, confidence score, "Warum?" explanation link

**Section: Team-Performance**

- **Top-Performers (Table):**
  - Columns: Name, Rolle, Opportunities, Umsatz, Conversion Rate, **[Phase 3]** AI-Score
  - Rows: Top 5 employees by revenue
  - Avatars, badges for roles
  - **[Phase 3]** AI-Score: Performance prediction (1-100) - only shown if toggle ON
  - Sorting by column

- **Auslastung (Heatmap):**
  - Team members (Y-axis)
  - Weeks (X-axis)
  - Color: Green (under 80%), Amber (80-100%), Red (over 100%)
  - **[Phase 3]** AI overlay: Predicted bottlenecks (purple dots) - only shown if toggle ON

**Section: Aktivitäten & Alerts**

- Recent important activities
- Alerts: Budget overruns, delayed projects, high-value offers expiring soon, low margins
- Each alert: Icon, message, timestamp, action link
- Examples:
  - "⚠️ Projekt P-2025-M003: Budget um 15% überschritten (€ 12.500)"
  - "🔴 Angebot A-2025-00089 läuft morgen ab (€ 45.000)"
  - "⚠️ Projekt B: Marge nur 8% (unter Ziel 20%)"

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

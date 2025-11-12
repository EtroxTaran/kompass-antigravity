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
- **AI Toggle:** Switch "KI-Features" (top-right, default OFF until Phase 3)

**KPI Cards (Top Row - 6 cards):**
1. **Offene Kalkulationen**
   - Count: "8" (36px, amber)
   - Urgent: "3 fällig diese Woche" (red badge)
   - Avg. time: "2 Tage"
   - **[Phase 3]** AI Priority: "🎯 2 kritisch für Umsatzziel" (purple)
   
2. **Durchschnittliche Marge**
   - Percentage: "18,5%" (36px, green)
   - Trend: "+2% ↗" (vs. last quarter)
   - Target: "15% Ziel"
   - **[Phase 3]** AI Insight: "💡 +3% möglich durch Optimierung"
   
3. **Gesamtvolumen (aktuell)**
   - Value: "€ 3.200.000" (36px, blue)
   - Open estimates: "24"
   - Won: "€ 1.450.000"
   - **[Phase 3]** AI Prediction: "📈 85% für weitere €450k" (purple)
   
4. **Ablehnungsrate**
   - Percentage: "15%" (36px, amber)
   - Reason: "Preis zu hoch (60%)"
   - Improve: "Kalkulation optimieren"
   - **[Phase 3]** AI Analysis: "🔍 Preisschwelle bei €85k"
   
5. **Echtzeitkosten (NEU)**
   - Today tracked: "€ 3.450" (36px, orange)
   - Hours logged: "45h @ €1.890"
   - Materials: "€ 1.560"
   - **[Phase 3]** AI Alert: "⚠️ Projekt P-2025-M003 +15% über Plan"
   
6. **Genauigkeit (NEU)**
   - Accuracy: "92%" (36px, green)
   - Last month: "94%"
   - Best performer: "Ladeneinrichtung (97%)"
   - **[Phase 3]** AI Learning: "🤖 +2% durch neue Datenpunkte"

**Section: Anstehende Kalkulationen (Enhanced Priority Queue)**
- Table with sortable columns
- Columns: Opportunity, Kunde, Wert, **[Phase 3]** AI-Score, Fälligkeit, Priorität, Status, Aktion
- Rows: Opportunities needing estimates
- Sorting: Due date (default), priority
- **[Phase 3]** Sorting: AI-sorted priority - only if toggle ON
- Priority badges: "Hoch" (red), "Mittel" (amber), "Normal" (blue)
- Status: "Neu", "In Bearbeitung", "Angebot erstellt", "Genehmigt"
- **[Phase 3] AI-Score Column (NEW):** (only shown if toggle ON)
  - "95%" (green) - High win probability
  - "72%" (amber) - Medium chance
  - "45%" (red) - Low chance
  - Tooltip: Factors breakdown
- Actions: "Kalkulation starten", "Details", "Angebot erstellen"
- **[Phase 3]** Action: "AI-Vorschlag" - only if toggle ON
- Filters: Priority, due date, customer
- **[Phase 3]** Filter: "AI score" - only if toggle ON
- Example base: "REWE München - Ladeneinrichtung, € 125k, 20.11.24, Hoch, In Bearbeitung, [Kalkulation öffnen]"
- **[Phase 3]** Extended: "+ AI-Score: 87%" - only if toggle ON
- **[Phase 3] Row Enhancement:** AI-recommended opportunities pulse with purple border - only if toggle ON

**Section: KI-gestützte Kalkulationsanalyse [Phase 3] (NEW)**
- **Visibility:** Hidden by default. Requires AI toggle ON + 30+ completed projects
- **Data Requirement:** 30+ projects for similar project finder, 100+ opportunities for price optimization
- **See:** [AI Data Requirements](../../docs/specifications/AI_DATA_REQUIREMENTS.md)

- **[Phase 3] Preisoptimierung (Interactive Chart):**
  - X-axis: Price range
  - Y-axis: Win probability (from ML model)
  - Curve shows optimal price point
  - Current price marker (draggable)
  - Competitor range overlay (if known)
  - **Live updates as you adjust price**
  - **Confidence:** Only show if ≥70% model confidence
  
- **[Phase 2] Ähnliche Projekte (Reference Cards):**
  - Shows 3 most similar past projects (vector similarity, no ML)
  - Each card: Project name, final margin, key learnings
  - Similarity: "92% ähnlich" (based on category/value/customer type matching)
  - Quick action: "Als Vorlage verwenden"
  - **Works in Phase 2:** Pattern matching, not ML prediction
  
- **[Phase 3] Kosten-Vorhersage (Predictive Breakdown):**
  - Material: "€ 45.000 ± 5%" (based on 15 similar projects)
  - Labor: "€ 32.000 ± 8%" (includes travel time)
  - External: "€ 8.000 ± 12%"
  - Buffer: "€ 5.000 (6%)" (AI-recommended)
  - **Confidence level:** "89% accuracy" (only show if ≥70%)

**Section: Aktive Projekte - Echtzeit-Kostenüberwachung (Enhanced)**
- Table showing real-time project cost tracking
- Columns: Projekt, Auftragswert, Budget, Ist-Kosten, Heute erfasst, **[Phase 3]** AI-Prognose, Restbudget, Marge (%), Status
- Rows: Active projects with live updates
- Progress bars: Budget utilization (green < 80%, amber 80-100%, red > 100%)
- Alerts: Red if over budget, yellow if trending over
- **Heute erfasst Column (NEW):**
  - Shows today's tracked expenses/time
  - "€ 450 (3h)" with green/red indicator
  - Live update badge if activity ongoing
- **[Phase 3] AI-Prognose Column (NEW):** (only shown if toggle ON)
  - End cost prediction
  - "€ 298k (↑ 5%)" with confidence
  - Warning icon if exceeding budget
  - **Data requirement:** 50+ projects with cost tracking
- Filters: Status, customer, margin health
- **[Phase 3]** Filter: "AI risk" - only if toggle ON
- Example base: "P-2024-B023, € 450k, € 380k, € 285k, € 1.2k, € 95k, 15,6%, Im Rahmen"
- **[Phase 3]** Extended: "+ AI-Prognose € 298k" - only if toggle ON
- **Row Features:**
  - Expandable to show cost breakdown by category
  - Real-time sparkline for daily costs
  - **[Phase 3]** AI alerts: Unusual spending patterns - only if toggle ON

**Section: Margenanalyse (AI-Enhanced Charts)**
- **Marge nach Projekten (Bar Chart):**
  - X-axis: Project names
  - Y-axis: Margin %
  - Bars: Color-coded (green > 15%, amber 10-15%, red < 10%)
  - Target line: 15%
  - **[Phase 3]** AI overlay: Predicted final margin (dotted outline) - only if toggle ON
  - Hover: Shows margin drivers
  - **[Phase 3]** Hover enhancement: AI risk factors - only if toggle ON
  
- **Kostenverteilung (Pie Chart - Live):**
  - Segments: Material (45%), Personal (35%), Fremdleistungen (15%), Sonstiges (5%)
  - Colors: Blue shades
  - **Live updates:** Real-time from expense tracking
  - **[Phase 3]** AI insight: "Material 8% über Durchschnitt" (warning) - only if toggle ON
  
- **Marge Trend (Line Chart - with AI Forecast):**
  - X-axis: Months (historical: 6 past)
  - **[Phase 3]** X-axis extension: 3 future months - only if toggle ON
  - Y-axis: Margin %
  - Solid line: Historical margin
  - **[Phase 3]** Dashed line: AI forecast - only if toggle ON
  - **[Phase 3]** Confidence band: Shaded area - only if toggle ON
  - Target line: 15%
  - **[Phase 3]** Key events marked: Price changes, market shifts - only if toggle ON

**Section: Intelligente Kalkulationsvorlagen (Enhanced)**
- **[Phase 2]** Template recommendations based on customer type (pattern matching)
- Cards with usage stats and success rates:
  - "Ladeneinrichtung Standard" - 97% accuracy, 18.5% avg margin
  - "Büroeinrichtung" - 94% accuracy, 16.2% avg margin
  - "Gastronomie" - 91% accuracy, 22.1% avg margin
  - **[Phase 2]** "🤖 AI-Vorschlag" - Dynamic based on current opportunity (if toggle ON and 50+ offers)
- Each card: Icon, name, stats, last update, "Verwenden" button
- **[Phase 2] AI Features:** (only shown if toggle ON and Phase 2 data met)
  - Auto-fills based on similar projects (pattern matching)
  - Suggests modifications for customer type
- **[Phase 3] AI Features:** (only shown if toggle ON and Phase 3 data met)
  - Shows confidence level for each line item (ML-based)
- Create new: "+ Neue Vorlage"

**Section: Intelligente Preis-Datenbank (Enhanced)**
- Search bar: "Material oder Dienstleistung suchen..."
- **Real-time features:**
  - **[Phase 2]** Price trend indicators (↑↓→) - only if 3+ months price history
  - Stock availability warnings (from supplier integrations)
  - **[Phase 2]** Alternative suggestions - pattern-based
  - Bulk discount thresholds
- Recent searches: "Ladenregal (€145), Montage/h (€65), LED-Panel (€89)"
- **[Phase 2]** Extended searches: "+ trend indicators (↑5%, →, ↓2%)" - only if toggle ON
- **[Phase 3] AI Predictions:** (only shown if toggle ON and 6+ months data)
  - "Stahlpreise: +8% in 30 Tagen erwartet"
  - "Holz: Stabil für Q4"
  - "Elektronik: -3% nach Messeende"
- Price updates: "Live-Daten von 3 Lieferanten"

**Section: Benötigte Genehmigungen**
- List of estimates pending GF approval (if > € 200k or margin < 10%)
- Each item: Opportunity, value, margin, reason for approval
- Actions: "Details", "GF benachrichtigen"

**Quick Actions (Sidebar or FAB):**
- "+ Neue Kalkulation"
- **[Phase 3]** "🤖 AI-Schnellkalkulation" - only if toggle ON
- "Vorlage erstellen"
- "📸 Material scannen" (barcode/photo) - basic OCR (Phase 1)
- "Preis-Datenbank aktualisieren"
- "📊 Margenanalyse exportieren"
- **[Phase 3]** "💬 Kalkulationsassistent" (AI chat) - only if toggle ON

**Mobile-First PWA Enhancements:**
- **Bottom Navigation (5 tabs):**
  - "Kalkulationen" (calculator icon) - Main view
  - "Projekte" (folder icon) - Active projects
  - "📸" (camera) - Quick price check
  - "Vorlagen" (template icon) - Templates
  - "KI" (sparkle icon) - AI insights

- **Touch Gestures:**
  - Swipe left on estimate: Quick actions (approve, edit)
  - Swipe right on project: Show margin breakdown
  - Long press on price: Show trend chart
  - Pull down: Refresh prices and data
  - Pinch on charts: Zoom in/out

- **PWA Features:**
  - **Push Notifications:**
    - "⚠️ Materialpreis +10%: Stahl update"
    - "🎯 Neue Kalkulation: REWE München €125k"
    - "📈 Marge unter Ziel: Projekt P-2025-M003"
  - **Offline Mode:**
    - Full template library cached
    - Price database offline-first
    - Draft calculations saved locally
    - Auto-sync when online
  - **Voice Input:**
    - "Neue Kalkulation für REWE"
    - "Zeige Marge für Projekt 23"
    - "Material Preis Holzregal"
  - **Camera Features:**
    - Barcode scanning for materials
    - Photo-to-text for supplier quotes
    - Document capture for specs

- **Mobile Layout Optimizations:**
  - KPI cards: 2x3 grid, swipeable
  - Tables: Card view with key metrics
  - Charts: Full-width, touch-interactive
  - Price search: Sticky top bar
  - Templates: Grid view, 2 columns
  - FAB: Multi-action speed dial

- **Performance & UX:**
  - Instant price lookups (cached)
  - Progressive chart rendering
  - Skeleton screens for tables
  - Optimistic UI for calculations
  - < 2s load time on 3G
  - Background price updates

- **Mobile-Specific Features:**
  - Quick calculator widget
  - Comparison mode (side-by-side)
  - Share calculations via link
  - Export to PDF on-device
  - Integration with supplier apps
  - AR measurement tools (future)

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


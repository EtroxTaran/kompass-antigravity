# PLAN Dashboard (Planer) - Figma Make Prompt

## Context & Purpose

- **User Role**: PLAN (Planer / Planning)
- **Business Value**: Project management, resource allocation, scheduling
- **Access**: ALL projects (full CRUD), ALL customers (read-only for project context)
- **Key Focus**: Project timelines, team workload, capacity planning
- **Note**: PLAN is internal service role for project execution, not customer management

## Figma Make Prompt

Create a PLAN (Planer) dashboard for KOMPASS showing active projects, timelines, resource allocation, capacity planning, and upcoming milestones with German labels.

**Header:**

- "Projektplanung" (28px, bold)
- View toggle: "Kalender" | "Liste" | "Gantt"
- Date range: "Diese Woche" | "Dieser Monat" | "Quartal"
- User: Avatar + "Thomas Fischer (PLAN)"
- **AI Toggle:** Switch "KI-Features" (top-right, default OFF until Phase 3)

**KPI Cards (Top Row - 6 cards):**

1. **Aktive Projekte**
   - Value: "18" (36px, blue)
   - On schedule: "14 (78%)" (green)
   - Delayed: "4 (22%)" (red)
   - **[Phase 3]** AI Prediction: "🔮 2 weitere Risiko-Projekte" (purple pulse)
2. **Kapazität (diese Woche)**
   - Team: "5 Mitarbeiter"
   - Verfügbar: "120 Std" (blue)
   - Gebucht: "96 Std (80%)" (amber)
   - **[Phase 3]** AI Optimierung: "💡 +15% durch Umverteilung" (purple)
3. **Meilensteine (diese Woche)**
   - Anstehend: "8" (blue)
   - Überfällig: "2" (red)
   - Abgeschlossen: "15 diese Woche" (green)
   - **[Phase 3]** AI Warnung: "⚠️ 3 gefährdet für nächste Woche"
4. **Budget-Status**
   - Im Rahmen: "14 Projekte" (green)
   - Warnung: "3" (amber)
   - Überzogen: "1" (red)
   - **[Phase 3]** AI Forecast: "📈 €12.500 Einsparung möglich"
5. **Tour-Effizienz (NEU)**
   - Aktive Touren: "3 heute"
   - Zeitersparnis: "-2.5 Std" (green)
   - Kunden besucht: "12/15 (80%)"
   - **[Phase 3]** AI Route: "🗺️ Optimiert für Verkehr"
6. **Team-Performance (NEU)**
   - Produktivität: "94%" (green)
   - Überstunden: "12 Std" (amber)
   - Auslastung: "Optimal" (green badge)
   - **[Phase 3]** AI Score: "🏆 Top 20% Branche"

**Section: Projektübersicht (Enhanced Gantt or Calendar View)**

- **Gantt Chart (Main View):**
  - Y-axis: Project names
  - **[Phase 3]** Y-axis enhancement: AI risk indicators - only if toggle ON
  - X-axis: Timeline (weeks/months)
  - Bars: Project duration
  - **[Phase 3]** Bars enhancement: Gradient showing confidence - only if toggle ON
  - Colors: Blue (on schedule), Amber (at risk), Red (delayed)
  - **[Phase 3]** Color: Purple (AI predicted) - only if toggle ON
  - Milestones: Diamond markers
  - **[Phase 3]** Milestones: Dashed diamonds = AI predictions - only if toggle ON
  - Dependencies: Arrows between tasks (red = critical path)
  - Current date: Vertical line
  - **[Phase 3] AI Overlays:** (only shown if toggle ON)
    - Risk zones: Shaded areas showing high-risk periods
    - Resource conflicts: Yellow warning icons
    - Predicted delays: Dotted extensions on bars
    - Optimization suggestions: Green arrows

- **Calendar View (Alternative):**
  - Month view with project milestones
  - Color-coded by project
  - Click day: See all events
  - **[Phase 3] AI Features:** (only shown if toggle ON)
    - Weather impact overlay for outdoor projects
    - Holiday/vacation impact visualization
    - Optimal scheduling suggestions

**Section: KI-gestützte Projektanalyse [Phase 3] (NEW)**

- **Visibility:** Hidden by default. Requires AI toggle ON + 50+ completed projects
- **Data Requirement:** 50+ projects with full cost/timeline tracking
- **See:** [AI Data Requirements](../../docs/specifications/AI_DATA_REQUIREMENTS.md)

- **[Phase 3] Risikovorhersage (Risk Matrix):**
  - 3x3 matrix: Impact (vertical) vs Probability (horizontal)
  - Projects plotted as dots (size = budget)
  - Color: Green → Yellow → Red
  - Hover: Show risk factors and mitigation
  - **Confidence threshold:** Only show projects with >75% risk confidence
  - **Example risks:**
    - "P-2025-M003: Material-Lieferung gefährdet"
    - "P-2025-B015: Team-Kapazität kritisch"

- **[Phase 3] Intelligente Empfehlungen (Card List):**
  - Card 1: "⚡ Schnelle Gewinne"
    - "2 Projekte können 1 Woche früher fertig werden"
    - "Team A → Team B Umverteilung"
    - Action: "Änderungen anwenden"
    - **Explainability:** "Warum?" link
  - Card 2: "🔄 Ressourcen-Optimierung"
    - "15% Kapazität durch Parallelisierung"
    - "3 Tasks können gleichzeitig laufen"
    - Action: "Plan optimieren"
  - Card 3: "💰 Budget-Einsparung"
    - "€8.500 durch Lieferanten-Konsolidierung"
    - "Betrifft 4 Projekte"
    - Action: "Details ansehen"

- **[Phase 3] Predictive Timeline (Horizontal Chart):**
  - Shows predicted vs planned completion
  - Confidence bands for predictions (min 70%)
  - Key factors affecting timeline

**Section: Ressourcenplanung (AI-Enhanced)**

- **Team-Auslastung (Horizontal Bar Chart):**
  - Team members (Y-axis) with skill tags
  - Hours (X-axis)
  - Stacked bars: "Verfügbar" (light blue), "Gebucht" (blue), "Überlastet" (red)
  - **[Phase 3]** Bar segment: "AI-optimiert" (purple) - only if toggle ON
  - Target line: 100%
  - **[Phase 3] AI Indicators:** (only shown if toggle ON)
    - 🎯 Optimal allocation
    - ⚠️ Skills mismatch warning
    - 🔄 Suggested reallocation
    - 🚗 Tour time included
- **Kapazitätsvorhersage (Line Chart - next 4 weeks):**
  - X-axis: Weeks
  - Y-axis: Hours
  - Blue line: Available capacity
  - Red line: Booked capacity
  - **[Phase 3]** Purple dashed: AI predicted capacity needs - only if toggle ON
  - Gap: Remaining capacity (fill green)
  - **[Phase 3]** AI Alerts: Peak periods, vacation impacts - only if toggle ON

- **Tour-Integration (NEW Map View):**
  - Mini-map showing today's tours
  - Team member locations (live)
  - Project sites marked
  - Estimated travel times (based on distance)
  - **[Phase 3] AI Features:** (only shown if toggle ON)
    - Traffic-adjusted ETAs
    - Optimal visit sequence
    - Multi-stop optimization

**Section: Projekt-Prioritäten (Enhanced Table with AI)**

- Columns: Projekt, Kunde, Status, Fortschritt, **[Phase 3]** AI-Score, Fälligkeit, Team, Budget-Status, Aktionen
- Rows: All active projects
- Sorting: Due date (default), priority, customer
- **[Phase 3]** Sorting: "AI priority" - only if toggle ON
- Badges: Status, budget health
- **[Phase 3]** Badges: AI predictions - only if toggle ON
- Progress bars: Visual completion
- **[Phase 3]** Progress enhancement: Predicted vs actual overlay - only if toggle ON
- **[Phase 3] AI-Score Column (NEW):** (only shown if toggle ON)
  - "95" (green) - On track
  - "72" (amber) - Needs attention
  - "45" (red) - High risk
  - Tooltip: Risk factors breakdown
- Actions: "Details", "Zeitplan bearbeiten", "Team zuweisen"
- **[Phase 3]** Action: "AI-Optimierung" - only if toggle ON
- **[Phase 3] Row Enhancements:** (only shown if toggle ON)
  - Pulsing border for AI-identified urgent items
  - Weather icon for weather-dependent projects (Phase 3)
  - Travel time indicator for field projects

**Section: Anstehende Meilensteine (Enhanced Timeline)**

- Next 14 days
- Each milestone: Date, project, name, owner
- **[Phase 3]** Enhancement: AI confidence score - only if toggle ON
- Overdue: Red highlight
- **[Phase 3]** Enhancement: Recovery suggestions - only if toggle ON
- Group by week
- Click: Navigate to project detail
- **[Phase 3] AI Features:** (only shown if toggle ON)
  - Predicted delays: Yellow warning (7 days before)
  - Dependencies at risk: Connection lines turn amber
  - Alternative dates suggested: Green options
  - Weather impact for outdoor: Cloud icons

**Section: Team-Verfügbarkeit (Enhanced Grid)**

- Team member cards with live status
- Each card: Avatar, name, role, skills, location
- This week: "32/40 Std gebucht (80%)"
- Next week: "24/40 Std gebucht (60%)"
- Status indicator: Green/amber/red
- **[Phase 3] AI Enhancements:** (only shown if toggle ON)
  - Best match indicator: "🎯 Ideal für Projekt X"
  - Skill gaps highlighted
  - Vacation/sick predictions based on patterns
  - Current location if on tour
- Quick actions: "Aufgabe zuweisen", "Kapazität prüfen"
- **[Phase 3]** Action: "Route optimieren" - only if toggle ON

**Section: Kritische Pfade & Verzögerungen**

- List of projects with delays
- Impact analysis: Which milestones are affected
- Recommended actions (manual analysis)
- **[Phase 3] AI-Powered Solutions:** (only shown if toggle ON)
  - "🤖 3 Lösungsvorschläge verfügbar"
  - Option 1: "Team umverteilen (95% Erfolg)"
  - Option 2: "Meilenstein verschieben (80% Erfolg)"
  - Option 3: "Zusätzliche Ressourcen (70% Erfolg)"
  - **Explainability:** Each option shows reasoning
- Escalation: "GF benachrichtigen" button for critical delays
- **[Phase 3]** Auto-generated recovery plans - only if toggle ON

**Quick Actions (Sidebar or FAB):**

- "+ Neues Projekt"
- "+ Meilenstein hinzufügen"
- "Team zuweisen"
- "📍 Tour planen"
- **[Phase 3]** "🤖 AI-Optimierung starten" - only if toggle ON
- "📊 Kapazitätsbericht"
- "Gantt exportieren"
- "💬 Team-Chat" (integrated comms)

**Mobile-First PWA Enhancements:**

- **Bottom Navigation (5 tabs):**
  - "Projekte" (folder icon) - Project list
  - "Gantt" (chart icon) - Timeline view
  - "+" (plus in circle) - Quick create
  - "Team" (people icon) - Resource view
  - "KI" (sparkle icon) - AI insights

- **Touch Gestures:**
  - Pinch to zoom on Gantt chart
  - Swipe left/right to navigate timeline
  - Long press on project: Quick actions menu
  - Swipe down: Pull to refresh
  - Drag & drop: Reassign tasks (with haptic feedback)

- **PWA Features:**
  - **Push Notifications:**
    - "⚠️ Meilenstein P-2025-M003 gefährdet"
    - "✅ Team verfügbar für neue Zuweisung"
    - "🚨 Kritischer Pfad Warnung"
  - **Offline Mode:**
    - Full Gantt chart cached
    - Edit capabilities queued
    - Conflict resolution on sync
  - **Voice Commands:**
    - "Zeige kritische Projekte"
    - "Weise Team A zu Projekt B zu"
    - "Was sind meine Meilensteine heute?"

- **Mobile Layout Optimizations:**
  - Gantt: Horizontal scroll with sticky project names
  - KPI cards: 2x3 grid, swipeable
  - Team cards: Stack vertically with expand/collapse
  - Timeline: Simplified week view
  - AI insights: Bottom sheet overlay
  - FAB: Multi-action speed dial

- **Performance & UX:**
  - Virtual scrolling for large Gantt charts
  - Progressive loading of project details
  - Skeleton screens during data fetch
  - Optimistic UI updates
  - < 2s load time on 3G
  - Service worker for background sync

- **Mobile-Specific Features:**
  - Quick photo documentation
  - GPS check-in at project sites
  - Signature capture for approvals
  - Barcode scanning for materials
  - Integration with device calendar

## Design Requirements

### Visual Hierarchy

1. Gantt chart: Large, clear timeline
2. KPI cards: Quick metrics
3. Team utilization: Prominent bars
4. Alerts: Critical delays highlighted

### shadcn/ui Components

```bash
npx shadcn-ui@latest add card badge button calendar table
# Gantt: Use react-gantt-chart or custom with shadcn
```

### Charts

- Gantt chart: Project timelines
- Horizontal bar chart: Team utilization
- Line chart: Capacity forecast

### Interaction

- Gantt: Drag to adjust dates (if editable)
- Hover milestone: Show details
- Click project: Navigate to detail
- Filters: Status, team member, date range

### Accessibility

- Gantt has table alternative
- Color + patterns for status
- Keyboard navigation

### Example Data

- Project: "P-2024-B023, REWE München, In Arbeit, 65%, 28.02.25, 5 Mitarbeiter, Im Budget"
- Team: "Anna Weber, Planung, 32/40 Std (80%)"

# Project Materials View (BOM) - Figma Make Prompt

## Context & Purpose
- **View:** Project Bill of Materials (BOM) with Cost Tracking
- **Users:** PLAN (primary - manages requirements), INN (procurement), KALK (cost analysis), BUCH (budget monitoring)
- **Purpose:** View, track, and manage all materials for a project
- **Key Focus:** Estimated vs. actual costs (real-time), procurement status, budget variance

## Figma Make Prompt

Create a project materials view (Bill of Materials) for KOMPASS showing material requirements, multi-supplier pricing, procurement status, and real-time cost tracking with estimated vs. actual comparison and German labels.

**Page Title:** "Materialbedarf - Projekt P-2025-M003"

**Breadcrumb:**
- "Projekte" > "P-2025-M003: REWE München" > "Materialien"

**Header Actions:**
- **Add Material:** "+ Material hinzufügen" (PLAN/INN only)
- **Create PO:** "Bestellung erstellen" (INN only) - for selected materials
- **Export:** "Export" dropdown (CSV, PDF) - all roles
- **View Toggle:** [Liste] / [Phasen] / [Kosten-Analyse]

---

## Cost Summary Cards (Top Row)

**Cards (4 cards, responsive):**

```
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│ Geschätzt       │ Bestellt        │ Geliefert       │ Varianz         │
│ € 125.000       │ € 118.450       │ € 95.200        │ - € 6.550       │
│ (KALK-Schätzung)│ (8 von 12 Pos.) │ (5 von 12 Pos.) │ (-5,2%) ✓      │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

**Card 1: Geschätzter Gesamtbetrag (Estimated Total)**
- Value: "€ 125.000" (36px, blue)
- Source: "KALK-Schätzung"
- Count: "12 Materialien"

**Card 2: Bestellt (Ordered)**
- Value: "€ 118.450" (36px, amber)
- Status: "8 von 12 Positionen bestellt"
- Pending: "4 Positionen offen"

**Card 3: Geliefert (Delivered)**
- Value: "€ 95.200" (36px, green)
- Status: "5 von 12 Positionen geliefert"
- In transit: "3 in Lieferung"

**Card 4: Varianz (Variance)**
- Value: "+ € 6.550" (red if positive, green if negative)
- Percentage: "(+5,2%)" (vs. estimate)
- Status: "❌ Über Budget" (red) if positive, "✓ Unter Budget" (green) if negative

---

## View 1: Materialliste (Material List Table)

**Table Columns:**

| # | Material | Phase | Menge (Geschätzt/Ist) | Preis (Geschätzt/Ist) | Gesamtkosten | Lieferant | Status | Lieferung | Aktionen |
|---|----------|-------|----------------------|---------------------|--------------|-----------|--------|-----------|----------|
| 1 | LED-Panel 60x60cm | Installation | 24/24 Stk | €145/€142 | €3.408 (€3.480) | Müller GmbH | ✓ Geliefert | 05.02.25 | [...] |
| 2 | Ladenregal Eiche | Construction | 8/— Stk | €850/— | €6.800 (—) | Weber KG | 🟡 Bestellt | ETA: 15.02 | [...] |
| 3 | Bodenbelag Vinyl | Finishing | 45/— m² | €35/— | €1.575 (—) | Schmidt | ⏳ Nicht bestellt | — | [...] |

**Column Details:**

1. **# (Position Number)**
   - Sequential numbering
   - Reorderable (drag-and-drop Phase 2)

2. **Material**
   - Material name (bold) + code below
   - Link: Opens material detail
   - Thumbnail: Material image (small, 40x40px)

3. **Phase**
   - Badge: "Planung", "Vorbereitung", "Konstruktion", "Montage", "Finishing"
   - Color-coded by phase

4. **Menge (Quantity)**
   - Format: "Geschätzt / Ist Einheit"
   - Example: "24/24 Stk" (green if delivered)
   - Example: "8/— Stk" (gray if not yet delivered)
   - **Variance indicator:** "24/28 Stk (+4)" - red if over, green if under

5. **Preis (Price per Unit)**
   - Format: "€Geschätzt / €Ist"
   - Example: "€145/€142" (green if lower, red if higher)
   - Example: "€850/—" (gray if not yet delivered)

6. **Gesamtkosten (Total Cost)**
   - Line 1: Actual cost "€3.408" (bold, colored)
   - Line 2: Estimated cost "(€3.480)" (gray, parentheses)
   - Color: Green if actual < estimated, red if actual > estimated, blue if not yet delivered

7. **Lieferant (Supplier)**
   - Supplier name
   - Link: Opens supplier detail
   - Star icon: If preferred supplier

8. **Status**
   - Badge with icon:
     - ⏳ Nicht bestellt (Gray)
     - 🟡 Bestellt (Amber)
     - 🚚 In Lieferung (Blue)
     - ✓ Geliefert (Green)
     - ⚠️ Verzögert (Red)
     - ❌ Storniert (Gray strikethrough)

9. **Lieferung (Delivery Date)**
   - If delivered: Date "05.02.25" (green)
   - If in transit: "ETA: 15.02" (blue)
   - If not ordered: "—" (gray)
   - If delayed: "Verspätet! ETA: 22.02" (red)

10. **Aktionen (Actions)**
    - [...] menu:
      - "Details anzeigen"
      - "Bearbeiten" (PLAN/INN)
      - "Bestellung erstellen" (INN, if not ordered)
      - "Lieferung erfassen" (INN, if ordered)
      - "Aus Projekt entfernen" (PLAN)

**Table Features:**
- **Row Selection:** Checkbox for bulk actions
- **Row Click:** Expands to show full details
- **Sorting:** By phase, status, cost variance, delivery date
- **Filtering:** By phase, status, supplier
- **Search:** Material name, code, supplier

**Bulk Actions:**
- Select multiple materials (same supplier recommended)
- **Create PO:** "Bestellung erstellen für ausgewählte (3)" button
- **Update Status:** Change multiple statuses at once

---

## View 2: Nach Phasen (By Project Phase)

**Grouped View:**

```
┌──────────────────────────────────────────────────────────┐
│ ▼ Planung (2 Materialien) • € 12.500 / € 12.800         │
├──────────────────────────────────────────────────────────┤
│ • Bauplan-Druck (5 Stk) • € 2.500 / € 2.600 • ✓ Gelief │
│ • Vermessungsgeräte (1 Set) • € 10.000 / € 10.200 • ✓   │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ▼ Konstruktion (8 Materialien) • € 89.000 / € 78.450    │
├──────────────────────────────────────────────────────────┤
│ • Ladenregal Eiche (8 Stk) • € 6.800 / — • 🟡 Bestellt │
│ • Theke Edelstahl (1 Stk) • € 12.000 / — • ⏳ Offen    │
│ ... (6 more)                              [Alle anzeigen]│
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ▶ Montage (5 Materialien) • € 18.500 / —                │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ▶ Finishing (2 Materialien) • € 5.000 / —               │
└──────────────────────────────────────────────────────────┘
```

**Phase Cards:**
- Collapsible sections
- Header shows: Phase name, material count, cost (estimated/actual)
- Cost indicator: Green if under, red if over, blue if not complete
- Expand: Shows materials in that phase
- Click material: Opens detail or edit

---

## View 3: Kostenanalyse (Cost Analysis)

**Charts Section:**

### Chart 1: Kosten nach Kategorie (Costs by Category - Pie Chart)

```
┌──────────────────────────────────────────┐
│ Materialkosten nach Kategorie            │
│                                          │
│        ┌─────────┐                       │
│        │   🪵    │  Regale: 35% (€43k)  │
│        │  🗄️💡   │  Beleuchtung: 28%    │
│        │  ⚡🟫    │  Elektrik: 20%       │
│        │         │  Bodenbeläge: 12%    │
│        └─────────┘  Sonstiges: 5%       │
│                                          │
└──────────────────────────────────────────┘
```

### Chart 2: Geschätzt vs. Ist (Estimated vs. Actual - Bar Chart)

```
┌──────────────────────────────────────────┐
│ Geschätzt vs. Ist-Kosten                 │
│                                          │
│ Regale        ████████│███████           │
│               Geschätzt│Ist              │
│                                          │
│ Beleuchtung   ██████│██████              │
│                                          │
│ Elektrik      ███████│████████ (über!)   │
│                                          │
│ Bodenbeläge   █████│—                    │
│                                          │
└──────────────────────────────────────────┘
```

- Blue bars: Estimated
- Green bars: Actual (if under estimate)
- Red bars: Actual (if over estimate)
- Gray bars: Not yet delivered

### Chart 3: Lieferplan (Delivery Timeline - Gantt-style)

```
┌──────────────────────────────────────────┐
│ Material-Lieferungen                     │
│                                          │
│ W6 │W7 │W8 │W9 │W10│                     │
│────┼───┼───┼───┼───┤                     │
│████│   │   │   │   │ LED-Panels ✓       │
│    │███│   │   │   │ Regale (ETA) 🟡    │
│    │   │██│   │   │ Theke (ETA)         │
│    │   │   │███│   │ Bodenbelag          │
│────┼───┼───┼───┼───┤                     │
│ ↑ Heute                                  │
└──────────────────────────────────────────┘
```

- Green bars: Delivered
- Amber bars: Ordered, in transit
- Gray bars: Not yet ordered

---

## Variance Analysis Section

**Variance Summary Table:**

| Kategorie | Geschätzt | Ist | Varianz | % | Grund |
|-----------|-----------|-----|---------|---|-------|
| Regale | € 43.000 | € 41.200 | - € 1.800 | -4,2% | Besserer Preis ausgehandelt |
| Beleuchtung | € 35.000 | € 33.850 | - € 1.150 | -3,3% | Mengenrabatt erhalten |
| Elektrik | € 25.000 | € 28.400 | + € 3.400 | +13,6% | Zusätzliche Steckdosen benötigt |
| **Gesamt** | **€ 125.000** | **€ 95.200** | **- € 6.550** | **-5,2%** | - |

**Status Indicators:**
- Green: Variance < -5% (under budget, good)
- Blue: Variance -5% to +5% (on budget, acceptable)
- Red: Variance > +5% (over budget, needs attention)

**Variance Reason Column:**
- User-entered text explaining why actual differs
- Link: "Grund erfassen" if not yet entered
- Important for KALK to improve future estimates

---

## Material Detail Expansion (Table Row)

**Click row:** Expands to show full details

```
┌────────────────────────────────────────────────────────────┐
│ # 1  LED-Panel 60x60cm warmweiß (MAT-LED-001)      [▲]    │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ ┌─ Material-Info ──────┬─ Kalkulation ────────────────┐   │
│ │ Kategorie: Deckenl.  │ Geschätzte Menge: 24 Stk     │   │
│ │ Hersteller: Osram    │ Geschätzter Preis: € 145/Stk │   │
│ │ Phase: Montage       │ Geschätzt Total: € 3.480     │   │
│ │ [Datenblatt PDF]     │                              │   │
│ ├──────────────────────┤ Ist-Menge: 24 Stk            │   │
│ │ Lieferanten-Preise:  │ Ist-Preis: € 142/Stk         │   │
│ │ • Müller: € 145 ⭐   │ Ist Total: € 3.408           │   │
│ │ • Schmidt: € 138     │                              │   │
│ │ • Weber: € 152       │ Varianz: - € 72 (-2,1%) ✓   │   │
│ │ [Preise vergleichen] │                              │   │
│ └──────────────────────┴──────────────────────────────┘   │
│                                                            │
│ ┌─ Beschaffung ─────────────────────────────────────────┐ │
│ │ Bestellung: PO-2025-00234 (Schreinerei Müller)       │ │
│ │ Bestelldatum: 25.01.2025                              │ │
│ │ Erwartete Lieferung: 05.02.2025                       │ │
│ │ Status: ✓ Geliefert am 05.02.2025                    │ │
│ │ Lieferadresse: Projekt-Baustelle, REWE München       │ │
│ │ [Bestellung anzeigen] [Lieferschein PDF]             │ │
│ └───────────────────────────────────────────────────────┘ │
│                                                            │
│ ┌─ Verwendungsnotizen ──────────────────────────────────┐ │
│ │ "Panel für Deckenbeleuchtung im Verkaufsraum.        │ │
│ │  Warmweiß für angenehme Atmosphäre."                  │ │
│ │  - Thomas Fischer (PLAN), 15.01.2025                  │ │
│ │                                                       │ │
│ │ [Notiz hinzufügen]                                    │ │
│ └───────────────────────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## Filtering & Sorting

### Filters

**Status:**
- ☐ Alle anzeigen (default)
- ☐ Nicht bestellt
- ☐ Bestellt
- ☐ In Lieferung
- ☐ Geliefert
- ☐ Verzögert

**Phase:**
- ☐ Alle Phasen (default)
- ☐ Planung
- ☐ Vorbereitung
- ☐ Konstruktion
- ☐ Montage
- ☐ Finishing

**Kategorie:**
- ☐ Alle Kategorien (default)
- ☐ Regale
- ☐ Beleuchtung
- ☐ Elektrik
- ... (material categories)

**Lieferant:**
- Searchable dropdown
- Shows only suppliers used in this project

**Budget-Varianz:**
- ☐ Alle
- ☐ Unter Budget (actual < estimated)
- ☐ Im Budget (±5%)
- ☐ Über Budget (actual > estimated)

### Sort Options

- **Phase:** Planning → Finishing (default)
- **Status:** Not ordered → Delivered
- **Cost Variance:** Highest overage first
- **Delivery Date:** Soonest first
- **Material Name:** A-Z

---

## Quick Actions

### Bulk Material Actions

**Select multiple materials (checkbox):**
- **Create PO:** "Bestellung erstellen" (INN) - creates single PO for selected materials from same supplier
- **Update Status:** Change status for multiple materials
- **Assign to Phase:** Move materials to different phase (PLAN)
- **Export Selected:** Export to CSV/PDF

### Individual Material Actions

**[...] Menu per row:**
- **Details anzeigen** → Expands row or opens modal with full specs
- **Bearbeiten** → Edit material requirement (quantity, phase, notes)
- **Preise vergleichen** → Shows pricing from all suppliers for this material
- **Bestellung erstellen** → Creates PO for this material
- **Lieferung erfassen** → Record delivery (INN)
- **Alternative Material** → Substitute with different material (PLAN)
- **Aus Projekt entfernen** → Remove material from project (PLAN)

---

## Create Purchase Order Flow (from Material List)

**Trigger:** Select materials + click "Bestellung erstellen"

**Step 1: Group by Supplier**
```
┌────────────────────────────────────────────────────────┐
│ Bestellung erstellen                                   │
├────────────────────────────────────────────────────────┤
│ Sie haben 5 Materialien ausgewählt.                    │
│                                                        │
│ Empfehlung: 2 Bestellungen (nach Lieferant gruppiert) │
│                                                        │
│ ┌─ Bestellung 1: Schreinerei Müller GmbH ─────────┐   │
│ │ 3 Materialien • Gesamt: € 18.450                 │   │
│ │ • LED-Panel (24 Stk) - € 3.480                   │   │
│ │ • Ladenregal (8 Stk) - € 6.800                   │   │
│ │ • Theke (1 Stk) - € 12.000                       │   │
│ │ [PO erstellen]                                    │   │
│ └──────────────────────────────────────────────────┘   │
│                                                        │
│ ┌─ Bestellung 2: Elektro Schmidt GmbH ────────────┐   │
│ │ 2 Materialien • Gesamt: € 8.950                  │   │
│ │ • Steckdosen (40 Stk) - € 1.200                  │   │
│ │ • Verkabelung (120 lfm) - € 2.400                │   │
│ │ [PO erstellen]                                    │   │
│ └──────────────────────────────────────────────────┘   │
│                                                        │
│ [Alle erstellen]  [Abbrechen]                          │
└────────────────────────────────────────────────────────┘
```

**Step 2: PO Form** (opens for each supplier group)
- Pre-filled: Supplier, materials, quantities, prices, project
- INN reviews: Adjusts quantities if needed, adds shipping cost
- INN sets: Required delivery date, delivery address
- Submit: Creates PO (routes to approval if needed)

---

## Delivery Recording Modal

**Trigger:** Click "Lieferung erfassen" on material with status = 'Bestellt'

**Modal Content:**

```
┌────────────────────────────────────────────────────────┐
│ Lieferung erfassen                                [×]  │
├────────────────────────────────────────────────────────┤
│                                                        │
│ Material: LED-Panel 60x60cm warmweiß                   │
│ Bestellung: PO-2025-00234                              │
│ Lieferant: Schreinerei Müller GmbH                     │
│                                                        │
│ Bestellt: 24 Stück                                     │
│                                                        │
│ **Gelieferte Menge:**                                  │
│ [24] Stück                                             │
│                                                        │
│ **Lieferdatum:**                                       │
│ [05.02.2025] (Heute verwenden: [X])                   │
│                                                        │
│ **Zustand:**                                           │
│ (⦿) Vollständig und einwandfrei                       │
│ (⚪) Teillieferung (weitere Lieferung folgt)          │
│ (⚪) Beschädigt / Mangelhaft                          │
│                                                        │
│ [If beschädigt selected:]                              │
│ Schadensbeschreibung:                                  │
│ [____________________________________________]         │
│ Fotos hochladen: [📷 Fotos]                           │
│                                                        │
│ **Lieferschein:**                                      │
│ [📁 PDF hochladen] oder [📷 Fotografieren]            │
│                                                        │
│ **Notizen:**                                           │
│ [____________________________________________]         │
│                                                        │
│ [Abbrechen]                         [Lieferung erfassen] │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Actions after submit:**
- Updates: ProjectMaterialRequirement.actualQuantity, actualUnitPrice, deliveryStatus
- Recalculates: Project actual material costs real-time
- Updates: PO status (Delivered or PartiallyDelivered)
- Triggers: Budget alert if project costs exceed threshold
- Success: Toast "Lieferung erfasst. Projektkosten aktualisiert: € 3.408"

---

## Mobile View (375px)

```
┌─────────────────────────────────┐
│ [←] Materialbedarf          [+] │
│     P-2025-M003: REWE München   │
├─────────────────────────────────┤
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Geschätzt:  € 125.000       │ │
│ │ Bestellt:   € 118.450 (8/12)│ │
│ │ Geliefert:  € 95.200 (5/12) │ │
│ │ Varianz:    - € 6.550 ✓     │ │
│ └─────────────────────────────┘ │
│                                 │
│ [Liste][Phasen][Kosten-Analyse] │
│                                 │
│ [Filter ▼] [Sortierung ▼]       │
│                                 │
│ ┌───────────────────────────┐   │
│ │ LED-Panel 60x60cm         │   │
│ │ MAT-LED-001 • Montage     │   │
│ │ 24/24 Stk • € 142/Stk     │   │
│ │ € 3.408 (- € 72) ✓        │   │
│ │ Müller GmbH ⭐            │   │
│ │ ✓ Geliefert: 05.02.25     │   │
│ │ [Details] [...]            │   │
│ └───────────────────────────┘   │
│                                 │
│ ┌───────────────────────────┐   │
│ │ Ladenregal Eiche          │   │
│ │ MAT-SHE-012 • Konstruktion│   │
│ │ 8/— Stk • € 850/Stk       │   │
│ │ € 6.800 (noch offen)      │   │
│ │ Weber KG                  │   │
│ │ 🟡 Bestellt: ETA 15.02    │   │
│ │ [Lieferung erfassen] [...] │   │
│ └───────────────────────────┘   │
│                                 │
│ [Mehr laden...] (12 von 12)    │
│                                 │
└─────────────────────────────────┘
```

**Mobile Optimizations:**
- Cost summary: Compact card at top
- Tab view: List / Phases / Cost Analysis
- Cards: Full-width, key info only
- Swipe right on card: Mark delivered (quick action)
- Swipe left: Actions menu
- FAB: "+ Material hinzufügen"

---

## Empty States

### No Materials Yet

```
┌─────────────────────────────────────────────┐
│                                             │
│              📦                             │
│                                             │
│   Noch keine Materialien erfasst           │
│                                             │
│   Fügen Sie Materialien hinzu, die für     │
│   dieses Projekt benötigt werden.          │
│                                             │
│   [+ Material aus Katalog hinzufügen]       │
│   [+ Neues Material erfassen]               │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Integration with Project Detail

**Project Detail → Materials Tab:**

Thisview is shown as a tab on the main project detail page:

```
Project Detail:
  Tabs: [Übersicht] [Angebote] [Verträge] [Materialien] [Team] [Zeitplan]
                                            ↑ This view
```

**Quick Access from Project Dashboard:**
- PLAN dashboard card: "Materialbedarf prüfen" (if materials pending)
- Budget alert: "Material-Kosten anzeigen" link

---

## Real-Time Cost Update Indicator

**When delivery is recorded:**

```
┌────────────────────────────────────────────────────────┐
│ ✓ Lieferung erfasst                              [×]  │
├────────────────────────────────────────────────────────┤
│ LED-Panel 60x60cm (24 Stk) wurde geliefert.           │
│                                                        │
│ Projektkosten aktualisiert:                            │
│ • Material-Kosten: + € 3.408                           │
│ • Gesamtkosten: € 98.608 (81% Budget)                 │
│ • Marge: 18,2% (✓ Im Ziel)                            │
│                                                        │
│ [Projekt-Budget anzeigen]                              │
└────────────────────────────────────────────────────────┘
```

Toast notification: "Material geliefert. Projektkosten aktualisiert."

---

## Purchase Order View (Linked)

**From material row, click PO number:** Opens PO detail modal or page

**PO Detail Quick View:**
- PO number, date, supplier
- All line items with quantities
- Total amount
- Delivery status
- [View full PO] link

---

## shadcn/ui Components

```bash
npx shadcn-ui@latest add table card badge button tabs dialog progress separator
```

### Charts
```bash
# Install recharts for cost analysis charts
npm install recharts
```

---

## Accessibility

- **Table:** Expandable rows with aria-expanded
- **Status badges:** Color + icon + text
- **Cost variance:** Color + sign (+/-)
- **Keyboard:** Arrow keys navigate table, Enter expands row
- **Screen reader:** Announces cost updates

---

## Example Data

- **Project:** P-2025-M003: REWE München Ladeneinrichtung
- **Total materials:** 12
- **Estimated total:** € 125.000
- **Actual total:** € 95.200 (5 delivered)
- **Variance:** - € 6.550 (-5,2%) - under budget
- **Delivery status:** 5 delivered, 3 in transit, 4 not yet ordered
- **Top material:** Ladenregal Eiche (€ 6.800)
- **Biggest variance:** Elektrik (+13,6%, additional outlets needed)

---

**End of project-materials.md**


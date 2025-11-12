# Supplier List View - Figma Make Prompt

## Context & Purpose
- **Entity:** Supplier / Subcontractor Directory
- **Users:** INN (primary), PLAN (project assignment), BUCH (invoice review), GF (approval)
- **Purpose:** Browse, search, filter suppliers; manage supplier directory
- **Key Focus:** Service capabilities, performance ratings, active contracts

## Figma Make Prompt

Create a supplier directory list view for KOMPASS showing searchable supplier database with filtering, performance badges, and quick actions with German labels.

**Page Title:** "Lieferanten & Subunternehmer"

**Header Actions:**
- Search: "Lieferanten suchen..." (full-width search bar)
- **Primary Action:** "+ Neuer Lieferant" (button, INN/PLAN/GF only)
- **Secondary Actions:**
  - "Filter" button (opens filter sidebar)
  - "Export" button (CSV/PDF) - GF only
  - "Importieren" button (bulk import) - GF only, Phase 2

---

## List View Layout

### Desktop (1440px)

```
┌────────────────────────────────────────────────────────────────┐
│ KOMPASS • Lieferanten & Subunternehmer     [🔔] [👤 Claudia]  │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│ [                     🔍 Lieferanten suchen...              ] │
│                                                                │
│ [Filter ▼] [Export] [+ Neuer Lieferant]                       │
│                                                                │
│ ┌────────────────────────────────────────────────────────────┐│
│ │ Status: Aktiv ✓ (24) | Inaktiv (3) | Freigabe ausstehend (2) ││
│ │ Sortierung: Nach Name ▼                                     ││
│ └────────────────────────────────────────────────────────────┘│
│                                                                │
│ ┌────────────────────────────────────────────────────────────┐│
│ │ 🏢 Schreinerei Müller GmbH                    ⭐⭐⭐⭐⭐ 4.8   ││
│ │ Subunternehmer • Tischlerei, Möbel, Montage                ││
│ │ München • +49 89 1234567 • mueller@example.de              ││
│ │ ✓ Aktiv • 5 aktive Projekte • Letzte Beauftragung: Vor 2 W││
│ │ [Details] [Vertrag erstellen] [Projekt zuweisen]           ││
│ └────────────────────────────────────────────────────────────┘│
│                                                                │
│ ┌────────────────────────────────────────────────────────────┐│
│ │ 🏢 Elektro Schmidt GmbH                       ⭐⭐⭐⭐☆ 4.2   ││
│ │ Dienstleister • Elektrik, Beleuchtung                      ││
│ │ Augsburg • +49 821 987654 • schmidt-elektro@example.de    ││
│ │ ✓ Aktiv • 2 aktive Projekte • Rahmenvertrag bis 12/2025   ││
│ │ [Details] [Vertrag erstellen] [Projekt zuweisen]           ││
│ └────────────────────────────────────────────────────────────┘│
│                                                                │
│ ┌────────────────────────────────────────────────────────────┐│
│ │ 🏢 Holzgroßhandel Weber KG                    ⭐⭐⭐⭐☆ 4.0   ││
│ │ Materiallieferant • Holzmaterialien                         ││
│ │ München • +49 89 555666 • weber@example.de                 ││
│ │ ✓ Aktiv • 0 aktive Projekte • Letzte Bestellung: Vor 3 Mon││
│ │ [Details] [Bestellung aufgeben]                            ││
│ └────────────────────────────────────────────────────────────┘│
│                                                                │
│ ┌────────────────────────────────────────────────────────────┐│
│ │ 🏢 Transport Neumann                          (Noch nicht bewertet) ││
│ │ Logistik • Transport, Lieferung                            ││
│ │ München • +49 89 777888 • neumann@example.de               ││
│ │ 🟡 Freigabe ausstehend • Erstellt: Vor 2 Tagen (Claudia)  ││
│ │ [Details] [Freigeben] (GF only)                            ││
│ └────────────────────────────────────────────────────────────┘│
│                                                                │
│ [Mehr laden...] (29 Lieferanten angezeigt von 45 gesamt)     │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Supplier Card Components

### Card Layout (each supplier)

**Top Row:**
- Icon: 🏢 (building icon)
- Company name: 24px, bold, blue link
- Rating: ⭐⭐⭐⭐⭐ + numeric score (e.g., "4.8")
- If not rated: "(Noch nicht bewertet)" (gray)

**Second Row:**
- Type badge: "Subunternehmer" (blue pill badge)
- Service categories: Comma-separated, max 3 shown + "..." if more
- Tooltip on hover: Shows all service categories

**Third Row:**
- Location: City name with pin icon
- Phone: Clickable tel: link
- Email: Clickable mailto: link

**Fourth Row (Status Line):**
- Status badge: "✓ Aktiv" (green) | "🟡 Freigabe ausstehend" (amber) | "⚫ Inaktiv" (gray) | "🔴 Gesperrt" (red)
- Active projects: "5 aktive Projekte" (blue)
- Last activity: "Letzte Beauftragung: Vor 2 Wochen" or "Rahmenvertrag bis 12/2025"

**Actions Row:**
- [Details] button (secondary)
- [Vertrag erstellen] button (secondary) - INN/PLAN only
- [Projekt zuweisen] button (primary) - INN/PLAN only
- **If PendingApproval:** [Freigeben] button (primary, green) - GF only

### Status Badges

- **Aktiv (Active):** Green background, white text, checkmark icon
- **Freigabe ausstehend (PendingApproval):** Amber background, dark text, clock icon
- **Inaktiv (Inactive):** Gray background, dark text, circle icon
- **Gesperrt (Blacklisted):** Red background, white text, lock icon + reason on hover

### Rating Display

- **5 stars:** ⭐⭐⭐⭐⭐ 4.8 (green text)
- **4 stars:** ⭐⭐⭐⭐☆ 4.2 (green text)
- **3 stars:** ⭐⭐⭐☆☆ 3.5 (amber text)
- **<3 stars:** ⭐⭐☆☆☆ 2.8 (red text) + warning icon
- **Not rated:** "(Noch nicht bewertet)" (gray text)

Hover: Shows rating breakdown:
```
Qualität: ⭐⭐⭐⭐⭐ 4.9
Zuverlässigkeit: ⭐⭐⭐⭐☆ 4.5
Kommunikation: ⭐⭐⭐⭐⭐ 5.0
Preis/Leistung: ⭐⭐⭐⭐☆ 4.2

Basierend auf 12 Projekten
Letzte Bewertung: Vor 1 Woche
```

---

## Filter Sidebar

### Filter Categories

**Status (Multi-select):**
- ☑ Aktiv (24)
- ☐ Freigabe ausstehend (2)
- ☐ Inaktiv (3)
- ☐ Gesperrt (0)

**Lieferanten-Typ (Multi-select):**
- ☐ Materiallieferant (8)
- ☐ Dienstleister (12)
- ☑ Subunternehmer (15)
- ☐ Handwerker (7)
- ☐ Logistik (3)

**Leistungskategorien (Multi-select, grouped):**
- **Handwerk:**
  - ☐ Tischlerei (5)
  - ☐ Metallbau (3)
  - ☐ Elektrik (6)
  - ☐ Sanitär (4)
  - ☐ Malerei (7)
- **Materialien:**
  - ☐ Holzmaterialien (4)
  - ☐ Beleuchtung (5)
  - ☐ Möbel (6)
- **Dienstleistungen:**
  - ☐ Montage (8)
  - ☐ Transport (3)

**Bewertung (Rating):**
- ☐ 5 Sterne (6)
- ☐ 4-5 Sterne (18)
- ☐ 3-4 Sterne (8)
- ☐ <3 Sterne (2)
- ☐ Noch nicht bewertet (11)

**Standort (Location):**
- Text input: "Stadt oder PLZ"
- Checkbox: "☐ In meinem Arbeitsradius" (uses supplier working radius)

**Aktive Projekte:**
- Slider: 0 - 10+
- Label: "Mindestens X aktive Projekte"

**Account Manager:**
- Select: INN user dropdown
- Shows count per manager

### Filter Actions

- **Anwenden:** Apply filters (auto-apply on selection)
- **Zurücksetzen:** Clear all filters
- **Filter speichern:** Save custom filter preset (Phase 2)

---

## Search Behavior

### Search Fields

Searches across:
- Company name (primary)
- Service categories
- City/location
- Contact person name
- Email
- Phone (partial)

### Search Examples

- "München" → Shows all suppliers in München
- "Tischlerei" → Shows suppliers offering carpentry
- "Müller" → Shows suppliers with "Müller" in company name
- "+49 89" → Shows suppliers with München area code

### **[Phase 1] RAG Search Enhancement**

- Natural language queries: "Schreinerei in München mit guter Bewertung"
- Semantic search: "Handwerker für Ladeneinrichtung"
- Returns: Relevance-sorted results with explanation

---

## Sort Options

### Available Sorts

- **Name (A-Z):** Default
- **Name (Z-A)**
- **Bewertung (Highest first):** 5 stars → 1 star
- **Aktive Projekte (Most first):** Busiest suppliers first
- **Letzte Aktivität (Most recent):** Recently used suppliers first
- **Erstellt (Newest first):** Recently added suppliers first

---

## Empty States

### No Suppliers Yet

```
┌─────────────────────────────────────────────┐
│                                             │
│              🏢                             │
│                                             │
│   Noch keine Lieferanten erfasst           │
│                                             │
│   Fügen Sie Ihre externen Partner hinzu,   │
│   um sie Projekten zuzuweisen.              │
│                                             │
│         [+ Ersten Lieferant erfassen]       │
│                                             │
└─────────────────────────────────────────────┘
```

### No Search Results

```
┌─────────────────────────────────────────────┐
│                                             │
│            🔍 Keine Ergebnisse              │
│                                             │
│   Keine Lieferanten gefunden für:          │
│   "Tischlerei München"                      │
│                                             │
│   [Filter anpassen]  [Neuen Lieferant erfassen] │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Quick Actions (Card Hover/Click)

### Quick View (Hover - Desktop)

Shows tooltip card with:
- Full company name
- All service categories
- Full address
- Rating breakdown (4 dimensions)
- Active contracts count
- Total project count

### Quick Actions Menu (Right-click or ... button)

- **Details anzeigen** → Navigate to supplier detail page
- **Vertrag erstellen** → Open contract creation form (INN/PLAN)
- **Projekt zuweisen** → Open project assignment dialog (INN/PLAN)
- **Rechnung erfassen** → Create supplier invoice (INN/BUCH)
- **Kommunikation loggen** → Log communication entry (INN)
- **Bearbeiten** → Edit supplier profile (INN/GF)
- **Sperren** → Blacklist supplier (GF only)
- **Löschen** → Soft delete (GF only)

---

## Mobile View (375px)

```
┌─────────────────────────────────┐
│ [☰] Lieferanten         [+] [?] │
├─────────────────────────────────┤
│                                 │
│ [    🔍 Suchen...            ]  │
│                                 │
│ [Alle Aktiv ▼] [Filter]        │
│                                 │
│ ┌───────────────────────────┐   │
│ │ 🏢 Schreinerei Müller     │   │
│ │ ⭐⭐⭐⭐⭐ 4.8              │   │
│ │ Subunternehmer            │   │
│ │ München • 5 Projekte      │   │
│ │ [Details →]               │   │
│ └───────────────────────────┘   │
│                                 │
│ ┌───────────────────────────┐   │
│ │ 🏢 Elektro Schmidt        │   │
│ │ ⭐⭐⭐⭐☆ 4.2              │   │
│ │ Dienstleister             │   │
│ │ Augsburg • 2 Projekte     │   │
│ │ [Details →]               │   │
│ └───────────────────────────┘   │
│                                 │
│ [Mehr laden...]                 │
│                                 │
└─────────────────────────────────┘
```

**Mobile Optimizations:**
- Cards: Full-width, stacked
- Swipe right: Quick assign to project
- Swipe left: Quick actions menu
- Pull down: Refresh list
- FAB: "+ Neuer Lieferant"

---

## Table View (Alternative Layout)

### Table Columns

| Firma | Typ | Kategorien | Standort | Bewertung | Aktive Projekte | Status | Aktionen |
|-------|-----|------------|----------|-----------|-----------------|--------|----------|
| Schreinerei Müller GmbH | Subunternehmer | Tischlerei, Möbel, Montage | München | ⭐⭐⭐⭐⭐ 4.8 | 5 | ✓ Aktiv | [...] |
| Elektro Schmidt GmbH | Dienstleister | Elektrik, Beleuchtung | Augsburg | ⭐⭐⭐⭐☆ 4.2 | 2 | ✓ Aktiv | [...] |

**Table Features:**
- **Sortable columns:** Click header to sort
- **Row selection:** Checkbox for bulk actions (Phase 2)
- **Row click:** Navigate to detail page
- **Pagination:** 20 per page, with page selector

---

## Filter Examples

### Pre-set Filters (Quick Buttons)

- **Alle Aktiven:** Status = Active, most common
- **Top-Bewertet:** Rating ≥ 4.5 stars
- **Verfügbar:** Active + activeProjectCount < 3 (not overbooked)
- **Benötigt Freigabe:** Status = PendingApproval (GF only)
- **Kürzlich verwendet:** Last activity < 30 days

---

## Performance Indicators

### Rating Color Coding

- **4.5-5.0:** Green + "Sehr gut"
- **3.5-4.4:** Blue + "Gut"
- **2.5-3.4:** Amber + "Befriedigend"
- **<2.5:** Red + "Ungenügend" + Warning icon

### Active Project Indicator

- **0 projects:** Gray + "Verfügbar"
- **1-2 projects:** Blue + "Verfügbar"
- **3-5 projects:** Amber + "Ausgelastet"
- **>5 projects:** Red + "Überlastet" + Warning

### Contract Indicator

- **Framework contract:** "Rahmenvertrag bis MM/YYYY" (green badge)
- **Project contracts:** "3 Verträge aktiv" (blue badge)
- **No contracts:** "Kein aktiver Vertrag" (gray)

---

## Bulk Actions (Phase 2)

**Select multiple suppliers:**
- Checkbox on each card
- **Actions:**
  - Export selected to CSV
  - Send RFQ to selected suppliers
  - Batch update: Change account manager
  - Batch update: Change status

---

## shadcn/ui Components

```bash
npx shadcn-ui@latest add card badge button input select checkbox table
```

---

## Accessibility

- **Search:** aria-label="Search suppliers"
- **Filters:** aria-expanded state for sidebar
- **Cards:** Focusable with keyboard, Enter opens detail
- **Ratings:** aria-label="Rating 4.8 out of 5 stars"
- **Status badges:** Color + text (not color alone)

---

## Example Data

- **24 Active suppliers**
- **2 Pending approval** (GF review queue)
- **3 Inactive** (no longer used)
- **0 Blacklisted** (all in good standing)
- **Top rated:** Schreinerei Müller (4.8 stars, 12 projects)
- **Most active:** Elektro Schmidt (5 active projects)

---

**End of supplier-list.md**


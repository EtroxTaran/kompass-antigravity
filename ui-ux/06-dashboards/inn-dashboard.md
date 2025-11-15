# INN Dashboard (Internal Services / INNEN) - Figma Make Prompt

## Context & Purpose

- **User Role**: INN (INNEN / Internal Services Coordination)
- **Business Value**: Supplier/subcontractor coordination, material procurement, project support
- **Access**: ALL suppliers, purchase orders, project materials, subcontractor assignments
- **Key Focus**: Procurement workflow, supplier management, delivery tracking, invoice processing
- **Note**: This is THE critical dashboard addressing Pre-Mortem Danger #3 (workflow gap)

## Figma Make Prompt

Create an INN (Internal Services) dashboard for KOMPASS showing supplier coordination, active purchase orders, material deliveries, pending approvals, and supplier performance with German labels and workflow-focused design.

**Header:**

- "Innendienst & Beschaffung" (28px, bold)
- View toggle: "Übersicht" | "Lieferanten" | "Bestellungen" | "Projekte"
- Quick filter: "Alle Projekte" | "Meine Zuständigkeiten"
- User: Avatar + "Claudia Weber (INN)"
- **AI Toggle:** Switch "KI-Features" (top-right, default OFF until Phase 3)

**KPI Cards (Top Row - 6 cards):**

1. **Aktive Lieferanten**
   - Count: "24" (36px, blue)
   - Top-bewertet: "18 mit >4 Sternen" (green)
   - Freigabe ausstehend: "2" (amber badge)
2. **Offene Bestellungen**
   - Count: "12" (36px, amber)
   - Value: "€ 245.000"
   - Fällig diese Woche: "3 Lieferungen" (orange badge)
3. **Lieferungen (heute)**
   - Expected: "5 Lieferungen" (blue)
   - Verspätet: "2" (red)
   - Erfasst: "3 von 5" (green checkmark)
4. **Lieferantenrechnungen**
   - Ausstehend: "8 Rechnungen" (amber)
   - Value: "€ 87.500"
   - Freigabe erforderlich: "3 >€1k" (red badge)
5. **Lagerbestand [Phase 2]**
   - Value: "€ 45.000" (36px, blue)
   - Artikel: "142 Positionen"
   - Nachbestellung: "8 unter Mindestbestand" (amber)
6. **Lieferanten-Performance**
   - Durchschnitt: "⭐⭐⭐⭐☆ 4.3" (36px, green)
   - Bewertungen: "45 abgeschlossene Aufträge"
   - **[Phase 3]** Top-Performer: "Schreinerei Müller (4.8)"

**Section: Heutige Lieferungen (Today's Deliveries)**

- **Delivery Timeline (horizontal cards):**
  - Each card: Time, supplier, project, materials, status
  - Color-coded: Green (erfasst), Blue (erwartet), Red (verspätet)

  ```
  09:00 ✓ | Schreinerei Müller • P-2025-M003 • 3 Positionen
           LED-Panels (24 Stk), Regale (8 Stk), Theke (1 Stk)
           [Lieferung erfasst: 09:15]

  11:00 ⏳ | Elektro Schmidt • P-2025-B015 • 5 Positionen
           ETA: 11:30 • 15 Minuten verspätet
           [Lieferung erfassen]

  14:00 🔴 | Holzgroßhandel Weber • P-2024-M007 • 2 Positionen
           VERSPÄTET! Original: 12.02 • Neuer ETA: 15.02
           [Lieferant kontaktieren] [Verzögerung loggen]
  ```

- **Actions:**
  - [Lieferung erfassen] → Opens delivery recording modal
  - [Lieferant kontaktieren] → Opens communication log
  - [Alle anzeigen →] → Full delivery schedule

**Section: Offene Bestellungen (Open Purchase Orders)**

- **Table with filters:**
  - Columns: PO-Nr., Projekt, Lieferant, Wert, Benötigt bis, Status, Aktion
  - Rows: All POs with status ≠ Delivered
  - Sort: By required date (soonest first)

  | PO-Nr.      | Projekt     | Lieferant   | Wert      | Benötigt bis | Status          | Aktion       |
  | ----------- | ----------- | ----------- | --------- | ------------ | --------------- | ------------ |
  | PO-2025-234 | P-2025-M003 | Müller GmbH | € 118.450 | 15.02.25     | 🚚 In Lieferung | [Lieferung]  |
  | PO-2025-235 | P-2025-B015 | Schmidt     | € 35.600  | 20.02.25     | 🟡 Bestätigt    | [Verfolgen]  |
  | PO-2025-236 | P-2024-M007 | Weber KG    | € 22.000  | 18.02.25     | ⏳ Gesendet     | [Nachfassen] |

- **Status badges:**
  - Entwurf (Draft): Gray
  - Freigabe ausstehend: Amber + clock
  - Genehmigt: Blue + checkmark
  - Gesendet (Sent): Blue
  - Bestätigt (Confirmed): Green
  - In Lieferung (In Transit): Blue pulse
  - Verspätet (Delayed): Red warning

- **Actions:**
  - [Lieferung erfassen] → Record delivery
  - [Verfolgen] → Track shipment (external link to carrier)
  - [Nachfassen] → Contact supplier for confirmation
  - [Stornieren] → Cancel PO (requires reason)

**Section: Lieferantenrechnungen zur Freigabe (Supplier Invoices Pending Approval)**

- **Alert-style cards:**
  - Show invoices waiting for BUCH/GF approval
  - Each card: Supplier, project, invoice number, amount, due date, days waiting

  ```
  🟡 Rechnung R-SUP-24-456 • Schreinerei Müller
     Projekt: P-2025-M003 • € 118.450 • Fällig: 15.03.2025
     Wartet auf: BUCH-Freigabe (seit 2 Tagen)
     [Details] [Freigabe anfragen]

  🔴 Rechnung R-SUP-24-423 • Elektro Schmidt
     Projekt: P-2025-B015 • € 35.600 • Fällig: 10.03.2025
     Wartet auf: GF-Freigabe (seit 5 Tagen) - Über €10k
     [Details] [GF benachrichtigen]
  ```

- **Actions:**
  - [Details] → View invoice details
  - [Freigabe anfragen] → Send reminder to approver
  - [GF benachrichtigen] → Escalate if urgent

**Section: Lieferanten-Übersicht (Supplier Overview)**

- **Supplier Performance Grid (Top 6 suppliers):**
  - Cards: Supplier name, rating, active projects, last activity

  ```
  ┌────────────────────────────┐ ┌────────────────────────────┐
  │ 🏢 Schreinerei Müller      │ │ 🏢 Elektro Schmidt         │
  │ ⭐⭐⭐⭐⭐ 4.8              │ │ ⭐⭐⭐⭐☆ 4.2              │
  │ 5 aktive Projekte          │ │ 2 aktive Projekte          │
  │ Letzte Aktivität: Vor 2 Tg │ │ Letzte Aktivität: Vor 1 W  │
  │ [Details] [Vertrag]        │ │ [Details] [Kontakt]        │
  └────────────────────────────┘ └────────────────────────────┘
  ```

- **Quick Filters:**
  - [Alle anzeigen] → Full supplier list
  - [Top-bewertet >4.5⭐] → High performers only
  - [Freigabe ausstehend] → Pending approval (GF queue)
  - [Verfügbar] → Suppliers with capacity

**Section: Material-Nachbestellungen [Phase 2] (Low Stock Alerts)**

- **Alert cards for materials below minimum stock:**

  ```
  ⚠️ Nachbestellung erforderlich:

  LED-Panel 60x60cm warmweiß (MAT-LED-001)
  Aktueller Bestand: 8 Stk (Mindest: 20 Stk)
  Durchschn. Verbrauch: 15 Stk/Monat
  Empfohlen: 50 Stk nachbestellen
  [Bestellung erstellen] [Später erinnern]

  Ladenregal Eiche Standard (MAT-SHE-012)
  Aktueller Bestand: 2 Stk (Mindest: 5 Stk)
  Durchschn. Verbrauch: 6 Stk/Monat
  Empfohlen: 10 Stk nachbestellen
  [Bestellung erstellen] [Später erinnern]
  ```

- **If no alerts:** "✓ Alle Lagerbestände ausreichend" (green)

**Section: Projekt-Zuweisungen (Project Assignments - Subcontractors)**

- **Table: Active subcontractor work assignments:**

  | Projekt     | Lieferant         | Arbeitspaket          | Zeitraum | Status        | Budget      | Aktion        |
  | ----------- | ----------------- | --------------------- | -------- | ------------- | ----------- | ------------- |
  | P-2025-M003 | Elektro Schmidt   | Elektrik Installation | 01-15.02 | In Arbeit 65% | ✓ Im Rahmen | [Verfolgen]   |
  | P-2025-B015 | Tischlerei Müller | Ladenregale           | 10-25.02 | Geplant       | —           | [Beauftragen] |
  | P-2024-M007 | Maler Wagner      | Wandbemalung          | 05-10.03 | Verzögert!    | ⚠️ +8%      | [Kontakt]     |

- **Status:**
  - Geplant (Planned): Gray
  - Bestätigt (Confirmed): Blue
  - In Arbeit (In Progress): Blue + progress %
  - Verzögert (Delayed): Red warning
  - Abgeschlossen (Completed): Green checkmark

- **Budget indicator:**
  - ✓ Im Rahmen: Green
  - ⚠️ +X%: Amber (over estimate)
  - 🔴 +X%: Red (significant overrun)

- **Actions:**
  - [Verfolgen] → View work progress details
  - [Beauftragen] → Confirm assignment, send work order
  - [Kontakt] → Log communication with subcontractor
  - [Bewerten] → Rate performance (after completion)

**Section: RFQs & Angebots-Auswertung (Request for Quotes - Phase 2)**

- **Active RFQ tracking:**

  ```
  RFQ-2025-089: Ladenregale für REWE München
  Gesendet an: 3 Lieferanten • Frist: 20.02.2025

  Angebote erhalten: 2 von 3
  ✓ Schreinerei Müller: € 6.800 (14 Tage Lieferzeit)
  ✓ Holzgroßhandel Weber: € 6.200 (21 Tage Lieferzeit)
  ⏳ Tischlerei Neumann: Ausstehend

  Empfehlung: Weber KG (günstigster Preis)
  [Angebote vergleichen] [Auftrag erteilen] [RFQ abbrechen]
  ```

- **If no active RFQs:** "+ RFQ erstellen" button

**Section: Kommunikation & Folgeaufgaben (Communications & Follow-ups)**

- **Recent supplier communications:**
  - Timeline view (last 7 days)
  - Filter: All suppliers / Requires follow-up

  ```
  📧 Gestern, 16:45 - Schreinerei Müller
  Betreff: Bestätigung PO-2025-234
  "Bestellung erhalten. Lieferung planmäßig 15.02."
  [Antworten] [Als erledigt markieren]

  📞 Vor 2 Tagen - Elektro Schmidt
  Betreff: Verzögerung Lieferung
  "Material verspätet sich um 3 Tage. Neuer ETA: 18.02."
  Folgeaufgabe: ⚠️ PLAN benachrichtigen (fällig: heute)
  [Aufgabe erledigen] [PLAN benachrichtigen]

  🤝 Vor 3 Tagen - Werkstattbesuch Weber KG
  Betreff: Qualitätsprüfung Ladenregale
  "8 Regale geprüft und freigegeben. Versand 12.02."
  [Details anzeigen]
  ```

- **Quick Actions:**
  - [+ Kommunikation loggen]
  - [Folgeaufgaben anzeigen (5)] → Filter to follow-up required
  - [Alle Kommunikationen →]

**Section: Freigaben & Genehmigungen (Approvals & Authorizations)**

- **Items waiting for INN action:**

  ```
  📋 Warten auf Ihre Aktion (4):

  ☐ Lieferung prüfen: PO-2025-234 (Müller, € 118k)
     Geliefert: Heute, 09:15 • [Lieferung prüfen]

  ☐ Rechnung erfassen: Elektro Schmidt (€ 35.6k)
     Rechnung erhalten per E-Mail • [Rechnung erfassen]

  ☐ Lieferant-Freigabe: Transport Neumann
     Erstellt von: Ihnen, vor 2 Tagen • [Zur GF-Freigabe]

  ☐ RFQ-Angebot auswählen: Ladenregale REWE
     2 von 3 Angeboten erhalten • [Angebote vergleichen]
  ```

- **Completion:** Check checkbox when done, item moves to "Erledigt"

**Section: Lieferanten-Performance (Top/Bottom Performers)**

- **Two columns:**

  **Top-Performer (left):**

  ```
  🏆 Top 3 Lieferanten (letztes Quartal)

  1. Schreinerei Müller GmbH
     ⭐⭐⭐⭐⭐ 4.8 • 12 Projekte • 95% pünktlich

  2. Elektro Schmidt GmbH
     ⭐⭐⭐⭐☆ 4.5 • 8 Projekte • 88% pünktlich

  3. Holzgroßhandel Weber KG
     ⭐⭐⭐⭐☆ 4.2 • 15 Projekte • 92% pünktlich

  [Alle Lieferanten →]
  ```

  **Problemfälle (right):**

  ```
  ⚠️ Aufmerksamkeit erforderlich

  Maler Wagner
  ⭐⭐☆☆☆ 2.8 • 3 Projekte • 2 Verzögerungen
  Letzte Bewertung: "Unzuverlässig" (Projekt B015)
  [Details] [GF eskalieren]

  Transport Neumann
  (Noch nicht bewertet) • 1 Projekt • Neu
  Freigabe ausstehend seit 5 Tagen
  [GF-Freigabe anfragen]
  ```

**Section: Projekt-Material-Übersicht (Project Materials Overview)**

- **Grouped by project:**
  - Show projects with pending material actions
  - Each project card: Name, material count, procurement status, alerts

  ```
  ▼ P-2025-M003: REWE München (12 Materialien)
     Status: 8 bestellt • 5 geliefert • 4 offen
     Budget: € 95.200 / € 125.000 (76%) ✓
     Nächste Lieferung: Morgen (Elektro Schmidt)
     [Materialbedarf anzeigen] [Bestellung erstellen]

  ▼ P-2025-B015: Hofladen Müller (8 Materialien)
     Status: 3 bestellt • 0 geliefert • 5 offen
     Budget: € 12.000 / € 45.000 (27%) ✓
     ⚠️ Aktion erforderlich: 5 Materialien noch nicht bestellt
     [Materialbedarf anzeigen] [Bestellung erstellen]
  ```

- **Quick Filters:**
  - [Alle Projekte] → All active
  - [Aktion erforderlich] → Projects with pending procurement
  - [Lieferungen diese Woche] → Deliveries expected soon

**Section: Material-Preisaktualisierungen [Phase 2] (Material Price Updates)**

- **Price change alerts:**

  ```
  📊 Preisänderungen diese Woche:

  LED-Panel 60x60cm (MAT-LED-001)
  Schreinerei Müller: € 145 → € 142 (-2,1%) ↓
  Betrifft: 3 aktive Projekte
  [Kalkulationen aktualisieren] [Ignorieren]

  Ladenregal Eiche (MAT-SHE-012)
  Weber KG: € 850 → € 895 (+5,3%) ↑
  Betrifft: 2 offene Angebote
  [KALK benachrichtigen] [Angebote anpassen]
  ```

- **Actions:**
  - Auto-update prices in catalog
  - Notify KALK for active estimates
  - Flag affected projects

**Section: Aufgaben & Erinnerungen (Tasks & Reminders)**

- **Checklist of recurring and urgent tasks:**
  - ☐ Lieferanten-Bewertungen ausstehend (3)
  - ☐ Versicherungsnachweise prüfen (2 laufen in 30 Tagen ab)
  - ☐ Rahmenverträge erneuern (1 läuft in 60 Tagen ab)
  - ☐ Lagerbestandsprüfung (monatlich, fällig: 28.02)
  - ☐ Lieferanten-Performance-Bericht (quartalsweise, fällig: 31.03)

**Quick Actions (Sidebar or FAB):**

- "+ Neuer Lieferant"
- "+ Bestellung erstellen"
- "Lieferung erfassen"
- "Rechnung erfassen"
- "Kommunikation loggen"
- "📊 Lieferanten-Bericht"
- "Export (CSV/PDF)"

**Mobile-First PWA Enhancements:**

- **Bottom Navigation (5 tabs):**
  - "Dashboard" (grid icon) - Main view
  - "Lieferanten" (building icon) - Supplier list
  - "📦" (box icon) - Purchase orders
  - "✓" (checkmark icon) - Deliveries
  - "Mehr" (dots) - Settings

- **Swipe Gestures:**
  - Swipe right on PO: Mark as delivered (quick record)
  - Swipe left on delivery: Open tracking details
  - Long press on supplier: Quick actions menu
  - Pull down: Refresh all data

- **PWA Features:**
  - **Push Notifications:**
    - "🚚 Lieferung angekommen: PO-2025-234"
    - "⏰ Lieferung verspätet: Weber KG (+3 Tage)"
    - "💰 Rechnung freigegeben: € 35.600"
  - **Offline Mode:**
    - Supplier list cached
    - PO list cached
    - Delivery recording queued
    - Auto-sync when online
  - **Camera Features:**
    - Scan delivery notes (OCR)
    - Photo damaged goods
    - Barcode scan for material verification

- **Mobile Layout Optimizations:**
  - KPI cards: 2x3 grid, swipeable
  - Tables: Card view with key info
  - Delivery timeline: Horizontal scroll
  - Sticky section headers
  - FAB: Contextual (+ PO or Record Delivery)

- **Performance:**
  - Skeleton loaders for all sections
  - Progressive data loading
  - Optimistic UI for delivery recording
  - < 2s load on 3G

**Mobile:** Cards stack, tables as scrollable cards, quick actions bottom bar

## Design Requirements

### Visual Hierarchy

1. Today's deliveries: Prominent, time-ordered
2. Pending approvals: Alert-style cards
3. Open POs: Clear status indicators
4. Supplier performance: Visual ratings

### shadcn/ui Components

```bash
npx shadcn-ui@latest add card badge button table alert checkbox progress tabs
# Charts: Use recharts for performance trends
```

### Charts

- **Supplier Performance Trend:** Line chart (last 6 months)
- **Purchase Order Volume:** Bar chart (by month)
- **Delivery Punctuality:** Donut chart (on-time vs. delayed)
- **Material Cost Trend [Phase 2]:** Line chart (price movements)

### Interaction

- Click PO: Navigate to PO detail
- Click supplier: Navigate to supplier detail
- Click project: Navigate to project materials view
- Quick actions: Inline buttons for common tasks
- Filters: Multi-select, auto-apply

### Accessibility

- All tables have keyboard navigation
- Status badges: Color + icon + text
- Alert priorities: Screen reader announces
- Quick actions: Keyboard accessible

### Color Coding

- **Green:** Delivered, on-time, approved
- **Blue:** In progress, confirmed, active
- **Amber:** Pending, waiting, low stock
- **Red:** Delayed, overdue, requires escalation

### Example Data

- **Today's deliveries:** 5 expected, 3 recorded, 2 pending
- **Open POs:** 12 orders, € 245k total value
- **Pending invoices:** 8 invoices, € 87.5k total
- **Top supplier:** Schreinerei Müller (4.8 stars, 12 projects)
- **Alert:** Low stock on 8 materials
- **Delayed:** 2 deliveries overdue

---

**End of inn-dashboard.md**

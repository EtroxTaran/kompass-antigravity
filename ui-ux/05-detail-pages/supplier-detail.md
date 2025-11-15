# Supplier Detail Page - Figma Make Prompt

## Context & Purpose

- **Entity:** Supplier / Subcontractor Profile
- **Users:** All authenticated users (read), INN/GF (edit)
- **Purpose:** Complete supplier profile, contracts, performance history, project assignments
- **Key Focus:** Performance tracking, contract management, communication history

## Figma Make Prompt

Create a detailed supplier profile page for KOMPASS showing supplier information, performance metrics, active contracts, project history, communications, and rating breakdown with German labels.

**Page Title:** Company name as H1, e.g., "Schreinerei Müller GmbH"

**Breadcrumb:**

- "Lieferanten" > "Schreinerei Müller GmbH"

**Header Actions:**

- **Edit:** "Bearbeiten" button (INN/GF only)
- **Quick Actions Dropdown:**
  - "Vertrag erstellen"
  - "Projekt zuweisen"
  - "Rechnung erfassen"
  - "Kommunikation loggen"
  - "Performance-Bericht (PDF)"
- **Status Toggle:** "Sperren" / "Deaktivieren" (GF only)

---

## Page Layout

### Desktop (1440px)

```
┌────────────────────────────────────────────────────────────────┐
│ [←] Lieferanten                         [Bearbeiten] [Aktionen▼]│
├────────────────────────────────────────────────────────────────┤
│                                                                │
│ 🏢 Schreinerei Müller GmbH                ⭐⭐⭐⭐⭐ 4.8        │
│ Subunternehmer • München                  ✓ Aktiv             │
│                                                                │
│ ┌─────────────────────────────────────────────────────────┐   │
│ │ Tabs: [Übersicht] [Verträge] [Projekte] [Kommunikation]│   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                                │
│ ┌─ Übersicht Tab ─────────────────────────────────────────┐   │
│ │                                                          │   │
│ │ ┌─ Kontakt ──────────┬─ Performance ──────────────────┐ │   │
│ │ │ 📧 mueller@ex.de   │ ⭐ Bewertung: 4.8/5.0          │ │   │
│ │ │ 📞 +49 89 1234567  │   Qualität: ⭐⭐⭐⭐⭐ 4.9      │ │   │
│ │ │ 🌐 mueller.de      │   Zuverlässigkeit: ⭐⭐⭐⭐☆ 4.5│ │   │
│ │ │ 📍 Industriestr. 42│   Kommunikation: ⭐⭐⭐⭐⭐ 5.0 │ │   │
│ │ │    80331 München   │   Preis/Leistung: ⭐⭐⭐⭐☆ 4.2│ │   │
│ │ └────────────────────┤                                │ │   │
│ │                      │ 📊 Projekte                    │ │   │
│ │ ┌─ Leistungen ──────┤   Gesamt: 12 Projekte          │ │   │
│ │ │ Tischlerei         │   Aktiv: 5 Projekte            │ │   │
│ │ │ Möbel              │   Pünktlich: 92%               │ │   │
│ │ │ Montage            │                                │ │   │
│ │ └────────────────────┤ 💰 Finanzübersicht             │ │   │
│ │                      │   Gesamtvolumen: € 450.000     │ │   │
│ │ ┌─ Geschäft ────────┤   Offene Rechnungen: € 12.500  │ │   │
│ │ │ Zahlungsziel:     │   Durchschn. Rechnung: € 8.400 │ │   │
│ │ │ 30 Tage (2% Skonto)│                                │ │   │
│ │ │ Mindestbestellung: │ 📅 Aktivität                   │ │   │
│ │ │ € 500              │   Erstellt: 15.03.2023         │ │   │
│ │ │ Lieferzeit: 14 Tage│   Letzte Beauftragung: Vor 2 W │ │   │
│ │ │ Account Mgr:       │   Letzter Kontakt: Vor 3 Tagen │ │   │
│ │ │ Claudia Weber      │                                │ │   │
│ │ └────────────────────┴────────────────────────────────┘ │   │
│ │                                                          │   │
│ │ ┌─ Interne Notizen ────────────────────────────────────┐│   │
│ │ │ Sehr zuverlässiger Partner. Hochwertige Arbeit.      ││   │
│ │ │ Termingerecht. Empfehlung für Premium-Projekte.      ││   │
│ │ │                                                      ││   │
│ │ │ [Bearbeiten]                        - Claudia, 15.10││   │
│ │ └──────────────────────────────────────────────────────┘│   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Tab 1: Übersicht (Overview)

### Left Column: Contact & Services

**Kontaktdaten (Contact Information):**

- Email: Clickable mailto: link
- Phone: Clickable tel: link
- Mobile: If available
- Website: Clickable external link icon
- Address: Full address with map icon (opens Google Maps)

**Leistungskategorien (Service Categories):**

- All selected categories as blue pill badges
- **Leistungsbeschreibung:** Full text, expandable if >300 chars
- **Arbeitsradius:** "50 km" (if set)

**Geschäftsbedingungen (Business Terms):**

- Payment method + terms
- Minimum order value (if set)
- Delivery lead time (if set)
- Account manager (INN user with avatar)

### Right Column: Performance & Activity

**Performance Card:**

- Overall rating: Large stars + numeric (4.8/5.0)
- Breakdown: 4 dimensions with small stars
- Based on: "Basiert auf 12 Bewertungen"
- Trend: "↗ +0.3 vs. letztes Quartal" (green)

**Projektkennzahlen (Project Metrics):**

- Total projects: 12
- Active projects: 5
- Completion rate: "92% pünktlich" (green if >85%)
- Average project value: "€ 37.500"

**Finanzkennzahlen (Financial Metrics):**

- Total contract volume: "€ 450.000" (all-time)
- Outstanding invoices: "€ 12.500" (current)
- Average invoice: "€ 8.400"
- Payment reliability: "95%" (% paid on time)

**Aktivität (Activity Timeline):**

- Created: Date + by whom
- Last contract: Date + project reference
- Last contact: Date + communication summary

**Interne Notizen (Internal Notes - Collapsible):**

- Rich text display (Phase 2) or plain text (Phase 1)
- Last edited by + date
- [Bearbeiten] button → Opens inline editor

---

## Tab 2: Verträge (Contracts)

**Contract List Table:**

| Vertragsnr.   | Typ           | Projekt     | Wert      | Status        | Laufzeit    | Aktionen |
| ------------- | ------------- | ----------- | --------- | ------------- | ----------- | -------- |
| SC-2025-00123 | Projekt       | P-2025-M003 | € 45.000  | In Ausführung | 01.02-28.02 | [...]    |
| SC-2024-00098 | Rahmenvertrag | —           | € 200.000 | Unterzeichnet | 01/24-12/25 | [...]    |
| SC-2024-00067 | Projekt       | P-2024-B015 | € 38.000  | Abgeschlossen | 15.11-20.12 | [...]    |

**Columns:**

- **Vertragsnr.:** Contract number (link to contract detail)
- **Typ:** Framework / Project / ServiceAgreement / PurchaseOrder
- **Projekt:** Project number (link) or "—" for framework
- **Wert:** Contract value (€)
- **Status:** Badge (Entwurf, Unterzeichnet, In Ausführung, Abgeschlossen)
- **Laufzeit:** Start - End dates or "Laufend" for open-ended
- **Aktionen:** [...] menu → View PDF, Edit (if Draft), Terminate

**Status Badges:**

- **Entwurf (Draft):** Gray
- **Freigabe ausstehend (PendingApproval):** Amber
- **Gesendet (SentToSupplier):** Blue
- **Unterzeichnet (Signed):** Green
- **In Ausführung (InExecution):** Blue pulse
- **Abgeschlossen (Completed):** Green checkmark
- **Gekündigt (Terminated):** Red
- **Storniert (Cancelled):** Gray strikethrough

**Actions:**

- [+ Neuer Vertrag] button (top-right, INN/PLAN)
- Filter: Status, Project, Date range
- Sort: By date (newest first), by value (highest first)

**Empty State:**

- "Noch keine Verträge mit diesem Lieferanten"
- [+ Ersten Vertrag erstellen] button

---

## Tab 3: Projekte (Projects)

**Project Assignment List:**

| Projekt     | Arbeitspaket          | Zeitraum    | Kosten (Plan/Ist)   | Status          | Bewertung      | Aktionen |
| ----------- | --------------------- | ----------- | ------------------- | --------------- | -------------- | -------- |
| P-2025-M003 | Elektrik Installation | 01.02-15.02 | € 12.000 / € 11.800 | In Arbeit (85%) | -              | [...]    |
| P-2024-B015 | Kühlraumtüren         | 15.11-20.12 | € 38.000 / € 37.200 | Abgeschlossen   | ⭐⭐⭐⭐⭐ 5.0 | [...]    |
| P-2024-M007 | Ladenregale           | 05.09-30.09 | € 22.000 / € 24.500 | Abgeschlossen   | ⭐⭐⭐☆☆ 3.5   | [...]    |

**Columns:**

- **Projekt:** Project number + name (link)
- **Arbeitspaket:** Work package description
- **Zeitraum:** Planned dates (actual if completed)
- **Kosten:** Estimated / Actual (color: green if under, red if over)
- **Status:** Progress % or completed
- **Bewertung:** Stars (only after completion)
- **Aktionen:** [...] menu → View details, Rate performance, View invoice

**Actions:**

- [+ Projekt zuweisen] button (top-right, INN/PLAN)
- Filter: Status, Date range, Project
- Sort: By date (newest first), by status

**Empty State:**

- "Dieser Lieferant ist noch keinem Projekt zugewiesen"
- [+ Projekt zuweisen] button

---

## Tab 4: Kommunikation (Communications)

**Communication Timeline:**

```
┌────────────────────────────────────────────────────────┐
│ [+ Neue Kommunikation loggen]                Filter ▼  │
├────────────────────────────────────────────────────────┤
│                                                        │
│ 📧 E-Mail • Ausgehend                       15.11.2024│
│ Betreff: Angebot für Projekt REWE München             │
│ Von: Claudia Weber → info@mueller.de                   │
│ RFQ für Ladenregale verschickt. Angebot bis 20.11.    │
│ Anhang: RFQ-2024-089.pdf                               │
│ [Antwort erfassen] [Details anzeigen]                 │
│                                                        │
│ 📞 Telefonat • Eingehend                    12.11.2024│
│ Betreff: Rückfrage zu Holzarten                       │
│ Von: Herr Müller → Claudia Weber (8 Min)              │
│ Kunde bevorzugt Eiche statt Buche. Aufpreis: +€ 2.500│
│ Folgeaktion: ✓ Erledigt                               │
│ [Details anzeigen]                                     │
│                                                        │
│ 🤝 Vor-Ort • Persönlich                    08.11.2024│
│ Betreff: Werkstattbesuch                              │
│ Teilnehmer: Claudia Weber, Herr Müller                │
│ Besichtigung neuer CNC-Maschine. Kapazität +30%.      │
│ Fotos: 4 Bilder                                        │
│ [Fotos anzeigen]                                       │
│                                                        │
│ [Ältere Einträge laden...] (15 von 23 angezeigt)      │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Communication Card:**

- Icon: Type (📧 Email, 📞 Phone, 🤝 InPerson, 💬 SMS, 📹 Video)
- Direction: "Eingehend" / "Ausgehend"
- Date: DD.MM.YYYY (right-aligned)
- Subject: Bold, 20px
- Participants: From/To names
- Content: First 200 chars, "Mehr anzeigen ↓" to expand
- Attachments: File list with preview icons
- Follow-up indicator: If requires follow-up and not completed (amber badge)
- Actions: [Details anzeigen] [Antworten] [Follow-up hinzufügen]

**Add Communication:**

- Opens modal form
- Fields: Type, Date, Subject, Content, Attachments, Follow-up required
- Quick templates: "Angebot angefordert", "Rechnung erhalten", "Qualitätsproblem gemeldet"

---

## Tab 5: Rechnungen (Invoices)

**Invoice List Table:**

| Rechnungsnr. | Projekt     | Rechnungsdatum | Fälligkeit | Betrag   | Status    | Bezahlt  | Aktionen |
| ------------ | ----------- | -------------- | ---------- | -------- | --------- | -------- | -------- |
| R-SUP-24-456 | P-2025-M003 | 05.02.2025     | 07.03.2025 | € 12.000 | Genehmigt | —        | [...]    |
| R-SUP-24-423 | P-2024-B015 | 22.12.2024     | 21.01.2025 | € 38.000 | Bezahlt   | 15.01.25 | [...]    |
| R-SUP-24-398 | P-2024-M007 | 05.10.2024     | 04.11.2024 | € 24.500 | Bezahlt   | 28.10.24 | [...]    |

**Columns:**

- **Rechnungsnr.:** Supplier's invoice number
- **Projekt:** Project number (link)
- **Rechnungsdatum:** Invoice date
- **Fälligkeit:** Due date (red if overdue)
- **Betrag:** Gross amount (€)
- **Status:** Pending / Approved / Paid / Disputed
- **Bezahlt:** Paid date or "—"
- **Aktionen:** [...] menu → View PDF, Approve, Mark paid, Dispute

**Status Badges:**

- **Ausstehend (Pending):** Amber
- **Genehmigt (Approved):** Blue + checkmark
- **Bezahlt (Paid):** Green + checkmark
- **Umstritten (Disputed):** Red + warning

**Summary Cards (top):**

- **Offene Rechnungen:** "€ 12.500" (2 Rechnungen) - Amber
- **Überfällige Rechnungen:** "€ 0" (0 Rechnungen) - Green
- **Dieses Jahr bezahlt:** "€ 248.000" (18 Rechnungen) - Blue

**Actions:**

- [+ Rechnung erfassen] button (top-right, INN/BUCH)

---

## Tab 6: Dokumente (Documents)

**Document Library:**

```
┌────────────────────────────────────────────────────────┐
│ Dokument-Typ      [Alle ▼]  [+ Dokument hochladen]     │
├────────────────────────────────────────────────────────┤
│                                                        │
│ 📄 Versicherungsnachweis_2024.pdf          ✓ Gültig   │
│    Hochgeladen: 15.03.2024 • Gültig bis: 31.12.2024   │
│    [Anzeigen] [Herunterladen]                          │
│                                                        │
│ 📄 Gewerbeanmeldung.pdf                                │
│    Hochgeladen: 15.03.2024                             │
│    [Anzeigen] [Herunterladen]                          │
│                                                        │
│ 📄 Meisterbrief_Tischlerei.pdf                         │
│    Hochgeladen: 15.03.2024                             │
│    [Anzeigen] [Herunterladen]                          │
│                                                        │
│ 📄 Referenz_REWE_Hamburg.pdf                           │
│    Hochgeladen: 20.04.2024                             │
│    [Anzeigen] [Herunterladen]                          │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Document Categories:**

- Versicherungsnachweise (Insurance certificates)
- Lizenzen & Genehmigungen (Licenses & permits)
- Qualifikationen (Qualifications)
- Referenzen (References)
- Verträge (Contracts - auto-linked)
- Rechnungen (Invoices - auto-linked)
- Sonstige (Other)

**Document Indicators:**

- **Gültig (Valid):** Green checkmark + expiry date
- **Abgelaufen (Expired):** Red warning + "Erneuern erforderlich"
- **Läuft bald ab (Expiring):** Amber warning (within 30 days)

**Upload:**

- [+ Dokument hochladen] button
- Select category, upload file, add notes
- Automatic categorization for known document types

---

## Performance Chart (Übersicht Tab)

**Rating Trend (Line Chart - last 12 months):**

- X-axis: Months
- Y-axis: Overall rating (0-5 stars)
- Blue line: Rating trend
- Markers: Individual project ratings
- Hover: Shows project name + specific rating

**Project Completion Timeline (Gantt-style):**

- Shows last 6 projects
- Bars: Planned vs. actual timeline
- Color: Green (on-time), Red (delayed)
- Hover: Shows completion details

---

## Mobile View (375px)

```
┌─────────────────────────────────┐
│ [←] Schreinerei Müller GmbH [...]│
├─────────────────────────────────┤
│ ⭐⭐⭐⭐⭐ 4.8 • Subunternehmer  │
│ ✓ Aktiv • 5 Projekte            │
│                                 │
│ [Übersicht][Verträge][Projekte] │
│                                 │
│ ▼ Kontakt                       │
│ 📧 mueller@example.de           │
│ 📞 +49 89 1234567 [Anrufen]     │
│ 📍 München [Navigation]         │
│                                 │
│ ▼ Leistungen                    │
│ [Tischlerei][Möbel][Montage]    │
│ Spezialisiert auf...            │
│                                 │
│ ▼ Performance                   │
│ ⭐ 4.8/5.0 (12 Bewertungen)     │
│ 📊 92% pünktlich                │
│ 💰 € 450k Gesamtvolumen         │
│                                 │
│ ▼ Aktive Projekte (5)           │
│ [Liste anzeigen ▼]              │
│                                 │
│ ▼ Dokumente (6)                 │
│ [Liste anzeigen ▼]              │
│                                 │
│ [Vertrag erstellen]             │
│ [Projekt zuweisen]              │
│                                 │
└─────────────────────────────────┘
```

**Mobile Optimizations:**

- Collapsible sections (accordion)
- Swipeable tabs for main sections
- Click-to-call phone numbers
- Click-to-email email addresses
- Click-to-navigate addresses (Google Maps)
- Bottom action bar with primary actions

---

## Rating Detail Modal

**Trigger:** Click on rating breakdown

**Modal Content:**

```
┌──────────────────────────────────────────────────────────┐
│ Bewertungsdetails: Schreinerei Müller GmbH        [×]   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ Gesamtbewertung                             ⭐⭐⭐⭐⭐ 4.8 │
│ Basierend auf 12 abgeschlossenen Projekten              │
│                                                          │
│ ┌─ Dimensionen ────────────────────────────────────────┐│
│ │ Qualität           ⭐⭐⭐⭐⭐ 4.9                       ││
│ │ Zuverlässigkeit    ⭐⭐⭐⭐☆ 4.5                       ││
│ │ Kommunikation      ⭐⭐⭐⭐⭐ 5.0                       ││
│ │ Preis/Leistung     ⭐⭐⭐⭐☆ 4.2                       ││
│ └──────────────────────────────────────────────────────┘│
│                                                          │
│ ┌─ Einzelbewertungen ──────────────────────────────────┐│
│ │ P-2024-B015 (Hofladen Müller)            ⭐⭐⭐⭐⭐ 5.0││
│ │ "Hervorragende Arbeit, pünktlich, sauber"            ││
│ │ - Thomas Fischer (PLAN), 22.12.2024                   ││
│ │                                                       ││
│ │ P-2024-M007 (REWE München)                ⭐⭐⭐⭐☆ 4.2││
│ │ "Gute Qualität, leichte Verzögerung (3 Tage)"        ││
│ │ - Claudia Weber (INN), 05.10.2024                     ││
│ │                                                       ││
│ │ P-2024-B003 (EDEKA Augsburg)              ⭐⭐⭐⭐⭐ 5.0││
│ │ "Perfekt, empfehlenswert für Premium-Projekte"       ││
│ │ - Thomas Fischer (PLAN), 30.08.2024                   ││
│ │                                                       ││
│ │ [Mehr anzeigen...] (12 gesamt)                        ││
│ └───────────────────────────────────────────────────────┘│
│                                                          │
│ Trend: ↗ +0.3 vs. letztes Quartal                       │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## Action Buttons (Context-Aware)

### For Active Suppliers

- **Vertrag erstellen** → Opens contract form pre-filled with supplier
- **Projekt zuweisen** → Opens project assignment dialog
- **Rechnung erfassen** → Opens invoice form pre-filled with supplier
- **Kommunikation loggen** → Opens communication log form
- **Bearbeiten** → Opens supplier edit form
- **Performance-Bericht** → Downloads PDF report (performance summary)

### For Pending Suppliers (GF only)

- **Freigeben** → Approve supplier (sets status = Active)
- **Ablehnen** → Reject supplier (requires reason)
- **Bearbeiten** → Request changes from INN

### For Blacklisted Suppliers (GF only)

- **Entsperren** → Remove from blacklist (requires reason)
- **Grund anzeigen** → Shows blacklist reason modal

---

## Approval Workflow (GF Dashboard Integration)

**Pending Approval Card (GF Dashboard):**

```
┌────────────────────────────────────────────────────────┐
│ 🟡 Lieferant wartet auf Freigabe                       │
├────────────────────────────────────────────────────────┤
│ Schreinerei Müller GmbH                                │
│ Subunternehmer • Tischlerei, Möbel                     │
│ Erstellt von: Claudia Weber • Vor 2 Tagen              │
│                                                        │
│ [Details anzeigen] [Freigeben ✓] [Ablehnen ✗]         │
└────────────────────────────────────────────────────────┘
```

---

## shadcn/ui Components

```bash
npx shadcn-ui@latest add card badge button table tabs dialog separator progress
```

### Charts (recharts)

- Line chart: Rating trend
- Bar chart: Project completion timeline

---

## Accessibility

- **Tabs:** aria-label, keyboard navigation (arrow keys)
- **Tables:** Sortable with aria-sort
- **Actions:** Keyboard accessible (Enter to open detail)
- **Ratings:** aria-label="Rating 4.8 out of 5 stars"
- **Status:** Color + text + icon (not color alone)

---

## Example Data

- **Supplier:** "Schreinerei Müller GmbH"
- **Type:** "Subunternehmer"
- **Rating:** 4.8/5.0 (12 reviews)
- **Active Projects:** 5
- **Total Volume:** € 450.000
- **Outstanding Invoices:** € 12.500
- **Last Contact:** "Vor 3 Tagen (E-Mail: Angebot REWE)"

---

**End of supplier-detail.md**

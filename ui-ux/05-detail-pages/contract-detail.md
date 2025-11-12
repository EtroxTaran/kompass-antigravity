# Figma Make: Contract Detail Page (Vertrags-Detailansicht)

**Purpose:** Create detail view for displaying Contract information in KOMPASS  
**Action:** Design contract detail page with PDF viewer, GoBD compliance, and project linking  
**Date:** 2025-01-28

---

## 🎯 MASTER PROMPT FOR FIGMA MAKE

**Copy everything below this line and paste into Figma Make:**

---

Create a **detail page for Contract (Auftragsbestätigung)** in KOMPASS. This page displays contract information with GoBD compliance features and project tracking.

## PAGE LAYOUT

### Header Section
- **Breadcrumb:** Kunden > [Customer Name] > Verträge > [Contract Number]
- **Title:** Contract Number (e.g., "AB-2025-00045")
- **Status Badge:** Large badge showing current status
  - Draft (Entwurf): Yellow badge
  - Signed (Unterzeichnet): Green badge
  - InProgress (In Bearbeitung): Blue badge
  - Completed (Abgeschlossen): Gray badge
- **GoBD Indicator:** Lock icon if Signed or later (🔒 GoBD-geschützt)

### Quick Actions (Top Right)
- **Edit** button (if status = Draft only)
- **Download PDF** button (if PDF exists)
- **Mark as Signed** button (if Draft + has PDF)
- **Start Project** button (if Signed, no project yet)
- **View Project** button (if project exists)
- **Delete** button (if status = Draft) - Red, text style

---

## CONTENT SECTIONS

### Section 1: Basic Information (Card)

**Card Title:** "Vertragsinformationen"

**GoBD Banner (if Signed or later):**
- Style: Green info banner
- Icon: Lock icon
- Text: "🔒 Dieser Vertrag ist GoBD-konform finalisiert und unveränderlich seit [Date]"

| Field | Value |
|-------|-------|
| Vertragsnummer | AB-2025-00045 |
| Kunde | [Customer Name] (link to customer detail) |
| Vertragsdatum | 28.01.2025 |
| Leistungsbeginn | 05.02.2025 |
| Leistungsende | 30.06.2025 (146 Tage) |
| Status | Badge: Unterzeichnet (green) |
| Erstellt am | 28.01.2025, 10:30 Uhr |
| Erstellt von | Maria Schmidt (link to user) |
| Zuletzt bearbeitet | 28.01.2025, 14:15 Uhr |

**Layout:**
- 2-column grid on desktop
- Single column on mobile
- Labels bold, values regular weight
- Links in blue color
- Status displayed as large badge

### Section 2: Financial Information (Card)

**Card Title:** "Finanzdaten"

| Field | Value |
|-------|-------|
| Auftragswert (Gesamt) | **125.000,00 €** (large, bold, 28px) |
| Nettobetrag | 105.042,02 € |
| MwSt. (19%) | 19.957,98 € |

**Project Budget Indicator (if project linked):**
- **Budget vs. Actual:**
  - Budget: 125.000,00 € (from contract)
  - Actual Kosten: 87.450,00 € (from timetracking)
  - Verbleibend: 37.550,00 € (30% remaining)
- **Progress Bar:** Visual indicator
  - Green bar: 70% used (€87.450)
  - Gray background: 30% remaining (€37.550)
- **Margin Calculation:**
  - Vertragswert: €125.000
  - Ist-Kosten: €87.450
  - Marge: €37.550 (30%)
  - Margin indicator: Green if >20%, Yellow if 10-20%, Red if <10%

**Layout:**
- Total amount prominently displayed (28px font, bold)
- Net and tax in smaller font (16px)
- Budget tracking section below (if project exists)

### Section 3: PDF Document (Card)

**Card Title:** "Vertragsdokument (PDF)"

**If PDF uploaded:**
- **PDF Viewer:** Embedded PDF viewer (iframe or pdf.js)
  - Height: 700px
  - Controls: Zoom, page navigation, download, print
  - Fallback: "PDF-Vorschau nicht verfügbar" link to download
- **File Info:**
  - File name: "Auftragsbestaetigung_AB-2025-00045.pdf"
  - File size: "3,2 MB"
  - Uploaded: "28.01.2025, 10:30 Uhr"
  - Uploaded by: "Maria Schmidt"
  - **GoBD Hash:** "SHA-256: a3f2...b5c4" (if Signed)
- **Actions:**
  - "Herunterladen" button (primary)
  - "Drucken" button (secondary)
  - "Ersetzen" button (secondary, Draft only)

**If NO PDF:**
- Message: "Kein Dokument hochgeladen"
- **Action Button:** "PDF hochladen" (primary button)
- **Warning:** "⚠️ PDF erforderlich vor Unterzeichnung"

### Section 4: Linked Entities (Card)

**Card Title:** "Verknüpfungen"

**Linked Offer (if exists):**
- Icon: Document icon
- Label: "Ursprüngliches Angebot"
- Value: "A-2025-00123" (link to offer detail)
- Info: "Angenommen am 25.01.2025"

**Linked Project (if exists):**
- Icon: Folder icon
- Label: "Zugeordnetes Projekt"
- Value: "P-2025-M001 - Regalsystem München" (link to project detail)
- Status: Project status badge
- Budget: "Budget: €125.000, Verbraucht: €87.450 (70%)"

**Create Project Button (if Signed, no project yet):**
- Button: "Projekt aus Vertrag erstellen"
- Style: Primary button
- Action: Navigate to project creation with pre-filled contract data

**Layout:**
- Each entity as clickable card
- Icon + text + arrow right
- Hover: Blue background

### Section 5: Description & Notes (Card, if filled)

**Card Title:** "Beschreibung & Notizen"

- **Contract Title:** Display bold (if exists)
- **Notes:** Display full notes text
- Rich text rendering (paragraphs, line breaks)
- Max height: 300px with scroll

### Section 6: Activity History (Card)

**Card Title:** "Aktivitätsprotokoll (GoBD-Audit-Trail)"

**Timeline display:**
- Created: "28.01.2025, 10:30 - Vertrag erstellt von Maria Schmidt"
- PDF uploaded: "28.01.2025, 10:35 - PDF hochgeladen (3,2 MB)"
- Status changed: "28.01.2025, 14:15 - Status geändert: Draft → Signed von Maria Schmidt"
- Immutability hash: "28.01.2025, 14:15 - GoBD-Hash erstellt: SHA-256:a3f2...b5c4"
- Project started: "05.02.2025, 09:00 - Projekt gestartet: P-2025-M001"
- **GoBD Changes:** Any post-signing changes with approval
  - "12.03.2025, 11:20 - Vertragswert geändert: €125.000 → €130.000 (Grund: Zusatzleistung, Genehmigt von GF Herr Schmidt)"

**Layout:**
- Vertical timeline with dates on left
- Icons for each action type
- Chronological order (newest at top)
- **GoBD changes in yellow highlight**

---

## STATE-SPECIFIC UI

### Draft Status
- Show: Edit, Mark as Signed, Delete buttons
- Allow: All fields editable, PDF upload/replacement
- Message: "Entwurf - Kann bearbeitet werden"

### Signed Status
- Show: Start Project button (if no project)
- Hide: Edit, Delete buttons
- Fields: All locked (read-only)
- PDF: View-only (no replacement)
- Message: "Unterzeichnet - GoBD-geschützt, unveränderlich"

### InProgress Status
- Show: Mark Complete button
- Allow: Status change only
- Message: "In Bearbeitung - Projekt läuft"

### Completed Status
- Show: Nothing (fully read-only)
- Message: "Abgeschlossen - Archiviert"

---

## MOBILE OPTIMIZATIONS

- **Tablet/Mobile:**
  - Stack all cards vertically
  - Full-width cards
  - PDF viewer height: 500px on mobile
  - Actions move to bottom sticky bar
  - "More actions" overflow menu (...)

- **Touch Targets:**
  - All buttons: 44px minimum height
  - PDF controls: 44px touch targets

---

## LOADING STATES

- **Page Load:** Skeleton loader for all cards
- **PDF Load:** Spinner in PDF viewer area with "PDF wird geladen..."
- **Action Buttons:** Loading spinner + disabled state during API calls

---

## ERROR STATES

- **PDF Load Error:** "PDF konnte nicht geladen werden. Bitte versuchen Sie es erneut."
- **Contract Not Found:** "Vertrag nicht gefunden" with back button
- **Permission Denied:** "Keine Berechtigung für diesen Vertrag"

---

## GERMAN LABELS

- "Vertragsinformationen" (Contract Information)
- "Finanzdaten" (Financial Data)
- "Vertragsdokument (PDF)" (Contract Document PDF)
- "Verknüpfungen" (Linked Entities)
- "Beschreibung & Notizen" (Description & Notes)
- "Aktivitätsprotokoll (GoBD-Audit-Trail)" (Activity Log)
- "GoBD-geschützt" (GoBD-protected)
- "Unveränderlich" (Immutable)
- "Herunterladen" (Download)
- "Drucken" (Print)
- "Projekt starten" (Start Project)
- "Projekt aus Vertrag erstellen" (Create Project from Contract)
- "Als abgeschlossen markieren" (Mark as Completed)

---

## FIGMA COMPONENTS

- shadcn/ui Card (section containers)
- shadcn/ui Button (action buttons)
- shadcn/ui Badge (status badges)
- shadcn/ui Alert (GoBD warning banner)
- shadcn/ui Separator (dividers)
- shadcn/ui Skeleton (loading states)
- shadcn/ui Progress (budget progress bar)
- PDF.js or iframe (PDF viewer)
- shadcn/ui Timeline (custom component for activity log)

---

## QUALITY CHECKLIST

After implementing, verify:
- [ ] Status badges display correctly with colors
- [ ] PDF viewer works (or shows download link)
- [ ] GoBD immutability banner shows for Signed+ contracts
- [ ] Activity timeline shows all changes
- [ ] Links to customer/offer/project work
- [ ] Budget tracking displays correctly (if project linked)
- [ ] Margin calculation is correct
- [ ] Mobile layout stacks properly
- [ ] All German labels are correct
- [ ] Currency formatting is German (1.234,56 €)
- [ ] Date formatting is German (DD.MM.YYYY)
- [ ] Loading states show during data fetch
- [ ] Error states handle missing data gracefully
- [ ] "Start Project" only visible if Signed + no project
- [ ] Edit/Delete only visible for Draft

---

**Total Sections:** 6  
**Total Fields:** 15  
**Special Features:** PDF Viewer, GoBD Compliance Indicator, Budget Tracking, Activity Timeline, Project Linking

---

END OF PROMPT


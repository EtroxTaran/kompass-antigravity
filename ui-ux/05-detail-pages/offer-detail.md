# Figma Make: Offer Detail Page (Angebots-Detailansicht)

**Purpose:** Create detail view for displaying Offer information in KOMPASS  
**Action:** Design offer detail page with PDF viewer and status management  
**Date:** 2025-01-28

---

## 🎯 MASTER PROMPT FOR FIGMA MAKE

**Copy everything below this line and paste into Figma Make:**

---

Create a **detail page for Offer (Angebot)** in KOMPASS. This page displays all offer information and allows status management and PDF viewing.

## PAGE LAYOUT

### Header Section
- **Breadcrumb:** Kunden > [Customer Name] > Angebote > [Offer Number]
- **Title:** Offer Number (e.g., "A-2025-00123")
- **Status Badge:** Large badge showing current status
  - Draft (Entwurf): Yellow badge
  - Sent (Versendet): Blue badge
  - Accepted (Angenommen): Green badge
  - Rejected (Abgelehnt): Red badge

### Quick Actions (Top Right)
- **Edit** button (if status = Draft)
- **Download PDF** button (if PDF exists)
- **Send Offer** button (if status = Draft, has PDF)
- **Accept** button (if status = Sent)
- **Reject** button (if status = Sent)
- **Convert to Contract** button (if status = Accepted)
- **Delete** button (if status = Draft) - Red, text style

---

## CONTENT SECTIONS

### Section 1: Basic Information (Card)

**Card Title:** "Angebotsinformationen"

| Field | Value |
|-------|-------|
| Angebotsnummer | A-2025-00123 |
| Kunde | [Customer Name] (link to customer detail) |
| Angebotsdatum | 28.01.2025 |
| Gültig bis | 28.02.2025 (28 Tage verbleibend) |
| Status | Badge: Versendet (blue) |
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
| Angebotssumme (Gesamt) | **25.000,00 €** (large, bold) |
| Nettobetrag | 21.008,40 € |
| MwSt. (19%) | 3.991,60 € |

**Layout:**
- Total amount prominently displayed (28px font, bold)
- Net and tax in smaller font (16px)
- Currency formatting: German standard (1.234,56 €)

### Section 3: PDF Document (Card)

**Card Title:** "Angebotsdokument"

**If PDF uploaded:**
- **PDF Viewer:** Embedded PDF viewer (iframe or pdf.js)
  - Height: 600px
  - Controls: Zoom, page navigation, download
  - Fallback: "PDF-Vorschau nicht verfügbar" link to download
- **File Info:**
  - File name: "Angebot_A-2025-00123.pdf"
  - File size: "2,5 MB"
  - Uploaded: "28.01.2025, 10:30 Uhr"
  - Uploaded by: "Maria Schmidt"
- **Actions:**
  - "Herunterladen" button (primary)
  - "Ersetzen" button (secondary, Draft only)
  - "Löschen" button (text, red, Draft only)

**If NO PDF:**
- Message: "Kein Dokument hochgeladen"
- **Action Button:** "PDF hochladen" (primary button)

### Section 4: Description & Notes (Card, if filled)

**Card Title:** "Beschreibung & Notizen"

- Display full description text
- Rich text rendering (paragraphs, line breaks)
- Max height: 300px with scroll

### Section 5: Linked Entities (Card, if applicable)

**Card Title:** "Verknüpfungen"

- **Linked Opportunity:** Link to opportunity detail (if exists)
- **Converted to Contract:** Link to contract detail (if converted)
- **Related Project:** Link to project (if exists)

**Layout:**
- Each link displayed as clickable card/badge
- Icon + entity name + arrow right icon
- Blue hover state

### Section 6: Activity History (Card)

**Card Title:** "Aktivitätsprotokoll"

**Timeline display:**
- Created: "28.01.2025, 10:30 - Angebot erstellt von Maria Schmidt"
- PDF uploaded: "28.01.2025, 10:35 - PDF hochgeladen (2,5 MB)"
- Status changed: "28.01.2025, 14:15 - Status geändert: Draft → Sent von Maria Schmidt"
- Accepted: "05.02.2025, 09:20 - Angebot angenommen von Herr Müller (GF)"
- Converted: "05.02.2025, 09:25 - In Vertrag umgewandelt (AB-2025-00045)"

**Layout:**
- Vertical timeline with dates on left
- Icons for each action type
- Chronological order (newest at top)

---

## STATE-SPECIFIC UI

### Draft Status
- Show: Edit, Send, Delete buttons
- Hide: Accept, Reject, Convert buttons
- Allow: PDF upload/replacement
- Message: "Entwurf - Kann bearbeitet werden"

### Sent Status
- Show: Accept, Reject buttons
- Hide: Edit, Delete buttons
- Allow: PDF viewing (no changes)
- Message: "Versendet - Warten auf Kundenentscheidung"

### Accepted Status
- Show: Convert to Contract button
- Hide: All other action buttons
- Message: "Angenommen - Kann in Vertrag umgewandelt werden"

### Rejected Status
- Show: Nothing (read-only)
- Message: "Abgelehnt - Archiviert"

---

## MOBILE OPTIMIZATIONS

- **Tablet/Mobile:**
  - Stack all cards vertically
  - Full-width cards
  - PDF viewer height: 400px on mobile
  - Actions move to bottom sticky bar
  - "More actions" overflow menu (...)

- **Touch Targets:**
  - All buttons: 44px minimum height
  - PDF controls: 44px touch targets

---

## LOADING STATES

- **Page Load:** Skeleton loader for all cards
- **PDF Load:** Spinner in PDF viewer area
- **Action Buttons:** Loading spinner + disabled state during API calls

---

## ERROR STATES

- **PDF Load Error:** "PDF konnte nicht geladen werden. Bitte versuchen Sie es erneut."
- **Offer Not Found:** "Angebot nicht gefunden" with back button
- **Permission Denied:** "Keine Berechtigung für dieses Angebot"

---

## COLOR PALETTE

- **Background:** #ffffff (white)
- **Card Background:** #f9fafb (gray-50)
- **Border:** #e5e7eb (gray-200)
- **Primary Blue:** #3b82f6
- **Success Green:** #10b981
- **Warning Yellow:** #f59e0b
- **Danger Red:** #ef4444
- **Text Primary:** #111827 (gray-900)
- **Text Secondary:** #6b7280 (gray-500)

---

## SPACING

- Page padding: 24px (desktop), 16px (mobile)
- Card spacing: 24px gap between cards
- Card padding: 24px (desktop), 16px (mobile)
- Section spacing: 16px between sections within cards

---

## TYPOGRAPHY

- **Page Title:** 32px, bold, gray-900
- **Card Titles:** 20px, semibold, gray-900
- **Field Labels:** 14px, medium, gray-700
- **Field Values:** 16px, regular, gray-900
- **Help Text:** 14px, regular, gray-500
- **Total Amount:** 28px, bold, primary color

---

## QUALITY CHECKLIST

After implementing, verify:
- [ ] All status badges display correctly
- [ ] PDF viewer works (or shows download link)
- [ ] Status-specific buttons are shown/hidden correctly
- [ ] Activity timeline shows all changes
- [ ] Links to customer/opportunity/contract work
- [ ] Mobile layout stacks properly
- [ ] All German labels are correct
- [ ] Currency formatting is German standard
- [ ] Date formatting is German (DD.MM.YYYY)
- [ ] Loading states show during data fetch
- [ ] Error states handle missing data gracefully

---

**Total Sections:** 6  
**Total Fields:** 12  
**Special Features:** PDF Viewer, Status Management, Activity Timeline, Convert to Contract

---

END OF PROMPT


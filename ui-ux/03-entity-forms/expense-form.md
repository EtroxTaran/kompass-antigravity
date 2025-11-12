# Expense Entry Form - Figma Make Prompt

## Context & Purpose
- **Component Type**: Quick Entry Form with Photo Capture
- **User Roles**: ADM (create own), INNEN/GF (all), BUCH (review/approve)
- **Usage Context**: Quick expense capture during tours, receipt documentation
- **Business Value**: Accurate expense tracking, fast reimbursement, tax compliance

## Design Requirements

### Visual Hierarchy
- **Photo-first approach**: Camera/upload prominent
- **Quick categorization**: Common expense type buttons
- **Auto-fill from photo**: OCR for amount extraction
- **Tour association**: Link to active/recent tour

### Form Structure
- Photo capture/preview at top
- Quick type selection
- Amount and description
- Tour/customer association
- Submit for approval

### shadcn/ui Components
- Card, Form, Input, Button, Select
- Image preview component
- Camera integration
- Radio group for types

## Figma Make Prompt

Create a mobile-optimized expense entry form for KOMPASS that enables quick expense capture with photo documentation during field sales tours.

**Mobile Layout (375px) - Primary View:**

```
┌─────────────────────────────┐
│ [←] Neue Ausgabe      [✓]   │
├─────────────────────────────┤
│                             │
│  ┌─────────────────────┐    │
│  │                     │    │
│  │   [Camera Icon]     │    │
│  │                     │    │
│  │ Beleg fotografieren │    │
│  │        oder         │    │
│  │   [Upload Icon]     │    │
│  │   Datei wählen     │    │
│  └─────────────────────┘    │
│                             │
│ ─── Schnellauswahl ───      │
│                             │
│ [🍽️ Verpflegung] [⛽ Benzin] │
│ [🏨 Hotel] [🅿️ Parken]       │
│ [🎫 Sonstiges]               │
│                             │
│ Betrag *                    │
│ [€ 0,00___________]         │
│                             │
│ Beschreibung *              │
│ [Mittagessen mit Kunde...]  │
│                             │
│ Tour zuordnen               │
│ [München Nord - 06.02 ▼]    │
│                             │
│ [Speichern]                 │
└─────────────────────────────┘
```

**After Photo Capture:**
```
┌─────────────────────────────┐
│ [←] Neue Ausgabe      [✓]   │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │                         │ │
│ │    [Receipt Photo]      │ │
│ │                         │ │
│ │  OCR erkannt: €23,50    │ │
│ └─────────────────────────┘ │
│ [Neu aufnehmen] [Löschen]  │
│                             │
│ Kategorie: 🍽️ Verpflegung   │
│                             │
│ Betrag *                    │
│ [€ 23,50_________] ✓ OCR    │
│                             │
│ Beschreibung *              │
│ [Mittagessen Hofladen...]   │
│                             │
│ Datum                       │
│ [06.02.2025] (heute)        │
│                             │
│ Kunde (optional)            │
│ [Hofladen Müller ▼]         │
│                             │
│ [Als Entwurf] [Einreichen]  │
└─────────────────────────────┘
```

**Desktop Form (600px × 700px):**

```
┌─────────────────────────────────────────────┐
│ Neue Ausgabe erfassen                  [×] │
├─────────────────────────────────────────────┤
│                                             │
│ Beleg                                       │
│ ┌─────────────┬──────────────────────────┐  │
│ │             │ 📷 Beleg fotografieren    │  │
│ │  [Photo     │    oder                  │  │
│ │   Preview]  │ 📎 Datei hochladen       │  │
│ │             │                          │  │
│ │             │ Unterstützt: JPG, PNG,   │  │
│ │             │ PDF (max. 10MB)          │  │
│ └─────────────┴──────────────────────────┘  │
│                                             │
│ Ausgabendetails                             │
│ ┌────────────────────┬────────────────────┐ │
│ │ Kategorie *        │ Betrag *           │ │
│ │ [Verpflegung ▼]    │ [€ 0,00_______]    │ │
│ ├────────────────────┴────────────────────┤ │
│ │ Beschreibung *                          │ │
│ │ [_____________________________________] │ │
│ ├────────────────────┬────────────────────┤ │
│ │ Datum *            │ MwSt.-Satz         │ │
│ │ [06.02.2025 📅]    │ [19% ▼]            │ │
│ └────────────────────┴────────────────────┘ │
│                                             │
│ Zuordnung                                   │
│ ┌────────────────────┬────────────────────┐ │
│ │ Tour               │ Kunde              │ │
│ │ [München Nord ▼]   │ [Hofladen Müll. ▼] │ │
│ └────────────────────┴────────────────────┘ │
│                                             │
│ ☐ Als Geschäftsessen markieren              │
│   (Bewirtungsbeleg - zusätzliche Infos)     │
│                                             │
│ [Abbrechen]            [Entwurf] [Einreichen]│
└─────────────────────────────────────────────┘
```

**Expense Categories:**
```
🍽️ Verpflegung - Meals
⛽ Benzin - Fuel (auto-links to mileage)
🏨 Hotel - Accommodation
🅿️ Parken - Parking
🚕 Taxi/ÖPNV - Public transport
📱 Telefon - Phone/Internet
🎫 Sonstiges - Other
```

**Business Meal Extension:**
```
┌─────────────────────────────────────────────┐
│ Bewirtungsbeleg - Zusätzliche Angaben       │
├─────────────────────────────────────────────┤
│ Bewirtete Personen *                        │
│ [Maria Schmidt, Thomas Weber]               │
│                                             │
│ Anlass der Bewirtung *                      │
│ [Vertragsverhandlung Projekt X]             │
│                                             │
│ Ort der Bewirtung                           │
│ [Restaurant Zur Post, München]              │
└─────────────────────────────────────────────┘
```

**Approval Status Indicators:**
- **Entwurf** (gray): Draft, editable
- **Eingereicht** (blue): Submitted, pending
- **Genehmigt** (green): Approved for reimbursement
- **Abgelehnt** (red): Rejected, needs correction

**OCR Integration:**
- Auto-detect amount from receipt
- Extract vendor name if possible
- Highlight detected fields
- Allow manual override
- Confidence indicator

## Interaction Patterns
- **Quick type selection**: Tap category to pre-fill
- **OCR validation**: Green check if confident
- **Photo preview**: Pinch to zoom
- **Auto-save**: As draft every change
- **Offline queue**: Save locally, sync later

## German Labels & Content
- **Beleg**: Receipt
- **Ausgabe**: Expense
- **Betrag**: Amount
- **Bewirtungsbeleg**: Entertainment receipt
- **Eingereicht**: Submitted
- **Genehmigt**: Approved
- **MwSt.**: VAT

## Accessibility Requirements
- Voice input for amount and description
- Large touch targets for mobile
- Clear contrast for photo preview
- Keyboard navigation for desktop
- Screen reader support for status

## Mobile Considerations
- **Camera API**: Direct access, no file browser
- **Compression**: Reduce photo size before upload
- **Offline storage**: Queue expenses locally
- **Quick actions**: Swipe to edit/delete
- **Batch upload**: When connection restored

## Validation Rules
- Amount required, > 0
- Description min 5 characters
- Photo required for amounts > €25
- Future dates not allowed
- Business meals require attendees

## Implementation Notes
```bash
# Required components
npx shadcn-ui@latest add form input button
npx shadcn-ui@latest add radio-group select
npx shadcn-ui@latest add dialog camera-upload

# OCR Integration
- Google Vision API or Tesseract.js
- Confidence threshold: 80%
- Fallback to manual entry

# Photo handling
- Max size: 10MB
- Compress to 1200px wide
- Store in CDN/S3
- Generate thumbnails
```

## State Management
- Current expense draft
- Photo upload progress
- OCR processing state
- Validation errors
- Offline queue

## Analytics Events
- expense_created
- photo_captured / photo_uploaded
- ocr_success_rate
- category_selected
- approval_time_average

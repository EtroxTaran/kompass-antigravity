# Invoice Form - Figma Make Prompt

## Context & Purpose
- **Component Type**: Entity Creation Form with GoBD Compliance
- **User Roles**: GF (full), BUCH (full), PLAN (limited), ADM (read-only)
- **Usage Context**: Create invoices from projects or standalone
- **Business Value**: Revenue generation with GoBD-compliant invoicing

## Design Requirements

### Visual Hierarchy
- **Invoice Number**: GoBD-compliant auto-generated (R-YYYY-#####)
- **Line Items**: Prominent table for services/products
- **Total Calculation**: Large, clear total amount
- **Immutability Warning**: Clear indication once finalized

### Layout Structure
- Full page form (complex, many fields)
- 2-column layout for header
- Full-width table for line items
- Calculation summary on right
- GoBD compliance indicators

### shadcn/ui Components
- Full-page form (not dialog - too complex)
- `Table` for line items
- `Input`, `Select`, `DatePicker`
- `Card` for calculation summary
- `AlertDialog` for finalization confirmation

## Figma Make Prompt

Create a comprehensive GoBD-compliant invoice form for KOMPASS, a German CRM application. Design a form for creating invoices with line items, tax calculation, and immutability features following German accounting regulations.

**Form Container:**
- Full-page layout (not modal - too complex)
- Header section: Customer + invoice metadata
- Main content: Line items table + calculation
- Sticky footer: Action buttons
- GoBD compliance indicators throughout

**Section 1: Rechnungskopf (Invoice Header)**

**Top Row:**
1. **Rechnungsnummer** (Auto-generated, Read-only):
   - Label: "Rechnungsnummer"
   - Display: Large "R-2024-00456" - 28px, bold, blue
   - Icon: FileText
   - Background: Light blue (#f0f9ff), rounded card
   - Help text: "Automatisch generiert (GoBD-konform, unveränderlich)"
   - Lock icon: Appears after finalization

2. **Status**:
   - Badge: "Entwurf" (gray) or "Abgeschlossen" (green)
   - If finalized: Green badge + lock icon
   - Position: Top-right of header

**Second Row:**
3. **Kunde** (Required):
   - Label: "Kunde *"
   - Combobox: Searchable customer select
   - Shows: Company name + VAT number
   - Example: "Hofladen Müller GmbH (DE123456789)"
   - Icon: Building
   - If from project: Pre-filled from project customer

4. **Projekt** (Optional):
   - Label: "Zugehöriges Projekt"
   - Select: Projects for selected customer
   - Example: "P-2024-B023 - REWE München"
   - Link icon: View project details
   - Help text: "Ordnen Sie diese Rechnung einem Projekt zu"

**Third Row:**
5. **Rechnungsdatum** (Required):
   - Label: "Rechnungsdatum *"
   - Date picker
   - Validation: -7 days to today (max 1 week retroactive)
   - Default: Today
   - Error: "Rechnungsdatum muss innerhalb der letzten 7 Tage liegen"
   - Icon: Calendar
   - Help text: "Ausstellungsdatum der Rechnung (GoBD: max. 7 Tage rückdatiert)"

6. **Fälligkeitsdatum** (Required):
   - Label: "Fälligkeitsdatum *"
   - Date picker
   - Auto-calculates: Invoice date + payment terms (e.g., +30 days)
   - User can override
   - Example: "15.12.2024" (30 Tage Zahlungsziel)

7. **Zahlungsziel** (Optional):
   - Label: "Zahlungsziel"
   - Select: "Sofort", "7 Tage", "14 Tage", "30 Tage" (default from customer)
   - Updates due date automatically

**Section 2: Rechnungspositionen (Line Items)**
Label: "Rechnungspositionen" - 20px, bold

**Line Items Table:**
Columns:
1. **Pos.** (Position number): 1, 2, 3... (auto, 40px width)
2. **Bezeichnung** (Description): Text input, 300px
   - Placeholder: "Artikelbezeichnung oder Leistung"
3. **Menge** (Quantity): Number input, 80px
   - Placeholder: "1"
4. **Einheit** (Unit): Select, 100px
   - Options: Stk (Pieces), m², lfm (Linear meters), Std (Hours), Psch (Lump sum)
5. **Einzelpreis** (Unit price): Number input, 120px
   - Suffix: "€"
6. **Gesamtpreis** (Total): Calculated, read-only, 120px
   - Display: "€ 1.500,00"
   - Calculation: Quantity × Unit price
7. **MwSt.** (VAT): Select, 80px
   - Options: 19%, 7%, 0%
   - Default: 19%
8. **Aktionen** (Actions): 60px
   - Delete row icon button (red trash icon)

**Row Example:**
1 | Ladeneinrichtung Komplett | 1 | Psch | 50.000,00 € | 50.000,00 € | 19% | [Trash]
2 | Montagearbeiten | 40 | Std | 85,00 € | 3.400,00 € | 19% | [Trash]

**Add Row Button:**
- Below table: "+ Position hinzufügen" button
- Blue text button with Plus icon
- Clicking adds new empty row to table

**Section 3: Berechnung (Calculation)**
Position: Right side card, sticky

**Calculation Card:**
- Background: Light gray (#f9fafb)
- Border: 1px solid #e5e7eb
- Padding: 24px
- Shadow: Subtle

**Calculation Rows:**
1. **Zwischensumme** (Subtotal):
   - Label: "Zwischensumme (netto)"
   - Value: "€ 53.400,00" - right-aligned, 16px
   - Sum of all line item totals

2. **MwSt. 19%**:
   - Label: "MwSt. 19%"
   - Value: "€ 10.146,00" - right-aligned
   - Calculated from line items with 19% VAT

3. **MwSt. 7%**:
   - Label: "MwSt. 7%"
   - Value: "€ 0,00" - right-aligned
   - Only shown if any line items have 7% VAT

4. **Rabatt** (Optional):
   - Label: "Rabatt"
   - Input: Number or percentage
   - Options: Fixed amount (€) or percentage (%)
   - Toggle: "€" or "%"
   - Example: "500,00 €" or "1%"
   - Value: "- € 500,00" (red, subtracted)

5. **Divider**: Thick line (2px, gray)

6. **Gesamtsumme** (Total):
   - Label: "Gesamtsumme (brutto)" - 18px, bold
   - Value: "€ 63.046,00" - 32px, bold, blue
   - Calculation: Subtotal + VAT - Discount
   - Background: Light blue highlight
   - Validation: Must match calculated total (±0.01 tolerance)

**Zahlungsinformationen (Payment Information):**

1. **Bankverbindung**:
   - Label: "Bankverbindung"
   - Select: Company bank accounts (pre-configured)
   - Shows: Bank name + IBAN (masked)

2. **Zahlungsart**:
   - Label: "Zahlungsart"
   - Select: "Überweisung" (Bank transfer), "Lastschrift" (Direct debit), "Bar" (Cash)

3. **Rechnungstext** (Optional):
   - Label: "Rechnungstext / Notizen"
   - Textarea: 3 rows
   - Placeholder: "Zusätzliche Hinweise für die Rechnung..."
   - Max length: 500 characters

**GoBD Immutability Section:**
- Info card: Yellow background (#fef3c7)
- Icon: AlertTriangle (amber)
- Title: "Hinweis zur Unveränderlichkeit"
- Text: "Nach der Finalisierung kann diese Rechnung gemäß GoBD-Vorschriften nicht mehr geändert werden. Nur die Geschäftsführung kann Korrekturen vornehmen."
- Checkbox: ☐ "Ich verstehe, dass die Rechnung nach Finalisierung unveränderlich ist"
- Finalize button only enabled when checked

**Form Footer:**
- Left: Draft indicator "Als Entwurf gespeichert: 14:30 Uhr"
- Right buttons:
  - "Als Entwurf speichern" (secondary, saves without finalizing)
  - "Abbrechen" (secondary, outlined)
  - "Rechnung finalisieren" (primary, blue, requires confirmation)

**Finalization Confirmation Dialog:**
- AlertDialog appears when "Finalisieren" clicked
- Icon: AlertTriangle (large, amber)
- Title: "Rechnung finalisieren?"
- Message: "Diese Rechnung wird abgeschlossen und kann anschließend nicht mehr geändert werden. Ein SHA-256 Hash wird zur Manipulationserkennung erstellt. Möchten Sie fortfahren?"
- Buttons:
  - "Abbrechen" (cancel)
  - "Ja, finalisieren" (confirm, blue)

**Post-Finalization State:**
- Form becomes read-only
- All fields disabled, shown as text
- Green "Abgeschlossen" badge
- Lock icons on immutable fields
- "Änderungsprotokoll anzeigen" link
- Edit button hidden
- Print/Email buttons available

**Validation:**
- Invoice date: -7 to 0 days
- Total calculation: Subtotal + VAT - Discount (must match within ±0.01)
- At least one line item required
- All line items must have description, quantity, unit price

Design with prominent financial calculations, clear GoBD compliance indicators, and immutability warnings.

## Interaction Patterns

### Line Item Management
1. User clicks "+ Position hinzufügen"
2. New empty row appears
3. User fills description, quantity, unit, price
4. Total auto-calculates
5. Calculation card updates immediately
6. User can add more rows or delete rows

### Finalization Flow
1. User completes all required fields
2. Checks "Ich verstehe..." checkbox
3. Clicks "Rechnung finalisieren"
4. Confirmation dialog opens
5. User confirms
6. System generates SHA-256 hash
7. Invoice saved as immutable
8. Success toast: "Rechnung R-2024-00456 wurde finalisiert"
9. Form becomes read-only

## German Labels & Content

### Sections
- **Rechnungskopf**: Invoice header
- **Rechnungspositionen**: Line items
- **Berechnung**: Calculation
- **Zahlungsinformationen**: Payment information

### Fields (See detailed list above)

### Line Item Columns
- **Pos.**: Position
- **Bezeichnung**: Description
- **Menge**: Quantity
- **Einheit**: Unit
- **Einzelpreis**: Unit price
- **Gesamtpreis**: Total price
- **MwSt.**: VAT

### Calculation
- **Zwischensumme (netto)**: Subtotal (net)
- **MwSt.**: VAT
- **Rabatt**: Discount
- **Gesamtsumme (brutto)**: Total (gross)

### Units
- **Stk**: Pieces
- **m²**: Square meters
- **lfm**: Linear meters
- **Std**: Hours
- **Psch**: Lump sum

### Buttons
- **Position hinzufügen**: Add line item
- **Als Entwurf speichern**: Save as draft
- **Rechnung finalisieren**: Finalize invoice
- **Drucken**: Print
- **Per E-Mail senden**: Send via email

## Accessibility Requirements
- WCAG 2.1 AA compliance
- Line items table: Proper table semantics
- Calculation: Announced when totals update
- Finalization checkbox: Required before finalize
- Immutable fields: aria-readonly="true"
- Lock icons: aria-label="Unveränderliches Feld"

## Mobile Considerations
- Simplified layout on mobile
- Line items: Card view instead of table
- Each line item as expandable card
- Calculation summary sticky at bottom
- Full-width buttons
- Native number keyboard for amounts

## Example Data

**New Invoice:**
- Rechnungsnummer: "R-2024-00456" (auto)
- Kunde: "Hofladen Müller GmbH"
- Projekt: "P-2024-B023"
- Rechnungsdatum: "15.11.2024"
- Fälligkeitsdatum: "15.12.2024" (30 Tage)
- Positionen:
  1. "Ladeneinrichtung Komplett" | 1 Psch | 50.000 € | 19%
  2. "Montagearbeiten" | 40 Std | 85 € | 19%
- Zwischensumme: "€ 53.400"
- MwSt. 19%: "€ 10.146"
- Gesamtsumme: "€ 63.546"

## Implementation Notes

### shadcn/ui Installation
```bash
npx shadcn-ui@latest add form
npx shadcn-ui@latest add table
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add alert-dialog
npx shadcn-ui@latest add card
```

### Component Dependencies
- GoBD invoice number generator
- Customer/project selection
- Line item management logic
- Tax calculation
- Total calculation with validation
- SHA-256 hash generation (on finalization)
- Immutability enforcement

### State Management
- Form state with line items array
- Calculated totals (real-time)
- Draft save state
- Finalization state (boolean)
- Immutability enforcement post-finalization


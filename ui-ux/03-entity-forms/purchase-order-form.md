# Purchase Order Form - Figma Make Prompt

## Context & Purpose

- **Entity:** Purchase Order (PO)
- **Users:** INN (primary creator), PLAN (can create small POs)
- **Purpose:** Create purchase orders for materials from suppliers
- **Key Focus:** Line items, approval workflow, delivery tracking

## Figma Make Prompt

Create a purchase order form for KOMPASS for ordering materials from suppliers with line items, approval routing, and delivery details with German labels.

**Form Title:** "Bestellung erstellen"

**Form Actions:**

- **Save Draft:** "Entwurf speichern" (secondary button) - Status: Draft
- **Submit for Approval:** "Zur Freigabe senden" (primary button) - If >€1k
- **Send to Supplier:** "An Lieferant senden" (primary button) - If ≤€1k (auto-approved)
- **Cancel:** "Abbrechen" (text link)

---

## Form Sections

### Section 1: Kopfdaten (Header Information)

**Fields:**

1. **Bestellnummer** (PO Number)
   - Type: Text input (read-only, auto-generated)
   - Value: "PO-2025-00234"
   - Button: "Neu generieren" (if needed)

2. **Projekt** (Project)
   - Type: Project select dropdown (searchable)
   - Required: Yes
   - Shows: Project number + name
   - Example: "P-2025-M003: REWE München Ladeneinrichtung"
   - Filter: Only active projects
   - Error: "Projekt ist erforderlich"

3. **Lieferant** (Supplier)
   - Type: Supplier select dropdown (searchable)
   - Required: Yes
   - Shows: Supplier name + location
   - Filter: Only active suppliers
   - Pre-filled if coming from material selection
   - Error: "Lieferant ist erforderlich"
   - Info: Shows supplier payment terms below dropdown
     - "Zahlungsziel: 30 Tage, 2% Skonto bei 10 Tagen"

4. **Benötigt bis** (Required By Date)
   - Type: Date picker
   - Required: Yes
   - Min: Today
   - Max: Project end date
   - Default: +14 days from today
   - Validation: Must be before project end date
   - Error: "Lieferdatum muss vor Projektende liegen"

5. **Erstellt von** (Created By)
   - Type: Read-only text
   - Value: Current user name + role
   - Example: "Claudia Weber (INN)"

6. **Erstellungsdatum** (Creation Date)
   - Type: Read-only text
   - Value: Today's date

---

### Section 2: Positionen (Line Items)

**Repeatable Group:** Line items (minimum 1 required)

**For each line item:**

1. **Material**
   - Type: Material select dropdown (searchable)
   - Required: Yes
   - Shows: Material name, code, unit
   - Filter: Can search by name, code, category
   - Pre-filled if coming from project materials
   - Auto-fills: Description, unit, unit price (from selected supplier)
   - Error: "Material ist erforderlich"

2. **Beschreibung** (Description)
   - Type: Text input
   - Required: Yes
   - Max length: 200
   - Auto-filled from material description
   - Editable (user can customize)
   - Placeholder: "Material-Beschreibung"

3. **Menge** (Quantity)
   - Type: Number input
   - Required: Yes
   - Min: 0.01, Max: 100000
   - Step: Based on unit (0.01 for m², 1 for Stück)
   - Auto-filled from project requirement
   - Example: "24"
   - MOQ warning: If < supplier MOQ, show warning "Unter Mindestbestellmenge (10 Stk)"

4. **Einheit** (Unit)
   - Type: Text (read-only, from material)
   - Value: "Stück", "m²", "lfm", etc.

5. **Stückpreis** (Unit Price)
   - Type: Currency input
   - Required: Yes
   - Min: 0.01, Max: 100000
   - Unit: "€"
   - Auto-filled from supplier price for this material
   - Editable (if supplier gave new quote)
   - Example: "145,00"

6. **Nettobetrag** (Net Amount)
   - Type: Currency (read-only, calculated)
   - Formula: quantity \* unitPrice
   - Value: "€ 3.480,00"
   - Color: Blue

7. **MwSt.** (Tax Rate)
   - Type: Select dropdown
   - Required: Yes
   - Options: "19%", "7%", "0%" (exports)
   - Default: 19%

**Actions per line item:**

- **Remove:** Red "X" button (if >1 line item)
- **Duplicate:** Copy icon (creates duplicate line)
- **Add:** "+ Weitere Position hinzufügen" button below

---

### Section 3: Summen (Totals)

**Read-only calculated fields (right-aligned):**

```
┌────────────────────────────────┐
│ Zwischensumme:  € 118.450,00   │
│ MwSt. (19%):    €  22.505,50   │
│ Versandkosten:  €     150,00   │
│ ───────────────────────────────│
│ Gesamtbetrag:   € 141.105,50   │
└────────────────────────────────┘
```

**Fields:**

1. **Zwischensumme** (Subtotal)
   - Sum of all line item net amounts
   - Auto-calculated

2. **MwSt.** (Tax Amount)
   - Sum of (netAmount \* taxRate) for all lines
   - Auto-calculated

3. **Versandkosten** (Shipping Cost)
   - Type: Currency input (manual)
   - Required: No
   - Min: 0, Max: 10000
   - Unit: "€"
   - Default: 0
   - Placeholder: "0,00"

4. **Gesamtbetrag** (Total Amount)
   - Subtotal + Tax + Shipping
   - Auto-calculated
   - **Bold, large (28px)**
   - Color: Blue if ≤€10k, Amber if >€10k (requires approval)

---

### Section 4: Lieferdetails (Delivery Details)

**Fields:**

1. **Lieferadresse** (Delivery Address)
   - Type: Address select dropdown
   - Required: Yes
   - Options:
     - "Baustelle: [Project address]" (default)
     - "Lager: [Warehouse address]" (Phase 2)
   - Shows full address preview below dropdown

2. **Ansprechpartner vor Ort** (Contact On-Site)
   - Type: User select dropdown
   - Required: Yes
   - Filter: PLAN users or project team
   - Shows: User name + phone
   - Example: "Thomas Fischer (PLAN) • +49 89 987654"

3. **Lieferhinweise** (Delivery Notes)
   - Type: Textarea
   - Required: No
   - Max length: 500
   - Rows: 3
   - Placeholder: "Besondere Anweisungen für die Lieferung (z.B. Anlieferung nur vormittags)..."

4. **Teillieferungen erlaubt** (Partial Deliveries Allowed)
   - Type: Checkbox
   - Label: "☑ Teillieferungen akzeptabel"
   - Default: Checked
   - Help text: "Lieferant darf in mehreren Teillieferungen liefern"

---

### Section 5: Budget-Validierung (Budget Validation)

**Auto-displayed warning/info box:**

```
┌────────────────────────────────────────────────────────┐
│ ℹ️ Budget-Information                                   │
├────────────────────────────────────────────────────────┤
│ Projektbudget (Material): € 125.000                    │
│ Bereits bestellt: € 118.450                            │
│ Diese Bestellung: € 141.105                            │
│ Nach Bestellung: € 259.555                             │
│                                                        │
│ ⚠️ WARNUNG: Budget um € 134.555 überschritten (208%)   │
│                                                        │
│ GF-Freigabe erforderlich.                              │
└────────────────────────────────────────────────────────┘
```

**Colors:**

- Green: Well within budget (<80%)
- Blue: On track (80-100%)
- Amber: Over budget but <10% (warning)
- Red: Over budget >10% (requires GF explanation)

---

## Form Layout

### Desktop (1440px)

```
┌──────────────────────────────────────────────────────────┐
│ [←] Bestellung erstellen                     [?] [PDF↓] │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─ Kopfdaten ───────────────────────────────────────┐  │
│  │ Bestellnummer   PO-2025-00234 (automatisch)       │  │
│  │ Projekt *       [P-2025-M003: REWE München ▼]     │  │
│  │ Lieferant *     [Schreinerei Müller GmbH ▼]       │  │
│  │                 ℹ️ Zahlungsziel: 30 Tage, 2% Skonto│  │
│  │ Benötigt bis *  [15.02.2025] 📅                   │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ Positionen ──────────────────────────────────────┐  │
│  │                                                    │  │
│  │ ┌─ Position 1 ─────────────────────────────────┐  │  │
│  │ │ Material *    [LED-Panel 60x60cm MAT-LED-001▼]│  │  │
│  │ │ Beschreibung * [LED-Panel warmweiß_________]  │  │  │
│  │ │ Menge *       [24] Stück                      │  │  │
│  │ │ Stückpreis *  [145,00] €                      │  │  │
│  │ │ MwSt. *       [19% ▼]                         │  │  │
│  │ │ Nettobetrag   € 3.480,00        [Entfernen X] │  │  │
│  │ └───────────────────────────────────────────────┘  │  │
│  │                                                    │  │
│  │ ┌─ Position 2 ─────────────────────────────────┐  │  │
│  │ │ Material *    [Ladenregal Eiche MAT-SHE-012▼] │  │  │
│  │ │ Menge *       [8] Stück                       │  │  │
│  │ │ Stückpreis *  [850,00] €                      │  │  │
│  │ │ Nettobetrag   € 6.800,00        [Entfernen X] │  │  │
│  │ └───────────────────────────────────────────────┘  │  │
│  │                                                    │  │
│  │ [+ Weitere Position hinzufügen]                    │  │
│  │                                                    │  │
│  │                              ┌──────────────────┐  │  │
│  │                              │ Zwischensumme:   │  │  │
│  │                              │   € 118.450,00   │  │  │
│  │                              │ MwSt. (19%):     │  │  │
│  │                              │   €  22.505,50   │  │  │
│  │ Versandkosten  [150,00] €    │ Versand:         │  │  │
│  │                              │   €     150,00   │  │  │
│  │                              ├──────────────────┤  │  │
│  │                              │ Gesamtbetrag:    │  │  │
│  │                              │ € 141.105,50     │  │  │
│  │                              └──────────────────┘  │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ Budget-Validierung ──────────────────────────────┐  │
│  │ ⚠️ WARNUNG: Budget um € 16.105 überschritten       │  │
│  │ GF-Freigabe erforderlich.                          │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ Lieferdetails ───────────────────────────────────┐  │
│  │ Lieferadresse *   (⦿) Baustelle (Project address) │  │
│  │                   (⚪) Lager (Warehouse)           │  │
│  │                                                    │  │
│  │ Ansprechpartner * [Thomas Fischer (PLAN) ▼]       │  │
│  │                   +49 89 987654                    │  │
│  │                                                    │  │
│  │ Lieferhinweise                                     │  │
│  │ [_____________________________________________]    │  │
│  │ 0 / 500                                            │  │
│  │                                                    │  │
│  │ ☑ Teillieferungen erlaubt                          │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  [Abbrechen]           [Entwurf]  [Zur Freigabe senden]  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## Line Item Input Pattern

**Material Selection:**

1. User clicks "+ Weitere Position hinzufügen"
2. New line item row appears
3. User selects material from dropdown (searchable)
4. System auto-fills:
   - Description (from material)
   - Unit (from material)
   - Unit price (from supplier price if available)
   - Tax rate (default 19%)
   - Quantity (from project requirement if linked)
5. User can edit: Quantity, unit price, description
6. System calculates: Net amount = quantity \* unitPrice

**Quick Add from Project Materials:**

- If user came from "Create PO" on project materials page
- Line items pre-filled with selected materials
- User reviews and adjusts if needed

---

## Approval Workflow Indicators

### Auto-Approval (≤€1k)

```
┌────────────────────────────────────────────────────────┐
│ ✓ Automatische Freigabe                                │
├────────────────────────────────────────────────────────┤
│ Bestellwert unter € 1.000                              │
│ Keine manuelle Freigabe erforderlich.                  │
│                                                        │
│ Die Bestellung kann direkt an den Lieferanten         │
│ gesendet werden.                                       │
└────────────────────────────────────────────────────────┘
```

Button: "An Lieferant senden" (primary, green)

### BUCH Approval Required (€1k-€10k)

```
┌────────────────────────────────────────────────────────┐
│ 🟡 BUCH-Freigabe erforderlich                          │
├────────────────────────────────────────────────────────┤
│ Bestellwert: € 8.450                                   │
│ Freigabe durch Buchhaltung erforderlich.              │
│                                                        │
│ Die Bestellung wird an Anna Weber (BUCH) zur Prüfung  │
│ weitergeleitet.                                        │
└────────────────────────────────────────────────────────┘
```

Button: "Zur Freigabe senden" (primary, amber)

### GF Approval Required (>€10k)

```
┌────────────────────────────────────────────────────────┐
│ 🔴 GF-Freigabe erforderlich                            │
├────────────────────────────────────────────────────────┤
│ Bestellwert: € 141.105                                 │
│ Freigabe durch Geschäftsführung erforderlich.          │
│                                                        │
│ Die Bestellung wird an Dr. Schmidt (GF) zur Genehmigung│
│ weitergeleitet.                                        │
│                                                        │
│ Budget-Überschreitung: + € 16.105 (+13%)               │
│ Bitte Begründung hinzufügen:                           │
│ [_______________________________________________]      │
│                                                        │
└────────────────────────────────────────────────────────┘
```

Button: "Zur GF-Freigabe senden" (primary, red)
Required field: Justification for budget overrun

---

## Mobile View (375px)

```
┌─────────────────────────────────┐
│ [←] Bestellung erstellen    [?] │
├─────────────────────────────────┤
│                                 │
│ ▼ Kopfdaten                     │
│ Bestellnr: PO-2025-00234        │
│                                 │
│ Projekt *                       │
│ [P-2025-M003: REWE ▼]           │
│                                 │
│ Lieferant *                     │
│ [Schreinerei Müller ▼]          │
│ Zahlungsziel: 30 Tage           │
│                                 │
│ Benötigt bis *                  │
│ [15.02.2025] 📅                 │
│                                 │
│ ▼ Positionen (3)                │
│                                 │
│ ┌─ Position 1 ─────────────┐   │
│ │ LED-Panel 60x60cm        │   │
│ │ 24 Stk × € 145           │   │
│ │ = € 3.480 (+ 19% MwSt)   │   │
│ │ [Bearbeiten] [X]         │   │
│ └──────────────────────────┘   │
│                                 │
│ ┌─ Position 2 ─────────────┐   │
│ │ Ladenregal Eiche         │   │
│ │ 8 Stk × € 850            │   │
│ │ = € 6.800 (+ 19% MwSt)   │   │
│ │ [Bearbeiten] [X]         │   │
│ └──────────────────────────┘   │
│                                 │
│ [+ Position hinzufügen]         │
│                                 │
│ ▼ Summen                        │
│ Zwischensumme: € 118.450        │
│ MwSt. (19%):   €  22.506        │
│ Versand:       €     150        │
│ ───────────────────────────     │
│ Gesamt: € 141.106               │
│                                 │
│ ▶ Lieferdetails                 │
│ ▶ Budget-Info                   │
│                                 │
│ [Entwurf speichern]             │
│ [Zur Freigabe senden] →         │
│                                 │
└─────────────────────────────────┘
```

---

## Form Validation

### Validation Rules

1. **Line items:**
   - Minimum 1 line item required
   - Each line: material, quantity, unit price required
   - No duplicate materials in same PO
   - Quantity must be positive

2. **Totals:**
   - Subtotal = sum of line items
   - Tax = sum of (line net \* tax rate)
   - Total = subtotal + tax + shipping
   - Tolerance: ±€0.01 for rounding

3. **Delivery:**
   - Required by date must be: ≥today, ≤project end date
   - Contact person must be valid user
   - Address must be valid

4. **Budget:**
   - Warn if: PO total + already ordered > project material budget
   - Block if: >50% over budget without GF justification

### Error Messages

- "Mindestens eine Position erforderlich"
- "Material bereits in Bestellung vorhanden"
- "Menge muss größer als 0 sein"
- "Lieferdatum muss vor Projektende liegen"
- "Budget-Überschreitung erfordert GF-Freigabe und Begründung"

---

## Save Behavior

### Save Draft

- Minimal validation (only critical fields)
- Status: 'Draft'
- Can be edited later
- Success: "Entwurf gespeichert"
- Redirect: PO list or project materials view

### Submit for Approval

- Full validation
- Check approval requirements:
  - ≤€1k: Status = 'Approved' (auto), show "An Lieferant senden"
  - €1k-€10k: Status = 'PendingApproval', route to BUCH
  - > €10k: Status = 'PendingApproval', route to GF
- Create notification for approver
- Success: "Bestellung zur Freigabe gesendet"
- Redirect: PO detail (view-only until approved)

### Send to Supplier (if auto-approved)

- Status: 'SentToSupplier'
- Generate PO PDF (company letterhead, line items, terms)
- Email to supplier with PO PDF attached
- Log: Order date, order method
- Success: "Bestellung an Lieferant gesendet"
- Redirect: PO detail (awaiting supplier confirmation)

---

## Approval View (for BUCH/GF)

**When approver opens PO:**

```
┌────────────────────────────────────────────────────────┐
│ 🟡 Freigabe erforderlich                          [×]  │
├────────────────────────────────────────────────────────┤
│ Bestellung: PO-2025-00234                              │
│ Projekt: P-2025-M003 (REWE München)                    │
│ Lieferant: Schreinerei Müller GmbH                     │
│ Gesamtbetrag: € 141.105,50                             │
│                                                        │
│ Erstellt von: Claudia Weber (INN) • 12.11.2024        │
│                                                        │
│ [Full PO details shown...]                             │
│                                                        │
│ Budget-Status: ⚠️ € 16.105 über Budget (+13%)          │
│                                                        │
│ Begründung (INN):                                      │
│ "Zusätzliche Elektrik-Komponenten nach Planänderung   │
│  durch Kunden erforderlich. Vom Kunden genehmigt."    │
│                                                        │
│ Ihre Entscheidung:                                     │
│ [Ablehnen] [Rückfragen] [Genehmigen ✓]                │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Actions:**

- **Genehmigen:** Status = 'Approved', INN notified, can send to supplier
- **Ablehnen:** Status = 'Draft', requires reason, INN notified to revise
- **Rückfragen:** Send message to INN for clarification, status unchanged

---

## shadcn/ui Components

```bash
npx shadcn-ui@latest add form input select table button card alert separator dialog
```

---

## Accessibility

- **Form:** Semantic structure with fieldsets
- **Line items:** List with aria-label per item
- **Calculations:** Announced when totals change
- **Approval status:** Clear visual + text indicators
- **Keyboard:** Full keyboard navigation
- **Screen reader:** Announces approval requirements

---

## Example Data

- **PO:** PO-2025-00234
- **Project:** P-2025-M003: REWE München Ladeneinrichtung
- **Supplier:** Schreinerei Müller GmbH
- **Line items:** 3 materials, total € 141.106
- **Status:** Pending approval (>€10k)
- **Required by:** 15.02.2025
- **Budget:** Over by +13% (requires GF approval)

---

**End of purchase-order-form.md**

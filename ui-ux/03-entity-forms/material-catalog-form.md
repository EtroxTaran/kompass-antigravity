# Material Catalog Form - Figma Make Prompt

## Context & Purpose

- **Entity:** Material (Catalog Item)
- **Users:** KALK (primary creator during estimates), INN (procurement), PLAN (project requirements)
- **Purpose:** Add materials to searchable catalog with specifications, pricing, and supplier information
- **Key Focus:** Complete specifications, multi-supplier pricing, searchability

## Figma Make Prompt

Create a material catalog entry form for KOMPASS for adding construction/retail materials with specifications, multi-supplier pricing, and inventory settings with German labels.

**Form Title:** "Material erfassen"

**Form Actions:**

- **Save:** "Speichern" (primary button, right)
- **Save & Add Another:** "Speichern & Weiteres hinzufügen" (secondary button)
- **Cancel:** "Abbrechen" (text link)

---

## Form Sections

### Section 1: Grundinformationen (Basic Information)

**Fields:**

1. **Materialname** (Material Name)
   - Type: Text input
   - Required: Yes
   - Max length: 200 characters
   - Placeholder: "z.B. LED-Panel 60x60cm warmweiß"
   - Validation: Letters, numbers, special chars (./&-())
   - Error: "Materialname ist erforderlich (5-200 Zeichen)"

2. **Materialcode** (Material Code)
   - Type: Text input
   - Required: Yes (auto-generated or manual)
   - Pattern: MAT-XXX-### (e.g., "MAT-LED-001")
   - Placeholder: "MAT-LED-001"
   - Button: "Automatisch generieren" (generates next available code)
   - Validation: Unique within catalog
   - Error: "Materialcode bereits vergeben"

3. **Kategorie** (Category)
   - Type: Select dropdown with icons
   - Required: Yes
   - Grouped options:
     - **Regale & Präsentation:**
       - 🗄️ Regale (Shelving)
       - 📦 Präsentationsvitrinen (Display Units)
       - 🏪 Theken (Counters)
     - **Möbel:**
       - 🪑 Sitzmöbel (Seating)
       - 🍽️ Tische (Tables)
       - 🗃️ Lagermöbel (Storage)
     - **Beleuchtung:**
       - 💡 Deckenleuchten (Ceiling Lights)
       - 🔦 Strahler (Spot Lights)
       - 💡 LED-Bänder (LED Strips)
       - 🪧 Leuchtschriften (Signage Lights)
     - **Rohmaterialien:**
       - 🪵 Holz (Wood)
       - 🔩 Metall (Metal)
       - 🪟 Glas (Glass)
     - **Elektrik & Sanitär:**
       - ⚡ Elektrik-Komponenten
       - 🚿 Sanitär-Armaturen
     - **Bodenbeläge:**
       - 🟫 Bodenbeläge (Flooring)
       - 🧱 Fliesen (Tiles)
     - **Sonstiges:**
       - 🔧 Werkzeuge (Tools)
       - 📦 Verbrauchsmaterial (Consumables)
   - Error: "Kategorie ist erforderlich"

4. **Unterkategorie** (Subcategory)
   - Type: Text input (free text)
   - Required: No
   - Max length: 100
   - Placeholder: "z.B. Einbaustrahler, Wandleuchte"
   - Help text: "(Optional) Weitere Spezifizierung"

5. **Mengeneinheit** (Unit of Measure)
   - Type: Select dropdown
   - Required: Yes
   - Options:
     - "Stück" (Piece)
     - "m²" (Square Meter)
     - "lfm" (Linear Meter)
     - "m³" (Cubic Meter)
     - "kg" (Kilogram)
     - "Liter" (Liter)
     - "Paket" (Package)
     - "Set" (Set)
   - Default: "Stück"
   - Error: "Mengeneinheit ist erforderlich"

---

### Section 2: Beschreibung & Spezifikationen (Description & Specs)

**Fields:**

1. **Beschreibung** (Description)
   - Type: Textarea
   - Required: Yes
   - Min length: 20, Max length: 1000
   - Rows: 5
   - Placeholder: "Detaillierte Beschreibung des Materials, technische Details, Einsatzbereiche..."
   - Character counter: "0 / 1000"
   - Error: "Beschreibung erforderlich (20-1000 Zeichen)"

2. **Abmessungen** (Dimensions - Optional Group)
   - Checkbox: "☐ Abmessungen angeben"
   - If checked, show fields:
     - Länge (Length): [___] cm
     - Breite (Width): [___] cm
     - Höhe (Height): [___] cm
     - Durchmesser (Diameter): [___] cm
     - Einheit: [cm ▼] (cm, mm, m)
   - Compact display: "120 x 60 x 2 cm (L x B x H)"

3. **Farbe** (Color)
   - Type: Text input with color picker (Phase 2)
   - Required: No
   - Max length: 50
   - Placeholder: "z.B. Weiß RAL 9010"
   - Examples shown: "Weiß", "Anthrazit", "Eiche Natur", "Edelstahl"

4. **Oberfläche** (Finish/Surface)
   - Type: Select dropdown
   - Required: No
   - Options: "Matt", "Glänzend", "Seidenmatt", "Gebürstet", "Poliert", "Roh", "Lackiert"
   - Placeholder: "Oberflächenfinish wählen..."

5. **Material** (Material Type)
   - Type: Select dropdown
   - Required: No
   - Options: "Holz", "Metall", "Glas", "Kunststoff", "Stein", "Textil", "Verbundwerkstoff"
   - Placeholder: "Materialtyp wählen..."

6. **Gewicht** (Weight)
   - Type: Number input
   - Required: No
   - Min: 0, Max: 10000
   - Unit: "kg"
   - Placeholder: "z.B. 12,5"
   - Help text: "(Optional) Gewicht pro Einheit"

---

### Section 3: Hersteller & Katalogdaten (Manufacturer & Catalog)

**Fields:**

1. **Hersteller** (Manufacturer)
   - Type: Text input with autocomplete (from existing materials)
   - Required: No
   - Max length: 100
   - Placeholder: "z.B. IKEA, Osram, Siemens"
   - Autocomplete: Shows manufacturers from existing catalog

2. **Hersteller-Artikelnummer** (Manufacturer SKU)
   - Type: Text input
   - Required: No
   - Max length: 50
   - Placeholder: "z.B. 123.456.78"

3. **Produktlinie** (Product Line/Series)
   - Type: Text input
   - Required: No
   - Max length: 100
   - Placeholder: "z.B. IKEA BESTÅ Serie"

4. **EAN / Barcode**
   - Type: Text input
   - Required: No
   - Pattern: 13 digits (EAN-13) or 8 digits (EAN-8)
   - Placeholder: "1234567890123"
   - Button: "📷 Scannen" (opens camera for barcode scan - mobile)
   - Validation: Checksum validation for EAN

---

### Section 4: Preise & Lieferanten (Pricing & Suppliers)

**Repeatable Group:** "Lieferant hinzufügen" (minimum 1 required)

**For each supplier price:**

1. **Lieferant** (Supplier)
   - Type: Select dropdown (searchable)
   - Required: Yes
   - Options: All active suppliers filtered by relevant service category
   - Placeholder: "Lieferant wählen..."
   - Error: "Mindestens ein Lieferant erforderlich"

2. **Stückpreis** (Unit Price)
   - Type: Currency input
   - Required: Yes
   - Min: 0.01, Max: 100000
   - Unit: "€"
   - Placeholder: "145,00"
   - Error: "Preis erforderlich"

3. **Mindestbestellmenge (MOQ)** (Minimum Order Quantity)
   - Type: Number input
   - Required: Yes
   - Min: 1, Max: 10000
   - Unit: Matches material unit (e.g., "Stück")
   - Default: 1
   - Placeholder: "z.B. 10"

4. **Lieferzeit** (Lead Time)
   - Type: Number input
   - Required: Yes
   - Min: 0, Max: 365
   - Unit: "Tage"
   - Default: 14
   - Placeholder: "z.B. 14"

5. **Bevorzugter Lieferant** (Preferred Supplier)
   - Type: Radio button (only one can be preferred)
   - Checked: Shows star icon ⭐
   - Help text: "Wird für Kalkulationen verwendet"

6. **Mengenrabatte** (Bulk Discounts - Optional)
   - Checkbox: "☐ Mengenrabatte verfügbar"
   - If checked, repeatable subgroup (max 3):
     - **Ab Menge:** [___] Stück
     - **Rabatt:** [___] %
     - **Preis:** "€ 138,00" (calculated automatically)
   - Example: "Ab 10 Stk: 5% Rabatt (€ 137,75)"

7. **Notizen** (Price Notes)
   - Type: Text input
   - Required: No
   - Max length: 200
   - Placeholder: "z.B. Preis gilt bis 31.12.2025"

**Actions per supplier:**

- **Remove:** Red "X" button (if >1 supplier)
- **Add Another:** "+ Weiteren Lieferanten hinzufügen" button below

**Price Summary Display:**

```
Preisspanne: € 138 - € 152 (3 Lieferanten)
Durchschnitt: € 145
Bevorzugt: Schreinerei Müller (€ 145) ⭐
```

---

### Section 5: Lagerbestand [Phase 2] (Inventory - Optional)

**Collapsible Section:** "▶ Lagerbestand verwalten" (collapsed by default)

**Fields:**

1. **Lagerbestand verfolgen** (Track Inventory)
   - Type: Checkbox
   - Label: "☐ Lagerbestand für dieses Material verfolgen"
   - If unchecked: Hide all fields below, inventory not tracked

2. **Aktueller Bestand** (Current Stock)
   - Type: Number input
   - Required: If tracking enabled
   - Min: 0
   - Unit: Material unit (e.g., "Stück")
   - Placeholder: "z.B. 50"

3. **Mindestbestand** (Minimum Stock Level)
   - Type: Number input
   - Required: If tracking enabled
   - Min: 0
   - Unit: Material unit
   - Placeholder: "z.B. 10"
   - Help text: "Nachbestellung wird empfohlen ab diesem Wert"

4. **Maximaler Bestand** (Maximum Stock Level)
   - Type: Number input
   - Required: No
   - Min: Must be > Mindestbestand
   - Unit: Material unit
   - Placeholder: "z.B. 100"
   - Help text: "Lagerkapazität"

5. **Lagerort** (Stock Location)
   - Type: Text input
   - Required: No
   - Max length: 100
   - Placeholder: "z.B. Lager A, Regal 3, Fach 12"

---

### Section 6: Dokumente (Documents)

**Upload Areas:**

1. **Datenblatt** (Datasheet)
   - Type: File upload (PDF)
   - Required: No
   - Max size: 5 MB
   - Label: "Technisches Datenblatt"

2. **Montageanleitung** (Installation Guide)
   - Type: File upload (PDF)
   - Required: No
   - Max size: 5 MB

3. **Produktbilder** (Product Images)
   - Type: Multiple image upload
   - Required: No
   - Max files: 5
   - Max size per file: 5 MB
   - Formats: JPG, PNG, WebP
   - Preview: Thumbnail grid
   - Main image: First image marked as primary
   - Drag to reorder images

**Upload UI:**

- Drag-and-drop zone
- Click to select files
- Progress bar during upload
- Thumbnail preview after upload
- Remove: Red "X" icon per file

---

### Section 7: Suchbegriffe & Notizen (Tags & Notes)

**Fields:**

1. **Suchbegriffe / Tags** (Search Tags)
   - Type: Tag input (multi-value)
   - Required: No
   - Max tags: 20
   - Max length per tag: 30
   - Placeholder: "Tags eingeben..."
   - Examples shown: "LED", "Deckenleuchte", "warmweiß", "dimmbar"
   - User enters tag, presses Enter: Tag added as pill
   - Remove tag: Click "X" on pill

2. **Interne Notizen** (Internal Notes)
   - Type: Textarea
   - Required: No
   - Max length: 1000
   - Rows: 4
   - Placeholder: "Interne Hinweise zu diesem Material (nur für Team sichtbar)..."
   - Character counter: "0 / 1000"
   - Help text: "Nicht für Kunden sichtbar"

---

## Form Layout

### Desktop (1440px)

```
┌──────────────────────────────────────────────────────────┐
│ [←] Material erfassen                    [?] [Vorschau] │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─ Grundinformationen ──────────────────────────────┐  │
│  │ Materialname *    [_______________________________]│  │
│  │ Materialcode *    [MAT-LED-001] [Auto generieren] │  │
│  │ Kategorie *       [💡 Deckenleuchten ▼]            │  │
│  │ Unterkategorie    [_______________________________]│  │
│  │ Mengeneinheit *   [Stück ▼]                        │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ Beschreibung & Spezifikationen ──────────────────┐  │
│  │ Beschreibung *                                     │  │
│  │ [_______________________________________________]  │  │
│  │ [_______________________________________________]  │  │
│  │ 250 / 1000                                         │  │
│  │                                                    │  │
│  │ ☑ Abmessungen angeben                              │  │
│  │   Länge [120] cm • Breite [60] cm • Höhe [2] cm   │  │
│  │                                                    │  │
│  │ Farbe         [Weiß RAL 9010__________]            │  │
│  │ Oberfläche    [Matt ▼]                             │  │
│  │ Materialtyp   [Kunststoff ▼]                       │  │
│  │ Gewicht       [___] kg                             │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ Hersteller & Katalogdaten ───────────────────────┐  │
│  │ Hersteller           [Osram______________]         │  │
│  │ Artikelnummer        [123.456.78_______]           │  │
│  │ Produktlinie         [_______________________________]│  │
│  │ EAN / Barcode        [1234567890123] [📷 Scannen]  │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ Preise & Lieferanten ────────────────────────────┐  │
│  │                                                    │  │
│  │ ┌─ Lieferant 1 ───────────────────────────────┐   │  │
│  │ │ Lieferant *      [Schreinerei Müller ▼]     │   │  │
│  │ │ Stückpreis *     [145,00] €                  │   │  │
│  │ │ Mind.menge (MOQ) [10] Stück                  │   │  │
│  │ │ Lieferzeit       [14] Tage                   │   │  │
│  │ │ ⦿ Bevorzugter Lieferant ⭐                   │   │  │
│  │ │ Notizen          [___________________________]│   │  │
│  │ │                                [Entfernen X]  │   │  │
│  │ └──────────────────────────────────────────────┘   │  │
│  │                                                    │  │
│  │ ┌─ Lieferant 2 ───────────────────────────────┐   │  │
│  │ │ Lieferant *      [Holzgroßhandel Weber ▼]   │   │  │
│  │ │ Stückpreis *     [138,00] €                  │   │  │
│  │ │ Mind.menge       [20] Stück                  │   │  │
│  │ │ Lieferzeit       [7] Tage                    │   │  │
│  │ │ ⚪ Bevorzugter Lieferant                     │   │  │
│  │ │ ☑ Mengenrabatte: Ab 50 Stk: 5% (€ 131,10)   │   │  │
│  │ │                                [Entfernen X]  │   │  │
│  │ └──────────────────────────────────────────────┘   │  │
│  │                                                    │  │
│  │ [+ Weiteren Lieferanten hinzufügen]                │  │
│  │                                                    │  │
│  │ ╔═══════════════════════════════════════════════╗ │  │
│  │ ║ Preisspanne: € 138 - € 152 (2 Lieferanten)   ║ │  │
│  │ ║ Durchschnitt: € 141,50                        ║ │  │
│  │ ║ Bevorzugt: Schreinerei Müller (€ 145) ⭐      ║ │  │
│  │ ╚═══════════════════════════════════════════════╝ │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ Lagerbestand [Phase 2] ──────────────────────────┐  │
│  │ ▶ Lagerbestand verwalten (Optional)                 │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ Dokumente ───────────────────────────────────────┐  │
│  │ Datenblatt        [📁 PDF hochladen]               │  │
│  │ Montageanleitung  [📁 PDF hochladen]               │  │
│  │ Produktbilder     [📁 Bilder hochladen (max. 5)]   │  │
│  │   [img1] [img2] [img3]                             │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ Suchbegriffe & Notizen ──────────────────────────┐  │
│  │ Suchbegriffe (Tags)                                 │  │
│  │ [LED][Decke][warmweiß][dimmbar] + Eingabefeld...  │  │
│  │                                                    │  │
│  │ Interne Notizen                                    │  │
│  │ [_____________________________________________]    │  │
│  │ 0 / 1000                                           │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  [Abbrechen]        [Speichern]  [Speichern & Weiteres]  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

### Mobile (375px)

```
┌─────────────────────────────┐
│ [←] Material erfassen   [?] │
├─────────────────────────────┤
│                             │
│ ▼ Grundinformationen        │
│ Materialname *              │
│ [_______________________]   │
│                             │
│ Materialcode *              │
│ [MAT-LED-001] [Auto]        │
│                             │
│ Kategorie *                 │
│ [💡 Deckenleuchten ▼]      │
│                             │
│ Mengeneinheit *             │
│ [Stück ▼]                   │
│                             │
│ ▶ Beschreibung & Specs      │
│ ▶ Hersteller                │
│ ▼ Preise (2 Lieferanten)    │
│   Schreinerei Müller ⭐     │
│   € 145 • 10 Stk • 14 Tg   │
│   [Bearbeiten]              │
│                             │
│   Holzgroßhandel Weber      │
│   € 138 • 20 Stk • 7 Tg    │
│   [Bearbeiten]              │
│                             │
│   [+ Lieferant]             │
│                             │
│ ▶ Lagerbestand              │
│ ▶ Dokumente                 │
│ ▶ Suchbegriffe              │
│                             │
│ [Speichern] ✓               │
│                             │
└─────────────────────────────┘
```

**Mobile Optimizations:**

- Collapsible sections (only 1 expanded at a time)
- Sticky save button at bottom
- Camera icon for barcode scan (direct device camera access)
- Image upload: Access device camera or gallery

---

## Form Validation & Behavior

### Real-Time Validation

- **Material code uniqueness:** Check on blur
- **EAN checksum:** Validate on input
- **Supplier price calculations:** Auto-calculate price summary on change
- **Required fields:** Highlight with red border on submit if empty

### Price Calculation

```typescript
// Automatic calculations:
averagePrice =
  sum(supplierPrices.map((p) => p.unitPrice)) / supplierPrices.length;
lowestPrice = min(supplierPrices.map((p) => p.unitPrice));
preferredPrice =
  supplierPrices.find((p) => p.isPreferred)?.unitPrice || averagePrice;

// Bulk discount calculation per supplier:
for (discount of bulkDiscounts) {
  discount.unitPrice = baseUnitPrice * (1 - discount.discountPercentage / 100);
}
```

### Save Behavior

**Speichern:**

- Full validation
- Status: 'Active'
- lastPriceUpdate: today
- Success toast: "Material gespeichert"
- Redirect: Material detail page

**Speichern & Weiteres hinzufügen:**

- Full validation
- Status: 'Active'
- Success toast: "Material gespeichert. Weiteres Material erfassen..."
- Reset form: Keep category, clear all other fields
- Stay on form page

---

## Duplicate Detection [Phase 2]

**Trigger:** On material name blur or category change

**Logic:**

- Search catalog for similar materials (fuzzy matching):
  - Same category
  - Similar name (Levenshtein distance < 3)
  - Same manufacturer + SKU

**UI if duplicate found:**

```
┌──────────────────────────────────────────────────────────┐
│ ⚠️ Ähnliches Material gefunden                           │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ LED-Panel 60x60cm warmweiß (MAT-LED-001)                 │
│ Osram • Kategorie: Deckenleuchten                        │
│ € 145 (Durchschnitt)                                     │
│                                                          │
│ Ähnlichkeit: 92%                                         │
│                                                          │
│ Möchten Sie stattdessen dieses Material verwenden?      │
│                                                          │
│ [Material anzeigen]  [Trotzdem neu erstellen]           │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## shadcn/ui Components

```bash
npx shadcn-ui@latest add form input textarea select checkbox radio-group button label card separator
```

### Form Structure

```tsx
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const materialSchema = z.object({
  materialName: z.string().min(5).max(200),
  materialCode: z.string().regex(/^MAT-[A-Z]{3}-\d{3}$/),
  category: z.nativeEnum(MaterialCategory),
  unit: z.nativeEnum(UnitOfMeasure),
  description: z.string().min(20).max(1000),
  supplierPrices: z.array(supplierPriceSchema).min(1),
  // ... all fields
});

const supplierPriceSchema = z.object({
  supplierId: z.string().uuid(),
  unitPrice: z.number().min(0.01).max(100000),
  minimumOrderQuantity: z.number().int().min(1),
  leadTimeDays: z.number().int().min(0).max(365),
  isPreferred: z.boolean(),
});
```

---

## Accessibility

- **Form structure:** Semantic HTML with `<form>`, `<fieldset>`, `<legend>`
- **Labels:** All inputs have associated labels
- **Required fields:** aria-required + visual asterisk
- **Error messages:** aria-describedby links to error text
- **Keyboard navigation:** Tab order follows visual layout
- **Screen reader:** Announces price calculations and validations

---

## Example Data

- **Name:** "LED-Panel 60x60cm warmweiß"
- **Code:** "MAT-LED-001"
- **Category:** "Deckenleuchten"
- **Unit:** "Stück"
- **Description:** "Hochwertiges LED-Panel für abgehängte Decken. Warmweißes Licht (3000K), 40W, 4000 Lumen. Dimmbar. Einbautiefe 3cm. Lebensdauer 50.000 Stunden. Energieeffizienzklasse A++."
- **Dimensions:** 60 x 60 x 2 cm
- **Manufacturer:** "Osram"
- **SKU:** "LED-60X60-WW-40W"
- **Suppliers:**
  - Schreinerei Müller: € 145, MOQ 10, 14 Tage, ⭐ Bevorzugt
  - Elektro Schmidt: € 138, MOQ 20, 7 Tage
- **Tags:** "LED", "Panel", "Decke", "warmweiß", "dimmbar", "Osram"

---

**End of material-catalog-form.md**

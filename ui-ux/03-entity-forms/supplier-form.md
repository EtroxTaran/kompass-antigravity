# Supplier Form - Figma Make Prompt

## Context & Purpose
- **Entity:** Supplier / Subcontractor
- **Users:** INN (primary creator), PLAN (can create), GF (approval)
- **Purpose:** Onboard and manage external partners (suppliers, subcontractors, craftsmen)
- **Key Focus:** Complete supplier profile, service capabilities, performance tracking

## Figma Make Prompt

Create a supplier/subcontractor form for KOMPASS for onboarding external partners with German labels, document uploads, and service category selection.

**Form Title:** "Lieferant / Subunternehmer erfassen"

**Form Actions:**
- **Save Draft:** "Entwurf speichern" (secondary button, left)
- **Submit for Approval:** "Zur Freigabe senden" (primary button, right) - Sets status = 'PendingApproval'
- **Cancel:** "Abbrechen" (text link)

---

## Form Sections

### Section 1: Grundinformationen (Basic Information)

**Fields:**

1. **Firmenname** (Company Name)
   - Type: Text input
   - Required: Yes
   - Max length: 200 characters
   - Placeholder: "z.B. Schreinerei Müller GmbH"
   - Validation: Letters, numbers, basic punctuation only
   - Error: "Firmenname ist erforderlich (2-200 Zeichen)"

2. **Rechtsform** (Legal Form)
   - Type: Select dropdown
   - Required: No
   - Options: "GmbH", "AG", "e.K.", "GbR", "UG", "Einzelunternehmen", "Sonstige"
   - Placeholder: "Rechtsform wählen..."

3. **USt-IdNr.** (VAT Number)
   - Type: Text input
   - Required: No
   - Pattern: DE + 9 digits
   - Placeholder: "DE123456789"
   - Validation: Real-time format check
   - Error: "Ungültiges Format (DE123456789)"

4. **Steuernummer** (Tax ID)
   - Type: Text input
   - Required: No
   - Max length: 20
   - Placeholder: "12/345/67890"

5. **Lieferanten-Typ** (Supplier Type)
   - Type: Radio group (horizontal)
   - Required: Yes
   - Options:
     - "Materiallieferant" (material_supplier)
     - "Dienstleister" (service_provider)
     - "Subunternehmer" (subcontractor)
     - "Handwerker" (craftsman)
     - "Logistik" (logistics)
     - "Gemischt" (mixed)
   - Icons for each type
   - Default: "Subunternehmer"
   - Error: "Lieferanten-Typ ist erforderlich"

---

### Section 2: Kontaktdaten (Contact Information)

**Fields:**

1. **E-Mail** (Email)
   - Type: Email input
   - Required: Yes
   - Placeholder: "info@beispiel.de"
   - Validation: Email format
   - Error: "Gültige E-Mail-Adresse erforderlich"

2. **Telefon** (Phone)
   - Type: Tel input
   - Required: Yes
   - Placeholder: "+49 (0) 123 456789"
   - Max length: 20
   - Error: "Telefonnummer ist erforderlich"

3. **Mobil** (Mobile)
   - Type: Tel input
   - Required: No
   - Placeholder: "+49 (0) 170 1234567"

4. **Fax**
   - Type: Tel input
   - Required: No
   - Placeholder: "+49 (0) 123 456780"
   - Note: "(Optional - Legacy)"

5. **Website**
   - Type: URL input
   - Required: No
   - Placeholder: "https://www.beispiel.de"
   - Validation: URL format

---

### Section 3: Adresse (Address)

**Fields:**

1. **Straße und Hausnummer** (Street + Number)
   - Type: Text input
   - Required: Yes
   - Max length: 100
   - Placeholder: "Hauptstraße 42"
   - Error: "Straße ist erforderlich"

2. **Postleitzahl** (ZIP Code)
   - Type: Text input
   - Required: Yes
   - Pattern: 5 digits (German)
   - Placeholder: "80331"
   - Validation: Real-time format check
   - Error: "Ungültige PLZ (5 Ziffern)"

3. **Stadt** (City)
   - Type: Text input
   - Required: Yes
   - Max length: 100
   - Placeholder: "München"
   - Error: "Stadt ist erforderlich"

4. **Land** (Country)
   - Type: Select dropdown
   - Required: Yes
   - Default: "Deutschland"
   - Options: "Deutschland", "Österreich", "Schweiz", "Andere EU", "Andere"

**Additional Delivery Addresses:**
- Checkbox: "Weitere Lieferadressen hinzufügen"
- If checked: Show repeatable address group (max 5)
- Each with label: "Lieferadresse 2", "Lieferadresse 3", etc.
- Remove button: Red "X" icon

---

### Section 4: Leistungskategorien (Service Categories)

**Fields:**

1. **Hauptkategorien** (Main Categories)
   - Type: Multi-select checkbox group
   - Required: Yes (minimum 1, maximum 10)
   - Layout: Grid (3 columns)
   - Options:
     - **Handwerk (Trades):**
       - ☐ Tischlerei (Carpentry)
       - ☐ Metallbau (Metalwork)
       - ☐ Elektrik (Electrical)
       - ☐ Sanitär (Plumbing)
       - ☐ Heizung/Klima (HVAC)
       - ☐ Malerei (Painting)
       - ☐ Bodenbeläge (Flooring)
     - **Materialien (Materials):**
       - ☐ Holzmaterialien (Wood)
       - ☐ Metallmaterialien (Metal)
       - ☐ Beleuchtung (Lighting)
       - ☐ Möbel (Furniture)
       - ☐ Einrichtungsgegenstände (Fixtures)
     - **Dienstleistungen (Services):**
       - ☐ Montage (Installation)
       - ☐ Transport (Transport)
       - ☐ Entsorgung (Disposal)
       - ☐ Reinigung (Cleaning)
       - ☐ Sonstige (Other)
   - Error: "Mindestens eine Leistungskategorie erforderlich"

2. **Leistungsbeschreibung** (Service Description)
   - Type: Textarea
   - Required: Yes
   - Min length: 50, Max length: 1000
   - Rows: 6
   - Placeholder: "Beschreiben Sie die angebotenen Leistungen und Spezialisierungen..."
   - Character counter: "450 / 1000"
   - Error: "Leistungsbeschreibung erforderlich (50-1000 Zeichen)"

3. **Arbeitsradius** (Working Radius - km)
   - Type: Number input
   - Required: No
   - Min: 0, Max: 500
   - Unit: "km"
   - Placeholder: "z.B. 50"
   - Help text: "(Optional) Maximaler Einsatzradius in km"

---

### Section 5: Geschäftsbedingungen (Business Terms)

**Fields:**

1. **Zahlungsbedingungen** (Payment Terms)
   - **Zahlungsmethode** (Payment Method)
     - Type: Select dropdown
     - Required: Yes
     - Options: "Rechnung" (Invoice), "Lastschrift" (DirectDebit), "Überweisung" (BankTransfer), "Bar" (Cash)
     - Default: "Rechnung"
   
   - **Zahlungsziel** (Days Until Due)
     - Type: Number input with quick select buttons
     - Required: Yes
     - Quick buttons: [14 Tage] [21 Tage] [30 Tage] [60 Tage] [90 Tage]
     - Manual input: 0-120
     - Unit: "Tage"
     - Default: 30
     - Error: "Zahlungsziel ist erforderlich (0-120 Tage)"
   
   - **Skonto** (Early Payment Discount)
     - Checkbox: "Skonto gewährt"
     - If checked, show:
       - Discount %: Number input, 0-10%, Default: 2%
       - Discount days: Number input, 0-30, Default: 10
       - Example: "2% Skonto bei Zahlung innerhalb von 10 Tagen"

2. **Mindestbestellwert** (Minimum Order Value)
   - Type: Currency input
   - Required: No
   - Min: 0, Max: 100000
   - Unit: "€"
   - Placeholder: "z.B. 500"
   - Help text: "(Optional) Mindestauftragswert"

3. **Lieferzeit** (Delivery Lead Time)
   - Type: Number input
   - Required: No
   - Min: 0, Max: 365
   - Unit: "Tage"
   - Placeholder: "z.B. 14"
   - Help text: "(Optional) Typische Lieferzeit in Tagen"

4. **Kreditlimit** (Credit Limit)
   - Type: Currency input
   - Required: No
   - Min: 0, Max: 1000000
   - Unit: "€"
   - Placeholder: "z.B. 50000"
   - Help text: "(Optional) Maximales Kreditlimit"

---

### Section 6: Dokumente (Documents)

**Upload Areas:**

1. **Versicherungsnachweis** (Insurance Certificate)
   - Type: File upload (PDF, JPG, PNG)
   - Required: Yes (for service providers, subcontractors)
   - Max size: 10 MB
   - Label: "Versicherungsnachweis (Pflicht für Haftungsarbeiten)"
   - Upload button: "Datei hochladen" or drag-and-drop
   - Preview: Thumbnail with filename
   - Remove: Red "X" icon
   - Validation: "Versicherungsnachweis erforderlich für Dienstleister/Subunternehmer"

2. **Gewerbeanmeldung** (Trade License)
   - Type: File upload
   - Required: No (recommended)
   - Max size: 10 MB
   - Label: "Gewerbeanmeldung"

3. **Qualifikationen** (Qualifications/Certifications)
   - Type: Multiple file upload
   - Required: No
   - Max files: 10
   - Max size per file: 10 MB
   - Label: "Qualifikationen (Meisterbrief, Zertifikate, etc.)"
   - List view: Each file with name, size, remove button

4. **Referenzen** (References)
   - Type: Multiple file upload
   - Required: No
   - Max files: 5
   - Max size per file: 10 MB
   - Label: "Referenzschreiben"

**Upload UI:**
- Drag-and-drop zone: "Dateien hier ablegen oder klicken zum Auswählen"
- Accepted formats: "PDF, JPG, PNG (max. 10 MB pro Datei)"
- Progress bar during upload
- Success checkmark after upload

---

### Section 7: Interne Notizen (Internal Notes)

**Fields:**

1. **Notizen** (Notes)
   - Type: Rich text editor (Phase 2)
   - Type: Textarea (Phase 1)
   - Required: No
   - Min length: 0, Max length: 5000
   - Rows: 8
   - Placeholder: "Interne Notizen zu diesem Lieferanten (nur für internes Team sichtbar)..."
   - Character counter: "0 / 5000"
   - Help text: "Nicht für Lieferanten sichtbar"

2. **Account Manager** (Internal Owner)
   - Type: User select dropdown
   - Required: Yes
   - Filter: Role = INN
   - Default: Current user (if INN)
   - Label: "Zuständiger Account Manager (INN)"
   - Error: "Account Manager ist erforderlich"

---

## Form Layout

### Desktop (1440px)

```
┌──────────────────────────────────────────────────────────┐
│ [←] Lieferant erfassen                    [?] [Entwurf] │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─ Grundinformationen ──────────────────────────────┐  │
│  │ Firmenname *      [__________________________]    │  │
│  │ Rechtsform        [Rechtsform wählen... ▼]        │  │
│  │ USt-IdNr.         [DE_________]                    │  │
│  │ Steuernummer      [__________________________]    │  │
│  │                                                    │  │
│  │ Lieferanten-Typ * (⚪ Materiallieferant           │  │
│  │                    ⚪ Dienstleister               │  │
│  │                    ⦿ Subunternehmer)              │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ Kontaktdaten ────────────────────────────────────┐  │
│  │ E-Mail *          [__________________________]    │  │
│  │ Telefon *         [__________________________]    │  │
│  │ Mobil             [__________________________]    │  │
│  │ Website           [__________________________]    │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ Adresse ─────────────────────────────────────────┐  │
│  │ Straße *          [__________________________]    │  │
│  │ PLZ *             [_____]  Stadt * [___________]  │  │
│  │ Land *            [Deutschland ▼]                  │  │
│  │ ☐ Weitere Lieferadressen hinzufügen               │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ Leistungskategorien ─────────────────────────────┐  │
│  │ Hauptkategorien * (min. 1)                         │  │
│  │ ☐ Tischlerei    ☐ Metallbau   ☐ Elektrik          │  │
│  │ ☐ Sanitär       ☐ Heizung     ☐ Malerei           │  │
│  │ ... (12 more options)                              │  │
│  │                                                    │  │
│  │ Leistungsbeschreibung *                            │  │
│  │ [_____________________________________________]    │  │
│  │ [_____________________________________________]    │  │
│  │ 450 / 1000                                         │  │
│  │                                                    │  │
│  │ Arbeitsradius (km)  [___] km                       │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ Geschäftsbedingungen ────────────────────────────┐  │
│  │ Zahlungsmethode * [Rechnung ▼]                     │  │
│  │ Zahlungsziel *    [14][21][30][60][90] oder [__]  │  │
│  │ ☐ Skonto gewährt  [2]% bei [10] Tagen            │  │
│  │                                                    │  │
│  │ Mindestbestellwert [________] €                   │  │
│  │ Lieferzeit        [________] Tage                 │  │
│  │ Kreditlimit       [________] €                    │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ Dokumente ───────────────────────────────────────┐  │
│  │ Versicherungsnachweis * (Pflicht für Dienstleister)│  │
│  │ [📁 Datei hochladen oder ablegen]                  │  │
│  │                                                    │  │
│  │ Gewerbeanmeldung                                   │  │
│  │ [📁 Datei hochladen]                               │  │
│  │                                                    │  │
│  │ Qualifikationen (Meisterbrief, Zertifikate)        │  │
│  │ [📁 Mehrere Dateien hochladen]                     │  │
│  │                                                    │  │
│  │ Referenzschreiben                                  │  │
│  │ [📁 Mehrere Dateien hochladen]                     │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ Interne Notizen ─────────────────────────────────┐  │
│  │ Notizen (nicht für Lieferanten sichtbar)           │  │
│  │ [_____________________________________________]    │  │
│  │ [_____________________________________________]    │  │
│  │ 0 / 5000                                           │  │
│  │                                                    │  │
│  │ Account Manager * [Thomas Fischer (INN) ▼]        │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  [Abbrechen]          [Entwurf speichern]  [Zur Freigabe senden] │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

### Mobile (375px)

```
┌─────────────────────────────┐
│ [←] Lieferant erfassen [?]  │
├─────────────────────────────┤
│                             │
│ ▼ Grundinformationen        │
│ Firmenname *                │
│ [_______________________]   │
│                             │
│ Rechtsform                  │
│ [Rechtsform wählen... ▼]    │
│                             │
│ USt-IdNr.                   │
│ [DE_________]               │
│                             │
│ Lieferanten-Typ *           │
│ (⚪) Materiallieferant      │
│ (⚪) Dienstleister          │
│ (⦿) Subunternehmer         │
│ (⚪) Handwerker             │
│ (⚪) Logistik               │
│                             │
│ ▶ Kontaktdaten              │
│ ▶ Adresse                   │
│ ▶ Leistungskategorien       │
│ ▶ Geschäftsbedingungen      │
│ ▶ Dokumente                 │
│ ▶ Interne Notizen           │
│                             │
│ [Entwurf speichern]         │
│ [Zur Freigabe senden] ✓     │
│                             │
└─────────────────────────────┘
```

**Mobile Optimizations:**
- Collapsible sections (accordion) - only first section expanded by default
- Sticky save buttons at bottom
- One field per row (stacked)
- Quick select buttons for common values (payment terms)
- Camera icon for document upload (access device camera directly)

---

## Form Validation & Behavior

### Real-Time Validation

- **Field-level:** Validate on blur
- **Format checks:** Validate on input (VAT, ZIP, email)
- **Required fields:** Mark with red asterisk, highlight if empty on submit
- **Character counters:** Show remaining characters for text areas

### Save Behavior

**Save Draft:**
- Minimal validation (only required fields if filled)
- Status: 'Draft'
- Success toast: "Entwurf gespeichert"
- Redirect: Supplier list

**Submit for Approval:**
- Full validation (all required fields)
- Document checks: Insurance certificate required for service providers
- Status: 'PendingApproval'
- Notification: GF receives approval request
- Success toast: "Lieferant zur Freigabe gesendet"
- Redirect: Supplier detail view

### Duplicate Detection [Phase 2]

- On company name blur: Check for similar suppliers (fuzzy match)
- If found: Show warning modal:
  ```
  ⚠️ Ähnlicher Lieferant gefunden
  
  "Schreinerei Mueller GmbH" (München)
  Ähnlichkeit: 95%
  
  [Vorhandenen Lieferanten anzeigen]  [Trotzdem erstellen]
  ```

---

## shadcn/ui Components

```bash
npx shadcn-ui@latest add form input textarea select checkbox radio-group button label card
```

### Form Structure (react-hook-form)

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const supplierSchema = z.object({
  companyName: z.string().min(2).max(200),
  supplierType: z.enum(['material_supplier', 'service_provider', 'subcontractor', 'craftsman', 'logistics', 'mixed']),
  email: z.string().email(),
  phone: z.string().min(7).max(20),
  // ... all fields
});
```

---

## Accessibility

- **Keyboard Navigation:** Tab order follows visual layout
- **Labels:** All inputs have associated labels (id/for)
- **Error Announcements:** Screen reader announces validation errors
- **Required Fields:** Marked with asterisk and aria-required
- **Help Text:** aria-describedby links to help text

---

## Example Data

- **Company:** "Schreinerei Müller GmbH"
- **Type:** "Subunternehmer"
- **Email:** "info@schreinerei-mueller.de"
- **Phone:** "+49 (0) 89 1234567"
- **Address:** "Industriestraße 42, 80331 München, Deutschland"
- **Services:** ☑ Tischlerei, ☑ Möbel, ☑ Montage
- **Description:** "Spezialisiert auf hochwertige Ladeneinrichtungen aus Massivholz. 25 Jahre Erfahrung im Einzelhandel. Meisterbetrieb mit 8 Mitarbeitern."
- **Payment Terms:** "Rechnung, 30 Tage, 2% Skonto bei 10 Tagen"

---

**End of supplier-form.md**


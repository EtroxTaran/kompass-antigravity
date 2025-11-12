# Bulk Import Form - Figma Make Prompt

## Context & Purpose
- **Component Type**: Data Import Wizard
- **User Roles**: GF, PLAN (full access), ADM (own data only)
- **Usage Context**: Import customers, contacts from CSV/Excel
- **Business Value**: Efficient onboarding of existing customer data

## Design Requirements

### Visual Hierarchy
- **Multi-Step Wizard**: 1) Upload → 2) Map Fields → 3) Validate → 4) Import
- **Progress Indicator**: Clear step progress
- **Error Highlighting**: Red indicators for invalid rows
- **Success Summary**: Count of imported vs failed records

### Layout Structure
- Full-screen wizard or large dialog (1200px)
- Step indicator at top
- Main content area changes per step
- Navigation buttons at bottom (Back, Next, Import)

### shadcn/ui Components
- `Dialog` or full-page
- `Progress` for steps and import progress
- `Table` for data preview
- `Select` for field mapping
- `Alert` for errors and warnings

## Figma Make Prompt

Create a comprehensive bulk import wizard for KOMPASS, a German CRM application. Design a 4-step import process for uploading CSV/Excel files, mapping fields, validating data, and importing customers with error handling and German labels.

**Wizard Container:**
- Full-page or large dialog (1200px width)
- Header:
  - Title: "Kunden importieren" - 24px, bold
  - Close "×" button
  - Help link: "Importanleitung" (opens help doc)

**Progress Indicator (Top):**
- 4 steps shown as connected circles
- Steps:
  1. "Datei hochladen" - Circle with "1"
  2. "Felder zuordnen" - Circle with "2"
  3. "Daten validieren" - Circle with "3"
  4. "Importieren" - Circle with "4"
- Current step: Blue filled circle
- Completed steps: Blue with checkmark
- Upcoming steps: Gray outline
- Connecting lines: Blue (completed), gray (upcoming)

**Step 1: Datei hochladen (Upload File)**

**Upload Area:**
- Drag-and-drop zone: 600px × 300px
- Border: 2px dashed gray (#d1d5db)
- Border-radius: 8px
- Background: Light gray (#f9fafb)
- Hover: Blue border, light blue background
- Center content:
  - Icon: Upload cloud (64px, gray)
  - Text: "CSV- oder Excel-Datei hier ablegen" (16px, semibold)
  - Text: "oder" (gray)
  - Button: "Datei auswählen" (blue, outlined)
  - Help text: "Maximale Dateigröße: 10 MB | Formate: .csv, .xlsx"

**After File Selected:**
- File info card:
  - Icon: FileText (24px)
  - Filename: "customers.csv"
  - Size: "2.5 MB"
  - Rows: "500 Zeilen erkannt"
  - Remove button: Trash icon (red)
- Change file: "Andere Datei auswählen" button

**Template Download:**
- Link: "CSV-Vorlage herunterladen"
- Icon: Download
- Provides template with correct column headers
- Example columns: Firmenname, Umsatzsteuer-ID, Straße, PLZ, Stadt, etc.

**Footer:**
- Right buttons:
  - "Abbrechen" (secondary)
  - "Weiter" (primary, disabled until file selected)

**Step 2: Felder zuordnen (Map Fields)**

**Mapping Table:**
- Shows preview of data (first 5 rows)
- 3 columns:
  1. **CSV-Spalte** (Source Column): Shows original column names
  2. **Vorschau** (Preview): Shows sample data from that column
  3. **KOMPASS-Feld** (Target Field): Dropdown to map to system field

**Mapping Rows Example:**

| CSV-Spalte | Vorschau | KOMPASS-Feld |
|------------|----------|--------------|
| Company Name | Hofladen Müller GmbH | [Firmenname ▾] |
| VAT Number | DE123456789 | [Umsatzsteuer-ID ▾] |
| Street | Hauptstraße 15 | [Straße ▾] |
| Postal Code | 80331 | [PLZ ▾] |
| City | München | [Stadt ▾] |
| Email | info@example.de | [E-Mail ▾] |
| Phone | +49-89-1234567 | [Telefon ▾] |

**Auto-Mapping:**
- System auto-maps if column names match
- Green checkmark icon: Auto-mapped successfully
- Amber warning icon: Needs manual mapping
- Required fields highlighted: Red asterisk if not mapped
- Warning: "3 Pflichtfelder noch nicht zugeordnet"

**Required Fields Indicator:**
- List of required fields: "Firmenname", "Straße", "PLZ", "Stadt"
- Red if not mapped, green checkmark if mapped
- Cannot proceed until all required fields mapped

**Footer:**
- Left: "Zurück" (go back to upload)
- Right: "Abbrechen", "Weiter" (disabled until required fields mapped)

**Step 3: Daten validieren (Validate Data)**

**Validation Summary Card:**
- Large card at top showing results
- Icon: Checkmark (green) or AlertCircle (amber/red)
- Text: "450 von 500 Zeilen gültig" (90% success rate)
- Progress bar: Green portion (valid), red portion (invalid)
- Stats:
  - 450 Gültig (green text)
  - 50 Fehler (red text)
  - 20 Warnungen (amber text)

**Validation Table:**
- Shows all rows with validation status
- Columns:
  1. **Zeile** (Row): Row number
  2. **Status**: Icon (green check, red X, amber warning)
  3. **Firmenname**: Company name from CSV
  4. **Fehler/Warnungen**: Error or warning message
  5. **Aktionen**: "Bearbeiten" button

**Row States:**
1. **Valid (Green):**
   - Green checkmark icon
   - Example: Row 1 | ✓ | Hofladen Müller GmbH | - | -

2. **Error (Red):**
   - Red X icon
   - Error message: "Firmenname zu kurz (min. 2 Zeichen)"
   - Edit button: Opens inline editor
   - Example: Row 45 | ✗ | A | Firmenname zu kurz | [Bearbeiten]

3. **Warning (Amber):**
   - Amber warning icon
   - Warning message: "E-Mail-Format ungültig (wird übersprungen)"
   - Can import with warning (non-critical)
   - Example: Row 78 | ⚠ | REWE Köln | Ungültige E-Mail | -

**Filter Options:**
- Tabs: "Alle (500)" | "Gültig (450)" | "Fehler (50)" | "Warnungen (20)"
- Filter to show only rows with issues

**Inline Edit (Fix Errors):**
- Click "Bearbeiten" on error row
- Row expands to show editable fields
- Fix errors inline
- "Speichern" button: Re-validates row
- Updated validation status shows

**Options:**
- Checkbox: ☐ "Ungültige Zeilen überspringen"
  - If checked: Only valid rows imported
  - If unchecked: Import blocked until all errors fixed
- Checkbox: ☐ "Zeilen mit Warnungen importieren"
  - Default: Checked (warnings non-critical)

**Footer:**
- Left: "Zurück" (back to field mapping)
- Right: "Abbrechen", "Importieren" (primary blue)
  - "Importieren" shows count: "450 Kunden importieren"
  - Disabled if errors exist and skip unchecked

**Step 4: Importieren (Import)**

**Progress Display:**
- Large circular progress: 45% (center of screen)
- Text: "225 von 500 Kunden importiert (45%)"
- Linear progress bar below circle
- Time estimate: "Geschätzte verbleibende Zeit: 1 Minute"
- Status: "Wird importiert..." with spinner

**Import Actions:**
- "Abbrechen" button: Stops import (warning dialog first)
- Cancel warning: "Import abbrechen? Bereits importierte Daten bleiben erhalten."

**Completion State:**
- Icon: Large green checkmark (80px)
- Title: "Import abgeschlossen!"
- Summary:
  - "450 Kunden erfolgreich importiert" (green text, large)
  - "50 Zeilen übersprungen (Fehler)" (red text)
  - "20 Zeilen mit Warnungen importiert" (amber text)
- Download error report: "Fehlerprotokoll herunterladen" (CSV with failed rows)
- Buttons:
  - "Importierte Kunden anzeigen" (primary, blue)
  - "Weiteren Import starten" (secondary)
  - "Schließen" (tertiary)

**Error Report (Download):**
- CSV file: "import-errors-2024-11-15.csv"
- Columns: Row number, Company name, Error message
- Use for: Fixing errors offline and re-importing

**Duplicate Detection (During Import):**
- If potential duplicates found:
  - Pause import
  - Show duplicate comparison dialog
  - User chooses: "Überspringen" (skip), "Trotzdem importieren" (import anyway), "Zusammenführen" (merge)
  - Resume import after decision

**RBAC Import Restrictions:**
- ADM users: Can only import customers assigned to self
- "Inhaber" field auto-set to current user for ADM
- GF/PLAN: Can assign imported customers to any ADM user
- Setting: "Alle importierten Kunden zuweisen zu:" dropdown (select ADM user)

**Import History:**
- Link in header: "Frühere Importe anzeigen"
- Opens sheet with import history:
  - Date/time, filename, user, result (X succeeded, Y failed)
  - Download error report link for each

Design with clear progress indicators, helpful error messages, and quick error resolution.

## Interaction Patterns

### Import Wizard Flow
1. Upload file (drag/drop or select)
2. System parses CSV/Excel
3. Click "Weiter" → Map fields step
4. Auto-map recognized fields, manual map others
5. Click "Weiter" → Validate step
6. Review validation results, fix errors inline
7. Click "Importieren"
8. Progress screen shows import status
9. Completion screen shows summary
10. User views imported data or closes

### Error Handling
- Errors shown per row
- Click "Bearbeiten" to fix inline
- Re-validation immediate
- Continue when all fixed or skip enabled

### Duplicate Handling
- Pause at first duplicate
- Show comparison UI
- User decides action
- Apply decision to all duplicates or each individually

## German Labels & Content

### Steps
- **Datei hochladen**: Upload file
- **Felder zuordnen**: Map fields
- **Daten validieren**: Validate data
- **Importieren**: Import

### Status
- **Wird importiert...**: Importing...
- **Import abgeschlossen**: Import completed
- **X von Y importiert**: X of Y imported
- **Gültig**: Valid
- **Fehler**: Errors
- **Warnungen**: Warnings

### Buttons
- **Datei auswählen**: Select file
- **CSV-Vorlage herunterladen**: Download CSV template
- **Zurück**: Back
- **Weiter**: Next
- **Importieren**: Import
- **Fehlerprotokoll herunterladen**: Download error report
- **Importierte Kunden anzeigen**: View imported customers

### Errors
- **Pflichtfeld fehlt**: Required field missing
- **Ungültiges Format**: Invalid format
- **Zeile überspringen**: Skip row
- **Zeile bearbeiten**: Edit row

## Accessibility Requirements
- WCAG 2.1 AA compliance
- Wizard: role="dialog", aria-label="Import-Assistent Schritt X von 4"
- Progress: role="progressbar"
- Drag-drop: Keyboard alternative (file input button)
- Validation table: Proper table semantics
- Error messages: Associated with rows
- Success announcement: Screen reader alert

## Mobile Considerations
- Full-screen wizard on mobile
- Upload: Native file picker (no drag-drop)
- Field mapping: Simplified UI, one mapping at a time
- Validation: Card view instead of table
- Progress: Full-screen with large indicator
- File size limit lower on mobile (5 MB vs 10 MB)

## Example Data

**CSV Import:**
- File: "customers.csv"
- Rows: 500
- Valid: 450
- Errors: 50 (missing required fields, invalid formats)
- Warnings: 20 (invalid emails, will be skipped)

**Field Mapping:**
- "Company Name" → "Firmenname"
- "VAT" → "Umsatzsteuer-ID"
- "Street" → "Straße"
- "ZIP" → "PLZ"
- "City" → "Stadt"

**Sample Data:**
- Row 1: "Hofladen Müller GmbH", "DE123456789", "Hauptstraße 15", "80331", "München"
- Row 45: "A", "", "", "", "" (error: too short)

## Implementation Notes

### shadcn/ui Installation
```bash
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add table
npx shadcn-ui@latest add select
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add checkbox
```

### File Parsing
```typescript
// Using PapaParse for CSV
import Papa from 'papaparse';

Papa.parse(file, {
  header: true,
  complete: (results) => {
    setData(results.data);
    setColumns(results.meta.fields);
  }
});
```

### Validation
```typescript
// Validate each row against schema
const validationResults = data.map((row, index) => {
  const result = customerSchema.safeParse(row);
  return {
    rowIndex: index + 1,
    valid: result.success,
    errors: result.error?.issues || [],
    data: row
  };
});
```

### Component Dependencies
- CSV parser library (PapaParse)
- Excel parser (SheetJS/xlsx)
- Validation schemas from @kompass/shared
- Progress tracking during import
- Error report generator (CSV)
- Duplicate detection service

### Rich Text Fields Import
**Note:** Rich text editor fields (Beschreibung, Notizen, Bemerkungen) are imported as **plain text** from CSV/Excel files. Users can add formatting after import using the rich text editor in the entity forms.

**Import Behavior:**
- Plain text from CSV column is stored as-is (no HTML tags)
- After import, users can edit the field using rich text editor to add formatting
- Example: CSV column "Kundenbeschreibung" → Imported as plain text → User opens Customer form → Edits "Interne Notizen" field with rich text editor → Adds Bold, Lists, etc.

**CSV Column Mapping:**
- `Kundenbeschreibung` → Customer `interne_notizen` (plain text)
- `Kontaktnotizen` → Contact `interne_notizen` (plain text)
- `Standortbeschreibung` → Location `beschreibung` (plain text)
- `Opportunity-Details` → Opportunity `beschreibung` (plain text)

**Future Enhancement:** Support HTML import from Excel files with rich text cells (Phase 2)

### State Management
- Current wizard step
- Uploaded file data
- Field mappings (CSV column → system field)
- Validation results
- Import progress
- Error/success counts
- Duplicate handling decisions


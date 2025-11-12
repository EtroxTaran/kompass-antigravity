# Data Export & Import - Figma Make Prompt

## Context & Purpose
- **Component Type**: Bulk data import/export interface
- **User Roles**: GF/BUCH (export), PLAN/ADM/GF (import)
- **Usage Context**: Migrate data, backup, DATEV integration, bulk customer import, contact protocol import from Word documents
- **Key Features**: CSV/Excel/Word support, field mapping, validation, date parsing with fallback, progress tracking, duplicate detection

## Figma Make Prompt

Create data export and import interfaces for KOMPASS with format selection, field mapping, validation, progress tracking, error handling, DATEV integration, Word document import with table extraction and date parsing, and German labels.

**Data Export Interface:**

**Export Dialog (Modal):**
- Title: "Daten exportieren" (28px, bold)
- Icon: Download cloud

**Step 1: Export Type**
- Select entity: Radio buttons
  - ◉ Kunden
  - ○ Kontakte
  - ○ Opportunities
  - ○ Projekte
  - ○ Rechnungen
- Batch: "Alle auswählen" checkbox

**Step 2: Date Range**
- Preset: Chips "Heute", "Diese Woche", "Dieser Monat", "Dieses Quartal", "Dieses Jahr", "Alle"
- Custom: Date pickers "Von/Bis"

**Step 3: Format**
- Dropdown: "Format wählen"
  - CSV (Standard)
  - Excel (.xlsx)
  - JSON (API)
  - DATEV (GoBD-konform)

**Step 4: Fields**
- Section: "Felder auswählen"
- Default: "Alle Felder" (checkbox)
- Custom: Multi-select list with checkboxes
  - ☑ Firmenname
  - ☑ VAT-Nummer
  - ☑ E-Mail
  - ☐ Kreditlimit (optional, sensitive)
  - ☐ Interne Notizen (optional)
- Info: "32 von 45 Feldern ausgewählt"

**Step 5: Options**
- Toggle: "Kopfzeile einschließen" (default: ON)
- Toggle: "Gelöschte Einträge einschließen" (default: OFF)
- Toggle: "Audit-Trail einschließen" (for GoBD) (default: OFF if not DATEV)
- Encoding: Dropdown "UTF-8" (default), "ISO-8859-1"

**Preview:**
- Card: "Vorschau (erste 5 Zeilen)"
- Table: Shows sample rows
- Columns: Selected fields
- Rows: First 5 customers

**Actions:**
- Primary: "Exportieren" (large blue button)
- Secondary: "Abbrechen" (gray)

**Export Progress:**
- Progress bar: "Exportiere 128 von 256 Kunden..." (blue)
- Percentage: "50%"
- Cancel: "Abbrechen" button

**Success:**
- Toast: "Export abgeschlossen - 256 Kunden exportiert" (green)
- File: "Kunden_Export_2024-11-15.csv"
- Actions: "Herunterladen" (download icon), "E-Mail senden"

**DATEV Export (Special):**
- Checkbox: "GoBD-konform exportieren"
- Includes: Hashes, signatures, audit trail
- Format: DATEV CSV standard
- Filename: "DATEV_Rechnungen_Q4_2024.csv"
- Verification: Shows hash of export file

**Data Import Interface:**

**Import Dialog (Modal or Full Page):**
- Title: "Daten importieren" (28px, bold)
- Icon: Upload cloud

**Step 1: File Upload**
- Drag-drop area: "CSV-, Excel- oder Word-Datei hier ablegen"
- Or: "Datei auswählen" button
- Supported: CSV, XLSX, JSON, DOCX, DOC
- Max size: "10 MB"
- File info: Shows filename, size, rows count
  - Example: "kunden_import.csv, 2.3 MB, 512 Zeilen"
  - Example: "protocols.docx, 1.5 MB, 150 Protokolle"

**Step 2: Import Type**
- Select entity: Dropdown
  - Kunden (Excel/CSV)
  - Kontakte (Excel/CSV)
  - Standorte (Excel/CSV)
  - Kontaktprotokolle (Word)
- Import mode: Radio buttons
  - ◉ Neue Einträge erstellen
  - ○ Bestehende aktualisieren
  - ○ Beide (Upsert)

**Step 3: Field Mapping**
- Section: "Felder zuordnen"
- Table: 3 columns
  - CSV-Spalte | → | KOMPASS-Feld
  
**Example Mapping:**
```
CSV-Spalte          →  KOMPASS-Feld
company_name        →  Firmenname (erforderlich)
vat_number          →  VAT-Nummer
email               →  E-Mail
phone               →  Telefon
address_street      →  Adresse > Straße
address_zip         →  Adresse > PLZ
address_city        →  Adresse > Stadt
```

**Mapping Controls:**
- Auto-detect: "Automatisch zuordnen" button (AI-assisted)
- Manual: Dropdown for each CSV column
- Required fields: Red asterisk * (must map)
- Optional fields: Gray (can skip)
- Unmapped: "Ignorieren" (not imported)

**Step 4: Validation**
- Button: "Vorschau & Validierung"
- Shows: Validation results table

**Validation Results:**
- Columns: Zeile, Status, Feld, Fehler, Wert
- Rows: Each row from CSV
- Status icons:
  - ✅ Gültig (green)
  - ⚠ Warnung (amber)
  - ❌ Fehler (red)

**Example Validation Errors:**
```
Zeile | Status | Feld         | Fehler                           | Wert
2     | ❌     | VAT-Nummer   | Ungültiges Format (DE fehlt)     | 123456789
5     | ⚠      | E-Mail       | Ungültige E-Mail                 | test@
12    | ❌     | Firmenname   | Pflichtfeld fehlt                | (leer)
```

**Validation Summary:**
- Card: "Validierungsergebnis"
- Gültig: "487 Zeilen ✅" (green)
- Warnungen: "15 Zeilen ⚠" (amber)
- Fehler: "10 Zeilen ❌" (red)

**Error Handling Options:**
- Radio buttons:
  - ◉ "Nur gültige Zeilen importieren"
  - ○ "Import abbrechen bei Fehlern"
  - ○ "Fehlerhafte Zeilen überspringen und protokollieren"

**Step 5: Duplicate Check**
- Toggle: "Duplikatsprüfung aktivieren"
- Matching field: Dropdown "VAT-Nummer" or "E-Mail"
- Action if duplicate:
  - ◉ "Überspringen"
  - ○ "Aktualisieren"
  - ○ "Nachfragen"

**Duplicate Detection Results:**
- Shows: Potential duplicates
- Each: CSV row vs. Existing KOMPASS entry
- Actions:
  - "Überspringen" (skip import)
  - "Importieren als neu" (create duplicate)
  - "Aktualisieren" (merge/update existing)

**Step 6: Confirmation**
- Summary card:
  - Zu importieren: "487 Kunden"
  - Übersprungen (Fehler): "10 Kunden"
  - Übersprungen (Duplikate): "15 Kunden"
  - Gesamt: "512 Zeilen"

**Actions:**
- Primary: "Import starten" (large blue button)
- Secondary: "Abbrechen" (gray)
- Tertiary: "Fehler exportieren" (download error CSV)

**Import Progress:**
- Progress bar: "Importiere 128 von 487 Kunden..." (blue)
- Percentage: "26%"
- ETA: "Verbleibende Zeit: ~2 Minuten"
- Cancel: "Abbrechen" button

**Import Results:**
- Dialog: "Import abgeschlossen"
- Icon: Checkmark (green, large)
- Summary:
  - Erfolgreich importiert: "487 Kunden ✅"
  - Übersprungen (Fehler): "10 Kunden ❌"
  - Übersprungen (Duplikate): "15 Kunden ⚠"
- Actions:
  - "Zu Kunden-Liste" (primary button)
  - "Fehlerprotokoll herunterladen" (link)
  - "Schließen" (secondary)

**Error Log Export:**
- Filename: "Import_Errors_2024-11-15.csv"
- Columns: Zeile, Feld, Fehler, Wert, Grund
- Opens in Excel: Users can fix and re-import

**Templates:**
- Section: "Vorlagen"
- Download templates: "CSV-Vorlage herunterladen"
- Example files: "Kunden_Vorlage.csv", "Kontakte_Vorlage.xlsx"
- Includes: Header row, example data (2 rows)

**Contact Protocol Import (Word Documents):**

**Import Wizard (Full Page or Modal):**
- Title: "Kontaktprotokolle importieren" (28px, bold, margin-bottom: 8px)
- Subtitle: "Importieren Sie Kontaktprotokolle aus Word-Dokumenten" (16px, gray, margin-bottom: 24px)
- Progress indicator: Step indicator at top (horizontal stepper)
  - Steps: 7 steps total
    1. "Datei hochladen" (with upload icon)
    2. "Tabelle auswählen" (with table icon)
    3. "Spalten zuordnen" (with columns icon)
    4. "Daten parsen" (with calendar icon)
    5. "Kunden zuordnen" (with user icon)
    6. "Validierung" (with checkmark icon)
    7. "Bestätigung" (with confirm icon)
  - Active step: Blue background (#3b82f6), white text, blue border (2px solid #3b82f6)
  - Completed step: Green background (#10b981), white text, checkmark icon
  - Pending step: Gray background (#e5e7eb), gray text (#6b7280)
  - Current step: Highlighted with blue border (2px solid #3b82f6) and blue text (#3b82f6)
  - Connector lines: Gray lines between steps (#e5e7eb)
  - Responsive: On mobile, show condensed version with step numbers only
- Navigation: Bottom of wizard
  - "Zurück" button (secondary, gray, outlined, left)
    - Disabled: On first step
    - Action: Navigate to previous step
  - "Weiter" button (primary, blue, right)
    - Disabled: If current step not completed
    - Action: Navigate to next step (validates current step first)
  - "Abbrechen" button (tertiary, gray, text, far right)
    - Confirmation dialog: "Möchten Sie den Import abbrechen? Alle eingegebenen Daten gehen verloren."
      - Options: "Abbrechen" (secondary), "Import beenden" (primary, red)

**Step 1: File Upload**
- Section: "Datei hochladen" (24px, bold, margin-bottom: 16px)
- Drag-drop area: Large drop zone (min-height: 200px)
  - Border: 2px dashed #d1d5db (gray-300)
  - Border-radius: 8px (rounded-lg)
  - Background: #f9fafb (gray-50)
  - Hover: Border changes to blue (#3b82f6), background changes to #eff6ff (blue-50)
  - Active (dragging): Border changes to green (#10b981), background changes to #d1fae5 (green-100)
- Drag-drop content:
  - Icon: Upload cloud (64px, gray, #6b7280)
  - Text: "Word-Dokument hier ablegen" (18px, bold, gray, #6b7280)
  - Or: "oder" (14px, gray, margin: 8px 0)
  - Button: "Datei auswählen" (primary button, blue)
- File input: Hidden file input (triggered by button or drop)
  - Accept: ".docx,.doc" (Word documents only)
  - Multiple: false (single file only)
- Supported formats info: Below drag-drop area
  - Text: "Unterstützte Formate: DOCX, DOC" (14px, gray)
  - Max size: "Maximale Dateigröße: 10 MB" (14px, gray)
- File info card: Shows after file upload
  - Card: White background, border: 1px solid #e5e7eb, border-radius: 8px, padding: 16px
  - Icon: File (left, 32px, blue, #3b82f6)
  - File name: "protocols.docx" (16px, bold, margin-left: 12px)
  - File size: "1.5 MB" (14px, gray, margin-left: 12px)
  - Table count: "1 Tabelle gefunden" (14px, gray, margin-left: 12px)
  - Row count: "150 Zeilen" (14px, gray, margin-left: 12px)
  - Remove button: "Entfernen" (small, red, outlined, top right)
- Loading state: Show spinner while uploading
  - Spinner: Centered, blue, #3b82f6
  - Text: "Datei wird hochgeladen..." (14px, gray)
- Error state: Show error message if upload fails
  - Icon: Alert circle (red, #ef4444)
  - Message: "Fehler beim Hochladen der Datei. Bitte versuchen Sie es erneut." (red text, #ef4444)
  - Action: "Erneut versuchen" button (primary, blue)

**Step 2: Table Selection**
- Section: "Tabelle auswählen"
- Loading state: Show spinner while extracting tables from Word document
- If multiple tables: Dropdown "Tabelle 1", "Tabelle 2", etc.
  - Shows table count: "3 Tabellen gefunden"
  - Preview: Shows first 3 rows of selected table in a preview card
  - Table info: "Tabelle 1: 150 Zeilen, 3 Spalten" (gray text, 14px)
- If single table: Auto-select table 1, show preview directly
- Preview card:
  - Border: 1px solid #e5e7eb (gray-200)
  - Padding: 16px
  - Border-radius: 8px (rounded-lg)
  - Background: #ffffff (white)
  - Table preview: Shows first 3 rows with headers
  - Max-height: 200px, scrollable if more rows
- Error state: If no tables found, show error message
  - Icon: Alert circle (red)
  - Message: "Keine Tabellen im Word-Dokument gefunden. Bitte überprüfen Sie das Dokument."
  - Action: "Datei erneut auswählen" button

**Step 3: Column Mapping**
- Section: "Spalten zuordnen" (24px, bold, margin-bottom: 16px)
- Auto-detect button: "Automatisch zuordnen" (primary button, blue)
  - Icon: Sparkles (left of text)
  - Position: Top right of mapping table
  - Loading state: Show spinner while detecting
  - Success state: Show checkmark icon after detection
- Mapping table: 3 columns, striped rows
  - Word-Spalte (header, 16px, bold) | → (arrow icon, gray) | KOMPASS-Feld (header, 16px, bold)
  - Border: 1px solid #e5e7eb (gray-200)
  - Border-radius: 8px (rounded-lg)
  - Background: #ffffff (white)
- Required columns (highlighted with red border-left: 4px solid #ef4444):
  - Date column: "Datum" (required, red asterisk *, error if not mapped)
  - Note column: "Notiz" (required, red asterisk *, error if not mapped)
  - Action column: "Aktion" (optional, gray text, no asterisk)
- Manual mapping: Dropdown for each Word column
  - Dropdown: Shows all available KOMPASS fields
  - Search: Typeahead search in dropdown
  - Grouped: Fields grouped by category (e.g., "Protokoll", "Kunde", "Kontakt")
  - Placeholder: "Feld auswählen..." (gray text)
  - Selected: Blue background (#3b82f6), white text
- Required fields indicator:
  - Red asterisk * (color: #ef4444, 14px)
  - Tooltip on hover: "Pflichtfeld - muss zugeordnet werden"
- Optional fields indicator:
  - Gray text (#6b7280)
  - No asterisk
- Unmapped columns: Show warning badge
  - Badge: "Nicht zugeordnet" (amber background, #f59e0b)
  - Action: "Ignorieren" button (gray, small)

**Example Mapping Table:**
```
┌─────────────────┬───┬─────────────────────────────────────┐
│ Word-Spalte     │ → │ KOMPASS-Feld                        │
├─────────────────┼───┼─────────────────────────────────────┤
│ Date *          │ → │ Datum (erforderlich) ✅            │
│ Note *          │ → │ Notiz (erforderlich) ✅            │
│ Action          │ → │ Aktion (optional) ✅                │
│ Custom Field    │ → │ (Nicht zugeordnet) ⚠️              │
└─────────────────┴───┴─────────────────────────────────────┘
```

**Mapping Validation:**
- Real-time validation: Show error if required fields not mapped
- Error message: "Bitte ordnen Sie alle erforderlichen Felder zu" (red text, below table)
- Success state: All required fields mapped, show checkmark icon

**Step 4: Date Parsing**
- Section: "Datumsparsing" (24px, bold, margin-bottom: 16px)
- Info text: "Das System versucht, Datumsformate automatisch zu erkennen. Bei fehlgeschlagenem Parsing können Sie das Datum manuell korrigieren." (gray text, 14px, margin-bottom: 16px)
- Button: "Daten parsen" (primary button, blue)
  - Icon: Calendar (left of text)
  - Loading state: Show spinner while parsing
  - Disabled: If no dates to parse
- Parsing progress: Show progress bar during parsing
  - Progress bar: Blue, animated
  - Text: "Parse 70 von 150 Daten..." (14px, gray)
  - Percentage: "47%"
- Date parsing results table: Scrollable table with all results
  - Columns: Zeile, Originalwert, Parsed Wert, Format, Status, Aktion
  - Max-height: 400px, scrollable
  - Border: 1px solid #e5e7eb (gray-200)
  - Border-radius: 8px (rounded-lg)
  - Striped rows: Alternate background (#f9fafb, #ffffff)
- Status icons (16px, left-aligned):
  - ✅ Erfolgreich geparst (green, #10b981)
    - Tooltip: "Datum erfolgreich erkannt"
  - ⚠️ Warnung (amber, #f59e0b) - Date in future or ambiguous
    - Tooltip: "Datum erkannt, aber möglicherweise falsch (z.B. in der Zukunft)"
  - ❌ Fehler (red, #ef4444) - Cannot parse, requires manual entry
    - Tooltip: "Datum konnte nicht erkannt werden - manuelle Eingabe erforderlich"
- Confidence indicator (for successful parsing):
  - High confidence (≥0.95): Green checkmark, no warning
  - Medium confidence (0.80-0.94): Amber warning icon
  - Low confidence (<0.80): Red error icon, suggest manual review
- Format column: Shows detected format
  - Examples: "YYYY-MM-DD", "DD.MM.YY", "DD MMM YY", "DDMMYYYY"
  - Unknown: "(unbekannt)" (gray text, italic)
- Action column: For failed dates, show "Korrigieren" button
  - Button: Small, gray, outlined
  - On click: Opens date correction dialog

**Example Date Parsing Table:**
```
┌──────┬──────────────┬──────────────┬──────────────┬────────┬──────────────┐
│ Zeile│ Originalwert │ Parsed Wert  │ Format       │ Status │ Aktion       │
├──────┼──────────────┼──────────────┼──────────────┼────────┼──────────────┤
│ 1    │ 2024-01-15   │ 15.01.2024   │ YYYY-MM-DD   │ ✅     │              │
│ 2    │ 15.01.24     │ 15.01.2024   │ DD.MM.YY     │ ✅     │              │
│ 3    │ 15 Jan 24    │ 15.01.2024   │ DD MMM YY    │ ✅     │              │
│ 4    │ invalid-date │ (leer)       │ (unbekannt)  │ ❌     │ [Korrigieren]│
│ 5    │ 2026-01-15   │ 15.01.2026   │ YYYY-MM-DD   │ ⚠️     │ [Überprüfen] │
└──────┴──────────────┴──────────────┴──────────────┴────────┴──────────────┘
```

**Parsing Summary Card:**
- Card: White background, border: 1px solid #e5e7eb, border-radius: 8px, padding: 16px
- Grid: 3 columns
  - Erfolgreich: "140 Datumsangaben ✅" (green text, #10b981)
  - Warnungen: "5 Datumsangaben ⚠️" (amber text, #f59e0b)
  - Fehler: "10 Datumsangaben ❌" (red text, #ef4444)
- Total: "Gesamt: 150 Datumsangaben" (gray text, 14px)
- Action: "Alle Fehler korrigieren" button (if errors exist)
  - Button: Secondary, outlined, gray
  - Opens bulk correction dialog

**Manual Date Correction:**
- For failed dates: Show date picker
- Original value: Display original date string
- Parsing attempts: Show what system tried to parse
- Format hint: Show example formats (e.g., "DD.MM.YYYY")
- Apply to all: Option to apply same correction to similar dates
- Date picker: User selects correct date from calendar
- Text input: User can type date in known format

**Date Correction UI:**
- Dialog: Modal dialog, centered, max-width: 500px
- Title: "Datum korrigieren" (24px, bold, margin-bottom: 8px)
- Original value display:
  - Label: "Originalwert:" (14px, gray)
  - Value: "invalid-date" (16px, bold, #1f2937)
  - Background: #f3f4f6 (gray-100), padding: 12px, border-radius: 6px
- Parsing attempts display (if any):
  - Label: "Parsing-Versuche:" (14px, gray)
  - List: Shows what system tried to parse
    - "YYYY-MM-DD: Fehlgeschlagen"
    - "DD.MM.YY: Fehlgeschlagen"
    - "DD MMM YY: Fehlgeschlagen"
  - Background: #fef3c7 (amber-100), padding: 12px, border-radius: 6px
- Date picker: Calendar widget (shadcn/ui DatePicker component)
  - Default: Today's date
  - Locale: de-DE (German)
  - Format: DD.MM.YYYY
  - Min date: 1900-01-01 (reasonable minimum)
  - Max date: Today + 30 days (allow future dates with warning)
- Text input alternative: User can type date directly
  - Input: Text field with placeholder "DD.MM.YYYY (z.B. 15.01.2024)"
  - Validation: Real-time validation as user types
  - Error state: Red border if invalid format
  - Success state: Green border if valid format
- Format hint: "Format: DD.MM.YYYY (z.B. 15.01.2024)" (gray text, 12px, below input)
- Suggested formats: Shows common formats user might have meant
  - Examples: "Mögliche Formate: DD.MM.YYYY, YYYY-MM-DD, DD MMM YY"
  - Clickable: User can click to apply suggested format
- Actions (footer, right-aligned):
  - "Abbrechen" (secondary button, gray, outlined)
  - "Auf alle ähnlichen anwenden" (secondary button, gray, outlined)
    - Tooltip: "Wendet diese Korrektur auf alle ähnlichen Datumsangaben an"
    - Confirmation dialog: "Möchten Sie diese Korrektur auf 5 ähnliche Datumsangaben anwenden?"
  - "Übernehmen" (primary button, blue)
    - Disabled: If date is invalid or not selected
    - Loading state: Show spinner while saving
- Success feedback: Toast notification after correction
  - Toast: "Datum korrigiert: 15.01.2024" (green, checkmark icon)
  - Auto-dismiss: After 3 seconds

**Step 5: Customer Assignment**
- Section: "Kunden zuordnen" (24px, bold, margin-bottom: 16px)
- Info text: "Ordnen Sie jedem Protokoll einen Kunden zu. Das System kann versuchen, Kunden automatisch aus der Notiz zu erkennen." (gray text, 14px, margin-bottom: 16px)
- Assignment mode: Radio button group
  - ◉ "Alle Protokolle einem Kunden zuordnen" (default)
  - ○ "Kunden pro Zeile zuordnen"
- Single customer mode (when "Alle Protokolle einem Kunden zuordnen" selected):
  - Dropdown: "Kunde auswählen" (required, red asterisk *)
    - Search: Typeahead search in dropdown
    - Placeholder: "Kunde suchen..." (gray text)
    - Grouped: Customers grouped by rating (A, B, C)
    - Selected: Shows customer name and rating badge
    - Example: "Hofladen Müller GmbH" (badge: "A")
  - Auto-match toggle: "Automatisch Kunden aus Notiz erkennen" (optional)
    - Toggle: Switch component (blue when enabled)
    - Tooltip: "Versucht, Kunden automatisch aus der Notiz-Spalte zu erkennen"
    - Loading state: Show spinner while matching
    - Success state: Show matched count "45 von 150 Protokollen zugeordnet"
- Multiple customers mode (when "Kunden pro Zeile zuordnen" selected):
  - Table: Scrollable table with columns: Zeile, Notiz (preview), Kunde, Status
    - Max-height: 400px, scrollable
    - Border: 1px solid #e5e7eb (gray-200)
    - Border-radius: 8px (rounded-lg)
    - Striped rows: Alternate background (#f9fafb, #ffffff)
  - Note preview: Shows first 50 characters of note
    - Truncated: "..." if longer than 50 characters
    - Full text: Tooltip on hover shows full note
  - Customer dropdown: For each row, shows customer selection dropdown
    - Search: Typeahead search
    - Placeholder: "Kunde auswählen..." (gray text)
    - Selected: Shows customer name
    - Auto-matched: Shows "(auto-zugeordnet)" badge (green, small)
  - Status column: Shows assignment status
    - ✅ Zugeordnet (green, checkmark icon)
    - ⚠️ Auto-zugeordnet (amber, checkmark icon with "A" badge)
    - ❌ Nicht zugeordnet (red, X icon)
  - Bulk actions: Top of table
    - "Alle automatisch zuordnen" button (primary, blue)
    - "Alle zuordnen zu..." dropdown (secondary, gray)
      - Shows customer list
      - Applies selected customer to all unassigned rows
- Auto-match feedback: Shows matching results
  - Card: "Automatische Zuordnung" (white background, border: 1px solid #e5e7eb)
  - Summary:
    - Erfolgreich zugeordnet: "45 Protokolle ✅" (green text)
    - Nicht zugeordnet: "105 Protokolle ❌" (red text)
  - Matched rows: Highlighted with green background (#d1fae5)
  - Unmatched rows: Highlighted with red background (#fee2e2)
  - Action: "Nicht zugeordnete Protokolle manuell zuordnen" button (if unmatched rows exist)

**Customer Assignment Example Table:**
```
┌──────┬────────────────────────────────────────┬──────────────────────────────┬──────────┐
│ Zeile│ Notiz (Vorschau)                       │ Kunde                        │ Status   │
├──────┼────────────────────────────────────────┼──────────────────────────────┼──────────┤
│ 1    │ Customer visit - Hofladen Müller...    │ Hofladen Müller GmbH (A) ✅ │ ✅ Auto  │
│ 2    │ Phone call - REWE Store München...     │ REWE Store München (B) ✅    │ ✅ Auto  │
│ 3    │ Email sent - discussed new project...  │ [Kunde auswählen...]        │ ❌       │
└──────┴────────────────────────────────────────┴──────────────────────────────┴──────────┘
```

**Customer Assignment Validation:**
- Real-time validation: Show error if required customer not assigned
- Error message: "Bitte ordnen Sie allen Protokollen einen Kunden zu" (red text, below table)
- Success state: All protocols assigned, show checkmark icon
- Warning: If auto-match confidence is low, show warning badge
  - Badge: "Niedrige Zuordnungs-Confidence" (amber, #f59e0b)
  - Action: "Manuell überprüfen" button

**Step 6: Validation**
- Section: "Validierung" (24px, bold, margin-bottom: 16px)
- Button: "Vorschau & Validierung" (primary button, blue)
  - Icon: CheckCircle (left of text)
  - Loading state: Show spinner while validating
  - Disabled: If previous steps not completed
- Validation progress: Show progress bar during validation
  - Progress bar: Blue, animated
  - Text: "Validiere 70 von 150 Protokolle..." (14px, gray)
  - Percentage: "47%"
- Validation results table: Scrollable table with all validation results
  - Columns: Zeile, Status, Feld, Fehler, Wert, Aktion
  - Max-height: 400px, scrollable
  - Border: 1px solid #e5e7eb (gray-200)
  - Border-radius: 8px (rounded-lg)
  - Striped rows: Alternate background (#f9fafb, #ffffff)
  - Sortable: Click column header to sort
  - Filterable: Filter by status (Gültig, Warnung, Fehler)
- Status icons (16px, left-aligned):
  - ✅ Gültig (green, #10b981)
    - Tooltip: "Protokoll ist gültig und kann importiert werden"
  - ⚠️ Warnung (amber, #f59e0b)
    - Tooltip: "Protokoll hat Warnungen, kann aber importiert werden"
  - ❌ Fehler (red, #ef4444)
    - Tooltip: "Protokoll hat Fehler und kann nicht importiert werden"
- Error details: Expandable row to show error details
  - Click row: Expands to show full error message
  - Error message: Red text, 14px, italic
  - Suggested fix: Gray text, 12px, shows suggested value if available
- Action column: For errors, show "Korrigieren" button
  - Button: Small, gray, outlined
  - On click: Opens correction dialog for that field
- Filter buttons: Above table
  - "Alle" (default, active: blue background)
  - "Gültig" (green text, shows only valid rows)
  - "Warnungen" (amber text, shows only warning rows)
  - "Fehler" (red text, shows only error rows)

**Example Validation Table:**
```
┌──────┬────────┬──────────┬──────────────────────────────┬──────────────────────┬──────────┐
│ Zeile│ Status │ Feld     │ Fehler                       │ Wert                 │ Aktion   │
├──────┼────────┼──────────┼──────────────────────────────┼──────────────────────┼──────────┤
│ 1    │ ✅     │ -        │ -                            │ -                    │ -        │
│ 25   │ ❌     │ Datum    │ Datum fehlt                  │ (leer)               │ [Korr.]  │
│ 30   │ ❌     │ Notiz    │ Notiz fehlt                  │ (leer)               │ [Korr.]  │
│ 35   │ ❌     │ Kunde    │ Kunde fehlt                  │ (leer)               │ [Korr.]  │
│ 40   │ ⚠️     │ Datum    │ Datum liegt in der Zukunft   │ 2026-01-15           │ [Überp.] │
└──────┴────────┴──────────┴──────────────────────────────┴──────────────────────┴──────────┘
```

**Validation Summary Card:**
- Card: White background, border: 1px solid #e5e7eb, border-radius: 8px, padding: 16px
- Grid: 3 columns with icons and counts
  - Gültig: "140 Protokolle ✅" (green text, #10b981, checkmark icon)
  - Warnungen: "5 Protokolle ⚠️" (amber text, #f59e0b, warning icon)
  - Fehler: "10 Protokolle ❌" (red text, #ef4444, error icon)
- Total: "Gesamt: 150 Protokolle" (gray text, 14px, below grid)
- Actions: Below summary
  - "Alle Fehler korrigieren" button (if errors exist, primary, blue)
  - "Fehler exportieren" button (if errors exist, secondary, gray, outlined)
    - Downloads CSV file with all errors
    - Filename: "Protokoll_Import_Fehler_2025-01-27.csv"
- Error handling options: Radio button group
  - ◉ "Nur gültige Protokolle importieren" (default)
  - ○ "Import abbrechen bei Fehlern"
  - ○ "Fehlerhafte Protokolle überspringen und protokollieren"

**Step 7: Confirmation**
- Section: "Import bestätigen" (24px, bold, margin-bottom: 16px)
- Summary card: White background, border: 1px solid #e5e7eb, border-radius: 8px, padding: 24px
  - Title: "Import-Zusammenfassung" (20px, bold, margin-bottom: 16px)
  - Grid: 2 columns
    - Left column: Labels (gray text, 14px)
    - Right column: Values (black text, 16px, bold)
  - Rows:
    - Zu importieren: "140 Protokolle" (green text, #10b981, checkmark icon)
    - Übersprungen (Fehler): "10 Protokolle" (red text, #ef4444, X icon)
    - Übersprungen (Warnungen): "0 Protokolle" (amber text, #f59e0b, warning icon)
    - Gesamt: "150 Zeilen" (gray text, #6b7280)
  - Divider: Horizontal line (1px solid #e5e7eb) between rows
  - Warning: If errors exist, show warning banner
    - Background: #fef3c7 (amber-100), border: 1px solid #f59e0b, padding: 12px
    - Icon: Alert triangle (amber, #f59e0b)
    - Message: "10 Protokolle werden übersprungen. Sie können die Fehler exportieren und später korrigieren."
- Import options: Expandable section "Import-Optionen"
  - Default user: Dropdown "Standard-Benutzer" (required)
    - Options: Current user (default), or select different user
    - Tooltip: "Benutzer, der als Ersteller der importierten Protokolle gespeichert wird"
  - Default protocol type: Dropdown "Standard-Protokolltyp" (required)
    - Options: "Besuch" (default), "Anruf", "E-Mail", "Meeting", "Sonstiges"
  - Default contact: Dropdown "Standard-Kontakt" (optional)
    - Options: "Kein Kontakt" (default), or select contact
    - Tooltip: "Optional: Kontakt, der den importierten Protokollen zugeordnet wird"
- Actions (footer, right-aligned):
  - "Abbrechen" (secondary button, gray, outlined)
  - "Fehler exportieren" (tertiary button, gray, outlined, if errors exist)
    - Downloads CSV file with all errors
    - Filename: "Protokoll_Import_Fehler_2025-01-27.csv"
  - "Import starten" (primary button, blue, large)
    - Icon: Upload (left of text)
    - Disabled: If no valid protocols to import
    - Loading state: Show spinner while importing
    - Confirmation dialog: "Möchten Sie 140 Protokolle importieren?" (if large import)
      - Options: "Abbrechen" (secondary), "Importieren" (primary)

**Import Progress:**
- Modal: Full-screen overlay with progress indicator
- Background: Semi-transparent black (#000000, opacity: 0.5)
- Card: White background, centered, max-width: 500px, padding: 24px
- Title: "Import läuft..." (20px, bold, margin-bottom: 16px)
- Progress bar: Animated progress bar (blue, #3b82f6)
  - Height: 8px
  - Border-radius: 4px
  - Background: #e5e7eb (gray-200)
  - Fill: Blue, animated from left to right
- Progress text: "Importiere 70 von 140 Protokollen..." (16px, gray, margin-top: 8px)
- Percentage: "50%" (20px, bold, blue, #3b82f6)
- ETA: "Verbleibende Zeit: ~1 Minute" (14px, gray, margin-top: 4px)
- Current action: "Protokoll 70 wird importiert..." (14px, gray, italic)
- Cancel button: "Abbrechen" (secondary button, gray, outlined, bottom of card)
  - Confirmation dialog: "Möchten Sie den Import abbrechen? Bereits importierte Protokolle bleiben erhalten."
    - Options: "Weiter importieren" (primary), "Abbrechen" (secondary)

**Import Results:**
- Dialog: Modal dialog, centered, max-width: 600px, padding: 24px
- Icon: Checkmark (green, #10b981, 64px, centered, margin-bottom: 16px)
- Title: "Import abgeschlossen" (24px, bold, centered, margin-bottom: 16px)
- Summary card: White background, border: 1px solid #e5e7eb, border-radius: 8px, padding: 16px
  - Grid: 2 columns
    - Left column: Labels (gray text, 14px)
    - Right column: Values (black text, 16px, bold)
  - Rows:
    - Erfolgreich importiert: "140 Protokolle ✅" (green text, #10b981, checkmark icon)
    - Übersprungen (Fehler): "10 Protokolle ❌" (red text, #ef4444, X icon)
    - Übersprungen (Warnungen): "0 Protokolle ⚠️" (amber text, #f59e0b, warning icon)
    - Gesamt: "150 Protokolle" (gray text, #6b7280)
  - Imported protocol IDs: Expandable section "Importierte Protokoll-IDs"
    - Shows list of imported protocol IDs (if user wants to verify)
    - Collapsed by default
    - Max-height: 200px, scrollable
- Success message: "Der Import wurde erfolgreich abgeschlossen. 140 Protokolle wurden importiert." (gray text, 14px, centered, margin-top: 16px)
- Warning message (if errors): "10 Protokolle wurden übersprungen. Sie können die Fehler exportieren und später korrigieren." (amber text, #f59e0b, 14px, centered, margin-top: 8px)
- Actions (footer, right-aligned):
  - "Schließen" (secondary button, gray, outlined)
  - "Fehlerprotokoll herunterladen" (tertiary button, gray, outlined, if errors exist)
    - Downloads CSV file with all errors
    - Filename: "Protokoll_Import_Fehler_2025-01-27.csv"
  - "Zu Protokoll-Liste" (primary button, blue)
    - Navigates to protocol list page
    - Shows imported protocols filtered by import date
- Auto-close: Dialog auto-closes after 5 seconds if no errors (optional, user preference)

**Contact Protocol Export:**

**Export Dialog (Modal):**
- Title: "Kontaktprotokolle exportieren" (28px, bold)
- Icon: Download cloud

**Step 1: Export Type**
- Select entity: "Kontaktprotokolle" (pre-selected)
- Customer filter: Dropdown "Alle Kunden" or specific customer
- Protocol type: Dropdown "Alle Typen" or specific type (Besuch, Anruf, E-Mail, Meeting)

**Step 2: Date Range**
- Preset: Chips "Heute", "Diese Woche", "Dieser Monat", "Dieses Quartal", "Dieses Jahr", "Alle"
- Custom: Date pickers "Von/Bis"

**Step 3: Format**
- Dropdown: "Format wählen"
  - CSV (Standard)
  - Excel (.xlsx)
  - Word (.docx) - Table format
  - JSON (API)

**Step 4: Fields**
- Section: "Felder auswählen"
- Default: "Alle Felder" (checkbox)
- Custom: Multi-select list with checkboxes
  - ☑ Datum
  - ☑ Notiz
  - ☑ Aktion
  - ☑ Kunde
  - ☑ Kontakt
  - ☑ Benutzer
  - ☐ Protokolltyp (optional)

**Preview:**
- Card: "Vorschau (erste 5 Zeilen)"
- Table: Shows sample rows
- Columns: Selected fields
- Rows: First 5 protocols

**Word Export Format:**
- Table structure: Professional table with headers (Word table format)
- Columns: Datum, Notiz, Aktion, Kunde, Kontakt, Benutzer, Protokolltyp (if selected)
- Headers: Bold, 14px, blue background (#3b82f6), white text
- Date format: "DD.MM.YYYY" (German format, e.g., "15.01.2024")
- Styling: Professional table styling with headers
  - Border: 1px solid #e5e7eb (gray-200)
  - Alternating row colors: White and #f9fafb (gray-50)
  - Padding: 8px per cell
  - Text alignment: Left-aligned (except dates, right-aligned)
- Multiple pages: Supports multiple pages if needed
  - Page break: After 50 rows (configurable)
  - Header repeat: Table header repeated on each page
  - Page numbers: Footer with page numbers (e.g., "Seite 1 von 3")
- Document metadata:
  - Title: "KOMPASS Kontaktprotokolle Export"
  - Author: "KOMPASS CRM"
  - Created: Current date and time
  - Description: "Exportierte Kontaktprotokolle vom [Datum]"
- File name: "Protokolle_Export_2025-01-27.docx" (includes date)
- File size: Shown in export dialog (e.g., "2.3 MB")

**Export Progress:**
- Progress bar: "Exportiere 70 von 140 Protokollen..." (blue)
- Percentage: "50%"
- Cancel: "Abbrechen" button

**Success:**
- Toast: "Export abgeschlossen - 140 Protokolle exportiert" (green)
- File: "Protokolle_Export_2025-01-27.docx"
- Actions: "Herunterladen" (download icon), "E-Mail senden"

**Business Card Bulk Import (Mobile):**
- Special mode: "Visitenkarten scannen"
- Multi-photo: Scan multiple business cards
- OCR: Extract all contacts
- Batch import: Import all at once

**Mobile View:**
- Wizard: Step-by-step (1 screen per step)
- Swipe: Navigate steps
- File upload: Use file picker or camera
- Mapping: Simplified (auto-detect only)
- Progress: Full-screen overlay

**Accessibility:**
- ARIA labels: Describe steps and fields
- Keyboard navigation: Tab through form
- Screen reader: Reads validation errors
- High contrast: Clear error indicators

## Implementation Notes

### Required shadcn/ui Components
```bash
npx shadcn-ui@latest add button dialog progress table date-picker card badge alert toast
```

### Libraries
```bash
# CSV parsing
pnpm add papaparse @types/papaparse
# or
pnpm add csv-parse

# Excel parsing
pnpm add xlsx
# or
pnpm add exceljs

# Word parsing
pnpm add mammoth
# or
pnpm add docx

# Date parsing
pnpm add date-fns
# or
pnpm add chrono-node
# or
pnpm add moment

# Validation
pnpm add zod
# or
pnpm add yup

# File upload
pnpm add react-dropzone
```

### Word Document Parsing
- Use `mammoth` or `docx` library to extract tables from Word documents
- Extract table structure (headers, rows, columns)
- Handle multiple tables in single document
- Preserve table formatting (if needed)

### Date Parsing Strategy
1. **Try common formats first:**
   - ISO: `YYYY-MM-DD`, `YYYY-MM-DDTHH:mm:ssZ`
   - German: `DD.MM.YYYY`, `DD.MM.YY`, `DD.M.YYYY`, `DD.M.YY`
   - Text: `DD. Januar YYYY`, `DD. Jan YYYY`, `DD Jan YYYY`
   - Numeric: `DDMMYYYY`, `DDMMYY`, `YYYYMMDD`, `YYMMDD`
   - Mixed: `DD/MM/YYYY`, `DD-MM-YYYY`, `YYYY/MM/DD`

2. **Fuzzy parsing:**
   - Extract numbers from string
   - Try different combinations (day/month/year order)
   - Use locale hints (de-DE for German dates)

3. **Confidence scoring:**
   - High confidence (≥0.95): Auto-accept
   - Medium confidence (0.80-0.94): Show warning, suggest manual review
   - Low confidence (<0.80): Require manual entry

4. **Fallback to manual entry:**
   - Show date picker dialog
   - Allow user to select date from calendar
   - Allow user to type date in known format
   - Apply correction to similar dates (optional)

### Customer Auto-Matching
- Extract customer names from note field
- Use fuzzy matching to find similar customers
- Match by: Company name, VAT number, email
- Confidence threshold: ≥0.80 for auto-match
- Show matched customers with confidence score
- Allow user to override auto-matches

### Performance Considerations
- Large files: Process in chunks (1000 rows at a time)
- Progress tracking: Show progress bar for long-running operations
- Background jobs: Use background jobs for imports >5000 rows
- Memory management: Stream file processing to avoid memory issues
- Date parsing: Cache parsed dates to avoid re-parsing
- Batch processing: Process dates in batches for better performance

### Error Handling
- Error logging: Log errors to file for large imports
- Error reporting: Generate error reports for user review
- Error recovery: Allow user to retry import with corrections
- Error export: Export error log as CSV file

### Accessibility
- ARIA labels: Describe all interactive elements
- Keyboard navigation: Tab through form, Enter to submit
- Screen reader: Reads validation errors and progress
- High contrast: Clear error indicators and status icons
- Focus management: Focus moves to next step after completion
- Error announcements: Screen reader announces validation errors

### Mobile Considerations
- Wizard: Step-by-step (1 screen per step)
- Swipe: Navigate steps with swipe gestures
- File upload: Use native file picker or camera
- Mapping: Simplified (auto-detect only, manual override available)
- Progress: Full-screen overlay with progress indicator
- Touch targets: Minimum 44px × 44px for all interactive elements
- Responsive tables: Horizontal scroll on mobile, or card view for small screens
- Date picker: Full-screen modal on mobile
- Customer dropdown: Full-screen modal on mobile for better UX

---

## Summary

### Customer Import/Export (Excel/CSV)
- **Import:** Upload Excel/CSV file → Map fields (automatic/manual) → Validate → Check duplicates → Execute → Error log
- **Export:** Select format (CSV/Excel/JSON/DATEV) → Select fields → Apply filters → Export → Download
- **Features:** Field mapping, validation, duplicate detection, error handling, progress tracking
- **Formats:** CSV, Excel (.xlsx, .xls), JSON, DATEV (GoBD-compliant)

### Contact Protocol Import/Export (Word Documents)
- **Import:** Upload Word document → Select table → Map columns → Parse dates (with fallback) → Assign customers → Validate → Execute → Error log
- **Export:** Select format (CSV/Excel/Word/JSON) → Select fields → Apply filters → Export → Download
- **Features:** Table extraction, column mapping, date parsing (multiple formats with fallback to manual entry), customer assignment (single/multiple with auto-match), validation, error handling, progress tracking
- **Formats:** CSV, Excel (.xlsx), Word (.docx), JSON

### Key UI/UX Features
- **Step-by-step wizard:** 7 steps for protocol import, 6 steps for customer import
- **Progress tracking:** Real-time progress bars, percentages, ETA
- **Error handling:** Comprehensive error logging, error export, error correction dialogs
- **Validation:** Pre-import validation with error/warning reporting
- **Date parsing:** Multiple format support with fallback to manual entry via date picker
- **Customer assignment:** Single customer or per-row assignment with auto-match from note field
- **Duplicate detection:** Check for duplicates before import with user decision options
- **Accessibility:** ARIA labels, keyboard navigation, screen reader support, high contrast
- **Mobile optimization:** Touch-optimized, responsive design, mobile-first approach

### Implementation Requirements
- **shadcn/ui components:** button, dialog, progress, table, date-picker, card, badge, alert, toast
- **Libraries:** papaparse/csv-parse (CSV), xlsx/exceljs (Excel), mammoth/docx (Word), date-fns/chrono-node (date parsing), zod/yup (validation), react-dropzone (file upload)
- **Performance:** Chunked processing (1000 rows), background jobs (>5000 rows), streaming, caching
- **Error handling:** Error logging, error export, error recovery, retry with corrections

---

**End of Data Export & Import UI/UX Documentation**


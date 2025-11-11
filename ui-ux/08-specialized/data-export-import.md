# Data Export & Import - Figma Make Prompt

## Context & Purpose
- **Component Type**: Bulk data import/export interface
- **User Roles**: GF/BUCH (export), PLAN/ADM (import)
- **Usage Context**: Migrate data, backup, DATEV integration, bulk customer import
- **Key Features**: CSV/Excel support, field mapping, validation, progress tracking

## Figma Make Prompt

Create data export and import interfaces for KOMPASS with format selection, field mapping, validation, progress tracking, error handling, and DATEV integration with German labels.

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
- Drag-drop area: "CSV- oder Excel-Datei hier ablegen"
- Or: "Datei auswählen" button
- Supported: CSV, XLSX, JSON
- Max size: "10 MB"
- File info: Shows filename, size, rows count
  - Example: "kunden_import.csv, 2.3 MB, 512 Zeilen"

**Step 2: Import Type**
- Select entity: Dropdown
  - Kunden
  - Kontakte
  - Standorte
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
```bash
npx shadcn-ui@latest add button dialog progress table
# CSV parsing: Use papaparse or csv-parse
# Excel: Use xlsx or exceljs
# Validation: Use zod or yup
```


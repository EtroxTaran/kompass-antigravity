# GoBD Compliance Indicators - Figma Make Prompt

## Context & Purpose

- **Component Type**: GoBD compliance status and indicators
- **User Roles**: GF/BUCH (full view), others (awareness)
- **Usage Context**: Show GoBD compliance status across invoices and financial records
- **Key Features**: Immutability indicators, integrity verification, audit trail links

## Figma Make Prompt

Create GoBD compliance indicators for KOMPASS showing immutability status, data integrity, compliance badges, and audit trail access with German labels and visual security cues.

**GoBD Compliance Badge:**

**Document Status Badges:**

1. **Entwurf (Draft)**
   - Color: Gray (#6B7280)
   - Icon: Pencil (edit)
   - Text: "Entwurf"
   - Tooltip: "Kann noch bearbeitet werden"

2. **Finalisiert (Finalized)**
   - Color: Green (#10B981)
   - Icon: Lock (closed)
   - Text: "Finalisiert"
   - Tooltip: "GoBD-konform gesichert - Unveränderlich"

3. **Korrigiert (Corrected)**
   - Color: Amber (#F59E0B)
   - Icon: Shield with checkmark
   - Text: "Korrigiert"
   - Tooltip: "GoBD-konforme Korrektur durch GF"

4. **Gelöscht (Deleted - Storniert)**
   - Color: Red (#EF4444)
   - Icon: X in circle
   - Text: "Storniert"
   - Tooltip: "Storniert am 15.11.2024 - Korrekturrechnung: R-2024-00457"

**Invoice Card with GoBD Indicators:**

**Invoice Header:**

- Number: "R-2024-00456" (32px, bold, monospace)
- Status: "Finalisiert" badge (green, large)
- Lock icon: 24px (gray) - prominent
- Hash indicator: "Integrität verifiziert ✓" (green, small text)

**Immutability Warning (If Finalized):**

- Banner: Top of invoice detail
- Background: Blue (#3B82F6), semi-transparent
- Icon: Lock (white)
- Text: "Diese Rechnung ist gemäß GoBD unveränderlich"
- Subtext: "Finalisiert am 15.11.2024, 16:45 Uhr"
- Link: "Änderungsverlauf anzeigen"

**Hash Verification Section:**

- Card: "GoBD-Integrität"
- Icon: Shield with checkmark (green)
- Hash: "SHA-256: a3b5c7d9e1f2..." (truncated, monospace)
- Copy button: "Kopieren" (clipboard icon)
- Status: "✓ Integrität verifiziert" (green text)
- Last verified: "Zuletzt geprüft: Vor 2 Minuten"
- Action: "Jetzt prüfen" (button, re-verifies hash)

**Hash Verification Process:**

- Click "Jetzt prüfen"
- Spinner: "Verifiziere Integrität..."
- Success: "✓ Hash stimmt überein - Daten unverändert" (green toast)
- Failure: "⚠ Hash-Fehler - Daten wurden manipuliert!" (red alert dialog)

**Change Log Link:**

- Card: "Änderungsprotokoll"
- Icon: History (clock)
- Text: "124 Einträge"
- Link: "Protokoll anzeigen"
- Opens: Audit trail viewer filtered to this invoice

**GoBD Compliance Dashboard (BUCH Role):**

**Overview Cards:**

1. **Compliant Documents**
   - Value: "452 von 452 (100%)" (32px, green)
   - Icon: Shield checkmark
   - Subtext: "Alle Rechnungen GoBD-konform"

2. **Hash Integrity**
   - Status: "✓ Alle Hashes gültig" (green)
   - Icon: Key
   - Subtext: "Letzte Prüfung: Vor 1 Stunde"

3. **Audit Trail**
   - Value: "1.248 Einträge" (blue)
   - Icon: History
   - Subtext: "Lückenlos protokolliert"

4. **Backup Status**
   - Status: "✓ Aktuell" (green)
   - Icon: Database
   - Subtext: "Letztes Backup: Vor 2 Stunden"

**Compliance Checklist (Expandable):**

- Section: "GoBD-Anforderungen"
- List (with checkmarks):
  - ✅ "Unveränderbarkeit nach Finalisierung"
  - ✅ "Lückenlose Protokollierung aller Änderungen"
  - ✅ "Maschinelle Auswertbarkeit (DATEV-Export)"
  - ✅ "Nachvollziehbarkeit (Audit Trail)"
  - ✅ "Archivierung (10 Jahre)"
  - ✅ "Datensicherung (täglich)"

**Non-Compliant Alert (If Issues):**

- Banner: Red, prominent
- Icon: Alert triangle
- Text: "GoBD-Konformität gefährdet"
- Issues:
  - "3 Rechnungen ohne Hash"
  - "1 Backup fehlt"
  - "2 Änderungen ohne Protokoll"
- Actions: "Jetzt beheben" (button, opens issue resolver)

**Finalization Dialog:**

**Triggered by:** "Rechnung finalisieren" button

**Dialog Content:**

- Title: "Rechnung finalisieren" (28px, bold)
- Warning icon: Large lock (amber, 64px)
- Warning text: "ACHTUNG: Diese Aktion kann nicht rückgängig gemacht werden!"
- Details:
  - "Die Rechnung wird GoBD-konform gesichert"
  - "Alle Felder werden unveränderlich"
  - "Ein SHA-256-Hash wird erstellt"
  - "Änderungen sind nur durch GF mit Korrekturprotokoll möglich"

**Checklist (Must confirm):**

- ☐ "Alle Rechnungsdaten sind korrekt"
- ☐ "Rechnungsnummer ist eindeutig: R-2024-00456"
- ☐ "Kunde und Beträge sind geprüft"

**Actions:**

- Primary: "Jetzt finalisieren" (red button, large)
  - Disabled until all checkboxes checked
- Secondary: "Abbrechen" (gray)

**Success:**

- Toast: "Rechnung finalisiert - GoBD-konform gesichert" (green)
- Shows: Lock icon, hash, finalization timestamp

**Correction Process (GF Only):**

**Correction Dialog:**

- Title: "GoBD-konforme Korrektur" (amber header)
- Icon: Shield with pencil
- Current value: "Rechnungsbetrag: € 63.046,00"
- New value: Input field "Neuer Betrag: € 63.460,00"
- Reason: Textarea "Grund der Korrektur: Tippfehler" (required, min 10 chars)
- GF approval: "Genehmigt durch: Dr. Schmidt (GF)" (auto-filled)

**Warning:**

- "Diese Korrektur wird im Änderungsprotokoll festgehalten"
- "Original-Hash bleibt erhalten"
- "Neuer Korrektur-Eintrag wird erstellt"

**Action:**

- "Korrektur durchführen" (amber button)

**Archive Indicator:**

**10-Year Retention:**

- Badge: "Archiviert" (blue)
- Icon: Archive box
- Tooltip: "Archiviert bis 15.11.2034 (10 Jahre)"
- Warning: "Löschung erst nach Ablauf der Aufbewahrungsfrist"

**Export (DATEV):**

**GoBD-Compliant Export:**

- Button: "DATEV-Export"
- Icon: File download
- Options:
  - "Rechnungen (aktuelles Quartal)"
  - "Änderungsprotokolle"
  - "Hashes und Signaturen"
- Format: CSV (DATEV-compatible)
- Filename: "DATEV_Q4_2024_GoBD.csv"

**Mobile Indicators:**

- Lock icon: Always visible (top-right)
- Badge: Smaller (16px)
- Hash: Hidden, show on tap
- Finalization: Full-screen modal

**Accessibility:**

- ARIA labels: Describe compliance status
- Screen reader: Reads immutability warnings
- Color + icons: Not color-only indicators
- Keyboard: Tab through compliance checks

## Implementation Notes

```bash
npx shadcn-ui@latest add badge button dialog alert
# GoBD: Immutable documents with SHA-256 hash
# Storage: Separate audit database (CouchDB)
# Backup: Daily automated with verification
```

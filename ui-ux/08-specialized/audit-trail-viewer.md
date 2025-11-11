# Audit Trail Viewer - Figma Make Prompt

## Context & Purpose
- **Component Type**: Change history and audit log viewer
- **User Roles**: GF/BUCH (full access), others (limited)
- **Usage Context**: Track all changes to entities for compliance and debugging
- **Key Features**: Complete change history, field-level tracking, user attribution, GoBD compliance

## Figma Make Prompt

Create an audit trail viewer for KOMPASS showing complete change history with field-level diffs, user attribution, timestamps, filters, and GoBD compliance indicators with German labels.

**Entry Points:**
- Entity detail: "Änderungsverlauf" tab or button
- Global: "Audit-Log" in admin menu (GF/BUCH only)
- GoBD: "Protokoll anzeigen" on invoices

**Audit Trail View (Timeline):**

**Header:**
- Title: "Änderungsverlauf" (24px, bold)
- Entity: "Kunde: Hofladen Müller GmbH" (breadcrumb)
- Icon: History icon (clock with arrow)
- Filters button: "Filter" (opens filter panel)

**Timeline Layout:**
- Vertical timeline (left border, blue)
- Events: Cards attached to timeline
- Chronological: Most recent at top
- Pagination: Load more button at bottom

**Timeline Event Card:**

**Card Structure:**
- Timestamp: "15.11.2024, 10:45 Uhr" (bold, top-left)
- Action icon: Created (plus), Updated (edit), Deleted (trash)
- User: Avatar + "Anna Weber (BUCH)" (top-right)
- Event type: "Aktualisiert" or "Erstellt" or "Gelöscht" (badge)

**Change Details:**
- Section: "Geänderte Felder (3)"
- Each field:
  - Field name: "Firmenname" (bold)
  - Old value: "Hofladen Müller" (red, strikethrough)
  - Arrow: "→"
  - New value: "Hofladen Müller GmbH" (green)
- Unchanged fields: Hidden (collapsible "Alle Felder anzeigen")

**Example Card:**
```
15.11.2024, 10:45 Uhr                     [Avatar] Anna Weber (BUCH)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Edit icon] Aktualisiert

Geänderte Felder (3):
• Firmenname:  Hofladen Müller  →  Hofladen Müller GmbH
• Telefon:     +49-89-111111  →  +49-89-1234567
• E-Mail:      -              →  info@hofladen-mueller.de

Grund: Stammdatenkorrektur
IP-Adresse: 192.168.1.100
Gerät: Chrome 119, Windows 10
```

**GoBD-Specific Events:**

**Invoice Finalization:**
- Event: "Rechnung finalisiert" (lock icon)
- Card: Prominent (green border)
- Fields: Shows all finalized fields
- Hash: "SHA-256: a3b5c7..." (with copy button)
- Indicator: "GoBD-konform gesichert" (green badge)
- Warning: "Ab jetzt unveränderlich"

**Invoice Correction (GF Approval):**
- Event: "Korrektur durch GF" (shield icon)
- Card: Prominent (amber border)
- Reason: "Tippfehler in Rechnungsbetrag"
- Approved by: "Dr. Schmidt (GF)"
- Old value: "€ 63.046,00"
- New value: "€ 63.460,00"
- Change log entry: "Protokoll-ID: CL-2024-00123"

**Filter Panel (Sidebar or Dialog):**

**Filters:**
- Date range: "Von/Bis" (date pickers)
- User: Multi-select dropdown (all users)
- Action type: Checkboxes "Erstellt", "Aktualisiert", "Gelöscht"
- Field: Dropdown (all fields) - "Nur Änderungen an Telefon"
- GoBD events: Toggle "Nur GoBD-relevante Änderungen"

**Quick Filters (Chips):**
- "Letzte 7 Tage"
- "Letzter Monat"
- "Dieses Jahr"
- "Nur von mir"
- "Nur GoBD"

**Field-Level Diff View:**

**Detailed Diff (Expandable):**
- Click field: Opens detailed diff modal
- Shows: Side-by-side comparison
- Left: "Vorher" (old value)
- Right: "Nachher" (new value)
- Highlight: Character-level diff (for text)
- Example: "Hofladen Müller" → "Hofladen Müller GmbH"
  - "Müller" → "Müller GmbH" (added " GmbH" in green)

**Complex Field Diffs (Arrays):**
- Shows: Added/removed items
- Example: ContactPersons array
  - Added: "+1 Kontakt: Hans Müller"
  - Removed: "-1 Kontakt: Old Contact"
  - Modified: "~1 Kontakt: Position geändert"

**User Attribution:**

**User Card (Top-Right):**
- Avatar: 40px
- Name: "Anna Weber"
- Role: "BUCH" (badge)
- Tooltip: "E-Mail: a.weber@..."
- Link: "Alle Änderungen von Anna" (filters by user)

**IP & Device Info:**
- IP Address: "192.168.1.100" (for security audit)
- Device: "Chrome 119, Windows 10"
- Location: "München, Germany" (if available)
- Collapsible: "Technische Details ▾"

**Export Options:**

**Export Button (Top-Right):**
- Formats: PDF, CSV, JSON
- Scope: Current view or all history
- GoBD: "GoBD-konformer Export" (includes hash, signatures)
- Filename: "Audit-Trail_Hofladen-Mueller_2024-11-15.pdf"

**CSV Export Columns:**
- Timestamp, User, Role, Action, Field, Old Value, New Value, Reason, IP, Hash

**Search:**
- Search bar: "Änderungen durchsuchen..."
- Searches: Field names, values, user names, reasons
- Highlight: Search terms in results

**Empty States:**

**No Changes:**
- Icon: Empty folder
- Text: "Keine Änderungen gefunden"
- Subtext: "Für diesen Zeitraum gibt es keine Einträge"

**No GoBD Events:**
- Icon: Shield checkmark
- Text: "Keine GoBD-relevanten Änderungen"
- Subtext: "Alle finanziellen Daten sind unverändert"

**Permissions:**

**Access Restrictions:**
- GF/BUCH: Full access to all audit trails
- PLAN: Access to own and managed entities
- ADM/KALK: Access to own changes only
- Restricted fields: Masked for non-authorized users
  - Example: "Kreditlimit: XXX.XXX → XXX.XXX" (if no permission)

**Mobile View:**
- Timeline: Simplified cards
- Swipe: Expand for details
- Filters: Bottom sheet
- Export: Share sheet

**Accessibility:**
- ARIA labels: Describe events and changes
- Keyboard navigation: Tab through events
- Screen reader: Reads timeline chronologically
- High contrast: Clear visual hierarchy

**Real-Time Updates:**
- New changes: Appear at top with animation
- Toast: "Neue Änderung erkannt" (blue)
- Auto-refresh: Every 30 seconds (if viewing global log)

## Implementation Notes
```bash
npx shadcn-ui@latest add card badge button tabs
# Audit log: Store in CouchDB audit database
# GoBD: Immutable audit entries with SHA-256 hash
```


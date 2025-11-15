# Conflict Resolution Interface - Figma Make Prompt

## Context & Purpose

- **Component Type**: Offline sync conflict resolution
- **User Roles**: All (whoever caused the conflict)
- **Usage Context**: Resolve data conflicts from offline edits
- **Key Features**: Side-by-side comparison, merge options, auto-resolution

## Figma Make Prompt

Create a conflict resolution interface for KOMPASS showing local vs server versions side-by-side, field-level differences, merge options, and resolution history with German labels.

**Entry Points:**

- Sync status: "3 Konflikte müssen gelöst werden" (red alert)
- Dashboard notification: "Datenkonflikte gefunden"
- Entity edit: "Konflikt erkannt - Bitte lösen" (banner)

**Conflict Alert Banner:**

- Background: Red (#EF4444), prominent
- Icon: Alert triangle (⚠️, white)
- Text: "3 Konflikte gefunden - Daten wurden gleichzeitig geändert"
- Action: "Jetzt lösen" (white button)
- Dismissible: No (must be resolved)

**Conflict Resolution Dialog (Full-Screen Modal):**

**Header:**

- Title: "Datenkonflikt lösen" (28px, bold)
- Icon: Merge icon (amber)
- Entity: "Kunde: Hofladen Müller GmbH"
- Close: "X" (disabled until conflict resolved)

**Conflict Info Card:**

- Your version: "Bearbeitet von Ihnen: Heute 10:30"
- Server version: "Bearbeitet von Anna Weber: Heute 10:45"
- Conflict reason: "Zeitgleiche Änderungen während Offline-Modus"

**Side-by-Side Comparison:**

**Layout: 2 Columns**

- Left column: "Ihre Version" (blue header)
- Right column: "Server-Version" (green header)
- Divider: Vertical line with merge arrows icon

**Field Comparison (Each Field):**

- Field name: "Firmenname" (bold, above values)
- Unchanged fields: Gray background, same value both sides
- Changed fields: Highlighted (yellow), different values

**Example Changed Field:**

```
Firmenname
--------------------------------------
Ihre Version        | Server-Version
--------------------------------------
Hofladen Müller    | Hofladen Müller GmbH
(Gelb hinterlegt)   | (Gelb hinterlegt)
```

**Difference Indicators:**

- New value (addition): Green background, "+" icon
- Deleted value (removal): Red background, "-" icon
- Modified value: Amber background, "~" icon
- Unchanged: White background, no icon

**Field-Level Actions:**

- Radio buttons: Select version for each field
- Options:
  - ◉ "Meine Version behalten" (left)
  - ○ "Server-Version behalten" (right)
  - ○ "Manuell zusammenführen" (opens text input)

**Manual Merge Input:**

- Triggered by: Selecting "Manuell zusammenführen"
- Shows: Editable text input
- Pre-filled: Combination of both versions (suggested merge)
- Example: "Hofladen Müller GmbH" (combines both)
- User can edit: Full control

**Complex Field (Nested Object - Address):**

- Shows: Expandable section "Adresse ▾"
- Expanded: Shows sub-fields (street, zip, city) individually
- Each sub-field: Independent selection (left/right/merge)

**Auto-Resolution Options (Top):**

- Quick actions (chips):
  - "Alle meine Version" (blue button)
  - "Alle Server-Version" (green button)
  - "Neueste bevorzugen" (amber button)
  - "Intelligentes Zusammenführen" (AI icon, purple button)

**Intelligent Merge (AI-Assisted):**

- Analyzes both versions
- Suggests best merge: "Empfohlene Lösung" (star icon)
- Logic:
  - Non-conflicting: Auto-merge
  - Timestamps: Newest wins
  - Critical fields: User decision required
- Shows: Confidence score "Sicherheit: 85%"

**Review Summary (Bottom Card):**

- Shows: Selected resolution for each field
- Count: "12 Felder - 3 geändert, 9 unverändert"
- List (collapsible):
  - Firmenname: "Meine Version" (blue badge)
  - Telefon: "Server-Version" (green badge)
  - Adresse: "Manuell zusammengeführt" (amber badge)

**Actions (Bottom, Sticky):**

- Primary: "Konflikt lösen" (large, blue, full-width)
  - Disabled: Until all conflicts addressed
  - Enabled: When all radio buttons selected
- Secondary: "Abbrechen" (gray)
  - Warning: "Ungelöste Konflikte bleiben bestehen"
- Tertiary: "Beide Versionen anzeigen" (link, opens side-by-side full view)

**Success Feedback:**

- Toast: "Konflikt gelöst - Daten synchronisiert" (green checkmark)
- Redirect: Back to entity detail (shows merged version)

**Multiple Conflicts Queue:**

- If > 1 conflict: Shows progress "Konflikt 1 von 3"
- Navigation: "Weiter zum nächsten Konflikt" (after resolution)
- Skip: "Später lösen" (leaves conflict unresolved)

**Conflict History:**

- Section: "Verlauf" (expandable)
- Shows: Previous conflicts for this entity
- Each entry: Date, user, resolution method
- Example: "12.11.24, Anna Weber, Manuell zusammengeführt"

**Complex Conflict Scenarios:**

**Scenario 1: Array Conflicts (ContactPersons)**

- Shows: List differences
- Your version: "5 Kontakte"
- Server version: "6 Kontakte"
- Difference: "+1 Kontakt (Server)" or "-1 Kontakt (Ihre)"
- Action: "Liste zusammenführen" (merges both, removes duplicates)

**Scenario 2: Deleted Entity Conflict:**

- Your version: "Kunde bearbeitet"
- Server version: "Kunde gelöscht"
- Alert: "ACHTUNG: Diese Entität wurde serverseitig gelöscht" (red)
- Options:
  - "Löschung akzeptieren" (red button, discards local changes)
  - "Wiederherstellen mit meinen Änderungen" (blue button, undeletes)

**Scenario 3: Field Removed:**

- Your version: Has field "Notiz: XYZ"
- Server version: Field doesn't exist (schema changed)
- Alert: "Feld existiert nicht mehr" (amber)
- Options:
  - "Feld löschen" (accepts schema change)
  - "In neues Feld migrieren" (maps to new field)

**Auto-Resolution Settings:**

- Preference: "Automatische Konfliktlösung"
- Toggle: "Auto-Merge bei nicht-kritischen Feldern"
- Strategy:
  - "Neueste Version bevorzugen" (default)
  - "Immer meine Version"
  - "Immer Server-Version"
  - "Nie automatisch - Immer fragen"

**Mobile View:**

- Stacked layout: "Meine Version" above, "Server-Version" below
- Swipe: Switch between versions
- Tap field: Select version
- Bottom sheet: Shows summary

**Accessibility:**

- ARIA labels: Describe versions and differences
- Keyboard navigation: Tab through fields
- Screen reader: Reads field names and values
- High contrast: Clear visual distinctions

## Implementation Notes

```bash
npx shadcn-ui@latest add dialog button radio-group alert badge
# Conflict detection: PouchDB replication conflicts
# Merge logic: Custom resolver in shared package
```

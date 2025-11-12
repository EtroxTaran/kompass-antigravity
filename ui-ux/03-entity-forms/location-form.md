# Location Form - Figma Make Prompt

## Context & Purpose
- **Component Type**: Nested Entity Form (under Customer)
- **User Roles**: GF, PLAN, ADM (own customers only)
- **Usage Context**: Add/edit customer locations within customer detail view
- **Business Value**: Manage multiple delivery addresses and sites per customer

## Design Requirements

### Visual Hierarchy
- **Form Title**: "Neuer Standort" or "Standort bearbeiten"
- **Parent Context**: Customer name shown prominently
- **Field Groups**: Basic info, Address, Contact, Delivery notes
- **Required Fields**: Marked with red asterisk

### Layout Structure
- Dialog: 700px width (desktop), full-screen (mobile)
- 2-column layout where appropriate
- Field spacing: 16px vertical
- Button group: Right-aligned at footer

### shadcn/ui Components
- `Dialog` for form container
- `Form` components for all fields
- `Input`, `Select`, `Textarea`, `Checkbox`
- `Badge` to show parent customer

## Figma Make Prompt

Create a location form for KOMPASS, a German CRM application. Design a form for adding and editing customer locations (nested under customer) with delivery address, contact assignment, and German labels.

**Form Container:**
- Dialog: 700px width, centered
- Header:
  - Title: "Neuer Standort" or "Standort bearbeiten" - 24px, bold
  - Parent indicator: Badge showing "Kunde: Hofladen Müller GmbH" - blue badge
  - Close "×" button

**Section 1: Standortinformationen (Location Information)**

1. **Standortname** (Required):
   - Label: "Standortname *"
   - Input: Text, full width
   - Placeholder: "z.B. Filiale München Süd"
   - Validation: 2-100 characters, letters/numbers/punctuation
   - Error: "Standortname muss zwischen 2 und 100 Zeichen lang sein"
   - Help text: "Eindeutiger Name für diesen Standort"
   - Note: "Muss innerhalb des Kunden eindeutig sein" (info text, gray)

2. **Standorttyp** (Required):
   - Label: "Standorttyp *"
   - Select dropdown
   - Options:
     - Hauptsitz (Headquarter) - icon: Building
     - Filiale (Branch) - icon: Store
     - Lager (Warehouse) - icon: Package
     - Projektstandort (Project site) - icon: HardHat
     - Sonstige (Other) - icon: MapPin
   - Placeholder: "Typ auswählen..."

3. **Status** (Required):
   - Label: "Status *"
   - Switch toggle: "Aktiv" (on) / "Inaktiv" (off)
   - Default: Active (on)
   - Help text: "Ob dieser Standort aktuell in Betrieb ist"

**Section 2: Lieferadresse (Delivery Address)**
Label: "Lieferadresse" - 18px, semibold

1. **Straße** (Required):
   - Label: "Straße und Hausnummer *"
   - Input: Text, full width
   - Placeholder: "z.B. Industriestraße 42"

2. **Adresszusatz** (Optional):
   - Label: "Adresszusatz"
   - Input: Text, full width
   - Placeholder: "z.B. Hintereingang, 2. Stock"
   - Help text: "Zusätzliche Hinweise zur Lieferadresse"

3. **PLZ** (Required):
   - Label: "Postleitzahl *"
   - Input: Text, left column (25%)
   - Placeholder: "81379"

4. **Stadt** (Required):
   - Label: "Stadt *"
   - Input: Text, right column (75%)
   - Placeholder: "München"

5. **Land**:
   - Label: "Land"
   - Select: Default "Deutschland"

**Section 3: Lieferinformationen (Delivery Information)**
Label: "Lieferinformationen" - 18px, semibold

1. **Anlieferhinweise** (Optional):
   - Label: "Anlieferhinweise"
   - Textarea: 3 rows, full width
   - Placeholder: "z.B. Hintereingang nutzen, Lieferung nur werktags 8-16 Uhr"
   - Max length: 500 characters
   - Character counter: "85 / 500 Zeichen"
   - Help text: "Spezielle Hinweise für Lieferungen an diesen Standort"

2. **Öffnungszeiten** (Optional):
   - Label: "Öffnungszeiten"
   - Input: Text, full width
   - Placeholder: "Mo-Fr 8:00-18:00, Sa 9:00-14:00"
   - Max length: 200 characters
   - Help text: "Betriebszeiten für Lieferungen"

3. **Parkmöglichkeiten** (Optional):
   - Label: "Parkmöglichkeiten"
   - Textarea: 2 rows, full width
   - Placeholder: "z.B. Parkplätze vor dem Gebäude, Entladezone vorhanden"
   - Max length: 300 characters

**Section 4: Zugeordnete Kontakte (Assigned Contacts)**
Label: "Kontakte" - 18px, semibold

1. **Hauptansprechpartner** (Optional):
   - Label: "Hauptansprechpartner"
   - Select dropdown (searchable)
   - Options: List of contacts for this customer
   - Placeholder: "Ansprechpartner auswählen..."
   - Help text: "Primärer Kontakt für diesen Standort"
   - Note: "Muss einer der zugewiesenen Kontakte sein (Business Rule LR-002)"

2. **Zugewiesene Kontakte** (Optional):
   - Label: "Zugewiesene Kontakte"
   - Multi-select with chips
   - Shows selected contacts as removable chips
   - Add button: Opens contact selector
   - Example chips: "Hans Müller ×", "Maria Schmidt ×"
   - Help text: "Ansprechpartner, die diesem Standort zugeordnet sind"

**Section 5: Standortbeschreibung (Location Description)**
Label: "Zusätzliche Informationen" - 18px, semibold

1. **Standortbeschreibung** (Optional):
   - Label: "Standortbeschreibung"
   - **Rich Text Editor** (WYSIWYG): Basic toolbar configuration
     - Toolbar buttons: Bold, Italic, Underline, Bullet List, Numbered List, Link, Undo, Redo
     - See `ui-ux/02-core-components/rich-text-editor.md` for complete toolbar design
   - Min height: 150px (content area)
   - Placeholder: "Besonderheiten des Standorts, Anfahrtsbeschreibung, Zugangsinformationen..."
   - Max length: 2000 characters
   - Character counter: "0 / 2000 Zeichen" (bottom-right corner)
   - Help text: "Detaillierte Informationen zu diesem Standort für interne Zwecke"
   - **Mobile**: Simplified toolbar (Bold, Italic, Lists only)

**Form Footer:**
- Buttons right-aligned:
  - "Abbrechen" (secondary, outlined)
  - "Standort speichern" (primary, blue)

**Duplicate Warning:**
- If location name already exists for customer
- Warning banner above form:
  - Amber background (#fef3c7)
  - Warning icon (AlertTriangle)
  - Text: "Ein Standort mit diesem Namen existiert bereits. Bitte wählen Sie einen anderen Namen."

**Validation:**
- On blur: Validate individual fields
- On submit: Validate entire form
- Business rules checked:
  - LR-001: Location name unique within customer
  - LR-002: Primary contact must be in assigned contacts list

**Mobile Layout:**
- Full-screen dialog
- Single column layout
- All fields full width
- Larger inputs (48px height)
- Sticky footer with buttons

Design with clear sections, adequate spacing, and German labels. Ensure validation messages are helpful and actionable.

## Interaction Patterns

### Form Flow
1. User on customer detail page clicks "Standort hinzufügen"
2. Dialog opens with form
3. Customer context shown in badge at top
4. User fills required fields (Standortname, Standorttyp, Address)
5. Optional fields filled as needed
6. User clicks "Standort speichern"
7. Validation runs
8. If valid: Saves, toast shows success, dialog closes
9. If invalid: Errors shown, focus on first error

### Duplicate Detection
- After entering location name and blur
- System checks if name exists for customer
- Warning appears if duplicate found
- User can modify name or proceed anyway

### Contact Assignment
1. User clicks "Hauptansprechpartner" dropdown
2. List shows only contacts belonging to customer
3. User selects contact
4. System validates contact is in assigned contacts (LR-002)
5. If not in assigned list: Add to assigned automatically with confirmation

## German Labels & Content

### Form Title
- **Neuer Standort**: New location
- **Standort bearbeiten**: Edit location
- **Standort für [Kunde]**: Location for [Customer]

### Sections
- **Standortinformationen**: Location information
- **Lieferadresse**: Delivery address
- **Lieferinformationen**: Delivery information
- **Kontakte**: Contacts

### Fields (See detailed list above)

### Buttons
- **Standort speichern**: Save location
- **Abbrechen**: Cancel
- **Kontakt hinzufügen**: Add contact

### Validation
- **Standortname ist ein Pflichtfeld**: Location name is required
- **Standortname muss eindeutig sein**: Location name must be unique
- **Hauptansprechpartner muss zugewiesener Kontakt sein**: Primary contact must be assigned contact

## Accessibility Requirements
- WCAG 2.1 AA compliance
- All inputs properly labeled
- Required fields: aria-required="true"
- Error messages: aria-describedby linking to error text
- Parent customer context announced by screen reader
- Keyboard navigation functional
- Focus management: First field on open, returns to trigger on close

## Mobile Considerations
- Full-screen on mobile
- Back arrow in header (instead of "×")
- Single column layout
- Full-width fields
- Larger touch targets
- Native pickers for select/date fields

## Example Data

**New Location:**
- Standortname: "Filiale München Süd"
- Standorttyp: "Filiale"
- Status: Aktiv (toggle on)
- Straße: "Industriestraße 42"
- PLZ: "81379"
- Stadt: "München"
- Anlieferhinweise: "Hintereingang nutzen, Lieferung werktags 8-16 Uhr"
- Öffnungszeiten: "Mo-Fr 8:00-18:00"
- Hauptansprechpartner: "Hans Müller"
- Zugewiesene Kontakte: "Hans Müller", "Maria Schmidt"

**Parent Customer:**
- Hofladen Müller GmbH (shown in badge)

## Implementation Notes

### shadcn/ui Installation
```bash
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add form
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add switch
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add button    # For rich text editor toolbar
npx shadcn-ui@latest add separator # For rich text editor toolbar
npx shadcn-ui@latest add tooltip   # For rich text editor toolbar
```

### TipTap Rich Text Editor Installation
```bash
# Core TipTap packages for basic toolbar (location description)
pnpm add @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder
pnpm add @tiptap/extension-link @tiptap/extension-underline
```

### Form Schema
```typescript
import { z } from 'zod';

const locationSchema = z.object({
  locationName: z.string().min(2).max(100),
  locationType: z.enum(['headquarter', 'branch', 'warehouse', 'project_site', 'other']),
  isActive: z.boolean(),
  deliveryAddress: addressSchema,
  deliveryNotes: z.string().max(500).optional(),
  openingHours: z.string().max(200).optional(),
  parkingInstructions: z.string().max(300).optional(),
  primaryContactPersonId: z.string().optional(),
  contactPersons: z.array(z.string()).optional(),
});
```

### Component Dependencies
- Design tokens (colors, spacing)
- Icons from lucide-react (Building, Store, Package, MapPin, Phone)
- Address subform component
- Multi-select component for contacts
- Parent customer context from props or route

### State Management
- Form state: react-hook-form
- Parent customer ID: From props or route params
- Contact list: Fetched from API filtered by customer
- Validation state: Field errors from zod
- Save loading state: Boolean


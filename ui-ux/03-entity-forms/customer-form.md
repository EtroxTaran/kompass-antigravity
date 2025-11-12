# Customer Form - Figma Make Prompt

## Context & Purpose
- **Component Type**: Entity Creation/Edit Form
- **User Roles**: GF, INNEN (full), ADM (create own), PLAN (read-only), KALK (read-only), BUCH (read-only)
- **Usage Context**: Create new customer or edit existing customer data
- **Business Value**: Central data entry point for customer management, ensures data quality through validation

## Design Requirements

### Visual Hierarchy
- **Form Title**: "Neuer Kunde" or "Kunde bearbeiten" - prominent header
- **Section Groups**: Grouped fields (Grunddaten, Adresse, Kontakt, Geschäftsdaten)
- **Required Fields**: Red asterisk (*) indicator
- **Primary Action**: "Speichern" button (blue, prominent)
- **Secondary Action**: "Abbrechen" button (gray, outlined)

### Layout Structure
- Dialog/Modal: 800px width (desktop), full-screen (mobile)
- Form layout: 2-column grid (desktop), single column (mobile)
- Field spacing: 16px vertical gap
- Section spacing: 32px between sections
- Button group: Right-aligned, 12px gap

### shadcn/ui Components
- `Dialog` or `Sheet` for form container
- `Form`, `FormField`, `FormLabel`, `FormControl`, `FormMessage`
- `Input`, `Textarea`, `Select`, `Checkbox`
- `Button` for actions
- `Separator` for section dividers

## Figma Make Prompt

Create a comprehensive customer form for KOMPASS, a German CRM application. Design a form for creating and editing customer data with validation, field grouping, and German labels based on the DATA_MODEL_SPECIFICATION.md.

**Form Container:**
- Modal dialog: 800px width, centered on desktop
- Header:
  - Title: "Neuer Kunde" (create) or "Kunde bearbeiten" (edit) - 24px, bold
  - Description: "Erfassen Sie die Kundendaten" - 14px, gray
  - Close "×" button at top-right
- Content: Scrollable form (max-height: 70vh)
- Footer: Action buttons (sticky at bottom)

**Section 1: Grunddaten (Basic Information)**
Label: "Grunddaten" - 18px, semibold, #1f2937

**Fields (2-column layout on desktop):**

1. **Firmenname** (Required):
   - Label: "Firmenname *" - red asterisk
   - Input: Text, full width (spans 2 columns)
   - Placeholder: "z.B. Hofladen Müller GmbH"
   - Validation: 2-200 characters, pattern: `/^[a-zA-ZäöüÄÖÜß0-9\s\.\-&()]+$/`
   - Error: "Firmenname muss zwischen 2 und 200 Zeichen lang sein"
   - Help text: "Der offizielle Firmenname Ihres Unternehmens"

2. **Umsatzsteuer-ID** (Optional):
   - Label: "Umsatzsteuer-ID"
   - Input: Text, left column
   - Placeholder: "DE123456789"
   - Validation: Pattern `/^DE\d{9}$/`
   - Error: "Umsatzsteuer-ID muss im Format DE123456789 sein"
   - Help text: "Deutsche USt-ID beginnt mit DE, gefolgt von 9 Ziffern"

3. **Kundentyp** (Optional):
   - Label: "Kundentyp"
   - Select dropdown, right column
   - Options: "Direktvermarkter", "Einzelhandel", "Franchise", "Genossenschaft", "Sonstiges"
   - Placeholder: "Kundentyp auswählen..."
   - Help text: "Art des Kundengeschäfts"

4. **Branche** (Optional):
   - Label: "Branche"
   - Input: Text, left column
   - Placeholder: "z.B. Landwirtschaft, Einzelhandel"

5. **Bewertung** (Optional):
   - Label: "Kundenbewertung"
   - Radio group, right column
   - Options: A (5 stars), B (3-4 stars), C (1-2 stars)
   - Visual: Star icons + letter badges
   - Default: Unselected
   - Help text: "Bewertung der Kundenbeziehung"

**Section Separator:**
Divider line: 1px solid #e5e7eb, margin 32px top/bottom

**Section 2: Rechnungsadresse (Billing Address)**
Label: "Rechnungsadresse" - 18px, semibold

**Fields:**

1. **Straße** (Required):
   - Label: "Straße und Hausnummer *"
   - Input: Text, full width (spans 2 columns)
   - Placeholder: "z.B. Hauptstraße 15"
   - Validation: 2-100 characters

2. **PLZ** (Required):
   - Label: "Postleitzahl *"
   - Input: Text, left column (25% width)
   - Placeholder: "80331"
   - Validation: 5 digits, German postal code
   - Error: "PLZ muss 5-stellig sein"

3. **Stadt** (Required):
   - Label: "Stadt *"
   - Input: Text, right column (75% width)
   - Placeholder: "München"
   - Validation: 2-100 characters

4. **Land**:
   - Label: "Land"
   - Select dropdown, left column
   - Options: Deutschland (default), Österreich, Schweiz, other countries
   - Default: "Deutschland"

**Section Separator**

**Section 3: Kontaktdaten (Contact Information)**
Label: "Kontaktdaten" - 18px, semibold

**Fields:**

1. **E-Mail** (Optional):
   - Label: "E-Mail"
   - Input: Email type, left column
   - Placeholder: "info@beispiel.de"
   - Icon: Mail icon at left inside input
   - Validation: Valid email format
   - Error: "Bitte geben Sie eine gültige E-Mail-Adresse ein"

2. **Telefon** (Optional):
   - Label: "Telefon"
   - Input: Tel type, right column
   - Placeholder: "+49-89-1234567"
   - Icon: Phone icon at left
   - Validation: 7-20 characters, phone pattern
   - Help text: "Haupt-Telefonnummer"

3. **Website** (Optional):
   - Label: "Website"
   - Input: URL type, full width
   - Placeholder: "https://www.beispiel.de"
   - Icon: Globe icon at left
   - Validation: Valid URL format
   - Help text: "Firmen-Website (optional)"

**Section Separator**

**Section 4: Geschäftsdaten (Business Information)**
Label: "Geschäftsdaten" - 18px, semibold

**Fields:**

1. **Kreditlimit** (Optional):
   - Label: "Kreditlimit"
   - Input: Number, left column
   - Placeholder: "50000"
   - Suffix: "€" displayed inside input at right
   - Validation: 0-1000000 (€1M max)
   - Help text: "Maximaler Kreditrahmen in Euro"

2. **Zahlungsziel** (Optional):
   - Label: "Zahlungsziel"
   - Select dropdown, right column
   - Options: "Sofort", "7 Tage", "14 Tage", "30 Tage", "60 Tage"
   - Placeholder: "Auswählen..."
   - Help text: "Standard-Zahlungsziel für Rechnungen"

3. **Interne Notizen** (Optional):
   - Label: "Interne Notizen"
   - **Rich Text Editor** (WYSIWYG): Basic toolbar configuration
     - Toolbar buttons: Bold, Italic, Underline, Bullet List, Numbered List, Link, Undo, Redo
     - See `ui-ux/02-core-components/rich-text-editor.md` for complete toolbar design
   - Min height: 150px (content area)
   - Placeholder: "Besonderheiten, Präferenzen, historische Infos..."
   - Max length: 1000 characters
   - Character counter: "0 / 1000 Zeichen" (bottom-right corner)
   - Help text: "Diese Notizen sind nur für interne Zwecke sichtbar"
   - **Mobile**: Simplified toolbar (Bold, Italic, Lists only)

**Section Separator**

**Section 5: Inhaber & DSGVO (Owner & GDPR)**
Label: "Inhaber & Datenschutz" - 18px, semibold

**Fields:**

1. **Inhaber** (Required for ADM):
   - Label: "Verantwortlicher Mitarbeiter *"
   - Select dropdown (searchable), left column
   - Options: List of ADM users
   - Current user pre-selected for ADM role
   - Disabled for ADM (can only create own customers)
   - GF/PLAN can assign to any ADM user
   - Help text: "Zuständiger Außendienstmitarbeiter"

2. **DSGVO-Einwilligungen** (Optional):
   - Label: "Datenschutz-Einwilligungen"
   - Checkbox group, full width:
     - ☐ Marketing-Kommunikation
     - ☐ KI-gestützte Verarbeitung
     - ☐ Datenfreigabe für Partner
   - Help text: "Einwilligungen gemäß DSGVO Artikel 6(1)(a)"

**Form Footer (Sticky):**
- Background: White with top border shadow
- Padding: 16px 24px
- Button group (right-aligned):
  - "Abbrechen" button: Outlined, gray, closes dialog
  - "Speichern" button: Primary blue, submits form
  - Gap: 12px between buttons

**Loading State:**
- "Speichern" button shows spinner + "Wird gespeichert..."
- Form fields disabled during save
- Overlay with spinner on entire form (alternative)

**Success State:**
- Toast notification: "Kunde wurde erfolgreich angelegt" (green)
- Dialog closes automatically
- Or: Shows success message in dialog with "Kunde anzeigen" button

**Error State:**
- Field-level errors: Red underline, error message below field
- Form-level error: Red alert banner at top
- Examples:
  - "Firmenname ist ein Pflichtfeld"
  - "Die E-Mail-Adresse ist ungültig"
  - "Fehler beim Speichern: Bitte überprüfen Sie Ihre Internetverbindung"

**Validation Behavior:**
- Real-time validation: On blur (after field loses focus)
- On submit: Validate all fields before submitting
- Scroll to first error if validation fails
- Focus on first error field

**RBAC Visibility:**
- ADM users: "Inhaber" field pre-filled with own user ID, disabled
- GF/PLAN users: "Inhaber" field enabled, can select any ADM user
- Read-only fields: Display as text (not editable inputs)

**Mobile Layout:**
- Full-screen dialog
- Single column layout
- Larger inputs (48px height)
- Larger buttons (48px height)
- Sticky header and footer
- Scrollable content area between

Design with clear visual hierarchy, adequate whitespace, and German labels throughout.

## Interaction Patterns

### Form Flow
1. User clicks "Neuer Kunde" button
2. Dialog opens with empty form
3. User fills required fields (marked with *)
4. Real-time validation on field blur
5. User clicks "Speichern"
6. Form validation runs
7. If valid: Data saves, success toast, dialog closes
8. If invalid: Error messages show, scroll to first error

### Field Interactions
- Click input: Focus, blue border
- Type text: Placeholder disappears
- Leave field (blur): Validation runs if field touched
- Error: Red border, error message appears below
- Valid: Border returns to gray, error message clears

## German Labels & Content

### Form Titles
- **Neuer Kunde**: New customer
- **Kunde bearbeiten**: Edit customer
- **Kundendaten erfassen**: Enter customer data

### Section Titles
- **Grunddaten**: Basic information
- **Rechnungsadresse**: Billing address
- **Kontaktdaten**: Contact information
- **Geschäftsdaten**: Business information
- **Inhaber & Datenschutz**: Owner & privacy

### Field Labels (See detailed fields above)

### Validation Messages
- **Pflichtfeld**: Required field
- **Ungültiges Format**: Invalid format
- **Zu kurz**: Too short
- **Zu lang**: Too long

### Buttons
- **Speichern**: Save
- **Abbrechen**: Cancel
- **Kunde anzeigen**: View customer

## Accessibility Requirements
- WCAG 2.1 AA compliance
- Form: role="form", aria-label="Kundenformular"
- Required fields: aria-required="true"
- Error messages: aria-invalid="true", aria-describedby
- Field labels: Properly associated with inputs
- Keyboard navigation: Tab through all fields
- Focus visible: 2px blue outline
- Screen reader announces errors
- Color not sole indicator (icons + text)

## Mobile Considerations
- Full-screen form on mobile
- Single column layout
- Larger touch targets (48px)
- Native select pickers on mobile
- Sticky header with "Zurück" (back) button
- Sticky footer with action buttons
- Adequate spacing for touch input

## Example Data

**New Customer (Create):**
- Firmenname: "Hofladen Müller GmbH"
- Umsatzsteuer-ID: "DE123456789"
- Kundentyp: "Direktvermarkter"
- Straße: "Hauptstraße 15"
- PLZ: "80331"
- Stadt: "München"
- Land: "Deutschland"
- E-Mail: "info@hofladen-mueller.de"
- Telefon: "+49-89-1234567"
- Kreditlimit: "50000 €"
- Zahlungsziel: "30 Tage"
- Inhaber: "Michael Schmidt" (ADM)
- DSGVO: Marketing ✓, KI-Verarbeitung ✓

## Implementation Notes

### shadcn/ui Installation
```bash
npx shadcn-ui@latest add form
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add radio-group
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add button
npx shadcn-ui@latest add separator # For rich text editor toolbar
npx shadcn-ui@latest add tooltip   # For rich text editor toolbar
```

### TipTap Rich Text Editor Installation
```bash
# Core TipTap packages for basic toolbar (internal notes)
pnpm add @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder
pnpm add @tiptap/extension-link @tiptap/extension-underline
```

### Form Usage (react-hook-form + zod)
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerSchema } from '@kompass/shared/validation/customer';

const form = useForm({
  resolver: zodResolver(customerSchema),
  defaultValues: customer || defaultCustomerValues,
});

function onSubmit(data: CustomerFormData) {
  // Save customer
}
```

### Component Dependencies
- Design tokens (colors, spacing)
- Icons from lucide-react (Mail, Phone, Globe)
- Form validation schema from @kompass/shared
- User list for Inhaber dropdown
- RBAC context for field visibility

### State Management
- Form state: react-hook-form
- Validation state: zod schema
- Save loading state: Boolean
- Customer data: From API or props
- Current user: For RBAC checks


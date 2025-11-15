# Form Inputs - Figma Make Prompt

## Context & Purpose

- **Component Type**: Form Elements Library
- **User Roles**: All (GF, PLAN, ADM, KALK, BUCH)
- **Usage Context**: All forms throughout KOMPASS for data entry and editing
- **Business Value**: Provides consistent, accessible, and validated input controls for all user data entry

## Design Requirements

### Visual Hierarchy

- **Labels**: Clear, bold, positioned above inputs
- **Inputs**: Prominent, easy to focus, adequate white space
- **Help Text**: Subtle, below inputs for guidance
- **Error Messages**: Red, clear, actionable feedback
- **Required Indicators**: Asterisk (\*) in red next to label

### Layout Structure

- Full-width inputs on mobile
- Fixed-width inputs (320-400px) on desktop
- Consistent 16px vertical spacing between fields
- Field groups with subtle visual separation

### shadcn/ui Components

- `Input` for text, email, number fields
- `Textarea` for multi-line text
- `Select` for dropdowns
- `Checkbox` and `RadioGroup` for boolean/options
- `Label` for all field labels
- `FormDescription` for help text
- `FormMessage` for validation errors

## Figma Make Prompt

Create a comprehensive library of form input components for KOMPASS, a German CRM application. Design all standard input types with validation states, accessibility features, and German labels.

**Text Input (Standard):**

- Container height: 40px
- Border: 1px solid light gray (#e5e7eb), rounded corners (6px)
- Padding: 12px horizontal, 10px vertical
- Font: 14px, regular weight (#1f2937 text color)
- Placeholder: Light gray (#9ca3af) text, example: "Firmenname eingeben"
- Label above (14px, semibold, #374151): "Firmenname \*"
- Required asterisk in red (#ef4444)

**States:**

1. **Default**: Gray border, white background
2. **Focus**: Blue border (2px, #3b82f6), subtle blue glow
3. **Filled**: Black text, gray border
4. **Error**: Red border (2px, #ef4444), red glow
   - Error message below (12px, red): "Firmenname muss mindestens 2 Zeichen lang sein"
   - Error icon (AlertCircle, 16px) to left of message
5. **Disabled**: Light gray background (#f9fafb), gray text, cursor not-allowed
6. **Read-only**: White background, gray border, no focus state

**Email Input:**

- Same as text input but with email icon (Mail, 20px) at left inside input
- Padding-left: 40px to accommodate icon
- Icon color: Gray (#6b7280)
- Validation: Email format check with error "Bitte geben Sie eine gültige E-Mail-Adresse ein"

**Number Input:**

- Right-aligned text for numbers
- Optional unit suffix displayed: "€" or "km" (gray, right-aligned inside)
- Stepper arrows on right (up/down, 16px, gray)
- Example: "50000" with "€" suffix for credit limit

**Textarea (Multi-line):**

- Same border/padding as text input
- Minimum height: 120px
- Resizable handle at bottom-right
- Character counter at bottom-right: "85 / 500 Zeichen"
- Label: "Notizen"
- Placeholder: "Zusätzliche Informationen eingeben..."

**Select Dropdown:**

- Appears like text input but with chevron-down icon (16px) at right
- Opens dropdown menu below (max-height: 300px, scrollable)
- Options:
  - Each option: 40px height, 12px padding
  - Hover: Light blue background (#f0f9ff)
  - Selected: Blue background (#3b82f6), white text, check icon
- Label: "Land auswählen"
- Selected value: "Deutschland"

**Checkbox:**

- Size: 20x20px
- Border: 2px solid gray (#d1d5db), rounded (4px)
- Checked state: Blue background (#3b82f6), white checkmark
- Label to right (14px, gray #374151): "Ich akzeptiere die Datenschutzbestimmungen"
- Focus: Blue outline (2px)

**Radio Group:**

- Radio button: 20px diameter circle
- Border: 2px solid gray (#d1d5db)
- Selected: Blue border and inner dot (10px, #3b82f6)
- Label to right: "Option A"
- Group of 3 options with label above: "Kundentyp auswählen"
- Options: "Direktvermarkter", "Einzelhandel", "Franchise"
- Vertical spacing: 12px between options

**Date Picker Input:**

- Text input with calendar icon (Calendar, 20px) at right
- Clicking opens date picker popover
- Format: DD.MM.YYYY (German date format)
- Placeholder: "TT.MM.JJJJ"
- Label: "Rechnungsdatum"

**Search Input:**

- Text input with search icon (Search, 20px) at left
- Optional clear "×" button at right when text is entered
- Placeholder: "Kunden durchsuchen..."
- Width: Expandable, typically 300-400px

**Input with Prefix/Suffix:**

- Prefix example: "+49" for phone (gray background box at left, inside input)
- Suffix example: "€" for currency (gray text at right, inside input)
- Input text positioned appropriately between prefix/suffix

**Help Text:**

- Positioned below input, above error message
- Font: 12px, gray (#6b7280)
- Example: "Die Umsatzsteuer-ID besteht aus DE gefolgt von 9 Ziffern"

**Field Group:**

- Related fields grouped with subtle border or background
- Example: Address group (Street, PLZ, City, Land) with light background (#f9fafb)
- Group label (16px, semibold): "Rechnungsadresse"

Design in light mode with clean, professional aesthetic. Ensure touch-friendly on mobile (44px minimum touch target). All labels and text in German.

## Interaction Patterns

### Focus Sequence

1. User clicks or tabs into input
2. Border changes to blue, subtle glow appears
3. Cursor positioned at start of input
4. Placeholder disappears if visible
5. User types, placeholder replaced with text
6. User tabs to next field or clicks outside
7. Validation runs (if configured)
8. Error message appears if invalid

### Validation Timing

- **On Blur**: Validate when user leaves field (most common)
- **On Change**: Real-time validation for specific fields (e.g., password strength)
- **On Submit**: Final validation before form submission
- **Debounced**: Wait 500ms after last keystroke for expensive validations

### States

- **Default**: Ready for input, neutral appearance
- **Focus**: Blue border, user is interacting
- **Filled**: Contains valid data
- **Error**: Red border, error message visible, focus retained
- **Disabled**: Grayed out, not interactive, cursor not-allowed
- **Read-only**: Shows data but not editable, no focus state

### Keyboard Navigation

- Tab: Move to next input
- Shift+Tab: Move to previous input
- Enter: Submit form (if on button) or move to next (if configured)
- Escape: Clear input (if configured) or cancel

## German Labels & Content

### Common Labels

- **Firmenname**: Company name
- **Umsatzsteuer-ID**: VAT number
- **E-Mail**: Email
- **Telefon**: Phone
- **Mobil**: Mobile
- **Website**: Website
- **Straße**: Street
- **Hausnummer**: House number
- **PLZ**: Postal code
- **Stadt**: City
- **Land**: Country
- **Notizen**: Notes
- **Beschreibung**: Description

### Validation Messages

- **Pflichtfeld**: Required field
- **Ungültiges Format**: Invalid format
- **Zu kurz**: Too short
- **Zu lang**: Too long
- **Bitte auswählen**: Please select
- **Ungültige E-Mail**: Invalid email
- **Muss eine Zahl sein**: Must be a number

### Placeholders

- **Eingeben...**: Enter...
- **Auswählen...**: Select...
- **Suchen...**: Search...
- **Optional**: Optional
- **TT.MM.JJJJ**: DD.MM.YYYY (date format)

## Accessibility Requirements

- WCAG 2.1 AA compliance
- All inputs have associated labels (no placeholder-only labels)
- Required fields indicated with asterisk AND aria-required="true"
- Error messages associated with inputs via aria-describedby
- Focus visible with 2px blue outline
- Color contrast: 4.5:1 minimum for text on background
- Touch targets: 44x44px minimum on mobile
- Keyboard accessible: Tab navigation works correctly
- Screen reader announcements for errors and state changes

## Mobile Considerations

- Full-width inputs on mobile (<640px screens)
- Larger touch targets (48px height minimum)
- Date pickers use native mobile picker
- Select dropdowns use native mobile select
- Numeric keyboard for number/phone inputs (inputmode="numeric")
- Email keyboard for email inputs (inputmode="email")
- Adequate spacing between fields (16px) for fat-finger usability

## Example Data

**Customer Form Example:**

- Firmenname: "Hofladen Müller GmbH"
- Umsatzsteuer-ID: "DE123456789"
- E-Mail: "info@hofladen-mueller.de"
- Telefon: "+49-89-1234567"
- Website: "https://www.hofladen-mueller.de"
- Kreditlimit: "50000 €"
- Zahlungsziel: "30 Tage"
- Branche: "Landwirtschaft"
- Kundentyp: "Direktvermarkter" (radio selected)

## Implementation Notes

### shadcn/ui Installation

```bash
npx shadcn-ui@latest add input
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add select
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add radio-group
npx shadcn-ui@latest add label
npx shadcn-ui@latest add form
```

### Input Component Usage

```typescript
<div className="space-y-2">
  <Label htmlFor="companyName">
    Firmenname <span className="text-destructive">*</span>
  </Label>
  <Input
    id="companyName"
    placeholder="Firmenname eingeben"
    required
    aria-required="true"
  />
  <FormDescription>
    Der offizielle Name Ihres Unternehmens
  </FormDescription>
</div>
```

### Error State

```typescript
<div className="space-y-2">
  <Label htmlFor="email">E-Mail</Label>
  <Input
    id="email"
    type="email"
    className="border-destructive"
    aria-invalid="true"
    aria-describedby="email-error"
  />
  <FormMessage id="email-error">
    Bitte geben Sie eine gültige E-Mail-Adresse ein
  </FormMessage>
</div>
```

### Component Dependencies

- Design tokens (colors, spacing, typography)
- Icons from lucide-react (Mail, Calendar, Search, AlertCircle)
- Form validation library (react-hook-form + zod)
- Label and error message components

### State Management

- Form state managed by react-hook-form
- Validation rules defined with zod schemas
- Error states derived from validation results
- Disabled/readonly states from form configuration or RBAC

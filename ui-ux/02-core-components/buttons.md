# Buttons - Figma Make Prompt

## Context & Purpose

- **Component Type**: Button Library
- **User Roles**: All (GF, PLAN, ADM, KALK, BUCH)
- **Usage Context**: Primary and secondary actions throughout KOMPASS
- **Business Value**: Consistent, accessible action triggers for all user interactions

## Design Requirements

### Visual Hierarchy

- **Primary Buttons**: Blue, prominent for main actions
- **Secondary Buttons**: Outlined, less prominent for alternative actions
- **Tertiary Buttons**: Ghost/text style for minor actions
- **Destructive Buttons**: Red for delete/cancel actions
- **Icon Buttons**: Compact, icon-only for toolbars

### Layout Structure

- Minimum height: 40px (48px on mobile for touch)
- Horizontal padding: 16px (24px for primary)
- Icon spacing: 8px from text
- Button groups: 8px gap between buttons
- Full-width option for mobile forms

### shadcn/ui Components

- `Button` with variants: default, secondary, outline, ghost, destructive
- `ButtonGroup` for related actions
- Icon integration from lucide-react

## Button Specifications (from Reference Repository)

**Reference Source:** `EtroxTaran/Kompassuimusterbibliothek/src/components/ButtonVariants.tsx`, `ButtonSizes.tsx`

**Primary Button (Default):**

- Background: `bg-primary` (OKLCH: `oklch(0.6487 0.1538 150.3071)`)
- Text: `text-primary-foreground` (white)
- Font: 14px, medium weight
- Height: 40px (`h-10`)
- Padding: Horizontal padding handled by shadcn/ui Button component
- Border-radius: Uses `--radius` token (0.5rem)
- Example text: "Kunde anlegen", "Speichern", "Weiter"
- Shadow: Uses `--shadow-sm` token

**States:**

1. **Default**: Blue background, white text
2. **Hover**: Darker blue (#2563eb), slight lift (2px shadow increase)
3. **Active/Pressed**: Even darker blue (#1e40af), pressed appearance (inner shadow)
4. **Loading**: Blue background, white spinner (16px) + "Wird gespeichert..."
5. **Disabled**: Light gray background (#e5e7eb), gray text (#9ca3af), cursor not-allowed, opacity 0.6
6. **Focus**: 2px blue outline offset by 2px

**Secondary Button (Outlined):**

- Background: Transparent
- Border: 1px solid gray (#d1d5db)
- Text: Gray (#374151), 14px, medium weight
- Same dimensions as primary
- Example text: "Abbrechen", "Zurück", "Filter anwenden"

**States:**

- Hover: Light gray background (#f9fafb)
- Active: Slightly darker gray background (#f3f4f6)
- Focus: Blue outline
- Disabled: Faded border and text

**Tertiary Button (Ghost):**

- Background: Transparent, no border
- Text: Blue (#3b82f6), 14px, medium weight
- Padding: 12px horizontal
- Example text: "Details anzeigen", "Mehr erfahren"

**States:**

- Hover: Light blue background (#f0f9ff)
- Active: Slightly darker blue background (#e0f2fe)
- Focus: Blue outline

**Destructive Button:**

- Background: Red (#ef4444)
- Text: White, 14px, medium weight
- Same dimensions as primary
- Example text: "Löschen", "Stornieren", "Abbrechen"

**States:**

- Hover: Darker red (#dc2626)
- Active: Even darker red (#b91c1c)
- Disabled: Faded red background

**Size Variants (from Reference Repository):**

1. **Large (lg)**:
   - Height: 48px (`h-12`)
   - Icon size: 20px (`h-5 w-5`)
   - Use for: Primary CTAs, mobile primary actions
   - Example: `<Button size="lg">Speichern</Button>`

2. **Default**:
   - Height: 40px (`h-10`)
   - Icon size: 16px (`h-4 w-4`)
   - Use for: Most buttons
   - Example: `<Button>Speichern</Button>`

3. **Small (sm)**:
   - Height: 32px (`h-8`)
   - Icon size: 12px (`h-3 w-3`)
   - Use for: Secondary actions, table actions, compact layouts
   - Example: `<Button size="sm">Speichern</Button>`

**Reference:** `EtroxTaran/Kompassuimusterbibliothek/src/components/ButtonSizes.tsx`

**Icon + Text Button:**

- Icon positioned to left of text
- Gap: `mr-2` (8px) for default size, `mr-1.5` (6px) for small
- Icon sizes:
  - Small: `h-3 w-3` (12px)
  - Default: `h-4 w-4` (16px)
  - Large: `h-5 w-5` (20px)
- Example:
  ```tsx
  <Button>
    <Save className="h-4 w-4 mr-2" />
    Speichern
  </Button>
  ```
- Icon color matches text color automatically

**Icon-Only Button:**

- Square (40x40px default, 32x32px small, 48x48px large)
- Icon centered (20px size)
- No text label
- Tooltip on hover with action description
- Example: Edit (Pencil icon), Delete (Trash icon), More (MoreVertical icon)

**Button Group:**

- Multiple buttons side by side
- 8px gap between buttons
- Example: "Speichern" (primary) + "Abbrechen" (secondary)
- Align buttons to right in forms
- Full-width option: Buttons share width equally on mobile

**Loading Button:**

- Spinner replaces icon (if present) or appears to left of text
- Spinner: 16px, white color, rotating animation
- Text changes: "Speichern" → "Wird gespeichert..."
- Button disabled during loading
- Width remains constant (no layout shift)

**Link Button:**

- Appears as hyperlink text (blue, underlined)
- Font: 14px
- Hover: Darker blue
- Example: "Passwort vergessen?", "Zur Anmeldung"

**Badge Button:**

- Button with notification badge in top-right corner
- Badge: Red circle (20px), white number
- Example: Notifications button with "3" unread count

**Dropdown Button:**

- Button with chevron-down icon at right
- Clicking opens dropdown menu below
- Example: "Aktionen ▾" with menu: "Bearbeiten", "Duplizieren", "Löschen"

**Full-Width Button (Mobile):**

- Width: 100% of container
- Use in: Mobile forms, bottom sheets
- Example: "Kunde speichern" spans full width

**Floating Action Button (FAB):**

- Circular button (56px diameter)
- Fixed position: bottom-right corner
- Blue background, white icon (Plus, 24px)
- Shadow: Elevated (0px 4px 12px rgba(0,0,0,0.15))
- Use on: Mobile list views for quick add action

Design in light mode with professional aesthetic. Ensure all buttons have minimum 3:1 contrast ratio with background.

## Interaction Patterns

### Click Interaction

1. User hovers button: Background changes
2. User clicks: Active state (pressed appearance)
3. Action executes: Loading state if async
4. Completion: Success feedback (toast) or navigation

### Loading State Behavior

- Button becomes disabled
- Spinner appears
- Text updates to progressive tense
- Width remains constant
- Focus remains on button
- Cannot be clicked again until loading completes

### Keyboard Navigation

- Tab: Focus next button
- Shift+Tab: Focus previous button
- Enter/Space: Activate button
- Escape: Cancel focus (if in modal)

### Touch Behavior (Mobile)

- Minimum touch target: 48x48px
- Touch feedback: Ripple effect (optional)
- Haptic feedback on press (iOS/Android)
- No hover state on touch devices

### States

- **Default**: Resting state, ready for interaction
- **Hover**: Mouse over (desktop only)
- **Active**: Being pressed
- **Focus**: Keyboard focus visible
- **Loading**: Operation in progress, disabled
- **Disabled**: Not interactive, grayed out
- **Success**: Temporary success state (optional, e.g., checkmark animation)

## German Labels & Content

### Primary Actions

- **Speichern**: Save
- **Anlegen**: Create
- **Erstellen**: Create/Generate
- **Hinzufügen**: Add
- **Weiter**: Next/Continue
- **Fertigstellen**: Complete/Finish
- **Übernehmen**: Apply
- **Bestätigen**: Confirm

### Secondary Actions

- **Abbrechen**: Cancel
- **Zurück**: Back
- **Schließen**: Close
- **Filter anwenden**: Apply filters
- **Exportieren**: Export
- **Importieren**: Import

### Destructive Actions

- **Löschen**: Delete
- **Entfernen**: Remove
- **Stornieren**: Cancel/Revoke
- **Ablehnen**: Reject

### Loading States

- **Wird gespeichert...**: Saving...
- **Wird geladen...**: Loading...
- **Wird erstellt...**: Creating...
- **Wird aktualisiert...**: Updating...

### Tertiary Actions

- **Details anzeigen**: Show details
- **Mehr erfahren**: Learn more
- **Abbrechen**: Cancel (link style)

## Accessibility Requirements

- WCAG 2.1 AA compliance
- Minimum contrast: 4.5:1 for text, 3:1 for UI components
- Touch targets: 44x44px minimum (48px recommended)
- Focus visible: 2px outline, high contrast
- Disabled buttons: aria-disabled="true", not focusable
- Loading buttons: aria-busy="true"
- Icon-only buttons: aria-label with descriptive text
- Button purpose clear from label text alone

## Mobile Considerations

- Larger touch targets (48px minimum height)
- Full-width buttons in forms
- FAB for primary mobile action (bottom-right)
- Button groups stack vertically on mobile
- Adequate spacing between stacked buttons (12px)
- Primary action at bottom (easiest thumb reach)

## Example Data

**Customer Form Actions:**

- Primary: "Kunde anlegen" (Create customer)
- Secondary: "Abbrechen" (Cancel)

**Edit Customer Dialog:**

- Primary: "Änderungen speichern" (Save changes)
- Secondary: "Abbrechen" (Cancel)
- Destructive: "Kunde löschen" (Delete customer)

**Invoice List:**

- Icon button: Edit (Pencil), Delete (Trash), View (Eye)
- FAB: "Neue Rechnung" (New invoice)

**Data Table:**

- Dropdown: "Aktionen" → "Bearbeiten", "Duplizieren", "Löschen"
- Icon-only: Filter (Filter icon), Export (Download icon)

## Implementation Notes

### shadcn/ui Installation

```bash
npx shadcn-ui@latest add button
```

### Button Variants (from Reference Repository)

**Reference:** `EtroxTaran/Kompassuimusterbibliothek/src/components/ButtonVariants.tsx`

```typescript
// Primary (Default)
<Button>Speichern</Button>
<Button>Kunde anlegen</Button>
<Button>Weiter</Button>

// Secondary (Outlined)
<Button variant="outline">Abbrechen</Button>
<Button variant="outline">Zurück</Button>
<Button variant="outline">Filter anwenden</Button>

// Tertiary (Ghost)
<Button variant="ghost">Details anzeigen</Button>
<Button variant="ghost">Mehr erfahren</Button>
<Button variant="ghost">Bearbeiten</Button>

// Secondary (with background)
<Button variant="secondary">Entwurf speichern</Button>
<Button variant="secondary">Vorschau</Button>

// Destructive
<Button variant="destructive">Löschen</Button>
<Button variant="destructive">Stornieren</Button>

// Link
<Button variant="link">Passwort vergessen?</Button>
<Button variant="link">Zur Anmeldung</Button>

// With Icon (Default size)
<Button>
  <Save className="h-4 w-4 mr-2" />
  Speichern
</Button>

// With Icon (Large size)
<Button size="lg">
  <Plus className="h-5 w-5 mr-2" />
  Neu anlegen
</Button>

// With Icon (Small size)
<Button size="sm">
  <Save className="h-3 w-3 mr-1.5" />
  Mit Symbol
</Button>

// Icon Only
<Button variant="ghost" size="icon">
  <Pencil className="h-4 w-4" />
</Button>
```

### Button Group

```typescript
<div className="flex gap-2">
  <Button variant="outline">Abbrechen</Button>
  <Button>Speichern</Button>
</div>
```

### Component Dependencies

- Design tokens (colors, spacing, shadows)
- Icons from lucide-react
- Loading spinner animation
- Tooltip component for icon-only buttons

### State Management

- Button loading state from async operations
- Disabled state from form validation or RBAC
- Focus state from keyboard navigation
- Success state from action completion

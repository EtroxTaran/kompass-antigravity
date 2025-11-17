# KOMPASS Design System Style Guide

## Reference Source

**GitHub UI Reference Repository:** `EtroxTaran/Kompassuimusterbibliothek`

- **Primary Reference:** `src/styles/globals.css`
- **Design System Documentation:** `src/DESIGN_SYSTEM_UPDATE.md`
- **Component Examples:** `src/components/`
- **Last Updated:** 2025-01-27

## Overview

This style guide provides a quick reference for the complete KOMPASS design system extracted from the reference repository. All values, patterns, and specifications are sourced directly from `EtroxTaran/Kompassuimusterbibliothek`.

## Color System

### Primary Colors (OKLCH)

| Token           | Light Mode                      | Dark Mode                       | Usage                            |
| --------------- | ------------------------------- | ------------------------------- | -------------------------------- |
| `--primary`     | `oklch(0.6487 0.1538 150.3071)` | `oklch(0.6487 0.1538 150.3071)` | Primary brand color (Blue-Green) |
| `--secondary`   | `oklch(0.6746 0.1414 261.3380)` | `oklch(0.5880 0.0993 245.7394)` | Secondary color (Purple)         |
| `--accent`      | `oklch(0.8269 0.1080 211.9627)` | `oklch(0.6746 0.1414 261.3380)` | Accent highlights                |
| `--destructive` | `oklch(0.6368 0.2078 25.3313)`  | `oklch(0.6368 0.2078 25.3313)`  | Error/delete actions             |
| `--muted`       | `oklch(0.8828 0.0285 98.1033)`  | `oklch(0.3867 0 0)`             | Muted backgrounds                |
| `--background`  | `oklch(0.9824 0.0013 286.3757)` | `oklch(0.2303 0.0125 264.2926)` | Page background                  |
| `--foreground`  | `oklch(0.3211 0 0)`             | `oklch(0.9219 0 0)`             | Primary text                     |
| `--border`      | `oklch(0.8699 0 0)`             | `oklch(0.3867 0 0)`             | Borders                          |
| `--card`        | `oklch(1.0000 0 0)`             | `oklch(0.3210 0.0078 223.6661)` | Card backgrounds                 |

### Chart Colors

```css
--chart-1: oklch(0.6487 0.1538 150.3071); /* Primary Blue-Green */
--chart-2: oklch(0.6746 0.1414 261.338); /* Purple */
--chart-3: oklch(0.8269 0.108 211.9627); /* Light Blue */
--chart-4: oklch(0.588 0.0993 245.7394); /* Deep Purple */
--chart-5: oklch(0.5905 0.1608 148.2409); /* Green */
```

### Sidebar Colors

```css
--sidebar: oklch(0.9824 0.0013 286.3757);
--sidebar-foreground: oklch(0.3211 0 0);
--sidebar-primary: oklch(0.6487 0.1538 150.3071);
--sidebar-accent: oklch(0.8269 0.108 211.9627);
--sidebar-border: oklch(0.8699 0 0);
```

## Typography

### Font Families

```css
--font-sans: Plus Jakarta Sans, sans-serif; /* Primary UI font */
--font-serif: Source Serif 4, serif; /* Editorial/headings */
--font-mono: JetBrains Mono, monospace; /* Code/data */
```

**Google Fonts Import:**

```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=JetBrains+Mono:wght@400;500;600&display=swap');
```

### Font Sizes

| Element      | Size            | Weight           | Line Height |
| ------------ | --------------- | ---------------- | ----------- |
| `h1`         | 48px (3rem)     | 800 (extra-bold) | 1.2         |
| `h2`         | 30px (1.875rem) | 600 (semi-bold)  | 1.3         |
| `h3`         | 24px (1.5rem)   | 600 (semi-bold)  | 1.4         |
| `h4`         | 20px (1.25rem)  | 600 (semi-bold)  | 1.4         |
| `p`, `input` | 16px (1rem)     | 400 (normal)     | 1.5         |
| `label`      | 14px (0.875rem) | 500 (medium)     | 1.4         |
| `button`     | 16px (1rem)     | 500 (medium)     | 1.5         |

## Spacing Scale

Base unit: **4px** (`0.25rem`)

| Class       | Value  | Pixels |
| ----------- | ------ | ------ |
| `gap-2`     | 0.5rem | 8px    |
| `gap-4`     | 1rem   | 16px   |
| `gap-6`     | 1.5rem | 24px   |
| `p-4`       | 1rem   | 16px   |
| `p-6`       | 1.5rem | 24px   |
| `space-y-4` | 1rem   | 16px   |
| `space-y-6` | 1.5rem | 24px   |

## Border Radius

| Variable      | Value        | Usage           |
| ------------- | ------------ | --------------- |
| `--radius`    | 0.5rem (8px) | Default         |
| `--radius-sm` | 4px          | Small elements  |
| `--radius-md` | 6px          | Medium elements |
| `--radius-lg` | 8px          | Large elements  |
| `--radius-xl` | 12px         | Extra large     |

## Shadows

```css
--shadow-sm:
  0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1);
--shadow-md:
  0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 2px 4px -1px hsl(0 0% 0% / 0.1);
--shadow-lg:
  0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 4px 6px -1px hsl(0 0% 0% / 0.1);
--shadow-xl:
  0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 8px 10px -1px hsl(0 0% 0% / 0.1);
```

**Usage:**

- `shadow-sm` → Small cards, hover states
- `shadow-md` → Standard cards
- `shadow-lg` → Modals, dialogs
- `shadow-xl` → Floating panels, tooltips

## Component Specifications

### Buttons

**Sizes:**

- Small (`sm`): 32px height (`h-8`), icon 12px (`h-3 w-3`)
- Default: 40px height (`h-10`), icon 16px (`h-4 w-4`)
- Large (`lg`): 48px height (`h-12`), icon 20px (`h-5 w-5`)

**Variants:**

- `default` → Primary (blue background)
- `outline` → Secondary (transparent with border)
- `ghost` → Tertiary (transparent, no border)
- `secondary` → Alternative secondary (subtle background)
- `destructive` → Delete actions (red background)
- `link` → Link style (underlined on hover)

**Reference:** `src/components/ButtonVariants.tsx`, `ButtonSizes.tsx`

### Inputs

**Standard Input:**

- Height: 40px (`h-10`)
- Border: `border-input` token
- Border-radius: `--radius` (0.5rem)
- Padding: 12px horizontal
- Font: 16px, regular weight
- Spacing: `gap-2` (8px) between label and input, `gap-6` (24px) between fields

**States:**

- Default: Gray border
- Focus: Blue ring (`ring-2 ring-ring`)
- Error: Red border (`border-destructive`) + error message
- Disabled: Gray background, cursor not-allowed

**Reference:** `src/components/FormInputsDemo.tsx`

### Cards

**Structure:**

- Background: `bg-card`
- Border: `border-border`
- Border-radius: `--radius` (0.5rem)
- Shadow: `shadow-sm` or `shadow-md`
- Padding: Handled by `CardContent` (typically 24px)
- Spacing: `space-y-6` (24px) between cards

**Components:**

- `CardHeader` → `CardTitle` + `CardDescription`
- `CardContent` → Main content
- `CardFooter` → Optional actions

**Reference:** `src/components/CardDemo.tsx`

### Tables

**Row Height:** 56px (default density)

**Structure:**

- `Table` → `TableHeader` → `TableRow` → `TableHead`
- `TableBody` → `TableRow` → `TableCell`
- Selected row: `bg-accent/30`
- Hover: Shows action buttons

**Reference:** `src/components/CustomerListDemo.tsx`

### Navigation Sidebar

**Dimensions:**

- Width: 240px (`w-60`)
- Height: Full screen (`h-screen`)

**Structure:**

- Logo section: 64px height (`h-16`)
- User profile section with role badge
- Navigation menu with expandable submenus
- Bottom section: Sync status, Settings, Help

**Reference:** `src/components/DesktopSidebar.tsx`

## Loading States

**Skeleton Components:**

- Uses shadcn/ui `Skeleton` component
- Shimmer animation via CSS
- Matches actual content layout

**Reference:** `src/components/CustomerListSkeleton.tsx`, `LoadingStateDemo.tsx`

## Empty States

**Structure:**

- Centered content with large icon (64-128px)
- Heading (h3)
- Description text
- Action buttons

**Reference:** `src/components/EmptyCustomerList.tsx`, `EmptySearchResults.tsx`

## Usage Guidelines

### ✅ DO's

1. **Use CSS Variables for Colors:**

   ```tsx
   <div className="bg-primary text-primary-foreground">
   ```

2. **Use Tailwind Spacing Classes:**

   ```tsx
   <div className="gap-4 p-6 space-y-6">
   ```

3. **Let Base Typography Apply:**

   ```tsx
   <h2>Title</h2> {/* Automatically styled */}
   ```

4. **Use Semantic Color Names:**
   ```tsx
   <Button variant="destructive">Delete</Button>
   ```

### ❌ DON'T's

1. **Don't Use Hardcoded Colors:**

   ```tsx
   // ❌ WRONG
   <div className="bg-blue-500">

   // ✅ CORRECT
   <div className="bg-primary">
   ```

2. **Don't Use Tailwind Typography Classes:**

   ```tsx
   // ❌ WRONG
   <h2 className="text-2xl font-semibold">

   // ✅ CORRECT
   <h2>Title</h2> {/* Base typography applies */}
   ```

3. **Don't Hardcode Font Families:**

   ```tsx
   // ❌ WRONG
   <p style={{ fontFamily: 'Inter, sans-serif' }}>

   // ✅ CORRECT
   <p style={{ fontFamily: 'var(--font-sans)' }}>
   ```

## Quick Reference

### Common Patterns

**Card Layout:**

```tsx
<div className="space-y-6">
  <Card>
    <CardHeader>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
    </CardHeader>
    <CardContent>{/* Content */}</CardContent>
  </Card>
</div>
```

**Form Field:**

```tsx
<div className="grid gap-2">
  <Label htmlFor="field">
    Label <span className="text-destructive">*</span>
  </Label>
  <Input id="field" className="h-10" />
  <p className="text-sm text-muted-foreground">Help text</p>
</div>
```

**Button Group:**

```tsx
<div className="flex gap-2">
  <Button variant="outline">Cancel</Button>
  <Button>Save</Button>
</div>
```

**Table Row:**

```tsx
<TableRow className={isSelected ? 'bg-accent/30' : ''}>
  <TableCell>Content</TableCell>
</TableRow>
```

## Accessibility

- WCAG 2.1 AA compliance required
- Minimum contrast: 4.5:1 for text, 3:1 for UI components
- Touch targets: 44px minimum (48px recommended)
- Focus indicators: 2px outline using `--ring` color
- ARIA labels required for icon-only buttons

## Mobile Considerations

- Touch targets: 48px minimum height
- Spacing: Adequate gaps for fat-finger usability
- Typography: Minimum 14px for body text
- Safe area insets: Use `.safe-area-bottom` class

## Reference Files

All specifications are extracted from:

- `EtroxTaran/Kompassuimusterbibliothek/src/styles/globals.css`
- `EtroxTaran/Kompassuimusterbibliothek/src/components/`
- `EtroxTaran/Kompassuimusterbibliothek/src/DESIGN_SYSTEM_UPDATE.md`

For complete details, see:

- `ui-ux/01-foundation/design-tokens.md` - Full design token documentation
- `ui-ux/02-core-components/` - Component-specific documentation
- `docs/design-system/github-ui-reference.md` - Workflow for using reference repository

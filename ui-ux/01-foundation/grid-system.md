# Grid System & Layout - Figma Make Prompt

## Context & Purpose

- **Component Type**: Layout Foundation
- **User Roles**: All (GF, PLAN, ADM, KALK, BUCH)
- **Usage Context**: Responsive grid system for all KOMPASS pages and components
- **Business Value**: Ensures consistent spacing, alignment, and responsive behavior across desktop, tablet, and mobile devices

## Design Requirements

### Visual Hierarchy

- **12-column grid** for desktop (1280px+ wide)
- **8-column grid** for tablet (768px-1279px)
- **4-column grid** for mobile (0-767px)
- Consistent gutters and margins for visual rhythm

### Layout Structure

- Container max-width: 1440px centered on larger screens
- Gutter width: 24px (desktop), 16px (tablet/mobile)
- Margin: 32px (desktop), 24px (tablet), 16px (mobile)
- Breakpoints: mobile (0px), tablet (768px), desktop (1280px), wide (1440px)

### shadcn/ui Components

- Uses Tailwind CSS grid utilities
- Responsive container component
- Flexbox for component-level layouts

## Grid System Specifications (from Reference Repository)

**Reference Source:** `ui-ux/Kompassuimusterbibliothek/src/components/CustomerListDemo.tsx` and layout patterns

The grid system uses Tailwind CSS utilities for responsive layouts.

**Desktop Layout (1280px+):**
Design a 12-column grid system with:

- Column count: 12 equal columns
- Gutter width: 24px between columns
- Outer margins: 32px on left and right
- Container max-width: 1440px, centered on screen
- Total content width at max: 1376px (1440 - 64px margins)
- Typical layouts: 3-column (4+4+4), 2-column (6+6), sidebar+main (3+9)

**Tablet Layout (768px-1279px):**
Design an 8-column grid system with:

- Column count: 8 equal columns
- Gutter width: 16px between columns
- Outer margins: 24px on left and right
- Container uses full width minus margins
- Typical layouts: 2-column (4+4), sidebar+main (2+6)

**Mobile Layout (0-767px):**
Design a 4-column grid system with:

- Column count: 4 equal columns
- Gutter width: 16px between columns
- Outer margins: 16px on left and right
- Container uses full width minus margins
- Most content spans full 4 columns
- Stacked layouts (vertical)

**Common Layout Patterns:**
Show examples of these layouts on the grid:

1. **Dashboard Layout**: Sidebar (3 cols) + Main content (9 cols) on desktop
2. **Form Layout**: Single column form centered (6-8 cols) on desktop
3. **List View**: Full-width table (12 cols) with filters sidebar (3 cols) optional
4. **Detail Page**: Tabs at top, content below in 2-column layout (6+6)
5. **Card Grid**: 3 cards across (4 cols each) on desktop, 2 on tablet, 1 on mobile

**Spacing System:**
Demonstrate consistent vertical rhythm:

- Section spacing: 48px between major sections
- Component spacing: 24px between related components
- Element spacing: 16px between form fields
- Inline spacing: 8px between buttons, badges, tags

**Visual Indicators:**

- Show grid columns in light red/pink overlay
- Show gutters in light blue
- Show margins in light green
- Label breakpoint widths clearly

Ensure all examples follow German business use cases (customer lists, project timelines, invoice forms).

## Interaction Patterns

- Grid is responsive and adapts automatically
- No user interaction required
- Components snap to grid columns
- Breakpoint transitions are smooth

## German Labels & Content

- **Spalten**: Columns
- **Abstand**: Gutter
- **Seitenrand**: Margin
- **Haltepunkt**: Breakpoint
- **Desktop-Ansicht**: Desktop view
- **Tablet-Ansicht**: Tablet view
- **Mobil-Ansicht**: Mobile view

## Accessibility Requirements

- Grid system is semantic (does not affect screen readers)
- Maintains logical reading order at all breakpoints
- Focus order follows visual layout
- No horizontal scrolling on any device

## Mobile Considerations

- Touch-friendly spacing (minimum 44px touch targets)
- Mobile-first approach: design for mobile, scale up
- Collapsible navigation on mobile
- Single-column layouts for readability
- Adequate spacing for fat-finger usability

## Example Data

**Dashboard Example:**

- Sidebar: 3 columns (navigation menu, filters)
- Main area: 9 columns (KPI cards in 3x3 grid, then full-width table)

**Customer Detail Page:**

- Mobile: Full-width stacked sections
- Tablet: 8-column full width with tabs
- Desktop: 12-column with optional sidebar for related entities

**Form Example:**

- Mobile: 4 columns (full width)
- Tablet: 6 columns centered (2 col margin each side)
- Desktop: 6 columns centered (3 col margin each side)

## Implementation Notes

### Tailwind Grid Classes (from Reference Repository)

**Reference Source:** `ui-ux/Kompassuimusterbibliothek/src/components/CustomerListDemo.tsx`

```tsx
// Responsive Grid: 1 col mobile, 2 tablet, 3 desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card>Card 1</Card>
  <Card>Card 2</Card>
  <Card>Card 3</Card>
</div>

// Card Spacing (from reference)
<div className="space-y-6">
  <Card>Card 1</Card>
  <Card>Card 2</Card>
</div>

// Form Grid: 2 columns on desktop, 1 on mobile
<div className="grid gap-6 md:grid-cols-2">
  <div className="grid gap-2">
    <Label>Field 1</Label>
    <Input />
  </div>
  <div className="grid gap-2">
    <Label>Field 2</Label>
    <Input />
  </div>
</div>

// Flex Layouts (from reference)
<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
  {/* Left section */}
  <div className="flex items-center gap-2 flex-1">
    {/* Search, Filter, etc. */}
  </div>
  {/* Right section */}
  <div className="flex items-center gap-2">
    {/* Actions */}
  </div>
</div>
```

**Spacing Patterns from Reference:**

- Card spacing: `space-y-6` (24px) between cards
- Form field spacing: `gap-2` (8px) between label and input, `gap-6` (24px) between fields
- Button groups: `gap-2` (8px) between buttons
- Control bar: `gap-4` (16px) between controls
- Section spacing: `space-y-4` (16px) or `space-y-8` (32px) for major sections

### Container Component

```html
<div class="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
  <!-- Content -->
</div>
```

### Breakpoint Reference

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      sm: "640px",
      md: "768px", // Tablet
      lg: "1024px",
      xl: "1280px", // Desktop
      "2xl": "1440px", // Wide
    },
  },
};
```

### Component Dependencies

- Requires design tokens (spacing scale)
- Used by all page layouts and components
- Foundation for responsive design system

### State Management

- No state management needed
- Grid is purely presentational CSS
- Responsive behavior handled by media queries

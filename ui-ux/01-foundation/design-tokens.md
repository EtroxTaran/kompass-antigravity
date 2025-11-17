# Design Tokens & Color System

## Reference Source

**GitHub UI Reference Repository:** `EtroxTaran/Kompassuimusterbibliothek`
- **Reference File:** `src/styles/globals.css`
- **Design System Documentation:** `src/DESIGN_SYSTEM_UPDATE.md`
- **Last Updated:** 2025-01-27

## Context & Purpose

- **Component Type**: Design System Foundation
- **User Roles**: All (GF, PLAN, ADM, KALK, BUCH)
- **Usage Context**: Core design system tokens used across all KOMPASS components
- **Business Value**: Ensures consistent branding, accessibility, and maintainability across the entire application

## Color System (OKLCH)

### Why OKLCH?

The design system uses **OKLCH color space** for:
- ✅ Perceptually uniform colors
- ✅ Better interpolation for gradients
- ✅ More vibrant, accurate colors
- ✅ Future-proof (CSS Color Level 4)

### Light Mode Colors

| Token | OKLCH Value | Usage |
|-------|-------------|-------|
| `--background` | `oklch(0.9824 0.0013 286.3757)` | Page background |
| `--foreground` | `oklch(0.3211 0 0)` | Primary text |
| `--card` | `oklch(1.0000 0 0)` | Card/modal backgrounds |
| `--card-foreground` | `oklch(0.3211 0 0)` | Card text |
| `--popover` | `oklch(1.0000 0 0)` | Popover backgrounds |
| `--popover-foreground` | `oklch(0.3211 0 0)` | Popover text |
| `--primary` | `oklch(0.6487 0.1538 150.3071)` | **Primary brand color (Blue-Green)** |
| `--primary-foreground` | `oklch(1.0000 0 0)` | Primary button text |
| `--secondary` | `oklch(0.6746 0.1414 261.3380)` | **Secondary color (Purple)** |
| `--secondary-foreground` | `oklch(1.0000 0 0)` | Secondary button text |
| `--accent` | `oklch(0.8269 0.1080 211.9627)` | Accent highlights (Light Blue) |
| `--accent-foreground` | `oklch(0.3211 0 0)` | Accent text |
| `--muted` | `oklch(0.8828 0.0285 98.1033)` | Muted backgrounds |
| `--muted-foreground` | `oklch(0.5382 0 0)` | Muted text |
| `--destructive` | `oklch(0.6368 0.2078 25.3313)` | Error/delete actions (Orange-Red) |
| `--destructive-foreground` | `oklch(1.0000 0 0)` | Destructive button text |
| `--border` | `oklch(0.8699 0 0)` | Border color (Light Gray) |
| `--input` | `oklch(0.8699 0 0)` | Input border color |
| `--ring` | `oklch(0.6487 0.1538 150.3071)` | Focus ring color |

### Dark Mode Colors

| Token | OKLCH Value | Usage |
|-------|-------------|-------|
| `--background` | `oklch(0.2303 0.0125 264.2926)` | Dark page background |
| `--foreground` | `oklch(0.9219 0 0)` | Light text |
| `--card` | `oklch(0.3210 0.0078 223.6661)` | Dark card backgrounds |
| `--card-foreground` | `oklch(0.9219 0 0)` | Dark card text |
| `--primary` | `oklch(0.6487 0.1538 150.3071)` | Same primary (consistent) |
| `--primary-foreground` | `oklch(1.0000 0 0)` | Primary button text |
| `--secondary` | `oklch(0.5880 0.0993 245.7394)` | Darker purple for dark mode |
| `--secondary-foreground` | `oklch(0.9219 0 0)` | Secondary button text |
| `--accent` | `oklch(0.6746 0.1414 261.3380)` | Brighter accent for dark mode |
| `--accent-foreground` | `oklch(0.9219 0 0)` | Accent text |
| `--muted` | `oklch(0.3867 0 0)` | Dark muted backgrounds |
| `--muted-foreground` | `oklch(0.7155 0 0)` | Muted text |
| `--destructive` | `oklch(0.6368 0.2078 25.3313)` | Error/delete actions |
| `--destructive-foreground` | `oklch(1.0000 0 0)` | Destructive button text |
| `--border` | `oklch(0.3867 0 0)` | Dark borders |
| `--input` | `oklch(0.3867 0 0)` | Input border color |
| `--ring` | `oklch(0.6487 0.1538 150.3071)` | Focus ring color |

### Chart Colors

Pre-defined colors for data visualization:

```css
--chart-1: oklch(0.6487 0.1538 150.3071); /* Primary Blue-Green */
--chart-2: oklch(0.6746 0.1414 261.3380); /* Purple */
--chart-3: oklch(0.8269 0.1080 211.9627); /* Light Blue */
--chart-4: oklch(0.5880 0.0993 245.7394); /* Deep Purple */
--chart-5: oklch(0.5905 0.1608 148.2409); /* Green */
```

### Sidebar Colors

Special color tokens for navigation sidebars:

```css
--sidebar: oklch(0.9824 0.0013 286.3757);           /* Background */
--sidebar-foreground: oklch(0.3211 0 0);            /* Text */
--sidebar-primary: oklch(0.6487 0.1538 150.3071);   /* Active items */
--sidebar-primary-foreground: oklch(1.0000 0 0);    /* Active text */
--sidebar-accent: oklch(0.8269 0.1080 211.9627);    /* Hover state */
--sidebar-accent-foreground: oklch(0.3211 0 0);     /* Hover text */
--sidebar-border: oklch(0.8699 0 0);                /* Dividers */
--sidebar-ring: oklch(0.6487 0.1538 150.3071);      /* Focus rings */
```

## Typography System

### Font Families

The design system includes **three professional font families**:

```css
--font-sans: Plus Jakarta Sans, sans-serif;    /* Primary UI font */
--font-serif: Source Serif 4, serif;           /* Editorial/headings */
--font-mono: JetBrains Mono, monospace;        /* Code/data */
```

**Google Fonts Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=JetBrains+Mono:wght@400;500;600&display=swap');
```

### Font Sizes

| Variable | Size | Usage | Element |
|----------|------|-------|---------|
| `--text-4xl` | 3rem (48px) | Extra large headings | `h1` |
| `--text-2xl` | 1.875rem (30px) | Large headings | `h2` |
| `--text-xl` | 1.5rem (24px) | Medium headings | `h3` |
| `--text-lg` | 1.25rem (20px) | Small headings | `h4` |
| `--text-base` | 1rem (16px) | Body text | `p`, `input` |
| `--text-sm` | 0.875rem (14px) | Small text | `label` |

### Font Weights

| Variable | Value | Usage |
|----------|-------|-------|
| `--font-weight-extra-bold` | 800 | Strongest emphasis (h1) |
| `--font-weight-bold` | 700 | Strong emphasis |
| `--font-weight-semi-bold` | 600 | Medium emphasis (h2-h4) |
| `--font-weight-medium` | 500 | Subtle emphasis (labels, buttons) |
| `--font-weight-normal` | 400 | Regular text |

### Base Typography Applied Automatically

All HTML elements have default typography applied via `@layer base`:
- `h1` → 48px, extra-bold, var(--font-sans), line-height: 1.2
- `h2` → 30px, semi-bold, var(--font-sans), line-height: 1.3
- `h3` → 24px, semi-bold, var(--font-sans), line-height: 1.4
- `h4` → 20px, semi-bold, var(--font-sans), line-height: 1.4
- `p` → 16px, normal, var(--font-sans), line-height: 1.5
- `label` → 14px, medium, var(--font-sans), line-height: 1.4
- `button` → 16px, medium, var(--font-sans), line-height: 1.5
- `input`, `textarea`, `select` → 16px, normal, var(--font-sans), line-height: 1.5

## Spacing & Layout

### Spacing Scale

```css
--spacing: 0.25rem; /* Base unit = 4px */
```

**Use Tailwind spacing classes which are multiples of 0.25rem:**
- `gap-2` = 0.5rem (8px)
- `gap-4` = 1rem (16px)
- `gap-6` = 1.5rem (24px)
- `p-4` = 1rem (16px)
- `mb-6` = 1.5rem (24px)

### Border Radius

| Variable | Value | Usage |
|----------|-------|-------|
| `--radius` | 0.5rem (8px) | Default radius |
| `--radius-sm` | calc(var(--radius) - 4px) | 4px |
| `--radius-md` | calc(var(--radius) - 2px) | 6px |
| `--radius-lg` | var(--radius) | 8px |
| `--radius-xl` | calc(var(--radius) + 4px) | 12px |

**Usage:**
```tsx
// Use Tailwind classes that map to radius variables
<div className="rounded-lg"> {/* = var(--radius-lg) */}
<Button className="rounded-md"> {/* = var(--radius-md) */}
```

## Shadows & Elevation

### Shadow Scale

```css
--shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
--shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
--shadow-sm: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10);
--shadow: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10);
--shadow-md: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10);
--shadow-lg: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10);
--shadow-xl: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10);
--shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.25);
```

**Usage Hierarchy:**
- `shadow-sm` → Small cards, hover states
- `shadow-md` → Standard cards
- `shadow-lg` → Modals, dialogs
- `shadow-xl` → Floating panels, tooltips
- `shadow-2xl` → Critical overlays

## Using the Design System

### ✅ DO's

**1. Use CSS Variables for Colors:**
```tsx
// ✅ Inline styles with CSS variables
<div style={{ 
  backgroundColor: 'var(--primary)',
  color: 'var(--primary-foreground)',
  borderColor: 'var(--border)'
}}>

// ✅ Tailwind classes that map to variables
<Button className="bg-primary text-primary-foreground">
<Card className="border-border">
```

**2. Use CSS Variables for Typography:**
```tsx
// ✅ Font weight with CSS variables
<h3 style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>

// ✅ Font family with CSS variables
<code style={{ fontFamily: 'var(--font-mono)' }}>

// ✅ Let base typography apply automatically
<h1>Title</h1> {/* Already styled via @layer base */}
```

**3. Use Tailwind Classes for Spacing/Layout:**
```tsx
// ✅ Spacing classes are fine (they use rem units)
<div className="p-4 gap-6 mb-8">

// ✅ Layout classes
<div className="grid grid-cols-1 md:grid-cols-2">
```

**4. Use Semantic Color Names:**
```tsx
// ✅ Semantic usage
<Button variant="destructive">Delete</Button>
<Badge className="bg-muted text-muted-foreground">Draft</Badge>
```

### ❌ DON'T's

**1. Don't Use Hardcoded Tailwind Color Classes:**
```tsx
// ❌ WRONG - Hardcoded colors
<div className="bg-blue-500 text-white">

// ❌ WRONG - Hardcoded border colors
<Card className="border-gray-200">

// ✅ CORRECT - Use variables
<div className="bg-primary text-primary-foreground">
<Card className="border-border">
```

**2. Don't Use Tailwind Typography Classes:**
```tsx
// ❌ WRONG - Typography classes
<h2 className="text-2xl font-semibold">

// ✅ CORRECT - CSS variables or let base apply
<h2 style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
// OR simply:
<h2>Title</h2> {/* Base typography applied automatically */}
```

**3. Don't Hardcode Font Families:**
```tsx
// ❌ WRONG
<p style={{ fontFamily: 'Inter, sans-serif' }}>

// ✅ CORRECT
<p style={{ fontFamily: 'var(--font-sans)' }}>
```

**4. Don't Use Arbitrary Values for Radius:**
```tsx
// ❌ WRONG
<Button className="rounded-[12px]">

// ✅ CORRECT
<Button className="rounded-xl"> {/* Uses var(--radius-xl) */}
```

## Implementation Notes

### CSS Variables Setup

The design system uses CSS custom properties defined in `apps/frontend/src/styles/globals.css`:

```css
:root {
  --background: oklch(0.9824 0.0013 286.3757);
  --foreground: oklch(0.3211 0 0);
  --primary: oklch(0.6487 0.1538 150.3071);
  --primary-foreground: oklch(1.0000 0 0);
  /* ... all color tokens */
  
  --font-sans: Plus Jakarta Sans, sans-serif;
  --font-serif: Source Serif 4, serif;
  --font-mono: JetBrains Mono, monospace;
  
  --radius: 0.5rem;
  --spacing: 0.25rem;
  
  /* Shadow tokens */
  --shadow-sm: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10);
  /* ... all shadow tokens */
}

.dark {
  /* Dark mode overrides */
  --background: oklch(0.2303 0.0125 264.2926);
  /* ... dark mode color tokens */
}
```

### Tailwind Configuration

The Tailwind config maps CSS variables to Tailwind utilities:

```javascript
// tailwind.config.cjs
module.exports = {
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        // ... additional colors
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
};
```

**Note:** The reference repository uses OKLCH colors, but Tailwind requires HSL format. The CSS variables use OKLCH directly, while Tailwind classes use HSL conversion.

### Component Dependencies
- No dependencies (this is the foundation)
- All other components will reference these tokens
- shadcn/ui components automatically use these tokens

### State Management
- Design tokens should be centralized in theme configuration
- No runtime state management needed
- Tokens are compile-time constants
- Dark mode toggled via `.dark` class on root element

## Accessibility Requirements

- WCAG 2.1 AA compliance for all color combinations
- Minimum contrast ratios enforced:
  - Normal text: 4.5:1
  - Large text (18px+): 3:1
  - UI components: 3:1
- Focus indicators: 2px solid outline with high contrast (uses `--ring` color)
- Color is never the only means of conveying information

All color combinations in the design system meet WCAG AA standards:
- Primary/Primary-foreground: ✅ Accessible
- Secondary/Secondary-foreground: ✅ Accessible
- Destructive/Destructive-foreground: ✅ Accessible
- Card/Card-foreground: ✅ Accessible

## Mobile Considerations

- Touch target minimum: 44x44px
- Spacing scales adapt for smaller screens
- Typography remains readable at mobile sizes (minimum 14px for body)
- Safe area insets supported via `.safe-area-bottom` class

## German Labels & Content

- **Primärfarbe**: Primary color
- **Sekundärfarbe**: Secondary color
- **Akzentfarbe**: Accent color
- **Fehlerfarbe**: Error/Destructive color
- **Textgrößen**: Text sizes
- **Abstände**: Spacing
- **Schatten**: Shadows

## Example Usage

**Primary Actions:**
```tsx
<Button className="bg-primary text-primary-foreground">
  Kunde anlegen
</Button>
```

**Status Indicators:**
```tsx
<Badge className="bg-destructive text-destructive-foreground">
  Sync fehlgeschlagen
</Badge>
```

**Cards:**
```tsx
<Card className="bg-card text-card-foreground border-border shadow-md">
  <CardHeader>
    <CardTitle>Kundenübersicht</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

## Updating the Design System

To update colors, typography, or other tokens:

1. **Edit `apps/frontend/src/styles/globals.css`**
2. **Update CSS variable values**
3. **Changes apply globally** - no component edits needed!

Example - Change primary color:
```css
:root {
  /* Old */
  --primary: oklch(0.6487 0.1538 150.3071);
  
  /* New - just update the value */
  --primary: oklch(0.6000 0.2000 180.0000);
}
```

All components using `bg-primary` will update automatically!


# Design Tokens & Color System - Figma Make Prompt

## Context & Purpose
- **Component Type**: Design System Foundation
- **User Roles**: All (GF, PLAN, ADM, KALK, BUCH)
- **Usage Context**: Core design system tokens used across all KOMPASS components
- **Business Value**: Ensures consistent branding, accessibility, and maintainability across the entire application

## Design Requirements

### Visual Hierarchy
- **Primary Brand Colors**: Professional blue palette for CRM/business software
- **Semantic Colors**: Success (green), warning (amber), error (red), info (blue)
- **Neutral Scale**: Comprehensive grayscale for backgrounds, borders, text
- **Typography Scale**: Clear hierarchy from headings to body text

### Layout Structure
- Token organization: Colors, Typography, Spacing, Shadows, Borders
- Light and dark mode support (MVP focuses on light mode)
- Accessibility-first: All color combinations meet WCAG 2.1 AA standards

### shadcn/ui Components
- Based on shadcn/ui default theme with customization
- Uses CSS variables for easy theming
- Tailwind CSS integration with custom configuration

## Figma Make Prompt

Create a comprehensive design token system for KOMPASS, a professional CRM and project management application for the German construction/interior design market. 

**Color Palette:**
Design a primary color palette using professional blues that convey trust and reliability. Include:
- Primary: Deep blue (#1e40af to #3b82f6 range) for main actions, links, and active states
- Secondary: Slate gray (#64748b) for less prominent elements
- Success: Green (#10b981) for positive actions and confirmations
- Warning: Amber (#f59e0b) for cautionary messages and pending states
- Error: Red (#ef4444) for errors and destructive actions
- Neutral: Comprehensive grayscale from white (#ffffff) through grays to near-black (#0f172a) with at least 10 steps

**Typography System:**
Create a type scale using modern, professional sans-serif fonts (Inter or similar):
- Headings: H1 (32px/bold), H2 (24px/semibold), H3 (20px/semibold), H4 (16px/semibold)
- Body: Regular (14px), Small (12px), Tiny (11px)
- Line heights: Headings 1.2, Body 1.5
- Font weights: Regular (400), Medium (500), Semibold (600), Bold (700)

**Spacing Scale:**
Define a consistent spacing system using 4px base unit:
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px, 3xl: 64px

**Shadows:**
Create subtle elevation system for depth:
- sm: Subtle shadow for cards
- md: Moderate shadow for modals
- lg: Heavy shadow for dropdowns

**Border Radius:**
- sm: 4px (buttons, inputs)
- md: 8px (cards)
- lg: 12px (modals)
- full: 9999px (badges, avatars)

**Accessibility Requirements:**
- All text on colored backgrounds must have 4.5:1 contrast ratio minimum
- Interactive elements must have 3:1 contrast ratio
- Focus states must be clearly visible with 2px outline

Display all tokens in an organized Figma file with:
- Color swatches with hex codes and usage notes
- Typography specimens showing all scales
- Spacing examples with pixel measurements
- Component examples showing tokens in use

## Interaction Patterns
- N/A (This is a static design system reference)
- Tokens should be exportable as CSS variables
- Light mode focus (dark mode deferred to Phase 2)

## German Labels & Content
- **Primärfarbe**: Primary color
- **Erfolgsfarbe**: Success color
- **Warnfarbe**: Warning color
- **Fehlerfarbe**: Error color
- **Textgrößen**: Text sizes
- **Abstände**: Spacing

## Accessibility Requirements
- WCAG 2.1 AA compliance for all color combinations
- Minimum contrast ratios enforced:
  - Normal text: 4.5:1
  - Large text (18px+): 3:1
  - UI components: 3:1
- Focus indicators: 2px solid outline with high contrast
- Color is never the only means of conveying information

## Mobile Considerations
- Touch target minimum: 44x44px
- Spacing scales adapt for smaller screens
- Typography remains readable at mobile sizes (minimum 14px for body)

## Example Data
**Primary Actions:**
- "Kunde anlegen" (Create Customer) - Primary blue button
- "Projekt starten" (Start Project) - Primary blue button

**Status Indicators:**
- Success: "Rechnung bezahlt" (Invoice paid) - Green
- Warning: "Zahlung überfällig" (Payment overdue) - Amber
- Error: "Sync fehlgeschlagen" (Sync failed) - Red

## Implementation Notes

### shadcn/ui Installation
```bash
npx shadcn-ui@latest init
```

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          foreground: '#ffffff',
        },
        // ... additional colors
      },
    },
  },
}
```

### CSS Variables
```css
:root {
  --primary: 217 91% 60%;
  --primary-foreground: 0 0% 100%;
  /* ... additional variables */
}
```

### Component Dependencies
- No dependencies (this is the foundation)
- All other components will reference these tokens

### State Management
- Design tokens should be centralized in theme configuration
- No runtime state management needed
- Tokens are compile-time constants


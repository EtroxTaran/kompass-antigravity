# Cards - Figma Make Prompt

## Context & Purpose

- **Component Type**: Card Container Component
- **User Roles**: All (GF, PLAN, ADM, KALK, BUCH)
- **Usage Context**: Content grouping, dashboards, list items, detail sections
- **Business Value**: Consistent content organization with clear visual hierarchy

## Design Requirements

### Visual Hierarchy

- **Header**: Title, optional description, optional actions
- **Content**: Main card body with flexible layout
- **Footer**: Optional actions, meta information, status
- **Visual separation**: Subtle borders and shadows for elevation

### Layout Structure

- Border: 1px solid light gray (#e5e7eb)
- Border-radius: 8px
- Padding: 24px (16px on mobile)
- Background: White
- Shadow: Subtle (0px 1px 3px rgba(0,0,0,0.05))
- Spacing between cards: 16px

### shadcn/ui Components

- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
- Composable structure for flexibility

## Figma Make Prompt

Create a versatile card component system for KOMPASS, a German CRM application. Design card layouts for dashboards, lists, detail sections, and special use cases with German content.

**Basic Card (Standard):**

- Container: White background, 1px solid border (#e5e7eb), 8px border-radius
- Shadow: Subtle (0px 1px 3px rgba(0,0,0,0.05))
- Padding: 24px
- Width: Flexible (adapts to grid)
- Content: Simple text or mixed content

**Card with Header:**
Structure:

1. **Header** (border-bottom 1px solid #f3f4f6, padding-bottom 16px):
   - Title: 18px, semibold, #1f2937, "Kundendaten"
   - Optional description: 14px, regular, #6b7280, "Grundlegende Informationen"
   - Optional actions: Icon button (Edit, More) at right
2. **Content** (padding-top 16px):
   - Main card body content
   - Can contain text, lists, forms, tables
3. **Footer** (optional, border-top 1px solid #f3f4f6, padding-top 16px):
   - Meta info or action buttons
   - Example: "Zuletzt aktualisiert: 15.11.2024" + "Bearbeiten" button

**KPI Card (Dashboard):**

- Compact card (200px × 120px minimum)
- Content layout:
  - Icon: Top-left (40px, blue circle background, white icon)
  - Label: Below icon (12px, gray), "Neue Kunden"
  - Value: Large (32px, bold, #1f2937), "127"
  - Trend: Bottom-right (14px), "+12%" in green with up arrow
- Background gradient option: Subtle gradient from white to light blue

**Customer Card (List Item):**

- Horizontal layout (full width)
- Left section:
  - Avatar/Logo: 48px circle, company initials or logo
- Middle section:
  - Company name: 16px, semibold, "Hofladen Müller GmbH"
  - VAT number: 14px, gray, "DE123456789"
  - Location: 12px, gray with pin icon, "München"
- Right section:
  - Rating: 5 stars (yellow), A-C badge
  - Status badge: "Aktiv" (green) or "Inaktiv" (gray)
  - Action menu: Three-dot icon button

**Project Card (Portfolio View):**

- Vertical card (300px wide)
- Header:
  - Project number: "P-2024-B023" (bold, 14px)
  - Status badge: "In Bearbeitung" (blue badge)
- Content:
  - Customer name: "REWE München Süd" (16px, semibold)
  - Date range: "15.10.2024 - 15.12.2024" (small, gray)
  - Progress bar: 65% complete (blue fill)
  - Budget: "€ 450.000" (large, bold)
  - Margin: "+15%" (green text)
- Footer:
  - Project manager avatar + name: "M. Schmidt"
  - Team size: "5 Mitarbeiter" with user icon

**Opportunity Card (Pipeline Kanban):**

- Vertical card (280px wide, draggable appearance)
- Header:
  - Company name: "Biomarkt Heidelberg" (bold)
  - Opportunity value: "€ 125.000" (prominent, large)
- Content:
  - Status: "Angebot erstellt" (status badge)
  - Probability: "75%" with progress circle
  - Next action: "Follow-up Termin: 20.11.2024" (with calendar icon)
- Footer:
  - Owner avatar + "A. Weber"
  - Last updated: "Vor 2 Tagen" (gray, small)
- Drag handle: Six-dot icon at top

**Activity Card (Timeline):**

- Horizontal card with left accent bar (4px, blue)
- Content:
  - Activity icon: Phone/Email/Meeting (24px circle)
  - Title: "Telefonat mit Hr. Müller" (14px, semibold)
  - Description: "Besprechung der neuen Produktlinie..." (14px, gray, truncated)
  - Timestamp: "Heute, 14:30 Uhr" (12px, gray)
  - User avatar + name: "M. Schmidt"

**Stats Card (Multi-value):**

- Card with 3-4 stats in grid layout
- Each stat:
  - Label: "Gesamt-Umsatz" (12px, gray, uppercase)
  - Value: "€ 2.450.000" (24px, bold)
  - Change: "+18%" (green, with up arrow)
- Dividers: 1px solid #f3f4f6 between stats

**Warning/Info Card:**

- Yellow background (#fef3c7) or blue background (#dbeafe)
- Alert icon at left (24px)
- Content:
  - Title: "Achtung: Zahlung überfällig" (bold)
  - Message: "Diese Rechnung ist seit 15 Tagen überfällig."
  - Action button: "Mahnung senden" (amber or blue)

**Collapsible Card:**

- Card with expandable content
- Header with chevron icon (right-aligned)
- Clicking header toggles content visibility
- Smooth height animation (300ms)
- Example: "Erweiterte Filteroptionen" (collapsed by default)

**Card Hover State:**

- On desktop: Subtle lift (shadow increases to 0px 4px 12px rgba(0,0,0,0.1))
- Border color slightly darkens
- Cursor: pointer (if clickable)
- Transition: 200ms ease

**Card Skeleton (Loading):**

- Same dimensions as actual card
- Shimmer animation through card areas
- Header: Title bar, description bar
- Content: 3-4 text lines as bars
- Footer: 2 small bars

**Card Action Patterns:**

- **Whole card clickable**: Subtle border highlight on hover, navigate to detail on click
- **Header actions**: Edit, Delete, More menu (icon buttons, top-right)
- **Footer actions**: Primary button (e.g., "Details anzeigen") or button group

Design in light mode with clean aesthetic. Ensure responsive behavior: cards stack on mobile, grid on desktop.

## Interaction Patterns

### Card Interactions

- **Hover**: Elevation increases, border subtly highlighted (desktop only)
- **Click**: Navigate to detail view or expand content
- **Focus**: Keyboard focus shows blue outline
- **Drag**: Opportunity cards are draggable in Kanban view

### Action Button Interactions

- Header actions: Edit, Delete, More menu
- Footer actions: Primary CTA or button group
- Action buttons independent of card click (stop propagation)

### States

- **Default**: Standard appearance, neutral
- **Hover**: Elevated (desktop), shows interaction affordance
- **Selected**: Blue border (multi-select scenarios)
- **Loading**: Skeleton animation
- **Empty**: Light gray background, dashed border, "Keine Daten" message
- **Disabled**: Reduced opacity, not clickable

## German Labels & Content

### Card Titles

- **Kundendaten**: Customer data
- **Projektdetails**: Project details
- **Aktivitäten**: Activities
- **Statistiken**: Statistics
- **Neue Kunden**: New customers
- **Offene Angebote**: Open opportunities
- **Überfällige Rechnungen**: Overdue invoices

### Card Actions

- **Bearbeiten**: Edit
- **Löschen**: Delete
- **Details anzeigen**: Show details
- **Weitere Aktionen**: More actions

### Status Badges

- **Aktiv**: Active
- **Inaktiv**: Inactive
- **In Bearbeitung**: In progress
- **Abgeschlossen**: Completed
- **Überfällig**: Overdue

### Meta Information

- **Zuletzt aktualisiert**: Last updated
- **Erstellt am**: Created on
- **Vor X Tagen**: X days ago
- **X Mitarbeiter**: X employees

## Accessibility Requirements

- WCAG 2.1 AA compliance
- Semantic HTML: `<article>` for card containers
- Headings: Proper hierarchy (h2, h3) for card titles
- Interactive cards: role="button" or proper link semantics
- Focus visible: 2px blue outline
- Keyboard navigation: Tab to focus card, Enter to activate
- Screen readers: Descriptive labels for actions
- Touch targets: 44px minimum for buttons/actions

## Mobile Considerations

- Cards stack vertically on mobile
- Reduced padding: 16px (vs 24px on desktop)
- Full-width cards on mobile
- Touch-friendly action buttons (48px minimum)
- Swipe actions option: Swipe left/right on card for quick actions
- Smaller font sizes: Title 16px (vs 18px), content 14px (vs 16px)

## Example Data

**Customer Card:**

- Company: "Hofladen Müller GmbH"
- VAT: "DE123456789"
- Location: "München"
- Rating: ⭐⭐⭐⭐⭐ (A)
- Status: "Aktiv" (green badge)

**Project Card:**

- Number: "P-2024-B023"
- Customer: "REWE München Süd"
- Dates: "15.10.2024 - 15.12.2024"
- Budget: "€ 450.000"
- Progress: 65%
- Manager: "M. Schmidt"

**KPI Card:**

- Label: "Neue Kunden"
- Value: "127"
- Trend: "+12% vs. Vormonat" (green)

**Activity Card:**

- Type: "Telefonat"
- Title: "Telefonat mit Hr. Müller"
- Description: "Besprechung der neuen Produktlinie für Q1 2025"
- Time: "Heute, 14:30 Uhr"
- User: "M. Schmidt"

## Implementation Notes

### shadcn/ui Installation

```bash
npx shadcn-ui@latest add card
```

### Basic Card Usage

```typescript
<Card>
  <CardHeader>
    <CardTitle>Kundendaten</CardTitle>
    <CardDescription>Grundlegende Informationen</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content here</p>
  </CardContent>
  <CardFooter>
    <Button>Bearbeiten</Button>
  </CardFooter>
</Card>
```

### KPI Card

```typescript
<Card className="p-6">
  <div className="flex items-start justify-between">
    <div>
      <p className="text-sm text-muted-foreground">Neue Kunden</p>
      <p className="text-3xl font-bold mt-2">127</p>
    </div>
    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
      <Users className="h-6 w-6 text-primary" />
    </div>
  </div>
  <p className="text-sm text-green-600 mt-4">
    +12% vs. Vormonat
  </p>
</Card>
```

### Component Dependencies

- Design tokens (colors, spacing, shadows)
- Icons from lucide-react
- Badge component for status indicators
- Button component for actions
- Avatar component for users

### State Management

- Card selection state (for multi-select)
- Expanded/collapsed state (for collapsible cards)
- Loading state (for skeleton display)
- Hover state (CSS only, no state management needed)

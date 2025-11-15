# Breadcrumbs - Figma Make Prompt

## Context & Purpose

- **Component Type**: Breadcrumb Navigation
- **User Roles**: All (GF, PLAN, ADM, KALK, BUCH)
- **Usage Context**: Page navigation, showing current location hierarchy
- **Business Value**: Helps users understand location and navigate back easily

## Design Requirements

### Visual Hierarchy

- **Horizontal path**: Home → Section → Subsection → Current
- **Separators**: Chevron or slash between items
- **Current page**: Bold or plain text (not linked)
- **Links**: Previous pages are clickable

### Layout Structure

- Height: 32px
- Position: Top of page, below header
- Font: 14px
- Gap: 8px between items and separators
- Max items: 5-6 before truncation

### shadcn/ui Components

- `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbSeparator`, `BreadcrumbPage`

## Figma Make Prompt

Create breadcrumb navigation components for KOMPASS, a German CRM application. Design breadcrumb trails showing hierarchical navigation paths with German labels and clear visual hierarchy.

**Standard Breadcrumb:**

**Structure:**

- Horizontal layout, left-aligned
- Items separated by chevron-right icon (16px, gray)
- Font: 14px
- Color: Gray (#6b7280) for links, dark (#1f2937) for current page

**Breadcrumb Items:**

1. **Home/Dashboard (First Item):**
   - Icon: Home (16px) or text "Dashboard"
   - Color: Gray
   - Clickable: Links to dashboard
   - Hover: Underline, darker gray

2. **Intermediate Items (Links):**
   - Text: Entity or section name
   - Color: Gray (#6b7280)
   - Clickable: Links to parent pages
   - Hover: Underline, darker gray (#374151)
   - Examples: "Kunden", "Hofladen Müller GmbH", "Standorte"

3. **Separator:**
   - Icon: ChevronRight (16px)
   - Color: Light gray (#d1d5db)
   - Not clickable
   - Gap: 8px on each side

4. **Current Page (Last Item):**
   - Text: Current page name
   - Color: Dark (#1f2937)
   - Font-weight: Semibold (optional)
   - Not clickable, no hover state
   - Example: "Standort München Süd"

**Example Breadcrumbs:**

**Customer Detail:**
Dashboard > Kunden > Hofladen Müller GmbH

**Location Detail:**
Dashboard > Kunden > Hofladen Müller GmbH > Standorte > Standort München Süd

**Project Detail:**
Dashboard > Projekte > P-2024-B023

**Invoice Detail:**
Dashboard > Rechnungen > R-2024-00456

**Settings Page:**
Dashboard > Einstellungen > Profil

**Truncated Breadcrumb (Long Paths):**

- When breadcrumb exceeds 6 items or 800px width
- Middle items collapsed to ellipsis "..."
- Example: Dashboard > Kunden > ... > Standorte > Standort München Süd
- Click ellipsis: Opens dropdown with hidden items
- Always show: Home, parent, current (3 items minimum)

**Ellipsis Dropdown:**

- Trigger: "..." text (clickable)
- Dropdown menu appears below
- Menu shows hidden breadcrumb items as list
- Each item clickable, navigates to that level
- Width: Auto, max 300px
- Example hidden items:
  - Hofladen Müller GmbH
  - Kontakte
  - Hans Müller

**Responsive Breadcrumb (Mobile):**

- On small screens (<640px):
  - Option 1: Show only last 2 items "< Parent Name"
  - Option 2: Collapse to back button "< Zurück"
  - Option 3: Horizontal scroll for full breadcrumb
- Back button:
  - ChevronLeft icon + "Zurück" or parent name
  - Takes less space than full breadcrumb

**Breadcrumb with Icons:**

- Each item can have icon at left (20px)
- Gap: 8px between icon and text
- Icons: Home, Users (Kunden), Briefcase (Projekte), FileText (Rechnungen)
- Example: 🏠 Dashboard > 👥 Kunden > [Company Name]

**Dropdown Breadcrumb Item:**

- Some items expandable to show siblings
- ChevronDown icon after item name
- Click to open dropdown with sibling pages
- Example: "Kunden ▾" opens list of other customers
- Use for: Quick switching between similar items

**Breadcrumb Variants:**

1. **Compact:**
   - Smaller font (12px)
   - Smaller separators (12px)
   - Less padding
   - Use in: Tight spaces, dashboards

2. **Standard:**
   - 14px font
   - 16px separators
   - Normal spacing
   - Use in: Most pages

3. **Large:**
   - 16px font
   - 20px separators
   - More padding
   - Use in: Important pages, headers

**Breadcrumb Positioning:**

- Below top navigation bar
- Above page title
- Or: Beside page title on same line
- Margin-bottom: 16px (space before content)

**Keyboard Navigation:**

- Tab: Focus on first breadcrumb link
- Tab again: Move to next link
- Enter: Activate focused link
- Escape: Close ellipsis dropdown (if open)

Design with clear hierarchy and easy-to-click links.

## Interaction Patterns

### Navigation

1. User clicks breadcrumb link
2. Navigate to that page
3. Breadcrumb updates to reflect new location
4. Previous page now appears in breadcrumb trail

### Ellipsis Dropdown

1. User clicks "..." ellipsis
2. Dropdown opens showing hidden items
3. User clicks item from dropdown
4. Navigate to selected page
5. Dropdown closes

### Hover States

- Link hover: Underline, darker color
- No hover on current page (not clickable)
- Separator: No hover state

## German Labels & Content

### Common Breadcrumb Labels

- **Dashboard**: Dashboard
- **Kunden**: Customers
- **Standorte**: Locations
- **Kontakte**: Contacts
- **Projekte**: Projects
- **Rechnungen**: Invoices
- **Angebote**: Offers
- **Aktivitäten**: Activities
- **Einstellungen**: Settings
- **Profil**: Profile
- **Berichte**: Reports
- **Zurück**: Back

### Entity Names

- Use actual entity names: "Hofladen Müller GmbH", "P-2024-B023", "R-2024-00456"
- Truncate long names: "Hofladen Müller GmbH und..." (with tooltip showing full name)

## Accessibility Requirements

- WCAG 2.1 AA compliance
- Nav element: aria-label="Breadcrumb"
- List: <ol> for semantic ordering
- Current page: aria-current="page"
- Links: Clear text, not icon-only
- Focus visible: 2px blue outline
- Screen reader announces: "Breadcrumb navigation", "Current page: [name]"
- Sufficient color contrast: 4.5:1

## Mobile Considerations

- Collapse to back button on mobile
- Or horizontal scroll for full breadcrumb
- Larger touch targets (44px height)
- Simplified: Only show "< Parent Name"
- Position: Sticky at top when scrolling (optional)

## Example Data

**Customer Detail Page:**

- Breadcrumb: Dashboard > Kunden > Hofladen Müller GmbH
- Clickable: Dashboard, Kunden
- Current: Hofladen Müller GmbH

**Location Detail (Deep):**

- Breadcrumb: Dashboard > Kunden > Hofladen Müller GmbH > Standorte > Standort München Süd
- Clickable: Dashboard, Kunden, Hofladen Müller GmbH, Standorte
- Current: Standort München Süd

**Settings Profile:**

- Breadcrumb: Dashboard > Einstellungen > Profil
- Clickable: Dashboard, Einstellungen
- Current: Profil

**Mobile (Customer Detail):**

- Breadcrumb: < Kunden
- Clicking: Returns to customer list

## Implementation Notes

### shadcn/ui Installation

```bash
npx shadcn-ui@latest add breadcrumb
```

### Breadcrumb Usage

```typescript
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/kunden">Kunden</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Hofladen Müller GmbH</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### With Dropdown

```typescript
<BreadcrumbItem>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <BreadcrumbEllipsis />
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem>Hidden Item 1</DropdownMenuItem>
      <DropdownMenuItem>Hidden Item 2</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</BreadcrumbItem>
```

### Component Dependencies

- Design tokens (colors, spacing)
- Icons from lucide-react (Home, ChevronRight, ChevronDown, ChevronLeft)
- Next.js Link or React Router Link for navigation
- Dropdown menu for ellipsis expansion

### State Management

- Breadcrumb trail derived from current route/page
- No internal state needed (presentation only)
- Ellipsis dropdown open/close state (local)

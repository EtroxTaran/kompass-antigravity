# Badges & Status Indicators - Figma Make Prompt

## Context & Purpose

- **Component Type**: Badge & Status Indicator Components
- **User Roles**: All (GF, PLAN, ADM, KALK, BUCH)
- **Usage Context**: Status display, counts, labels, tags
- **Business Value**: Visual categorization and quick status recognition

## Design Requirements

### Visual Hierarchy

- **Status Badges**: Color-coded for quick scanning (green=active, red=overdue, amber=pending)
- **Count Badges**: Notification counts, item counts
- **Role Badges**: User role indicators (GF, PLAN, ADM, etc.)
- **Tag Badges**: Categories, labels, keywords

### Layout Structure

- Height: 24px (default), 20px (small), 28px (large)
- Padding: 8px horizontal, 4px vertical
- Border-radius: 12px (pill shape)
- Font: 12px (default), 11px (small), 13px (large), medium weight

### shadcn/ui Components

- `Badge` with variants: default, secondary, destructive, outline, success

## Figma Make Prompt

Create a comprehensive badge and status indicator system for KOMPASS, a German CRM application. Design badge variants for status, counts, roles, and tags with German labels and appropriate color coding.

**Standard Badge (Default):**

- Background: Light gray (#f3f4f6)
- Text: Dark gray (#374151), 12px, medium weight
- Height: 24px
- Padding: 8px horizontal, 4px vertical
- Border-radius: 12px (pill shape)
- Example: "Standard"

**Status Badges (Semantic Colors):**

1. **Success Badge (Active/Completed):**
   - Background: Light green (#d1fae5)
   - Text: Dark green (#065f46), 12px, semibold
   - Border: 1px solid green (#10b981) optional
   - Examples: "Aktiv", "Abgeschlossen", "Bezahlt", "Erfolgreich"

2. **Warning Badge (Pending/In Progress):**
   - Background: Light amber (#fef3c7)
   - Text: Dark amber (#92400e), 12px, semibold
   - Border: 1px solid amber (#f59e0b) optional
   - Examples: "Ausstehend", "In Bearbeitung", "Überfällig"

3. **Error/Destructive Badge (Inactive/Failed):**
   - Background: Light red (#fee2e2)
   - Text: Dark red (#991b1b), 12px, semibold
   - Border: 1px solid red (#ef4444) optional
   - Examples: "Inaktiv", "Fehlgeschlagen", "Storniert", "Abgelehnt"

4. **Info Badge (Neutral):**
   - Background: Light blue (#dbeafe)
   - Text: Dark blue (#1e40af), 12px, semibold
   - Border: 1px solid blue (#3b82f6) optional
   - Examples: "Neu", "Info", "Entwurf"

**Count Badges (Notification Style):**

- Shape: Circle (20px diameter) or pill (if count >99)
- Background: Red (#ef4444)
- Text: White, 11px, bold, centered
- Position: Top-right of parent element (absolute positioning)
- Examples: "3", "12", "99+"
- Use for: Unread notifications, pending items, sync queue count

**Role Badges:**
Design badges for RBAC roles with distinct colors:

1. **GF (Geschäftsführung/CEO):**
   - Background: Purple (#f3e8ff)
   - Text: Dark purple (#6b21a8)
   - Icon (optional): Crown
   - Text: "GF"

2. **PLAN (Planning):**
   - Background: Blue (#dbeafe)
   - Text: Dark blue (#1e40af)
   - Icon: Briefcase
   - Text: "PLAN"

3. **ADM (Sales Field):**
   - Background: Green (#d1fae5)
   - Text: Dark green (#065f46)
   - Icon: Users
   - Text: "ADM"

4. **KALK (Cost Estimation):**
   - Background: Amber (#fef3c7)
   - Text: Dark amber (#92400e)
   - Icon: Calculator
   - Text: "KALK"

5. **BUCH (Accounting):**
   - Background: Slate (#f1f5f9)
   - Text: Dark slate (#1e293b)
   - Icon: Receipt
   - Text: "BUCH"

**Priority Badges:**

1. **High Priority:**
   - Background: Red (#fee2e2)
   - Text: "Hoch" (dark red)
   - Icon: AlertCircle (red, 14px)

2. **Medium Priority:**
   - Background: Amber (#fef3c7)
   - Text: "Mittel" (dark amber)
   - Icon: AlertTriangle (amber, 14px)

3. **Low Priority:**
   - Background: Gray (#f3f4f6)
   - Text: "Niedrig" (dark gray)
   - Icon: Circle (gray, 14px)

**Tag Badges (Categories):**

- Background: White
- Border: 1px solid gray (#d1d5db)
- Text: Gray (#374151), 12px
- Height: 24px
- Removable: "×" icon on right (optional)
- Hover: Slight background tint (#f9fafb)
- Examples: "Großkunde", "VIP", "Landwirtschaft", "Bio"

**Badge with Icon:**

- Icon position: Left of text, 14px size
- Gap: 4px between icon and text
- Icon color: Matches text color
- Examples:
  - CheckCircle + "Aktiv"
  - AlertCircle + "Ausstehend"
  - XCircle + "Inaktiv"

**Badge Sizes:**

1. **Small (sm):**
   - Height: 20px
   - Padding: 6px horizontal, 2px vertical
   - Font: 11px
   - Use for: Compact layouts, table cells

2. **Default:**
   - Height: 24px
   - Padding: 8px horizontal, 4px vertical
   - Font: 12px
   - Use for: Most contexts

3. **Large (lg):**
   - Height: 28px
   - Padding: 12px horizontal, 6px vertical
   - Font: 13px
   - Use for: Prominent status displays

**Outline Badge:**

- Background: Transparent
- Border: 1px solid (color varies by type)
- Text: Color matches border
- Use for: Less prominent status indicators
- Example: Outlined "Entwurf" (draft) badge

**Badge in Context Examples:**

1. **Customer List Table:**
   - Status column: "Aktiv" (green badge), "Inaktiv" (red badge)
   - Rating column: "A" (green), "B" (amber), "C" (gray) badges
   - Tags: Multiple tag badges in "Categories" column

2. **User Profile:**
   - Role badge: "ADM" next to user name
   - Status badge: "Online" (green dot + badge)

3. **Notification Icon:**
   - Count badge: Red circle with "5" on bell icon (top-right)

4. **Project Card:**
   - Status badge: "In Bearbeitung" (amber)
   - Priority badge: "Hoch" (red with icon)
   - Team size badge: "5 Mitarbeiter" (gray)

5. **Invoice Status:**
   - Payment status: "Bezahlt" (green), "Überfällig" (red), "Ausstehend" (amber)
   - GoBD indicator: "Abgeschlossen" (gray, immutable badge)

**Interactive Badges (Removable Tags):**

- Hover state: Slightly darker background
- Remove "×" icon: 14px, appears on hover or always visible
- Click "×": Removes badge from view
- Example: Filter tags that can be removed

**Badge Animations:**

- Pulse animation for notification count changes
- Fade in/out when added/removed
- Smooth color transitions (200ms) when status changes

Design all badges with clear legibility and sufficient contrast (WCAG AA).

## Interaction Patterns

### Static Badges

- No interaction (display only)
- Hover: No change (unless removable)
- Click: No action

### Removable Tag Badges

- Hover: Background slightly darker
- Click "×": Fade out and remove (300ms animation)
- Focus: Blue outline on "×" button

### Count Badges

- Update: Pulse animation when count changes
- Click parent element: Open related content (e.g., notifications)

## German Labels & Content

### Status Labels

- **Aktiv**: Active
- **Inaktiv**: Inactive
- **In Bearbeitung**: In progress
- **Abgeschlossen**: Completed
- **Ausstehend**: Pending
- **Überfällig**: Overdue
- **Bezahlt**: Paid
- **Unbezahlt**: Unpaid
- **Neu**: New
- **Entwurf**: Draft
- **Storniert**: Cancelled
- **Fehlgeschlagen**: Failed

### Priority Labels

- **Hoch**: High
- **Mittel**: Medium
- **Niedrig**: Low

### Role Labels

- **GF**: CEO
- **PLAN**: Planning
- **ADM**: Sales
- **KALK**: Estimation
- **BUCH**: Accounting

## Accessibility Requirements

- WCAG 2.1 AA contrast: 4.5:1 for text on background
- Color is not the only indicator (text/icons also used)
- Screen reader text: aria-label for icon-only badges
- Removable badges: aria-label="[Tag] entfernen" on close button
- Semantic HTML: `<span>` with appropriate class/role
- Keyboard accessible: Removable badge "×" focusable with Tab

## Mobile Considerations

- Slightly larger badges on mobile (26px height vs 24px)
- Touch-friendly remove button (28px hit area)
- Adequate spacing between badges (8px gap minimum)
- Badges wrap to multiple lines if needed

## Example Data

**Customer Status:**

- "Aktiv" (green) - 85% of customers
- "Inaktiv" (red) - 15% of customers

**Project Status:**

- "Neu" (blue)
- "In Bearbeitung" (amber)
- "Abgeschlossen" (green)
- "Storniert" (red)

**Invoice Payment Status:**

- "Bezahlt" (green)
- "Ausstehend" (amber)
- "Überfällig" (red)

**User Roles:**

- "Michael Schmidt" - "ADM" badge (green)
- "Dr. Anna Weber" - "GF" badge (purple)
- "Thomas Fischer" - "PLAN" badge (blue)

**Notification Count:**

- Bell icon with "3" badge (red circle)
- Sync status with "5 ausstehend" badge (amber)

## Implementation Notes

### shadcn/ui Installation

```bash
npx shadcn-ui@latest add badge
```

### Badge Usage

```typescript
import { Badge } from '@/components/ui/badge';

// Status badges
<Badge variant="success">Aktiv</Badge>
<Badge variant="warning">Ausstehend</Badge>
<Badge variant="destructive">Inaktiv</Badge>

// Role badge
<Badge variant="outline" className="bg-purple-50 text-purple-900">
  GF
</Badge>

// Count badge (notification)
<div className="relative">
  <BellIcon />
  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
    3
  </Badge>
</div>

// Tag badge (removable)
<Badge variant="outline">
  Großkunde
  <button className="ml-1" aria-label="Tag entfernen">
    <X className="h-3 w-3" />
  </button>
</Badge>
```

### Custom Variants

```typescript
// Define custom badge variants in component
const badgeVariants = {
  success: "bg-green-100 text-green-900",
  warning: "bg-amber-100 text-amber-900",
  info: "bg-blue-100 text-blue-900",
};
```

### Component Dependencies

- Design tokens (colors for semantic variants)
- Icons from lucide-react (CheckCircle, AlertCircle, X)
- Conditional styling for variants

### State Management

- Badge content from application state
- Count badges updated when data changes
- Removable tags trigger callback on removal

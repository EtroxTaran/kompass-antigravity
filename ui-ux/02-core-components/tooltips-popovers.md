# Tooltips & Popovers - Figma Make Prompt

## Context & Purpose

- **Component Type**: Tooltip and Popover Components
- **User Roles**: All (GF, PLAN, ADM, KALK, BUCH)
- **Usage Context**: Contextual help, additional information, quick actions
- **Business Value**: Provides help without cluttering UI, explains functionality

## Design Requirements

### Visual Hierarchy

- **Tooltips**: Small, text-only, immediate hover
- **Popovers**: Larger, rich content, click to open
- **Arrow/pointer**: Indicates anchor element
- **Backdrop**: Optional dark overlay for popovers

### Layout Structure

- Tooltip: Max width 200px, auto height
- Popover: Width 200-400px, auto or fixed height
- Position: Above, below, left, or right of anchor
- Arrow: 8px triangle pointing to anchor
- Shadow: Subtle for depth

### shadcn/ui Components

- `Tooltip`, `TooltipProvider`, `TooltipTrigger`, `TooltipContent`
- `Popover`, `PopoverTrigger`, `PopoverContent`
- `HoverCard` for rich hover content

## Figma Make Prompt

Create comprehensive tooltip and popover components for KOMPASS, a German CRM application. Design simple tooltips for help text and rich popovers for detailed information with German labels.

**Simple Tooltip:**

**Appearance:**

- Background: Dark gray (#1f2937), 95% opacity
- Text: White, 12px, regular weight
- Padding: 8px 12px
- Border-radius: 6px
- Max-width: 200px, wraps to multiple lines
- Arrow: 8px triangle, same color as background
- Shadow: 0px 2px 8px rgba(0,0,0,0.15)
- Font: 12px, line-height 1.4

**Positioning:**

- Default: Above anchor element
- Falls back to below if no space above
- Centered on anchor element
- Arrow points to center of anchor
- Offset: 8px from anchor element

**Behavior:**

- Trigger: Mouse hover (desktop), long press (mobile)
- Delay: 500ms after hover starts
- Duration: Stays visible while hovering anchor or tooltip
- Dismisses: Mouse leaves anchor (200ms delay)
- No dismiss button (auto-dismisses)

**Content Examples:**

- Icon button: "Kunde bearbeiten"
- Truncated text: Full text "Hofladen Müller GmbH und Partner KG"
- Status badge: "Aktiv: Der Kunde ist aktuell aktiv und kann kontaktiert werden"
- Help icon: "Die Umsatzsteuer-ID besteht aus DE gefolgt von 9 Ziffern"

**Multi-line Tooltip:**

- Max width: 200px
- Text wraps to multiple lines
- Example: "Dieser Kunde hat 3 offene Angebote im Wert von insgesamt € 125.000"

**Tooltip with Shortcut:**

- Bottom line shows keyboard shortcut
- Divider: 1px solid white (30% opacity)
- Example: "Kunde bearbeiten" (top) | "Cmd+E" (bottom, smaller, gray)

**Rich Popover:**

**Appearance:**

- Background: White
- Border: 1px solid #e5e7eb
- Border-radius: 8px
- Shadow: 0px 4px 12px rgba(0,0,0,0.15)
- Arrow: 10px triangle, white with border
- Width: Auto (200-400px) or fixed
- Max-height: 400px, scrollable if content exceeds

**Header (Optional):**

- Padding: 16px
- Border-bottom: 1px solid #e5e7eb
- Title: 16px, semibold, #1f2937
- Close button: "×" (20px) at top-right

**Content:**

- Padding: 16px
- Can include: Text, lists, forms, buttons, images
- Font: 14px, regular, #374151
- Scrollable if content tall

**Footer (Optional):**

- Padding: 12px 16px
- Border-top: 1px solid #e5e7eb
- Buttons: Action buttons (primary/secondary)
- Right-aligned or full-width

**Trigger:**

- Click to open (desktop/mobile)
- Click outside or Escape key to close
- Or: Close button in header

**Use Cases:**

1. **User Profile Popover:**
   - Trigger: Click on user avatar
   - Content:
     - Avatar (large, 64px)
     - Name: "Michael Schmidt"
     - Role: "Außendienst" (ADM badge)
     - Email: "m.schmidt@kompass.de"
     - Actions: "Profil anzeigen", "Abmelden" buttons
   - Width: 280px

2. **Filter Popover:**
   - Trigger: Click "Filter" icon button
   - Content:
     - Multiple filter controls (checkboxes, date pickers)
     - Apply and Reset buttons at bottom
   - Width: 320px
   - Position: Below trigger, right-aligned

3. **Quick Actions Popover:**
   - Trigger: Click "..." more actions button
   - Content: Action list
     - "Bearbeiten" (with icon)
     - "Duplizieren" (with icon)
     - Divider
     - "Löschen" (red, with icon)
   - Width: 200px
   - Similar to dropdown menu but uses popover

4. **Help Popover:**
   - Trigger: Click "?" help icon
   - Content:
     - Title: "Hilfe: Umsatzsteuer-ID"
     - Description: Explanation text (multiple paragraphs)
     - Example: "DE123456789"
     - Link: "Mehr erfahren →"
   - Width: 360px

5. **Info Popover (Hover Card):**
   - Trigger: Hover over customer name link
   - Content:
     - Company name (bold)
     - VAT number
     - Location
     - Status badge
     - Quick stats: "3 aktive Projekte", "€ 150.000 Umsatz"
   - Width: 320px
   - Auto-dismisses when hover leaves

**Tooltip Variants:**

1. **Default (Dark):**
   - Background: Dark gray (#1f2937)
   - Text: White
   - Use for: Most tooltips

2. **Light:**
   - Background: White
   - Border: 1px solid #e5e7eb
   - Text: Black
   - Use for: Tooltips on dark backgrounds

3. **Error:**
   - Background: Red (#ef4444)
   - Text: White
   - Use for: Error explanations

4. **Warning:**
   - Background: Amber (#f59e0b)
   - Text: White
   - Use for: Warning messages

**Popover Variants:**

1. **Standard:**
   - White background, border, shadow
   - Use for: Most popovers

2. **Menu:**
   - No padding in content area
   - List items with hover states
   - Use for: Action menus, dropdowns

3. **Form:**
   - Includes form fields
   - Footer with submit/cancel buttons
   - Use for: Quick forms, filters

**Positioning:**

- Preferred: Above or below anchor (more space)
- Alternative: Left or right of anchor
- Auto-adjust: Flips if no space in preferred direction
- Arrow always points to anchor

**Arrow Positioning:**

- Centered on anchor element
- Or: Offset to align with click point
- Arrow size: 8-10px triangle
- Arrow border matches popover border

**Backdrop (Optional):**

- For modal-like popovers
- Semi-transparent dark overlay (#000, 30% opacity)
- Click backdrop to close popover
- Use for: Important popovers that need focus

Design with clear visual hierarchy and smooth animations (200ms).

## Interaction Patterns

### Tooltip Interaction

1. User hovers element (desktop)
2. 500ms delay
3. Tooltip fades in (200ms)
4. User moves mouse away
5. 200ms delay
6. Tooltip fades out

### Popover Interaction

1. User clicks trigger
2. Popover opens with animation (200ms scale + fade)
3. Focus moves to first interactive element (if any)
4. User interacts with content
5. User clicks outside or presses Escape
6. Popover closes with animation

### Hover Card Interaction

1. User hovers trigger link
2. Short delay (300ms)
3. Hover card appears
4. User can move mouse to card to interact
5. User moves mouse away
6. Card disappears after delay

## German Labels & Content

### Common Tooltip Text

- **Bearbeiten**: Edit
- **Löschen**: Delete
- **Mehr Optionen**: More options
- **Hilfe**: Help
- **Informationen**: Information
- **Schließen**: Close
- **Filter anwenden**: Apply filters
- **Zurücksetzen**: Reset

### Popover Headers

- **Profil**: Profile
- **Benutzerinformationen**: User information
- **Filter**: Filters
- **Einstellungen**: Settings
- **Hilfe**: Help
- **Details**: Details

### Buttons

- **Anwenden**: Apply
- **Abbrechen**: Cancel
- **Speichern**: Save
- **Schließen**: Close
- **Mehr erfahren**: Learn more

## Accessibility Requirements

- WCAG 2.1 AA compliance
- Tooltip: role="tooltip", aria-describedby on anchor
- Popover: role="dialog" (if modal), aria-labelledby
- Keyboard trigger: Show tooltip on focus (not just hover)
- Escape key closes popover
- Focus trap in modal popovers
- Focus returns to trigger on close
- Screen reader announces tooltip content
- Sufficient contrast: 4.5:1 for text

## Mobile Considerations

- Tooltips: Long press to show (500ms), tap outside to dismiss
- Popovers: Full-screen or bottom sheet on mobile
- Larger close button (48px) for touch
- No hover-only tooltips (use click or info icons)
- Swipe down to close bottom sheet popovers

## Example Data

**Edit Button Tooltip:**

- Trigger: Hover/focus on pencil icon button
- Content: "Kunde bearbeiten"
- Shortcut: "Cmd+E"

**User Avatar Popover:**

- Trigger: Click on avatar
- Content: Avatar, "Michael Schmidt", "ADM", "m.schmidt@kompass.de"
- Actions: "Profil anzeigen", "Abmelden"

**Customer Name Hover Card:**

- Trigger: Hover "Hofladen Müller GmbH" link
- Content: Company name, VAT, location, status, "3 aktive Projekte"

**Help Popover:**

- Trigger: Click "?" next to "Umsatzsteuer-ID" label
- Content: Explanation of VAT ID format, example, "Mehr erfahren" link

## Implementation Notes

### shadcn/ui Installation

```bash
npx shadcn-ui@latest add tooltip
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add hover-card
```

### Tooltip Usage

```typescript
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost" size="icon">
        <Pencil className="h-4 w-4" />
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Kunde bearbeiten</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

### Popover Usage

```typescript
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Filter</Button>
  </PopoverTrigger>
  <PopoverContent className="w-80">
    <div className="space-y-4">
      {/* Filter controls */}
    </div>
  </PopoverContent>
</Popover>
```

### Component Dependencies

- Design tokens (colors, shadows, spacing)
- Icons from lucide-react (Info, HelpCircle, X)
- Floating UI (Popper) for positioning
- Portal for rendering outside DOM hierarchy
- Focus trap for modal popovers

### State Management

- Tooltip: Open/close state (managed by hover)
- Popover: Open/close state (controlled or uncontrolled)
- Position calculation based on available space
- Focus management for accessibility

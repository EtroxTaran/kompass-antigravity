# Tabs & Accordions - Figma Make Prompt

## Context & Purpose

- **Component Type**: Tabs and Accordions for Content Organization
- **User Roles**: All (GF, PLAN, ADM, KALK, BUCH)
- **Usage Context**: Detail pages, settings, multi-section forms
- **Business Value**: Organized navigation through related content sections without page changes

## Design Requirements

### Visual Hierarchy

- **Tabs**: Horizontal navigation with active indicator
- **Accordions**: Vertical collapsible sections
- **Active State**: Clear visual distinction
- **Content Area**: Smooth transitions when changing sections

### Layout Structure

- Tabs: Horizontal bar with underline indicator
- Accordion: Stacked panels with chevron indicators
- Tab content: Padded area below tab bar
- Accordion content: Expandable with smooth animation

### shadcn/ui Components

- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`

## Figma Make Prompt

Create comprehensive tabs and accordion components for KOMPASS, a German CRM application. Design for detail pages, settings, and multi-section content with German labels.

**Horizontal Tabs (Standard):**

**Tab Bar:**

- Background: White
- Border-bottom: 1px solid #e5e7eb
- Height: 48px
- Padding: 0 24px

**Tab Items:**

- Height: 48px
- Padding: 12px 16px
- Font: 14px, medium weight
- Text color (inactive): Gray (#6b7280)
- Text color (active): Blue (#3b82f6)
- Indicator: 2px solid blue bar at bottom (active only)
- Hover (inactive): Light blue background (#f0f9ff)
- Gap between tabs: 8px

**Tab Examples (Customer Detail Page):**
Tabs: "Übersicht" (active) | "Standorte" | "Kontakte" | "Aktivitäten" | "Dokumente"

**Tab Content Area:**

- Padding: 24px
- Min-height: 400px
- Smooth fade-in animation (200ms) when switching tabs
- Content: Forms, tables, cards, etc.

**Vertical Tabs (Sidebar Variant):**

- Sidebar width: 200px
- Tab items: Full width, left-aligned
- Active indicator: 3px left border (blue)
- Active background: Light blue (#f0f9ff)
- Use for: Settings pages, configuration panels
- Example tabs: "Profil", "Sicherheit", "Benachrichtigungen", "Datenschutz"

**Tabs with Icons:**

- Icon: 20px, positioned left of text
- Gap: 8px between icon and text
- Icon color: Matches text color
- Examples:
  - Home icon + "Übersicht"
  - MapPin icon + "Standorte"
  - Users icon + "Kontakte"
  - Activity icon + "Aktivitäten"

**Tabs with Badge Counts:**

- Badge: Small count badge (18px circle) right of text
- Red for unread/pending items
- Example: "Aktivitäten" with "5" badge (red)

**Accordion (Standard):**

**Accordion Structure:**

- Border: 1px solid #e5e7eb around container
- Border-radius: 8px
- Divide between items: 1px solid #e5e7eb

**Accordion Item (Collapsed):**

- Header height: 56px
- Padding: 16px 24px
- Background: White
- Cursor: pointer
- Hover: Light gray background (#f9fafb)

**Accordion Header:**

- Title: 16px, semibold, #1f2937, left-aligned
- Chevron icon: 20px, right-aligned
  - Collapsed: ChevronDown
  - Expanded: ChevronUp
- Icon color: Gray (#6b7280)
- Transition: Chevron rotates 180deg (300ms)

**Accordion Content (Expanded):**

- Padding: 16px 24px
- Background: Light gray (#f9fafb)
- Border-top: 1px solid #e5e7eb
- Max-height: Animates from 0 to auto (300ms ease)
- Content: Text, lists, forms, etc.

**Accordion Examples (FAQ Style):**

Items:

1. "Was ist KOMPASS?" - Expanded, shows description text
2. "Wie erstelle ich einen neuen Kunden?" - Collapsed
3. "Wie funktioniert die Offline-Synchronisierung?" - Collapsed
4. "Welche Benutzerrollen gibt es?" - Collapsed

**Accordion Variants:**

**Single-Open Accordion:**

- Only one item can be open at a time
- Opening new item closes previous
- Use for: Settings sections, FAQ

**Multi-Open Accordion:**

- Multiple items can be open simultaneously
- Each item independent
- Use for: Filters, advanced search options

**Flush Accordion (No Border):**

- No outer border or container
- Items separated by 1px divider
- More minimal appearance
- Use for: Simple content organization

**Accordion with Icons:**

- Icon: 24px, left of title
- Gap: 12px between icon and title
- Icon color: Gray (inactive), blue (expanded)
- Examples:
  - User icon + "Benutzerverwaltung"
  - Settings icon + "Systemeinstellungen"
  - Shield icon + "Sicherheit"

**Combined: Tabs with Accordion Content:**

- Tab bar at top
- Each tab content contains accordion
- Example: "Einstellungen" page
  - Tabs: "Allgemein", "Sicherheit", "Benachrichtigungen"
  - Each tab has accordion sections within

**Nested Accordions:**

- Parent accordion item
- Nested accordion inside parent content
- Indented: 24px left padding for nested
- Chevron size: Smaller for nested (16px vs 20px)
- Example: "Erweiterte Einstellungen" contains nested sections

**Tab Panel Actions:**

- Action buttons in top-right of tab bar (optional)
- Example: "Neuer Standort" button when "Standorte" tab active
- Button appears/changes based on active tab

**Scrollable Tabs:**

- When tabs overflow horizontally
- Scroll buttons (arrows) at left/right edges
- Gradient fade at edges indicating more tabs
- Smooth scroll animation (300ms)

**Responsive Behavior:**

- Tabs become dropdown on mobile (<640px)
- Dropdown shows all tabs as list
- Selected tab shown in dropdown trigger
- Accordion remains same on mobile

Design with smooth animations and clear visual feedback for all interactions.

## Interaction Patterns

### Tabs

1. User clicks tab trigger
2. Tab becomes active (blue indicator)
3. Previous tab content fades out (100ms)
4. New tab content fades in (200ms)
5. Focus moves to tab content area

### Accordion

1. User clicks accordion header
2. Chevron rotates 180deg
3. Content height animates from 0 to auto (300ms)
4. Content fades in
5. For single-open: Previous item collapses automatically

### Keyboard Navigation

**Tabs:**

- Arrow Left/Right: Navigate between tabs
- Home/End: First/Last tab
- Enter/Space: Activate focused tab

**Accordion:**

- Tab: Move to next accordion header
- Enter/Space: Toggle accordion
- Arrow Up/Down: Navigate headers (optional)

## German Labels & Content

### Tab Labels (Customer Detail)

- **Übersicht**: Overview
- **Standorte**: Locations
- **Kontakte**: Contacts
- **Aktivitäten**: Activities
- **Angebote**: Offers
- **Projekte**: Projects
- **Rechnungen**: Invoices
- **Dokumente**: Documents
- **Notizen**: Notes

### Tab Labels (Settings)

- **Allgemein**: General
- **Profil**: Profile
- **Sicherheit**: Security
- **Benachrichtigungen**: Notifications
- **Datenschutz**: Privacy
- **Erweitert**: Advanced

### Accordion Titles

- **Grundinformationen**: Basic information
- **Adressdaten**: Address data
- **Kontaktdaten**: Contact data
- **Erweiterte Einstellungen**: Advanced settings
- **Zahlungsinformationen**: Payment information
- **Datenschutzeinstellungen**: Privacy settings

## Accessibility Requirements

- WCAG 2.1 AA compliance
- Tabs: role="tablist", role="tab", role="tabpanel"
- Accordion: role="button" on headers
- aria-selected="true" on active tab
- aria-expanded="true/false" on accordion headers
- aria-controls links tab to tabpanel
- Keyboard navigation fully functional
- Focus visible: 2px blue outline
- Screen reader announcements for state changes

## Mobile Considerations

- Tabs: Convert to dropdown select on mobile
- Accordion: Remains same (works well on mobile)
- Larger touch targets: 48px minimum height
- Full-width tab triggers on mobile
- Adequate spacing for touch (16px padding)
- Swipe gesture for tabs (optional enhancement)

## Example Data

**Customer Detail Tabs:**

- Active tab: "Übersicht"
- Tabs: Übersicht | Standorte (3) | Kontakte (12) | Aktivitäten (45) | Dokumente (8)
- Badge counts show related items

**Settings Accordion:**

- "Allgemeine Einstellungen" - Expanded
  - Sprache: Deutsch
  - Zeitzone: Europe/Berlin
  - Währung: EUR
- "Benachrichtigungen" - Collapsed
- "Datenschutz" - Collapsed
- "Erweitert" - Collapsed

## Implementation Notes

### shadcn/ui Installation

```bash
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add accordion
```

### Tabs Usage

```typescript
<Tabs defaultValue="uebersicht">
  <TabsList>
    <TabsTrigger value="uebersicht">Übersicht</TabsTrigger>
    <TabsTrigger value="standorte">Standorte</TabsTrigger>
    <TabsTrigger value="kontakte">Kontakte</TabsTrigger>
  </TabsList>
  <TabsContent value="uebersicht">
    {/* Overview content */}
  </TabsContent>
  <TabsContent value="standorte">
    {/* Locations content */}
  </TabsContent>
</Tabs>
```

### Accordion Usage

```typescript
<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Grundinformationen</AccordionTrigger>
    <AccordionContent>
      {/* Basic info content */}
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Adressdaten</AccordionTrigger>
    <AccordionContent>
      {/* Address content */}
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

### Component Dependencies

- Design tokens (colors, spacing)
- Icons from lucide-react (ChevronDown, ChevronUp)
- Animation utilities from Tailwind/Framer Motion
- Badge component for count indicators

### State Management

- Active tab state
- Accordion expanded/collapsed state (single or multiple)
- Tab content loading states
- Smooth transitions between states

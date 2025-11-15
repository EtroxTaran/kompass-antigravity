# Location List View - Figma Make Prompt

## Context & Purpose

- **Component Type**: Nested List View (under Customer)
- **User Roles**: All (read), GF/INNEN (full CRUD), PLAN (create/edit), ADM (create/edit own customers only)
- **Usage Context**: View and manage customer locations within customer detail page
- **Business Value**: Track multiple delivery addresses and sites per customer

## Design Requirements

### Visual Hierarchy

- **Customer Context**: Parent customer name shown
- **Location Cards**: Card view preferred over table (better for addresses)
- **Primary Location**: Visually distinguished
- **Actions**: Edit, Delete per location

### Layout Structure

- Container within customer detail page
- Grid layout: 2-3 cards per row (desktop), 1 per row (mobile)
- Card height: Auto, minimum 200px
- Add button: Prominent at top-right

### shadcn/ui Components

- `Card` for each location
- `Badge` for location type and status
- `Button` for actions
- `Dialog` for location form

## Figma Make Prompt

Create a location list view for KOMPASS, a German CRM application. Design a card-based layout for displaying customer locations within customer detail page with address, contacts, and delivery notes.

**Context Header:**

- Parent customer: "Hofladen Müller GmbH" (breadcrumb or badge)
- Section title: "Standorte" (20px, semibold) with count badge "3"
- Add button: "+ Standort hinzufügen" (blue, top-right)

**Location Card (Grid Layout):**

**Card Structure:**

- Width: Flexible (grid: 2-3 cards per row on desktop)
- Border: 1px solid #e5e7eb
- Border-radius: 8px
- Padding: 20px
- Background: White
- Shadow: Subtle, increases on hover
- Hover: Slight elevation, border blue

**Card Header:**

1. **Location Name**: "Filiale München Süd" (18px, bold)
2. **Type Badge**: "Filiale" (blue badge with Store icon)
3. **Status Badge**: "Aktiv" (green) or "Inaktiv" (gray)
4. **Primary Indicator**: Star icon (gold) if default delivery location
   - Tooltip: "Standard-Lieferstandort"

**Card Content:**

**Address Section:**

- Icon: MapPin (20px, gray) at left
- Text: Full delivery address
  - "Industriestraße 42"
  - "81379 München"
  - "Deutschland"
- Font: 14px, line-height 1.6
- Color: Gray (#374151)

**Contact Section:**

- Icon: User (20px, gray)
- Label: "Ansprechpartner" (12px, gray, uppercase)
- Primary contact: "Hans Müller" (14px, semibold) with phone icon
  - Phone: "+49-89-1234567"
- Additional contacts: "+2 weitere Kontakte" (link, opens list)

**Delivery Information:**

- Icon: Truck (20px, gray)
- Collapsible section: "Lieferhinweise" (click to expand)
- Collapsed: First line of notes with "... mehr" link
- Expanded: Full delivery notes, opening hours, parking instructions
- Font: 13px, gray
- Background: Light gray (#f9fafb) when expanded

**Card Footer:**

- Actions: Right-aligned icon buttons
  - Eye: "Details anzeigen" (view full details)
  - Pencil: "Bearbeiten" (edit location)
  - Trash: "Löschen" (delete, red icon)
- RBAC: Actions disabled for unauthorized users (lock icon shown)

**Primary Location Indicator:**

- Star icon in top-right corner (gold, filled)
- Tooltip: "Standard-Lieferstandort"
- Click to set as primary: "Als Standard festlegen" (if not primary)
- Only one location can be primary per customer

**Location Type Icons:**

- Hauptsitz (Headquarter): Building icon
- Filiale (Branch): Store icon
- Lager (Warehouse): Package icon
- Projektstandort (Project site): HardHat icon
- Sonstige (Other): MapPin icon

**Empty State (No Locations):**

- Centered in tab content area
- Icon: MapPin (grayscale, 120px)
- Heading: "Noch keine Standorte angelegt"
- Description: "Fügen Sie Standorte hinzu, um verschiedene Lieferadressen zu verwalten"
- Button: "Ersten Standort hinzufügen" (blue)

**List View Alternative (Table):**

- Toggle view: Cards | Table
- Table columns:
  1. Standortname
  2. Typ (badge)
  3. Adresse (truncated)
  4. Ansprechpartner
  5. Status (badge)
  6. Standard (star if primary)
  7. Aktionen
- Compact for many locations (>10)

**Filter/Sort (Above Cards):**

- Left: "Alle anzeigen" | "Nur aktive" toggle
- Right: Sort dropdown "Sortiert nach: Name ▾"
  - Options: Name, Type, Created date

**Quick Actions:**

- Hover card: Actions fade in
- Context menu (right-click): Edit, Set as primary, Delete
- Keyboard: Focus with Tab, Enter to open details

**Bulk Actions (Multi-Select):**

- Checkbox on each card (top-left corner)
- Selected: Blue border, blue background tint
- Bulk bar: "3 Standorte ausgewählt"
- Actions: "Status ändern", "Exportieren", "Löschen"

**Mobile Layout:**

- Single column cards
- Full width
- Compact content: Address on 2 lines, truncated
- Expand card: Tap to see full details
- Swipe left: Quick actions (Edit, Delete)
- FAB: "+ Standort" at bottom-right

Design with clear visual hierarchy, easy scanning, and quick access to delivery information.

## Interaction Patterns

### View Location

1. Click location card or name
2. Opens location detail view (sheet or page)
3. Shows full address, all contacts, delivery notes, map
4. Actions: Edit, Delete, Set as primary

### Add Location

1. Click "+ Standort hinzufügen"
2. Location form dialog opens
3. Customer pre-filled
4. User enters location data
5. Saves, new card appears in grid

### Edit Location

1. Click edit (pencil) icon
2. Form opens with current data
3. User makes changes
4. Saves, card updates

### Delete Location

1. Click delete (trash) icon
2. Confirmation dialog: "Standort 'Filiale München Süd' löschen?"
3. User confirms
4. Location removed, card fades out

### Set as Primary

1. Click star icon on non-primary location
2. Confirmation: "Als Standard-Lieferstandort festlegen?"
3. Confirms
4. Previous primary star removed, new star appears
5. Toast: "Standard-Lieferstandort aktualisiert"

## German Labels & Content

### Section

- **Standorte**: Locations
- **Standort hinzufügen**: Add location
- **Standard-Lieferstandort**: Default delivery location

### Location Types

- **Hauptsitz**: Headquarter
- **Filiale**: Branch
- **Lager**: Warehouse
- **Projektstandort**: Project site
- **Sonstige**: Other

### Card Labels

- **Ansprechpartner**: Contact person
- **Lieferhinweise**: Delivery notes
- **Öffnungszeiten**: Opening hours
- **Parken**: Parking

### Actions

- **Details anzeigen**: Show details
- **Bearbeiten**: Edit
- **Löschen**: Delete
- **Als Standard festlegen**: Set as default

### Empty State

- **Noch keine Standorte**: No locations yet
- **Ersten Standort hinzufügen**: Add first location

## Accessibility Requirements

- WCAG 2.1 AA compliance
- Cards: Semantic article elements
- Primary location: aria-label="Standard-Lieferstandort"
- Action buttons: aria-label with action name
- Keyboard navigation: Tab through cards
- Focus visible: Blue outline
- Screen reader announces card content

## Mobile Considerations

- Single column card layout
- Touch-friendly cards (full width)
- Swipe gestures for actions
- FAB for add action
- Bottom sheet for location details
- Compact address display

## Example Data

**Location 1 (Primary):**

- Name: "Filiale München Süd"
- Type: Filiale (blue badge)
- Status: Aktiv (green)
- Primary: ⭐ (gold star)
- Address: "Industriestraße 42, 81379 München"
- Contact: "Hans Müller" (+49-89-1234567)
- Notes: "Hintereingang nutzen, Parkplätze vorhanden"

**Location 2:**

- Name: "Hauptsitz"
- Type: Hauptsitz (purple badge)
- Status: Aktiv (green)
- Address: "Hauptstraße 1, 80331 München"
- Contact: "Maria Schmidt" (+49-89-9876543)

**Location 3:**

- Name: "Lager Augsburg"
- Type: Lager (amber badge)
- Status: Inaktiv (gray)
- Address: "Lagerstraße 10, 86150 Augsburg"
- Contact: None
- Notes: "Geschlossen seit 01.10.2024"

## Implementation Notes

### shadcn/ui Installation

```bash
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
```

### Component Dependencies

- Parent customer context
- Location API (filtered by customer)
- Contact list for each location
- RBAC for action visibility
- Primary location setter

### State Management

- Locations list (filtered by customer)
- Primary location ID
- Expanded delivery notes state per card
- Delete confirmation state
- View mode (cards vs table)

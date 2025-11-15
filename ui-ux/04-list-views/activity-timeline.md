# Activity Timeline View - Figma Make Prompt

## Context & Purpose

- **Component Type**: Timeline / Activity Feed
- **User Roles**: All (own activities), GF/PLAN (all activities)
- **Usage Context**: Customer detail page, dashboard, or standalone activities page
- **Business Value**: Track customer interactions, audit trail, relationship history

## Design Requirements

### Visual Hierarchy

- **Timeline Format**: Chronological list, newest first
- **Activity Type Icons**: Visual distinction (phone, email, meeting, note)
- **User Attribution**: Who logged the activity
- **Timestamp**: Relative and absolute dates
- **Expandable Details**: Brief summary with expand option

### Layout Structure

- Vertical timeline with left accent line
- Activity cards: Full width or 800px max
- Grouping by date: "Heute", "Gestern", "Letzte Woche"
- Infinite scroll or pagination
- Quick-add FAB for mobile

### shadcn/ui Components

- `Card` for activity items
- `Badge` for activity type
- `Avatar` for user
- `Separator` for date groups
- `Accordion` for expandable details

## Figma Make Prompt

Create a comprehensive activity timeline view for KOMPASS, a German CRM application. Design a chronological feed of customer interactions with type icons, user attribution, timestamps, and expandable details using German labels.

**Page Layout:**

- Breadcrumb: "Dashboard > Aktivitäten" or within "Kunde > Aktivitäten" tab
- Title: "Aktivitäten" (32px, bold) with count "145"

**Filter Bar (Top):**

- Left:
  - Search: "Aktivitäten durchsuchen..."
  - Type filter: Checkboxes "Anrufe", "E-Mails", "Meetings", "Notizen"
  - Date filter: "Letzte 7 Tage" dropdown (Heute, Gestern, 7 Tage, 30 Tage, Dieses Jahr, Benutzerdefiniert)
- Right:
  - User filter: "Alle Mitarbeiter" or select specific (GF/PLAN only)
  - Customer filter: If not in customer context
  - Export button
  - Add button: "Aktivität hinzufügen" (blue)

**Timeline Container:**

- Width: Max 800px, centered (or full width in tab)
- Background: White
- Vertical timeline line: 2px solid light gray (#e5e7eb), left side

**Date Group Headers:**

- Sticky headers as user scrolls
- Text: "Heute" (16px, bold), "Gestern", "15. November 2024"
- Background: White with bottom border
- Divider: 1px solid #e5e7eb

**Activity Card (Timeline Item):**

**Card Structure:**

- Width: Full width of timeline
- Border-left: 4px solid (color by activity type)
- Border-radius: 8px
- Padding: 16px
- Background: White
- Shadow: Subtle
- Hover: Slight elevation
- Margin-bottom: 12px

**Card Header (Top Row):**

- Left: Activity type icon (32px circle) + title
- Right: Timestamp + more menu

1. **Activity Icon:**
   - Circle: 32px diameter, colored background
   - Icon: 20px, white
   - Types:
     - Phone: Blue circle, Phone icon
     - Email: Green circle, Mail icon
     - Meeting: Purple circle, Calendar icon
     - Note: Gray circle, FileText icon
     - Task: Amber circle, CheckSquare icon

2. **Activity Title:**
   - Text: "Telefonat mit Hr. Müller" (16px, semibold, #1f2937)
   - Next to icon, left-aligned

3. **Timestamp** (Right):
   - Relative: "Vor 2 Stunden" (14px, gray)
   - Absolute on hover tooltip: "15.11.2024, 14:30 Uhr"

4. **More Actions** (Far Right):
   - Icon: MoreVertical (20px, gray)
   - Menu: "Bearbeiten", "Löschen", "Teilen"
   - Only visible on hover or for own activities

**Card Content:**

1. **Customer & Contact (If Applicable):**
   - Building icon + Customer name: "Hofladen Müller GmbH"
   - User icon + Contact name: "Hans Müller (Geschäftsführer)"
   - Font: 14px, gray links

2. **Description (Summary):**
   - Text: First 150 characters of description
   - Font: 14px, regular, #374151
   - Expandable: "mehr anzeigen" link if longer
   - Example: "Besprochen: Neue Filiale in München Süd geplant für Q1 2025. Interesse an Ladeneinrichtung..."

3. **Expanded Description** (If Expanded):
   - Full text shown
   - Max height: 300px, scrollable
   - "weniger anzeigen" link to collapse

4. **Metadata Row (Bottom):**
   - User avatar (24px) + name: "Michael Schmidt"
   - Duration: "15 Minuten" (with clock icon) - if logged
   - Next steps: "Follow-up: 22.11.2024" (with arrow icon) - if set
   - Private indicator: Lock icon "Privat" (gray badge) - if private

**Activity Types Color Coding:**

- **Anruf (Phone)**: Blue (#3b82f6)
- **E-Mail**: Green (#10b981)
- **Meeting**: Purple (#8b5cf6)
- **Notiz (Note)**: Gray (#6b7280)
- **Aufgabe (Task)**: Amber (#f59e0b)
- **Besuch (Visit)**: Teal (#14b8a6)

**Timeline Line (Left Accent):**

- Vertical line: 2px solid light gray (#e5e7eb)
- Positioned at left: 16px from left edge
- Activity icons overlap line (centered on line)
- Connects all activities visually

**Filter Active Indicator:**

- Above timeline: "Gefiltert: Nur Anrufe (23)" - blue background chip
- Clear filter: "×" button on chip

**Empty State (No Activities):**

- Icon: ClipboardList (120px, gray)
- Heading: "Noch keine Aktivitäten protokolliert"
- Description: "Beginnen Sie mit der Erfassung von Kundenkontakten"
- Button: "Erste Aktivität hinzufügen" (blue)

**Empty State (Filtered):**

- Icon: Search (100px, gray)
- Heading: "Keine Aktivitäten gefunden"
- Description: "Keine Aktivitäten entsprechen den gewählten Filtern"
- Button: "Filter zurücksetzen"

**Grouped Timeline (Alternative):**

- Group by: Customer, User, Activity type
- Collapsible groups: Expand/collapse
- Shows count per group
- Example: "Hofladen Müller GmbH (12 Aktivitäten)" → Expand to show activities

**Mobile Layout:**

- Full-width cards
- Smaller activity icons (24px)
- Truncated descriptions (expand with tap)
- Swipe left: Quick actions (Edit, Delete)
- FAB: "+ Aktivität" bottom-right
- Pull-to-refresh: Loads latest activities
- Date headers sticky
- Compact metadata (hide duration, show only essential)

**Quick Add (Mobile):**

- FAB at bottom-right
- Tap: Opens bottom sheet with activity form
- Quick capture: Type, customer, voice-to-text description
- Save: Adds to timeline immediately

**Activity Details Expansion:**

- Collapsed: Shows first 2-3 lines
- "mehr anzeigen" link
- Expands smoothly with animation (300ms)
- Shows full description, all metadata, attachments
- "weniger anzeigen" to collapse

**Pagination/Infinite Scroll:**

- Option 1: "Weitere Aktivitäten laden" button (loads next 20)
- Option 2: Infinite scroll (auto-loads on scroll to bottom)
- Loading: Skeleton cards (shimmer animation)

**Activity Statistics (Sidebar or Top):**

- Card showing activity breakdown:
  - Anrufe: 45 (pie chart slice: blue)
  - E-Mails: 32 (green)
  - Meetings: 18 (purple)
  - Notizen: 50 (gray)
- This week vs last week comparison

Design with clear visual timeline, easy scanning, and quick action access.

## Interaction Patterns

### View Timeline

1. Page loads with most recent activities
2. Scroll down to see older
3. Grouped by date automatically
4. Click activity to expand details

### Add Activity

1. Click "Aktivität hinzufügen" or FAB
2. Form opens (see activity-protocol-form.md)
3. Log activity
4. Save
5. New activity appears at top of timeline
6. Smooth slide-in animation

### Filter Activities

1. Click filter checkboxes (type, date, user)
2. Timeline updates immediately
3. Filter chips appear above timeline
4. Clear filter: Remove chip or "Alle anzeigen"

### Expand Details

1. Click "mehr anzeigen" on activity
2. Card expands with animation
3. Shows full description and metadata
4. Click "weniger anzeigen" to collapse

### Edit Activity

1. Hover activity, click edit (pencil)
2. Form opens with current data
3. Make changes
4. Save
5. Activity updates in timeline

## German Labels & Content

### Page

- **Aktivitäten**: Activities
- **Aktivitäten hinzufügen**: Add activity
- **Aktivitätsverlauf**: Activity history

### Date Groups

- **Heute**: Today
- **Gestern**: Yesterday
- **Letzte Woche**: Last week
- **[Date]**: 15. November 2024

### Activity Types

- **Anruf**: Phone call
- **E-Mail**: Email
- **Meeting**: Meeting
- **Notiz**: Note
- **Aufgabe**: Task
- **Besuch**: Visit

### Metadata

- **Vor X [Zeit]**: X [time] ago
- **Dauer**: Duration
- **Minuten**: Minutes
- **Stunden**: Hours
- **Verantwortlich**: Responsible
- **Follow-up**: Follow-up
- **Privat**: Private

### Actions

- **Bearbeiten**: Edit
- **Löschen**: Delete
- **Teilen**: Share
- **mehr anzeigen**: Show more
- **weniger anzeigen**: Show less

### Empty State

- **Noch keine Aktivitäten**: No activities yet
- **Erste Aktivität hinzufügen**: Add first activity
- **Weitere Aktivitäten laden**: Load more activities

## Accessibility Requirements

- WCAG 2.1 AA compliance
- Timeline: role="feed" or list with proper semantics
- Activity cards: role="article"
- Timestamps: <time> element with machine-readable datetime
- Expandable: aria-expanded state
- Keyboard: Tab through activities, Enter to expand
- Screen reader: Announces activity type, user, timestamp

## Mobile Considerations

- Vertical timeline (works well on mobile)
- Compact cards with essential info only
- Tap to expand for full details
- Swipe gestures for quick actions
- FAB for quick add
- Pull-to-refresh
- Date groups stick to top when scrolling

## Example Data

**Activity 1 (Phone Call - Today, 2 hours ago):**

- Type: Anruf (blue circle, phone icon)
- Title: "Telefonat mit Hr. Müller"
- Customer: "Hofladen Müller GmbH"
- Contact: "Hans Müller"
- Description: "Besprochen: Neue Filiale in München Süd geplant für Q1 2025..."
- Duration: "15 Minuten"
- User: "Michael Schmidt" (avatar + name)
- Follow-up: "22.11.2024"
- Timestamp: "Vor 2 Stunden" (15.11.2024, 14:30)

**Activity 2 (Meeting - Yesterday):**

- Type: Meeting (purple circle, calendar icon)
- Title: "Besichtigungstermin"
- Customer: "REWE Köln Süd"
- Contact: "Maria Weber"
- Description: "Vor-Ort-Besichtigung der neuen Filiale. Besprechung der Ladengestaltung..."
- Duration: "2 Stunden"
- User: "Thomas Fischer"
- Timestamp: "Gestern, 10:00 Uhr"

**Activity 3 (Email - Last week):**

- Type: E-Mail (green circle, mail icon)
- Title: "Angebot versendet"
- Customer: "Biomarkt Heidelberg"
- Description: "Angebot für Ladeneinrichtung versendet (Angebotsnummer: ANG-2024-087)"
- User: "Anna Weber"
- Timestamp: "Vor 5 Tagen"

## Implementation Notes

### shadcn/ui Installation

```bash
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add accordion
```

### Component Dependencies

- Activity API with filtering
- User list for filter
- Customer list for filter
- Date grouping logic
- Relative time formatting (date-fns)
- Infinite scroll or pagination

### State Management

- Activity feed (React Query with infinite scroll)
- Filter state (type, date, user, customer)
- Expanded activity IDs
- Date grouping calculation
- New activity real-time updates

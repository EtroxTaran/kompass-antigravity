# Contact List View - Figma Make Prompt

## Context & Purpose
- **Component Type**: Nested List View (under Customer)
- **User Roles**: All (read), GF/PLAN (full edit), ADM (basic edit on own customers)
- **Usage Context**: View and manage contact persons within customer context
- **Business Value**: Track decision makers and influencers for sales strategy

## Design Requirements

### Visual Hierarchy
- **Decision Authority**: Prominent badges showing decision-making role
- **Contact Cards**: Avatar + key info in compact format
- **Authority Level**: Visual indicators (stars, crown for final authority)
- **Primary Contacts**: Distinguished for key locations

### Layout Structure
- Grid or list view within customer detail
- Card format: 360px width (desktop), full width (mobile)
- 2-3 cards per row on desktop
- Authority badges prominent

### shadcn/ui Components
- `Card` for each contact
- `Badge` for roles and authority
- `Avatar` for contact photo/initials
- `Tooltip` for authority details

## Figma Make Prompt

Create a contact list view for KOMPASS, a German CRM application. Design a card-based layout for displaying contact persons with decision-making authority badges, approval limits, and functional roles within customer context using German labels.

**Context Header:**
- Parent customer: "Hofladen Müller GmbH"
- Section title: "Kontakte" (20px, semibold) with count "12"
- Add button: "+ Kontakt hinzufügen" (blue, top-right)

**Filter Bar (Above Cards):**
- Left: Filter tabs
  - "Alle (12)" | "Entscheidungsträger (3)" | "Hauptansprechpartner (2)"
  - Active tab: Blue underline
- Right: Sort dropdown "Sortiert nach: Name ▾"
  - Options: Name, Authority level, Role

**Contact Card:**

**Card Structure:**
- Width: 360px (desktop), full width (mobile)
- Border: 1px solid #e5e7eb
- Border-radius: 8px
- Padding: 20px
- Shadow: Subtle
- Hover: Elevation increase, blue border

**Card Header:**
1. **Avatar**: 56px circle, left-aligned
   - Photo or initials "HM" (blue background)
   - Status dot: Green (online/active) in bottom-right

2. **Name & Title** (next to avatar):
   - Name: "Hans Müller" (18px, bold, #1f2937)
   - Position: "Geschäftsführer" (14px, gray)
   - Title: "Dr." (prefix to name, if present)

**Decision-Making Indicators (Below Name):**

1. **Decision Role Badge:**
   - Large badge: "Entscheidungsträger" (Decision Maker)
   - Color: Blue (#3b82f6), white text
   - Icon: Crown or CheckCircle
   - Other roles:
     - "Schlüsselbeeinflusser" (Key Influencer) - Purple
     - "Empfehler" (Recommender) - Green
     - "Gatekeeper" - Amber
     - "Operativer Kontakt" - Gray
     - "Informativ" - Light gray

2. **Authority Level:**
   - Visual: Star rating below role badge
   - Levels:
     - ⭐ Niedrig (Low) - 1 gray star
     - ⭐⭐ Mittel (Medium) - 2 amber stars
     - ⭐⭐⭐ Hoch (High) - 3 gold stars
     - 👑 Finale Autorität (Final Authority) - Crown icon, gold
   - Tooltip: Authority level explanation

**Card Content:**

**Contact Information:**
- Icon: Phone (16px, gray) + "+49-170-1234567" (Mobile)
- Icon: Phone (16px, gray) + "+49-89-1234567" (Office)
- Icon: Mail (16px, gray) + "h.mueller@hofladen-mueller.de"
- Preferred method: Underlined or badge "Bevorzugt: E-Mail"
- Gap: 8px between items

**Approval Authority (If Applicable):**
- Section: Light blue background (#f0f9ff), rounded, padding 12px
- Icon: Shield (20px, blue)
- Text: "Kann Bestellungen genehmigen" (12px, semibold)
- Limit: "Bis € 50.000" (14px, bold, blue)
- Help icon: Tooltip "Maximaler Auftragswert für Genehmigung"

**Functional Roles (If Any):**
- Label: "Funktionen" (12px, gray, uppercase)
- Badges: Small gray pills
  - "Einkaufsleiter"
  - "Filialleiter"
- Max 3 visible, "+2 weitere" if more

**Assigned Locations:**
- Icon: MapPin (16px)
- Text: "Filiale München Süd" (primary location in bold with star)
- Additional: "Hauptsitz" (regular weight)
- Truncate: "Filiale München, +2 weitere" if many
- Tooltip shows all on hover

**Card Footer:**
- Border-top: 1px solid #f3f4f6
- Padding-top: 12px
- Left: Last activity timestamp
  - Icon: Clock (14px, gray)
  - Text: "Letzte Aktivität: Vor 3 Tagen" (12px, gray)
- Right: Action buttons
  - Eye icon: View details
  - Pencil icon: Edit (disabled for ADM if decision role field restricted)
  - MoreVertical: More actions menu

**Action Menu (MoreVertical):**
- "Aktivität hinzufügen" (with Activity icon)
- "E-Mail senden" (with Mail icon)
- Divider
- "Anrufen" (with Phone icon, mobile only)
- Divider
- "Bearbeiten" (with Pencil icon)
- "Löschen" (with Trash icon, red)

**Primary Contact Indicator:**
- For locations: Gold star badge "Hauptansprechpartner für 2 Standorte"
- Visual: Gold star icon + badge next to assigned locations

**Filter Sheet:**
- Slides from right
- Filters:
  - Decision Role: Multi-select checkboxes
  - Authority Level: Checkboxes (Low, Medium, High, Final)
  - Kann genehmigen: Toggle
  - Zugeordnete Standorte: Multi-select locations
  - Funktionale Rollen: Multi-select
- Apply button: "Filter anwenden"

**Empty State:**
- Icon: Users (120px, gray)
- Heading: "Noch keine Kontakte vorhanden"
- Description: "Fügen Sie Kontaktpersonen hinzu, um Ansprechpartner zu verwalten"
- Button: "Ersten Kontakt hinzufügen" (blue)

**RBAC Indicators:**
- Decision authority fields: Lock icon if ADM user viewing
- Edit disabled: Pencil icon grayed with lock icon
- Tooltip: "Entscheidungsrolle kann nur von PLAN/GF bearbeitet werden"

**List View Alternative:**
- Toggle: Card view | Table view
- Table columns:
  1. Name (with avatar)
  2. Position
  3. Entscheidungsrolle (badge)
  4. Autorität (stars)
  5. Genehmigungslimit (if applicable)
  6. Kontakt (phone/email)
  7. Standorte (count)
  8. Aktionen
- Sortable columns
- Compact for many contacts (>15)

**Quick Actions (Card Hover):**
- Phone icon: Initiate call (mobile)
- Email icon: Compose email
- Activity icon: Log activity
- Visible on hover (desktop) or always (mobile)

**Mobile Layout:**
- Single column cards
- Full width
- Compact info: Name, role badge, authority level, phone
- Tap to expand: Shows full contact details
- Swipe left: Actions menu
- FAB: "+ Kontakt" at bottom-right

Design with clear authority indicators, easy access to contact methods, and prominent decision-making role display.

## Interaction Patterns

### View Contact
1. Click contact card or name
2. Opens contact detail sheet
3. Shows full information, authority, locations, activities
4. Actions: Edit, Delete, Add activity

### Add Contact
1. Click "+ Kontakt hinzufügen"
2. Contact form opens (see contact-form.md)
3. User fills data
4. Saves, new card appears

### Edit Contact
1. Click edit icon
2. Form opens with current data
3. User makes changes
4. Saves, card updates

### Contact Actions
1. Click phone icon: Opens phone dialer (mobile) or copies number (desktop)
2. Click email icon: Opens email client with contact email pre-filled
3. Click activity icon: Opens activity form with contact pre-selected

## German Labels & Content

### Section
- **Kontakte**: Contacts
- **Kontakt hinzufügen**: Add contact
- **Kontaktpersonen**: Contact persons

### Decision Roles
- **Entscheidungsträger**: Decision maker
- **Schlüsselbeeinflusser**: Key influencer
- **Empfehler**: Recommender
- **Gatekeeper**: Gatekeeper
- **Operativer Kontakt**: Operational contact
- **Informativ**: Informational

### Authority Levels
- **Niedrig**: Low
- **Mittel**: Medium
- **Hoch**: High
- **Finale Autorität**: Final authority

### Fields
- **Position**: Position
- **Kann Bestellungen genehmigen**: Can approve orders
- **Genehmigungslimit**: Approval limit
- **Funktionen**: Functions
- **Zugewiesene Standorte**: Assigned locations
- **Hauptansprechpartner für**: Primary contact for
- **Letzte Aktivität**: Last activity

### Actions
- **Details anzeigen**: Show details
- **Bearbeiten**: Edit
- **Aktivität hinzufügen**: Add activity
- **E-Mail senden**: Send email
- **Anrufen**: Call
- **Löschen**: Delete

## Accessibility Requirements
- WCAG 2.1 AA compliance
- Cards: role="article"
- Action buttons: aria-label with action description
- Authority indicators: Explained in tooltips
- Keyboard navigation: Tab through cards
- Focus visible: Blue outline
- Screen reader: Announces role and authority

## Mobile Considerations
- Full-width cards
- Compact layout: Essential info only
- Tap to expand for full details
- Quick action icons: Call, Email, Activity
- Swipe gestures for edit/delete
- Touch-friendly action buttons (48px)

## Example Data

**Contact 1 (Decision Maker):**
- Avatar: "HM"
- Name: "Dr. Hans Müller"
- Position: "Geschäftsführer"
- Role: "Entscheidungsträger" (blue badge)
- Authority: 👑 Finale Autorität
- Approval: "Kann genehmigen bis € 50.000"
- Phone: "+49-170-1234567" (Mobile)
- Email: "h.mueller@hofladen-mueller.de"
- Locations: "Filiale München Süd ⭐", "Hauptsitz"
- Last activity: "Vor 3 Tagen"

**Contact 2 (Key Influencer):**
- Avatar: "MS"
- Name: "Maria Schmidt"
- Position: "Einkaufsleiterin"
- Role: "Schlüsselbeeinflusser" (purple badge)
- Authority: ⭐⭐⭐ Hoch
- Approval: "Kann genehmigen bis € 20.000"
- Phone: "+49-89-9876543"
- Email: "m.schmidt@hofladen-mueller.de"
- Functions: "Einkaufsleiterin", "Filialmanagement"
- Locations: "Hauptsitz ⭐"

## Implementation Notes

### shadcn/ui Installation
```bash
npx shadcn-ui@latest add card
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add tooltip
```

### Component Dependencies
- Parent customer context
- Contact API (filtered by customer)
- Location list for assignments
- RBAC context for action visibility
- Authority badge components
- Activity logging integration

### State Management
- Contacts list (filtered by customer)
- View mode (cards vs table)
- Filter criteria (role, authority)
- Sort order
- Expanded card state (mobile)


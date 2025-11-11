# Navigation Patterns - Figma Make Prompt

## Context & Purpose
- **Component Type**: Navigation System
- **User Roles**: All (GF, PLAN, ADM, KALK, BUCH)
- **Usage Context**: Primary navigation for desktop and mobile, contextual navigation for sections
- **Business Value**: Enables efficient access to all system features while respecting role-based permissions

## Design Requirements

### Visual Hierarchy
- **Primary Navigation**: Left sidebar on desktop, collapsible
- **Top Bar**: User profile, notifications, offline sync status, search
- **Mobile Navigation**: Bottom tab bar + hamburger menu
- **Breadcrumbs**: Show current location in hierarchy

### Layout Structure
- Desktop: Fixed sidebar (240px wide) + main content area
- Tablet: Collapsible sidebar overlay
- Mobile: Bottom navigation (5 primary items) + drawer for secondary
- Consistent positioning and behavior across the app

### shadcn/ui Components
- `NavigationMenu` for desktop sidebar
- `Sheet` for mobile drawer
- `Tabs` for bottom mobile navigation
- `Breadcrumb` for location indicator
- `DropdownMenu` for user profile menu
- `Badge` for notification counts and sync status

## Figma Make Prompt

Create a comprehensive navigation system for KOMPASS, a German CRM and project management application. Design for both desktop and mobile experiences with role-based menu items.

**Desktop Navigation (Sidebar):**
Design a left-aligned vertical sidebar (240px wide) with:
- Company logo at top (48px height, with padding)
- User profile section below logo showing avatar, name, role badge
- Navigation menu items organized by section:
  1. **Dashboard** (Icon: LayoutDashboard) - "Dashboard"
  2. **Kunden** (Icon: Users) - "Customers" section with submenu:
     - Kundenliste (Customer List)
     - Standorte (Locations)
     - Kontakte (Contacts)
  3. **Vertrieb** (Icon: TrendingUp) - "Sales" section:
     - Opportunities
     - Angebote (Quotes)
     - Pipeline
  4. **Projekte** (Icon: Briefcase) - "Projects":
     - Projektübersicht (Project Overview)
     - Zeiterfassung (Time Tracking)
  5. **Rechnungen** (Icon: FileText) - "Invoices":
     - Rechnungen (Invoices)
     - Zahlungen (Payments)
  6. **Aktivitäten** (Icon: ClipboardList) - "Activities":
     - Protokolle (Protocols)
     - Aufgaben (Tasks)
- Bottom section with:
  - Offline-Sync status indicator (green dot + "Synchronisiert" or amber + "Offline - 3 ausstehend")
  - Settings (Icon: Settings)
  - Help (Icon: HelpCircle)

Each menu item has:
- Icon (20px) aligned left
- Label text (14px, medium weight)
- Hover state: light blue background (#e0f2fe)
- Active state: blue background (#3b82f6) with white text
- Badge for counts (e.g., "5" pending opportunities)

**Top Bar (All Screens):**
Design a horizontal bar (64px height) across the top with:
- Breadcrumb navigation on left: "Kunden > Hofladen Müller > Standorte"
- Right side:
  - Global search icon button
  - Notifications bell icon with red badge if unread
  - User avatar (32px) with dropdown menu

**Mobile Navigation (Bottom Tab Bar):**
Design a bottom-fixed tab bar (60px height) with 5 primary items:
1. **Dashboard** (Icon: Home)
2. **Kunden** (Icon: Users)
3. **Add** (Icon: PlusCircle, prominent blue, slightly elevated)
4. **Projekte** (Icon: Briefcase)
5. **Mehr** (Icon: Menu, opens drawer)

Active tab has blue indicator line at top and blue icon color.

**Mobile Drawer (Hamburger Menu):**
Design a sliding drawer from right (320px wide) triggered by "Mehr" tab:
- User profile at top
- Full navigation menu (same structure as desktop sidebar but in drawer)
- Sync status at bottom
- Settings and Help links

**Role-Based Menu Visibility:**
Show examples of how menus differ by role:
- **GF (CEO)**: Sees all menu items
- **ADM (Sales)**: Dashboard, Customers, Opportunities, Activities (no full financial access)
- **PLAN (Planning)**: Projects, Customers, Dashboard
- **KALK (Cost Estimation)**: Projects, Customers (limited), Quotes
- **BUCH (Accounting)**: Invoices, Payments, Financial Dashboard

**Interaction States:**
- Default: Icon + label in neutral color
- Hover: Light background highlight
- Active: Blue background, white text
- Disabled: Grayed out with lock icon (for restricted items)
- Loading: Skeleton animation during navigation

Design in light mode with clean, modern aesthetic. Use Inter or similar font. Include micro-interactions like smooth transitions and badge animations.

## Interaction Patterns

### Desktop Interactions
- Click menu item: Navigate to page, highlight active item
- Hover submenu item: Show submenu items in nested list
- Click user avatar: Open dropdown with "Profil", "Einstellungen", "Abmelden"
- Click sync status: Show sync details in popover

### Mobile Interactions
- Tap bottom tab: Navigate to section, show active indicator
- Tap "Mehr": Slide in navigation drawer from right
- Swipe drawer: Close drawer
- Tap outside drawer: Close drawer

### States
- **Default**: Neutral color, normal weight
- **Hover**: Light blue background, no color change (desktop only)
- **Active**: Blue background, white text, bold weight
- **Disabled**: Gray text, lock icon, cursor not-allowed
- **Loading**: Skeleton shimmer during page load

### RBAC Visibility Rules
- Menu items not accessible by role are hidden (not just disabled)
- Lock icon shown on items requiring higher permissions
- Role badge shown in user profile section

## German Labels & Content

### Navigation Items
- **Dashboard**: Dashboard
- **Kunden**: Customers
  - Kundenliste: Customer List
  - Standorte: Locations
  - Kontakte: Contacts
- **Vertrieb**: Sales
  - Opportunities: Opportunities
  - Angebote: Quotes
  - Pipeline: Pipeline
- **Projekte**: Projects
  - Projektübersicht: Project Overview
  - Zeiterfassung: Time Tracking
- **Rechnungen**: Invoices
- **Aktivitäten**: Activities
  - Protokolle: Protocols
  - Aufgaben: Tasks

### Status Messages
- **Synchronisiert**: Synchronized
- **Offline - X ausstehend**: Offline - X pending
- **Einstellungen**: Settings
- **Hilfe**: Help
- **Abmelden**: Logout

### User Menu
- **Profil**: Profile
- **Einstellungen**: Settings
- **Abmelden**: Logout

## Accessibility Requirements
- WCAG 2.1 AA compliance
- Keyboard navigation: Tab through menu items, Enter to activate
- Skip navigation link for screen readers
- ARIA labels for icon-only buttons
- Focus visible: 2px blue outline on focused items
- Screen reader announcements for navigation changes
- Minimum touch target: 44x44px on mobile

## Mobile Considerations
- Bottom navigation for thumb-friendly access
- Large touch targets (minimum 48px height on bottom tabs)
- Prominent "Add" action in center position (60px diameter, elevated)
- Drawer opens from right (easier for right-handed users)
- Swipe gestures for drawer close
- Haptic feedback on tab selection (iOS/Android)

## Example Data

**ADM User (Sales Field):**
- Name: "Michael Schmidt"
- Role: "Außendienst" (ADM badge)
- Sync status: "Offline - 3 Änderungen ausstehend"
- Available menu items: Dashboard, Kunden (full), Vertrieb (full), Aktivitäten
- Restricted: Projekte (grayed), Rechnungen (hidden)

**GF User (CEO):**
- Name: "Dr. Anna Weber"
- Role: "Geschäftsführung" (GF badge)
- Sync status: "Synchronisiert"
- Available: All menu items visible and active

## Implementation Notes

### shadcn/ui Installation
```bash
npx shadcn-ui@latest add navigation-menu
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add breadcrumb
npx shadcn-ui@latest add badge
```

### Component Structure
```typescript
// Desktop Sidebar
<aside className="w-60 border-r bg-background">
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>Dashboard</NavigationMenuItem>
      <NavigationMenuItem>Kunden</NavigationMenuItem>
      {/* ... */}
    </NavigationMenuList>
  </NavigationMenu>
</aside>

// Mobile Bottom Tabs
<Tabs defaultValue="dashboard" className="fixed bottom-0 w-full">
  <TabsList>
    <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
    <TabsTrigger value="kunden">Kunden</TabsTrigger>
    {/* ... */}
  </TabsList>
</Tabs>

// Mobile Drawer
<Sheet>
  <SheetTrigger>Menu</SheetTrigger>
  <SheetContent side="right">
    <NavigationMenu />
  </SheetContent>
</Sheet>
```

### Component Dependencies
- Design tokens (colors, spacing)
- Icons from lucide-react
- User authentication context for role-based rendering
- Offline sync status from service worker

### State Management
- Active route tracked in React Router
- Sidebar collapsed/expanded state in local storage
- User role from authentication context
- Sync status from offline service


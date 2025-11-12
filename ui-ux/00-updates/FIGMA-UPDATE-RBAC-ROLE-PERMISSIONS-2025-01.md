# Figma Make: RBAC Role Permission Corrections

**Purpose:** Correct incorrect PLAN role permissions across all KOMPASS UI/UX screens  
**Action:** Fix role-based access control displays, button visibility, and field editability  
**Date:** 2025-01-27  
**Related:** RBAC Multi-Role System Enhancement

---

## 🎯 MASTER PROMPT FOR FIGMA MAKE

**Copy everything below this line and paste into Figma Make:**

---

You are updating the KOMPASS CRM/PM application Figma designs to correct role-based access control (RBAC) permissions, specifically for the **PLAN (Planungsabteilung)** role which was incorrectly shown with customer management and delete permissions.

## CRITICAL CORRECTIONS NEEDED

### ❌ INCORRECT (Current State)
- PLAN can delete customers
- PLAN can edit/update customers
- PLAN shown alongside GF as having "admin rights"
- PLAN can create customers
- PLAN can import customers

### ✅ CORRECT (Target State)
- **PLAN CANNOT** delete customers (only GF can)
- **PLAN CANNOT** edit/update customers (only GF, INNEN, ADM can)
- **PLAN has READ-ONLY access** to customers for project-related needs
- PLAN CAN fully manage projects and tasks (their primary domain)
- PLAN CAN create/update locations and contacts
- PLAN CAN update contact decision authority (shared with GF)

---

## ROLE HIERARCHY CLARIFICATION

| Role | Customer Access | Location Access | Contact Access | Project Access | Invoice Access |
|------|----------------|-----------------|----------------|----------------|----------------|
| **GF** | Full CRUD | Full CRUD | Full CRUD | Full CRUD | Full CRUD |
| **INNEN** | Full CRUD | Full CRUD | Full CRUD | Read-only | Read-only |
| **PLAN** | **Read-only** | Create/Edit | Edit + Decision | Full CRUD | **No access** |
| **ADM** | Own only | Own customers | Own customers | Read-only | **No access** |
| **KALK** | Read-only | Read-only | Read-only | Read-only | **No access** |
| **BUCH** | Read-only | Read-only | Read-only | Read-only | Full CRUD |

**Key Insight:** PLAN is an **internal service role** for project execution after sales handoff, NOT a customer management or sales role.

---

## FIND AND REPLACE: Role References

### Component: customer-form.md

**FIND:**
```
- **User Roles**: GF, PLAN, ADM (create own), KALK (read-only), BUCH (read-only)
```

**REPLACE WITH:**
```
- **User Roles**: GF, INNEN (full), ADM (create own), PLAN (read-only), KALK (read-only), BUCH (read-only)
```

**UI Impact:**
- For PLAN users viewing customer form: All fields become read-only (gray background)
- "Speichern" button: Disabled with lock icon
- Banner at top: "Nur-Lese-Zugriff - Sie können Kunden für Projektplanung einsehen. Für Änderungen kontaktieren Sie INNEN oder GF."

---

### Component: location-list.md

**FIND:**
```
- **User Roles**: All (read), GF/PLAN (create/edit/delete), ADM (create/edit own customers only)
```

**REPLACE WITH:**
```
- **User Roles**: All (read), GF/INNEN (full CRUD), PLAN (create/edit), ADM (create/edit own customers only)
```

**UI Impact:**
- For PLAN users: "Löschen" button becomes disabled with lock icon
- Tooltip: "Keine Berechtigung - Nur GF/INNEN können Standorte löschen"
- "Neuer Standort" button: Remains enabled (PLAN can create)
- "Bearbeiten" button: Remains enabled (PLAN can edit)

---

### Component: contact-list.md

**FIND:**
```
- **User Roles**: All (read), GF/PLAN (full edit), ADM (basic edit on own customers)
```

**REPLACE WITH:**
```
- **User Roles**: All (read), GF/INNEN (full edit), PLAN (edit including decision authority), ADM (basic edit on own customers, no decision authority)
```

**UI Impact:**
- For PLAN users: Can edit contacts including decision-making fields
- For PLAN users: "Löschen" button disabled with lock icon
- Tooltip: "Keine Berechtigung - Nur GF/INNEN können Kontakte löschen"

---

### Component: invoice-form.md

**FIND:**
```
- **User Roles**: GF (full), BUCH (full), PLAN (limited), ADM (read-only)
```

**REPLACE WITH:**
```
- **User Roles**: GF (full), BUCH (full), INNEN (read for projects), PLAN (read-only), ADM (read-only)
```

**UI Impact:**
- For PLAN users: All fields read-only, no invoice creation/editing
- For INNEN users: Read-only access (context for project quotes)
- Banner for PLAN: "Nur-Lese-Zugriff - Rechnung können nur von BUCH oder GF erstellt werden."

---

### Component: opportunity-form.md

**FIND (Line 5):**
```
- **User Roles**: GF, PLAN, ADM (create own), KALK (read-only)
```

**REPLACE WITH:**
```
- **User Roles**: GF, INNEN, ADM (create own), PLAN (read for projects), KALK (read-only)
```

**FIND (Line 178-180):**
```
   - Select: ADM or PLAN users
   - For GF/PLAN: Can assign to any ADM/PLAN user
```

**REPLACE WITH:**
```
   - Select: ADM or INNEN users
   - For GF/INNEN: Can assign to any ADM/INNEN user
```

**UI Impact:**
- For PLAN users: Form is read-only, viewing opportunities in project context
- "Speichern" button: Disabled for PLAN users
- "Verantwortlicher Mitarbeiter" dropdown: Does not show PLAN users

---

### Component: bulk-import-form.md

**FIND (Line 5):**
```
- **User Roles**: GF, PLAN (full access), ADM (own data only)
```

**REPLACE WITH:**
```
- **User Roles**: GF, INNEN (full access), ADM (own data only), PLAN (read-only, no import)
```

**FIND (Line 228-229):**
```
- GF/PLAN: Can assign imported customers to any ADM user
- Setting: "Alle importierten Kunden zuweisen zu:" dropdown (select ADM user)
```

**REPLACE WITH:**
```
- GF/INNEN: Can assign imported customers to any ADM user
- Setting: "Alle importierten Kunden zuweisen zu:" dropdown (select ADM user)
- PLAN users: Cannot access bulk import feature (shown as disabled/hidden in navigation)
```

**UI Impact:**
- For PLAN users: Bulk import menu item hidden or disabled
- If PLAN user tries to access: Show permission denied dialog

---

### Component: rbac-permission-indicators.md

**FIND (Line 78):**
```
- Detail: "Nur GF und PLAN können Kunden löschen"
```

**REPLACE WITH:**
```
- Detail: "Nur GF kann Kunden löschen"
```

**FIND (Scenario 3, Lines 198-201):**
```
**Scenario 3: PLAN views any customer**
- All fields: Editable
- Actions: All enabled
- Financial data: Visible but read-only (BUCH permission needed to edit)
```

**REPLACE WITH:**
```
**Scenario 3: PLAN views any customer (Project-Related)**
- All fields: Read-only (PLAN has no customer edit permission)
- Actions: "Bearbeiten" (disabled with lock icon), "Löschen" (disabled with lock icon)
- Financial data: Hidden (no access)
- Note banner: "Sie haben Lesezugriff auf Kundendaten für Projektplanung. Für Änderungen kontaktieren Sie INNEN oder GF."
```

**UI Impact:**
- Permission tooltip changes across all delete customer actions
- Scenario 3 visual completely redesigned to show restrictions

---

### Component: README.md (RBAC Summary)

**FIND (Line 299):**
```
- **GF/PLAN**: Full CRUD on all entities
```

**REPLACE WITH:**
```
- **GF**: Full CRUD on all entities
- **PLAN**: Full CRUD on projects/tasks, read-only customers, limited other entities
- **INNEN**: Full CRUD on customers/opportunities/offers
```

**UI Impact:**
- README role summary table updated
- PLAN role properly scoped to project management

---

## DESIGN SPECIFICATION: Permission Indicators

### Disabled Action Button (PLAN viewing Customer)

**Component:** Button with lock icon overlay

**Specifications:**
- Button base: Ghost variant, grayed out (opacity 40%)
- Lock icon: 16px, positioned top-right corner of button
- Lock icon color: #EF4444 (red-500)
- Cursor: not-allowed
- Hover: Shows tooltip (see below)

**Button Labels (German):**
- "Bearbeiten" (Edit) - Disabled with lock for PLAN
- "Löschen" (Delete) - Disabled with lock for PLAN
- "Kunde anlegen" (Create Customer) - Disabled with lock for PLAN

---

### Permission Denied Tooltip

**Component:** Dark tooltip with lock icon

**Specifications:**
- Background: #374151 (gray-700)
- Text color: White (#FFFFFF)
- Font size: 14px
- Padding: 12px
- Border-radius: 8px
- Max-width: 300px
- Shadow: 0 4px 6px rgba(0, 0, 0, 0.1)

**Icon:**
- Lock icon (lucide-react: Lock)
- Size: 20px
- Color: #EF4444 (red-500)
- Position: Left of text

**Text Structure:**
```
🔒 Keine Berechtigung
Nur GF kann Kunden löschen.

Kontaktieren Sie Ihren Administrator für Zugriff.
```

**Line 1:** Bold, 14px, "Keine Berechtigung"
**Line 2:** Normal, 13px, Specific permission requirement
**Line 3:** Normal, 12px, Gray-300, Actionable guidance

---

### Read-Only Field Indicator (PLAN viewing Customer Form)

**Component:** Form input with visual read-only indicators

**Specifications:**
- Input background: #F5F5F5 (gray-100)
- Border: 1px solid #E5E7EB (gray-200)
- Text color: #6B7280 (gray-500)
- Cursor: not-allowed
- Opacity: 100% (don't reduce opacity of disabled fields)

**Label Enhancement:**
- Eye icon: 16px, #6B7280 (gray-500), positioned after label text
- Example: "Firmenname 👁" or use lucide-react Eye icon
- Tooltip on icon: "Nur-Lese-Zugriff"

**Banner at Top of Form (PLAN users):**
- Background: #FEF3C7 (amber-100)
- Border: 1px solid #FCD34D (amber-300)
- Icon: Info (amber-600)
- Text: "Sie haben Nur-Lese-Zugriff auf Kundendaten für Projektplanung. Für Änderungen kontaktieren Sie INNEN oder GF."
- Height: Auto (min 48px)
- Padding: 12px 16px

---

### Role Badge Colors (Updated)

**Component:** Role identifier badges

**Specifications:**

| Role | Badge Color | Text Color | Label (German) |
|------|-------------|------------|----------------|
| GF | #FFD700 (gold) | #78350F (brown-900) | Geschäftsführer |
| PLAN | #3B82F6 (blue-500) | #FFFFFF (white) | Planung |
| INNEN | #8B5CF6 (purple-500) | #FFFFFF (white) | Innendienst |
| ADM | #10B981 (green-500) | #FFFFFF (white) | Außendienst |
| KALK | #F59E0B (amber-500) | #FFFFFF (white) | Kalkulation |
| BUCH | #8B5CF6 (purple-600) | #FFFFFF (white) | Buchhaltung |

**Size:** Small (height 24px), medium (height 32px)
**Border-radius:** 12px (pill shape)
**Font:** 12px (small), 14px (medium), semibold
**Padding:** 4px 12px (small), 6px 16px (medium)

---

## AFFECTED SCREENS AND CHANGES

### 1. Customer Detail Page

**Screen:** customer-detail.md

**Changes:**
- **Header Actions (Top-Right):**
  - PLAN users: "Kunde bearbeiten" button disabled with lock icon
  - PLAN users: "Löschen" in more actions menu disabled with lock icon
  - Tooltip: "Nur GF kann Kunden löschen"

- **Tab: Übersicht**
  - PLAN users: All fields shown as read-only (gray background)
  - Financial data cards: Hidden for PLAN users (show "Keine Berechtigung" placeholder)

- **Tab: Standorte**
  - PLAN users: Can view all locations
  - PLAN users: "Neuer Standort" button enabled (PLAN can create locations)
  - PLAN users: "Bearbeiten" enabled, "Löschen" disabled

- **Tab: Kontakte**
  - PLAN users: Can view and edit contacts
  - PLAN users: CAN edit decision authority fields (special permission)
  - PLAN users: "Löschen" button disabled

---

### 2. Customer List View

**Screen:** customer-list.md

**Changes:**
- **List Actions:**
  - PLAN users: "Neuer Kunde" button disabled with lock icon
  - Tooltip: "Keine Berechtigung - Nur GF, INNEN, ADM können Kunden erstellen"
  
- **Row Actions:**
  - PLAN users: "Ansehen" button enabled (can view details)
  - PLAN users: "Bearbeiten" button disabled with lock icon
  - PLAN users: "Löschen" button disabled with lock icon (if visible)

- **Bulk Actions:**
  - PLAN users: No bulk edit/delete actions visible
  - Only bulk export allowed

---

### 3. Customer Form (Create/Edit)

**Screen:** customer-form.md

**Changes:**
- **Form Access:**
  - PLAN users: Cannot access "Neuer Kunde" dialog (button disabled)
  - PLAN users viewing existing: All fields read-only

- **Banner (Top of Form for PLAN):**
  ```
  ⚠️ Sie haben Nur-Lese-Zugriff auf Kundendaten für Projektplanung.
  Für Änderungen kontaktieren Sie INNEN oder GF.
  ```
  - Background: #FEF3C7 (amber-100)
  - Border: 1px solid #FCD34D (amber-300)
  - Icon: AlertCircle (amber-600)
  - Height: 56px
  - Full width

- **Form Fields:**
  - All inputs: Gray background (#F5F5F5), disabled state
  - Labels: Eye icon (👁) suffix indicating read-only
  - "Speichern" button: Hidden for PLAN users
  - "Abbrechen" button: Shown (to close dialog)

---

### 4. Location List View

**Screen:** location-list.md

**Changes:**
- **Header Actions:**
  - PLAN users: "Neuer Standort" button **ENABLED** (PLAN can create locations)
  - No changes to create action

- **Row Actions:**
  - PLAN users: "Bearbeiten" button **ENABLED** (PLAN can edit locations)
  - PLAN users: "Löschen" button **DISABLED** with lock icon
  - Tooltip on delete: "Keine Berechtigung - Nur GF/INNEN können Standorte löschen"

---

### 5. Contact List View

**Screen:** contact-list.md

**Changes:**
- **Header Actions:**
  - PLAN users: "Neuer Kontakt" button **ENABLED** (PLAN can create contacts)

- **Row Actions:**
  - PLAN users: "Bearbeiten" button **ENABLED** (PLAN can edit contacts)
  - PLAN users: "Löschen" button **DISABLED** with lock icon
  - Tooltip: "Keine Berechtigung - Nur GF/INNEN können Kontakte löschen"

- **Special Note:**
  - PLAN can edit decision authority fields (this is a special permission)
  - Show badge "Entscheidungsbefugnis bearbeitbar" for PLAN users

---

### 6. Contact Form (Decision Authority Tab)

**Screen:** contact-form.md

**Changes:**
- **Tab 2: Entscheidungsbefugnis**
  - Current state: ADM users see restriction banner
  - **UPDATE:** PLAN users do NOT see restriction banner (PLAN can edit these fields)
  - ADM users: Keep restriction banner as is
  - KALK/BUCH users: Add restriction banner

- **Restriction Banner (for ADM/KALK/BUCH only):**
  ```
  🔒 Diese Felder können nur von GF, INNEN oder PLAN bearbeitet werden
  ```
  - Background: #FEF3C7 (amber-100)
  - Height: 48px
  - Full width

- **Field Editability:**
  - PLAN users: All decision authority fields **EDITABLE**
  - ADM/KALK/BUCH users: All decision authority fields **READ-ONLY**

---

### 7. Invoice Form

**Screen:** invoice-form.md

**Changes:**
- **Form Access:**
  - PLAN users: Cannot access invoice creation (button hidden/disabled)
  - PLAN users viewing existing: All fields read-only

- **Role Visibility:**
  - Remove PLAN from user role list
  - Update to show: GF (full), BUCH (full), INNEN (read), ADM (read)

---

### 8. Opportunity Form

**Screen:** opportunity-form.md

**Changes:**
- **Form Access:**
  - PLAN users: Can view opportunities (read-only) in project context
  - PLAN users: Cannot create or edit opportunities

- **Field: Verantwortlicher Mitarbeiter**
  - Dropdown options: ADM or INNEN users **ONLY** (remove PLAN from options)
  - Assignment logic: GF/INNEN can assign (not PLAN)

---

### 9. Bulk Import Form

**Screen:** bulk-import-form.md

**Changes:**
- **Navigation:**
  - PLAN users: Bulk import menu item **HIDDEN** or **DISABLED**
  - If PLAN user tries to access URL directly: Show permission denied screen

- **Permission Denied Screen (for PLAN):**
  - Title: "Zugriff verweigert"
  - Icon: ShieldAlert (red, 64px)
  - Message: "Sie haben keine Berechtigung für den Datenimport."
  - Detail: "Datenimport ist auf GF, INNEN und ADM beschränkt. PLAN-Benutzer haben Lesezugriff auf Kundendaten für Projektplanung."
  - Action: "Zurück" button (navigate to previous page)

---

### 10. RBAC Permission Indicators

**Screen:** rbac-permission-indicators.md

**Changes:**
- **Example Tooltips:**
  - Update all tooltips mentioning "GF und PLAN" to "Nur GF" for customer delete
  - Update permission examples to reflect correct PLAN restrictions

- **Permission Summary Panel:**
  - Add example for PLAN role:
    ```
    Rolle: Planung (PLAN)
    Berechtigungen:
    ✅ Kunden anzeigen (alle, Lesezugriff)
    ❌ Kunden erstellen
    ❌ Kunden bearbeiten
    ❌ Kunden löschen
    ✅ Projekte verwalten (zugewiesene)
    ✅ Standorte erstellen/bearbeiten
    ✅ Kontakte bearbeiten
    ✅ Entscheidungsbefugnis bearbeiten
    ```

---

### 11. Plan Dashboard

**Screen:** plan-dashboard.md

**Changes:**
- **Context Note:**
  - Update line 6: "**Access**: ALL projects (full CRUD), ALL customers (read-only for project context)"
  - Add line 8: "**Note**: PLAN is internal service role for project execution, not customer management"

- **Quick Actions:**
  - Remove or disable: "+ Neuer Kunde" action
  - Keep: "+ Neues Projekt" (if from opportunity)
  - Keep: "+ Meilenstein hinzufügen", "Team zuweisen"

---

### 12. Customer Detail Page

**Screen:** customer-detail.md

**Changes:**
- **Header Actions (for PLAN):**
  - "Kunde bearbeiten" button: Show but disabled with lock icon
  - Hover tooltip: "Keine Berechtigung - Kundendaten sind für PLAN nur lesbar"
  - More actions menu "Löschen": Disabled with lock icon

- **Quick Info Sidebar (for PLAN):**
  - Financial data section: Show placeholder "🛡️ Sensible Daten - Keine Berechtigung"
  - Credit limit, payment terms: Hidden or masked "€ XXX.XXX"

---

### 13. All Detail Pages (General)

**Affected:** customer-detail.md, location-detail.md, contact-detail.md, opportunity-detail.md

**General Pattern for PLAN Users:**

**Action Button States:**
- "Bearbeiten" for customers: Disabled with lock icon
- "Löschen" for customers: Disabled with lock icon
- "Bearbeiten" for locations: **ENABLED**
- "Löschen" for locations: Disabled with lock icon
- "Bearbeiten" for contacts: **ENABLED**
- "Löschen" for contacts: Disabled with lock icon
- "Neue [Entity]" buttons: Follow rules above

**Field Visibility:**
- Customer financial data: Hidden or masked for PLAN
- All other fields: Visible but read-only for customer entities
- Project fields: Fully editable for PLAN users

---

### 14. All Forms (General Pattern)

**Affected:** All entity forms

**For PLAN Users Viewing Customer-Related Forms:**

**Banner Component:**
- Height: 56px
- Background: Linear gradient from #FEF3C7 to #FDE68A (amber-100 to amber-200)
- Border: 1px solid #FCD34D (amber-300)
- Border-radius: 8px
- Padding: 12px 16px
- Margin-bottom: 24px (space before form fields)

**Banner Content:**
- Icon: AlertCircle (lucide-react)
- Icon size: 20px
- Icon color: #D97706 (amber-600)
- Text (primary): "Nur-Lese-Zugriff" - 14px, semibold, #92400E (amber-900)
- Text (detail): Role-specific message - 13px, normal, #78350F (amber-800)

**PLAN-Specific Banner Messages:**
- Customer form: "Sie haben Lesezugriff auf Kundendaten für Projektplanung. Für Änderungen kontaktieren Sie INNEN oder GF."
- Invoice form: "Rechnungen können nur von BUCH oder GF erstellt werden."
- Opportunity form: "Opportunities können nur von GF, INNEN oder ADM erstellt werden."

---

## COLOR PALETTE FOR RBAC INDICATORS

### Permission States

| State | Background | Border | Text | Icon |
|-------|------------|--------|------|------|
| **Allowed** | White (#FFFFFF) | Gray-300 (#D1D5DB) | Black (#000000) | Blue (#3B82F6) |
| **Restricted** | Gray-100 (#F5F5F5) | Gray-200 (#E5E7EB) | Gray-500 (#6B7280) | Red (#EF4444) |
| **Warning** | Amber-100 (#FEF3C7) | Amber-300 (#FCD34D) | Amber-900 (#92400E) | Amber-600 (#D97706) |
| **Denied** | Red-50 (#FEF2F2) | Red-200 (#FECACA) | Red-900 (#7F1D1D) | Red-600 (#DC2626) |

---

## ICONS FOR RBAC

**Required Icons (lucide-react):**
- Lock (16px, 20px variants) - Restricted actions
- Eye (16px) - Read-only fields
- AlertCircle (20px) - Warning banners
- ShieldAlert (64px) - Permission denied screens
- Crown (16px) - Decision authority indicators
- Shield (16px) - Financial data protection

**Usage:**
- Lock: Overlaid on disabled buttons (top-right corner)
- Eye: Suffix on read-only field labels
- AlertCircle: Left of banner text
- ShieldAlert: Center of permission denied screens
- Crown: Next to decision authority fields
- Shield: Next to sensitive financial fields

---

## ROLE SWITCHER COMPONENT (NEW)

**For users with multiple roles (e.g., ADM + PLAN):**

**Component:** Dropdown in top-right near user avatar

**Specifications:**
- Trigger button:
  - Height: 40px
  - Padding: 8px 12px
  - Background: Transparent, hover: Gray-100
  - Border: None
  - Display: "Aktiv: [Role Name] [Badge]" + ChevronDown icon

**Dropdown Menu:**
- Width: 280px
- Max-height: 400px
- Padding: 8px
- Background: White
- Shadow: 0 4px 12px rgba(0, 0, 0, 0.15)
- Border-radius: 12px

**Menu Items (Roles):**
- Height: 48px per item
- Padding: 12px 16px
- Hover: Blue-50 background
- Active role: Blue-100 background + checkmark icon

**Item Layout:**
- Left: Role badge (24px height)
- Middle: Role name (14px, semibold) + description (12px, gray)
- Right: Checkmark icon (if active)

**Example Content:**
```
Currently Active: Außendienst ✓

Roles:
  [ADM Badge] Außendienst ✓
             Zugriff auf eigene Kunden
  
  [PLAN Badge] Planung
              Projekt- und Ressourcenplanung
```

**Switching Behavior:**
- Click role: Switch primary role immediately
- Page refreshes to show role-appropriate dashboard
- No confirmation dialog (instant switch)
- Toast notification: "Rolle gewechselt zu [Role Name]"

---

## QUALITY CHECKLIST

After applying all changes, verify:

### Customer Management (PLAN Users)
- [ ] Customer list: "Neuer Kunde" button is disabled with lock icon
- [ ] Customer detail: "Kunde bearbeiten" button is disabled
- [ ] Customer detail: "Löschen" action is disabled
- [ ] Customer form: All fields are read-only with gray background
- [ ] Customer form: Banner shows "Nur-Lese-Zugriff" message
- [ ] Bulk import: Menu item hidden or disabled for PLAN

### Location Management (PLAN Users)
- [ ] Location list: "Neuer Standort" button is **ENABLED**
- [ ] Location detail: "Bearbeiten" button is **ENABLED**
- [ ] Location detail: "Löschen" button is **DISABLED** with lock icon
- [ ] Location form: All fields are editable for PLAN

### Contact Management (PLAN Users)
- [ ] Contact list: "Neuer Kontakt" button is **ENABLED**
- [ ] Contact detail: "Bearbeiten" button is **ENABLED**
- [ ] Contact detail: "Löschen" button is **DISABLED** with lock icon
- [ ] Contact form: Basic fields editable
- [ ] Contact form: Decision authority tab editable (no restriction banner for PLAN)

### Project Management (PLAN Users)
- [ ] Project list: Full access to all actions
- [ ] Project detail: Full edit capabilities
- [ ] Project form: Can create/edit assigned projects
- [ ] Task management: Full CRUD access

### Permission Indicators
- [ ] Lock icon: Consistent 16px size, red-500 color
- [ ] Eye icon: Consistent 16px size, gray-500 color
- [ ] Tooltips: Follow dark gray (#374151) background pattern
- [ ] Role badges: Correct colors per role
- [ ] Banner: Amber gradient with proper padding

### Tooltips and Messages
- [ ] "Nur GF kann Kunden löschen" (not "GF und PLAN")
- [ ] PLAN customer access: "Lesezugriff für Projektplanung"
- [ ] All German labels: Grammatically correct, professional tone

### Role Badge Display
- [ ] GF: Gold (#FFD700)
- [ ] PLAN: Blue (#3B82F6)
- [ ] INNEN: Purple (#8B5CF6)
- [ ] ADM: Green (#10B981)
- [ ] KALK: Amber (#F59E0B)
- [ ] BUCH: Purple-600 (#8B5CF6)

### Multi-Role Support (if implementing)
- [ ] Role switcher visible for users with multiple roles
- [ ] Role switcher shows all assigned roles
- [ ] Current role indicated with checkmark
- [ ] Switching updates dashboard and permissions immediately

---

## SPECIAL CASES TO HANDLE

### Case 1: PLAN Viewing Customer in Project Context

**Scenario:** PLAN user clicks customer name from project detail page

**Expected Behavior:**
- Navigate to customer detail page
- All fields shown as read-only
- Banner: "Projektbezogener Kundenzugriff - Lesemodus"
- Breadcrumb: "Projekte > P-2024-B023 > Kunde: REWE München"
- "Zurück zum Projekt" button prominent

---

### Case 2: PLAN Creating Location for Project

**Scenario:** PLAN user setting up delivery location for new project

**Expected Behavior:**
- "Neuer Standort" button fully enabled
- Form fields all editable
- No restriction banners
- Success: "Standort erfolgreich erstellt"

---

### Case 3: PLAN Updating Contact Decision Authority

**Scenario:** PLAN user updating contact approval limits for project planning

**Expected Behavior:**
- Decision authority tab: All fields **EDITABLE** for PLAN
- No lock icons on decision fields
- Save button: Enabled
- Success: "Entscheidungsbefugnis aktualisiert"

---

### Case 4: User with Multiple Roles (ADM + PLAN)

**Scenario:** User has both ADM and PLAN roles, primary role is ADM

**Expected Behavior:**
- Top-right: Role switcher showing "Aktiv: Außendienst (ADM)"
- Can switch to PLAN role via dropdown
- When viewing as ADM: See own customers with full edit
- When switched to PLAN: See all customers read-only + all projects editable
- Permissions are UNION of both roles (most permissive wins)

---

## FIGMA COMPONENT UPDATES NEEDED

### 1. Button Component - Locked State

**Add new variant: locked="true"**

**Properties:**
- Base button: Ghost or outline variant
- Opacity: 40%
- Cursor: not-allowed
- Lock icon overlay: Top-right corner, 16px, red-500
- Disabled: true

---

### 2. Input Component - Read-Only State

**Add new variant: readonly="true"**

**Properties:**
- Background: #F5F5F5 (gray-100)
- Border: 1px solid #E5E7EB (gray-200)
- Text: #6B7280 (gray-500)
- Cursor: not-allowed
- Label: Eye icon (16px) suffix

---

### 3. Banner Component - Permission Warning

**New component: PermissionBanner**

**Variants:**
- type: "read-only" | "restricted" | "denied"

**Properties (read-only variant):**
- Background: #FEF3C7 (amber-100)
- Border: 1px solid #FCD34D (amber-300)
- Height: Auto (min 56px)
- Padding: 12px 16px
- Icon: AlertCircle (20px, amber-600)
- Text: 13px, amber-900

---

### 4. Role Badge Component

**Update existing RoleBadge component**

**Add role prop with values:**
- GF, PLAN, INNEN, ADM, KALK, BUCH

**Color mapping (update):**
- GF: #FFD700 / #78350F
- PLAN: #3B82F6 / #FFFFFF
- INNEN: #8B5CF6 / #FFFFFF (NEW)
- ADM: #10B981 / #FFFFFF
- KALK: #F59E0B / #FFFFFF
- BUCH: #8B5CF6 / #FFFFFF

---

### 5. Role Switcher Component (NEW)

**New component: RoleSwitcher**

**Component structure:**
- Trigger: Button with role badge + name + ChevronDown
- Menu: Dropdown with all user roles
- Active indicator: Checkmark icon
- Size: Medium (40px height)

**Properties:**
- roles: Array of {roleId, name, description}
- activeRole: String (current role)
- onSwitch: Function (callback)

---

## TESTING INSTRUCTIONS FOR FIGMA MAKE

### Test Scenario 1: PLAN User Customer Access
1. Log in as PLAN user in prototype
2. Navigate to Customers list
3. Verify "Neuer Kunde" button is disabled with lock
4. Click customer: Navigate to detail
5. Verify all fields read-only
6. Verify "Kunde bearbeiten" disabled
7. Verify amber banner shows read-only message

### Test Scenario 2: PLAN User Location Management
1. Still as PLAN user
2. Navigate to customer detail > Standorte tab
3. Verify "Neuer Standort" button is **ENABLED**
4. Click "Neuer Standort": Form opens, all fields editable
5. Verify no restriction banner
6. For existing location: "Bearbeiten" **ENABLED**, "Löschen" **DISABLED**

### Test Scenario 3: PLAN User Contact Decision Authority
1. Still as PLAN user
2. Navigate to customer detail > Kontakte tab
3. Click contact: Navigate to contact detail or edit
4. Open "Entscheidungsbefugnis" tab
5. Verify **NO restriction banner** for PLAN (unlike ADM)
6. Verify all decision fields are **EDITABLE**
7. Can change approval limit, authority level

### Test Scenario 4: Permission Tooltips
1. As PLAN user, hover over disabled "Kunde bearbeiten" button
2. Verify tooltip shows: "Keine Berechtigung"
3. Verify detail: "Nur GF kann Kunden löschen" (not "GF und PLAN")
4. Repeat for all disabled actions across screens

### Test Scenario 5: Multi-Role User (if implementing)
1. Log in as user with roles: ADM + PLAN
2. Verify role switcher visible in top-right
3. Default view: ADM dashboard
4. Click role switcher: Shows both roles
5. Switch to PLAN: Dashboard updates to PLAN view
6. Verify permissions change based on active role

---

## IMPLEMENTATION PRIORITY

### High Priority (Critical Fixes)
1. ✅ rbac-permission-indicators.md - Tooltip corrections
2. ✅ customer-form.md - Remove PLAN edit access
3. ✅ customer-detail.md - Disable edit/delete for PLAN
4. ✅ bulk-import-form.md - Hide/disable for PLAN

### Medium Priority (Important Clarifications)
5. ✅ location-list.md - Keep create/edit for PLAN, remove delete
6. ✅ contact-list.md - Keep edit for PLAN (including decision authority)
7. ✅ opportunity-form.md - Remove PLAN from creation
8. ✅ invoice-form.md - Clarify PLAN read-only

### Low Priority (Documentation Updates)
9. ✅ plan-dashboard.md - Clarify read-only customer access
10. ✅ README.md - Update RBAC summary

---

## FILES UPDATED

**Total:** 10 UI/UX markdown files

1. `ui-ux/08-specialized/rbac-permission-indicators.md` - Tooltip and scenario corrections
2. `ui-ux/03-entity-forms/customer-form.md` - Role access updated
3. `ui-ux/04-list-views/location-list.md` - PLAN access clarified
4. `ui-ux/04-list-views/contact-list.md` - PLAN decision authority noted
5. `ui-ux/03-entity-forms/invoice-form.md` - PLAN read-only clarified
6. `ui-ux/03-entity-forms/opportunity-form.md` - PLAN removed from creation
7. `ui-ux/03-entity-forms/bulk-import-form.md` - PLAN cannot import
8. `ui-ux/06-dashboards/plan-dashboard.md` - Access scope clarified
9. `ui-ux/05-detail-pages/customer-detail.md` - PLAN edit disabled
10. `ui-ux/README.md` - RBAC summary corrected

---

## ADDITIONAL CONTEXT

### Why These Changes Matter

**User Concern:** PLAN role was incorrectly shown with "admin rights" and customer management permissions in UI/UX designs.

**Reality:** PLAN is an **internal service role** focused on:
- Project planning and execution
- Resource allocation
- Timeline management
- Technical/interior design planning

**PLAN should NOT:**
- Create, edit, or delete customers (sales responsibility)
- Manage financial data (accounting responsibility)
- Import customer data (data entry responsibility)

**PLAN should:**
- View all customers (read-only, for project context)
- Fully manage projects and tasks
- Create/edit locations (for project delivery setup)
- Edit contacts including decision authority (for project stakeholder management)

---

END OF PROMPT

**Post-Application:** After applying this prompt in Figma, update the migration tracking document and create visual diff screenshots for review.

**Total Screens Affected:** ~15-20 screens  
**Critical Corrections:** 4  
**Important Clarifications:** 4  
**Documentation Updates:** 2  
**Estimated Time:** 2-3 hours for complete Figma updates

---

**Created:** 2025-01-27  
**Related Plan:** rbac-multi-role-system.plan.md  
**Related Documentation:** docs/specifications/reviews/RBAC_PERMISSION_MATRIX.md  
**Related Audit:** docs/implementation/UI_UX_RBAC_AUDIT_FINDINGS.md


# RBAC Permission Indicators - Figma Make Prompt

## Context & Purpose
- **Component Type**: Permission visualization and restrictions
- **User Roles**: All (different views per role)
- **Usage Context**: Show what users can/cannot do across the application
- **Key Features**: Visual indicators, role-based visibility, permission tooltips

## Figma Make Prompt

Create RBAC permission indicators for KOMPASS showing role-based access restrictions, disabled actions, permission tooltips, and role badges with German labels.

**Permission States:**

**1. Allowed (Full Access)**
- Action buttons: Enabled, full color (blue/green)
- Icon: No special indicator
- Hover: Standard hover state
- Example: GF can "Löschen" (delete) any customer

**2. Restricted (No Access)**
- Action buttons: Disabled, grayed out (opacity 40%)
- Icon: Lock icon (16px) overlaid on button
- Tooltip: "Keine Berechtigung - Nur GF/PLAN"
- Example: ADM cannot delete customers

**3. Read-Only (View Only)**
- Fields: Grayed out input (non-editable)
- Label suffix: "👁 Nur Ansicht"
- Background: Light gray (#F5F5F5)
- Tooltip: "Nur-Lese-Zugriff - Kontaktieren Sie PLAN für Änderungen"
- Example: ADM can view but not edit customer financial data

**4. Conditional Access (Ownership-Based)**
- Button: Enabled for own records, disabled for others
- Tooltip: "Nur eigene Kunden bearbeitbar"
- Badge: "Mein Kunde" (blue, small) if own record
- Example: ADM can edit own customers only

**Visual Indicators:**

**Role Badges (User Context):**
- Top-right corner: User avatar + role badge
- Role colors:
  - GF: Gold (#FFD700) - "Geschäftsführer"
  - PLAN: Blue (#3B82F6) - "Planung"
  - ADM: Green (#10B981) - "Außendienst"
  - KALK: Amber (#F59E0B) - "Kalkulation"
  - BUCH: Purple (#8B5CF6) - "Buchhaltung"
- Tooltip: Shows full role name and permissions summary

**Entity-Level Indicators:**

**Customer Owner Badge:**
- If ADM role: Shows "Eigentümer: Michael Schmidt" (blue badge)
- If not owner: Shows "Eigentümer: Anna Weber" (gray badge)
- Affects: Edit/delete permissions

**Financial Data Shield:**
- Icon: Shield (🛡️) next to sensitive fields
- Tooltip: "Sensible Daten - Nur GF/BUCH"
- Fields: Credit limit, payment terms, total revenue
- ADM/PLAN: See masked value "€ XXX.XXX" or hidden

**Decision Authority Lock:**
- Icon: Crown (👑) next to decision-making role fields
- Tooltip: "Entscheidungsbefugnis - Nur GF/PLAN bearbeiten"
- Fields: decisionMakingRole, authorityLevel, approvalLimit
- ADM/KALK/BUCH: Read-only

**Permission Tooltips:**

**Standard Tooltip (Restricted Action):**
- Background: Dark gray (#374151)
- Text: White, 14px
- Icon: Lock icon (red)
- Message: "Keine Berechtigung"
- Detail: "Nur GF und PLAN können Kunden löschen"
- Action: "Kontaktieren Sie Ihren Administrator"

**Conditional Tooltip (Ownership):**
- Background: Amber (#F59E0B)
- Text: White, 14px
- Icon: Info icon (amber)
- Message: "Eingeschränkter Zugriff"
- Detail: "Sie können nur Ihre eigenen Kunden bearbeiten"
- Tip: "Kontaktieren Sie PLAN für Zugriff auf andere Kunden"

**Permission Dialogs:**

**Insufficient Permission Dialog:**
- Triggered by: Attempting restricted action
- Title: "Zugriff verweigert" (red alert icon)
- Message: "Sie haben keine Berechtigung, diese Aktion auszuführen."
- Detail: "Aktion 'Kunde löschen' erfordert GF- oder PLAN-Rolle."
- Current role: "Ihre Rolle: Außendienst (ADM)"
- Actions:
  - "Verstanden" (primary, blue)
  - "Administrator kontaktieren" (secondary, link)

**Ownership Mismatch Dialog:**
- Triggered by: ADM attempting to edit another ADM's customer
- Title: "Zugriff eingeschränkt" (amber warning icon)
- Message: "Dieser Kunde gehört zu einem anderen Außendienstmitarbeiter."
- Detail: "Eigentümer: Anna Weber (ADM)"
- Suggestion: "Kontaktieren Sie PLAN für Zugriff oder Übertragung."
- Actions:
  - "Abbrechen" (secondary, gray)
  - "PLAN kontaktieren" (primary, blue)

**Permission-Based UI Variations:**

**ADM View (Customer List):**
- Shows: Only own customers (RBAC filter)
- Header badge: "Meine Kunden (32)" (green)
- Actions: "Bearbeiten" (enabled), "Löschen" (disabled with lock icon)
- Financial data: Hidden or masked

**GF View (Customer List):**
- Shows: All customers (no RBAC filter)
- Header badge: "Alle Kunden (128)" (gold)
- Actions: "Bearbeiten" (enabled), "Löschen" (enabled)
- Financial data: Visible

**Field-Level Permission Indicators:**

**Editable Field:**
- Input: White background, normal border
- Label: Normal weight, black
- No icon

**Read-Only Field (Role Restriction):**
- Input: Gray background (#F5F5F5), gray border
- Label: "Kreditlimit 👁" (eye icon)
- Cursor: not-allowed
- Tooltip: "Nur-Lese-Zugriff - Nur GF/BUCH können bearbeiten"

**Masked Field (Data Privacy):**
- Input: Shows "€ XXX.XXX" or "***"
- Label: "Umsatz 🛡️" (shield icon)
- Tooltip: "Sensible Daten - Keine Berechtigung"
- Button: "Anfordern" (request access, sends notification to GF)

**Action Button States:**

**Enabled (Allowed):**
- Button: Full color (blue/green), no icon
- Hover: Darker shade
- Cursor: pointer

**Disabled (Restricted):**
- Button: Grayed out (opacity 40%), lock icon (16px) overlaid
- Hover: Shows tooltip with reason
- Cursor: not-allowed

**Conditional (Ownership):**
- Button: Enabled for own, disabled for others
- Badge: "Nur eigene" (small, amber)
- Tooltip: Explains ownership rule

**Permission Summary Panel (Settings):**
- Section: "Meine Berechtigungen"
- Role: "Außendienst (ADM)" (green badge)
- Permissions list:
  - ✅ Kunden anzeigen (eigene)
  - ✅ Kunden erstellen
  - ✅ Kunden bearbeiten (eigene)
  - ❌ Kunden löschen
  - ✅ Aktivitäten erstellen
  - ❌ Finanzdaten anzeigen
  - ❌ Entscheidungsrollen bearbeiten
- Link: "Mehr erfahren über Rollen" (opens RBAC help)

**Mobile Considerations:**
- Tooltips: Tap instead of hover
- Long-press: Shows permission details
- Disabled actions: Hidden instead of grayed (cleaner mobile UI)
- Role badge: Smaller (24px icon only, name hidden)

**Accessibility:**
- ARIA labels: Describe permission state
- Voice-over: Reads permission restrictions
- High contrast: Clear visual distinctions
- Keyboard navigation: Tab through enabled actions only

**Example Scenarios:**

**Scenario 1: ADM views own customer**
- All fields: Editable
- Actions: "Bearbeiten" (enabled), "Löschen" (disabled with lock + tooltip)
- Financial data: Hidden with shield icon

**Scenario 2: ADM views another ADM's customer**
- All fields: Read-only (gray background)
- Actions: "Bearbeiten" (disabled with lock), "Löschen" (disabled with lock)
- Banner: "Kunde von Anna Weber - Kontaktieren Sie PLAN für Zugriff"

**Scenario 3: PLAN views any customer**
- All fields: Editable
- Actions: All enabled
- Financial data: Visible but read-only (BUCH permission needed to edit)

## Implementation Notes
```bash
npx shadcn-ui@latest add badge button tooltip alert dialog
# RBAC logic in shared package: @kompass/shared/rbac
```


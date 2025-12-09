# Contact Form - Figma Make Prompt

## Context & Purpose

- **Component Type**: Nested Entity Form (under Customer)
- **User Roles**: GF, PLAN (full access), ADM (own customers, limited fields)
- **Usage Context**: Add/edit contact persons within customer context
- **Business Value**: Track decision makers and influencers for sales strategy

## Design Requirements

### Visual Hierarchy

- **Form Title**: "Neuer Kontakt" or "Kontakt bearbeiten"
- **Parent Context**: Customer name shown
- **Special Section**: Decision-making authority (restricted to PLAN/GF)
- **Tabs**: Basic Info | Decision Authority | Location Assignment

### Layout Structure

- Dialog: 800px width, 2-column layout
- Tabs for section organization
- Field spacing: 16px
- RBAC indicators for restricted fields

### shadcn/ui Components

- `Dialog`, `Tabs`
- `Form` with all field components
- `Badge` for role/authority indicators
- `Lock` icon for RBAC-restricted fields

## Figma Make Prompt

Create a comprehensive contact person form for KOMPASS, a German CRM application. Design a form with tabs for personal information, decision-making authority (RBAC-restricted), and location assignments with German labels based on DATA_MODEL_SPECIFICATION.md.

**Form Container:**

- Dialog: 800px width
- Header:
  - Title: "Neuer Kontakt" or "Kontakt bearbeiten"
  - Customer badge: "Kunde: Hofladen Müller GmbH" (blue)
  - Close "×"

**Tab Navigation:**
Tabs: "Grunddaten" | "Entscheidungsbefugnis" | "Standortzuordnung"

- Active tab: Blue underline indicator
- Tab content: Scrollable form sections

**Tab 1: Grunddaten (Basic Information)**

**Personal Information:**

1. **Anrede** (Optional):
   - Label: "Anrede"
   - Select: "Herr", "Frau", "Divers"
   - Left column, 33% width

2. **Titel** (Optional):
   - Label: "Titel"
   - Input: Text, middle column, 33%
   - Placeholder: "Dr.", "Prof."

3. **Vorname** (Required):
   - Label: "Vorname \*"
   - Input: Text, left column, 50%
   - Placeholder: "Hans"
   - Validation: 2-50 characters, letters only

4. **Nachname** (Required):
   - Label: "Nachname \*"
   - Input: Text, right column, 50%
   - Placeholder: "Müller"
   - Validation: 2-50 characters, letters only

5. **Position** (Optional):
   - Label: "Position"
   - Input: Text, full width
   - Placeholder: "z.B. Geschäftsführer, Einkaufsleiter"

**Contact Details:**

6. **E-Mail** (Optional):
   - Label: "E-Mail"
   - Input: Email, left column
   - Placeholder: "h.mueller@beispiel.de"
   - Icon: Mail at left
   - Validation: Valid email format

7. **Telefon** (Optional):
   - Label: "Telefon"
   - Input: Tel, middle column
   - Placeholder: "+49-89-1234567"
   - Icon: Phone at left

8. **Mobil** (Optional):
   - Label: "Mobil"
   - Input: Tel, right column
   - Placeholder: "+49-170-1234567"
   - Icon: Smartphone at left

9. **Bevorzugte Kontaktmethode** (Optional):
   - Label: "Bevorzugte Kontaktmethode"
   - Radio group: E-Mail, Telefon, Mobil
   - Default: E-Mail

10. **Sprache** (Optional):
    - Label: "Sprache"
    - Select: Deutsch (default), Englisch, Französisch, etc.

**Tab 2: Entscheidungsbefugnis (Decision Authority)**
**RBAC Note:** This section restricted to PLAN and GF roles only

**Restriction Indicator (if ADM user):**

- Alert banner at top of tab:
  - Lock icon (amber)
  - Text: "Diese Felder können nur von Planung oder Geschäftsführung bearbeitet werden"
  - Background: Amber tint (#fef3c7)

**Decision-Making Role:**

1. **Rolle im Entscheidungsprozess** (Required):
   - Label: "Entscheidungsrolle \*"
   - Select dropdown with descriptions
   - Options:
     - Entscheidungsträger (Decision Maker) - "Kann finale Entscheidungen treffen"
     - Schlüsselbeeinflusser (Key Influencer) - "Hat starken Einfluss auf Entscheidungen"
     - Empfehler (Recommender) - "Gibt Empfehlungen ab"
     - Gatekeeper - "Kontrolliert Informationszugang"
     - Operativer Kontakt (Operational Contact) - "Tägliche Ansprechperson"
     - Informativ (Informational) - "Wird informiert, keine Entscheidungsmacht"

2. **Autoritätslevel** (Required):
   - Label: "Autoritätslevel \*"
   - Radio group with icons:
     - Niedrig (Low) - 1 star
     - Mittel (Medium) - 2 stars
     - Hoch (High) - 3 stars
     - Finale Autorität (Final Authority) - Crown icon

3. **Kann Bestellungen genehmigen**:
   - Label: "Kann Bestellungen genehmigen"
   - Checkbox: ☐ "Ja, kann Bestellungen genehmigen"
   - When checked: Approval limit field appears below

4. **Genehmigungslimit** (Required if checkbox checked):
   - Label: "Genehmigungslimit \*"
   - Input: Number, with "€" suffix
   - Placeholder: "50000"
   - Validation: 0-10,000,000
   - Error (if checkbox checked but no limit): "Genehmigungslimit ist erforderlich, wenn Kontakt Bestellungen genehmigen kann (Business Rule CO-001)"
   - Help text: "Maximaler Auftragswert, den dieser Kontakt genehmigen kann"

5. **Funktionale Rollen** (Optional):
   - Label: "Funktionale Rollen"
   - Multi-select checkboxes:
     - ☐ Inhaber/Geschäftsführer
     - ☐ Einkaufsleiter
     - ☐ Filialleiter
     - ☐ Lagerleiter
     - ☐ Projektkoordinator
     - ☐ Finanzkontrolleur
     - ☐ Betriebsleiter
     - ☐ Verwaltung
   - Help text: "Funktionen, die dieser Kontakt ausübt"

6. **Abteilungseinfluss** (Optional):
   - Label: "Abteilungseinfluss"
   - Multi-select with chips
   - Options: Einkauf, Finanzen, Betrieb, IT, Marketing, etc.
   - Shows as chips: "Einkauf ×", "Finanzen ×"

**Tab 3: Standortzuordnung (Location Assignment)**

1. **Zugewiesene Standorte** (Optional):
   - Label: "Zugewiesene Standorte"
   - Multi-select list (checkboxes)
   - Shows all customer locations
   - Example items:
     - ☐ Filiale München Süd (Industriestraße 42)
     - ☐ Hauptsitz München (Hauptstraße 1)
     - ☐ Lager Augsburg (Lagerstraße 10)
   - Help text: "Standorte, an denen dieser Kontakt tätig ist"

2. **Hauptansprechpartner für** (Optional):
   - Label: "Hauptansprechpartner für folgende Standorte"
   - Multi-select (subset of assigned locations)
   - Options: Only locations from "Zugewiesene Standorte"
   - Validation: Must be subset of assigned locations (Business Rule CO-002)
   - Error: "Kontakt ist Hauptansprechpartner für Standort X, aber nicht zugewiesen"
   - Visual: Blue checkmark for primary locations

3. **Interne Notizen** (Optional):
   - Label: "Interne Notizen"
   - **Rich Text Editor** (WYSIWYG): Basic toolbar configuration
     - Toolbar buttons: Bold, Italic, Underline, Bullet List, Numbered List, Link, Undo, Redo
     - See `ui-ux/02-core-components/rich-text-editor.md` for complete toolbar design
   - Min height: 150px (content area)
   - Placeholder: "Persönliche Präferenzen, Gesprächsnotizen, Besonderheiten..."
   - Max length: 1000 characters
   - Character counter: "0 / 1000 Zeichen" (bottom-right corner)
   - Help text: "Interne Notizen zu diesem Kontakt (nur für Mitarbeiter sichtbar)"
   - **Mobile**: Simplified toolbar (Bold, Italic, Lists only)

**Form Footer (Sticky, spans all tabs):**

- Buttons:
  - "Abbrechen" (cancel, outlined)
  - "Kontakt speichern" (save, blue)

**Validation Warnings:**

**CO-001 Validation:**

- If "Kann Bestellungen genehmigen" checked but no approval limit
- Error below approval limit field: "Bitte geben Sie ein Genehmigungslimit ein"
- Cannot submit until resolved

**CO-002 Validation:**

- If primary for location not in assigned list
- Error below field: "Dieser Standort muss in 'Zugewiesene Standorte' ausgewählt sein"
- Suggestion: "Automatisch zuweisen?" button

**RBAC Indicators:**

- Lock icon next to restricted field labels
- Tooltip on lock: "Nur für PLAN und GF bearbeitbar"
- Fields disabled for ADM users
- Shows read-only values if editing existing contact

**Mobile Layout:**

- Full-screen dialog
- Tabs become dropdown selector at top
- Single column
- All fields full width
- Collapsible sections instead of tabs (optional)

Design with clear visual hierarchy, helpful validation messages, and RBAC indicators for restricted fields.

## Interaction Patterns

### Tab Navigation

1. User fills "Grunddaten" tab
2. Clicks "Entscheidungsbefugnis" tab
3. If ADM user: Restriction notice shown, fields disabled
4. If PLAN/GF: Fields editable
5. User proceeds to "Standortzuordnung" tab
6. Selects locations
7. Clicks "Kontakt speichern"

### Approval Limit Field

- Checkbox unchecked: Limit field hidden
- Check checkbox: Limit field appears with animation
- Required validation applies only when checkbox checked

### Location Assignment

- Select locations in first field
- Primary location field updates to show only selected locations
- Automatic validation between the two fields

## German Labels & Content

### Tab Labels

- **Grunddaten**: Basic information
- **Entscheidungsbefugnis**: Decision authority
- **Standortzuordnung**: Location assignment

### Personal Info Fields

- **Anrede**: Salutation (Herr, Frau, Divers)
- **Titel**: Title
- **Vorname**: First name
- **Nachname**: Last name
- **Position**: Position
- **E-Mail**: Email
- **Telefon**: Phone
- **Mobil**: Mobile
- **Bevorzugte Kontaktmethode**: Preferred contact method
- **Sprache**: Language

### Decision Authority Fields

- **Entscheidungsrolle**: Decision role
- **Autoritätslevel**: Authority level
- **Kann Bestellungen genehmigen**: Can approve orders
- **Genehmigungslimit**: Approval limit
- **Funktionale Rollen**: Functional roles
- **Abteilungseinfluss**: Department influence

### Location Fields

- **Zugewiesene Standorte**: Assigned locations
- **Hauptansprechpartner für**: Primary contact for

### RBAC Messages

- **Nur für PLAN und GF bearbeitbar**: Editable only for PLAN and GF
- **Sie haben keine Berechtigung**: You have no permission
- **Eingeschränkter Zugriff**: Limited access

## Accessibility Requirements

- WCAG 2.1 AA compliance
- Tabs: role="tablist", keyboard navigation with arrows
- Restricted fields: aria-disabled="true" for ADM users
- RBAC indicators: aria-label="Eingeschränktes Feld"
- Screen reader announces tab changes
- Form submission prevented until validation passes

## Mobile Considerations

- Full-screen on mobile
- Tabs become dropdown or accordion
- Single column layout
- Larger touch targets
- Collapsible sections for better mobile UX

## Example Data

**New Contact:**

- Anrede: Herr
- Vorname: Hans
- Nachname: Müller
- Position: Geschäftsführer
- E-Mail: h.mueller@hofladen-mueller.de
- Telefon: +49-89-1234567
- Mobil: +49-170-1234567
- Bevorzugte Kontaktmethode: E-Mail
- Entscheidungsrolle: Entscheidungsträger
- Autoritätslevel: Finale Autorität
- Kann Bestellungen genehmigen: ✓
- Genehmigungslimit: 50000 €
- Funktionale Rollen: Inhaber/Geschäftsführer, Einkaufsleiter
- Zugewiesene Standorte: Filiale München Süd, Hauptsitz
- Hauptansprechpartner für: Filiale München Süd

## Implementation Notes

### shadcn/ui Installation

```bash
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add form
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add radio-group
npx shadcn-ui@latest add button    # For rich text editor toolbar
npx shadcn-ui@latest add separator # For rich text editor toolbar
npx shadcn-ui@latest add tooltip   # For rich text editor toolbar
```

### TipTap Rich Text Editor Installation

```bash
# Core TipTap packages for basic toolbar (internal notes)
pnpm add @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder
pnpm add @tiptap/extension-link @tiptap/extension-underline
```

### Contact Schema

```typescript
const contactSchema = z
  .object({
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    decisionMakingRole: z.enum([
      "decision_maker",
      "key_influencer",
      "recommender",
      "gatekeeper",
      "operational_contact",
      "informational",
    ]),
    authorityLevel: z.enum(["low", "medium", "high", "final_authority"]),
    canApproveOrders: z.boolean(),
    approvalLimitEur: z.number().min(0).max(10000000).optional(),
  })
  .refine(
    (data) =>
      !data.canApproveOrders ||
      (data.approvalLimitEur && data.approvalLimitEur > 0),
    {
      message:
        "Genehmigungslimit erforderlich wenn Bestellungen genehmigt werden können",
      path: ["approvalLimitEur"],
    },
  );
```

### Component Dependencies

- Parent customer context
- Location list from customer
- RBAC context for field restrictions
- Validation schemas from shared

### State Management

- Form state with tabs
- Current user role for RBAC
- Customer locations list
- Conditional field visibility (approval limit)

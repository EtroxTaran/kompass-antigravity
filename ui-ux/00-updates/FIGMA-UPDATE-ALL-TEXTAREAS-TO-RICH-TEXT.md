# Figma Make: Replace ALL Textareas with Rich Text Editor

**Purpose:** Update all existing KOMPASS form designs in Figma  
**Action:** Replace every multi-line textarea with rich text WYSIWYG editor  
**Date:** 2025-01-27

---

## 🎯 MASTER PROMPT FOR FIGMA MAKE

**Copy everything below this line and paste into Figma Make:**

---

Update all KOMPASS form designs by replacing EVERY multi-line textarea field with a rich text WYSIWYG editor component. Find all textarea components in these 7 forms and replace them with the rich text editor design specified below.

## DESIGN SPECIFICATION: Rich Text Editor Component

### Container

- Border: 1px solid #e5e7eb
- Border radius: 8px
- Background: white
- No shadow
- Full width

### Toolbar (Top Section)

**CRITICAL FIX:** Toolbar must use HORIZONTAL scrolling ONLY, NO vertical scrollbar

- Height: 48px (fixed, no auto-expand)
- Background: white
- Border-bottom: 1px solid #e5e7eb
- Padding: 8px (top, bottom, left, right)
- Display: Flex
- Flex direction: ROW (horizontal)
- Flex wrap: NO-WRAP (keep buttons in single row)
- Overflow-x: auto (horizontal scroll if needed)
- Overflow-y: hidden (NO vertical scrollbar)
- Gap between buttons: 4px
- Align items: center

### Toolbar Buttons

- Size: 32px × 32px (height AND width - square buttons)
- Min-width: 32px (prevent shrinking)
- Flex-shrink: 0 (buttons never shrink)
- Border radius: 6px (rounded-md)
- Padding: 0 (icon centered)

**Button States:**

- **Inactive (default):**
  - Background: transparent
  - Icon: #374151 (gray-700)
  - Border: none
- **Hover:**
  - Background: #f3f4f6 (gray-100)
  - Icon: #1f2937 (gray-800)
- **Active (pressed/selected):**
  - Background: #2563eb (blue-600)
  - Icon: #ffffff (white)
- **Focus (keyboard):**
  - Ring: 2px solid #2563eb (blue-600)
  - Ring offset: 1px
- **Disabled:**
  - Background: transparent
  - Icon: #9ca3af (gray-400)
  - Opacity: 0.5
  - Cursor: not-allowed

### Button Icons (Lucide Icons)

- Size: 16px × 16px (h-4 w-4)
- Stroke width: 2
- Color: Inherited from button state

### Vertical Separators (Between Button Groups)

- Width: 1px
- Height: 32px
- Background: #d1d5db (gray-300)
- Margin: 0 4px
- Flex-shrink: 0

### Content Area

- Padding: 16px all sides
- Min-height: varies (see below per field)
- Background: white
- Font: 16px, Inter font family
- Line height: 1.5
- Color: #1f2937 (gray-900)
- Placeholder: #9ca3af (gray-400), italic

### Character Counter (Bottom-right)

- Position: Inside editor container, bottom-right corner
- Padding: 8px 16px
- Font: 12px (text-xs)
- Background: white
- Border-top: 1px solid #e5e7eb
- Text align: right

**Color States:**

- Normal (0-80%): #6b7280 (gray-500)
- Warning (80-99%): #f97316 (orange-500)
- Over limit (100%+): #ef4444 (red-500)

---

## FIND AND REPLACE: Every Textarea in These Forms

### 1. ACTIVITY PROTOCOL FORM

**FIND:**

- Field: "Beschreibung" (multiline textarea, 5 rows)

**REPLACE WITH:**
Rich Text Editor - STANDARD TOOLBAR

- Toolbar buttons in order: [Bold][Italic][Underline][Strikethrough] | [H2][H3] | [List][ListOrdered][CheckSquare] | [Quote][Link] | [Undo][Redo]
- Min height: 200px
- Max: 2000 chars
- ADD: Microphone button (44px × 44px, blue, bottom-right of content area)

---

**FIND:**

- Field: "Nächste Schritte" (multiline textarea, 2 rows)

**REPLACE WITH:**
Rich Text Editor - BASIC TOOLBAR WITH TASK LIST

- Toolbar buttons: [Bold][Italic] | [List][ListOrdered][CheckSquare] | [Link] | [Undo][Redo]
- Min height: 100px
- Max: 500 chars

---

### 2. CUSTOMER FORM

**FIND:**

- Section: "Geschäftsdaten"
- Look for: "Notizen" textarea field (if it exists as plain textarea)

**REPLACE WITH:**
Rich Text Editor - BASIC TOOLBAR

- Label: "Interne Notizen"
- Toolbar buttons: [Bold][Italic][Underline] | [List][ListOrdered] | [Link] | [Undo][Redo]
- Min height: 150px
- Max: 1000 chars

---

### 3. CONTACT FORM

**FIND:**

- Tab: "Standortzuordnung"
- Look for: Any textarea for notes

**REPLACE WITH:**
Rich Text Editor - BASIC TOOLBAR

- Label: "Interne Notizen"
- Toolbar buttons: [Bold][Italic][Underline] | [List][ListOrdered] | [Link] | [Undo][Redo]
- Min height: 150px
- Max: 1000 chars

---

### 4. LOCATION FORM

**FIND:**

- Field: "Anlieferhinweise" (textarea, 3 rows)
- Field: "Parkmöglichkeiten" (textarea, 2 rows)
- Field: Any "Beschreibung" or "Standortbeschreibung" textarea

**REPLACE WITH:**
Rich Text Editor - BASIC TOOLBAR (for Standortbeschreibung only)

- Toolbar buttons: [Bold][Italic][Underline] | [List][ListOrdered] | [Link] | [Undo][Redo]
- Min height: 150px
- Max: 2000 chars

**KEEP AS PLAIN TEXTAREA:**

- "Anlieferhinweise" (operational instructions - can stay plain)
- "Parkmöglichkeiten" (very short - can stay plain)

---

### 5. OPPORTUNITY FORM

**FIND:**

- Field: "Beschreibung" (textarea, 4 rows)
- Field: "Nächster Schritt" (textarea, 2 rows)
- Field: "Grund für Verlust" (textarea, 3 rows, conditional on Status=Verloren)

**REPLACE WITH:**

**Beschreibung:**
Rich Text Editor - STANDARD TOOLBAR

- Toolbar buttons: [Bold][Italic][Underline][Strikethrough] | [H2][H3] | [List][ListOrdered][CheckSquare] | [Quote][Link] | [Undo][Redo]
- Min height: 200px
- Max: 5000 chars

**Nächster Schritt:**
Rich Text Editor - BASIC TOOLBAR

- Toolbar buttons: [Bold][Italic] | [List][ListOrdered] | [Link] | [Undo][Redo]
- Min height: 100px
- Max: 500 chars

**Grund für Verlust:**
Rich Text Editor - BASIC TOOLBAR

- Toolbar buttons: [Bold][Italic] | [List][ListOrdered] | [Link] | [Undo][Redo]
- Min height: 120px
- Max: 1000 chars

---

### 6. PROJECT FORM

**FIND:**

- Tab 1: "Projektbeschreibung" (textarea, 5 rows)
- Tab 4: "Externe Partner" (textarea, 3 rows)
- Tab 5: Look for any notes/description textarea

**REPLACE WITH:**

**Projektbeschreibung:**
Rich Text Editor - ADVANCED TOOLBAR

- Toolbar buttons: [Bold][Italic][Underline][Strikethrough] | [H1][H2][H3][Pilcrow] | [List][ListOrdered][CheckSquare] | [Quote][Code][Minus] | [Link][Table] | [Undo][Redo]
- Min height: 250px
- Max: 5000 chars

**Externe Partner:**
Rich Text Editor - BASIC TOOLBAR

- Toolbar buttons: [Bold][Italic] | [List][ListOrdered] | [Link] | [Undo][Redo]
- Min height: 100px
- Max: 1000 chars

**Projektnotizen (ADD NEW):**
Rich Text Editor - ADVANCED TOOLBAR

- Same as Projektbeschreibung
- Min height: 200px
- Max: 5000 chars
- Position: In Tab 5 "Dokumente & Notizen", below file upload area

---

### 7. INVOICE FORM

**FIND:**

- Field: "Rechnungstext" or "Notizen" (textarea, 3 rows)

**REPLACE WITH:**
Rich Text Editor - BASIC TOOLBAR

- Label: "Bemerkungen / Zahlungsbedingungen"
- Toolbar buttons: [Bold][Italic][Underline] | [List][ListOrdered] | [Link] | [Undo][Redo]
- Min height: 120px
- Max: 2000 chars
- SPECIAL: Add lock icon (🔒) in top-right when invoice status = "Abgeschlossen"

---

## BUTTON ICON REFERENCE (Use Lucide Icons)

Map these button names to Lucide icons (all 16px × 16px, stroke-width: 2):

| Button        | Icon Name       | Lucide Component    |
| ------------- | --------------- | ------------------- |
| Bold          | Bold            | `<Bold />`          |
| Italic        | Italic          | `<Italic />`        |
| Underline     | Underline       | `<Underline />`     |
| Strikethrough | Strikethrough   | `<Strikethrough />` |
| H1            | Heading 1       | `<Heading1 />`      |
| H2            | Heading 2       | `<Heading2 />`      |
| H3            | Heading 3       | `<Heading3 />`      |
| Paragraph     | Pilcrow         | `<Pilcrow />`       |
| List          | Bullet List     | `<List />`          |
| ListOrdered   | Numbered List   | `<ListOrdered />`   |
| CheckSquare   | Task List       | `<CheckSquare />`   |
| Quote         | Blockquote      | `<Quote />`         |
| Code          | Code Block      | `<Code />`          |
| Minus         | Horizontal Rule | `<Minus />`         |
| Link          | Link            | `<Link />`          |
| Table         | Table           | `<Table />`         |
| Undo          | Undo            | `<Undo />`          |
| Redo          | Redo            | `<Redo />`          |
| Mic           | Microphone      | `<Mic />`           |

---

## TOOLBAR VARIANTS (Button Count)

**Basic Toolbar (8 buttons):**
[Bold] [Italic] [Underline] | [List] [ListOrdered] | [Link] | [Undo] [Redo]

Used in: Customer notes, Contact notes, Location description, Invoice remarks, Project external partners

**Basic + Tasks (9 buttons):**
[Bold] [Italic] | [List] [ListOrdered] [CheckSquare] | [Link] | [Undo] [Redo]

Used in: Activity "Nächste Schritte", Opportunity "Nächster Schritt"

**Standard Toolbar (12 buttons):**
[Bold] [Italic] [Underline] [Strikethrough] | [H2] [H3] | [List] [ListOrdered] [CheckSquare] | [Quote] [Link] | [Undo] [Redo]

Used in: Activity Protocol "Beschreibung", Opportunity "Beschreibung"

**Advanced Toolbar (20 buttons):**
[Bold] [Italic] [Underline] [Strikethrough] | [H1] [H2] [H3] [Pilcrow] | [List] [ListOrdered] [CheckSquare] | [Quote] [Code] [Minus] | [Link] [Table] | [Undo] [Redo]

Used in: Project "Projektbeschreibung", Project "Projektnotizen"

---

## MOBILE OPTIMIZATION (<768px)

**Toolbar Changes for Mobile:**

- Button size: 44px × 44px (touch-friendly)
- Gap: 8px between buttons
- Overflow: horizontal scroll (swipe to see more buttons)
- Or: Show only essential buttons + "Mehr" button
- "Mehr" button expands to show additional buttons below (vertical expansion)

**Essential buttons (always visible on mobile):**
[Bold] [Italic] [List] [Mehr]

**"Mehr" button:**

- Variant: ghost
- Label: "Mehr" (collapsed) or "Weniger" (expanded)
- Size: 44px × 44px
- Toggles visibility of additional buttons below

---

## ACCESSIBILITY REQUIREMENTS

Each button MUST have:

- `aria-label` with German text + keyboard shortcut
  - Examples:
    - "Fett (Ctrl+B)"
    - "Kursiv (Ctrl+I)"
    - "Aufzählung"
    - "Rückgängig (Ctrl+Z)"
- Focus indicator: 2px ring, blue-600, 1px offset
- Minimum touch target: 44px × 44px on mobile

Editor MUST have:

- `role="textbox"`
- `aria-label="Rich text editor"`
- `aria-multiline="true"`

---

## GERMAN TOOLTIPS

Use these exact German labels in tooltips:

- Fett (Ctrl+B)
- Kursiv (Ctrl+I)
- Unterstrichen (Ctrl+U)
- Durchgestrichen
- Überschrift 1
- Überschrift 2
- Überschrift 3
- Absatz
- Aufzählung
- Nummerierte Liste
- Aufgabenliste
- Zitat
- Code-Block
- Trennlinie
- Link einfügen
- Tabelle einfügen
- Rückgängig (Ctrl+Z)
- Wiederherstellen (Ctrl+Y)

---

## COMPLETE FIELD REPLACEMENT LIST

### ACTIVITY PROTOCOL FORM (activity-protocol-form.md)

**Field 1: Beschreibung**

- CURRENT: Textarea, 5 rows, "Was wurde besprochen..."
- NEW: Rich text editor, Standard toolbar (12 buttons)
- Height: 200px min
- Max: 2000 chars
- SPECIAL: Add microphone button (blue, 44px, bottom-right)

**Field 2: Nächste Schritte**

- CURRENT: Textarea, 2 rows, "Was sind die nächsten Schritte..."
- NEW: Rich text editor, Basic+Tasks toolbar (9 buttons)
- Height: 100px min
- Max: 500 chars

---

### CUSTOMER FORM (customer-form.md)

**Field: Interne Notizen**

- CURRENT: May be plain textarea or not exist
- NEW: Rich text editor, Basic toolbar (8 buttons)
- Height: 150px min
- Max: 1000 chars
- Position: Section "Geschäftsdaten", after "Zahlungsziel"

---

### CONTACT FORM (contact-form.md)

**Field: Interne Notizen**

- CURRENT: May not exist
- NEW: Rich text editor, Basic toolbar (8 buttons)
- Height: 150px min
- Max: 1000 chars
- Position: Tab 3 "Standortzuordnung", after "Hauptansprechpartner für"

---

### LOCATION FORM (location-form.md)

**Field: Standortbeschreibung**

- CURRENT: May not exist
- NEW: Rich text editor, Basic toolbar (8 buttons)
- Height: 150px min
- Max: 2000 chars
- Position: New section "Zusätzliche Informationen", after "Zugewiesene Kontakte"

**KEEP AS PLAIN TEXTAREA:**

- "Anlieferhinweise" (operational, stays plain)
- "Parkmöglichkeiten" (very short, stays plain)

---

### OPPORTUNITY FORM (opportunity-form.md)

**Field 1: Beschreibung**

- CURRENT: Textarea, 4 rows, "Detaillierte Beschreibung..."
- NEW: Rich text editor, Standard toolbar (12 buttons)
- Height: 200px min
- Max: 5000 chars

**Field 2: Nächster Schritt**

- CURRENT: Textarea, 2 rows
- NEW: Rich text editor, Basic toolbar (8 buttons)
- Height: 100px min
- Max: 500 chars

**Field 3: Grund für Verlust** (conditional, when Status=Verloren)

- CURRENT: Textarea, 3 rows
- NEW: Rich text editor, Basic toolbar (8 buttons)
- Height: 120px min
- Max: 1000 chars

---

### PROJECT FORM (project-form.md)

**Field 1: Projektbeschreibung** (Tab 1)

- CURRENT: Textarea, 5 rows
- NEW: Rich text editor, Advanced toolbar (20 buttons)
- Height: 250px min
- Max: 5000 chars

**Field 2: Externe Partner** (Tab 4)

- CURRENT: Textarea, 3 rows
- NEW: Rich text editor, Basic toolbar (8 buttons)
- Height: 100px min
- Max: 1000 chars

**Field 3: Projektnotizen** (Tab 5 - ADD NEW)

- CURRENT: Does not exist
- NEW: Rich text editor, Advanced toolbar (20 buttons)
- Height: 200px min
- Max: 5000 chars
- Position: Tab 5 (rename to "Dokumente & Notizen"), below file upload

---

### INVOICE FORM (invoice-form.md)

**Field: Bemerkungen / Zahlungsbedingungen**

- CURRENT: Textarea labeled "Rechnungstext / Notizen", 3 rows
- NEW: Rich text editor, Basic toolbar (8 buttons)
- Height: 120px min
- Max: 2000 chars
- SPECIAL: Lock icon (🔒) appears in top-right when status="Abgeschlossen"

---

## FIGMA DESIGN INSTRUCTIONS

1. **Create Rich Text Editor Component**
   - Make it a Figma component with variants
   - Variants: Basic (8), Standard (12), Advanced (20)
   - Use Auto Layout for toolbar (horizontal, wrap=false)
   - Use Auto Layout for content area (vertical)

2. **Button Component**
   - Create button component with states (Default, Hover, Active, Focus, Disabled)
   - 32px × 32px size (desktop)
   - 44px × 44px size (mobile)

3. **Find-Replace in Figma**
   - Search for all textarea components in forms
   - Replace with corresponding rich text editor variant
   - Match min-height to original textarea rows (approx 40px per row)

4. **Fix Scrollbar Issue**
   - Toolbar container: `overflow-y: hidden` (NO vertical scroll!)
   - Toolbar container: `overflow-x: auto` (horizontal scroll OK)
   - Toolbar buttons: `flex-shrink: 0` (don't shrink)
   - Toolbar: `flex-wrap: nowrap` (single row always)

5. **Test in Figma**
   - Preview all forms
   - Verify toolbar shows in single horizontal row
   - Verify no vertical scrollbar in toolbar
   - Verify buttons don't wrap to second row
   - Verify horizontal scroll works if too many buttons

---

## QUALITY CHECKLIST

After applying this prompt, verify:

- [ ] NO vertical scrollbar in any toolbar
- [ ] Toolbar buttons in single horizontal row
- [ ] All 14 textarea fields replaced (11 we already did + 3 new ones)
- [ ] Character counters positioned bottom-right
- [ ] Button sizes correct: 32px desktop, 44px mobile
- [ ] Separators between button groups (1px gray-300)
- [ ] German labels in tooltips
- [ ] Microphone button on Activity Protocol form
- [ ] Lock icon on Invoice form (finalized state)
- [ ] Mobile variations with 44px buttons

---

**Total Fields Updated:** 14  
**Forms Affected:** 7  
**Special Features:** 2 (Voice-to-text, GoBD lock)

---

END OF PROMPT - Copy everything above into Figma Make

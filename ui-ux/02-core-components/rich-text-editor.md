# Rich Text Editor (WYSIWYG)

**Component Type:** Form Input / WYSIWYG Editor  
**Complexity:** Advanced  
**Usage:** Activity Protocols, Project Descriptions, Customer/Contact Notes, Invoice Remarks  
**Last Updated:** 2025-01-27

---

## Context & Purpose

The Rich Text Editor is a WYSIWYG (What You See Is What You Get) editor component used throughout KOMPASS for formatted text entry. It enables users to create structured, formatted content with:

- **Activity Protocols**: Meeting notes with formatting, task lists, and voice-to-text integration
- **Project Descriptions**: Structured content with headings, tables, lists for technical specifications
- **Customer/Contact Notes**: Internal notes with basic formatting (bold, italic, lists)
- **Invoice Remarks**: Payment terms and legal notices (GoBD immutable after finalization)

The editor integrates seamlessly with shadcn/ui design system, provides WCAG 2.1 AA accessibility, and supports mobile touch interfaces with optimized toolbars.

---

## Design Requirements

### Visual Hierarchy

1. **Toolbar** (Top): Grouped buttons for formatting options, clearly separated by visual dividers
2. **Content Area** (Main): Editable content area with prose styling (Tailwind typography)
3. **Character Counter** (Bottom-right): Optional character count display (e.g., "150 / 2000 Zeichen")
4. **Help Text** (Below): Optional descriptive help text or error messages

### Layout Structure

**Desktop (≥768px):**
- Full toolbar with all buttons visible
- 4-6 button groups separated by vertical dividers
- Minimum content area height: 200px
- Content area expands to fit content

**Mobile (<768px):**
- Compact toolbar with essential buttons visible
- "Mehr" (More) button to expand additional options
- Larger button sizes (44px minimum) for touch
- Simplified button labels (icons only, tooltips on long-press)

---

## Toolbar Configurations

### Basic Toolbar (Customer/Contact Notes)

**Button Groups:**
1. **Text Formatting**: Bold, Italic, Underline
2. **Lists**: Bullet List, Numbered List
3. **Insert**: Link
4. **History**: Undo, Redo

**Total Buttons:** 8

**Use Case:** Simple notes where structured formatting is not critical

---

### Standard Toolbar (Activity Protocols, Opportunities)

**Button Groups:**
1. **Text Formatting**: Bold, Italic, Underline, Strikethrough
2. **Headings**: H2, H3
3. **Lists**: Bullet List, Numbered List, Task List (checkboxes)
4. **Blocks**: Blockquote
5. **Insert**: Link
6. **History**: Undo, Redo

**Total Buttons:** 12

**Use Case:** Meeting notes, opportunity descriptions with structured content

---

### Advanced Toolbar (Project Descriptions)

**Button Groups:**
1. **Text Formatting**: Bold, Italic, Underline, Strikethrough
2. **Headings**: H1, H2, H3, Paragraph
3. **Lists**: Bullet List, Numbered List, Task List
4. **Blocks**: Blockquote, Code Block, Horizontal Rule
5. **Insert**: Link, Image, Table
6. **History**: Undo, Redo
7. **Advanced**: Mention (@), Clear Formatting

**Total Buttons:** 20+

**Use Case:** Comprehensive project documentation with tables, code, mentions

---

## shadcn/ui Components Used

- **Button** (`@/components/ui/button`): All toolbar buttons
  - Variants: `default` (active state), `ghost` (inactive state)
  - Size: `sm` (32px height, 32px width for icon-only buttons)
- **Separator** (`@/components/ui/separator`): Vertical dividers between button groups
  - Orientation: `vertical`
  - Height: 32px (matches button height)
- **Tooltip** (`@/components/ui/tooltip`): Button tooltips with keyboard shortcuts
  - Content: German label + keyboard shortcut (e.g., "Fett (Ctrl+B)")
- **Form Components** (`@/components/ui/form`): Integration with React Hook Form
  - FormItem, FormLabel, FormControl, FormMessage, FormDescription

---

## Figma Make Prompt

### Component Overview

Design a comprehensive rich text editor (WYSIWYG) component for KOMPASS CRM with three toolbar configurations (Basic, Standard, Advanced). The editor should integrate seamlessly with the shadcn/ui design system using Tailwind CSS styling.

### Desktop Layout (≥768px)

**Dimensions:**
- Width: 100% (responsive container)
- Minimum height: 200px
- Border: 1px solid `border` (gray-200)
- Border radius: 8px (rounded-lg)
- Background: `background` (white)

**Toolbar (Top Section):**
- Height: 48px
- Background: `background` (white)
- Border-bottom: 1px solid `border` (gray-200)
- Padding: 8px (p-2)
- Display: Flex, wrap, gap: 4px

**Button Groups (in Toolbar):**
- Group buttons by function (Text Formatting | Lists | Blocks | Insert | History)
- Separate groups with vertical `Separator` (1px, height: 32px, gray-300)
- Gap between buttons: 4px

**Toolbar Buttons:**
- Size: 32px × 32px (sm)
- Border radius: 6px (rounded-md)
- **Inactive state** (`ghost` variant):
  - Background: transparent
  - Border: none
  - Icon: `foreground` (gray-700)
  - Hover: Background `accent` (gray-100)
  - Focus: Ring 2px `ring` (blue-600), offset 1px
- **Active state** (`default` variant):
  - Background: `primary` (blue-600)
  - Icon: `primary-foreground` (white)
  - Border: none
- **Disabled state**:
  - Background: transparent
  - Icon: `muted-foreground` (gray-400)
  - Cursor: not-allowed
  - Opacity: 0.5
- **Touch Target**: Minimum 44px × 44px (WCAG) - add padding if needed

**Button Icons (Lucide Icons):**
- Size: 16px × 16px (h-4 w-4)
- Stroke width: 2
- Color: Inherits from button state

**Content Area:**
- Padding: 16px (p-4)
- Min-height: 200px
- Typography: Prose styling (Tailwind `prose prose-sm`)
  - Paragraphs: 16px font size, 1.5 line height
  - Headings: H2 (24px bold), H3 (20px bold)
  - Lists: Standard spacing, 24px left margin
  - Links: Blue-600, underline
  - Task lists: Checkboxes with 8px margin-right
- Placeholder text: Gray-400, italic
- Focus state: No visible border (handled by editor)
- Cursor: text

**Character Counter (Bottom-right):**
- Position: Absolute, bottom-right corner
- Padding: 8px 16px
- Font: 12px (text-xs), Gray-500
- Border-top: 1px solid `border` (gray-200)
- Format: "X / Y Zeichen"
- ARIA live region: `polite`

---

### Mobile Layout (<768px)

**Toolbar Modifications:**
- Height: Auto (expandable)
- **Essential Buttons Row** (always visible):
  - Bold, Italic, Bullet List, "Mehr" button
  - Total: 4 buttons, 44px × 44px each
  - Gap: 8px (larger for touch)
- **"Mehr" Button**:
  - Label: "Mehr" or "Weniger" (toggle)
  - Variant: `ghost`
  - Expands to show additional buttons below
- **Expanded Buttons** (shown when "Mehr" active):
  - All remaining buttons from toolbar configuration
  - Flex wrap, gap: 8px
  - Padding: 8px

**Content Area:**
- Min-height: 150px (reduced for mobile)
- Padding: 12px (p-3)
- Touch-friendly text selection

**Character Counter:**
- Font: 11px (smaller)
- Padding: 6px 12px

---

### Accessibility Requirements (WCAG 2.1 AA)

**Keyboard Navigation:**
- All toolbar buttons accessible via Tab key
- Focus visible indicator: 2px ring, blue-600
- Keyboard shortcuts work: Ctrl+B (Bold), Ctrl+I (Italic), Ctrl+Z (Undo), Ctrl+Y (Redo)
- Content area accessible via Tab (skip to content)

**ARIA Attributes:**
- Editor: `role="textbox"`, `aria-label="Rich text editor"`, `aria-multiline="true"`
- Toolbar buttons: `aria-label` with German label + shortcut (e.g., "Fett (Ctrl+B)")
- Active buttons: `aria-pressed="true"`
- Disabled buttons: `aria-disabled="true"`
- Character counter: `aria-live="polite"`, `aria-atomic="true"`

**Screen Reader Support:**
- Button labels announced correctly
- Content changes announced
- Formatting state changes announced (e.g., "Bold active")

**Color Contrast:**
- Text: 4.5:1 minimum (WCAG AA)
- Active button: Background blue-600, Icon white (7:1 contrast)
- Inactive button icon: Gray-700 (4.5:1 contrast with white background)
- Disabled button: Gray-400 (acceptable for disabled state)

**Touch Targets:**
- Minimum: 44px × 44px (WCAG AAA)
- Spacing: 8px between buttons (prevents accidental touches)

---

### Button Details & German Labels

**Text Formatting Group:**
1. **Bold** (Fett)
   - Icon: `<Bold />` (Lucide)
   - Shortcut: Ctrl+B
   - ARIA: "Fett (Ctrl+B)"

2. **Italic** (Kursiv)
   - Icon: `<Italic />` (Lucide)
   - Shortcut: Ctrl+I
   - ARIA: "Kursiv (Ctrl+I)"

3. **Underline** (Unterstrichen)
   - Icon: `<Underline />` (Lucide)
   - Shortcut: Ctrl+U
   - ARIA: "Unterstrichen (Ctrl+U)"

4. **Strikethrough** (Durchgestrichen)
   - Icon: `<Strikethrough />` (Lucide)
   - ARIA: "Durchgestrichen"

**Headings Group:**
5. **Heading 1** (Überschrift 1)
   - Icon: `<Heading1 />` (Lucide)
   - ARIA: "Überschrift 1"

6. **Heading 2** (Überschrift 2)
   - Icon: `<Heading2 />` (Lucide)
   - ARIA: "Überschrift 2"

7. **Heading 3** (Überschrift 3)
   - Icon: `<Heading3 />` (Lucide)
   - ARIA: "Überschrift 3"

8. **Paragraph** (Absatz)
   - Icon: `<Pilcrow />` (Lucide)
   - ARIA: "Absatz"

**Lists Group:**
9. **Bullet List** (Aufzählung)
   - Icon: `<List />` (Lucide)
   - ARIA: "Aufzählung"

10. **Numbered List** (Nummerierte Liste)
    - Icon: `<ListOrdered />` (Lucide)
    - ARIA: "Nummerierte Liste"

11. **Task List** (Aufgabenliste)
    - Icon: `<CheckSquare />` (Lucide)
    - ARIA: "Aufgabenliste"

**Blocks Group:**
12. **Blockquote** (Zitat)
    - Icon: `<Quote />` (Lucide)
    - ARIA: "Zitat"

13. **Code Block** (Code-Block)
    - Icon: `<Code />` (Lucide)
    - ARIA: "Code-Block"

14. **Horizontal Rule** (Trennlinie)
    - Icon: `<Minus />` (Lucide)
    - ARIA: "Trennlinie"

**Insert Group:**
15. **Link** (Link einfügen)
    - Icon: `<Link />` (Lucide)
    - ARIA: "Link einfügen"

16. **Image** (Bild einfügen)
    - Icon: `<Image />` (Lucide)
    - ARIA: "Bild einfügen"

17. **Table** (Tabelle einfügen)
    - Icon: `<Table />` (Lucide)
    - ARIA: "Tabelle einfügen"

**History Group:**
18. **Undo** (Rückgängig)
    - Icon: `<Undo />` (Lucide)
    - Shortcut: Ctrl+Z
    - ARIA: "Rückgängig (Ctrl+Z)"

19. **Redo** (Wiederherstellen)
    - Icon: `<Redo />` (Lucide)
    - Shortcut: Ctrl+Y
    - ARIA: "Wiederherstellen (Ctrl+Y)"

**Advanced Group:**
20. **Mention** (Person erwähnen)
    - Icon: `<AtSign />` (Lucide)
    - ARIA: "Person erwähnen (@)"

21. **Clear Formatting** (Formatierung entfernen)
    - Icon: `<RemoveFormatting />` (Lucide)
    - ARIA: "Formatierung entfernen"

---

### Interaction Patterns

**Button Click:**
1. User clicks button
2. Button toggles active state (if toggle button like Bold)
3. Editor content updates with formatting
4. Focus returns to content area
5. Toast notification for important actions (optional)

**Keyboard Shortcuts:**
1. User presses Ctrl+B (example)
2. Bold formatting toggles
3. Bold button updates active state visually
4. No focus change (stays in content)

**Voice-to-Text (Activity Protocols only):**
1. Microphone button visible bottom-right of content area
2. User clicks microphone → starts listening (button turns red)
3. Speech recognition inserts plain text at cursor
4. User can then format text using toolbar
5. Click microphone again → stops listening

**Mobile Toolbar Expand:**
1. User clicks "Mehr" button
2. Additional buttons slide down below essential buttons
3. "Mehr" label changes to "Weniger"
4. Click "Weniger" → collapses back to essential buttons

**Character Counter:**
1. Updates live as user types
2. Color changes when approaching limit:
   - Normal: Gray-500
   - Warning (>80%): Orange-500
   - Error (>100%): Red-500
3. ARIA live region announces count changes

---

### Example Scenarios

**Scenario 1: Activity Protocol - Meeting Notes**
- Toolbar: Standard (12 buttons)
- User types notes: "Meeting mit Kunde XYZ"
- User selects "mit Kunde XYZ" → clicks Bold
- User continues: "Nächste Schritte:"
- User clicks Task List → creates checkbox list
- User adds tasks: "[ ] Angebot nachfassen", "[ ] Termin vereinbaren"
- Character counter shows: "245 / 2000 Zeichen"

**Scenario 2: Project Description - Technical Specs**
- Toolbar: Advanced (20+ buttons)
- User types heading: "Technische Anforderungen" → clicks H2
- User inserts table: clicks Table button → 3×3 table appears
- User fills table with specifications
- User adds code block: clicks Code Block → inserts `<code>` section
- User mentions colleague: types "@" → mentions popup appears

**Scenario 3: Customer Notes - Simple Formatting**
- Toolbar: Basic (8 buttons)
- User types: "Wichtige Notiz:"
- User selects "Wichtige" → clicks Bold and Italic
- User adds bullet list: "• Preissensibel\n• Bevorzugt Email-Kontakt"
- No complex formatting needed → keeps toolbar simple

---

### States

**Default:**
- Toolbar visible, all buttons inactive (ghost)
- Content area empty, placeholder visible
- Character counter: "0 / X Zeichen"

**Active (Text Selected):**
- Selection highlighted (browser default)
- Relevant buttons show active state (e.g., Bold active if selection is bold)
- Toolbar remains visible

**Disabled:**
- All toolbar buttons disabled (ghost, reduced opacity)
- Content area read-only (gray background optional)
- Character counter hidden or grayed out

**Error:**
- Red border around content area (2px, red-500)
- Error message below editor (red-500 text)
- Character counter red if over limit

**Focus:**
- Content area has cursor blinking
- No visible border change (editor handles internally)
- Toolbar remains accessible via keyboard

---

## Mobile Considerations

- **Touch Targets**: 44px × 44px minimum (WCAG AAA)
- **Button Spacing**: 8px between buttons (prevent accidental touches)
- **Expandable Toolbar**: "Mehr" button for additional options
- **Larger Icons**: 20px × 20px on mobile (h-5 w-5)
- **Native Input**: Works with native mobile keyboards
- **Voice-to-Text**: Microphone button integrated (bottom-right)
- **Scrollable Content**: Content area scrolls independently
- **Pinch-to-Zoom**: Content area supports pinch gestures (accessibility)

---

## Example Data

### Basic Toolbar Example (Customer Notes)

**Input (HTML):**
```html
<p><strong>Wichtiger Kunde!</strong></p>
<p>Bevorzugt Kommunikation via E-Mail. Preissensibel.</p>
<ul>
  <li>Rabatt 10% gewährt</li>
  <li>Nächster Termin: 15.02.2025</li>
</ul>
```

**Visual Output:**
```
**Wichtiger Kunde!**

Bevorzugt Kommunikation via E-Mail. Preissensibel.

• Rabatt 10% gewährt
• Nächster Termin: 15.02.2025
```

---

### Standard Toolbar Example (Activity Protocol)

**Input (HTML):**
```html
<h2>Meeting Zusammenfassung</h2>
<p>Teilnehmer: Max Mustermann, Erika Müller</p>
<p>Themen:</p>
<ul data-type="taskList">
  <li data-checked="true">Budget für Q1 besprochen</li>
  <li data-checked="false">Angebot für Projekt XYZ nachfassen</li>
  <li data-checked="false">Termin für nächstes Meeting vereinbaren</li>
</ul>
<blockquote>
  <p>"Wir brauchen das Angebot bis Ende nächster Woche."</p>
</blockquote>
```

**Visual Output:**
```
## Meeting Zusammenfassung

Teilnehmer: Max Mustermann, Erika Müller

Themen:

☑ Budget für Q1 besprochen
☐ Angebot für Projekt XYZ nachfassen
☐ Termin für nächstes Meeting vereinbaren

> "Wir brauchen das Angebot bis Ende nächster Woche."
```

---

### Advanced Toolbar Example (Project Description)

**Input (HTML):**
```html
<h1>Projekt Hofladen Müller – Ladenausbau</h1>
<h2>Technische Anforderungen</h2>
<table>
  <thead>
    <tr>
      <th>Bereich</th>
      <th>Spezifikation</th>
      <th>Budget</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Beleuchtung</td>
      <td>LED, 3000K Warmweiß</td>
      <td>€ 5.000</td>
    </tr>
    <tr>
      <td>Regale</td>
      <td>Holz Eiche, 2m Höhe</td>
      <td>€ 8.000</td>
    </tr>
  </tbody>
</table>
<h2>Nächste Schritte</h2>
<p>Abstimmung mit <span data-mention="@max-mueller">Max Müller</span> für Elektroplanung.</p>
```

**Visual Output:**
```
# Projekt Hofladen Müller – Ladenausbau

## Technische Anforderungen

| Bereich      | Spezifikation           | Budget   |
|--------------|-------------------------|----------|
| Beleuchtung  | LED, 3000K Warmweiß     | € 5.000  |
| Regale       | Holz Eiche, 2m Höhe     | € 8.000  |

## Nächste Schritte

Abstimmung mit @Max Müller für Elektroplanung.
```

---

## Implementation Notes

### shadcn/ui Installation

```bash
# Required shadcn/ui components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add tooltip
npx shadcn-ui@latest add form
```

### TipTap Installation

```bash
# Core TipTap packages
pnpm add @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder
pnpm add @tiptap/extension-task-list @tiptap/extension-task-item
pnpm add @tiptap/extension-link @tiptap/extension-table
pnpm add @tiptap/extension-table-row @tiptap/extension-table-cell
pnpm add @tiptap/extension-table-header
pnpm add @tiptap/extension-mention @tiptap/extension-underline
```

### Component Files

- `apps/frontend/src/components/editor/RichTextEditor.tsx` - Main editor component
- `apps/frontend/src/components/editor/EditorToolbar.tsx` - Toolbar component
- `apps/frontend/src/components/editor/EditorContent.css` - Prose styling

### Type Definitions

- `packages/shared/src/types/components/rich-text-editor.types.ts` - Editor props, config
- `packages/shared/src/types/components/editor-toolbar.types.ts` - Toolbar types

---

## Component Dependencies

### shadcn/ui Components
- `Button` - All toolbar buttons
- `Separator` - Vertical dividers between button groups
- `Tooltip` - Button tooltips with shortcuts
- `Form` components - Integration with React Hook Form

### Lucide Icons
- Text formatting: `Bold`, `Italic`, `Underline`, `Strikethrough`
- Headings: `Heading1`, `Heading2`, `Heading3`, `Pilcrow`
- Lists: `List`, `ListOrdered`, `CheckSquare`
- Blocks: `Quote`, `Code`, `Minus`
- Insert: `Link`, `Image`, `Table`
- History: `Undo`, `Redo`
- Advanced: `AtSign`, `RemoveFormatting`
- Voice: `Mic`, `MicOff`

### External Libraries
- `@tiptap/react` - TipTap React integration
- `@tiptap/starter-kit` - Basic formatting extensions
- `@tiptap/extension-*` - Additional extensions (task lists, tables, etc.)

---

## Related Documentation

- **ADR-019**: `docs/architecture/decisions/ADR-019-rich-text-editor-selection.md` - TipTap decision rationale
- **Implementation Guide**: `docs/guides/RICH_TEXT_EDITOR_IMPLEMENTATION.md` - Complete implementation details
- **Type Definitions**: `packages/shared/src/types/components/rich-text-editor.types.ts` - TypeScript interfaces
- **Activity Protocol Form**: `ui-ux/03-entity-forms/activity-protocol-form.md` - Integration example

---

**Version:** 1.0  
**Last Review:** 2025-01-27  
**Next Review:** After MVP implementation

---

**Figma Design Tasks:**
- [ ] Desktop advanced toolbar (20+ buttons with all groups)
- [ ] Desktop standard toolbar (12 buttons, no tables/code)
- [ ] Desktop basic toolbar (8 buttons, minimal formatting)
- [ ] Mobile compact toolbar with "Mehr" button
- [ ] Content area with prose styling examples
- [ ] Character counter states (normal, warning, error)
- [ ] Button states (default, active, disabled, hover, focus)
- [ ] Voice-to-text microphone button (for Activity Protocols)
- [ ] Error state with red border and error message
- [ ] Tooltip examples with German labels and shortcuts


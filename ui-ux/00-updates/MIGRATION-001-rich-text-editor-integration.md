# MIGRATION-001: Rich Text Editor Integration – Figma Design Update

**Migration Date:** 2025-01-27  
**Affects:** All entity forms with multi-line text fields  
**Status:** Ready for Figma Make  
**Version:** 1.0

---

## 📋 Overview

This migration prompt updates all existing KOMPASS Figma designs to replace plain `Textarea` components with the new **TipTap Rich Text Editor** component. Use this single prompt in Figma Make to update all affected forms at once.

---

## 🎯 Figma Make Migration Prompt

### Master Update Prompt

```
Update all KOMPASS entity forms to replace plain textarea fields with rich text WYSIWYG editors.

SCOPE: Update 7 forms with 11 textarea fields total.

COMPONENT TO ADD: Rich Text Editor (WYSIWYG)
- Border: 1px solid #e5e7eb (gray-200)
- Border radius: 8px (rounded-lg)
- Background: white
- Min height: varies by form (see details below)

TOOLBAR DESIGN (appears at top of editor):
- Height: 48px
- Background: white
- Border-bottom: 1px solid #e5e7eb
- Padding: 8px
- Buttons: 32px × 32px, rounded-md
- Button inactive: transparent background, gray-700 icon
- Button active: blue-600 background, white icon
- Button hover: gray-100 background
- Vertical separators: 1px gray-300, height 32px
- Gap between buttons: 4px

CONTENT AREA:
- Padding: 16px (p-4)
- Typography: Prose styling (16px font, 1.5 line height)
- Placeholder text: gray-400, italic
- Character counter: bottom-right, 12px text, gray-500

---

DETAILED UPDATES BY FORM:

1. ACTIVITY PROTOCOL FORM (activity-protocol-form.md)
   Field: "Beschreibung" (Description)

   REPLACE: Plain textarea (5 rows)
   WITH: Rich text editor - STANDARD TOOLBAR

   Toolbar buttons (12 total):
   [Bold] [Italic] [Underline] [Strikethrough] | [H2] [H3] | [Bullet List] [Numbered List] [Task List ☐] | [Blockquote] [Link] | [Undo] [Redo]

   Specifications:
   - Min height: 200px
   - Placeholder: "Was wurde besprochen oder vereinbart? Nächste Schritte..."
   - Max length: 2000 characters
   - Character counter: "X / 2000 Zeichen" (bottom-right)
   - Special: Add microphone button at bottom-right (above character counter) for voice-to-text
     - Button: 44px × 44px, blue background, white mic icon
     - Tooltip: "Spracheingabe starten"
   - Help text: "Detaillierte Notizen zur Aktivität. Nutzen Sie Formatierung für Struktur."
   - Mobile: Compact toolbar with "Mehr" button to expand

---

2. CUSTOMER FORM (customer-form.md)
   Section: Geschäftsdaten
   Field: "Interne Notizen" (Internal Notes) - NEW OPTIONAL FIELD

   ADD: Rich text editor - BASIC TOOLBAR

   Toolbar buttons (8 total):
   [Bold] [Italic] [Underline] | [Bullet List] [Numbered List] | [Link] | [Undo] [Redo]

   Specifications:
   - Min height: 150px
   - Placeholder: "Besonderheiten, Präferenzen, historische Infos..."
   - Max length: 1000 characters
   - Character counter: "X / 1000 Zeichen" (bottom-right)
   - Label: "Interne Notizen"
   - Help text: "Diese Notizen sind nur für interne Zwecke sichtbar"
   - Position: After "Zahlungsziel" field, before section separator

---

3. CONTACT FORM (contact-form.md)
   Tab: "Standortzuordnung" (Location Assignment)
   Field: "Interne Notizen" (Internal Notes) - NEW OPTIONAL FIELD

   ADD: Rich text editor - BASIC TOOLBAR

   Toolbar buttons (8 total):
   [Bold] [Italic] [Underline] | [Bullet List] [Numbered List] | [Link] | [Undo] [Redo]

   Specifications:
   - Min height: 150px
   - Placeholder: "Persönliche Präferenzen, Gesprächsnotizen, Besonderheiten..."
   - Max length: 1000 characters
   - Character counter: "X / 1000 Zeichen" (bottom-right)
   - Label: "Interne Notizen"
   - Help text: "Interne Notizen zu diesem Kontakt (nur für Mitarbeiter sichtbar)"
   - Position: After "Hauptansprechpartner für" field, before form footer

---

4. LOCATION FORM (location-form.md)
   Section: Standortzuordnung (Location Assignment)
   Field: "Standortbeschreibung" (Location Description) - NEW OPTIONAL FIELD

   ADD NEW SECTION: "Zusätzliche Informationen" (Additional Information)
   ADD: Rich text editor - BASIC TOOLBAR

   Toolbar buttons (8 total):
   [Bold] [Italic] [Underline] | [Bullet List] [Numbered List] | [Link] | [Undo] [Redo]

   Specifications:
   - Min height: 150px
   - Placeholder: "Besonderheiten des Standorts, Anfahrtsbeschreibung, Zugangsinformationen..."
   - Max length: 2000 characters
   - Character counter: "X / 2000 Zeichen" (bottom-right)
   - Label: "Standortbeschreibung"
   - Help text: "Detaillierte Informationen zu diesem Standort für interne Zwecke"
   - Position: After "Zugewiesene Kontakte" field, before form footer

---

5. OPPORTUNITY FORM (opportunity-form.md)
   Section: Grunddaten
   Field: "Beschreibung" (Description)

   REPLACE: Plain textarea (4 rows)
   WITH: Rich text editor - STANDARD TOOLBAR

   Toolbar buttons (12 total):
   [Bold] [Italic] [Underline] [Strikethrough] | [H2] [H3] | [Bullet List] [Numbered List] [Task List ☐] | [Blockquote] [Link] | [Undo] [Redo]

   Specifications:
   - Min height: 200px
   - Placeholder: "Details zur Opportunity, Kundenanforderungen, nächste Schritte..."
   - Max length: 5000 characters
   - Character counter: "X / 5000 Zeichen" (bottom-right)
   - Help text: "Detaillierte Beschreibung. Nutzen Sie Aufgabenlisten (☐) für Action Items."
   - Mobile: Compact toolbar with "Mehr" button

---

6. PROJECT FORM (project-form.md)
   Tab: "Grunddaten" (Basic Information)
   Field: "Projektbeschreibung" (Project Description)

   REPLACE: Plain textarea (5 rows)
   WITH: Rich text editor - ADVANCED TOOLBAR

   Toolbar buttons (20+ total):
   [Bold] [Italic] [Underline] [Strikethrough] | [H1] [H2] [H3] [¶ Paragraph] | [Bullet List] [Numbered List] [Task List ☐] | [Blockquote] [Code Block] [Horizontal Rule] | [Link] [Table] | [Undo] [Redo]

   Specifications:
   - Min height: 250px
   - Placeholder: "Detaillierte Beschreibung des Projekts, Leistungsumfang, besondere Anforderungen..."
   - Max length: 5000 characters
   - Character counter: "X / 5000 Zeichen" (bottom-right)
   - Help text: "Strukturierte Projektbeschreibung. Nutzen Sie Überschriften (H2) für Abschnitte und Tabellen für Spezifikationen."
   - Mobile: Compact toolbar with "Mehr" button

   ---

   Tab: "Dokumente & Notizen" (Documents & Notes)
   Field: "Projektnotizen" (Project Notes) - NEW FIELD

   ADD: Rich text editor - ADVANCED TOOLBAR

   Toolbar buttons (20+ total):
   [Bold] [Italic] [Underline] [Strikethrough] | [H1] [H2] [H3] [¶] | [Bullet List] [Numbered List] [Task List ☐] | [Blockquote] [Code Block] [Horizontal Rule] | [Link] [Table] | [Undo] [Redo]

   Specifications:
   - Min height: 200px
   - Placeholder: "Projektnotizen, Milestones, offene Punkte, Lessons Learned..."
   - Max length: 5000 characters
   - Character counter: "X / 5000 Zeichen" (bottom-right)
   - Label: "Projektnotizen"
   - Help text: "Laufende Notizen zum Projekt. Nutzen Sie Aufgabenlisten (☐) für Milestones und offene Punkte."
   - Position: After "Projekt-Dokumente" upload area
   - Note: Update tab name from "Dokumente" to "Dokumente & Notizen"

---

7. INVOICE FORM (invoice-form.md)
   Section: Zahlungsinformationen (Payment Information)
   Field: "Bemerkungen / Zahlungsbedingungen" (Remarks / Payment Terms)

   REPLACE: Plain textarea (3 rows)
   WITH: Rich text editor - BASIC TOOLBAR

   Toolbar buttons (8 total):
   [Bold] [Italic] [Underline] | [Bullet List] [Numbered List] | [Link] | [Undo] [Redo]

   Specifications:
   - Min height: 120px
   - Placeholder: "Zahlungsbedingungen, Lieferbedingungen, rechtliche Hinweise..."
   - Max length: 2000 characters
   - Character counter: "X / 2000 Zeichen" (bottom-right)
   - Label: "Bemerkungen / Zahlungsbedingungen"
   - Help text: "Wird auf gedruckter Rechnung angezeigt"
   - IMPORTANT: Add lock icon (🔒) that appears after finalization (field becomes read-only, gray background)
   - GoBD indicator: Show lock icon when status is "Abgeschlossen"

---

BUTTON ICON MAPPING (use Lucide Icons):
- Bold: <Bold /> (weight=2)
- Italic: <Italic /> (weight=2)
- Underline: <Underline /> (weight=2)
- Strikethrough: <Strikethrough /> (weight=2)
- H1: <Heading1 /> (weight=2)
- H2: <Heading2 /> (weight=2)
- H3: <Heading3 /> (weight=2)
- Paragraph: <Pilcrow /> (weight=2)
- Bullet List: <List /> (weight=2)
- Numbered List: <ListOrdered /> (weight=2)
- Task List: <CheckSquare /> (weight=2)
- Blockquote: <Quote /> (weight=2)
- Code Block: <Code /> (weight=2)
- Horizontal Rule: <Minus /> (weight=2)
- Link: <Link /> (weight=2)
- Table: <Table /> (weight=2)
- Undo: <Undo /> (weight=2)
- Redo: <Redo /> (weight=2)
- Microphone (voice): <Mic /> (weight=2)

All icons: 16px × 16px (h-4 w-4)

---

MOBILE VARIATIONS:
For screens < 768px width:
- Toolbar height: Auto (expandable)
- Essential buttons row (always visible): Bold, Italic, Bullet List, "Mehr" button
- "Mehr" button: Ghost variant, label "Mehr" or "Weniger" (toggle)
- Expanded buttons: All remaining buttons, flex wrap, gap 8px
- Button size: 44px × 44px (touch-friendly)
- Min content height: 150px (reduced for mobile)

---

ACCESSIBILITY (WCAG 2.1 AA):
- All buttons: aria-label with German label + keyboard shortcut
  Example: aria-label="Fett (Ctrl+B)"
- Editor: role="textbox", aria-label="Rich text editor", aria-multiline="true"
- Active buttons: aria-pressed="true"
- Disabled buttons: aria-disabled="true"
- Character counter: aria-live="polite", aria-atomic="true"
- Focus indicators: 2px ring, blue-600 color
- Keyboard shortcuts work: Ctrl+B (Bold), Ctrl+I (Italic), Ctrl+Z (Undo), Ctrl+Y (Redo)
- Touch targets: Minimum 44px × 44px

---

GERMAN LABELS FOR TOOLTIPS:
- Fett (Ctrl+B) = Bold
- Kursiv (Ctrl+I) = Italic
- Unterstrichen (Ctrl+U) = Underline
- Durchgestrichen = Strikethrough
- Überschrift 1 = Heading 1
- Überschrift 2 = Heading 2
- Überschrift 3 = Heading 3
- Absatz = Paragraph
- Aufzählung = Bullet List
- Nummerierte Liste = Numbered List
- Aufgabenliste = Task List
- Zitat = Blockquote
- Code-Block = Code Block
- Trennlinie = Horizontal Rule
- Link einfügen = Insert Link
- Tabelle einfügen = Insert Table
- Rückgängig (Ctrl+Z) = Undo
- Wiederherstellen (Ctrl+Y) = Redo
- Spracheingabe starten = Start Voice Input

---

COLOR CHANGES WARNING STATES:
Character counter color changes when approaching limit:
- Normal (0-80%): gray-500 (#6b7280)
- Warning (80-100%): orange-500 (#f97316)
- Error (>100%): red-500 (#ef4444)

---

DESIGN CONSISTENCY:
- All rich text editors use same border style: 1px solid #e5e7eb
- All use same border radius: 8px (rounded-lg)
- All use same padding in content area: 16px (p-4)
- All use same button sizing: 32px × 32px (desktop), 44px × 44px (mobile)
- All use same separator style: 1px vertical, gray-300, 32px height
- All toolbars have same height: 48px
- All character counters positioned bottom-right, 12px font size

---

STATES TO DESIGN:
1. Default: Empty, placeholder visible
2. Active: Content being edited, toolbar visible
3. Filled: Content present, character counter updates
4. Disabled: Gray background, all buttons disabled (for finalized invoices)
5. Error: Red border (2px, red-500), error message below
6. Focus: No additional border (editor handles internally)

---

EXAMPLE SCREENSHOTS TO REFERENCE:
See `ui-ux/02-core-components/rich-text-editor.md` for detailed toolbar layouts and button states.

---

IMPLEMENTATION NOTES FOR DESIGNERS:
1. Use Auto Layout in Figma for toolbar (horizontal, gap: 4px)
2. Create component variants for: Basic Toolbar, Standard Toolbar, Advanced Toolbar
3. Create button component with states: Default, Active, Hover, Focus, Disabled
4. Use Typography plugin or Prose styling for content area preview
5. Character counter is absolute positioned bottom-right with 8px padding
6. Microphone button (Activity Protocol only) is absolute positioned bottom-right, 4px above character counter
7. Lock icon (Invoice only) appears in top-right of editor when finalized

---

UPDATE CHECKLIST:
□ Activity Protocol form: Replace Beschreibung textarea → Standard toolbar editor + microphone button
□ Customer form: Add Interne Notizen field → Basic toolbar editor
□ Contact form: Add Interne Notizen field → Basic toolbar editor
□ Location form: Add new section + Standortbeschreibung field → Basic toolbar editor
□ Opportunity form: Replace Beschreibung textarea → Standard toolbar editor
□ Project form Tab 1: Replace Projektbeschreibung textarea → Advanced toolbar editor
□ Project form Tab 5: Rename tab to "Dokumente & Notizen", add Projektnotizen field → Advanced toolbar editor
□ Invoice form: Replace Rechnungstext textarea → Basic toolbar editor + lock icon for finalized state

Design with consistency across all forms, maintaining the shadcn/ui design system and KOMPASS visual identity.
```

---

## 📊 Summary

**Forms Updated:** 7  
**Fields Changed:** 11 (8 replaced + 3 new)  
**Toolbar Variants:** 3 (Basic, Standard, Advanced)  
**Total Buttons Designed:** 21 unique buttons  
**Special Features:** Voice-to-text (1), GoBD lock (1)

---

## 🔗 Related Documentation

- **Detailed Rich Text Editor Spec:** `ui-ux/02-core-components/rich-text-editor.md`
- **ADR-019:** `docs/architecture/decisions/ADR-019-rich-text-editor-selection.md`
- **Implementation Guide:** `docs/guides/RICH_TEXT_EDITOR_IMPLEMENTATION.md`

---

## ✅ Verification

After applying this migration in Figma, verify:

- [ ] All 7 forms updated
- [ ] Toolbar buttons consistent across all forms
- [ ] Character counters positioned correctly
- [ ] Mobile variations created
- [ ] German labels correct
- [ ] Accessibility attributes added
- [ ] Voice-to-text button on Activity Protocol form
- [ ] Lock icon on Invoice form (finalized state)

---

**Migration Author:** AI Assistant  
**Review Status:** Ready for Figma Make  
**Estimated Design Time:** 2-3 hours for complete update

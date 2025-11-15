# Activity & Protocol Form - Figma Make Prompt

## Context & Purpose

- **Component Type**: Quick Capture Form
- **User Roles**: All (especially ADM for field sales logging)
- **Usage Context**: Log customer interactions, calls, meetings, notes
- **Business Value**: Track customer touchpoints for relationship management and GoBD audit trail

## Design Requirements

### Visual Hierarchy

- **Quick Capture**: Fast, minimal fields for mobile use
- **Activity Type**: Icon-based selection (Call, Email, Meeting, Note)
- **Customer Context**: Clear indication of related customer
- **Timestamp**: Auto-captured, editable

### Layout Structure

- Compact dialog: 600px (desktop), full-screen (mobile)
- Single column layout
- Large activity type buttons at top
- Minimal required fields for speed
- Voice-to-text support indication (mobile)

### shadcn/ui Components

- `Sheet` for mobile (slides from bottom)
- `Dialog` for desktop
- `Form` with minimal fields
- **Rich Text Editor** (`MeetingNotesEditor`) with standard toolbar for formatted notes
- `ToggleGroup` for activity type

## Figma Make Prompt

Create a quick activity and protocol form for KOMPASS, a German CRM application. Design a fast-capture form optimized for field sales logging customer interactions on mobile with voice-to-text support and German labels.

**Form Container:**

- Mobile: Bottom sheet (slides up from bottom)
- Desktop: Dialog (600px width, centered)
- Header:
  - Title: "Aktivität erfassen"
  - Customer badge: "Kunde: Hofladen Müller GmbH" (blue, if in customer context)
  - Close button

**Activity Type Selection (Prominent):**

- Label: "Art der Aktivität" - 16px, semibold
- Toggle button group: 4 large buttons in row (or 2×2 grid on mobile)

1. **Anruf (Phone Call):**
   - Icon: Phone (32px)
   - Label: "Anruf" below icon
   - Size: 100px × 80px button
   - Border: 2px, rounded corners
   - States: Default (gray), Selected (blue background + white icon/text)

2. **E-Mail:**
   - Icon: Mail (32px)
   - Label: "E-Mail"
   - Same styling as Phone

3. **Meeting:**
   - Icon: Calendar (32px)
   - Label: "Meeting"
   - Same styling

4. **Notiz (Note):**
   - Icon: FileText (32px)
   - Label: "Notiz"
   - Same styling

**Form Fields:**

1. **Kunde** (Required, if not in context):
   - Label: "Kunde \*"
   - Combobox: Searchable select
   - Pre-filled if in customer context
   - Can change if needed
   - Icon: Building

2. **Kontaktperson** (Optional):
   - Label: "Kontaktperson"
   - Select: Contacts for selected customer
   - Placeholder: "Ansprechpartner auswählen (optional)"
   - Shows: Name + position
   - Example: "Hans Müller (Geschäftsführer)"

3. **Betreff** (Required):
   - Label: "Betreff \*"
   - Input: Text, full width
   - Placeholder: "z.B. Telefonat zu neuem Projekt, Follow-up Meeting"
   - Validation: 5-200 characters
   - Help text: "Kurze Zusammenfassung der Aktivität"

4. **Beschreibung** (Required):
   - Label: "Beschreibung \*"
   - **Rich Text Editor** (WYSIWYG): Standard toolbar configuration
     - Toolbar buttons: Bold, Italic, Underline, Strikethrough, H2, H3, Bullet List, Numbered List, Task List (checkboxes), Blockquote, Link, Undo, Redo
     - See `ui-ux/02-core-components/rich-text-editor.md` for complete toolbar design
   - Min height: 200px (content area)
   - Placeholder: "Was wurde besprochen oder vereinbart? Nächste Schritte..."
   - Min length: 10 characters
   - Max length: 2000 characters
   - Character counter: "150 / 2000 Zeichen" (bottom-right corner)
   - **Voice Input Button**: Microphone icon at bottom-right of editor (below toolbar, above character counter)
     - Blue button, 44px × 44px (touch-friendly)
     - Tooltip: "Spracheingabe starten"
     - Click: Activates voice-to-text
     - Recording: Pulsing red icon + "Hört zu..."
     - **Behavior**: Voice-to-text inserts plain text at cursor position, user can then format using toolbar
   - Help text: "Detaillierte Notizen zur Aktivität. Nutzen Sie Formatierung für Struktur."
   - **Mobile**: Compact toolbar with essential buttons (Bold, Italic, Lists), "Mehr" button to expand

5. **Datum & Uhrzeit** (Required):
   - Label: "Datum & Uhrzeit \*"
   - Date+Time picker
   - Default: Now (current date and time)
   - Format: "15.11.2024, 14:30 Uhr"
   - Can edit for retroactive logging
   - Validation: Not in future
   - Help text: "Zeitpunkt der Aktivität"

6. **Dauer** (Optional):
   - Label: "Dauer"
   - Number input with unit selector
   - Units: Minuten (Minutes), Stunden (Hours)
   - Placeholder: "30 Minuten"
   - Use for: Calls, meetings (time tracking)

7. **Nächste Schritte** (Optional):
   - Label: "Nächste Schritte"
   - **Rich Text Editor** (WYSIWYG): Basic toolbar configuration
     - Toolbar buttons: Bold, Italic, Bullet List, Numbered List, Task List (checkboxes), Link, Undo, Redo
   - Min height: 100px
   - Placeholder: "Was sind die nächsten Schritte oder Folgetermine?"
   - Max length: 500 characters
   - Character counter: "X / 500 Zeichen"
   - Help text: "Nutzen Sie Aufgabenlisten (☐) für Action Items"

8. **Follow-up Termin** (Optional):
   - Label: "Follow-up Termin"
   - Date picker
   - Placeholder: "TT.MM.JJJJ"
   - Help text: "Automatische Erinnerung für Folgeaktion"
   - Creates task/reminder if set

9. **Privat** (Optional):
   - Checkbox: ☐ "Diese Aktivität ist privat"
   - Help text: "Privat = Nur für Sie sichtbar, nicht für andere Mitarbeiter"
   - Use for: Sensitive notes

**Quick Capture Mode (Mobile):**

- Simplified version with only essential fields
- Activity type + Customer + Description + Voice input
- Auto-fills: Date/time = now, owner = current user
- One-button save: "Aktivität speichern"
- Expands to full form: "Mehr Felder anzeigen" link

**Form Footer:**

- Buttons:
  - "Abbrechen" (secondary, outlined)
  - "Speichern & Neu" (secondary, saves and reopens empty form)
  - "Aktivität speichern" (primary, blue)

**Success State:**

- Toast: "Aktivität wurde protokolliert" (green)
- Options:
  - "Rückgängig" (undo action, 5 seconds)
  - Dialog closes
  - Or: "Weitere Aktivität erfassen" button

**Offline Support Indicator:**

- If offline: Badge at top "Offline - Wird synchronisiert, wenn online"
- Icon: CloudOff (amber)
- Activity saved locally, queued for sync

**Voice-to-Text Experience (Mobile):**

1. User clicks microphone icon
2. Permission prompt (first time)
3. Recording starts: Icon pulses red, "Hört zu..."
4. User speaks
5. User clicks stop or auto-stops after silence
6. Transcription appears in textarea
7. User can edit transcription
8. Smooth, fast experience for field sales

**Templates (Quick Actions):**

- Dropdown button: "Vorlage verwenden"
- Pre-defined templates:
  - "Erstkontakt" (First contact)
  - "Angebot versendet" (Quote sent)
  - "Follow-up Anruf" (Follow-up call)
  - "Meeting-Protokoll" (Meeting minutes)
- Selecting template pre-fills some fields

Design optimized for speed, especially on mobile, with voice-to-text as primary input method.

## Interaction Patterns

### Quick Capture Flow (Mobile)

1. User at customer location, opens app
2. Taps "Aktivität erfassen" FAB
3. Bottom sheet slides up
4. Customer pre-selected (if in context)
5. Selects activity type (tap phone icon)
6. Taps microphone in description field
7. Speaks notes: "Telefonat mit Hans Müller bezüglich neuem Projekt für Filiale Süd. Follow-up in einer Woche vereinbart."
8. Transcription appears
9. Taps "Aktivität speichern"
10. Success toast, sheet closes
11. Returns to customer view with new activity visible

### Desktop Flow

1. User clicks "Aktivität hinzufügen"
2. Dialog opens
3. Fills form fields manually
4. Clicks "Speichern"
5. Activity logged

### Voice Input

- Click microphone: Start recording
- Speak: Transcription appears in real-time (optional)
- Click stop: Finalize transcription
- Edit text: Make corrections
- Submit form

## German Labels & Content

### Activity Types

- **Anruf**: Phone call
- **E-Mail**: Email
- **Meeting**: Meeting
- **Notiz**: Note
- **Besuch**: Visit
- **Präsentation**: Presentation

### Fields

- **Kunde**: Customer
- **Kontaktperson**: Contact person
- **Betreff**: Subject
- **Beschreibung**: Description
- **Datum & Uhrzeit**: Date & time
- **Dauer**: Duration
- **Nächste Schritte**: Next steps
- **Follow-up Termin**: Follow-up date
- **Privat**: Private

### Voice Input

- **Spracheingabe starten**: Start voice input
- **Hört zu...**: Listening...
- **Aufnahme beenden**: Stop recording
- **Transkription...**: Transcribing...

### Buttons

- **Aktivität speichern**: Save activity
- **Speichern & Neu**: Save & new
- **Vorlage verwenden**: Use template
- **Mehr Felder anzeigen**: Show more fields

### Templates

- **Erstkontakt**: First contact
- **Angebot versendet**: Quote sent
- **Follow-up Anruf**: Follow-up call
- **Meeting-Protokoll**: Meeting minutes

## Accessibility Requirements

- WCAG 2.1 AA compliance
- Activity type buttons: role="radio", aria-checked
- Voice input button: aria-label="Spracheingabe"
- Recording state: aria-live="polite" announcement
- All fields properly labeled
- Keyboard navigation works without voice input

## Mobile Considerations

- Optimized for one-handed use
- Bottom sheet preferred (thumb-friendly)
- Large activity type buttons (touch-friendly)
- Voice-to-text as primary input (faster than typing)
- Auto-save draft every 30 seconds
- Offline support: Visual indicator, local storage

## Example Data

**Phone Call Activity:**

- Art: Anruf (phone icon selected, blue)
- Kunde: "Hofladen Müller GmbH"
- Kontaktperson: "Hans Müller"
- Betreff: "Telefonat zu neuem Projekt"
- Beschreibung: "Besprochen: Neue Filiale in München Süd geplant für Q1 2025. Interesse an Ladeneinrichtung. Budget ca. € 120.000. Nächster Schritt: Besichtigungstermin vereinbaren."
- Datum: "15.11.2024, 14:30 Uhr"
- Dauer: "15 Minuten"
- Follow-up: "22.11.2024" (1 Woche)

**Quick Note:**

- Art: Notiz
- Kunde: "REWE Köln"
- Betreff: "Projektfortschritt"
- Beschreibung: "Montage läuft planmäßig, voraussichtlich nächste Woche fertig."
- Datum: "15.11.2024, 16:00 Uhr"

## Implementation Notes

### shadcn/ui Installation

```bash
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add form
npx shadcn-ui@latest add toggle-group
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add button    # For rich text editor toolbar
npx shadcn-ui@latest add separator # For rich text editor toolbar
npx shadcn-ui@latest add tooltip   # For rich text editor toolbar
```

### TipTap Rich Text Editor Installation

```bash
# Core TipTap packages for Meeting Notes Editor
pnpm add @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder
pnpm add @tiptap/extension-task-list @tiptap/extension-task-item
pnpm add @tiptap/extension-link @tiptap/extension-underline
```

### Voice-to-Text API Integration with Rich Text Editor

```typescript
// Web Speech API for voice input - integrates with TipTap editor
const recognition = new webkitSpeechRecognition();
recognition.lang = 'de-DE';
recognition.continuous = true;
recognition.interimResults = true;

recognition.onresult = (event) => {
  const transcript = Array.from(event.results)
    .map(result => result[0].transcript)
    .join('');

  // Insert plain text at cursor position in TipTap editor
  if (editor) {
    editor.chain().focus().insertContent(transcript + ' ').run();
  }
};

// Usage in MeetingNotesEditor component
<MeetingNotesEditor
  content={field.value}
  onChange={field.onChange}
  placeholder="Was wurde besprochen oder vereinbart?"
  maxLength={2000}
  config={{
    toolbarLevel: 'standard',  // Standard toolbar for Activity Protocols
    enableVoiceInput: true,    // Show microphone button
  }}
/>
```

### Component Dependencies

- Customer/contact selection components
- Date-time picker
- **Rich Text Editor** (`MeetingNotesEditor` component with standard toolbar)
  - See `apps/frontend/src/components/editor/MeetingNotesEditor.tsx`
  - See `ui-ux/02-core-components/rich-text-editor.md` for design specs
- Voice-to-text API (Web Speech API) integrated with rich text editor
- Offline storage for activity queue
- Template library
- Auto-save functionality

### State Management

- Form state
- Voice recording state
- Customer context
- Draft auto-save
- Offline queue
- Template selection

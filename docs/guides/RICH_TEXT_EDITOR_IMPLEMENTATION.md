# Rich Text Editor Implementation Guide

**Version:** 1.0  
**Last Updated:** 2025-01-27  
**Related ADR:** [ADR-019: TipTap as Rich Text Editor](../architecture/decisions/ADR-019-rich-text-editor-selection.md)  
**Status:** ✅ Active

---

## Overview

This guide covers the implementation of TipTap rich text editor in KOMPASS for formatted content across all entity forms. TipTap provides WYSIWYG editing with full accessibility, mobile optimization, and seamless integration with shadcn/ui components.

### Use Cases

1. **Activity Protocols**: Meeting notes with formatting + voice-to-text integration
2. **Project Descriptions**: Structured content with headings, tables, lists
3. **Customer/Contact Notes**: Internal notes with basic formatting
4. **Invoice Remarks**: Payment terms and legal notices (GoBD immutable)

---

## Installation

### Required Dependencies

```bash
# Core TipTap packages
pnpm add @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder

# Optional extensions (install as needed)
pnpm add @tiptap/extension-task-list @tiptap/extension-task-item
pnpm add @tiptap/extension-link @tiptap/extension-table
pnpm add @tiptap/extension-table-row @tiptap/extension-table-cell
pnpm add @tiptap/extension-table-header
pnpm add @tiptap/extension-mention
pnpm add @tiptap/extension-underline

# shadcn/ui components (if not already installed)
npx shadcn-ui@latest add button
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add tooltip
```

### Package Versions

```json
{
  "dependencies": {
    "@tiptap/react": "^2.1.13",
    "@tiptap/starter-kit": "^2.1.13",
    "@tiptap/extension-placeholder": "^2.1.13",
    "@tiptap/extension-task-list": "^2.1.13",
    "@tiptap/extension-task-item": "^2.1.13",
    "@tiptap/extension-link": "^2.1.13",
    "@tiptap/extension-table": "^2.1.13",
    "@tiptap/extension-table-row": "^2.1.13",
    "@tiptap/extension-table-cell": "^2.1.13",
    "@tiptap/extension-table-header": "^2.1.13",
    "@tiptap/extension-mention": "^2.1.13",
    "@tiptap/extension-underline": "^2.1.13"
  }
}
```

---

## Component Architecture

### Directory Structure

```
apps/frontend/src/components/editor/
├── RichTextEditor.tsx           # Main editor component
├── EditorToolbar.tsx            # Toolbar with shadcn/ui buttons
├── EditorContent.css            # Prose styling
└── __tests__/
    ├── RichTextEditor.spec.tsx
    └── EditorToolbar.spec.tsx
```

### Type Definitions

Shared types are defined in `packages/shared/src/types/components/`:
- `rich-text-editor.types.ts` - Editor props, config, content types
- `editor-toolbar.types.ts` - Toolbar groups, button types

---

## Basic Editor Component

### MeetingNotesEditor (Standard)

```typescript
// apps/frontend/src/components/editor/MeetingNotesEditor.tsx
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { EditorToolbar } from './EditorToolbar';
import './EditorContent.css';

interface MeetingNotesEditorProps {
  content: string;
  onChange: (html: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  editable?: boolean;
  maxLength?: number;
  showToolbar?: boolean;
}

export function MeetingNotesEditor({
  content,
  onChange,
  onBlur,
  placeholder = 'Notizen eingeben...',
  editable = true,
  maxLength,
  showToolbar = true,
}: MeetingNotesEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3], // Only H2 and H3
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      Underline,
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    onBlur,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg focus:outline-none min-h-[200px] p-4 max-w-none',
        'aria-label': 'Rich text editor',
        'aria-describedby': maxLength ? 'editor-character-counter' : undefined,
      },
    },
  });

  const characterCount = editor?.storage.characterCount?.characters() || 0;

  return (
    <div className="border rounded-lg bg-white">
      {showToolbar && <EditorToolbar editor={editor} />}
      <EditorContent editor={editor} />
      {maxLength && (
        <div
          id="editor-character-counter"
          className="text-xs text-gray-500 px-4 py-2 border-t text-right"
          aria-live="polite"
        >
          {characterCount} / {maxLength} Zeichen
        </div>
      )}
    </div>
  );
}
```

### EditorToolbar Component

```typescript
// apps/frontend/src/components/editor/EditorToolbar.tsx
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  CheckSquare,
  Heading2,
  Quote,
  Link as LinkIcon,
  Undo,
  Redo,
} from 'lucide-react';

interface EditorToolbarProps {
  editor: Editor | null;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) return null;

  return (
    <TooltipProvider>
      <div className="border-b p-2 flex flex-wrap gap-1 items-center">
        {/* Text Formatting */}
        <ToolbarButton
          editor={editor}
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          icon={<Bold className="h-4 w-4" />}
          tooltip="Fett (Ctrl+B)"
          ariaLabel="Fett"
        />
        <ToolbarButton
          editor={editor}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          icon={<Italic className="h-4 w-4" />}
          tooltip="Kursiv (Ctrl+I)"
          ariaLabel="Kursiv"
        />
        <ToolbarButton
          editor={editor}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          icon={<UnderlineIcon className="h-4 w-4" />}
          tooltip="Unterstrichen (Ctrl+U)"
          ariaLabel="Unterstrichen"
        />
        <ToolbarButton
          editor={editor}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          icon={<Strikethrough className="h-4 w-4" />}
          tooltip="Durchgestrichen"
          ariaLabel="Durchgestrichen"
        />

        <Separator orientation="vertical" className="h-8" />

        {/* Lists */}
        <ToolbarButton
          editor={editor}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          icon={<List className="h-4 w-4" />}
          tooltip="Aufzählung"
          ariaLabel="Aufzählung"
        />
        <ToolbarButton
          editor={editor}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          icon={<ListOrdered className="h-4 w-4" />}
          tooltip="Nummerierte Liste"
          ariaLabel="Nummerierte Liste"
        />
        <ToolbarButton
          editor={editor}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          isActive={editor.isActive('taskList')}
          icon={<CheckSquare className="h-4 w-4" />}
          tooltip="Aufgabenliste"
          ariaLabel="Aufgabenliste"
        />

        <Separator orientation="vertical" className="h-8" />

        {/* Headings & Blocks */}
        <ToolbarButton
          editor={editor}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          icon={<Heading2 className="h-4 w-4" />}
          tooltip="Überschrift 2"
          ariaLabel="Überschrift 2"
        />
        <ToolbarButton
          editor={editor}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          icon={<Quote className="h-4 w-4" />}
          tooltip="Zitat"
          ariaLabel="Zitat"
        />

        <Separator orientation="vertical" className="h-8" />

        {/* Undo/Redo */}
        <ToolbarButton
          editor={editor}
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          icon={<Undo className="h-4 w-4" />}
          tooltip="Rückgängig (Ctrl+Z)"
          ariaLabel="Rückgängig"
        />
        <ToolbarButton
          editor={editor}
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          icon={<Redo className="h-4 w-4" />}
          tooltip="Wiederherstellen (Ctrl+Y)"
          ariaLabel="Wiederherstellen"
        />
      </div>
    </TooltipProvider>
  );
}

// Helper component for toolbar buttons
interface ToolbarButtonProps {
  editor: Editor;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  icon: React.ReactNode;
  tooltip: string;
  ariaLabel: string;
}

function ToolbarButton({
  onClick,
  isActive,
  disabled,
  icon,
  tooltip,
  ariaLabel,
}: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={isActive ? 'default' : 'ghost'}
          size="sm"
          onClick={onClick}
          disabled={disabled}
          aria-label={ariaLabel}
          className="h-8 w-8 p-0"
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}
```

---

## Prose Styling

```css
/* apps/frontend/src/components/editor/EditorContent.css */

/* Base prose styling for editor content */
.ProseMirror {
  outline: none;
}

.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #9ca3af; /* gray-400 */
  pointer-events: none;
  height: 0;
}

/* Task list styling */
.ProseMirror ul[data-type="taskList"] {
  list-style: none;
  padding: 0;
}

.ProseMirror ul[data-type="taskList"] li {
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.ProseMirror ul[data-type="taskList"] li > label {
  flex: 0 0 auto;
  margin-right: 0.5rem;
  user-select: none;
}

.ProseMirror ul[data-type="taskList"] li > div {
  flex: 1 1 auto;
}

/* Link styling */
.ProseMirror a {
  color: #2563eb; /* blue-600 */
  text-decoration: underline;
  cursor: pointer;
}

.ProseMirror a:hover {
  color: #1d4ed8; /* blue-700 */
}

/* Table styling */
.ProseMirror table {
  border-collapse: collapse;
  margin: 1rem 0;
  width: 100%;
}

.ProseMirror table td,
.ProseMirror table th {
  border: 1px solid #e5e7eb; /* gray-200 */
  padding: 0.5rem;
}

.ProseMirror table th {
  background-color: #f9fafb; /* gray-50 */
  font-weight: 600;
}
```

---

## Integration with React Hook Form

```typescript
// Example: Activity Protocol Form integration
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { MeetingNotesEditor } from '@/components/editor/MeetingNotesEditor';

const activityProtocolSchema = z.object({
  betreff: z.string().min(5, 'Betreff muss mindestens 5 Zeichen lang sein'),
  beschreibung: z.string().min(10, 'Beschreibung muss mindestens 10 Zeichen lang sein'),
  // ... other fields
});

function ActivityProtocolForm() {
  const form = useForm({
    resolver: zodResolver(activityProtocolSchema),
    defaultValues: {
      betreff: '',
      beschreibung: '',
    },
  });

  const onSubmit = (data: z.infer<typeof activityProtocolSchema>) => {
    console.log('Submitted data:', data);
    // Submit to API
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="beschreibung"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Beschreibung *</FormLabel>
              <FormControl>
                <MeetingNotesEditor
                  content={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="Was wurde besprochen oder vereinbart? Nächste Schritte..."
                  maxLength={2000}
                />
              </FormControl>
              <FormDescription>
                Detaillierte Notizen zur Aktivität
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Other form fields */}
      </form>
    </Form>
  );
}
```

---

## Voice-to-Text Integration

For Activity Protocol forms, integrate Web Speech API with the editor:

```typescript
// Voice-to-text button component
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  editor: Editor | null;
}

export function VoiceInputButton({ onTranscript, editor }: VoiceInputButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.lang = 'de-DE';
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;

      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          }
        }
        
        if (finalTranscript && editor) {
          // Insert at current cursor position
          editor.chain().focus().insertContent(finalTranscript).run();
          onTranscript(finalTranscript);
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [editor, onTranscript]);

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  if (!recognition) {
    return null; // Browser doesn't support speech recognition
  }

  return (
    <Button
      type="button"
      variant={isListening ? 'destructive' : 'outline'}
      size="sm"
      onClick={toggleListening}
      aria-label={isListening ? 'Aufnahme beenden' : 'Spracheingabe starten'}
      className="absolute bottom-4 right-4"
    >
      {isListening ? (
        <>
          <MicOff className="h-4 w-4 mr-2" />
          Hört zu...
        </>
      ) : (
        <>
          <Mic className="h-4 w-4 mr-2" />
          Spracheingabe
        </>
      )}
    </Button>
  );
}
```

---

## Accessibility Best Practices

### WCAG 2.1 AA Compliance

1. **Keyboard Navigation**
   - All toolbar buttons accessible via Tab key
   - Standard shortcuts work (Ctrl+B, Ctrl+I, Ctrl+Z, etc.)
   - Focus indicators visible on all interactive elements

2. **ARIA Labels**
   - Every toolbar button has `aria-label`
   - Editor has `aria-label="Rich text editor"`
   - Character counter has `aria-live="polite"`

3. **Screen Reader Support**
   - Editor content read as semantic HTML
   - Toolbar buttons announce state (active/inactive)
   - Tooltips provide additional context

4. **Color Contrast**
   - All text meets 4.5:1 contrast ratio
   - Active button state clearly visible
   - Disabled buttons have reduced opacity but remain readable

### Testing Accessibility

```bash
# Run axe-core automated tests
npm run test:a11y

# Manual testing checklist:
# - Tab through all toolbar buttons
# - Use Ctrl+B, Ctrl+I shortcuts
# - Test with screen reader (NVDA, JAWS, VoiceOver)
# - Verify focus indicators visible
# - Check color contrast in DevTools
```

---

## Mobile Optimization

### Responsive Toolbar

For mobile devices (<768px), use compact toolbar:

```typescript
// Mobile-optimized toolbar
export function MobileEditorToolbar({ editor }: EditorToolbarProps) {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="border-b p-2">
      {/* Essential buttons always visible */}
      <div className="flex gap-1 mb-2">
        <ToolbarButton editor={editor} onClick={() => editor.chain().focus().toggleBold().run()} />
        <ToolbarButton editor={editor} onClick={() => editor.chain().focus().toggleItalic().run()} />
        <ToolbarButton editor={editor} onClick={() => editor.chain().focus().toggleBulletList().run()} />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowMore(!showMore)}
          aria-label="Mehr Optionen"
        >
          {showMore ? 'Weniger' : 'Mehr'}
        </Button>
      </div>

      {/* Additional buttons shown on expand */}
      {showMore && (
        <div className="flex flex-wrap gap-1">
          {/* All other buttons */}
        </div>
      )}
    </div>
  );
}
```

### Touch Optimization

- Minimum button size: 44px × 44px (WCAG requirement)
- Adequate spacing between buttons (8px minimum)
- Larger tap targets for mobile toolbar

---

## GoBD Compliance

### Immutable HTML Storage

After invoice finalization, HTML content becomes immutable:

```typescript
interface GoBDDocument {
  content: string; // HTML from editor
  contentHash: string; // SHA-256 hash
  finalized: boolean;
  finalizedAt?: Date;
  finalizedBy?: string;
}

// Generate hash for GoBD compliance
function generateContentHash(html: string): string {
  const encoder = new TextEncoder();
  const data = encoder.encode(html);
  return crypto.subtle.digest('SHA-256', data).then((hashBuffer) => {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  });
}

// Verify content hasn't been tampered with
function verifyContentIntegrity(content: string, hash: string): boolean {
  const calculatedHash = generateContentHash(content);
  return calculatedHash === hash;
}
```

### Change Log for Corrections

If GF makes corrections to finalized invoices:

```typescript
interface ChangeLogEntry {
  field: string;
  oldValue: string;
  newValue: string;
  changedBy: string;
  changedAt: Date;
  reason: string; // Required for GoBD
  approvedBy: string; // GF approval
}

// Record any changes to finalized documents
function recordCorrection(
  document: GoBDDocument,
  newContent: string,
  user: User,
  reason: string
): ChangeLogEntry {
  return {
    field: 'content',
    oldValue: document.content,
    newValue: newContent,
    changedBy: user.id,
    changedAt: new Date(),
    reason,
    approvedBy: user.role === 'GF' ? user.id : undefined,
  };
}
```

---

## Performance Considerations

### Bundle Size

- Core TipTap + StarterKit: ~50KB gzipped
- Additional extensions add 5-10KB each
- Total typical bundle: ~70KB (acceptable)

### Optimization Tips

1. **Lazy Load Extensions**
   ```typescript
   const Table = lazy(() => import('@tiptap/extension-table'));
   ```

2. **Debounce onChange**
   ```typescript
   const debouncedOnChange = useMemo(
     () => debounce((html: string) => onChange(html), 300),
     [onChange]
   );
   ```

3. **Limit Document Size**
   - Set `maxLength` prop to prevent huge documents
   - Activity protocols: 2000 chars
   - Project descriptions: 5000 chars

---

## Testing

### Unit Tests

```typescript
// RichTextEditor.spec.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MeetingNotesEditor } from './MeetingNotesEditor';

describe('MeetingNotesEditor', () => {
  it('should render with placeholder', () => {
    render(
      <MeetingNotesEditor
        content=""
        onChange={() => {}}
        placeholder="Test placeholder"
      />
    );
    expect(screen.getByText('Test placeholder')).toBeInTheDocument();
  });

  it('should call onChange when content changes', () => {
    const handleChange = jest.fn();
    render(<MeetingNotesEditor content="" onChange={handleChange} />);
    
    // Simulate typing
    const editor = screen.getByRole('textbox');
    fireEvent.input(editor, { target: { innerHTML: '<p>Test content</p>' } });
    
    expect(handleChange).toHaveBeenCalledWith('<p>Test content</p>');
  });

  it('should show character counter', () => {
    render(
      <MeetingNotesEditor
        content=""
        onChange={() => {}}
        maxLength={100}
      />
    );
    expect(screen.getByText(/0 \/ 100 Zeichen/)).toBeInTheDocument();
  });
});
```

### E2E Tests

```typescript
// activity-protocol-editor.e2e.spec.ts
import { test, expect } from '@playwright/test';

test('should format text in activity protocol', async ({ page }) => {
  await page.goto('/customers/123/activities/new');
  
  // Type in editor
  const editor = page.locator('.ProseMirror');
  await editor.click();
  await editor.type('Meeting notes');
  
  // Click bold button
  await page.click('button[aria-label="Fett"]');
  await editor.type(' with bold text');
  
  // Verify HTML output contains <strong>
  const html = await editor.innerHTML();
  expect(html).toContain('<strong>with bold text</strong>');
  
  // Save activity
  await page.click('button:has-text("Aktivität speichern")');
  await expect(page.locator('.toast-success')).toBeVisible();
});
```

---

## Troubleshooting

### Common Issues

1. **Editor not updating on prop change**
   ```typescript
   // Use useEffect to sync content
   useEffect(() => {
     if (editor && content !== editor.getHTML()) {
       editor.commands.setContent(content);
     }
   }, [editor, content]);
   ```

2. **Toolbar buttons not working**
   - Ensure editor instance is not null
   - Check if editor.can() commands return true
   - Verify extensions are loaded

3. **Voice-to-text not inserting text**
   - Check browser compatibility (Chrome/Edge only)
   - Ensure HTTPS (required for Web Speech API)
   - Verify microphone permissions

4. **Performance issues with large documents**
   - Implement character limit
   - Debounce onChange callback
   - Use virtual scrolling for very long content

---

## References

### External Documentation
- **TipTap Official**: https://tiptap.dev/docs/editor/introduction
- **ProseMirror**: https://prosemirror.net/docs/
- **React Hook Form**: https://react-hook-form.com/docs

### Internal Documentation
- **ADR-019**: `docs/architecture/decisions/ADR-019-rich-text-editor-selection.md`
- **Type Definitions**: `packages/shared/src/types/components/rich-text-editor.types.ts`
- **UI/UX Spec**: `ui-ux/02-core-components/rich-text-editor.md`

---

## Next Steps

1. Review Figma designs (`ui-ux/02-core-components/rich-text-editor.md`)
2. Implement basic editor component
3. Create toolbar with shadcn/ui buttons
4. Integrate with React Hook Form
5. Add E2E tests
6. Accessibility audit with screen readers

---

**Version History:**

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-01-27 | Initial implementation guide |

---

**Maintained By:** Frontend Team  
**Last Review:** 2025-01-27  
**Next Review:** Q2 2025 (after MVP launch)


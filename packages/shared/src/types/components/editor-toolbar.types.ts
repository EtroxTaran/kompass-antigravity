/**
 * Editor Toolbar Type Definitions
 *
 * Type-safe interfaces for TipTap editor toolbar components
 * Defines toolbar groups, buttons, and configurations
 *
 * @see docs/guides/RICH_TEXT_EDITOR_IMPLEMENTATION.md
 * @see ui-ux/02-core-components/rich-text-editor.md
 */

import type { Editor } from '@tiptap/react';
// Note: Icon is string identifier in shared package (framework-agnostic)
// Actual LucideIcon component is resolved in frontend implementation

/**
 * Toolbar group identifiers
 * Groups related formatting options together
 */
export type ToolbarGroup =
  /**
   * Text formatting (Bold, Italic, Underline, Strikethrough)
   */
  | 'text-formatting'
  /**
   * Headings (H1, H2, H3)
   */
  | 'headings'
  /**
   * Lists (Bullet, Numbered, Task)
   */
  | 'lists'
  /**
   * Block elements (Blockquote, Code Block, Horizontal Rule)
   */
  | 'blocks'
  /**
   * Insert elements (Link, Image, Table)
   */
  | 'insert'
  /**
   * History (Undo, Redo)
   */
  | 'history'
  /**
   * Advanced (Mention, Clear Formatting)
   */
  | 'advanced';

/**
 * Toolbar button identifiers
 * Maps to TipTap commands
 */
export type ToolbarButtonId =
  // Text formatting
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  // Headings
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'paragraph'
  // Lists
  | 'bulletList'
  | 'orderedList'
  | 'taskList'
  // Blocks
  | 'blockquote'
  | 'codeBlock'
  | 'horizontalRule'
  // Insert
  | 'link'
  | 'image'
  | 'table'
  // History
  | 'undo'
  | 'redo'
  // Advanced
  | 'mention'
  | 'clearFormatting';

/**
 * Toolbar button definition
 * Defines appearance and behavior of a single button
 */
export interface ToolbarButton {
  /**
   * Unique button identifier
   */
  id: ToolbarButtonId;

  /**
   * Button group (for organization)
   */
  group: ToolbarGroup;

  /**
   * German label (for tooltips and accessibility)
   */
  label: string;

  /**
   * Lucide icon identifier (string name)
   * Resolved to actual LucideIcon component in frontend
   * @example 'Bold', 'Italic', 'Underline'
   */
  icon: string;

  /**
   * Keyboard shortcut (optional)
   * @example 'Ctrl+B' for bold
   */
  shortcut?: string;

  /**
   * TipTap command to execute
   * @example () => editor.chain().focus().toggleBold().run()
   */
  action: (editor: Editor) => void;

  /**
   * Check if button is active
   * @example (editor) => editor.isActive('bold')
   */
  isActive?: (editor: Editor) => boolean;

  /**
   * Check if button is disabled
   * @example (editor) => !editor.can().undo()
   */
  isDisabled?: (editor: Editor) => boolean;

  /**
   * ARIA label for accessibility
   */
  ariaLabel: string;

  /**
   * Whether button requires user input (e.g., link URL)
   */
  requiresInput?: boolean;
}

/**
 * Toolbar configuration
 * Defines which groups and buttons to show
 */
export interface ToolbarConfig {
  /**
   * Groups to display in toolbar
   * Order matters - groups shown left to right
   */
  groups: ToolbarGroup[];

  /**
   * Compact mode for mobile
   * Collapses toolbar to essential buttons only
   * @default false
   */
  compact?: boolean;

  /**
   * Show text labels on buttons
   * @default false (icons only)
   */
  showLabels?: boolean;

  /**
   * Enable mobile expandable toolbar
   * Shows "More" button to expand additional options
   * @default true on mobile
   */
  expandable?: boolean;

  /**
   * Custom button order within groups
   * If not specified, uses default order
   */
  customOrder?: {
    [key in ToolbarGroup]?: ToolbarButtonId[];
  };

  /**
   * Buttons to hide (even if group is shown)
   * Useful for customizing specific toolbars
   */
  hiddenButtons?: ToolbarButtonId[];
}

/**
 * Editor toolbar component props
 */
export interface EditorToolbarProps {
  /**
   * TipTap editor instance
   * Note: Editor type from @tiptap/react (installed in frontend)
   */
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  editor: Editor | null;

  /**
   * Toolbar configuration
   */
  config?: ToolbarConfig;

  /**
   * Custom CSS class
   */
  className?: string;

  /**
   * Whether toolbar is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Callback when button is clicked
   * Useful for analytics/tracking
   */
  onButtonClick?: (buttonId: ToolbarButtonId) => void;
}

/**
 * Toolbar button component props
 */
export interface ToolbarButtonProps {
  /**
   * TipTap editor instance
   */
  editor: Editor;

  /**
   * Button definition
   */
  button: ToolbarButton;

  /**
   * Custom CSS class
   */
  className?: string;

  /**
   * Callback when button is clicked
   */
  onClick?: (buttonId: ToolbarButtonId) => void;
}

/**
 * Pre-defined toolbar configurations
 * Match the three toolbar levels (basic, standard, advanced)
 */
export const TOOLBAR_PRESETS: Record<
  'basic' | 'standard' | 'advanced',
  ToolbarConfig
> = {
  /**
   * Basic toolbar (Customer/Contact notes)
   * Text formatting + lists + links
   */
  basic: {
    groups: ['text-formatting', 'lists', 'insert', 'history'],
    hiddenButtons: ['strikethrough', 'taskList', 'image', 'table'],
  },

  /**
   * Standard toolbar (Activity Protocols, Opportunities)
   * Adds headings, task lists, blockquotes
   */
  standard: {
    groups: [
      'text-formatting',
      'headings',
      'lists',
      'blocks',
      'insert',
      'history',
    ],
    hiddenButtons: [
      'heading1',
      'codeBlock',
      'horizontalRule',
      'image',
      'table',
    ],
  },

  /**
   * Advanced toolbar (Project Descriptions)
   * Full feature set with tables, code blocks, etc.
   */
  advanced: {
    groups: [
      'text-formatting',
      'headings',
      'lists',
      'blocks',
      'insert',
      'history',
      'advanced',
    ],
  },
};

/**
 * Mobile toolbar configuration
 * Shows essential buttons only, with expandable "More" menu
 */
export const MOBILE_TOOLBAR_CONFIG: ToolbarConfig = {
  groups: ['text-formatting', 'lists', 'history'],
  compact: true,
  expandable: true,
  hiddenButtons: ['strikethrough', 'taskList', 'image', 'table', 'mention'],
};

/**
 * Complete button registry
 * Defines all available toolbar buttons
 *
 * Note: Icons are imported from lucide-react in actual implementation
 * Note: TipTap Editor chain API uses `any` types by design - safe in practice
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */
export const TOOLBAR_BUTTON_REGISTRY: ToolbarButton[] = [
  // Text Formatting
  {
    id: 'bold',
    group: 'text-formatting',
    label: 'Fett',
    icon: 'Bold',
    shortcut: 'Ctrl+B',
    action: (editor) => editor.chain().focus().toggleBold().run(),
    isActive: (editor) => editor.isActive('bold'),
    ariaLabel: 'Fett (Ctrl+B)',
  },
  {
    id: 'italic',
    group: 'text-formatting',
    label: 'Kursiv',
    icon: 'Italic',
    shortcut: 'Ctrl+I',
    action: (editor) => editor.chain().focus().toggleItalic().run(),
    isActive: (editor) => editor.isActive('italic'),
    ariaLabel: 'Kursiv (Ctrl+I)',
  },
  {
    id: 'underline',
    group: 'text-formatting',
    label: 'Unterstrichen',
    icon: 'Underline',
    shortcut: 'Ctrl+U',
    action: (editor) => editor.chain().focus().toggleUnderline().run(),
    isActive: (editor) => editor.isActive('underline'),
    ariaLabel: 'Unterstrichen (Ctrl+U)',
  },
  {
    id: 'strikethrough',
    group: 'text-formatting',
    label: 'Durchgestrichen',
    icon: 'Strikethrough',
    action: (editor) => editor.chain().focus().toggleStrike().run(),
    isActive: (editor) => editor.isActive('strike'),
    ariaLabel: 'Durchgestrichen',
  },

  // Headings
  {
    id: 'heading1',
    group: 'headings',
    label: 'Überschrift 1',
    icon: 'Heading1',
    action: (editor) =>
      editor.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 1 }),
    ariaLabel: 'Überschrift 1',
  },
  {
    id: 'heading2',
    group: 'headings',
    label: 'Überschrift 2',
    icon: 'Heading2',
    action: (editor) =>
      editor.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 2 }),
    ariaLabel: 'Überschrift 2',
  },
  {
    id: 'heading3',
    group: 'headings',
    label: 'Überschrift 3',
    icon: 'Heading3',
    action: (editor) =>
      editor.chain().focus().toggleHeading({ level: 3 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 3 }),
    ariaLabel: 'Überschrift 3',
  },
  {
    id: 'paragraph',
    group: 'headings',
    label: 'Absatz',
    icon: 'Pilcrow',
    action: (editor) => editor.chain().focus().setParagraph().run(),
    isActive: (editor) => editor.isActive('paragraph'),
    ariaLabel: 'Absatz',
  },

  // Lists
  {
    id: 'bulletList',
    group: 'lists',
    label: 'Aufzählung',
    icon: 'List',
    action: (editor) => editor.chain().focus().toggleBulletList().run(),
    isActive: (editor) => editor.isActive('bulletList'),
    ariaLabel: 'Aufzählung',
  },
  {
    id: 'orderedList',
    group: 'lists',
    label: 'Nummerierte Liste',
    icon: 'ListOrdered',
    action: (editor) => editor.chain().focus().toggleOrderedList().run(),
    isActive: (editor) => editor.isActive('orderedList'),
    ariaLabel: 'Nummerierte Liste',
  },
  {
    id: 'taskList',
    group: 'lists',
    label: 'Aufgabenliste',
    icon: 'CheckSquare',
    action: (editor) => editor.chain().focus().toggleTaskList().run(),
    isActive: (editor) => editor.isActive('taskList'),
    ariaLabel: 'Aufgabenliste',
  },

  // Blocks
  {
    id: 'blockquote',
    group: 'blocks',
    label: 'Zitat',
    icon: 'Quote',
    action: (editor) => editor.chain().focus().toggleBlockquote().run(),
    isActive: (editor) => editor.isActive('blockquote'),
    ariaLabel: 'Zitat',
  },
  {
    id: 'codeBlock',
    group: 'blocks',
    label: 'Code-Block',
    icon: 'Code',
    action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
    isActive: (editor) => editor.isActive('codeBlock'),
    ariaLabel: 'Code-Block',
  },
  {
    id: 'horizontalRule',
    group: 'blocks',
    label: 'Trennlinie',
    icon: 'Minus',
    action: (editor) => editor.chain().focus().setHorizontalRule().run(),
    ariaLabel: 'Trennlinie',
  },

  // Insert
  {
    id: 'link',
    group: 'insert',
    label: 'Link',
    icon: 'Link',
    requiresInput: true,
    action: (editor) => {
      // Note: Actual implementation requires URL input dialog
      const url = window.prompt('URL eingeben:');
      if (url) {
        editor.chain().focus().setLink({ href: url }).run();
      }
    },
    isActive: (editor) => editor.isActive('link'),
    ariaLabel: 'Link einfügen',
  },
  {
    id: 'image',
    group: 'insert',
    label: 'Bild',
    icon: 'Image',
    requiresInput: true,
    action: (editor) => {
      // Note: Actual implementation requires file upload dialog
      const url = window.prompt('Bild-URL eingeben:');
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    },
    ariaLabel: 'Bild einfügen',
  },
  {
    id: 'table',
    group: 'insert',
    label: 'Tabelle',
    icon: 'Table',
    action: (editor) =>
      editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run(),
    ariaLabel: 'Tabelle einfügen',
  },

  // History
  {
    id: 'undo',
    group: 'history',
    label: 'Rückgängig',
    icon: 'Undo',
    shortcut: 'Ctrl+Z',
    action: (editor) => editor.chain().focus().undo().run(),
    isDisabled: (editor) => !editor.can().undo(),
    ariaLabel: 'Rückgängig (Ctrl+Z)',
  },
  {
    id: 'redo',
    group: 'history',
    label: 'Wiederherstellen',
    icon: 'Redo',
    shortcut: 'Ctrl+Y',
    action: (editor) => editor.chain().focus().redo().run(),
    isDisabled: (editor) => !editor.can().redo(),
    ariaLabel: 'Wiederherstellen (Ctrl+Y)',
  },

  // Advanced
  {
    id: 'mention',
    group: 'advanced',
    label: 'Erwähnung',
    icon: 'AtSign',
    action: (_editor) => {
      // Note: Mention implementation requires suggestion popup
      // This is just placeholder
    },
    ariaLabel: 'Person erwähnen (@)',
  },
  {
    id: 'clearFormatting',
    group: 'advanced',
    label: 'Formatierung entfernen',
    icon: 'RemoveFormatting',
    action: (editor) =>
      editor.chain().focus().clearNodes().unsetAllMarks().run(),
    ariaLabel: 'Formatierung entfernen',
  },
];
/* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */

/**
 * Get buttons for a specific toolbar configuration
 */
export function getToolbarButtons(config: ToolbarConfig): ToolbarButton[] {
  return TOOLBAR_BUTTON_REGISTRY.filter((button) => {
    // Check if button's group is included
    if (!config.groups.includes(button.group)) {
      return false;
    }

    // Check if button is hidden
    if (config.hiddenButtons?.includes(button.id)) {
      return false;
    }

    // Check custom order (if specified)
    if (config.customOrder) {
      const groupOrder = config.customOrder[button.group];
      if (groupOrder && !groupOrder.includes(button.id)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Get buttons grouped by toolbar group
 */
export function getGroupedButtons(
  config: ToolbarConfig
): Record<ToolbarGroup, ToolbarButton[]> {
  const buttons = getToolbarButtons(config);
  const grouped: Partial<Record<ToolbarGroup, ToolbarButton[]>> = {};

  for (const button of buttons) {
    if (!grouped[button.group]) {
      grouped[button.group] = [];
    }
    grouped[button.group]!.push(button);
  }

  return grouped as Record<ToolbarGroup, ToolbarButton[]>;
}

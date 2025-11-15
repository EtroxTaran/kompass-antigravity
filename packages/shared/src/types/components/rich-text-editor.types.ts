/**
 * Rich Text Editor Type Definitions
 *
 * Type-safe interfaces for TipTap rich text editor components
 * Used across Activity Protocols, Project Descriptions, Customer/Contact Notes
 *
 * @see docs/guides/RICH_TEXT_EDITOR_IMPLEMENTATION.md
 * @see docs/architecture/decisions/ADR-019-rich-text-editor-selection.md
 */

import type { Editor } from '@tiptap/react';

/**
 * Editor extension types
 * Maps to TipTap extension names
 */
export type RichTextEditorExtension =
  // Text formatting
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  // Headings
  | 'heading'
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
  // Advanced
  | 'mention'
  | 'placeholder'
  | 'characterCount';

/**
 * Editor configuration for specific use cases
 *
 * @example
 * // Basic toolbar (Customer notes)
 * const basicConfig: RichTextEditorConfig = {
 *   placeholder: 'Notizen eingeben...',
 *   maxLength: 1000,
 *   extensions: ['bold', 'italic', 'bulletList', 'orderedList', 'link']
 * };
 *
 * @example
 * // Advanced toolbar (Project descriptions)
 * const advancedConfig: RichTextEditorConfig = {
 *   placeholder: 'Projektbeschreibung...',
 *   maxLength: 5000,
 *   extensions: ['bold', 'italic', 'underline', 'heading', 'bulletList', 'orderedList', 'taskList', 'table', 'link']
 * };
 */
export interface RichTextEditorConfig {
  /**
   * Placeholder text shown when editor is empty
   * @default 'Text eingeben...'
   */
  placeholder?: string;

  /**
   * Whether editor is editable
   * @default true
   */
  editable?: boolean;

  /**
   * Auto-focus editor on mount
   * @default false
   */
  autofocus?: boolean;

  /**
   * Maximum character length
   * Shows character counter if set
   * @example 2000 for Activity Protocols, 5000 for Project Descriptions
   */
  maxLength?: number;

  /**
   * Extensions to enable
   * If not specified, uses default set based on toolbar level
   */
  extensions?: RichTextEditorExtension[];

  /**
   * Whether to show toolbar
   * @default true
   */
  showToolbar?: boolean;

  /**
   * Toolbar level (determines which buttons to show)
   * @default 'standard'
   */
  toolbarLevel?: 'basic' | 'standard' | 'advanced';

  /**
   * Enable voice-to-text button
   * @default false
   */
  enableVoiceInput?: boolean;

  /**
   * Minimum height in pixels
   * @default 200
   */
  minHeight?: number;

  /**
   * Custom CSS class for editor container
   */
  className?: string;
}

/**
 * Editor content representation
 * Provides multiple formats for different use cases
 */
export interface EditorContent {
  /**
   * HTML representation (for storage in CouchDB)
   * GoBD compliant format
   */
  html: string;

  /**
   * Plain text representation (for search indexing)
   * Strips all HTML tags
   */
  text: string;

  /**
   * JSON representation (TipTap internal format)
   * Used for structured queries
   */
  json: Record<string, unknown>;

  /**
   * Character count (excluding HTML tags)
   */
  characterCount: number;

  /**
   * Word count (excluding HTML tags)
   */
  wordCount: number;

  /**
   * Whether content is empty
   * True if only contains whitespace or empty tags
   */
  isEmpty: boolean;
}

/**
 * Main rich text editor component props
 *
 * @example
 * // Basic usage in form
 * <FormField
 *   control={form.control}
 *   name="description"
 *   render={({ field }) => (
 *     <RichTextEditor
 *       content={field.value}
 *       onChange={field.onChange}
 *       onBlur={field.onBlur}
 *       config={{
 *         placeholder: 'Beschreibung eingeben...',
 *         maxLength: 2000,
 *         toolbarLevel: 'standard'
 *       }}
 *     />
 *   )}
 * />
 */
export interface RichTextEditorProps {
  /**
   * Initial HTML content
   * Can be empty string for new documents
   */
  content: string;

  /**
   * Callback when content changes
   * Returns HTML string
   */
  onChange: (html: string) => void;

  /**
   * Callback when editor loses focus
   * Used for form validation
   */
  onBlur?: () => void;

  /**
   * Callback when editor gains focus
   */
  onFocus?: () => void;

  /**
   * Editor configuration
   */
  config?: RichTextEditorConfig;

  /**
   * Error message to display
   * Used for form validation errors
   */
  error?: string;

  /**
   * Help text to display below editor
   */
  helpText?: string;

  /**
   * Whether field is required
   * Shows asterisk in label
   * @default false
   */
  required?: boolean;

  /**
   * Disable editor (read-only mode)
   * @default false
   */
  disabled?: boolean;

  /**
   * Name attribute for form integration
   */
  name?: string;

  /**
   * ARIA label for accessibility
   * @default 'Rich text editor'
   */
  ariaLabel?: string;

  /**
   * ARIA described-by ID
   * Links to help text or error message
   */
  ariaDescribedBy?: string;
}

/**
 * Editor instance utilities
 * Helper functions for working with TipTap editor
 */
export interface EditorUtils {
  /**
   * Get editor content in multiple formats
   */
  getContent: (editor: Editor) => EditorContent;

  /**
   * Set editor content from HTML
   */
  setContent: (editor: Editor, html: string) => void;

  /**
   * Clear editor content
   */
  clearContent: (editor: Editor) => void;

  /**
   * Focus editor
   */
  focus: (editor: Editor) => void;

  /**
   * Check if editor is empty
   */
  isEmpty: (editor: Editor) => boolean;

  /**
   * Get character count
   */
  getCharacterCount: (editor: Editor) => number;

  /**
   * Get word count
   */
  getWordCount: (editor: Editor) => number;

  /**
   * Insert text at current cursor position
   * Used for voice-to-text integration
   */
  insertText: (editor: Editor, text: string) => void;

  /**
   * Validate content length
   */
  validateLength: (
    editor: Editor,
    maxLength: number
  ) => {
    isValid: boolean;
    current: number;
    max: number;
  };
}

/**
 * Toolbar level configurations
 * Defines which extensions are enabled per level
 */
export const TOOLBAR_CONFIGURATIONS: Record<
  'basic' | 'standard' | 'advanced',
  RichTextEditorExtension[]
> = {
  /**
   * Basic toolbar (Customer/Contact notes)
   * Simple formatting only
   */
  basic: [
    'bold',
    'italic',
    'underline',
    'bulletList',
    'orderedList',
    'link',
    'placeholder',
    'characterCount',
  ],

  /**
   * Standard toolbar (Activity Protocols, Opportunities)
   * Adds headings, task lists, blockquotes
   */
  standard: [
    'bold',
    'italic',
    'underline',
    'strike',
    'heading',
    'bulletList',
    'orderedList',
    'taskList',
    'blockquote',
    'link',
    'placeholder',
    'characterCount',
  ],

  /**
   * Advanced toolbar (Project Descriptions)
   * Full feature set with tables, mentions
   */
  advanced: [
    'bold',
    'italic',
    'underline',
    'strike',
    'heading',
    'bulletList',
    'orderedList',
    'taskList',
    'blockquote',
    'codeBlock',
    'horizontalRule',
    'link',
    'table',
    'mention',
    'placeholder',
    'characterCount',
  ],
};

/**
 * Validation rules for different use cases
 */
export const EDITOR_VALIDATION_RULES = {
  /**
   * Activity Protocol description
   */
  activityProtocol: {
    minLength: 10,
    maxLength: 2000,
    placeholder: 'Was wurde besprochen oder vereinbart? Nächste Schritte...',
    toolbarLevel: 'standard' as const,
  },

  /**
   * Customer/Contact notes
   */
  internalNotes: {
    minLength: 0,
    maxLength: 1000,
    placeholder: 'Interne Notizen...',
    toolbarLevel: 'basic' as const,
  },

  /**
   * Opportunity description
   */
  opportunityDescription: {
    minLength: 10,
    maxLength: 5000,
    placeholder:
      'Details zur Opportunity, Kundenanforderungen, nächste Schritte...',
    toolbarLevel: 'standard' as const,
  },

  /**
   * Project description
   */
  projectDescription: {
    minLength: 20,
    maxLength: 5000,
    placeholder: 'Projektbeschreibung, Anforderungen, technische Details...',
    toolbarLevel: 'advanced' as const,
  },

  /**
   * Project notes
   */
  projectNotes: {
    minLength: 0,
    maxLength: 5000,
    placeholder: 'Projektnotizen, Milestones, offene Punkte...',
    toolbarLevel: 'advanced' as const,
  },

  /**
   * Invoice remarks
   */
  invoiceRemarks: {
    minLength: 0,
    maxLength: 2000,
    placeholder:
      'Zahlungsbedingungen, Lieferbedingungen, rechtliche Hinweise...',
    toolbarLevel: 'basic' as const,
  },

  /**
   * Location description
   */
  locationDescription: {
    minLength: 0,
    maxLength: 2000,
    placeholder:
      'Besonderheiten des Standorts, Anfahrtsbeschreibung, Zugangsinformationen...',
    toolbarLevel: 'basic' as const,
  },
} as const;

/**
 * Type helper to extract validation rule keys
 */
export type EditorValidationRuleKey = keyof typeof EDITOR_VALIDATION_RULES;

/**
 * GoBD-compliant document with rich text content
 * Used for invoices and other immutable documents
 */
export interface GoBDRichTextDocument {
  /**
   * HTML content
   */
  content: string;

  /**
   * SHA-256 hash of content
   * Used to detect tampering
   */
  contentHash: string;

  /**
   * Whether document is finalized (immutable)
   */
  finalized: boolean;

  /**
   * When document was finalized
   */
  finalizedAt?: Date;

  /**
   * User who finalized document
   */
  finalizedBy?: string;

  /**
   * Change log for post-finalization corrections
   * Required for GoBD compliance
   */
  changeLog: ChangeLogEntry[];
}

/**
 * Change log entry for GoBD corrections
 */
export interface ChangeLogEntry {
  /**
   * Field that was changed
   */
  field: string;

  /**
   * Previous HTML content
   */
  oldValue: string;

  /**
   * New HTML content
   */
  newValue: string;

  /**
   * User who made the change
   */
  changedBy: string;

  /**
   * When change was made
   */
  changedAt: Date;

  /**
   * Reason for correction (required for GoBD)
   */
  reason: string;

  /**
   * GF approval (if correction made to finalized document)
   */
  approvedBy?: string;
}

# ADR-019: TipTap as Rich Text Editor for Meeting Notes and Formatted Content

**Status:** Accepted  
**Date:** 2025-01-27  
**Decision Makers:** Architecture Team, Frontend Team  
**Related ADRs:** ADR-005 (UI Component Library)

---

## Context

KOMPASS requires a rich text editor for various use cases:

1. **Activity Protocols**: Field sales (ADM) need to capture meeting notes with formatting support
2. **Project Descriptions**: Project managers (PLAN) need structured content with headings, lists, and tables
3. **Customer/Contact Notes**: All roles need to document important information with basic formatting
4. **Invoice Remarks**: Accounting (BUCH) needs formatted payment terms and legal notices

### Requirements

**Functional:**
- WYSIWYG editing experience (familiar to users)
- Support for basic formatting: Bold, Italic, Underline, Lists
- Support for structured content: Headings, Blockquotes, Code blocks
- Support for task lists (checkboxes for action items)
- Support for tables (project specifications)
- Support for links and mentions
- Character counter and length validation
- Voice-to-text integration (for activity protocols)

**Non-Functional:**
- WCAG 2.1 AA accessibility compliance
- Mobile-optimized (touch interface, responsive toolbar)
- TypeScript-first with full type safety
- Small bundle size (<100KB) for performance
- Seamless integration with shadcn/ui + Radix UI
- Works with React Hook Form + Zod validation
- Offline-first compatible (HTML storage in CouchDB)

**Technical Constraints:**
- Must integrate with existing shadcn/ui component library
- Must follow KOMPASS design system (Tailwind CSS)
- Must support GoBD compliance (immutable HTML after finalization)
- Must work with voice-to-text (plain text insertion + formatting)

---

## Decision

We will use **TipTap** as the rich text editor for all formatted content in KOMPASS.

### Scope

TipTap will be used for:

1. **Activity Protocol Form**: `beschreibung` field (meeting notes, call notes)
2. **Customer Form**: New optional `notizen` field (internal notes)
3. **Contact Form**: New optional `notizen` field (personal notes)
4. **Location Form**: New optional `beschreibung` field (site details)
5. **Opportunity Form**: `beschreibung` field (opportunity details, requirements)
6. **Project Form**: `projektbeschreibung` and `projektnotizen` fields
7. **Invoice Form**: New optional `bemerkungen` field (payment terms, legal notices)

### Extensions Configuration

**Basic Toolbar** (Customer, Contact, Location, Invoice notes):
- Bold, Italic, Underline, Strikethrough
- Bullet List, Numbered List
- Link
- Clear Formatting

**Standard Toolbar** (Activity Protocols, Opportunities):
- All Basic features
- Headings (H2, H3)
- Task List (checkboxes)
- Blockquote

**Advanced Toolbar** (Projects):
- All Standard features
- Tables
- Code Block
- Horizontal Rule
- Mentions (@contact)
- Image (future)

---

## Rationale

### Why TipTap?

1. **Headless Architecture**
   - No built-in UI components - fully customizable
   - Integrates perfectly with shadcn/ui button components
   - Toolbar completely under our control
   - Matches KOMPASS design system exactly

2. **Accessibility-First**
   - Built on ProseMirror (battle-tested accessibility)
   - Proper ARIA attributes out-of-the-box
   - Keyboard navigation with standard shortcuts (Ctrl+B, Ctrl+I)
   - Screen reader support (semantic HTML output)
   - Focus management handled correctly

3. **Mobile-Optimized**
   - Touch-friendly selection and editing
   - Responsive toolbar (collapses on mobile)
   - Works with native mobile keyboards
   - Compatible with voice-to-text APIs
   - 44px minimum touch targets (WCAG compliance)

4. **TypeScript-Native**
   - Full TypeScript support with proper types
   - Type-safe extension configuration
   - IntelliSense for all APIs
   - Compile-time error detection

5. **Performance**
   - Small bundle size: ~50KB gzipped (core + common extensions)
   - Virtual rendering for large documents
   - Efficient change detection
   - Debounced onChange events
   - Meets NFR targets: <400ms P50 response time

6. **Modular Extension System**
   - Only load features we need
   - Tree-shakeable imports
   - Custom extensions possible
   - Active extension ecosystem

7. **React Integration**
   - Official @tiptap/react package
   - React Hook Form compatible
   - Controlled component pattern
   - useEditor hook for state management

8. **Storage Format**
   - HTML output (GoBD compliant)
   - JSON format also available (for structured queries)
   - Plain text extraction (for search indexing)
   - Backward compatible (can read plain text as HTML)

9. **Community & Maintenance**
   - Active development (used by GitLab, Substack, Axios)
   - Excellent documentation
   - Regular security updates
   - Large plugin ecosystem

### Comparison with Alternatives

| Feature | TipTap | Lexical | Editor.js | Markdown |
|---------|--------|---------|-----------|----------|
| **Headless** | ✅ Yes | ✅ Yes | ⚠️ Partial | ✅ N/A |
| **WYSIWYG** | ✅ Yes | ✅ Yes | ⚠️ Blocks | ❌ No |
| **TypeScript** | ✅ Excellent | ✅ Excellent | ✅ Good | ✅ N/A |
| **shadcn/ui Integration** | ✅ Perfect | ⚠️ Manual | ⚠️ Manual | ✅ Perfect |
| **Accessibility** | ✅ Excellent | ✅ Best-in-class | ✅ Good | ✅ Native |
| **Mobile/Touch** | ✅ Excellent | ✅ Excellent | ✅ Best | ✅ Native |
| **Bundle Size** | 🟢 50KB | 🟡 80KB | 🟢 45KB | 🟢 5KB |
| **Learning Curve** | 🟢 Easy | 🟡 Moderate | 🟢 Easy | 🟡 Moderate |
| **Documentation** | ✅ Excellent | ✅ Excellent | ✅ Good | ✅ N/A |
| **React Integration** | ✅ Official | ✅ Official | ⚠️ Community | ✅ N/A |
| **Voice-to-Text** | ✅ Perfect | ✅ Perfect | ✅ Good | ✅ Perfect |

---

## Alternatives Considered

### 1. Lexical (Meta/Facebook)

**Pros:**
- Developed and used by Meta (Facebook, Instagram)
- Best-in-class accessibility (WCAG 2.1 AAA capable)
- Excellent performance (virtual rendering)
- Modern architecture with plugin system
- Strong TypeScript support

**Cons:**
- More complex API (steeper learning curve)
- Newer ecosystem (less mature than TipTap)
- Requires more custom UI development
- Larger bundle size (~80KB vs 50KB)
- More configuration needed for shadcn/ui integration

**Why Not Chosen:**
- Overly complex for our use cases
- Would require 2-3x more development time for UI integration
- TipTap's simplicity better fits our team's skills

### 2. Editor.js (Block-Based)

**Pros:**
- Perfect for structured content (blocks)
- Clean JSON output
- Excellent mobile experience
- Small bundle size (~45KB)
- Modern, intuitive UX

**Cons:**
- Different UX paradigm (blocks vs continuous text)
- Less familiar to users (not traditional WYSIWYG)
- Limited inline formatting
- Would require user training
- Not suitable for free-form meeting notes

**Why Not Chosen:**
- Block-based editing not suitable for meeting notes
- Users expect traditional WYSIWYG (Word-like) experience
- Would confuse non-technical users (ADM field sales)

### 3. Plain Markdown (with Parser)

**Pros:**
- Simplest implementation
- No dependencies (lightweight)
- Fast, performant
- Easy offline support
- Developer-friendly

**Cons:**
- Users must learn Markdown syntax
- No WYSIWYG preview while editing
- Less user-friendly for non-technical users
- Would require training
- Not suitable for field sales (ADM)

**Why Not Chosen:**
- Non-technical users (ADM, BUCH) would struggle
- Markdown learning curve unacceptable
- Need WYSIWYG for mass adoption

### 4. Quill

**Pros:**
- Mature, stable library
- Good documentation
- Decent accessibility
- Smaller than Lexical

**Cons:**
- Not headless (comes with built-in UI)
- Harder to customize for shadcn/ui
- Less active development than TipTap
- Older architecture

**Why Not Chosen:**
- Built-in UI conflicts with shadcn/ui design system
- TipTap's headless approach more flexible

---

## Consequences

### Positive

1. **Consistent UX**: All formatted text fields use same editor interface
2. **Accessibility**: WCAG 2.1 AA compliance achieved through TipTap
3. **Mobile-First**: Touch-optimized editing for ADM field sales
4. **Type Safety**: Full TypeScript support prevents runtime errors
5. **Performance**: 50KB bundle size meets NFR requirements
6. **Flexibility**: Modular extensions allow feature-specific toolbars
7. **Maintenance**: Active community ensures long-term support

### Negative

1. **Bundle Size**: Adds ~50KB to frontend bundle (acceptable for features gained)
2. **HTML Storage**: CouchDB stores HTML instead of structured JSON (but HTML is GoBD-compliant)
3. **Learning Curve**: Developers must learn TipTap API (but well-documented)
4. **Migration**: Existing plain text fields need migration to rich text (one-time cost)

### Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| TipTap becomes unmaintained | Low | High | Large user base (GitLab, Substack), can fork if needed |
| Performance issues with large documents | Low | Medium | TipTap handles 10,000+ paragraphs, our use case <500 |
| Accessibility regressions | Low | High | Automated a11y testing with axe-core in E2E tests |
| Mobile keyboard issues | Medium | Medium | Extensive mobile testing, fallback to plain textarea |
| Bundle size creep | Medium | Low | Tree-shaking, only load needed extensions |

---

## Implementation Plan

### Phase 1: Foundation (Week 1)
- Create `MeetingNotesEditor` component wrapper
- Create `EditorToolbar` component with shadcn/ui buttons
- Configure basic extensions (Bold, Italic, Lists)
- Integrate with React Hook Form
- Add to Storybook for testing

### Phase 2: Form Integration (Week 2)
- Replace Activity Protocol textarea with rich text editor
- Add voice-to-text integration (microphone button)
- Add to Customer/Contact/Location forms (optional notes field)
- Mobile toolbar optimization
- E2E tests for editor functionality

### Phase 3: Advanced Features (Week 3)
- Upgrade Opportunity form with task lists
- Upgrade Project forms with tables and links
- Add mentions (@contact) support
- Character counter component
- Accessibility audit with screen readers

### Phase 4: Testing & Refinement (Week 4)
- Cross-browser testing (Chrome, Safari, Firefox, Edge)
- Mobile device testing (iOS Safari, Android Chrome)
- Accessibility testing (WCAG 2.1 AA compliance)
- Performance testing (large documents)
- User acceptance testing (ADM, PLAN roles)

---

## References

### External Documentation
- **TipTap Official Docs**: https://tiptap.dev/docs/editor/introduction
- **TipTap React Guide**: https://tiptap.dev/docs/editor/getting-started/install/react
- **ProseMirror (underlying engine)**: https://prosemirror.net/docs/
- **shadcn/ui Integration**: Custom implementation using Button, Separator components

### Research Sources
- Perplexity Search: "Best React text editors 2025 TypeScript shadcn accessibility"
- Perplexity Search: "TipTap Lexical accessibility mobile keyboard navigation"
- Ref Documentation: TipTap GitHub repository and examples

### Internal Documentation
- `.cursor/rules/ui-components.mdc` - UI component standards (shadcn/ui only)
- `docs/specifications/NFR_SPECIFICATION.md` - Performance targets (<400ms P50)
- `docs/specifications/TEST_STRATEGY_DOCUMENT.md` - Accessibility testing requirements
- `ui-ux/02-core-components/rich-text-editor.md` - Figma Make prompt (to be created)

---

## Approval

**Approved By:** Architecture Team  
**Date:** 2025-01-27  
**Next Review:** Q2 2025 (after MVP launch)

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-01-27 | Initial ADR - TipTap selection for rich text editing |


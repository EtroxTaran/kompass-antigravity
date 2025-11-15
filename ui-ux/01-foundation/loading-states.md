# Loading States - Figma Make Prompt

## Context & Purpose

- **Component Type**: Loading & Skeleton Screens
- **User Roles**: All (GF, PLAN, ADM, KALK, BUCH)
- **Usage Context**: Display during data fetching, page transitions, and background sync operations
- **Business Value**: Provides visual feedback to users that the system is working, reducing perceived wait time and improving user confidence

## Design Requirements

### Visual Hierarchy

- **Skeleton screens** for content placeholders (preferred over spinners)
- **Progress indicators** for multi-step operations (e.g., bulk import)
- **Inline spinners** for button loading states
- **Overlay loaders** for full-page operations

### Layout Structure

- Skeleton screens match actual content layout
- Loading indicators positioned contextually
- Non-blocking UI where possible (background loading)
- Clear visual distinction between loading and loaded states

### shadcn/ui Components

- `Skeleton` for placeholder content
- `Progress` for determinate operations
- Custom spinner component for indeterminate loading
- `Button` with loading state variant
- `Spinner` icon from lucide-react

## Figma Make Prompt

Create a comprehensive set of loading states for KOMPASS, a German CRM application. Design skeleton screens and loading indicators that provide clear feedback during data operations.

**Skeleton Screens (Primary Pattern):**
Design skeleton placeholders for common content types:

1. **Customer List Skeleton:**
   - Table layout with 8 rows
   - Each row has:
     - Avatar circle (40px diameter, animated shimmer)
     - Company name bar (200px width, 16px height)
     - VAT number bar (150px width, 12px height)
     - City bar (120px width, 12px height)
     - Status badge skeleton (80px width, 24px height, rounded)
     - Actions skeleton (3 circles, 32px each)
   - Shimmer animation: light gray (#f1f5f9) to lighter gray (#f8fafc), 2-second loop

2. **Customer Detail Card Skeleton:**
   - Card container with rounded corners
   - Header section:
     - Large avatar circle (80px)
     - Company name bar (250px × 24px)
     - Rating stars skeleton (5 circles, 20px each)
   - Content section with 5 information rows:
     - Label bar (100px × 14px)
     - Value bar (200px × 14px)
   - Footer with 3 button skeletons (120px × 40px each)

3. **Dashboard KPI Card Skeleton:**
   - 4 cards in grid (2×2 on mobile, 4×1 on desktop)
   - Each card:
     - Icon circle (48px, top-left)
     - Label bar (120px × 14px, below icon)
     - Large number bar (100px × 32px, center)
     - Trend arrow skeleton (24px circle, bottom-right)

4. **Form Loading Skeleton:**
   - 5 form field groups:
     - Label bar (80px × 14px)
     - Input rectangle (full width × 40px, rounded)
   - Button skeleton at bottom (140px × 40px)

**Loading Indicators:**

1. **Inline Spinner (Small):**
   - 16px diameter circular spinner
   - Blue (#3b82f6) stroke
   - 2px stroke width
   - Rotation animation (1-second loop)
   - Use in: Buttons during save/submit

2. **Full-Screen Overlay Loader:**
   - Semi-transparent backdrop (white 80% opacity)
   - Centered content:
     - Spinner (48px diameter)
     - Loading text below: "Daten werden geladen..." (14px)
     - Optional: Progress bar below text for determinate operations
   - Use in: Initial page load, major data operations

3. **Progress Bar (Determinate):**
   - Horizontal bar (full width × 8px)
   - Background: light gray (#e5e7eb)
   - Fill: blue (#3b82f6), animated left-to-right
   - Percentage text above: "35% abgeschlossen"
   - Use in: File uploads, bulk imports, multi-step processes

4. **Inline Loading Text:**
   - Small text (12px) with animated dots
   - "Wird geladen..." → "Wird geladen.." → "Wird geladen."
   - Gray color (#64748b)
   - Use in: Lazy-loaded sections, infinite scroll

**Button Loading States:**
Show button variants during loading:

- Primary button: Blue background, white spinner (16px), text changes to "Wird gespeichert..."
- Secondary button: Outlined, blue spinner, text changes
- Disabled appearance: Reduced opacity, cursor not-allowed
- Width remains constant (no layout shift)

**Offline Sync Loading:**
Design a persistent sync indicator in top bar:

- Small icon (20px): Cloud with circular arrow
- Color states:
  - Green: "Synchronisiert" (synced)
  - Blue with animation: "Synchronisierung läuft..." (syncing)
  - Amber: "Offline - 3 Änderungen ausstehend" (pending)
  - Red: "Synchronisierung fehlgeschlagen" (failed)
- Clicking opens popover with details

**Micro-interactions:**

- Skeleton shimmer: Linear gradient moving left-to-right
- Spinner: Smooth rotation, easing function
- Progress bar: Animated fill with transition
- Pulse animation for critical loading (e.g., payment processing)

Design in light mode with professional aesthetic. All text in German. Ensure animations are smooth (60fps) and not distracting.

## Interaction Patterns

### Loading Sequence

1. User triggers action (click button, navigate page)
2. Immediate visual feedback (button loading state or skeleton appears)
3. Loading indicator shown (spinner, skeleton, progress bar)
4. Content loads and smoothly replaces loading state
5. Optional: Success confirmation toast

### States

- **Idle**: No loading indicator visible
- **Loading (Indeterminate)**: Spinner or skeleton shown, no time estimate
- **Loading (Determinate)**: Progress bar with percentage
- **Success**: Loading state removed, content displayed, optional success toast
- **Error**: Loading state removed, error message shown (see error-empty-states.md)

### Skeleton Behavior

- Appears immediately (<100ms) when navigation starts
- Matches exact layout of loaded content
- Shimmer animation loops continuously
- Gracefully replaced by real content when loaded
- No layout shift when content loads

### Button Loading States

- Click triggers loading state immediately
- Text changes: "Speichern" → "Wird gespeichert..."
- Spinner appears to left of text
- Button disabled during loading
- Reverts to normal state on success/error

## German Labels & Content

### Loading Messages

- **Wird geladen...**: Loading...
- **Daten werden geladen...**: Data is loading...
- **Wird gespeichert...**: Saving...
- **Wird hochgeladen...**: Uploading...
- **Synchronisierung läuft...**: Syncing...
- **X% abgeschlossen**: X% complete

### Sync Status

- **Synchronisiert**: Synchronized
- **Offline**: Offline
- **X Änderungen ausstehend**: X changes pending
- **Synchronisierung fehlgeschlagen**: Sync failed

### Progress Messages

- **Kunden werden importiert...**: Importing customers...
- **Rechnung wird erstellt...**: Creating invoice...
- **Projekt wird aktualisiert...**: Updating project...

## Accessibility Requirements

- WCAG 2.1 AA compliance
- ARIA live regions for dynamic content updates
- `role="status"` on loading indicators
- `aria-busy="true"` on loading containers
- Screen reader announces loading state: "Lädt, bitte warten"
- Progress bar has `role="progressbar"` and `aria-valuenow`
- Loading animations respect `prefers-reduced-motion`
- Keyboard focus preserved during loading

## Mobile Considerations

- Smaller spinners on mobile (12px in buttons, 32px full-screen)
- Skeleton screens adapt to mobile layout (single column)
- Touch-friendly progress indicators (thicker bars, 12px height)
- Loading toasts positioned at top (not bottom, to avoid keyboard)
- Offline sync status prominent in mobile top bar
- Pull-to-refresh pattern for list views

## Example Data

**Customer List Loading:**

- Skeleton: 8 rows of customer data placeholders
- Duration: ~500ms typical load time
- Transition: Fade-in as rows load progressively

**Form Submission:**

- Button text: "Kunde anlegen" → "Wird gespeichert..."
- Spinner: 16px white spinner on blue background
- Duration: 300-800ms
- Success: Toast "Kunde wurde erfolgreich angelegt"

**Bulk Import:**

- Progress bar: "127 von 500 Kunden importiert (25%)"
- Estimated time: "Geschätzte verbleibende Zeit: 2 Minuten"
- Cancellable with "Abbrechen" button

**Offline Sync (ADM User):**

- Badge: Amber dot with "3"
- Tooltip: "3 Änderungen ausstehend - Automatische Synchronisierung bei Online-Verbindung"
- Manual sync button: "Jetzt synchronisieren" with blue spinner when active

## Implementation Notes

### shadcn/ui Installation

```bash
npx shadcn-ui@latest add skeleton
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add button
```

### Skeleton Component Usage

```typescript
import { Skeleton } from '@/components/ui/skeleton';

<div className="space-y-4">
  <Skeleton className="h-12 w-full" />
  <Skeleton className="h-12 w-full" />
  <Skeleton className="h-12 w-full" />
</div>
```

### Button Loading State

```typescript
<Button disabled={isLoading}>
  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  {isLoading ? 'Wird gespeichert...' : 'Speichern'}
</Button>
```

### Progress Bar Usage

```typescript
import { Progress } from '@/components/ui/progress';

<div className="space-y-2">
  <Progress value={progress} />
  <p className="text-sm text-muted-foreground">
    {progress}% abgeschlossen
  </p>
</div>
```

### Component Dependencies

- Design tokens (colors, animations)
- Icons from lucide-react (Loader2, CloudSync)
- Animation utilities from Tailwind CSS

### State Management

- Loading states tracked in React component state
- Async operations use React Query loading states
- Offline sync status from service worker
- Progress tracked in backend during bulk operations

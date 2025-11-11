# Toasts & Notifications - Figma Make Prompt

## Context & Purpose
- **Component Type**: Toast Notifications & Alert System
- **User Roles**: All (GF, PLAN, ADM, KALK, BUCH)
- **Usage Context**: Success confirmations, error messages, warnings, info updates
- **Business Value**: Non-blocking feedback for user actions and system events

## Design Requirements

### Visual Hierarchy
- **Success**: Green with checkmark icon
- **Error**: Red with alert icon
- **Warning**: Amber with warning icon
- **Info**: Blue with info icon
- **Auto-dismiss**: Most toasts dismiss after 5 seconds
- **Manual dismiss**: "×" button always available

### Layout Structure
- Position: Top-right corner (desktop), top center (mobile)
- Width: 360px (desktop), 90% (mobile)
- Stack vertically with 8px gap
- Slide in from right (desktop) or top (mobile)
- Max 3 visible toasts, oldest auto-dismisses

### shadcn/ui Components
- `Toast`, `ToastAction`, `ToastClose`, `ToastDescription`, `ToastTitle`
- `useToast` hook for triggering
- `Toaster` provider component

## Figma Make Prompt

Create a comprehensive toast notification system for KOMPASS, a German CRM application. Design toast variants for success, error, warning, and info messages with German text.

**Toast Container:**
- Width: 360px (desktop), calc(100% - 32px) mobile
- Background: White
- Border: 1px solid (varies by type)
- Border-radius: 8px
- Shadow: 0px 4px 12px rgba(0,0,0,0.15)
- Padding: 16px
- Animation: Slide in from right (desktop) or top (mobile), 300ms ease-out

**Success Toast:**
- Border-left: 4px solid green (#10b981)
- Icon: CheckCircle (24px, green) at left
- Title: 16px, semibold, #1f2937, "Erfolgreich gespeichert"
- Description: 14px, gray #6b7280, "Der Kunde wurde erfolgreich angelegt"
- Close button: "×" (20px, gray) at top-right
- Auto-dismiss: 5 seconds

**Error Toast:**
- Border-left: 4px solid red (#ef4444)
- Icon: AlertCircle (24px, red) at left
- Title: 16px, semibold, #1f2937, "Fehler"
- Description: 14px, gray, "Die Kundendaten konnten nicht gespeichert werden"
- Action button (optional): "Erneut versuchen" (red text button)
- Close button: "×"
- Auto-dismiss: 7 seconds (longer for errors)

**Warning Toast:**
- Border-left: 4px solid amber (#f59e0b)
- Icon: AlertTriangle (24px, amber) at left
- Title: "Achtung"
- Description: "Diese Aktion kann nicht rückgängig gemacht werden"
- Action button: "Verstanden" (amber text button)
- Close button: "×"
- Auto-dismiss: 6 seconds

**Info Toast:**
- Border-left: 4px solid blue (#3b82f6)
- Icon: Info (24px, blue) at left
- Title: "Information"
- Description: "Eine neue Version ist verfügbar. Bitte laden Sie die Seite neu."
- Action button: "Neu laden" (blue text button)
- Close button: "×"
- Auto-dismiss: 10 seconds (longer for important info)

**Toast Layout (Content Structure):**
```
┌─────────────────────────────────┐
│ [Icon] Title              [×]   │
│        Description              │
│        [Action Button]          │
└─────────────────────────────────┘
```
- Icon: 24px, left-aligned, 4px from colored border
- Title: 16px, semibold, next to icon
- Description: 14px, below title, wraps to multiple lines if needed
- Action button: 14px, below description, optional
- Close button: 20px, top-right corner

**Progress Toast (Loading):**
- Border-left: Blue
- Icon: Spinner (24px, blue, rotating animation)
- Title: "Wird verarbeitet..."
- Description: "Bitte warten Sie"
- Progress bar: Thin bar (4px height) at bottom showing progress
- No auto-dismiss (remains until action completes)
- Updates to success or error toast when complete

**Sync Status Toast (Persistent):**
- Special toast type for offline sync
- Icon: CloudSync (24px, animated when syncing)
- Title: "Synchronisierung"
- Description: "3 Änderungen werden synchronisiert..."
- No close button (auto-managed)
- Updates status: "Erfolgreich synchronisiert" (green) or "Fehler" (red)
- Auto-dismiss after 3 seconds when complete

**Toast with Rich Content:**
- Icon + Title + Close as normal
- Content area can include:
  - Multiple lines of text
  - Bullet list of items
  - Small image or icon
  - Multiple action buttons
- Example: "3 Kunden importiert, 2 Fehler" with expandable details

**Toast Stacking:**
- New toasts appear at top of stack
- Maximum 3 visible toasts
- Older toasts auto-dismiss when new ones arrive
- Each toast slides down to make room for new toast above

**Toast Positions:**
- Default: Top-right (desktop), Top-center (mobile)
- Alternative positions (configurable):
  - Top-left
  - Top-center
  - Bottom-right
  - Bottom-left
  - Bottom-center

**Accessibility Announcements:**
- Success: "Erfolgreich gespeichert"
- Error: "Fehler: Die Aktion ist fehlgeschlagen"
- Warning: "Achtung: Wichtige Information"
- Info: "Information: Neue Version verfügbar"

**Toast Animations:**
- Enter: Slide in from right (desktop) or top (mobile), 300ms
- Exit: Fade out and slide out (200ms)
- Dismiss: Click close or swipe right (mobile)

**Mobile-Specific:**
- Full width minus 16px margins each side
- Positioned at top center
- Swipe right to dismiss
- Larger touch target for close button (32px)
- Stack slides down from top

Design all toasts with clear hierarchy, adequate spacing, and smooth animations.

## Interaction Patterns

### Toast Lifecycle
1. User action triggers toast (e.g., save customer)
2. Toast slides in from right (or top on mobile)
3. Auto-dismiss timer starts (3-10 seconds based on type)
4. User can manually dismiss by clicking "×"
5. Toast fades out and slides away
6. Next toast (if any) moves up to fill space

### User Interactions
- **Click Close "×"**: Dismisses toast immediately
- **Click Action Button**: Executes action (e.g., "Erneut versuchen" retries operation)
- **Hover (desktop)**: Pauses auto-dismiss timer
- **Swipe Right (mobile)**: Dismisses toast

### Auto-Dismiss Timing
- Success: 5 seconds
- Warning: 6 seconds
- Error: 7 seconds
- Info: 10 seconds (for important information)
- Progress: No auto-dismiss (remains until complete)

### Stacking Behavior
- Maximum 3 visible toasts
- Newest at top
- Oldest auto-dismisses when limit reached
- Smooth slide-down animation when toast dismissed

## German Labels & Content

### Toast Titles
- **Erfolg**: Success
- **Erfolgreich gespeichert**: Successfully saved
- **Fehler**: Error
- **Achtung**: Warning
- **Information**: Information
- **Wird verarbeitet...**: Processing...
- **Synchronisierung**: Synchronization

### Toast Descriptions
- **Der Kunde wurde erfolgreich angelegt**: Customer created successfully
- **Die Änderungen wurden gespeichert**: Changes saved
- **Die Aktion ist fehlgeschlagen**: Action failed
- **Bitte überprüfen Sie Ihre Eingaben**: Please check your inputs
- **Diese Aktion kann nicht rückgängig gemacht werden**: This action cannot be undone
- **Keine Internetverbindung**: No internet connection
- **X Änderungen werden synchronisiert**: X changes syncing

### Action Buttons
- **OK**: OK
- **Verstanden**: Understood
- **Erneut versuchen**: Try again
- **Neu laden**: Reload
- **Details anzeigen**: Show details
- **Schließen**: Close

## Accessibility Requirements
- WCAG 2.1 AA compliance
- Toast container has role="status" or role="alert"
- Live region for screen reader announcements
- aria-live="polite" for info/success, aria-live="assertive" for errors
- Close button has aria-label="Toast schließen"
- Color is not the only indicator (icons used)
- Keyboard accessible: Focus moves to action button if present
- Escape key dismisses focused toast
- Sufficient contrast for text (4.5:1)

## Mobile Considerations
- Full width with 16px margins
- Top-center position (easier to see)
- Swipe right to dismiss gesture
- Larger close button (32px touch target)
- Slightly larger font sizes (16px title, 14px description)
- Toasts slide down from top on mobile
- Bottom toasts avoid overlapping with bottom navigation

## Example Data

**Success - Customer Created:**
- Icon: Green checkmark
- Title: "Kunde angelegt"
- Description: "Hofladen Müller GmbH wurde erfolgreich angelegt"
- Duration: 5 seconds

**Error - Save Failed:**
- Icon: Red alert circle
- Title: "Speichern fehlgeschlagen"
- Description: "Die Kundendaten konnten nicht gespeichert werden. Bitte überprüfen Sie Ihre Internetverbindung."
- Action: "Erneut versuchen"
- Duration: 7 seconds

**Warning - Unsaved Changes:**
- Icon: Amber warning triangle
- Title: "Ungespeicherte Änderungen"
- Description: "Sie haben ungespeicherte Änderungen. Diese gehen verloren, wenn Sie die Seite verlassen."
- Action: "Verstanden"
- Duration: 6 seconds

**Info - Update Available:**
- Icon: Blue info circle
- Title: "Update verfügbar"
- Description: "Eine neue Version von KOMPASS ist verfügbar. Bitte laden Sie die Seite neu, um die neueste Version zu verwenden."
- Action: "Neu laden"
- Duration: 10 seconds

**Progress - Syncing:**
- Icon: Blue spinner (animated)
- Title: "Synchronisierung läuft..."
- Description: "5 Änderungen werden synchronisiert"
- Progress bar: 60% complete
- No auto-dismiss

## Implementation Notes

### shadcn/ui Installation
```bash
npx shadcn-ui@latest add toast
```

### Toast Usage
```typescript
import { useToast } from '@/hooks/use-toast';

const { toast } = useToast();

// Success toast
toast({
  title: "Erfolgreich gespeichert",
  description: "Der Kunde wurde erfolgreich angelegt",
});

// Error toast
toast({
  variant: "destructive",
  title: "Fehler",
  description: "Die Aktion ist fehlgeschlagen",
  action: <ToastAction altText="Retry">Erneut versuchen</ToastAction>,
});

// Custom duration
toast({
  title: "Information",
  description: "Update verfügbar",
  duration: 10000, // 10 seconds
});
```

### Toaster Provider
```typescript
// In root layout or App component
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <>
      {/* Your app content */}
      <Toaster />
    </>
  );
}
```

### Component Dependencies
- Design tokens (colors, spacing, shadows)
- Icons from lucide-react (CheckCircle, AlertCircle, AlertTriangle, Info)
- Animation utilities from Tailwind CSS
- Portal component for rendering outside DOM hierarchy

### State Management
- Toast queue managed by shadcn/ui toast context
- Toast state: visible, dismissed, duration remaining
- Auto-dismiss timers managed internally
- User can programmatically dismiss toasts by ID


# Error & Empty States - Figma Make Prompt

## Context & Purpose

- **Component Type**: Error Handling & Empty State Patterns
- **User Roles**: All (GF, PLAN, ADM, KALK, BUCH)
- **Usage Context**: Display when errors occur, data is empty, or user lacks permissions
- **Business Value**: Provides clear feedback and actionable next steps, reducing user frustration and support requests

## Design Requirements

### Visual Hierarchy

- **Error States**: Alert styling with error color, clear message, action buttons
- **Empty States**: Neutral styling with helpful illustration, call-to-action
- **Permission Denied**: Clear indication of RBAC restrictions with upgrade path
- **No Results**: Search/filter-specific empty state with suggestions

### Layout Structure

- Centered content for full-page states
- Inline alerts for contextual errors
- Toast notifications for transient errors
- Modal dialogs for critical errors requiring acknowledgment

### shadcn/ui Components

- `Alert` for inline error messages
- `AlertDialog` for critical errors
- `Card` for empty state containers
- `Button` for recovery actions
- `Toast` for transient notifications
- `Badge` for permission indicators

## Error & Empty State Specifications (from Reference Repository)

**Reference Source:**

- `ui-ux/Kompassuimusterbibliothek/src/components/EmptyCustomerList.tsx`
- `ui-ux/Kompassuimusterbibliothek/src/components/EmptySearchResults.tsx`
- `ui-ux/Kompassuimusterbibliothek/src/components/NetworkErrorState.tsx`
- `ui-ux/Kompassuimusterbibliothek/src/components/CustomerListDemo.tsx` (empty state patterns)
- `ui-ux/Kompassuimusterbibliothek/src/components/FormInputsDemo.tsx` (error states)

The error and empty state system uses shadcn/ui `Alert`, `Card`, and `Button` components with clear messaging and actionable recovery options.

**Error States:**

1. **Inline Form Validation Error:**
   - Red underline on invalid input field (2px, #ef4444)
   - Error message below field:
     - Red text (12px, #ef4444)
     - Error icon (AlertCircle, 16px) to left of message
     - Example: "Die Umsatzsteuer-ID muss im Format DE123456789 sein"
   - Field background: Light red tint (#fef2f2)

2. **Alert Banner (Page-Level Error):**
   - Red alert box (full width, rounded corners)
   - Red background (#fef2f2) with red border-left (4px, #ef4444)
   - Content layout:
     - Error icon (AlertCircle, 20px, red) at left
     - Bold heading: "Fehler beim Laden der Kundendaten"
     - Description text below: "Die Verbindung zum Server konnte nicht hergestellt werden. Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut."
     - Action button: "Erneut versuchen" (secondary button, red)
   - Dismiss "×" button at top-right

3. **Critical Error Dialog (Modal):**
   - Modal overlay (semi-transparent black, 50% opacity)
   - Centered white card (480px width, rounded corners, shadow)
   - Content:
     - Large error icon (AlertTriangle, 64px, red) at top
     - Heading: "Synchronisierung fehlgeschlagen" (24px, bold)
     - Description: "Es wurden Konflikte zwischen Ihren lokalen Änderungen und den Server-Daten erkannt. Bitte wählen Sie, wie fortgefahren werden soll."
     - Two action buttons:
       - Primary: "Konflikte lösen" (blue button)
       - Secondary: "Später" (outlined button)

4. **Toast Notification (Transient Error):**
   - Small toast (360px width) slides in from top-right
   - Red background (#ef4444) with white text
   - Content:
     - Error icon (X circle) at left
     - Message: "Kunde konnte nicht gespeichert werden"
     - Dismiss "×" at right
   - Auto-dismisses after 5 seconds

5. **Network Error (Offline):**
   - Full-page centered state
   - Illustration: Cloud with X icon (grayscale, 200px)
   - Heading: "Keine Internetverbindung"
   - Description: "Sie arbeiten derzeit offline. Ihre Änderungen werden automatisch synchronisiert, sobald Sie wieder online sind."
   - Status badge: "Offline-Modus aktiv" (amber badge)
   - Info card below:
     - "3 Änderungen ausstehend"
     - List of pending changes
   - Button: "Verbindung erneut prüfen"

**Empty States:**

1. **Empty Customer List (No Data):**
   - Centered content in empty table area
   - Illustration: Friendly user icon with plus sign (grayscale, 160px)
   - Heading: "Noch keine Kunden vorhanden" (20px, semibold)
   - Description: "Beginnen Sie mit dem Hinzufügen Ihres ersten Kunden, um Ihre Kundendatenbank aufzubauen."
   - Primary action button: "Ersten Kunden anlegen" (blue, prominent)
   - Secondary link: "Kunden aus CSV importieren"

2. **Empty Search Results:**
   - Centered in search results area
   - Search icon with magnifying glass (grayscale, 120px)
   - Heading: "Keine Ergebnisse für 'Müller Hofladen'"
   - Description: "Versuchen Sie es mit anderen Suchbegriffen oder überprüfen Sie die Schreibweise."
   - Suggestions:
     - "Suchfilter anpassen"
     - "Alle Kunden anzeigen"
   - Secondary action: "Filter zurücksetzen" (text button)

3. **Empty Project List (Filtered):**
   - Filter indicator above empty state
   - Active filters shown: "Status: Abgeschlossen | Jahr: 2024"
   - Illustration: Folder icon (grayscale, 140px)
   - Heading: "Keine Projekte mit diesen Filtern gefunden"
   - Description: "Es gibt keine abgeschlossenen Projekte aus dem Jahr 2024."
   - Action button: "Filter entfernen"

4. **Empty Activity Timeline:**
   - Timeline icon (grayscale, 120px)
   - Heading: "Noch keine Aktivitäten protokolliert"
   - Description: "Beginnen Sie mit der Erfassung von Kundenkontakten, Anrufen und Meetings."
   - Button: "Aktivität hinzufügen" (blue)

**Permission Denied States:**

1. **RBAC Restricted Feature:**
   - Centered card with lock icon (80px, gray)
   - Heading: "Zugriff eingeschränkt"
   - Description: "Sie haben keine Berechtigung, Rechnungen zu erstellen. Diese Funktion ist nur für Geschäftsführung und Buchhaltung verfügbar."
   - Info badge: "Erforderliche Rolle: GF oder BUCH"
   - Secondary text: "Kontaktieren Sie Ihren Administrator, um Zugriffsrechte zu beantragen."

2. **Owner-Only Customer (ADM User):**
   - Alert banner at page top
   - Yellow background (#fef3c7) with amber border-left
   - Lock icon at left
   - Text: "Dieser Kunde gehört einem anderen Außendienstmitarbeiter. Sie haben nur Lesezugriff."
   - Note: Edit buttons are disabled/hidden

**GoBD Immutable Field Error:**

1. **Finalized Invoice Edit Attempt:**
   - Modal dialog
   - Warning icon (amber, 48px)
   - Heading: "Rechnung ist abgeschlossen"
   - Description: "Diese Rechnung wurde bereits finalisiert und kann gemäß GoBD-Vorschriften nicht mehr geändert werden."
   - Change log link: "Änderungsprotokoll anzeigen"
   - Note: "Für Korrekturen erstellen Sie bitte eine Stornorechnung."
   - Button: "Verstanden" (close dialog)

**Conflict Resolution State:**

1. **Data Conflict Detected:**
   - Full-page or modal view
   - Two-column comparison:
     - Left: "Ihre Änderungen" (blue header)
     - Right: "Server-Änderungen" (green header)
   - Differences highlighted in each column
   - Per-field resolution:
     - Radio buttons: "Meine behalten" | "Server übernehmen"
   - Heading: "Konflikte erkannt"
   - Description: "Dieser Kunde wurde sowohl lokal als auch auf dem Server geändert. Bitte wählen Sie für jedes Feld die gewünschte Version."
   - Action buttons:
     - Primary: "Konflikte lösen" (saves selected versions)
     - Secondary: "Abbrechen"

Design all states in light mode with professional, calm aesthetic. Use German language throughout. Ensure tone is helpful, not punitive.

## Interaction Patterns

### Error Recovery Flow

1. Error occurs (validation, network, permission)
2. Appropriate error state displays immediately
3. User reads error message and understands issue
4. User clicks action button (retry, dismiss, fix)
5. System attempts recovery or dismisses error
6. Success state or persistent error if unresolved

### Empty State Flow

1. User navigates to section or applies filters
2. System determines no data matches criteria
3. Empty state displays with illustration and CTA
4. User clicks action button (add new, clear filters)
5. System navigates to appropriate action or resets view
6. Data appears (or creation form opens)

### Permission Denied Flow

1. User attempts restricted action
2. System checks RBAC permissions
3. Permission denied state displays (not navigation)
4. User understands role requirement
5. Optional: Contact admin link for access request

## German Labels & Content

### Error Messages

- **Fehler**: Error
- **Fehler beim Laden**: Error loading
- **Synchronisierung fehlgeschlagen**: Sync failed
- **Keine Internetverbindung**: No internet connection
- **Offline-Modus aktiv**: Offline mode active
- **X Änderungen ausstehend**: X changes pending
- **Erneut versuchen**: Try again
- **Verbindung erneut prüfen**: Check connection again

### Empty States

- **Noch keine [X] vorhanden**: No [X] yet
- **Keine Ergebnisse für '[Y]'**: No results for '[Y]'
- **Keine [X] gefunden**: No [X] found
- **Ersten [X] anlegen**: Create first [X]
- **[X] hinzufügen**: Add [X]
- **Filter zurücksetzen**: Reset filters
- **Alle [X] anzeigen**: Show all [X]

### Permission Messages

- **Zugriff eingeschränkt**: Access restricted
- **Keine Berechtigung**: No permission
- **Erforderliche Rolle**: Required role
- **Administrator kontaktieren**: Contact administrator

### GoBD Messages

- **Rechnung ist abgeschlossen**: Invoice is finalized
- **Kann nicht geändert werden**: Cannot be modified
- **Änderungsprotokoll anzeigen**: Show change log
- **Stornorechnung erstellen**: Create cancellation invoice

## Accessibility Requirements

- WCAG 2.1 AA compliance
- Error messages have `role="alert"` for screen reader announcement
- Color is not the only indicator (icons also used)
- Focus moved to error message when validation fails
- Error descriptions associated with inputs via `aria-describedby`
- Empty state buttons are keyboard accessible
- Toast notifications announced to screen readers
- Minimum 4.5:1 contrast for error text on background

## Mobile Considerations

- Toast notifications positioned at top (avoid keyboard overlap)
- Full-screen error dialogs on mobile (not modals)
- Touch-friendly action buttons (minimum 44px height)
- Shorter error messages on mobile (truncated with "Mehr erfahren")
- Empty state illustrations smaller on mobile (100px vs 160px)
- Offline indicator persistent in mobile top bar
- Swipe to dismiss toast notifications

## Example Data

**Form Validation Error:**

- Field: "Umsatzsteuer-ID"
- Invalid input: "123456789"
- Error: "Die Umsatzsteuer-ID muss im Format DE123456789 sein"

**Network Error:**

- Pending changes: "Kunde 'Hofladen Müller' aktualisiert", "Neue Aktivität für 'REWE Köln' erstellt", "Angebot #2024-045 gespeichert"
- Offline duration: "Seit 14:30 Uhr offline (2 Stunden)"

**Empty Customer List:**

- Company: "Musterunternehmen GmbH" (new tenant, no data yet)
- CTA: "Ersten Kunden anlegen"

**Permission Denied:**

- User: "Michael Schmidt" (ADM role)
- Attempted action: "Rechnung erstellen"
- Required role: "GF oder BUCH"

## Implementation Notes

### shadcn/ui Installation

```bash
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add alert-dialog
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add card
npx shadcn-ui@latest add button
npx shadcn-ui@latest add badge
```

### Inline Error Alert

```typescript
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Fehler beim Laden</AlertTitle>
  <AlertDescription>
    Die Kundendaten konnten nicht geladen werden.
  </AlertDescription>
</Alert>
```

### Empty State Component

```typescript
<Card className="border-dashed">
  <CardContent className="flex flex-col items-center justify-center py-10">
    <UsersIcon className="h-20 w-20 text-muted-foreground mb-4" />
    <h3 className="text-lg font-semibold mb-2">
      Noch keine Kunden vorhanden
    </h3>
    <p className="text-sm text-muted-foreground text-center mb-4">
      Beginnen Sie mit dem Hinzufügen Ihres ersten Kunden.
    </p>
    <Button>Ersten Kunden anlegen</Button>
  </CardContent>
</Card>
```

### Toast Notification

```typescript
import { useToast } from '@/hooks/use-toast';

const { toast } = useToast();

toast({
  variant: 'destructive',
  title: 'Fehler',
  description: 'Kunde konnte nicht gespeichert werden.',
});
```

### Component Dependencies

- Design tokens (error colors, spacing)
- Icons from lucide-react (AlertCircle, AlertTriangle, Lock, Users)
- Toast notification system
- RBAC context for permission checks

### State Management

- Error states triggered by API errors or validation
- Empty states derived from data queries
- Permission states checked against user role
- Offline state from service worker

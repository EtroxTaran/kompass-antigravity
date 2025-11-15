# Customer Detail Page - Figma Make Prompt

## Context & Purpose

- **Component Type**: 360° Entity Detail View
- **User Roles**: All (GF/PLAN full access, ADM own customers, KALK/BUCH read-only financial)
- **Usage Context**: Customer detail page with tabs for complete customer information
- **Business Value**: Comprehensive customer view for relationship management

## Design Requirements

### Visual Hierarchy

- **Customer Header**: Company name, status, rating prominent
- **Tab Navigation**: Organized info sections
- **Quick Actions**: Edit, Delete, New opportunity/project buttons
- **Related Entities**: Locations, contacts, opportunities, projects visible

### Layout Structure

- Full-page layout
- Header section: 200px height
- Tab navigation: Below header
- Tab content: Scrollable area
- Sidebar: 300px for quick info (optional)

### shadcn/ui Components

- `Tabs` for sections
- `Card` for info display
- `Badge` for status/rating
- `Button` for actions
- `Avatar` for contacts

## Figma Make Prompt

Create a comprehensive customer detail page for KOMPASS with tabbed navigation showing all customer information, locations, contacts, opportunities, projects, and activities with German labels.

**Page Header:**

- Breadcrumb: "Dashboard > Kunden > Hofladen Müller GmbH"
- Company name: "Hofladen Müller GmbH" (32px, bold)
- Status badge: "Aktiv" (green) or "Inaktiv" (gray)
- Rating: ⭐⭐⭐⭐⭐ "A" (gold badge)
- Customer type badge: "Direktvermarkter"

**Header Actions (Top-Right):**

- "Kunde bearbeiten" (Pencil icon, blue button)
- "Neue Opportunity" (Plus, blue outlined)
- More actions menu: "Duplizieren", "Deaktivieren", "Löschen"

**Key Metrics Cards (Below Header, Before Tabs):**
4 cards in row:

1. **Opportunities**: "5 aktive" (€ 625.000 gesamt)
2. **Projekte**: "3 laufend" (€ 1.2M Volumen)
3. **Umsatz**: "€ 450.000" (Dieses Jahr)
4. **Letzte Aktivität**: "Vor 3 Tagen" (Telefonat)

**Tab Navigation:**
Tabs: "Übersicht" | "Standorte (3)" | "Kontakte (12)" | "Opportunities (5)" | "Projekte (3)" | "Rechnungen (23)" | "Aktivitäten (145)" | "Dokumente"

- Active tab: Blue underline
- Count badges: Gray, small

**Tab 1: Übersicht (Overview)**

**Section: Stammdaten (Master Data)**

- Card layout with icon headers
- Fields (2-column grid):
  - Firmenname: "Hofladen Müller GmbH"
  - Umsatzsteuer-ID: "DE123456789"
  - Kundentyp: "Direktvermarkter"
  - Branche: "Landwirtschaft"
  - Bewertung: "A" ⭐⭐⭐⭐⭐
  - Inhaber: "Michael Schmidt" (ADM) with avatar
  - Erstellt: "12.10.2024"

**Section: Rechnungsadresse**

- Card with MapPin icon
- Address display:
  - Hauptstraße 15
  - 80331 München
  - Deutschland
- "Auf Karte anzeigen" link (opens map)

**Section: Kontaktdaten**

- Card with contact icons
- E-Mail: "info@hofladen-mueller.de" (clickable mailto)
- Telefon: "+49-89-1234567" (clickable tel)
- Website: "https://www.hofladen-mueller.de" (clickable, external)

**Section: Geschäftsdaten**

- Card with financial info
- Kreditlimit: "€ 50.000"
- Zahlungsziel: "30 Tage"
- Offene Forderungen: "€ 12.500" (red if > 0)

**Section: Notizen**

- Card with notes icon
- Textarea showing: "VIP-Kunde, bevorzugte Behandlung. Jährliches Treffen mit GF..."
- Edit button (pencil icon, only if allowed)

**Tab 2: Standorte (Locations)**

- Uses location-list.md component
- Grid of location cards (2-3 per row)
- Add button: "+ Standort hinzufügen" (top-right)
- Shows: 3 locations for this customer

**Tab 3: Kontakte (Contacts)**

- Uses contact-list.md component
- Grid of contact cards
- Filter by role, authority level
- Add button: "+ Kontakt hinzufügen"
- Shows: 12 contacts

**Tab 4: Opportunities**

- Table or Kanban view toggle
- Columns: Titel, Wert, Wahrscheinlichkeit, Status, Erwartet am, Verantwortlich
- Shows: 5 opportunities for this customer
- Totals: € 625.000 gesamt, € 468.750 gewichtet
- Add button: "+ Opportunity hinzufügen"

**Tab 5: Projekte (Projects)**

- Table view
- Columns: Projektnr., Name, Status, Fortschritt, Budget, Zeitplan, Projektleiter
- Shows: 3 projects
- Status badges: In Bearbeitung, Abgeschlossen
- Add button: "+ Projekt erstellen"

**Tab 6: Rechnungen (Invoices)**

- Table view from invoice-list.md
- Columns: Rechnungsnr., Datum, Fällig, Betrag, Status, Bezahlt
- Summary: 23 Rechnungen, € 450.000 Umsatz (Jahr)
- Filter: Status, Datum
- Add button: "+ Rechnung erstellen"

**Tab 7: Aktivitäten (Activities)**

- Timeline view from activity-timeline.md
- Chronological feed of all customer interactions
- Filter by type, date, user
- Add button: "+ Aktivität hinzufügen"
- Shows: Last 50 activities

**Tab 8: Dokumente (Documents)**

- File list with icons
- Upload area: Drag & drop
- Files: Verträge, Angebote, Rechnungen, Fotos
- Actions: Download, Delete, Share
- Add button: "+ Dokument hochladen"

**Sidebar (Optional, Right Side):**

- Quick Info Card:
  - Last contact: "Vor 3 Tagen"
  - Open opportunities: "5"
  - Active projects: "3"
  - Outstanding: "€ 12.500"
- Quick Actions:
  - "Aktivität hinzufügen"
  - "Anrufen"
  - "E-Mail senden"

**RBAC Visibility:**

- ADM users: Can only view own customers
- Edit disabled if not owner (lock icons)
- Financial data: Only GF/BUCH can see credit limit, outstanding
- Delete: Only GF can delete

**Mobile Layout:**

- Full-screen page
- Header compact: Name + status only
- Tabs: Horizontal scroll or dropdown
- Each tab: Full-screen content
- Actions: Floating action button

**Empty States Per Tab:**

- No locations: "Noch keine Standorte angelegt"
- No contacts: "Noch keine Kontakte hinzugefügt"
- Etc. with "+ Hinzufügen" buttons

Design with comprehensive information display, easy navigation, and quick access to related entities.

## Implementation Notes

```bash
npx shadcn-ui@latest add tabs card badge button avatar
```

- Customer API with full data
- RBAC context for visibility
- Tab state persists in URL
- Lazy load tab content

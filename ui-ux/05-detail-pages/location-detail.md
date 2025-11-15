# Location Detail - Figma Make Prompt

## Context & Purpose

- **Component Type**: Nested Entity Detail View
- **User Roles**: All (read), GF/PLAN/ADM (edit own)
- **Usage Context**: Full location details with contacts and delivery info
- **Business Value**: Complete delivery address and contact information

## Figma Make Prompt

Create a location detail view for KOMPASS showing full address, assigned contacts, delivery notes, and location-specific information with German labels and map integration.

**Header:**

- Breadcrumb: "Kunden > Hofladen Müller > Standorte > Filiale München Süd"
- Location name: "Filiale München Süd" (28px, bold)
- Type badge: "Filiale" (blue)
- Status: "Aktiv" (green) or "Inaktiv" (gray)
- Primary location star: ⭐ "Standard-Lieferstandort"
- Actions: "Bearbeiten", "Löschen", "Als Standard festlegen"

**Section: Adresse**

- Card with large MapPin icon
- Full delivery address formatted:
  - Industriestraße 42
  - 81379 München
  - Deutschland
- Map embed: Google Maps or OpenStreetMap showing location
- "Routenplaner öffnen" button

**Section: Ansprechpartner**

- List of assigned contacts
- Each contact: Avatar + name + position + phone
- Primary contact highlighted with star
- Add button: "+ Kontakt zuweisen"

**Section: Lieferinformationen**

- Anlieferhinweise: Full text "Hintereingang nutzen, Parkplätze vorhanden"
- Öffnungszeiten: "Mo-Fr 8:00-18:00, Sa 9:00-14:00"
- Parkmöglichkeiten: "Parkplätze vor dem Gebäude"

**Section: Verknüpfte Projekte**

- List of projects delivered to this location
- Project cards: Number, name, status, dates

**Section: Aktivitäten**

- Timeline of activities related to this location
- Filter: Deliveries, visits, calls

**Mobile:** Full-screen, scrollable sections, map full-width

## Implementation Notes

```bash
npx shadcn-ui@latest add card badge button avatar
```

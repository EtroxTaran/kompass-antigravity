# Opportunity Detail - Figma Make Prompt

## Context & Purpose

- **Component Type**: Opportunity Detail View
- **User Roles**: GF/PLAN (all), ADM (own), KALK (read)
- **Usage Context**: Opportunity details with status flow and value tracking
- **Business Value**: Sales pipeline management and deal tracking

## Figma Make Prompt

Create an opportunity detail view for KOMPASS showing customer info, value/probability, status flow, next steps, and activity history with German labels.

**Header:**

- Breadcrumb: "Dashboard > Opportunities > Ladeneinrichtung"
- Title: "Ladeneinrichtung Neueröffnung" (28px, bold)
- Customer: "REWE München Süd" (building icon, clickable link)
- Status badge: "Verhandlung" (orange, large)
- Owner: Avatar + "Michael Schmidt"
- Actions: "Bearbeiten", "Status ändern", "Löschen"

**Value Cards (Prominent):**
3 cards side by side:

1. **Geschätzter Wert**: "€ 125.000" (32px, bold, blue) - Euro icon
2. **Wahrscheinlichkeit**: "75%" (32px) with circular progress - TrendingUp icon
3. **Gewichteter Wert**: "€ 93.750" (28px, blue) - calculated, info icon

**Status Flow (Visual):**

- Horizontal stepper showing: Neu → Qualifizierung → Angebot → [Verhandlung] → Gewonnen/Verloren
- Current status highlighted in orange
- Previous steps: Blue checkmarks
- Next steps: Gray outline
- Click to change status (if allowed)

**Section: Opportunity-Details**

- Beschreibung: Full text "Kunde plant neue Filiale in München Süd..."
- Tags: Badges "Großprojekt", "Q4", "Zeitkritisch"
- Erwarteter Abschluss: "15.12.2024" (calendar icon)
- Nächster Schritt: "Angebot präsentieren, Entscheidung Q4"
- Follow-up: "20.11.2024" with reminder icon

**Section: Zugehöriges Projekt**

- Shows if opportunity won and converted
- Project card: Number, name, status, link

**Section: Kontaktpersonen**

- List of involved contacts from customer
- Decision makers highlighted
- Add button: "+ Kontakt hinzufügen"

**Section: Aktivitätsverlauf**

- Timeline of activities related to this opportunity
- Filter by type
- Shows: Calls, meetings, emails, notes
- Add button: "+ Aktivität hinzufügen"

**Section: Dokumente**

- Angebote, presentations, contracts
- Upload area
- List with download/view options

**Sidebar (Right):**

- Quick Info:
  - Erstellt: "01.11.2024"
  - Alter: "14 Tage"
  - Letzte Aktivität: "Vor 2 Tagen"
- Quick Actions:
  - "Aktivität hinzufügen"
  - "Angebot erstellen"
  - "In Projekt umwandeln" (if won)

**Mobile:** Full-screen, value cards stack, status flow horizontal scroll

## Implementation Notes

```bash
npx shadcn-ui@latest add card badge button progress
```

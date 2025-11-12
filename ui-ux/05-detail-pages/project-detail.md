# Project Detail - Figma Make Prompt

## Context & Purpose
- **Component Type**: Project Detail View
- **User Roles**: GF/PLAN (full), ADM/KALK (assigned), BUCH (financial)
- **Usage Context**: Project management with timeline, budget, team
- **Business Value**: Project tracking and resource management

## Figma Make Prompt

Create a project detail view for KOMPASS showing project info, timeline, budget tracking, team, milestones, and linked entities with German labels.

**Header:**
- Breadcrumb: "Dashboard > Projekte > P-2024-B023"
- Project number: "P-2024-B023" (32px, bold, blue) - GoBD indicator
- Project name: "REWE München Süd - Ladeneinrichtung"
- Customer: "REWE München Süd" (clickable link)
- Status badge: "In Bearbeitung" (amber, large)
- Actions: "Bearbeiten", "Zeiterfassung", "Bericht", "Archivieren"

**Progress Card (Prominent):**
- Large circular progress: "65%" in center (120px diameter)
- Color: Blue gradient
- Label: "Projektfortschritt"
- Milestones: "12 von 18 abgeschlossen"
- Timeline bar below: Shows elapsed vs remaining time

**KPI Cards:**
4 cards:
1. **Auftragswert**: "€ 450.000" - Contract value
2. **Budget**: "€ 380.000" - Planned budget
3. **Marge**: "€ 70.000 (+15,6%)" (green) - Profit margin
4. **Zeitplan**: "01.12.24 - 28.02.25" - Timeline

**Tabs:**
"Übersicht" | "Team" | "Meilensteine" | "Budget" | "Zeiterfassung" | "Dokumente"

**Tab: Übersicht**
- Projektbeschreibung
- Opportunity link: "Erstellt aus Opportunity: Ladeneinrichtung"
- Zeitplan: Start/End dates with visual timeline
- Projektleiter: Avatar + "Thomas Fischer"

**Tab: Team**
- Projektleiter card: Large avatar, name, role, contact
- Team-Mitglieder: List with avatars, roles, contact
- Externe Partner: List if any
- Add button: "+ Team-Mitglied hinzufügen"

**Tab: Meilensteine**
- List or timeline of milestones
- Each: Name, date, status (completed/pending), description
- Visual: Timeline with markers
- Add button: "+ Meilenstein hinzufügen"

**Tab: Budget**
- Breakdown: Material, Personal, Fremdleistungen, Sonstiges
- Ist vs Soll comparison
- Spent vs remaining visual (progress bars)
- Budget health indicator: Green/amber/red

**Tab: Zeiterfassung**
- Time tracking table: User, date, hours, description
- Total hours: Summed
- Add button: "+ Zeit erfassen"

**Tab: Dokumente**
- Verträge, Pläne, Berichte, Fotos
- Upload area
- List with preview, download

**Sidebar (Right):**
- Quick Info:
  - Status: Badge
  - Fortschritt: "65%"
  - Verbleibend: "32 Tage"
  - Team: "5 Mitarbeiter"
- Quick Actions:
  - "Zeit erfassen"
  - "Bericht erstellen"
  - "Vertrag anzeigen" (if project has contract, links to contract detail)
  - "Zu Lexware" (external link to Lexware, for invoicing)

**Mobile:** Full-screen, tabs dropdown, progress prominent

## Implementation Notes
```bash
npx shadcn-ui@latest add tabs card badge button progress avatar
```


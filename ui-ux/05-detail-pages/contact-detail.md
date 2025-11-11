# Contact Detail - Figma Make Prompt

## Context & Purpose
- **Component Type**: Contact Person Detail View
- **User Roles**: All (read), GF/PLAN (full edit), ADM (basic edit)
- **Usage Context**: Complete contact information with decision authority
- **Business Value**: Track decision makers and communication history

## Figma Make Prompt

Create a contact detail view for KOMPASS showing personal info, decision-making authority, assigned locations, and activity history with German labels.

**Header:**
- Breadcrumb: "Kunden > Hofladen Müller > Kontakte > Hans Müller"
- Large avatar: 80px with initials or photo
- Name: "Dr. Hans Müller" (28px, bold)
- Position: "Geschäftsführer" (16px, gray)
- Parent customer link: "Hofladen Müller GmbH"
- Actions: "Bearbeiten", "Löschen", "Aktivität hinzufügen"

**Section: Kontaktdaten**
- Card with contact icons
- E-Mail: "h.mueller@hofladen-mueller.de" (Mail icon, clickable)
- Telefon: "+49-89-1234567" (Phone icon)
- Mobil: "+49-170-1234567" (Smartphone icon)
- Bevorzugt: "E-Mail" badge
- Sprache: "Deutsch"

**Section: Entscheidungsbefugnis** (Prominent)
- Card with decision-making indicators
- Rolle: "Entscheidungsträger" (large blue badge with crown icon)
- Autoritätslevel: 👑 "Finale Autorität" (gold crown, 4 stars)
- Genehmigung: Shield icon + "Kann Bestellungen bis € 50.000 genehmigen"
- Funktionale Rollen: Badges "Geschäftsführer", "Einkaufsleiter"
- Abteilungseinfluss: Chips "Einkauf", "Finanzen", "Geschäftsleitung"
- RBAC note: "Nur PLAN/GF können Entscheidungsrollen bearbeiten" (if ADM)

**Section: Zugewiesene Standorte**
- List of assigned locations
- Each location: Name, type badge, primary star if applicable
- Example: "Filiale München Süd ⭐ (Hauptansprechpartner)"

**Section: Opportunities & Projekte**
- Tabs: "Opportunities" | "Projekte"
- Shows: Related opportunities and projects involving this contact
- Quick stats: "3 aktive Opportunities (€ 250.000)"

**Section: Aktivitätsverlauf**
- Timeline of all activities with this contact
- Type icons: Phone, email, meeting
- Filter by type, date
- Add button: "+ Aktivität hinzufügen"

**Sidebar (Right):**
- Quick Actions:
  - "Anrufen" (phone icon)
  - "E-Mail senden" (mail icon)
  - "Aktivität hinzufügen"
- Last contact: "Vor 3 Tagen"
- Total activities: "24"

**Mobile:** Full-screen, scrollable, contact buttons prominent at top

## Implementation Notes
```bash
npx shadcn-ui@latest add card badge button avatar tabs
```


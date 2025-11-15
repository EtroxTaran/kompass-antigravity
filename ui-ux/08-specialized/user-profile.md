# User Profile Management - Figma Make Prompt

## Context & Purpose

- **Component Type**: User profile view and edit
- **User Roles**: All (own profile), GF (all profiles)
- **Usage Context**: View/edit user information, activity, performance
- **Key Features**: Avatar, contact info, role badge, activity timeline, stats

## Figma Make Prompt

Create a user profile interface for KOMPASS showing user info, role, contact details, activity timeline, performance stats, and team info with German labels.

**Profile View:**

**Header:**

- Background: Blue gradient or photo
- Avatar: Large (120px), editable (click to change)
  - Initials: "MS" if no photo
  - Status dot: Green (online), Gray (offline)
- Name: "Michael Schmidt" (32px, bold, white if on background)
- Role badge: "Außendienst (ADM)" (green, large)
- Actions: "Bearbeiten" (button, if own profile), "Nachricht senden" (if viewing others)

**Quick Contact Bar (Below Header):**

- E-Mail: "m.schmidt@kompass.de" (mail icon, clickable)
- Telefon: "+49-170-1234567" (phone icon, clickable)
- Mobil: "+49-160-9876543" (smartphone icon)
- Standort: "München" (map-pin icon)

**Tab Navigation:**

- "Übersicht" | "Aktivität" | "Statistiken" | "Team" (if PLAN/GF)

---

**Tab: Übersicht**

**Section: Über mich**

- Card with editable text (if own profile)
- Position: "Senior Außendienstmitarbeiter"
- Abteilung: "Vertrieb"
- Standort: "München, Deutschland"
- Im Team seit: "01.01.2020"
- Bio: Textarea "Verantwortlich für Kunden in München und Umgebung..."

**Section: Berechtigungen**

- Role: "Außendienst (ADM)" (green badge, large)
- Permissions summary:
  - ✅ Eigene Kunden verwalten
  - ✅ Aktivitäten erstellen
  - ✅ Opportunities verwalten
  - ❌ Finanzdaten anzeigen
  - ❌ Benutzer verwalten
- Link: "Alle Berechtigungen anzeigen" (opens RBAC details)

**Section: Kontaktpräferenzen**

- Bevorzugte Kontaktmethode: "E-Mail"
- Sprache: "Deutsch"
- Zeitzone: "Europe/Berlin (GMT+1)"
- Verfügbarkeit: "Mo-Fr, 08:00-18:00"

**Section: Meine Kunden**

- Count: "32 Kunden" (blue badge)
- Top customers (avatars or initials):
  - Hofladen Müller
  - REWE München
  - Edeka Schwabing
  - [+29 weitere]
- Link: "Alle Kunden anzeigen"

**Section: Aktuelle Opportunities**

- Count: "12 Opportunities (€ 850.000)" (amber badge)
- Top opportunities:
  - REWE München - € 125k (75%)
  - Edeka Schwabing - € 80k (60%)
  - [+10 weitere]
- Link: "Alle Opportunities anzeigen"

---

**Tab: Aktivität**

**Activity Timeline (Last 30 Days):**

- Chronological list
- Each activity:
  - Icon: Phone, email, visit, note
  - Type: "Anruf", "Besuch", "E-Mail", "Notiz"
  - Entity: "Hofladen Müller"
  - Description: "Angebot nachgefasst"
  - Timestamp: "Vor 3 Tagen"
  - Duration: "15 Minuten" (if applicable)

**Activity Filters:**

- Type: Checkboxes "Anrufe", "Besuche", "E-Mails", "Notizen"
- Date range: "Letzte 7 Tage", "Letzter Monat", "Dieses Quartal"
- Customer: Dropdown (own customers)

**Activity Summary Card:**

- Total activities: "124 Aktivitäten"
- Breakdown:
  - Anrufe: 45
  - Besuche: 32
  - E-Mails: 28
  - Notizen: 19
- Trend: "+12% vs. letzter Monat" (green, up arrow)

---

**Tab: Statistiken (Performance Metrics)**

**KPI Cards (Top Row):**

1. **Meine Kunden**
   - Count: "32"
   - Trend: "+3 diesen Monat"

2. **Opportunities**
   - Value: "€ 850.000"
   - Conversion rate: "42%"

3. **Gewonnene Deals**
   - Count: "8 dieses Quartal"
   - Value: "€ 450.000"

4. **Aktivitäten**
   - Count: "124 diesen Monat"
   - Avg per day: "4,1"

**Charts:**

**Opportunities by Stage (Funnel):**

- Stages: Neu → Qualifizierung → Angebot → Verhandlung → Gewonnen
- Values: Count and € value for each stage

**Monthly Revenue (Line Chart):**

- X-axis: Months (last 12)
- Y-axis: € value
- Line: Revenue from won opportunities
- Target line: Monthly goal

**Activities by Type (Pie Chart):**

- Segments: Anrufe (36%), Besuche (26%), E-Mails (23%), Notizen (15%)

**Customer Growth (Bar Chart):**

- X-axis: Months
- Y-axis: Count
- Bars: New customers per month

**Performance Comparison (If GF/PLAN viewing):**

- Table: Compare user with team average
- Columns: Metric, User, Team Avg, Rank
- Rows: Customers, Opportunities, Conversion Rate, Activities
- Example: "Opportunities: 12, Team Avg: 8.5, Rank: 2/5"

---

**Tab: Team (If PLAN/GF or Team Lead)**

**Section: Mein Team**

- List of team members (if team lead or manager)
- Each member:
  - Avatar + name
  - Role badge
  - Status: Online/offline
  - Quick stats: Customers, Opportunities
  - Action: "Profil anzeigen", "Nachricht senden"

**Section: Manager**

- Shows: Direct manager
- Card: Avatar, name, role, contact
- Action: "Kontaktieren"

**Section: Kollegen**

- Shows: Other ADM users (peers)
- Horizontal scrollable cards
- Each: Avatar, name, customers, opportunities

---

**Edit Profile (If Own Profile):**

**Edit Mode:**

- Triggered by: "Bearbeiten" button in header
- Inline editing: Fields become editable
- Changes: Auto-save or "Speichern" button

**Editable Fields:**

- Avatar: Click to change (upload or camera on mobile)
- Name: Input
- Position: Input
- Telefon/Mobil: Input
- Standort: Input
- Bio: Textarea (max 500 chars)
- Zeitzone: Dropdown
- Verfügbarkeit: Time range picker

**Non-Editable:**

- E-Mail (set by admin)
- Role (set by admin)
- Im Team seit (auto-calculated)

**Avatar Change:**

- Dialog: "Profilbild ändern"
- Options:
  - "Foto hochladen" (file picker)
  - "Foto aufnehmen" (camera, mobile)
  - "Von URL laden"
  - "Standardavatar verwenden" (initials)
- Preview: Shows cropped version
- Crop: Drag to adjust
- Actions: "Speichern", "Abbrechen"

---

**Public Profile (Viewing Others):**

- Shows: Limited info (no sensitive data)
- Visible:
  - Name, role, position
  - Contact info (if allowed)
  - Public activity (if allowed)
  - Team info
- Hidden:
  - Performance stats
  - Personal preferences
  - Full activity log

**Privacy Settings:**

- Toggle: "Profil für Team sichtbar" (default: ON)
- Toggle: "Aktivitäten für Team sichtbar" (default: OFF)
- Toggle: "Kontaktdaten für Team sichtbar" (default: ON)

---

**Mobile View:**

- Header: Full-width, scrollable
- Tabs: Horizontal chips (swipeable)
- Sections: Collapsible cards
- Edit: Full-screen modal

**Accessibility:**

- ARIA labels: Describe all sections
- Keyboard navigation: Tab through profile
- Screen reader: Reads all info
- High contrast: Clear visual hierarchy

## Implementation Notes

```bash
npx shadcn-ui@latest add card badge button avatar tabs
# Profile: Store in user document (CouchDB)
# Avatar: Store in cloud storage or base64
# Stats: Calculate from activity and opportunity data
```

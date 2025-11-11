# System Settings & Preferences - Figma Make Prompt

## Context & Purpose
- **Component Type**: Application settings and preferences
- **User Roles**: All (personal settings), GF (system settings)
- **Usage Context**: Configure app behavior, sync, notifications, appearance
- **Key Features**: Tabbed sections, role-specific settings, instant preview

## Figma Make Prompt

Create system settings interface for KOMPASS with tabbed sections for account, appearance, notifications, offline/sync, privacy, and system (GF only) with German labels.

**Settings Layout:**

**Header:**
- Title: "Einstellungen" (28px, bold)
- Icon: Gear/cog
- Search: "Einstellungen durchsuchen..." (search bar at top)
- Close: "X" or back arrow (top-left)

**Navigation: Tabs (Left Sidebar on Desktop, Top Tabs on Mobile):**
- Mein Konto
- Darstellung
- Benachrichtigungen
- Offline & Synchronisation
- Datenschutz & Sicherheit
- System (nur GF)
- Über KOMPASS

---

**Tab: Mein Konto**

**Section: Profil**
- Avatar: 80px, editable (click to change)
- Name: "Michael Schmidt" (editable)
- E-Mail: "m.schmidt@kompass.de" (display only)
- Rolle: "Außendienst (ADM)" (badge, not editable)
- Position: "Senior Außendienstmitarbeiter" (editable)
- Telefon: "+49-170-1234567" (editable)

**Section: Passwort ändern**
- Current password: Input (password type)
- New password: Input (password type, strength indicator)
- Confirm password: Input (password type)
- Button: "Passwort ändern" (blue)
- Requirements: "Min. 12 Zeichen, Groß-/Kleinbuchstaben, Zahl, Sonderzeichen"

**Section: Zwei-Faktor-Authentifizierung (2FA)**
- Toggle: "2FA aktivieren" (default: OFF)
- Method: Dropdown "Authentifizierungs-App (empfohlen)", "SMS", "E-Mail"
- Status: "Nicht aktiviert" (red) or "Aktiviert" (green)
- Setup: "Jetzt einrichten" button (opens QR code dialog)

**Section: Sitzungen**
- List: Active sessions
  - Current: "Diese Sitzung - Chrome, Windows" (green)
  - Other: "Mobil - iOS, iPhone 13" (blue)
  - Action: "Abmelden" button
- Link: "Alle anderen Sitzungen abmelden"

---

**Tab: Darstellung**

**Section: Thema**
- Radio buttons:
  - ◉ Hell (light theme preview)
  - ○ Dunkel (dark theme preview)
  - ○ Automatisch (system preference)
- Preview: Shows theme change instantly

**Section: Sprache**
- Dropdown: "Deutsch" (default), "English" (coming soon: grayed out)
- Note: "MVP: Nur Deutsch verfügbar"

**Section: Schriftgröße**
- Slider: "Klein" ←→ "Normal" ←→ "Groß"
- Preview text: Shows current size
- Accessibility: "Für bessere Lesbarkeit"

**Section: Kompakt-Modus**
- Toggle: "Kompakte Ansicht" (default: OFF)
- Description: "Reduzierte Abstände, mehr Inhalte auf dem Bildschirm"
- Preview: Shows compact layout

**Section: Dashboard-Konfiguration**
- Drag-and-drop: Reorder widgets
- Toggle visibility: Checkboxes for each widget
  - ☑ KPI-Karten
  - ☑ Heutige Route
  - ☑ Meine Aufgaben
  - ☐ Opportunities (diese Woche)
- Reset: "Standard wiederherstellen" button

---

**Tab: Benachrichtigungen**

**Section: Push-Benachrichtigungen**
- Toggle: "Push-Benachrichtigungen aktivieren" (default: ON)
- Permission status: "Erlaubt" (green) or "Blockiert" (red)
- Request: "Erlaubnis anfordern" button (if blocked)

**Section: Benachrichtigungs-Typen**
- Each type: Toggle + customization
  - ☑ Neue Aktivität bei meinen Kunden
    - Sound: ON
    - Badge: ON
    - Banner: ON
  - ☑ Opportunity schließt bald
    - Vorlaufzeit: Dropdown "3 Tage vorher"
  - ☑ Neue Nachricht von Team-Mitglied
  - ☑ Daten synchronisiert
  - ☐ Neue System-Updates
  - ☐ Marketing-Nachrichten

**Section: E-Mail-Benachrichtigungen**
- Toggle: "E-Mail-Benachrichtigungen" (default: ON)
- Frequency: Radio buttons
  - ◉ Sofort
  - ○ Täglich (Zusammenfassung)
  - ○ Wöchentlich
- Types: Checkboxes (same as push)

**Section: Ruhezeiten**
- Toggle: "Nicht stören" (default: OFF)
- Zeit: Time pickers "20:00 - 07:00"
- Wochentage: Checkboxes "Mo-Fr" (default: all days)

---

**Tab: Offline & Synchronisation**

**Section: Synchronisation**
- Toggle: "Automatische Synchronisation" (default: ON)
- Network: Checkboxes
  - ☑ WLAN
  - ☐ Mobilfunk
- Frequency: Dropdown "Alle 15 Minuten", "Jede Stunde", "Manuell"

**Section: Offline-Daten**
- Storage used: Progress bar "2,3 MB von 50 MB (4,6%)"
- Data types:
  - Kunden: "32 offline" (blue badge)
  - Aktivitäten: "124 offline"
  - Opportunities: "12 offline"
- Button: "Daten bereinigen" (if > 80%)
- Slider: "Offline-Zeitraum: 30 Tage"

**Section: Daten vorladen**
- Toggle: "Daten vorladen bei WLAN" (default: ON)
- Scope: Checkboxes
  - ☑ Meine Kunden
  - ☑ Meine Opportunities
  - ☐ Alle Kunden (nur GF/PLAN)

**Section: Konfliktlösung**
- Strategy: Radio buttons
  - ◉ Neueste Version bevorzugen
  - ○ Immer meine Version
  - ○ Immer Server-Version
  - ○ Immer nachfragen

---

**Tab: Datenschutz & Sicherheit**

**Section: Datenschutz**
- Link: "Datenschutzerklärung anzeigen"
- Link: "Datenverarbeitungsvertrag (AVV)"

**Section: Datenlöschung**
- Button: "Meine Daten herunterladen" (DSGVO export)
- Button: "Konto löschen" (red, requires confirmation)

**Section: Sitzungs-Timeout**
- Dropdown: "Nach 15 Minuten Inaktivität abmelden"
  - 15 Min, 30 Min, 1 Std, 2 Std, 4 Std, Nie

**Section: Biometrische Authentifizierung (Mobile)**
- Toggle: "Face ID / Touch ID" (default: OFF)
- Description: "Schneller Zugriff mit biometrischer Authentifizierung"

---

**Tab: System (nur GF)**

**Section: Benutzer-Verwaltung**
- Link: "Benutzer verwalten" (opens user management)
- Info: "5 aktive Benutzer, 2 eingeladen"

**Section: Rollen & Berechtigungen**
- Link: "RBAC-Matrix anzeigen"
- Button: "Rollen bearbeiten"

**Section: Backup & Wiederherstellung**
- Last backup: "Vor 2 Stunden"
- Frequency: "Täglich, 02:00 Uhr"
- Button: "Backup jetzt erstellen"
- Button: "Aus Backup wiederherstellen"

**Section: Audit-Log**
- Link: "Vollständigen Audit-Log anzeigen"
- Recent events: Last 5 (read-only)

**Section: GoBD-Einstellungen**
- Status: "✓ GoBD-konform" (green)
- Retention: "10 Jahre (gesetzlich vorgeschrieben)"
- Auto-finalize: Toggle "Rechnungen automatisch finalisieren nach 7 Tagen"

**Section: Integrationen**
- DATEV: "Verbunden" (green) or "Nicht verbunden" (gray)
- Button: "DATEV konfigurieren"
- n8n: "Aktiv" (green)
- Link: "n8n-Workflows verwalten"

---

**Tab: Über KOMPASS**

**Section: Version**
- Logo: KOMPASS logo (120px)
- Version: "1.0.0" (16px)
- Build: "Build 2024.11.15-1234"
- Last updated: "15.11.2024"

**Section: Lizenz**
- Type: "Enterprise"
- Expires: "31.12.2025"
- Users: "5 von 10"

**Section: Support**
- E-Mail: "support@kompass.de" (clickable)
- Telefon: "+49-89-XXXXXXX"
- Link: "Hilfe-Center öffnen"
- Link: "Feedback senden"

**Section: Rechtliches**
- Link: "Nutzungsbedingungen"
- Link: "Datenschutzerklärung"
- Link: "Impressum"

**Section: Updates**
- Button: "Nach Updates suchen"
- Status: "Ihre App ist aktuell ✓" (green)
- Or: "Update verfügbar: v1.1.0" (blue badge + "Jetzt aktualisieren" button)

---

**Save Actions:**
- Auto-save: Most settings save instantly (no button needed)
- Manual save: For complex changes (password, 2FA)
- Success toast: "Einstellungen gespeichert" (green)
- Error toast: "Fehler beim Speichern - Bitte erneut versuchen" (red)

**Search (Top):**
- Search bar: "Einstellungen durchsuchen..."
- Results: Highlights matching settings
- Example: Search "offline" → Shows "Offline & Synchronisation" tab + matching toggles

**Mobile Layout:**
- Tabs: Horizontal scrolling at top (chips)
- Sections: Collapsible (accordions)
- Save: Sticky button at bottom (if manual save needed)

**Accessibility:**
- ARIA labels: Describe all toggles and inputs
- Keyboard navigation: Tab through all settings
- Screen reader: Reads all labels and descriptions
- High contrast: Clear visual hierarchy

## Implementation Notes
```bash
npx shadcn-ui@latest add tabs toggle slider button
# Settings: Store in user profile (CouchDB)
# Theme: CSS variables, dark mode toggle
# Sync: PouchDB settings
```


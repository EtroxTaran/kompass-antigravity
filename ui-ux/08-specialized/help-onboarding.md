# Help & Onboarding - Figma Make Prompt

## Context & Purpose
- **Component Type**: First-time user onboarding and help system
- **User Roles**: All (especially new users)
- **Usage Context**: Guide new users, contextual help, feature discovery
- **Key Features**: Interactive tour, tooltips, help center, video tutorials

## Figma Make Prompt

Create help and onboarding interfaces for KOMPASS with interactive product tours, contextual tooltips, help center, video tutorials, and role-specific guides with German labels.

**First-Time Onboarding (Welcome Flow):**

**Screen 1: Welcome**
- Full-screen overlay (semi-transparent blue gradient)
- Logo: KOMPASS logo (large, 200px)
- Title: "Willkommen bei KOMPASS" (48px, bold, white)
- Subtitle: "Ihr intelligentes CRM & Projektmanagement-Tool"
- Animation: Logo fade-in, particles (optional, subtle)
- Action: "Los geht's" (large button, white)

**Screen 2: Role Introduction**
- Title: "Ihre Rolle: Außendienst (ADM)" (32px)
- Icon: Large role icon (green, 120px)
- Description: "Als Außendienstmitarbeiter können Sie:"
  - ✅ Eigene Kunden verwalten
  - ✅ Aktivitäten vor Ort erfassen
  - ✅ Opportunities tracken
  - ✅ Offline arbeiten
- Action: "Weiter" (blue button)

**Screen 3: Key Features**
- Title: "Wichtige Features für Sie"
- 4 feature cards (2x2 grid):
  1. **Offline-First**
     - Icon: WiFi-off (blue)
     - Text: "Arbeiten Sie überall, auch ohne Internet"
  2. **Spracherfassung**
     - Icon: Microphone
     - Text: "Aktivitäten per Sprache erfassen"
  3. **GPS-Navigation**
     - Icon: Map
     - Text: "Routen zu Kunden planen"
  4. **Visitenkarten-Scan**
     - Icon: Camera
     - Text: "Kontakte automatisch erfassen"
- Action: "Tour starten" (blue button) or "Überspringen" (link)

**Interactive Product Tour:**

**Tour Step 1: Dashboard**
- Spotlight: Highlights dashboard area (rest dimmed)
- Tooltip (floating card):
  - Title: "Ihr Dashboard" (20px, bold)
  - Text: "Hier sehen Sie Ihre wichtigsten Informationen auf einen Blick"
  - Arrow: Points to dashboard
  - Progress: "1 von 7"
  - Actions: "Weiter" (blue), "Tour beenden" (link)

**Tour Step 2: Kunden-Liste**
- Spotlight: Customer list
- Tooltip: "Ihre Kunden werden hier angezeigt. Als ADM sehen Sie nur Ihre eigenen Kunden."
- Interaction: Click customer to see detail (guided)
- Progress: "2 von 7"

**Tour Step 3: Aktivität hinzufügen**
- Spotlight: FAB "+" button
- Tooltip: "Mit diesem Button erfassen Sie schnell Aktivitäten - auch per Sprache!"
- Demo: Button pulses (animation)
- Progress: "3 von 7"

**Tour Step 4: Map View**
- Spotlight: Map/Route planner
- Tooltip: "Planen Sie Ihre täglichen Kundenbesuche mit GPS-Navigation"
- Progress: "4 von 7"

**Tour Step 5: Offline Mode**
- Spotlight: Sync status indicator
- Tooltip: "Arbeiten Sie offline weiter - Ihre Daten werden automatisch synchronisiert"
- Progress: "5 von 7"

**Tour Step 6: Visitenkarten-Scan**
- Spotlight: Camera icon in contact creation
- Tooltip: "Scannen Sie Visitenkarten und erfassen Sie Kontakte automatisch"
- Progress: "6 von 7"

**Tour Step 7: Hilfe**
- Spotlight: Help icon
- Tooltip: "Brauchen Sie Hilfe? Klicken Sie hier für Tutorials und Support"
- Progress: "7 von 7"
- Action: "Tour abschließen" (green button)

**Tour Complete:**
- Confetti animation (celebration)
- Title: "Tour abgeschlossen!" (32px, bold)
- Icon: Checkmark (green, large)
- Text: "Sie sind jetzt bereit, mit KOMPASS zu arbeiten!"
- Actions:
  - "Zu meinem Dashboard" (primary, blue)
  - "Hilfe-Center öffnen" (link)
  - "Tour erneut starten" (link)

---

**Contextual Tooltips:**

**Feature Discovery Tooltips:**
- Triggered by: First use of a feature
- Appearance: Small floating card with arrow
- Example: First time clicking "Aktivität hinzufügen"
  - Tooltip: "Tipp: Sie können auch per Sprache erfassen! 🎤"
  - Action: "Verstanden" (dismiss), "Mehr erfahren" (link)

**Tooltip Styles:**
- Info: Blue background, info icon
- Tip: Green background, lightbulb icon
- Warning: Amber background, alert icon
- New Feature: Purple background, sparkles icon

**Tooltip Positions:**
- Top, bottom, left, right (auto-adjusts)
- Arrow: Points to trigger element
- Dismiss: Click outside or "X" button

---

**Help Center (In-App):**

**Help Button (Persistent):**
- Location: Bottom-right corner (floating)
- Icon: Question mark in circle (blue)
- Badge: "?" (24px)
- Click: Opens help panel

**Help Panel (Slide-In from Right):**

**Header:**
- Title: "Hilfe-Center" (24px, bold)
- Search: "Wie können wir helfen?"
- Close: "X" (top-right)

**Quick Links:**
- "Erste Schritte" (rocket icon)
- "Video-Tutorials" (play icon)
- "Häufige Fragen (FAQ)" (book icon)
- "Support kontaktieren" (message icon)
- "Produkttour wiederholen" (refresh icon)

**Sections:**

**1. Erste Schritte**
- List of getting started guides:
  - "Ersten Kunden anlegen"
  - "Aktivität erfassen"
  - "Offline arbeiten"
  - "Visitenkarte scannen"
- Each: Click to open step-by-step guide

**2. Video-Tutorials**
- Grid of video thumbnails (3 columns)
- Each video:
  - Thumbnail: Preview image with play icon overlay
  - Title: "Kunden verwalten" (18px)
  - Duration: "3:45 Min"
  - Click: Opens video player (in-app or YouTube)
- Categories: "Kunden", "Aktivitäten", "Opportunities", "Offline"

**3. FAQ**
- Accordion list
- Each question:
  - Question: "Wie funktioniert Offline-Modus?"
  - Click: Expands to show answer
  - Answer: Text + optional image/video
  - Helpful: "War das hilfreich?" (thumbs up/down)

**4. Tastaturkürzel**
- Table: Shortcut keys
- Example:
  - Strg + N: "Neuer Kunde"
  - Strg + K: "Suche öffnen"
  - Strg + A: "Aktivität hinzufügen"
  - F1: "Hilfe öffnen"

**5. Dokumentation**
- Link: "Vollständige Dokumentation anzeigen" (opens external docs)

---

**Role-Specific Guides:**

**ADM Guide:**
- "Ihr erster Tag im Außendienst"
- Steps:
  1. Dashboard erkunden
  2. Kunden synchronisieren
  3. Route planen
  4. Besuch erfassen
  5. Offline arbeiten

**GF Guide:**
- "Dashboard für Geschäftsführer"
- Steps:
  1. KPIs überblicken
  2. Team-Performance prüfen
  3. Finanzberichte anzeigen
  4. Benutzer verwalten

**PLAN Guide:**
- "Projektplanung meistern"
- Steps:
  1. Projekt erstellen
  2. Team zuweisen
  3. Gantt-Chart nutzen
  4. Ressourcen planen

---

**Support Contact:**

**Support Form:**
- Subject: "Wie können wir helfen?"
- Category: Dropdown "Technisches Problem", "Feature-Anfrage", "Frage"
- Description: Textarea (required, min 20 chars)
- Attachments: File upload (screenshots)
- Priority: Radio "Normal", "Hoch", "Kritisch"
- Action: "Anfrage senden" (blue button)

**Support Channels:**
- E-Mail: "support@kompass.de" (mailto link)
- Telefon: "+49-89-XXXXXXX"
- Chat: "Live-Chat starten" (if available)

---

**What's New (Feature Announcements):**

**New Feature Banner:**
- Location: Top of dashboard (dismissible)
- Background: Purple gradient
- Icon: Sparkles ✨
- Text: "NEU: Visitenkarten-Scanner verfügbar!"
- Action: "Jetzt ausprobieren" (white button)
- Dismiss: "X" button

**Changelog (In Help Center):**
- Section: "Was ist neu?"
- List: Recent updates (last 3 months)
- Each update:
  - Date: "15.11.2024"
  - Version: "v1.1.0"
  - Title: "Visitenkarten-Scanner"
  - Description: "Erfassen Sie Kontakte jetzt noch schneller..."
  - Badge: "Neu" (purple)

---

**Mobile Help:**
- Help button: Bottom-right FAB (smaller)
- Help panel: Bottom sheet (swipeable)
- Videos: Open in native player
- Search: Voice search supported

**Accessibility:**
- ARIA labels: Describe all help elements
- Keyboard: Tab through guides, Esc to close
- Screen reader: Reads all instructions
- High contrast: Clear visual cues

**Gamification (Optional):**
- Progress tracker: "5 von 10 Features entdeckt"
- Badges: "Aktivitäts-Profi" (100 activities logged)
- Achievements: "Visitenkarten-Experte" (50 cards scanned)

## Implementation Notes
```bash
npx shadcn-ui@latest add dialog sheet accordion
# Tour: Use react-joyride or intro.js
# Tooltips: Use @radix-ui/react-tooltip
# Videos: Embed YouTube or Vimeo
# Help content: Store in markdown files or CMS
```


# Tour Detail & Execution View - Figma Make Prompt

## Context & Purpose

- **Component Type**: Detail View with Live Execution Mode
- **User Roles**: ADM (execute own), INNEN/GF (monitor all)
- **Usage Context**: Execute planned tour, track progress, log visits, handle deviations
- **Business Value**: Real-time tour tracking, visit documentation, efficiency monitoring

## Design Requirements

### Visual Hierarchy

- **Map-centric view**: Live GPS tracking with route overlay
- **Stop checklist**: Current/next stops prominently displayed
- **Quick actions**: Check-in, add note, skip stop, add unplanned stop
- **Progress indicator**: Visual tour completion status

### Layout Structure

- Split view: Map (left) + Stop details (right) on desktop
- Full-screen map with bottom sheet on mobile
- Floating progress indicator
- Emergency actions accessible

### shadcn/ui Components

- Sheet, Card, Button, Progress, Badge
- Dialog for check-in/out
- Toast for confirmations

## Figma Make Prompt

Create a comprehensive tour execution view for KOMPASS that enables real-time tour tracking, stop management, and visit documentation during active field sales tours.

**Desktop Layout (1440px) - Execution Mode:**

**Header Bar:**

```
┌─────────────────────────────────────────────────────────────────┐
│ ← München Nord Tour                    [Pause] [Route] [Beenden]│
│ 2 von 4 Stopps • 31km gefahren • 2h 15min vergangen            │
└─────────────────────────────────────────────────────────────────┘
```

**Split View Layout:**

```
┌───────────────────────────┬─────────────────────────────────────┐
│                           │ Aktueller Stopp (2/4)               │
│                           ├─────────────────────────────────────┤
│                           │ 📍 Bio-Markt Schmidt                │
│      GPS MAP VIEW         │ Dorfstraße 8, 85774 Unterföhring   │
│                           │                                     │
│   [Current location •]    │ Geplant: 10:15 - 11:00 (45 Min)    │
│                           │ Ankunft: 10:22 ✓                    │
│   [Stop 2 marker]         │                                     │
│                           │ Kontakt: Maria Schmidt              │
│   [Route overlay]         │ Tel: +49 89 12345678 [📞 Anrufen]  │
│                           │                                     │
│   [Stop 3 marker]         │ Letzter Besuch: vor 45 Tagen       │
│                           │ Notizen vom letzten Besuch:         │
│   [Stop 4 marker]         │ "Interesse an Bio-Fleisch..."       │
│                           │                                     │
│                           │ [Check-In vor Ort] (großer Button) │
│                           ├─────────────────────────────────────┤
│                           │ Nächster Stopp:                     │
│   Scale: 1:25000          │ Gartencenter Grün (12km, ~18 Min)  │
│                           │ [Route anzeigen] [Stopp überspringen]│
└───────────────────────────┴─────────────────────────────────────┘
```

**Check-In Dialog (600px × 500px):**

```
┌─────────────────────────────────────────────┐
│ Check-In: Bio-Markt Schmidt            [×] │
├─────────────────────────────────────────────┤
│ 📍 Standort bestätigt ✓                     │
│    10m Entfernung zum Ziel                  │
│                                             │
│ Ansprechpartner getroffen?                  │
│ [✓] Maria Schmidt                           │
│ [ ] Thomas Schmidt                          │
│ [ ] Andere: [_______________]               │
│                                             │
│ Kurze Notiz zum Besuch:                     │
│ [Neue Bio-Fleisch Linie besprochen,    ]   │
│ [Bestellung folgt nächste Woche.       ]   │
│ [                                      ]   │
│                                             │
│ 📷 Foto hinzufügen (optional)               │
│ [Kamera öffnen] [Aus Galerie]              │
│                                             │
│ [Abbrechen]           [Check-In bestätigen] │
└─────────────────────────────────────────────┘
```

**Mobile View (375px) - Full Screen Map:**

```
┌─────────────────────────────┐
│ [←] Tour          [⋮ Menu]  │
├─────────────────────────────┤
│                             │
│                             │
│        MAP VIEW             │
│                             │
│     [You are here •]        │
│                             │
│     [Next stop 📍]          │
│                             │
│                             │
├─────────────────────────────┤
│ ▲ Nach oben wischen         │
└─────────────────────────────┘
```

**Mobile Bottom Sheet (Pulled Up):**

```
┌─────────────────────────────┐
│ ═══════════════════         │ (Drag handle)
│                             │
│ Bio-Markt Schmidt     2/4   │
│ Dorfstraße 8, Unterföhring  │
│                             │
│ [Check-In vor Ort]          │
│                             │
│ Geplant: 10:15 - 11:00      │
│ Status: Angekommen 10:22    │
│                             │
│ 👤 Maria Schmidt            │
│ [📞 Anrufen] [💬 SMS]       │
│                             │
│ ─── Nächster Stopp ───      │
│ Gartencenter Grün           │
│ 12 km • ~18 Minuten         │
│ [Navigation starten]        │
└─────────────────────────────┘
```

**Progress Overview (Floating Widget):**

```
┌─────────────────────┐
│ Tour-Fortschritt    │
│ ████████░░░░ 50%    │
│ 2/4 Stopps • 2:15h  │
└─────────────────────┘
```

**Quick Actions Menu:**

```
┌─────────────────────────────┐
│ Schnellaktionen             │
├─────────────────────────────┤
│ 📍 Ungeplanten Stopp hinzu. │
│ ⏭️ Stopp überspringen       │
│ 📝 Notiz hinzufügen         │
│ 📸 Foto aufnehmen           │
│ ⚠️ Problem melden           │
│ 🗺️ Alternative Route        │
└─────────────────────────────┘
```

**Tour Summary (After Completion):**

```
┌─────────────────────────────────────────────┐
│ Tour abgeschlossen! ✓                       │
├─────────────────────────────────────────────┤
│ München Nord Tour - 06.02.2025              │
│                                             │
│ Zusammenfassung:                            │
│ • 4 von 4 Stopps besucht ✓                 │
│ • Gefahren: 72 km (geplant: 67 km)         │
│ • Dauer: 5h 32min (geplant: 5h 15min)      │
│ • Kosten: €45,80                            │
│                                             │
│ Abweichungen:                               │
│ • +5 km Umweg (Baustelle)                   │
│ • +17 min Verspätung                        │
│                                             │
│ Erfasste Aktivitäten:                       │
│ • 4 Check-ins                               │
│ • 3 Fotos                                   │
│ • 4 Besuchsnotizen                          │
│                                             │
│ [Zur Übersicht] [Ausgaben erfassen]         │
└─────────────────────────────────────────────┘
```

## Interaction Patterns

- **Check-in**: Automatic when arriving (GPS), manual override
- **Photo capture**: Direct camera access, auto-tagged to stop
- **Skip stop**: Requires reason selection
- **Route recalculation**: Automatic on deviation
- **Offline mode**: Cache map tiles and tour data

## German Labels & Content

- **Check-In vor Ort**: Check-in on location
- **Stopp überspringen**: Skip stop
- **Route neu berechnen**: Recalculate route
- **Ankunft**: Arrival
- **Abfahrt**: Departure
- **Ungeplanter Stopp**: Unplanned stop
- **Tour pausieren**: Pause tour

## GPS & Location Features

- **Auto check-in**: Within 50m radius of stop
- **Breadcrumb trail**: Track actual route taken
- **Speed monitoring**: Detect driving vs stopped
- **Battery optimization**: Reduce GPS frequency when stopped
- **Offline maps**: Download tour region before start

## Accessibility Requirements

- Voice guidance for navigation
- High contrast mode for driving
- Large touch targets for vehicle use
- Audio notifications for arrivals
- One-handed operation design

## Mobile Considerations

- **Car mount mode**: Simplified UI, larger buttons
- **Voice commands**: "Next stop", "Check in", "Add note"
- **Background tracking**: Continue when app minimized
- **Auto-brightness**: Adjust for outdoor visibility
- **Haptic feedback**: Vibrate on arrival

## Safety Features

- **Do not disturb**: While driving > 10 km/h
- **Voice notes**: Record while driving
- **Emergency button**: Direct call to office
- **Rest reminders**: After 2 hours driving

## Implementation Notes

```bash
# Map integration requirements
- Offline map tiles (MapBox/OpenStreetMap)
- Real-time GPS tracking
- Route optimization API
- Geofencing for auto check-in

# Background services
- Location tracking service
- Data sync queue
- Photo upload queue
- Analytics collection

# Performance
- 60 fps map panning
- < 100ms UI response
- Battery usage < 15% per hour
```

## State Management

- Tour execution state (not started/active/paused/completed)
- Current stop index and status
- GPS tracking data (positions, timestamps)
- Check-in records with photos/notes
- Offline queue for sync

## Analytics Events

- tour_started / tour_completed
- stop_checkin / stop_skipped
- photo_captured / note_added
- route_deviation (distance)
- tour_efficiency_score

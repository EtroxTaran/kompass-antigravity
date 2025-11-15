# Mileage Log Form - Figma Make Prompt

## Context & Purpose

- **Component Type**: Auto-GPS Tracking Form with Manual Entry
- **User Roles**: ADM (create own), INNEN/GF (all), BUCH (review)
- **Usage Context**: Automatic mileage tracking during tours, manual trip logging
- **Business Value**: Tax-compliant mileage reimbursement, accurate cost tracking

## Design Requirements

### Visual Hierarchy

- **GPS tracking prominent**: Start/stop button central
- **Auto-fill from tour**: Pre-populate route data
- **Manual override**: Easy editing for corrections
- **Route visualization**: Map preview of driven route

### Form Structure

- Quick start/stop for GPS tracking
- Route summary with map
- Purpose and customer association
- Manual entry option
- Submission for reimbursement

### shadcn/ui Components

- Card, Form, Button, Input, Toggle
- Map component for route display
- Progress indicator for active tracking
- Switch for business/private

## Figma Make Prompt

Create a mileage tracking form for KOMPASS that combines automatic GPS tracking with manual entry options for tax-compliant mileage documentation.

**Mobile Layout (375px) - GPS Tracking Mode:**

```
┌─────────────────────────────┐
│ [←] Fahrtenbuch             │
├─────────────────────────────┤
│                             │
│     AKTUELLE FAHRT          │
│                             │
│    ┌─────────────────┐      │
│    │                 │      │
│    │   [GPS Icon]    │      │
│    │     LÄUFT       │      │
│    │                 │      │
│    │    42,7 km      │      │
│    │   00:38:15      │      │
│    │                 │      │
│    └─────────────────┘      │
│                             │
│  [⏸️ Pause] [⏹️ Beenden]     │
│                             │
│ ─── Route ───               │
│ Start: Büro (08:45)         │
│ Aktuell: A9 Richtung Nord   │
│ Geschwindigkeit: 82 km/h    │
│                             │
│ ─── Zweck ───               │
│ [Tour: München Nord ▼]      │
│                             │
└─────────────────────────────┘
```

**Mobile - Trip Summary (After Stop):**

```
┌─────────────────────────────┐
│ [←] Fahrt abgeschlossen     │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │                         │ │
│ │    [Route Map]          │ │
│ │                         │ │
│ │  Start •——————• Ende    │ │
│ │                         │ │
│ └─────────────────────────┘ │
│                             │
│ Zusammenfassung             │
│ ┌─────────────────────────┐ │
│ │ Strecke: 67,3 km        │ │
│ │ Dauer: 1:12 Std.        │ │
│ │ ⌀ 56 km/h               │ │
│ └─────────────────────────┘ │
│                             │
│ Von: Büro, München          │
│ [08:45 Uhr]                 │
│                             │
│ Nach: Hofladen Müller       │
│ [09:57 Uhr]                 │
│                             │
│ Zweck der Fahrt *           │
│ [Kundenbesuch - Tour ▼]     │
│                             │
│ ☑ Geschäftlich              │
│ ☐ Privat                    │
│                             │
│ [Verwerfen] [Speichern]     │
└─────────────────────────────┘
```

**Manual Entry Form (Mobile):**

```
┌─────────────────────────────┐
│ [←] Manuelle Fahrt          │
├─────────────────────────────┤
│                             │
│ Datum *                     │
│ [06.02.2025 📅]             │
│                             │
│ Start                       │
│ [Büro München ▼]            │
│ oder                        │
│ [Adresse eingeben...]       │
│                             │
│ Ziel                        │
│ [🔍 Kunde suchen...]        │
│ oder                        │
│ [Adresse eingeben...]       │
│                             │
│ Kilometer *                 │
│ [___] km                    │
│                             │
│ Zweck der Fahrt *           │
│ [Kundenbesuch ▼]            │
│                             │
│ Kunde/Projekt               │
│ [Hofladen Müller ▼]         │
│                             │
│ ☑ Geschäftlich              │
│                             │
│ [Speichern]                 │
└─────────────────────────────┘
```

**Desktop Layout (800px × 600px):**

```
┌─────────────────────────────────────────────────┐
│ Neue Fahrt erfassen                        [×] │
├─────────────────────────────────────────────────┤
│                                                 │
│ [GPS-Tracking] [Manuelle Eingabe]               │
│                                                 │
│ ─── Fahrtdetails ───                            │
│ ┌──────────────────┬───────────────────────┐   │
│ │ Datum *          │ Fahrer                │   │
│ │ [06.02.2025]     │ [Michael Schmidt ▼]   │   │
│ ├──────────────────┴───────────────────────┤   │
│ │ Start                                    │   │
│ │ [Büro - Leopoldstr. 15, München ▼]      │   │
│ │ Abfahrt: [08:45] Uhr  KM: [15.234]      │   │
│ ├──────────────────────────────────────────┤   │
│ │ Ziel                                     │   │
│ │ [Hofladen Müller - Hauptstr. 15... ▼]   │   │
│ │ Ankunft: [09:57] Uhr  KM: [15.301]      │   │
│ └──────────────────────────────────────────┘   │
│                                                 │
│ Berechnete Strecke: 67 km                      │
│ [Route auf Karte anzeigen]                      │
│                                                 │
│ ─── Zuordnung ───                               │
│ ┌──────────────────┬───────────────────────┐   │
│ │ Zweck *          │ Fahrttyp *            │   │
│ │ [Kundenbesuch ▼] │ ☑ Geschäftlich        │   │
│ │                  │ ☐ Privat              │   │
│ ├──────────────────┼───────────────────────┤   │
│ │ Tour/Projekt     │ Kunde                 │   │
│ │ [München Nord ▼] │ [Hofladen Müller ▼]   │   │
│ └──────────────────┴───────────────────────┘   │
│                                                 │
│ Notiz                                           │
│ [Rückweg über A9 wegen Baustelle]              │
│                                                 │
│ [Abbrechen]                        [Speichern]  │
└─────────────────────────────────────────────────┘
```

**Quick Location Favorites:**

```
Häufige Orte:
🏢 Büro (Firmensitz)
🏠 Home Office
🏪 Hofladen Müller
🏗️ Baustelle Projekt X
➕ Neuer Ort speichern
```

**GPS Tracking Features:**

- **Auto-pause**: When stopped > 5 minutes
- **Battery saver**: Reduce GPS frequency on highway
- **Privacy mode**: No tracking during breaks
- **Route optimization**: Suggest better route
- **Speed warnings**: Alert if >130 km/h

**Purpose Categories:**

- Kundenbesuch (Customer visit)
- Projektbesichtigung (Project site)
- Messe/Event (Trade fair)
- Schulung (Training)
- Behördengang (Authority visit)
- Sonstiges (Other)

## Interaction Patterns

- **One-tap start**: Big GPS button
- **Auto-detect stops**: Based on speed/location
- **Quick favorites**: Common locations
- **Swipe to confirm**: Accept suggested route
- **Voice notes**: While driving

## German Labels & Content

- **Fahrtenbuch**: Mileage log
- **Geschäftlich**: Business
- **Privat**: Private
- **Abfahrt/Ankunft**: Departure/Arrival
- **Kilometerstand**: Odometer reading
- **Zweck der Fahrt**: Trip purpose
- **Strecke**: Distance/Route

## Tax Compliance Features

- **1% method support**: Track private use
- **Odometer tracking**: Start/end readings
- **Complete documentation**: All tax-required fields
- **Export formats**: DATEV, Excel, PDF
- **Audit trail**: No retroactive editing

## Accessibility Requirements

- Voice control for start/stop
- High contrast for driving mode
- Audio announcements
- Large touch targets
- One-handed operation

## Mobile Considerations

- **Background GPS**: Continue tracking when minimized
- **Offline support**: Store trips locally
- **Auto-upload**: When WiFi available
- **Battery indicator**: Show impact
- **CarPlay/Android Auto**: Basic controls

## Validation Rules

- Start/end locations required
- Distance must be > 0
- Business purpose required for business trips
- Odometer end > odometer start
- No future dates

## Implementation Notes

```bash
# GPS Integration
- Foreground service for tracking
- Geofencing for auto-start
- Route simplification algorithm
- Battery optimization

# Data Storage
- Local SQLite for offline
- Sync queue for server
- Compressed route data
- Photo of odometer support

# Privacy
- Location data encrypted
- Auto-delete after tax period
- GDPR compliant
- User consent required
```

## State Management

- Tracking state (idle/active/paused)
- Current location and speed
- Route polyline data
- Trip summary
- Sync status

## Analytics Events

- tracking_started / tracking_stopped
- manual_entry_created
- route_distance_delta (GPS vs manual)
- purpose_distribution
- average_speed_by_route_type

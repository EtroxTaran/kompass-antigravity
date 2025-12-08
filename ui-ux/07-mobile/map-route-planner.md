# Map & Route Planner (Mobile) - Figma Make Prompt

## Context & Purpose

- **Platform**: Mobile PWA (GPS required)
- **User Role**: ADM (Sales Field)
- **Usage Context**: Plan daily customer visits, navigate to locations
- **Key Features**: GPS tracking, multi-stop routing, turn-by-turn navigation

## Figma Make Prompt

Create a mobile map and route planner for KOMPASS ADM users with GPS tracking, multi-stop routing, customer markers, and navigation integration with German labels.

**Main View: Map (Full Screen)**

- Full-screen interactive map (Google Maps or Leaflet)
- Map style: Hybrid (satellite + roads) or Standard
- Current location: Blue dot (pulsing)
- Compass: Top-right corner
- Zoom controls: + / - buttons (floating, right side)

**Customer Markers:**

- Icon: Building icon or custom pin
- Color: Blue (not visited today), Green (visited), Red (overdue visit)
- Size: 32px (touch-friendly)
- Cluster: If many markers close together, show count badge
- Tap marker: Opens customer info card (bottom sheet)

**Customer Info Card (Bottom Sheet - Peek):**

- Company name: "Hofladen Müller GmbH" (18px, bold)
- Address: "Industriestraße 42, München"
- Distance: "8 km entfernt" (from current location)
- Last visit: "Vor 7 Tagen"
- Next appointment: "Heute 10:00" (if scheduled)
- Actions:
  - "Route planen" (blue button, large)
  - "Anrufen" (phone icon)
  - "Details anzeigen" (link)
- Swipe up: Full customer quick view

**Route Planning Mode:**

- Activated by: Tapping "Route planen" or "Mehrere Stopps"
- Shows: Multi-stop route builder

**Multi-Stop Route Builder:**

- List of stops (draggable to reorder):
  1. "Start: Aktueller Standort" (blue dot icon)
  2. "Hofladen Müller" (8 km, 10:00 Termin)
  3. "REWE München" (12 km, 14:00 Termin)
  4. "Kunde X" (5 km, 16:00 Termin)
- Add stop: "+ Stopp hinzufügen" button
- Remove stop: Swipe left on item
- Reorder: Long-press and drag

**Route Info Card:**

- Total distance: "35 km"
- Total time: "1 Std 20 Min" (estimated)
- Stops: "3 Kunden"
- Route line: Blue polyline on map connecting all stops
- Optimize button: "Route optimieren" (reorders for shortest path)

**Actions (Bottom):**

- "Navigation starten" (large blue button)
- "Route teilen" (link, opens share sheet)
- "Route speichern" (bookmark icon)

**Navigation Mode:**

- Triggered by: "Navigation starten"
- Integrations:
  - Opens Google Maps (Android)
  - Opens Apple Maps (iOS)
  - Or: In-app navigation (if available)
- Passes: First stop address
- After first stop: Prompt "Nächster Stopp: REWE München?"

**Today's Route View:**

- Toggle: "Heutige Route" (top-left button)
- Shows: Scheduled customer visits for today
- Timeline:
  - 10:00 - Hofladen Müller (Industriestr. 42) - "8 km" - Status: "Anstehend"
  - 14:00 - REWE München (Hauptstr. 15) - "12 km" - Status: "Anstehend"
- Visual: Route drawn on map
- Progress: "1 von 3 Besuche abgeschlossen"

**Check-In Feature:**

- At customer location (GPS detected)
- Notification: "Sie sind bei Hofladen Müller - Check-in?"
- Tap: Opens quick activity log
- Auto-log: "Besuch bei Hofladen Müller" with timestamp and GPS

**Nearby Customers:**

- Filter button: "In der Nähe" (top bar)
- Shows: Customers within 5 km radius
- Sorted by distance
- List view (alternative to map)

**Filters (Top Bar):**

- "Alle Kunden" (default)
- "Heute geplant" (blue badge with count)
- "Überfällige Besuche" (red badge with count)
- "Opportunities" (amber badge)
- Custom filter: Date range, status

**Search (Top Bar):**

- Search icon: Tap to open search input
- Type: Customer name or address
- Results: Zooms map to customer location
- Clear: "X" button

**Layers (Bottom-Right Menu):**

- Toggle layers:
  - "Kunden" (customer markers)
  - "Standorte" (location markers)
  - "Heutige Route" (route line)
  - "Verkehr" (traffic overlay)
  - "Satellit" (satellite view)

**Offline Support:**

- Map tiles: Cached for offline (limited area)
- Customer locations: Cached
- Navigation: Requires online
- Indicator: "Offline - Navigation nicht verfügbar"

**Location Permissions:**

- On first use: Request location permission
- Denied: Show message "Standort erforderlich für Navigation"
- Always: Use "Always allow" for background tracking

**Background Tracking (Optional):**

- Track route in background
- Log visits automatically
- Battery warning: "Hintergrund-Tracking nutzt mehr Akku"

**Mobile Optimizations:**

- Touch gestures: Pinch to zoom, pan, rotate
- One-hand operation: Controls bottom/top
- Large buttons: 44px minimum
- Fast map load: < 2 seconds
- Smooth animations: 60 fps

**Accessibility:**

- ARIA labels for all map controls
- Voice-over: Describes map features
- High contrast mode
- Text-to-speech for navigation (if in-app)

**Example Flow:**

1. User opens map view
2. Map shows current location (blue dot)
3. Customer markers visible (5 nearby)
4. User taps "Heutige Route" button
5. Map shows 3 scheduled visits with route line
6. User taps first stop marker: "Hofladen Müller"
7. Info card slides up: Name, address, distance, actions
8. User taps "Navigation starten"
9. Google Maps opens with directions
10. User arrives, GPS detected
11. Notification: "Check-in bei Hofladen Müller?"
12. User taps "Ja" → Opens quick activity log

## Implementation Notes: Google Maps Integration

-   **Component**: `GoogleMapsView.tsx`
-   **API Key Handling**:
    -   Securely loaded from `import.meta.env.VITE_GOOGLE_MAPS_API_KEY`
    -   Fallback to `localStorage` for user-provided keys (enables local testing without rebuilds)
    -   Input UI provided if key is missing
-   **Visuals**:
    -   **Markers**:
        -   Red Dot: `status === 'overdue'`
        -   Yellow Dot: `hasOpportunity === true`
        -   Blue Dot: Default state
    -   **Routes**: Blue polyline with 80% opacity connecting stops
    -   **User Location**: Blue pulsing circle
-   **Dependencies**:
    -   `@react-google-maps/api`
    -   `lucide-react` (icons)


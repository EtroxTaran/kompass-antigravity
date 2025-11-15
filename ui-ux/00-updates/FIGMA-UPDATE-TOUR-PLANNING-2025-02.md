# Figma Make: Tour Planning Integration Update

**Purpose:** Add tour planning capabilities to existing KOMPASS designs, including GPS location fields, tour widgets, and hotel ratings
**Action:** Update existing forms and dashboards with tour planning features
**Date:** 2025-02-06

---

## 🎯 MASTER PROMPT FOR FIGMA MAKE

**Copy everything below this line and paste into Figma Make:**

---

Update the KOMPASS design system to integrate comprehensive tour planning features across customer forms, location forms, and dashboards. Add GPS coordinate fields to locations, tour planning sections to customer forms, new tour widgets to dashboards, and hotel-specific fields.

## DESIGN SPECIFICATION: Location Form Updates

### GPS Coordinates Addition

**FIND in Location Form:**

- Section with "Lieferadresse" fields
- After country field

**ADD NEW FIELDS:**

```
GPS-Koordinaten (optional)
┌────────────────────┬────────────────────┐
│ Breitengrad        │ Längengrad         │
│ [48.1351253______] │ [11.5819805______] │
│ Beispiel: 48.1351  │ Beispiel: 11.5819  │
└────────────────────┴────────────────────┘

[📍 Standort ermitteln]  [🗺️ Auf Karte zeigen]
```

**Specifications:**

- Field width: 50% each (with 16px gap)
- Input height: 48px
- Label: Inter 14px medium (#374151)
- Helper text: Inter 12px regular (#9CA3AF)
- Buttons: Ghost variant, 36px height
- Icon size: 20px
- GPS format validation: Decimal degrees (e.g., 48.1351253)

### Hotel Rating Field (Conditional)

**FIND in Location Form:**

- After "isActive" toggle field

**ADD CONDITIONAL FIELD:**

```
Wenn locationType = "hotel":

Hotel-Bewertung
[⭐⭐⭐⭐☆] 4 von 5 Sternen
[Bewertung ändern ▼]
```

**Specifications:**

- Show only when locationType = "hotel"
- Star rating: 24px stars, #F59E0B (filled), #E5E7EB (empty)
- Dropdown contains: 1-5 star options
- Label spacing: 8px from stars

---

## DESIGN SPECIFICATION: Customer Form Updates

### Tour Planning Section

**FIND in Customer Form:**

- After "Kontaktpersonen" section
- Before form action buttons

**ADD NEW SECTION:**

```
┌─────────────────────────────────────────────┐
│ Tourenplanung                               │
├─────────────────────────────────────────────┤
│                                             │
│ Bevorzugter Besuchstag                      │
│ [Beliebig ▼]                                │
│ • Montag • Dienstag • Mittwoch • Donnerstag │
│ • Freitag • Beliebig                        │
│                                             │
│ Bevorzugte Besuchszeit                      │
│ [Vormittags (8-12 Uhr) ▼]                   │
│ • Vormittags (8-12 Uhr)                     │
│ • Nachmittags (12-17 Uhr)                   │
│ • Ganztägig • Flexibel                      │
│                                             │
│ Besuchsfrequenz                             │
│ [Monatlich ▼]                               │
│ • Wöchentlich • 14-tägig • Monatlich        │
│ • Quartalsweise • Nach Bedarf               │
│                                             │
│ ☑ In Routenoptimierung einbeziehen          │
│                                             │
│ Letzte Tour                                 │
│ 📍 München Nord Tour - 15.01.2025            │
│ Nächste geplant: 12.02.2025                 │
└─────────────────────────────────────────────┘
```

**Specifications:**

- Section card: Same style as other form sections
- Dropdown height: 48px
- Checkbox: Standard shadcn/ui checkbox
- Info text: Inter 14px regular (#6B7280)
- Link style: #3B82F6, underline on hover

---

## DESIGN SPECIFICATION: Dashboard Tour Widget

### GF Dashboard - Tour Overview Widget

**FIND in GF Dashboard:**

- In the metrics grid area
- Add as new widget

**ADD NEW WIDGET:**

```
┌─────────────────────────────────────────────┐
│ Toureneffizienz diese Woche                 │
├─────────────────────────────────────────────┤
│                                             │
│ ┌─────┬─────┬─────┬─────┬─────┐           │
│ │ Mo  │ Di  │ Mi  │ Do  │ Fr  │           │
│ │ 4.2 │ 3.8 │ 4.5 │ 4.1 │ -   │           │
│ │ ↑12%│ ↓5% │ ↑8% │ →0% │     │           │
│ └─────┴─────┴─────┴─────┴─────┘           │
│                                             │
│ Ø Stopps pro Tour: 4.2                      │
│ Gesamtstrecke: 1.247 km                     │
│ Kraftstoffkosten: €623,50                   │
│                                             │
│ [Details anzeigen →]                         │
└─────────────────────────────────────────────┘
```

**Specifications:**

- Widget size: 400px × 280px
- Day cells: 64px wide, centered values
- Metric text: Inter 24px semibold
- Percentage: Inter 12px, green (#10B981) up, red (#EF4444) down
- Summary text: Inter 14px regular
- Bottom padding: 20px

### ADM Dashboard - Route Widget

**FIND in ADM Dashboard:**

- Below task widgets
- Above activity feed

**ADD NEW WIDGET:**

```
┌─────────────────────────────────────────────┐
│ Heutige Tour                                │
├─────────────────────────────────────────────┤
│                                             │
│ München Nord Route                          │
│ 4 Stopps • 67 km • ~5 Std.                 │
│                                             │
│ Nächster Stopp:                             │
│ 📍 Hofladen Müller (10:15 Uhr)              │
│ 12 km entfernt • Navigation starten         │
│                                             │
│ ████████████░░░░░ 2 von 4 erledigt          │
│                                             │
│ [Tour-Details] [Route anpassen]             │
└─────────────────────────────────────────────┘
```

**Specifications:**

- Widget width: Full width on mobile, 400px on desktop
- Progress bar: 8px height, primary blue (#3B82F6)
- Route name: Inter 18px semibold
- Distance/time: Inter 14px regular (#6B7280)
- Action buttons: Ghost variant, side by side

---

## FIND AND REPLACE: Form Field Updates

### Location Form Fields

**FIND:**

- Country field in address section

**REPLACE WITH:**

- Country field
- GPS coordinates fields (as specified above)
- Conditional hotel rating (if locationType = "hotel")

### Customer Form Sections

**FIND:**

- Space after "Kontaktpersonen" section

**REPLACE WITH:**

- Tour planning section (as specified above)

---

## VALIDATION UPDATES

### GPS Coordinate Validation

**Pattern**: `-?[0-9]{1,3}\.?[0-9]{0,7}`

- Latitude: -90 to 90
- Longitude: -180 to 180
- Decimal degrees format
- Optional negative sign
- Up to 7 decimal places

### Tour Planning Validations

- Preferred day: Optional, default "Beliebig"
- Preferred time: Optional, default "Flexibel"
- Visit frequency: Optional, default "Nach Bedarf"
- Route optimization: Boolean, default true

---

## MOBILE RESPONSIVENESS

### Location Form Mobile (375px)

**GPS fields stack vertically:**

```
Breitengrad
[48.1351253_______________]

Längengrad
[11.5819805_______________]

[📍 Standort] [🗺️ Karte]
```

### Customer Form Mobile (375px)

**Tour planning dropdowns:**

- Full width
- Stack vertically
- 16px spacing between fields

### Dashboard Widgets Mobile

**Tour widgets:**

- Full width (padding: 16px)
- Efficiency chart: Scroll horizontally if needed
- Route widget: Condense text, maintain hierarchy

---

## COLOR & STYLING CONSISTENCY

Use existing design system:

- Primary: #3B82F6
- Success: #10B981
- Warning: #F59E0B
- Error: #EF4444
- Gray scale: #F9FAFB to #111827

---

## QUALITY CHECKLIST

After applying this prompt, verify:

- [ ] GPS coordinate fields appear in all location forms
- [ ] GPS format validation shows proper helper text
- [ ] Hotel rating shows ONLY when locationType = "hotel"
- [ ] Tour planning section added to customer form
- [ ] All dropdowns have correct options in German
- [ ] Dashboard widgets properly sized and positioned
- [ ] Mobile layouts stack fields correctly
- [ ] Progress bars use correct color (#3B82F6)
- [ ] All text is in German with proper labels
- [ ] Icons are consistent size (20px in buttons, 16px inline)

---

**Total Files Updated:** 5
**Forms Updated:** 2 (Location, Customer)
**Dashboards Updated:** 2 (GF, ADM)
**New Widgets:** 2

---

END OF PROMPT

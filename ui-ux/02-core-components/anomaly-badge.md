# Anomaly Badge - Figma Make Prompt

## Context & Purpose
- **Component Type**: AI anomaly detection indicator badge
- **User Roles**: All users (contextual warnings)
- **Usage Context**: Highlight unusual patterns, outliers, and deviations in data
- **Business Value**: Early warning system, prevent issues, maintain quality

## Design Requirements

### Visual Hierarchy
- **Non-intrusive**: Small badge that doesn't disrupt layout
- **Attention-grabbing**: Clear visual indicator when anomaly detected
- **Informative**: Shows severity and type at a glance
- **Expandable**: More details on hover/tap

### Badge Types
- Warning (amber) - Minor deviation
- Alert (red) - Significant anomaly
- Info (blue) - Neutral observation
- Success (green) - Positive anomaly

### shadcn/ui Components
- Badge base component
- Tooltip for details
- Popover for expanded info
- Custom pulse animation

## Figma Make Prompt

Create anomaly detection badge components for KOMPASS that indicate when AI detects unusual patterns in data with appropriate severity levels and contextual information.

**Base Anomaly Badge Structure:**

```
Standard Badge:
[⚡ Anomalie]

With Count:
[⚡ 3 Anomalien]

With Severity:
[🔴 Kritisch]

Inline with Text:
Projektkosten: €45.000 [⚡+35%]
```

**Severity Levels:**

### 1. Info Badge (Neutral Observation)
```
[ℹ️ Muster]
```
- Background: #EFF6FF (blue-50)
- Border: 1px solid #3B82F6
- Text: #1E40AF (blue-800)
- Icon: Info circle, static
- Use: Interesting patterns, not concerning

### 2. Warning Badge (Minor Anomaly)
```
[⚠️ Abweichung]
```
- Background: #FEF3C7 (amber-100)
- Border: 1px solid #F59E0B
- Text: #92400E (amber-800)
- Icon: Warning triangle, subtle pulse
- Use: 15-30% deviation from normal

### 3. Alert Badge (Significant Anomaly)
```
[🔴 Anomalie]
```
- Background: #FEE2E2 (red-100)
- Border: 1px solid #EF4444
- Text: #991B1B (red-800)
- Icon: Alert circle, gentle pulse
- Use: >30% deviation or critical metrics

### 4. Success Badge (Positive Anomaly)
```
[✨ Besser]
```
- Background: #D1FAE5 (green-100)
- Border: 1px solid #10B981
- Text: #166534 (green-800)
- Icon: Sparkles, no animation
- Use: Positive outliers, improvements

**Inline Variations:**

### In Table Cell
```
┌─────────────────────────────────┐
│ Kunde      | Umsatz  | Status   │
├─────────────────────────────────┤
│ REWE       | €125k   | [⚠️+45%] │
│ Hofladen   | €23k    | Normal   │
│ Baumarkt   | €89k    | [✨+15%] │
└─────────────────────────────────┘
```

### With Metric
```
Conversion Rate: 73% [🔴-25%]
                     ↑
              Anomaly indicator
```

### In Card Header
```
┌─────────────────────────────────┐
│ Projekt Phoenix [⚠️ 2]          │
├─────────────────────────────────┤
│ Budget: €45,000                 │
│ Fortschritt: 65%                │
└─────────────────────────────────┘
```

**Expandable Details (Hover/Tap):**

```
On hover/tap:
┌─────────────────────────────────┐
│ ⚠️ Kosten-Anomalie erkannt      │
├─────────────────────────────────┤
│ +35% über Durchschnitt          │
│                                 │
│ Normal: €12,000                 │
│ Aktuell: €16,200                │
│                                 │
│ Mögliche Ursachen:              │
│ • Materialpreise gestiegen      │
│ • Zusätzliche Anforderungen     │
│                                 │
│ [Details] [Ignorieren]          │
└─────────────────────────────────┘
```

**Mobile Behavior:**

```
Tap to expand:
┌─────────────────────────────┐
│ Kosten: €45k [⚠️]           │
└─────────────────────────────┘
         ↓ tap
┌─────────────────────────────┐
│ Kosten: €45k                │
│ ⚠️ 35% über normal           │
│ [Mehr erfahren →]           │
└─────────────────────────────┘
```

**Animation Patterns:**

### Pulse Animation (Alerts only)
```css
@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
}

.anomaly-alert {
  animation: pulse 2s ease-in-out infinite;
}
```

### Entry Animation
- Scale from 0.8 → 1
- Fade in
- Duration: 200ms
- Only on first appearance

**Grouped Anomalies:**

```
Multiple anomalies in one area:
┌─────────────────────────────────┐
│ [⚠️ 3 Anomalien gefunden]       │
│                                 │
│ Klicken für Details ↓           │
└─────────────────────────────────┘
```

**Complex Integration Example:**

```
Dashboard Widget:
┌─────────────────────────────────┐
│ Projektkosten diese Woche       │
│                                 │
│ €45,250 [⚠️ 2] [✨ 1]           │
│ ↑15% vs. letzte Woche           │
│                                 │
│ Details:                        │
│ • Material +35% [⚠️]            │
│ • Personal -12% [✨]            │
│ • Reisen +125% [⚠️]            │
└─────────────────────────────────┘
```

## States & Interactions

### Default State
- Static display
- Subtle shadow
- Clear but not distracting

### Hover State
- Slight scale (1.05)
- Stronger shadow
- Tooltip appears after 500ms
- Cursor: pointer if expandable

### Active/Pressed
- Scale (0.95)
- Reduced shadow
- Immediate feedback

### Disabled
- Opacity: 0.5
- No interactions
- Used when data is stale

## Accessibility

### Screen Reader
```html
<span role="status" aria-label="Warnung: Kosten 35 Prozent über normal">
  <span aria-hidden="true">⚠️ +35%</span>
</span>
```

### Color Independence
- Always include text/percentage
- Icon shape differs by type
- Pattern overlay for critical (optional)

### Keyboard Support
- Focusable if interactive
- Enter/Space to expand details
- Escape to close popover

## Integration Guidelines

### Placement Rules
1. **Right-aligned** in tables/lists
2. **After value** in metrics
3. **Header corner** for section-level
4. **Inline** with related text
5. **Grouped** when multiple

### Context Requirements
- Always show the normal/expected value
- Include the actual value
- Explain the deviation percentage
- Suggest possible causes (if known)
- Provide actionable next steps

### Update Frequency
- Real-time for critical metrics
- Hourly for standard monitoring
- Daily for trend analysis
- Configurable per metric type

## German Labels
- **Anomalie**: Anomaly
- **Abweichung**: Deviation
- **Muster**: Pattern
- **Kritisch**: Critical
- **Normal**: Normal
- **Über/Unter Durchschnitt**: Above/Below average
- **Mögliche Ursachen**: Possible causes

## Performance Considerations
- Batch anomaly detection
- Cache detection results
- Throttle updates (max 1/second)
- Lazy load detailed explanations
- Use CSS animations (GPU)

## Do's and Don'ts

### ✅ DO's
- Provide context for anomalies
- Use appropriate severity levels
- Allow users to dismiss/acknowledge
- Show trends when relevant
- Group related anomalies

### ❌ DON'T's
- Don't overwhelm with badges
- Don't use for normal variations
- Don't animate excessively
- Don't hide important context
- Don't trigger for < 10% deviations

## Configuration Options

```typescript
interface AnomalyBadgeConfig {
  threshold: {
    info: 0.10,    // 10% deviation
    warning: 0.15, // 15% deviation  
    alert: 0.30    // 30% deviation
  },
  showPercentage: boolean,
  allowDismiss: boolean,
  groupNearby: boolean,
  animateAlerts: boolean
}
```

## Analytics Events
- anomaly_detected (type, severity, metric)
- anomaly_expanded (badge_location)
- anomaly_dismissed (reason)
- anomaly_action_taken (action_type)
- false_positive_reported

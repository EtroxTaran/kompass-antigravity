# AI Insight Card - Figma Make Prompt

## Context & Purpose

- **Component Type**: AI-powered suggestion display component
- **User Roles**: All users (context-aware insights)
- **Usage Context**: Display AI-generated recommendations, predictions, and actionable insights
- **Business Value**: Proactive guidance, improved decision-making, efficiency gains

## Design Requirements

### Visual Hierarchy

- **Clear AI indicator**: Purple accent color and icon
- **Actionable content**: Primary action prominent
- **Confidence display**: Show AI certainty level
- **Dismissible**: Allow users to hide/acknowledge

### Card Variants

- Suggestion (recommendations)
- Prediction (forecasts)
- Alert (anomalies)
- Tip (optimization ideas)

### shadcn/ui Components

- Card, Button, Badge, Progress
- Custom AI icon/animation
- Dismissible wrapper

## Figma Make Prompt

Create AI insight card components for KOMPASS that display intelligent suggestions, predictions, and alerts with clear actions and confidence indicators.

**Base AI Insight Card Structure:**

```
┌─────────────────────────────────────────────┐
│ [Icon] Title                            [×] │
├─────────────────────────────────────────────┤
│                                             │
│ Main insight text with key metric           │
│ highlighted or important information        │
│                                             │
│ Supporting details or reasoning             │
│                                             │
│ Confidence: ████████░░ 85%                  │
│                                             │
│ [Secondary Action] [Primary Action]         │
└─────────────────────────────────────────────┘
```

**Variant 1: Suggestion Card**

```
┌─────────────────────────────────────────────┐
│ 💡 KI-Empfehlung                        [×] │
├─────────────────────────────────────────────┤
│                                             │
│ Route optimieren spart 45 Minuten          │
│                                             │
│ Neue Reihenfolge: Kunde B → A → C          │
│ statt A → B → C                            │
│                                             │
│ Vertrauen: ████████░░ 92%                   │
│                                             │
│ [Details] [Route optimieren]                │
└─────────────────────────────────────────────┘
```

**Specifications:**

- Background: Light purple (#F3E8FF)
- Border: 1px solid #9333EA20
- Icon: 20px, purple (#9333EA)
- Title: Inter 14px semibold
- Metric: Inter 18px bold, purple
- Confidence bar: 4px height, purple gradient

**Variant 2: Prediction Card**

```
┌─────────────────────────────────────────────┐
│ 🔮 Umsatzprognose                       [×] │
├─────────────────────────────────────────────┤
│                                             │
│ €125.000 erwarteter Abschluss diese Woche  │
│                                             │
│ Basierend auf:                              │
│ • 3 Opportunities in Endphase              │
│ • Historische Abschlussrate: 73%           │
│                                             │
│ Sicherheit: ████████░░ 78%                  │
│                                             │
│ [Opportunities ansehen] [Forecast-Details]  │
└─────────────────────────────────────────────┘
```

**Variant 3: Alert Card**

```
┌─────────────────────────────────────────────┐
│ ⚠️ Anomalie erkannt                     [×] │
├─────────────────────────────────────────────┤
│                                             │
│ Projektkosten 35% über Durchschnitt        │
│                                             │
│ Projekt: Website Relaunch                   │
│ Bereich: Externe Dienstleistungen          │
│ Normal: €12.000 | Aktuell: €16.200         │
│                                             │
│ Dringlichkeit: ████████░░ Hoch              │
│                                             │
│ [Ignorieren] [Kosten analysieren]           │
└─────────────────────────────────────────────┘
```

**Specifications:**

- Background: Light amber (#FEF3C7) for warnings
- Border: 1px solid #F59E0B40
- Icon animation: Subtle pulse for alerts
- Urgency bar: Red to green gradient

**Variant 4: Optimization Tip**

```
┌─────────────────────────────────────────────┐
│ ✨ Optimierungspotenzial                [×] │
├─────────────────────────────────────────────┤
│                                             │
│ 15% Zeitersparnis durch Aufgaben-         │
│ gruppierung möglich                        │
│                                             │
│ • 3 Kundenbesuche im selben Gebiet        │
│ • 2 ähnliche Kalkulationen                 │
│                                             │
│ Aufwand: ████░░░░░░ Gering                  │
│                                             │
│ [Später] [Jetzt optimieren]                │
└─────────────────────────────────────────────┘
```

**Mobile Card (375px):**

```
┌─────────────────────────────┐
│ 💡 KI-Tipp              [×] │
├─────────────────────────────┤
│ 2 Aufgaben kombinierbar     │
│ Spart ~30 Minuten           │
│                             │
│ Vertrauen: 85%              │
│ ████████░░                  │
│                             │
│ [Details] [Anwenden]        │
└─────────────────────────────┘
```

**Inline Variant (Minimal):**

```
┌─────────────────────────────────────────┐
│ 💡 3 neue KI-Einblicke verfügbar   [→] │
└─────────────────────────────────────────┘
```

## Animation & Interaction

### Entry Animation

- Slide in from right (desktop)
- Slide up from bottom (mobile)
- Fade in with slight scale (0.95 → 1)
- Duration: 300ms ease-out

### Hover States

- Slight elevation increase
- Border color intensifies
- Action buttons show underline

### Dismissal

- Swipe right to dismiss (mobile)
- Click X or outside card
- Fade out + slide away
- Remember dismissal preference

### Loading State

```
┌─────────────────────────────────────────────┐
│ 🤖 KI analysiert...                    [×] │
├─────────────────────────────────────────────┤
│                                             │
│ ░░░░░░░░░░░░░░░░░░░░░░░░                   │
│ ░░░░░░░░░░░░░░░░░░                         │
│ ░░░░░░░░░░                                  │
│                                             │
└─────────────────────────────────────────────┘
```

## Confidence Indicators

### Visual Confidence Scale

- 90-100%: Solid purple bar, "Sehr sicher"
- 70-89%: Purple gradient, "Sicher"
- 50-69%: Purple to gray, "Wahrscheinlich"
- <50%: Dashed gray, "Unsicher"

### Textual Indicators

- Include percentage when relevant
- Show data points supporting insight
- Display calculation factors
- Time frame for predictions

## Accessibility

### Screen Reader

```html
<div role="complementary" aria-label="KI-Empfehlung">
  <h3>Route optimieren spart 45 Minuten</h3>
  <p>Vertrauensniveau: 92 Prozent</p>
  <button aria-label="Route optimieren und Empfehlung anwenden">
    Route optimieren
  </button>
</div>
```

### Keyboard Navigation

- Tab: Focus actions
- Enter/Space: Activate primary action
- Escape: Dismiss card
- Arrow keys: Navigate between multiple cards

### Reduced Motion

- No slide animations
- Instant fade in/out
- No pulsing or continuous animations

## Integration Patterns

### Dashboard Integration

```typescript
<AIInsightCard
  type="suggestion"
  title="Route optimieren"
  content="45 Minuten sparen"
  confidence={0.92}
  onAction={() => optimizeRoute()}
  onDismiss={() => dismissInsight()}
/>
```

### Contextual Placement

- Below related metric widgets
- Inline with data tables
- Modal for critical insights
- Toast for time-sensitive alerts

### Stacking & Grouping

```
┌─────────────────────────────┐
│ 3 KI-Einblicke verfügbar    │
├─────────────────────────────┤
│ • Route optimieren (45 min) │
│ • Kosten-Anomalie (€16k)    │
│ • Team-Tipp (Anna frei)     │
│                             │
│ [Alle anzeigen]             │
└─────────────────────────────┘
```

## German Labels

- **KI-Empfehlung**: AI recommendation
- **Vertrauen**: Confidence
- **Sicherheit**: Certainty
- **Dringlichkeit**: Urgency
- **Anwenden**: Apply
- **Details**: Details
- **Ignorieren**: Ignore
- **Später**: Later

## Do's and Don'ts

### ✅ DO's

- Show clear value proposition
- Include confidence level
- Provide actionable buttons
- Allow dismissal
- Explain reasoning when possible

### ❌ DON'T's

- Don't overwhelm with too many cards
- Don't show low-confidence insights prominently
- Don't auto-apply suggestions
- Don't use jargon
- Don't animate excessively

## Performance

- Lazy load insight generation
- Cache dismissed insights
- Prioritize high-confidence insights
- Batch API calls for insights
- Progressive disclosure for details

## Analytics Events

- insight_displayed (type, confidence)
- insight_action_taken (type, action)
- insight_dismissed (type, reason)
- confidence_threshold_interaction
- insight_feedback (helpful/not_helpful)

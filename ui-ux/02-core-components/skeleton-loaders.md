# Skeleton Loaders - Figma Make Prompt

## Context & Purpose
- **Component Type**: Loading State Component
- **User Roles**: All users (performance enhancement)
- **Usage Context**: Display while data loads to prevent layout shift
- **Business Value**: Improved perceived performance, reduced user frustration

## Design Requirements

### Visual Hierarchy
- **Match content structure**: Skeleton mimics actual content layout
- **Subtle animation**: Gentle shimmer effect
- **Consistent timing**: Standardized animation duration
- **Smooth transitions**: Fade to real content

### Component Variants
- List item skeletons
- Card skeletons
- Table row skeletons
- Dashboard widget skeletons
- Form field skeletons

### shadcn/ui Components
- Skeleton component base
- Animation utilities
- Layout matching

## Figma Make Prompt

Create comprehensive skeleton loader components for KOMPASS that provide smooth loading states for all major UI patterns while maintaining layout stability.

**Base Skeleton Component:**

```
Animation Pattern:
┌─────────────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ↑                                 ↑ │
│ Shimmer start              Shimmer end │
└─────────────────────────────────────┘
```

**CSS Properties:**
```css
.skeleton {
  background: linear-gradient(
    90deg,
    #F3F4F6 0%,      /* gray-100 */
    #E5E7EB 50%,     /* gray-200 */
    #F3F4F6 100%     /* gray-100 */
  );
  background-size: 200px 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 4px;
}

@keyframes shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}
```

**List Item Skeleton (Desktop):**

```
┌─────────────────────────────────────────────┐
│ ┌─┐ ░░░░░░░░░░░░░░░░░   ░░░░░░   ░░░░░░░  │
│ │░│ ░░░░░░░░░░░░░░░░░░░░░░░░              │
│ └─┘ ░░░░░░░░░░░░                           │
│     ↑ Avatar  ↑ Text blocks                 │
└─────────────────────────────────────────────┘
```

**Specifications:**
- Container: Full width, 80px height
- Avatar: 48×48px circle skeleton
- Title: 180px × 20px, 16px from avatar
- Subtitle: 240px × 16px, 8px below title
- Meta text: 80px × 14px, right-aligned

**Card Skeleton (Customer/Project):**

```
┌─────────────────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░                     │ ← Title
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░            │ ← Company
│                                         │
│ ░░░░░░░  ░░░░░░░  ░░░░░░░              │ ← Tags
│                                         │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░         │ ← Description
│ ░░░░░░░░░░░░░░░░░░░░░░                 │
└─────────────────────────────────────────┘
```

**Table Row Skeleton:**

```
┌─────────────────────────────────────────────┐
│ □ ░░░░░░░░  ░░░░░░  ░░░░░  ░░░░  ░░░░░░░  │
├─────────────────────────────────────────────┤
│ □ ░░░░░░░░  ░░░░░░  ░░░░░  ░░░░  ░░░░░░░  │
├─────────────────────────────────────────────┤
│ □ ░░░░░░░░  ░░░░░░  ░░░░░  ░░░░  ░░░░░░░  │
└─────────────────────────────────────────────┘
```

**Dashboard Metric Skeleton:**

```
┌─────────────────────────────┐
│ ░░░░░░░░░░░                 │ ← Label (120×16px)
│ ░░░░░░░░                    │ ← Value (100×32px)
│ ░░░░░░░░░░░░░               │ ← Trend (140×14px)
└─────────────────────────────┘
```

**Form Field Skeleton:**

```
┌─────────────────────────────┐
│ ░░░░░░░                     │ ← Label (80×14px)
│ ┌─────────────────────────┐ │
│ │░░░░░░░░░░░░░░░░░░░░░░░ │ │ ← Input (full×48px)
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

**Task Card Skeleton (Mobile):**

```
┌─────────────────────────────┐
│ ░░░  ░░░░░░░░░░░░░░   ░░░░ │ ← Priority, title, date
│ ░░░░░░░░░░░░░░░░░░░░░░░░░  │ ← Description
│ ░░░░  ░░░░  ░░░░           │ ← Status badges
└─────────────────────────────┘
```

## Implementation Patterns

### Skeleton Count Logic

```typescript
// Show exact number if known
if (totalCount) {
  return Array(Math.min(totalCount, pageSize))
    .fill(null)
    .map(() => <Skeleton />);
}

// Default visible area fill
const itemHeight = 80;
const visibleHeight = containerHeight;
const count = Math.ceil(visibleHeight / itemHeight);
return Array(count).fill(null).map(() => <Skeleton />);
```

### Smart Loading States

```
Initial Load:
- Show skeletons immediately (0ms)
- No empty state

Fast Load (<300ms):
- Skip skeleton, show content directly

Normal Load (300ms-3s):
- Show skeleton
- Fade to content

Slow Load (>3s):
- Show skeleton
- Add "Still loading..." message

Error State:
- Replace skeleton with error message
```

### Skeleton Timing Rules

1. **Minimum display time**: 500ms (prevent flashing)
2. **Fade transition**: 200ms ease-out
3. **Stagger animation**: 50ms delay between items
4. **Max skeleton count**: 10 items (performance)

## Mobile Optimizations

### Simplified Mobile Skeletons

```
Desktop (detailed):
┌─────────────────────────────┐
│ [Avatar] Title              │
│          Subtitle           │
│          Multiple details   │
└─────────────────────────────┘

Mobile (simplified):
┌─────────────────────────────┐
│ ░░░░░░░░░░░░░░░            │
│ ░░░░░░░░░░░                │
└─────────────────────────────┘
```

### Viewport-Based Loading

```javascript
// Calculate visible skeletons
const mobileSkeletons = Math.ceil(window.innerHeight / 80);
const desktopSkeletons = Math.ceil(window.innerHeight / 100);
```

## Accessibility Considerations

```html
<div role="status" aria-live="polite" aria-label="Lade Inhalte...">
  <span class="sr-only">Daten werden geladen</span>
  <div class="skeleton" aria-hidden="true">
    <!-- Visual skeleton -->
  </div>
</div>
```

## Do's and Don'ts

### ✅ DO's
- Match skeleton to content structure
- Use consistent animation timing
- Provide proper ARIA labels
- Show appropriate skeleton count
- Implement minimum display time

### ❌ DON'T's
- Don't use generic skeletons
- Don't skip skeletons for slow connections
- Don't animate too fast or slow
- Don't show skeletons for cached data
- Don't forget mobile optimization

## German Labels
- **Lade Inhalte...**: Loading content...
- **Daten werden geladen**: Data is loading
- **Noch einen Moment...**: Just a moment...
- **Fast fertig...**: Almost done...

## Implementation Example

```typescript
export function CustomerListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Kundenliste wird geladen</span>
      {Array(count).fill(null).map((_, index) => (
        <div 
          key={index} 
          className="skeleton-item"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <Skeleton className="h-20 w-full" />
        </div>
      ))}
    </div>
  );
}
```

## Performance Guidelines

- Skeleton components should be lightweight
- Avoid complex calculations in skeleton renders
- Use CSS animations (GPU accelerated)
- Lazy load skeleton components themselves
- Cache skeleton layouts

## Analytics Events
- skeleton_shown (component_type, duration)
- skeleton_to_content_transition
- loading_performance (time_to_content)

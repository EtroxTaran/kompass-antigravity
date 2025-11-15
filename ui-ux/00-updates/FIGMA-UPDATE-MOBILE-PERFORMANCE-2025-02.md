# Figma Make: Mobile Performance Update

**Purpose:** Add skeleton loaders, pull-to-refresh indicators, offline state badges, and optimize touch targets for better mobile performance
**Action:** Update all list views, cards, and interactive elements with performance optimizations
**Date:** 2025-02-06

---

## 🎯 MASTER PROMPT FOR FIGMA MAKE

**Copy everything below this line and paste into Figma Make:**

---

Enhance KOMPASS mobile performance by adding skeleton loaders to all list views, implementing pull-to-refresh indicators, adding offline state badges throughout the UI, and ensuring all touch targets meet the 48px minimum requirement for mobile accessibility.

## DESIGN SPECIFICATION: Skeleton Loaders

### List View Skeleton

**ADD TO ALL LIST VIEWS:**

```
When loading = true, show:

┌─────────────────────────────────────┐
│ ░░░░░░░░░░░░     ░░░░░░    ░░░░░░  │  ← Title skeleton
│ ░░░░░░░░░░░░░░░░░░░░░              │  ← Subtitle skeleton
│                                     │
│ ░░░░░░░░░        ░░░░░░    ░░░░░░  │
│ ░░░░░░░░░░░░░░░░░░░░░              │
│                                     │
│ ░░░░░░░░░        ░░░░░░    ░░░░░░  │
│ ░░░░░░░░░░░░░░░░░░░░░              │
└─────────────────────────────────────┘
```

**Specifications:**

- Background: #F3F4F6 (gray-100)
- Animation: Shimmer effect, 1.5s duration
- Border radius: 4px for text blocks
- Height: Match actual content height
- Spacing: Same as loaded content

### Card Skeleton

**FOR CUSTOMER/PROJECT CARDS:**

```
┌─────────────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░                  │  ← 180px × 20px
│ ░░░░░░░░░░░░░░░░░░░░░░░░░          │  ← 240px × 16px
│                                     │
│ ░░░░░░░░  ░░░░░░░░  ░░░░░░░        │  ← 3 × 80px × 14px
└─────────────────────────────────────┘
```

### Dashboard Widget Skeleton

**FOR METRIC CARDS:**

```
┌─────────────────────────────────────┐
│ ░░░░░░░░░░░░                        │  ← Label
│ ░░░░░░░░░                           │  ← Large number
│ ░░░░░░░░░░░░░░                      │  ← Trend line
└─────────────────────────────────────┘
```

**Animation CSS:**

```css
@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.skeleton {
  background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%);
  background-size: 200px 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}
```

---

## DESIGN SPECIFICATION: Pull-to-Refresh

### Pull-to-Refresh Indicator

**ADD TO TOP OF SCROLLABLE LISTS:**

```
Initial state (hidden above viewport):
┌─────────────────────────────────────┐
│              ↓                      │
│      Ziehen zum Aktualisieren       │
└─────────────────────────────────────┘

Pulling state (visible):
┌─────────────────────────────────────┐
│              ↓                      │
│         Weiter ziehen...            │
│         ████░░░░░░░                 │
└─────────────────────────────────────┘

Release state:
┌─────────────────────────────────────┐
│              ↻                      │
│         Loslassen zum               │
│         Aktualisieren               │
└─────────────────────────────────────┘

Loading state:
┌─────────────────────────────────────┐
│           [Spinner]                 │
│        Aktualisiere...              │
└─────────────────────────────────────┘
```

**Specifications:**

- Container height: 64px
- Background: White with subtle shadow
- Icon: 24px, animated rotation when loading
- Text: Inter 14px regular (#6B7280)
- Progress bar: 4px height, primary blue
- Trigger distance: 80px pull

---

## DESIGN SPECIFICATION: Offline State Badges

### Global Offline Banner

**ADD TO APP HEADER:**

```
When offline = true:
┌─────────────────────────────────────┐
│ ⚡ Offline-Modus • Änderungen werden │
│ gespeichert und später synchronisiert│
└─────────────────────────────────────┘
```

**Specifications:**

- Background: #FEF3C7 (amber-100)
- Border: 1px solid #FCD34D (amber-300)
- Icon: ⚡ 16px
- Text: Inter 13px medium (#92400E)
- Height: 36px
- Position: Below main header

### Sync Status Indicators

**FOR LIST ITEMS AND CARDS:**

```
Synced (default - no indicator):
[Customer Name]

Pending sync:
[Customer Name] 🔄

Sync error:
[Customer Name] ⚠️
```

**Icon specifications:**

- 🔄 Pending: #3B82F6, subtle rotation animation
- ⚠️ Error: #EF4444, static
- Size: 16px
- Margin-left: 8px

### Offline Data Age Indicator

**FOR CACHED DATA:**

```
┌─────────────────────────────────────┐
│ Letzte Aktualisierung: vor 3 Std.   │
│ [🔄 Jetzt aktualisieren]            │
└─────────────────────────────────────┘
```

---

## TOUCH TARGET OPTIMIZATION

### Minimum Touch Targets

**UPDATE ALL INTERACTIVE ELEMENTS:**

**Before (Too Small):**

```
[Edit] [Delete]  ← 32px height ❌
```

**After (Optimized):**

```
[  Edit  ] [ Delete ]  ← 48px height ✓
```

### List Item Touch Targets

**CURRENT:**

```
┌─────────────────────────┐
│ Customer Name      [>] │  ← 40px ❌
└─────────────────────────┘
```

**UPDATE TO:**

```
┌─────────────────────────────────────┐
│                                     │ ← 64px ✓
│ Customer Name                  [>]  │
│ Additional info                     │
└─────────────────────────────────────┘
```

### Button Spacing

**MOBILE BUTTON GROUPS:**

```
Before:
[Save] [Cancel]  ← No gap ❌

After:
[   Save   ]  [  Cancel  ]  ← 8px gap ✓
 ↑ 48px min height
```

### Icon Buttons

**UPDATE ALL ICON BUTTONS:**

```
Before: [🗑️] ← 32×32px ❌

After: [ 🗑️ ] ← 48×48px ✓
       ↑ Larger tap area
```

---

## PERFORMANCE OPTIMIZATIONS

### Image Loading States

**FOR CUSTOMER/CONTACT AVATARS:**

```
Loading:
┌───┐
│░░░│ ← Skeleton circle
└───┘

Loaded:
┌───┐
│IMG│
└───┘

Error:
┌───┐
│ ? │ ← Fallback
└───┘
```

### Lazy Loading Indicators

**FOR LONG LISTS:**

```
End of initial load (20 items):

[List items...]
─────────────────
Mehr laden...
[Spinner]
```

### Virtual Scroll Placeholder

**FOR VERY LONG LISTS (>100 items):**

```
┌─────────────────────────────────────┐
│ Visible item 1                      │
│ Visible item 2                      │
│ ░░░░░░░░░░░░░░░ (placeholder)       │
│ ░░░░░░░░░░░░░░░ (placeholder)       │
│ Visible item 5                      │
└─────────────────────────────────────┘
```

---

## LOADING STATE VARIATIONS

### Form Submit States

**UPDATE ALL FORM BUTTONS:**

```
Default:
[Speichern]

Loading:
[⟳ Speichere...] ← Disabled state
```

### Search Loading

**FOR SEARCH INPUTS:**

```
┌─────────────────────────────────┐
│ 🔍 Suche...              [⟳]    │ ← Spinner in input
└─────────────────────────────────┘

Results loading:
┌─────────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░              │
│ ░░░░░░░░░░░░░░░░░░░░░░         │
│ ░░░░░░░░░░░░░░░                 │
└─────────────────────────────────┘
```

---

## MOBILE-SPECIFIC UPDATES

### Bottom Navigation Touch Targets

**UPDATE TAB BAR:**

```
Before (44px):
┌─────┬─────┬─────┬─────┐
│ 🏠  │ 📊  │ ➕  │ 👤  │ ← Too short ❌
└─────┴─────┴─────┴─────┘

After (56px + safe area):
┌─────┬─────┬─────┬─────┐
│     │     │     │     │
│ 🏠  │ 📊  │ ➕  │ 👤  │ ← Better ✓
│Home │Stats│ New │ Me  │
│     │     │     │     │
└─────┴─────┴─────┴─────┘
```

### Swipe Action Targets

**FOR LIST ITEMS:**

```
┌─────────────────────────────────────┐
│ Customer Name              │ Delete │ ← 64px
│ Details                    │   🗑️   │ ← height
└─────────────────────────────────────┘
        ↑ Main area    ↑ 80px swipe target
```

---

## IMPLEMENTATION NOTES

### Performance Metrics

Target metrics:

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

### Skeleton Timing

- Show immediately (0ms delay)
- Minimum display time: 500ms (prevent flashing)
- Fade out transition: 200ms

### Offline Behavior

- Cache last 100 viewed items
- Show age indicator after 1 hour
- Auto-refresh when online returns
- Queue actions with visual feedback

---

## QUALITY CHECKLIST

After applying this prompt, verify:

- [ ] All lists have skeleton loaders
- [ ] Pull-to-refresh works on all scrollable views
- [ ] Offline banner appears when disconnected
- [ ] Sync indicators show on modified items
- [ ] All buttons are minimum 48px height
- [ ] Touch targets have proper spacing (8px minimum)
- [ ] Icon buttons expanded to 48×48px
- [ ] Loading states for all async operations
- [ ] Form buttons show loading state
- [ ] Search shows inline loading indicator
- [ ] Bottom nav has proper height
- [ ] Swipe targets are adequately sized

---

**Total Components Updated:** 50+
**Lists with Skeletons:** All list views
**Touch Targets Fixed:** All interactive elements
**New Indicators:** Offline badge, sync status, pull-to-refresh

---

END OF PROMPT

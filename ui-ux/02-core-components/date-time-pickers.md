# Date & Time Pickers - Figma Make Prompt

## Context & Purpose
- **Component Type**: Date and Time Selection Components
- **User Roles**: All (GF, PLAN, ADM, KALK, BUCH)
- **Usage Context**: Forms, filters, scheduling
- **Business Value**: Accurate date/time input with calendar interface

## Design Requirements

### Visual Hierarchy
- **Input Field**: Clear date/time display in German format
- **Calendar Popover**: Visual month calendar for selection
- **Navigation**: Month/year selection with arrows
- **Today Highlight**: Current date distinctly marked

### Layout Structure
- Input: 40px height, German format (TT.MM.JJJJ)
- Calendar: 280px width, popover positioning
- Day cells: 40x40px, clickable
- Month/year header: 48px height

### shadcn/ui Components
- `Calendar` for date picker
- `Popover` for calendar display
- `Button` for day cells
- `Select` for month/year

## Figma Make Prompt

Create comprehensive date and time picker components for KOMPASS, a German CRM application. Design date pickers with calendar interface, time pickers, and range selectors with German formatting and labels.

**Date Input Field:**

**Closed State:**
- Width: 200px (or full width in forms)
- Height: 40px
- Border: 1px solid gray (#d1d5db)
- Border-radius: 6px
- Padding: 12px left, 12px right
- Calendar icon: 20px at right, gray
- Placeholder: "TT.MM.JJJJ" (German date format)
- Selected date: "15.11.2024" (black text)
- Focus: Blue border (2px, #3b82f6)

**Calendar Popover (Open State):**

**Calendar Container:**
- Width: 280px
- Background: White
- Border: 1px solid #e5e7eb
- Border-radius: 8px
- Shadow: 0px 4px 12px rgba(0,0,0,0.15)
- Padding: 16px

**Month/Year Header:**
- Height: 48px
- Month dropdown: "November 2024" (clickable, opens month/year selector)
- Navigation arrows: ChevronLeft and ChevronRight (24px, clickable)
- Prev month button: Left arrow
- Next month button: Right arrow
- Hover: Light gray background on arrows

**Calendar Grid:**
- Weekday headers: "Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"
  - Font: 12px, semibold, gray (#6b7280)
  - Height: 32px
- Day cells: 40x40px each
  - Layout: 7 columns (weekdays) × 5-6 rows
  - Font: 14px
  - Border-radius: 6px
  - States:
    1. **Default**: Black text, white background
    2. **Hover**: Light gray background (#f9fafb)
    3. **Today**: Blue outline (2px, #3b82f6), bold text
    4. **Selected**: Blue background (#3b82f6), white text, bold
    5. **Other month**: Light gray text (#d1d5db), italic
    6. **Disabled**: Gray text (#9ca3af), not clickable, line-through

**Month/Year Selector (Dropdown):**
- Opens when clicking month/year in header
- Grid of months: 4 columns × 3 rows
- Month buttons: "Jan", "Feb", "Mär", "Apr", etc. (German abbreviations)
- Year selector: Dropdown or scrollable list
- Selected month/year: Blue background
- Quick navigation: "Heute" button at bottom (jumps to today)

**Date Range Picker:**
- Two inputs: "Von: TT.MM.JJJJ" and "Bis: TT.MM.JJJJ"
- Single calendar showing both months side-by-side
- Selection:
  1. Click start date: Highlighted in blue
  2. Hover end date: Range shown in light blue
  3. Click end date: Both dates selected, range filled
- Range cells: Light blue background (#e0f2fe)
- Start/end dates: Dark blue background (#3b82f6), white text

**Time Picker:**

**Time Input Field:**
- Width: 120px
- Format: "HH:MM" (24-hour German format)
- Placeholder: "HH:MM"
- Clock icon: 20px at right
- Example: "14:30"

**Time Picker Popover:**
- Width: 200px
- Two scrollable columns: Hours (00-23) and Minutes (00, 15, 30, 45)
- Column height: 200px, scrollable
- Current time highlighted
- Click to select hour, then minute
- "Jetzt" button at bottom (sets to current time)

**Date-Time Picker (Combined):**
- Date input + Time input side by side
- Single popover with calendar and time picker
- Layout: Calendar above, time picker below
- Divider: 1px solid #e5e7eb between calendar and time

**Presets (Quick Selection):**
- Left sidebar in calendar popover (optional)
- Preset buttons:
  - "Heute" (Today)
  - "Gestern" (Yesterday)
  - "Letzte 7 Tage" (Last 7 days)
  - "Letzte 30 Tage" (Last 30 days)
  - "Dieser Monat" (This month)
  - "Letzter Monat" (Last month)
- Clicking preset: Auto-fills date(s) and closes picker

**Birthday/Year Picker:**
- Year-first selection (important for old dates)
- Year dropdown: Scrollable list 1900-2024
- Month grid: After year selected
- Day grid: After month selected
- Use for: Birth dates, historical dates

**Keyboard Navigation:**
- Arrow keys: Navigate days in calendar
- Enter: Select focused day
- Escape: Close calendar
- Tab: Move between date/time fields
- Page Up/Down: Previous/next month

**Disabled Date Ranges:**
- Visual: Grayed out, strikethrough, not clickable
- Use cases:
  - Past dates disabled (for future-only dates)
  - Weekend dates disabled (for business days only)
  - Date range limits (min/max dates)
- Example: Invoice date limited to last 7 days

**Validation States:**
- Error: Red border on input, error message below
- Success: Green border (optional)
- Warning: Amber border for unusual dates
- Messages:
  - "Ungültiges Datum" (Invalid date)
  - "Datum liegt in der Zukunft" (Date is in future)
  - "Datum liegt zu weit zurück" (Date too far in past)

**Mobile Date Picker:**
- On mobile: Native date picker (iOS/Android)
- Or: Full-screen calendar overlay
- Larger day cells (56x56px) for touch
- Month/year at top with large arrows
- "Abbrechen" and "Fertig" buttons at bottom

**Relative Date Display:**
- Shows relative time for recent dates
- "Heute", "Gestern", "Vor 3 Tagen"
- Tooltip shows absolute date on hover
- Use for: Activity timestamps, last modified

**Week Number Display (Optional):**
- Week numbers shown in left column
- Font: 11px, gray
- Format: "KW 46" (Kalenderwoche)
- Use for: Project planning, reporting

Design with German date format (DD.MM.YYYY) and clear visual feedback for all interactions.

## Interaction Patterns

### Date Selection
1. User clicks date input
2. Calendar popover opens below (or above if no space)
3. Current month shown, today highlighted
4. User navigates with arrows or clicks date
5. Date selected, input updates
6. Calendar closes automatically

### Date Range Selection
1. User clicks "Von" input
2. Calendar opens
3. User selects start date
4. User selects end date (range highlighted)
5. Both inputs update
6. Calendar closes

### Time Selection
1. User clicks time input
2. Time picker opens
3. User scrolls hour column, selects hour
4. User scrolls minute column, selects minute
5. Input updates
6. Picker closes on blur or button click

## German Labels & Content

### Date Format
- **TT.MM.JJJJ**: DD.MM.YYYY
- **HH:MM**: 24-hour time
- Example: "15.11.2024" or "15.11.2024, 14:30"

### Weekdays
- **Mo**: Monday
- **Di**: Tuesday
- **Mi**: Wednesday
- **Do**: Thursday
- **Fr**: Friday
- **Sa**: Saturday
- **So**: Sunday

### Months
- **Januar, Februar, März, April, Mai, Juni, Juli, August, September, Oktober, November, Dezember**

### Presets
- **Heute**: Today
- **Gestern**: Yesterday
- **Letzte 7 Tage**: Last 7 days
- **Letzte 30 Tage**: Last 30 days
- **Dieser Monat**: This month
- **Letzter Monat**: Last month

### Buttons
- **Jetzt**: Now (current time)
- **Abbrechen**: Cancel
- **Fertig**: Done
- **Zurücksetzen**: Reset

### Validation
- **Ungültiges Datum**: Invalid date
- **Pflichtfeld**: Required field
- **Von-Datum muss vor Bis-Datum liegen**: From date must be before To date

## Accessibility Requirements
- WCAG 2.1 AA compliance
- Input: aria-label="Datum auswählen"
- Calendar: role="dialog", aria-modal="true"
- Day cells: role="button", aria-label="15. November 2024"
- Selected date: aria-selected="true"
- Disabled dates: aria-disabled="true"
- Keyboard navigation fully functional
- Focus visible: 2px blue outline
- Screen reader announces date changes

## Mobile Considerations
- Native date picker preferred on mobile
- Or larger calendar with 56px touch targets
- Full-screen overlay for better visibility
- Swipe gestures for month navigation
- Bottom sheet style for compact view

## Example Data

**Invoice Date:**
- Input: "15.11.2024"
- Min date: 7 days ago (08.11.2024)
- Max date: Today (15.11.2024)
- Disabled: Future dates, dates > 7 days ago

**Project Timeline:**
- Start date: "01.10.2024"
- End date: "31.12.2024"
- Range: 92 days highlighted in calendar

**Meeting Time:**
- Date: "20.11.2024"
- Time: "14:30"
- Format: "20.11.2024, 14:30 Uhr"

## Implementation Notes

### shadcn/ui Installation
```bash
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add select
```

### Date Picker Usage
```typescript
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const [date, setDate] = useState<Date>();

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">
      <CalendarIcon className="mr-2 h-4 w-4" />
      {date ? format(date, "dd.MM.yyyy", { locale: de }) : "TT.MM.JJJJ"}
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0">
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      locale={de}
    />
  </PopoverContent>
</Popover>
```

### Date Range Picker
```typescript
const [dateRange, setDateRange] = useState<DateRange>();

<Calendar
  mode="range"
  selected={dateRange}
  onSelect={setDateRange}
  locale={de}
  numberOfMonths={2}
/>
```

### Component Dependencies
- Design tokens (colors, spacing)
- Icons from lucide-react (Calendar, Clock, ChevronLeft, ChevronRight)
- date-fns for date formatting and manipulation
- German locale (date-fns/locale/de)
- Popover for calendar display

### State Management
- Selected date(s) state
- Calendar open/close state
- Current viewed month/year
- Time selection state
- Date validation rules


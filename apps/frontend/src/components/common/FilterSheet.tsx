import React from 'react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

/**
 * Filter Sheet Props
 */
interface FilterSheetProps {
  /** Whether sheet is open */
  open: boolean;
  /** Open/close change handler */
  onOpenChange: (open: boolean) => void;
  /** Sheet title */
  title?: string;
  /** Sheet description */
  description?: string;
  /** Filter content (React node) */
  children: React.ReactNode;
  /** Active filter count (for display) */
  activeFilterCount?: number;
  /** Apply button click handler */
  onApply?: () => void;
  /** Reset button click handler */
  onReset?: () => void;
  /** Results count (for display) */
  resultsCount?: number;
}

/**
 * Filter Sheet Component
 *
 * Reusable filter panel that slides in from the right.
 * Provides a consistent structure for filter controls.
 *
 * @example
 * ```tsx
 * <FilterSheet
 *   open={filterOpen}
 *   onOpenChange={setFilterOpen}
 *   title="Filter"
 *   activeFilterCount={activeFilters.length}
 *   resultsCount={filteredData.length}
 *   onApply={handleApplyFilters}
 *   onReset={handleResetFilters}
 * >
 *   <FilterControls
 *     filters={filters}
 *     onFiltersChange={setFilters}
 *   />
 * </FilterSheet>
 * ```
 */
export function FilterSheet({
  open,
  onOpenChange,
  title = 'Filter',
  description,
  children,
  activeFilterCount = 0,
  onApply,
  onReset,
  resultsCount,
}: FilterSheetProps): React.ReactElement {
  const handleApply = (): void => {
    onApply?.();
    onOpenChange(false);
  };

  const handleReset = (): void => {
    onReset?.();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>{title}</SheetTitle>
            {onReset && activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-muted-foreground"
              >
                Filter zurücksetzen
              </Button>
            )}
          </div>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>

        <div className="mt-6 space-y-6 overflow-y-auto pb-24">{children}</div>

        <SheetFooter className="border-t bg-background p-4">
          <div className="flex w-full items-center justify-between">
            {resultsCount !== undefined && (
              <p className="text-sm text-muted-foreground">
                {resultsCount} Ergebnisse entsprechen Filtern
              </p>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Abbrechen
              </Button>
              <Button onClick={handleApply}>Anwenden</Button>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

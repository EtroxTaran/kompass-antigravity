import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';

import type { SortDirection } from '@/utils/table-utils';

/**
 * Sortable Table Header Props
 */
interface SortableTableHeaderProps {
  /** Column identifier */
  column: string;
  /** Current sort column (if this column is sorted) */
  currentSortColumn?: string;
  /** Current sort direction */
  currentSortDirection?: SortDirection;
  /** Sort change handler */
  onSort: (column: string, direction: SortDirection) => void;
  /** Header label */
  children: React.ReactNode;
  /** Whether column is sortable (default: true) */
  sortable?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * Sortable Table Header Component
 *
 * Displays a table header with sort indicators and handles sort toggling.
 * Shows up arrow for ascending, down arrow for descending, or double arrow for unsorted.
 *
 * @example
 * ```tsx
 * <SortableTableHeader
 *   column="companyName"
 *   currentSortColumn={sortColumn}
 *   currentSortDirection={sortDirection}
 *   onSort={handleSort}
 * >
 *   Firmenname
 * </SortableTableHeader>
 * ```
 */
export function SortableTableHeader({
  column,
  currentSortColumn,
  currentSortDirection,
  onSort,
  children,
  sortable = true,
  className = '',
}: SortableTableHeaderProps): React.ReactElement {
  const isSorted = currentSortColumn === column;
  const isAscending = isSorted && currentSortDirection === 'asc';

  const handleClick = (): void => {
    if (!sortable) return;

    if (isSorted) {
      // Toggle direction
      const newDirection: SortDirection =
        currentSortDirection === 'asc' ? 'desc' : 'asc';
      onSort(column, newDirection);
    } else {
      // Start with ascending
      onSort(column, 'asc');
    }
  };

  return (
    <th className={className}>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent"
        onClick={handleClick}
        disabled={!sortable}
        aria-label={
          sortable
            ? `Sort by ${String(children)} ${
                isSorted
                  ? currentSortDirection === 'asc'
                    ? '(currently ascending, click to sort descending)'
                    : '(currently descending, click to sort ascending)'
                  : '(click to sort)'
              }`
            : undefined
        }
        aria-sort={
          sortable && isSorted
            ? currentSortDirection === 'asc'
              ? 'ascending'
              : 'descending'
            : 'none'
        }
      >
        <span className="font-medium">{children}</span>
        {sortable && (
          <span className="ml-2">
            {isSorted ? (
              isAscending ? (
                <ArrowUp className="h-4 w-4" aria-hidden="true" />
              ) : (
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              )
            ) : (
              <ChevronsUpDown
                className="h-4 w-4 opacity-50"
                aria-hidden="true"
              />
            )}
          </span>
        )}
      </Button>
    </th>
  );
}

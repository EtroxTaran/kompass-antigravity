import {
  Download,
  Filter,
  LayoutGrid,
  LayoutList,
  Plus,
  Search,
  X,
} from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

/**
 * Controls Bar Props
 */
interface ControlsBarProps {
  /** Search value */
  searchValue: string;
  /** Search change handler */
  onSearchChange: (value: string) => void;
  /** Search placeholder */
  searchPlaceholder?: string;
  /** Active filter count (for badge) */
  activeFilterCount?: number;
  /** Filter button click handler */
  onFilterClick?: () => void;
  /** View mode ('table' | 'grid') */
  viewMode?: 'table' | 'grid';
  /** View mode change handler */
  onViewModeChange?: (mode: 'table' | 'grid') => void;
  /** Selected rows count (for bulk actions) */
  selectedCount?: number;
  /** Bulk actions menu items */
  bulkActions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'default' | 'destructive';
  }>;
  /** Export menu items */
  exportOptions?: Array<{
    label: string;
    onClick: () => void;
  }>;
  /** Primary action button */
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  /** Additional className */
  className?: string;
}

/**
 * Controls Bar Component
 *
 * Reusable controls bar for list views with search, filters, view toggle,
 * bulk actions, export, and primary action button.
 *
 * Layout:
 * - Left: Search input, Filter button, View toggle
 * - Right: Bulk actions (when selected), Export, Primary action
 *
 * @example
 * ```tsx
 * <ControlsBar
 *   searchValue={searchTerm}
 *   onSearchChange={setSearchTerm}
 *   searchPlaceholder="Kunden durchsuchen..."
 *   activeFilterCount={3}
 *   onFilterClick={() => setFilterOpen(true)}
 *   viewMode={viewMode}
 *   onViewModeChange={setViewMode}
 *   selectedCount={selectedRows.length}
 *   bulkActions={[
 *     { label: 'E-Mail senden', onClick: handleBulkEmail },
 *     { label: 'Löschen', onClick: handleBulkDelete, variant: 'destructive' },
 *   ]}
 *   exportOptions={[
 *     { label: 'CSV', onClick: handleExportCSV },
 *     { label: 'Excel', onClick: handleExportExcel },
 *   ]}
 *   primaryAction={{
 *     label: 'Neuer Kunde',
 *     onClick: () => navigate('/customers/new'),
 *     icon: <Plus className="h-4 w-4" />,
 *   }}
 * />
 * ```
 */
export function ControlsBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Suchen...',
  activeFilterCount = 0,
  onFilterClick,
  viewMode = 'table',
  onViewModeChange,
  selectedCount = 0,
  bulkActions = [],
  exportOptions = [],
  primaryAction,
  className = '',
}: ControlsBarProps): React.ReactElement {
  const hasActiveFilters = activeFilterCount > 0;
  const hasSelection = selectedCount > 0;

  return (
    <div
      className={`flex h-16 items-center gap-4 border-b bg-background px-4 ${className}`}
    >
      {/* Left Side: Search, Filter, View Toggle */}
      <div className="flex flex-1 items-center gap-2">
        {/* Search Input */}
        <div className="relative w-[400px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-9"
            aria-label="Suche"
          />
          {searchValue && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
              onClick={() => onSearchChange('')}
              aria-label="Suche löschen"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Filter Button */}
        {onFilterClick && (
          <Button
            variant="outline"
            size="sm"
            onClick={onFilterClick}
            className="relative"
            aria-label="Filter öffnen"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filter
            {hasActiveFilters && (
              <Badge
                variant="destructive"
                className="ml-2 h-5 min-w-[20px] px-1.5"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        )}

        {/* View Toggle */}
        {onViewModeChange && (
          <div className="flex rounded-md border">
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-r-none"
              onClick={() => onViewModeChange('table')}
              aria-label="Tabellenansicht"
            >
              <LayoutList className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-l-none border-l"
              onClick={() => onViewModeChange('grid')}
              aria-label="Kartenansicht"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Right Side: Bulk Actions, Export, Primary Action */}
      <div className="flex items-center gap-2">
        {/* Bulk Actions (visible when rows selected) */}
        {hasSelection && bulkActions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Aktionen
                <Badge variant="secondary" className="ml-2">
                  {selectedCount} ausgewählt
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Bulk-Aktionen</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {bulkActions.map((action, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={action.onClick}
                  className={
                    action.variant === 'destructive'
                      ? 'text-destructive focus:text-destructive'
                      : ''
                  }
                >
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Export Button */}
        {exportOptions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Exportieren
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export-Optionen</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {exportOptions.map((option, index) => (
                <DropdownMenuItem key={index} onClick={option.onClick}>
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Primary Action Button */}
        {primaryAction && (
          <Button
            onClick={primaryAction.onClick}
            size="sm"
            className="min-w-[120px]"
          >
            {primaryAction.icon || <Plus className="mr-2 h-4 w-4" />}
            {primaryAction.label}
          </Button>
        )}
      </div>
    </div>
  );
}

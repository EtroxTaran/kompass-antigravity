import {
  Building2,
  Eye,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Users,
  X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  ControlsBar,
  FilterSheet,
  SortableTableHeader,
} from '@/components/common';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCustomers } from '@/hooks/useCustomers';
import { useDebounce } from '@/hooks/useDebounce';

import type { SortDirection } from '@/utils/table-utils';

import type { Customer } from '@kompass/shared/types/entities/customer';

/**
 * Customer List Page Component
 *
 * Displays a comprehensive table of all customers with search, filtering,
 * sorting, pagination, and bulk actions.
 * Follows patterns from GitHub UI reference repository: EtroxTaran/Kompassuimusterbibliothek
 * Reference source: src/components/CustomerListDemo.tsx
 *
 * Features:
 * - Integrated controls bar (search, filter, view toggle, actions)
 * - Sortable table columns with indicators
 * - Client-side pagination
 * - Row selection with checkboxes
 * - Action buttons on row hover
 * - Filter sheet with multiple filter options
 * - Active filters bar
 * - Loading and error states
 * - Empty states with icons
 * - Mobile-responsive design
 * - RBAC filtering (ADM sees own customers, others see all)
 *
 * @example
 * ```tsx
 * <Route path="/customers" element={<CustomerListPage />} />
 * ```
 */
export function CustomerListPage(): React.ReactElement {
  const navigate = useNavigate();

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Filter state
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{
    rating?: string[];
    status?: string[];
  }>({});
  const activeFilterCount = useMemo(() => {
    return (
      (activeFilters.rating?.length || 0) + (activeFilters.status?.length || 0)
    );
  }, [activeFilters]);

  // Sort state
  const [sortColumn, setSortColumn] = useState<string>('companyName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Selection state
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Build filters for API
  const apiFilters = useMemo(() => {
    const filters: {
      search?: string;
      rating?: string;
      customerType?: string;
      vatNumber?: string;
    } = {};

    if (debouncedSearch) {
      filters.search = debouncedSearch;
    }

    // Apply rating filter (use first selected rating for now)
    if (activeFilters.rating && activeFilters.rating.length > 0) {
      filters.rating = activeFilters.rating[0];
    }

    return filters;
  }, [debouncedSearch, activeFilters.rating]);

  // Fetch customers with server-side pagination and sorting
  const {
    data: paginatedResponse,
    isLoading,
    error,
  } = useCustomers({
    filters: apiFilters,
    page,
    pageSize,
    sortBy: sortColumn,
    sortOrder: sortDirection,
  });

  const customers = paginatedResponse?.data || [];
  const pagination = paginatedResponse?.pagination;

  // Pagination info from server
  const paginationInfo = useMemo(() => {
    if (!pagination) {
      return {
        total: 0,
        page: 1,
        pageSize: 20,
        totalPages: 0,
        startIndex: 0,
        endIndex: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      };
    }

    return {
      total: pagination.total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: pagination.totalPages,
      startIndex: (pagination.page - 1) * pagination.pageSize + 1,
      endIndex: Math.min(
        pagination.page * pagination.pageSize,
        pagination.total
      ),
      hasNextPage: pagination.hasNextPage,
      hasPreviousPage: pagination.hasPreviousPage,
    };
  }, [pagination]);

  // Handle sort
  const handleSort = (column: string, direction: SortDirection): void => {
    // Map UI column names to API sort fields
    const sortFieldMap: Record<string, string> = {
      companyName: 'companyName',
      rating: 'rating',
      customerType: 'customerType',
      createdAt: 'createdAt',
      modifiedAt: 'modifiedAt',
    };

    const apiSortField = sortFieldMap[column] || column;
    setSortColumn(apiSortField);
    setSortDirection(direction);
    setPage(1); // Reset to first page when sorting
  };

  // Handle row selection
  const handleSelectAll = (checked: boolean): void => {
    if (checked) {
      setSelectedRows(new Set(customers.map((c) => c._id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (customerId: string, checked: boolean): void => {
    const newSelection = new Set(selectedRows);
    if (checked) {
      newSelection.add(customerId);
    } else {
      newSelection.delete(customerId);
    }
    setSelectedRows(newSelection);
  };

  const isAllSelected =
    customers.length > 0 && customers.every((c) => selectedRows.has(c._id));

  // Handle customer actions
  const handleCustomerClick = (customerId: string): void => {
    navigate(`/customers/${customerId}`);
  };

  const handleEditClick = (e: React.MouseEvent, customerId: string): void => {
    e.stopPropagation();
    navigate(`/customers/${customerId}/edit`);
  };

  const handleViewClick = (e: React.MouseEvent, customerId: string): void => {
    e.stopPropagation();
    navigate(`/customers/${customerId}`);
  };

  // Handle filters
  const handleApplyFilters = (): void => {
    setPage(1); // Reset to first page when filters change
    setFilterOpen(false);
  };

  const handleResetFilters = (): void => {
    setActiveFilters({});
    setPage(1);
  };

  // Handle bulk actions
  const handleBulkDelete = (): void => {
    if (
      window.confirm(
        `Möchten Sie ${selectedRows.size} Kunden wirklich löschen?`
      )
    ) {
      // TODO: Implement bulk delete
      console.log('Bulk delete:', Array.from(selectedRows));
      setSelectedRows(new Set());
    }
  };

  const handleBulkExport = (): void => {
    // TODO: Implement bulk export
    console.log('Bulk export:', Array.from(selectedRows));
  };

  // Get rating badge variant
  const getRatingBadgeVariant = (
    rating: Customer['rating']
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (rating) {
      case 'A':
        return 'default';
      case 'B':
        return 'secondary';
      case 'C':
        return 'outline';
      default:
        return 'outline';
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Fehler</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">
              {error instanceof Error
                ? error.message
                : 'Fehler beim Laden der Kunden'}
            </p>
            <Button
              onClick={() => {
                // Trigger refetch by resetting page
                setPage(1);
              }}
              className="mt-4"
            >
              Erneut versuchen
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Kunden</h1>
          <p className="text-muted-foreground mt-2">
            Verwalten Sie Ihre Kundenbeziehungen
            {pagination && pagination.total > 0 && (
              <Badge variant="secondary" className="ml-2">
                {pagination.total}
              </Badge>
            )}
          </p>
        </div>
      </div>

      {/* Controls Bar */}
      <ControlsBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Kunden durchsuchen..."
        activeFilterCount={activeFilterCount}
        onFilterClick={() => setFilterOpen(true)}
        selectedCount={selectedRows.size}
        bulkActions={[
          {
            label: 'E-Mail senden',
            onClick: () => console.log('Bulk email'),
          },
          {
            label: 'Exportieren',
            onClick: handleBulkExport,
          },
          {
            label: 'Löschen',
            onClick: handleBulkDelete,
            variant: 'destructive',
          },
        ]}
        exportOptions={[
          { label: 'CSV', onClick: () => console.log('Export CSV') },
          { label: 'Excel', onClick: () => console.log('Export Excel') },
          { label: 'PDF', onClick: () => console.log('Export PDF') },
        ]}
        primaryAction={{
          label: 'Neuer Kunde',
          onClick: () => navigate('/customers/new'),
          icon: <Plus className="h-4 w-4" />,
        }}
      />

      {/* Active Filters Bar */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 rounded-md bg-blue-50 p-3 text-sm">
          <span className="text-muted-foreground">Aktive Filter:</span>
          {activeFilters.rating?.map((rating) => (
            <Badge key={rating} variant="secondary" className="gap-1">
              Bewertung: {rating}
              <button
                onClick={() => {
                  setActiveFilters((prev) => ({
                    ...prev,
                    rating: prev.rating?.filter((r) => r !== rating),
                  }));
                }}
                className="ml-1 rounded-full hover:bg-muted"
                aria-label={`Filter ${rating} entfernen`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="ml-auto"
          >
            Alle Filter entfernen
          </Button>
        </div>
      )}

      {/* Customer Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-4 p-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : customers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-muted p-6">
                {searchTerm || activeFilterCount > 0 ? (
                  <Search className="h-12 w-12 text-muted-foreground" />
                ) : (
                  <Users className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <h3 className="mt-4 text-lg font-semibold">
                {searchTerm || activeFilterCount > 0
                  ? 'Keine Kunden gefunden'
                  : 'Noch keine Kunden vorhanden'}
              </h3>
              <p className="mt-2 text-center text-sm text-muted-foreground max-w-md">
                {searchTerm || activeFilterCount > 0
                  ? `Keine Ergebnisse für "${searchTerm}" mit aktiven Filtern`
                  : 'Beginnen Sie mit dem Hinzufügen Ihres ersten Kunden'}
              </p>
              <div className="mt-6 flex gap-2">
                {searchTerm || activeFilterCount > 0 ? (
                  <>
                    <Button variant="outline" onClick={handleResetFilters}>
                      Filter zurücksetzen
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm('');
                        handleResetFilters();
                      }}
                    >
                      Neue Suche starten
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => navigate('/customers/new')}>
                    Ersten Kunden anlegen
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={isAllSelected}
                          onCheckedChange={handleSelectAll}
                          aria-label="Alle auswählen"
                        />
                      </TableHead>
                      <SortableTableHeader
                        column="companyName"
                        currentSortColumn={sortColumn}
                        currentSortDirection={sortDirection}
                        onSort={handleSort}
                      >
                        Firmenname
                      </SortableTableHeader>
                      <SortableTableHeader
                        column="vatNumber"
                        currentSortColumn={sortColumn}
                        currentSortDirection={sortDirection}
                        onSort={handleSort}
                      >
                        USt-ID
                      </SortableTableHeader>
                      <SortableTableHeader
                        column="billingAddress"
                        currentSortColumn={sortColumn}
                        currentSortDirection={sortDirection}
                        onSort={handleSort}
                      >
                        Stadt
                      </SortableTableHeader>
                      <SortableTableHeader
                        column="rating"
                        currentSortColumn={sortColumn}
                        currentSortDirection={sortDirection}
                        onSort={handleSort}
                      >
                        Bewertung
                      </SortableTableHeader>
                      <SortableTableHeader
                        column="email"
                        currentSortColumn={sortColumn}
                        currentSortDirection={sortDirection}
                        onSort={handleSort}
                      >
                        E-Mail
                      </SortableTableHeader>
                      <SortableTableHeader
                        column="phone"
                        currentSortColumn={sortColumn}
                        currentSortDirection={sortDirection}
                        onSort={handleSort}
                      >
                        Telefon
                      </SortableTableHeader>
                      <TableHead className="w-24">Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => {
                      const isSelected = selectedRows.has(customer._id);
                      return (
                        <TableRow
                          key={customer._id}
                          className={`group cursor-pointer ${
                            isSelected ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => handleCustomerClick(customer._id)}
                        >
                          <TableCell
                            onClick={(e) => e.stopPropagation()}
                            className="w-12"
                          >
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) =>
                                handleSelectRow(customer._id, !!checked)
                              }
                              aria-label={`${customer.companyName} auswählen`}
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              {customer.companyName}
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {customer.vatNumber || (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {customer.billingAddress?.city || (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={getRatingBadgeVariant(customer.rating)}
                            >
                              {customer.rating}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {customer.email || (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {customer.phone || (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell
                            onClick={(e) => e.stopPropagation()}
                            className="w-24"
                          >
                            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) =>
                                  handleViewClick(e, customer._id)
                                }
                                aria-label="Details anzeigen"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) =>
                                  handleEditClick(e, customer._id)
                                }
                                aria-label="Bearbeiten"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    aria-label="Weitere Aktionen"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>
                                    Aktionen
                                  </DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewClick(e, customer._id);
                                    }}
                                  >
                                    Details anzeigen
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditClick(e, customer._id);
                                    }}
                                  >
                                    Bearbeiten
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      console.log('Duplicate:', customer._id);
                                    }}
                                  >
                                    Duplizieren
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      console.log('Deactivate:', customer._id);
                                    }}
                                  >
                                    Deaktivieren
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (
                                        window.confirm(
                                          `Möchten Sie "${customer.companyName}" wirklich löschen?`
                                        )
                                      ) {
                                        console.log('Delete:', customer._id);
                                      }
                                    }}
                                  >
                                    Löschen
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {paginationInfo.totalPages > 1 && (
                <div className="flex items-center justify-between border-t px-4 py-3">
                  <div className="text-sm text-muted-foreground">
                    Zeige {paginationInfo.startIndex}-{paginationInfo.endIndex}{' '}
                    von {paginationInfo.total} Kunden
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          className={
                            !paginationInfo.hasPreviousPage
                              ? 'pointer-events-none opacity-50'
                              : 'cursor-pointer'
                          }
                        />
                      </PaginationItem>
                      {Array.from({ length: paginationInfo.totalPages })
                        .map((_, i) => i + 1)
                        .filter((p) => {
                          // Show first, last, current, and adjacent pages
                          return (
                            p === 1 ||
                            p === paginationInfo.totalPages ||
                            Math.abs(p - page) <= 1
                          );
                        })
                        .map((p, index, array) => {
                          // Add ellipsis if there's a gap
                          const prev = array[index - 1];
                          const showEllipsisBefore = prev && p - prev > 1;
                          return (
                            <React.Fragment key={p}>
                              {showEllipsisBefore && (
                                <PaginationItem>
                                  <PaginationEllipsis />
                                </PaginationItem>
                              )}
                              <PaginationItem>
                                <PaginationLink
                                  onClick={() => setPage(p)}
                                  isActive={p === page}
                                  className="cursor-pointer"
                                >
                                  {p}
                                </PaginationLink>
                              </PaginationItem>
                            </React.Fragment>
                          );
                        })}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setPage((p) =>
                              Math.min(paginationInfo.totalPages, p + 1)
                            )
                          }
                          className={
                            !paginationInfo.hasNextPage
                              ? 'pointer-events-none opacity-50'
                              : 'cursor-pointer'
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                  <div className="text-sm text-muted-foreground">
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPage(1);
                      }}
                      className="rounded-md border bg-background px-2 py-1"
                    >
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    {' Zeilen pro Seite'}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Filter Sheet */}
      <FilterSheet
        open={filterOpen}
        onOpenChange={setFilterOpen}
        title="Filter"
        activeFilterCount={activeFilterCount}
        resultsCount={pagination?.total || 0}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Bewertung</label>
            <div className="mt-2 space-y-2">
              {(['A', 'B', 'C'] as const).map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox
                    checked={activeFilters.rating?.includes(rating) || false}
                    onCheckedChange={(checked) => {
                      setActiveFilters((prev) => ({
                        ...prev,
                        rating: checked
                          ? [...(prev.rating || []), rating]
                          : prev.rating?.filter((r) => r !== rating) || [],
                      }));
                    }}
                  />
                  <label className="text-sm font-normal cursor-pointer">
                    {rating}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FilterSheet>
    </div>
  );
}

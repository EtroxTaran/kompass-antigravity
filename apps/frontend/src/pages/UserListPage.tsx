import {
  Eye,
  MoreVertical,
  Pencil,
  Search,
  Trash2,
  UserPlus,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { UserForm } from '@/components/user/UserForm';
import { useDebounce } from '@/hooks/useDebounce';
import { useUsers, useDeleteUser } from '@/hooks/useUsers';

import type { SortDirection } from '@/utils/table-utils';
import type { UserRole } from '@kompass/shared/constants/rbac.constants';
import type { User } from '@kompass/shared/types/entities/user';

/**
 * Role display labels (German)
 */
const ROLE_LABELS: Record<UserRole, string> = {
  ADM: 'Außendienst',
  INNEN: 'Innendienst',
  PLAN: 'Planung',
  KALK: 'Kalkulation',
  BUCH: 'Buchhaltung',
  GF: 'Geschäftsführer',
  ADMIN: 'Administrator',
};

/**
 * User List Page Component
 *
 * Displays a comprehensive table of all users with search, filtering,
 * sorting, pagination, and actions.
 * Only GF and ADMIN roles can access this page.
 *
 * Features:
 * - Integrated controls bar (search, filter, actions)
 * - Sortable table columns with indicators
 * - Client-side pagination
 * - Action buttons on row hover
 * - Filter sheet with role and status filters
 * - Create/edit user dialogs
 * - Loading and error states
 * - Empty states with icons
 * - Mobile-responsive design
 */
export function UserListPage(): React.ReactElement {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Filter state
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{
    role?: UserRole[];
    active?: boolean[];
  }>({});
  const activeFilterCount = useMemo(() => {
    return (
      (activeFilters.role?.length || 0) + (activeFilters.active?.length || 0)
    );
  }, [activeFilters]);

  // Sort state
  const [sortColumn, setSortColumn] = useState<string>('displayName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Build filters for API
  const apiFilters = useMemo(() => {
    const filters: {
      search?: string;
      email?: string;
      role?: UserRole;
      active?: boolean;
    } = {};

    if (debouncedSearch) {
      filters.search = debouncedSearch;
    }

    // Apply role filter (use first selected role for now)
    if (activeFilters.role && activeFilters.role.length > 0) {
      filters.role = activeFilters.role[0];
    }

    // Apply active filter (use first selected active status for now)
    if (activeFilters.active && activeFilters.active.length > 0) {
      filters.active = activeFilters.active[0];
    }

    return filters;
  }, [debouncedSearch, activeFilters.role, activeFilters.active]);

  // Fetch users with server-side pagination and sorting
  const {
    data: paginatedResponse,
    isLoading,
    error,
  } = useUsers({
    filters: apiFilters,
    page,
    pageSize,
    sortBy: sortColumn,
    sortOrder: sortDirection,
  });

  const users = paginatedResponse?.data || [];
  const pagination = paginatedResponse?.pagination;

  const deleteUserMutation = useDeleteUser();

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
      displayName: 'displayName',
      email: 'email',
      primaryRole: 'primaryRole',
      createdAt: 'createdAt',
      modifiedAt: 'modifiedAt',
    };

    const apiSortField = sortFieldMap[column] || column;
    setSortColumn(apiSortField);
    setSortDirection(direction);
    setPage(1); // Reset to first page when sorting
  };

  const handleCreateClick = (): void => {
    setSelectedUser(null);
    setCreateDialogOpen(true);
  };

  const handleEditClick = (user: User): void => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = async (user: User): Promise<void> => {
    if (
      window.confirm(
        `Möchten Sie den Benutzer "${user.displayName}" wirklich löschen?`
      )
    ) {
      try {
        await deleteUserMutation.mutateAsync(user._id);
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const handleUserClick = (userId: string): void => {
    navigate(`/admin/users/${userId}`);
  };

  // Handle filters
  const handleApplyFilters = (): void => {
    setPage(1);
    setFilterOpen(false);
  };

  const handleResetFilters = (): void => {
    setActiveFilters({});
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Fehler</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">
              Fehler beim Laden der Benutzer:{' '}
              {error instanceof Error ? error.message : 'Unbekannter Fehler'}
            </p>
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
          <h1 className="text-3xl font-bold">Benutzerverwaltung</h1>
          <p className="text-muted-foreground mt-2">
            Verwalten Sie Benutzer und Rollen
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
        searchPlaceholder="Benutzer suchen (Name oder E-Mail)..."
        activeFilterCount={activeFilterCount}
        onFilterClick={() => setFilterOpen(true)}
        primaryAction={{
          label: 'Neuer Benutzer',
          onClick: handleCreateClick,
          icon: <UserPlus className="h-4 w-4" />,
        }}
      />

      {/* Active Filters Bar */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 rounded-md bg-accent/50 p-3 text-sm">
          <span className="text-muted-foreground">Aktive Filter:</span>
          {activeFilters.role?.map((role) => (
            <Badge key={role} variant="secondary" className="gap-1">
              Rolle: {ROLE_LABELS[role]}
              <button
                onClick={() => {
                  setActiveFilters((prev) => ({
                    ...prev,
                    role: prev.role?.filter((r) => r !== role),
                  }));
                }}
                className="ml-1 rounded-full hover:bg-muted"
                aria-label={`Filter ${role} entfernen`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {activeFilters.active?.map((active) => (
            <Badge key={String(active)} variant="secondary" className="gap-1">
              Status: {active ? 'Aktiv' : 'Inaktiv'}
              <button
                onClick={() => {
                  setActiveFilters((prev) => ({
                    ...prev,
                    active: prev.active?.filter((a) => a !== active),
                  }));
                }}
                className="ml-1 rounded-full hover:bg-muted"
                aria-label={`Filter ${active ? 'Aktiv' : 'Inaktiv'} entfernen`}
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

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          {users.length === 0 ? (
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
                  ? 'Keine Benutzer gefunden'
                  : 'Noch keine Benutzer vorhanden'}
              </h3>
              <p className="mt-2 text-center text-sm text-muted-foreground max-w-md">
                {searchTerm || activeFilterCount > 0
                  ? `Keine Ergebnisse für "${searchTerm}" mit aktiven Filtern`
                  : 'Beginnen Sie mit dem Hinzufügen Ihres ersten Benutzers'}
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
                  <Button onClick={handleCreateClick}>
                    Ersten Benutzer anlegen
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
                      <SortableTableHeader
                        column="displayName"
                        currentSortColumn={sortColumn}
                        currentSortDirection={sortDirection}
                        onSort={handleSort}
                      >
                        Name
                      </SortableTableHeader>
                      <SortableTableHeader
                        column="email"
                        currentSortColumn={sortColumn}
                        currentSortDirection={sortDirection}
                        onSort={handleSort}
                      >
                        E-Mail
                      </SortableTableHeader>
                      <TableHead>Rollen</TableHead>
                      <SortableTableHeader
                        column="primaryRole"
                        currentSortColumn={sortColumn}
                        currentSortDirection={sortDirection}
                        onSort={handleSort}
                      >
                        Hauptrolle
                      </SortableTableHeader>
                      <SortableTableHeader
                        column="active"
                        currentSortColumn={sortColumn}
                        currentSortDirection={sortDirection}
                        onSort={handleSort}
                      >
                        Status
                      </SortableTableHeader>
                      <TableHead className="text-right">Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow
                        key={user._id}
                        className="group cursor-pointer"
                        onClick={() => handleUserClick(user._id)}
                      >
                        <TableCell className="font-medium">
                          {user.displayName}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.roles.map((role) => (
                              <Badge
                                key={role}
                                variant={
                                  role === user.primaryRole
                                    ? 'default'
                                    : 'outline'
                                }
                              >
                                {ROLE_LABELS[role]}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">
                            {ROLE_LABELS[user.primaryRole]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={user.active ? 'default' : 'secondary'}
                          >
                            {user.active ? 'Aktiv' : 'Inaktiv'}
                          </Badge>
                        </TableCell>
                        <TableCell
                          className="text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEditClick(user)}
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
                                <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUserClick(user._id);
                                  }}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  Details anzeigen
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditClick(user);
                                  }}
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Bearbeiten
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteClick(user);
                                  }}
                                  disabled={deleteUserMutation.isPending}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Löschen
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {paginationInfo.totalPages > 1 && (
                <div className="flex items-center justify-between border-t px-4 py-3">
                  <div className="text-sm text-muted-foreground">
                    Zeige {paginationInfo.startIndex}-{paginationInfo.endIndex}{' '}
                    von {paginationInfo.total} Benutzern
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
                          return (
                            p === 1 ||
                            p === paginationInfo.totalPages ||
                            Math.abs(p - page) <= 1
                          );
                        })
                        .map((p, index, array) => {
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

      {/* Create User Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Neuen Benutzer erstellen</DialogTitle>
            <DialogDescription>
              Erstellen Sie einen neuen Benutzer mit E-Mail, Passwort und
              Rollen.
            </DialogDescription>
          </DialogHeader>
          <UserForm
            onSuccess={() => {
              setCreateDialogOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Benutzer bearbeiten</DialogTitle>
            <DialogDescription>
              Bearbeiten Sie Benutzerinformationen und Rollen.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <UserForm
              user={selectedUser}
              onSuccess={() => {
                setEditDialogOpen(false);
                setSelectedUser(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

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
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium">Rolle</label>
            <div className="mt-2 space-y-2">
              {Object.entries(ROLE_LABELS).map(([role, label]) => (
                <div key={role} className="flex items-center space-x-2">
                  <Checkbox
                    checked={
                      activeFilters.role?.includes(role as UserRole) || false
                    }
                    onCheckedChange={(checked) => {
                      setActiveFilters((prev) => ({
                        ...prev,
                        role: checked
                          ? [...(prev.role || []), role as UserRole]
                          : prev.role?.filter((r) => r !== role) || [],
                      }));
                    }}
                  />
                  <label className="text-sm font-normal cursor-pointer">
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Status</label>
            <div className="mt-2 space-y-2">
              {[
                { value: true, label: 'Aktiv' },
                { value: false, label: 'Inaktiv' },
              ].map(({ value, label }) => (
                <div
                  key={String(value)}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    checked={activeFilters.active?.includes(value) || false}
                    onCheckedChange={(checked) => {
                      setActiveFilters((prev) => ({
                        ...prev,
                        active: checked
                          ? [...(prev.active || []), value]
                          : prev.active?.filter((a) => a !== value) || [],
                      }));
                    }}
                  />
                  <label className="text-sm font-normal cursor-pointer">
                    {label}
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

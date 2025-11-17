import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { customerService } from '@/services/customer.service';

import type { Customer } from '@kompass/shared/types/entities/customer';

/**
 * Customer List Page Component
 *
 * Displays a table of all customers with search and filtering capabilities.
 * Follows patterns from GitHub UI reference repository: EtroxTaran/Kompassuimusterbibliothek
 * Reference source: src/components/CustomerListDemo.tsx
 *
 * Features:
 * - Table view with customer information
 * - Search functionality
 * - Loading and error states
 * - Empty state handling
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
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const filters = searchTerm
        ? {
            search: searchTerm,
            sortBy: 'companyName',
            sortOrder: 'asc' as const,
          }
        : {
            sortBy: 'companyName',
            sortOrder: 'asc' as const,
          };

      const data = await customerService.getAll(filters);
      setCustomers(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('Fehler beim Laden der Kunden')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (): void => {
    loadCustomers();
  };

  const handleCustomerClick = (customerId: string): void => {
    navigate(`/customers/${customerId}`);
  };

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
            <p className="text-destructive">{error.message}</p>
            <Button onClick={loadCustomers} className="mt-4">
              Erneut versuchen
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Kunden</h1>
          <p className="text-muted-foreground mt-2">
            Verwalten Sie Ihre Kundenbeziehungen
          </p>
        </div>
        <Button onClick={() => navigate('/customers/new')}>
          Neuer Kunde
        </Button>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle>Suche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Kundenname, USt-ID oder Stadt suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              className="flex-1"
            />
            <Button onClick={handleSearch}>Suchen</Button>
          </div>
        </CardContent>
      </Card>

      {/* Customer Table */}
      <Card>
        <CardHeader>
          <CardTitle>Kundenliste</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchTerm
                  ? 'Keine Kunden gefunden, die Ihrer Suche entsprechen.'
                  : 'Keine Kunden vorhanden.'}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => navigate('/customers/new')}
                  className="mt-4"
                >
                  Ersten Kunden erstellen
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Firmenname</TableHead>
                    <TableHead>USt-ID</TableHead>
                    <TableHead>Stadt</TableHead>
                    <TableHead>Bewertung</TableHead>
                    <TableHead>E-Mail</TableHead>
                    <TableHead>Telefon</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow
                      key={customer._id}
                      onClick={() => handleCustomerClick(customer._id)}
                      className="cursor-pointer hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">
                        {customer.companyName}
                      </TableCell>
                      <TableCell>
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
                        <Badge variant={getRatingBadgeVariant(customer.rating)}>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


import {
  ArrowLeft,
  Building2,
  ChevronRight,
  Edit,
  MapPin,
  Mail,
  Phone,
  Globe,
  Star,
  FileText,
  Trash2,
  Plus,
  MoreVertical,
  Copy,
  UserX,
  Lock,
  ExternalLink,
  Euro,
  Target,
  FolderOpen,
  Clock,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import {
  EntityType,
  hasAnyRolePermission,
  Permission,
  UserRole,
  formatAddressMultiLine,
} from '@kompass/shared';

import { CustomerActivityTimeline } from '@/components/customer/CustomerActivityTimeline';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useCustomer } from '@/hooks/useCustomer';
import { customerService } from '@/services/customer.service';

/**
 * Customer Detail Page Component
 *
 * Displays complete customer information in a read-only view.
 * Allows navigation to edit form and deletion (GF only) with confirmation.
 * Implements RBAC field filtering (financial fields hidden for ADM).
 *
 * Features:
 * - Complete customer information display
 * - Read-only view (edit in separate form)
 * - Activity timeline section (MVP placeholder)
 * - Edit button (with RBAC permission check)
 * - Delete button with confirmation (GF only)
 * - Back to list navigation
 * - Mobile-responsive layout
 * - Loading and error states
 * - RBAC field filtering
 *
 * Route: /customers/:id
 *
 * @example
 * ```tsx
 * <Route path="/customers/:id" element={<CustomerDetailPage />} />
 * ```
 */
export function CustomerDetailPage(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch customer data
  const { data: customer, isLoading, error, refetch } = useCustomer(id || '');

  // RBAC permission checks
  const canUpdate = useMemo(() => {
    if (!user || !customer) return false;
    return (
      hasAnyRolePermission(
        user.roles,
        EntityType.Customer,
        Permission.UPDATE
      ) &&
      // ADM can only update own customers
      (!user.roles.includes(UserRole.ADM) || customer.owner === user._id)
    );
  }, [user, customer]);

  const canDelete = useMemo(() => {
    if (!user) return false;
    return hasAnyRolePermission(
      user.roles,
      EntityType.Customer,
      Permission.DELETE
    );
  }, [user]);

  // Check if user can view this customer (record-level permission)
  const canView = useMemo(() => {
    if (!user || !customer) return false;
    // ADM can only view own customers
    if (user.roles.includes(UserRole.ADM) && customer.owner !== user._id) {
      return false;
    }
    // Other roles can view if they have READ permission
    return hasAnyRolePermission(
      user.roles,
      EntityType.Customer,
      Permission.READ
    );
  }, [user, customer]);

  // Check if user can see financial fields (BUCH/GF only)
  const canSeeFinancialFields = useMemo(() => {
    if (!user) return false;
    return (
      user.roles.includes(UserRole.BUCH) || user.roles.includes(UserRole.GF)
    );
  }, [user]);

  // Format currency (EUR, German format)
  const formatCurrency = (value?: number): string => {
    if (value === undefined || value === null) return '-';
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  // Format date (German format: DD.MM.YYYY)
  const formatDate = (date?: Date | string): string => {
    if (!date) return '-';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '-';
    return new Intl.DateTimeFormat('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(dateObj);
  };

  // Format date with time (German format: DD.MM.YYYY HH:MM)
  const formatDateTime = (date?: Date | string): string => {
    if (!date) return '-';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '-';
    return new Intl.DateTimeFormat('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  };


  // Handle delete
  const handleDelete = async (): Promise<void> => {
    if (!id || !customer) return;

    try {
      setIsDeleting(true);
      await customerService.delete(id);
      toast({
        title: 'Kunde gelöscht',
        description: `${customer.companyName} wurde erfolgreich gelöscht.`,
      });
      navigate('/customers');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Fehler beim Löschen des Kunden';
      toast({
        title: 'Fehler',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  // Handle edit
  const handleEdit = (): void => {
    if (id) {
      navigate(`/customers/${id}/edit`);
    }
  };

  // Handle back
  const handleBack = (): void => {
    navigate('/customers');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Error state - 404
  const is404Error =
    error &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'status' in error.response &&
    (error.response as { status?: number }).status === 404;

  if (is404Error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Kunde nicht gefunden</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Der angeforderte Kunde konnte nicht gefunden werden.
            </p>
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zur Liste
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state - 403 (permission denied from API)
  const is403Error =
    error &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'status' in error.response &&
    (error.response as { status?: number }).status === 403;

  // Error state - general error (any error that's not 404 or 403, or missing customer due to error)
  if (error && !is404Error && !is403Error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Fehler</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive mb-4">
              {error instanceof Error
                ? error.message
                : 'Fehler beim Laden der Kundendaten'}
            </p>
            <div className="flex gap-2">
              <Button onClick={handleBack} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Zurück
              </Button>
              <Button onClick={() => refetch()}>Erneut versuchen</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state - missing customer (due to error or not found, but not already handled as 404)
  if (!customer && !isLoading) {
    // This handles cases where customer is missing but we didn't get a 404/403 error
    // (e.g., network errors that don't return a status code, or API returns empty response)
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Fehler</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive mb-4">
              {error instanceof Error
                ? error.message
                : 'Fehler beim Laden der Kundendaten'}
            </p>
            <div className="flex gap-2">
              <Button onClick={handleBack} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Zurück
              </Button>
              <Button onClick={() => refetch()}>Erneut versuchen</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state - 403 (permission denied from API) OR customer exists but user doesn't have permission
  if (is403Error || (customer && !canView)) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Zugriff verweigert</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Sie haben keine Berechtigung, diesen Kunden anzusehen.
            </p>
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zur Liste
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // At this point, customer must be defined (all error cases handled above)
  if (!customer) {
    // This should never happen due to error handling above, but TypeScript needs this check
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Fehler</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive mb-4">
              Fehler beim Laden der Kundendaten
            </p>
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get rating stars count
  const ratingStars =
    customer.rating === 'A' ? 5 : customer.rating === 'B' ? 4 : customer.rating === 'C' ? 3 : 2;

  // Check if user is owner
  const isOwner = user && customer.owner === user._id;

  // Handle duplicate (placeholder)
  const handleDuplicate = (): void => {
    toast({
      title: 'Kunde dupliziert',
      description: 'Die Duplizierung wurde initiiert.',
    });
  };

  // Handle deactivate (placeholder)
  const handleDeactivate = (): void => {
    toast({
      title: 'Kunde deaktiviert',
      description: `${customer.companyName} wurde deaktiviert.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Link
              to="/dashboard"
              className="hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              to="/customers"
              className="hover:text-foreground transition-colors"
            >
              Kunden
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{customer.companyName}</span>
          </div>

          {/* Customer Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1>{customer.companyName}</h1>
                <Badge variant="default">Aktiv</Badge>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                {/* Rating */}
                {customer.rating && (
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: ratingStars }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400">
                      {customer.rating}
                    </Badge>
                  </div>
                )}

                {/* Customer Type */}
                {customer.customerType && (
                  <Badge variant="outline">{customer.customerType}</Badge>
                )}

                {/* Owner (if not owner and ADM) */}
                {user?.roles.includes(UserRole.ADM) && !isOwner && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Nur-Lesen
                  </Badge>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {canUpdate && (
                <Button onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Kunde bearbeiten
                </Button>
              )}
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Neue Opportunity
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDuplicate}>
                    <Copy className="mr-2 h-4 w-4" />
                    Duplizieren
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDeactivate}>
                    <UserX className="mr-2 h-4 w-4" />
                    Deaktivieren
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {canDelete && (
                    <DropdownMenuItem
                      onClick={() => setDeleteDialogOpen(true)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Löschen
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="border-b border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Opportunities */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-accent/60 flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground">Opportunities</p>
                    <p className="text-2xl font-bold">0 aktive</p>
                    <p className="text-muted-foreground">-</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Projects */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-950/20 flex items-center justify-center">
                    <FolderOpen className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-muted-foreground">Projekte</p>
                    <p className="text-2xl font-bold">0 laufend</p>
                    <p className="text-muted-foreground">-</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Revenue */}
            {canSeeFinancialFields && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-950/20 flex items-center justify-center">
                      <Euro className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-muted-foreground">Umsatz</p>
                      <p className="text-2xl font-bold">
                        {customer.totalRevenue !== undefined
                          ? formatCurrency(customer.totalRevenue)
                          : '-'}
                      </p>
                      <p className="text-muted-foreground">
                        {customer.totalRevenue !== undefined
                          ? 'Gesamt'
                          : 'Nicht verfügbar'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Last Activity */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-950/20 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-muted-foreground">Letzte Aktivität</p>
                    <p className="text-2xl font-bold">
                      {customer.modifiedAt
                        ? formatDate(customer.modifiedAt)
                        : '-'}
                    </p>
                    <p className="text-muted-foreground">
                      {customer.modifiedAt ? 'Geändert' : 'Keine Daten'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="locations">
              Standorte ({customer.locations?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="contacts">
              Kontakte ({customer.contactPersons?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="activities">Aktivitäten</TabsTrigger>
          </TabsList>

          {/* Tab 1: Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Master Data */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Stammdaten
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Firmenname</Label>
                      <p>{customer.companyName}</p>
                    </div>
                    {customer.vatNumber && (
                      <div>
                        <Label>Umsatzsteuer-ID</Label>
                        <p className="font-mono">{customer.vatNumber}</p>
                      </div>
                    )}
                    <div>
                      <Label>Kundentyp</Label>
                      <p>{customer.customerType}</p>
                    </div>
                    {customer.customerBusinessType && (
                      <div>
                        <Label>Geschäftstyp</Label>
                        <p>{customer.customerBusinessType}</p>
                      </div>
                    )}
                    {customer.rating && (
                      <div>
                        <Label>Bewertung</Label>
                        <div className="flex items-center gap-2">
                          <span>{customer.rating}</span>
                          <div className="flex gap-0.5">
                            {Array.from({ length: ratingStars }).map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 fill-amber-400 text-amber-400"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    {customer.owner && (
                      <div>
                        <Label>Inhaber</Label>
                        <p>{customer.owner}</p>
                      </div>
                    )}
                    {(customer.legalName ||
                      customer.registrationNumber ||
                      customer.createdAt) && (
                      <div className="col-span-2">
                        {customer.legalName && (
                          <div className="mb-2">
                            <Label>Rechtlicher Name</Label>
                            <p>{customer.legalName}</p>
                          </div>
                        )}
                        {customer.registrationNumber && (
                          <div className="mb-2">
                            <Label>Handelsregisternummer</Label>
                            <p>{customer.registrationNumber}</p>
                          </div>
                        )}
                        <Label>Erstellt</Label>
                        <p>{formatDate(customer.createdAt)}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Billing Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Rechnungsadresse
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {customer.billingAddress ? (
                    <>
                      <div className="space-y-1">
                        <pre className="text-base font-sans whitespace-pre-wrap">
                          {formatAddressMultiLine(customer.billingAddress)}
                        </pre>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <MapPin className="mr-2 h-4 w-4" />
                        Auf Karte anzeigen
                      </Button>
                    </>
                  ) : (
                    <p className="text-muted-foreground">Keine Adresse hinterlegt</p>
                  )}
                </CardContent>
              </Card>

              {/* Contact Data */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Kontaktdaten
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {customer.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`mailto:${customer.email}`}
                          className="text-primary hover:underline"
                        >
                          {customer.email}
                        </a>
                      </div>
                    )}
                    {customer.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a href={`tel:${customer.phone}`} className="hover:underline">
                          {customer.phone}
                        </a>
                      </div>
                    )}
                    {customer.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={customer.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          {customer.website}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Business Data */}
              {canSeeFinancialFields && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Euro className="h-5 w-5" />
                      Geschäftsdaten
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {customer.creditLimit !== undefined && (
                        <>
                          <div className="flex justify-between">
                            <Label>Kreditlimit</Label>
                            <span>{formatCurrency(customer.creditLimit)}</span>
                          </div>
                          <Separator />
                        </>
                      )}
                      {customer.paymentTerms !== undefined && (
                        <>
                          <div className="flex justify-between">
                            <Label>Zahlungsziel</Label>
                            <span>{customer.paymentTerms} Tage</span>
                          </div>
                          <Separator />
                        </>
                      )}
                      {customer.accountBalance !== undefined && (
                        <>
                          <div className="flex justify-between items-center">
                            <Label>Kontostand</Label>
                            <span
                              className={
                                customer.accountBalance > 0
                                  ? 'text-destructive font-semibold'
                                  : 'text-green-600 font-semibold'
                              }
                            >
                              {formatCurrency(customer.accountBalance)}
                            </span>
                          </div>
                          {customer.totalRevenue !== undefined && <Separator />}
                        </>
                      )}
                      {customer.totalRevenue !== undefined && (
                        <>
                          <div className="flex justify-between">
                            <Label>Gesamtumsatz</Label>
                            <span>{formatCurrency(customer.totalRevenue)}</span>
                          </div>
                          {customer.profitMargin !== undefined && <Separator />}
                        </>
                      )}
                      {customer.profitMargin !== undefined && (
                        <div className="flex justify-between">
                          <Label>Gewinnmarge</Label>
                          <span>{customer.profitMargin.toFixed(2)}%</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle>Metadaten</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Erstellt am</Label>
                  <p>{formatDateTime(customer.createdAt)}</p>
                </div>
                <div>
                  <Label>Geändert am</Label>
                  <p>{formatDateTime(customer.modifiedAt)}</p>
                </div>
                {customer.createdBy && (
                  <div>
                    <Label>Erstellt von</Label>
                    <p>{customer.createdBy}</p>
                  </div>
                )}
                {customer.modifiedBy && (
                  <div>
                    <Label>Geändert von</Label>
                    <p>{customer.modifiedBy}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes */}
            {customer.notes && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Notizen
                    </CardTitle>
                    {canUpdate && (
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {customer.notes}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab 2: Locations */}
          <TabsContent value="locations" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3>Standorte</h3>
                <p className="text-muted-foreground">
                  {customer.locations?.length || 0}{' '}
                  {customer.locations?.length === 1 ? 'Standort' : 'Standorte'}
                </p>
              </div>
              {canUpdate && (
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Standort hinzufügen
                </Button>
              )}
            </div>
            {customer.locations && customer.locations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customer.locations.map((locationId, index) => (
                  <Card key={locationId || index} className="hover:bg-accent transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-muted-foreground" />
                          <CardTitle className="text-lg">
                            Standort {index + 1}
                          </CardTitle>
                        </div>
                      </div>
                      <CardDescription>ID: {locationId}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" size="sm" className="w-full">
                        Details anzeigen
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    Keine Standorte vorhanden
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab 3: Contacts */}
          <TabsContent value="contacts" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3>Kontakte</h3>
                <p className="text-muted-foreground">
                  {customer.contactPersons?.length || 0} Kontakte
                </p>
              </div>
              {canUpdate && (
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Kontakt hinzufügen
                </Button>
              )}
            </div>
            {customer.contactPersons && customer.contactPersons.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customer.contactPersons.map((contactId, index) => (
                  <Card key={contactId || index} className="hover:bg-accent transition-colors">
                    <CardHeader>
                      <CardTitle className="text-base">
                        Kontakt {index + 1}
                      </CardTitle>
                      <CardDescription>ID: {contactId}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" size="sm" className="w-full">
                        Details anzeigen
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    Keine Kontakte vorhanden
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab 4: Activities */}
          <TabsContent value="activities" className="space-y-6">
            <CustomerActivityTimeline />
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kunde löschen</AlertDialogTitle>
            <AlertDialogDescription>
              Möchten Sie <strong>{customer.companyName}</strong> wirklich
              löschen? Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Abbrechen
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Löschen...' : 'Löschen'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

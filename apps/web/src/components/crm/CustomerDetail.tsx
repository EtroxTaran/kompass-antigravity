import { Customer } from "@kompass/shared";
import { AlertTriangle, CheckCircle, XCircle, Clock, Star } from "lucide-react";
import { differenceInDays, parseISO, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ContactList } from "./ContactList";
import { ActivityTimeline } from "./ActivityTimeline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectList } from "../pm/ProjectList";
import { InvoiceList } from "../accounting/InvoiceList";
import { OfferList } from "../sales/OfferList";
import { ActiveUserAvatars } from "@/components/presence/ActiveUserAvatars";
import { CustomerLocationList } from "./CustomerLocationList";
import { CustomerProtocolList } from "./CustomerProtocolList";
import { CustomerMetrics } from "./CustomerMetrics";
import { CustomerAuditHistory } from "./CustomerAuditHistory";

interface CustomerDetailProps {
  customer: Customer;
}

// Rating to stars mapping
const ratingStars: Record<string, number> = { A: 5, B: 4, C: 3 };

// Customer type labels
const customerTypeLabels: Record<string, string> = {
  direct_marketer: "Direktvermarkter",
  retail: "Einzelhandel",
  franchise: "Franchise",
  cooperative: "Genossenschaft",
  other: "Sonstige",
};

export function CustomerDetail({ customer }: CustomerDetailProps) {
  const navigate = useNavigate();
  const starCount = customer.rating ? ratingStars[customer.rating] || 0 : 0;

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold tracking-tight">
              {customer.companyName}
            </h2>
            <Badge variant="default" className="uppercase">
              Aktiv
            </Badge>
            <ActiveUserAvatars entityType="customer" entityId={customer._id} />
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {/* Rating Stars */}
            {starCount > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: starCount }).map((_, i) => (
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
              <Badge variant="outline">
                {customerTypeLabels[customer.customerType] ||
                  customer.customerType}
              </Badge>
            )}

            {/* Industry */}
            {customer.industry && (
              <Badge variant="outline">{customer.industry}</Badge>
            )}
          </div>
        </div>

        <Button onClick={() => navigate(`/customers/${customer._id}/edit`)}>
          Kunde bearbeiten
        </Button>
      </div>

      {/* Key Metrics Bar */}
      <CustomerMetrics customerId={customer._id} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Info - Always Visible */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Contact Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-xs font-semibold block text-muted-foreground">
                  Email
                </span>
                <span className="text-sm truncate block" title={customer.email}>
                  {customer.email || "-"}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold block text-muted-foreground">
                  Phone
                </span>
                <span className="text-sm">{customer.phone || "-"}</span>
              </div>
              <div>
                <span className="text-xs font-semibold block text-muted-foreground">
                  Website
                </span>
                <a
                  href={customer.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-600 hover:underline truncate block"
                >
                  {customer.website || "-"}
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Address
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p>
                {customer.billingAddress.street}{" "}
                {customer.billingAddress.streetNumber}
              </p>
              <p>
                {customer.billingAddress.zipCode} {customer.billingAddress.city}
              </p>
              <p>{customer.billingAddress.country}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-semibold">Typ:</span>
                <span className="capitalize">
                  {customer.customerType
                    ? customerTypeLabels[customer.customerType] ||
                    customer.customerType
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Bewertung:</span>
                <div className="flex items-center gap-1">
                  <span>{customer.rating || "-"}</span>
                  {starCount > 0 && (
                    <div className="flex gap-0.5">
                      {Array.from({ length: starCount }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-3 w-3 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Branche:</span>
                <span>{customer.industry || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">USt-ID:</span>
                <span>{customer.vatNumber || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Kreditlimit:</span>
                <span>
                  {customer.creditLimit
                    ? new Intl.NumberFormat("de-DE", {
                      style: "currency",
                      currency: "EUR",
                    }).format(customer.creditLimit)
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Zahlungsbedingungen:</span>
                <span>{customer.paymentTerms || "-"}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Visit & Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Visit Status */}
              <div>
                <span className="text-xs font-semibold block text-muted-foreground mb-1">
                  Visit Planning
                </span>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Frequency:</span>
                    <span>
                      {customer.visitFrequencyDays
                        ? `${customer.visitFrequencyDays} days`
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Visit:</span>
                    <span>
                      {customer.lastVisit
                        ? format(parseISO(customer.lastVisit), "dd.MM.yyyy")
                        : "-"}
                    </span>
                  </div>

                  {customer.visitFrequencyDays && customer.lastVisit && (
                    <div className="mt-2">
                      {differenceInDays(
                        new Date(),
                        parseISO(customer.lastVisit),
                      ) > customer.visitFrequencyDays ? (
                        <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-2 rounded text-xs font-medium">
                          <AlertTriangle className="h-4 w-4" />
                          <span>Visit Overdue</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 p-2 rounded text-xs font-medium">
                          <CheckCircle className="h-4 w-4" />
                          <span>On Schedule</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* DSGVO Status */}
              <div>
                <span className="text-xs font-semibold block text-muted-foreground mb-1">
                  Compliance (DSGVO)
                </span>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Marketing:</span>
                    {customer.dsgvoConsent?.marketing ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-gray-300" />
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span>AI Processing:</span>
                    {customer.dsgvoConsent?.aiProcessing ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-gray-300" />
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Data Sharing:</span>
                    {customer.dsgvoConsent?.dataSharing ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-gray-300" />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Areas with Tabs */}
        <div className="md:col-span-3">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="locations">Locations</TabsTrigger>
              <TabsTrigger value="protocols">Protocols</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="sales">Sales & Finance</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <ActivityTimeline
                customerId={customer._id}
                customerName={customer.companyName}
              />
            </TabsContent>

            <TabsContent value="contacts">
              <ContactList customerId={customer._id} />
            </TabsContent>

            <TabsContent value="locations">
              <CustomerLocationList customerId={customer._id} />
            </TabsContent>

            <TabsContent value="protocols">
              <CustomerProtocolList customerId={customer._id} />
            </TabsContent>

            <TabsContent value="projects">
              <ProjectList customerId={customer._id} />
            </TabsContent>

            <TabsContent value="sales">
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Offers</h3>
                  <OfferList customerId={customer._id} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Invoices</h3>
                  <InvoiceList customerId={customer._id} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history">
              <CustomerAuditHistory customerId={customer._id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

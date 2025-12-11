import { Customer } from "@kompass/shared";
import { AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react";
import { differenceInDays, parseISO, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface CustomerDetailProps {
  customer: Customer;
}

export function CustomerDetail({ customer }: CustomerDetailProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold tracking-tight">
              {customer.companyName}
            </h2>
            <ActiveUserAvatars entityType="customer" entityId={customer._id} />
          </div>
          <p className="text-muted-foreground">Customer Detail View</p>
        </div>
        <Button onClick={() => navigate(`/ customers / ${customer._id}/edit`)}>
          Edit Customer
        </Button>
      </div>

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
                <span className="font-semibold">Type:</span>
                <span className="capitalize">{customer.customerType}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Rating:</span>
                <span>{customer.rating}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">VAT:</span>
                <span>{customer.vatNumber || "-"}</span>
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
          </Tabs>
        </div>
      </div>
    </div>
  );
}

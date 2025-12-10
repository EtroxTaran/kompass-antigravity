import { useParams, useNavigate } from "react-router-dom";
import { useOffer } from "@/hooks/useOffers";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, FileText, Calendar, User, Download, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { CommentSection } from "@/components/common/comments/CommentSection";
import { useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface OfferItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

function OfferItems({ items }: { items: OfferItem[] }) {
  if (!items || items.length === 0) {
    return <p className="text-muted-foreground py-4">No items in this offer.</p>;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Positions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item: OfferItem, i: number) => (
              <TableRow key={item.id || i}>
                <TableCell>{item.description}</TableCell>
                <TableCell className="text-right font-mono">
                  {item.quantity}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {new Intl.NumberFormat("de-DE", {
                    style: "currency",
                    currency: "EUR",
                  }).format(item.unitPrice)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {new Intl.NumberFormat("de-DE", {
                    style: "currency",
                    currency: "EUR",
                  }).format(item.quantity * item.unitPrice)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function OfferDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { offer, loading } = useOffer(id);
  const queryClient = useQueryClient();

  if (loading) return <div>Loading...</div>;
  if (!offer) return <div>Offer not found</div>;

  const subtotal =
    offer.lineItems?.reduce(
      (sum: number, item: OfferItem) => sum + item.quantity * item.unitPrice,
      0,
    ) || 0;
  const discountAmount = subtotal * ((offer.discountPercent || 0) / 100);
  const netTotal = subtotal - discountAmount;
  const taxAmount = netTotal * (offer.taxRate || 0.19);
  const grossTotal = netTotal + taxAmount;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/offers")} // Changed to /offers to match previous expected path if /sales/offers was wrong? 
          // Previous code had /sales/offers in one place and /offers in another. Assuming /offers or /sales/offers depending on routes.
          // Let's stick navigate(-1) or just /offers.
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Offer {offer.offerNumber || "DRAFT"}
            </h1>
            <Badge variant="outline" className="capitalize mt-1">
              {offer.status}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => alert("PDF generation is planned for Phase 7")}
          >
            <Download className="mr-2 h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" /> Send
          </Button>
          <Button onClick={() => navigate(`/offers/${id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customer</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{offer.customerId}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Project</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{offer.projectId || "-"}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valid Until</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {offer.validUntil ? format(new Date(offer.validUntil), "dd.MM.yyyy") : "-"}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>MetaData</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Creation Date</span>
                  <span>{format(new Date(offer.offerDate), "dd.MM.yyyy")}</span>
                </div>
                <div className="flex justify-between border-b pb-2 pt-2">
                  <span className="font-semibold">Payment Terms</span>
                  <span>{offer.paymentTerms || "-"}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="font-semibold">Delivery Terms</span>
                  <span>{offer.deliveryTerms || "-"}</span>
                </div>
              </CardContent>
            </Card>

            {offer.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">{offer.notes}</CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="items" className="space-y-4">
          <OfferItems items={offer.lineItems || []} />

          {/* Totals Summary */}
          <div className="flex justify-end mt-4">
            <Card className="w-80">
              <CardContent className="pt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(subtotal)}</span>
                </div>
                {offer.discountPercent && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Discount ({offer.discountPercent}%):</span>
                    <span>- {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-medium">
                  <span>Net:</span>
                  <span>{new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(netTotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>VAT ({(offer.taxRate || 0.19) * 100}%):</span>
                  <span>{new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(taxAmount)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                  <span>Total:</span>
                  <span>{new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(grossTotal)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comments" className="h-[600px]">
          <CommentSection
            entityType="offer"
            entityId={offer._id}
            comments={offer.comments || []}
            onCommentAdded={() => {
              queryClient.invalidateQueries({ queryKey: ['offers', id] });
            }}
            onCommentResolved={() => {
              queryClient.invalidateQueries({ queryKey: ['offers', id] });
            }}
          />
        </TabsContent>

      </Tabs>
    </div>
  );
}

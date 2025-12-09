import { useParams, useNavigate } from "react-router-dom";
import { useOffer } from "@/hooks/useOffers";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, FileText } from "lucide-react";
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

export function OfferDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { offer, loading } = useOffer(id);

  if (loading) return <div>Loading...</div>;
  if (!offer) return <div>Offer not found</div>;

  const subtotal =
    offer.lineItems?.reduce(
      (sum: number, item: any) => sum + item.quantity * item.unitPrice,
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
            onClick={() => navigate("/sales/offers")}
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
            <FileText className="mr-2 h-4 w-4" />
            Preview PDF
          </Button>
          <Button onClick={() => navigate(`/sales/offers/${id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
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
                {offer.lineItems?.map((item: any, i: number) => (
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
            <div className="mt-4 flex flex-col items-end space-y-1 text-sm">
              <div className="flex justify-between w-48">
                <span>Subtotal:</span>
                <span>
                  {new Intl.NumberFormat("de-DE", {
                    style: "currency",
                    currency: "EUR",
                  }).format(subtotal)}
                </span>
              </div>
              {offer.discountPercent ? (
                <div className="flex justify-between w-48 text-muted-foreground">
                  <span>Discount ({offer.discountPercent}%):</span>
                  <span>
                    -{" "}
                    {new Intl.NumberFormat("de-DE", {
                      style: "currency",
                      currency: "EUR",
                    }).format(discountAmount)}
                  </span>
                </div>
              ) : null}
              <div className="flex justify-between w-48 font-medium">
                <span>Net:</span>
                <span>
                  {new Intl.NumberFormat("de-DE", {
                    style: "currency",
                    currency: "EUR",
                  }).format(netTotal)}
                </span>
              </div>
              <div className="flex justify-between w-48 text-muted-foreground">
                <span>VAT ({(offer.taxRate || 0.19) * 100}%):</span>
                <span>
                  {new Intl.NumberFormat("de-DE", {
                    style: "currency",
                    currency: "EUR",
                  }).format(taxAmount)}
                </span>
              </div>
              <div className="flex justify-between w-48 font-bold text-lg border-t pt-1 mt-1">
                <span>Total:</span>
                <span>
                  {new Intl.NumberFormat("de-DE", {
                    style: "currency",
                    currency: "EUR",
                  }).format(grossTotal)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <span className="font-semibold block">Customer</span>
                {/* Ideally link to customer */}
                <span>{offer.customerId}</span>
              </div>
              <div>
                <span className="font-semibold block">Date</span>
                <span>{format(new Date(offer.offerDate), "dd.MM.yyyy")}</span>
              </div>
              <div>
                <span className="font-semibold block">Valid Until</span>
                <span>{format(new Date(offer.validUntil), "dd.MM.yyyy")}</span>
              </div>
              <div>
                <span className="font-semibold block">Payment Terms</span>
                <span>{offer.paymentTerms || "-"}</span>
              </div>
              <div>
                <span className="font-semibold block">Delivery Terms</span>
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
      </div>
    </div>
  );
}

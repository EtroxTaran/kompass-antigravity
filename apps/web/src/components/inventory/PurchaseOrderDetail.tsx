import { useParams, useNavigate } from "react-router-dom";
import { usePurchaseOrder } from "@/hooks/usePurchaseOrder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Send,
  Printer,
  FileCheck,
  AlertTriangle,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatCurrency } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useSupplier } from "@/hooks/useSupplier";

export function PurchaseOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    order,
    loading,
    error,
    submitForApproval,
    approveOrder,
    rejectOrder,
  } = usePurchaseOrder(id);

  // Fetch supplier name separately if not in order object (often order only has supplierId)
  // But for now display supplierId or add useSupplier hook if needed.
  const { supplier } = useSupplier(order?.supplierId);

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  if (loading) return <div className="p-8 text-center">Lade Bestellung...</div>;
  if (error || !order)
    return (
      <div className="p-8 text-center text-red-500">
        Fehler beim Laden der Bestellung.
      </div>
    );

  const handleApprove = async () => {
    try {
      await approveOrder();
    } catch (e) {
      alert("Fehler bei der Genehmigung: " + (e as Error).message);
    }
  };

  const handleReject = async () => {
    try {
      await rejectOrder(rejectionReason);
      setRejectDialogOpen(false);
      setRejectionReason("");
    } catch (e) {
      alert("Fehler bei der Ablehnung: " + (e as Error).message);
    }
  };

  const handleSubmit = async () => {
    try {
      await submitForApproval();
    } catch (e) {
      alert("Fehler: " + (e as Error).message);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/purchase-orders")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Bestellung {order.orderNumber}
          </h1>
          <p className="text-muted-foreground text-sm">
            Erstellt am {formatDate(order.date)}
          </p>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Drucken
          </Button>

          {/* Workflow Actions */}
          {order.status === "draft" && (
            <Button onClick={handleSubmit}>
              <FileCheck className="mr-2 h-4 w-4" />
              Zur Genehmigung
            </Button>
          )}

          {order.approvalStatus === "pending" && (
            <>
              <Button
                variant="default"
                className="bg-green-600 hover:bg-green-700"
                onClick={handleApprove}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Genehmigen
              </Button>
              <Dialog
                open={rejectDialogOpen}
                onOpenChange={setRejectDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <XCircle className="mr-2 h-4 w-4" />
                    Ablehnen
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Bestellung ablehnen</DialogTitle>
                    <DialogDescription>
                      Bitte geben Sie einen Grund für die Ablehnung an.
                    </DialogDescription>
                  </DialogHeader>
                  <Textarea
                    placeholder="Begründung..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setRejectDialogOpen(false)}
                    >
                      Abbrechen
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleReject}
                      disabled={!rejectionReason}
                    >
                      Ablehnen
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}

          {order.status === "ordered" && (
            <Button variant="secondary">
              <Send className="mr-2 h-4 w-4" />
              An Lieferant senden
            </Button>
          )}
        </div>
      </div>

      {/* Status Banners */}
      {order.approvalStatus === "pending" && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle
                className="h-5 w-5 text-yellow-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Diese Bestellung wartet auf Genehmigung.
              </p>
            </div>
          </div>
        </div>
      )}
      {order.approvalStatus === "rejected" && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Abgelehnt</h3>
              <p className="text-sm text-red-700 mt-1">
                Grund: {order.rejectionReason}
              </p>
              <div className="mt-2">
                <Button
                  variant="link"
                  className="text-red-800 p-0 h-auto font-semibold"
                  onClick={() => navigate(`/purchase-orders/${order._id}/edit`)}
                >
                  Bearbeiten und erneut einreichen &rarr;
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Positionen</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Beschreibung</TableHead>
                  <TableHead className="text-right">Menge</TableHead>
                  <TableHead className="text-right">Preis</TableHead>
                  <TableHead className="text-right">Gesamt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {item.description}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.unitPrice, order.currency)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.totalPrice, order.currency)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Separator className="my-4" />
            <div className="flex justify-end items-center gap-4 text-lg font-bold">
              <span>Gesamtsumme:</span>
              <span>{formatCurrency(order.totalAmount, order.currency)}</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-muted-foreground">Status:</div>
                <div>
                  <Badge variant="outline">{order.status}</Badge>
                </div>

                <div className="text-muted-foreground">Genehmigungsstatus:</div>
                <div>
                  <Badge
                    variant={
                      order.approvalStatus === "approved"
                        ? "default"
                        : order.approvalStatus === "rejected"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {order.approvalStatus || "N/A"}
                  </Badge>
                </div>

                <div className="text-muted-foreground">Lieferdatum:</div>
                <div>
                  {order.expectedDeliveryDate
                    ? formatDate(order.expectedDeliveryDate)
                    : "-"}
                </div>

                <div className="text-muted-foreground">Lieferant:</div>
                <div className="font-medium">
                  {supplier?.companyName || order.supplierId}
                </div>
              </div>
            </CardContent>
          </Card>

          {order.approvedBy && (
            <Card>
              <CardHeader>
                <CardTitle>Genehmigung</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Genehmigt von:</span>
                  <span>{order.approvedBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Am:</span>
                  <span>
                    {order.approvedAt && formatDate(order.approvedAt)}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

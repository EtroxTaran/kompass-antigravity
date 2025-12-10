import { useNavigate } from "react-router-dom";
import { usePurchaseOrders } from "@/hooks/usePurchaseOrder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ShoppingCart } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatCurrency } from "@/lib/utils";

export function PurchaseOrderList() {
  const navigate = useNavigate();
  const { orders, loading } = usePurchaseOrders();

  if (loading) return <div>Lade Bestellungen...</div>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "received":
        return "bg-green-100 text-green-800";
      case "ordered":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getApprovalStatusColor = (status?: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getApprovalLabel = (status?: string) => {
    switch (status) {
      case "approved": return "Genehmigt";
      case "rejected": return "Abgelehnt";
      case "pending": return "Ausstehend";
      default: return "-";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Bestellungen</CardTitle>
        <div className="flex gap-2">
          <Button onClick={() => navigate("/purchase-orders/new")}>
            <Plus className="mr-2 h-4 w-4" /> Neue Bestellung
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nr.</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead>Lieferant (ID)</TableHead>
                <TableHead className="text-right">Betrag</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Genehmigung</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center h-24 text-muted-foreground"
                  >
                    Keine Bestellungen gefunden.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow
                    key={order._id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() =>
                      navigate(`/purchase-orders/${order._id}/edit`)
                    }
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <ShoppingCart className="mr-2 h-4 w-4 text-muted-foreground" />
                        {order.orderNumber}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(order.date)}</TableCell>
                    <TableCell>{order.supplierId}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(order.totalAmount, order.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusColor(order.status)}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {order.approvalStatus && (
                        <Badge
                          variant="outline"
                          className={getApprovalStatusColor(order.approvalStatus)}
                        >
                          {getApprovalLabel(order.approvalStatus)}
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

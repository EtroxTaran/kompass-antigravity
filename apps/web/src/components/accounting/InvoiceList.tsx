import { useNavigate } from "react-router-dom";
import { useInvoices } from "@/hooks/useInvoice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Calendar, Wallet } from "lucide-react";
import { format } from "date-fns";

interface InvoiceListProps {
  customerId?: string;
  projectId?: string;
}

export function InvoiceList({ customerId, projectId }: InvoiceListProps) {
  const navigate = useNavigate();
  const { invoices, loading } = useInvoices({ customerId, projectId });

  if (loading) return <div>Loading...</div>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500";
      case "sent":
        return "bg-blue-500";
      case "overdue":
        return "bg-red-500";
      case "cancelled":
        return "bg-gray-500";
      default:
        return "bg-yellow-500";
    }
  };

  const totalRevenue = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.totalNet, 0);

  const openRevenue = invoices
    .filter((i) => i.status === "sent" || i.status === "overdue")
    .reduce((sum, i) => sum + i.totalNet, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Rechnungen</h1>
        <Button onClick={() => navigate("/invoices/new")}>
          <Plus className="h-4 w-4 mr-2" /> Neue Rechnung
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Umsatz (Paid)</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalRevenue.toFixed(2)} €
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Offen (Pending)
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {openRevenue.toFixed(2)} €
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        {invoices.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <FileText className="h-8 w-8 mb-2" />
              <p>Keine Rechnungen vorhanden.</p>
            </CardContent>
          </Card>
        ) : (
          invoices.map((invoice) => (
            <Card
              key={invoice._id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => navigate(`/invoices/${invoice._id}`)}
            >
              <CardContent className="flex items-center justify-between p-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{invoice.invoiceNumber}</span>
                    <Badge className={getStatusColor(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(invoice.date), "dd.MM.yyyy")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">
                    {invoice.totalGross.toFixed(2)} €
                  </p>
                  <p className="text-xs text-muted-foreground">Gross</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

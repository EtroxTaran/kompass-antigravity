import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Receipt,
  TrendingDown,
  TrendingUp,
  Plus,
} from "lucide-react";
import { useInvoices } from "@/hooks/useInvoice";
import { useExpenses } from "@/hooks/useExpense";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export function BUCHDashboard() {
  const navigate = useNavigate();
  const { invoices } = useInvoices();
  const { expenses } = useExpenses();

  // Filter for open invoices (mock logic for 'open' based on status if available, or just all)
  // Assuming 'sent' or 'draft' means unpaid for now if no paymentStatus field explicitly managed yet.
  const openInvoices = invoices
    .filter((i) => i.status !== "paid" && i.status !== "cancelled")
    .slice(0, 5);
  const pendingExpenses = expenses
    .filter((e) => e.status === "submitted")
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Buchhaltung Dashboard
          </h1>
          <p className="text-muted-foreground">Welcome back, Accountant.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate("/invoices/new")}>
            <Plus className="mr-2 h-4 w-4" /> New Invoice
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Open Receivables
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: "EUR",
              }).format(
                openInvoices.reduce((sum, i) => sum + (i.totalGross || 0), 0),
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {openInvoices.length} invoices pending payment
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Expenses
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: "EUR",
              }).format(
                pendingExpenses.reduce((sum, e) => sum + (e.amount || 0), 0),
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {pendingExpenses.length} claims to review
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Open Invoices
            </CardTitle>
            <CardDescription>Invoices waiting for payment.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {openInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground"
                    >
                      No open invoices.
                    </TableCell>
                  </TableRow>
                ) : (
                  openInvoices.map((inv) => (
                    <TableRow
                      key={inv._id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => navigate(`/invoices/${inv._id}`)}
                    >
                      <TableCell className="font-mono">
                        {inv.invoiceNumber}
                      </TableCell>
                      <TableCell>
                        {inv.dueDate
                          ? format(new Date(inv.dueDate), "dd.MM")
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat("de-DE", {
                          style: "currency",
                          currency: "EUR",
                        }).format(inv.totalGross)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{inv.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Expense Claims
            </CardTitle>
            <CardDescription>Recently submitted expenses.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingExpenses.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center text-muted-foreground"
                    >
                      No pending expenses.
                    </TableCell>
                  </TableRow>
                ) : (
                  pendingExpenses.map((exp) => (
                    <TableRow
                      key={exp._id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => navigate(`/expenses`)}
                    >
                      <TableCell>{exp.userId}</TableCell>
                      <TableCell className="capitalize">
                        {exp.category}
                      </TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat("de-DE", {
                          style: "currency",
                          currency: exp.currency,
                        }).format(exp.amount)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

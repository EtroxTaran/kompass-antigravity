import { useNavigate } from "react-router-dom";
import { useExpenses } from "@/hooks/useExpense";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Receipt, FileText } from "lucide-react";
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

export function ExpenseList() {
  const navigate = useNavigate();
  const { expenses, loading } = useExpenses();

  if (loading) return <div>Lade Ausgaben...</div>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "reimbursed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryLabel = (category: string) => {
    const map: Record<string, string> = {
      travel: "Reise",
      meal: "Verpflegung",
      accommodation: "Übernachtung",
      material: "Material",
      other: "Sonstiges",
    };
    return map[category] || category;
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Ausgaben</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {}}>
            <FileText className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button onClick={() => navigate("/expenses/new")}>
            <Plus className="mr-2 h-4 w-4" /> Neu
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Beschreibung</TableHead>
                <TableHead>Kategorie</TableHead>
                <TableHead className="text-right">Betrag</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center h-24 text-muted-foreground"
                  >
                    Keine Ausgaben gefunden.
                  </TableCell>
                </TableRow>
              ) : (
                expenses.map((expense) => (
                  <TableRow
                    key={expense._id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/expenses/${expense._id}/edit`)}
                  >
                    <TableCell>{formatDate(expense.date)}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Receipt className="mr-2 h-4 w-4 text-muted-foreground" />
                        {expense.description}
                      </div>
                    </TableCell>
                    <TableCell>{getCategoryLabel(expense.category)}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(expense.amount, expense.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(expense.status)}
                      >
                        {expense.status}
                      </Badge>
                    </TableCell>
                    <TableCell></TableCell>
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

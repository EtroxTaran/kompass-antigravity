import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExpenses } from "@/hooks/useExpense";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Receipt, FileText, Check, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate, formatCurrency } from "@/lib/utils";

export function ExpenseList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [view, setView] = useState<"my" | "pending" | "all">("my");
  const { expenses, loading, approveExpense, rejectExpense } = useExpenses({ view });

  // Only BUCH and GF/ADM can see pending/all
  const canApprove = user?.roles?.some(r => ["BUCH", "GF", "ADM"].includes(r));

  const handleApprove = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await approveExpense(id);
  };

  const handleReject = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const reason = prompt("Grund für Ablehnung:");
    if (reason) await rejectExpense(id, reason);
  };

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
      <CardHeader className="flex flex-col gap-4 pb-2">
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Ausgaben</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { }}>
              <FileText className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button onClick={() => navigate("/expenses/new")}>
              <Plus className="mr-2 h-4 w-4" /> Neu
            </Button>
          </div>
        </div>

        <Tabs value={view} onValueChange={(v) => setView(v as any)} className="w-full">
          <TabsList>
            <TabsTrigger value="my">Meine Ausgaben</TabsTrigger>
            {canApprove && <TabsTrigger value="pending">Zu genehmigen</TabsTrigger>}
            {canApprove && <TabsTrigger value="all">Alle</TabsTrigger>}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Händler</TableHead>
                <TableHead>Beschreibung</TableHead>
                <TableHead>Kategorie</TableHead>
                <TableHead className="text-right">Betrag</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
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
                    <TableCell>{expense.merchantName || "-"}</TableCell>
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
                    <TableCell>
                      {expense.status === 'submitted' && canApprove && (
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-600" onClick={(e) => handleApprove(e, expense._id)}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600" onClick={(e) => handleReject(e, expense._id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
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

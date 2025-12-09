import { useNavigate } from "react-router-dom";
import { useProjectCosts } from "@/hooks/useProjectCost";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, DollarSign } from "lucide-react";
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

export function ProjectCostList() {
  const navigate = useNavigate();
  const { costs, loading } = useProjectCosts();

  if (loading) return <div>Lade Projektkosten...</div>;

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Projektkosten</CardTitle>
        <div className="flex gap-2">
          <Button onClick={() => navigate("/project-costs/new")}>
            <Plus className="mr-2 h-4 w-4" /> Neue Kosten
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
                <TableHead>Typ</TableHead>
                <TableHead className="text-right">Betrag</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {costs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center h-24 text-muted-foreground"
                  >
                    Keine Kosten gefunden.
                  </TableCell>
                </TableRow>
              ) : (
                costs.map((cost) => (
                  <TableRow
                    key={cost._id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/project-costs/${cost._id}/edit`)}
                  >
                    <TableCell>{formatDate(cost.date)}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                        {cost.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{cost.costType}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(cost.amount, cost.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          cost.status === "paid" ? "secondary" : "default"
                        }
                      >
                        {cost.status}
                      </Badge>
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

import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calculator, TrendingUp, Plus } from "lucide-react";
import { useOffers } from "@/hooks/useOffers";
import { useProjectCosts } from "@/hooks/useProjectCost";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

export function KALKDashboard() {
  const navigate = useNavigate();
  const { offers } = useOffers();
  const { costs: projectCosts } = useProjectCosts();

  const pendingOffers = offers
    .filter((o) => o.status === "draft" || o.status === "sent")
    .slice(0, 5);
  const recentCosts = projectCosts.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Kalkulation Dashboard
          </h1>
          <p className="text-muted-foreground">Welcome back, Cost Estimator.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate("/sales/offers/new")}>
            <Plus className="mr-2 h-4 w-4" /> New Offer
          </Button>
          <Button
            onClick={() => navigate("/project-costs/new")}
            variant="outline"
          >
            <Plus className="mr-2 h-4 w-4" /> New Cost Estimate
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Open Offers Value
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: "EUR",
              }).format(
                pendingOffers.reduce((sum, o) => {
                  // Hacky sum: assuming simple structure. Real calc should be robust.
                  const total =
                    o.lineItems?.reduce(
                      (s: number, i: any) => s + i.quantity * i.unitPrice,
                      0,
                    ) || 0;
                  return sum + total;
                }, 0),
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {pendingOffers.length} active offers
            </p>
          </CardContent>
        </Card>
        {/* More KPI Cards could go here */}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Offers
            </CardTitle>
            <CardDescription>
              Latest offers waiting for approval or sending.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingOffers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground"
                    >
                      No recent offers.
                    </TableCell>
                  </TableRow>
                ) : (
                  pendingOffers.map((offer) => {
                    const total =
                      offer.lineItems?.reduce(
                        (s: number, i: any) => s + i.quantity * i.unitPrice,
                        0,
                      ) || 0;
                    return (
                      <TableRow
                        key={offer._id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => navigate(`/sales/offers/${offer._id}`)}
                      >
                        <TableCell className="font-mono">
                          {offer.offerNumber || "DRAFT"}
                        </TableCell>
                        <TableCell>{offer.customerId}</TableCell>
                        <TableCell>
                          {format(new Date(offer.offerDate), "dd.MM")}
                        </TableCell>
                        <TableCell className="text-right">
                          {new Intl.NumberFormat("de-DE", {
                            style: "currency",
                            currency: "EUR",
                          }).format(total)}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Recent Cost Estimates
            </CardTitle>
            <CardDescription>Latest project cost entries.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentCosts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center text-muted-foreground"
                    >
                      No cost estimates recorded.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentCosts.map((cost: any) => (
                    <TableRow
                      key={cost._id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() =>
                        navigate(`/project-costs/${cost._id}/edit`)
                      }
                    >
                      <TableCell>{cost.projectId}</TableCell>
                      <TableCell className="capitalize">
                        {cost.costType}
                      </TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat("de-DE", {
                          style: "currency",
                          currency: cost.currency,
                        }).format(cost.amount)}
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

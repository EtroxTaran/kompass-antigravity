import { useParams, useNavigate } from "react-router-dom";
import { useContract } from "@/hooks/useContracts";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ContractDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { contract, loading } = useContract(id);

  if (loading) return <div>Loading...</div>;
  if (!contract) return <div>Contract not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/sales/contracts")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {contract.title}
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <span className="text-sm font-mono">
                {contract.contractNumber || "DRAFT"}
              </span>
              <Badge variant="outline" className="capitalize">
                {contract.status}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => alert("PDF generation is planned for Phase 7")}
          >
            <FileText className="mr-2 h-4 w-4" />
            PDF
          </Button>
          <Button onClick={() => navigate(`/sales/contracts/${id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <span className="font-semibold block">Customer</span>
                <span>{contract.customerId}</span>
              </div>
              <div>
                <span className="font-semibold block">Period</span>
                <div className="flex flex-col">
                  <span>
                    Start: {format(new Date(contract.startDate), "dd.MM.yyyy")}
                  </span>
                  {contract.endDate && (
                    <span>
                      End: {format(new Date(contract.endDate), "dd.MM.yyyy")}
                    </span>
                  )}
                  {!contract.endDate && (
                    <span className="italic">Indefinite</span>
                  )}
                </div>
              </div>
              <div>
                <span className="font-semibold block">Cancellation</span>
                <span>{contract.cancellationNoticePeriod || "-"}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Items & Services</CardTitle>
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
                      {contract.lineItems?.map((item: any, i: number) => (
                        <TableRow key={item.id || i}>
                          <TableCell>{item.description}</TableCell>
                          <TableCell className="text-right font-mono">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {new Intl.NumberFormat("de-DE", {
                              style: "currency",
                              currency: contract.currency,
                            }).format(item.unitPrice)}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {new Intl.NumberFormat("de-DE", {
                              style: "currency",
                              currency: contract.currency,
                            }).format(item.quantity * item.unitPrice)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="mt-4 flex flex-col items-end space-y-1">
                    <div className="flex justify-between w-48 font-bold text-lg border-t pt-2">
                      <span>Total Value:</span>
                      <span>
                        {new Intl.NumberFormat("de-DE", {
                          style: "currency",
                          currency: contract.currency,
                        }).format(contract.value || 0)}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground capitalize">
                      Cycle: {contract.paymentCycle?.replace("_", " ")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="terms">
              <Card>
                <CardHeader>
                  <CardTitle>Terms & Conditions</CardTitle>
                </CardHeader>
                <CardContent className="text-sm whitespace-pre-wrap">
                  {contract.termsAndConditions ||
                    "No specific terms and conditions."}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

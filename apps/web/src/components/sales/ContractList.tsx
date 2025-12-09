import { useNavigate } from "react-router-dom";
import { useContracts } from "@/hooks/useContracts";
import { Button } from "@/components/ui/button";
import { Plus, FileText, ArrowRight } from "lucide-react";
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

export function ContractList() {
  const navigate = useNavigate();
  const { contracts, loading } = useContracts();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "signed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "terminated":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "expired":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "completed":
        return "bg-indigo-100 text-indigo-800 hover:bg-indigo-100";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Contracts</h2>
          <p className="text-muted-foreground">
            Manage your customer contracts and agreements.
          </p>
        </div>
        <Button
          onClick={() => navigate("/sales/contracts/new")}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Contract
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Number</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading contracts...
                </TableCell>
              </TableRow>
            ) : contracts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No contracts found. Create your first contract.
                </TableCell>
              </TableRow>
            ) : (
              contracts.map((contract) => (
                <TableRow key={contract._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      {contract.contractNumber || "DRAFT"}
                    </div>
                  </TableCell>
                  <TableCell>{contract.title}</TableCell>
                  <TableCell>
                    {/* Ideally fetch customer name or it should be populated */}
                    {contract.customerId}
                  </TableCell>
                  <TableCell>
                    {format(new Date(contract.startDate), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("de-DE", {
                      style: "currency",
                      currency: contract.currency || "EUR",
                    }).format(contract.value || 0)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`capitalize border-none ${getStatusColor(contract.status)}`}
                      variant="outline"
                    >
                      {contract.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        navigate(`/sales/contracts/${contract._id}`)
                      }
                    >
                      View
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

import { SupplierContract } from "@kompass/shared";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  CheckCircle,
  PenTool,
  Download,
  FileSignature,
} from "lucide-react";
import { useSupplierContracts } from "@/hooks/useSupplierContracts";
import { supplierContractsApi } from "@/services/apiClient";
import { format } from "date-fns";

interface SupplierContractListProps {
  supplierId: string;
  onEdit?: (contract: SupplierContract) => void;
}

export function SupplierContractList({
  supplierId,
  onEdit,
}: SupplierContractListProps) {
  const { contracts, loading, refetch } = useSupplierContracts(supplierId);

  const handleDownloadPdf = async (contract: SupplierContract) => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/v1/supplier-contracts/${contract._id}/pdf`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `contract-${contract.contractNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.error(e);
      alert("Download failed");
    }
  };

  const handleApprove = async (contract: SupplierContract) => {
    if (!confirm("Vertrag wirklich freigeben?")) return;
    try {
      await supplierContractsApi.approve(contract._id);
      refetch();
    } catch (e) {
      console.error(e);
      alert("Fehler bei der Freigabe");
    }
  };

  const handleSign = async (contract: SupplierContract) => {
    if (!confirm("Vertrag als unterschrieben markieren?")) return;
    try {
      await supplierContractsApi.sign(contract._id);
      refetch();
    } catch (e) {
      console.error(e);
      alert("Fehler beim Unterschreiben");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "signed":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "completed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "draft":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      case "pending_approval":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "cancelled":
      case "terminated":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      draft: "Entwurf",
      pending_approval: "Wartet auf Freigabe",
      sent_to_supplier: "Beim Lieferanten",
      signed: "Unterschrieben",
      active: "Aktiv",
      completed: "Abgeschlossen",
      terminated: "Gekündigt",
      cancelled: "Storniert",
    };
    return map[status] || status;
  };

  if (loading) {
    return <div className="text-center py-8">Lade Verträge...</div>;
  }

  if (contracts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-slate-50">
        <FileText className="h-12 w-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-medium text-slate-900">
          Keine Verträge gefunden
        </h3>
        <p className="text-slate-500 max-w-sm mt-2">
          Es wurden noch keine Verträge für diesen Lieferanten angelegt.
        </p>
        {/* Button to add would typically be outside, but could differ here */}
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nummer</TableHead>
            <TableHead>Titel</TableHead>
            <TableHead>Typ</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Wert</TableHead>
            <TableHead>Laufzeit</TableHead>
            <TableHead className="text-right">Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.map((contract) => (
            <TableRow key={contract._id}>
              <TableCell className="font-mono text-sm">
                {contract.contractNumber}
              </TableCell>
              <TableCell className="font-medium">{contract.title}</TableCell>
              <TableCell>{contract.contractType}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={getStatusColor(contract.status)}
                >
                  {getStatusLabel(contract.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {new Intl.NumberFormat("de-DE", {
                  style: "currency",
                  currency: contract.currency || "EUR",
                }).format(contract.contractValue)}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(contract.startDate), "dd.MM.yyyy")} -{" "}
                {format(new Date(contract.endDate), "dd.MM.yyyy")}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    title="PDF herunterladen"
                    onClick={() => handleDownloadPdf(contract)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>

                  {(contract.status === "draft" ||
                    contract.status === "pending_approval") && (
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Freigeben"
                      onClick={() => handleApprove(contract)}
                    >
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </Button>
                  )}

                  {contract.status === "sent_to_supplier" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Unterschreiben"
                      onClick={() => handleSign(contract)}
                    >
                      <FileSignature className="h-4 w-4 text-blue-600" />
                    </Button>
                  )}

                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(contract)}
                    >
                      <PenTool className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

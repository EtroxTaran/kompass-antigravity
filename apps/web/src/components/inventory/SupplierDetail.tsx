import { useState } from "react";
import { Supplier } from "@kompass/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { MapPin, Phone, Mail, Globe, FileSignature, Plus } from "lucide-react";
import { SupplierContractList } from "./SupplierContractList";
import { SupplierContractForm } from "./SupplierContractForm";
import { useSupplierContract } from "@/hooks/useSupplierContracts";

interface SupplierDetailProps {
  supplier: Supplier;
}

export function SupplierDetail({ supplier }: SupplierDetailProps) {
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { createContract } = useSupplierContract();

  const handleCreateContract = async (data: any) => {
    try {
      await createContract(supplier._id, data);
      setIsCreateDialogOpen(false);
      // Ideally refetch contracts, but the hook inside List handles its own fetching.
      // We might need a way to trigger refresh in List.
      // For now, we rely on page reload or simple success.
      // Ideally, lift 'refetch' from List or use QueryClient.
      window.location.reload(); // Simple brute force refresh for MVP
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">
          {supplier.companyName}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/suppliers/${supplier._id}/edit`)}
          >
            Bearbeiten
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Kontaktinformationen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{supplier.email || "—"}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{supplier.phone || "—"}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span>{supplier.website || "—"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Adresse</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <p>
                  {supplier.billingAddress.street}{" "}
                  {supplier.billingAddress.streetNumber}
                </p>
                <p>
                  {supplier.billingAddress.zipCode}{" "}
                  {supplier.billingAddress.city}
                </p>
                <p>{supplier.billingAddress.country}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contracts Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold tracking-tight flex items-center gap-2">
            <FileSignature className="h-5 w-5" />
            Verträge
          </h3>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Neuer Vertrag
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Neuen Vertrag erstellen</DialogTitle>
              </DialogHeader>
              <SupplierContractForm
                supplierId={supplier._id}
                onSubmit={handleCreateContract}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <SupplierContractList supplierId={supplier._id} />
      </div>
    </div>
  );
}

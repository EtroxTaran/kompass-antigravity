import { Material } from "@kompass/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useSupplier } from "@/hooks/useSupplier";
import { MaterialPriceComparison } from "./MaterialPriceComparison";
import { PriceTrendIndicator } from "./PriceTrendIndicator";

// Unit display mapping
const unitLabels: Record<string, string> = {
  pc: "Stück",
  m: "Meter",
  m2: "m²",
  m3: "m³",
  kg: "kg",
  l: "Liter",
};

interface MaterialDetailProps {
  material: Material;
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInventory } from "@/hooks/useInventory";
import { StockAdjustmentDialog } from "./StockAdjustmentDialog";
import { InventoryMovementList } from "./InventoryMovementList";
import { useEffect } from "react";

export function MaterialDetail({ material }: MaterialDetailProps) {
  const navigate = useNavigate();
  const { supplier } = useSupplier(material.preferredSupplierId);
  const { movements, loading, fetchHistory } = useInventory(material._id);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const unitLabel = unitLabels[material.unit] || material.unit;

  const handleSelectSupplier = (
    supplierId: string,
    supplierName: string,
    unitPrice: number,
  ) => {
    // For now, just log - in real app, this would update the material or add to an estimate
    console.log("Selected supplier:", { supplierId, supplierName, unitPrice });
    // Could navigate to estimate creation or open a dialog
  };

  const currentStock = material.currentStock || 0; // Use currentStock from updated Material entity

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{material.name}</h2>
          <p className="text-sm text-muted-foreground">{material.itemNumber}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/materials/${material._id}/edit`)}
          >
            Material bearbeiten
          </Button>
          <StockAdjustmentDialog
            materialId={material._id}
            unit={unitLabel}
            onSuccess={fetchHistory}
          />
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="inventory">Bestand & Historie</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="font-semibold text-muted-foreground">
                    Kategorie
                  </div>
                  <div>{material.category}</div>

                  <div className="font-semibold text-muted-foreground">
                    Beschreibung
                  </div>
                  <div>{material.description || "-"}</div>

                  <div className="font-semibold text-muted-foreground">
                    Bevorzugter Lieferant
                  </div>
                  <div
                    className={
                      supplier
                        ? "cursor-pointer text-primary hover:underline"
                        : ""
                    }
                    onClick={() =>
                      supplier && navigate(`/suppliers/${supplier._id}`)
                    }
                  >
                    {supplier ? supplier.companyName : "-"}
                  </div>
                  <div className="font-semibold text-muted-foreground">
                    Status
                  </div>
                  <div>{material.status || "Aktiv"}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preisinformationen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-semibold text-muted-foreground">
                    Lagerbestand
                  </div>
                  <div className="text-2xl font-bold">
                    {currentStock}{" "}
                    <span className="text-sm font-normal text-muted-foreground">
                      {unitLabel}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm font-semibold text-muted-foreground">
                    Einkaufspreis
                  </div>
                  <div className="text-xl">
                    {material.purchasePrice.toLocaleString("de-DE", {
                      style: "currency",
                      currency: material.currency,
                    })}
                    <PriceTrendIndicator
                      trend={material.priceTrend}
                      className="ml-2"
                    />
                  </div>
                </div>
                {material.averagePrice && (
                  <div className="flex justify-between items-center text-muted-foreground">
                    <div className="text-sm">Ø Lieferantenpreis</div>
                    <div className="text-sm">
                      {material.averagePrice.toLocaleString("de-DE", {
                        style: "currency",
                        currency: material.currency,
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Material Price Comparison Table */}
          <MaterialPriceComparison
            supplierPrices={material.supplierPrices}
            unit={unitLabel}
            onSelectSupplier={handleSelectSupplier}
          />
        </TabsContent>
        <TabsContent value="inventory" className="space-y-6 mt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold tracking-tight">
                Bestandshistorie
              </h3>
              <p className="text-sm text-muted-foreground">
                Verfolgen Sie alle Wareneingänge und Entnahmen.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <InventoryMovementList movements={movements} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

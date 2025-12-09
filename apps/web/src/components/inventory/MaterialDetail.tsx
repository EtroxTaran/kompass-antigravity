import { Material } from "@kompass/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useSupplier } from "@/hooks/useSupplier";
import { MaterialPriceComparison } from "./MaterialPriceComparison";

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

export function MaterialDetail({ material }: MaterialDetailProps) {
  const navigate = useNavigate();
  const { supplier } = useSupplier(material.preferredSupplierId);

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{material.name}</h2>
          <p className="text-sm text-muted-foreground">{material.itemNumber}</p>
        </div>
        <Button onClick={() => navigate(`/materials/${material._id}/edit`)}>
          Material bearbeiten
        </Button>
      </div>

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
                  supplier ? "cursor-pointer text-primary hover:underline" : ""
                }
                onClick={() =>
                  supplier && navigate(`/suppliers/${supplier._id}`)
                }
              >
                {supplier ? supplier.companyName : "-"}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bestand & Preis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm font-semibold text-muted-foreground">
                Lagerbestand
              </div>
              <div className="text-2xl font-bold">
                {material.inStock ?? 0}{" "}
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
    </div>
  );
}

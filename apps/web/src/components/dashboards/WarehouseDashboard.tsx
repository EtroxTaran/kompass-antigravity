import { useMaterials } from "@/hooks/useMaterial";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Package, AlertOctagon, TrendingDown, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function WarehouseDashboard() {
  const { materials, loading } = useMaterials();
  const navigate = useNavigate();

  // Metrics
  const totalItems = materials.length;

  // Calculate total inventory value
  const totalValue = materials.reduce((sum, item) => {
    return sum + (item.purchasePrice || 0) * (item.inStock || 0);
  }, 0);

  const outOfStockItems = materials.filter((item) => (item.inStock || 0) <= 0);
  const lowStockItems = materials.filter(
    (item) => (item.inStock || 0) > 0 && (item.inStock || 0) < 10,
  ); // Simple threshold

  if (loading) {
    return <div className="p-8 text-center">Lade Lagerdaten...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Lagerverwaltung (LAG)</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lagerwert Gesamt
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €
              {totalValue.toLocaleString("de-DE", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalItems} Artikel im Stamm
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Nicht auf Lager
            </CardTitle>
            <AlertOctagon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{outOfStockItems.length}</div>
            <p className="text-xs text-muted-foreground">
              Artikel mit Bestand 0
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Niedriger Bestand
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">
              Weniger als 10 Einheiten
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Bestandswarnungen</CardTitle>
            <CardDescription>Artikel unter Mindestbestand</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...outOfStockItems, ...lowStockItems]
                .slice(0, 8)
                .map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                  >
                    <div
                      className="group cursor-pointer"
                      onClick={() => navigate(`/materials/${item._id}`)}
                    >
                      <p className="font-medium text-sm group-hover:underline">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.itemNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          (item.inStock || 0) === 0
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.inStock || 0} {item.unit}
                      </span>
                    </div>
                  </div>
                ))}
              {outOfStockItems.length === 0 && lowStockItems.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Keine Warnungen.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Materialverwaltung</CardTitle>
            <CardDescription>Schnellzugriff</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div
              className="p-4 border rounded-lg hover:bg-slate-50 cursor-pointer flex items-center gap-4 transition-colors"
              onClick={() => navigate("/materials")}
            >
              <Package className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Materialstamm</h3>
                <p className="text-sm text-muted-foreground">
                  Alle Materialien verwalten und Bestand prüfen.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

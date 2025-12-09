import { useNavigate, useLocation as useRouteLocation } from "react-router-dom";
import { useLocations } from "@/hooks/useLocation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, Building2, Warehouse } from "lucide-react";
import { useCustomers } from "@/hooks/useCustomer";

export function LocationList() {
  const navigate = useNavigate();
  const routeLocation = useRouteLocation();
  const { locations, loading } = useLocations();
  const { customers } = useCustomers();

  const isWarehouseMode = routeLocation.pathname.includes("warehouses");

  // Filter based on mode
  const filteredLocations = locations.filter((l) => {
    if (isWarehouseMode) return l.isInternal || l.locationType === "warehouse";
    return !l.isInternal; // Default locations list shows external/customer sites
  });

  const getCustomerName = (id?: string) => {
    if (!id) return "Internal / Unassigned";
    return (
      customers.find((c) => c._id === id)?.companyName || "Unknown Customer"
    );
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {isWarehouseMode ? "Warehouses (Internal)" : "Locations (External)"}
        </h1>
        <Button
          onClick={() =>
            navigate(isWarehouseMode ? "/warehouses/new" : "/locations/new")
          }
        >
          <Plus className="h-4 w-4 mr-2" />
          {isWarehouseMode ? "New Warehouse" : "New Location"}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredLocations.length === 0 ? (
          <div className="col-span-full text-center p-8 text-muted-foreground">
            No locations found.
          </div>
        ) : (
          filteredLocations.map((loc) => (
            <Card
              key={loc._id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() =>
                navigate(
                  isWarehouseMode
                    ? `/warehouses/${loc._id}/edit`
                    : `/locations/${loc._id}/edit`,
                )
              }
            >
              <CardContent className="p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                  {loc.isInternal ? (
                    <Warehouse className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Building2 className="h-5 w-5 text-slate-600" />
                  )}
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{loc.locationName}</span>
                    <Badge variant="outline">{loc.locationType}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {loc.deliveryAddress?.city || "No City"}
                  </p>
                  {!loc.isInternal && (
                    <p className="text-xs text-blue-600 font-medium pt-1">
                      {getCustomerName(loc.customerId)}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

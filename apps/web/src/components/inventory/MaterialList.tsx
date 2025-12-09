import { useMaterials } from "@/hooks/useMaterials";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function MaterialList() {
  const { materials, loading } = useMaterials();
  const navigate = useNavigate();

  if (loading) return <div>Loading Materials...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Materials</h2>
        <Button onClick={() => navigate("/materials/new")}>Add Material</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {materials.map((item) => (
          <Card
            key={item._id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(`/materials/${item._id}`)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base font-medium truncate pr-2">
                  {item.name}
                </CardTitle>
                <span className="text-xs text-muted-foreground font-mono">
                  {item.itemNumber}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-bold">{item.inStock}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.unit} in stock
                  </p>
                </div>
                <div className="text-sm font-semibold">
                  {item.purchasePrice.toLocaleString("de-DE", {
                    style: "currency",
                    currency: item.currency,
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useMileage } from "@/hooks/useMileage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";

export function MileageForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { mileage, loading, saveMileage } = useMileage(id);

  // Form state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    startLocation: "",
    endLocation: "",
    distanceKm: 0,
    purpose: "",
    licensePlate: "",
    status: "draft",
  });

  useEffect(() => {
    if (mileage) {
      const timer = setTimeout(() => {
        setFormData({
          date: mileage.date
            ? mileage.date.split("T")[0]
            : new Date().toISOString().split("T")[0],
          startLocation: mileage.startLocation || "",
          endLocation: mileage.endLocation || "",
          distanceKm: mileage.distanceKm || 0,
          purpose: mileage.purpose || "",
          licensePlate: mileage.licensePlate || "",
          status: mileage.status || "draft",
        });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [mileage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "distanceKm" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveMileage(formData as any);
      navigate("/mileage");
    } catch (err) {
      console.error("Failed to save mileage", err);
    }
  };

  if (loading) return <div>Lade...</div>;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {id ? "Fahrtenbuch Eintrag bearbeiten" : "Neue Fahrt erfassen"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Datum</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startLocation">Startort</Label>
              <Input
                id="startLocation"
                name="startLocation"
                value={formData.startLocation}
                onChange={handleChange}
                placeholder="z.B. Büro, Berlin"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endLocation">Zielort</Label>
              <Input
                id="endLocation"
                name="endLocation"
                value={formData.endLocation}
                onChange={handleChange}
                placeholder="z.B. Kunde X, München"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="distanceKm">Distanz (km)</Label>
              <Input
                id="distanceKm"
                name="distanceKm"
                type="number"
                step="0.1"
                value={formData.distanceKm}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="licensePlate">Kennzeichen</Label>
              <Input
                id="licensePlate"
                name="licensePlate"
                value={formData.licensePlate}
                onChange={handleChange}
                placeholder="B-XX 1234"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Fahrtgrund</Label>
            <Input
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="z.B. Kundenbesuch, Projektbesprechung"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/mileage")}
            >
              Abbrechen
            </Button>
            <Button type="submit">Speichern</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

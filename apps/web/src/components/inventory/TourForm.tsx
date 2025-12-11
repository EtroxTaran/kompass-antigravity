import { useState, useEffect } from "react";
import { useTour } from "@/hooks/useTour";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { TourStop } from "@kompass/shared";

export function TourForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tour, loading, saveTour } = useTour(id);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    date: new Date().toISOString().split("T")[0],
    driverId: "",
    startLocation: "",
    endLocation: "",
    status: "planned",
  });

  const [stops, setStops] = useState<Partial<TourStop>[]>([]);

  useEffect(() => {
    if (tour) {
      const timer = setTimeout(() => {
        setFormData({
          name: tour.name || "",
          date: tour.date
            ? tour.date.split("T")[0]
            : new Date().toISOString().split("T")[0],
          driverId: tour.driverId || "",
          startLocation: tour.startLocation || "",
          endLocation: tour.endLocation || "",
          status: tour.status || "planned",
        });
        setStops(tour.stops || []);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [tour]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddStop = () => {
    setStops([...stops, { name: "", address: "", completed: false }]);
  };

  const handleStopChange = (
    index: number,
    field: keyof TourStop,
    value: string,
  ) => {
    const newStops = [...stops];
    newStops[index] = { ...newStops[index], [field]: value };
    setStops(newStops);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveTour({ ...formData, stops } as any);
      navigate("/tours");
    } catch (err) {
      console.error("Failed to save tour", err);
    }
  };

  if (loading) return <div>Lade...</div>;

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{id ? "Tour bearbeiten" : "Neue Tour planen"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tour Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="z.B. Tour Nord"
                required
              />
            </div>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startLocation">Startort (Depot)</Label>
              <Input
                id="startLocation"
                name="startLocation"
                value={formData.startLocation}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endLocation">Endort</Label>
              <Input
                id="endLocation"
                name="endLocation"
                value={formData.endLocation}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-sm">Zwischenstopps</h3>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleAddStop}
              >
                + Stopp hinzufügen
              </Button>
            </div>

            <div className="space-y-4">
              {stops.map((stop, index) => (
                <div
                  key={index}
                  className="flex gap-4 items-end border p-3 rounded-md bg-slate-50"
                >
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs">Name / Kunde</Label>
                    <Input
                      value={stop.name}
                      onChange={(e) =>
                        handleStopChange(index, "name", e.target.value)
                      }
                      placeholder="Kunde X"
                    />
                  </div>
                  <div className="flex-[2] space-y-1">
                    <Label className="text-xs">Adresse</Label>
                    <Input
                      value={stop.address}
                      onChange={(e) =>
                        handleStopChange(index, "address", e.target.value)
                      }
                      placeholder="Straße, Ort"
                    />
                  </div>
                </div>
              ))}
              {stops.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Keine Zwischenstopps geplant.
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/tours")}
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

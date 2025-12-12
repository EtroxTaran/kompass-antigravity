import { useState, useEffect } from "react";
import { useMileage } from "@/hooks/useMileage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, Navigation } from "lucide-react";

export function MileageForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { mileage, loading, saveMileage } = useMileage(id);

  // Form state
  const [formData, setFormData] = useState<{
    date: string;
    startLocation: string;
    startLat?: number;
    startLng?: number;
    endLocation: string;
    endLat?: number;
    endLng?: number;
    distanceKm: number;
    purpose: string;
    licensePlate: string;
    status: "draft" | "submitted" | "approved";
  }>({
    date: new Date().toISOString().split("T")[0],
    startLocation: "",
    endLocation: "",
    distanceKm: 0,
    purpose: "",
    licensePlate: "",
    status: "draft",
  });

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return parseFloat(d.toFixed(1));
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  const handleStartTrip = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            startLat: position.coords.latitude,
            startLng: position.coords.longitude,
            startLocation: `GPS: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`, // Placeholder
            date: new Date().toISOString().split("T")[0], // Set current date
          }));
        },
        (error) => {
          console.error("Error getting location", error);
          alert("Standortzugriff erforderlich für automatischen Start.");
        },
      );
    } else {
      alert("Geolocation wird von diesem Browser nicht unterstützt.");
    }
  };

  const handleEndTrip = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const endLat = position.coords.latitude;
          const endLng = position.coords.longitude;
          let dist = 0;

          if (formData.startLat && formData.startLng) {
            dist = calculateDistance(
              formData.startLat,
              formData.startLng,
              endLat,
              endLng,
            );
          }

          setFormData((prev) => ({
            ...prev,
            endLat: endLat,
            endLng: endLng,
            endLocation: `GPS: ${endLat.toFixed(4)}, ${endLng.toFixed(4)}`, // Placeholder
            distanceKm: dist,
          }));
        },
        (error) => {
          console.error("Error getting location", error);
          alert("Standortzugriff erforderlich für automatisches Ende.");
        },
      );
    }
  };

  useEffect(() => {
    if (mileage) {
      const timer = setTimeout(() => {
        setFormData({
          date: mileage.date
            ? mileage.date.split("T")[0]
            : new Date().toISOString().split("T")[0],
          startLocation: mileage.startLocation || "",
          startLat: mileage.startLat,
          startLng: mileage.startLng,
          endLocation: mileage.endLocation || "",
          endLat: mileage.endLat,
          endLng: mileage.endLng,
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
      await saveMileage(formData);
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
              <div className="flex gap-2">
                <Input
                  id="startLocation"
                  name="startLocation"
                  value={formData.startLocation}
                  onChange={handleChange}
                  placeholder="z.B. Büro, Berlin"
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleStartTrip}
                  title="Fahrt hier starten (GPS)"
                >
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
              {formData.startLat && (
                <p className="text-xs text-muted-foreground">
                  GPS: {formData.startLat.toFixed(6)},{" "}
                  {formData.startLng?.toFixed(6)}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endLocation">Zielort</Label>
              <div className="flex gap-2">
                <Input
                  id="endLocation"
                  name="endLocation"
                  value={formData.endLocation}
                  onChange={handleChange}
                  placeholder="z.B. Kunde X, München"
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleEndTrip}
                  title="Fahrt hier beenden (GPS)"
                >
                  <Navigation className="h-4 w-4" />
                </Button>
              </div>
              {formData.endLat && (
                <p className="text-xs text-muted-foreground">
                  GPS: {formData.endLat.toFixed(6)},{" "}
                  {formData.endLng?.toFixed(6)}
                </p>
              )}
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

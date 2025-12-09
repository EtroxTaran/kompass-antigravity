import { useState, useEffect } from "react";
import { useProjectCost } from "@/hooks/useProjectCost";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ProjectCostForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cost, loading, saveCost } = useProjectCost(id);

  const [formData, setFormData] = useState({
    projectId: "",
    description: "",
    amount: "",
    currency: "EUR",
    date: new Date().toISOString().split("T")[0],
    costType: "material",
    status: "planned",
  });

  useEffect(() => {
    if (cost) {
      setFormData({
        projectId: cost.projectId || "",
        description: cost.description || "",
        amount: cost.amount.toString(),
        currency: cost.currency || "EUR",
        date: cost.date
          ? cost.date.split("T")[0]
          : new Date().toISOString().split("T")[0],
        costType: cost.costType,
        status: cost.status,
      });
    }
  }, [cost]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveCost({
        ...formData,
        amount: parseFloat(formData.amount),
        type: "project-cost",
      } as any);
      navigate("/project-costs");
    } catch (err) {
      console.error("Failed to save project cost", err);
    }
  };

  if (loading) return <div>Lade...</div>;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {id ? "Projektkosten bearbeiten" : "Neue Projektkosten"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="projectId">Projekt (ID)</Label>
            <Input
              id="projectId"
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Beschreibung</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Betrag</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
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
              <Label>Typ</Label>
              <Select
                value={formData.costType}
                onValueChange={(val) => handleSelectChange("costType", val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="material">Material</SelectItem>
                  <SelectItem value="labor">Personal</SelectItem>
                  <SelectItem value="external">Extern</SelectItem>
                  <SelectItem value="misc">Sonstiges</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(val) => handleSelectChange("status", val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Geplant</SelectItem>
                  <SelectItem value="incurred">Angefallen</SelectItem>
                  <SelectItem value="paid">Bezahlt</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/project-costs")}
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

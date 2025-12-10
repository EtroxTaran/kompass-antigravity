import { useState, useEffect } from "react";
import { useExpense } from "@/hooks/useExpense";
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

export function ExpenseForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { expense, loading, saveExpense } = useExpense(id);

  // Form state
  const [formData, setFormData] = useState({
    merchantName: "",
    description: "",
    amount: 0,
    currency: "EUR",
    category: "other",
    date: new Date().toISOString().split("T")[0],
    status: "draft",
    receiptUrl: undefined as string | undefined, // For now keeping it simple
  });
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (expense) {
      setFormData({
        merchantName: expense.merchantName || "",
        description: expense.description || "",
        amount: expense.amount || 0,
        currency: expense.currency || "EUR",
        category: expense.category || "other",
        date: expense.date
          ? expense.date.split("T")[0]
          : new Date().toISOString().split("T")[0],
        status: expense.status || "draft",
        receiptUrl: expense.receiptUrl,
      });
    }
  }, [expense]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (formData.amount > 150 && !formData.receiptUrl && !receiptFile && !id) {
      // If creating new and > 150, require receipt
      setError("Receipt is mandatory for expenses over €150.");
      return;
    }

    try {
      // Mock file upload
      let receiptUrl = formData.receiptUrl;
      if (receiptFile) {
        receiptUrl = `mock-storage://${receiptFile.name}`;
      }

      await saveExpense({ ...formData, receiptUrl } as any);
      navigate("/expenses");
    } catch (err: any) {
      console.error("Failed to save expense", err);
      setError(err.message || "Failed to save expense");
    }
  };

  if (loading && id) return <div>Lade...</div>;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {id ? "Ausgabe bearbeiten" : "Neue Ausgabe erfassen"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && <div className="p-3 mb-4 text-red-700 bg-red-100 rounded">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="merchantName">Händler / Geschäft</Label>
            <Input
              id="merchantName"
              name="merchantName"
              value={formData.merchantName}
              onChange={handleChange}
              placeholder="z.B. Deutsche Bahn, Hotel X"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
            <div className="space-y-2">
              <Label htmlFor="category">Kategorie</Label>
              <Select
                value={formData.category}
                onValueChange={(val) => handleSelectChange("category", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wähle Kategorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="travel">Reisekosten</SelectItem>
                  <SelectItem value="meal">Verpflegung</SelectItem>
                  <SelectItem value="accommodation">Übernachtung</SelectItem>
                  <SelectItem value="material">Material</SelectItem>
                  <SelectItem value="other">Sonstiges</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Beschreibung</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Zweck der Ausgabe"
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
              <Label htmlFor="currency">Währung</Label>
              <Select
                value={formData.currency}
                onValueChange={(val) => handleSelectChange("currency", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Währung" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="receipt">Beleg {formData.amount > 150 && <span className="text-red-500">*</span>}</Label>
            <Input
              id="receipt"
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
            />
            {formData.receiptUrl && <p className="text-xs text-green-600">Beleg vorhanden: {formData.receiptUrl}</p>}
            <p className="text-xs text-muted-foreground">Pflicht bei Beträgen über 150€.</p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/expenses")}
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

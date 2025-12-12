import { useState, useEffect } from "react";
import { useExpense } from "@/hooks/useExpense";
import { useProjects } from "@/hooks/useProjects";
import { useCustomers } from "@/hooks/useCustomers";
import { expensesApi } from "@/services/apiClient";
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
import { Camera, Upload, Loader2, Check } from "lucide-react";

export function ExpenseForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { expense, loading, saveExpense } = useExpense(id);
  const { projects } = useProjects();
  const { customers } = useCustomers();

  // Form state
  const [formData, setFormData] = useState<{
    merchantName: string;
    description: string;
    amount: number;
    currency: string;
    category: "travel" | "meal" | "accommodation" | "material" | "other";
    date: string;
    status: "draft" | "submitted" | "approved" | "rejected" | "reimbursed";
    receiptUrl: string | undefined;
    projectId: string | undefined;
    customerId: string | undefined;
  }>({
    merchantName: "",
    description: "",
    amount: 0,
    currency: "EUR",
    category: "other",
    date: new Date().toISOString().split("T")[0],
    status: "draft",
    receiptUrl: undefined,
    projectId: undefined,
    customerId: undefined,
  });
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (expense) {
      // Defer state update to avoid synchronous render warning
      const timer = setTimeout(() => {
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
          projectId: expense.projectId,
          customerId: expense.customerId,
        });
      }, 0);
      return () => clearTimeout(timer);
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
    // Handle "none" value for optional selects
    if (value === "none") {
      setFormData((prev) => ({ ...prev, [name]: undefined }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setReceiptFile(file);
    setUploading(true);
    setError(null);

    try {
      const result = await expensesApi.uploadReceipt(file);
      setFormData((prev) => ({ ...prev, receiptUrl: result.url }));
    } catch (err) {
      console.error("Failed to upload receipt", err);
      setError(
        err instanceof Error ? err.message : "Beleg-Upload fehlgeschlagen",
      );
      setReceiptFile(null);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (formData.amount > 150 && !formData.receiptUrl && !id) {
      // If creating new and > 150, require receipt
      setError("Beleg ist Pflicht bei Ausgaben über 150€.");
      return;
    }

    try {
      await saveExpense({ ...formData });
      navigate("/expenses");
    } catch (err) {
      console.error("Failed to save expense", err);
      setError(
        err instanceof Error ? err.message : "Ausgabe konnte nicht gespeichert werden",
      );
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
        {error && (
          <div className="p-3 mb-4 text-red-700 bg-red-100 rounded">
            {error}
          </div>
        )}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Betrag</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
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

          {/* Project/Customer Linking */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectId">Projekt (optional)</Label>
              <Select
                value={formData.projectId || "none"}
                onValueChange={(val) => handleSelectChange("projectId", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kein Projekt" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Kein Projekt</SelectItem>
                  {projects?.map((project) => (
                    <SelectItem key={project._id} value={project._id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerId">Kunde (optional)</Label>
              <Select
                value={formData.customerId || "none"}
                onValueChange={(val) => handleSelectChange("customerId", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kein Kunde" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Kein Kunde</SelectItem>
                  {customers?.map((customer) => (
                    <SelectItem key={customer._id} value={customer._id}>
                      {customer.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Receipt Upload with Camera */}
          <div className="space-y-2">
            <Label htmlFor="receipt">
              Beleg{" "}
              {formData.amount > 150 && <span className="text-red-500">*</span>}
            </Label>
            <div className="flex gap-2">
              {/* File picker */}
              <div className="flex-1">
                <Input
                  id="receipt"
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => document.getElementById("receipt")?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="mr-2 h-4 w-4" />
                  )}
                  Datei wählen
                </Button>
              </div>
              {/* Camera capture for mobile */}
              <div>
                <Input
                  id="camera"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("camera")?.click()}
                  disabled={uploading}
                  title="Foto aufnehmen"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {formData.receiptUrl && (
              <p className="text-xs text-green-600 flex items-center gap-1">
                <Check className="h-3 w-3" />
                Beleg hochgeladen: {formData.receiptUrl.split("/").pop()}
              </p>
            )}
            {receiptFile && !formData.receiptUrl && !uploading && (
              <p className="text-xs text-muted-foreground">
                Ausgewählt: {receiptFile.name}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Pflicht bei Beträgen über 150€. Akzeptiert: Bilder und PDF.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/expenses")}
            >
              Abbrechen
            </Button>
            <Button type="submit" disabled={uploading}>
              Speichern
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

import { useState, useEffect } from "react";
import { usePurchaseOrder } from "@/hooks/usePurchaseOrder";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function PurchaseOrderForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { order, loading, saveOrder } = usePurchaseOrder(id);

  const [formData, setFormData] = useState({
    orderNumber: "",
    supplierId: "",
    projectId: "",
    date: new Date().toISOString().split("T")[0],
    expectedDeliveryDate: "",
    status: "draft",
    currency: "EUR",
    items: [] as {
      description: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }[],
  });

  useEffect(() => {
    if (order) {
      setFormData({
        orderNumber: order.orderNumber || "",
        supplierId: order.supplierId || "",
        projectId: order.projectId || "",
        date: order.date
          ? order.date.split("T")[0]
          : new Date().toISOString().split("T")[0],
        expectedDeliveryDate: order.expectedDeliveryDate
          ? order.expectedDeliveryDate.split("T")[0]
          : "",
        status: order.status,
        currency: order.currency || "EUR",
        items: order.items || [],
      });
    }
  }, [order]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { description: "", quantity: 1, unitPrice: 0, totalPrice: 0 },
      ],
    }));
  };

  const updateItem = (index: number, field: string, value: any) => {
    setFormData((prev) => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };

      // Recalculate total price
      if (field === "quantity" || field === "unitPrice") {
        newItems[index].totalPrice =
          newItems[index].quantity * newItems[index].unitPrice;
      }

      return { ...prev, items: newItems };
    });
  };

  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveOrder({
        ...formData,
        totalAmount: calculateTotal(),
        type: "purchase-order",
      } as any);
      navigate("/purchase-orders");
    } catch (err) {
      console.error("Failed to save purchase order", err);
    }
  };

  if (loading) return <div>Lade...</div>;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {id ? "Bestellung bearbeiten" : "Neue Bestellung"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="orderNumber">Bestellnummer</Label>
              <Input
                id="orderNumber"
                name="orderNumber"
                value={formData.orderNumber}
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
              <Label htmlFor="supplierId">Lieferant (ID)</Label>
              <Input
                id="supplierId"
                name="supplierId"
                value={formData.supplierId}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectId">Projekt (ID) (Optional)</Label>
              <Input
                id="projectId"
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expectedDeliveryDate">
                Lieferdatum (Erwartet)
              </Label>
              <Input
                id="expectedDeliveryDate"
                name="expectedDeliveryDate"
                type="date"
                value={formData.expectedDeliveryDate}
                onChange={handleChange}
              />
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
                  <SelectItem value="draft">Entwurf</SelectItem>
                  <SelectItem value="ordered">Bestellt</SelectItem>
                  <SelectItem value="received">Erhalten</SelectItem>
                  <SelectItem value="cancelled">Storniert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Items Section */}
          <div className="space-y-4 border p-4 rounded-md">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Positionen</h3>
              <Button type="button" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-1" /> Position hinzufügen
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Beschreibung</TableHead>
                  <TableHead className="w-[100px]">Menge</TableHead>
                  <TableHead className="w-[120px]">Einzelpreis</TableHead>
                  <TableHead className="w-[120px] text-right">Gesamt</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formData.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={item.description}
                        onChange={(e) =>
                          updateItem(index, "description", e.target.value)
                        }
                        placeholder="Artikel..."
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "quantity",
                            parseFloat(e.target.value),
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "unitPrice",
                            parseFloat(e.target.value),
                          )
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.totalPrice, formData.currency)}
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-bold">
                    Summe:
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {formatCurrency(calculateTotal(), formData.currency)}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/purchase-orders")}
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

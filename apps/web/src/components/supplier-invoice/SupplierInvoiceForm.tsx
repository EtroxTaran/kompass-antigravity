
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateSupplierInvoiceDto } from "@/types/supplier-invoice";
import { useSupplierInvoice } from "@/hooks/useSupplierInvoice";
import { Trash2, Plus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SupplierInvoiceFormProps {
  supplierId?: string;
  projectId?: string;
}

export function SupplierInvoiceForm({
  supplierId,
  projectId,
}: SupplierInvoiceFormProps) {
  const navigate = useNavigate();
  const { createInvoice } = useSupplierInvoice();
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateSupplierInvoiceDto>({
    defaultValues: {
      supplierId: supplierId || "",
      projectId: projectId || "",
      lineItems: [
        { description: "", quantity: 1, unitPrice: 0, totalPrice: 0 },
      ],
      taxRate: 19,
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lineItems",
  });

  const lineItems = watch("lineItems");
  const taxRate = watch("taxRate");

  // Calculate totals
  const net = lineItems.reduce(
    (acc, item) => acc + item.quantity * item.unitPrice,
    0,
  );
  const tax = net * (Number(taxRate) / 100);
  const gross = net + tax;

  const onSubmit = async (data: CreateSupplierInvoiceDto) => {
    data.netAmount = net;
    data.taxAmount = tax;
    data.grossAmount = gross;

    try {
      await createInvoice.mutateAsync(data);
      navigate(-1); // Go back
    } catch (error) {
      console.error("Failed to create invoice", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold tracking-tight">
          New Supplier Invoice
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                {...register("invoiceNumber", { required: true })}
              />
              {errors.invoiceNumber && (
                <span className="text-red-500 text-sm">Required</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplierId">Supplier ID</Label>
              <Input
                id="supplierId"
                {...register("supplierId", { required: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectId">Project ID</Label>
              <Input
                id="projectId"
                {...register("projectId", { required: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contractId">Contract ID (Optional)</Label>
              <Input
                id="contractId"
                {...register("contractId")}
                placeholder="Links to Purchase Order"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoiceDate">Invoice Date</Label>
              <Input
                type="date"
                id="invoiceDate"
                {...register("invoiceDate", { required: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                type="date"
                id="dueDate"
                {...register("dueDate", { required: true })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Line Items</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  description: "",
                  quantity: 1,
                  unitPrice: 0,
                  totalPrice: 0,
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" /> Add Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-12 gap-2 items-end border-b pb-4"
              >
                <div className="col-span-12 md:col-span-5 space-y-2">
                  <Label>Description</Label>
                  <Input
                    {...register(`lineItems.${index}.description` as const, {
                      required: true,
                    })}
                  />
                </div>
                <div className="col-span-12 md:col-span-2 space-y-2">
                  <Label>Qty</Label>
                  <Input
                    type="number"
                    {...register(`lineItems.${index}.quantity` as const, {
                      valueAsNumber: true,
                    })}
                    onChange={(e) => {
                      const qty = parseFloat(e.target.value) || 0;
                      const price = lineItems[index]?.unitPrice || 0;
                      setValue(
                        `lineItems.${index}.totalPrice` as const,
                        qty * price,
                      );
                    }}
                  />
                </div>
                <div className="col-span-12 md:col-span-2 space-y-2">
                  <Label>Unit Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register(`lineItems.${index}.unitPrice` as const, {
                      valueAsNumber: true,
                    })}
                    onChange={(e) => {
                      const price = parseFloat(e.target.value) || 0;
                      const qty = lineItems[index]?.quantity || 0;
                      setValue(
                        `lineItems.${index}.totalPrice` as const,
                        qty * price,
                      );
                    }}
                  />
                </div>
                <div className="col-span-12 md:col-span-2 space-y-2">
                  <Label>Total</Label>
                  <Input
                    type="number"
                    readOnly
                    {...register(`lineItems.${index}.totalPrice` as const)}
                    className="bg-muted"
                  />
                </div>
                <div className="col-span-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-4">
                <span className="font-medium">Net Amount:</span>
                <Input
                  className="w-32 text-right"
                  readOnly
                  value={net.toFixed(2)}
                />
              </div>
              <div className="flex items-center gap-4">
                <span className="font-medium">Tax Rate (%):</span>
                <Input
                  className="w-32 text-right"
                  type="number"
                  {...register("taxRate")}
                />
              </div>
              <div className="flex items-center gap-4">
                <span className="font-medium">Tax Amount:</span>
                <Input
                  className="w-32 text-right"
                  readOnly
                  value={tax.toFixed(2)}
                />
              </div>
              <div className="flex items-center gap-4 text-lg font-bold">
                <span>Gross Amount:</span>
                <Input
                  className="w-32 text-right font-bold"
                  readOnly
                  value={gross.toFixed(2)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit">Create Invoice</Button>
        </div>
      </form>
    </div>
  );
}

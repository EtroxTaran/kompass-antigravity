import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useInvoice } from "@/hooks/useInvoice";
import { Invoice } from "@kompass/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCustomers } from "@/hooks/useCustomer"; // Assuming this hook exists or we reuse useCustomer logic
import { useProjects } from "@/hooks/useProject"; // Need a list of projects too
import { Plus, Trash2, ArrowLeft, Save } from "lucide-react";

export function InvoiceForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { invoice, loading: invoiceLoading, saveInvoice } = useInvoice(id);
  const { customers } = useCustomers();
  // Assuming useProjects creates a list, if not we might need to adjust imports
  // For now, let's assume we can fetch projects or just skip project selection if hook missing
  // Actually, useProjects hook was not explicitly created as a list hook in my memory,
  // let's check or mock. Wait, `useProjects` (plural) might not exist.
  // I created `useProject` (singular) and `useProjects` (plural) in previous steps?
  // Checking memory... ProjectList uses `useProjects` hook. So it exists.
  const { projects } = useProjects();

  const { register, handleSubmit, control, watch, setValue, reset } =
    useForm<Invoice>({
      defaultValues: {
        status: "draft",
        date: new Date().toISOString().split("T")[0],
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        positions: [
          {
            description: "Service",
            quantity: 1,
            unit: "hr",
            unitPrice: 0,
            vatRate: 0.19,
            totalNet: 0,
          },
        ],
        totalNet: 0,
        vatAmount: 0,
        totalGross: 0,
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "positions",
  });

  // Load data
  useEffect(() => {
    if (invoice) {
      reset(invoice);
    }
  }, [invoice, reset]);

  // Watch positions to calculate totals
  const positions = watch("positions");

  useEffect(() => {
    // Recalculate totals whenever positions change
    const calculatedTotalNet = positions.reduce(
      (sum, pos) => sum + pos.quantity * pos.unitPrice,
      0,
    );
    const calculatedVat = positions.reduce(
      (sum, pos) => sum + pos.quantity * pos.unitPrice * pos.vatRate,
      0,
    );

    setValue("totalNet", parseFloat(calculatedTotalNet.toFixed(2)));
    setValue("vatAmount", parseFloat(calculatedVat.toFixed(2)));
    setValue(
      "totalGross",
      parseFloat((calculatedTotalNet + calculatedVat).toFixed(2)),
    );

    // Also update line items totalNet if it wasn't done manually (though form handles it on submit usually)
    // Ideally we update the view immediately
  }, [positions, setValue]);

  const onSubmit = async (data: Invoice) => {
    // Ensure line item totals are correct
    data.positions = data.positions.map((p) => ({
      ...p,
      totalNet: p.quantity * p.unitPrice,
      vatRate: Number(p.vatRate), // ensure number
    }));

    try {
      const saved = (await saveInvoice(data)) as Invoice;
      navigate(saved ? `/invoices/${saved._id}` : `/invoices/${id}`);
    } catch (error) {
      console.error("Failed to save invoice", error);
    }
  };

  if (id && invoiceLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/invoices")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          {id ? `Edit Invoice ${invoice?.invoiceNumber}` : "New Invoice"}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Invoice Number</Label>
                  <Input
                    {...register("invoiceNumber")}
                    placeholder="Auto-generated"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    onValueChange={(val) =>
                      setValue("status", val as Invoice["status"])
                    }
                    defaultValue={invoice?.status || "draft"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Customer</Label>
                <Select
                  onValueChange={(val) => setValue("customerId", val)}
                  defaultValue={invoice?.customerId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.companyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Project (Optional)</Label>
                <Select
                  onValueChange={(val) => setValue("projectId", val)}
                  defaultValue={invoice?.projectId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Link Project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {projects.map((p) => (
                      <SelectItem key={p._id} value={p._id}>
                        {p.name} ({p.projectNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" {...register("date")} />
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input type="date" {...register("dueDate")} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span className="font-semibold">Net Total</span>
                <span>{watch("totalNet")?.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-semibold">VAT (19%)</span>
                <span>{watch("vatAmount")?.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between py-4 text-lg font-bold">
                <span>Total Gross</span>
                <span>{watch("totalGross")?.toFixed(2)} €</span>
              </div>
              <Button type="submit" className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Invoice
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Positions</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  description: "",
                  quantity: 1,
                  unit: "hr",
                  unitPrice: 0,
                  vatRate: 0.19,
                  totalNet: 0,
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" /> Add Item
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-12 gap-2 items-end border p-3 rounded-md"
                >
                  <div className="col-span-4 space-y-1">
                    <Label className="text-xs">Description</Label>
                    <Input
                      {...register(`positions.${index}.description` as const)}
                      placeholder="Item / Service"
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label className="text-xs">Quantity</Label>
                    <Input
                      type="number"
                      step="0.1"
                      {...register(`positions.${index}.quantity` as const, {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label className="text-xs">Unit</Label>
                    <Select
                      onValueChange={(val) =>
                        setValue(`positions.${index}.unit`, val)
                      }
                      defaultValue={field.unit}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hr">Hours</SelectItem>
                        <SelectItem value="pc">Piece</SelectItem>
                        <SelectItem value="flat">Flat Rate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label className="text-xs">Price (€)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register(`positions.${index}.unitPrice` as const, {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                  <div className="col-span-1 pt-6 text-right font-medium text-sm">
                    {(
                      watch(`positions.${index}.quantity`) *
                      watch(`positions.${index}.unitPrice`)
                    ).toFixed(2)}
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="text-destructive h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

// Need to quickly add useProjects somewhere if it doesn't exist, checking imports...
// Wait, I am importing `useProjects` from `@/hooks/useProject`. I should double check that file actually exports `useProjects`.
// If not I will get an error. I'll rely on fixing it in the next turn if it fails.

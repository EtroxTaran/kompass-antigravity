import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSuppliers } from "@/hooks/useSupplier";
import { RecordQuoteDto, Supplier } from "@kompass/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

interface RfqQuoteFormProps {
  invitedSupplierIds: string[];
  onSubmit: (data: RecordQuoteDto) => Promise<void>;
  loading?: boolean;
}

export function RfqQuoteForm({
  invitedSupplierIds,
  onSubmit,
  loading,
}: RfqQuoteFormProps) {
  const [open, setOpen] = useState(false);
  const { suppliers } = useSuppliers();

  // Filter to only show invited suppliers
  const invitedSuppliers = suppliers.filter((s: Supplier) =>
    invitedSupplierIds.includes(s._id),
  );

  const form = useForm<RecordQuoteDto>({
    defaultValues: {
      supplierId: "",
      quotedPrice: 0,
      deliveryDays: 14,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      notes: "",
    },
  });

  const handleSubmit = async (data: RecordQuoteDto) => {
    await onSubmit(data);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Record Quote
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Record Received Quote</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="supplierId"
              rules={{ required: "Supplier is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {invitedSuppliers.map((supplier: Supplier) => (
                        <SelectItem key={supplier._id} value={supplier._id}>
                          {supplier.companyName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quotedPrice"
                rules={{
                  required: "Price is required",
                  min: { value: 0.01, message: "Price must be positive" },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quoted Price (€)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deliveryDays"
                rules={{
                  required: "Delivery days required",
                  min: { value: 1, message: "Must be at least 1 day" },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Days</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormDescription>Estimated delivery time</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="validUntil"
              rules={{ required: "Valid until date is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quote Valid Until</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional terms, conditions, or notes..."
                      className="h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Recording..." : "Record Quote"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { Offer, OfferLineItem } from "@kompass/shared";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCustomers } from "@/hooks/useCustomer";
import { useContacts } from "@/hooks/useContacts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SmartTemplateRecommendations } from "./SmartTemplateRecommendations";

interface OfferFormProps {
  defaultValues?: Partial<Offer>;
  onSubmit: (data: Partial<Offer>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function OfferForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
}: OfferFormProps) {
  const { customers } = useCustomers();
  // Contacts should ideally be filtered by selected customer
  // We will watch customerId and fetch/filter contacts
  const form = useForm<Partial<Offer>>({
    defaultValues: {
      offerDate: new Date().toISOString().split("T")[0],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      status: "draft",
      currency: "EUR",
      discountPercent: 0,
      taxRate: 0.19,
      lineItems: [
        { description: "", quantity: 1, unitPrice: 0, vatRate: 0.19 },
      ], // Default line item
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lineItems",
  });

  const selectedCustomerId = useWatch({
    control: form.control,
    name: "customerId",
  });
  const { contacts } = useContacts(selectedCustomerId); // Assuming hook handles filtered fetching or filtering

  const lineItems =
    useWatch({ control: form.control, name: "lineItems" }) || [];
  const discountPercent =
    useWatch({ control: form.control, name: "discountPercent" }) || 0;
  const taxRate = useWatch({ control: form.control, name: "taxRate" }) || 0.19;

  const subtotal = lineItems.reduce(
    (sum: number, item: any) =>
      sum + (item.quantity || 0) * (item.unitPrice || 0),
    0,
  );
  const discountAmount = subtotal * (discountPercent / 100);
  const netTotal = subtotal - discountAmount;
  const taxAmount = netTotal * taxRate;
  const grossTotal = netTotal + taxAmount;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <SmartTemplateRecommendations
          initialCustomerId={selectedCustomerId}
          onApply={(templateData) => {
            // Apply template data to form
            // We keep customer/date/validity from current form (or defaults)
            // but replace line items, payment terms, etc.
            if (templateData.lineItems) {
              form.setValue("lineItems", templateData.lineItems);
            }
            if (templateData.paymentTerms) {
              form.setValue("paymentTerms", templateData.paymentTerms);
            }
            if (templateData.deliveryTerms) {
              form.setValue("deliveryTerms", templateData.deliveryTerms);
            }
            if (templateData.notes) {
              form.setValue("notes", templateData.notes);
            }
            if (templateData.discountPercent) {
              form.setValue("discountPercent", templateData.discountPercent);
            }

            // Show success toast? Or just let user see changes.
          }}
        />
        <Card>
          <CardHeader>
            <CardTitle>Offer Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="customerId"
              rules={{ required: "Customer is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customers.map((c) => (
                        <SelectItem key={c._id} value={c._id}>
                          {c.companyName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactPersonId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                    disabled={!selectedCustomerId}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select contact" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {contacts.map((c) => (
                        <SelectItem key={c._id} value={c._id}>
                          {c.firstName} {c.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="offerDate"
              rules={{ required: "Date is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Offer Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={
                        field.value
                          ? new Date(field.value).toISOString().split("T")[0]
                          : ""
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="validUntil"
              rules={{ required: "Validity date is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valid Until</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={
                        field.value
                          ? new Date(field.value).toISOString().split("T")[0]
                          : ""
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                  vatRate: 0.19,
                } as OfferLineItem)
              }
            >
              <Plus className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-12 gap-2 items-end border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="col-span-5">
                  <FormField
                    control={form.control}
                    name={`lineItems.${index}.description`}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={index !== 0 ? "sr-only" : ""}>
                          Description
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Service or product" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name={`lineItems.${index}.quantity`}
                    rules={{ required: true, min: 0.01 }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={index !== 0 ? "sr-only" : ""}>
                          Qty
                        </FormLabel>
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
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name={`lineItems.${index}.unitPrice`}
                    rules={{ required: true, min: 0 }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={index !== 0 ? "sr-only" : ""}>
                          Price
                        </FormLabel>
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
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-2">
                  <div className="flex flex-col space-y-2">
                    <span
                      className={
                        index !== 0
                          ? "sr-only text-sm font-medium"
                          : "text-sm font-medium"
                      }
                    >
                      Total
                    </span>
                    <div className="h-10 flex items-center px-3 text-sm border rounded-md bg-muted">
                      {new Intl.NumberFormat("de-DE", {
                        style: "currency",
                        currency: "EUR",
                      }).format(
                        (lineItems[index]?.quantity || 0) *
                        (lineItems[index]?.unitPrice || 0),
                      )}
                    </div>
                  </div>
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
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="md:w-1/2 md:ml-auto space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  {new Intl.NumberFormat("de-DE", {
                    style: "currency",
                    currency: "EUR",
                  }).format(subtotal)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Discount (%)</span>
                <FormField
                  control={form.control}
                  name="discountPercent"
                  render={({ field }) => (
                    <Input
                      type="number"
                      className="w-24 text-right h-8"
                      min="0"
                      max="100"
                      placeholder="0"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  )}
                />
              </div>
              <div className="flex justify-between font-medium">
                <span>Net Total</span>
                <span>
                  {new Intl.NumberFormat("de-DE", {
                    style: "currency",
                    currency: "EUR",
                  }).format(netTotal)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>VAT ({(taxRate * 100).toFixed(0)}%)</span>
                <span>
                  {new Intl.NumberFormat("de-DE", {
                    style: "currency",
                    currency: "EUR",
                  }).format(taxAmount)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total Gross</span>
                <span>
                  {new Intl.NumberFormat("de-DE", {
                    style: "currency",
                    currency: "EUR",
                  }).format(grossTotal)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="paymentTerms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Terms</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g. 14 days net" {...field} />
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
                  <FormLabel>Notes / Intro Text</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Introduction text for the offer..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            Save Offer
          </Button>
        </div>
      </form>
    </Form>
  );
}

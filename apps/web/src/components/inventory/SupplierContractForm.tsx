import { useForm, useFieldArray } from "react-hook-form";
import {
  SupplierContract,
  SupplierContractType,
  ValueType,
} from "@kompass/shared";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus } from "lucide-react";

// For simplicity in MVP, we might treat scope as newline separated string in UI
// but convert to array for API.

interface SupplierContractFormProps {
  supplierId: string;
  defaultValues?: Partial<SupplierContract>;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function SupplierContractForm({
  supplierId,
  defaultValues,
  onSubmit,
  isLoading,
  onCancel,
}: SupplierContractFormProps) {
  // Initial values helper
  const getInitialValues = () => ({
    supplierId,
    contractType: "framework" as SupplierContractType,
    valueType: "Fixed" as ValueType,
    title: "",
    description: "",
    contractValue: 0,
    currency: "EUR",
    startupDate: new Date().toISOString().split("T")[0],
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
      .toISOString()
      .split("T")[0],
    termsAccepted: false,
    insuranceRequired: true,
    ...defaultValues,
    // If editing existing, transform scope and paymentSchedule
    scope: Array.isArray(defaultValues?.scope)
      ? defaultValues?.scope.join("\n")
      : defaultValues?.scope || "",
    paymentSchedule: defaultValues?.paymentSchedule || [
      {
        description: "Anzahlung (30%)",
        percentage: 30,
        amount: 0,
        dueCondition: "Bei Vertragsabschluss",
        status: "Pending",
      },
      {
        description: "Abschlusszahlung (70%)",
        percentage: 70,
        amount: 0,
        dueCondition: "Nach Abnahme",
        status: "Pending",
      },
    ],
  });

  const form = useForm<any>({
    defaultValues: getInitialValues(),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "paymentSchedule",
  });

  // Auto-calculate amounts when percentage changes
  // This is a bit complex to do perfectly in react-hook-form without side effects,
  // but we can listen to value changes or just calculate on render if not editing amount directly.
  // For MVP, simplistic approach:

  const handleSubmit = async (data: any) => {
    // Transform UI data to API data
    const apiData = {
      ...data,
      scope: data.scope.split("\n").filter((s: string) => s.trim().length > 0),
      contractValue: parseFloat(data.contractValue),
      paymentSchedule: data.paymentSchedule.map((p: any) => ({
        ...p,
        percentage: parseFloat(p.percentage),
        amount:
          parseFloat(p.amount) ||
          (parseFloat(data.contractValue) * parseFloat(p.percentage)) / 100,
      })),
    };
    await onSubmit(apiData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* General Info */}
          <Card>
            <CardHeader>
              <CardTitle>Vertragsdaten</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                rules={{ required: "Titel ist erforderlich" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titel</FormLabel>
                    <FormControl>
                      <Input placeholder="z.B. Rahmenvertrag 2025" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contractType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Typ</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="framework">
                            Rahmenvertrag
                          </SelectItem>
                          <SelectItem value="project">
                            Projektvertrag
                          </SelectItem>
                          <SelectItem value="service_agreement">
                            Wartungsvertrag
                          </SelectItem>
                          <SelectItem value="purchase_order">
                            Bestellung (PO)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="valueType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vergütungsart</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Fixed">Festpreis</SelectItem>
                          <SelectItem value="TimeAndMaterial">
                            Aufwand
                          </SelectItem>
                          <SelectItem value="UnitPrice">
                            Einheitspreis
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="contractValue"
                rules={{ required: true, min: 0 }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vertragswert (€)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Startdatum</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={
                            field.value
                              ? new Date(field.value)
                                  .toISOString()
                                  .split("T")[0]
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
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enddatum</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={
                            field.value
                              ? new Date(field.value)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Details & Scope */}
          <Card>
            <CardHeader>
              <CardTitle>Inhalt & Bedingungen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Beschreibung</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Details zum Vertrag..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="scope"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Leistungsumfang (eine Zeile pro Punkt)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="- Leistung 1&#10;- Leistung 2"
                        className="h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center space-x-2">
                <FormField
                  control={form.control}
                  name="insuranceRequired"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Versicherungsnachweis erforderlich
                        </FormLabel>
                        <FormDescription>
                          Lieferant muss gültige Versicherung vorlegen
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Schedule */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Zahlungsplan</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  description: "",
                  percentage: 0,
                  amount: 0,
                  dueCondition: "",
                  status: "Pending",
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" /> Meilenstein
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-12 gap-2 items-end border-b pb-4"
              >
                <div className="col-span-4">
                  <FormField
                    control={form.control}
                    name={`paymentSchedule.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Beschreibung</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="z.B. Anzahlung" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name={`paymentSchedule.${index}.percentage`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Prozent %</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              // logic to update calculated amount could go here
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name={`paymentSchedule.${index}.amount`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Betrag (€)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-3">
                  <FormField
                    control={form.control}
                    name={`paymentSchedule.${index}.dueCondition`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Fälligkeit</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Bedingung" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Abbrechen
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Speichere..." : "Vertrag erstellen"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

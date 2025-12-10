import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useRfq } from "@/hooks/useRfq";
import { CreateRfqDto } from "@kompass/shared";
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
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RfqSupplierSelect } from "./RfqSupplierSelect";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function RfqForm() {
  const navigate = useNavigate();
  const { createRfq, loading } = useRfq();
  const form = useForm<CreateRfqDto>({
    defaultValues: {
      title: "",
      description: "",
      specifications: "",
      quantity: 1,
      unit: "pcs",
      responseDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      invitedSuppliers: [],
      projectId: "",
    },
  });

  const invitedSuppliers = form.watch("invitedSuppliers");

  const onSubmit = async (data: CreateRfqDto) => {
    if (!data.invitedSuppliers || data.invitedSuppliers.length === 0) {
      form.setError("invitedSuppliers" as keyof CreateRfqDto, {
        type: "manual",
        message: "Please select at least 1 supplier",
      });
      return;
    }

    try {
      const result = await createRfq(data);
      navigate(`/rfqs/${result._id}`);
    } catch (error) {
      console.error("Failed to create RFQ", error);
    }
  };

  const handleSupplierSelectionChange = (suppliers: string[]) => {
    form.setValue("invitedSuppliers", suppliers);
    // Clear any previous error
    form.clearErrors("invitedSuppliers" as keyof CreateRfqDto);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Request for Quote</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                rules={{ required: "Title is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="RFQ Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of the RFQ..."
                        className="h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="quantity"
                  rules={{
                    required: "Quantity is required",
                    min: { value: 1, message: "Must be at least 1" },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unit"
                  rules={{ required: "Unit is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. pcs, kg, m" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="responseDeadline"
                  rules={{ required: "Deadline is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Response Deadline</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="specifications"
                rules={{ required: "Specifications are required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specifications</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detailed specifications, requirements, and any special conditions..."
                        className="h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project ID (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Link to a specific project"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Supplier Selection */}
              <div className="space-y-2">
                <RfqSupplierSelect
                  selectedSuppliers={invitedSuppliers || []}
                  onSelectionChange={handleSupplierSelectionChange}
                  minSelection={1}
                  maxSelection={5}
                />
                {form.formState.errors.invitedSuppliers && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Please select at least 1 supplier to invite
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => navigate("/rfqs")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create RFQ"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

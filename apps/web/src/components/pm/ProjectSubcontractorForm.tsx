import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useProjectSubcontractor } from "../../hooks/useProjectSubcontractor";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ServiceCategory } from "@kompass/shared";
import { apiClient } from "../../services/apiClient";

interface Props {
  projectId: string;
  onSuccess: () => void;
}

interface FormData {
  supplierId: string;
  workPackage: string;
  serviceCategory: string; // Enum as string in form
  description: string;
  plannedStartDate: string;
  plannedEndDate: string;
  estimatedCost: number;
}

export function ProjectSubcontractorForm({ projectId, onSuccess }: Props) {
  const { assignSubcontractor } = useProjectSubcontractor(projectId);
  const [suppliers, setSuppliers] = useState<
    { _id: string; companyName: string }[]
  >([]);
  const [_, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Fetch active suppliers
    const loadSuppliers = async () => {
      try {
        const response: any = await apiClient.suppliers.list({
          category: undefined,
        }); // Fetch all or filter
        // Assuming list returns { data: [...] }
        setSuppliers(response.data || []);
      } catch (e) {
        console.error("Failed to load suppliers", e);
      } finally {
        setLoading(false);
      }
    };
    loadSuppliers();
  }, []);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      await assignSubcontractor({
        ...data,
        projectId,
        serviceCategory: data.serviceCategory as ServiceCategory,
        estimatedCost: Number(data.estimatedCost),
      });
      onSuccess();
    } catch (e) {
      console.error(e);
      // alert("Failed to assign"); // Or use toast
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="supplierId">Supplier</Label>
        <Select onValueChange={(val) => setValue("supplierId", val)}>
          <SelectTrigger>
            <SelectValue placeholder="Select supplier" />
          </SelectTrigger>
          <SelectContent>
            {suppliers.map((s) => (
              <SelectItem key={s._id} value={s._id}>
                {s.companyName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.supplierId && (
          <span className="text-red-500 text-sm">Required</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="workPackage">Work Package</Label>
          <Input
            id="workPackage"
            {...register("workPackage", { required: true })}
            placeholder="e.g. Electrical"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="serviceCategory">Category</Label>
          <Select onValueChange={(val) => setValue("serviceCategory", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ServiceCategory).map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Scope)</Label>
        <Input
          id="description"
          {...register("description", { required: true })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="plannedStartDate">Start Date</Label>
          <Input
            id="plannedStartDate"
            type="date"
            {...register("plannedStartDate", { required: true })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="plannedEndDate">End Date</Label>
          <Input
            id="plannedEndDate"
            type="date"
            {...register("plannedEndDate", { required: true })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="estimatedCost">Estimated Cost (€)</Label>
        <Input
          id="estimatedCost"
          type="number"
          {...register("estimatedCost", { required: true, min: 0 })}
        />
      </div>

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Assigning..." : "Assign Subcontractor"}
      </Button>
    </form>
  );
}

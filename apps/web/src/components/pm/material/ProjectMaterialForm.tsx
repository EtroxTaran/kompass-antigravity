import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ProjectMaterialRequirement } from "@kompass/shared";
import { useMaterials } from "@/hooks/useMaterials";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProjectMaterialFormProps {
    initialData?: ProjectMaterialRequirement;
    projectId: string;
    onSave: (data: Partial<ProjectMaterialRequirement>) => Promise<void>;
    onCancel: () => void;
}

export function ProjectMaterialForm({ initialData, projectId, onSave, onCancel }: ProjectMaterialFormProps) {
    const { materials } = useMaterials();
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<Partial<ProjectMaterialRequirement>>({
        defaultValues: initialData || {
            projectId,
            quantity: 1,
            unit: 'pc',
            status: 'planned'
        }
    });

    const selectedMaterialId = watch("materialId");

    // Auto-fill details when material selected
    useEffect(() => {
        if (selectedMaterialId && materials) {
            const material = materials.find(m => m._id === selectedMaterialId);
            if (material) {
                if (!initialData) { // Only overwrite if new entry
                    setValue("description", material.name);
                    setValue("unit", material.unit);
                    setValue("estimatedUnitPrice", material.averagePrice || material.purchasePrice || 0);
                }
            }
        }
    }, [selectedMaterialId, materials, setValue, initialData]);

    const onSubmit = async (data: Partial<ProjectMaterialRequirement>) => {
        setLoading(true);
        try {
            await onSave(data);
            onCancel();
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-2">
                <Label>Catalog Material (Optional)</Label>
                <Select
                    onValueChange={(value) => setValue("materialId", value)}
                    defaultValue={initialData?.materialId}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select material..." />
                    </SelectTrigger>
                    <SelectContent>
                        {materials.map((m) => (
                            <SelectItem key={m._id} value={m._id || ''}>
                                {m.name} ({m.itemNumber})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                    id="description"
                    {...register("description", { required: true })}
                    placeholder="Material name or description"
                />
                {errors.description && <span className="text-red-500 text-sm">Required</span>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                        id="quantity"
                        type="number"
                        step="0.01"
                        {...register("quantity", { required: true, min: 0, valueAsNumber: true })}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                        id="unit"
                        {...register("unit", { required: true })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="estimatedUnitPrice">Est. Unit Price (€)</Label>
                    <Input
                        id="estimatedUnitPrice"
                        type="number"
                        step="0.01"
                        {...register("estimatedUnitPrice", { min: 0, valueAsNumber: true })}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                        onValueChange={(value: string) => setValue("status", value as any)}
                        defaultValue={initialData?.status || 'planned'}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="planned">Planned</SelectItem>
                            <SelectItem value="ordered">Ordered</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <DialogFooter>
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : (initialData ? "Update" : "Add")}
                </Button>
            </DialogFooter>
        </form>
    );
}

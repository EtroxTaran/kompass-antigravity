import { useState } from "react";
import { ProjectMaterialRequirement } from "@kompass/shared";
import { useProjectMaterials } from "@/hooks/useProjectMaterials";
import { ProjectMaterialForm } from "./ProjectMaterialForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProjectMaterialListProps {
  projectId: string;
}

export function ProjectMaterialList({ projectId }: ProjectMaterialListProps) {
  const { materials, loading, addMaterial, updateMaterial, deleteMaterial } =
    useProjectMaterials(projectId);
  const [editingItem, setEditingItem] =
    useState<ProjectMaterialRequirement | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEdit = (item: ProjectMaterialRequirement) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this requirement?")) {
      await deleteMaterial(id);
    }
  };

  const handleSave = async (data: Partial<ProjectMaterialRequirement>) => {
    if (editingItem && editingItem._id) {
      await updateMaterial(editingItem._id, data);
    } else {
      await addMaterial(data);
    }
  };

  const totalEstimatedCost = materials.reduce(
    (sum, item) => sum + (item.estimatedTotalCost || 0),
    0,
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ordered":
        return "bg-yellow-100 text-yellow-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold tracking-tight">
          Material Requirements
        </h2>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Material
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Est. Material Cost
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalEstimatedCost)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead className="text-right">Est. Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : materials.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-4 text-muted-foreground"
                >
                  No material requirements planned.
                </TableCell>
              </TableRow>
            ) : (
              materials.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="font-medium">
                    {item.description}
                    {item.materialId && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        (Catalog)
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.estimatedUnitPrice)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.estimatedTotalCost)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getStatusColor(item.status)}
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDelete(item._id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Material" : "Add Material Requirement"}
            </DialogTitle>
          </DialogHeader>
          <ProjectMaterialForm
            initialData={editingItem || undefined}
            projectId={projectId}
            onSave={handleSave}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

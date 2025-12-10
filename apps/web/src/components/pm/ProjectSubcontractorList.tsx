import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProjectSubcontractor } from "../../hooks/useProjectSubcontractor";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Plus, AlertTriangle, Star } from "lucide-react";
import { Badge } from "../ui/badge";
import { ProjectSubcontractorForm } from "./ProjectSubcontractorForm";
import { SubcontractorProgressCard } from "./SubcontractorProgressCard";
import { SupplierRatingForm } from "../supplier/SupplierRatingForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export function ProjectSubcontractorList() {
  const { projectId } = useParams<{ projectId: string }>();
  const { subcontractors, fetchSubcontractors, loading, error } =
    useProjectSubcontractor(projectId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    fetchSubcontractors();
  }, [fetchSubcontractors]);

  if (loading && subcontractors.length === 0) {
    return <div>Loading subcontractors...</div>;
  }

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Subcontractors & Suppliers</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Assign Subcontractor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Assign Subcontractor</DialogTitle>
            </DialogHeader>
            <ProjectSubcontractorForm
              projectId={projectId!}
              onSuccess={() => {
                setIsDialogOpen(false);
                fetchSubcontractors();
              }}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>
        )}

        {subcontractors.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No subcontractors assigned yet.
          </div>
        ) : (
          <div className="space-y-4">
            {subcontractors.map((sub) => (
              <div
                key={sub._id}
                className="border rounded-lg p-4 flex flex-col md:flex-row gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{sub.workPackage}</h3>
                    <Badge
                      variant={
                        sub.status === "Completed" ? "default" : "outline"
                      }
                    >
                      {sub.status}
                    </Badge>
                    {sub.budgetStatus === "Warning" ||
                    sub.budgetStatus === "Exceeded" ? (
                      <Badge
                        variant="destructive"
                        className="flex items-center gap-1"
                      >
                        <AlertTriangle className="h-3 w-3" /> Budget{" "}
                        {sub.budgetStatus}
                      </Badge>
                    ) : null}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {sub.description}
                  </p>
                  <p className="text-sm mt-2">
                    <span className="font-medium">Planned:</span>{" "}
                    {new Date(sub.plannedStartDate).toLocaleDateString()} -{" "}
                    {new Date(sub.plannedEndDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="md:w-1/3">
                  <SubcontractorProgressCard assignment={sub} />
                  {sub.status === "Completed" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => {
                        setSelectedSub({
                          id: sub.supplierId,
                          name:
                            (
                              sub as unknown as {
                                supplier?: { companyName: string };
                              }
                            ).supplier?.companyName || "Supplier",
                        });
                        setIsRatingOpen(true);
                      }}
                    >
                      <Star className="mr-2 h-4 w-4" />
                      Rate Supplier
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {selectedSub && (
        <SupplierRatingForm
          supplierId={selectedSub.id}
          supplierName={selectedSub.name}
          projectId={projectId}
          open={isRatingOpen}
          onOpenChange={setIsRatingOpen}
          onSuccess={() => {
            setIsRatingOpen(false);
            // Optional: refresh list or show toast
          }}
        />
      )}
    </Card>
  );
}

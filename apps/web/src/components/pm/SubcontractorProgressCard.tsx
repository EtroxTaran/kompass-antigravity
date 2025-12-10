import { useState } from "react";
import { Button } from "../ui/button";
import { ProjectSubcontractor } from "@kompass/shared";
import { useProjectSubcontractor } from "../../hooks/useProjectSubcontractor";
import { Loader2 } from "lucide-react";
import { Slider } from "../ui/slider";

interface Props {
  assignment: ProjectSubcontractor;
}

export function SubcontractorProgressCard({ assignment }: Props) {
  const { updateAssignment } = useProjectSubcontractor(assignment.projectId);
  const [progress, setProgress] = useState(
    assignment.completionPercentage || 0,
  );
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await updateAssignment(assignment._id, {
        completionPercentage: progress,
      });
    } finally {
      setUpdating(false);
    }
  };

  const hasChanged = progress !== assignment.completionPercentage;

  return (
    <div className="bg-slate-50 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Completion</span>
        <span className="text-sm font-bold">{progress}%</span>
      </div>
      <Slider
        value={[progress]}
        onValueChange={(val) => setProgress(val[0])}
        max={100}
        step={5}
        className="mb-4"
      />

      <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
        <span>Cost: {assignment.estimatedCost}€</span>
        {assignment.actualCost ? (
          <span
            className={
              assignment.budgetStatus === "Exceeded"
                ? "text-red-500 font-bold"
                : ""
            }
          >
            Actual: {assignment.actualCost}€
          </span>
        ) : (
          <span>No invoices yet</span>
        )}
      </div>

      {hasChanged && (
        <Button
          size="sm"
          onClick={handleUpdate}
          disabled={updating}
          className="w-full"
        >
          {updating && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
          Update Progress
        </Button>
      )}
    </div>
  );
}

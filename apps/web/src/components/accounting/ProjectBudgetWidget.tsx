import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Project } from "@kompass/shared";
import { cn } from "@/lib/utils";

interface ProjectBudgetWidgetProps {
    project: Project;
}

export function ProjectBudgetWidget({ project }: ProjectBudgetWidgetProps) {
    const budget = project.budget || 0;
    const actual = project.actualTotalCost || 0;

    // Calculate percentage, capped at 100 for progress bar (or maybe allow >100 visualization?)
    // For progress bar: usually max 100.
    const percent = budget > 0 ? (actual / budget) * 100 : 0;
    const progressValue = Math.min(percent, 100);

    const statusColor =
        project.budgetStatus === 'Exceeded' ? 'bg-red-500' :
            project.budgetStatus === 'Warning' ? 'bg-amber-500' :
                'bg-green-500'; // Default OnTrack

    const statusTextColor =
        project.budgetStatus === 'Exceeded' ? 'text-red-500' :
            project.budgetStatus === 'Warning' ? 'text-amber-500' :
                'text-green-500';

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Budget-Status</CardTitle>
                <span className={cn("text-xs font-bold px-2 py-1 rounded-full bg-secondary", statusTextColor)}>
                    {project.budgetStatus === 'Exceeded' ? 'ÜBERZOGEN' :
                        project.budgetStatus === 'Warning' ? 'WARNUNG' : 'OK'}
                </span>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(actual)}
                </div>
                <p className="text-xs text-muted-foreground">
                    von {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(budget)} Budget
                </p>
                <Progress value={progressValue} className={cn("mt-4 h-2", statusColor)} indicatorClassName={statusColor} />
                <p className="text-xs text-muted-foreground mt-2 text-right">
                    {percent.toFixed(1)}% Verbraucht
                </p>
            </CardContent>
        </Card>
    );
}

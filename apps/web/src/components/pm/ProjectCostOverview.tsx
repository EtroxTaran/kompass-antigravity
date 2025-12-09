import { Project } from "@kompass/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Euro, TrendingUp, AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectCostOverviewProps {
    project: Project;
}

export function ProjectCostOverview({ project }: ProjectCostOverviewProps) {
    const budget = project.budget || 0;
    const actual = project.actualTotalCost || 0;

    const percentage = budget > 0 ? (actual / budget) * 100 : 0;

    let statusColor = "bg-green-500";
    let statusIcon = <CheckCircle className="h-5 w-5 text-green-500" />;
    let statusText = "On Track";

    if (percentage >= 100) {
        statusColor = "bg-red-500";
        statusIcon = <AlertCircle className="h-5 w-5 text-red-500" />;
        statusText = "Budget Exceeded";
    } else if (percentage >= 80) {
        statusColor = "bg-yellow-500";
        statusIcon = <AlertTriangle className="h-5 w-5 text-yellow-500" />;
        statusText = "Warning";
    }

    const formatCurrency = (amount?: number) => {
        return new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR",
        }).format(amount || 0);
    };

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
                        <Euro className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(actual)}</div>
                        <p className="text-xs text-muted-foreground">
                            of {formatCurrency(budget)} budget
                        </p>
                        <Progress value={Math.min(percentage, 100)} className={cn("mt-2 h-2", percentage > 100 && "bg-red-200")} indicatorClassName={statusColor} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Budget Status</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2">
                            {statusIcon}
                            <div className="text-2xl font-bold">{statusText}</div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {percentage.toFixed(1)}% used
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Cost Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <span className="text-sm font-medium text-muted-foreground">Material</span>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold">{formatCurrency(project.actualMaterialCost)}</span>
                                    <span className="text-xs text-muted-foreground">Est: {formatCurrency(project.estimatedMaterialCost)}</span>
                                </div>
                                <Progress value={project.estimatedMaterialCost ? ((project.actualMaterialCost || 0) / project.estimatedMaterialCost) * 100 : 0} className="h-1.5" />
                            </div>
                            <div className="space-y-2">
                                <span className="text-sm font-medium text-muted-foreground">Labor</span>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold">{formatCurrency(project.actualLaborCost)}</span>
                                    <span className="text-xs text-muted-foreground">Est: {formatCurrency(project.estimatedLaborCost)}</span>
                                </div>
                                <Progress value={project.estimatedLaborCost ? ((project.actualLaborCost || 0) / project.estimatedLaborCost) * 100 : 0} className="h-1.5" />
                            </div>
                            <div className="space-y-2">
                                <span className="text-sm font-medium text-muted-foreground">Subcontractor</span>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold">{formatCurrency(project.actualSubcontractorCost)}</span>
                                    <span className="text-xs text-muted-foreground">Est: {formatCurrency(project.estimatedSubcontractorCost)}</span>
                                </div>
                                <Progress value={project.estimatedSubcontractorCost ? ((project.actualSubcontractorCost || 0) / project.estimatedSubcontractorCost) * 100 : 0} className="h-1.5" />
                            </div>
                            <div className="space-y-2">
                                <span className="text-sm font-medium text-muted-foreground">Expenses/Misc</span>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold">{formatCurrency(project.actualExpenses)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

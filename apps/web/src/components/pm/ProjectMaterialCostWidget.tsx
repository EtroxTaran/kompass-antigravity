import { useProjectMaterialCosts } from "@/hooks/useProjectMaterialCosts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ProjectMaterialCostWidgetProps {
    projectId: string;
}

/**
 * Widget displaying project material costs vs budget
 * Color coding: <80% green, 80-100% amber, >100% red
 */
export function ProjectMaterialCostWidget({ projectId }: ProjectMaterialCostWidgetProps) {
    const { costs, loading, error } = useProjectMaterialCosts(projectId);

    if (loading) {
        return (
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Materialkosten
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-8 w-3/4" />
                </CardContent>
            </Card>
        );
    }

    if (error || !costs) {
        return (
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Materialkosten
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{error || "Keine Daten verfügbar"}</p>
                </CardContent>
            </Card>
        );
    }

    // Determine color based on percentage
    const getStatusColor = (percent: number) => {
        if (percent >= 100) return "text-red-600 dark:text-red-400";
        if (percent >= 80) return "text-amber-600 dark:text-amber-400";
        return "text-green-600 dark:text-green-400";
    };

    const getProgressColor = (percent: number) => {
        if (percent >= 100) return "bg-red-500";
        if (percent >= 80) return "bg-amber-500";
        return "bg-green-500";
    };

    const getStatusIcon = (percent: number) => {
        if (percent >= 100) return <AlertTriangle className="h-4 w-4" />;
        if (costs.variance > 0) return <TrendingDown className="h-4 w-4" />;
        return <TrendingUp className="h-4 w-4" />;
    };

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value);

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Materialkosten
                    </span>
                    <span className={cn("text-xs flex items-center gap-1", getStatusColor(costs.percentUsed))}>
                        {getStatusIcon(costs.percentUsed)}
                        {costs.percentUsed.toFixed(1)}%
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Progress bar */}
                <div className="space-y-1">
                    <Progress
                        value={Math.min(costs.percentUsed, 100)}
                        className={cn("h-2", getProgressColor(costs.percentUsed))}
                    />
                </div>

                {/* Cost details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-muted-foreground">Geschätzt</p>
                        <p className="font-medium">{formatCurrency(costs.estimated)}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Tatsächlich</p>
                        <p className="font-medium">{formatCurrency(costs.actual)}</p>
                    </div>
                </div>

                {/* Variance */}
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Differenz</span>
                    <span className={cn("font-medium", costs.variance >= 0 ? "text-green-600" : "text-red-600")}>
                        {costs.variance >= 0 ? "+" : ""}{formatCurrency(costs.variance)}
                    </span>
                </div>

                {/* Item counts */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{costs.deliveredCount} von {costs.itemCount} Positionen geliefert</span>
                    <Link
                        to={`/projects/${projectId}/materials`}
                        className="text-primary hover:underline"
                    >
                        Alle anzeigen →
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

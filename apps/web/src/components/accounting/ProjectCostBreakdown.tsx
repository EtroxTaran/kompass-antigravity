import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Project } from "@kompass/shared";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface ProjectCostBreakdownProps {
    project: Project;
}

export function ProjectCostBreakdown({ project }: ProjectCostBreakdownProps) {
    const data = [
        { name: 'Material', value: project.actualMaterialCost || 0, color: '#3b82f6' }, // blue-500
        { name: 'Arbeit', value: project.actualLaborCost || 0, color: '#22c55e' }, // green-500
        { name: 'Subunternehmer', value: project.actualSubcontractorCost || 0, color: '#f59e0b' }, // amber-500
        { name: 'Ausgaben', value: project.actualExpenses || 0, color: '#64748b' }, // slate-500
    ].filter(item => item.value > 0);

    if (data.length === 0) {
        return (
            <Card className="flex flex-col h-full">
                <CardHeader className="items-center pb-0">
                    <CardTitle>Kostenverteilung</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 pb-0 flex items-center justify-center min-h-[200px] text-muted-foreground text-sm">
                    Keine Daten vorhanden
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Kostenverteilung</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value)}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

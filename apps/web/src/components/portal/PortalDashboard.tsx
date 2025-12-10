import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { portalApi } from "@/services/apiClient";
import { Project } from "@kompass/shared";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { Loader2, ArrowRight, Calendar } from "lucide-react";
import { format } from "date-fns";

export function PortalDashboard() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        portalApi.getProjects()
            .then(setProjects)
            .catch((err) => console.error("Failed to load projects", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <PortalLayout>
                <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                </div>
            </PortalLayout>
        );
    }

    return (
        <PortalLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Your Projects</h1>
                <p className="text-slate-500 mt-2">Track status, timeline, and documents.</p>
            </div>

            {projects.length === 0 ? (
                <div className="text-center p-12 bg-white rounded-lg border border-dashed">
                    <p className="text-slate-500">No active projects found.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    {projects.map((project) => (
                        <Link key={project._id} to={`/portal/projects/${project._id}`} className="block group">
                            <Card className="h-full transition-shadow hover:shadow-lg border-slate-200">
                                <CardHeader className="pb-4">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                                            {project.name}
                                        </CardTitle>
                                        <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                                            {project.status.replace('_', ' ').toUpperCase()}
                                        </Badge>
                                    </div>
                                    <div className="text-sm text-slate-500 font-mono">
                                        {project.projectNumber}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Completion</span>
                                            <span className="font-medium">
                                                {/* Mock progress for now, or derive from tasks if available */}
                                                {project.status === 'completed' ? 100 : project.status === 'planning' ? 10 : 45}%
                                            </span>
                                        </div>
                                        <Progress value={project.status === 'completed' ? 100 : project.status === 'planning' ? 10 : 45} />
                                    </div>

                                    {project.startDate && (
                                        <div className="flex items-center text-sm text-slate-600">
                                            <Calendar className="mr-2 h-4 w-4" />
                                            <span>Started: {format(new Date(project.startDate), 'MMM d, yyyy')}</span>
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter className="pt-2">
                                    <div className="text-sm text-blue-600 flex items-center group-hover:underline">
                                        View Details <ArrowRight className="ml-1 h-3 w-3" />
                                    </div>
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </PortalLayout>
    );
}

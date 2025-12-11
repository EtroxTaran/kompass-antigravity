import { useEffect, useState } from "react";
import { Project } from "@kompass/shared";
import { projectsApi } from "@/services/apiClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

interface SimilarProjectsWidgetProps {
    projectId: string;
}

export function SimilarProjectsWidget({ projectId }: SimilarProjectsWidgetProps) {
    const [similarProjects, setSimilarProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchSimilar() {
            try {
                const result = await projectsApi.findSimilar(projectId);
                setSimilarProjects(result as unknown as Project[]);
            } catch (error) {
                console.error("Failed to fetch similar projects", error);
            } finally {
                setLoading(false);
            }
        }

        if (projectId) {
            fetchSimilar();
        }
    }, [projectId]);

    if (loading) return null;
    if (similarProjects.length === 0) return null;

    return (
        <Card className="mt-6 border-blue-100 bg-blue-50/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-500" />
                    Similar Projects
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {similarProjects.slice(0, 3).map((project) => (
                        <div
                            key={project._id}
                            className="flex flex-col space-y-2 rounded-lg border bg-white p-3 shadow-sm transition-all hover:bg-slate-50 cursor-pointer"
                            onClick={() => navigate(`/projects/${project._id}`)}
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-semibold">{project.name}</span>
                                <Badge variant="outline" className="text-xs">
                                    {project.status}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{project.projectNumber}</span>
                                {project.budget && (
                                    <span>• {project.budget.toLocaleString()} €</span>
                                )}
                            </div>
                            {project.tags && project.tags.length > 0 && (
                                <div className="flex gap-1 flex-wrap mt-1">
                                    {project.tags.slice(0, 2).map((tag) => (
                                        <span key={tag} className="text-[10px] bg-slate-100 px-1 rounded">
                                            {tag}
                                        </span>
                                    ))}
                                    {project.tags.length > 2 && (
                                        <span className="text-[10px] text-muted-foreground">
                                            +{project.tags.length - 2}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

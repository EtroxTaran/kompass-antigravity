import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { portalApi } from "@/services/apiClient";
import { Project } from "@kompass/shared";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, ArrowLeft, Calendar, FileText, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

export function PortalProjectDetail() {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            portalApi.getProject(id)
                .then(setProject)
                .catch((err) => console.error("Failed to load project", err))
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) {
        return (
            <PortalLayout>
                <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                </div>
            </PortalLayout>
        );
    }

    if (!project) {
        return (
            <PortalLayout>
                <div className="text-center p-12">
                    <p>Project not found</p>
                    <Link to="/portal/projects" className="text-blue-600 hover:underline">Back to Overview</Link>
                </div>
            </PortalLayout>
        );
    }

    return (
        <PortalLayout>
            <div className="mb-6">
                <Link to="/portal/projects" className="text-slate-500 hover:text-slate-900 inline-flex items-center mb-4 text-sm">
                    <ArrowLeft className="mr-1 h-3 w-3" /> Back
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{project.name}</h1>
                        <p className="text-slate-500">{project.projectNumber}</p>
                    </div>
                    <Badge className="w-fit" variant={project.status === 'active' ? 'default' : 'secondary'}>
                        {project.status.toUpperCase()}
                    </Badge>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Timeline</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Overall Progress</span>
                                    <span className="font-semibold">{project.status === 'completed' ? 100 : 45}%</span>
                                </div>
                                <Progress value={project.status === 'completed' ? 100 : 45} />
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                <div>
                                    <p className="text-sm text-slate-500">Start Date</p>
                                    <p className="font-medium">{project.startDate ? format(new Date(project.startDate), 'PPP') : 'TBD'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Est. Completion</p>
                                    <p className="font-medium">{project.endDate ? format(new Date(project.endDate), 'PPP') : 'TBD'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Documents</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Placeholder for documents */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-5 w-5 text-blue-600" />
                                        <div>
                                            <p className="font-medium text-sm">Offer #{project.offerId || 'N/A'}</p>
                                            <p className="text-xs text-slate-500">PDF Document</p>
                                        </div>
                                    </div>
                                    <button className="text-sm text-blue-600 font-medium hover:underline">Download</button>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-5 w-5 text-blue-600" />
                                        <div>
                                            <p className="font-medium text-sm">Project Plan</p>
                                            <p className="text-xs text-slate-500">Shared Resource</p>
                                        </div>
                                    </div>
                                    <button className="text-sm text-blue-600 font-medium hover:underline">View</button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Milestones</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 relative pl-4 border-l-2 border-slate-100">
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-green-500 border-2 border-white ring-1 ring-green-100"></div>
                                    <p className="text-sm font-medium">Project Created</p>
                                    <p className="text-xs text-slate-500">Completed</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-blue-500 border-2 border-white ring-1 ring-blue-100"></div>
                                    <p className="text-sm font-medium">Planning Phase</p>
                                    <p className="text-xs text-slate-500">In Progress</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-slate-200 border-2 border-white"></div>
                                    <p className="text-sm font-medium text-slate-500">Production</p>
                                    <p className="text-xs text-slate-400">Upcoming</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-slate-200 border-2 border-white"></div>
                                    <p className="text-sm font-medium text-slate-500">Delivery</p>
                                    <p className="text-xs text-slate-400">Upcoming</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Need Help?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-600 mb-4">Contact your project manager for updates.</p>
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                                    JD
                                </div>
                                <div>
                                    <p className="text-sm font-medium">John Doe</p>
                                    <p className="text-xs text-slate-500">Project Manager</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PortalLayout>
    );
}

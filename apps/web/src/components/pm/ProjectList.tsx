import { useProjects } from '@/hooks/useProjects';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Project } from '@kompass/shared';

export function ProjectList() {
    const { projects, loading, addProject } = useProjects();

    const handleAddDummy = () => {
        const dummy: Omit<Project, '_id' | '_rev'> = {
            type: 'project',
            projectNumber: `P-${Date.now()}`,
            name: `Shopfitting Project ${Date.now()}`,
            customerId: 'customer-1',
            status: 'planning',
            projectManagerId: 'user-1',
            teamMemberIds: [],
            createdBy: 'user-1',
            createdAt: new Date().toISOString(),
            modifiedBy: 'user-1',
            modifiedAt: new Date().toISOString(),
            version: 1,
            budget: 50000,
        };
        addProject(dummy);
    };

    if (loading) return <div>Loading Projects...</div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Projects</h2>
                <Button onClick={handleAddDummy}>New Project</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                    <Card key={project._id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {project.projectNumber}
                            </CardTitle>
                            <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                                {project.status}
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold truncate">{project.name}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Budget: {project.budget?.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                            </p>
                        </CardContent>
                    </Card>
                ))}
                {projects.length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground py-8">
                        No active projects.
                    </div>
                )}
            </div>
        </div>
    );
}

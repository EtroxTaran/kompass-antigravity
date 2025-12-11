import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import { FileText, Edit, Trash, Plus, Activity } from 'lucide-react';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { activitiesApi } from '@/services/apiClient';
import { MainLayout } from '@/components/layout/MainLayout';

interface ActivityEvent {
    _id: string;
    documentId: string;
    operation: 'CREATE' | 'UPDATE' | 'DELETE';
    userId: string;
    userEmail?: string;
    timestamp: string;
    changes?: {
        field: string;
        oldValue: unknown;
        newValue: unknown;
    }[];
    entityType?: string; // Assuming the list endpoint might return this
}

export function ActivitiesPage() {
    const [activities, setActivities] = useState<ActivityEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            setIsLoading(true);
            try {
                // Using the specific list endpoint for global activities
                const response = await activitiesApi.list();
                const data = response.data;
                setActivities((data as unknown) as ActivityEvent[]);
            } catch (error) {
                console.error('Failed to fetch activities:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchActivities();
    }, []);

    const getIcon = (operation: string) => {
        switch (operation) {
            case 'CREATE': return <Plus className="h-4 w-4 text-green-500" />;
            case 'UPDATE': return <Edit className="h-4 w-4 text-blue-500" />;
            case 'DELETE': return <Trash className="h-4 w-4 text-red-500" />;
            default: return <FileText className="h-4 w-4 text-gray-500" />;
        }
    };

    const getOperationText = (operation: string) => {
        switch (operation) {
            case 'CREATE': return 'erstellt';
            case 'UPDATE': return 'aktualisiert';
            case 'DELETE': return 'gelöscht';
            default: return 'bearbeitet';
        }
    };

    return (
        <MainLayout
            userRole="ADM" // Default role, or make dynamic
            breadcrumbs={[{ label: "Aktivitäten" }]}
        >
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <Activity className="h-6 w-6 text-primary" />
                    <h1 className="text-2xl font-bold">Aktivitäten</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Letzte Aktivitäten</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[calc(100vh-250px)] pr-4">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                                    Laden...
                                </div>
                            ) : activities.length === 0 ? (
                                <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                                    Keine Aktivitäten gefunden
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {activities.map((activity) => (
                                        <div key={activity._id} className="relative pl-6 pb-2 border-l border-border last:border-0">
                                            <div className="absolute top-0 -left-1.5 bg-background p-0.5 rounded-full border border-border">
                                                {getIcon(activity.operation)}
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-semibold">
                                                            {activity.userEmail || 'System'}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            hat {activity.entityType ? `ein ${activity.entityType}` : 'ein Element'} {getOperationText(activity.operation)}
                                                        </span>
                                                    </div>
                                                    <span className="text-[10px] text-muted-foreground">
                                                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true, locale: de })}
                                                    </span>
                                                </div>

                                                {activity.operation === 'UPDATE' && activity.changes && (
                                                    <div className="mt-1 text-xs text-muted-foreground bg-muted/50 p-2 rounded-md">
                                                        {activity.changes.map((change, i) => (
                                                            <div key={i}>
                                                                <span className="font-medium">{change.field}:</span> {typeof change.oldValue === 'object' ? '...' : String(change.oldValue)} &rarr; {typeof change.newValue === 'object' ? '...' : String(change.newValue)}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}

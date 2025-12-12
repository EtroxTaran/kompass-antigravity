import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { leadsApi } from "@/lib/api/leadsApi";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function LeadDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: lead, isLoading } = useQuery({
        queryKey: ["leads", id],
        queryFn: () => leadsApi.getById(id!),
        enabled: !!id,
    });

    const convertMutation = useMutation({
        mutationFn: () => leadsApi.convert(id!),
        onSuccess: () => {
            toast({
                title: "Lead Converted",
                description: "Lead successfully converted to Customer",
            });
            queryClient.invalidateQueries({ queryKey: ["leads", id] });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to convert lead",
                variant: "destructive",
            });
        },
    });

    if (isLoading) return <div className="p-8">Loading...</div>;
    if (!lead) return <div className="p-8">Lead not found</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/leads")}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">{lead.companyName}</h1>
                <Badge variant={lead.status === "NEW" ? "default" : "outline"}>
                    {lead.status}
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Name</p>
                                <p>{lead.firstName} {lead.lastName}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Position</p>
                                <p>{lead.position || "-"}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Email</p>
                                <p>{lead.email || "-"}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                                <p>{lead.phone || "-"}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Website</p>
                                <p>{lead.website || "-"}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Address</p>
                                <p>{lead.city ? `${lead.city}, ${lead.country}` : "-"}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap">{lead.notes || "No notes."}</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {lead.status !== "CONVERTED" && (
                                <Button
                                    className="w-full"
                                    onClick={() => convertMutation.mutate()}
                                    disabled={convertMutation.isPending}
                                >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Convert to Customer
                                </Button>
                            )}
                            {lead.status === "CONVERTED" && (
                                <div className="p-4 bg-green-50 text-green-800 rounded-md border border-green-200">
                                    Lead has been converted.
                                </div>
                            )}
                            {lead.status !== "CONVERTED" && lead.status !== "REJECTED" && (
                                <Button variant="destructive" className="w-full">
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Reject Lead
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Lead Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Source</p>
                                <p>{lead.source}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Owner</p>
                                <p>{lead.owner}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Created</p>
                                <p>{new Date(lead.createdAt).toLocaleDateString()}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

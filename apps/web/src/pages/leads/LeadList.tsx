import { useQuery } from "@tanstack/react-query";
import { leadsApi } from "@/lib/api/leadsApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function LeadList() {
    const navigate = useNavigate();
    const { data: leads, isLoading } = useQuery({
        queryKey: ["leads"],
        queryFn: () => leadsApi.getAll(),
    });

    if (isLoading) {
        return <div className="p-8">Loading leads...</div>;
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "NEW":
                return <Badge variant="default">New</Badge>;
            case "QUALIFIED":
                return <Badge variant="secondary">Qualified</Badge>;
            case "CONVERTED":
                return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Converted</Badge>;
            case "REJECTED":
                return <Badge variant="destructive">Rejected</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getSourceLabel = (source: string) => {
        const map: Record<string, string> = {
            TRADESHOW: "Messe",
            COLD_CALL: "Telefonakquise",
            REFERRAL: "Empfehlung",
            WEBSITE: "Webseite",
            OTHER: "Sonstiges",
        };
        return map[source] || source;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
                <Button onClick={() => navigate("/leads/new")}>
                    <Plus className="mr-2 h-4 w-4" /> New Lead
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Leads</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Company</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Source</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>City</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leads && leads.length > 0 ? (
                                leads.map((lead: any) => (
                                    <TableRow
                                        key={lead._id}
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() => navigate(`/leads/${lead._id}`)}
                                    >
                                        <TableCell className="font-medium">
                                            {lead.companyName}
                                        </TableCell>
                                        <TableCell>
                                            {lead.firstName} {lead.lastName}
                                        </TableCell>
                                        <TableCell>{getSourceLabel(lead.source)}</TableCell>
                                        <TableCell>{getStatusBadge(lead.status)}</TableCell>
                                        <TableCell>{lead.city || "-"}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm">
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        No leads found. Create one to get started.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

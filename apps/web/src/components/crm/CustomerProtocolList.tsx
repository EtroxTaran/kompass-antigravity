import { useNavigate } from "react-router-dom";
import { useProtocols } from "@/hooks/useProtocol";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, User, Calendar, ClipboardList } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

interface CustomerProtocolListProps {
    customerId: string;
}

export function CustomerProtocolList({ customerId }: CustomerProtocolListProps) {
    const navigate = useNavigate();
    const { protocols, loading } = useProtocols({ customerId });

    const handleAddProtocol = () => {
        navigate(`/protocols/new?customerId=${customerId}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold">Besuchsprotokolle</h3>
                        <Badge variant="secondary">{protocols.length}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Protokolle und Gesprächsnotizen für diesen Kunden
                    </p>
                </div>
                <Button onClick={handleAddProtocol}>
                    <Plus className="h-4 w-4 mr-2" />
                    Neues Protokoll
                </Button>
            </div>

            {/* Protocol List */}
            {protocols.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <ClipboardList className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Noch keine Protokolle</h3>
                        <p className="text-muted-foreground text-center mb-4">
                            Erstellen Sie ein Besuchsprotokoll, um Gesprächsnotizen und Aktionen festzuhalten
                        </p>
                        <Button onClick={handleAddProtocol}>
                            <Plus className="h-4 w-4 mr-2" />
                            Erstes Protokoll erstellen
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent className="p-0">
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                Datum
                                            </div>
                                        </TableHead>
                                        <TableHead>Titel</TableHead>
                                        <TableHead>Teilnehmer</TableHead>
                                        <TableHead className="text-right">Aktionen</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {protocols.map((protocol) => (
                                        <TableRow
                                            key={protocol._id}
                                            className="cursor-pointer hover:bg-muted/50"
                                            onClick={() => navigate(`/protocols/${protocol._id}/edit`)}
                                        >
                                            <TableCell>{formatDate(protocol.date)}</TableCell>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center">
                                                    <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                                                    {protocol.title}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <User className="h-3 w-3 text-muted-foreground" />
                                                    <span className="text-xs text-muted-foreground">
                                                        {protocol.participants?.length || 0}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Badge variant="outline">
                                                    {protocol.nextActions?.length || 0} ToDos
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

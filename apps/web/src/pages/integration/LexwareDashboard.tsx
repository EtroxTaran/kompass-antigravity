import React, { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { lexwareApi, LexwareSyncStatus } from "@/services/apiClient";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Upload, Download, FileText } from "lucide-react";
import { format } from "date-fns";

export function LexwareDashboard() {
    const [status, setStatus] = useState<LexwareSyncStatus | null>(null);
    const [loading, setLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);

    useEffect(() => {
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        setLoading(true);
        try {
            const data = await lexwareApi.getStatus();
            setStatus(data);
        } catch (error) {
            console.error("Failed to fetch status:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        setSyncing(true);
        try {
            const result = await lexwareApi.triggerExport();
            alert(`Exported ${result.count} contracts to ${result.filename}`);
            fetchStatus();
        } catch (error) {
            console.error("Export failed:", error);
            alert("Export failed");
        } finally {
            setSyncing(false);
        }
    };

    const handleImport = async () => {
        setSyncing(true);
        try {
            const result = await lexwareApi.triggerImport();
            alert(
                `Processed ${result.processedFiles} files. Updated ${result.invoicesUpdated} invoices.`,
            );
            fetchStatus();
        } catch (error) {
            console.error("Import failed:", error);
            alert("Import failed");
        } finally {
            setSyncing(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Lexware Integration
                    </h1>
                    <p className="text-muted-foreground">
                        Manage contract exports and payment imports.
                    </p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline" onClick={fetchStatus} disabled={loading}>
                        <RefreshCw
                            className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
                        />
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Actions</CardTitle>
                        <CardDescription>Manual sync triggers</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium">Export Contracts</h3>
                                <p className="text-sm text-muted-foreground">
                                    Generate CSV for Lexware (Signed Contracts)
                                </p>
                            </div>
                            <Button onClick={handleExport} disabled={syncing}>
                                <Upload className="mr-2 h-4 w-4" />
                                Export
                            </Button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium">Import Payments</h3>
                                <p className="text-sm text-muted-foreground">
                                    Process Payment CSVs from Lexware
                                </p>
                            </div>
                            <Button onClick={handleImport} disabled={syncing}>
                                <Download className="mr-2 h-4 w-4" />
                                Import
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Configuration</CardTitle>
                        <CardDescription>File system paths</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div>
                                <span className="font-medium">Export Path:</span>
                                <code className="ml-2 bg-muted px-2 py-1 rounded text-sm">
                                    {status?.exportPath || "..."}
                                </code>
                            </div>
                            <div>
                                <span className="font-medium">Import Path:</span>
                                <code className="ml-2 bg-muted px-2 py-1 rounded text-sm">
                                    {status?.importPath || "..."}
                                </code>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>File History</CardTitle>
                    <CardDescription>Recent export and import files</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Filename</TableHead>
                                <TableHead>Created At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {status?.files.map((file, i) => (
                                <TableRow key={i}>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                file.type === "export" ? "default" : "secondary"
                                            }
                                        >
                                            {file.type.toUpperCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-mono text-sm">
                                        {file.filename}
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(file.createdAt), "dd.MM.yyyy HH:mm:ss")}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {status?.files.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center">
                                        No files found
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

export function LexwareDashboardPage() {
    return (
        <MainLayout
            userRole="GF"
            breadcrumbs={[
                { label: "Integration", href: "/integration" },
                { label: "Lexware" },
            ]}
        >
            <LexwareDashboard />
        </MainLayout>
    );
}

import { useState, useEffect } from "react";
import { customersApi } from "@/services/apiClient";
import { AuditTimeline, AuditLogEntry } from "@/components/audit/AuditTimeline";
import { Loader2 } from "lucide-react";

interface CustomerAuditHistoryProps {
    customerId: string;
}

export function CustomerAuditHistory({ customerId }: CustomerAuditHistoryProps) {
    const [logs, setLogs] = useState<AuditLogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                setLoading(true);
                const data = await customersApi.getAuditLog(customerId);
                // Map API response to AuditLogEntry if necessary, assuming 1:1 match for now based on Shared implementations
                // Backend returns: { _id, type, documentId, operation, hash, previousHash, userId, timestamp, changes }
                // Frontend expects: { id, timestamp, userId, userName, action, entityType, entityId, changes }

                // We need to map backend "operation" to frontend "action" and ensure other fields match.
                // Also backend doesn't seem to return userName directly in the LogEntry interface I saw earlier?
                // Wait, AuditService.logChange logs userId and userEmail. 
                // AuditTimeline expects userId and userName.
                // I might need to map email to userName or just use email as name if name missing.

                const mappedLogs: AuditLogEntry[] = data.map((log: any) => ({
                    id: log._id,
                    timestamp: log.timestamp,
                    userId: log.userId,
                    userName: log.userEmail || "Unknown", // Fallback
                    action: log.operation,
                    entityType: "Customer", // Hardcoded for this view
                    entityId: log.documentId,
                    entityName: "", // Can be filled if we want
                    changes: log.changes || [],
                    immutable: true, // It is backed by hash chain
                }));

                setLogs(mappedLogs);
            } catch (err) {
                console.error("Failed to fetch audit logs", err);
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        if (customerId) {
            fetchLogs();
        }
    }, [customerId]);

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-center text-red-500 bg-red-50 rounded-lg">
                Audit-Protokoll konnte nicht geladen werden.
            </div>
        );
    }

    return <AuditTimeline entries={logs} />;
}

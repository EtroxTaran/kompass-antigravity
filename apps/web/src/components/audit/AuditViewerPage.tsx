import { AuditTimeline, AuditLogEntry } from "./AuditTimeline";
import { ClipboardList } from "lucide-react";

// Mock data for demonstration
const mockAuditLogs: AuditLogEntry[] = [
  {
    id: "1",
    timestamp: new Date().toISOString(),
    userId: "user-1",
    userName: "Max Mustermann",
    action: "UPDATE",
    entityType: "Kunde",
    entityId: "cust-123",
    entityName: "Beispiel GmbH",
    changes: [
      {
        field: "Firmenname",
        oldValue: "Beispiel AG",
        newValue: "Beispiel GmbH",
      },
      {
        field: "E-Mail",
        oldValue: "alt@beispiel.de",
        newValue: "neu@beispiel.de",
      },
    ],
    reason: "Firmenumbenennung",
    immutable: true,
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    userId: "user-2",
    userName: "Erika Musterfrau",
    action: "CREATE",
    entityType: "Angebot",
    entityId: "offer-456",
    entityName: "Angebot #2024-001",
    changes: [],
    immutable: true,
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    userId: "user-1",
    userName: "Max Mustermann",
    action: "DELETE",
    entityType: "Kontakt",
    entityId: "contact-789",
    entityName: "John Doe",
    changes: [],
    reason: "Duplikat entfernt",
    immutable: true,
  },
];

interface AuditViewerPageProps {
  entityType?: string;
  entityId?: string;
}

export function AuditViewerPage({
  entityType: _entityType,
  entityId: _entityId,
}: AuditViewerPageProps) {
  // In real implementation, fetch from API
  const auditLogs = mockAuditLogs;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <ClipboardList className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Audit-Protokoll</h1>
          <p className="text-sm text-gray-500">
            Vollständige Änderungshistorie (GoBD-konform)
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-amber-600 text-xl">⚠️</span>
          <div>
            <h3 className="font-medium text-amber-800 dark:text-amber-200">
              GoBD-konformes Audit-Protokoll
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              Alle Einträge sind unveränderlich und erfüllen die Anforderungen
              der Grundsätze zur ordnungsmäßigen Führung und Aufbewahrung von
              Büchern.
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <AuditTimeline entries={auditLogs} />
    </div>
  );
}

export default AuditViewerPage;

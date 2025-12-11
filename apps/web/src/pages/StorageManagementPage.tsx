import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useTieredStorage } from "@/hooks/useTieredStorage";
import { useSyncStatus } from "@/hooks/useSyncStatus";
import { HardDrive, RefreshCw, Trash2, PinOff } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function StorageManagementPage() {
  const {
    tierQuotas,
    formatBytes,
    isLoading,
    refresh,
    pinnedIds,
    unpinDocument,
  } = useTieredStorage();

  const { storage, triggerSync, status } = useSyncStatus();

  return (
    <div className="container mx-auto py-6 max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Offline-Speicher</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            refresh();
            triggerSync();
          }}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${status === "active" ? "animate-spin" : ""}`}
          />
          Aktualisieren
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Speicherbelegung
            </CardTitle>
            <CardDescription>Gesamtspeicherplatz und Quota</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-100 animate-pulse rounded" />
                <div className="h-4 w-3/4 bg-gray-100 animate-pulse rounded" />
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Gesamtbelegung</span>
                    <span className="text-gray-500">
                      {storage ? formatBytes(storage.usage) : "0 B"} /{" "}
                      {storage ? formatBytes(storage.quota) : "0 B"}
                    </span>
                  </div>
                  <Progress
                    value={
                      storage?.usagePercent ? storage.usagePercent * 100 : 0
                    }
                  />
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  {tierQuotas.map((tier) => (
                    <div key={tier.tier} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">
                          {tier.tier === "onDemand"
                            ? "On-Demand (Pinned)"
                            : tier.tier}
                        </span>
                        <span className="text-gray-500">
                          {formatBytes(tier.used)} / {formatBytes(tier.limit)}
                        </span>
                      </div>
                      <Progress
                        value={tier.usagePercent * 100}
                        className={tier.usagePercent > 0.8 ? "bg-red-100" : ""}
                        indicatorClassName={
                          tier.usagePercent > 0.9
                            ? "bg-red-500"
                            : tier.usagePercent > 0.8
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                        }
                      />
                      <p className="text-xs text-gray-400">
                        {tier.tier === "essential" &&
                          "Benutzerdaten, Kunden, Termine (Wird niemals gelöscht)"}
                        {tier.tier === "recent" &&
                          "Protokolle der letzten 30 Tage (Auto-Löschung bei Voll)"}
                        {tier.tier === "onDemand" &&
                          "Manuell gepinnte Dokumente"}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gepinnte Inhalte</CardTitle>
            <CardDescription>
              Manuell für Offline-Nutzung markiert ({pinnedIds.length})
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pinnedIds.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                Keine Dokumente gepinned.
                <br />
                Nutzen Sie das{" "}
                <span className="inline-block px-1 bg-gray-100 rounded border">
                  📌
                </span>{" "}
                Icon um Inhalte verfügbar zu halten.
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {pinnedIds.map((id) => (
                  <div
                    key={id}
                    className="flex items-center justify-between p-2 rounded border bg-gray-50 dark:bg-gray-900/50"
                  >
                    <div className="truncate text-sm font-medium pr-2">
                      {/* Ideally we resolve the name, update useTieredStorage to fetch meta */}
                      Dokument {id.substring(0, 8)}...
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-gray-500 hover:text-red-500"
                      onClick={() => unpinDocument(id)}
                    >
                      <PinOff className="h-3 w-3" />
                    </Button>
                  </div>
                ))}

                <Button
                  variant="outline"
                  className="w-full mt-4 text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => {
                    pinnedIds.forEach((id) => unpinDocument(id));
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Alle lösen
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-200">
        <h3 className="font-semibold mb-1">Hinweis zur Synchronisierung</h3>
        <p>
          Wichtige Daten (Essential Tier) werden alle 15 Minuten synchronisiert.
          Verlauf (Recent Tier) wird stündlich aktualisiert. Nutzen Sie
          "Aktualisieren", um einen sofortigen Abgleich aller Daten zu
          erzwingen.
        </p>
      </div>
    </div>
  );
}

export default StorageManagementPage;

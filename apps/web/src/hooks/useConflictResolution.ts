import { useState, useCallback } from "react";

export interface ConflictData {
  id: string;
  entityType: string;
  entityId: string;
  entityName: string;
  localVersion: Record<string, unknown>;
  serverVersion: Record<string, unknown>;
  localTimestamp: string;
  serverTimestamp: string;
  localUser: string;
  serverUser: string;
  fields: string[];
}

export interface ConflictResolution {
  conflictId: string;
  resolvedData: Record<string, unknown>;
  strategy: "local" | "server" | "manual" | "newest";
}

type AutoResolveStrategy = "newest" | "local" | "server";

export function useConflictResolution() {
  const [conflicts, setConflicts] = useState<ConflictData[]>([]);
  const [resolving, setResolving] = useState(false);

  const addConflict = useCallback((conflict: ConflictData) => {
    setConflicts((prev) => {
      // Avoid duplicates
      if (prev.some((c) => c.id === conflict.id)) return prev;
      return [...prev, conflict];
    });
  }, []);

  const removeConflict = useCallback((conflictId: string) => {
    setConflicts((prev) => prev.filter((c) => c.id !== conflictId));
  }, []);

  const resolveConflict = useCallback(
    async (
      conflictId: string,
      resolution: ConflictResolution,
    ): Promise<boolean> => {
      setResolving(true);
      try {
        // In real implementation, this would sync to backend
        console.log("Resolving conflict:", conflictId, resolution);
        removeConflict(conflictId);
        return true;
      } catch (error) {
        console.error("Failed to resolve conflict:", error);
        return false;
      } finally {
        setResolving(false);
      }
    },
    [removeConflict],
  );

  const autoResolve = useCallback(
    (
      conflict: ConflictData,
      strategy: AutoResolveStrategy,
    ): Record<string, unknown> => {
      switch (strategy) {
        case "newest": {
          const localTime = new Date(conflict.localTimestamp).getTime();
          const serverTime = new Date(conflict.serverTimestamp).getTime();
          return localTime > serverTime
            ? conflict.localVersion
            : conflict.serverVersion;
        }
        case "local":
          return conflict.localVersion;
        case "server":
          return conflict.serverVersion;
        default:
          return conflict.serverVersion;
      }
    },
    [],
  );

  const getChangedFields = useCallback((conflict: ConflictData): string[] => {
    const changedFields: string[] = [];
    for (const field of conflict.fields) {
      const localVal = JSON.stringify(conflict.localVersion[field]);
      const serverVal = JSON.stringify(conflict.serverVersion[field]);
      if (localVal !== serverVal) {
        changedFields.push(field);
      }
    }
    return changedFields;
  }, []);

  return {
    conflicts,
    hasConflicts: conflicts.length > 0,
    conflictCount: conflicts.length,
    resolving,
    addConflict,
    removeConflict,
    resolveConflict,
    autoResolve,
    getChangedFields,
  };
}

export default useConflictResolution;

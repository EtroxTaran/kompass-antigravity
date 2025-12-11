import { useState, useEffect, useCallback } from "react";
import { dbService } from "@/lib/db";
import {
  TierQuota,
} from "@/lib/tiered-storage/types";

export function useTieredStorage() {
  const [tierQuotas, setTierQuotas] = useState<TierQuota[]>([]);
  // const [pinnedDocs, setPinnedDocs] = useState<PinnedDocument[]>([]); // TODO: Fetch details
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initial load
  useEffect(() => {
    loadData();
    // Load pinned IDs
    const ids = dbService.getPinnedDocIds();
    setPinnedIds(ids);
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const quotas = await dbService.getTierQuotas();
      setTierQuotas(quotas);
    } catch (err) {
      console.error("Error loading tiered storage data", err);
    } finally {
      setIsLoading(false);
    }
  };

  const pinDocument = useCallback(async (docId: string) => {
    await dbService.pinDocument(docId);
    setPinnedIds(dbService.getPinnedDocIds());
    // In a real app we might fetch the doc details to show in the UI list
  }, []);

  const unpinDocument = useCallback(async (docId: string) => {
    await dbService.unpinDocument(docId);
    setPinnedIds(dbService.getPinnedDocIds());
  }, []);

  const isPinned = useCallback((docId: string) => {
    return pinnedIds.includes(docId);
  }, [pinnedIds]);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return {
    tierQuotas,
    pinnedIds,
    isLoading,
    refresh: loadData,
    pinDocument,
    unpinDocument,
    isPinned,
    formatBytes
  };
}

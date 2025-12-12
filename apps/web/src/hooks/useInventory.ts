import { useState, useCallback } from "react";
import { apiClient } from "../services/apiClient";
import { InventoryMovement, CreateInventoryMovementDto } from "@kompass/shared";
import { useToast } from "../components/ui/use-toast";

export const useInventory = (materialId?: string) => {
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchHistory = useCallback(async () => {
    if (!materialId) return;
    setLoading(true);
    try {
      const data = await apiClient.inventory.getHistory(materialId);
      setMovements(data);
    } catch (_error) {
      toast({
        variant: "destructive",
        title: "Fehler beim Laden der Bestandsdaten",
        description: "Die Historie konnte nicht geladen werden.",
      });
    } finally {
      setLoading(false);
    }
  }, [materialId, toast]);

  const recordMovement = async (dto: CreateInventoryMovementDto) => {
    try {
      await apiClient.inventory.recordMovement(dto);
      toast({
        title: "Bestandsänderung gespeichert",
        description: "Der Lagerbestand wurde aktualisiert.",
      });
      fetchHistory(); // Refresh history
      return true;
    } catch (_error) {
      toast({
        variant: "destructive",
        title: "Fehler beim Speichern",
        description: "Die Bestandsänderung konnte nicht gespeichert werden.",
      });
      return false;
    }
  };

  return {
    movements,
    loading,
    fetchHistory,
    recordMovement,
  };
};

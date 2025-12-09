import { useState, useEffect, useCallback } from "react";
import { materialsApi } from "@/services/apiClient";
import { Material } from "@kompass/shared";

export function useMaterial(id?: string) {
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<Error | null>(null);

  const fetchMaterial = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const result = await materialsApi.get(id);
      setMaterial(result as unknown as Material);
      setError(null);
    } catch (err) {
      console.error("Error fetching material", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMaterial();
  }, [fetchMaterial]);

  const saveMaterial = async (data: Partial<Material>) => {
    setLoading(true);
    try {
      let result;
      if (id && material) {
        // Update
        result = await materialsApi.update(id, data);
      } else {
        // Create
        result = await materialsApi.create(data);
      }
      setMaterial(result as unknown as Material);
      return result;
    } catch (err) {
      console.error("Error saving material", err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { material, loading, error, saveMaterial, refetch: fetchMaterial };
}

export function useMaterials() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const result = await materialsApi.list();
        if (result && Array.isArray(result.data)) {
          setMaterials(result.data as unknown as Material[]);
        } else if (Array.isArray(result)) {
          setMaterials(result as unknown as Material[]);
        } else {
          setMaterials([]);
        }
      } catch (err) {
        console.error("Error fetching materials", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, []);

  return { materials, loading, error };
}

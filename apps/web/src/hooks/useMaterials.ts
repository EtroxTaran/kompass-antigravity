import { useState, useEffect } from "react";
import { dbService } from "@/lib/db";
import { Material } from "@kompass/shared";

export function useMaterials() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMaterials = async () => {
    const db = dbService.getDB();
    try {
      const result = await db.find({
        selector: { type: "material" },
      });
      setMaterials(result.docs as unknown as Material[]);
    } catch (err) {
      console.error("Error fetching materials", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
    const db = dbService.getDB();
    const changes = db
      .changes({
        since: "now",
        live: true,
        include_docs: true,
        filter: (doc) => doc.type === "material",
      })
      .on("change", () => {
        fetchMaterials();
      });

    return () => {
      changes.cancel();
    };
  }, []);

  const addMaterial = async (material: Omit<Material, "_id" | "_rev">) => {
    const db = dbService.getDB();
    const newDoc = {
      ...material,
      _id: `material-${crypto.randomUUID()}`,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      version: 1,
    };
    await db.put(newDoc);
  };

  return { materials, loading, addMaterial };
}

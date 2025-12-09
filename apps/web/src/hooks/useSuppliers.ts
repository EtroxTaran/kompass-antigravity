import { useState, useEffect } from "react";
import { dbService } from "@/lib/db";
import { Supplier } from "@kompass/shared";

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSuppliers = async () => {
    const db = dbService.getDB();
    try {
      const result = await db.find({
        selector: { type: "supplier" },
      });
      setSuppliers(result.docs as unknown as Supplier[]);
    } catch (err) {
      console.error("Error fetching suppliers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
    const db = dbService.getDB();
    const changes = db
      .changes({
        since: "now",
        live: true,
        include_docs: true,
        filter: (doc) => doc.type === "supplier",
      })
      .on("change", () => {
        fetchSuppliers();
      });

    return () => {
      changes.cancel();
    };
  }, []);

  const addSupplier = async (supplier: Omit<Supplier, "_id" | "_rev">) => {
    const db = dbService.getDB();
    const newDoc = {
      ...supplier,
      _id: `supplier-${crypto.randomUUID()}`,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      version: 1,
    };
    await db.put(newDoc);
  };

  return { suppliers, loading, addSupplier };
}

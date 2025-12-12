import { useState, useEffect, useCallback } from "react";
import { Protocol } from "@kompass/shared";
import { dbService } from "@/lib/db";
import { authApi } from "@/services/apiClient";

export function useProtocol(id?: string) {
  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<Error | null>(null);

  const fetchProtocol = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const db = dbService.getDB();
      const doc = await db.get(id);
      setProtocol(doc as unknown as Protocol);
      setError(null);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as any;
      if (error.status !== 404) {
        console.error("Error fetching protocol", err);
        setError(error as Error);
      } else {
        // Not found is fine for new creation if ID was passed but not synced yet
        // But usually if ID is passed we expect it to exist
        setError(new Error("Protocol not found"));
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProtocol();

    // Subscribe to changes if we have an ID
    if (id) {
      const db = dbService.getDB();
      const changes = db
        .changes({
          since: "now",
          live: true,
          include_docs: true,
          doc_ids: [id],
        })
        .on("change", (change) => {
          if (change.doc) {
            setProtocol(change.doc as unknown as Protocol);
          } else if (change.deleted) {
            setProtocol(null);
          }
        });

      return () => {
        changes.cancel();
      };
    }
  }, [id, fetchProtocol]);

  const saveProtocol = async (data: Partial<Protocol>) => {
    setLoading(true);
    try {
      const db = dbService.getDB();
      const user = await authApi.getMe(); // Get current user for metadata

      if (id && protocol) {
        // Update existing
        const updatedDoc = {
          ...protocol,
          ...data,
          modifiedAt: new Date().toISOString(),
          modifiedBy: user._id,
        };
        const result = await db.put(updatedDoc);
        setProtocol({ ...updatedDoc, _rev: result.rev } as Protocol);
        return result;
      } else {
        // Create new
        const newId = `protocol-${crypto.randomUUID()}`;
        const newDoc = {
          ...data,
          _id: newId,
          type: "protocol",
          createdAt: new Date().toISOString(),
          modifiedAt: new Date().toISOString(),
          createdBy: user._id,
          modifiedBy: user._id,
          version: 1,
        };
        const result = await db.put(newDoc);
        // If we created a new one, we might want to return it or set it
        // But usually the consumer negotiates navigation.
        return { ...result, id: newId };
      }
    } catch (err) {
      console.error("Failed to save protocol", err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { protocol, loading, error, saveProtocol, refetch: fetchProtocol };
}

export function useProtocols(params?: {
  customerId?: string;
  projectId?: string;
}) {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [loading, setLoading] = useState(true);

  // Memoize primitives for dependency array
  const customerId = params?.customerId;
  const projectId = params?.projectId;

  const fetchProtocols = useCallback(async () => {
    setLoading(true);
    const db = dbService.getDB();
    try {
      // Build basic selector
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const selector: any = {
        type: "protocol",
      };

      if (customerId) {
        selector.customerId = customerId;
      }
      if (projectId) {
        selector.projectId = projectId;
      }

      const result = await db.find({
        selector,
        sort: [{ modifiedAt: "desc" }], // Ensure index exists for this, or sort in memory
      });

      if (result.warning) {
        console.warn("PouchDB find warning:", result.warning);
      }

      setProtocols(result.docs as unknown as Protocol[]);
    } catch (err) {
      console.warn("Index missing or find failed, falling back to memory filter", err);
      try {
        const result = await db.find({ selector: { type: "protocol" } });
        let filtered = result.docs as unknown as Protocol[];
        if (customerId) {
          filtered = filtered.filter(p => p.customerId === customerId);
        }
        if (projectId) {
          filtered = filtered.filter(p => p.projectId === projectId);
        }
        filtered.sort((a, b) => new Date(b.date || b.modifiedAt).getTime() - new Date(a.date || a.modifiedAt).getTime());
        setProtocols(filtered);
      } catch (e) {
        console.error("Fatal error fetching protocols", e);
      }
    } finally {
      setLoading(false);
    }
  }, [customerId, projectId]);

  useEffect(() => {
    fetchProtocols();

    // Subscribe to ANY protocol changes to keep list fresh
    const db = dbService.getDB();
    const changes = db.changes({
      since: 'now',
      live: true,
      include_docs: true,
      filter: (doc) => doc.type === 'protocol'
    }).on('change', () => {
      fetchProtocols();
    });

    return () => changes.cancel();
  }, [fetchProtocols]);

  return { protocols, loading, refetch: fetchProtocols };
}

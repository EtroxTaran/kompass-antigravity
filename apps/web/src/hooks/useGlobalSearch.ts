import { useState, useEffect } from "react";
import { dbService } from "@/lib/db";
import {
  Customer,
  Project,
  Opportunity,
  Supplier,
  Material,
  Invoice,
  Location,
} from "@kompass/shared";

export interface SearchResult {
  id: string;
  type:
    | "customer"
    | "project"
    | "opportunity"
    | "supplier"
    | "material"
    | "invoice"
    | "warehouse"
    | "location"
    | "unknown";
  title: string;
  subtitle?: string;
  url: string;
}

export function useGlobalSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const db = dbService.getDB();
      try {
        // Fetch all documents (filtered by our known types)
        const { docs } = await db.find({
          selector: {
            type: {
              $in: [
                "customer",
                "project",
                "opportunity",
                "supplier",
                "material",
                "invoice",
                "location",
              ],
            },
          },
          limit: 1000, // Cap for now
        });

        const searchItems: SearchResult[] = (docs as any[])
          .map((doc): SearchResult | null => {
            switch (doc.type) {
              case "customer": {
                const c = doc as Customer;
                return {
                  id: c._id,
                  type: "customer",
                  title: c.companyName,
                  subtitle: `${c.billingAddress?.city || ""}`,
                  url: `/customers/${c._id}`,
                };
              }
              case "project": {
                const p = doc as Project;
                return {
                  id: p._id,
                  type: "project",
                  title: p.name,
                  subtitle: `PrNr: ${p.projectNumber}`,
                  url: `/projects/${p._id}`,
                };
              }
              case "opportunity": {
                const o = doc as Opportunity;
                return {
                  id: o._id,
                  type: "opportunity",
                  title: o.title,
                  subtitle: `${o.stage} | Est: ${o.expectedValue}€`,
                  url: `/opportunities/${o._id}`,
                };
              }
              case "supplier": {
                const s = doc as Supplier;
                return {
                  id: s._id,
                  type: "supplier",
                  title: s.companyName,
                  subtitle: `${s.billingAddress?.city || ""}`,
                  url: `/suppliers/${s._id}`,
                };
              }
              case "material": {
                const m = doc as Material;
                return {
                  id: m._id,
                  type: "material",
                  title: m.name,
                  subtitle: `ArtNr: ${m.itemNumber}`,
                  url: `/materials/${m._id}`,
                };
              }
              case "invoice": {
                const i = doc as Invoice;
                return {
                  id: i._id,
                  type: "invoice",
                  title: `Rechnung ${i.invoiceNumber}`,
                  subtitle: `${i.date} | ${i.totalGross.toFixed(2)}€`,
                  url: `/invoices/${i._id}`,
                };
              }
              case "location": {
                const l = doc as Location;
                const isWarehouse =
                  l.isInternal || l.locationType === "warehouse";
                return {
                  id: l._id,
                  type: isWarehouse ? "warehouse" : "location",
                  title: l.locationName,
                  subtitle: l.deliveryAddress?.city,
                  url: isWarehouse
                    ? `/warehouses/${l._id}/edit`
                    : `/locations/${l._id}/edit`,
                };
              }
              default:
                return null;
            }
          })
          .filter((item): item is SearchResult => item !== null);

        setResults(searchItems);
      } catch (err) {
        console.error("Search index failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { results, loading };
}

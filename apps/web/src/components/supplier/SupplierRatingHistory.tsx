import { SupplierRatingHistoryItem } from "@kompass/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarRating } from "@/components/ui/StarRating";
import { format } from "date-fns";
import { de } from "date-fns/locale";

interface SupplierRatingHistoryProps {
  history?: SupplierRatingHistoryItem[];
}

export function SupplierRatingHistory({ history }: SupplierRatingHistoryProps) {
  if (!history || history.length === 0) {
    return null;
  }

  // Sort by date desc
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.ratedAt).getTime() - new Date(a.ratedAt).getTime(),
  );

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Bewertungshistorie</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedHistory.map((item, index) => (
            <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-medium">
                    {item.projectId
                      ? `Projekt: ${item.projectId}`
                      : "Allgemeine Bewertung"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    am{" "}
                    {format(new Date(item.ratedAt), "dd. MMMM yyyy", {
                      locale: de,
                    })}{" "}
                    von {item.ratedBy || "Unbekannt"}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-sm">
                    {(
                      (item.ratings.quality +
                        item.ratings.reliability +
                        item.ratings.communication +
                        item.ratings.priceValue) /
                      4
                    ).toFixed(1)}
                  </span>
                  <StarRating
                    rating={
                      (item.ratings.quality +
                        item.ratings.reliability +
                        item.ratings.communication +
                        item.ratings.priceValue) /
                      4
                    }
                    readOnly
                    size="sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-muted-foreground mb-2">
                <div>Qualität: {item.ratings.quality}</div>
                <div>Zuverlässigkeit: {item.ratings.reliability}</div>
                <div>Komm.: {item.ratings.communication}</div>
                <div>Preis: {item.ratings.priceValue}</div>
              </div>

              {item.feedback && (
                <div className="text-sm bg-muted/30 p-2 rounded italic">
                  "{item.feedback}"
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

import { useNavigate } from "react-router-dom";
import { useOffers } from "@/hooks/useOffers";
import { Button } from "@/components/ui/button";
import { Plus, FileText, ArrowRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface OfferListProps {
  customerId?: string;
  projectId?: string;
}

export function OfferList({ customerId, projectId }: OfferListProps) {
  const navigate = useNavigate();
  const { offers, loading } = useOffers({ customerId, projectId });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      case "sent":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "viewed":
        return "bg-indigo-100 text-indigo-800 hover:bg-indigo-100";
      case "accepted":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "expired":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "superseded":
        return "bg-gray-200 text-gray-600 hover:bg-gray-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Offers</h2>
          <p className="text-muted-foreground">
            Manage your sales offers and quotes.
          </p>
        </div>
        <Button onClick={() => navigate("/sales/offers/new")} className="gap-2">
          <Plus className="h-4 w-4" />
          New Offer
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Number</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Values</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading offers...
                </TableCell>
              </TableRow>
            ) : offers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No offers found. Create your first offer.
                </TableCell>
              </TableRow>
            ) : (
              offers.map((offer) => (
                <TableRow key={offer._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      {offer.offerNumber || "DRAFT"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {/* Ideally fetch customer name or it should be populated */}
                    {offer.customerId}
                  </TableCell>
                  <TableCell>
                    {format(new Date(offer.offerDate), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("de-DE", {
                      style: "currency",
                      currency: offer.currency || "EUR",
                    }).format(offer.totalNet || 0)}{" "}
                    Net
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`capitalize border-none ${getStatusColor(offer.status)}`}
                      variant="outline"
                    >
                      {offer.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/sales/offers/${offer._id}`)}
                    >
                      View
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

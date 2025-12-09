import { useNavigate } from "react-router-dom";
import { useTours } from "@/hooks/useTour";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Truck, MapPin } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Tour } from "@kompass/shared";

export function TourList() {
  const navigate = useNavigate();
  const { tours, loading } = useTours();

  if (loading) return <div>Lade Touren...</div>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Tourenplanung</CardTitle>
        <div className="flex gap-2">
          <Button onClick={() => navigate("/tours/new")}>
            <Plus className="mr-2 h-4 w-4" /> Neue Tour
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Tour Name</TableHead>
                <TableHead>Depot - Ziel</TableHead>
                <TableHead className="text-right">Stopps</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tours.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center h-24 text-muted-foreground"
                  >
                    Keine Touren geplant.
                  </TableCell>
                </TableRow>
              ) : (
                tours.map((tour: Tour) => (
                  <TableRow
                    key={tour._id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/tours/${tour._id}`)}
                  >
                    <TableCell>{formatDate(tour.date)}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Truck className="mr-2 h-4 w-4 text-muted-foreground" />
                        {tour.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <MapPin className="mr-1 h-3 w-3" /> {tour.startLocation}
                        <span className="mx-2">→</span>
                        {tour.endLocation}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {tour.stops?.length || 0}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(tour.status)}
                      >
                        {tour.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

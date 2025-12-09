import { useNavigate } from "react-router-dom";
import { useMileages } from "@/hooks/useMileage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Car } from "lucide-react";
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

export function MileageList() {
  const navigate = useNavigate();
  const { mileages, loading } = useMileages();

  if (loading) return <div>Lade Fahrtenbuch...</div>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "submitted":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Fahrtenbuch</CardTitle>
        <div className="flex gap-2">
          <Button onClick={() => navigate("/mileage/new")}>
            <Plus className="mr-2 h-4 w-4" /> Eintrag
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Zweck</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>Ziel</TableHead>
                <TableHead className="text-right">Distanz</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mileages.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center h-24 text-muted-foreground"
                  >
                    Keine Einträge gefunden.
                  </TableCell>
                </TableRow>
              ) : (
                mileages.map((entry) => (
                  <TableRow
                    key={entry._id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/mileage/${entry._id}/edit`)}
                  >
                    <TableCell>{formatDate(entry.date)}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Car className="mr-2 h-4 w-4 text-muted-foreground" />
                        {entry.purpose}
                      </div>
                    </TableCell>
                    <TableCell>{entry.startLocation}</TableCell>
                    <TableCell>{entry.endLocation}</TableCell>
                    <TableCell className="text-right">
                      {entry.distanceKm} km
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(entry.status)}
                      >
                        {entry.status}
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

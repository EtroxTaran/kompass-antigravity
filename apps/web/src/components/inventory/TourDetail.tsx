import { useParams, useNavigate } from "react-router-dom";
import { useTour } from "@/hooks/useTour";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Map, Truck, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TourDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tour, loading } = useTour(id);

  if (loading) return <div>Loading...</div>;
  if (!tour) return <div>Tour not found</div>;

  const statusColors: Record<string, string> = {
    planned: "bg-blue-100 text-blue-800 border-blue-200",
    in_progress: "bg-yellow-100 text-yellow-800 border-yellow-200",
    completed: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/logistics/tours")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{tour.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <span className="text-sm font-mono">
                {format(new Date(tour.date), "dd.MM.yyyy")}
              </span>
              <Badge
                className={statusColors[tour.status] || ""}
                variant="outline"
              >
                {tour.status?.replace("_", " ")}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => alert("Route printing planned for Phase 7")}
          >
            <Map className="mr-2 h-4 w-4" />
            Print Route
          </Button>
          <Button onClick={() => navigate(`/logistics/tours/${id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <span className="font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" /> Driver
                </span>
                <span className="text-muted-foreground">{tour.driverId}</span>
              </div>
              <div>
                <span className="font-semibold flex items-center gap-2">
                  <Truck className="h-4 w-4" /> Vehicle
                </span>
                <span className="text-muted-foreground">
                  {tour.vehicleId || "Not assigned"}
                </span>
              </div>
              <div className="pt-2 border-t">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="block text-xs text-muted-foreground">
                      Distance
                    </span>
                    <span className="font-mono">
                      {tour.totalDistanceKm || 0} km
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-muted-foreground">
                      Duration
                    </span>
                    <span className="font-mono">
                      {tour.totalDurationMinutes || 0} min
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Tabs defaultValue="route" className="space-y-4">
            <TabsList>
              <TabsTrigger value="route">Route & Stops</TabsTrigger>
            </TabsList>

            <TabsContent value="route">
              <Card>
                <CardHeader>
                  <CardTitle>Stops</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative border-l-2 border-gray-200 ml-4 space-y-8 py-4">
                    {/* Start */}
                    <div className="relative pl-6">
                      <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-green-500 bg-white"></div>
                      <div className="text-sm font-medium">
                        Start: {tour.startLocation}
                      </div>
                    </div>

                    {/* Stops */}
                    {tour.stops.map((stop, index) => (
                      <div key={index} className="relative pl-6">
                        <div
                          className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 bg-white ${stop.completed ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
                        ></div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{stop.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {stop.activityType}
                            </Badge>
                            {stop.completed && (
                              <Badge
                                variant="default"
                                className="text-[10px] h-4 bg-green-500"
                              >
                                Done
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {stop.address || "Location Linked"}
                          </div>
                          <div className="text-xs font-mono text-muted-foreground">
                            {stop.arrivalTime || "--:--"} -{" "}
                            {stop.departureTime || "--:--"}
                          </div>
                          {stop.notes && (
                            <div className="text-xs bg-muted p-2 rounded mt-1">
                              Note: {stop.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* End */}
                    <div className="relative pl-6">
                      <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-red-500 bg-white"></div>
                      <div className="text-sm font-medium">
                        End: {tour.endLocation}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

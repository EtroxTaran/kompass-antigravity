import { useState, useMemo, useCallback } from "react";
import {
  MapPin,
  Navigation,
  Clock,
  Trash2,
  ChevronUp,
  ChevronDown,
  Route,
  CheckCircle,
  Loader2,
} from "lucide-react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import { useRoutePlanner, RouteStop } from "@/hooks/useRoutePlanner";
import { cn } from "@/lib/utils";

// Mock customers for demo
const mockCustomers: RouteStop[] = [
  {
    id: "1",
    name: "Beispiel GmbH",
    address: "Musterstraße 1, 80331 München",
    lat: 48.1372,
    lng: 11.5755,
    status: "pending",
  },
  {
    id: "2",
    name: "Demo AG",
    address: "Testweg 5, 80333 München",
    lat: 48.145,
    lng: 11.56,
    status: "pending",
  },
  {
    id: "3",
    name: "Test KG",
    address: "Beispielplatz 10, 80335 München",
    lat: 48.139,
    lng: 11.55,
    status: "overdue",
  },
];

export function RoutePlannerPage() {
  const {
    stops,
    routeInfo,
    addStop,
    removeStop,
    reorderStops,
    updateStopStatus,
    calculateRoute,
    clearRoute,
    openExternalNavigation,
  } = useRoutePlanner();

  const [showAddPanel, setShowAddPanel] = useState(false);

  // Load Google Maps
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY || "",
  });

  // Map config
  const mapCenter = useMemo(() => {
    if (stops.length > 0) {
      return { lat: stops[0].lat, lng: stops[0].lng };
    }
    return { lat: 48.1351, lng: 11.582 }; // Munich default
  }, [stops]);

  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: false,
      clickableIcons: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
    }),
    [],
  );

  const onMapLoad = useCallback(() => {
    console.log("Map loaded");
  }, []);

  const getMarkerColor = (status: RouteStop["status"]) => {
    switch (status) {
      case "visited":
        return "green";
      case "overdue":
        return "red";
      default:
        return "blue";
    }
  };

  const getStatusColor = (status: RouteStop["status"]) => {
    switch (status) {
      case "visited":
        return "bg-green-500";
      case "overdue":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  const formatDuration = (minutes: number): string => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? `${hrs}h ${mins}min` : `${mins} min`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Route className="w-5 h-5 text-primary" />
              Tourenplanung
            </h1>
            <p className="text-sm text-gray-500">
              {stops.length} Stopp{stops.length !== 1 ? "s" : ""} geplant
            </p>
          </div>
          {stops.length > 0 && (
            <button
              onClick={clearRoute}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Route löschen
            </button>
          )}
        </div>
      </div>

      {/* Map View */}
      <div className="flex-1 relative bg-gray-200 dark:bg-gray-800">
        {loadError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-6">
              <MapPin className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <p className="text-red-500 mb-2">
                Karte konnte nicht geladen werden
              </p>
              <p className="text-xs text-gray-400">
                Bitte überprüfen Sie den API-Key.
              </p>
            </div>
          </div>
        )}

        {!isLoaded && !loadError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Karte wird geladen...</p>
            </div>
          </div>
        )}

        {isLoaded && !loadError && (
          <GoogleMap
            mapContainerClassName="w-full h-full"
            center={mapCenter}
            zoom={12}
            options={mapOptions}
            onLoad={onMapLoad}
          >
            {/* Customer Markers */}
            {stops.map((stop, index) => (
              <Marker
                key={stop.id}
                position={{ lat: stop.lat, lng: stop.lng }}
                label={{
                  text: String(index + 1),
                  color: "white",
                  fontWeight: "bold",
                }}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 12,
                  fillColor: getMarkerColor(stop.status),
                  fillOpacity: 1,
                  strokeWeight: 2,
                  strokeColor: "white",
                }}
              />
            ))}

            {/* Route Polyline */}
            {stops.length > 1 && (
              <Polyline
                path={stops.map((s) => ({ lat: s.lat, lng: s.lng }))}
                options={{
                  strokeColor: "#3B82F6",
                  strokeOpacity: 0.8,
                  strokeWeight: 4,
                }}
              />
            )}
          </GoogleMap>
        )}

        {/* Route Info Overlay */}
        {routeInfo && (
          <div className="absolute top-4 left-4 right-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-3 z-10">
            <div className="flex items-center justify-around text-sm">
              <div className="flex items-center gap-2">
                <Route className="w-4 h-4 text-primary" />
                <span className="font-medium">
                  {routeInfo.totalDistance} km
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="font-medium">
                  {formatDuration(routeInfo.totalDuration)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-medium">{stops.length} Stopps</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Route Stops Panel */}
      <div className="bg-white dark:bg-gray-900 border-t max-h-[40vh] overflow-y-auto">
        {stops.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500 mb-4">Keine Stopps geplant</p>
            <button
              onClick={() => setShowAddPanel(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm"
            >
              Stopp hinzufügen
            </button>
          </div>
        ) : (
          <div className="divide-y">
            {stops.map((stop, index) => (
              <div key={stop.id} className="flex items-center gap-3 p-3">
                {/* Order number */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold",
                    getStatusColor(stop.status),
                  )}
                >
                  {index + 1}
                </div>

                {/* Stop info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{stop.name}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {stop.address}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {stop.status !== "visited" && (
                    <button
                      onClick={() => updateStopStatus(stop.id, "visited")}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                      title="Als besucht markieren"
                    >
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </button>
                  )}
                  <button
                    onClick={() => openExternalNavigation(stop)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                    title="Navigation starten"
                  >
                    <Navigation className="w-4 h-4 text-primary" />
                  </button>
                  <div className="flex flex-col">
                    <button
                      onClick={() =>
                        index > 0 && reorderStops(index, index - 1)
                      }
                      disabled={index === 0}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-30"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() =>
                        index < stops.length - 1 &&
                        reorderStops(index, index + 1)
                      }
                      disabled={index === stops.length - 1}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-30"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeStop(stop.id)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      {stops.length > 0 && (
        <div className="p-4 border-t bg-white dark:bg-gray-900 flex gap-3">
          <button
            onClick={() => setShowAddPanel(true)}
            className="flex-1 px-4 py-2 border rounded-lg text-sm flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            Stopp hinzufügen
          </button>
          <button
            onClick={calculateRoute}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm flex items-center justify-center gap-2"
          >
            <Navigation className="w-4 h-4" />
            Route berechnen
          </button>
        </div>
      )}

      {/* Add Stop Panel */}
      {showAddPanel && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowAddPanel(false)}
          />
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-t-xl p-4 max-h-[60vh] overflow-y-auto">
            <h3 className="font-semibold mb-4">Kunden als Stopp hinzufügen</h3>
            <div className="space-y-2">
              {mockCustomers.map((customer) => (
                <button
                  key={customer.id}
                  onClick={() => {
                    addStop(customer);
                    setShowAddPanel(false);
                  }}
                  disabled={stops.some((s) => s.id === customer.id)}
                  className="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-left"
                >
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full",
                      getStatusColor(customer.status),
                    )}
                  />
                  <div>
                    <p className="font-medium text-sm">{customer.name}</p>
                    <p className="text-xs text-gray-500">{customer.address}</p>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAddPanel(false)}
              className="w-full mt-4 px-4 py-2 border rounded-lg text-sm"
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoutePlannerPage;

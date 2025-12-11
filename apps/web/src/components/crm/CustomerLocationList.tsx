import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocations } from "@/hooks/useLocation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Plus,
    MapPin,
    Building2,
    Warehouse,
    HardHat,
    Pencil,
    MoreVertical,
    Trash2,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Location } from "@kompass/shared";
import { LocationFormDialog } from "./LocationFormDialog";

interface CustomerLocationListProps {
    customerId: string;
}

// Location type configuration for visual styling
const locationTypeConfig: Record<
    string,
    { label: string; color: string; bgColor: string; icon: typeof Building2 }
> = {
    headquarter: {
        label: "Hauptsitz",
        color: "text-purple-700",
        bgColor: "bg-purple-100",
        icon: Building2,
    },
    branch: {
        label: "Filiale",
        color: "text-blue-700",
        bgColor: "bg-blue-100",
        icon: Building2,
    },
    warehouse: {
        label: "Lager",
        color: "text-amber-700",
        bgColor: "bg-amber-100",
        icon: Warehouse,
    },
    project_site: {
        label: "Projektstandort",
        color: "text-green-700",
        bgColor: "bg-green-100",
        icon: HardHat,
    },
    other: {
        label: "Sonstige",
        color: "text-gray-700",
        bgColor: "bg-gray-100",
        icon: MapPin,
    },
};

export function CustomerLocationList({ customerId }: CustomerLocationListProps) {
    const navigate = useNavigate();
    const { locations, loading, refresh } = useLocations(customerId);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingLocation, setEditingLocation] = useState<Location | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [locationToDelete, setLocationToDelete] = useState<Location | null>(null);

    // Filter locations by customerId (though API handles it now, keeping for safety if reusing global hook)
    const customerLocations = locations;

    const handleAddLocation = () => {
        setEditingLocation(null);
        setIsFormOpen(true);
    };

    const handleEditLocation = (location: Location) => {
        setEditingLocation(location);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (location: Location) => {
        setLocationToDelete(location);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!locationToDelete) return;
        try {
            const { locationsApi } = await import("@/services/apiClient");
            await locationsApi.delete(locationToDelete._id);
            await refresh(); // Refresh list
        } catch (error) {
            console.error("Failed to delete location", error);
        } finally {
            setDeleteDialogOpen(false);
            setLocationToDelete(null);
        }
    };

    const getTypeConfig = (type: string) => {
        return locationTypeConfig[type] || locationTypeConfig.other;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* ... Header ... */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold">Standorte</h3>
                        <Badge variant="secondary">{customerLocations.length}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Lieferadressen und Standorte verwalten
                    </p>
                </div>
                <Button onClick={handleAddLocation}>
                    <Plus className="h-4 w-4 mr-2" />
                    Standort hinzufügen
                </Button>
            </div>

            {/* Location Cards */}
            {customerLocations.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <MapPin className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Noch keine Standorte</h3>
                        <p className="text-muted-foreground text-center mb-4">
                            Fügen Sie Standorte hinzu, um verschiedene Lieferadressen zu verwalten
                        </p>
                        <Button onClick={handleAddLocation}>
                            <Plus className="h-4 w-4 mr-2" />
                            Ersten Standort hinzufügen
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {customerLocations.map((location) => {
                        const typeConfig = getTypeConfig(location.locationType || "other");
                        const TypeIcon = typeConfig.icon;

                        return (
                            <Card
                                key={location._id}
                                className="hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer"
                                onClick={() => navigate(`/locations/${location._id}/edit`)}
                            >
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        {/* Header */}
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="font-bold">{location.locationName}</span>
                                                </div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <Badge className={`${typeConfig.bgColor} ${typeConfig.color} gap-1`}>
                                                        <TypeIcon className="h-3 w-3" />
                                                        {typeConfig.label}
                                                    </Badge>
                                                    <Badge variant={location.isActive ? "default" : "secondary"}>
                                                        {location.isActive ? "Aktiv" : "Inaktiv"}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {/* Actions Dropdown */}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditLocation(location);
                                                        }}
                                                    >
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Bearbeiten
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteClick(location);
                                                        }}
                                                        className="text-destructive"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Löschen
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        {/* Address */}
                                        <div className="flex items-start gap-3">
                                            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                                            <div className="text-sm text-muted-foreground">
                                                <p>
                                                    {location.deliveryAddress?.street}{" "}
                                                    {location.deliveryAddress?.streetNumber}
                                                </p>
                                                <p>
                                                    {location.deliveryAddress?.zipCode}{" "}
                                                    {location.deliveryAddress?.city}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Location Form Dialog */}
            <LocationFormDialog
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                location={editingLocation}
                customerId={customerId}
                onSuccess={refresh}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Standort löschen</DialogTitle>
                        <DialogDescription>
                            Möchten Sie den Standort &quot;{locationToDelete?.locationName}&quot; wirklich
                            löschen? Diese Aktion kann nicht rückgängig gemacht werden.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Abbrechen
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                        >
                            Löschen
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

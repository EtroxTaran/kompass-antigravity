/**
 * LocationCard Component
 * 
 * Displays a single location in card format
 * Uses shadcn/ui components: Card, Badge, Button
 */

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import type { Location } from '@kompass/shared/types/entities/location';
import { LocationType } from '@kompass/shared/types/enums';
import { formatAddress } from '@kompass/shared/types/common/address';

interface LocationCardProps {
  location: Location;
  onEdit?: (location: Location) => void;
  onDelete?: (location: Location) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

/**
 * Get German label for location type
 */
function getLocationTypeLabel(type: LocationType): string {
  switch (type) {
    case LocationType.HEADQUARTER:
      return 'Hauptsitz';
    case LocationType.BRANCH:
      return 'Filiale';
    case LocationType.WAREHOUSE:
      return 'Lager';
    case LocationType.PROJECT_SITE:
      return 'Projektstandort';
    case LocationType.OTHER:
      return 'Sonstige';
    default:
      return type;
  }
}

/**
 * LocationCard Component
 */
export function LocationCard({
  location,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = false,
}: LocationCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {location.locationName}
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="secondary">{getLocationTypeLabel(location.locationType)}</Badge>
              {location.isActive ? (
                <Badge variant="default" className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Aktiv
                </Badge>
              ) : (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <XCircle className="h-3 w-3" />
                  Inaktiv
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Delivery Address */}
        <div>
          <h4 className="text-sm font-medium mb-1">Lieferadresse</h4>
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {formatAddress(location.deliveryAddress)}
          </p>
        </div>

        {/* Delivery Notes */}
        {location.deliveryNotes && (
          <div>
            <h4 className="text-sm font-medium mb-1">Lieferhinweise</h4>
            <p className="text-sm text-muted-foreground">{location.deliveryNotes}</p>
          </div>
        )}

        {/* Opening Hours */}
        {location.openingHours && (
          <div>
            <h4 className="text-sm font-medium mb-1">Öffnungszeiten</h4>
            <p className="text-sm text-muted-foreground">{location.openingHours}</p>
          </div>
        )}

        {/* Parking Instructions */}
        {location.parkingInstructions && (
          <div>
            <h4 className="text-sm font-medium mb-1">Parkhinweise</h4>
            <p className="text-sm text-muted-foreground">{location.parkingInstructions}</p>
          </div>
        )}

        {/* Contact Persons Count */}
        {location.contactPersons.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-1">Kontaktpersonen</h4>
            <p className="text-sm text-muted-foreground">
              {location.contactPersons.length} zugeordnet
            </p>
          </div>
        )}
      </CardContent>

      {/* Actions */}
      {(canEdit || canDelete) && (
        <CardFooter className="flex justify-end gap-2">
          {canEdit && onEdit && (
            <Button variant="outline" size="sm" onClick={() => onEdit(location)}>
              <Edit className="h-4 w-4 mr-2" />
              Bearbeiten
            </Button>
          )}
          {canDelete && onDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(location)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Löschen
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}


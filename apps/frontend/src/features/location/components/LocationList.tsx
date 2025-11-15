/**
 * LocationList Component
 *
 * Displays list of locations with filtering
 * Uses shadcn/ui components: Select, Button, Skeleton
 */

import { Plus } from 'lucide-react';
import { useState } from 'react';

import type { Location } from '@kompass/shared/types/entities/location';
import { LocationType } from '@kompass/shared/types/enums';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

import { LocationCard } from './LocationCard';

interface LocationListProps {
  locations: Location[];
  isLoading?: boolean;
  onEdit?: (location: Location) => void;
  onDelete?: (location: Location) => void;
  onCreate?: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
  canCreate?: boolean;
}

/**
 * LocationList Component
 */
export function LocationList({
  locations,
  isLoading = false,
  onEdit,
  onDelete,
  onCreate,
  canEdit = true,
  canDelete = false,
  canCreate = true,
}: LocationListProps) {
  const [filterType, setFilterType] = useState<LocationType | 'all'>('all');
  const [filterActive, setFilterActive] = useState<
    'all' | 'active' | 'inactive'
  >('all');

  // Apply filters
  const filteredLocations = locations.filter((location) => {
    if (filterType !== 'all' && location.locationType !== filterType) {
      return false;
    }
    if (filterActive === 'active' && !location.isActive) {
      return false;
    }
    if (filterActive === 'inactive' && location.isActive) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2">
          {/* Location Type Filter */}
          <Select
            value={filterType}
            onValueChange={(value) =>
              setFilterType(value as LocationType | 'all')
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Standorttyp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Typen</SelectItem>
              <SelectItem value={LocationType.HEADQUARTER}>
                Hauptsitz
              </SelectItem>
              <SelectItem value={LocationType.BRANCH}>Filiale</SelectItem>
              <SelectItem value={LocationType.WAREHOUSE}>Lager</SelectItem>
              <SelectItem value={LocationType.PROJECT_SITE}>
                Projektstandort
              </SelectItem>
              <SelectItem value={LocationType.OTHER}>Sonstige</SelectItem>
            </SelectContent>
          </Select>

          {/* Active Status Filter */}
          <Select
            value={filterActive}
            onValueChange={(value) =>
              setFilterActive(value as 'all' | 'active' | 'inactive')
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Status</SelectItem>
              <SelectItem value="active">Aktiv</SelectItem>
              <SelectItem value="inactive">Inaktiv</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Create Button */}
        {canCreate && onCreate && (
          <Button onClick={onCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Neuer Standort
          </Button>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      )}

      {/* Location Cards */}
      {!isLoading && filteredLocations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLocations.map((location) => (
            <LocationCard
              key={location._id}
              location={location}
              onEdit={onEdit}
              onDelete={onDelete}
              canEdit={canEdit}
              canDelete={canDelete}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredLocations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {locations.length === 0
              ? 'Noch keine Standorte vorhanden'
              : 'Keine Standorte gefunden, die den Filterkriterien entsprechen'}
          </p>
          {canCreate && onCreate && locations.length === 0 && (
            <Button onClick={onCreate} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Ersten Standort erstellen
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

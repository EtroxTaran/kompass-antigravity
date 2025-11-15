/**
 * LocationForm Component
 *
 * Form for creating/editing Location
 * Uses shadcn/ui components: Form, Input, Select, Textarea, Checkbox
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import type { Location } from '@kompass/shared/types/entities/location';
import { LocationType } from '@kompass/shared/types/enums';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

/**
 * Form validation schema
 */
const locationFormSchema = z.object({
  locationName: z
    .string()
    .min(2, 'Standortname muss mindestens 2 Zeichen lang sein')
    .max(100, 'Standortname darf maximal 100 Zeichen lang sein')
    .regex(
      /^[a-zA-ZäöüÄÖÜß0-9\s\.\-&()]+$/,
      'Nur Buchstaben, Zahlen und Standardzeichen erlaubt'
    ),
  locationType: z.nativeEnum(LocationType),
  isActive: z.boolean(),
  deliveryAddress: z.object({
    street: z.string().min(2, 'Straße erforderlich').max(100),
    streetNumber: z.string().max(10).optional(),
    addressLine2: z.string().max(100).optional(),
    zipCode: z.string().regex(/^\d{5}$/, 'PLZ muss 5-stellig sein'),
    city: z.string().min(2).max(100),
    state: z.string().max(50).optional(),
    country: z.string().min(2).max(100).default('Deutschland'),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
  }),
  deliveryNotes: z.string().max(500).optional(),
  openingHours: z.string().max(200).optional(),
  parkingInstructions: z.string().max(300).optional(),
});

type LocationFormValues = z.infer<typeof locationFormSchema>;

interface LocationFormProps {
  location?: Location;
  onSubmit: (values: LocationFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

/**
 * LocationForm Component
 */
export function LocationForm({
  location,
  onSubmit,
  onCancel,
  isLoading = false,
}: LocationFormProps) {
  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: location
      ? {
          locationName: location.locationName,
          locationType: location.locationType,
          isActive: location.isActive,
          deliveryAddress: location.deliveryAddress,
          deliveryNotes: location.deliveryNotes || '',
          openingHours: location.openingHours || '',
          parkingInstructions: location.parkingInstructions || '',
        }
      : {
          locationName: '',
          locationType: LocationType.BRANCH,
          isActive: true,
          deliveryAddress: {
            street: '',
            zipCode: '',
            city: '',
            country: 'Deutschland',
          },
        },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Location Name */}
        <FormField
          control={form.control}
          name="locationName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Standortname *</FormLabel>
              <FormControl>
                <Input placeholder="z.B. Filiale München Süd" {...field} />
              </FormControl>
              <FormDescription>
                Eindeutiger Name für diesen Standort
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location Type */}
        <FormField
          control={form.control}
          name="locationType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Standorttyp *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Standorttyp wählen" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
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
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Active Status */}
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Aktiv</FormLabel>
                <FormDescription>
                  Standort ist derzeit in Betrieb
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {/* Delivery Address Section */}
        <div className="space-y-4 rounded-md border p-4">
          <h3 className="text-lg font-medium">Lieferadresse</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="deliveryAddress.street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Straße *</FormLabel>
                  <FormControl>
                    <Input placeholder="Lindwurmstraße" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deliveryAddress.streetNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hausnummer</FormLabel>
                  <FormControl>
                    <Input placeholder="85" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="deliveryAddress.addressLine2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresszusatz</FormLabel>
                <FormControl>
                  <Input placeholder="Hintereingang, 2. Stock" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="deliveryAddress.zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PLZ *</FormLabel>
                  <FormControl>
                    <Input placeholder="80337" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deliveryAddress.city"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Stadt *</FormLabel>
                  <FormControl>
                    <Input placeholder="München" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="deliveryAddress.country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Land</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Operational Details */}
        <FormField
          control={form.control}
          name="deliveryNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lieferhinweise</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Hintereingang nutzen, Parkplatz vorhanden"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Spezielle Anweisungen für Lieferungen
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="openingHours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Öffnungszeiten</FormLabel>
              <FormControl>
                <Input
                  placeholder="Mo-Fr 8:00-18:00, Sa 9:00-14:00"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="parkingInstructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parkhinweise</FormLabel>
              <FormControl>
                <Input placeholder="Parkplätze vor dem Gebäude" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Abbrechen
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? 'Wird gespeichert...'
              : location
                ? 'Aktualisieren'
                : 'Erstellen'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "@/hooks/useLocation";
import { Location } from "@kompass/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LocationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  location: Location | null;
  customerId: string;
}

export function LocationFormDialog({
  open,
  onOpenChange,
  location,
  customerId,
}: LocationFormDialogProps) {
  const { saveLocation, loading } = useLocation(location?._id);

  const { register, handleSubmit, setValue, reset, watch } = useForm<Location>({
    defaultValues: {
      isActive: true,
      isInternal: false,
      locationType: "branch",
      customerId: customerId,
      deliveryAddress: {
        street: "",
        streetNumber: "",
        zipCode: "",
        city: "",
        country: "Germany",
      },
    },
  });

  useEffect(() => {
    if (location) {
      reset(location);
    } else {
      reset({
        isActive: true,
        isInternal: false,
        locationType: "branch",
        customerId: customerId,
        deliveryAddress: {
          street: "",
          streetNumber: "",
          zipCode: "",
          city: "",
          country: "Germany",
        },
      });
    }
  }, [location, customerId, reset]);

  const onSubmit = async (data: Location) => {
    data.customerId = customerId;
    await saveLocation(data);
    onOpenChange(false);
    // Reload page to refresh locations list
    window.location.reload();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {location ? "Standort bearbeiten" : "Neuen Standort hinzufügen"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              {...register("locationName")}
              required
              placeholder="z.B. Hauptlager München"
            />
          </div>

          <div className="space-y-2">
            <Label>Typ</Label>
            <Select
              onValueChange={(val) =>
                setValue("locationType", val as Location["locationType"])
              }
              defaultValue={watch("locationType")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="headquarter">Hauptsitz</SelectItem>
                <SelectItem value="branch">Filiale</SelectItem>
                <SelectItem value="warehouse">Lager</SelectItem>
                <SelectItem value="project_site">Projektstandort</SelectItem>
                <SelectItem value="other">Sonstige</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
              <Label>Straße</Label>
              <Input {...register("deliveryAddress.street")} />
            </div>
            <div className="space-y-2">
              <Label>Nr.</Label>
              <Input {...register("deliveryAddress.streetNumber")} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>PLZ</Label>
              <Input {...register("deliveryAddress.zipCode")} />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Stadt</Label>
              <Input {...register("deliveryAddress.city")} />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Abbrechen
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Speichern..." : "Speichern"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

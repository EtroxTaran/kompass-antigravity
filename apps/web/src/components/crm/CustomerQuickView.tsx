import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Customer } from "@kompass/shared";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CustomerQuickViewProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomerQuickView({
  customer,
  open,
  onOpenChange,
}: CustomerQuickViewProps) {
  const navigate = useNavigate();

  if (!customer) return null;

  const address = customer.billingAddress;
  const addressString = address
    ? `${address.street}, ${address.zipCode} ${address.city}`
    : "";
  const mapLink = addressString
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressString)}`
    : "#";

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-2xl font-bold">
                {customer.companyName}
              </DrawerTitle>
            </div>
            <DrawerDescription>
              {customer.industry || "Keine Branche"}
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 flex justify-between gap-4">
            <Button
              variant="outline"
              className="flex-1 flex flex-col items-center gap-2 h-auto py-4"
              asChild
              disabled={!customer.phone}
            >
              <a href={`tel:${customer.phone}`}>
                <Phone className="h-6 w-6 mb-1" />
                <span className="text-xs">Anrufen</span>
              </a>
            </Button>
            <Button
              variant="outline"
              className="flex-1 flex flex-col items-center gap-2 h-auto py-4"
              asChild
              disabled={!customer.email}
            >
              <a href={`mailto:${customer.email}`}>
                <Mail className="h-6 w-6 mb-1" />
                <span className="text-xs">E-Mail</span>
              </a>
            </Button>
            <Button
              variant="outline"
              className="flex-1 flex flex-col items-center gap-2 h-auto py-4"
              asChild
              disabled={!addressString}
            >
              <a href={mapLink} target="_blank" rel="noopener noreferrer">
                <MapPin className="h-6 w-6 mb-1" />
                <span className="text-xs">Karte</span>
              </a>
            </Button>
          </div>

          <div className="px-4 pb-4 space-y-4">
            {address && (
              <div className="text-sm bg-muted/30 p-3 rounded-md">
                <h4 className="font-semibold mb-1 flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Adresse
                </h4>
                <p>{address.street}</p>
                <p>
                  {address.zipCode} {address.city}
                </p>
                <p>{address.country}</p>
              </div>
            )}

            <Button
              className="w-full"
              onClick={() => {
                navigate(`/customers/${customer._id}`);
                onOpenChange(false);
              }}
            >
              Details anzeigen <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

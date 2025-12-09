import { useParams, useNavigate } from "react-router-dom";
import { useLocation } from "@/hooks/useLocation";
import { useContacts } from "@/hooks/useContacts";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Phone, Mail, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function LocationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { location, loading: locationLoading } = useLocation(id);
  const { contacts } = useContacts(location?.customerId);

  if (locationLoading) return <div>Loading...</div>;
  if (!location) return <div>Location not found</div>;

  // Filter contacts assigned to this location
  const assignedContacts = contacts.filter(
    (c) =>
      location.contactPersons?.includes(c._id) ||
      c.assignedLocationIds?.includes(location._id),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {location.locationName}
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Badge variant="outline">{location.locationType}</Badge>
            {location.isActive ? (
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                Active
              </Badge>
            ) : (
              <Badge variant="secondary">Inactive</Badge>
            )}
          </div>
        </div>
        <div className="ml-auto">
          <Button onClick={() => navigate(`/locations/${id}/edit`)}>
            Edit Location
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Address & Delivery
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">Address</h3>
              <div className="text-sm text-gray-600">
                <p>
                  {location.deliveryAddress.street}{" "}
                  {location.deliveryAddress.streetNumber}
                </p>
                <p>
                  {location.deliveryAddress.zipCode}{" "}
                  {location.deliveryAddress.city}
                </p>
                <p>{location.deliveryAddress.country}</p>
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-1">Delivery Instructions</h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {location.deliveryNotes || "No specific instructions."}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Parking</h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {location.parkingInstructions || "No parking info."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Operations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">Opening Hours</h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {location.openingHours || "Not specified."}
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-1">Type</h3>
              <p className="text-sm capitalize text-gray-600">
                {location.locationType.replace("_", " ")}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Internal Status</h3>
              <p className="text-sm text-gray-600">
                {location.isInternal
                  ? "Internal Company Location"
                  : "External Customer Location"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contacts at this Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            {assignedContacts.length === 0 ? (
              <p className="text-sm text-gray-500">
                No contacts assigned to this location.
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {assignedContacts.map((contact) => (
                  <div
                    key={contact._id}
                    className="border rounded-lg p-4 flex flex-col gap-2"
                  >
                    <div className="font-semibold">
                      {contact.firstName} {contact.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {contact.position}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3 w-3" />
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {contact.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3 w-3" />
                      <a
                        href={`tel:${contact.mobile || contact.phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {contact.mobile || contact.phone}
                      </a>
                    </div>
                    <div className="mt-2 text-xs text-gray-400 capitalize">
                      {contact.decisionMakingRole?.replace("_", " ")}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 w-full"
                      onClick={() => navigate(`/contacts/${contact._id}`)}
                    >
                      View Contact
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

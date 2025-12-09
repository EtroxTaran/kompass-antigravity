import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  useNavigate,
  useParams,
  useLocation as useRouteLocation,
} from "react-router-dom";
import { useLocation } from "@/hooks/useLocation";
import { Location } from "@kompass/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";
import { useCustomers } from "@/hooks/useCustomer";

export function LocationForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const routeLocation = useRouteLocation();
  const isWarehouseMode = routeLocation.pathname.includes("warehouses");

  const { location, loading, saveLocation } = useLocation(id);
  const { customers } = useCustomers();

  const { register, handleSubmit, setValue, reset, watch } = useForm<Location>({
    defaultValues: {
      isActive: true,
      isInternal: isWarehouseMode,
      locationType: isWarehouseMode ? "warehouse" : "branch",
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
    }
  }, [location, reset]);

  const onSubmit = async (data: Location) => {
    await saveLocation(data);
    navigate(isWarehouseMode ? "/warehouses" : "/locations");
  };

  if (id && loading) return <div>Loading...</div>;

  const isInternal = watch("isInternal");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            navigate(isWarehouseMode ? "/warehouses" : "/locations")
          }
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          {id
            ? "Edit Location"
            : isWarehouseMode
              ? "New Warehouse"
              : "New Location"}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>General Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input {...register("locationName")} required />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  onValueChange={(val) => setValue("locationType", val as any)}
                  defaultValue={watch("locationType")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="headquarter">Headquarter</SelectItem>
                    <SelectItem value="branch">Branch</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                    <SelectItem value="project_site">Project Site</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isInternal"
                checked={watch("isInternal")}
                onCheckedChange={(c) => setValue("isInternal", c === true)}
              />
              <Label htmlFor="isInternal">
                Internal Location (Company owned)
              </Label>
            </div>

            {!isInternal && (
              <div className="space-y-2">
                <Label>Customer Owner</Label>
                <Select
                  onValueChange={(val) => setValue("customerId", val)}
                  defaultValue={location?.customerId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.companyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label>Street</Label>
                <Input {...register("deliveryAddress.street")} />
              </div>
              <div className="space-y-2">
                <Label>Number</Label>
                <Input {...register("deliveryAddress.streetNumber")} />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Zip Code</Label>
                <Input {...register("deliveryAddress.zipCode")} />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label>City</Label>
                <Input {...register("deliveryAddress.city")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes / Opening Hours</Label>
              <Input
                {...register("openingHours")}
                placeholder="e.g. Mon-Fri 8-16"
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit">Save Location</Button>
      </form>
    </div>
  );
}

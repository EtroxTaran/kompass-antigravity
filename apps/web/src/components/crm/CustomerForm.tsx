import { useForm, useWatch } from "react-hook-form";
import { Customer, ContactPerson } from "@kompass/shared";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useDuplicateCheck } from "@/hooks/useDuplicateCheck";

// Extended form data for wizard flow
export interface CustomerFormData extends Omit<Customer, "_id" | "_rev" | "type"> {
  createHeadquarters?: boolean;
  headquartersLocation?: {
    locationName: string;
    deliveryNotes?: string;
    openingHours?: string;
  };
  createPrimaryContact?: boolean;
  primaryContact?: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    position?: string;
    decisionMakingRole: ContactPerson["decisionMakingRole"];
    authorityLevel: ContactPerson["authorityLevel"];
  };
}

interface CustomerFormProps {
  defaultValues?: Partial<Customer>;
  onSubmit: (data: CustomerFormData) => void;
  isLoading?: boolean;
  /** Hide wizard sections when editing existing customer */
  isEditMode?: boolean;
}

export function CustomerForm({
  defaultValues,
  onSubmit,
  isLoading,
  isEditMode = false,
}: CustomerFormProps) {
  const [headquartersOpen, setHeadquartersOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const form = useForm<CustomerFormData>({
    defaultValues: {
      customerType: "retail",
      rating: "B",
      billingAddress: {
        country: "Deutschland",
      },
      createHeadquarters: false,
      headquartersLocation: {
        locationName: "Hauptsitz",
      },
      createPrimaryContact: false,
      primaryContact: {
        firstName: "",
        lastName: "",
        decisionMakingRole: "operational_contact" as any,
        authorityLevel: "medium",
      },
      ...defaultValues,
    },
  });

  const createHeadquarters = useWatch({ control: form.control, name: "createHeadquarters" });
  const createPrimaryContact = useWatch({ control: form.control, name: "createPrimaryContact" });

  // Auto-expand sections when checkbox is checked
  // Using controlled state derived from form values to avoid cascading renders
  const effectiveHeadquartersOpen = headquartersOpen || (createHeadquarters ?? false);
  const effectiveContactOpen = contactOpen || (createPrimaryContact ?? false);

  const { duplicates, checkDuplicates } = useDuplicateCheck();
  const companyName = useWatch({ control: form.control, name: "companyName" });
  const email = useWatch({ control: form.control, name: "email" });
  const phone = useWatch({ control: form.control, name: "phone" });

  useEffect(() => {
    const timer = setTimeout(() => {
      checkDuplicates({
        name: companyName,
        email: email,
        phone: phone,
        excludeId: defaultValues?._id,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [companyName, email, phone, checkDuplicates, defaultValues?._id]);

  const handleSubmit = (data: CustomerFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit as any)} className="space-y-8">
        {duplicates.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Possible duplicate(s) found:
                  {duplicates.map((d) => (
                    <span key={d.id} className="block font-medium">
                      {d.companyName} ({d.matchReason})
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control as any}
              name="companyName"
              rules={{ required: "Company name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Corp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="customerType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="direct_marketer">
                        Direct Marketer
                      </SelectItem>
                      <SelectItem value="franchise">Franchise</SelectItem>
                      <SelectItem value="cooperative">Cooperative</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="contact@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+49 123 45678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="vatNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>VAT Number</FormLabel>
                  <FormControl>
                    <Input placeholder="DE123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales Settings & Compliance</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control as any}
              name="visitFrequencyDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visit Frequency (Days)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="30"
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value ? Number(e.target.value) : undefined)
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Recommended days between visits via ADM
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="lastVisit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Visit</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-1 md:col-span-2 space-y-4">
              <h4 className="text-sm font-medium">DSGVO Consent</h4>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control as any}
                  name="dsgvoConsent.marketing"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Marketing Allowed
                        </FormLabel>
                        <FormDescription>
                          Customer agrees to receive marketing materials.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as any}
                  name="dsgvoConsent.aiProcessing"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          AI Processing Allowed
                        </FormLabel>
                        <FormDescription>
                          Customer data may be processed by AI systems for optimization.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as any}
                  name="dsgvoConsent.dataSharing"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Data Sharing Allowed
                        </FormLabel>
                        <FormDescription>
                          Customer agrees to data sharing with partners.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Billing Address</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control as any}
              name="billingAddress.street"
              rules={{ required: "Street is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street</FormLabel>
                  <FormControl>
                    <Input placeholder="Main St." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control as any}
              name="billingAddress.streetNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number</FormLabel>
                  <FormControl>
                    <Input placeholder="12A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control as any}
              name="billingAddress.zipCode"
              rules={{ required: "Zip Code is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input placeholder="12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control as any}
              name="billingAddress.city"
              rules={{ required: "City is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Berlin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control as any}
              name="billingAddress.country"
              rules={{ required: "Country is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="Deutschland" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Wizard Sections - Only show when creating new customer */}
        {!isEditMode && (
          <>
            {/* Headquarters Location Section */}
            <Collapsible open={effectiveHeadquartersOpen} onOpenChange={setHeadquartersOpen}>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FormField
                        control={form.control as any}
                        name="createHeadquarters"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-medium cursor-pointer">
                              Create Headquarters Location
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <ChevronDown className={cn("h-4 w-4 transition-transform", effectiveHeadquartersOpen && "rotate-180")} />
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Uses billing address as the headquarters delivery address
                  </p>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-0">
                    <FormField
                      control={form.control as any}
                      name="headquartersLocation.locationName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Hauptsitz" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="headquartersLocation.openingHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Opening Hours</FormLabel>
                          <FormControl>
                            <Input placeholder="Mo-Fr 8:00-17:00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="headquartersLocation.deliveryNotes"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Delivery Notes</FormLabel>
                          <FormControl>
                            <Input placeholder="Delivery instructions, parking info, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Primary Contact Section */}
            <Collapsible open={effectiveContactOpen} onOpenChange={setContactOpen}>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FormField
                        control={form.control as any}
                        name="createPrimaryContact"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-medium cursor-pointer">
                              Add Primary Contact
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <ChevronDown className={cn("h-4 w-4 transition-transform", effectiveContactOpen && "rotate-180")} />
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Add the main contact person for this customer
                  </p>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-0">
                    <FormField
                      control={form.control as any}
                      name="primaryContact.firstName"
                      rules={createPrimaryContact ? { required: "First name is required" } : undefined}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Max" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="primaryContact.lastName"
                      rules={createPrimaryContact ? { required: "Last name is required" } : undefined}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Mustermann" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="primaryContact.email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="max@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="primaryContact.phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="+49 123 45678" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="primaryContact.position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position</FormLabel>
                          <FormControl>
                            <Input placeholder="Einkaufsleiter" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="primaryContact.decisionMakingRole"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Decision Making Role</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="decision_maker">Decision Maker</SelectItem>
                              <SelectItem value="key_influencer">Key Influencer</SelectItem>
                              <SelectItem value="recommender">Recommender</SelectItem>
                              <SelectItem value="gatekeeper">Gatekeeper</SelectItem>
                              <SelectItem value="operational_contact">Operational Contact</SelectItem>
                              <SelectItem value="informational">Informational</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </>
        )}

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Customer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
